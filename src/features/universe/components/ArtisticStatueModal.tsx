'use client';

import React, { FC, useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export interface NTPGModalItem {
  id: string;
  title: string;
  subtitle?: string;
  caption?: string;
  category?: string;
  imgUrl: string;
  areaName?: string;
  location?: string;
  meaning?: string;
}

interface ArtisticStatueModalProps {
  items: NTPGModalItem[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (idx: number) => void;
}

export const ArtisticStatueModal: FC<ArtisticStatueModalProps> = ({
  items,
  currentIndex,
  onClose,
  onSelectIndex,
}) => {
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom & pan when image changes and lock body scroll
  useEffect(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    if (currentIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  if (currentIndex === null || !items || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const total = items.length;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex - 1 + total) % total);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex + 1) % total);
  };

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

  // Drag / Pan logic
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

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/25 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      {/* ── MODAL CONTAINER ── */}
      <div
        className="relative max-w-3xl w-full rounded-2xl border border-[#F2C14E]/60 bg-[#25170E] p-4 sm:p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col items-center max-h-[95vh] overflow-y-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. HEADER BAR */}
        <div className="relative w-full flex items-center justify-center border-b border-[#F2C14E]/30 pb-3.5 mb-4">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase text-[#ffde59] tracking-wider text-center drop-shadow-[0_0_15px_rgba(255,222,89,0.7)]"
            style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
          >
            NGHỆ THUẬT PHẬT GIÁO
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl border border-[#F2C14E]/50 bg-[#1C120B]/80 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#25170E] transition-all cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. IMAGE FRAME WITH ZOOM & DRAG / PAN */}
        <div
          className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] rounded-xl overflow-hidden border border-[#F2C14E]/40 bg-[#1C120B] p-2 flex items-center justify-center shadow-inner group"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {/* Zoomable & Pannable Image Container */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
            <img
              src={currentItem.imgUrl}
              alt={currentItem.title}
              style={{
                transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
                transition: isDragging ? 'none' : 'transform 0.25s ease-out',
              }}
              className="max-h-full max-w-full object-contain rounded-lg filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
              }}
            />
          </div>

          {/* Side Floating Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Ảnh trước"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#F2C14E]/60 bg-[#25170E]/80 backdrop-blur-md flex items-center justify-center text-[#ffde59] hover:bg-[#F2C14E] hover:text-[#25170E] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.7)] z-20"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Ảnh sau"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#F2C14E]/60 bg-[#25170E]/80 backdrop-blur-md flex items-center justify-center text-[#ffde59] hover:bg-[#F2C14E] hover:text-[#25170E] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.7)] z-20"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Zoom Controls Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#1C120B]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#F2C14E]/50 opacity-90 group-hover:opacity-100 transition-opacity z-20">
            <button
              type="button"
              onClick={handleZoomIn}
              title="Phóng to (Lăn chuột lên)"
              className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              title="Thu nhỏ (Lăn chuột xuống)"
              className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {(zoomScale !== 1 || panOffset.x !== 0 || panOffset.y !== 0) && (
              <button
                type="button"
                onClick={handleResetZoom}
                title="Khôi phục gốc"
                className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Hint Badge when zoomed */}
          {zoomScale > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 border border-[#F2C14E]/40 text-[11px] text-[#ffde59] font-medium backdrop-blur-md pointer-events-none z-20">
              Nhấp giữ &amp; Kéo để xem các góc tượng
            </div>
          )}
        </div>

        {/* 3. PAGINATION DOTS */}
        <div className="flex items-center justify-center gap-2 my-3">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 h-2.5 bg-[#ffde59] shadow-[0_0_10px_#ffde59]'
                  : 'w-2.5 h-2.5 bg-[#F2C14E]/30 hover:bg-[#F2C14E]'
              }`}
            />
          ))}
        </div>

        {/* 4. MAIN TITLE OF STATUE */}
        <h3
          className="text-white text-lg sm:text-xl md:text-2xl font-normal uppercase text-center mt-1 mb-1 tracking-wide leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif" }}
        >
          {currentItem.title}
        </h3>

        {/* SUBTITLE */}
        {(currentItem.subtitle || currentItem.caption) && (
          <p
            className="text-[#ffde59] text-xs sm:text-sm font-normal tracking-wide text-center mb-3 opacity-90"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {currentItem.subtitle || currentItem.caption}
          </p>
        )}

        {/* 5. TWO COLUMN DETAILS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-[#F2C14E]/30 pt-4 mt-1 bg-[#1C120B]/60 p-4 rounded-xl border border-[#F2C14E]/20">
          <div className="flex flex-col items-center text-center">
            <span
              className="text-[#ffde59] text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-wider drop-shadow-[0_0_8px_rgba(242,193,78,0.5)] mb-1"
              style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
            >
              KHU VỰC
            </span>
            <span
              className="text-white text-sm sm:text-base font-semibold leading-relaxed"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {currentItem.areaName || currentItem.location || "Tam Bảo"}
            </span>
          </div>

          <div className="flex flex-col items-center text-center border-t md:border-t-0 md:border-l border-[#F2C14E]/30 pt-3 md:pt-0 md:pl-4">
            <span
              className="text-[#ffde59] text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-wider drop-shadow-[0_0_8px_rgba(242,193,78,0.5)] mb-1"
              style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
            >
              Ý NGHĨA
            </span>
            <p
              className="text-xs sm:text-sm text-[#c9b896] leading-relaxed italic"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              "{currentItem.meaning || "Bảo vật di sản văn hóa tâm linh Phật giáo truyền thống."}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
