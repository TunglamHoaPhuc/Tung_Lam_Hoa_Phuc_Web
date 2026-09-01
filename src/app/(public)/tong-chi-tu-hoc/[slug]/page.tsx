'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';

// Import các khối Tiếng Việt đã bóc tách
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { FeaturedPosts } from '@/components/tong-chi-tu-hoc/chi-tiet/FeaturedPosts';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';
import { AiQnA } from '@/components/tong-chi-tu-hoc/chi-tiet/AiQnA';
import { DetailModal } from '@/components/tong-chi-tu-hoc/chi-tiet/DetailModal';
import { BookCitationSection, SourceBookData } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';

interface DuLieuBaiVietChiTiet {
  id: number;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  heroBanner: string;
  bannerPosition?: string;
  poemContent?: string;
  author?: string;
  authorLink?: string;
  sourceBook?: SourceBookData | SourceBookData[];
  popups?: Array<{
    keyword: string;
    title: string;
    description: string;
    imageUrl?: string;
    linkUrl?: string;
  }>;
  videoBlock?: {
    title?: string;
    description?: string;
    videoUrl?: string;
  };
  featuredArticle?: {
    label?: string;
    title?: string;
    author?: string;
    bgImage?: string;
    bgPosition?: string;
    linkUrl?: string;
  };
  photoGallery?: Array<{
    imageUrl?: string;
    url?: string;
    title?: string;
    caption?: string;
    space3dLink?: string;
    khuVuc?: string;
    noiDung?: string;
  }>;
  relatedArticles?: Array<{
    category: string;
    title: string;
    url: string;
    link?: string;
  }>;
}

// 🪷 Parser biến mã HTML WordPress Gutenberg thành Markdown/Clean format chuẩn cho InfographicArticleRenderer
function convertWpHtmlToCleanContent(wpRawHtml: string): { cleanedContent: string; extractedSubtitle?: string } {
  if (!wpRawHtml) return { cleanedContent: '' };

  let html = wpRawHtml
    .replace(/&#8211;/g, '–')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC');

  // 1. Bóc tách thẻ phụ (Subtitle)
  let extractedSubtitle: string | undefined = undefined;
  const firstP = html.match(/^<p[^>]*>(?:<em><strong>|<strong><em>|<em>|<strong>)([\s\S]*?)(?:<\/strong><\/em>|<\/em><\/strong>|<\/em>|<\/strong>)<\/p>/i);
  if (firstP) {
    const rawSub = firstP[1].replace(/<[^>]+>/g, '').trim();
    if (rawSub.length > 0 && rawSub.length < 80 && !rawSub.includes('“') && !rawSub.includes('”')) {
      extractedSubtitle = rawSub;
      html = html.replace(firstP[0], '');
    }
  }

  // 2. Headings
  html = html.replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, (_m, inner) => {
    const cleanText = inner.replace(/<[^>]+>/g, '').replace(/^\*\*|\*\*$/g, '').trim();
    return `\n\n### ${cleanText}\n\n`;
  });

  // 3. Blockquotes chuẩn của WordPress Gutenberg
  html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, bqInner) => {
    const clean = bqInner
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/^[“"”\s]+|[“"”\s]+$/g, '');
    const lines = clean.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const quoteLines = lines.map((l: string) => `> ${l}`);
    return `\n\n${quoteLines.join('\n')}\n\n`;
  });

  // 4. Khối Hình Ảnh WordPress Gutenberg (<figure>...<img ...>...<figcaption>...</figcaption>...</figure>)
  html = html.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_m, figInner) => {
    const srcMatch = figInner.match(/src=["']([^"']+)["']/i);
    const altMatch = figInner.match(/alt=["']([^"']*)["']/i);
    const capMatch = figInner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const src = srcMatch ? srcMatch[1] : '';
    const caption = capMatch ? capMatch[1].replace(/<[^>]+>/g, '').trim() : (altMatch ? altMatch[1].trim() : '');
    if (!src) return '';
    return `\n\n![${caption}](${src})\n\n`;
  });

  // 5. Ảnh thông thường dạng standalone <img>
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '\n\n![$2]($1)\n\n');
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');

  // 6. HR (Loại bỏ hoàn toàn, không chèn dấu gạch thừa)
  html = html.replace(/<hr[^>]*\/?>/gi, '\n\n');

  // 7. Quotes dạng đoạn văn in đậm có ngoặc kép
  html = html.replace(/<p[^>]*><strong><em>[“"”]?([\s\S]*?)[”"”]?<\/em><\/strong><\/p>/gi, (_m, quoteText) => {
    const lines = quoteText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '').split('\n');
    const quoteLines = lines.map((l: string) => `> ${l.trim()}`).filter((l: string) => l !== '>');
    return `\n\n${quoteLines.join('\n')}\n\n`;
  });

  html = html.replace(/<p[^>]*><strong>[“"”]?([\s\S]*?)[”"”]?<\/strong><\/p>/gi, (_m, quoteText) => {
    if (quoteText.includes('“') || quoteText.includes('”') || quoteText.includes('Con nguyện') || quoteText.includes('Sống là cống hiến') || quoteText.includes('Sống Là Cống Hiến')) {
      const lines = quoteText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '').split('\n');
      const quoteLines = lines.map((l: string) => `> ${l.trim()}`).filter((l: string) => l !== '>');
      return `\n\n${quoteLines.join('\n')}\n\n`;
    }
    return `\n\n**${quoteText.replace(/<[^>]+>/g, '').trim()}**\n\n`;
  });

  // 8. Tác giả
  html = html.replace(/<p[^>]*>(?:<em>)?(Vô Trí\s*[-–]\s*Tâm Hòa|Sa Môn Vô Trí[^\n<]*)(?:<\/em>)?<\/p>/gi, '\n\n*$1*\n\n');

  // 9. Paragraphs
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, (_m, pText) => {
    const cleanP = pText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '').trim();
    if (!cleanP) return '';
    return `\n\n${cleanP}\n\n`;
  });

  // 10. Clean markdown & Loại bỏ các dòng ghi chú dàn bài thừa & đường gạch phân cách
  html = html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '');

  const cleanedLines = html
    .split('\n')
    .filter((l) => {
      const trimmed = l.trim();
      if (!trimmed) return true;
      if (/^(?:-{2,}|\*{2,}|_{2,}|\u2014{2,})$/.test(trimmed)) return false;
      if (/^Infographic\s*\d*\s*card/i.test(trimmed)) return false;
      if (/^\d*\s*Ngăn\s*kéo\s*card/i.test(trimmed)) return false;
      if (/^Click\s*ra\s*trang\s*chi\s*tiết/i.test(trimmed)) return false;
      if (/^QUOTE\s*CUỐI\s*TRANG/i.test(trimmed)) return false;
      if (/^TÀI\s*LIỆU\s*THAM\s*KHẢO/i.test(trimmed)) return false;
      if (trimmed === '↓' || trimmed === '->' || trimmed === '-->') return false;
      return true;
    })
    .join('\n');

  const finalHtml = cleanedLines.replace(/\n{3,}/g, '\n\n').trim();

  return { cleanedContent: finalHtml, extractedSubtitle };
}

