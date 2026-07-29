'use client';

import React, { useState, useEffect } from 'react';
import { SectionData } from '@/types/tong-chi';
import { NAV_ITEMS, INITIAL_SECTIONS_DATA } from '@/data/tong-chi-data';
import { SubNavbar } from '@/components/tong-chi/SubNavbar';
import { SidebarNav } from '@/components/tong-chi/SidebarNav';
import { HeroBanner } from '@/components/tong-chi/HeroBanner';
import { SectionCarousel } from '@/components/tong-chi/SectionCarousel';
import { PageIntro } from '@/components/tong-chi/PageIntro';

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
  const [activeSection, setActiveSection] = useState('tong-chi');
  const [isScrolled, setIsScrolled] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [pageDescription, setPageDescription] = useState<string>('');
  const [sectionsData, setSectionsData] = useState<SectionData[]>(INITIAL_SECTIONS_DATA);

  // 🔴 THÊM STATE LƯU ẢNH NỀN DANH MỤC
  const [categoryBgImage, setCategoryBgImage] = useState<string>('');

  // 1. SCROLL LISTENER
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);

      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔴 LẤY ẢNH NỀN CHUẨN TỪ TAXONOMY "DANH MỤC TÔNG CHỈ"
  useEffect(() => {
    async function fetchCategoryBackground() {
      try {
        const res = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/danh-muc-tong-chi', { cache: 'no-store' });
        if (res.ok) {
          const categories = await res.json();
          if (categories && categories.length > 0) {
            const firstCat = categories[0];
            const acf = firstCat.acf || {};

            let rawImage = acf.anh_nen || acf.anh_dai_dien || firstCat.image;

            if (rawImage) {
              if (typeof rawImage === 'object' && rawImage.url) {
                setCategoryBgImage(rawImage.url);
              } else if (typeof rawImage === 'string' && rawImage.startsWith('http')) {
                setCategoryBgImage(rawImage);
              } else if (typeof rawImage === 'number' || !isNaN(Number(rawImage))) {
                const mediaRes = await fetch(`https://tunglam.mocwp.com/wp-json/wp/v2/media/${rawImage}`);
                if (mediaRes.ok) {
                  const mediaData = await mediaRes.json();
                  if (mediaData.source_url) {
                    setCategoryBgImage(mediaData.source_url);
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Lỗi tải ảnh nền danh mục:', err);
      }
    }

    fetchCategoryBackground();
  }, []);

  // 3. TẢI BANNER VÀ FULL MÔ TẢ TỪ BÀI 388
  useEffect(() => {
    async function fetchBannerAndIntro() {
      try {
        const res = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi/388?_embed', { cache: 'no-store' });
        let data = res.ok ? await res.json() : null;
        if (!data) {
          const resPage = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/pages/388?_embed', { cache: 'no-store' });
          if (resPage.ok) data = await resPage.json();
        }

        if (!data) return;

        const featuredImg = data?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        const contentImg = extractImgFromContent(data?.content?.rendered || '');
        const finalImg = featuredImg || contentImg;
        if (finalImg) setBannerUrl(finalImg);

        const fullContent = data?.content?.rendered || data?.acf?.description || data?.excerpt?.rendered || '';
        if (fullContent) {
          setPageDescription(formatIntroHtml(fullContent));
        }
      } catch (e) {
        console.error('Lỗi lấy banner/mô tả:', e);
      }
    }
    fetchBannerAndIntro();
  }, []);

  // 4. TẢI BÀI VIẾT (CARDS) CHO CÁC SECTION
  useEffect(() => {
    async function fetchWpPosts() {
      try {
        const res = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi?_embed', { cache: 'no-store' });
        if (res.ok) {
          const posts = await res.json();
          if (Array.isArray(posts) && posts.length > 0) {
            const wpCards = posts
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
                  link: `/tong-chi/${post.slug}`,
                };
              });

            if (wpCards.length > 0) {
              setSectionsData((prev) =>
                prev.map((sec) => (sec.id === 'tong-phong' ? { ...sec, cards: wpCards } : sec))
              );
            }
          }
        }
      } catch (err) {
        console.error('Lỗi posts:', err);
      }
    }
    fetchWpPosts();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

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

      <div className={`transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        {/* Banner chính */}
        <HeroBanner bannerUrl={bannerUrl} />

        {/* Khối mô tả trang đầy đủ không bị cắt */}
        <PageIntro description={pageDescription} />

        <main className="max-w-6xl mx-auto space-y-16 py-8 relative">
          
          <div className="relative z-10 space-y-16">
            {sectionsData.map((section) => (
              <SectionCarousel
                key={section.id}
                section={section}
                // 🔴 TRUYỀN DYNAMICBGIMAGE VÀO ĐÂY ĐỂ HIỆN ĐÚNG ẢNH TỪ WORDPRESS TAXONOMY
                dynamicBgImage={section.id === 'tong-phong' ? categoryBgImage : undefined}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}