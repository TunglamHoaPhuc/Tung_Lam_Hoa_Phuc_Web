'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Calendar, ArrowRight, ChevronDown, Check } from 'lucide-react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { HOANG_PHAP_ARTICLES, HOANG_PHAP_CATEGORIES, HoangPhapArticle } from '@/data/dong-chay-hoang-phap-data';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { CategoryFilter } from '@/components/common/CategoryFilter';

type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'oldest', label: 'Cũ nhất' },
  { id: 'a-z', label: 'Từ A đến Z' },
  { id: 'z-a', label: 'Từ Z đến A' },
];

export default function DongChayHoangPhapPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Lọc bài viết theo danh mục
  let filteredArticles = HOANG_PHAP_ARTICLES.filter((art) => {
    if (activeCategory === 'all' || activeCategory === 'moi-nhat') return true;
    return art.category === activeCategory;
  });

  // 2. Sắp xếp bài viết
  filteredArticles = [...filteredArticles].sort((a, b) => {
    if (currentSort === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (currentSort === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (currentSort === 'a-z') {
      return a.title.localeCompare(b.title, 'vi');
    }
    if (currentSort === 'z-a') {
      return b.title.localeCompare(a.title, 'vi');
    }
    return 0;
  });

  const currentSortLabel = SORT_OPTIONS.find((s) => s.id === currentSort)?.label || 'Mới nhất';

  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      {/* ── HEADER VỚI BACKGROUND MỜ VÀ SCROLL FADE VIGNETTE ── */}
      <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-28 pb-10">
        {/* Ảnh nền đằng sau mờ phủ gradient & giảm opacity nhẹ */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-35 blur-[2.5px] pointer-events-none scale-105"
          style={{
            backgroundImage: "url('/images/toan-canh-chua.jpg')",
          }}
        />
        {/* Hiệu ứng gradient mờ mềm mại hòa vào nền nâu */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/45 via-[#2A1D14]/75 to-[#2A1D14] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center text-center">
          {/* Biểu tượng bánh xe Pháp Chuyển */}
          <div className="w-10 h-10 rounded-full bg-[#3a2718] border border-[#f2cc8f]/40 flex items-center justify-center text-[#ffde59] mb-2 shadow-md">
            <span className="text-xl">☸</span>
          </div>

          {/* 1. KHUNG FLEXBOX CĂN ĐƯỜNG KẺ HAI BÊN ĐÂM TỪ TIM TIÊU ĐỀ */}
          <div className="flex items-center justify-center w-full my-4 gap-4 md:gap-8">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
            <h1
              style={{ fontFamily: "'UTM Niagara', sans-serif" }}
              className="text-5xl sm:text-6xl md:text-7xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] whitespace-nowrap flex-shrink-0"
            >
              DÒNG CHẢY HOẰNG PHÁP
            </h1>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
          </div>

          {/* 2. Subtitle: UTM Avo, Sentence case (Chữ thường), Text-balance, bọc hoằng&nbsp;dương, chánh&nbsp;pháp, Tùng&nbsp;Lâm&nbsp;Hòa&nbsp;Phúc */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance"
          >
            Ghi dấu hành trình phụng&nbsp;sự nhân&nbsp;sinh &amp; hoằng&nbsp;dương chánh&nbsp;pháp của Tùng&nbsp;Lâm&nbsp;Hòa&nbsp;Phúc.
          </p>
        </div>
      </div>

      <main className="pb-20 px-4 md:px-10 max-w-[1280px] mx-auto">
        {/* ── 2. THANH LỰA CHỌN DANH MỤC CHỮ THƯỜNG & SẮP XẾP ── */}
        <div className="mb-12">
          {/* 1. Tiêu đề lớn LỰA CHỌN DANH MỤC (UTM Classic Antiqua In Hoa Màu Trắng) */}
          <div className="mb-4">
            <h2
              style={{ fontFamily: "'UTM Classic Antiqua', 'UTM ClassizismAntiqua', serif" }}
              className="text-2xl md:text-3xl font-normal text-white uppercase tracking-wider mb-4"
            >
              LỰA CHỌN DANH MỤC
            </h2>
          </div>

          {/* Component CategoryFilter xử lý overflow-only dropdown và z-index/Sentence case */}
          <CategoryFilter
            categories={HOANG_PHAP_CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            sortOptions={SORT_OPTIONS}
            currentSort={currentSort}
            onSelectSort={(sortId) => setCurrentSort(sortId as SortOption)}
            sortLabel="Phân loại"
          />
        </div>

        {/* ── 3. KHUNG GRID CARD BÀI VIẾT TỶ LỆ VÀNG (MẶC ĐỊNH HIỂN THỊ 6 BÀI) ── */}
        <div className="relative mb-12">
          {/* Khung chứa Grid có max-h chứa 6 bài khi chưa mở rộng */}
          <div
            className={`relative transition-all duration-500 overflow-hidden ${
              !isExpanded && filteredArticles.length > 6 ? 'max-h-[1700px] md:max-h-[1800px]' : 'max-h-[10000px] pb-8'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {filteredArticles.map((art) => (
                <HoangPhapCard key={art.id} article={art} />
              ))}
            </div>

            {/* Lớp dải mờ Gradient Mask Overlay ở chân hàng Card thứ 3 khi tổng số bài > 6 */}
            {!isExpanded && filteredArticles.length > 6 && (
              <div className="absolute bottom-0 inset-x-0 h-48 md:h-64 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/85 to-transparent pointer-events-none z-10" />
            )}
          </div>

          {/* Nút Tìm Hiểu Thêm nổi chính giữa dải mờ khi tổng số bài > 6 */}
          {!isExpanded && filteredArticles.length > 6 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center px-4">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="px-8 py-3 md:px-10 md:py-3.5 bg-[#6B4B2A] hover:bg-[#8B6439] border border-[#F2C14E] text-[#F2C14E] hover:text-[#FFE5A3] font-bold text-sm md:text-base rounded-xl transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.7)] flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <span>TÌM HIỂU THÊM</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ── 4. KHUNG TRỢ LÝ AI PHẬT HỌC (AI CHATBOT BOX) NẰM PHÍA DƯỚI KHỐI GRID ── */}
        <div className="mt-8 mb-12">
          <SmartSearchAIBar contextTitle="Dòng Chảy Hoằng Pháp & Hoạt Động Tự Viện" />
        </div>
      </main>
    </div>
  );
}

// ─── Sub-component: HoangPhapCard (Golden Ratio φ ≈ 1.618) ────────────────
function HoangPhapCard({ article }: { article: HoangPhapArticle }) {
  return (
    <Link
      href={`/dong-chay-hoang-phap/${article.slug}`}
      className="group relative w-full overflow-hidden rounded-xl border border-[#F2C14E]/20 bg-[#2C1C11] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F2C14E] shadow-xl hover:shadow-2xl flex flex-col h-full"
    >
      {/* 1. Khung ảnh Thumbnail Tỷ Lệ Vàng (1.618 : 1) */}
      <div className="relative w-full aspect-[1.618/1] overflow-hidden bg-[#1A120B] shrink-0">
        <img
          src={article.thumbnailUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* 2. Đường kẻ Gradient cắt ĐÚNG ranh giới mép chân ảnh */}
      <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-transparent z-10 shrink-0">
        {/* Huy hiệu Logo Chùa nổi chính giữa tim đường kẻ */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-[#F2C14E] bg-[#2C1C11] flex items-center justify-center p-1 shadow-[0_0_12px_rgba(242,193,78,0.5)]">
          <img
            src="https://tunglam.mocwp.com/wp-content/uploads/2026/07/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.png"
            alt="Logo Chùa"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 3. Khung nội dung chú thích phía dưới (Golden Scale & Spacing) */}
      <div className="p-4 md:p-6 pt-6 md:pt-8 flex flex-col gap-2.5 bg-[#2C1C11] flex-1 justify-between">
        <div className="space-y-2">
          {/* Tag Danh Mục */}
          <div
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[11px] md:text-[12px] font-bold text-[#F2C14E] tracking-wide flex items-center gap-1.5"
          >
            <span>{article.subCategoryIcon || '🪔'}</span>
            <span>{article.subCategory || 'Dòng chảy hoằng pháp'}</span>
          </div>

          {/* Tiêu Đề Bài Viết (Golden Scale: text-[18px] md:text-[20px]) */}
          <h3
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="font-bold text-[18px] md:text-[20px] text-[#F2C14E] hover:text-[#FFE5A3] line-clamp-2 leading-snug transition-colors"
          >
            {article.title}
          </h3>

          {/* Mô Tả / Bối Cảnh (Golden Scale: text-[13px] md:text-[14px]) */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[13px] md:text-[14px] text-[#D3C0AD] line-clamp-2 leading-relaxed font-normal"
          >
            {article.summary}
          </p>
        </div>

        {/* Thanh Chân Bài Viết (Golden Scale: text-[11px] md:text-[12px]) */}
        <div
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="border-t border-[#F2C14E]/15 pt-3 mt-3 flex items-center justify-between text-[11px] md:text-[12px] text-[#A69383]"
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span>{article.date}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>{article.views}</span>
            <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
          </div>
        </div>
      </div>
    </Link>
  );
}
