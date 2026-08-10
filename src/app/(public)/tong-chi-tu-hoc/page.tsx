'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SectionData } from '@/types/tong-chi-tu-hoc';
import { NAV_ITEMS, INITIAL_SECTIONS_DATA } from '@/data/tong-chi-tu-hoc-data';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { SectionCarousel } from '@/components/tong-chi-tu-hoc/SectionCarousel';
import { PageIntro } from '@/components/tong-chi-tu-hoc/PageIntro';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

// 🛠️ 1. HÀM XỬ LÝ HTML CHO PAGE INTRO (Giữ lại thẻ <p>, xóa sạch dấu ...)
function formatIntroHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  let clean = rawHtml
    .replace(/<img[^>]*>/gi, '')                     // Xóa ảnh nằm trong bài
    .replace(/<a[^>]*class="more-link"[^>]*>.*?<\/a>/gi, '') // Xóa nút Read More của WP
    .replace(/&#8230;/g, '')                         // Xóa mã dấu ba chấm
    .replace(/&hellip;/g, '')                        // Xóa mã helip
    .replace(/\.\.\./g, '')                          // Xóa dấu ...
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC')                                // Ghép liền nét tiếng Việt
    .trim();

  // Đảm bảo bọc thẻ <p> để CSS [&>p] Drop Cap hoạt động
  if (!clean.startsWith('<p>')) {
    clean = `<p>${clean}</p>`;
  }

  return clean;
}

// 🛠️ 2. HÀM BÓC TÁCH ẢNH TỪ NỘI DUNG WORDPRESS
function extractImgFromContent(htmlContent: string): string {
  if (!htmlContent || typeof window === 'undefined') return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const firstImg = doc.querySelector('img');
    if (firstImg) {
      return firstImg.getAttribute('src') || firstImg.getAttribute('data-src') || '';
    }
  } catch (err) {
    console.error('Lỗi bóc tách ảnh:', err);
  }
  return '';
}

export default function TongChiTuHocPage() {
  const [activeSection, setActiveSection] = useState('tong-chi-tu-hoc');
  const [isScrolled, setIsScrolled] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [pageDescription, setPageDescription] = useState<string>('');
  const [sectionsData, setSectionsData] = useState<SectionData[]>(INITIAL_SECTIONS_DATA);
  const [categoryBgImage, setCategoryBgImage] = useState<string>('');

  // 1. THROTTLED SCROLL & INTERSECTION OBSERVER
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 350);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const sectionElements = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );

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
  }, []);

  // 2. PARALLEL API DATA FETCHING WITH ABORT CONTROLLER
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadData() {
      try {
        const fetchCatBg = fetch('https://tunglam.mocwp.com/wp-json/tunglam/v1/danh-muc-tong-chi/12', { signal, cache: 'no-store' })
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null);

        const fetchBanner = fetch('https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi/388?_embed', { signal, cache: 'no-store' })
          .then((res) => (res.ok ? res.json() : null))
          .catch(async () => {
            const res2 = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi-tu-hoc/388?_embed', { signal, cache: 'no-store' });
            return res2.ok ? res2.json() : null;
          })
          .catch(() => null);

        const fetchPosts = fetch('https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi?_embed', { signal, cache: 'no-store' })
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null);

        const [catData, bannerData, postsData] = await Promise.all([fetchCatBg, fetchBanner, fetchPosts]);

        if (catData) {
          const wpImageUrl = catData?.anh_nen?.url || catData?.anh_dai_dien?.url;
          if (wpImageUrl) setCategoryBgImage(wpImageUrl);
        }

        if (bannerData) {
          const featuredImageUrl =
            bannerData?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            (typeof bannerData?.acf?.banner_image === 'string' ? bannerData?.acf?.banner_image : bannerData?.acf?.banner_image?.url) ||
            bannerData?.featured_image_url ||
            extractImgFromContent(bannerData?.content?.rendered || '') ||
            'https://tunglam.mocwp.com/wp-content/uploads/2026/07/bg-chua.jpg';

          if (featuredImageUrl) setBannerUrl(featuredImageUrl);

          const fullContent = bannerData?.content?.rendered || bannerData?.acf?.description || bannerData?.excerpt?.rendered || '';
          if (fullContent) setPageDescription(formatIntroHtml(fullContent));
        }

        if (Array.isArray(postsData) && postsData.length > 0) {
          const wpCards = postsData
            .filter((post: any) => post.id !== 388)
            .map((post: any) => {
              const imgUrl =
                post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                extractImgFromContent(post.content?.rendered || '') ||
                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80';

              let subtitle = '';
              if (post.excerpt?.rendered) {
                subtitle = post.excerpt.rendered.replace(/<[^>]+>/g, '').normalize('NFC').trim();
              }

              return {
                id: post.id,
                title: post.title?.rendered || 'Chưa có tiêu đề',
                subtitle: subtitle || 'Nội dung tóm tắt cập nhật từ Tùng Lâm Hòa Phúc.',
                imageUrl: imgUrl,
                link: `/tong-chi-tu-hoc/${post.slug}`,
              };
            });

          if (wpCards.length > 0) {
            setSectionsData((prev) =>
              prev.map((sec) => (sec.id === 'tong-phong' ? { ...sec, cards: wpCards } : sec))
            );
          }
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu Tông Chỉ Tu Học:', err);
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#2c1c11] text-[#e3d2c1] font-sans relative selection:bg-[#f2cc8f] selection:text-black overflow-x-hidden">
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle="TÔNG CHỈ TU HỌC"
        navItems={NAV_ITEMS}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle="TÔNG CHỈ TU HỌC"
        navItems={NAV_ITEMS}
      />

      <div className="px-4 sm:px-8 md:pl-20 md:pr-10">
        {/* Banner chính */}
        <HeroBanner bannerUrl={bannerUrl} />

        {/* Khối mô tả trang đầy đủ không bị cắt */}
        <PageIntro description={pageDescription} />

        <main className="max-w-6xl mx-auto space-y-16 py-8 relative">
          <div className="relative z-10 space-y-16">
            {sectionsData.map((section) => {
              // Bắt cả 2 ID để chắc chắn khối Tông Phong nhận được ảnh
              const isTongPhong =
                section.id === 'tong-phong' ||
                section.id === 'tong-phong-truyen-thua';

              return (
                <SectionCarousel
                  key={section.id}
                  section={section}
                  dynamicBgImage={isTongPhong ? categoryBgImage : undefined}
                />
              );
            })}
          </div>

          <div className="pt-8">
            <SmartSearchAIBar contextTitle="Tông Chỉ Tu Học Tùng Lâm Hòa Phúc" />
          </div>
        </main>
      </div>
    </div>
  );
}
