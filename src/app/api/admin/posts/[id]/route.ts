import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { PostRecord } from '../route';
import { loadServerlessJson, loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';
import { HOANG_PHAP_ARTICLES } from '@/data/dong-chay-hoang-phap-data';
import { parseGutenbergPostContent } from '@/lib/wp-post-parser';
import { recordDeletedPost, getDeletedPostsAsync, isPostDeletedAsync } from '@/lib/deleted-posts';
import { deleteWpPost, updateWpPostFields, formatWpDate } from '@/lib/wp-admin-client';

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

  // 🪷 TỰ ĐỘNG ĐỒNG BỘ THỜI GIAN THỰC TỪ WORDPRESS:
  // Nếu bài viết liên kết với WordPress, kiểm tra xem ngày xuất bản (post_date),
  // tiêu đề, tác giả hoặc nội dung có bị thay đổi trong WordPress hay không.
  if (post && post.wpPostId) {
    try {
      const wpRes = await fetch(`https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts/${post.wpPostId}?_embed=true`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
      });
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        const wpDate = wpData.date ? wpData.date.split('T')[0] : (wpData.date_gmt ? wpData.date_gmt.split('T')[0] : '');
        const cleanTitle = (wpData.title?.rendered || '')
          .replace(/&#8211;/g, '–')
          .replace(/&#8217;/g, '’')
          .replace(/&amp;/g, '&')
          .replace(/&#8230;/g, '…')
          .trim();

        const rawWpAuthor = wpData._embedded?.author?.[0]?.name;
        const wpAuthor = (rawWpAuthor && rawWpAuthor !== 'admin_tunglam' && rawWpAuthor !== 'admin')
          ? rawWpAuthor
          : (post.author || 'Ban Văn Hóa Tùng Lâm');

        const parsed = parseGutenbergPostContent(wpData.content?.rendered || '', cleanTitle || post.title);

        const dateChanged = Boolean(wpDate && post.publishedDate !== wpDate);
        const titleChanged = Boolean(cleanTitle && post.title !== cleanTitle);
        const contentChanged = Boolean(parsed.cleanedContent && post.content !== parsed.cleanedContent);
        const modifiedChanged = Boolean(wpData.modified && post.wpModified !== wpData.modified);
        const galleryChanged = Boolean((!post.photoGallery || post.photoGallery.length === 0) && parsed.photoGallery.length > 0);

        if (dateChanged || titleChanged || contentChanged || modifiedChanged || galleryChanged) {
          post.publishedDate = wpDate || post.publishedDate;
          if (cleanTitle) post.title = cleanTitle;
          post.author = wpAuthor;
          if (parsed.cleanedContent) post.content = parsed.cleanedContent;
          if (wpData.content?.rendered) post.contentHtml = wpData.content.rendered;
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
            'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

          const rawWpAuthor = wpItem._embedded?.author?.[0]?.name;
          const wpAuthor = (rawWpAuthor && rawWpAuthor !== 'admin_tunglam' && rawWpAuthor !== 'admin')
            ? rawWpAuthor
            : 'Ban Văn Hóa Tùng Lâm';

          post = {
            id: `post-${wpItem.id}`,
            wpPostId: wpItem.id,
            slug: wpItem.slug || `bai-viet-${wpItem.id}`,
            title: (wpItem.title?.rendered || '')
              .replace(/&#8211;/g, '–')
              .replace(/&#8217;/g, '’')
              .replace(/&amp;/g, '&')
              .trim(),
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
            summary: (wpItem.excerpt?.rendered || '').replace(/<[^>]+>/g, '').trim() || 'Tóm tắt bài viết...',
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
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const body = await req.json();
    const posts = await getPosts();
    const index = posts.findIndex(
      (p) => p.id === id || p.id === decodedId || p.slug === id || p.slug === decodedId || String(p.wpPostId) === id
    );

    let targetIndex = index;
    const oldDate = index !== -1 ? posts[index].publishedDate : undefined;

    if (targetIndex === -1) {
      const newPost: PostRecord = {
        ...body,
        id: id || `post-${Date.now()}`,
      };
      posts.unshift(newPost);
      targetIndex = 0;
    } else {
      posts[targetIndex] = {
        ...posts[targetIndex],
        ...body,
        id: posts[targetIndex].id, // Prevent ID override
      };
    }

    await savePosts(posts);

    // ⚡ TỰ ĐỘNG ĐỒNG BỘ NGÀY ĐĂNG SANG WORDPRESS (CHỜ HOÀN TẤT)
    const targetWpPostId = posts[targetIndex].wpPostId;
    if (targetWpPostId && body.publishedDate && oldDate !== body.publishedDate) {
      try {
        const wpRes = await updateWpPostFields(
          targetWpPostId,
          { date: formatWpDate(body.publishedDate), status: 'publish' },
          'posts'
        );
        if (wpRes.success) {
          console.log(`✅ [sync-wp-date] Đã đồng bộ ngày lên WP #${targetWpPostId}: ${body.publishedDate}`);
        } else {
          console.warn(`⚠️ [sync-wp-date] Lỗi đồng bộ ngày lên WP #${targetWpPostId}:`, wpRes.error);
        }
      } catch (e) {
        console.warn('[auto-sync-wp-date error]', e);
      }
    }

    try {
      revalidatePath('/', 'page');
      revalidatePath('/dong-chay-hoang-phap', 'page');
      if (posts[targetIndex].slug) {
        revalidatePath(`/dong-chay-hoang-phap/${posts[targetIndex].slug}`, 'page');
        revalidatePath(`/tri-tue-phat-phap/${posts[targetIndex].slug}`, 'page');
      }
      revalidatePath('/tri-tue-phat-phap', 'page');
      revalidatePath('/tong-chi-tu-hoc', 'page');
    } catch (e) {
      console.warn('[revalidatePath error]', e);
    }

    return NextResponse.json({
      success: true,
      post: posts[targetIndex],
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
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    let posts = await getPosts();
    const targetIdx = posts.findIndex(
      (p) => p.id === id || p.id === decodedId || p.slug === id || p.slug === decodedId || String(p.wpPostId) === id
    );

    if (targetIdx === -1) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết để xóa' },
        { status: 404 }
      );
    }

    const deletedPost = posts[targetIdx];
    posts.splice(targetIdx, 1);

    // Chạy song song lưu posts và lưu blacklist bài viết đã xóa để giảm 50% thời gian phản hồi máy chủ
    await Promise.all([
      savePosts(posts),
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

    // Thử xóa bài viết trên WordPress nếu có wpPostId
    if (deletedPost.wpPostId) {
      const numWpId = typeof deletedPost.wpPostId === 'number' ? deletedPost.wpPostId : parseInt(String(deletedPost.wpPostId), 10);
      if (!isNaN(numWpId)) {
        deleteWpPost(numWpId).catch((e) => console.warn('Could not trash WP post:', e));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa bài viết "${deletedPost.title}" thành công`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
