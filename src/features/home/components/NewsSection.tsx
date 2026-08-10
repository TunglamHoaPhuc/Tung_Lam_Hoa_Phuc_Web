'use client';

import { FC, useState } from "react";
import { SectionTransitionOverlay } from "@/components/common/SectionTransitionOverlay";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  imgUrl: string;
  targetUrl: string;
}

const LATEST_NEWS_DATA: NewsItem[] = [
  {
    id: "n1",
    category: "Tông chỉ tu học",
    title: "BỒ ĐỀ TÂM",
    subtitle: "Khuyến phát Bồ Đề Tâm — Cội gốc của mọi công hạnh tu tập",
    imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=1200&h=800&fit=crop",
    targetUrl: "/tong-chi-tu-hoc",
  },
  {
    id: "n2",
    category: "Dòng chảy hoằng pháp",
    title: "TULKUL RINPOCHE VIẾNG THĂM",
    subtitle: "Chuyến viếng thăm và giảng pháp của chư vị Hòa thượng quốc tế",
    imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1200&h=800&fit=crop",
    targetUrl: "/dong-chay-hoang-phap",
  },
  {
    id: "n3",
    category: "Tượng pháp",
    title: "ĐỨC PHẬT THÍCH CA",
    subtitle: "Bảo tượng Vô Thượng Năng Nhân ngự tại Đại Hùng Bảo Điện",
    imgUrl: "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=1200&h=800&fit=crop",
    targetUrl: "/bao-tuong-phat-giao/duc-phat-thich-ca",
  },
  {
    id: "n4",
    category: "Sự kiện định kỳ",
    title: "KHÓA TU MỘT NGÀY AN LẠC",
    subtitle: "Trang nghiêm khóa tu hằng tháng dành cho hàng trăm Phật tử",
    imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&h=800&fit=crop",
    targetUrl: "/dong-chay-hoang-phap",
  },
];

