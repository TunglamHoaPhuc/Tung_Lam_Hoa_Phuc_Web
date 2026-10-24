import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { PostRecord } from '../route';
import { loadServerlessJson, loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';
import { HOANG_PHAP_ARTICLES } from '@/data/dong-chay-hoang-phap-data';
import { parseGutenbergPostContent } from '@/lib/wp-post-parser';
import { recordDeletedPost, getDeletedPostsAsync, isPostDeletedAsync } from '@/lib/deleted-posts';
import { deleteWpPost, updateWpPostFields, formatWpDate } from '@/lib/wp-admin-client';
import { decodeHtmlEntities } from '@/lib/html-entities';
import { requireAdminAuth } from '@/lib/auth-guard';
import { enqueueSyncTask } from '@/lib/sync-queue';

const DB_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as PostRecord[],
};

async function getPosts(): Promise<PostRecord[]> {
  const [posts, deletedList] = await Promise.all([
    loadServerlessJsonAsync<PostRecord[]>(DB_CONFIG),
    getDeletedPostsAsync(),
  ]);
  const deletedSet = new Set(deletedList.map((d) => d.id));
  const deletedWpIds = new Set(deletedList.filter((d) => d.wpPostId).map((d) => String(d.wpPostId)));
  const deletedSlugs = new Set(deletedList.filter((d) => d.slug).map((d) => d.slug));

  return posts.filter(
    (p) => !deletedSet.has(p.id) && !deletedWpIds.has(String(p.wpPostId)) && !deletedSlugs.has(p.slug)
  );
}

