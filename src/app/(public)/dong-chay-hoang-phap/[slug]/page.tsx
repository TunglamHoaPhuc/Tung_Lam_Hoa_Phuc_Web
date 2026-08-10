'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, Calendar, Play, Video } from 'lucide-react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { HOANG_PHAP_ARTICLES } from '@/data/dong-chay-hoang-phap-data';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';

const NAV_ITEMS = [
  { id: 'overview', label: 'TỔNG QUAN' },
  { id: 'article-body', label: 'NỘI DUNG CHÍNH' },
  { id: 'video-section', label: 'VIDEO' },
  { id: 'related-section', label: 'TÌM HIỂU THÊM' },
];

export default function DongChayHoangPhapDetailPage() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = typeof rawSlug === 'string' ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : '';
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);

  // Tim article trong mock data hoac fallback article dau tien
  const article = HOANG_PHAP_ARTICLES.find((a) => a.slug === slug) || HOANG_PHAP_ARTICLES[0];
  const relatedArticles = HOANG_PHAP_ARTICLES.filter((a) => a.id !== article.id);
  const relatedArticlesFormatted = relatedArticles.map((rel) => ({
    category: rel.subCategory || 'DÒNG CHẢY HOẰNG PHÁP',
    title: rel.title,
    url: rel.thumbnailUrl,
    link: `/dong-chay-hoang-phap/${rel.slug}`,
  }));

  // Short anchor title (max 3-4 words like "LỄ GIỖ TỔ" or "XUẤT GIA GIEO DUYÊN")
  const shortAnchorTitle = article.subCategory || 'DÒNG CHẢY HOẰNG PHÁP';

  // Scroll handler tracking active section & navbar transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 400);

      // Section position detection
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(NAV_ITEMS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#2C1C11] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      <Header scrolled={true} />

      {/* ── 1. STICKY ANCHOR NAV (RÚT GỌN TIÊU ĐỀ TỐI ĐA 3-4 TỪ) ── */}
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={shortAnchorTitle}
        navItems={NAV_ITEMS}
      />

      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={shortAnchorTitle}
        navItems={NAV_ITEMS}
      />

      {/* ── 2. HERO BANNER BÊ NGUYÊN TỪ TÔNG CHỈ TU HỌC (THAY TEXT THEO YÊU CẦU) ── */}
      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        <HeroBanner
          id="overview"
          bannerUrl={article.bannerUrl || article.thumbnailUrl}
          title="LỄ GIỖ TỔ LẦN THỨ 37"
          subtitle="TẠI TÙNG LÂM HÒA PHÚC"
        />

        {/* ── 3. NỘI DUNG BÀI VIẾT & CÁC KHỐI CHUẨN 100% TỪ TÔNG CHỈ TU HỌC ── */}
        <main className="max-w-5xl mx-auto pt-4 pb-16 space-y-16 w-full">
          <div id="article-body" className="max-w-4xl mx-auto">
        {/* 
          ======================================================================
          📌 QUY CHUẨN TYPOGRAPHY VĂN BẢN GIỐNG HỆT 100% TỪ TÔNG CHỈ TU HỌC (PAGEINTRO.TSX)
          ----------------------------------------------------------------------
          NOTE CHO DEVELOPER VÀ NGƯỜI BẬC BIÊN TẬP SAU:
          
          1. DROP CAP (Chữ cái đầu tiên của bài viết):
             - Font family: 'UTM_ClassizismAntiqua', 'UTM_ClassicAntiqua', 'UTM ClassizismAntiqua', serif
             - Kích thước: text-6xl md:text-7xl (3.75rem -> 4.5rem), font-bold
             - Màu sắc: #ffde59 (Gold vàng phát sáng), text-shadow
             - Gạch chân: border-bottom: 2px solid #ffde59, padding-bottom: 0.375rem (pb-1.5)
             - Canh lề: float: left, margin-right: 0.875rem (mr-3.5), margin-bottom: 0.25rem, line-height: 1
          
          2. ĐOẠN VĂN (BODY TEXT):
             - Font family: 'UTM Avo', sans-serif
             - Kích thước: text-base sm:text-lg md:text-xl
             - Màu sắc: #ffde59, drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
             - Giãn dòng: leading-relaxed md:leading-loose, tracking-wide, margin-bottom: 1rem (mb-4)
             - Căn lề: text-align: justify (Căn đều 2 bên tuyệt đối)
             - Thụt đầu dòng: indent-6 md:indent-8 (1.5rem -> 2rem) từ đoạn thứ 2 trở đi
          
          3. CHÚ THÍCH ẢNH (FIGCAPTION / CAPTIONS):
             - Font family: 'UTM Avo', sans-serif, font-style: italic
             - Kích thước: text-sm sm:text-base, font-normal
             - Màu sắc: rgba(255, 222, 89, 0.95) (Màu vàng ánh sương)
             - Căn lề: text-align: center (Căn chính giữa chân ảnh)
             - Khoảng cách: margin-top: 0.5rem, margin-bottom: 2rem
          ======================================================================
        */}
        <style>{`
          /* 1. DROP CAP (GIỐNG HỆT PAGEINTRO.TSX TÔNG CHỈ TU HỌC) */
          .article-editorial-body > p:first-of-type::first-letter {
            float: left;
            font-family: 'UTM_ClassizismAntiqua', 'UTM_ClassicAntiqua', 'UTM ClassizismAntiqua', serif;
            font-size: 3.75rem;
            font-weight: 700;
            color: #ffde59;
            margin-right: 0.875rem;
            margin-bottom: 0.25rem;
            padding-bottom: 0.375rem;
            border-bottom: 2px solid #ffde59;
            line-height: 1;
            text-shadow: 0 0 12px rgba(255, 222, 89, 0.5);
          }
          @media (min-width: 768px) {
            .article-editorial-body > p:first-of-type::first-letter {
              font-size: 4.5rem;
            }
          }

          /* 2. ĐOẠN VĂN BODY TEXT (GIỐNG HỆT PAGEINTRO.TSX TÔNG CHỈ TU HỌC) */
          .article-editorial-body {
            font-family: 'UTM Avo', sans-serif;
            color: #ffde59;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
          }

          .article-editorial-body p {
            font-family: 'UTM Avo', sans-serif;
            color: #ffde59;
            font-size: 1rem;
            line-height: 1.625;
            letter-spacing: 0.025em;
            text-align: justify;
            text-justify: inter-word;
            margin-bottom: 1rem;
          }

          @media (min-width: 640px) {
            .article-editorial-body p {
              font-size: 1.125rem;
            }
          }
          @media (min-width: 768px) {
            .article-editorial-body p {
              font-size: 1.25rem;
              line-height: 2;
            }
          }

          /* Thụt đầu dòng từ đoạn thứ 2 trở đi (indent-6 md:indent-8) */
          .article-editorial-body p + p {
            text-indent: 1.5rem;
          }
          @media (min-width: 768px) {
            .article-editorial-body p + p {
              text-indent: 2rem;
            }
          }

          /* 3. CHÚ THÍCH ẢNH & CAPTION (GIỐNG HỆT TÔNG CHỈ TU HỌC) */
          .article-editorial-body figure {
            margin-top: 2rem;
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }

          .article-editorial-body figure img, 
          .article-editorial-body img {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid rgba(242, 204, 143, 0.4);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
            object-fit: cover;
            margin-top: 1rem;
            margin-bottom: 0.75rem;
          }

          .article-editorial-body figcaption,
          .article-editorial-body .caption {
            font-family: 'UTM Avo', sans-serif;
            font-style: italic;
            font-size: 0.875rem;
            color: rgba(255, 222, 89, 0.95);
            text-align: center;
            margin-top: 0.5rem;
            margin-bottom: 2rem;
            font-weight: 400;
            letter-spacing: 0.025em;
            display: block;
            width: 100%;
          }
          @media (min-width: 640px) {
            .article-editorial-body figcaption,
            .article-editorial-body .caption {
              font-size: 1rem;
            }
          }

          /* Danh sách bullet points nếu có */
          .article-editorial-body ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            color: #ffde59;
          }
          .article-editorial-body li {
            margin-bottom: 0.5rem;
            text-align: justify;
            padding-left: 0.25rem;
          }
        `}</style>

        <div
          className="article-editorial-body"
          dangerouslySetInnerHTML={{
            __html: article.contentHtml || `<p>${article.summary}</p>`,
          }}
        />

        {/* ── BLOCK META FOOTER (GOM NGÀY ĐĂNG, LƯỢT XEM, TÁC GIẢ XUỐNG CUỐI BÀI) ── */}
        <div
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="border-t border-[#F2C14E]/20 pt-6 mt-12 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-[#D3C0AD]"
        >
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F2C14E]" />
              <span>Ngày đăng: <strong className="text-[#F2C14E]">{article.date}</strong></span>
            </span>

            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#F2C14E]" />
              <span>Lượt xem: <strong className="text-[#F2C14E]">{article.views}</strong></span>
            </span>
          </div>

          {article.author && (
            <div>
              <span>Tác giả / Biên tập: <strong className="text-[#F2C14E]">{article.author}</strong></span>
            </div>
          )}
        </div>
          </div>

        {/* ── 4. BLOCK VIDEO LIÊN QUAN (KÍCH THƯỚC & STYLES BÊ NGUYÊN TỪ TÔNG CHỈ TU HỌC) ── */}
        {article.videoBlock && (
          <div id="video-section" className="my-16 w-full">
            {/* Section Header chuẩn hóa với Dấu chấm tròn mạ vàng 2 bên sát chữ & tracking-normal */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 w-full mb-8">
              <div className="w-10 h-8 border border-[#ffde59]/80 rounded-md bg-[#3a2613] flex items-center justify-center shadow-[0_0_12px_rgba(255,222,89,0.3)] z-10">
                <Video className="w-5 h-5 text-[#ffde59] animate-pulse" />
              </div>

              <div className="flex items-center justify-center w-full my-2">
                <div className="flex-1 flex items-center justify-end">
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
                </div>

                <h2
                  style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                  className="text-3xl sm:text-5xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_0_16px_rgba(255,222,89,0.85)] whitespace-nowrap px-4 sm:px-6"
                >
                  VIDEO MINH HỌA
                </h2>

                <div className="flex-1 flex items-center justify-start">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
                  <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
                </div>
              </div>
            </div>

            {/* Gold Border Box chứa video (kích thước, border-radius & typography bê nguyên từ Tông Chỉ Tu Học) */}
            <div className="relative bg-[#3a2613]/80 border border-[#c8aa6e]/70 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md w-full mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
                {/* Cột trái (Thumbnail / Frame Video - 7 cols) */}
                <div className="lg:col-span-7 relative aspect-video w-full rounded-xl overflow-hidden border border-[#c8aa6e]/50 shadow-2xl bg-black group">
                  {isPlayingVideo ? (
                    <iframe
                      src={article.videoBlock.videoUrl}
                      title={article.videoBlock.title}
                      className="w-full h-full border-0 rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full cursor-pointer">
                      <img
                        src={article.videoBlock.thumbnailUrl}
                        alt={article.videoBlock.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Nút Play Custom Vàng Phát Sáng */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        <button
                          type="button"
                          onClick={() => setIsPlayingVideo(true)}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F2C14E] border-2 border-white flex items-center justify-center shadow-[0_0_24px_rgba(242,193,78,0.8)] transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                          aria-label="Phát Video"
                        >
                          <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[#2C1C11] fill-[#2C1C11] ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cột phải (Thông tin Video - 5 cols) */}
                <div className="lg:col-span-5 space-y-4 text-left pl-0 lg:pl-2">
                  <h3
                    style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffde59] uppercase leading-tight tracking-normal drop-shadow-[0_0_14px_rgba(255,222,89,0.8)]"
                  >
                    {article.videoBlock.title}
                  </h3>

                  <h4
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-base sm:text-xl font-bold text-[#f2cc8f] leading-snug tracking-normal"
                  >
                    {article.title}
                  </h4>

                  <div className="w-full h-[1px] bg-gradient-to-r from-[#c8aa6e]/80 via-[#c8aa6e]/30 to-transparent my-3" />

                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-sm sm:text-base text-white/90 font-normal leading-relaxed tracking-normal"
                  >
                    {article.videoBlock.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. BLOCK "TÌM HIỂU THÊM" COPIED 100% TỪ TÔNG CHỈ TU HỌC ── */}
        <div id="related-section" className="w-full">
          <DiscoverMore relatedArticles={relatedArticlesFormatted} />
        </div>

        {/* ── Smart Search AI Bar ── */}
        <div className="my-10">
          <SmartSearchAIBar contextTitle={article.title} />
        </div>
      </main>
      </div>
    </div>
  );
}
