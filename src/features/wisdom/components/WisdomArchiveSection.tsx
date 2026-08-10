'use client';

import React, { FC, useState, useMemo } from "react";
import Link from "next/link";
import { Filter, Calendar, Eye, Volume2, Video as VideoIcon, BookOpen, FileText, Sparkles, ChevronDown } from "lucide-react";
import { WISDOM_ITEMS, MEDIA_TYPE_OPTIONS } from "@/data/wisdom-archive-data";
import { WisdomItem, MediaType } from "@/types/wisdom-tags";
import { MediaPlayModal } from "@/components/public/modals/MediaPlayModal";

interface WisdomCardProps {
  item: WisdomItem;
  onClick: (item: WisdomItem, e: React.MouseEvent) => void;
}

const WisdomCard = React.memo(({ item, onClick }: WisdomCardProps) => {
  return (
    <div
      onClick={(e) => onClick(item, e)}
      className="group relative w-full overflow-hidden rounded-2xl border border-[#F2C14E]/30 bg-[#2C1C11] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F2C14E] shadow-xl hover:shadow-2xl flex flex-col h-full justify-between transform-gpu"
    >
      {/* 1. Thumbnail Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#1A120B] shrink-0">
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1C11] via-transparent to-black/40" />

        {/* Media type icon overlay */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#F2C14E] bg-[#1C130D]/90 border border-[#F2C14E]/40 backdrop-blur-md"
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          {item.type === 'audio' && <Volume2 className="w-3.5 h-3.5 inline mr-1 text-[#F2C14E]" />}
          {item.type === 'video' && <VideoIcon className="w-3.5 h-3.5 inline mr-1 text-[#F2C14E]" />}
          {item.type === 'article' && <FileText className="w-3.5 h-3.5 inline mr-1 text-[#F2C14E]" />}
          {item.type === 'book' && <BookOpen className="w-3.5 h-3.5 inline mr-1 text-[#F2C14E]" />}
          <span>{item.type}</span>
        </div>
      </div>

      {/* 2. Text content */}
      <div className="p-4 flex flex-col gap-2 bg-gradient-to-b from-[#2C1C11] to-[#1C130D] flex-1 justify-between text-left">
        <div className="space-y-1.5">
          <div
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[11px] font-bold text-[#F2C14E] tracking-wide flex items-center gap-1"
          >
            <span>🪔</span>
            <span>{item.primaryCategoryTag}</span>
          </div>

          <h3
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="font-bold text-base text-[#F2C14E] group-hover:text-white line-clamp-2 leading-snug transition-colors"
          >
            {item.title}
          </h3>
        </div>

        <div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent my-2" />
          <div
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="flex items-center justify-between text-[11px] text-[#FFE5A3]/80 font-bold"
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>{item.publishDate}</span>
            </div>

            <div className="flex items-center gap-1">
              <span>{item.views}</span>
              <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

WisdomCard.displayName = "WisdomCard";

export const WisdomArchiveSection: FC = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeMediaModalItem, setActiveMediaModalItem] = useState<WisdomItem | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter & Sort with useMemo
  const filteredItems = useMemo(() => {
    let result = WISDOM_ITEMS.filter((item) => {
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }
      return true;
    });

    if (sortBy === "views") {
      result = [...result].sort((a, b) => b.views - a.views);
    }
    return result;
  }, [selectedType, sortBy]);

  // 4 Columns x 4 Rows = 16 cards per page
  const visibleItems = useMemo(() => {
    return isExpanded ? filteredItems : filteredItems.slice(0, 16);
  }, [filteredItems, isExpanded]);

  const handleCardClick = (item: WisdomItem, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a')) return;

    if (item.type === 'audio' || item.type === 'video') {
      setActiveMediaModalItem(item);
    } else {
      window.location.href = `/tri-tue-phat-phap/${item.slug}`;
    }
  };

  return (
    <div className="w-full">
      {/* ── 1. Elegant Streamlined Filter Toolbar ── */}
      <div className="bg-[#1C130D] p-4 md:p-6 rounded-2xl border border-[#F2C14E]/30 shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-bold uppercase tracking-widest text-[#F2C14E] mr-2"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            CHỦ ĐỀ:
          </span>
          {MEDIA_TYPE_OPTIONS.map((opt) => {
            const isSelected = selectedType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedType(opt.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#F2C14E] text-[#1C130D] border-white shadow-md'
                    : 'bg-[#2A1D14] text-[#c9b896] border-[#F2C14E]/30 hover:border-[#F2C14E] hover:text-[#F2C14E]'
                }`}
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold uppercase text-[#F2C14E]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            SẮP XẾP:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-1.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#2A1D14] border border-[#F2C14E]/40 text-[#FFE5A3] focus:outline-none cursor-pointer"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <option value="newest" className="bg-[#2A1D14]">MỚI NHẤT ↕</option>
            <option value="views" className="bg-[#2A1D14]">XEM NHIỀU NHẤT ↕</option>
          </select>
        </div>
      </div>

      {/* ── 2. 4 COLUMNS x 4 ROWS GRID (16 CARDS) WITH PORTFOLIO EXPANSION ── */}
      <div className="relative mb-12">
        <div
          className={`relative transition-all duration-500 overflow-hidden ${
            !isExpanded && filteredItems.length > 16 ? 'max-h-[1600px] md:max-h-[1700px]' : 'max-h-[10000px] pb-8'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {visibleItems.map((item) => (
              <WisdomCard
                key={item.id}
                item={item}
                onClick={handleCardClick}
              />
            ))}
          </div>

          {!isExpanded && filteredItems.length > 16 && (
            <div className="absolute bottom-0 inset-x-0 h-48 md:h-64 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/90 to-transparent pointer-events-none z-10" />
          )}
        </div>

        {/* Portfolio "TÌM HIỂU THÊM" Expansion Button */}
        {!isExpanded && filteredItems.length > 16 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center px-4">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4A017] via-[#F2C14E] to-[#D4A017] text-[#1C130D] font-bold text-xs md:text-sm rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(242,193,78,0.5)] flex items-center gap-2 cursor-pointer uppercase tracking-wider hover:scale-105"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <span>TÌM HIỂU THÊM</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Pop-up Lightbox */}
      <MediaPlayModal
        item={activeMediaModalItem}
        onClose={() => setActiveMediaModalItem(null)}
      />
    </div>
  );
};
