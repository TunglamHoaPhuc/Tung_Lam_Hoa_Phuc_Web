import { NextRequest, NextResponse } from 'next/server';
import { PostRecord } from '../route';
import { loadServerlessJson, saveServerlessJson } from '@/lib/serverless-db';
import { HOANG_PHAP_ARTICLES } from '@/data/dong-chay-hoang-phap-data';
import { parseGutenbergPostContent } from '@/lib/wp-post-parser';
import { recordDeletedPost } from '@/lib/deleted-posts';
import { deleteWpPost } from '@/lib/wp-admin-client';

const DB_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as PostRecord[],
};

function getPosts(): PostRecord[] {
  return loadServerlessJson<PostRecord[]>(DB_CONFIG);
}

async function savePosts(posts: PostRecord[]) {
  await saveServerlessJson<PostRecord[]>(DB_CONFIG, posts);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let posts = getPosts();
  let postIndex = posts.findIndex((p) => p.id === id || p.slug === id || String(p.wpPostId) === id);
  let post: any = postIndex !== -1 ? posts[postIndex] : null;

  // Nếu bài đã có nhưng photoGallery chưa có hoặc rỗng, thử bóc tách lại từ WordPress
  if (post && (!post.photoGallery || post.photoGallery.length === 0) && post.wpPostId) {
    try {
      const wpRes = await fetch(`https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts/${post.wpPostId}?_embed=true`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        const parsed = parseGutenbergPostContent(wpData.content?.rendered || '', wpData.title?.rendered || post.title);
        if (parsed.photoGallery.length > 0) {
          post.photoGallery = parsed.photoGallery;
          if (parsed.cleanedContent) {
            post.content = parsed.cleanedContent;
          }
          posts[postIndex] = post;
          await savePosts(posts);
        }
      }
    } catch (e) {
      console.warn('Could not enrich post photoGallery from WP:', e);
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
            author: 'Ban Văn Hóa Tùng Lâm',
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
    if (hp) {
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
    const posts = getPosts();
    const index = posts.findIndex(
      (p) => p.id === id || p.id === decodedId || p.slug === id || p.slug === decodedId || String(p.wpPostId) === id
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    posts[index] = {
      ...posts[index],
      ...body,
      id: posts[index].id, // Prevent ID override
    };

    await savePosts(posts);

    return NextResponse.json({
      success: true,
      post: posts[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    let posts = getPosts();
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
    await savePosts(posts);

    // Ghi nhận bài viết đã xóa vào blacklist để auto-sync từ WordPress không tự tiện thêm lại
    await recordDeletedPost(deletedPost.id, deletedPost.wpPostId, deletedPost.slug);

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
