'use client';

import { FC, useState, useEffect } from "react";
import { X, Sparkles, MapPin, BookOpen, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ArtVariation {
  id: string;
  title: string;
  subtitle?: string;
  location: string;
  meaning: string;
  imgUrl: string;
}

interface BuddhistArtGalleryProps {
  variations: ArtVariation[];
}

export const BuddhistArtGallery: FC<BuddhistArtGalleryProps> = ({ variations }) => {
  const [selectedArt, setSelectedArt] = useState<ArtVariation | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    if (selectedArt !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedArt]);

  if (!variations || variations.length === 0) return null;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY * -0.0025;
    setZoomScale((prev) => {
      const next = Math.min(Math.max(1, prev + delta), 4);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale > 1) {
      e.preventDefault();
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full my-16 border-t pt-12" style={{ borderColor: "rgba(242,193,78,0.2)" }}>
      {/* ── Section Header ── */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-3" style={{ background: "rgba(242,193,78,0.15)", borderColor: "#F2C14E", color: "#F2C14E" }}>
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <h2
          className="text-3xl md:text-5xl font-normal uppercase tracking-widest text-[#ffde59]"
          style={{
            fontFamily: "'UTM Niagara', serif",
            textShadow: "0 0 28px rgba(242,193,78,0.6)",
          }}
        >
          NGHỆ THUẬT PHẬT GIÁO
        </h2>
        <p className="text-xs text-[#c9b896] uppercase tracking-widest mt-2" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
          Các hình thái &amp; dị bản nghệ thuật tôn giáo qua các thời kỳ lịch sử
        </p>
      </div>

      {/* ── Grid 3 cột các tác phẩm nghệ thuật với hover overlay chuẩn Vũ trụ ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {variations.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArt(art)}
            className="group relative overflow-hidden cursor-pointer rounded-2xl border border-[#f2c14e]/35 hover:border-[#ffde59] transition-all duration-500 shadow-xl bg-[#1c120b] aspect-[4/3]"
          >
            <img
              src={art.imgUrl}
              alt={art.title}
              className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1C120B]/95 via-[#1C120B]/50 to-transparent pointer-events-none" />

            {/* Hover Frame Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#25170E]/90 via-[#3D2817]/65 to-transparent backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center p-4 text-center pointer-events-none z-20">
              <div className="absolute inset-3 rounded-xl border border-[#ffde59]/70 bg-[#452a15]/85 flex flex-col items-center justify-center p-3 text-center shadow-[0_0_30px_rgba(242,193,78,0.3)]">
                <h3
                  style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif" }}
                  className="text-white font-normal uppercase tracking-wide leading-snug text-sm sm:text-base text-center line-clamp-2"
                >
                  {art.title}
                </h3>
                <div className="w-12 h-[2px] bg-[#ffde59] my-2 shadow-[0_0_8px_#ffde59]" />
                <p
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-[#e3d2c1] text-xs font-normal leading-relaxed text-center line-clamp-3"
                >
                  {art.meaning}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pop-up Lightbox khi nhấp chọn Dị Bản ── */}
      {selectedArt && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
          onClick={() => setSelectedArt(null)}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl border border-[#F2C14E]/60 bg-[#25170E] p-4 sm:p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col items-center max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
          >
            {/* Header */}
            <div className="relative w-full flex items-center justify-center border-b border-[#F2C14E]/30 pb-3.5 mb-4">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase text-[#ffde59] tracking-wider text-center drop-shadow-[0_0_15px_rgba(255,222,89,0.7)]"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                NGHỆ THUẬT PHẬT GIÁO
              </h2>

              <button
                type="button"
                onClick={() => setSelectedArt(null)}
                aria-label="Đóng"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl border border-[#F2C14E]/50 bg-[#1C120B]/80 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#25170E] transition-all cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Container with Zoom & Pan */}
            <div
              className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] rounded-xl overflow-hidden border border-[#F2C14E]/40 bg-[#1C120B] p-2 flex items-center justify-center shadow-inner group"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
                <img
                  src={selectedArt.imgUrl}
                  alt={selectedArt.title}
                  draggable={false}
                  style={{
                    transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  }}
                  className="max-h-full max-w-full object-contain rounded-lg filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                />
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#1C120B]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#F2C14E]/50 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale((prev) => Math.min(prev + 0.35, 4));
                  }}
                  title="Phóng to"
                  className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale((prev) => {
                      const next = Math.max(prev - 0.35, 1);
                      if (next === 1) setPanOffset({ x: 0, y: 0 });
                      return next;
                    });
                  }}
                  title="Thu nhỏ"
                  className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                {(zoomScale !== 1 || panOffset.x !== 0 || panOffset.y !== 0) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomScale(1);
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    title="Khôi phục gốc"
                    className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-white text-lg sm:text-xl md:text-2xl font-normal uppercase text-center mt-3 mb-1 tracking-wide leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif" }}
            >
              {selectedArt.title}
            </h3>

            {/* Subtitle */}
            {selectedArt.subtitle && (
              <p
                className="text-[#ffde59] text-xs sm:text-sm font-normal tracking-wide text-center mb-3 opacity-90"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {selectedArt.subtitle}
              </p>
            )}

            {/* Two Column Details */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-[#F2C14E]/30 pt-4 mt-2 bg-[#1C120B]/60 p-4 rounded-xl border border-[#F2C14E]/20">
              <div className="flex flex-col items-center text-center">
                <span
                  className="text-[#ffde59] text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-wider drop-shadow-[0_0_8px_rgba(242,193,78,0.5)] mb-1"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  KHU VỰC
                </span>
                <span className="text-white text-sm sm:text-base font-semibold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {selectedArt.location}
                </span>
              </div>

              <div className="flex flex-col items-center text-center border-t md:border-t-0 md:border-l border-[#F2C14E]/30 pt-3 md:pt-0 md:pl-4">
                <span
                  className="text-[#ffde59] text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-wider drop-shadow-[0_0_8px_rgba(242,193,78,0.5)] mb-1"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  Ý NGHĨA
                </span>
                <p className="text-xs sm:text-sm text-[#c9b896] leading-relaxed italic" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  &ldquo;{selectedArt.meaning}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
