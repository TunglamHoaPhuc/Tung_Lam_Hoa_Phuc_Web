/**
 * Tung Lam API Client
 * Ket noi toi backend WordPress admin.tunglamhoaphuc.com
 * Namespace: tunglam/v1 | 11 endpoints
 * 
 * Cau truc du lieu API thuc te:
 * - featured_image_urls.medium/large/full
 * - categories[].name, categories[].slug
 * - noi_dung_tom_tat (excerpt tieng Viet)
 * - acf.noi_dung_tom_tat
 */

const ADMIN_WP_URL = 'https://admin.tunglamhoaphuc.com/wp-json/tunglam/v1';

// Types

export interface TungLamPost {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  date: string;
  thumbnailUrl: string;
  category?: string;
  categorySlug?: string;
  views?: number;
  author?: string;
}

export interface TungLamCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
  iconUrl?: string;
}

export interface TungLamTongChi {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  imageUrl: string;
  categoryName?: string;
  categorySlug?: string;
}

// Helper

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${ADMIN_WP_URL}${path}`, {
      next: { revalidate: 60 },
      ...options,
    });
    if (!res.ok) {
      console.error('[TungLam API]', path, 'failed:', res.status, res.statusText);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('[TungLam API]', path, 'error:', err);
    return null;
  }
}

// Posts

export async function getTungLamPosts(params?: {
  per_page?: number;
  page?: number;
  category_slug?: string;
  search?: string;
}): Promise<TungLamPost[]> {
  const qs = new URLSearchParams();
  if (params?.per_page) qs.set('per_page', String(params.per_page));
  if (params?.page) qs.set('page', String(params.page));
  if (params?.category_slug) qs.set('category_slug', params.category_slug);
  if (params?.search) qs.set('search', params.search);

  const data = await apiFetch<any>('/posts?' + qs.toString());
  if (!data) return [];
  const posts = Array.isArray(data) ? data : (data.posts || []);
  return posts.map(transformPost);
}

export async function getTungLamPostBySlug(slug: string): Promise<TungLamPost | null> {
  const data = await apiFetch<any>('/posts/' + slug);
  if (!data) return null;
  // API tra ve object hoac mang
  const post = Array.isArray(data) ? data[0] : data;
  if (!post) return null;
  return transformPost(post);
}

// Categories

export async function getTungLamCategories(): Promise<TungLamCategory[]> {
  const data = await apiFetch<any[]>('/categories');
  if (!data || !Array.isArray(data)) return [];
  return data.map((c) => ({
    id: c.term_id || c.id,
    name: c.name || '',
    slug: c.slug || '',
    count: c.count || 0,
    description: c.description || '',
    iconUrl: c.anh_dai_dien?.url || c.acf?.anh_dai_dien?.url || '',
  }));
}

// Tong Chi

export async function getTungLamTongChi(params?: {
  per_page?: number;
  category_slug?: string;
}): Promise<TungLamTongChi[]> {
  const qs = new URLSearchParams();
  if (params?.per_page) qs.set('per_page', String(params.per_page));
  if (params?.category_slug) qs.set('category_slug', params.category_slug);

  const data = await apiFetch<any>('/tong-chi?' + qs.toString());
  if (!data) return [];
  const posts = Array.isArray(data) ? data : (data.posts || []);
  return posts.map(transformTongChi);
}

export async function getTungLamDanhMucTongChi(): Promise<TungLamCategory[]> {
  const data = await apiFetch<any[]>('/danh-muc-tong-chi');
  if (!data || !Array.isArray(data)) return [];
  return data.map((c) => ({
    id: c.term_id || c.id,
    name: c.name || '',
    slug: c.slug || '',
    count: c.count || 0,
    description: c.description || '',
    iconUrl: c.anh_dai_dien?.url || '',
  }));
}

// Transform Helpers

function transformPost(p: any): TungLamPost {
  const imgUrls = p.featured_image_urls || {};
  const thumbnailUrl =
    imgUrls.large || imgUrls.medium || imgUrls.thumbnail ||
    imgUrls.full || '/images/toan-canh-chua.jpg';

  const firstCat = Array.isArray(p.categories) ? p.categories[0] : null;

  return {
    id: p.id,
    slug: p.slug || '',
    title: p.title?.rendered || p.title || '',
    subtitle: p.acf?.noi_dung_tom_tat || p.noi_dung_tom_tat || '',
    content: p.content?.rendered || p.content?.raw || '',
    excerpt: p.noi_dung_tom_tat || p.acf?.noi_dung_tom_tat || p.excerpt?.rendered || '',
    date: p.date || p.modified_date || '',
    thumbnailUrl,
    category: firstCat?.name || '',
    categorySlug: firstCat?.slug || '',
    views: p.acf?.views || p.views || 108,
    author: p.acf?.author || 'Ban Truyen Thong',
  };
}

function transformTongChi(p: any): TungLamTongChi {
  const imgUrls = p.featured_image_urls || {};
  const imageUrl =
    imgUrls.large || imgUrls.medium || imgUrls.thumbnail ||
    imgUrls.full ||
    'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp';

  const firstCat = Array.isArray(p.categories) ? p.categories[0] : null;

  return {
    id: p.id,
    slug: p.slug || '',
    title: p.title?.rendered || p.title || '',
    subtitle: p.acf?.noi_dung_tom_tat || p.noi_dung_tom_tat || '',
    content: p.content?.rendered || p.content?.raw || '',
    imageUrl,
    categoryName: firstCat?.name || '',
    categorySlug: firstCat?.slug || '',
  };
}
