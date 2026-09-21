/**
 * 🪷 WORDPRESS HEADLESS CLIENT — Nguồn nội dung chính của dự án
 *
 * WordPress: admin.tunglamhoaphuc.com là NGUỒN SỰ THẬT cho nội dung bài viết.
 * Lớp này chuẩn hoá 2 nhóm endpoint về MỘT model duy nhất (`WpPost`) để toàn bộ
 * web/admin dùng chung, không còn mỗi nơi gọi một kiểu.
 *
 * Hợp đồng dữ liệu THẬT đã kiểm chứng bằng cách gọi API live:
 *  - GET /wp-json/tunglam/v1/posts?posts_per_page=&paged=&search=&category_id=&orderby=&order=
 *      → { category_info, posts: [{ id, title.rendered, content.rendered, excerpt.rendered,
 *           status, date, modified_date, author (SỐ), link, featured_image_urls{...},
 *           categories {OBJECT ĐƠN}, noi_dung_tom_tat, acf{...} }] }
 *      ⚠️ KHÔNG có field `slug` → phải lấy từ `link` hoặc tra wp/v2.
 *  - GET /wp-json/tunglam/v1/posts/{id}                  → chi tiết theo ID SỐ
 *  - GET /wp-json/tunglam/v1/posts/related/{id}
 *  - GET /wp-json/tunglam/v1/categories                  → { value: [ ... ] }
 *  - GET /wp-json/tunglam/v1/tong-chi(...)               → dùng `danh_muc_tong_chi`
 *  - GET /wp-json/wp/v2/posts?include=&_fields=id,slug,modified,date   (để lấy slug thật)
 */

export const WP_ADMIN_ORIGIN = (
  process.env.WP_ADMIN_BASE_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(/\/wp-json.*$/, '') ||
  'https://admin.tunglamhoaphuc.com'
).replace(/\/$/, '');

export const WP_TUNGLAM_API = `${WP_ADMIN_ORIGIN}/wp-json/tunglam/v1`;
export const WP_V2_API = `${WP_ADMIN_ORIGIN}/wp-json/wp/v2`;

/** Thời gian cache ISR mặc định khi đọc WordPress (giây). */
export const WP_REVALIDATE_SECONDS = Number(process.env.WP_REVALIDATE_SECONDS || 60);

export interface WpImageUrls {
  thumbnail?: string;
  medium?: string;
  large?: string;
  full?: string;
}

/** Model chuẩn hoá dùng chung cho toàn bộ hệ thống. */
export interface WpPost {
  wpId: number;
  slug: string;
  title: string;
  /** Đoạn tóm tắt dạng text thuần (đã bỏ HTML) */
  excerpt: string;
  /** Tóm tắt gốc từ ACF `noi_dung_tom_tat` (nếu có) */
  summary: string;
  /** Nội dung HTML đã render từ WordPress */
  contentHtml: string;
  date: string;
  modified: string;
  status: string;
  link: string;
  authorId?: number;
  categoryTermId?: number;
  categorySlug?: string;
  categoryName?: string;
  thumbnail?: string;
  imageUrls?: WpImageUrls;
  acf?: Record<string, any>;
  /** `post` = bài viết thường, `tong-chi` = CPT Tông Chỉ */
  wpType: 'post' | 'tong-chi';
}

export interface WpCategory {
  termId: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  iconUrl?: string;
  link?: string;
}

/** Lỗi có mã để route handler trả về thông báo rõ ràng cho admin. */
export class WpError extends Error {
  readonly code: string;
  constructor(message: string, code = 'WP_ERROR') {
    super(message);
    this.name = 'WpError';
    this.code = code;
  }
}

const DEFAULT_TIMEOUT_MS = Number(process.env.WP_TIMEOUT_MS || 25000);

/** Fetch JSON từ WordPress kèm timeout + cache ISR. */
export async function wpFetchJson<T>(
  url: string,
  revalidate: number = WP_REVALIDATE_SECONDS
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      next: { revalidate },
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new WpError(`WordPress trả về ${res.status} ${res.statusText} cho ${url}`, 'WP_HTTP_ERROR');
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err instanceof WpError) throw err;
    if (err?.name === 'AbortError') {
      throw new WpError(`Hết thời gian chờ WordPress (${DEFAULT_TIMEOUT_MS}ms): ${url}`, 'WP_TIMEOUT');
    }
    throw new WpError(`Không kết nối được WordPress: ${err?.message || String(err)}`, 'WP_UNREACHABLE');
  } finally {
    clearTimeout(timer);
  }
}

