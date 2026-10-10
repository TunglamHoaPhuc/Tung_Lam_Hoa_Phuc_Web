import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
  wpModified?: string;
}

import { loadServerlessJson, loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';
import { isPostDeleted, isPostDeletedAsync, getDeletedPostsAsync, recordDeletedPost } from '@/lib/deleted-posts';
import { deleteWpPost, updateWpPostFields, formatWpDate } from '@/lib/wp-admin-client';

const DB_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as PostRecord[],
};

// 🛡️ DANH SÁCH BÀI VIẾT THUỘC CHUYÊN MỤC ĐẶC THÙ (GIỚI THIỆU & TÔNG CHỈ) - TUYỆT ĐỐI KHÔNG ĐƯA VÀO ADMIN/POSTS
export const SPECIAL_GIOI_THIEU_WP_IDS = new Set(['508', '27596', '24824', '24674', '24470']);
export const SPECIAL_GIOI_THIEU_SLUGS = new Set([
  'lich-su-tung-lam-hoa-phuc',
  'dai-su-lien-dang',
  'su-ong-hoang-phap',
  'su-phu-tru-tri',
  'tieu-su-su-to',
  'van-hoa-ung-xu',
  'hoa-thuong-ngo-chan-tu',
  'dai-su-thanh-luong',
  'thay-thich-tam-hoa',
]);
export const SPECIAL_TONG_CHI_WP_IDS = new Set(['385', '403', '401', '470', '488', '650']);

async function getPosts(): Promise<PostRecord[]> {
  const [posts, deletedList] = await Promise.all([
    loadServerlessJsonAsync<PostRecord[]>(DB_CONFIG),
    getDeletedPostsAsync(),
  ]);
  const deletedSet = new Set(deletedList.map((d) => d.id));
  const deletedWpIds = new Set(deletedList.filter((d) => d.wpPostId).map((d) => String(d.wpPostId)));
  const deletedSlugs = new Set(deletedList.filter((d) => d.slug).map((d) => d.slug));

  return posts.filter(
    (p) =>
      !deletedSet.has(p.id) &&
      !deletedWpIds.has(String(p.wpPostId)) &&
      !deletedSlugs.has(p.slug) &&
      !SPECIAL_GIOI_THIEU_WP_IDS.has(String(p.wpPostId)) &&
      !SPECIAL_GIOI_THIEU_WP_IDS.has(String(p.id).replace('post-', '')) &&
      !SPECIAL_GIOI_THIEU_SLUGS.has(p.slug) &&
      !SPECIAL_TONG_CHI_WP_IDS.has(String(p.wpPostId))
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

function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(parseInt(dec, 10)))
    .normalize('NFC');
}

