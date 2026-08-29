'use client';

import React, { FC, useState, useMemo } from "react";
import Link from "next/link";
import { Map as MapIcon, LayoutGrid } from "lucide-react";
import { UNIVERSE_AREAS, UniverseArea } from "@/data/universe-data";
import { CategoryFilter, SortOption } from "@/components/common/CategoryFilter";

interface UniverseGridModeProps {
  viewMode: "grid" | "2d" | "map";
  onToggleViewMode: (mode: "grid" | "2d") => void;
}

function toSentenceCase(str?: string): string {
  if (!str) return '';
  if (/[a-z]/.test(str)) return str;
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const UNIVERSE_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "tung-lam-hoa-phuc", label: "Tùng Lâm Hòa Phúc" },
  { id: "quynh-nhai-cam-lo-tu", label: "Quỳnh Nhai Cam Lộ Tự" },
];

const SORT_OPTIONS: SortOption[] = [
  { id: "newest", label: "Mới nhất" },
  { id: "oldest", label: "Cũ nhất" },
  { id: "a-z", label: "Từ A đến Z" },
  { id: "z-a", label: "Từ Z đến A" },
];

export function formatTitleWithSmartPairs(title: string): React.ReactNode {
  if (!title) return '';

  const knownMappings: Record<string, React.ReactNode> = {
    "BẢO TÀNG PHẬT GIÁO VÀ TƯỢNG ĐÀI NGUYỆT TRÍ QUAN ÂM": "BẢO TÀNG",
    "BẢO THÁP VẠN PHẬT XÁ LỢI HÒA BÌNH": "BẢO THÁP VẠN PHẬT XÁ LỢI",
    "KHÔNG GIAN TÂM LINH VĂN HÓA LÀNG XÃ BẮC BỘ": "KHÔNG GIAN TÂM LINH",
    "TAM BẢO NHÌN TỪ TRÊN CAO": "TAM BẢO (TRÊN CAO)",
    "MẶT CHÍNH DIỆN KHI NHÌN TAM BẢO TỪ TRÊN CAO": "TAM BẢO (CHÍNH DIỆN)",
  };

  const upper = title.trim().toUpperCase();
  if (knownMappings[upper]) {
    return knownMappings[upper];
  }

  return title;
}

// ── Memoized Card Subcomponent with Hardware-Accelerated Smooth Hover & Golden Subtitle ──
interface UniverseAreaCardProps {
  area: UniverseArea;
}

