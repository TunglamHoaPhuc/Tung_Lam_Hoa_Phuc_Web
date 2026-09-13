'use client';

import { FC, useState, useEffect } from "react";
import { SectionTransitionOverlay } from "@/components/common/SectionTransitionOverlay";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  imgUrl: string;
  targetUrl: string;
}

const INITIAL_NEWS_DATA: NewsItem[] = [
  {
    id: "post-632",
    category: "Khóa Lễ Truyền Thống",
    title: "NGÀI ĐỊA TẠNG BỒ TÁT, TẠI SAO NGÀI ĐƯỢC CA NGỢI VÀ TÔN VINH?",
    subtitle: "Hạnh Nguyện Đại Bi Cứu Khổ Độ Sanh Nơi Cảnh Giới Khổ Đau",
    imgUrl: "https://admin.tunglamhoaphuc.com/wp-content/uploads/2026/09/80-scaled.jpg",
    targetUrl: "/dong-chay-hoang-phap/ngai-dia-tang-bo-tat-tai-sao-ngai-duoc-ca-ngoi-va-ton-vinh-2",
  },
  {
    id: "hp-1",
    category: "Dòng chảy hoằng pháp",
    title: "THÁNG BẢY – THÁNG CỦA HIẾU ÂN VÀ TÌNH THƯƠNG",
    subtitle: "Tháng ân tình báo hiếu & gieo trồng phước điền nơi ruộng phúc Tam Bảo",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/dai-le-su-kien/32-1-scaled.jpg",
    targetUrl: "/dong-chay-hoang-phap/thang-bay-thang-cua-hieu-an-va-tinh-thuong",
  },
  {
    id: "hp-2",
    category: "Dòng chảy hoằng pháp",
    title: "PHÁP HỘI HUYẾT BỒN TRAI",
    subtitle: "Hồi hướng công đức, cầu nguyện quốc thái dân an và cha mẹ hiện tiền an lạc",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/dai-le-su-kien/21-2-scaled.jpg",
    targetUrl: "/dong-chay-hoang-phap/phap-hoi-huyet-bon-trai",
  },
  {
    id: "hp-3",
    category: "Dòng chảy hoằng pháp",
    title: "KHAI MẠC TUẦN LỄ PHẬT ĐẢN NĂM 2026",
    subtitle: "Trang nghiêm ngày Đức Từ Phụ Bổn Sư Thích Ca Mâu Ni Phật thị hiện nơi đời",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/dai-le-su-kien/2-2-scaled.jpg",
    targetUrl: "/dong-chay-hoang-phap/khai-mac-tuan-le-phat-dan-nam-2026-pl-2570",
  },
  {
    id: "core-bdt",
    category: "Tông chỉ tu học",
    title: "BỒ ĐỀ TÂM",
    subtitle: "Khuyến phát Bồ Đề Tâm — Cội gốc của mọi công hạnh tu tập",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp",
    targetUrl: "/tong-chi-tu-hoc/khuyen-phat-bo-de-tam",
  },
  {
    id: "core-statue",
    category: "Bảo tượng Phật giáo",
    title: "ĐỨC PHẬT THÍCH CA MÂU NI",
    subtitle: "Bảo tượng Vô Thượng Năng Nhân ngự tại Đại Hùng Bảo Điện",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_thich_ca/tuong_chinh/duc_phat_thich_ca_tuongchinh.webp",
    targetUrl: "/bao-tuong-phat-giao",
  },
  {
    id: "core-retreat",
    category: "Sự kiện định kỳ",
    title: "KHÓA TU MỘT NGÀY AN LẠC",
    subtitle: "Trang nghiêm khóa tu hằng tháng dành cho hàng trăm Phật tử",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-thap/bao-thap-banner.webp",
    targetUrl: "/dong-chay-hoang-phap",
  },
];

