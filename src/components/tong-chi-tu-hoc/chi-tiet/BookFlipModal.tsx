'use client';

import React, { useState, useEffect, useRef, FC, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SourceBookData } from './BookCitationSection';

interface BookFlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: SourceBookData | null;
  totalPages?: number;
}

const DEFAULT_TOTAL_PAGES = 30;

export const BookFlipModal: FC<BookFlipModalProps> = ({
  isOpen,
  onClose,
  book,
  totalPages = DEFAULT_TOTAL_PAGES,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDualView, setIsDualView] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [flippingDirection, setFlippingDirection] = useState<'next' | 'prev' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const bookStageRef = useRef<HTMLDivElement>(null);

  // Sinh danh sách trang từ thư mục số hóa S3 của Tùng Lâm Hòa Phúc
  const pages = React.useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => ({
      pageNumber: i + 1,
      src: `https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/page_${String(i + 1).padStart(2, '0')}.webp`,
      title: i === 0 ? (book?.bookTitle || book?.title || 'Bìa Sách') : i === totalPages - 1 ? 'Bìa Sau' : `Trang ${i + 1}`,
    }));
  }, [totalPages, book]);

  // Nhận diện màn hình di động vs desktop
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

  // Khóa cuộn trang nền khi mở modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset trạng thái
      setZoomScale(1);
      setPanOffset({ x: 0, y: 0 });
      setCurrentPage(1);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    setFlippingDirection('prev');
    setTimeout(() => setFlippingDirection(null), 400);

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
  }, [isDualView, currentPage]);

  const handleNext = useCallback(() => {
    setFlippingDirection('next');
    setTimeout(() => setFlippingDirection(null), 400);

    if (isDualView) {
      if (currentPage === 1) {
        setCurrentPage(2);
      } else {
        setCurrentPage((prev) => Math.min(totalPages, prev + 2));
      }
    } else {
      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    }
  }, [isDualView, currentPage, totalPages]);

  // Phím tắt bàn phím (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Zoom In / Out thủ công
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.35, 4));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // 🎯 XỬ LÝ CTRL + LĂN CHUỘT: PHÓNG TO / THU NHỎ TẬP TRUNG ĐÚNG VỊ TRÍ CON TRỎ CHUỘT
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();

      const stage = bookStageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.18 : 0.85;
      const newScale = Math.min(Math.max(zoomScale * zoomFactor, 1), 4.5);

      if (newScale === 1) {
        setZoomScale(1);
        setPanOffset({ x: 0, y: 0 });
      } else {
        // Thuật toán Zoom-to-Cursor Anchor:
        // Điểm dưới con trỏ chuột được giữ cố định nguyên vị trí
        const ratio = newScale / zoomScale;
        const newPanX = cursorX - (cursorX - panOffset.x) * ratio;
        const newPanY = cursorY - (cursorY - panOffset.y) * ratio;

        setZoomScale(newScale);
        setPanOffset({ x: newPanX, y: newPanY });
      }
    }
  };

  // Kéo rê ảnh (Pan/Drag) khi đã phóng to
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomScale <= 1) return;
    e.preventDefault();
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

  if (!isOpen) return null;

  const isCover = currentPage === 1;
  const leftPageNum = isCover ? null : currentPage % 2 === 0 ? currentPage : currentPage - 1;
  const rightPageNum = isCover ? 1 : (leftPageNum ? leftPageNum + 1 : null);

  const displayTitle = book?.bookTitle || book?.title || 'ĐI QUA KHỔ VUI CUỘC ĐỜI';
  const displayAuthor = book?.author || 'Sa Môn Vô Trí (hiệu Tâm Hòa)';

  return (
    <div
      className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-6xl rounded-3xl bg-gradient-to-b from-[#1C1008] via-[#2A180E] to-[#120803] border-2 border-[#F2C14E]/60 p-4 sm:p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between max-h-[96vh] overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-[9999] rounded-none max-h-screen p-4' : ''
        }`}
      >
        {/* ── 1. TOOLBAR HEADER TRANG TRỌNG HOÀNG KIM ── */}
        <div className="w-full flex items-center justify-between gap-3 pb-3 mb-2 border-b border-[#F2C14E]/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#3D2514] border border-[#F2C14E]/70 flex items-center justify-center text-[#FFDE59] shadow-sm shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-lg sm:text-2xl font-normal text-[#FFDE59] uppercase tracking-wider truncate"
              >
                {displayTitle}
              </h3>
              <p
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-xs text-[#FFE5A3]/80 italic truncate"
              >
                Tác giả: <strong className="text-[#F2C14E] not-italic font-bold">{displayAuthor}</strong>
                <span className="hidden sm:inline text-[#c9b896]/60 ml-2">
                  (Giữ Ctrl + lăn chuột để phóng to vào vị trí con trỏ)
                </span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/40 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Thu nhỏ (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/40 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Phóng to (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoomScale > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="w-8 h-8 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/40 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Đặt lại kích thước"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Chế độ 1 trang / 2 trang */}
            <button
              type="button"
              onClick={() => setIsDualView((v) => !v)}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/40 text-xs font-bold text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black transition-all cursor-pointer shadow-xs"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isDualView ? '2 TRANG' : '1 TRANG'}</span>
            </button>

            {/* Toàn màn hình */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-lg bg-[#2D1B10] border border-[#F2C14E]/40 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Nút Đóng (ESC) */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#3A1E11] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-[#170C06] flex items-center justify-center transition-all cursor-pointer shadow-sm ml-1"
              title="Đóng (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 2. FLIPBOOK DISPLAY STAGE (VỚI CTRL + WHEEL ZOOM & PAN) ── */}
        <div
          ref={bookStageRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative w-full flex-1 flex items-center justify-center py-2 overflow-hidden ${
            zoomScale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
          style={{ minHeight: '440px', height: '62vh' }}
        >
          {/* Mũi tên lật trang trái */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`absolute left-1 sm:left-4 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#1C1008]/90 border-2 border-[#F2C14E]/70 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md ${
              currentPage === 1 ? 'opacity-25 cursor-not-allowed pointer-events-none' : 'hover:scale-110 active:scale-95'
            }`}
            aria-label="Lật trang trước"
            title="Trang trước (Phím mũi tên trái)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* SÂN KHẤU SÁCH VỚI HIỆU ỨNG LẬT TRANG 3D & ZOOM TRANSFORM */}
          <div
            className={`flex items-center justify-center max-w-full max-h-full transition-transform ease-out ${
              isDragging ? 'duration-0' : 'duration-200'
            }`}
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
              transformOrigin: 'center center',
            }}
          >
            {isDualView ? (
              /* ── 2 TRANG MỞ ĐÔI (DESKTOP) ── */
              isCover ? (
                /* BÌA TRƯỚC (ĐỨNG ĐƠN ĐỘC Ở CHÍNH GIỮA) */
                <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-2 border-[#F2C14E]/60 bg-[#120803] max-w-[460px] max-h-[58vh] aspect-[3/4] flex items-center justify-center transition-all duration-300">
                  <img
                    src={pages[0].src}
                    alt={pages[0].title}
                    className="w-full h-full object-contain select-none"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />
                </div>
              ) : (
                /* HAI TRANG MỞ ĐÔI KÈM GÁY SÁCH & HIỆU ỨNG LẬT 3D */
                <div
                  className={`relative flex items-center rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.95)] border-2 border-[#F2C14E]/60 bg-[#120803] max-w-[940px] max-h-[58vh] aspect-[3/2] transition-transform duration-300 ${
                    flippingDirection === 'next'
                      ? 'animate-in spin-in-1 [transform:rotateY(-4deg)]'
                      : flippingDirection === 'prev'
                      ? 'animate-in spin-in-1 [transform:rotateY(4deg)]'
                      : ''
                  }`}
                  style={{ perspective: '1200px' }}
                >
                  {/* Trang Trái */}
                  {leftPageNum && leftPageNum <= totalPages ? (
                    <div className="relative w-1/2 h-full overflow-hidden bg-[#1A1009] flex items-center justify-center">
                      <img
                        src={pages[leftPageNum - 1].src}
                        alt={pages[leftPageNum - 1].title}
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                      />
                      {/* Đổ bóng gáy sách về phía bên phải */}
                      <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    <div className="w-1/2 h-full bg-[#1A1009]" />
                  )}

                  {/* Gáy Sách 3D Mạ Vàng Cổ Điển */}
                  <div className="w-[4px] h-full bg-gradient-to-b from-[#F2C14E] via-[#8B1E0F] to-[#F2C14E] shadow-[0_0_15px_rgba(0,0,0,0.95)] z-20 shrink-0" />

                  {/* Trang Phải */}
                  {rightPageNum && rightPageNum <= totalPages ? (
                    <div className="relative w-1/2 h-full overflow-hidden bg-[#1A1009] flex items-center justify-center">
                      <img
                        src={pages[rightPageNum - 1].src}
                        alt={pages[rightPageNum - 1].title}
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                      />
                      {/* Đổ bóng gáy sách về phía bên trái */}
                      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    <div className="w-1/2 h-full bg-[#1A1009]" />
                  )}
                </div>
              )
            ) : (
              /* ── 1 TRANG DUY NHẤT (MOBILE) ── */
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.95)] border-2 border-[#F2C14E]/60 bg-[#120803] max-w-[460px] max-h-[58vh] aspect-[3/4] flex items-center justify-center">
                <img
                  src={pages[currentPage - 1].src}
                  alt={pages[currentPage - 1].title}
                  className="w-full h-full object-contain select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Mũi tên lật trang phải */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isDualView ? (currentPage >= totalPages - 1 && !isCover) : (currentPage >= totalPages)}
            className={`absolute right-1 sm:right-4 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#1C1008]/90 border-2 border-[#F2C14E]/70 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md ${
              (isDualView && currentPage >= totalPages - 1 && !isCover) || (!isDualView && currentPage >= totalPages)
                ? 'opacity-25 cursor-not-allowed pointer-events-none'
                : 'hover:scale-110 active:scale-95'
            }`}
            aria-label="Lật trang sau"
            title="Trang tiếp theo (Phím mũi tên phải)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* ── 3. BOTTOM CONTROL BAR VÀ THANH TRƯỢT TIẾN ĐỘ ── */}
        <div className="w-full pt-3 mt-1 border-t border-[#F2C14E]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FFE5A3]">
          {/* Số trang hiện tại */}
          <div
            className="flex items-center gap-2 font-bold shrink-0"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <span className="text-[#F2C14E]">❖</span>
            <span>
              {isDualView && !isCover ? (
                <>Trang <strong className="text-[#FFDE59] text-sm">{leftPageNum} - {rightPageNum}</strong> / {totalPages}</>
              ) : (
                <>Trang <strong className="text-[#FFDE59] text-sm">{currentPage}</strong> / {totalPages}</>
              )}
            </span>
            {zoomScale > 1 && (
              <span className="text-[11px] font-mono text-[#F2C14E] bg-black/40 px-2 py-0.5 rounded border border-[#F2C14E]/30 ml-1">
                Zoom {Math.round(zoomScale * 100)}%
              </span>
            )}
          </div>

          {/* Thanh trượt chọn trang */}
          <div className="flex-1 max-w-md w-full px-2 sm:px-4">
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-full accent-[#F2C14E] cursor-pointer"
            />
          </div>

          {/* Nút nhảy nhanh Đầu sách / Cuối sách */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 rounded bg-[#2D1B10] border border-[#F2C14E]/40 text-[11px] font-bold text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black transition-all cursor-pointer shadow-xs"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Đầu sách
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-1 rounded bg-[#2D1B10] border border-[#F2C14E]/40 text-[11px] font-bold text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black transition-all cursor-pointer shadow-xs"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Cuối sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
