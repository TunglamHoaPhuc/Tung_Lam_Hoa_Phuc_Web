'use client';

import React, { FC, useState, useRef } from 'react';
import {
  HERITAGE_MAP_IMAGE,
  RegionType,
  HeritageBentoCluster,
  HERITAGE_BENTO_CLUSTERS,
  ALL_HERITAGE_PHOTOS,
  HeritagePhotoItem,
} from '@/data/heritageGalleryData';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  Eye,
  Calendar,
  Compass,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface Heritage2DInteractiveMapProps {
  activeRegion: RegionType;
  onSelectRegion: (region: RegionType) => void;
  onOpenClusterLightbox: (cluster: HeritageBentoCluster) => void;
  onOpenPhotoLightbox: (photo: HeritagePhotoItem) => void;
}

interface MapPinPoint {
  id: string;
  name: string;
  region: 'BAC' | 'TRUNG' | 'NAM';
  topPercent: number;
  leftPercent: number;
  featuredTitle: string;
  thumbnail: string;
  theme: 'DOI_SONG' | 'PHAT_GIAO';
  year: string;
}

const HISTORICAL_PINS: MapPinPoint[] = [
  // ── MIỀN BẮC ──
  {
    id: 'pin-hanoi',
    name: 'Thăng Long - Hà Nội',
    region: 'BAC',
    topPercent: 24.5,
    leftPercent: 44.5,
    featuredTitle: 'Chùa Một Cột & Tàu Điện Bờ Hồ',
    thumbnail: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Một Cột xưa.jpg',
    theme: 'PHAT_GIAO',
    year: '1872 — 1954',
  },
  {
    id: 'pin-bacninh',
    name: 'Bắc Ninh - Kinh Bắc',
    region: 'BAC',
    topPercent: 22.8,
    leftPercent: 47.2,
    featuredTitle: 'Chùa Đọ Quang Minh Tự (1897)',
    thumbnail: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Đọ có tên chữ là Quang Minh tự, ở Làng Đỗ Xá nay thuộc địa phận Ninh Giang, thành phố Bắc Ninh, ảnh được chụp vào năm 1897.jpg',
    theme: 'PHAT_GIAO',
    year: '1897',
  },
  {
    id: 'pin-namdinh',
    name: 'Nam Định - Phủ Giày',
    region: 'BAC',
    topPercent: 27.5,
    leftPercent: 46.8,
    featuredTitle: 'Lễ Hội Phủ Giày Thập Niên 1920',
    thumbnail: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Nhóm phụ nữ vận chuyển đồ thờ tự chuẩn bị cho đám rước của lễ hội Phủ Giày ở Nam Định thập niên 1920.jpg',
    theme: 'DOI_SONG',
    year: '1920s',
  },
  {
    id: 'pin-haiphong',
    name: 'Hải Phòng - Chùa Dư Hàng',
    region: 'BAC',
    topPercent: 25.2,
    leftPercent: 50.5,
    featuredTitle: 'Gác Chuông Chùa Dư Hàng Cổ Kính',
    thumbnail: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Vị cao tăng đứng gần gác chuông Chùa Dư Hàng – Phúc Lâm Tự, chứng nhân lịch sử và kháng chiến tại Hải Phòng.jpg',
    theme: 'PHAT_GIAO',
    year: 'Đầu TK 20',
  },

  // ── MIỀN TRUNG ──
  {
    id: 'pin-thanhhoa',
    name: 'Đông Sơn - Thanh Hóa',
    region: 'TRUNG',
    topPercent: 31.0,
    leftPercent: 44.0,
    featuredTitle: 'Chợ Quê Làng Đông Sơn Xưa',
    thumbnail: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Trung/Một phụ nữ gánh vàng mã ra chợ ở làng Đông Sơn, Thanh Hóa..jpg',
    theme: 'DOI_SONG',
    year: 'Đầu TK 20',
  },
  {
    id: 'pin-hue',
    name: 'Cố Đô Huế - Thiên Mụ Tự',
    region: 'TRUNG',
    topPercent: 48.0,
    leftPercent: 57.5,
    featuredTitle: 'Tháp Phước Duyên & Cao Tăng Xứ Huế',
    thumbnail: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Bảo tháp Phước Duyên tại chùa Thiên Mụ, Huế – Biểu tượng tôn nghiêm của Phật giáo xứ Huế.jpg',
    theme: 'PHAT_GIAO',
    year: '1920 — 1954',
  },

  // ── MIỀN NAM ──
  {
    id: 'pin-saigon',
    name: 'Sài Gòn - Gia Định',
    region: 'NAM',
    topPercent: 78.5,
    leftPercent: 56.5,
    featuredTitle: 'Chợ Bến Thành & Chùa Xá Lợi',
    thumbnail: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Chợ Bến Thành Sài Gòn năm 1964 – Vẻ đẹp sôi động qua ống kính người Pháp.jpg',
    theme: 'DOI_SONG',
    year: '1875 — 1975',
  },
  {
    id: 'pin-cantho',
    name: 'Cần Thơ - Sông Cửu Long',
    region: 'NAM',
    topPercent: 84.0,
    leftPercent: 51.5,
    featuredTitle: 'Thuyền Gỗ Sông Hậu & Hội Phật Học',
    thumbnail: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Thuyền gỗ trên sông Hậu năm 1965 – Vận chuyển hàng hóa và người dân đến chợ Cần Thơ, giữa lòng Sông Cửu Long.jpg',
    theme: 'DOI_SONG',
    year: '1950 — 1965',
  },
];

