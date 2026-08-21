'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, Calendar, Play, ArrowLeft, ChevronRight, Bell } from 'lucide-react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { WISDOM_ITEMS } from '@/data/wisdom-archive-data';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function WisdomDetailPage() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = typeof rawSlug === 'string' ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : '';
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const item = WISDOM_ITEMS.find((w) => w.slug === slug) || WISDOM_ITEMS[5];
  const relatedItems = WISDOM_ITEMS.filter((w) => w.id !== item.id).slice(0, 3);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#2C1C11] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      {/* ── 1. HERO BANNER & TIÊU ĐỀ TRANG (HEADLINE & SUB-HEADLINE) ── */}
      <div className="relative overflow-hidden bg-[#1A120B] pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-10">
        {/* Background Event Image with Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover opacity-30 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A120B]/80 via-[#2C1C11]/90 to-[#2C1C11]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Back link & Subcategory Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <Link
              href="/tri-tue-phat-phap"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#F2C14E] hover:text-[#FFE5A3] transition-colors"
              style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: 'bold' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kho Tàng Trí Tuệ Phật Pháp</span>
            </Link>

            <span className="text-[#F2C14E]/40">•</span>

            <span
              className="px-3 py-0.5 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-1.5 text-[#F2C14E] bg-[#3A2718]/80 border border-[#F2C14E]/30"
              style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: 'bold' }}
            >
              <span>🪔</span>
              <span>{item.primaryCategoryTag || 'Trí Tuệ Phật Pháp'}</span>
            </span>
          </div>

          {/* 1. Tiêu đề chính (Headline): UTM Niagara, font-normal text-3xl md:text-5xl text-[#F2C14E] drop-shadow-[0_0_15px_rgba(242,193,78,0.5)] */}
          <h1
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="font-normal text-3xl sm:text-4xl md:text-5xl leading-tight text-[#F2C14E] uppercase tracking-wider drop-shadow-[0_0_15px_rgba(242,193,78,0.5)] max-w-3xl my-2"
          >
            {item.title}
          </h1>

          {/* 2. Subtitle / Sub-headline: UTM Avo, text-base md:text-lg text-[#FFE5A3] font-medium tracking-wide my-3 */}
          {item.excerpt && (
            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-base md:text-lg text-[#FFE5A3] font-medium tracking-wide max-w-2xl mx-auto my-3 leading-relaxed text-balance"
            >
              {item.excerpt}
            </p>
          )}

          {/* 3. Thanh Meta (Ngày đăng, Lượt xem) */}
          <div
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[#D3C0AD] text-xs md:text-sm flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4 pt-3 border-t border-[#F2C14E]/20 w-full max-w-lg"
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>{item.publishDate || '28/11/2025'}</span>
            </span>

            <span className="text-[#F2C14E]/30">•</span>

            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>{item.views} lượt xem</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. THANH STICKY ANCHOR NAV (ĐỒNG BỘ TÔNG CHỈ TU HỌC) ── */}
      <div className="sticky top-0 z-30 w-full bg-[#2C1C11] border-y border-[#F2C14E]/20 shadow-xl backdrop-blur-md">
        <div className="max-w-4xl mx-auto py-2.5 px-4 flex items-center justify-between text-xs md:text-sm font-medium text-[#D3C0AD]">
          {/* Trái: Icon & Tên mục */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#3A2718] border border-[#F2C14E]/40 flex items-center justify-center text-[#F2C14E]">
              📜
            </span>
            <span style={{ fontFamily: "'UTM Avo', sans-serif" }} className="font-bold text-[#F2C14E] truncate max-w-[200px] sm:max-w-none">
              TRÍ TUỆ PHẬT PHÁP
            </span>
          </div>

          {/* Giữa: Nút Mũi Tên cuộn lên đầu */}
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full bg-[#4A321F] hover:bg-[#6B4B2A] border border-[#F2C14E]/50 text-[#F2C14E] flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
            title="Cuộn lên đầu trang"
            aria-label="Cuộn lên đầu trang"
          >
            ↑
          </button>

          {/* Phải: Link tới Nội dung */}
          <a
            href="#article-content"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="hover:text-[#F2C14E] transition-colors flex items-center gap-1"
          >
            <span>Nội dung pháp bảo</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#F2C14E]" />
          </a>
        </div>
      </div>

      {/* ── 3. NỘI DUNG BÀI VIẾT (VỚI DROPCAP NGHỆ THUẬT VÀ FIGCAPTION CHUẨN) ── */}
      <main id="article-content" className="max-w-4xl mx-auto px-4 md:px-10 py-12">
        <style>{`
          .article-body-content > p:first-of-type::first-letter {
            font-family: 'UTM Classic Antiqua', 'UTM ClassizismAntiqua', serif;
            font-size: 3.75rem;
            font-weight: 700;
            float: left;
            line-height: 0.8;
            margin-right: 0.4rem;
            margin-top: 0.1rem;
            color: #F2C14E;
            border-bottom: 2px solid #F2C14E;
            padding-bottom: 2px;
            text-shadow: 0 0 15px rgba(242,193,78,0.5);
          }
          .article-body-content p {
            margin-bottom: 1.4em;
            line-height: 1.85;
            font-family: 'UTM Avo', sans-serif;
            color: #e3d2c1;
            font-size: 0.95rem;
          }
          .article-body-content figure {
            margin-top: 2rem;
            margin-bottom: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .article-body-content figure img, .article-body-content img {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid rgba(242,193,78,0.25);
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            object-fit: cover;
          }
          .article-body-content figcaption {
            font-family: 'UTM Avo', sans-serif;
            font-style: italic;
            font-size: 0.875rem;
            color: rgba(255, 229, 163, 0.9);
            text-align: center;
            margin-top: 0.625rem;
            font-weight: 400;
            letter-spacing: 0.025em;
          }
        `}</style>

        <div
          className="article-body-content"
          dangerouslySetInnerHTML={{
            __html: item.contentHtml || `<p>${item.excerpt}</p>`,
          }}
        />

        {/* ── 4. BLOCK PHÁP THOẠI / VIDEO SỰ KIỆN (MEDIA SECTION) ── */}
        {(item.type === 'video' || item.type === 'audio' || item.mediaUrl) && (
          <div className="my-14">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="w-10 h-10 rounded-full bg-[#3a2718] border border-[#F2C14E]/40 flex items-center justify-center text-[#F2C14E] mb-2 shadow-md">
                <Bell className="w-5 h-5 text-[#F2C14E] animate-pulse" />
              </div>
              <div className="flex items-center justify-center w-full max-w-2xl my-2 gap-4 md:gap-8">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
                <h3
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] whitespace-nowrap flex-shrink-0"
                >
                  PHÁP THOẠI
                </h3>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
              </div>
            </div>

            <div className="border border-[#F2C14E]/40 bg-[#2C1C11] rounded-2xl p-4 md:p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 relative group overflow-hidden rounded-xl aspect-video bg-[#1A120B]">
                {isPlayingVideo ? (
                  <iframe
                    src={item.mediaUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                    title={item.title}
                    className="w-full h-full border-0 rounded-xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setIsPlayingVideo(true)}
                        className="w-16 h-16 rounded-full bg-[#F2C14E] border-2 border-white flex items-center justify-center shadow-[0_0_24px_rgba(242,193,78,0.8)] transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                        aria-label="Phát Video Pháp Thoại"
                      >
                        <Play className="w-7 h-7 text-[#2C1C11] fill-[#2C1C11] ml-1" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="md:col-span-5 flex flex-col justify-center gap-3">
                <span
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs font-bold uppercase tracking-widest text-[#F2C14E]"
                >
                  🎧 PHÁP THOẠI TRÍ TUỆ
                </span>

                <h4
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className="text-2xl md:text-3xl font-normal text-[#F2C14E] uppercase leading-tight drop-shadow-[0_0_12px_rgba(242,193,78,0.4)]"
                >
                  {item.title}
                </h4>

                <p
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs md:text-sm text-[#D3C0AD] leading-relaxed font-normal"
                >
                  {item.excerpt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Smart Search AI Bar */}
        <div className="my-10">
          <SmartSearchAIBar contextTitle={item.title} />
        </div>
      </main>

      {/* ── 5. BÀI VIẾT TÌM HIỂU THÊM ── */}
      {relatedItems.length > 0 && (
        <div className="bg-[#1A120B]/80 border-t border-[#F2C14E]/20 py-16 px-4 md:px-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center w-full mb-10 gap-4">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
              <h2
                style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                className="text-3xl md:text-4xl text-[#F2C14E] uppercase font-normal tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.6)]"
              >
                TÌM HIỂU THÊM
              </h2>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/tri-tue-phat-phap/${rel.slug}`}
                  className="group rounded-xl overflow-hidden border border-[#F2C14E]/20 bg-[#2C1C11] hover:border-[#F2C14E] transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
                >
                  <div className="relative aspect-[1.618/1] overflow-hidden bg-[#1A120B]">
                    <img
                      src={rel.thumbnailUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-transparent z-10" />

                  <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                    <h3
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="font-bold text-sm text-[#F2C14E] group-hover:text-[#FFE5A3] line-clamp-2 leading-snug transition-colors"
                    >
                      {rel.title}
                    </h3>
                    <div
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-[11px] text-[#A69383] pt-2 border-t border-[#F2C14E]/15 flex items-center justify-between"
                    >
                      <span>{rel.publishDate || '28/11/2025'}</span>
                      <span>{rel.views} lượt xem</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
