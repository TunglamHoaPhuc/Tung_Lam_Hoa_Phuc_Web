'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { HOANG_PHAP_CATEGORIES, HoangPhapArticle } from '@/data/dong-chay-hoang-phap-data';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { CategoryFilter } from '@/components/common/CategoryFilter';
import { PostCard } from '@/components/common/PostCard';
import { PostItem } from '@/types/post';

type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'oldest', label: 'Cũ nhất' },
  { id: 'a-z', label: 'Từ A đến Z' },
  { id: 'z-a', label: 'Từ Z đến A' },
];

export default function DongChayHoangPhapClient({
  initialArticles,
}: {
  initialArticles: HoangPhapArticle[];
}) {
  const [articles, setArticles] = useState<HoangPhapArticle[]>(initialArticles);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');
  const [isExpanded, setIsExpanded] = useState(false);

  // Cập nhật state nếu server props thay đổi
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setArticles(initialArticles);
    }
  }, [initialArticles]);

  // Dynamic Backend Sync ngầm (để cập nhật view count hoặc bài mới nếu có)
  useEffect(() => {
    async function fetchDynamicPosts() {
      try {
        const res = await fetch(`/api/admin/posts?category=dong-chay-hoang-phap&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.posts) && json.posts.length > 0) {
            const mapped: HoangPhapArticle[] = json.posts.map((p: any) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              subtitle: p.subtitle || '',
              date: p.publishedDate || p.date || '',
              author: p.author || 'Ban Văn Hóa Tùng Lâm',
              category: p.subCategory || 'cong-tu',
              subCategory: p.subtitle || p.categoryName || 'Dòng Chảy Hoằng Pháp',
              subCategoryIcon: '',
              templeLogo: (p.templeLogo || 'tung-lam-hoa-phuc') as 'tung-lam-hoa-phuc' | 'quynh-nhai-cam-lo-tu',
              templeName: p.templeName || 'Tùng Lâm Hòa Phúc',
              views: typeof p.viewsCount === 'number' ? p.viewsCount : (parseInt(p.viewsCount, 10) || 0),
              thumbnailUrl: p.thumbnailUrl || '/images/toan-canh-chua.jpg',
              thumbnailPosition: p.thumbnailPosition || p.imagePosition || 'center 20%',
              bannerUrl: p.bannerUrl || '/images/toan-canh-chua.jpg',
              summary:
                p.summary && !p.summary.includes('Tóm tắt')
                  ? p.summary
                  : p.content
                    ? p.content.replace(/!\[.*?\]\(.*?\)/g, '').replace(/<[^>]+>/g, '').replace(/[#*`_>]/g, '').trim().slice(0, 180) + '...'
                    : p.contentHtml
                      ? p.contentHtml.replace(/<[^>]+>/g, '').trim().slice(0, 180) + '...'
                      : '',
              contentHtml: p.contentHtml || '',
            }));
            setArticles(mapped);
          }
        }
      } catch (err) {
        console.log('Dynamic posts load fallback to static dataset:', err);
      }
    }
    fetchDynamicPosts();
  }, []);

  // 1. Lọc bài viết theo danh mục
  let filteredArticles = articles.filter((art) => {
    if (activeCategory === 'all' || activeCategory === 'moi-nhat') return true;
    return art.category === activeCategory;
  });

  // 2. Sắp xếp bài viết
  filteredArticles = [...filteredArticles].sort((a, b) => {
    if (currentSort === 'newest') {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeB - timeA;
    }
    if (currentSort === 'oldest') {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      return timeA - timeB;
    }
    if (currentSort === 'a-z') {
      return a.title.localeCompare(b.title, 'vi');
    }
    if (currentSort === 'z-a') {
      return b.title.localeCompare(a.title, 'vi');
    }
    return 0;
  });

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

          {/* 2. Subtitle: UTM Avo, Sentence case (Chữ thường), Text-balance */}
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
          {/* 1. Tiêu đề lớn LỰA CHỌN DANH MỤC */}
          <div className="mb-4">
            <h2
              style={{ fontFamily: "'UTM Classic Antiqua', 'UTM ClassizismAntiqua', serif" }}
              className="text-2xl md:text-3xl font-normal text-white uppercase tracking-wider mb-4"
            >
              LỰA CHỌN DANH MỤC
            </h2>
          </div>

          {/* Component CategoryFilter */}
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

        {/* ── 3. KHUNG GRID CARD BÀI VIẾT TỶ LỆ VÀNG ── */}
        <div className="relative mb-12">
          <div
            className={`relative transition-all duration-500 overflow-hidden ${
              !isExpanded && filteredArticles.length > 6 ? 'max-h-[1550px] md:max-h-[1650px]' : 'max-h-[10000px] pb-8'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {filteredArticles.map((art) => (
                <PostCard key={art.id} post={mapArticleToPostItem(art)} variant="golden" />
              ))}
            </div>

            {/* Lớp dải mờ Gradient Mask Overlay khi số bài > 6 */}
            {!isExpanded && filteredArticles.length > 6 && (
              <div className="absolute bottom-0 inset-x-0 h-48 md:h-64 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/85 to-transparent pointer-events-none z-10" />
            )}
          </div>

          {/* Nút Tìm Hiểu Thêm */}
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

        {/* ── 4. KHUNG TRỢ LÝ AI PHẬT HỌC ── */}
        <div className="mt-8 mb-12">
          <SmartSearchAIBar contextTitle="Dòng Chảy Hoằng Pháp & Hoạt Động Tự Viện" />
        </div>
      </main>
    </div>
  );
}

function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(parseInt(dec, 10)))
    .normalize('NFC');
}

function mapArticleToPostItem(art: HoangPhapArticle): PostItem {
  let categoryName = 'DÒNG CHẢY HOẰNG PHÁP';
  let categoryIconUrl = '/images/icons/icon-dong-chay-hoang-phap.webp';

  const cat = (art.category || '').toLowerCase();
  if (cat.includes('cong-tu') || cat.includes('cộng tu')) {
    categoryName = 'CỘNG TU ĐỊNH KỲ';
    categoryIconUrl = '/images/icons/icon-cong-tu.png';
  } else if (cat.includes('khoa-le-truyen-thong') || cat.includes('khóa lễ') || cat.includes('khoa le')) {
    categoryName = 'KHÓA LỄ TRUYỀN THỐNG';
    categoryIconUrl = '/images/icons/icon-khoa-le-truyen-thong.png';
  } else if (cat.includes('dai-le-su-kien') || cat.includes('đại lễ') || cat.includes('dai le') || cat.includes('sự kiện')) {
    categoryName = 'ĐẠI LỄ SỰ KIỆN';
    categoryIconUrl = '/images/icons/icon-dai-le-su-kien.png';
  } else if (cat.includes('tinh-do-nhan-gian') || cat.includes('tịnh độ') || cat.includes('tinh do')) {
    categoryName = 'TỊNH ĐỘ NHÂN GIAN';
    categoryIconUrl = '/images/icons/icon-tinh-do-nhan-gian.png';
  }

  return {
    id: art.id,
    imageUrl: art.thumbnailUrl || '/images/toan-canh-chua.jpg',
    category1: categoryName,
    category1IconUrl: categoryIconUrl,
    title: decodeHtmlEntities(art.title),
    subtitle: decodeHtmlEntities(art.subtitle || ''),
    category2: decodeHtmlEntities(art.subtitle || ''),
    publishedDate: art.date,
    viewsCount: typeof art.views === 'number' ? art.views : (parseInt(art.views as any, 10) || 0),
    description: decodeHtmlEntities(art.summary),
    targetUrl: `/dong-chay-hoang-phap/${art.slug}`,
    large: true,
    thumbnailPosition: art.thumbnailPosition || 'center 20%',
    imagePosition: art.thumbnailPosition || 'center 20%',
  };
}
