import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'src/data/posts-database.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface KeywordItem {
  keyword: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  imagePosition?: string;
  linkUrl?: string;
}

export interface SourceBook {
  bookTitle: string;
  author: string;
  coverImage?: string;
  description?: string;
  linkUrl?: string;
}

export interface VideoBlock {
  videoUrl: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
}

export interface FeaturedArticle {
  label?: string;
  title?: string;
  author?: string;
  bgImage?: string;
  bgPosition?: string;
  linkUrl?: string;
}

export interface PhotoItem {
  title: string;
  imageUrl: string;
  imagePosition?: string;
  khuVuc?: string;
  noiDung?: string;
}

export interface RelatedEdition {
  title: string;
  period: string;
  slug: string;
  thumbnailUrl?: string;
}

export interface UpcomingEvent {
  title: string;
  timeString: string;
  location: string;
  description?: string;
  registrationLink?: string;
}

export interface PostRecord {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  mainCategory: 'dong-chay-hoang-phap' | 'tri-tue-phat-phap' | 'tong-chi-tu-hoc' | 'gioi-thieu' | string;
  subCategory?: string;
  categoryName?: string;
  author: string;
  authorLink?: string;
  publishedDate: string;
  status: 'published' | 'draft';
  viewsCount: number;
  thumbnailUrl: string;
  thumbnailPosition?: string;
  bannerUrl: string;
  bannerPosition?: string;
  summary: string;
  content: string;
  contentHtml?: string;
  keywords?: KeywordItem[];
  sourceBook?: SourceBook | SourceBook[];
  videoBlock?: VideoBlock;
  featuredArticle?: FeaturedArticle;
  photoGallery?: PhotoItem[];
  galleryCount?: number;
  previousEditions?: RelatedEdition[];
  upcomingEvents?: UpcomingEvent[];
  wpPostId?: string | number;
}