/** Lấy chuỗi an toàn từ field WordPress (có thể là string hoặc `{ rendered }`). */
export function toStringField(input: any): string {
  if (typeof input === 'string') return input;
  if (input && typeof input === 'object') {
    if (typeof input.rendered === 'string') return input.rendered;
    if (typeof input.raw === 'string') return input.raw;
  }
  return '';
}

/** Bỏ thẻ HTML để lấy text thuần (dùng cho tóm tắt/meta). */
export function stripHtml(input?: any): string {
  const source = typeof input === 'string' ? input : toStringField(input);
  if (!source) return '';
  return source
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#8230;/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Lấy slug từ permalink WordPress: /ten-bai-viet/ → ten-bai-viet */
export function parseSlugFromLink(link?: string | null): string {
  if (!link) return '';
  try {
    const parts = new URL(link).pathname.split('/').filter(Boolean);
    return parts.length ? decodeURIComponent(parts[parts.length - 1]) : '';
  } catch {
    return '';
  }
}

/** Chuẩn hoá 1 category (object đơn hoặc mảng) về dạng thống nhất. */
function normalizeCategoryField(raw: any): { termId?: number; slug?: string; name?: string } {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  if (!candidate || typeof candidate !== 'object') return {};
  return {
    termId: candidate.term_id ?? candidate.id,
    slug: candidate.slug,
    name: candidate.name,
  };
}

/** Chuẩn hoá 1 bài viết thô của WordPress về model `WpPost`. */
export function normalizeWpPost(raw: any, wpType: 'post' | 'tong-chi' = 'post'): WpPost {
  const images: WpImageUrls = raw?.featured_image_urls || {};
  const acf = raw?.acf || {};
  const summary = raw?.noi_dung_tom_tat || acf?.noi_dung_tom_tat || '';
  const cat = normalizeCategoryField(raw?.categories ?? raw?.danh_muc_tong_chi);
  const imageValues = Object.values(images).filter(Boolean) as string[];

  return {
    wpId: Number(raw?.id) || 0,
    slug: raw?.slug || parseSlugFromLink(raw?.link),
    title: stripHtml(raw?.title),
    excerpt: stripHtml(raw?.excerpt) || stripHtml(summary),
    summary: stripHtml(summary),
    contentHtml: toStringField(raw?.content),
    date: raw?.date || '',
    modified: raw?.modified_date || raw?.modified || raw?.date || '',
    status: raw?.status || 'publish',
    link: raw?.link || '',
    authorId: typeof raw?.author === 'number' ? raw.author : undefined,
    categoryTermId: cat.termId,
    categorySlug: cat.slug,
    categoryName: cat.name,
    thumbnail: images.large || images.medium || images.full || images.thumbnail || imageValues[0],
    imageUrls: images,
    acf,
    wpType,
  };
}

/**
 * Bù `slug` thật cho danh sách bài viết.
 * `tunglam/v1` không trả slug → hỏi `wp/v2` theo lô 100 ID (1 request cho ~100 bài).
 */
export async function enrichPostsWithSlugs<T extends WpPost>(
  posts: T[],
  wpType: 'post' | 'tong-chi' = 'post',
  revalidate: number = WP_REVALIDATE_SECONDS
): Promise<T[]> {
  if (!posts.length) return posts;

  const ids = posts.map((p) => p.wpId).filter((id) => id > 0);
  if (!ids.length) return posts;

  const endpoint = wpType === 'tong-chi' ? `${WP_V2_API}/tong-chi` : `${WP_V2_API}/posts`;
  const withSlug = new Map<number, { slug: string; modified?: string }>();
  const chunkSize = 100;

  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    try {
      const rows = await wpFetchJson<any[]>(
        `${endpoint}?include=${chunk.join(',')}&per_page=${chunkSize}&_fields=id,slug,modified`,
        revalidate
      );
      for (const row of rows || []) {
        if (row?.id) withSlug.set(Number(row.id), { slug: row.slug, modified: row.modified });
      }
    } catch {
      // Không chặn luồng: slug vẫn có thể suy ra từ `link`
    }
  }

  return posts.map((p) => {
    const found = withSlug.get(p.wpId);
    if (!found) return p;
    return {
      ...p,
      slug: found.slug || p.slug,
      modified: found.modified || p.modified,
    };
  });
}

