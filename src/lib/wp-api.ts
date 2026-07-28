import { TongChiPageData, ACFTongChiSection, ACFCardItem } from '@/types/tong-chi';

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
    const resPage = await fetch(`${WP_URL}/wp/v2/tong-chi/388?_embed`, {
      next: { revalidate: 60 },
    });
    const pageObj = resPage.ok ? await resPage.json() : null;

    const heroBanner =
      extractImageUrl(pageObj?.acf?.banner_image) ||
      pageObj?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80';

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
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80',
          link: `/tong-chi/${p.slug}`,
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