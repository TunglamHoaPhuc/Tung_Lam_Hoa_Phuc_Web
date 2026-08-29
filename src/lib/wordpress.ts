/**
 * WordPress REST API Client for Tung Lam Hoa Phuc Web
 * Handles fetching posts, categories, and custom ACF fields (Quotes, Annotations, Audio, S3 Images)
 */

export interface WordPressPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  modified: string;
  featured_media_url?: string;
  // ACF (Advanced Custom Fields)
  acf?: {
    author?: string;
    quote?: string;
    quote_author?: string;
    audio_url?: string;
    video_url?: string;
    temple_location?: string;
    annotations?: Array<{
      keyword: string;
      title?: string;
      description?: string;
      image_url?: string;
    }>;
  };
}

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://demo.chuahoaphuc.com/wp-json/wp/v2';

/**
 * Lấy danh sách bài viết từ WordPress
 */
export async function getWordPressPosts(params?: {
  per_page?: number;
  page?: number;
  categories?: number[];
  search?: string;
}): Promise<WordPressPost[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.categories) searchParams.set('categories', params.categories.join(','));
    if (params?.search) searchParams.set('search', params.search);
    searchParams.set('_embed', 'true');

    const res = await fetch(`${WP_API_URL}/posts?${searchParams.toString()}`, {
      next: { revalidate: 60 }, // ISR Cache 60s
    });

    if (!res.ok) {
      console.error('Failed to fetch WordPress posts:', res.statusText);
      return [];
    }

    const posts = await res.json();
    return posts.map(transformWordPressPost);
  } catch (error) {
    console.error('Error fetching from WordPress API:', error);
    return [];
  }
}

/**
 * Lấy chi tiết 1 bài viết theo Slug
 */
export async function getWordPressPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed=true`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const posts = await res.json();
    if (!posts || posts.length === 0) return null;

    return transformWordPressPost(posts[0]);
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Chuẩn hóa dữ liệu bài viết từ WordPress
 */
function transformWordPressPost(post: any): WordPressPost {
  const featuredMedia =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    post.featured_media_url ||
    '';

  return {
    id: post.id,
    slug: post.slug,
    title: { rendered: post.title?.rendered || '' },
    content: { rendered: post.content?.rendered || '' },
    excerpt: { rendered: post.excerpt?.rendered || '' },
    date: post.date,
    modified: post.modified,
    featured_media_url: featuredMedia,
    acf: post.acf || {},
  };
}