export interface GetWpPostsParams {
  postsPerPage?: number;
  paged?: number;
  categoryId?: string | number;
  tagId?: string | number;
  authorId?: string | number;
  search?: string;
  orderby?: 'ID' | 'title' | 'date' | 'rand';
  order?: 'ASC' | 'DESC';
  revalidate?: number;
}

/** Lấy danh sách bài viết từ WordPress (đã chuẩn hoá + bù slug thật). */
export async function getWpPosts(params: GetWpPostsParams = {}): Promise<WpPost[]> {
  const qs = new URLSearchParams();
  qs.set('posts_per_page', String(params.postsPerPage ?? 100));
  qs.set('paged', String(params.paged ?? 1));
  if (params.categoryId) qs.set('category_id', String(params.categoryId));
  if (params.tagId) qs.set('tag_id', String(params.tagId));
  if (params.authorId) qs.set('author_id', String(params.authorId));
  if (params.search) qs.set('search', params.search);
  if (params.orderby) qs.set('orderby', params.orderby);
  if (params.order) qs.set('order', params.order);

  const data = await wpFetchJson<any>(`${WP_TUNGLAM_API}/posts?${qs.toString()}`, params.revalidate);
  const rawPosts = Array.isArray(data) ? data : data?.posts || [];
  const normalized = rawPosts.map((p: any) => normalizeWpPost(p, 'post'));
  return enrichPostsWithSlugs(normalized, 'post', params.revalidate);
}

/** Lấy chi tiết 1 bài viết theo ID số của WordPress. */
export async function getWpPostById(
  wpId: number,
  revalidate: number = WP_REVALIDATE_SECONDS
): Promise<WpPost | null> {
  if (!wpId) return null;
  const data = await wpFetchJson<any>(`${WP_TUNGLAM_API}/posts/${wpId}`, revalidate);
  const raw = Array.isArray(data) ? data[0] : data?.posts?.[0] || data;
  if (!raw || !raw.id) return null;
  const [post] = await enrichPostsWithSlugs([normalizeWpPost(raw, 'post')], 'post', revalidate);
  return post;
}

/**
 * Lấy chi tiết bài viết theo slug: tra ID qua `wp/v2` rồi lấy chi tiết từ `tunglam/v1`
 * (đúng hợp đồng API, tránh gọi sai `/posts/{slug}` như trước đây).
 */
export async function getWpPostBySlug(
  slug: string,
  revalidate: number = WP_REVALIDATE_SECONDS
): Promise<WpPost | null> {
  if (!slug) return null;

  try {
    const rows = await wpFetchJson<any[]>(
      `${WP_V2_API}/posts?slug=${encodeURIComponent(slug)}&per_page=1&_fields=id,slug,modified`,
      revalidate
    );
    const found = Array.isArray(rows) ? rows[0] : null;
    if (found?.id) {
      const detail = await getWpPostById(Number(found.id), revalidate);
      if (detail) return { ...detail, slug: found.slug || detail.slug };
    }
  } catch {
    // Chuyển sang phương án quét danh sách bên dưới
  }

  // Fallback: quét danh sách bài viết theo slug suy ra từ link
  const posts = await getWpPosts({ postsPerPage: 100, revalidate });
  return posts.find((p) => p.slug === slug) || null;
}

/** Lấy bài viết liên quan theo ID bài gốc. */
export async function getWpRelatedPosts(
  wpId: number,
  postsPerPage = 8,
  revalidate: number = WP_REVALIDATE_SECONDS
): Promise<WpPost[]> {
  if (!wpId) return [];
  try {
    const data = await wpFetchJson<any>(
      `${WP_TUNGLAM_API}/posts/related/${wpId}?posts_per_page=${postsPerPage}`,
      revalidate
    );
    const rawPosts = Array.isArray(data) ? data : data?.posts || [];
    return enrichPostsWithSlugs(
      rawPosts.map((p: any) => normalizeWpPost(p, 'post')),
      'post',
      revalidate
    );
  } catch {
    return [];
  }
}

