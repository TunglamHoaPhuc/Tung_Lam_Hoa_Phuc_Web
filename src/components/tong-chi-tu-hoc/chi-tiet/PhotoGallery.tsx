'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Images, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  ChevronLeft, 
  ChevronRight, 
  X, 
  MapPin, 
  ChevronDown
} from 'lucide-react';
import { getImageUrl, getHighResImageUrl, getOptimizedNextImageUrl } from '@/utils/image';

export interface AnhTuLieu {
  imageUrl?: string;
  url?: string;
  imagePosition?: string;
  title?: string;
  caption?: string;
  khuVuc?: string;
  noiDung?: string;
  space3dLink?: string;
}

interface PropsBoSuuTapAnh {
  photoGallery?: AnhTuLieu[];
  onSelectPhoto?: (index: number) => void;
  title?: string;
}

export function PhotoGallery({ 
  photoGallery = [], 
  onSelectPhoto,
  title = 'BỘ SƯU TẬP ẢNH TƯ LIỆU'
}: PropsBoSuuTapAnh) {
  const items = photoGallery && photoGallery.length > 0 ? photoGallery : [];
  const totalCount = items.length;

  // Trạng thái mở rộng (Pagination để không dàn trải khi có nhiều ảnh)
  const INITIAL_COUNT = 10;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Trạng thái phóng to (Zoom) và kéo rê ảnh (Pan/Drag)
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset zoom & pan khi đổi ảnh
  useEffect(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, [lightboxIndex]);

  // Điều khiển phím bấm cho Lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
    if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
  }, [lightboxIndex, items.length]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, handleKeyDown]);

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale((prev) => Math.min(prev + 0.35, 4));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag / Pan logic khi zoom
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (totalCount === 0) return null;

  // Quy luật phân bổ lưới Adaptive Bento Box:
  // Tự động sắp xếp ảnh ngang, ảnh dọc đan xen hài hòa
  const getBentoSpan = (index: number) => {
    const mod = index % 8;
    switch (mod) {
      case 0:
        // Thẻ Hero Bento nổi bật (2 cột x 2 hàng trên desktop)
        return 'col-span-1 md:col-span-2 row-span-2 min-h-[340px] md:min-h-[460px]';
      case 1:
        // Thẻ vừa (1 cột x 1 hàng)
        return 'col-span-1 row-span-1 min-h-[220px] md:min-h-[250px]';
      case 2:
        // Thẻ ảnh dọc (1 cột x 2 hàng)
        return 'col-span-1 row-span-2 min-h-[340px] md:min-h-[460px]';
      case 3:
        // Thẻ vừa (1 cột x 1 hàng)
        return 'col-span-1 row-span-1 min-h-[220px] md:min-h-[250px]';
      case 4:
        // Thẻ ảnh ngang panorama (2 cột x 1 hàng)
        return 'col-span-1 md:col-span-2 row-span-1 min-h-[230px] md:min-h-[260px]';
      case 5:
        // Thẻ vừa (1 cột x 1 hàng)
        return 'col-span-1 row-span-1 min-h-[220px] md:min-h-[250px]';
      case 6:
        // Thẻ vừa (1 cột x 1 hàng)
        return 'col-span-1 row-span-1 min-h-[220px] md:min-h-[250px]';
      case 7:
        // Thẻ ảnh ngang panorama (2 cột x 1 hàng)
        return 'col-span-1 md:col-span-2 row-span-1 min-h-[230px] md:min-h-[260px]';
      default:
        return 'col-span-1 row-span-1 min-h-[220px]';
    }
  };

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < totalCount;

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section id="bo-suu-tap-anh" className="scroll-mt-24 pt-10 pb-16 w-full relative">
      {/* ── HEADER BỘ SƯU TẬP ── */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 w-full mb-10">
        {/* Biểu tượng hoa sen vàng */}
        <div className="w-12 h-10 border border-[#ffde59]/80 rounded-xl bg-gradient-to-b from-[#472d16] to-[#241508] flex items-center justify-center shadow-[0_0_15px_rgba(255,222,89,0.35)] z-10">
          <Images className="w-5 h-5 text-[#ffde59]" />
        </div>

        {/* Tiêu đề & Tia sáng hoàng kim */}
        <div className="flex items-center justify-center w-full my-2">
          <div className="flex-1 flex items-center justify-end">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
          </div>

          <h2
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-3xl sm:text-5xl text-[#ffde59] uppercase tracking-wider mx-4 sm:mx-8 font-normal drop-shadow-[0_0_15px_rgba(255,222,89,0.7)]"
          >
            {title}
          </h2>

          <div className="flex-1 flex items-center justify-start">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
            <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
          </div>
        </div>
      </div>

      {/* ── LƯỚI ADAPTIVE BENTO BOX ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 w-full auto-rows-[minmax(180px,auto)]">
        {visibleItems.map((item, idx) => {
          const rawSrc = getImageUrl(item.imageUrl || item.url) || 'https://admin.tunglamhoaphuc.com/wp-content/uploads/2026/07/default-bg.jpg';
          const directHighRes = getHighResImageUrl(item.imageUrl || item.url) || rawSrc;
          // Lưới Bento dùng ảnh WebP tối ưu qua GPU/SIMD Sharp (1080px, nén chỉ ~70-120KB)
          const previewSrc = getOptimizedNextImageUrl(item.imageUrl || item.url, 1080, 75) || directHighRes;
          const spanClass = getBentoSpan(idx);
          const captionText = item.noiDung || item.caption || '';
          const titleText = item.title && item.title !== 'Ảnh tư liệu' ? item.title : '';

          return (
            <div
              key={idx}
              onClick={() => {
                setLightboxIndex(idx);
              }}
              className={`group relative ${spanClass} rounded-2xl overflow-hidden border border-[#f2c14e]/35 hover:border-[#ffde59] shadow-xl hover:shadow-[0_0_20px_rgba(255,222,89,0.25)] cursor-pointer bg-[#1C120A] transition-all duration-500`}
            >
              {/* Hình ảnh tối ưu hóa WebP siêu nét và nhẹ */}
              <img
                src={previewSrc}
                alt={titleText || captionText || `Ảnh tư liệu #${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ objectPosition: item.imagePosition || 'center 50%' }}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== directHighRes && directHighRes) {
                    target.src = directHighRes;
                  } else if (target.src !== rawSrc && rawSrc) {
                    target.src = rawSrc;
                  } else {
                    target.src = '/images/toan-canh-chua.jpg';
                  }
                }}
              />

              {/* Lớp phủ Gradient dịu mắt ở chân ảnh */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1C120B]/95 via-[#1C120B]/50 to-transparent pointer-events-none" />

              {/* Huy hiệu số thứ tự ảnh ở góc trên trái */}
              <div className="absolute top-3 left-3 z-10">
                <span 
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="px-2.5 py-1 rounded-lg bg-[#1a1008]/85 border border-[#c8aa6e]/60 text-[10px] sm:text-xs font-bold text-[#ffde59] tracking-wider shadow-md backdrop-blur-xs"
                >
                  #{String(idx + 1).padStart(2, '0')} / {totalCount}
                </span>
              </div>

              {/* ── GIAO DIỆN HOVER CHUẨN NGHỆ THUẬT PHẬT GIÁO (KHUNG VIỀN KÉP HOÀNG KIM) ── */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#25170E]/90 via-[#3D2817]/65 to-transparent backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-3 sm:p-5 text-center pointer-events-none z-20">
                <div className="absolute inset-3 sm:inset-4 md:inset-5 rounded-xl md:rounded-2xl border border-[#ffde59]/70 bg-[#452a15]/85 flex flex-col items-center justify-center p-3 sm:p-5 text-center shadow-[0_0_30px_rgba(242,193,78,0.3)]">
                  <h3
                    style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif" }}
                    className="text-white font-normal uppercase tracking-wide transition-all duration-300 group-hover:-translate-y-0.5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-snug max-w-[95%] mx-auto text-sm sm:text-base md:text-lg text-center line-clamp-2"
                  >
                    {titleText || `ẢNH TƯ LIỆU #${idx + 1}`}
                  </h3>

                  <div className="w-12 sm:w-16 h-[2px] bg-[#ffde59] my-2 sm:my-2.5 shadow-[0_0_8px_#ffde59]" />

                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-[#e3d2c1] text-xs sm:text-sm font-normal leading-relaxed tracking-wide px-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] text-center line-clamp-3 sm:line-clamp-4"
                  >
                    {captionText || item.khuVuc || 'Ảnh tư liệu ghi lại tại Tùng Lâm Hòa Phúc'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── NÚT MỞ RỘNG (NẾU CÒN ẢNH) ĐỂ TRÁNH DÀN TRẢI ── */}
      {hasMore && (
        <div className="mt-8 flex justify-center w-full">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 12, totalCount))}
            className="group px-7 py-3 rounded-2xl bg-gradient-to-r from-[#382211] via-[#4d3018] to-[#382211] border border-[#ffde59]/60 hover:border-[#ffde59] text-[#ffde59] font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,222,89,0.35)] hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Images className="w-4 h-4 text-[#ffde59]" />
            <span style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              Xem Thêm Ảnh Tư Liệu (Còn {totalCount - visibleCount} / {totalCount} ảnh)
            </span>
            <ChevronDown className="w-4 h-4 text-[#ffde59] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* ── POP-UP LIGHTBOX MODAL CHUẨN NGHỆ THUẬT PHẬT GIÁO (HỖ TRỢ ZOOM & PAN) ── */}
      {lightboxIndex !== null && currentItem && (
        <div 
          className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* MODAL CONTAINER */}
          <div 
            className="relative max-w-4xl w-full rounded-2xl border border-[#F2C14E]/60 bg-[#25170E] p-4 sm:p-6 md:p-7 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col items-center max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. HEADER BAR */}
            <div className="relative w-full flex items-center justify-center border-b border-[#F2C14E]/30 pb-3 mb-3.5">
              <h2
                className="text-2xl sm:text-3xl font-normal uppercase text-[#ffde59] tracking-wider text-center drop-shadow-[0_0_15px_rgba(255,222,89,0.7)]"
                style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
              >
                {title}
              </h2>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Đóng (ESC)"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl border border-[#F2C14E]/50 bg-[#1C120B]/80 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#25170E] transition-all cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. IMAGE FRAME WITH ZOOM & DRAG / PAN */}
            <div
              className={`relative w-full h-[340px] sm:h-[440px] md:h-[520px] rounded-xl overflow-hidden border border-[#F2C14E]/40 bg-[#1C120B] p-2 flex items-center justify-center shadow-inner group ${
                zoomScale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onClick={() => {
                if (zoomScale === 1) handleZoomIn();
              }}
            >
              {/* Prev button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
                }}
                className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#F2C14E]/60 bg-[#1C120B]/80 hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                title="Ảnh trước (Mũi tên trái)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main Photo with Transform */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out select-none"
                style={{
                  transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
                }}
              >
                <img
                  src={
                    getOptimizedNextImageUrl(currentItem.imageUrl || currentItem.url, 1920, 75) ||
                    getHighResImageUrl(currentItem.imageUrl || currentItem.url) ||
                    getImageUrl(currentItem.imageUrl || currentItem.url)
                  }
                  alt={currentItem.title || 'Ảnh tư liệu'}
                  className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-2xl"
                  draggable={false}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const directHighRes = getHighResImageUrl(currentItem.imageUrl || currentItem.url);
                    const rawFallback = getImageUrl(currentItem.imageUrl || currentItem.url);
                    if (target.src !== directHighRes && directHighRes) {
                      target.src = directHighRes;
                    } else if (target.src !== rawFallback && rawFallback) {
                      target.src = rawFallback;
                    }
                  }}
                />
              </div>

              {/* Next button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#F2C14E]/60 bg-[#1C120B]/80 hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                title="Ảnh tiếp theo (Mũi tên phải)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Zoom Control Toolbar Floating Bottom-Right */}
              <div
                className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 p-1.5 rounded-xl border border-[#F2C14E]/40 bg-[#1C120B]/90 backdrop-blur-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg text-[#FFE5A3] hover:bg-[#F2C14E]/20 hover:text-[#ffde59] transition-colors cursor-pointer"
                  title="Phóng to (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg text-[#FFE5A3] hover:bg-[#F2C14E]/20 hover:text-[#ffde59] transition-colors cursor-pointer"
                  title="Thu nhỏ (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 rounded-lg text-[#FFE5A3] hover:bg-[#F2C14E]/20 hover:text-[#ffde59] transition-colors cursor-pointer"
                  title="Đặt lại kích thước"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#F2C14E] px-1 font-bold">
                  {Math.round(zoomScale * 100)}%
                </span>
              </div>
            </div>

            {/* 3. CAPTION & DETAIL INFO PANEL (NỘI DUNG 1 BÊN - KHU VỰC 1 BÊN) */}
            <div className="w-full mt-4 pt-3.5 border-t border-[#F2C14E]/30 flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 text-left">
              {/* BÊN TRÁI: TIÊU ĐỀ & NỘI DUNG CHÚ THÍCH */}
              <div className="flex-1 min-w-0 space-y-2">
                <h3
                  style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif" }}
                  className="text-lg sm:text-2xl font-normal uppercase text-[#ffde59] tracking-wide drop-shadow-sm leading-snug"
                >
                  {currentItem.title && currentItem.title !== 'Ảnh tư liệu'
                    ? currentItem.title
                    : 'ẢNH TƯ LIỆU'}
                </h3>

                <div className="w-16 h-[2px] bg-gradient-to-r from-[#ffde59] to-transparent shadow-[0_0_8px_#ffde59]" />

                <p
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs sm:text-sm text-[#e3d2c1] font-normal leading-relaxed text-justify [text-align-last:left]"
                >
                  {currentItem.noiDung || currentItem.caption || 'Hình ảnh tư liệu tôn nghiêm tại Tùng Lâm Hòa Phúc.'}
                </p>
              </div>

              {/* BÊN PHẢI: KHU VỰC / VỊ TRÍ (FONT UTM AVO NGHIÊNG) */}
              {currentItem.khuVuc && (
                <div className="shrink-0 w-full md:w-auto md:min-w-[210px] md:max-w-[280px] p-3 rounded-xl border border-[#F2C14E]/40 bg-[#1C120B]/85 backdrop-blur-xs flex flex-col gap-1 shadow-md">
                  <div className="flex items-center gap-1.5 text-[#F2C14E] text-[11px] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#ffde59] shrink-0" />
                    <span
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="italic font-bold"
                    >
                      Vị trí / Khu vực:
                    </span>
                  </div>
                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs sm:text-sm text-[#FFE5A3] italic font-medium leading-relaxed pl-5"
                  >
                    {currentItem.khuVuc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PhotoGallery;
