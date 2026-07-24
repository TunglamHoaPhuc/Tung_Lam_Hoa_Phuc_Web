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
      if (window.scrollY > 350) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
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
        let data;
        if (res.ok) data = await res.json();
        else {
          const resPage = await fetch('https://tunglam.mocwp.com/wp-json/wp/v2/pages/388?_embed', { cache: 'no-store' });
          if (resPage.ok) data = await resPage.json();
        }
        if (data) {
          const img = data._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          if (img) setBannerUrl(img);
        }
      } catch (err) {
        console.error('Lỗi banner:', err);
      }
    }
    fetchBanner();
  }, []);

  // 3. TẢI BÀI VIẾT TỪ WORDPRESS
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
                const imgUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80';
                
                let subtitle = '';
                if (post.excerpt?.rendered) {
                  subtitle = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim();
                }

                if (!subtitle) {
                  subtitle = 'Bài thơ quan trọng kể lại hành trình tiếp nối của Sư Phụ.';
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
          A. MENU NGANG TRÊN CÙNG
         ========================================================================= */}
      <header className={`sticky top-0 z-40 bg-[#352215]/95 backdrop-blur-md border-b border-[#523622] px-4 md:px-8 py-3 shadow-2xl transition-all duration-500 ${
        isScrolled ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#48301e] border border-[#6b472d] px-3 py-1.5 rounded flex items-center gap-2.5 shadow-inner">
              <span className="text-lg text-[#f2cc8f]">🪷</span>
              <span style={{ fontFamily: 'UTM Niagara' }}
               className="font text-[#ffde59] text-lg md:text-xl tracking-widest uppercase">
            TÔNG CHỈ TU HỌC
            </span> 
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-8 h-8 rounded-full bg-[#f2cc8f] text-[#2c1c11] hover:bg-[#ffe3b3] flex items-center justify-center font-bold text-sm shadow-md"
            >
              ↑
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="flex items-center gap-1 opacity-40 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f2cc8f]" />
                    <div className="w-8 md:w-12 h-[1px] bg-[#f2cc8f]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f2cc8f]" />
                  </div>
                )}
                <button
                  onClick={() => scrollToSection(item.id)}
                  style={{ fontFamily: 'UTM Niagara' }}
                    className={`transition-all text-lg md:text-xl px-2 py-1 tracking-wider ${
                        activeSection === item.id
                            ? 'text-[#ffde59] border-b border-[#ffde59]'
                            : 'text-[#b09680] hover:text-[#ffde59]'
                    }`} 
                >
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </header>

      {/* =========================================================================
          B. MENU DỌC BÊN TRÁI
         ========================================================================= */}
      <aside className={`fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 transition-all duration-500 ${
        isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'
      }`}>
        <div className="bg-[#48301e]/95 border border-[#f2cc8f]/40 px-2 py-4 rounded-lg flex flex-col items-center gap-3 shadow-2xl backdrop-blur-md">
          <span className="text-base text-[#f2cc8f]">🪷</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#f2cc8f]" />
          <span className="font-niagara font-bold text-[#f2cc8f] text-sm tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">
            TÔNG CHỈ TU HỌC
          </span>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-7 h-7 rounded-full bg-[#f2cc8f] text-[#2c1c11] hover:bg-[#ffe3b3] flex items-center justify-center font-bold text-xs shadow-lg transition-transform hover:scale-110 active:scale-95"
          title="Lên đầu trang"
        >
          ↑
        </button>

        <div className="flex flex-col items-center gap-3 py-2">
          {NAV_ITEMS.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <div className="w-[1px] h-6 bg-[#f2cc8f]/30" />}
              
              <button
                onClick={() => scrollToSection(item.id)}
                className={`group relative flex items-center gap-2 transition-all ${
                  activeSection === item.id ? 'text-[#f2cc8f]' : 'text-[#b09680]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-all ${
                  activeSection === item.id ? 'bg-[#f2cc8f] scale-125 shadow-[0_0_8px_#f2cc8f]' : 'bg-[#523622]'
                }`} />

                {activeSection === item.id && (
                  <span className="font-niagara text-xs text-[#f2cc8f] font-bold uppercase tracking-wider [writing-mode:vertical-lr] rotate-180 absolute left-5 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            </React.Fragment>
          ))}
        </div>
      </aside>

      {/* =========================================================================
          C. NỘI DUNG CHÍNH (HERO BANNER & SLIDERS)
         ========================================================================= */}
      <div className={`transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        
        {/* HERO BANNER - CHUẨN BẢN THIẾT KẾ */}
        <section id="tong-chi" className="relative my-6 max-w-6xl mx-auto flex flex-col items-center">
          
          {/* Khung chứa ảnh Hero với hiệu ứng Gradient Fade 4 cạnh */}
          <div className="relative w-full h-[40vh] min-h-[340px] md:h-[50vh] rounded-2xl overflow-hidden flex items-end justify-center">
            
            {/* Ảnh Hero từ WordPress */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
              style={{ backgroundImage: `url('${bannerUrl}')` }}
            />

            {/* Đánh mờ viền trên, dưới và 2 bên để hòa vào nền trang */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c1c11] via-transparent to-[#2c1c11]/80 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2c1c11]/90 via-transparent to-[#2c1c11]/90 z-10" />

            {/* Khối Tiêu đề chính & Đường kẻ đè nhẹ lên chân ảnh */}
            <div className="relative z-20 pb-2 w-full flex flex-col items-center text-center px-4">
              <h1 style={{ fontFamily: 'UTM Niagara' }}
              className="text-6xl md:text-9xl text-[#ffde59] tracking-normal uppercase drop-shadow-[0_0_25px_rgba(255,222,89,0.7)]">
                TÔNG CHỈ TU HỌC
              </h1>

              {/* Đường kẻ đặc thù có họa tiết kim cương ở giữa */}
              <div className="relative w-full max-w-2xl flex items-center justify-center my-1">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/80 to-transparent" />
                <div className="absolute text-[#f2cc8f] text-[10px] bg-[#2c1c11] px-1 border border-[#f2cc8f]/50 rotate-45 w-2.5 h-2.5 flex items-center justify-center">
                </div>
              </div>
            </div>
          </div>

          {/* Dòng chữ TÙNG LÂM HÒA PHÚC nằm BÊN DƯỚI ảnh (Chuẩn thiết kế) */}
          <p style={{ fontFamily: 'UTM ClassizismAntiqua' }}
          className="text-base md:text-2xl tracking-[0.2em] text-[#ffde59] uppercase opacity-95">
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
      
      {/* Background chìm mờ xòe tròn (Radial Mask) mềm mại tràn viền */}
      {section.bgWatermark && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-luminosity [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          style={{ backgroundImage: `url('${section.bgWatermark}')` }}
        />
      )}

      {/* Header của Section */}
      <div className="flex items-center justify-between border-b border-[#523622] pb-3 relative z-10">
        <h2 style={{ fontFamily: 'UTM ClassizismAntiqua' }}
        className="text-2xl md:text-3xl text-[#ffde59] tracking-wider uppercase">
        {section.title}
        </h2>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded bg-[#382417] border border-[#593b26] hover:border-[#f2cc8f] text-[#f2cc8f] flex items-center justify-center transition-all"
          >
            ←
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded bg-[#382417] border border-[#593b26] hover:border-[#f2cc8f] text-[#f2cc8f] flex items-center justify-center transition-all"
          >
            →
          </button>
        </div>
      </div>

      {/* Slider danh sách Cards */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scroll-smooth relative z-10"
      >
        {section.cards.map((card) => (
          <div
            key={card.id}
            className="group relative flex-none w-[280px] md:w-[310px] h-[380px] rounded-xl overflow-hidden cursor-pointer border border-[#593b26] hover:border-[#f2cc8f] transition-all duration-500 hover:shadow-[0_0_30px_rgba(242,204,143,0.4)] hover:-translate-y-1.5 snap-start"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${card.imageUrl}')` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f08] via-[#1a0f08]/60 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f2cc8f]/80 rounded-xl transition-all pointer-events-none" />

            <div className="absolute inset-0 p-6 flex flex-col justify-end text-left z-10">
              <h3 style={{ fontFamily: 'UTM Avo' }}
              className="text-lg md:text-xl text-[#ffffff] group-hover:text-[#ffde59] transition-colors">
              {card.title}
              </h3>

              {card.subtitle && (
                <p className="font-antiqua text-xs text-[#e3d2c1] mt-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-24 transition-all duration-500 ease-in-out line-clamp-3">
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}