/** Lấy danh sách danh mục (xử lý đúng định dạng `{ value: [...] }` của plugin). */
export async function getWpCategories(
  revalidate: number = WP_REVALIDATE_SECONDS
): Promise<WpCategory[]> {
  const data = await wpFetchJson<any>(`${WP_TUNGLAM_API}/categories`, revalidate);
  const rows: any[] = Array.isArray(data) ? data : data?.value || [];
  return rows.map((c: any) => ({
    termId: c.term_id ?? c.id,
    name: c.name || '',
    slug: c.slug || '',
    count: c.count || 0,
    description: c.description || '',
    iconUrl: c.anh_dai_dien?.url || c.acf?.anh_dai_dien?.url || '',
    link: c.link || c.url || '',
  }));
}

export interface GetWpTongChiParams {
  postsPerPage?: number;
  paged?: number;
  categoryId?: string | number;
  search?: string;
  orderby?: 'ID' | 'title' | 'date' | 'rand';
  order?: 'ASC' | 'DESC';
  revalidate?: number;
}

/** Lấy danh sách bài Tông Chỉ (CPT `tong-chi`). */
export async function getWpTongChi(params: GetWpTongChiParams = {}): Promise<WpPost[]> {
  const qs = new URLSearchParams();
  qs.set('posts_per_page', String(params.postsPerPage ?? 100));
  qs.set('paged', String(params.paged ?? 1));
  if (params.categoryId) qs.set('category_id', String(params.categoryId));
  if (params.search) qs.set('search', params.search);
  if (params.orderby) qs.set('orderby', params.orderby);
  if (params.order) qs.set('order', params.order);

  const data = await wpFetchJson<any>(`${WP_TUNGLAM_API}/tong-chi?${qs.toString()}`, params.revalidate);
  const rawPosts = Array.isArray(data) ? data : data?.posts || [];
  const normalized = rawPosts.map((p: any) => normalizeWpPost(p, 'tong-chi'));
  return enrichPostsWithSlugs(normalized, 'tong-chi', params.revalidate);
}

/** Lấy chi tiết 1 bài Tông Chỉ theo ID. */
export async function getWpTongChiById(
  wpId: number,
  revalidate: number = WP_REVALIDATE_SECONDS
): Promise<WpPost | null> {
  if (!wpId) return null;
  const data = await wpFetchJson<any>(`${WP_TUNGLAM_API}/tong-chi/${wpId}`, revalidate);
  const raw = Array.isArray(data) ? data[0] : data?.posts?.[0] || data;
  if (!raw || !raw.id) return null;
  const [post] = await enrichPostsWithSlugs([normalizeWpPost(raw, 'tong-chi')], 'tong-chi', revalidate);
  return post;
}

/** Lấy danh mục Tông Chỉ. */
export async function getWpDanhMucTongChi(
  revalidate: number = WP_REVALIDATE_SECONDS
): Promise<WpCategory[]> {
  const data = await wpFetchJson<any>(`${WP_TUNGLAM_API}/danh-muc-tong-chi`, revalidate);
  const rows: any[] = Array.isArray(data) ? data : data?.value || [];
  return rows.map((c: any) => ({
    termId: c.term_id ?? c.id,
    name: c.name || '',
    slug: c.slug || '',
    count: c.count || 0,
    description: c.description || '',
    iconUrl: c.anh_dai_dien?.url || c.acf?.anh_dai_dien?.url || '',
    link: c.link || c.url || '',
  }));
}

/** Lấy tên tác giả theo ID (lỗi thì trả rỗng, không chặn luồng). */
export async function getWpAuthorName(
  authorId?: number,
  revalidate: number = 3600
): Promise<string> {
  if (!authorId) return '';
  try {
    const user = await wpFetchJson<any>(`${WP_V2_API}/users/${authorId}?_fields=name`, revalidate);
    return user?.name || '';
  } catch {
    return '';
  }
}
