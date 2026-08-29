import { TongChiPageData, ACFTongChiSection, ACFCardItem } from '@/types/tong-chi-tu-hoc';

const WP_URL = 'https://tunglam.mocwp.com/wp-json';

// Hàm phụ bóc tách URL ảnh linh hoạt
function extractImageUrl(imageField: any, fallback = ''): string {
  if (!imageField) return fallback;
  if (typeof imageField === 'string') return imageField;
  if (typeof imageField === 'object' && imageField.url) return imageField.url;
  return fallback;
}

export async function getTongChiPageData(): Promise<TongChiPageData> {
  try {
    // 1. Lấy thông tin trang chính (ID 388) làm Hero Banner & Tiêu đề
    let resPage = await fetch(`${WP_URL}/wp/v2/tong-chi/388?_embed`, {
      next: { revalidate: 60 },
    });
    if (!resPage.ok) {
      resPage = await fetch(`${WP_URL}/wp/v2/tong-chi-tu-hoc/388?_embed`, {
        next: { revalidate: 60 },
      });
    }
    const pageObj = resPage.ok ? await resPage.json() : null;

    const heroBanner =
      pageObj?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      extractImageUrl(pageObj?.acf?.banner_image) ||
      'https://tunglam.mocwp.com/wp-content/uploads/2026/07/bg-chua.jpg';

    const pageTitle = pageObj?.title?.rendered || pageObj?.acf?.main_title || 'TÔNG CHỈ TU HỌC';
    const pageSubtitle = pageObj?.acf?.sub_title || 'TÙNG LÂM HÒA PHÚC';

    // 2. Lấy tất cả bài viết thuộc CPT "Tông Chỉ" kèm theo thông tin Taxonomy (_embed)
    const resPosts = await fetch(`${WP_URL}/wp/v2/tong-chi?_embed&per_page=100`, {
      next: { revalidate: 60 },
    });
    const posts = resPosts.ok ? await resPosts.json() : [];

    // Map để gom các bài viết theo Taxonomy (Danh mục)
    const sectionsMap: { [taxonomySlug: string]: ACFTongChiSection } = {};

    posts
      .filter((p: any) => p.id !== 388) // Bỏ qua trang chính Hero Banner
      .forEach((p: any) => {
        const acf = p.acf || {};

        // Bóc tách thông tin Taxonomy (Danh mục) được gắn vào bài viết này
        const embeddedTerms = p._embedded?.['wp:term']?.flat() || [];
        const primaryTerm = embeddedTerms[0] || {
          slug: 'tong-phong-truyen-thua',
          name: 'TÔNG PHONG TRUYỀN THỪA',
          term_id: 1,
        };

        const sectionId = primaryTerm.slug;
        const sectionTitle = primaryTerm.name;

        // Nếu Danh mục này chưa có trong Map thì tạo mới Khối Section
        if (!sectionsMap[sectionId]) {
          sectionsMap[sectionId] = {
            id: sectionId,
            stt: Number(primaryTerm.term_id || 1),
            title: sectionTitle.toUpperCase(),
            subtitle: '',
            cards: [],
          };
        }

        // Tạo Thẻ Card cho bài viết này (Miền Nam Chốn Tổ, Tiếp Bước Thầy Tôi,...)
        const cardItem: ACFCardItem = {
          id: p.id,
          title: p.title?.rendered || '',
          subtitle: acf.sub_title || p.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '',
          imageUrl:
            extractImageUrl(acf.banner_image) ||
            p._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
          link: `/tong-chi-tu-hoc/${p.slug}`,
        };

        // Đẩy Thẻ Card vào đúng Danh mục của nó
        sectionsMap[sectionId].cards.push(cardItem);
      });

    const sections = Object.values(sectionsMap).sort((a, b) => a.stt - b.stt);

    return {
      pageTitle,
      pageSubtitle,
      heroBannerUrl: heroBanner,
      sections,
    };
  } catch (error) {
    console.error('Lỗi khi gọi API WordPress Tông Chỉ:', error);
    return {
      pageTitle: 'TÔNG CHỈ TU HỌC',
      pageSubtitle: 'TÙNG LÂM HÒA PHÚC',
      heroBannerUrl: '',
      sections: [],
    };
  }
}

