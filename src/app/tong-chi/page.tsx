'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CardItem {
  id: string | number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
}

interface SectionData {
  id: string;
  title: string;
  bgWatermark?: string;
  cards: CardItem[];
}

const NAV_ITEMS = [
  { id: 'tong-chi', label: 'Tông chỉ' },
  { id: 'tong-phong', label: 'Tông phong' },
  { id: 'nen-tang', label: 'Nền tảng' },
  { id: 'phap-mon', label: 'Pháp môn' },
  { id: 'lo-trinh', label: 'Lộ trình' },
];

export default function TongChiTuHocPage() {
  const [activeSection, setActiveSection] = useState('tong-chi');
  const [isScrolled, setIsScrolled] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string>('');

  const [sectionsData, setSectionsData] = useState<SectionData[]>([
    {
      id: 'tong-phong',
      title: 'TÔNG PHONG TRUYỀN THỪA',
      bgWatermark: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80',
      cards: [
        {
          id: 1,
          title: 'TIẾP BƯỚC THẦY TÔI',
          subtitle: 'Bài thơ quan trọng kể lại hành trình tiếp nối của Sư Phụ.',
          imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80',
        },
        {
          id: 2,
          title: 'ĐỜI THẦY',
          subtitle: 'Hành trạng và công hạnh phụng sự nhân sinh.',
          imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80',
        },
        {
          id: 3,
          title: 'MIỀN NAM CHỐN TỔ',
          subtitle: 'Kế thừa dòng mạng mạch tâm linh từ Hoằng Pháp.',
          imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80',
        },
      ],
    },
    {
      id: 'nen-tang',
      title: 'NỀN TẢNG TU HỌC',
      cards: [
        {
          id: 101,
          title: 'BỒ ĐỀ TÂM',
          subtitle: 'Căn bản của con đường giải thoát và giác ngộ.',
          imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80',
        },
      ],
    },
  ]);

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

  // 2. TẢI BANNER TỪ WORDPRESS
  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/tong-chi/388?_embed', { cache: 'no-store' });
        let data = res.ok ? await res.json() : null;
        if (!data) {
          const resPage = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/pages/388?_embed', { cache: 'no-store' });
          if (resPage.ok) data = await resPage.json();
        }
        const img = data?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        if (img) setBannerUrl(img);
      } catch (e) {
        console.error('Lỗi lấy banner:', e);
      }
    }
    fetchBanner();
  }, []);

  // 3. TẢI BÀI VIẾT TỪ WORDPRESS (LẤY TÓM TẮT EXCERPT CHUẨN REST API)
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
                  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80';

                let subtitle = '';
                if (post.excerpt?.rendered) {
                  // Lọc bớt các thẻ HTML trong excerpt từ REST API
                  subtitle = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim();
                }

                if (!subtitle) {
                  subtitle = 'Nội dung tóm tắt cập nhật từ Tùng Lâm Hòa Phúc.';
                }

                return {
                  id: post.id,
                  title: post.title?.rendered || 'Chưa có tiêu đề',
                  subtitle: subtitle,
                  imageUrl: imgUrl,
                  link: post.link,
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
    <div className="min-h-screen bg-[#2c1c11] text-[#e3d2c1] font-sans relative selection:bg-[#f2cc8f] selection:text-black">
      {/* =========================================================================
          A. THANH ANCHOR / SUB-NAVBAR NGANG
         ========================================================================= */}
      <nav
        className={`sticky top-0 z-50 w-full bg-[#2c1c11]/95 backdrop-blur-md border-b border-[#f2cc8f]/20 shadow-xl transition-all duration-500 ${
          isScrolled ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* KHỐI BÊN TRÁI */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-[#c8aa6e]/60 to-transparent flex-shrink-0" />

            <img
              src="https://tunglam.mocwp.com/wp-content/uploads/2026/07/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.png"
              alt="Biểu tượng Tổng chỉ tu học"
              className="h-10 md:h-12 w-auto object-contain flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            <div className="w-5 h-5 rounded-full bg-[#f2cc8f] text-[#2c1c11] flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>

            <span
              style={{ fontFamily: "'UTM Niagara', sans-serif" }}
              className="text-xl sm:text-2xl md:text-3xl text-[#ffde59] tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,222,89,0.4)] whitespace-nowrap"
            >
              TÔNG CHỈ TU HỌC
            </span>

            <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-[#c8aa6e]/60 to-transparent flex-shrink-0 ml-2" />

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#e8dbb8] text-[#2c1c11] border-2 border-[#b8a679] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_8px_rgba(255,222,89,0.25)] hover:scale-110 hover:bg-[#ffde59] hover:border-[#ffde59] transition-all duration-300 ml-1 md:ml-2 flex-shrink-0"
              title="Lên đầu trang"
              type="button"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>

          {/* KHỐI BÊN PHẢI: NAV NGANG */}
          <div className="flex-1 flex items-center justify-between ml-4 md:ml-8 overflow-x-auto no-scrollbar py-2">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <React.Fragment key={item.id}>
                  {idx > 0 && (
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-[#f2cc8f]/10 via-[#f2cc8f]/30 to-[#f2cc8f]/10 min-w-[12px] mx-1 md:mx-2" />
                  )}

                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="group relative flex items-center gap-2 py-1 px-1 transition-all duration-300 focus:outline-none flex-shrink-0 cursor-pointer"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 flex-shrink-0 ${
                        isActive
                          ? 'w-3 h-3 bg-[#ffde59] shadow-[0_0_10px_#ffde59] scale-110 ring-2 ring-[#ffde59]/40'
                          : 'w-2 h-2 bg-[#8c6d53]/70 group-hover:bg-[#ffde59] group-hover:scale-125'
                      }`}
                    />

                    <span
                      style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                      className={`text-xl sm:text-2xl whitespace-nowrap transition-all duration-500 ease-in-out transform ${
                        isActive
                          ? 'max-w-[180px] opacity-100 text-[#ffde59] drop-shadow-[0_0_8px_rgba(255,222,89,0.5)] translate-x-0'
                          : 'max-w-0 opacity-0 text-[#f2cc8f] group-hover:max-w-[180px] group-hover:opacity-100 group-hover:text-[#ffde59] translate-x-1 group-hover:translate-x-0 overflow-hidden'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </nav>

      {/* =========================================================================
          B. MENU DỌC BÊN TRÁI
         ========================================================================= */}
      <aside
        className={`fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 transition-all duration-500 ${
          isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'
        }`}
      >
        <div className="bg-[#382417]/90 border border-[#f2cc8f]/40 px-2.5 py-4 rounded-3xl flex flex-col items-center shadow-2xl backdrop-blur-md">
          
          <img
            src="https://tunglam.mocwp.com/wp-content/uploads/2026/07/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.png"
            alt="Biểu tượng Tông chỉ tu học"
            className="h-8 w-auto object-contain mb-2 flex-shrink-0 drop-shadow-[0_0_6px_rgba(255,222,89,0.4)]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/50 to-transparent mb-2" />

          {/* Dải chữ TÔNG CHỈ TU HỌC từng từ một xuống dòng */}
          <div
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="flex flex-col items-center text-[#ffde59] text-base font-bold tracking-wider leading-tight uppercase select-none drop-shadow-[0_0_4px_rgba(255,222,89,0.3)] my-1"
          >
            <span>TÔNG</span>
            <span>CHỈ</span>
            <span>TU</span>
            <span>HỌC</span>
          </div>

          <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/50 to-transparent my-2" />

          {/* Nút Lên Đầu Trang 3D */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-8 h-8 rounded-full bg-[#e8dbb8] text-[#2c1c11] border-2 border-[#b8a679] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_8px_rgba(255,222,89,0.25)] hover:scale-110 hover:bg-[#ffde59] hover:border-[#ffde59] transition-all duration-300 my-1 cursor-pointer flex-shrink-0"
            title="Lên đầu trang"
            type="button"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>

          <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/50 to-transparent my-2" />

          {/* Danh sách bullet kết nối */}
          <div className="flex flex-col items-center">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <div className="w-[1px] h-5 bg-gradient-to-b from-[#f2cc8f]/10 via-[#f2cc8f]/30 to-[#f2cc8f]/10 my-1" />
                  )}

                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className="group relative flex items-center justify-center p-1 focus:outline-none cursor-pointer"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-3 h-3 bg-[#ffde59] shadow-[0_0_10px_#ffde59] scale-110 ring-2 ring-[#ffde59]/40'
                          : 'w-2 h-2 bg-[#8c6d53]/70 group-hover:bg-[#ffde59] group-hover:scale-125'
                      }`}
                    />

                    <span
                      style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                      className={`absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[#21140b]/95 border border-[#f2cc8f]/50 text-lg sm:text-xl whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none transition-all duration-300 transform origin-left ${
                        isActive
                          ? 'opacity-100 translate-x-0 text-[#ffde59] drop-shadow-[0_0_6px_rgba(255,222,89,0.4)]'
                          : 'opacity-0 -translate-x-2 text-[#f2cc8f] group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#ffde59]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

        </div>
      </aside>

      {/* =========================================================================
          C. NỘI DUNG CHÍNH (HERO BANNER & SLIDERS)
         ========================================================================= */}
      <div className={`transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        {/* HERO BANNER */}
        <section
          id="tong-chi"
          className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-6 flex flex-col items-center overflow-x-hidden"
        >
          <div className="relative w-full h-[50vh] min-h-[380px] md:h-[60vh] overflow-hidden flex items-end justify-center bg-[#2c1c11]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
              style={{ backgroundImage: `url('${bannerUrl}')` }}
            />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#2c1c11] via-[#2c1c11]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#2c1c11] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#2c1c11] to-transparent z-10 pointer-events-none" />

            <div className="relative z-20 pb-4 w-full flex flex-col items-center text-center px-4">
              <h1
                style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                className="text-6xl md:text-9xl text-[#ffde59] tracking-normal uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
              >
                TÔNG CHỈ TU HỌC
              </h1>

              <div className="relative w-full max-w-2xl flex items-center justify-center my-1">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/80 to-transparent" />
                <div className="absolute text-[#f2cc8f] text-[10px] bg-[#2c1c11] px-1 border border-[#f2cc8f]/50 rotate-45 w-2.5 h-2.5 flex items-center justify-center" />
              </div>
            </div>
          </div>

          <p
            style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
            className="text-base md:text-2xl tracking-[0.2em] text-[#ffde59] uppercase opacity-95 mt-4"
          >
            TÙNG LÂM HÒA PHÚC
          </p>
        </section>

        {/* CÁC SECTION SLIDER */}
        <main className="max-w-6xl mx-auto space-y-16 py-8">
          {sectionsData.map((section) => (
            <SectionCarousel key={section.id} section={section} />
          ))}
        </main>
      </div>
    </div>
  );
}

