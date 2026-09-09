'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Images, 
  ZoomIn, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  MapPin, 
  Sparkles,
  Maximize2,
  ChevronDown
} from 'lucide-react';

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

  // Trạng thái mở rộng (Pagination để không dàn trải khi có 50-90 ảnh)
  const INITIAL_COUNT = 10;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

        {/* Huy hiệu hiển thị rõ ràng số lượng ảnh */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a1a0e]/90 border border-[#c8aa6e]/50 text-xs sm:text-sm text-[#ffde59] shadow-md backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#ffde59] animate-pulse" />
          <span style={{ fontFamily: "'UTM Avo', sans-serif" }} className="font-bold tracking-wide">
            {totalCount} TẤM ẢNH TƯ LIỆU SẮC NÉT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffde59]/60" />
          <span className="text-xs text-[#FFE5A3]/80 font-normal">Bố cục Adaptive Bento Box</span>
        </div>
      </div>

      {/* ── LƯỚI ADAPTIVE BENTO BOX ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 w-full auto-rows-[minmax(180px,auto)]">
        {visibleItems.map((item, idx) => {
          const imgSrc = item.imageUrl || item.url || 'https://tunglam.mocwp.com/wp-content/uploads/2026/07/default-bg.jpg';
          const spanClass = getBentoSpan(idx);
          const captionText = item.noiDung || item.caption || '';
          const titleText = item.title && item.title !== 'Ảnh tư liệu' ? item.title : '';

          return (
            <div
              key={idx}
              onClick={() => {
                setLightboxIndex(idx);
                if (onSelectPhoto) onSelectPhoto(idx);
              }}
              className={`group relative ${spanClass} rounded-2xl overflow-hidden border border-[#c8aa6e]/40 hover:border-[#ffde59] shadow-xl hover:shadow-[0_0_20px_rgba(255,222,89,0.25)] cursor-pointer bg-[#1C120A] transition-all duration-500`}
            >
              {/* Hình ảnh tối ưu hóa */}
              <img
                src={imgSrc}
                alt={titleText || captionText || `Ảnh tư liệu #${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ objectPosition: item.imagePosition || 'center 50%' }}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                }}
              />

              {/* Lớp phủ Gradient sang trọng */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

              {/* Huy hiệu số thứ tự ảnh ở góc trên trái */}
              <div className="absolute top-3 left-3 z-10">
                <span 
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="px-2.5 py-1 rounded-lg bg-[#1a1008]/85 border border-[#c8aa6e]/60 text-[10px] sm:text-xs font-bold text-[#ffde59] tracking-wider shadow-md backdrop-blur-xs"
                >
                  #{String(idx + 1).padStart(2, '0')} / {totalCount}
                </span>
              </div>

              {/* Huy hiệu khu vực (nếu có) ở góc trên phải */}
              {item.khuVuc && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2 py-1 rounded-lg bg-black/60 border border-white/20 text-[10px] text-white/90 flex items-center gap-1 backdrop-blur-xs">
                    <MapPin className="w-2.5 h-2.5 text-[#ffde59]" />
                    <span className="truncate max-w-[120px]">{item.khuVuc}</span>
                  </span>
                </div>
              )}

              {/* Nút phóng to ở tâm khi hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-[#ffde59] text-[#1a1008] flex items-center justify-center shadow-[0_0_15px_rgba(255,222,89,0.8)] scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>

              {/* Chú thích ảnh & Tiêu đề ở đáy ảnh */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-10 flex flex-col justify-end space-y-1">
                {titleText && (
                  <h3
                    style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Avo', serif" }}
                    className="text-xs sm:text-sm font-bold text-[#ffde59] line-clamp-1 leading-snug drop-shadow-md"
                  >
                    {titleText}
                  </h3>
                )}

                {captionText ? (
                  <p className="text-[11px] sm:text-xs text-[#F5EADB]/90 line-clamp-2 leading-relaxed drop-shadow-sm font-normal">
                    {captionText}
                  </p>
                ) : (
                  <p className="text-[10px] text-[#FFE5A3]/60 italic group-hover:text-[#ffde59]/90 transition-colors">
                    Nhấp để phóng to toàn màn hình
                  </p>
                )}
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

      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar: Bộ đếm ảnh & Nút đóng */}
          <div 
            className="flex items-center justify-between w-full max-w-6xl mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span 
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="px-3 py-1.5 rounded-xl bg-[#2a1a0e] border border-[#c8aa6e]/50 text-xs sm:text-sm font-bold text-[#ffde59] shadow-md"
              >
                ẢNH {lightboxIndex + 1} / {totalCount}
              </span>
              {items[lightboxIndex].khuVuc && (
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs text-white/80 hidden sm:flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#ffde59]" />
                  <span>{items[lightboxIndex].khuVuc}</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 rounded-xl bg-[#2a1a0e] border border-[#c8aa6e]/50 text-white/80 hover:text-white hover:bg-red-950/80 transition-all cursor-pointer"
              title="Đóng (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo Display with Navigation Arrows */}
          <div 
            className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev button */}
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1))}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-[#1A1008]/80 hover:bg-[#ffde59] text-white hover:text-[#1A1008] border border-[#c8aa6e]/60 shadow-xl transition-all cursor-pointer hover:scale-110"
              title="Ảnh trước (Mũi tên trái)"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* High-res Image */}
            <img
              src={items[lightboxIndex].imageUrl || items[lightboxIndex].url}
              alt={items[lightboxIndex].title || 'Ảnh tư liệu'}
              className="max-h-[65vh] sm:max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl border border-[#c8aa6e]/30"
              style={{ objectPosition: items[lightboxIndex].imagePosition || 'center' }}
            />

            {/* Next button */}
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-[#1A1008]/80 hover:bg-[#ffde59] text-white hover:text-[#1A1008] border border-[#c8aa6e]/60 shadow-xl transition-all cursor-pointer hover:scale-110"
              title="Ảnh tiếp theo (Mũi tên phải)"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Bottom Bar: Chú thích đầy đủ */}
          <div 
            className="w-full max-w-4xl mx-auto text-center z-10 bg-[#1C120A]/90 border border-[#c8aa6e]/40 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {items[lightboxIndex].title && items[lightboxIndex].title !== 'Ảnh tư liệu' && (
              <h3 
                style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                className="text-base sm:text-lg font-bold text-[#ffde59] mb-1"
              >
                {items[lightboxIndex].title}
              </h3>
            )}
            {items[lightboxIndex].noiDung || items[lightboxIndex].caption ? (
              <p className="text-xs sm:text-sm text-[#F5EADB]/90 leading-relaxed max-w-2xl mx-auto">
                {items[lightboxIndex].noiDung || items[lightboxIndex].caption}
              </p>
            ) : (
              <p className="text-xs text-[#FFE5A3]/50 italic">Không có chú thích văn bản</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