import { HOANG_PHAP_ARTICLES, HoangPhapArticle } from '@/data/dong-chay-hoang-phap-data';

export async function getHoangPhapArticles(): Promise<HoangPhapArticle[]> {
  try {
    const res = await fetch(`${WP_URL}/wp/v2/posts?_embed&per_page=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return HOANG_PHAP_ARTICLES;
    }
    const wpPosts = await res.json();
    if (!Array.isArray(wpPosts) || wpPosts.length === 0) {
      return HOANG_PHAP_ARTICLES;
    }

    const fetched: HoangPhapArticle[] = wpPosts.map((p: any) => {
      const featuredMedia = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      const term = p._embedded?.['wp:term']?.flat()?.[0];
      const categorySlug = term?.slug || 'khoa-le-truyen-thong';
      const subCategory = term?.name || 'DÒNG CHẢY HOẰNG PHÁP';

      return {
        id: String(p.id),
        slug: p.slug,
        title: p.title?.rendered || 'Phật Sự Tùng Lâm Hòa Phúc',
        subtitle: p.acf?.sub_title || p.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim().slice(0, 100),
        category: categorySlug,
        subCategory: subCategory.toUpperCase(),
        subCategoryIcon: '🪔',
        templeLogo: 'tung-lam-hoa-phuc',
        templeName: 'Tùng Lâm Hòa Phúc',
        thumbnailUrl: featuredMedia || '/images/toan-canh-chua.jpg',
        bannerUrl: featuredMedia || '/images/toan-canh-chua.jpg',
        date: p.date ? new Date(p.date).toLocaleDateString('vi-VN') : '2025',
        views: p.acf?.views || 350,
        author: p.acf?.author || 'Ban Truyền Thông',
        location: p.acf?.location || 'Tùng Lâm Hòa Phúc',
        summary: p.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '',
        contentHtml: p.content?.rendered || '',
      };
    });

    return [...fetched, ...HOANG_PHAP_ARTICLES];
  } catch (error) {
    console.error('Lỗi khi fetch bài viết Hoằng Pháp từ WordPress:', error);
    return HOANG_PHAP_ARTICLES;
  }
}

export async function getHoangPhapArticleBySlug(slug: string): Promise<HoangPhapArticle | null> {
  try {
    const res = await fetch(`${WP_URL}/wp/v2/posts?slug=${slug}&_embed`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const posts = await res.json();
      if (Array.isArray(posts) && posts.length > 0) {
        const p = posts[0];
        const featuredMedia = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        const term = p._embedded?.['wp:term']?.flat()?.[0];
        return {
          id: String(p.id),
          slug: p.slug,
          title: p.title?.rendered || '',
          subtitle: p.acf?.sub_title,
          category: term?.slug || 'khoa-le-truyen-thong',
          subCategory: (term?.name || 'DÒNG CHẢY HOẰNG PHÁP').toUpperCase(),
          subCategoryIcon: '🪔',
          templeLogo: 'tung-lam-hoa-phuc',
          templeName: 'Tùng Lâm Hòa Phúc',
          thumbnailUrl: featuredMedia || '/images/toan-canh-chua.jpg',
          bannerUrl: featuredMedia || '/images/toan-canh-chua.jpg',
          date: p.date ? new Date(p.date).toLocaleDateString('vi-VN') : '2025',
          views: p.acf?.views || 350,
          author: p.acf?.author || 'Ban Truyền Thông',
          location: p.acf?.location || 'Tùng Lâm Hòa Phúc',
          summary: p.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '',
          contentHtml: p.content?.rendered || '',
        };
      }
    }
  } catch (error) {
    console.error('Lỗi khi fetch bài viết chi tiết từ WP:', error);
  }

  // Fallback to static articles
  return HOANG_PHAP_ARTICLES.find((a) => a.slug === slug) || null;
}