// COMPONENT SLIDER CHO MỖI SECTION
function SectionCarousel({ section }: { section: SectionData }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id={section.id} className="scroll-mt-24 space-y-6 relative rounded-2xl p-6 overflow-hidden">
      {section.bgWatermark && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-luminosity [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          style={{ backgroundImage: `url('${section.bgWatermark}')` }}
        />
      )}

      {/* HEADER SECTION CÓ THANH PHÂN CÁCH NGHỆ THUẬT MẠ VÀNG (ẢNH 2) */}
      <div className="flex items-center justify-between border-b border-[#523622] pb-3 relative z-10 gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Tiêu đề Section */}
          <h2
            style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
            className="text-2xl md:text-3xl text-[#ffde59] tracking-wider uppercase whitespace-nowrap"
          >
            {section.title}
          </h2>

          {/* 🌟 THANH NGANG NGHỆ THUẬT MẠ VÀNG KIM BÊN CẠNH TIÊU ĐỀ */}
          <div className="flex-1 flex items-center gap-2">
            <div className="h-[1.5px] w-full bg-gradient-to-r from-[#f2cc8f] via-[#f2cc8f]/50 to-transparent" />
            {/* Họa tiết hình thoi/kim cương cổ kính ở góc */}
            <div className="w-2.5 h-2.5 rotate-45 border border-[#f2cc8f] bg-[#2c1c11] flex-shrink-0 shadow-[0_0_6px_rgba(242,204,143,0.5)]" />
          </div>
        </div>

        {/* Nút chuyển Slider Left/Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded bg-[#382417] border border-[#593b26] hover:border-[#f2cc8f] text-[#f2cc8f] flex items-center justify-center transition-all cursor-pointer"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded bg-[#382417] border border-[#593b26] hover:border-[#f2cc8f] text-[#f2cc8f] flex items-center justify-center transition-all cursor-pointer"
          >
            →
          </button>
        </div>
      </div>

      {/* SLIDER CARDS */}
      <div
        ref={scrollRef}
        className="flex items-center gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scroll-smooth relative z-10 no-scrollbar"
      >
        {section.cards.map((card) => (
          <a
            key={card.id}
            href={card.link || '#'}
            target={card.link ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="group relative flex-none w-[280px] md:w-[310px] h-[380px] rounded-xl overflow-hidden cursor-pointer border border-[#593b26] hover:border-[#f2cc8f] transition-all duration-500 hover:shadow-[0_0_30px_rgba(242,204,143,0.4)] hover:-translate-y-1.5 snap-start block"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${card.imageUrl}')` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f08] via-[#1a0f08]/60 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f2cc8f]/80 rounded-xl transition-all pointer-events-none" />

            <div className="absolute inset-0 p-6 flex flex-col justify-end text-left z-10">
              {/* TIÊU ĐỀ CARD: UTM AVO BOLD (IN ĐẬM) */}
              <h3
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-lg md:text-xl text-[#ffffff] font-bold group-hover:text-[#ffde59] transition-colors leading-snug"
              >
                {card.title}
              </h3>

              {/* TÓM TẮT (SUBTITLE / EXCERPT TỪ WORDPRESS API): UTM AVO THƯỜNG KHẢO HOVER */}
              {card.subtitle && (
                <p
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs font-normal text-[#e3d2c1] mt-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-24 transition-all duration-500 ease-in-out line-clamp-3 leading-relaxed"
                >
                  {card.subtitle}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