export const NewsSection: FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const prevSlide = () => {
    setSlideDirection('prev');
    setActiveIdx((prev) => (prev - 1 + LATEST_NEWS_DATA.length) % LATEST_NEWS_DATA.length);
  };

  const nextSlide = () => {
    setSlideDirection('next');
    setActiveIdx((prev) => (prev + 1) % LATEST_NEWS_DATA.length);
  };

  const currentNews = LATEST_NEWS_DATA[activeIdx];
  const prevNews = LATEST_NEWS_DATA[(activeIdx - 1 + LATEST_NEWS_DATA.length) % LATEST_NEWS_DATA.length];
  const nextNews = LATEST_NEWS_DATA[(activeIdx + 1) % LATEST_NEWS_DATA.length];

  const animClass = slideDirection === 'next' ? 'animate-slide-next' : 'animate-slide-prev';

  return (
    <section className="w-full py-16 relative overflow-hidden bg-[#120d0a]">
      {/* ── Keyframe Animations cho hiệu ứng trượt ngang mượt mà ── */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(8%); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-8%); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-next {
          animation: slideInFromRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-slide-prev {
          animation: slideInFromLeft 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* ── Seamless Gradient Blur Overlay ── */}
      <SectionTransitionOverlay position="both" />

      {/* ── Background Image với độ mờ mượt mà ── */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          key={`bg-${activeIdx}`}
          src={currentNews.imgUrl}
          alt="Bối cảnh"
          className={`w-full h-full object-cover opacity-20 blur-[2px] transition-all duration-700 ${animClass}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120d0a] via-transparent to-[#120d0a]" />
      </div>

      {/* ── 1. HEADER SECTION ── */}
      <SectionHeader title="TIN MỚI NHẤT" />

      {/* ── 2. CAROUSEL TRẢI RỘNG TRÀN MÀN HÌNH VỚI HIỆU ỨNG TRƯỢT ── */}
      <div className="relative w-full z-20 overflow-hidden">
        <div className="flex items-end justify-between w-full min-h-[450px]">

          {/* ── 3A. LEFT SIDE PREVIEW CARD ── */}
          <div
            onClick={prevSlide}
            className="hidden lg:flex flex-col items-center justify-end w-[28%] -mr-8 z-10 cursor-pointer transition-all duration-500 grayscale brightness-70 opacity-85 hover:opacity-100 hover:brightness-90 group shrink-0"
          >
            {/* Box Ảnh Bên Trái */}
            <div className="relative w-full h-[280px] overflow-hidden border-t border-b border-l border-amber-900/40">
              <img
                key={`left-img-${prevNews.id}`}
                src={prevNews.imgUrl}
                alt={prevNews.title}
                className={`w-full h-full object-cover ${animClass}`}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Thanh Chú Thích Bên Trái: Dòng 1 Tiêu đề Niagara, Dòng 2 Danh mục UTM Avo */}
            <div className="w-full h-[94px] mb-[18px] flex flex-col items-center justify-center p-2 pr-16 text-center bg-[#241810] border-t border-b border-l border-[#F2C14E]/40 shadow-inner">
              <div key={`left-txt-${prevNews.id}`} className={`w-full ${animClass}`}>
                <h4
                  className="text-lg md:text-xl font-normal uppercase text-amber-100/90 truncate max-w-[85%] mx-auto mb-0.5"
                  style={{ fontFamily: "'UTM Niagara', serif", fontWeight: "normal" }}
                >
                  {prevNews.title}
                </h4>
                <span className="text-[11px] uppercase text-amber-200/50 tracking-wider block" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {prevNews.category}
                </span>
              </div>
            </div>
          </div>

          {/* ── 3B. CENTER ACTIVE CARD (VỚI BADGE LỤC GIÁC VẬT TRÙM LÊN 2 POSTER) ── */}
          <div className="relative w-full lg:w-[50%] max-w-[640px] flex flex-col items-center z-30 px-0 my-0 shrink-0">
            {/* Box Ảnh Chính */}
            <div
              className="relative w-full overflow-hidden border shadow-2xl group"
              style={{
                height: 360,
                borderColor: "#F2C14E",
                borderRadius: "12px 12px 0 0",
                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px))",
                boxShadow: "0 25px 80px rgba(0,0,0,0.98), 0 0 50px rgba(242,193,78,0.45)",
              }}
            >
              <img
                key={`center-img-${currentNews.id}`}
                src={currentNews.imgUrl}
                alt={currentNews.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${animClass}`}
              />

              {/* Nút Chuyển Slide Trái */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:scale-110 shadow-xl z-40"
                style={{
                  background: "rgba(242,193,78,0.9)",
                  borderColor: "#ffffff",
                  color: "#2A1D14",
                }}
                aria-label="Slide trước"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </button>

              {/* Nút Chuyển Slide Phải */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:scale-110 shadow-xl z-40"
                style={{
                  background: "rgba(242,193,78,0.9)",
                  borderColor: "#ffffff",
                  color: "#2A1D14",
                }}
                aria-label="Slide sau"
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            {/* ── BADGE LỤC GIÁC MỞ RỘNG (W-[114%]) TRÙM ĐÈ BÊN TRÊN 2 POSTER DẰNG SAU ── */}
            <div
              className="relative -mt-16 z-40 flex items-center justify-center w-[114%] max-w-[680px] h-[136px] cursor-pointer group px-0"
              onClick={() => (window.location.href = currentNews.targetUrl)}
            >
              <svg
                className="absolute inset-0 w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.98)]"
                viewBox="0 0 500 136"
                preserveAspectRatio="none"
              >
                <polygon
                  points="250,2 498,21 498,115 250,134 2,115 2,21"
                  fill="url(#shapeBgGradient)"
                  stroke="#F2C14E"
                  strokeWidth="2.5"
                />
                <polygon
                  points="250,8 491,26 491,110 250,128 9,110 9,26"
                  fill="none"
                  stroke="#F2C14E"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <defs>
                  <linearGradient id="shapeBgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4d3522" stopOpacity="1" />
                    <stop offset="100%" stopColor="#1e1108" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Nội dung chữ trong Badge Lục Giác: Dòng 1 Tiêu đề Niagara phát sáng, Dòng 2 Subtitle UTM Avo */}
              <div
                key={`center-txt-${currentNews.id}`}
                className={`relative z-10 pt-1 pb-1 px-6 text-center flex flex-col items-center justify-center transition-transform group-hover:scale-105 ${animClass}`}
              >
                <div className="w-5 h-5 mb-0.5 text-amber-400 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>

                {/* DÒNG 1 (TRÊN): TIÊU ĐỀ CHÍNH (UTM Niagara) */}
                <h3
                  className="text-2xl md:text-4xl uppercase font-normal text-[#F2C14E] leading-tight mb-0.5"
                  style={{
                    fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                    fontWeight: "normal",
                    textShadow: "0 0 20px rgba(242,193,78,0.7)",
                  }}
                >
                  {currentNews.title}
                </h3>

                {/* DÒNG 2 (DƯỚI): SUBTITLE DANH MỤC (UTM Avo) */}
                <span
                  className="text-xs md:text-sm font-medium text-[#d9c8a9] tracking-wider block"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {currentNews.category}
                </span>
              </div>
            </div>

          </div>

          {/* ── 3C. RIGHT SIDE PREVIEW CARD ── */}
          <div
            onClick={nextSlide}
            className="hidden lg:flex flex-col items-center justify-end w-[28%] -ml-8 z-10 cursor-pointer transition-all duration-500 grayscale brightness-70 opacity-85 hover:opacity-100 hover:brightness-90 group shrink-0"
          >
            {/* Box Ảnh Bên Phải */}
            <div className="relative w-full h-[280px] overflow-hidden border-t border-b border-r border-amber-900/40">
              <img
                key={`right-img-${nextNews.id}`}
                src={nextNews.imgUrl}
                alt={nextNews.title}
                className={`w-full h-full object-cover ${animClass}`}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Thanh Chú Thích Bên Phải: Dòng 1 Tiêu đề Niagara, Dòng 2 Danh mục UTM Avo */}
            <div className="w-full h-[94px] mb-[18px] flex flex-col items-center justify-center p-2 pl-16 text-center bg-[#241810] border-t border-b border-r border-[#F2C14E]/40 shadow-inner">
              <div key={`right-txt-${nextNews.id}`} className={`w-full ${animClass}`}>
                <h4
                  className="text-lg md:text-xl font-normal uppercase text-amber-100/90 truncate max-w-[85%] mx-auto mb-0.5"
                  style={{ fontFamily: "'UTM Niagara', serif", fontWeight: "normal" }}
                >
                  {nextNews.title}
                </h4>
                <span className="text-[11px] uppercase text-amber-200/50 tracking-wider block" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {nextNews.category}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsSection;