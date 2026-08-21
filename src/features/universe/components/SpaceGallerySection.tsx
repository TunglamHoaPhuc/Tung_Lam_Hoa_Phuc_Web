'use client';

import React, { FC, useState, useMemo, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { TAM_BAO_SPACES, TamBaoSpaceImage } from '@/data/tam-bao-detail-data';
import {
  BAO_TANG_SPACE_ITEMS,
  BAO_TANG_BACKGROUND_IMAGE,
  SpaceGalleryItem,
} from '@/data/bao-tang-space-data';
import { OtherAreasSection } from './OtherAreasSection';

interface SpaceGallerySectionProps {
  areaTitle?: string;
  spaces?: Array<TamBaoSpaceImage | SpaceGalleryItem>;
  /** Slug hiện tại để loại ra khỏi "Khám Phá Khu Vực Khác" */
  currentSlug?: string;
  /** Cho phép hiển thị hoặc ẩn phần "Khám Phá Khu Vực Khác" đi kèm */
  showOtherAreas?: boolean;
}

export const SpaceGallerySection: FC<SpaceGallerySectionProps> = ({
  areaTitle = 'TAM BẢO',
  spaces,
  currentSlug = 'tam-bao',
  showOtherAreas = true,
}) => {
  const isBaoTang =
    currentSlug === 'bao-tang' ||
    currentSlug === 'bao-tang-phat-giao' ||
    areaTitle.toUpperCase().includes('BẢO TÀNG');

  // Resolve space items based on current area
  const displayItems: Array<TamBaoSpaceImage | SpaceGalleryItem> = useMemo(() => {
    if (spaces && spaces.length > 0) return spaces;
    if (isBaoTang) return BAO_TANG_SPACE_ITEMS;
    return TAM_BAO_SPACES;
  }, [spaces, isBaoTang]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const initialLimit = 5;
  const hasMore = displayItems.length > initialLimit && !isExpanded;
  const remainingCount = displayItems.length - initialLimit;

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const areaDisplayName =
    areaTitle && areaTitle !== 'TÙNG LÂM HÒA PHÚC' && areaTitle !== 'ALL'
      ? areaTitle.includes('BẢO TÀNG')
        ? 'BẢO TÀNG'
        : areaTitle.toUpperCase()
      : 'TÙNG LÂM HÒA PHÚC';

  // ── FLUSH ADAPTIVE BENTO GRID SPAN CALCULATION (0 GAPS, 100% FLUSH) ──
  const getBentoSpanClass = (idx: number, total: number) => {
    if (total === 1) return 'col-span-1 sm:col-span-2 lg:col-span-4 row-span-1';
    if (total === 2) return 'col-span-1 sm:col-span-2 row-span-1';
    if (total === 3) {
      if (idx === 0) return 'col-span-1 sm:col-span-2 row-span-1';
      return 'col-span-1 row-span-1';
    }
    if (total === 4) return 'col-span-1 row-span-1';

    const pattern = idx % 5;
    const isLastBlock = idx >= Math.floor(total / 5) * 5;
    const remainder = total % 5;

    if (isLastBlock && remainder !== 0) {
      if (remainder === 1) return 'col-span-1 sm:col-span-2 lg:col-span-4 row-span-1';
      if (remainder === 2) return 'col-span-1 sm:col-span-2 row-span-1';
      if (remainder === 3) {
        if (pattern === 0) return 'col-span-1 sm:col-span-2 row-span-1';
        return 'col-span-1 row-span-1';
      }
      if (remainder === 4) return 'col-span-1 row-span-1';
    }

    if (pattern === 0) {
      return 'col-span-1 sm:col-span-2 row-span-2';
    }
    return 'col-span-1 row-span-1';
  };

  return (
    <>
      {/* ══════════════════════════════════════════════
          SECTION: KHÔNG GIAN BẢO TÀNG / KHU VỰC
      ══════════════════════════════════════════════ */}
      <section
        id="khong-gian"
        className={`w-full scroll-mt-24 py-12 md:py-16 relative overflow-hidden bg-transparent ${
          isBaoTang ? 'my-4' : ''
        }`}
      >
        {/* ── NỀN SECTION: DÙNG ẢNH TRIỂN LÃM SƯ TỔ NGỘ CHÂN TỬ VỚI LỚP PHỦ NÂU VÀNG THIỀN MÔN ── */}
        <div className="absolute top-10 sm:top-14 inset-x-0 h-[460px] sm:h-[540px] z-0 pointer-events-none overflow-hidden">
          <img
            src={isBaoTang ? BAO_TANG_BACKGROUND_IMAGE : '/images/vu-tru-phat-giao/toan-canh-chua.jpg'}
            alt="Không gian bảo tàng"
            className="w-full h-full object-cover opacity-15 sm:opacity-20 filter blur-[2px] scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
            }}
          />
          <div className="absolute inset-0 bg-[#2C1C11]/45" />

          {/* Top & Bottom Fades */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#2C1C11] via-[#2C1C11]/85 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/95 to-transparent" />

          {/* Left & Right Edge Gradients */}
          <div className="absolute left-0 inset-y-0 w-36 sm:w-56 bg-gradient-to-r from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
          <div className="absolute right-0 inset-y-0 w-36 sm:w-56 bg-gradient-to-l from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
        </div>

        <div className="relative z-10">
          {/* ── SECTION HEADER: Icon + Tiêu đề + 2 đường kẻ hai bên ── */}
          <div className="flex flex-col items-center text-center mb-10">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 mb-2 flex items-center justify-center"
              aria-hidden="true"
            >
              <img
                src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
                alt=""
                className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(242,193,78,0.95)] scale-135 transform-gpu"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
                }}
              />
            </div>

            <div className="flex items-center justify-center w-full gap-0 max-w-5xl mx-auto px-4">
              {/* Đường kẻ trái */}
              <div className="flex-1 flex items-center">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
                <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
              </div>

              <h2
                style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
                className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-5 sm:px-8"
              >
                KHÔNG GIAN {areaDisplayName}
              </h2>

              {/* Đường kẻ phải */}
              <div className="flex-1 flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
                <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
              </div>
            </div>

            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-xs sm:text-sm text-[#e3d2c1] tracking-wide font-normal max-w-xl mx-auto mt-2"
            >
              {isBaoTang
                ? 'Nơi lưu giữ pháp bảo, hiện vật cổ kính, tranh thư pháp và kỷ vật thiêng liêng chốn Tùng Lâm'
                : `Hình ảnh và không gian thanh tịnh tại ${areaDisplayName}`}
            </p>
          </div>

          {/* ── BENTO ADAPTIVE GRID KHÔNG GIAN BẢO TÀNG (2 HÀNG ĐẦU + NÚT XEM THÊM) ── */}
          {displayItems.length > 0 && (
            <div className="relative w-full max-w-6xl mx-auto px-4">
              <div
                className={`transition-all duration-500 ${
                  !isExpanded ? 'max-h-[700px] sm:max-h-[780px] overflow-hidden' : 'max-h-[5000px] overflow-visible'
                }`}
                style={
                  !isExpanded && hasMore
                    ? {
                        WebkitMaskImage:
                          'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.35) 82%, rgba(0,0,0,0) 100%)',
                        maskImage:
                          'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.35) 82%, rgba(0,0,0,0) 100%)',
                      }
                    : undefined
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-[320px] sm:auto-rows-[350px]">
                  {displayItems.map((space, idx) => {
                    const spanClass = getBentoSpanClass(idx, displayItems.length);
                    return (
                      <div key={space.id || idx} className={`${spanClass} w-full h-full`}>
                        <SpaceBentoCard
                          item={space}
                          idx={idx}
                          openLightbox={openLightbox}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NÚT XEM THÊM VỚI LỚP PHỦ GRADIENT MƯỢT MÀ */}
              {hasMore && (
                <div className="absolute inset-x-0 bottom-0 h-64 sm:h-72 md:h-80 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/95 via-35% via-[#2C1C11]/60 via-70% to-transparent pointer-events-none flex items-end justify-center pb-3 sm:pb-4 z-20">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="pointer-events-auto px-8 py-3.5 bg-gradient-to-r from-[#54361e] via-[#6B4B2A] to-[#54361e] hover:from-[#6B4B2A] hover:via-[#8B6439] hover:to-[#6B4B2A] border-2 border-[#f2c14e] hover:border-[#ffde59] text-[#ffde59] hover:text-white font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 shadow-[0_8px_28px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(242,193,78,0.6)] flex items-center gap-3 cursor-pointer uppercase tracking-wider transform hover:-translate-y-0.5"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <span>
                      XEM THÊM KHÔNG GIAN {areaDisplayName} (+{remainingCount} MỤC)
                    </span>
                    <span className="text-lg">➔</span>
                  </button>
                </div>
              )}

              {/* NÚT THU GỌN KHI ĐÃ MỞ RỘNG */}
              {isExpanded && displayItems.length > initialLimit && (
                <div className="w-full flex justify-center mt-8 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      const el = document.getElementById('khong-gian');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 bg-[#1C120B] border border-[#F2C14E]/60 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1C120B] font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <span>THU GỌN KHÔNG GIAN {areaDisplayName}</span>
                    <span className="text-xs">▲</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION: KHÁM PHÁ KHU VỰC KHÁC (Optional)
      ══════════════════════════════════════════════ */}
      {showOtherAreas && <OtherAreasSection currentSlug={currentSlug} />}

      {/* ══════════════════════════════════════════════
          INTERACTIVE ZOOMABLE & DRAGGABLE LIGHTBOX MODAL
      ══════════════════════════════════════════════ */}
      <SpaceGalleryModal
        items={displayItems}
        currentIndex={lightboxIndex}
        areaTitle={areaDisplayName}
        onClose={closeLightbox}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />
    </>
  );
};

/* ── BENTO CARD SUB-COMPONENT WITH HOVER REVEAL EFFECT ── */
interface SpaceBentoCardProps {
  item: TamBaoSpaceImage | SpaceGalleryItem;
  idx: number;
  openLightbox: (idx: number) => void;
}

const SpaceBentoCard: FC<SpaceBentoCardProps> = ({ item, idx, openLightbox }) => {
  const itemTitle = item.title;
  const itemSubtitle =
    'subtitle' in item && item.subtitle ? item.subtitle : item.caption || '';

  return (
    <div
      onClick={() => openLightbox(idx)}
      className="group relative overflow-hidden cursor-pointer rounded-2xl border border-[#f2c14e]/35 hover:border-[#ffde59] transition-all duration-500 shadow-xl bg-[#1c120b] w-full h-full"
    >
      {/* 1. Base Image */}
      <img
        src={item.imgUrl}
        alt={itemTitle}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
        }}
      />

      {/* Soft gradient fade at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1C120B]/90 via-[#1C120B]/40 to-transparent pointer-events-none" />

      {/* 2. HOVER REVEAL CARD OVERLAY (Đưa chuột vào mới hiển thị tiêu đề và sub tiêu đề mạ vàng) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#25170E]/90 via-[#3D2817]/65 to-transparent backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-3 sm:p-5 text-center pointer-events-none z-20">
        <div className="absolute inset-3 sm:inset-4 md:inset-5 rounded-xl md:rounded-2xl border border-[#ffde59]/70 bg-[#452a15]/85 flex flex-col items-center justify-center p-3 sm:p-5 text-center shadow-[0_0_30px_rgba(242,193,78,0.3)]">
          {/* TIÊU ĐỀ: UTM ClassizismAntiqua */}
          <h3
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif" }}
            className="text-white font-normal uppercase tracking-wide transition-all duration-300 group-hover:-translate-y-0.5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-snug max-w-[95%] mx-auto text-sm sm:text-base md:text-lg text-center line-clamp-2"
          >
            {itemTitle}
          </h3>

          {/* DÒNG KẺ NGANG VÀNG PHÁT SÁNG */}
          <div className="w-12 sm:w-16 h-[2px] bg-[#ffde59] my-2 sm:my-2.5 shadow-[0_0_8px_#ffde59]" />

          {/* TIÊU ĐỀ PHỤ / SUBTITLE: UTM Avo */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[#e3d2c1] text-xs sm:text-sm font-normal leading-relaxed tracking-wide px-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] text-center line-clamp-3 sm:line-clamp-4"
          >
            {itemSubtitle ||
              ('description' in item && item.description) ||
              'Không gian văn hóa di sản tâm linh Tùng Lâm Hòa Phúc'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── INTERACTIVE ZOOMABLE & PANNING MODAL SUB-COMPONENT ── */
interface SpaceGalleryModalProps {
  items: Array<TamBaoSpaceImage | SpaceGalleryItem>;
  currentIndex: number | null;
  areaTitle: string;
  onClose: () => void;
  onSelectIndex: (idx: number) => void;
}

const SpaceGalleryModal: FC<SpaceGalleryModalProps> = ({
  items,
  currentIndex,
  areaTitle,
  onClose,
  onSelectIndex,
}) => {
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom & pan when image changes
  useEffect(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, [currentIndex]);

  // Khóa cuộn trang phía sau khi mở popup
  useEffect(() => {
    if (currentIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (currentIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onSelectIndex((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onSelectIndex((currentIndex + 1) % items.length);
      if (e.key === '+' || e.key === '=') setZoomScale((prev) => Math.min(prev + 0.35, 4));
      if (e.key === '-') setZoomScale((prev) => Math.max(prev - 0.35, 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose, onSelectIndex]);

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

  // Ngăn chặn cuộn trang phía sau khi lăn chuột zoom ảnh
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const currentSubtitle =
    'subtitle' in currentItem && currentItem.subtitle ? currentItem.subtitle : currentItem.caption || '';
  const currentDesc =
    'description' in currentItem && currentItem.description
      ? currentItem.description
      : 'Không gian văn hóa và hiện vật thiêng liêng lưu giữ tại bổn tự.';

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      {/* ── MODAL CONTAINER ── */}
      <div
        className="relative max-w-4xl w-full rounded-2xl border border-[#F2C14E]/60 bg-[#25170E] p-4 sm:p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col items-center max-h-[95vh] overflow-y-auto select-none"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        {/* 1. HEADER BAR */}
        <div className="relative w-full flex items-center justify-center border-b border-[#F2C14E]/30 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl text-[#F2C14E]">☸</span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase text-[#ffde59] tracking-wider text-center drop-shadow-[0_0_15px_rgba(255,222,89,0.7)]"
              style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
            >
              KHÔNG GIAN {areaTitle}
            </h2>
          </div>

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
          className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] rounded-xl overflow-hidden border border-[#F2C14E]/40 bg-[#1C120B] p-2 flex items-center justify-center shadow-inner group"
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
              Nhấp giữ &amp; Kéo để xem chi tiết ảnh
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

        {/* 4. MAIN TITLE */}
        <h3
          className="text-white text-lg sm:text-xl md:text-2xl font-normal uppercase text-center mt-1 mb-1 tracking-wide leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif" }}
        >
          {currentItem.title}
        </h3>

        {/* ĐƯỜNG KẺ NGANG GRADIENT TRANSPARENT GIỮA TIÊU ĐỀ VÀ SUB */}
        <div className="w-28 sm:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent mx-auto my-2 shadow-[0_0_8px_#F2C14E]" />

        {/* SUBTITLE */}
        {currentSubtitle && (
          <p
            className="text-[#ffde59] text-xs sm:text-sm font-normal tracking-wide text-center mb-3 opacity-90"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {currentSubtitle}
          </p>
        )}

        {/* 5. TWO COLUMN DETAILS (PHÂN LOẠI & Ý NGHĨA) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-[#F2C14E]/30 pt-4 mt-1 bg-[#1C120B]/60 p-4 rounded-xl border border-[#F2C14E]/20">
          <div className="flex flex-col items-center text-center">
            <span
              className="text-[#ffde59] text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-wider drop-shadow-[0_0_8px_rgba(242,193,78,0.5)] mb-1"
              style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
            >
              PHÂN LOẠI
            </span>
            <span
              className="text-white text-sm sm:text-base font-semibold leading-relaxed"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {currentItem.category || areaTitle}
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
              "{currentDesc}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
