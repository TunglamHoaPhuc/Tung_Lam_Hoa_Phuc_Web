'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

interface DuLieuBaiVietChiTiet {
  id: number;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  heroBanner: string;
  poemContent?: string;
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

  // Trường hợp 1: ACF trả về Chuỗi URL trực tiếp (https://...)
  if (typeof imgField === 'string' && imgField.length > 0) {
    if (imgField.startsWith('http') || imgField.startsWith('/')) return imgField;
  }

  // Trường hợp 2: ACF trả về Object chứa thông tin ảnh
  if (typeof imgField === 'object' && imgField !== null) {
    return (
      imgField.url ||
      imgField.source_url ||
      imgField.sizes?.large ||
      imgField.sizes?.full ||
      fallbackUrl
    );
  }

  // Trường hợp 3: ACF trả về ID dạng số (Ví dụ: 447)
  const numericId = Number(imgField);
  if (!isNaN(numericId) && numericId > 0) {
    try {
      const res = await fetch(`https://tunglam.mocwp.com/wp-json/wp/v2/media/${numericId}`);
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

  const navItems = [
    { id: 'bai-tho', label: 'Bài thơ / Nội dung' },
    { id: 'video-minh-hoa', label: 'Video minh họa' },
    { id: 'bai-viet-noibat', label: 'Bài viết nổi bật' },
    { id: 'bo-suu-tap-anh', label: 'Bộ sưu tập ảnh' },
    { id: 'tim-hieu-them', label: 'Tìm hiểu thêm' },
  ];

  const [data, setData] = useState<DuLieuBaiVietChiTiet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('bai-tho');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

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

        const res = await fetch(`https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi?slug=${slug}&_embed`, { cache: 'no-store' });
        if (res.ok) {
          const posts = await res.json();

          if (Array.isArray(posts) && posts.length > 0) {
            const post = posts[0];
          const acf = post.acf || {};

          const banner = acf.banner_image?.url || acf.banner_image || post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
          const content = acf.poem_wysiwyg || post.content?.rendered || '';

          const rawExcerpt = post.excerpt?.rendered || '';
          const cleanExcerpt = rawExcerpt
            .replace(/<br\s*[\/]?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&#8230;/g, '...')
            .replace(/&hellip;/g, '...')
            .replace(/&amp;/g, '&')
            .replace(/&nbsp;/g, ' ')
            .normalize('NFC')
            .trim();

          const defaultGallery = [
            {
              title: 'LỄ TƯỞNG NIỆM KHAI SƠN TÔNG PHONG HOẰNG PHÁP',
              imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
              khuVuc: 'Bảo tàng',
              noiDung: 'Lễ Tưởng Niệm Khai Sơn Tông Phong Hoằng Pháp',
            },
            {
              title: 'ĐẠO TRÀNG THANH THIẾU NIÊN TU HỌC',
              imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
              khuVuc: 'Giảng đường',
              noiDung: 'Các bạn khóa sinh tham gia khóa tu mùa hè.',
            },
          ];

          // 🔴 BÓC TÁCH & TRA CỨU ẢNH THÔNG MINH CHO POPUPS
          let parsedPopups: Array<any> = [];
          const acfRepeater = acf.danh_sach_tu_khoa || acf.popups_repeater || acf.tu_khoa_repeater;

          if (Array.isArray(acfRepeater) && acfRepeater.length > 0) {
            parsedPopups = await Promise.all(
              acfRepeater.map(async (item: any) => {
                const rawImg = item.anh_dai_dien || item.anh_popup || item.hinh_anh || item.image;
                const finalImgUrl = await resolveImageUrl(rawImg, banner);

                return {
                  keyword: item.tu_khoa_boi_dam || item.keyword || item.tu_khoa || '',
                  title: item.tieu_de_popup || item.title || item.tu_khoa_boi_dam || '',
                  description: cleanPopupDescription(item.noi_dung_giai_nghia || item.description || item.mo_ta || ''),
                  imageUrl: finalImgUrl,
                  linkUrl: item.duong_dan_xem_them || item.linkUrl || '#',
                };
              })
            );
          } else if (acf.tu_khoa_boi_dam) {
            const singleImgUrl = await resolveImageUrl(acf.anh_dai_dien || acf.anh_popup, banner);
            parsedPopups = [{
              keyword: acf.tu_khoa_boi_dam,
              title: acf.tieu_de_popup || acf.tu_khoa_boi_dam,
              description: cleanPopupDescription(acf.noi_dung_giai_nghia || ''),
              imageUrl: singleImgUrl,
              linkUrl: acf.duong_dan_xem_them || '#',
            }];
          }

          setData({
            id: post.id,
            title: post.title?.rendered || '',
            subtitle: acf.sub_title || '',
            shortDescription: cleanExcerpt,
            heroBanner: banner,
            poemContent: formatContentHtml(content),
            popups: parsedPopups,
            videoBlock: {
              title: acf.tieu_de_video || 'LỄ TƯỞNG NIỆM LẦN THỨ 33',
              description: acf.mo_ta_ngan_video || 'Thước phim tư liệu ghi lại bầu không khí trang nghiêm và lòng thành kính của hàng môn đồ đệ tử trong ngày lễ tưởng niệm Chư Tổ Sư.',
              videoUrl: acf.duong_dan_link_youtube || 'https://www.youtube.com/watch?v=sVrfy4Igykw',
            },
            photoGallery: acf.gallery_repeater?.length > 0
              ? acf.gallery_repeater.map((item: any) => ({
                imageUrl: item.image?.url || item.image || item.imageUrl,
                title: item.title || item.caption,
                caption: item.caption,
                khuVuc: item.khu_vuc || 'Tùng Lâm Hòa Phúc',
                noiDung: item.noi_dung || item.caption,
                space3dLink: item.space_3d_link,
              }))
              : defaultGallery,
          });
        }
      }
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
    <div className="w-full min-h-screen bg-[#2c1c11] text-[#e3d2c1] font-sans relative selection:bg-[#f2cc8f] selection:text-black overflow-x-hidden">
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={data?.title || 'TÔNG PHONG TRUYỀN THỪA'}
        navItems={navItems}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={data?.title || 'TÔNG PHONG TRUYỀN THỪA'}
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        <HeroBanner bannerUrl={data?.heroBanner} title={data?.title} subtitle={data?.subtitle} />

        <main className="max-w-5xl mx-auto pt-4 pb-16 space-y-16 w-full">
          {/* KHỐI BÀI THƠ / NỘI DUNG CHÍNH */}
          <section id="bai-tho" className="scroll-mt-24 relative">
            <div className="text-center">
              {data?.shortDescription && (
                <div className="max-w-xl mx-auto -mt-9 mb-12 px-4">
                  <h2
                    style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                    className="text-lg sm:text-xl md:text-2xl text-[#ffde59] uppercase tracking-wider leading-relaxed md:leading-loose whitespace-pre-line break-words opacity-90"
                  >
                    {data.shortDescription}
                  </h2>
                </div>
              )}

              {data?.poemContent && (
                <div
                  onClick={handlePoemContentClick}
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="
                    text-base sm:text-lg md:text-xl text-[#ffde59]
                    leading-relaxed md:leading-loose tracking-wide
                    space-y-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                    text-center
                    [&>p]:text-center [&>p]:mb-4
                    [&_strong]:text-[#ffde59] [&_strong]:underline [&_strong]:decoration-dotted [&_strong]:cursor-pointer
                    [&_b]:text-[#ffde59] [&_b]:underline [&_b]:decoration-dotted [&_b]:cursor-pointer
                    [&>p:first-of-type::first-letter]:[font-family:'UTM_ClassizismAntiqua','UTM_ClassicAntiqua',serif]
                    [&>p:first-of-type::first-letter]:text-6xl md:[&>p:first-of-type::first-letter]:text-7xl
                    [&>p:first-of-type::first-letter]:font-bold [&>p:first-of-type::first-letter]:text-[#ffde59]
                    [&>p:first-of-type::first-letter]:mr-2 [&>p:first-of-type::first-letter]:pb-1 [&>p:first-of-type::first-letter]:leading-none
                  "
                  dangerouslySetInnerHTML={{ __html: data.poemContent }}
                />
              )}
            </div>
          </section>

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