import { loadServerlessJson, loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';
import { isPostDeleted, isPostDeletedAsync, getDeletedPostsAsync, recordDeletedPost } from '@/lib/deleted-posts';
import { deleteWpPost } from '@/lib/wp-admin-client';

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

import { parseGutenbergPostContent } from '@/lib/wp-post-parser';

function mapCategories(catIds: number[] = []) {
  if (catIds.includes(2)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  if (catIds.includes(5)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'bai-viet', categoryName: 'Bài Viết' };
  if (catIds.includes(1)) return { mainCategory: 'tong-chi-tu-hoc', subCategory: 'cong-tu', categoryName: 'Tông Chỉ Tu Học' };
  if (catIds.includes(3)) return { mainCategory: 'vu-tru-phat-giao', subCategory: 'cong-tu', categoryName: 'Vũ Trụ Phật Giáo' };
  if (catIds.includes(266)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
  if (catIds.includes(237)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  if (catIds.includes(265) || catIds.includes(230)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'dai-le-su-kien', categoryName: 'Đại Lễ Sự Kiện' };
  if (catIds.includes(239)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'tinh-do-nhan-gian', categoryName: 'Tịnh Độ Nhân Gian' };
  return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  const [allPostsLoaded, deletedList] = await Promise.all([
    getPosts(),
    getDeletedPostsAsync(),
  ]);
  let allPosts = allPostsLoaded;
  const deletedSet = new Set(deletedList.map((d) => d.id));
  const deletedWpIds = new Set(deletedList.filter((d) => d.wpPostId).map((d) => String(d.wpPostId)));
  const deletedSlugs = new Set(deletedList.filter((d) => d.slug).map((d) => d.slug));

  // 🪷 TỰ ĐỘNG ĐỒNG BỘ LIÊN TỤC TỪ WORDPRESS ADMIN:
  // Mỗi khi truy cập, tự động kiểm tra 10 bài mới nhất trên WordPress
  // Nếu có bài mới hoặc bài chưa có photoGallery -> tự động bóc tách và lưu ngay lập tức
  let hasChanges = false;
  try {
    const wpRes = await fetch('https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts?per_page=10&_embed=true', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      next: { revalidate: 30 },
    });

    if (wpRes.ok) {
      const wpPosts = await wpRes.json();
      if (Array.isArray(wpPosts)) {
        for (const wp of wpPosts) {
          const wpId = wp.id;
          const wpSlug = wp.slug || `bai-viet-${wpId}`;

          // 🛡️ Bỏ qua nếu bài viết đã từng bị quản trị viên xóa
          if (
            deletedSet.has(`post-${wpId}`) ||
            deletedWpIds.has(String(wpId)) ||
            (wpSlug && deletedSlugs.has(wpSlug)) ||
            isPostDeleted(`post-${wpId}`, wpId, wpSlug)
          ) {
            continue;
          }

          const existingIdx = allPosts.findIndex(
            (p) => p.wpPostId === wpId || p.id === `post-${wpId}` || p.slug === wpSlug
          );

          const existing = existingIdx !== -1 ? allPosts[existingIdx] : null;
          // Cần cập nhật nếu chưa có bài HOẶC bài chưa có photoGallery
          const needsUpdate = !existing || !existing.photoGallery || existing.photoGallery.length === 0;

          if (needsUpdate) {
            const parsed = parseGutenbergPostContent(wp.content?.rendered || '', wp.title?.rendered || '');
            const mappedCat = mapCategories(wp.categories || []);
            const featuredUrl =
              wp._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
              parsed.featuredImageUrl ||
              existing?.thumbnailUrl ||
              'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

            const cleanTitle = (wp.title?.rendered || existing?.title || '')
              .replace(/&#8211;/g, '–')
              .replace(/&#8217;/g, '’')
              .replace(/&amp;/g, '&')
              .trim();

            const mergedPost: PostRecord = {
              id: existing?.id || `post-${wpId}`,
              wpPostId: wpId,
              slug: wpSlug,
              title: cleanTitle,
              subtitle: existing?.subtitle || 'Tùng Lâm Hòa Phúc',
              mainCategory: existing?.mainCategory || mappedCat.mainCategory,
              subCategory: existing?.subCategory || mappedCat.subCategory,
              categoryName: existing?.categoryName || mappedCat.categoryName,
              author: existing?.author || 'Ban Văn Hóa Tùng Lâm',
              publishedDate: wp.date ? wp.date.split('T')[0] : (existing?.publishedDate || new Date().toISOString().split('T')[0]),
              status: 'published',
              viewsCount: existing?.viewsCount || 108,
              thumbnailUrl: existing?.thumbnailUrl || featuredUrl,
              bannerUrl: existing?.bannerUrl || featuredUrl,
              thumbnailPosition: existing?.thumbnailPosition || 'center 50%',
              bannerPosition: existing?.bannerPosition || 'center 50%',
              summary:
                (wp.excerpt?.rendered || '').replace(/<[^>]+>/g, '').replace(/&#8211;/g, '–').replace(/&amp;/g, '&').trim() ||
                existing?.summary ||
                'Tóm tắt bài viết...',
              content: parsed.cleanedContent || existing?.content || '',
              contentHtml: wp.content?.rendered || existing?.contentHtml || '',
              keywords: existing?.keywords || [],
              sourceBook: existing?.sourceBook,
              videoBlock: existing?.videoBlock,
              featuredArticle: existing?.featuredArticle,
              photoGallery: parsed.photoGallery.length > 0 ? parsed.photoGallery : (existing?.photoGallery || []),
              previousEditions: existing?.previousEditions || [],
              upcomingEvents: existing?.upcomingEvents || [],
            };

            if (existingIdx !== -1) {
              allPosts[existingIdx] = mergedPost;
            } else {
              allPosts.unshift(mergedPost);
            }
            hasChanges = true;
          }
        }
      }
    }
  } catch (wpErr) {
    console.warn('Auto-sync WP on GET /api/admin/posts skipped:', wpErr);
  }

  if (hasChanges) {
    await savePosts(allPosts);
  }

  let posts = allPosts;

  if (category && category !== 'all') {
    posts = posts.filter(
      (p) => p.mainCategory === category || p.subCategory === category
    );
  }

  if (status && status !== 'all') {
    posts = posts.filter((p) => p.status === status);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
    );
  }
  // Sắp xếp bài viết mới nhất lên đầu (theo ngày xuất bản giảm dần)
  posts.sort((a, b) => {
    const timeA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
    const timeB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
    if (timeB !== timeA) return timeB - timeA;
    const wpA = typeof a.wpPostId === 'number' ? a.wpPostId : parseInt(String(a.wpPostId || 0), 10);
    const wpB = typeof b.wpPostId === 'number' ? b.wpPostId : parseInt(String(b.wpPostId || 0), 10);
    return (wpB || 0) - (wpA || 0);
  });

  // 🚀 Tối ưu kích thước response để dưới giới hạn 4.5MB Vercel:
  // - keywords: LUÔN giữ nguyên 100% cho mọi bài (chỉ ~1.6KB)
  // - galleryCount: LUÔN trả về số lượng ảnh chính xác để hiển thị badge số lượng ảnh trên từng dòng
  // - photoGallery: Giữ đầy đủ cho 60 bài viết mới nhất (đáp ứng hầu hết thao tác tức thì mà không cần đợi tải)
  //   Với các bài cũ hơn, album ảnh được tải tức thì theo yêu cầu (on-demand 50ms) khi mở Album hoặc Xem trước
  // - content: Giữ 300 ký tự đầu tiên phục vụ hiển thị trích đoạn trên bảng tính
  // - contentHtml: Bỏ qua trong danh sách tổng để tránh phình dung lượng
  const wantFull = searchParams.get('full') === 'true';
  const optimizedPosts = wantFull
    ? posts
    : posts.map((p, idx) => {
        const { contentHtml: _ch, ...rest } = p;
        const galleryCount = p.photoGallery ? p.photoGallery.length : 0;
        return {
          ...rest,
          // 60 bài mới nhất có sẵn toàn bộ mảng photoGallery
          photoGallery: idx < 60 ? (p.photoGallery || []) : [],
          galleryCount,
          // Giữ trích đoạn nội dung cho ô bảng tính
          content: p.content ? p.content.slice(0, 300) : (p.summary || ''),
          keywords: p.keywords || [],
        };
      });

  return NextResponse.json({
    success: true,
    total: optimizedPosts.length,
    posts: optimizedPosts,
  });
}

// 🌟 PUT: Cập nhật toàn bộ mảng bài viết (Batch Save từ Bảng tính Spreadsheet)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu gửi lên phải là một danh sách bài viết' },
        { status: 400 }
      );
    }

    const currentPosts = await getPosts();
    const currentMap = new Map(currentPosts.map((p) => [p.id, p]));

    // Safeguard bảo vệ không bao giờ làm rỗng nội dung nếu client gửi rỗng ngoài ý muốn, tự động xuất bản
    const validatedPosts = body.map((p: PostRecord) => {
      const orig = currentMap.get(p.id);
      if (orig && (!p.content || p.content.trim() === '') && orig.content && orig.content.trim() !== '') {
        p.content = orig.content;
      }
      if (orig && !p.wpPostId && orig.wpPostId) {
        p.wpPostId = orig.wpPostId;
      }
      // 🛡️ Giữ nguyên trường nặng từ server nếu client không gửi (để tránh mất dữ liệu do optimize payload)
      if (orig && (!p.photoGallery || p.photoGallery.length === 0) && orig.photoGallery && orig.photoGallery.length > 0) {
        p.photoGallery = orig.photoGallery;
      }
      if (orig && (!p.contentHtml || p.contentHtml.trim() === '') && orig.contentHtml && orig.contentHtml.trim() !== '') {
        p.contentHtml = orig.contentHtml;
      }
      if (orig && (!p.keywords || p.keywords.length === 0) && orig.keywords && orig.keywords.length > 0) {
        p.keywords = orig.keywords;
      }
      // Tự động xuất bản 100% bài viết khi cập nhật
      p.status = 'published';
      return p;
    });

    await savePosts(validatedPosts);

    return NextResponse.json({
      success: true,
      message: 'Đã lưu danh sách bài viết thành công!',
      total: validatedPosts.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const posts = await getPosts();

    const newId = body.id || `post-${Date.now()}`;
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newPost: PostRecord = {
      id: newId,
      slug,
      title: body.title || 'Tiêu đề bài viết',
      subtitle: body.subtitle || '',
      mainCategory: body.mainCategory || 'dong-chay-hoang-phap',
      subCategory: body.subCategory || 'cong-tu',
      categoryName: body.categoryName || '',
      author: body.author || 'Ban Văn Hóa Tùng Lâm',
      authorLink: body.authorLink || '',
      publishedDate: body.publishedDate || new Date().toISOString().split('T')[0],
      status: body.status || 'published',
      viewsCount: body.viewsCount || 0,
      thumbnailUrl: body.thumbnailUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      thumbnailPosition: body.thumbnailPosition || 'center 50%',
      bannerUrl: body.bannerUrl || body.thumbnailUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      bannerPosition: body.bannerPosition || 'center 50%',
      summary: body.summary || '',
      content: body.content || body.contentHtml || '',
      contentHtml: body.contentHtml || '',
      keywords: body.keywords || [],
      sourceBook: body.sourceBook,
      videoBlock: body.videoBlock,
      featuredArticle: body.featuredArticle,
      photoGallery: body.photoGallery || [],
      previousEditions: body.previousEditions || [],
      upcomingEvents: body.upcomingEvents || [],
    };

    posts.unshift(newPost);
    await savePosts(posts);

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE: Xóa bài viết khỏi cơ sở dữ liệu và đồng bộ S3/WordPress
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get('id');
    let bodyId: string | undefined;
    try {
      const body = await req.json();
      bodyId = body.id;
    } catch {}

    const id = queryId || bodyId;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID bài viết cần xóa' }, { status: 400 });
    }

    const decodedId = decodeURIComponent(id);
    let posts = await getPosts();
    const targetIdx = posts.findIndex(
      (p) => p.id === id || p.id === decodedId || p.slug === id || p.slug === decodedId || String(p.wpPostId) === id
    );

    if (targetIdx === -1) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết để xóa' }, { status: 404 });
    }

    const deletedPost = posts[targetIdx];
    posts.splice(targetIdx, 1);

    // Chạy song song lưu posts và ghi blacklist bài viết đã xóa để giảm 50% thời gian phản hồi máy chủ
    await Promise.all([
      savePosts(posts),
      recordDeletedPost(deletedPost.id, deletedPost.wpPostId, deletedPost.slug),
    ]);

    if (deletedPost.wpPostId) {
      const numWpId = typeof deletedPost.wpPostId === 'number' ? deletedPost.wpPostId : parseInt(String(deletedPost.wpPostId), 10);
      if (!isNaN(numWpId)) {
        deleteWpPost(numWpId).catch((e) => console.warn('Could not trash WP post:', e));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa bài viết "${deletedPost.title}" thành công!`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