export const Heritage2DInteractiveMap: FC<Heritage2DInteractiveMapProps> = ({
  activeRegion,
  onSelectRegion,
  onOpenClusterLightbox,
  onOpenPhotoLightbox,
}) => {
  const [scale, setScale] = useState(1);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPin, setSelectedPin] = useState<MapPinPoint | null>(null);
  const [isMapImageLoaded, setIsMapImageLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.8));
  const handleReset = () => {
    setScale(1);
    setPositionX(0);
    setPositionY(0);
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - positionX, y: e.clientY - positionY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPositionX(e.clientX - dragStart.x);
    setPositionY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Filtered pins
  const visiblePins = HISTORICAL_PINS.filter(
    (pin) => activeRegion === 'ALL' || pin.region === activeRegion
  );

  return (
    <div className="relative w-full h-[680px] sm:h-[750px] md:h-[820px] rounded-3xl overflow-hidden border-2 border-[#F2C14E]/40 bg-[#150D08] shadow-[0_25px_60px_rgba(0,0,0,0.9)] select-none">
      {/* ── TOP MAP CONTROLS OVERLAY ── */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Map Title Badge */}
        <div className="pointer-events-auto bg-[#1A1009]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#F2C14E]/40 shadow-xl flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-[#F2C14E] animate-spin-slow" />
          <div>
            <h4
              className="text-base sm:text-lg font-bold text-[#F2C14E] uppercase tracking-wider"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              SƠ ĐỒ 2D KHÔNG GIAN BẢO TÀNG DI SẢN
            </h4>
            <p className="text-[10px] sm:text-xs text-[#C4B5A5]">
              Chạm hoặc nhấp vào các biểu tượng mạ vàng để thưởng lãm tư liệu 3 miền
            </p>
          </div>
        </div>

        {/* Zoom & Reset Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#1A1009]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#F2C14E]/30 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-[#2A1D14] text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1A1009] transition-all cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-[#2A1D14] text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1A1009] transition-all cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#2A1D14] text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1A1009] transition-all cursor-pointer"
            title="Đặt lại góc nhìn"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── DRAGGABLE & ZOOMABLE MAP VIEWPORT ── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} overflow-hidden flex items-center justify-center`}
      >
        <div
          className="relative w-full max-w-[850px] aspect-[750/1000] transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${positionX}px, ${positionY}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Loading Spinner Skeleton */}
          {!isMapImageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1C130D]/80 z-10">
              <span className="text-3xl text-[#F2C14E] animate-spin mb-3">☸</span>
              <span className="text-xs uppercase tracking-widest text-[#F2C14E] font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                Đang tải bản đồ di sản...
              </span>
            </div>
          )}

          {/* THE AUTHENTIC VIETNAM HERITAGE MAP BACKGROUND */}
          <img
            src={HERITAGE_MAP_IMAGE}
            alt="Bản đồ Di sản Phật giáo Việt Nam"
            onLoad={() => setIsMapImageLoaded(true)}
            className={`w-full h-full object-contain filter brightness-95 contrast-105 pointer-events-none drop-shadow-[0_0_35px_rgba(0,0,0,0.8)] transition-opacity duration-700 ${
              isMapImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
          />

          {/* ── 3 LARGE REGIONAL HUB BADGES ── */}
          {/* Bắc Bộ Hub */}
          <div
            onClick={() => onSelectRegion('BAC')}
            className={`absolute top-[18%] left-[36%] z-20 cursor-pointer group transition-all duration-300 ${
              activeRegion === 'BAC' ? 'scale-110' : 'hover:scale-105 opacity-90'
            }`}
          >
            <div className="relative px-3.5 py-1.5 rounded-full bg-[#1A1009]/95 border-2 border-[#F2C14E] text-[#F2C14E] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_20px_rgba(242,193,78,0.5)]">
              <span className="w-2 h-2 rounded-full bg-[#F2C14E] animate-ping" />
              <span style={{ fontFamily: "'UTM Avo', sans-serif" }}>XỨ BẮC (15+ ẢNH)</span>
            </div>
          </div>

          {/* Trung Bộ Hub */}
          <div
            onClick={() => onSelectRegion('TRUNG')}
            className={`absolute top-[44%] left-[52%] z-20 cursor-pointer group transition-all duration-300 ${
              activeRegion === 'TRUNG' ? 'scale-110' : 'hover:scale-105 opacity-90'
            }`}
          >
            <div className="relative px-3.5 py-1.5 rounded-full bg-[#1A1009]/95 border-2 border-[#E59866] text-[#E59866] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_20px_rgba(229,152,102,0.5)]">
              <span className="w-2 h-2 rounded-full bg-[#E59866] animate-ping" />
              <span style={{ fontFamily: "'UTM Avo', sans-serif" }}>XỨ HUẾ (8+ ẢNH)</span>
            </div>
          </div>

          {/* Nam Bộ Hub */}
          <div
            onClick={() => onSelectRegion('NAM')}
            className={`absolute top-[74%] left-[48%] z-20 cursor-pointer group transition-all duration-300 ${
              activeRegion === 'NAM' ? 'scale-110' : 'hover:scale-105 opacity-90'
            }`}
          >
            <div className="relative px-3.5 py-1.5 rounded-full bg-[#1A1009]/95 border-2 border-[#58D68D] text-[#58D68D] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_20px_rgba(88,214,141,0.5)]">
              <span className="w-2 h-2 rounded-full bg-[#58D68D] animate-ping" />
              <span style={{ fontFamily: "'UTM Avo', sans-serif" }}>PHƯƠNG NAM (15+ ẢNH)</span>
            </div>
          </div>

          {/* ── HISTORICAL PINPOINTS WITH FLOATING PREVIEWS ── */}
          {visiblePins.map((pin) => {
            const isSelected = selectedPin?.id === pin.id;
            return (
              <div
                key={pin.id}
                style={{ top: `${pin.topPercent}%`, left: `${pin.leftPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                {/* Clickable Pin Beacon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(isSelected ? null : pin);
                  }}
                  className={`group relative flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  {/* Outer Pulsing Wave */}
                  <span className="absolute w-8 h-8 rounded-full bg-[#F2C14E]/30 animate-ping" />

                  {/* Pin Dot */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${
                      pin.theme === 'PHAT_GIAO'
                        ? 'bg-[#681B16] border-[#F2C14E] text-[#F2C14E]'
                        : 'bg-[#264E4C] border-[#8CE8DE] text-[#8CE8DE]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                  </div>
                </button>

                {/* ── Interactive Floating Tooltip Card ── */}
                {isSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 p-3 rounded-2xl bg-[#1A1009]/95 backdrop-blur-xl border border-[#F2C14E] shadow-[0_15px_40px_rgba(0,0,0,0.9)] z-40 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden mb-2 border border-[#F2C14E]/30">
                      <img src={pin.thumbnail} alt={pin.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 right-1.5 bg-[#1A1009]/80 px-2 py-0.5 rounded text-[9px] font-bold text-[#F2C14E]">
                        {pin.year}
                      </div>
                    </div>

                    <h5
                      className="text-sm font-bold text-[#FFE5A3] uppercase"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      {pin.name}
                    </h5>
                    <p className="text-[11px] text-[#D4C3B3] line-clamp-1 mt-0.5">
                      {pin.featuredTitle}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#F2C14E]/20 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const cluster = HERITAGE_BENTO_CLUSTERS.find((c) => c.region === pin.region);
                          if (cluster) onOpenClusterLightbox(cluster);
                        }}
                        className="w-full py-1.5 rounded-lg bg-[#F2C14E] hover:bg-[#FFE5A3] text-[#1A1009] font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Xem Chùm Ảnh</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM MAP LEGEND & QUICK FILTER BAR ── */}
      <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        {/* Legend */}
        <div className="pointer-events-auto bg-[#1A1009]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#F2C14E]/30 shadow-xl flex items-center gap-3 text-xs text-[#D4C3B3]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#681B16] border border-[#F2C14E]" />
            <span>Phật Giáo Cổ Tự</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#264E4C] border border-[#8CE8DE]" />
            <span>Đời Sống & Văn Hóa</span>
          </div>
        </div>

        {/* Explore All Clusters Button */}
        <button
          onClick={() => onOpenClusterLightbox(HERITAGE_BENTO_CLUSTERS[0])}
          className="pointer-events-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1A1009] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(242,193,78,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          <span>Khám Phá Toàn Bộ Bộ Sưu Tập</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
