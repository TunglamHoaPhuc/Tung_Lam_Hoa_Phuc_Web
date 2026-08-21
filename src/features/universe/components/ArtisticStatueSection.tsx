'use client';

import React, { FC, useState, useMemo } from 'react';
import { OFFICIAL_NTPG_LIST, normalizeAreaId } from '@/data/statue-data';
import { ArtisticStatueModal, NTPGModalItem } from './ArtisticStatueModal';
import { ThapBatLaHanGrid } from './ThapBatLaHanGrid';

export interface ArtisticStatueItem {
  id: string;
  title: string;
  subtitle?: string;
  caption?: string;
  imgUrl: string;
  category?: string;
  categoryType?: string;
  areaId?: string;
  areaSlug?: string;
  areaName?: string;
  type?: string;
  meaning?: string;
  location?: string;
  group?: string;
  quote?: string;
}

interface ArtisticStatueSectionProps {
  areaTitle?: string;
  areaSlug?: string;
  items?: ArtisticStatueItem[];
}

export const ArtisticStatueSection: FC<ArtisticStatueSectionProps> = ({
  areaTitle = 'TÙNG LÂM HÒA PHÚC',
  areaSlug,
  items = OFFICIAL_NTPG_LIST,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentKey = normalizeAreaId(areaSlug || areaTitle);

  // Deduplicate items & exclude dedicated section items
  const displayItems = useMemo(() => {
    const seen = new Set<string>();
    return items.filter((item) => {
      const cat = item.categoryType || item.type;
      if (cat && cat !== 'NTPG') return false;

      const img = item.imgUrl || '';
      // Exclude items in dedicated grids or unwanted images
      if (
        img.includes('bat_bo_kim_cang') ||
        img.includes('THAP_BAT_LA_HAN') ||
        img.includes('thap_nhi_duoc_xoa') ||
        img.includes('mat_tich_ho_phap') ||
        img.includes('na_la_dien_ho_phap')
      ) {
        return false;
      }

      if (!currentKey || currentKey === 'ALL') return true;

      const itemKey = normalizeAreaId(item.areaId || item.areaSlug);
      if (itemKey !== currentKey) return false;

      // Deduplicate by imgUrl
      if (seen.has(img)) return false;
      seen.add(img);
      return true;
    });
  }, [items, areaSlug, areaTitle, currentKey]);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const areaDisplayName = areaTitle && areaTitle !== 'TÙNG LÂM HÒA PHÚC' && areaTitle !== 'ALL'
    ? (areaTitle.includes('BẢO TÀNG') ? 'BẢO TÀNG' : areaTitle.toUpperCase())
    : 'TÙNG LÂM HÒA PHÚC';

  // 2 rows limit: 5 items fill a perfect 4-col x 2-row flush bento block
  const initialLimit = 5;
  const hasMore = displayItems.length > initialLimit && !isExpanded;
  const remainingCount = displayItems.length - initialLimit;

  const isTamBao = currentKey === 'TAM_BAO';

  // Flawless Adaptive Bento Grid span calculation without gaps
  const getBentoSpanClass = (idx: number, total: number) => {
    const pattern = idx % 5;
    const isLastBlock = idx >= Math.floor(total / 5) * 5;
    const remainder = total % 5;

    // Handle leftover items in last block to keep bottom edge 100% flush
    if (isLastBlock && remainder !== 0) {
      if (remainder === 1) {
        return 'col-span-1 sm:col-span-2 lg:col-span-4 row-span-1';
      }
      if (remainder === 2) {
        return 'col-span-1 sm:col-span-2 row-span-1';
      }
      if (remainder === 3) {
        if (pattern === 0) return 'col-span-1 sm:col-span-2 row-span-1';
        return 'col-span-1 row-span-1';
      }
      if (remainder === 4) {
        return 'col-span-1 row-span-1';
      }
    }

    // Default 5-card bento composition (1 hero 2x2 card + 4 standard 1x1 cards)
    if (pattern === 0) {
      return 'col-span-1 sm:col-span-2 row-span-2';
    }
    return 'col-span-1 row-span-1';
  };

  return (
    <>
      <section id="nghe-thuat-phat-giao" className="relative w-full scroll-mt-24 py-12 md:py-16 overflow-hidden bg-transparent">
        {/* ── AMBIENT BACKGROUND IMAGE POSITIONED DOWNWARDS WITH SOFT OPACITY & 4-EDGE GRADIENT MASKS ── */}
        <div className="absolute top-10 sm:top-14 inset-x-0 h-[420px] sm:h-[480px] z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/vu-tru-phat-giao/toan-canh-chua.jpg"
            alt="Toàn cảnh chùa"
            className="w-full h-full object-cover opacity-12 sm:opacity-15 filter blur-[2px] scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
            }}
          />
          <div className="absolute inset-0 bg-[#2C1C11]/35" />

          {/* Top & Bottom Fades */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/90 to-transparent" />

          {/* Left & Right Edge Gradients */}
          <div className="absolute left-0 inset-y-0 w-36 sm:w-56 bg-gradient-to-r from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
          <div className="absolute right-0 inset-y-0 w-36 sm:w-56 bg-gradient-to-l from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
        </div>

        <div className="relative z-10">
          {/* ── SECTION HEADER ── */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 flex items-center justify-center" aria-hidden="true">
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
              <div className="flex-1 flex items-center">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
                <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
              </div>

              <h2
                style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
                className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-5 sm:px-8"
              >
                NGHỆ THUẬT PHẬT GIÁO
              </h2>

              <div className="flex-1 flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
                <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
              </div>
            </div>

            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-xs sm:text-sm text-[#e3d2c1] tracking-wide font-normal max-w-xl mx-auto mt-2"
            >
              Tác phẩm Nghệ Thuật Phật Giáo phỏng cổ &amp; độc bản tôn thờ tại {areaDisplayName}
            </p>
          </div>

          {/* ── ADAPTIVE BENTO GRID WITH EXACT 2-ROW INITIAL VIEW & PEEKING WAITING POSTS BEHIND SMOOTH GRADIENT MASK ── */}
          {displayItems.length > 0 && (
            <div className="relative w-full max-w-6xl mx-auto px-4">
              <div
                className={`transition-all duration-500 ${!isExpanded ? 'max-h-[700px] sm:max-h-[780px] overflow-hidden' : 'max-h-[5000px] overflow-visible'}`}
                style={!isExpanded && hasMore ? {
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.35) 82%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.35) 82%, rgba(0,0,0,0) 100%)',
                } : undefined}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-[340px] sm:auto-rows-[370px]">
                  {displayItems.map((item, idx) => {
                    const spanClass = getBentoSpanClass(idx, displayItems.length);
                    const focusPos = (item.imgUrl || '').includes('quan_am_tieu_dien') ? 'object-[center_30%]' : 'object-[center_20%]';
                    return (
                      <div key={item.id || idx} className={`${spanClass} w-full h-full`}>
                        <BentoCard
                          item={item}
                          idx={idx}
                          openLightbox={openLightbox}
                          focusPosition={focusPos}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EXPAND BUTTON OVERLAY WITH SMOOTH SEAMLESS GRADIENT FADE */}
              {hasMore && (
                <div className="absolute inset-x-0 bottom-0 h-64 sm:h-72 md:h-80 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/95 via-35% via-[#2C1C11]/60 via-70% to-transparent pointer-events-none flex items-end justify-center pb-3 sm:pb-4 z-20">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="pointer-events-auto px-8 py-3.5 bg-gradient-to-r from-[#54361e] via-[#6B4B2A] to-[#54361e] hover:from-[#6B4B2A] hover:via-[#8B6439] hover:to-[#6B4B2A] border-2 border-[#f2c14e] hover:border-[#ffde59] text-[#ffde59] hover:text-white font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 shadow-[0_8px_28px_rgba(0,0,0,0.85)] hover:shadow-[0_0_30px_rgba(242,193,78,0.6)] flex items-center gap-3 cursor-pointer uppercase tracking-wider transform hover:-translate-y-0.5"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <span>XEM THÊM BẢO TƯỢNG NGHỆ THUẬT TẠI {areaDisplayName} (+{remainingCount} PHO TƯỢNG)</span>
                    <span className="text-lg">➔</span>
                  </button>
                </div>
              )}

              {/* COLLAPSE BUTTON WHEN EXPANDED */}
              {isExpanded && displayItems.length > initialLimit && (
                <div className="w-full flex justify-center mt-8 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      const el = document.getElementById('nghe-thuat-phat-giao');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 bg-[#1C120B] border border-[#F2C14E]/60 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1C120B] font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <span>THU GỌN BẢO TƯỢNG NGHỆ THUẬT</span>
                    <span className="text-xs">▲</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LIGHTBOX POP-UP MODAL */}
          <ArtisticStatueModal
            items={displayItems as NTPGModalItem[]}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onSelectIndex={(idx) => setLightboxIndex(idx)}
          />
        </div>
      </section>

      {/* ── DEDICATED SUB-SECTIONS FOR TAM BẢO ── */}
      {isTamBao && (
        <div className="w-full space-y-8">
          <ThapBatLaHanGrid />
        </div>
      )}
    </>
  );
};

/* ── BENTO CARD REUSABLE SUB-COMPONENT ── */
interface BentoCardProps {
  item: ArtisticStatueItem;
  idx: number;
  openLightbox: (idx: number) => void;
  focusPosition?: string;
}

const BentoCard: FC<BentoCardProps> = ({
  item,
  idx,
  openLightbox,
  focusPosition = 'object-[center_20%]',
}) => {
  return (
    <div
      onClick={() => openLightbox(idx)}
      className="group relative overflow-hidden cursor-pointer rounded-2xl border border-[#f2c14e]/35 hover:border-[#ffde59] transition-all duration-500 shadow-xl bg-[#1c120b] w-full h-full"
    >
      <img
        src={item.imgUrl}
        alt={item.title}
        className={`w-full h-full object-cover ${focusPosition} transition-transform duration-700 group-hover:scale-105`}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
        }}
      />

      {/* Soft gradient fade at bottom of card so statue base blends gracefully into dark tone */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1C120B]/95 via-[#1C120B]/50 to-transparent pointer-events-none" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#25170E]/90 via-[#3D2817]/65 to-transparent backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-3 sm:p-5 text-center pointer-events-none z-20">
        <div className="absolute inset-3 sm:inset-4 md:inset-5 rounded-xl md:rounded-2xl border border-[#ffde59]/70 bg-[#452a15]/85 flex flex-col items-center justify-center p-3 sm:p-5 text-center shadow-[0_0_30px_rgba(242,193,78,0.3)]">
          <h3
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif" }}
            className="text-white font-normal uppercase tracking-wide transition-all duration-300 group-hover:-translate-y-0.5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-snug max-w-[95%] mx-auto text-sm sm:text-base md:text-lg text-center line-clamp-2"
          >
            {item.title}
          </h3>

          <div className="w-12 sm:w-16 h-[2px] bg-[#ffde59] my-2 sm:my-2.5 shadow-[0_0_8px_#ffde59]" />

          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[#e3d2c1] text-xs sm:text-sm font-normal leading-relaxed tracking-wide px-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] text-center line-clamp-3 sm:line-clamp-4"
          >
            {item.subtitle || item.caption || item.quote || item.category || 'Nghệ Thuật Phật Giáo Tùng Lâm Hòa Phúc'}
          </p>
        </div>
      </div>
    </div>
  );
};