// 🛠️ 1. Hàm định dạng HTML nội dung bài thơ
function formatContentHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  let clean = rawHtml
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC')
    .trim();

  if (!clean.startsWith('<p>')) clean = `<p>${clean}</p>`;
  return clean;
}

// 🛠️ 2. HÀM QUY ĐỔI MEDIA ID THÀNH URL ẢNH THẬT (XỬ LÝ THUẦN NEXT.JS)
async function resolveImageUrl(imgField: any, fallbackUrl: string = ''): Promise<string> {
  if (!imgField) return fallbackUrl;

  if (typeof imgField === 'string' && imgField.length > 0) {
    if (imgField.startsWith('http') || imgField.startsWith('/')) return imgField;
  }

  if (typeof imgField === 'object' && imgField !== null) {
    return (
      imgField.url ||
      imgField.source_url ||
      imgField.sizes?.large ||
      imgField.sizes?.full ||
      fallbackUrl
    );
  }

  const numericId = Number(imgField);
  if (!isNaN(numericId) && numericId > 0) {
    try {
      const res = await fetch(`https://admin.tunglamhoaphuc.com/wp-json/wp/v2/media/${numericId}`);
      if (res.ok) {
        const mediaData = await res.json();
        return (
          mediaData.source_url ||
          mediaData.media_details?.sizes?.large?.source_url ||
          mediaData.media_details?.sizes?.full?.source_url ||
          fallbackUrl
        );
      }
    } catch (err) {
      console.error('❌ Lỗi khi tự động tra cứu Media ID:', numericId, err);
    }
  }

  return fallbackUrl;
}

