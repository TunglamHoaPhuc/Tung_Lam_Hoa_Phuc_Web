'use client';

import React, { FC, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { OFFICIAL_TUONG_CHINH_LIST, StatueItem, normalizeAreaId } from "@/data/statue-data";

interface StatueCollectionGridProps {
  statues?: StatueItem[];
  areaTitle?: string;
  areaSlug?: string;
}

function toSentenceCase(str?: string): string {
  if (!str) return '';
  if (/[a-z]/.test(str)) return str;
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// ── Original Classic StatueCard for High Performance & Elegant Appearance ──
interface StatueCardProps {
  statue: StatueItem;
}

const StatueCard = React.memo(({ statue }: StatueCardProps) => {
  return (
    <Link
      href={`/bao-tuong/${statue.slug}`}
      className="group relative w-full max-w-[300px] mx-auto overflow-hidden rounded-2xl border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl h-[415px] cursor-pointer flex flex-col justify-between block transform-gpu will-change-transform"
    >
      {/* 1. KHUNG ẢNH THUMBNAIL (H-[330PX] LAZY & ASYNC DECODING) */}
      <div className="relative w-full h-[330px] overflow-hidden bg-[#1A120B] shrink-0">
        <img
          src={statue.imgUrl}
          alt={statue.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 transform-gpu"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(37,23,14,0.95) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* 2. CỤM CHÚ THÍCH KÈM BADGE NỔI HOVER */}
      <div className="absolute inset-x-0 bottom-0 z-20 transition-transform duration-500 ease-out translate-y-[28px] group-hover:translate-y-0 transform-gpu">
        {/* ĐƯỜNG KẺ GRADIENT VÀNG 1PX */}
        <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent z-30 opacity-90 shadow-[0_0_8px_rgba(242,193,78,0.5)]" />

        {/* KHUNG CHÚ THÍCH NỀN BG #25170E */}
        <div className="relative w-full bg-gradient-to-b from-[#25170E] to-[#1C130D] px-3 pt-5 pb-3.5 text-center flex flex-col items-center justify-start">
          {/* LOGO BADGE CĂN GIỮA */}
          <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 z-40 w-11 h-11 rounded-full border-2 border-[#F2C14E] bg-[#25170E] flex items-center justify-center p-1 shadow-[0_0_16px_rgba(242,193,78,0.6)]">
            <img
              src="/images/bieu-tuong-tuong-phap.svg"
              alt="Logo Bảo tượng"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.8)]"
            />
          </div>

          {/* TIÊU ĐỀ & SUBTITLE */}
          <div className="w-full flex flex-col items-center mt-1.5 shrink-0">
            <h3
              className="text-[#F2C14E] text-2xl md:text-3xl font-normal tracking-wide uppercase group-hover:text-white transition-colors mb-0.5"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              {statue.name}
            </h3>

            {statue.subtitle && (
              <p
                className="text-[#FFE5A3]/90 text-xs font-bold line-clamp-1"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {toSentenceCase(statue.subtitle)}
              </p>
            )}
          </div>

          {/* NÚT KHÁM PHÁ ON HOVER */}
          <div className="w-full mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center shrink-0">
            <span
              className="inline-flex items-center justify-center gap-1.5 px-5 py-1 rounded-full bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-xs uppercase shadow-md hover:brightness-110 transition-all cursor-pointer"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <span>XEM CHI TIẾT</span>
              <span>➔</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

StatueCard.displayName = "StatueCard";

export const StatueCollectionGrid: FC<StatueCollectionGridProps> = ({
  statues = OFFICIAL_TUONG_CHINH_LIST,
  areaTitle = "TAM BẢO",
  areaSlug,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentKey = normalizeAreaId(areaSlug || areaTitle);

  const filteredStatues = useMemo(() => {
    return statues.filter((item) => {
      // 1. Must be TƯỢNG CHÍNH
      const category = item.categoryType || item.type;
      if (category && category !== 'TƯỢNG CHÍNH') return false;

      // 2. If no area specified or 'ALL', return all TƯỢNG CHÍNH
      if (!currentKey || currentKey === 'ALL') return true;

      const itemKey = normalizeAreaId(item.areaId || item.areaSlug);
      return itemKey === currentKey;
    });
  }, [statues, areaSlug, areaTitle, currentKey]);

  return (
    <div className="w-full py-16 my-8 relative overflow-hidden bg-[#2C1C11]">
      {/* ── 1. BACKGROUND HÒA TRỘN TỰ NHIÊN ── */}
      <div className="absolute top-0 inset-x-0 h-[850px] pointer-events-none select-none z-0 overflow-hidden bg-[#2C1C11]">
        <img
          src="/images/toan-canh-chua.jpg"
          alt="Background Tam Bảo"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-48 mix-blend-overlay filter brightness-95"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 72% 78% at 50% 50%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 90%)',
            maskImage: 'radial-gradient(ellipse 72% 78% at 50% 50%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 90%)',
          }}
        />

        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/90 to-transparent" />
        <div className="absolute inset-0 bg-[#2C1C11]/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* ── 2. SECTION HEADER: ICON & 2 ĐƯỜNG KẺ HAI BÊN ── */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-10 h-10 mb-3 flex items-center justify-center" aria-hidden="true">
            <img
              src="/images/bieu-tuong-tuong-phap.svg"
              alt="Biểu Tượng Tượng Pháp"
              className="w-full h-full object-contain filter drop-shadow-[0_0_14px_rgba(242,193,78,0.9)]"
            />
          </div>

          <div className="flex items-center justify-center w-full gap-0">
            <div className="flex-1 flex items-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
            </div>

            <h2
              style={{ fontFamily: "'UTM Niagara', 'Playfair Display', serif" }}
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-4 sm:px-6 md:px-8"
            >
              BẢO TƯỢNG PHẬT GIÁO - {areaTitle}
            </h2>

            <div className="flex-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
              <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
            </div>
          </div>

          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm text-[#e3d2c1] tracking-wide font-normal max-w-xl mx-auto mt-3"
          >
            Hệ thống tượng pháp dát vàng, sơn son thếp vàng tôn thờ tại {areaTitle}.
          </p>
        </div>

        {/* ── 3. GRID SYSTEM (RESPONSIVE CLASSIC 1-2-3-4 COLS) ── */}
        <div className="relative">
          <div
            className={`transition-all duration-700 ease-in-out ${
              !isExpanded ? 'max-h-[880px] md:max-h-[920px] overflow-hidden' : 'max-h-[10000px] overflow-visible pb-12'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredStatues.map((statue) => (
                <StatueCard key={statue.id} statue={statue} />
              ))}
            </div>
          </div>

          {/* DẢI MỜ PHÍA DƯỚI KHI CHƯA MỞ RỘNG */}
          {!isExpanded && filteredStatues.length > 8 && (
            <div className="absolute bottom-0 inset-x-0 h-48 md:h-64 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/90 to-transparent pointer-events-none z-30" />
          )}

          {/* NÚT XEM TẤT CẢ NỔI VỚI SHADOW ĐẬM */}
          {!isExpanded && filteredStatues.length > 8 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-4">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="px-8 py-3.5 bg-[#6B4B2A] hover:bg-[#8B6439] border border-[#F2C14E] text-[#F2C14E] hover:text-[#FFE5A3] font-bold text-sm md:text-base rounded-xl transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.85)] flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <span>XEM TẤT CẢ BẢO TƯỢNG ({filteredStatues.length})</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* NÚT THU GỌN KHI ĐÃ MỞ RỘNG */}
          {isExpanded && (
            <div className="w-full flex justify-center mt-8 z-40">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-6 py-2.5 bg-[#3D2919] hover:bg-[#543823] border border-[#F2C14E]/60 text-[#F2C14E] font-bold text-xs rounded-xl transition-all duration-300 shadow-md flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <span>THU GỌN DANH SÁCH</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
