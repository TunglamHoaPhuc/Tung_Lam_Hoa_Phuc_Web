'use client';

import React, { FC, useState, useMemo } from 'react';
import { OFFICIAL_NTPG_LIST, normalizeAreaId } from '@/data/statue-data';
import { ArtisticStatueModal, NTPGModalItem } from './ArtisticStatueModal';

export interface ArtisticStatueItem {
  id: string;
  title: string;
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

  const currentKey = normalizeAreaId(areaSlug || areaTitle);

  const displayItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Must be NTPG
      const cat = item.categoryType || item.type;
      if (cat && cat !== 'NTPG') return false;

      // 2. If no area specified or 'ALL', return all NTPG items
      if (!currentKey || currentKey === 'ALL') return true;

      const itemKey = normalizeAreaId(item.areaId || item.areaSlug);
      return itemKey === currentKey;
    });
  }, [items, areaSlug, areaTitle, currentKey]);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  if (!displayItems || displayItems.length === 0) {
    return null;
  }

  // Dynamic area text for button & title
  const areaDisplayName = areaTitle && areaTitle !== 'TÙNG LÂM HÒA PHÚC' && areaTitle !== 'ALL'
    ? areaTitle.toUpperCase()
    : 'TÙNG LÂM HÒA PHÚC';

  return (
    <>
      {/* ══════════════════════════════════════════════
          SECTION: NGHỆ THUẬT PHẬT GIÁO — SEAMLESS PAGE BACKGROUND MATCHING
      ══════════════════════════════════════════════ */}
      <section id="nghe-thuat-phat-giao" className="w-full scroll-mt-24 py-12 relative bg-transparent">
        {/* ── SECTION HEADER: Icon + Tiêu đề NGHỆ THUẬT PHẬT GIÁO + 2 đường kẻ hai bên ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div
            className="w-10 h-10 mb-3 flex items-center justify-center"
            aria-hidden="true"
          >
            <img
              src="/images/bieu-tuong-tuong-phap.svg"
              alt=""
              className="w-full h-full object-contain filter drop-shadow-[0_0_14px_rgba(242,193,78,0.9)]"
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
              NGHỆ THUẬT PHẬT GIÁO
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
            Tác phẩm Nghệ Thuật Phật Giáo phỏng cổ & độc bản tôn thờ tại {areaDisplayName}
          </p>
        </div>

        {/* ── BENTO GRID LAYOUT: LEGO INTERLOCKING ADAPTIVE GRID ── */}
        <div className="w-full max-w-6xl mx-auto px-4">
          {displayItems.length === 1 && (
            /* Layout 1 item: Centered Hero Card */
            <div className="max-w-2xl mx-auto">
              <BentoCard item={displayItems[0]} idx={0} openLightbox={openLightbox} heightClass="h-[360px] sm:h-[420px]" />
            </div>
          )}

          {displayItems.length === 2 && (
            /* Layout 2 items: 2 Balanced Side-by-Side Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {displayItems.map((item, idx) => (
                <BentoCard key={item.id} item={item} idx={idx} openLightbox={openLightbox} heightClass="h-[320px] sm:h-[380px]" />
              ))}
            </div>
          )}

          {displayItems.length === 3 && (
            /* Layout 3 items: 1 Featured Large Card (2 cols) + 2 Stacked Side Cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              <div className="md:col-span-2">
                <BentoCard item={displayItems[0]} idx={0} openLightbox={openLightbox} heightClass="h-[320px] md:h-[480px]" isHero />
              </div>
              <div className="flex flex-col gap-5 sm:gap-6">
                <BentoCard item={displayItems[1]} idx={1} openLightbox={openLightbox} heightClass="h-[228px] md:h-[228px]" />
                <BentoCard item={displayItems[2]} idx={2} openLightbox={openLightbox} heightClass="h-[228px] md:h-[228px]" />
              </div>
            </div>
          )}

          {displayItems.length >= 4 && (
            /* Layout 4+ items: Interlocking Bento Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {displayItems.map((item, idx) => {
                let colSpanClass = '';
                let heightClass = 'h-[260px] sm:h-[300px] md:h-[320px]';

                if (idx === 0) {
                  // Featured Main Card
                  colSpanClass = 'lg:col-span-2 lg:row-span-2';
                  heightClass = 'h-[320px] sm:h-[400px] lg:h-[660px]';
                } else if (idx === 1 || idx === 2) {
                  // Stacked Cards Next to Main Card
                  heightClass = 'h-[250px] sm:h-[318px]';
                } else if (idx % 5 === 4) {
                  // Wide Bottom Accent Card
                  colSpanClass = 'lg:col-span-3';
                  heightClass = 'h-[280px] sm:h-[340px]';
                }

                return (
                  <div key={item.id} className={colSpanClass}>
                    <BentoCard
                      item={item}
                      idx={idx}
                      openLightbox={openLightbox}
                      heightClass={heightClass}
                      isHero={idx === 0}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── DYNAMIC BUTTON AT BOTTOM: View All NTPG Statues ── */}
        <div className="w-full flex justify-center mt-10 px-4">
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="px-8 py-3.5 bg-gradient-to-r from-[#54361e] via-[#6B4B2A] to-[#54361e] hover:from-[#6B4B2A] hover:via-[#8B6439] hover:to-[#6B4B2A] border-2 border-[#f2c14e] hover:border-[#ffde59] text-[#ffde59] hover:text-white font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.7)] hover:shadow-[0_0_25px_rgba(242,193,78,0.5)] flex items-center gap-3 cursor-pointer uppercase tracking-wider transform hover:-translate-y-0.5"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <span>XEM {displayItems.length} BẢO TƯỢNG NGHỆ THUẬT PHẬT GIÁO TẠI {areaDisplayName}</span>
            <span className="text-lg">➔</span>
          </button>
        </div>

        {/* LIGHTBOX POP-UP MODAL MATCHING IMAGE 3 UI 100% */}
        <ArtisticStatueModal
          items={displayItems as NTPGModalItem[]}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onSelectIndex={(idx) => setLightboxIndex(idx)}
        />
      </section>
    </>
  );
};