async function savePosts(posts: PostRecord[]) {
  await saveServerlessJson<PostRecord[]>(DB_CONFIG, posts);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  if (await isPostDeletedAsync(id, id, decodedId)) {
    return NextResponse.json({ success: false, error: 'Bài viết không tồn tại hoặc đã bị xóa' }, { status: 404 });
  }

  let posts = await getPosts();
  let postIndex = posts.findIndex((p) => p.id === id || p.slug === id || String(p.wpPostId) === id);
  let post: any = postIndex !== -1 ? posts[postIndex] : null;

  // 🪷 ĐỒNG BỘ TỪ WORDPRESS:
  // Chỉ kiểm tra khi có cờ ?syncWp=true để tốc độ xem bài viết đạt < 10ms tức thì
  const isManualSync = new URL(req.url).searchParams.get('syncWp') === 'true';
  if (post && post.wpPostId && isManualSync) {
    try {
      const wpRes = await fetch(`https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts/${post.wpPostId}?_embed=true`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
      });
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        const wpDate = wpData.date ? wpData.date.split('T')[0] : (wpData.date_gmt ? wpData.date_gmt.split('T')[0] : '');
        const cleanTitle = decodeHtmlEntities(wpData.title?.rendered || '').trim();

        const rawWpAuthor = wpData._embedded?.author?.[0]?.name;
        const wpAuthor = (rawWpAuthor && rawWpAuthor !== 'admin_tunglam' && rawWpAuthor !== 'admin')
          ? rawWpAuthor
          : (post.author || 'Ban Văn Hóa Tùng Lâm');

        const parsed = parseGutenbergPostContent(wpData.content?.rendered || '', cleanTitle || post.title);

        // 🛡️ CHỈ CHO PHÉP WORDPRESS GHI ĐÈ NẾU BẬT ĐỒNG BỘ THỦ CÔNG (syncWp=true) VÀ WP ĐƯỢC SỬA MỚI HƠN
        const isManualSync = new URL(req.url).searchParams.get('syncWp') === 'true';
        const isWpModifiedNewer = Boolean(wpData.modified && post.wpModified && wpData.modified !== post.wpModified);
        const allowWpOverride = isManualSync && (isWpModifiedNewer || !post.wpModified);

        const dateChanged = Boolean(wpDate && post.publishedDate !== wpDate && allowWpOverride);
        const titleChanged = Boolean(cleanTitle && post.title !== cleanTitle && allowWpOverride);
        const contentChanged = Boolean(parsed.cleanedContent && post.content !== parsed.cleanedContent && allowWpOverride);
        const modifiedChanged = Boolean(wpData.modified && post.wpModified !== wpData.modified);
        const galleryChanged = Boolean((!post.photoGallery || post.photoGallery.length === 0) && parsed.photoGallery.length > 0);

        if (dateChanged || titleChanged || contentChanged || modifiedChanged || galleryChanged) {
          if (dateChanged) post.publishedDate = wpDate || post.publishedDate;
          if (titleChanged && cleanTitle) post.title = cleanTitle;
          if (allowWpOverride) post.author = wpAuthor;
          if (contentChanged && parsed.cleanedContent) post.content = parsed.cleanedContent;
          if (allowWpOverride && wpData.content?.rendered) post.contentHtml = wpData.content.rendered;
          if (parsed.photoGallery.length > 0) post.photoGallery = parsed.photoGallery;
          post.wpModified = wpData.modified;

          posts[postIndex] = post;
          await savePosts(posts);

          try {
            revalidatePath('/', 'page');
            revalidatePath('/dong-chay-hoang-phap', 'page');
            if (post.slug) revalidatePath(`/dong-chay-hoang-phap/${post.slug}`, 'page');
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Could not check real-time post update from WP:', e);
    }
  }

  // Nếu chưa có bài viết trong cơ sở dữ liệu, thử tìm trực tiếp trên WordPress
  if (!post) {
    try {
      const isNum = /^\d+$/.test(id);
      const url = isNum
        ? `https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts/${id}?_embed=true`
        : `https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(id)}&_embed=true`;

      const wpRes = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
      });
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        const wpItem = Array.isArray(wpData) ? wpData[0] : wpData;
        if (wpItem && wpItem.id) {
          const parsed = parseGutenbergPostContent(wpItem.content?.rendered || '', wpItem.title?.rendered || '');
          const featuredUrl =
            wpItem._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            parsed.featuredImageUrl ||
            'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

          const rawWpAuthor = wpItem._embedded?.author?.[0]?.name;
          const wpAuthor = (rawWpAuthor && rawWpAuthor !== 'admin_tunglam' && rawWpAuthor !== 'admin')
            ? rawWpAuthor
            : 'Ban Văn Hóa Tùng Lâm';

          post = {
            id: `post-${wpItem.id}`,
            wpPostId: wpItem.id,
            slug: wpItem.slug || `bai-viet-${wpItem.id}`,
            title: decodeHtmlEntities(wpItem.title?.rendered || '').trim(),
            subtitle: 'Tùng Lâm Hòa Phúc',
            mainCategory: 'dong-chay-hoang-phap',
            subCategory: 'cong-tu',
            categoryName: 'Cộng Tu Định Kỳ',
            author: wpAuthor,
            publishedDate: wpItem.date ? wpItem.date.split('T')[0] : new Date().toISOString().split('T')[0],
            status: 'published',
            viewsCount: 108,
            thumbnailUrl: featuredUrl,
            bannerUrl: featuredUrl,
            summary: decodeHtmlEntities((wpItem.excerpt?.rendered || '').replace(/<[^>]+>/g, '')).trim() || 'Tóm tắt bài viết...',
            content: parsed.cleanedContent || '',
            contentHtml: wpItem.content?.rendered || '',
            keywords: [],
            photoGallery: parsed.photoGallery,
            wpModified: wpItem.modified,
          };

          posts.unshift(post);
          await savePosts(posts);
        }
      }
    } catch (e) {
      console.warn('Could not auto-fetch single post from WP:', e);
    }
  }

  if (!post) {
    const hp = HOANG_PHAP_ARTICLES.find((a) => a.id === id || a.slug === id);
    if (hp && !(await isPostDeletedAsync(hp.id, undefined, hp.slug))) {
      post = {
        id: hp.id,
        slug: hp.slug,
        title: hp.title,
        subtitle: hp.subtitle,
        mainCategory: 'dong-chay-hoang-phap',
        subCategory: hp.category,
        categoryName: hp.subCategory,
        author: hp.author,
        publishedDate: hp.date,
        status: 'published',
        viewsCount: hp.views || 0,
        thumbnailUrl: hp.thumbnailUrl,
        bannerUrl: hp.bannerUrl,
        summary: hp.summary,
        content: hp.contentHtml,
        contentHtml: hp.contentHtml,
        keywords: [],
        photoGallery: [],
      };
    }
  }

  if (!post) {
    return NextResponse.json(
      { success: false, error: 'Không tìm thấy bài viết' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 🛡️ Bắt buộc xác thực quyền quản trị viên
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const body = await req.json();
    const rawPosts = await loadServerlessJsonAsync<PostRecord[]>(DB_CONFIG);
    const index = rawPosts.findIndex(
      (p) => p.id === id || p.id === decodedId || p.slug === id || p.slug === decodedId || String(p.wpPostId) === id
    );

    let targetIndex = index;
    const oldDate = index !== -1 ? rawPosts[index].publishedDate : undefined;
    const oldTitle = index !== -1 ? rawPosts[index].title : undefined;

    if (targetIndex === -1) {
      const newPost: PostRecord = {
        ...body,
        id: id || `post-${Date.now()}`,
      };
      rawPosts.unshift(newPost);
      targetIndex = 0;
    } else {
      const orig = rawPosts[targetIndex];
      let safeContent = body.content;
      if (orig && orig.content && orig.content.trim() !== '') {
        if (!safeContent || safeContent.trim() === '') {
          safeContent = orig.content;
        } else if (
          safeContent.trim().length <= 300 &&
          orig.content.trim().length > 300 &&
          orig.content.trim().startsWith(safeContent.trim().slice(0, 50))
        ) {
          safeContent = orig.content;
        }
      }
      rawPosts[targetIndex] = {
        ...rawPosts[targetIndex],
        ...body,
        content: safeContent ?? rawPosts[targetIndex].content,
        id: rawPosts[targetIndex].id, // Prevent ID override
      };
    }

    await savePosts(rawPosts);

    // ⚡ TỰ ĐỘNG ĐỒNG BỘ NGÀY ĐĂNG & TIÊU ĐỀ SANG WORDPRESS (CHỜ HOÀN TẤT)
    const targetWpPostId = rawPosts[targetIndex].wpPostId;
    if (targetWpPostId) {
      const wpPayload: Record<string, any> = {};
      if (body.publishedDate && oldDate !== body.publishedDate) {
        wpPayload.date = formatWpDate(body.publishedDate);
      }
      if (body.title && oldTitle !== body.title) {
        wpPayload.title = body.title;
      }
      if (Object.keys(wpPayload).length > 0) {
        try {
          wpPayload.status = 'publish';
          const wpRes = await updateWpPostFields(targetWpPostId, wpPayload, 'posts');
          if (wpRes.success) {
            console.log(`✅ [sync-wp-fields] Đã đồng bộ lên WP #${targetWpPostId}:`, Object.keys(wpPayload));
            if (wpRes.data?.modified) {
              rawPosts[targetIndex].wpModified = wpRes.data.modified;
              await savePosts(rawPosts);
            }
          } else {
            console.warn(`⚠️ [sync-wp-fields] Lỗi đồng bộ lên WP #${targetWpPostId}:`, wpRes.error);
            enqueueSyncTask('update_wp_post', String(targetWpPostId), wpPayload, wpRes.error);
          }
        } catch (e: any) {
          console.warn('[auto-sync-wp-fields error]', e);
          enqueueSyncTask('update_wp_post', String(targetWpPostId), wpPayload, e.message);
        }
      }
    }

    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/dong-chay-hoang-phap', 'page');
      if (rawPosts[targetIndex].slug) {
        revalidatePath(`/dong-chay-hoang-phap/${rawPosts[targetIndex].slug}`, 'page');
        revalidatePath(`/tri-tue-phat-phap/${rawPosts[targetIndex].slug}`, 'page');
      }
      revalidatePath('/tri-tue-phat-phap', 'page');
      revalidatePath('/tong-chi-tu-hoc', 'page');
    } catch (e) {
      console.warn('[revalidatePath error]', e);
    }

    return NextResponse.json({
      success: true,
      post: rawPosts[targetIndex],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const PATCH = PUT;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 🛡️ Bắt buộc xác thực quyền quản trị viên
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const rawPosts = await loadServerlessJsonAsync<PostRecord[]>(DB_CONFIG);
    const targetIdx = rawPosts.findIndex(
      (p) => p.id === id || p.id === decodedId || p.slug === id || p.slug === decodedId || String(p.wpPostId) === id
    );

    if (targetIdx === -1) {
      // Dù không thấy trong database, vẫn ghi vào blacklist để chống hồi sinh
      await recordDeletedPost(id, id, decodedId);
      return NextResponse.json({
        success: true,
        message: 'Đã xóa bài viết khỏi hệ thống',
      });
    }

    const deletedPost = rawPosts[targetIdx];
    rawPosts.splice(targetIdx, 1);

    // Chạy song song lưu posts và lưu blacklist bài viết đã xóa để giảm 50% thời gian phản hồi máy chủ
    await Promise.all([
      savePosts(rawPosts),
      recordDeletedPost(deletedPost.id, deletedPost.wpPostId, deletedPost.slug),
    ]);

    try {
      revalidatePath('/', 'page');
      revalidatePath('/dong-chay-hoang-phap', 'page');
      revalidatePath('/tri-tue-phat-phap', 'page');
      revalidatePath('/tong-chi-tu-hoc', 'page');
    } catch (e) {
      console.warn('[revalidatePath error]', e);
    }

    let wpDeletedSuccess = true;
    let wpErrorMsg: string | undefined;

    // Thử xóa bài viết trên WordPress nếu có wpPostId
    if (deletedPost.wpPostId) {
      const numWpId = typeof deletedPost.wpPostId === 'number' ? deletedPost.wpPostId : parseInt(String(deletedPost.wpPostId), 10);
      if (!isNaN(numWpId) && numWpId > 0) {
        const delRes = await deleteWpPost(numWpId);
        if (!delRes.success) {
          wpDeletedSuccess = false;
          wpErrorMsg = delRes.error;
          enqueueSyncTask('delete_wp_post', String(numWpId), null, delRes.error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      wpSynced: wpDeletedSuccess,
      message: wpDeletedSuccess
        ? `Đã xóa bài viết "${deletedPost.title}" thành công!`
        : `Đã xóa bài viết trên Next.js (WP đang chờ thử lại: ${wpErrorMsg})`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
