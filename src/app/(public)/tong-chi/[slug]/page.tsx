'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SubNavbar } from '@/components/tong-chi/SubNavbar';
import { SidebarNav } from '@/components/tong-chi/SidebarNav';
import { HeroBanner } from '@/components/tong-chi/HeroBanner';

// Import các khối Tiếng Việt vừa tách
import { KhoiVideoMinhHoa } from '@/components/tong-chi/chi-tiet/KhoiVideoMinhHoa';
import { KhoiBaiVietNoiBat } from '@/components/tong-chi/chi-tiet/KhoiBaiVietNoiBat';
import { KhoiBoSuuTapAnh } from '@/components/tong-chi/chi-tiet/KhoiBoSuuTapAnh';
import { KhoiTimHieuThem } from '@/components/tong-chi/chi-tiet/KhoiTimHieuThem';
import { KhoiHoiDapAi } from '@/components/tong-chi/chi-tiet/KhoiHoiDapAi';
import { CuaSoHienThiModal } from '@/components/tong-chi/chi-tiet/CuaSoHienThiModal';

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
        const res = await fetch(`https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi?slug=${slug}&_embed`, { cache: 'no-store' });
        const posts = await res.json();

        if (posts && posts.length > 0) {
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

          setData({
            id: post.id,
            title: post.title?.rendered || '',
            subtitle: acf.sub_title || '',
            shortDescription: cleanExcerpt,
            heroBanner: banner,
            poemContent: formatContentHtml(content),
            popups: acf.keyword_popups_repeater?.map((item: any) => ({
              keyword: item.keyword || item.title,
              title: item.title || item.keyword,
              description: item.description,
              imageUrl: item.image?.url || item.image || item.imageUrl,
              linkUrl: item.link_url || item.linkUrl || '#',
            })) || [],
            videoBlock: {
              title: acf.video_block?.title || 'LỄ TƯỞNG NIỆM LẦN THỨ 33',
              description: acf.video_block?.description || 'Thước phim tư liệu ghi lại bầu không khí trang nghiêm và lòng thành kính của hàng môn đồ đệ tử trong ngày lễ tưởng niệm Chư Tổ Sư.',
              videoUrl: acf.video_block?.url || acf.video_block?.video_url || 'https://www.youtube.com/watch?v=sVrfy4Igykw',
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
      } catch (err) {
        console.error('Lỗi tải bài viết chi tiết:', err);
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

  const handlePoemContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const boldEl = target.closest('strong, b');

    if (boldEl) {
      const keywordText = boldEl.textContent?.trim() || '';
      if (!keywordText) return;

      const matchedPopup = data?.popups?.find(
        (p) => p.keyword?.toLowerCase() === keywordText.toLowerCase() || p.title?.toLowerCase() === keywordText.toLowerCase()
      );

      if (matchedPopup) {
        setActiveKeywordPopup({
          keyword: matchedPopup.keyword || keywordText,
          title: matchedPopup.title || keywordText.toUpperCase(),
          description: matchedPopup.description || 'Chưa có thông tin chú thích.',
          imageUrl: matchedPopup.imageUrl,
          linkUrl: matchedPopup.linkUrl,
        });
      } else {
        setActiveKeywordPopup({
          keyword: keywordText,
          title: keywordText.toUpperCase(),
          description: `Thông tin giải nghĩa chi tiết cho từ khóa "${keywordText}".`,
          imageUrl: data?.heroBanner,
          linkUrl: '#',
        });
      }
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
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

          {/* CÁC KHỐI TIẾNG VIỆT ĐƯỢC GỌI GỌN GÀNG */}
          <KhoiVideoMinhHoa heroBanner={data?.heroBanner} videoBlock={data?.videoBlock} />
          <KhoiBaiVietNoiBat heroBanner={data?.heroBanner} featuredArticle={data?.featuredArticle} />
          <KhoiBoSuuTapAnh photoGallery={data?.photoGallery} onSelectPhoto={(idx) => setActivePhotoIndex(idx)} />
          <KhoiTimHieuThem relatedArticles={data?.relatedArticles} />
          <KhoiHoiDapAi />
        </main>

        <CuaSoHienThiModal
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