/* ── BENTO CARD REUSABLE SUB-COMPONENT ── */
interface BentoCardProps {
  item: ArtisticStatueItem;
  idx: number;
  openLightbox: (idx: number) => void;
  heightClass: string;
  isHero?: boolean;
}

const BentoCard: FC<BentoCardProps> = ({ item, idx, openLightbox, heightClass, isHero }) => {
  return (
    <div
      onClick={() => openLightbox(idx)}
      className={`
        group relative overflow-hidden cursor-pointer rounded-2xl
        border border-[#f2c14e]/35 hover:border-[#ffde59]
        transition-all duration-500 shadow-xl bg-[#1c120b] w-full
        ${heightClass}
      `}
    >
      {/* 1. Ảnh gốc hiển thị rõ nét hoàn toàn ở trạng thái bình thường */}
      <img
        src={item.imgUrl}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
        }}
      />

      {/* 2. KHUNG CHÚ THÍCH & HIỆU ỨNG GRADIENT BLUR: CHỈ NỔI LÊN KHI HOVER */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#25170E]/90 via-[#3D2817]/60 to-transparent backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4 sm:p-6 text-center pointer-events-none">
        <div className="absolute inset-3 sm:inset-4 md:inset-5 rounded-xl md:rounded-2xl border border-[#ffde59]/70 bg-[#452a15]/80 flex flex-col items-center justify-center p-4 sm:p-6 text-center shadow-[0_0_30px_rgba(242,193,78,0.3)]">
          {/* TIÊU ĐỀ */}
          <h3
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif" }}
            className={`
              text-white font-normal uppercase tracking-wide transition-all duration-300 group-hover:-translate-y-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-snug max-w-[92%] mx-auto
              ${isHero ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl' : 'text-base sm:text-lg md:text-xl'}
            `}
          >
            {item.title}
          </h3>

          {/* DÒNG KẺ NGANG */}
          <div className="w-16 sm:w-20 h-[2px] bg-[#ffde59] my-2 sm:my-3 shadow-[0_0_8px_#ffde59]" />

          {/* SUB TIÊU ĐỀ / CAPTION */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[#e3d2c1] text-xs sm:text-sm font-normal leading-relaxed tracking-wide px-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            {item.caption || item.category || 'Nghệ Thuật Phật Giáo Tùng Lâm Hòa Phúc'}
          </p>
        </div>
      </div>
    </div>
  );
};
