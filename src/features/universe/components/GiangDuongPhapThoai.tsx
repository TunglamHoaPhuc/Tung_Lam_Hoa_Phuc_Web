'use client';

import React, { FC, useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Calendar, RefreshCw, Volume2, Sparkles, ChevronDown } from "lucide-react";
import { GIANG_DUONG_TOPICS, EMOTION_QUICK_TAGS, PHAP_THOAI_FEATURED, PHAP_THOAI_ALL, PhapThoaiTalk } from "@/data/giang-duong-data";

// ── Sub-component: PhapThoaiCard (Matching Image 0 reference) ──
const PhapThoaiCard = React.memo(({ talk }: { talk: PhapThoaiTalk }) => {
  return (
    <div
      className="group relative w-full overflow-hidden rounded-2xl border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between hover:-translate-y-1 transform-gpu will-change-transform"
    >
      {/* 1. THUMBNAIL CONTAINER */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#1A120B] shrink-0">
        <img
          src={talk.thumbnailUrl}
          alt={talk.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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

        {/* Duration badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#F2C14E] bg-[#1C130D]/85 border border-[#F2C14E]/40 backdrop-blur-md">
          <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#F2C14E]" />
          <span>{talk.durationText}</span>
        </div>
      </div>

      {/* 2. CARD BODY WITH CENTER BADGE (Matching Image 0) */}
      <div className="relative w-full bg-gradient-to-b from-[#25170E] to-[#1C130D] px-5 pt-6 pb-4 flex flex-col justify-between flex-1">
        {/* Center Circular Badge at Top Edge */}
        <div className="absolute top-[-22px] left-1/2 -translate-x-1/2 z-30 w-11 h-11 rounded-full border-2 border-[#F2C14E] bg-[#25170E] flex items-center justify-center p-1 shadow-[0_0_16px_rgba(242,193,78,0.6)]">
          <img
            src="/images/bieu-tuong-tuong-phap.svg"
            alt="Biểu tượng Bảo tượng"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.8)]"
          />
        </div>

        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-1.5 mb-2 mt-1">
            <span className="text-xs">💥</span>
            <span
              className="text-[#F2C14E] text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {talk.categoryBadge || talk.category}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-[#F2C14E] text-lg md:text-xl font-bold leading-snug group-hover:text-white transition-colors mb-2 line-clamp-2"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {talk.title}
          </h3>

          {/* Description */}
          <p
            className="text-[#c9b896] text-xs leading-relaxed line-clamp-2 mb-4"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {talk.summary}
          </p>
        </div>

        {/* Footer info row */}
        <div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent mb-3" />
          <div
            className="flex items-center justify-between text-xs text-[#FFE5A3]/80 font-bold"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>{talk.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{talk.views}</span>
              <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PhapThoaiCard.displayName = "PhapThoaiCard";

export const GiangDuongPhapThoai: FC = () => {
  // Featured 3D Carousel state
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Discovery Engine States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Tất cả");
  const [durationFilter, setDurationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Display Count for Performance Optimization
  const [displayCount, setDisplayCount] = useState(12);

  // 3D Carousel navigation helpers
  const featuredCount = PHAP_THOAI_FEATURED.length;
  const nextFeatured = () => setFeaturedIndex((prev) => (prev + 1) % featuredCount);
  const prevFeatured = () => setFeaturedIndex((prev) => (prev - 1 + featuredCount) % featuredCount);

  // Indices for 3D layout (Left, Center, Right)
  const leftIdx = (featuredIndex - 1 + featuredCount) % featuredCount;
  const centerIdx = featuredIndex;
  const rightIdx = (featuredIndex + 1) % featuredCount;

  // Filter Logic
  const filteredTalks = useMemo(() => {
    let result = PHAP_THOAI_ALL.filter((talk) => {
      // 1. Emotional / Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = talk.title.toLowerCase().includes(q);
        const matchSummary = talk.summary.toLowerCase().includes(q);
        const matchTags = talk.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchTags) return false;
      }

      // 2. Topic filter
      if (selectedTopic !== "Tất cả" && talk.category !== selectedTopic) {
        return false;
      }

      // 3. Duration filter
      if (durationFilter === "under30" && talk.durationMinutes >= 30) return false;
      if (durationFilter === "30to60" && (talk.durationMinutes < 30 || talk.durationMinutes > 60)) return false;
      if (durationFilter === "over60" && talk.durationMinutes <= 60) return false;

      // 4. Quick Tag click
      if (activeTag && !talk.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase()))) {
        return false;
      }

      return true;
    });

    if (sortBy === "views") {
      result = [...result].sort((a, b) => b.views - a.views);
    }

    return result;
  }, [searchQuery, selectedTopic, durationFilter, sortBy, activeTag]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTopic("Tất cả");
    setDurationFilter("all");
    setSortBy("newest");
    setActiveTag(null);
  };

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1]">
      {/* ══════════════════════════════════════════════════════
          1. SECTION: NHỮNG PHÁP THOẠI NỔI BẬT (3D FLOATING CAROUSEL)
      ══════════════════════════════════════════════════════ */}
      <div className="my-12 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-5xl font-normal uppercase tracking-widest text-[#F2C14E] mb-2"
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
          >
            PHÁP THOẠI NỔI BẬT
          </h2>
          <p
            className="text-xs md:text-sm text-[#c9b896]/80"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Các bài pháp giảng khai thị tâm thức, chuyển hóa phiền não được nghe nhiều nhất
          </p>
        </div>

        {/* 3D FLOATING STAGE CONTAINER */}
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center py-6 px-4">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={prevFeatured}
            className="absolute left-0 md:left-4 z-30 w-12 h-12 rounded-full border-2 border-[#F2C14E] bg-[#2C1C11]/90 text-[#F2C14E] flex items-center justify-center hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-[0_0_25px_rgba(242,193,78,0.5)] hover:scale-110"
            aria-label="Pháp thoại trước"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* 3D Floating Carousel Cards */}
          <div className="relative w-full flex items-center justify-center gap-4 md:gap-8 min-h-[440px] overflow-hidden py-4">
            {/* Left Card (Receded in 3D) */}
            <div
              onClick={() => setFeaturedIndex(leftIdx)}
              className="hidden sm:block w-1/3 max-w-[280px] transform scale-90 opacity-60 hover:opacity-80 transition-all duration-500 cursor-pointer filter brightness-75 -rotate-2 z-10 shrink-0"
            >
              <PhapThoaiCard talk={PHAP_THOAI_FEATURED[leftIdx]} />
            </div>

            {/* Center Card (Elevated in 3D with Highlight & Glow) */}
            <div className="w-full sm:w-1/2 max-w-[360px] transform scale-105 z-20 transition-all duration-500 shadow-[0_20px_50px_rgba(242,193,78,0.25)] rounded-2xl border-2 border-[#F2C14E] ring-4 ring-[#F2C14E]/30 shrink-0">
              <PhapThoaiCard talk={PHAP_THOAI_FEATURED[centerIdx]} />
            </div>

            {/* Right Card (Receded in 3D) */}
            <div
              onClick={() => setFeaturedIndex(rightIdx)}
              className="hidden sm:block w-1/3 max-w-[280px] transform scale-90 opacity-60 hover:opacity-80 transition-all duration-500 cursor-pointer filter brightness-75 rotate-2 z-10 shrink-0"
            >
              <PhapThoaiCard talk={PHAP_THOAI_FEATURED[rightIdx]} />
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={nextFeatured}
            className="absolute right-0 md:right-4 z-30 w-12 h-12 rounded-full border-2 border-[#F2C14E] bg-[#2C1C11]/90 text-[#F2C14E] flex items-center justify-center hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-[0_0_25px_rgba(242,193,78,0.5)] hover:scale-110"
            aria-label="Pháp thoại sau"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Elliptical Floating Shadow Effect Under 3D Cards */}
        <div className="w-3/5 h-6 mx-auto bg-black/80 blur-xl rounded-full scale-y-50 pointer-events-none opacity-90 -mt-2" />
      </div>

      {/* ══════════════════════════════════════════════════════
          2. SECTION: KHO TÀNG PHÁP THOẠI (WITH DANH TĂNG FILTER TOOLBAR)
      ══════════════════════════════════════════════════════ */}
      <div className="my-16 pt-10 border-t max-w-7xl mx-auto px-4 md:px-8" style={{ borderColor: "rgba(242,193,78,0.2)" }}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className="text-2xl md:text-3xl font-normal text-[#F2C14E] uppercase tracking-widest mb-1"
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
            >
              KHO TÀNG PHÁP THOẠI
            </h2>
            <p
              className="text-sm text-[#c9b896]/70"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Lắng nghe lời giảng súc tích từ chư tôn đức giảng sư Tùng Lâm Hòa Phúc
            </p>
          </div>
        </div>

        {/* Filter Toolbar (Matching Danh Tăng Filter Bar Style) */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm pháp thoại, từ khóa..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#1C130D] border border-[#F2C14E]/30 rounded-lg text-xs text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            />
          </div>

          {/* Filter Dropdown 1: Chủ Đề */}
          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="appearance-none bg-[#1C130D] border border-[#F2C14E]/30 rounded-lg px-3 py-1.5 pr-8 text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] cursor-pointer"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <option value="Tất cả">Chủ đề: Tất cả</option>
              {GIANG_DUONG_TOPICS.filter((t) => t !== "Tất cả").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F2C14E]/60 pointer-events-none" />
          </div>

          {/* Filter Dropdown 2: Thời Lượng */}
          <div className="relative">
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="appearance-none bg-[#1C130D] border border-[#F2C14E]/30 rounded-lg px-3 py-1.5 pr-8 text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] cursor-pointer"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <option value="all">Thời lượng: Tất cả</option>
              <option value="under30">&lt; 30 phút</option>
              <option value="30to60">30 - 60 phút</option>
              <option value="over60">60+ phút</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F2C14E]/60 pointer-events-none" />
          </div>

          {/* Filter Dropdown 3: Sắp Xếp */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#1C130D] border border-[#F2C14E]/30 rounded-lg px-3 py-1.5 pr-8 text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] cursor-pointer"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="views">Sắp xếp: Xem nhiều nhất</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F2C14E]/60 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {(searchQuery || selectedTopic !== "Tất cả" || durationFilter !== "all" || sortBy !== "newest" || activeTag) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#F2C14E]/30 text-xs text-[#c9b896] hover:text-[#F2C14E] hover:border-[#F2C14E] transition-all cursor-pointer"
              title="Xóa bộ lọc"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Emotion Quick-Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <span className="text-xs text-[#F2C14E] font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>Gợi ý cảm xúc:</span>
          {EMOTION_QUICK_TAGS.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(isActive ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#F2C14E] text-[#1C130D] shadow-md"
                    : "bg-[#1C130D] border border-[#F2C14E]/30 text-[#c9b896] hover:text-[#F2C14E]"
                }`}
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* ── 4-COLUMN GRID KẾT QUẢ PHÁP THOẠI ── */}
        {filteredTalks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {filteredTalks.slice(0, displayCount).map((talk) => (
                <PhapThoaiCard key={talk.id} talk={talk} />
              ))}
            </div>

            {displayCount < filteredTalks.length && (
              <div className="w-full flex justify-center mt-12">
                <button
                  type="button"
                  onClick={() => setDisplayCount((prev) => prev + 12)}
                  className="px-8 py-3 rounded-full bg-[#2C1C11] border border-[#F2C14E]/60 text-[#F2C14E] text-xs font-bold hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-lg uppercase tracking-wider"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  XEM THÊM PHÁP THOẠI (+12)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-[#c9b896]/60 text-sm" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Không tìm thấy pháp thoại phù hợp. Quý vị vui lòng thử lại từ khóa khác.
          </div>
        )}
      </div>
    </div>
  );
};
