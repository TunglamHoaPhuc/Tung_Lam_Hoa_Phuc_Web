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
  imgPosition?: string;
}

const INITIAL_NEWS_DATA: NewsItem[] = [
  {
    id: "post-632",
    category: "Khóa Lễ Truyền Thống",
    title: "NGÀI ĐỊA TẠNG BỒ TÁT, TẠI SAO NGÀI ĐƯỢC CA NGỢI VÀ TÔN VINH?",
    subtitle: "Hạnh Nguyện Đại Bi Cứu Khổ Độ Sanh Nơi Cảnh Giới Khổ Đau",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/khoa-le-truyen-thong/le-dia-tang-bo-tat-80-bia.webp",
    targetUrl: "/dong-chay-hoang-phap/ngai-dia-tang-bo-tat-tai-sao-ngai-duoc-ca-ngoi-va-ton-vinh-2",
    imgPosition: "center 35%",
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
    subtitle: "Cội nguồn thiện pháp — Nền tảng mọi công hạnh tu tập & phụng sự",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/nen-tang-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp",
    targetUrl: "/tong-chi-tu-hoc/bo-de-tam-coi-nguon-thien-phap",
  },
  {
    id: "core-statue",
    category: "Bảo tượng Phật giáo",
    title: "ĐỨC PHẬT THÍCH CA MÂU NI",
    subtitle: "Bảo tượng Vô Thượng Năng Nhân ngự tại Đại Hùng Bảo Điện",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_thich_ca/tuong_chinh/duc_phat_thich_ca_tuongchinh.webp",
    targetUrl: "/bao-tuong/duc_phat_thich_ca_mau_ni_vo_thuong_nang_nhan_tp0001",
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
            // Sort strictly descending by date
            const sorted = [...json.posts].sort((a: any, b: any) => {
              const timeA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
              const timeB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
              return timeB - timeA;
            });

            const dynamicMapped: NewsItem[] = sorted.slice(0, 4).map((p: any) => ({
              id: p.id,
              category: p.categoryName || p.subCategory || 'Dòng chảy hoằng pháp',
              title: (p.title || '').toUpperCase(),
              subtitle: p.subtitle || (p.summary ? p.summary.replace(/<[^>]*>?/gm, '').slice(0, 95) + '...' : 'Dòng Chảy Hoằng Pháp Tùng Lâm Hòa Phúc'),
              imgUrl: p.thumbnailUrl || p.bannerUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/dai-le-su-kien/32-1-scaled.jpg',
              targetUrl: `/dong-chay-hoang-phap/${p.slug}`,
              imgPosition: p.thumbnailPosition || p.bannerPosition || 'center 35%',
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
    <section className="w-full py-16 relative overflow-hidden bg-[#1A120B]">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A120B] via-transparent to-[#1A120B]" />
      </div>

      {/* ── 1. HEADER SECTION ── */}
      <SectionHeader
        title="TIN MỚI NHẤT"
        iconUrl="/images/icons/icon-tin-moi-nhat.webp"
      />

      {/* ── 2. CAROUSEL TRẢI RỘNG TRÀN MÀN HÌNH VỚI HIỆU ỨNG TRƯỢT (LO L UNIVERSE STYLE) ── */}
      <div className="relative w-full z-20 overflow-hidden px-0 sm:px-2 md:px-4">
        <div className="flex items-center justify-center w-full min-h-[500px] md:min-h-[580px] lg:min-h-[640px]">

          {/* ── 3A. LEFT SIDE PREVIEW CARD ── */}
          <div
            onClick={prevSlide}
            className="hidden lg:flex flex-col items-center justify-center w-[18%] xl:w-[20%] -mr-12 xl:-mr-14 z-10 cursor-pointer transition-all duration-500 grayscale brightness-60 opacity-60 hover:opacity-85 hover:brightness-85 group shrink-0"
          >
            {/* Box Ảnh Bên Trái với viền mờ dần sang trái */}
            <div className="relative w-full h-[320px] md:h-[380px] lg:h-[430px] overflow-hidden border-y border-l border-[#F2C14E]/30 rounded-l-xl shadow-2xl [mask-image:linear-gradient(to_left,black_60%,transparent_100%)]">
              <img
                key={`left-img-${prevNews.id}`}
                src={prevNews.imgUrl}
                alt={prevNews.title}
                style={{ objectPosition: prevNews.imgPosition || 'center 35%' }}
                className={`w-full h-full object-cover ${animClass}`}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Thanh Chú Thích Tối Giản Bên Trái */}
            <div className="w-full py-2.5 px-4 text-center bg-[#1A120B]/90 border-b border-l border-[#F2C14E]/25 rounded-bl-lg">
              <span className="text-[10px] uppercase text-[#F2C14E]/60 tracking-[0.2em] block" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {prevNews.category}
              </span>
              <h4
                className="text-base md:text-lg font-normal uppercase text-amber-100/80 truncate max-w-[90%] mx-auto mt-0.5"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                {prevNews.title}
              </h4>
            </div>
          </div>

          {/* ── 3B. CENTER ACTIVE CARD (ẢNH TO NHẤT, RỘNG RÃI & HOÀNH TRÁNG THEO MẪU LIÊN MINH) ── */}
          <div className="relative w-full lg:w-[66%] xl:w-[64%] max-w-[1020px] flex flex-col items-center z-30 px-2 sm:px-4 shrink-0">
            {/* Box Ảnh Chính To Bề Thế */}
            <div
              className="relative w-full overflow-hidden border-2 border-[#F2C14E] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(242,193,78,0.35)] group cursor-pointer"
              style={{
                height: "clamp(340px, 44vw, 520px)",
              }}
              onClick={() => (window.location.href = currentNews.targetUrl)}
            >
              <img
                key={`center-img-${currentNews.id}`}
                src={currentNews.imgUrl}
                alt={currentNews.title}
                style={{ objectPosition: currentNews.imgPosition || 'center 35%' }}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${animClass}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

              {/* Nút Chuyển Slide Trái */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center border-2 border-[#F2C14E] bg-[#2A1D14]/90 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all hover:scale-110 shadow-2xl z-40 cursor-pointer"
                aria-label="Slide trước"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>

              {/* Nút Chuyển Slide Phải */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center border-2 border-[#F2C14E] bg-[#2A1D14]/90 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all hover:scale-110 shadow-2xl z-40 cursor-pointer"
                aria-label="Slide sau"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>
            </div>

            {/* ── KHUNG CHÚ THÍCH TRUNG TÂM (TỐI GIẢN, PHONG CÁCH UNIVERSE LIÊN MINH HUYỀN THOẠI) ── */}
            <div
              className="relative -mt-10 sm:-mt-14 z-40 flex items-center justify-center w-[92%] sm:w-[84%] max-w-[720px] cursor-pointer group"
              onClick={() => (window.location.href = currentNews.targetUrl)}
            >
              <div className="relative w-full bg-gradient-to-b from-[#251810]/98 via-[#1C120B]/98 to-[#120B07]/98 border border-[#F2C14E]/70 rounded-xl px-5 sm:px-8 py-3.5 sm:py-4.5 text-center flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(242,193,78,0.25)] backdrop-blur-md transition-transform group-hover:scale-[1.02]">
                {/* Crest Icon Vàng Nhỏ Trên Đỉnh */}
                <div className="w-4 h-4 text-[#F2C14E] mb-1 opacity-90">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                  </svg>
                </div>

                {/* Subtitle / Danh mục Tối giản */}
                <span
                  className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#E5A93C] uppercase block mb-0.5"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {currentNews.category}
                </span>

                {/* Tiêu Đề Bài Viết Vàng Kim (UTM Niagara) */}
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl uppercase font-normal text-[#F2C14E] leading-tight px-2"
                  style={{
                    fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                    fontWeight: "normal",
                    textShadow: "0 0 16px rgba(242,193,78,0.6)",
                  }}
                >
                  {currentNews.title}
                </h3>

                {/* Vạch Kẻ Nhỏ Tinh Tế Dưới Cùng */}
                <div className="w-12 sm:w-16 h-[1.5px] bg-[#F2C14E]/60 rounded-full mt-2" />
              </div>
            </div>

          </div>

          {/* ── 3C. RIGHT SIDE PREVIEW CARD ── */}
          <div
            onClick={nextSlide}
            className="hidden lg:flex flex-col items-center justify-center w-[18%] xl:w-[20%] -ml-12 xl:-ml-14 z-10 cursor-pointer transition-all duration-500 grayscale brightness-60 opacity-60 hover:opacity-85 hover:brightness-85 group shrink-0"
          >
            {/* Box Ảnh Bên Phải với viền mờ dần sang phải */}
            <div className="relative w-full h-[320px] md:h-[380px] lg:h-[430px] overflow-hidden border-y border-r border-[#F2C14E]/30 rounded-r-xl shadow-2xl [mask-image:linear-gradient(to_right,black_60%,transparent_100%)]">
              <img
                key={`right-img-${nextNews.id}`}
                src={nextNews.imgUrl}
                alt={nextNews.title}
                style={{ objectPosition: nextNews.imgPosition || 'center 35%' }}
                className={`w-full h-full object-cover ${animClass}`}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Thanh Chú Thích Tối Giản Bên Phải */}
            <div className="w-full py-2.5 px-4 text-center bg-[#1A120B]/90 border-b border-r border-[#F2C14E]/25 rounded-br-lg">
              <span className="text-[10px] uppercase text-[#F2C14E]/60 tracking-[0.2em] block" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                {nextNews.category}
              </span>
              <h4
                className="text-base md:text-lg font-normal uppercase text-amber-100/80 truncate max-w-[90%] mx-auto mt-0.5"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                {nextNews.title}
              </h4>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsSection;