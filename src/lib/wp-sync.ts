import { readDb, writeDb, type S3DbEntry, type S3DbWriteResult } from './s3-db';
import { getWpPosts, type WpPost, WP_REVALIDATE_SECONDS } from './wp-client';

/**
 * 🪷 HỢP NHẤT WORDPRESS → CACHE S3
 *
 * Quy tắc vàng: **WordPress thắng phần nội dung**, web giữ phần riêng của mình.
 *  - WordPress sở hữu: tiêu đề, slug, tóm tắt, nội dung, ngày đăng, trạng thái,
 *    ảnh đại diện và chuyên mục.
 *  - Web giữ riêng: lượt xem, từ khóa chú thích, thư viện ảnh, nguồn sách,
 *    khối video, vị trí cắt ảnh, tác giả nội bộ, các khối đa phương tiện khác.
 */

/** Cache JSON của bài viết trên S3 — nguồn dự phòng khi WordPress không phản hồi. */
export const POSTS_DB: S3DbEntry<any[]> = {
  fileName: 'posts-database.json',
  seed: () => [],
};

/** Cache chung: đọc/ghi 1 collection JSON trên S3. */
export function readCache<T>(entry: S3DbEntry<T>): Promise<T> {
  return readDb(entry);
}

export function writeCache<T>(entry: S3DbEntry<T>, data: T): Promise<S3DbWriteResult> {
  return writeDb(entry, data);
}

/** Bản đồ chuyên mục WordPress (theo term_id) → chuyên mục của web. */
export function mapWpCategoryIdsToCms(catIds: number[] = []) {
  // WordPress Admin Categories (admin.tunglamhoaphuc.com)
  if (catIds.includes(2)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  if (catIds.includes(5)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'bai-viet', categoryName: 'Bài Viết' };
  if (catIds.includes(1)) return { mainCategory: 'tong-chi-tu-hoc', subCategory: 'cong-tu', categoryName: 'Tông Chỉ Tu Học' };
  if (catIds.includes(3)) return { mainCategory: 'vu-tru-phat-giao', subCategory: 'cong-tu', categoryName: 'Vũ Trụ Phật Giáo' };

  // Legacy WordPress Categories (tunglamhoaphuc.com)
  if (catIds.includes(266)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
  if (catIds.includes(237)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  if (catIds.includes(265) || catIds.includes(230)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'dai-le-su-kien', categoryName: 'Đại Lễ Sự Kiện' };
  if (catIds.includes(239)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'tinh-do-nhan-gian', categoryName: 'Tịnh Độ Nhân Gian' };
  if (catIds.includes(233)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };

  if (catIds.includes(242)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'phap-am', categoryName: 'Pháp Âm' };
  if (catIds.includes(244)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'video', categoryName: 'Video Phật Pháp' };
  if (catIds.includes(243)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'an-pham-sach', categoryName: 'Ấn Phẩm Sách' };
  if (catIds.includes(245) || catIds.includes(240)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'bai-viet', categoryName: 'Bài Viết' };

  return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
}

/** Bổ sung ánh xạ theo slug (dùng khi term_id bị đổi hoặc bài chỉ có slug). */
const SLUG_CATEGORY_MAP: Record<string, { mainCategory: string; subCategory: string; categoryName: string }> = {
  'dong-chay-hoang-phap': { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' },
  'tri-tue-phat-phap': { mainCategory: 'tri-tue-phat-phap', subCategory: 'bai-viet', categoryName: 'Bài Viết' },
  'tong-chi-tu-hoc': { mainCategory: 'tong-chi-tu-hoc', subCategory: 'cong-tu', categoryName: 'Tông Chỉ Tu Học' },
  'vu-tru-phat-giao': { mainCategory: 'vu-tru-phat-giao', subCategory: 'cong-tu', categoryName: 'Vũ Trụ Phật Giáo' },
};

/** Suy ra chuyên mục của web từ 1 bài viết WordPress đã chuẩn hoá. */
export function mapWpPostToCmsCategory(wp: WpPost) {
  if (wp.categorySlug && SLUG_CATEGORY_MAP[wp.categorySlug]) {
    return SLUG_CATEGORY_MAP[wp.categorySlug];
  }
  return mapWpCategoryIdsToCms(wp.categoryTermId ? [wp.categoryTermId] : []);
}

/**
 * Chuyển HTML Gutenberg của WordPress thành văn bản sạch (markdown nhẹ)
 * — giữ đúng định dạng mà web/admin đang dùng cho trường `content`.
 */
export function cleanWpHtml(rawHtml: any = '') {
  if (typeof rawHtml !== 'string' || !rawHtml) return '';
  let html = rawHtml
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC');

  html = html.replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, (_m, inner) => `\n\n### ${inner.replace(/<[^>]+>/g, '').trim()}\n\n`);
  html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, bqInner) => {
    const clean = bqInner.replace(/<[^>]+>/g, '').trim();
    return `\n\n> ${clean}\n\n`;
  });
  html = html.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_m, figInner) => {
    const srcMatch = figInner.match(/src=["']([^"']+)["']/i);
    const altMatch = figInner.match(/alt=["']([^"']*)["']/i);
    return srcMatch ? `\n\n![${altMatch ? altMatch[1] : ''}](${srcMatch[1]})\n\n` : '';
  });
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, (_m, pText) => `\n\n${pText.replace(/<[^>]+>/g, '').trim()}\n\n`);
  html = html.replace(/<[^>]+>/g, '');
  return html.replace(/\n{3,}/g, '\n\n').trim();
}

const S3_PUBLIC_HOST = 's2-cnv03.s3.us-east-005.backblazeb2.com';
const DEFAULT_THUMBNAIL =
  'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

/** Cache đã cũ hơn WordPress? (dùng để biết có cần ghi lại cache không) */
export function isWpNewerThanCache(wp: WpPost, existing?: any): boolean {
  if (!existing) return true;
  const wpTime = Date.parse(wp.modified || wp.date || '') || 0;
  const cacheTime = Date.parse(existing.wpModified || '') || 0;
  return wpTime > cacheTime;
}

/**
 * Hợp nhất 1 bài WordPress vào bản ghi CMS: **WordPress thắng nội dung**,
 * các field riêng của web (lượt xem, từ khóa, thư viện ảnh…) được giữ nguyên.
 */
export function mergeWpPostIntoCms(wp: WpPost, existing?: any): any {
  const base = existing || {};
  const cat = mapWpPostToCmsCategory(wp);

  // Ảnh: giữ URL S3 đã sao chép nếu ảnh nguồn WordPress không đổi (nhanh hơn, không phụ thuộc WP)
  const sameWpImage = !!wp.thumbnail && base.wpImageUrl === wp.thumbnail;
  const cacheIsS3Image = typeof base.thumbnailUrl === 'string' && base.thumbnailUrl.includes(S3_PUBLIC_HOST);
  const imageUrl =
    sameWpImage && cacheIsS3Image
      ? base.thumbnailUrl
      : wp.thumbnail || base.thumbnailUrl || DEFAULT_THUMBNAIL;

  return {
    ...base,
    id: base.id || `post-${wp.wpId}`,
    wpPostId: wp.wpId,
    slug: wp.slug || base.slug,
    title: wp.title || base.title,
    subtitle: base.subtitle || 'Tùng Lâm Hòa Phúc',
    mainCategory: cat.mainCategory,
    subCategory: cat.subCategory,
    categoryName: cat.categoryName,
    author: base.author || 'Ban Văn Hóa Tùng Lâm',
    wpAuthorId: wp.authorId ?? base.wpAuthorId,
    publishedDate: (wp.date || '').split('T')[0] || base.publishedDate || '',
    status: 'published',
    viewsCount: base.viewsCount ?? 0,
    thumbnailUrl: imageUrl,
    bannerUrl: imageUrl,
    thumbnailPosition: base.thumbnailPosition || 'center 50%',
    bannerPosition: base.bannerPosition || 'center 50%',
    summary: wp.summary || wp.excerpt || base.summary || 'Tóm tắt bài viết...',
    content: cleanWpHtml(wp.contentHtml) || base.content || '',
    keywords: base.keywords || [],
    photoGallery: base.photoGallery || [],
    wpModified: wp.modified || base.wpModified || '',
    wpImageUrl: wp.thumbnail || base.wpImageUrl || '',
    wpLink: wp.link || base.wpLink || '',
    source: 'wordpress',
  };
}

export interface WpMergeStats {
  wpPosts: number;
  updatedFromWp: number;
  cmsOnlyPosts: number;
}

export interface WpMergeResult {
  posts: any[];
  stats: WpMergeStats;
  source: 'wordpress' | 'cache';
  /** Thông báo lỗi nếu buộc phải dùng cache */
  error?: string;
  wpSyncedAt: string;
}

/** Sắp xếp bài viết mới nhất lên đầu (theo ngày đăng, rồi tới ID WordPress). */
export function sortPostsByNewest(posts: any[]): any[] {
  return [...posts].sort((a, b) => {
    const timeA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
    const timeB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
    if (timeB !== timeA) return timeB - timeA;
    const wpA = parseInt(String(a.wpPostId || 0), 10) || 0;
    const wpB = parseInt(String(b.wpPostId || 0), 10) || 0;
    return wpB - wpA;
  });
}

/** Hợp nhất toàn bộ danh sách bài WordPress vào bản ghi cache (giữ bài chỉ có trên web). */
export function mergeWpPostsIntoCms(wpPosts: WpPost[], cachePosts: any[]): { posts: any[]; stats: WpMergeStats } {
  const cacheByWpId = new Map<number, any>();
  const cacheBySlug = new Map<string, any>();
  for (const p of cachePosts || []) {
    const wpId = parseInt(String(p?.wpPostId || 0), 10);
    if (wpId) cacheByWpId.set(wpId, p);
    if (p?.slug) cacheBySlug.set(p.slug, p);
  }

  const mergedSlugs = new Set<string>();
  let updatedFromWp = 0;

  const mergedWp = wpPosts.map((wp) => {
    const existing = cacheByWpId.get(wp.wpId) || (wp.slug ? cacheBySlug.get(wp.slug) : undefined);
    if (isWpNewerThanCache(wp, existing)) updatedFromWp++;
    const record = mergeWpPostIntoCms(wp, existing);
    mergedSlugs.add(record.slug);
    return record;
  });

  const cmsOnly = (cachePosts || []).filter((p) => {
    const wpId = parseInt(String(p?.wpPostId || 0), 10);
    if (wpId && wpPosts.some((wp) => wp.wpId === wpId)) return false;
    if (p?.slug && mergedSlugs.has(p.slug)) return false;
    return true;
  });

  return {
    posts: sortPostsByNewest([...mergedWp, ...cmsOnly]),
    stats: { wpPosts: wpPosts.length, updatedFromWp, cmsOnlyPosts: cmsOnly.length },
  };
}

const WP_PAGE_SIZE = 100;
const MAX_WP_PAGES = 5;

export interface LoadWpPostsOptions {
  search?: string;
  categoryId?: string | number;
  revalidate?: number;
}

/** Lấy toàn bộ bài viết từ WordPress (tự động lật trang, tối đa 5 trang = 500 bài). */
export async function fetchAllWpPosts(options: LoadWpPostsOptions = {}): Promise<WpPost[]> {
  const all: WpPost[] = [];
  for (let page = 1; page <= MAX_WP_PAGES; page++) {
    const batch = await getWpPosts({
      postsPerPage: WP_PAGE_SIZE,
      paged: page,
      search: options.search,
      categoryId: options.categoryId,
      revalidate: options.revalidate ?? WP_REVALIDATE_SECONDS,
    });
    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < WP_PAGE_SIZE) break;
  }
  return all;
}

/** Ghi cache bài viết lên S3 (không ném lỗi ra ngoài luồng chính). */
export async function persistPostsCache(posts: any[]): Promise<S3DbWriteResult | null> {
  try {
    return await writeCache(POSTS_DB, posts);
  } catch (err: any) {
    console.warn('[wp-sync] Không ghi được cache bài viết lên S3:', err?.message || err);
    return null;
  }
}

/**
 * Đọc bài viết theo thứ tự ưu tiên: **WordPress trước → cache JSON trên S3**.
 * Trả kèm `source` để giao diện hiển thị nguồn dữ liệu và cảnh báo khi phải dùng cache.
 */
export async function loadPostsPreferringWordPress(
  options: LoadWpPostsOptions = {}
): Promise<WpMergeResult> {
  try {
    const wpPosts = await fetchAllWpPosts(options);
    const cachePosts = ((await readCache(POSTS_DB).catch(() => [])) || []) as any[];

    if (!wpPosts.length && cachePosts.length) {
      return {
        posts: sortPostsByNewest(cachePosts),
        stats: { wpPosts: 0, updatedFromWp: 0, cmsOnlyPosts: cachePosts.length },
        source: 'cache',
        error: 'WordPress không trả về bài viết nào',
        wpSyncedAt: '',
      };
    }

    const { posts, stats } = mergeWpPostsIntoCms(wpPosts, cachePosts);
    return {
      posts,
      stats,
      source: 'wordpress',
      wpSyncedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    const cachePosts = ((await readCache(POSTS_DB).catch(() => [])) || []) as any[];
    return {
      posts: sortPostsByNewest(cachePosts),
      stats: { wpPosts: 0, updatedFromWp: 0, cmsOnlyPosts: cachePosts.length },
      source: 'cache',
      error: err?.message || String(err),
      wpSyncedAt: '',
    };
  }
}
