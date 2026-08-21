'use client';

import React, { FC } from 'react';
import { HeritageBentoCluster } from '@/data/heritageGalleryData';
import { Sparkles, MapPin, Calendar, ArrowRight, Eye, Volume2 } from 'lucide-react';

interface WoodShutterCardProps {
  cluster: HeritageBentoCluster;
  onOpenLightbox: (cluster: HeritageBentoCluster, initialIndex?: number) => void;
}

export const WoodShutterCard: FC<WoodShutterCardProps> = ({
  cluster,
  onOpenLightbox,
}) => {
  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden p-5 sm:p-7 md:p-8 transition-all duration-300 group"
      style={{
        background: 'linear-gradient(145deg, #24160E 0%, #1A1009 50%, #150C07 100%)',
        border: '2px solid rgba(138, 90, 56, 0.45)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(242, 193, 78, 0.15)',
      }}
    >
      {/* ── Vintage Wood Shutter & Patina Header Accent ── */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#264e4c] via-[#8a5a38] to-[#264e4c] opacity-80" />

      {/* Background Louver Slats Watermark */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #F2C14E, #F2C14E 2px, transparent 2px, transparent 16px)',
        }}
      />

      {/* ── TOP BADGES & TITLE BAR ── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          {/* Shutter Theme Tag */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#264e4c]/80 text-[#8CE8DE] border border-[#8CE8DE]/40 shadow-sm"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8CE8DE] animate-pulse" />
            CỬA SỔ KÝ ỨC · ĐỜI SỐNG XƯA
          </span>

          {/* Region Badge */}
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#3D2517] text-[#F2C14E] border border-[#F2C14E]/30"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <MapPin className="w-3 h-3 text-[#F2C14E]" />
            {cluster.region === 'BAC' ? 'Miền Bắc' : cluster.region === 'TRUNG' ? 'Miền Trung' : 'Miền Nam'}
          </span>
        </div>

        {/* Era & Document Count Badge */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 text-xs font-bold text-[#FFE5A3] px-3 py-1 rounded-full bg-[#1A110B] border border-[#F2C14E]/40 shadow-[0_0_10px_rgba(242,193,78,0.2)]"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <Calendar className="w-3 h-3 text-[#F2C14E]" />
            {cluster.eraStr}
          </span>
          <span className="text-[11px] font-bold text-[#F2C14E] px-2.5 py-1 rounded-full bg-[#F2C14E]/15 border border-[#F2C14E]/40">
            +{cluster.totalDocuments} tư liệu quý
          </span>
        </div>
      </div>

      {/* ── CLUSTER TITLE & SUBTITLE ── */}
      <div className="relative z-10 mb-6">
        <h3
          className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-[#F2C14E] tracking-wide group-hover:text-[#FFE5A3] transition-colors"
          style={{ fontFamily: "'UTM Niagara', serif" }}
        >
          {cluster.title}
        </h3>
        <p className="text-sm sm:text-base text-[#D4C3B3] font-normal mt-1 leading-relaxed">
          {cluster.subtitle}
        </p>
      </div>

      {/* ── BENTO PHOTO GRID (HERO + SATELLITE SHUTTER WINDOWS) ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── HERO IMAGE (LỚN) ── */}
        <div
          onClick={() => onOpenLightbox(cluster, 0)}
          className="lg:col-span-7 relative group/hero cursor-pointer rounded-2xl overflow-hidden border-2 border-[#8a5a38]/60 hover:border-[#F2C14E] transition-all duration-300 shadow-2xl bg-black/40 min-h-[280px] sm:min-h-[360px] flex flex-col justify-end"
        >
          <img
            src={cluster.heroImg}
            alt={cluster.heroTitle}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/hero:scale-105 filter brightness-90 group-hover/hero:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#150C07] via-[#150C07]/40 to-transparent opacity-90 group-hover/hero:opacity-75 transition-opacity" />

          {/* Golden Corner Stamp */}
          <div className="absolute top-3 left-3 bg-[#1A110B]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#F2C14E]/40 text-[#F2C14E] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3 h-3 text-[#F2C14E]" />
            <span>TƯ LIỆU TIÊU ĐIỂM</span>
          </div>

          <div className="relative z-10 p-5 sm:p-6 space-y-2">
            <h4
              className="text-xl sm:text-2xl font-bold uppercase text-[#FFE5A3] leading-snug drop-shadow-md"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              {cluster.heroTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#E6DACF] line-clamp-2 leading-relaxed opacity-95">
              {cluster.heroCaption}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[#F2C14E] text-xs font-bold uppercase tracking-wider group-hover/hero:translate-x-1 transition-transform">
              <span>Mở phòng tranh 4K</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* ── 3 SATELLITE WINDOW PHOTOS (CỬA CHỚP CON) ── */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {cluster.satelliteImgs.slice(0, 4).map((sub, idx) => (
            <div
              key={idx}
              onClick={() => onOpenLightbox(cluster, idx + 1)}
              className="relative group/sub cursor-pointer rounded-xl overflow-hidden border border-[#8a5a38]/40 hover:border-[#F2C14E] transition-all duration-300 bg-black/40 h-[135px] sm:h-[175px] flex flex-col justify-end"
            >
              <img
                src={sub.imgUrl}
                alt={sub.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/sub:scale-110 filter brightness-85 group-hover/sub:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150C07] via-[#150C07]/30 to-transparent" />

              <div className="relative z-10 p-2.5">
                <p className="text-[11px] sm:text-xs font-bold text-[#FFE5A3] line-clamp-1 group-hover/sub:text-[#F2C14E]">
                  {sub.title}
                </p>
                <span className="text-[9px] text-[#A8988A] flex items-center gap-1 mt-0.5">
                  <Eye className="w-2.5 h-2.5" />
                  Xem ảnh
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HISTORICAL QUOTE FOOTER ── */}
      <div className="relative z-10 mt-6 pt-5 border-t border-[#8a5a38]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1A1009]/60 rounded-2xl p-4">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-[#E2D2C2] italic font-serif leading-relaxed">
            "{cluster.historicalQuote}"
          </p>
          {cluster.quoteAuthor && (
            <p className="text-[10px] sm:text-[11px] text-[#F2C14E] font-bold uppercase tracking-wider">
              — {cluster.quoteAuthor}
            </p>
          )}
        </div>

        <button
          onClick={() => onOpenLightbox(cluster, 0)}
          className="self-end sm:self-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3D2517] hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1A110B] border border-[#F2C14E]/40 transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 shadow-md"
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          <span>Khám Phá Toàn Bộ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