// 🛠️ 3. Hàm làm sạch nội dung chữ (Xóa thẻ HTML)
function cleanPopupDescription(rawHtml: string): string {
  if (!rawHtml) return 'Đang cập nhật thông tin giải nghĩa...';
  return rawHtml
    .replace(/<[^>]+>/g, '')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC')
    .trim();
}

export default function TrangChiTietTongChi() {
  const params = useParams();
  const slug = params?.slug as string;

  const isBoDeTam = slug === 'bo-de-tam-coi-nguon-thien-phap' || slug === 'bo-de-tam';

  const [data, setData] = useState<DuLieuBaiVietChiTiet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // 🪷 Tự động trích xuất các đề mục từ nội dung bài viết để tạo Menu điều hướng & Mục lục chuẩn xác 100%
  const navItems = React.useMemo(() => {
    const items: Array<{ id: string; label: string }> = [];

    if (data?.poemContent) {
      const lines = data.poemContent.split('\n');
      for (const l of lines) {
        const line = l.trim();
        const isMdHeading = /^#{1,4}\s+/.test(line);
        const isUpperHeading =
          (line.startsWith('BỒ ĐỀ TÂM') ||
            line.startsWith('SỐNG VỚI') ||
            line.startsWith('ĐỂ BỒ ĐỀ TÂM') ||
            line.startsWith('TAM QUY') ||
            line.startsWith('NGŨ GIỚI')) &&
          line.length < 80 &&
          !line.includes('“') &&
          !line.includes('”') &&
          !line.startsWith('!');

        if (isMdHeading || isUpperHeading) {
          const cleanHeading = line.replace(/^#{1,4}\s+/, '').trim();
          const id = cleanHeading
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          if (id && !items.some((it) => it.id === id)) {
            const label = cleanHeading.length > 32 ? cleanHeading.slice(0, 30) + '...' : cleanHeading;
            items.push({ id, label });
          }
        }
      }
    }

    if (items.length === 0) {
      items.push({ id: 'bai-tho', label: 'Bài Thơ / Nội Dung' });
    }

    if (data?.sourceBook) {
      items.push({ id: 'trich-nguon-sach', label: 'Trích Nguồn Sách' });
    }
    if (data?.videoBlock?.videoUrl) {
      items.push({ id: 'video-minh-hoa', label: 'Video Pháp Thoại' });
    }
    if (data?.featuredArticle?.title) {
      items.push({ id: 'bai-viet-noibat', label: 'Bài Viết Nổi Bật' });
    }
    if (data?.photoGallery && data.photoGallery.length > 0) {
      items.push({ id: 'bo-suu-tap-anh', label: 'Bộ Sưu Tập Ảnh' });
    }
    items.push({ id: 'tim-hieu-them', label: 'Bài Viết Liên Quan' });

    return items;
  }, [data]);

  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    if (navItems.length > 0 && !navItems.some((it) => it.id === activeSection)) {
      setActiveSection(navItems[0].id);
    }
  }, [navItems, activeSection]);

  const sidebarTitle = isBoDeTam
    ? 'BỒ ĐỀ TÂM'
    : (data?.title || 'TÔNG CHỈ TU HỌC').length > 18
    ? (data?.title || 'TÔNG CHỈ TU HỌC').split('-')[0].trim()
    : (data?.title || 'TÔNG CHỈ TU HỌC');

  const [activeKeywordPopup, setActiveKeywordPopup] = useState<{
    keyword: string;
    title: string;
    description: string;
    imageUrl?: string;
    linkUrl?: string;
  } | null>(null);

  const handlePrevPhoto = () => {
    if (activePhotoIndex !== null && data?.photoGallery) {
      setActivePhotoIndex(activePhotoIndex === 0 ? data.photoGallery.length - 1 : activePhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (activePhotoIndex !== null && data?.photoGallery) {
      setActivePhotoIndex(activePhotoIndex === data.photoGallery.length - 1 ? 0 : activePhotoIndex + 1);
    }
  };

  useEffect(() => {
    async function fetchDetailData() {
      try {
        setLoading(true);

        // 1. Lấy dữ liệu quản trị từ Admin Database (Hero Banner & Tọa độ tiêu điểm căn chỉnh 3x3)
        let localItem: any = null;
        let computedRelated: any[] = [];
        try {
          const [detailRes, allRes] = await Promise.all([
            fetch(`/api/admin/tong-chi/${slug}`, { cache: 'no-store' }),
            fetch('/api/admin/tong-chi', { cache: 'no-store' }),
          ]);

          if (detailRes.ok) {
            const localData = await detailRes.json();
            if (localData.success && localData.data) {
              localItem = localData.data;
            }
          }

          if (allRes.ok) {
            const allData = await allRes.json();
            if (allData.success && Array.isArray(allData.data)) {
              const currentCat = localItem?.category || 'tong-phong-truyen-thua';
              const others = allData.data.filter((a: any) => a.slug !== slug && a.id !== localItem?.id);
              const sameCat = others.filter((a: any) => a.category === currentCat);
              const diffCat = others.filter((a: any) => a.category !== currentCat);
              const combined = [...sameCat, ...diffCat];

              computedRelated = combined.slice(0, 8).map((art: any) => ({
                category: (art.categoryName || art.category || 'TÔNG CHỈ TU HỌC').toUpperCase(),
                title: art.title,
                url: art.bannerImage || '/images/toan-canh-chua.jpg',
                link: `/tong-chi-tu-hoc/${art.slug}`,
              }));
            }
          }
        } catch (localErr) {
          console.log('Local fetch failed:', localErr);
        }

        // 2. Lấy nội dung bài viết trực tiếp từ WordPress Live API
        const isNumericId = /^\d+$/.test(slug);
        const wpTargetId = isBoDeTam ? '470' : (localItem?.wpPostId || slug);
        const wpUrl = isNumericId || isBoDeTam || localItem?.wpPostId
          ? `https://admin.tunglamhoaphuc.com/wp-json/wp/v2/tong-chi/${wpTargetId}?_embed`
          : `https://admin.tunglamhoaphuc.com/wp-json/wp/v2/tong-chi?slug=${slug}&_embed`;

        let wpContent = '';
        let wpTitle = '';
        let wpSubtitle = '';
        let wpExcerpt = '';
        let wpVideoUrl = '';

        try {
          const res = await fetch(wpUrl, { cache: 'no-store' });
          if (res.ok) {
            const rawData = await res.json();
            const post = (isNumericId || isBoDeTam || localItem?.wpPostId) ? rawData : (Array.isArray(rawData) && rawData.length > 0 ? rawData[0] : null);

            if (post && post.id) {
              const acf = post.acf || {};
              const rawHtml = post.content?.rendered || '';
              const parsed = convertWpHtmlToCleanContent(rawHtml);

              wpContent = parsed.cleanedContent;
              wpTitle = post.title?.rendered || '';
              wpSubtitle = acf.tieu_de_phu || parsed.extractedSubtitle || '';
              wpExcerpt = (post.excerpt?.rendered || '').replace(/<[^>]+>/g, '').replace(/&#8230;/g, '...').trim();
              wpVideoUrl = acf.duong_dan_link_youtube || '';
            }
          }
        } catch (wpErr) {
          console.log('WordPress fetch failed, using local content:', wpErr);
        }

        // 3. Hợp nhất: Hero Banner lấy 100% từ Admin CMS, Nội dung lấy từ WordPress Gutenberg
        const finalBanner = localItem?.bannerImage || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/nen-tang-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp';
        const finalBannerPosition = localItem?.bannerPosition || 'center 47%';
        const finalContent = wpContent || localItem?.content || '';
        const finalTitle = localItem?.title || wpTitle || (isBoDeTam ? 'BỒ ĐỀ TÂM' : 'TÔNG CHỈ TU HỌC');
        const finalSubtitle = localItem?.subtitle || wpSubtitle || (isBoDeTam ? 'Cội nguồn thiện pháp' : '');

        const defaultSourceBooks = [
          {
            title: 'KHUYẾN PHÁT BỒ ĐỀ TÂM GIẢNG LUẬN',
            author: 'Đại Đức Thích Tâm Hòa',
            description: 'Bộ sách giảng giải chi tiết về tầm quan trọng và phương pháp phát khởi Bồ Đề tâm của người học Phật.',
            coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp',
            linkUrl: 'https://drive.google.com/file/d/1bIo3HRT7asCbIeVF_NTs5u4kqTGw3Ear/view?usp=sharing',
          },
          {
            title: 'ĐI QUA KHỔ VUI CUỘC ĐỜI (QUYỂN 01, 02, 03)',
            author: 'Sa Môn Vô Trí (hiệu Tâm Hòa)',
            description: 'Những chia sẻ chân thật và sâu sắc về hành trình tu học, vượt qua nghịch cảnh và kiến tạo đời sống an lạc.',
            coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/tong-chi-tu-hoc_tong-phong-truyen-thua_tiep-buoc-thay-toi_thay_-chu-thich-popup-sach-dqkvcd-1787464550735.jpg',
            linkUrl: '/vu-tru-phat-giao/tang-kinh-cac',
          },
          {
            title: 'LỜI ĐỨC PHẬT DẠY & CÁC BÀI GIẢNG',
            author: 'Tùng Lâm Hòa Phúc',
            description: 'Tập hợp các lời dạy căn bản của Đức Phật và các bài pháp thoại trong các khóa tu tại Tùng Lâm Hòa Phúc.',
            coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-hoang-phap--kien-an-tinh-hai-phong-1787463859334.jpg',
            linkUrl: 'https://www.youtube.com/playlist?list=PL2aRqXTU1nn456nh72vOF1W7Au764sTVN',
          },
        ];

        setData({
          id: localItem?.id || 4,
          title: finalTitle,
          subtitle: finalSubtitle,
          shortDescription: wpExcerpt || localItem?.excerpt || '',
          heroBanner: finalBanner,
          bannerPosition: finalBannerPosition,
          poemContent: finalContent,
          author: localItem?.author || 'Sa Môn Vô Trí (Thích Tâm Hòa)',
          authorLink: localItem?.authorLink || '/gioi-thieu/su-phu-tru-tri',
          sourceBook: localItem?.sourceBook || defaultSourceBooks,
          popups: (localItem?.keywords || []).map((k: any) => ({
            keyword: k.keyword,
            title: k.title,
            subtitle: k.subtitle,
            description: cleanPopupDescription(k.description || k.summary || ''),
            imageUrl: k.imageUrl || finalBanner,
            linkUrl: k.linkUrl || '',
          })),
          videoBlock: localItem?.videoBlock || {
            title: 'KHUYẾN PHÁT BỒ ĐỀ TÂM VĂN - TRỌN BỘ | ĐẠI ĐỨC THÍCH TÂM HÒA',
            description: 'Chư Phật ba đời không rời Bồ Đề tâm để thành tựu các pháp.',
            videoUrl: wpVideoUrl || 'https://www.youtube.com/playlist?list=PL2aRqXTU1nn456nh72vOF1W7Au764sTVN',
          },
          photoGallery: localItem?.photoGallery || [
            {
              title: 'LỄ TƯỞNG NIỆM KHAI SƠN TÔNG PHONG HOẰNG PHÁP',
              imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
              khuVuc: 'Bảo tàng',
              noiDung: 'Lễ Tưởng Niệm Khai Sơn Tông Phong Hoằng Pháp',
            },
          ],
          relatedArticles: computedRelated,
        });
        setLoading(false);
      } catch (err) {
        console.error('❌ Lỗi tải bài viết chi tiết:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchDetailData();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);

      const sectionIds = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 220;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🛠️ XỬ LÝ CLICK TỪ KHÓA BÔI ĐẶM
  const handlePoemContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const boldEl = target.closest('strong, b');

    if (boldEl) {
      const rawText = boldEl.textContent?.trim() || '';
      if (!rawText) return;

      const cleanClickedText = rawText.replace(/[.,;:]+$/, '').trim().toLowerCase();

      const matchedPopup = data?.popups?.find((p) => {
        const popupKeyword = (p.keyword || '').replace(/[.,;:]+$/, '').trim().toLowerCase();
        const popupTitle = (p.title || '').replace(/[.,;:]+$/, '').trim().toLowerCase();

        return (
          popupKeyword === cleanClickedText ||
          popupTitle === cleanClickedText ||
          (popupKeyword && cleanClickedText.includes(popupKeyword)) ||
          (cleanClickedText && popupKeyword.includes(cleanClickedText))
        );
      });

      if (matchedPopup) {
        setActiveKeywordPopup({
          keyword: matchedPopup.keyword || rawText,
          title: matchedPopup.title || rawText.toUpperCase(),
          description: matchedPopup.description || 'Chưa có thông tin chú thích.',
          imageUrl: matchedPopup.imageUrl || '',
          linkUrl: matchedPopup.linkUrl || '#',
        });
      } else {
        setActiveKeywordPopup({
          keyword: rawText,
          title: rawText.toUpperCase(),
          description: `Thông tin giải nghĩa chi tiết cho từ khóa "${rawText}".`,
          imageUrl: data?.heroBanner,
          linkUrl: '#',
        });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);

    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-130px 0px -50% 0px',
        threshold: 0,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, [navItems]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c1c11] flex items-center justify-center text-[#ffde59]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ffde59] border-t-transparent rounded-full animate-spin" />
          <p className="tracking-widest uppercase text-sm font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#2c1c11] text-[#FFE5A3] font-sans relative selection:bg-[#f2cc8f] selection:text-black overflow-x-hidden">
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={sidebarTitle}
        navItems={navItems}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={sidebarTitle}
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        {/* Banner chuyển đổi sang bản WP Live nếu là bài Bồ Đề Tâm */}
        {isBoDeTam && (
          <div className="max-w-5xl mx-auto my-3 p-3 bg-[#1C120A] border border-[#F2C14E]/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs text-[#FFE5A3]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span>Đang xem bản dữ liệu nội bộ. Bạn có thể mở <strong>Bản Live WordPress (Post 470)</strong> để vừa gõ trên WP vừa xem kết quả trực tiếp!</span>
            </div>
            <Link
              href="/tong-chi-tu-hoc/wp-preview"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] text-[#1A120B] text-xs font-bold shrink-0 transition-all hover:scale-105 shadow-md flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở Bản Live WordPress</span>
            </Link>
          </div>
        )}

        <HeroBanner bannerUrl={data?.heroBanner} bannerPosition={data?.bannerPosition} title={data?.title} subtitle={data?.subtitle} />

        <main className="max-w-5xl mx-auto pt-4 pb-16 space-y-16 w-full">
          {/* KHỐI BÀI THƠ / NỘI DUNG CHÍNH */}
          {/* KHỐI BÀI VIẾT / INFOGRAPHIC TRỰC QUAN / BÀI THƠ */}
          <section id="bai-tho" className="scroll-mt-24 relative pt-2">
            {data?.poemContent && (
              <InfographicArticleRenderer
                rawContent={data.poemContent}
                title={data.title}
                subtitle={data.subtitle}
                author={data.author}
                authorLink={data.authorLink}
                popups={data.popups}
                onKeywordClick={(kw) => {
                  const matchedPopup = data?.popups?.find((p) => {
                    const popupKeyword = (p.keyword || '').replace(/[.,;:]+$/, '').trim().toLowerCase();
                    const popupTitle = (p.title || '').replace(/[.,;:]+$/, '').trim().toLowerCase();
                    const cleanClickedText = kw.replace(/[.,;:]+$/, '').trim().toLowerCase();

                    return (
                      popupKeyword === cleanClickedText ||
                      popupTitle === cleanClickedText ||
                      (popupKeyword && cleanClickedText.includes(popupKeyword)) ||
                      (cleanClickedText && popupKeyword.includes(cleanClickedText))
                    );
                  });

                  if (matchedPopup) {
                    setActiveKeywordPopup({
                      keyword: matchedPopup.keyword || kw,
                      title: matchedPopup.title || kw.toUpperCase(),
                      description: matchedPopup.description || 'Chưa có thông tin chú thích.',
                      imageUrl: matchedPopup.imageUrl || '',
                      linkUrl: matchedPopup.linkUrl || '#',
                    });
                  } else {
                    setActiveKeywordPopup({
                      keyword: kw,
                      title: kw.toUpperCase(),
                      description: `Thông tin giải nghĩa chi tiết cho từ khóa "${kw}".`,
                      imageUrl: data?.heroBanner,
                      linkUrl: '#',
                    });
                  }
                }}
              />
            )}
          </section>

          {/* KHỐI TRÍCH NGUỒN TÁC PHẨM & SÁCH */}
          <BookCitationSection sourceBook={data?.sourceBook} />

          {/* CÁC KHỐI TIẾNG VIỆT */}
          <IllustrationVideo heroBanner={data?.heroBanner} videoBlock={data?.videoBlock} />
          <FeaturedPosts heroBanner={data?.heroBanner} featuredArticle={data?.featuredArticle} />
          <PhotoGallery photoGallery={data?.photoGallery} onSelectPhoto={(idx) => setActivePhotoIndex(idx)} />
          <DiscoverMore relatedArticles={data?.relatedArticles} />
          <AiQnA />
        </main>

        <DetailModal
          activePhotoIndex={activePhotoIndex}
          photoGallery={data?.photoGallery}
          onClosePhotoModal={() => setActivePhotoIndex(null)}
          onPrevPhoto={handlePrevPhoto}
          onNextPhoto={handleNextPhoto}
          onSelectPhotoIndex={(idx) => setActivePhotoIndex(idx)}
          activeKeywordPopup={activeKeywordPopup}
          onCloseKeywordPopup={() => setActiveKeywordPopup(null)}
        />
      </div>
    </div>
  );
}