function cleanSummary(rawExcerpt: string, content: string, existingSummary?: string): string {
  let text = decodeHtmlEntities((rawExcerpt || '').replace(/<[^>]+>/g, '').trim());
  if (!text || /^tóm tắt/i.test(text)) {
    if (existingSummary && !/^tóm tắt/i.test(existingSummary)) {
      return decodeHtmlEntities(existingSummary);
    }
    const cleanContent = decodeHtmlEntities(
      (content || '').replace(/!\[.*?\]\(.*?\)/g, '').replace(/<[^>]+>/g, '').replace(/#+\s*/g, '').trim()
    );
    if (cleanContent && cleanContent.length > 20 && !/^tóm tắt/i.test(cleanContent)) {
      text = cleanContent.slice(0, 160).trim() + (cleanContent.length > 160 ? '…' : '');
    }
  }
  return text || (existingSummary ? decodeHtmlEntities(existingSummary) : 'Tùng Lâm Hòa Phúc');
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

  // 🪷 TỰ ĐỘNG ĐỒNG BỘ TỪ WORDPRESS ADMIN:
  // - Ở Local Dev: Bỏ qua fetch 30 bài WP từ xa để tốc độ tải bảng luôn đạt < 10ms tức thì,
  //   trừ khi có ?syncWp=true hoặc có ?syncPostId=<id> (khi vừa quay lại từ tab Gutenberg)
  // - Ở Production: Kiểm tra nếu có bài mới hoặc bài được sửa đổi trên WP
  const isDev = process.env.NODE_ENV !== 'production';
  const syncPostId = searchParams.get('syncPostId');
  const shouldCheckWp = !isDev || searchParams.get('syncWp') === 'true' || Boolean(syncPostId);
  let hasChanges = false;

  if (shouldCheckWp) {
    try {
      const wpUrl = syncPostId
        ? `https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts/${encodeURIComponent(syncPostId)}?_embed=true`
        : 'https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts?per_page=30&orderby=modified&order=desc&_embed=true';

      const wpRes = await fetch(wpUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        cache: 'no-store',
      });

      if (wpRes.ok) {
        const rawJson = await wpRes.json();
        const wpPosts = Array.isArray(rawJson) ? rawJson : [rawJson];
        if (Array.isArray(wpPosts) && wpPosts.length > 0) {
          for (const wp of wpPosts) {
            if (!wp || !wp.id) continue;
            const wpId = wp.id;
            const wpSlug = wp.slug || `bai-viet-${wpId}`;

            // 🛡️ Bỏ qua nếu bài viết đã từng bị quản trị viên xóa hoặc thuộc Giới Thiệu / Tông Chỉ độc lập
            if (
              deletedSet.has(`post-${wpId}`) ||
              deletedWpIds.has(String(wpId)) ||
              (wpSlug && deletedSlugs.has(wpSlug)) ||
              isPostDeleted(`post-${wpId}`, wpId, wpSlug) ||
              SPECIAL_GIOI_THIEU_WP_IDS.has(String(wpId)) ||
              SPECIAL_GIOI_THIEU_SLUGS.has(wpSlug) ||
              SPECIAL_TONG_CHI_WP_IDS.has(String(wpId))
            ) {
              continue;
            }

            const existingIdx = allPosts.findIndex(
              (p) => String(p.wpPostId) === String(wpId) || p.id === `post-${wpId}` || p.slug === wpSlug
            );

            const existing = existingIdx !== -1 ? allPosts[existingIdx] : null;

            // 📅 Lấy chính xác ngày xuất bản post_date được chỉnh sửa từ bên trong WordPress (YYYY-MM-DD)
            const wpPublishedDate = wp.date ? wp.date.split('T')[0] : (wp.date_gmt ? wp.date_gmt.split('T')[0] : '');

            // ✍️ Lấy tác giả từ WordPress nếu có tên cụ thể (không phải generic admin)
            const rawWpAuthor = wp._embedded?.author?.[0]?.name;
            const wpAuthor = (rawWpAuthor && rawWpAuthor !== 'admin_tunglam' && rawWpAuthor !== 'admin')
              ? rawWpAuthor
              : (existing?.author || 'Ban Văn Hóa Tùng Lâm');

            const cleanTitle = decodeHtmlEntities(wp.title?.rendered || '').trim();
            const parsed = parseGutenbergPostContent(wp.content?.rendered || '', cleanTitle || wp.title?.rendered || '');

            // ⚡ Phát hiện thay đổi tức thời từ WordPress:
            const isNew = !existing;
            const isWpModified = Boolean(wp.modified && existing && (existing as any).wpModified !== wp.modified);
            const allowWpOverride = isNew || isWpModified;
            const dateChanged = Boolean(wpPublishedDate && existing && existing.publishedDate !== wpPublishedDate && allowWpOverride);
            const titleChanged = Boolean(cleanTitle && existing && existing.title !== cleanTitle && allowWpOverride);
            const contentChanged = Boolean(parsed.cleanedContent && existing && existing.content !== parsed.cleanedContent && allowWpOverride);
            const modifiedChanged = Boolean(wp.modified && existing && (existing as any).wpModified !== wp.modified);
            const missingGallery = Boolean(existing && (!existing.photoGallery || existing.photoGallery.length === 0) && parsed.photoGallery.length > 0);

            const needsUpdate = isNew || dateChanged || titleChanged || contentChanged || modifiedChanged || missingGallery;

            if (needsUpdate) {
              const mappedCat = mapCategories(wp.categories || []);
              const featuredUrl =
                wp._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                parsed.featuredImageUrl ||
                existing?.thumbnailUrl ||
                'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

              const mergedPost: PostRecord = {
                id: existing?.id || `post-${wpId}`,
                wpPostId: wpId,
                slug: wpSlug,
                title: allowWpOverride && cleanTitle ? cleanTitle : (existing?.title || cleanTitle || ''),
                subtitle: decodeHtmlEntities(existing?.subtitle || 'Tùng Lâm Hòa Phúc'),
                mainCategory: existing?.mainCategory || mappedCat.mainCategory,
                subCategory: existing?.subCategory || mappedCat.subCategory,
                categoryName: existing?.categoryName || mappedCat.categoryName,
                author: wpAuthor,
                // 🌟 LUÔN LẤY CHÍNH XÁC NGÀY XUẤT BẢN POST_DATE TỪ WORDPRESS:
                publishedDate: wpPublishedDate || existing?.publishedDate || new Date().toISOString().split('T')[0],
                status: 'published',
                viewsCount: existing?.viewsCount || 108,
                thumbnailUrl: existing?.thumbnailUrl || featuredUrl,
                bannerUrl: existing?.bannerUrl || featuredUrl,
                thumbnailPosition: existing?.thumbnailPosition || 'center 50%',
                bannerPosition: existing?.bannerPosition || 'center 50%',
                summary: cleanSummary(wp.excerpt?.rendered || '', parsed.cleanedContent || existing?.content || '', existing?.summary),
                content: parsed.cleanedContent || existing?.content || '',
                contentHtml: wp.content?.rendered || existing?.contentHtml || '',
                keywords: existing?.keywords || [],
                sourceBook: existing?.sourceBook,
                videoBlock: existing?.videoBlock,
                featuredArticle: existing?.featuredArticle,
                photoGallery: parsed.photoGallery.length > 0 ? parsed.photoGallery : (existing?.photoGallery || []),
                previousEditions: existing?.previousEditions || [],
                upcomingEvents: existing?.upcomingEvents || [],
                wpModified: wp.modified,
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
  }

  if (hasChanges) {
    await savePosts(allPosts);
    try {
      revalidatePath('/', 'page');
      revalidatePath('/dong-chay-hoang-phap', 'page');
      revalidatePath('/tri-tue-phat-phap', 'page');
    } catch {}
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
  // - content: LUÔN GIỮ TOÀN VẸN 100% nội dung markdown (không bao giờ cắt cụt 300 ký tự làm hỏng bài viết)
  // - keywords: LUÔN giữ nguyên 100% cho mọi bài (chỉ ~1.6KB)
  // - galleryCount: LUÔN trả về số lượng ảnh chính xác để hiển thị badge số lượng ảnh trên từng dòng
  // - photoGallery: Giữ đầy đủ cho 60 bài viết mới nhất (đáp ứng hầu hết thao tác tức thì mà không cần đợi tải)
  //   Với các bài cũ hơn, album ảnh được tải tức thì theo yêu cầu (on-demand 50ms) khi mở Album hoặc Xem trước
  // - contentHtml: Bỏ qua trong danh sách tổng để tránh phình dung lượng (HTML thô Gutenberg nặng 15-30KB/bài)
  const wantFull = searchParams.get('full') === 'true' || searchParams.get('forAdmin') === 'true';
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
          // 🛡️ GIỮ NGUYÊN TOÀN BỘ NỘI DUNG MARKDOWN (tránh lỗi teo nhỏ nội dung)
          content: p.content || (p.summary || ''),
          keywords: p.keywords || [],
        };
      });

  return NextResponse.json({
    success: true,
    total: optimizedPosts.length,
    posts: optimizedPosts,
  });
}

// 🌟 PUT: Cập nhật mảng bài viết (Batch Save từ Bảng tính Spreadsheet)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu gửi lên phải là một danh sách bài viết' },
        { status: 400 }
      );
    }

    // Đọc toàn bộ danh sách thô từ cơ sở dữ liệu để bảo vệ 100% toàn vẹn dữ liệu
    const rawAllPosts = await loadServerlessJsonAsync<PostRecord[]>(DB_CONFIG);
    const currentMap = new Map(rawAllPosts.map((p) => [p.id, p]));

    const changedPostsWithWpId: { wpPostId: number; date?: string; title?: string }[] = [];
    // Safeguard bảo vệ không bao giờ làm rỗng nội dung nếu client gửi rỗng ngoài ý muốn, tự động xuất bản
    const validatedPosts = body.map((p: PostRecord) => {
      const orig = currentMap.get(p.id);

      // 🛡️ CONTENT SHIELD: Bảo vệ nội dung, không bao giờ để nội dung bị teo nhỏ hoặc đè bởi trích đoạn cắt 300 ký tự cũ
      if (orig && orig.content && orig.content.trim() !== '') {
        if (!p.content || p.content.trim() === '') {
          p.content = orig.content;
        } else if (
          p.content.trim().length <= 300 &&
          orig.content.trim().length > 300 &&
          orig.content.trim().startsWith(p.content.trim().slice(0, 50))
        ) {
          p.content = orig.content;
        }
      }

      // 🛡️ Tự động phục hồi nội dung từ contentHtml nếu content bị cắt ngắn mà HTML còn đầy đủ
      if (orig && (!p.content || p.content.trim().length <= 300) && orig.contentHtml && orig.contentHtml.length > 500) {
        try {
          const parsed = parseGutenbergPostContent(orig.contentHtml, p.title || orig.title || '');
          if (parsed.cleanedContent && parsed.cleanedContent.length > (p.content?.length || 0)) {
            p.content = parsed.cleanedContent;
          }
        } catch {}
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
      // ⚡ Tự động phát hiện nếu ngày đăng hoặc tiêu đề thay đổi để đẩy sang WordPress Gutenberg
      const dateChanged = Boolean(p.publishedDate && orig && orig.publishedDate !== p.publishedDate);
      const titleChanged = Boolean(p.title && orig && orig.title !== p.title);
      if (p.wpPostId && (dateChanged || titleChanged)) {
        changedPostsWithWpId.push({
          wpPostId: Number(p.wpPostId),
          ...(dateChanged ? { date: p.publishedDate } : {}),
          ...(titleChanged ? { title: p.title } : {}),
        });
      }
      // Tự động xuất bản 100% bài viết khi cập nhật
      p.status = 'published';
      return p;
    });

    // 🌟 SMART MERGE: Hợp nhất (merge) các bài cập nhật vào cơ sở dữ liệu hiện tại theo ID,
    // TUYỆT ĐỐI KHÔNG XÓA các bài viết thuộc các chuyên mục khác hoặc bài đặc thù.
    const incomingValidatedMap = new Map(validatedPosts.map((p) => [p.id, p]));
    const finalPosts = rawAllPosts.map((p) => incomingValidatedMap.get(p.id) || p);

    // Thêm các bài viết mới nếu chưa có trong rawAllPosts
    for (const p of validatedPosts) {
      if (!currentMap.has(p.id)) {
        finalPosts.unshift(p);
      }
    }

    await savePosts(finalPosts);

    // ⚡ TỰ ĐỘNG ĐỒNG BỘ NGÀY ĐĂNG & TIÊU ĐỀ SANG WORDPRESS CHO TẤT CẢ BÀI CÓ THAY ĐỔI (CHỜ HOÀN TẤT)
    if (changedPostsWithWpId.length > 0) {
      try {
        const syncResults = await Promise.allSettled(
          changedPostsWithWpId.map((item) => {
            const payload: Record<string, any> = { status: 'publish' };
            if (item.date) payload.date = formatWpDate(item.date);
            if (item.title) payload.title = item.title;
            return updateWpPostFields(item.wpPostId, payload, 'posts');
          })
        );
        let hasModifiedUpdate = false;
        syncResults.forEach((r, idx) => {
          if (r.status === 'fulfilled' && r.value.success) {
            console.log(`✅ [sync-wp-fields] Đã đồng bộ lên WP #${changedPostsWithWpId[idx].wpPostId}:`, changedPostsWithWpId[idx]);
            if (r.value.data?.modified) {
              const matched = finalPosts.find((fp) => Number(fp.wpPostId) === changedPostsWithWpId[idx].wpPostId);
              if (matched) {
                matched.wpModified = r.value.data.modified;
                hasModifiedUpdate = true;
              }
            }
          } else {
            console.warn(`⚠️ [sync-wp-fields] Lỗi đồng bộ lên WP #${changedPostsWithWpId[idx].wpPostId}:`, (r as any).reason || (r as any).value?.error);
          }
        });
        if (hasModifiedUpdate) {
          await savePosts(finalPosts);
        }
      } catch (e) {
        console.warn('[auto-sync-wp-fields error]', e);
      }
    }

    // 🌟 LÀM MỚI TỨC THỜI TRANG CHỦ VÀ CÁC TRANG CHUYÊN MỤC
    try {
      revalidatePath('/', 'page');
      revalidatePath('/dong-chay-hoang-phap', 'page');
      revalidatePath('/tong-chi-tu-hoc', 'page');
      revalidatePath('/tri-tue-phat-phap', 'page');
      revalidatePath('/gioi-thieu', 'page');
      for (const p of validatedPosts) {
        if (p.slug) {
          revalidatePath(`/dong-chay-hoang-phap/${p.slug}`, 'page');
          revalidatePath(`/tri-tue-phat-phap/${p.slug}`, 'page');
        }
      }
    } catch (e) {
      console.warn('[revalidatePath error]', e);
    }

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
      thumbnailUrl: body.thumbnailUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      thumbnailPosition: body.thumbnailPosition || 'center 50%',
      bannerUrl: body.bannerUrl || body.thumbnailUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
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

    try {
      revalidatePath('/', 'page');
      revalidatePath('/dong-chay-hoang-phap', 'page');
      revalidatePath('/tri-tue-phat-phap', 'page');
    } catch (e) {
      console.warn('[revalidatePath error]', e);
    }

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

    try {
      revalidatePath('/', 'page');
      revalidatePath('/dong-chay-hoang-phap', 'page');
      revalidatePath('/tri-tue-phat-phap', 'page');
    } catch (e) {
      console.warn('[revalidatePath error]', e);
    }

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
