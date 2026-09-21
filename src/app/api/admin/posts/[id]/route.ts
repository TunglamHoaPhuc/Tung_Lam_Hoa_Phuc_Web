import { NextRequest, NextResponse } from 'next/server';
import { PostRecord } from '../route';
import { readCache, writeCache, POSTS_DB, mergeWpPostIntoCms } from '@/lib/wp-sync';
import { getWpPostById, getWpPostBySlug } from '@/lib/wp-client';

/** Đọc cache bài viết trên S3. */
async function getCachedPosts(): Promise<PostRecord[]> {
  return ((await readCache<PostRecord[]>(POSTS_DB)) || []) as PostRecord[];
}

/** Ghi cache bài viết lên S3. */
async function savePosts(posts: PostRecord[]) {
  await writeCache(POSTS_DB, posts);
}

import { HOANG_PHAP_ARTICLES } from '@/data/dong-chay-hoang-phap-data';

/** Chuyển `post-632` / `632` → 632 (ID WordPress). */
function toWpId(id: string): number {
  const raw = String(id || '').replace(/^post-/, '');
  return /^\d+$/.test(raw) ? Number(raw) : 0;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. 🌟 WORDPRESS TRƯỚC: đọc theo ID, nếu không có thì tra theo slug
  const wpId = toWpId(id);
  let wpPost = null;
  try {
    wpPost = (wpId ? await getWpPostById(wpId) : null) || (await getWpPostBySlug(id));
  } catch {
    wpPost = null;
  }

  if (wpPost) {
    const cached = await getCachedPosts();
    const existing = cached.find(
      (p) => String(p.wpPostId) === String(wpPost!.wpId) || p.slug === wpPost!.slug
    );
    return NextResponse.json({
      success: true,
      post: mergeWpPostIntoCms(wpPost, existing),
      source: 'wordpress',
    });
  }

  // 2. Cache JSON trên S3
  const posts = await getCachedPosts();
  let post: any = posts.find((p) => p.id === id || p.slug === id || String(p.wpPostId) === id);

  // 3. Dữ liệu tĩnh dựng sẵn (fallback cuối cùng)
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

  return NextResponse.json({ success: true, post, source: 'cache' });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const posts = await getCachedPosts();
    const index = posts.findIndex((p) => p.id === id);

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
    let posts = await getCachedPosts();
    const exists = posts.some((p) => p.id === id);

    if (!exists) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    posts = posts.filter((p) => p.id !== id);
    await savePosts(posts);

    return NextResponse.json({
      success: true,
      message: 'Đã xóa bài viết thành công',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