export const NewsSection: FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS_DATA);
  const [activeIdx, setActiveIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Dynamic fetch latest Hoang Phap news from API
  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const res = await fetch('/api/admin/posts?category=dong-chay-hoang-phap&status=published', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.posts) && json.posts.length > 0) {
            const dynamicMapped: NewsItem[] = json.posts.slice(0, 4).map((p: any) => ({
              id: p.id,
              category: p.categoryName || p.subCategory || 'Dòng chảy hoằng pháp',
              title: (p.title || '').toUpperCase(),
              subtitle: p.subtitle || (p.summary ? p.summary.replace(/<[^>]*>?/gm, '').slice(0, 95) + '...' : 'Dòng Chảy Hoằng Pháp Tùng Lâm Hòa Phúc'),
              imgUrl: p.thumbnailUrl || p.bannerUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/dai-le-su-kien/32-1-scaled.jpg',
              targetUrl: `/dong-chay-hoang-phap/${p.slug}`,
            }));

            // Keep foundational core highlights
            const coreItems = INITIAL_NEWS_DATA.filter((n) => n.id.startsWith('core-'));
            setNewsList([...dynamicMapped, ...coreItems]);
          }
        }
      } catch (err) {
        console.log('Dynamic news fetch fallback to static dataset:', err);
      }
    }
    fetchLatestNews();
  }, []);

  const total = newsList.length;

  const prevSlide = () => {
    setSlideDirection('prev');
    setActiveIdx((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    setSlideDirection('next');
    setActiveIdx((prev) => (prev + 1) % total);
  };

  const safeIdx = activeIdx % total;
  const currentNews = newsList[safeIdx] || newsList[0];
  const prevNews = newsList[(safeIdx - 1 + total) % total] || newsList[0];
  const nextNews = newsList[(safeIdx + 1) % total] || newsList[0];

  const animClass = slideDirection === 'next' ? 'animate-slide-next' : 'animate-slide-prev';

  return (
    <section className="w-full py-16 relative overflow-hidden bg-[#120d0a]">
      {/* ── Keyframe Animations cho hiệu ứng trượt ngang mượt mà ── */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(8%); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-8%); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-next {
          animation: slideInFromRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-slide-prev {
          animation: slideInFromLeft 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

      {/* ── Seamless Gradient Blur Overlay ── */}
      <SectionTransitionOverlay position="both" />

      {/* ── Background Image với độ mờ mượt mà ── */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          key={`bg-${activeIdx}`}
          src={currentNews.imgUrl}
          alt="Bối cảnh"
          className={`w-full h-full object-cover opacity-20 blur-[2px] transition-all duration-700 ${animClass}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120d0a] via-transparent to-[#120d0a]" />
      </div>

      {/* ── 1. HEADER SECTION ── */}
      <SectionHeader title="TIN MỚI NHẤT" />

      {/* ── 2. CAROUSEL TRẢI RỘNG TRÀN MÀN HÌNH VỚI HIỆU ỨNG TRƯỢT ── */}
      <div className="relative w-full z-20 overflow-hidden">
        <div className="flex items-end justify-between w-full min-h-[450px]">

          {/* ── 3A. LEFT SIDE PREVIEW CARD ── */}
          <div
            onClick={prevSlide}
            className="hidden lg:flex flex-col items-center justify-end w-[28%] -mr-8 z-10 cursor-pointer transition-all duration-500 grayscale brightness-70 opacity-85 hover:opacity-100 hover:brightness-90 group shrink-0"
          >
            {/* Box Ảnh Bên Trái */}
            <div className="relative w-full h-[280px] overflow-hidden border-t border-b border-l border-amber-900/40">
              <img
                key={`left-img-${prevNews.id}`}
                src={prevNews.imgUrl}
                alt={prevNews.title}
                className={`w-full h-full object-cover ${animClass}`}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Thanh Chú Thích Bên Trái: Dòng 1 Tiêu đề Niagara, Dòng 2 Danh mục UTM Avo */}
            <div className="w-full h-[94px] mb-[18px] flex flex-col items-center justify-center p-2 pr-16 text-center bg-[#241810] border-t border-b border-l border-[#F2C14E]/40 shadow-inner">
              <div key={`left-txt-${prevNews.id}`} className={`w-full ${animClass}`}>
                <h4
                  className="text-lg md:text-xl font-normal uppercase text-amber-100/90 truncate max-w-[85%] mx-auto mb-0.5"
                  style={{ fontFamily: "'UTM Niagara', serif", fontWeight: "normal" }}
                >
                  {prevNews.title}
                </h4>
                <span className="text-[11px] uppercase text-amber-200/50 tracking-wider block" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {prevNews.category}
                </span>
              </div>
            </div>
          </div>

          {/* ── 3B. CENTER ACTIVE CARD (VỚI BADGE LỤC GIÁC VẬT TRÙM LÊN 2 POSTER) ── */}
          <div className="relative w-full lg:w-[50%] max-w-[640px] flex flex-col items-center z-30 px-0 my-0 shrink-0">
            {/* Box Ảnh Chính */}
            <div
              className="relative w-full overflow-hidden border shadow-2xl group"
              style={{
                height: 360,
                borderColor: "#F2C14E",
                borderRadius: "12px 12px 0 0",
                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px))",
                boxShadow: "0 25px 80px rgba(0,0,0,0.98), 0 0 50px rgba(242,193,78,0.45)",
              }}
            >
              <img
                key={`center-img-${currentNews.id}`}
                src={currentNews.imgUrl}
                alt={currentNews.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${animClass}`}
              />

              {/* Nút Chuyển Slide Trái */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:scale-110 shadow-xl z-40"
                style={{
                  background: "rgba(242,193,78,0.9)",
                  borderColor: "#ffffff",
                  color: "#2A1D14",
                }}
                aria-label="Slide trước"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </button>

              {/* Nút Chuyển Slide Phải */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:scale-110 shadow-xl z-40"
                style={{
                  background: "rgba(242,193,78,0.9)",
                  borderColor: "#ffffff",
                  color: "#2A1D14",
                }}
                aria-label="Slide sau"
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            {/* ── BADGE LỤC GIÁC MỞ RỘNG (W-[114%]) TRÙM ĐÈ BÊN TRÊN 2 POSTER DẰNG SAU ── */}
            <div
              className="relative -mt-16 z-40 flex items-center justify-center w-[114%] max-w-[680px] h-[136px] cursor-pointer group px-0"
              onClick={() => (window.location.href = currentNews.targetUrl)}
            >
              <svg
                className="absolute inset-0 w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.98)]"
                viewBox="0 0 500 136"
                preserveAspectRatio="none"
              >
                <polygon
                  points="250,2 498,21 498,115 250,134 2,115 2,21"
                  fill="url(#shapeBgGradient)"
                  stroke="#F2C14E"
                  strokeWidth="2.5"
                />
                <polygon
                  points="250,8 491,26 491,110 250,128 9,110 9,26"
                  fill="none"
                  stroke="#F2C14E"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <defs>
                  <linearGradient id="shapeBgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4d3522" stopOpacity="1" />
                    <stop offset="100%" stopColor="#1e1108" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Nội dung chữ trong Badge Lục Giác: Dòng 1 Tiêu đề Niagara phát sáng, Dòng 2 Subtitle UTM Avo */}
              <div
                key={`center-txt-${currentNews.id}`}
                className={`relative z-10 pt-1 pb-1 px-6 text-center flex flex-col items-center justify-center transition-transform group-hover:scale-105 ${animClass}`}
              >
                <div className="w-5 h-5 mb-0.5 text-amber-400 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>

                {/* DÒNG 1 (TRÊN): TIÊU ĐỀ CHÍNH (UTM Niagara) */}
                <h3
                  className="text-2xl md:text-4xl uppercase font-normal text-[#F2C14E] leading-tight mb-0.5"
                  style={{
                    fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                    fontWeight: "normal",
                    textShadow: "0 0 20px rgba(242,193,78,0.7)",
                  }}
                >
                  {currentNews.title}
                </h3>

                {/* DÒNG 2 (DƯỚI): SUBTITLE DANH MỤC (UTM Avo) */}
                <span
                  className="text-xs md:text-sm font-medium text-[#d9c8a9] tracking-wider block"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {currentNews.category}
                </span>
              </div>
            </div>

          </div>

          {/* ── 3C. RIGHT SIDE PREVIEW CARD ── */}
          <div
            onClick={nextSlide}
            className="hidden lg:flex flex-col items-center justify-end w-[28%] -ml-8 z-10 cursor-pointer transition-all duration-500 grayscale brightness-70 opacity-85 hover:opacity-100 hover:brightness-90 group shrink-0"
          >
            {/* Box Ảnh Bên Phải */}
            <div className="relative w-full h-[280px] overflow-hidden border-t border-b border-r border-amber-900/40">
              <img
                key={`right-img-${nextNews.id}`}
                src={nextNews.imgUrl}
                alt={nextNews.title}
                className={`w-full h-full object-cover ${animClass}`}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Thanh Chú Thích Bên Phải: Dòng 1 Tiêu đề Niagara, Dòng 2 Danh mục UTM Avo */}
            <div className="w-full h-[94px] mb-[18px] flex flex-col items-center justify-center p-2 pl-16 text-center bg-[#241810] border-t border-b border-r border-[#F2C14E]/40 shadow-inner">
              <div key={`right-txt-${nextNews.id}`} className={`w-full ${animClass}`}>
                <h4
                  className="text-lg md:text-xl font-normal uppercase text-amber-100/90 truncate max-w-[85%] mx-auto mb-0.5"
                  style={{ fontFamily: "'UTM Niagara', serif", fontWeight: "normal" }}
                >
                  {nextNews.title}
                </h4>
                <span className="text-[11px] uppercase text-amber-200/50 tracking-wider block" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {nextNews.category}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsSection;