'use client';

import React, { FC, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, Eye, Volume2, Video as VideoIcon, BookOpen, FileText, ChevronDown, Sparkles } from "lucide-react";
import { WISDOM_ITEMS, MEDIA_TYPE_OPTIONS } from "@/data/wisdom-archive-data";
import { WisdomItem } from "@/types/wisdom-tags";
import { MediaPlayModal } from "@/components/public/modals/MediaPlayModal";
import { CustomDropdown } from "@/components/common/CustomDropdown";

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
          style={{ objectPosition: (item as any).thumbnailPosition || 'center center' }}
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
            className="text-[11px] font-bold text-[#F2C14E] tracking-wide flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
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
  const [items, setItems] = useState<WisdomItem[]>(WISDOM_ITEMS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeMediaModalItem, setActiveMediaModalItem] = useState<WisdomItem | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Tải bài viết: ưu tiên từ WordPress API admin.tunglamhoaphuc.com, fallback về local
  React.useEffect(() => {
    async function loadWisdomPosts() {
      try {
        // 1. Gọi WordPress tunglam/v1 API
        const wpRes = await fetch(
          'https://admin.tunglamhoaphuc.com/wp-json/tunglam/v1/posts?per_page=50',
          { cache: 'no-store' }
        );
        if (wpRes.ok) {
          const wpData = await wpRes.json();
          const posts = Array.isArray(wpData) ? wpData : (wpData?.posts || []);
          if (posts.length > 0) {
            const mapped: WisdomItem[] = posts.map((p: any) => {
              const imgUrls = p.featured_image_urls || {};
              const thumbnailUrl = imgUrls.medium || imgUrls.large || imgUrls.thumbnail || '/images/toan-canh-chua.jpg';
              const firstCat = Array.isArray(p.categories) ? p.categories[0] : null;
              return {
                id: String(p.id),
                slug: p.slug || '',
                title: p.title?.rendered || p.title || '',
                type: 'article' as const,
                primaryCategoryTag: firstCat?.name || 'Trí Tuệ Phật Pháp',
                publishDate: p.date ? new Date(p.date).toLocaleDateString('vi-VN') : '2026',
                views: p.acf?.views || 108,
                thumbnailUrl,
                thumbnailPosition: 'center center',
                excerpt: p.noi_dung_tom_tat || p.acf?.noi_dung_tom_tat || '',
                content: p.content?.rendered || '',
              };
            });
            setItems(mapped);
            return; // WP API thành công
          }
        }
      } catch (err) {
        // Lỗi mạng: dùng local data
        console.log('WP API unavailable, using local data:', err);
      }
    }
    loadWisdomPosts();
  }, []);



  const typeOptions = useMemo(() => {
    return MEDIA_TYPE_OPTIONS.map((opt) => ({ id: opt.id, name: opt.label }));
  }, []);

  const sortOptions = [
    { id: 'newest', name: 'Mới nhất' },
    { id: 'views', name: 'Xem nhiều nhất' },
  ];

  // Filter & Sort with useMemo
  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCategory = item.primaryCategoryTag?.toLowerCase().includes(q);
        const matchesExcerpt = item.excerpt?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesExcerpt) return false;
      }
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }
      return true;
    });

    if (sortBy === "views") {
      result = [...result].sort((a, b) => b.views - a.views);
    }
    return result;
  }, [searchQuery, selectedType, sortBy]);

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
      {/* ── 1. Thanh Bộ Lọc Tinh Gọn & Tối Giản (Không Đường Kẻ Dưới, Dropdown Gradient & Hover Nâu Vàng) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-2">
        
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Nhãn LỰA CHỌN nhẹ nhàng thanh lịch */}
          <span
            className="text-[11px] font-bold uppercase tracking-widest text-[#F2C14E]/80 shrink-0 select-none mr-0.5"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            LỰA CHỌN:
          </span>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px] max-w-xs group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]/60 group-hover:text-[#F2C14E] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài viết, pháp âm..."
              className="w-full pl-9 pr-3 py-1.5 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 border border-[#F2C14E]/35 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] hover:border-[#F2C14E]/70 transition-all shadow-inner"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            />
          </div>

          {/* Vạch phân định nhẹ mờ */}
          <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

          {/* Dropdown 1: Thể Loại */}
          <CustomDropdown
            labelPrefix="Thể loại"
            value={selectedType}
            options={typeOptions}
            onChange={setSelectedType}
            placeholder="Tất cả"
          />

          {/* Vạch phân định nhẹ mờ */}
          <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

          {/* Dropdown 2: Sắp Xếp */}
          <CustomDropdown
            labelPrefix="Sắp xếp"
            value={sortBy}
            options={sortOptions}
            onChange={setSortBy}
            placeholder="Mới nhất"
          />
        </div>

        {/* Result Count Badge */}
        <div className="text-xs text-[#F2C14E] font-bold shrink-0 px-3 py-1.5 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 rounded-xl border border-[#F2C14E]/35 shadow-sm" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
          {filteredItems.length} Nội dung
        </div>
      </div>

      {/* ── 2. Grid Cards Display ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleItems.map((item) => (
          <WisdomCard key={item.id} item={item} onClick={handleCardClick} />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div
          className="w-full py-16 text-center text-[#c9b896]/60 border border-dashed border-[#F2C14E]/20 rounded-2xl bg-[#1C130D]/40"
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          Không tìm thấy bài viết hoặc pháp âm nào phù hợp với bộ lọc hiện tại.
        </div>
      )}

      {/* Expand Button */}
      {!isExpanded && filteredItems.length > 16 && (
        <div className="w-full flex justify-center mt-10">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="px-8 py-3 bg-[#6B4B2A] hover:bg-[#8B6439] border border-[#F2C14E] text-[#F2C14E] hover:text-[#FFE5A3] font-bold text-sm rounded-xl transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.7)] flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <span>XEM TẤT CẢ {filteredItems.length} PHÁP BẢO LƯU THÔNG</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── 4. Mục Học Tiếng Tạng (Sara Book) ── */}
      <div className="mt-16 w-full">
        <div className="relative overflow-hidden rounded-2xl border border-[#F2C14E]/40 bg-gradient-to-br from-[#2C1C11] via-[#1C130D] to-[#0F0A06] p-8 shadow-2xl">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("/images/tibetan-pattern.png")', backgroundSize: '200px' }} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2C14E]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4D311F] to-[#2C1C11] border border-[#F2C14E]/50 flex items-center justify-center shadow-xl shrink-0">
              <span className="text-4xl" role="img" aria-label="Tiếng Tạng">&#x0F04;&#x0F05;</span>
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-xs font-bold tracking-[0.2em] text-[#F2C14E]/70 uppercase mb-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                Học Thuật • Phật Pháp
              </div>
              <h3 className="text-2xl font-bold text-[#F2C14E] mb-2" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                Học Tiếng Tạng (Sara Book)
              </h3>
              <p className="text-sm text-[#c9b896]/80 max-w-lg" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                Học nghiên cứu tiếng Tạng qua bộ giáo trình Sara Book — công cụ học thuật quan trọng dành cho những ai muốn thâm nhập kho tàng triết học Phật giáo Tây Tạng nguyên bản.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href="/tri-tue-phat-phap/hoc-tieng-tang"
              id="btn-hoc-tieng-tang"
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#C8860A] to-[#F2C14E] hover:from-[#F2C14E] hover:to-[#FFDE59] rounded-xl text-sm font-bold text-[#1C0A00] shadow-lg hover:shadow-[0_0_25px_rgba(242,193,78,0.6)] transition-all duration-300 group"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <span>Vào Học Ngay</span>
              <span className="group-hover:translate-x-1 transition-transform">➤</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Media Player Modal */}
      {activeMediaModalItem && (
        <MediaPlayModal
          item={activeMediaModalItem}
          onClose={() => setActiveMediaModalItem(null)}
        />
      )}
    </div>
  );
};