const UniverseAreaCard = React.memo(({ area }: UniverseAreaCardProps) => {
  const displayTitle = formatTitleWithSmartPairs(area.name);

  return (
    <Link
      href={`/vu-tru-phat-giao/${area.slug}`}
      className="group relative rounded-xl overflow-hidden border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl flex flex-col h-full hover:-translate-y-1 transform-gpu will-change-transform"
    >
      {/* 1. THUMBNAIL IMAGE FRAME (aspect-[1.618/1] Golden Ratio) */}
      <div className="relative w-full aspect-[1.618/1] overflow-hidden bg-[#1A120B] shrink-0">
        <img
          src={area.imgUrl}
          alt={area.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(37,23,14,0.95) 0%, transparent 60%)",
          }}
        />

        {/* Pin Number Badge */}
        <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full border border-[#F2C14E] bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] font-bold text-xs shadow-md">
          {area.pinNumber}
        </div>
      </div>

      {/* Transparent Golden Divider Line between Image and Caption */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/40 to-transparent shrink-0" />

      {/* 2. CAPTION CONTAINER */}
      <div className="px-4 py-3.5 flex flex-col justify-center items-center flex-1 text-center bg-gradient-to-b from-[#25170E] to-[#1C130D] relative overflow-hidden min-h-[76px]">
        <h3
          className="text-[#F2C14E] text-2xl md:text-3xl font-normal tracking-wide uppercase group-hover:text-white transition-colors duration-300 leading-snug line-clamp-1"
          style={{ fontFamily: "'UTM Niagara', serif" }}
        >
          {displayTitle}
        </h3>

        {/* Subtitle ONLY visible on Hover - GOLDEN COLOR text-[#F2C14E] with Smooth Opacity & Height */}
        {area.subtitle && (
          <div className="max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100 transition-all duration-300 ease-out overflow-hidden mt-0 group-hover:mt-1">
            <p
              className="text-[#F2C14E] text-xs font-bold font-sans tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {toSentenceCase(area.subtitle)}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
});

UniverseAreaCard.displayName = "UniverseAreaCard";

export const UniverseGridMode: FC<UniverseGridModeProps> = ({ viewMode, onToggleViewMode }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentSort, setCurrentSort] = useState("newest");
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter & sort logic with useMemo
  const filteredAreas = useMemo(() => {
    let result = UNIVERSE_AREAS.filter((area) => {
      if (activeCategory === "all") return true;
      return area.temple === activeCategory;
    });

    result = [...result].sort((a, b) => {
      if (currentSort === "newest") return a.pinNumber - b.pinNumber;
      if (currentSort === "oldest") return b.pinNumber - a.pinNumber;
      if (currentSort === "a-z") return a.name.localeCompare(b.name, "vi");
      if (currentSort === "z-a") return b.name.localeCompare(a.name, "vi");
      return 0;
    });

    return result;
  }, [activeCategory, currentSort]);

  const visibleAreas = useMemo(() => {
    return isExpanded ? filteredAreas : filteredAreas.slice(0, 12);
  }, [filteredAreas, isExpanded]);

  const is2dActive = viewMode === "2d" || viewMode === "map";

  return (
    <div className="w-full">
      {/* ── 1. CỤM NÚT CHUYỂN ĐỔI GIAO DIỆN (TOP-RIGHT CORNER) ── */}
      <div className="flex items-center justify-end mb-6">
        <div
          className="flex items-center gap-1.5 p-1 rounded-full border flex-shrink-0"
          style={{
            background: "#1C130D",
            borderColor: "rgba(242,193,78,0.4)",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          }}
        >
          <button
            type="button"
            onClick={() => onToggleViewMode("2d")}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${is2dActive
                ? "bg-[#F2C14E] text-[#2A1D14] shadow-md"
                : "bg-transparent text-[#FFE5A3]/60 hover:text-[#FFE5A3]"
              }`}
            style={{
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>SƠ ĐỒ 2D</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleViewMode("grid")}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${viewMode === "grid"
                ? "bg-[#F2C14E] text-[#2A1D14] shadow-md"
                : "bg-transparent text-[#FFE5A3]/60 hover:text-[#FFE5A3]"
              }`}
            style={{
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>DẠNG LƯỚI GRID</span>
          </button>
        </div>
      </div>

      {/* ── 2. THANH LỰA CHỌN DANH MỤC ── */}
      <div className="mb-10">
        <div className="mb-4">
          <h2
            style={{ fontFamily: "'UTM Classic Antiqua', 'UTM ClassizismAntiqua', serif" }}
            className="text-2xl md:text-3xl font-normal text-white uppercase tracking-wider mb-4"
          >
            LỰA CHỌN DANH MỤC
          </h2>
        </div>

        <CategoryFilter
          categories={UNIVERSE_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setIsExpanded(false);
          }}
          sortOptions={SORT_OPTIONS}
          currentSort={currentSort}
          onSelectSort={setCurrentSort}
          sortLabel="Phân loại"
        />
      </div>

      {/* ── 3. MEMOIZED GRID KHU VỰC ── */}
      {viewMode === "grid" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {visibleAreas.map((area) => (
              <UniverseAreaCard key={area.id} area={area} />
            ))}
          </div>

          {filteredAreas.length > 12 && (
            <div className="w-full flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-8 py-3 rounded-full bg-[#2C1C11] border border-[#F2C14E]/60 text-[#F2C14E] text-xs font-bold hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-lg uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {isExpanded ? "THU GỌN KHU VỰC" : "XEM THÊM KHU VỰC"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
