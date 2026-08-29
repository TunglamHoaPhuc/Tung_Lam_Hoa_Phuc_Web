'use client';

import React, { useState, useEffect, useRef, FC } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, BookOpen, Sparkles, Download, Layers } from 'lucide-react';

const TOTAL_PAGES = 30;

const PAGES = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
  pageNumber: i + 1,
  src: `https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/page_${String(i + 1).padStart(2, '0')}.webp`,
  title: i === 0 ? 'Bìa Sách: Nhà Tứ Ân' : i === TOTAL_PAGES - 1 ? 'Bìa Sau' : `Trang ${i + 1}`,
}));

export const TuAnFlipbook: FC = () => {
  const [currentPage, setCurrentPage] = useState(1); // 1-indexed
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDualView, setIsDualView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive single/dual view detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsDualView(false);
      } else {
        setIsDualView(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    if (isDualView) {
      if (currentPage === 1) return;
      if (currentPage === 2) {
        setCurrentPage(1);
      } else {
        setCurrentPage((prev) => Math.max(1, prev - 2));
      }
    } else {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNext = () => {
    if (isDualView) {
      if (currentPage === 1) {
        setCurrentPage(2);
      } else {
        setCurrentPage((prev) => Math.min(TOTAL_PAGES, prev + 2));
      }
    } else {
      setCurrentPage((prev) => Math.min(TOTAL_PAGES, prev + 1));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Calculate left & right pages in dual view mode
  const isCover = currentPage === 1;
  const isBackCover = currentPage === TOTAL_PAGES && !isDualView;
  const leftPageNum = isCover ? null : currentPage % 2 === 0 ? currentPage : currentPage - 1;
  const rightPageNum = isCover ? 1 : (leftPageNum ? leftPageNum + 1 : null);

  return (
    <div
      ref={containerRef}
      className={`w-full relative transition-all duration-300 rounded-3xl bg-gradient-to-b from-[#1C1008] via-[#2A180E] to-[#120803] border border-[#F2C14E]/40 p-4 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none p-4' : 'min-h-[600px] md:min-h-[720px]'
      }`}
    >
      {/* ── 1. TOP TOOLBAR ── */}
      <div className="w-full flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#F2C14E]/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#3D2514] border border-[#F2C14E]/60 flex items-center justify-center text-[#F2C14E]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3
              className="text-base sm:text-xl font-normal text-[#FFE5A3] uppercase tracking-wider"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              KỶ YẾU PHỤC DỰNG NHÀ TỨ ÂN
            </h3>
            <p className="text-[11px] text-[#c9b896]/80 hidden sm:block" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              Tư liệu lịch sử &amp; công trình kiến trúc Tùng Lâm Hòa Phúc
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom In/Out */}
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            className="w-8 h-8 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/30 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
            className="w-8 h-8 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/30 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Dual/Single view toggle on desktop */}
          <button
            onClick={() => setIsDualView((v) => !v)}
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/30 text-xs font-bold text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black transition-all cursor-pointer"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isDualView ? '2 TRANG' : '1 TRANG'}</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/30 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── 2. FLIPBOOK DISPLAY AREA (REALISTIC SPREAD / SINGLE PAGE) ── */}
      <div className="relative w-full flex-1 flex items-center justify-center my-auto py-2 overflow-hidden">
        {/* Navigation Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`absolute left-1 sm:left-3 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1C1008]/90 border-2 border-[#F2C14E]/60 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md ${
            currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
          }`}
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Book Container with 3D Spine and Page Shadow */}
        <div
          className="transition-transform duration-300 flex items-center justify-center max-w-full max-h-[75vh]"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {isDualView ? (
            /* ── DUAL PAGE VIEW (DESKTOP) ── */
            isCover ? (
              /* BÌA TRƯỚC (ĐỨNG ĐƠN ĐỘC Ở GIỮA) */
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#F2C14E]/50 bg-[#120803] max-w-[480px] max-h-[68vh] aspect-[3/4] flex items-center justify-center">
                <img
                  src={PAGES[0].src}
                  alt={PAGES[0].title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
              </div>
            ) : (
              /* HAI TRANG MỞ ĐÔI KÈM ĐƯỜNG GÁY SÁCH */
              <div className="relative flex items-center rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-2 border-[#F2C14E]/50 bg-[#120803] max-w-[960px] max-h-[68vh] aspect-[3/2]">
                {/* Left Page */}
                {leftPageNum && leftPageNum <= TOTAL_PAGES ? (
                  <div className="relative w-1/2 h-full overflow-hidden bg-[#1A1009] flex items-center justify-center">
                    <img
                      src={PAGES[leftPageNum - 1].src}
                      alt={PAGES[leftPageNum - 1].title}
                      className="w-full h-full object-contain"
                    />
                    {/* Shadow toward right spine */}
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-1/2 h-full bg-[#1A1009]" />
                )}

                {/* Book Spine (Gáy Sách) */}
                <div className="w-[3px] h-full bg-gradient-to-b from-[#F2C14E]/80 via-[#8B1E0F] to-[#F2C14E]/80 shadow-[0_0_12px_rgba(0,0,0,0.9)] z-20" />

                {/* Right Page */}
                {rightPageNum && rightPageNum <= TOTAL_PAGES ? (
                  <div className="relative w-1/2 h-full overflow-hidden bg-[#1A1009] flex items-center justify-center">
                    <img
                      src={PAGES[rightPageNum - 1].src}
                      alt={PAGES[rightPageNum - 1].title}
                      className="w-full h-full object-contain"
                    />
                    {/* Shadow toward left spine */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-1/2 h-full bg-[#1A1009]" />
                )}
              </div>
            )
          ) : (
            /* ── SINGLE PAGE VIEW (MOBILE) ── */
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#F2C14E]/50 bg-[#120803] max-w-[480px] max-h-[68vh] aspect-[3/4] flex items-center justify-center">
              <img
                src={PAGES[currentPage - 1].src}
                alt={PAGES[currentPage - 1].title}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Navigation Right Arrow */}
        <button
          onClick={handleNext}
          disabled={isDualView ? (currentPage >= TOTAL_PAGES - 1 && !isCover) : (currentPage >= TOTAL_PAGES)}
          className={`absolute right-1 sm:right-3 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1C1008]/90 border-2 border-[#F2C14E]/60 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md ${
            (isDualView && currentPage >= TOTAL_PAGES - 1 && !isCover) || (!isDualView && currentPage >= TOTAL_PAGES)
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:scale-110 active:scale-95'
          }`}
          aria-label="Trang sau"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* ── 3. BOTTOM PAGE SELECTOR & PROGRESS BAR ── */}
      <div className="w-full pt-4 border-t border-[#F2C14E]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFE5A3]">
        {/* Page status */}
        <div className="flex items-center gap-2 font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
          <span className="text-[#F2C14E]">❖</span>
          <span>
            {isDualView && !isCover ? (
              <>Trang <strong className="text-[#F2C14E] text-sm">{leftPageNum} - {rightPageNum}</strong> / {TOTAL_PAGES}</>
            ) : (
              <>Trang <strong className="text-[#F2C14E] text-sm">{currentPage}</strong> / {TOTAL_PAGES}</>
            )}
          </span>
        </div>

        {/* Page Slider */}
        <div className="flex-1 max-w-md w-full px-4">
          <input
            type="range"
            min={1}
            max={TOTAL_PAGES}
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="w-full accent-[#F2C14E] cursor-pointer"
          />
        </div>

        {/* Quick jump to cover / back */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            className="px-2.5 py-1 rounded bg-[#2D1B10] border border-[#F2C14E]/30 text-[11px] font-bold text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black transition-all cursor-pointer"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Đầu sách
          </button>
          <button
            onClick={() => setCurrentPage(TOTAL_PAGES)}
            className="px-2.5 py-1 rounded bg-[#2D1B10] border border-[#F2C14E]/30 text-[11px] font-bold text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black transition-all cursor-pointer"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Cuối sách
          </button>
        </div>
      </div>
    </div>
  );
};
