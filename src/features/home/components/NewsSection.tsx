'use client';

import { FC, useState, useEffect } from "react";
import { SectionTransitionOverlay } from "@/components/common/SectionTransitionOverlay";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  category: string;
  iconUrl?: string;
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
    iconUrl: "/images/icons/icon-khoa-le-truyen-thong.png",
    title: "NGÀI ĐỊA TẠNG BỒ TÁT, TẠI SAO NGÀI ĐƯỢC CA NGỢI VÀ TÔN VINH?",
    subtitle: "Hạnh nguyện Đại bi cứu khổ độ sanh nơi cảnh giới khổ đau",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/khoa-le-truyen-thong/le-dia-tang-bo-tat-80-bia.webp",
    targetUrl: "/dong-chay-hoang-phap/ngai-dia-tang-bo-tat-tai-sao-ngai-duoc-ca-ngoi-va-ton-vinh-2",
    imgPosition: "center 35%",
  },
  {
    id: "core-bdt",
    category: "Tông Chỉ Tu Học",
    iconUrl: "/images/icons/icon-tong-chi-tu-hoc.webp",
    title: "BỒ ĐỀ TÂM",
    subtitle: "Cội nguồn thiện pháp",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/nen-tang-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp",
    targetUrl: "/tong-chi-tu-hoc/bo-de-tam-coi-nguon-thien-phap",
    imgPosition: "center 35%",
  },
  {
    id: "core-statue",
    category: "Bảo Tượng Phật Giáo",
    iconUrl: "/images/icons/icon-cac-bao-tuong-noi-bat.webp",
    title: "ĐỨC PHẬT THÍCH CA MÂU NI",
    subtitle: "Vô Thượng Năng Nhân",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_thich_ca/tuong_chinh/duc_phat_thich_ca_tuongchinh.webp",
    targetUrl: "/bao-tuong/duc_phat_thich_ca_mau_ni_vo_thuong_nang_nhan_tp0001",
    imgPosition: "center 35%",
  },
  {
    id: "hp-1",
    category: "Đại Lễ Sự Kiện",
    iconUrl: "/images/icons/icon-dai-le-su-kien.png",
    title: "THÁNG BẢY – THÁNG CỦA HIẾU ÂN VÀ TÌNH THƯƠNG",
    subtitle: "Tháng ân tình báo hiếu & gieo trồng phước điền nơi ruộng phúc Tam Bảo",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/dai-le-su-kien/32-1-scaled.jpg",
    targetUrl: "/dong-chay-hoang-phap/thang-bay-thang-cua-hieu-an-va-tinh-thuong",
    imgPosition: "center 35%",
  },
  {
    id: "tt-1",
    category: "Trí Tuệ Phật Pháp",
    iconUrl: "/images/icons/icon-tri-tue-phat-phap.webp",
    title: "ĐI QUA KHỔ VUI CUỘC ĐỜI",
    subtitle: "Hành trình tu tập của Sư Phụ Tâm Hòa",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-thap/bao-thap-banner.webp",
    targetUrl: "/tri-tue-phat-phap/tac-pham-di-qua-kho-vui-cuoc-doi",
    imgPosition: "center 35%",
  },
  {
    id: "core-retreat",
    category: "Cộng Tu Định Kỳ",
    iconUrl: "/images/icons/icon-cong-tu.png",
    title: "PHÁP HỘI NIỆM PHẬT & KHÓA LỄ BÁT QUAN TRAI GIỚI",
    subtitle: "Đạo tràng niệm Phật thanh tịnh hàng tuần nuôi dưỡng Bồ Đề Tâm",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/dai-le-su-kien/21-2-scaled.jpg",
    targetUrl: "/dong-chay-hoang-phap",
    imgPosition: "center 35%",
  },
  {
    id: "tc-2",
    category: "Tông Chỉ Tu Học",
    iconUrl: "/images/icons/icon-tong-chi-tu-hoc.webp",
    title: "TIẾP BƯỚC THẦY TÔI",
    subtitle: "Hoằng Pháp – Kiến An mãi nhớ Thầy",
    imgUrl: "https://admin.tunglamhoaphuc.com/wp-content/uploads/2026/07/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-banner-thumnail-scaled.jpg",
    targetUrl: "/tong-chi-tu-hoc/tong-phong-truyen-thua-truc-lam",
    imgPosition: "center 35%",
  },
];

export const NewsSection: FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS_DATA);
  const [activeIdx, setActiveIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Dynamic fetch aggregated news from 4 admin systems
  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const res = await fetch('/api/home/news-carousel', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setNewsList(json.data);
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
  const prevNews = newsList[(safeIdx - 1 + total * 10) % total] || newsList[0];
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

      {/* ── 2. CAROUSEL TRẢI RỘNG VỚI HIỆU ỨNG TRƯỢT (LO L UNIVERSE STYLE - BẢN 3 CARD CHUẨN GỐC) ── */}
      <div className="relative w-full max-w-[1720px] mx-auto z-20 overflow-visible py-4 sm:py-6 px-0 sm:px-2 md:px-4 select-none">
        <div className="flex items-center justify-center w-full min-h-[500px] md:min-h-[580px] lg:min-h-[640px]">

          {/* ── 3A. LEFT SIDE PREVIEW CARD ── */}
          <div
            onClick={prevSlide}
            className="hidden lg:flex flex-col items-center justify-center w-[18%] xl:w-[20%] -mr-12 xl:-mr-14 z-10 cursor-pointer transition-all duration-500 grayscale brightness-60 opacity-60 hover:opacity-85 hover:brightness-85 group shrink-0"
          >
            {/* Box Ảnh Bên Trái với viền mờ dần ở cả 2 mép (mép ngoài và góc trong luồn dưới card chính) */}
            <div className="relative w-full h-[320px] md:h-[380px] lg:h-[430px] overflow-hidden border-y border-l border-[#F2C14E]/30 rounded-l-xl shadow-2xl [mask-image:linear-gradient(to_right,transparent_0%,black_28%,black_82%,transparent_100%)]">
              <img
                key={`left-img-${prevNews.id}`}
                src={prevNews.imgUrl}
                alt={prevNews.title}
                style={{ objectPosition: prevNews.imgPosition || 'center 35%' }}
                className={`w-full h-full object-cover ${animClass}`}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Thanh Chú Thích Tối Giản Bên Trái (Viền và nền mờ dần cả mép ngoài lẫn góc trong) */}
            <div className="w-full py-2.5 px-3 text-center bg-[#1A120B]/90 border-b border-l border-[#F2C14E]/30 rounded-bl-xl flex flex-col items-center justify-center [mask-image:linear-gradient(to_right,transparent_0%,black_28%,black_82%,transparent_100%)]">
              {prevNews.iconUrl && (
                <div className="w-7 h-7 rounded-full border border-[#F2C14E]/60 bg-[#1C120B] shadow-[0_0_10px_rgba(242,193,78,0.3)] flex items-center justify-center p-1 mb-1">
                  <img
                    src={prevNews.iconUrl}
                    alt="Biểu tượng"
                    className="w-full h-full object-contain opacity-85"
                  />
                </div>
              )}
              <h4
                className="text-base md:text-lg font-normal uppercase text-amber-100/90 truncate max-w-[90%] mx-auto"
                style={{ fontFamily: "'UTM Niagara', serif", fontWeight: "normal" }}
              >
                {prevNews.title}
              </h4>
              {prevNews.subtitle && (
                <p
                  className="text-[10px] sm:text-[11px] text-[#E5A93C] font-medium italic normal-case truncate max-w-[95%] mt-0.5"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {prevNews.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* ── 3B. CENTER ACTIVE CARD (ẢNH TO NHẤT, RỘNG RÃI & HOÀNH TRÁNG THEO MẪU LIÊN MINH) ── */}
          <div className="relative w-full lg:w-[66%] xl:w-[64%] max-w-[1020px] flex flex-col items-center z-30 px-2 sm:px-4 shrink-0">
            {/* Box Ảnh Chính To Bề Thế - Shadow đa tầng mịn màng, fade hòa tan vào nền không lộ cạnh */}
            <div
              className="relative w-full overflow-hidden border-2 border-[#F2C14E] rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6),0_35px_80px_rgba(0,0,0,0.45),0_60px_130px_rgba(0,0,0,0.3),0_0_50px_rgba(242,193,78,0.18)] group cursor-pointer"
              style={{
                height: "clamp(340px, 44vw, 520px)",
              }}
              onClick={() => (window.location.href = currentNews.targetUrl)}
            >
              <img
                key={`center-img-${currentNews.id}`}
                src={currentNews.imgUrl}
                alt={currentNews.title}
                style={{ objectPosition: currentNews.imgPosition || 'center 20%' }}
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

            {/* ── KHUNG CHÚ THÍCH TRUNG TÂM (CÓ BIỂU TƯỢNG VÒNG TRÒN VIỀN VÀNG & NÉT KẺ GRADIENT) ── */}
            <div
              className="relative -mt-10 sm:-mt-14 z-40 flex items-center justify-center w-[92%] sm:w-[84%] max-w-[760px] cursor-pointer group"
              onClick={() => (window.location.href = currentNews.targetUrl)}
            >
              <div className="relative w-full bg-gradient-to-b from-[#251810]/98 via-[#1C120B]/98 to-[#120B07]/98 border border-[#F2C14E]/70 rounded-xl px-5 sm:px-8 pt-8 sm:pt-9 pb-4 sm:pb-5 text-center flex flex-col items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.6),0_30px_70px_rgba(0,0,0,0.45),0_50px_100px_rgba(0,0,0,0.25),0_0_35px_rgba(242,193,78,0.12)] backdrop-blur-md transition-transform group-hover:scale-[1.02]">
                
                {/* 🌟 Biểu Tượng Icon Đặt Trong Đường Tròn Viền Vàng Hoàng Kim (Tỏa sáng như mẫu thumbnail) */}
                {currentNews.iconUrl && (
                  <div className="absolute -top-7 sm:-top-8 md:-top-9 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full border-2 border-[#F2C14E] bg-[#1C120B] shadow-[0_0_20px_rgba(242,193,78,0.5),0_6px_20px_rgba(0,0,0,0.9)] flex items-center justify-center p-2.5 sm:p-3 transition-transform group-hover:scale-110 duration-300 z-50">
                    <img
                      src={currentNews.iconUrl}
                      alt={currentNews.category || 'Biểu tượng'}
                      className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(242,193,78,0.6)]"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* 1. Tiêu Đề Bài Viết Vàng Kim (UTM Niagara): KHÔNG BOLD + HÀO QUANG TỎA MỜ DẦN VÀO KHÔNG GIAN (KHÔNG BỊ CẮT HỘP) */}
                <div className="relative w-full flex items-center justify-center mt-1 sm:mt-1.5 mb-1.5 overflow-visible">
                  {/* Hào quang nền mờ dịu tỏa vào không gian 360 độ */}
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(242,193,78,0.18)_0%,rgba(242,193,78,0.05)_45%,transparent_75%)] blur-md -z-10" />

                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl uppercase font-normal text-[#F2C14E] leading-tight px-2 text-center"
                    style={{
                      fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                      fontWeight: "normal",
                      textShadow: "0 0 18px rgba(242,193,78,0.65), 0 0 38px rgba(242,193,78,0.3)",
                    }}
                  >
                    {currentNews.title}
                  </h3>
                </div>

                {/* 2. Sub Tiêu Đề Bài Viết Ở DƯỚI: Chữ Thường, Regular (Ko Bold), Font UTM Avo */}
                {currentNews.subtitle && (
                  <p
                    className="text-[12px] sm:text-[13px] md:text-[14px] font-medium italic normal-case tracking-[0.03em] text-[#E5A93C] max-w-[92%]"
                    style={{
                      fontFamily: "'UTM Avo', sans-serif",
                    }}
                  >
                    {currentNews.subtitle}
                  </p>
                )}

              </div>
            </div>

          </div>

          {/* ── 3C. RIGHT SIDE PREVIEW CARD ── */}
          <div
            onClick={nextSlide}
            className="hidden lg:flex flex-col items-center justify-center w-[18%] xl:w-[20%] -ml-12 xl:-ml-14 z-10 cursor-pointer transition-all duration-500 grayscale brightness-60 opacity-60 hover:opacity-85 hover:brightness-85 group shrink-0"
          >
            {/* Box Ảnh Bên Phải với viền mờ dần ở cả 2 mép (góc trong luồn dưới card chính và mép ngoài) */}
            <div className="relative w-full h-[320px] md:h-[380px] lg:h-[430px] overflow-hidden border-y border-r border-[#F2C14E]/30 rounded-r-xl shadow-2xl [mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_72%,transparent_100%)]">
              <img
                key={`right-img-${nextNews.id}`}
                src={nextNews.imgUrl}
                alt={nextNews.title}
                style={{ objectPosition: nextNews.imgPosition || 'center 35%' }}
                className={`w-full h-full object-cover ${animClass}`}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Thanh Chú Thích Tối Giản Bên Phải (Viền và nền mờ dần cả góc trong lẫn mép ngoài) */}
            <div className="w-full py-2.5 px-3 text-center bg-[#1A120B]/90 border-b border-r border-[#F2C14E]/30 rounded-br-xl flex flex-col items-center justify-center [mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_72%,transparent_100%)]">
              {nextNews.iconUrl && (
                <div className="w-7 h-7 rounded-full border border-[#F2C14E]/60 bg-[#1C120B] shadow-[0_0_10px_rgba(242,193,78,0.3)] flex items-center justify-center p-1 mb-1">
                  <img
                    src={nextNews.iconUrl}
                    alt="Biểu tượng"
                    className="w-full h-full object-contain opacity-85"
                  />
                </div>
              )}
              <h4
                className="text-base md:text-lg font-normal uppercase text-amber-100/90 truncate max-w-[90%] mx-auto"
                style={{ fontFamily: "'UTM Niagara', serif", fontWeight: "normal" }}
              >
                {nextNews.title}
              </h4>
              {nextNews.subtitle && (
                <p
                  className="text-[10px] sm:text-[11px] text-[#E5A93C] font-medium italic normal-case truncate max-w-[95%] mt-0.5"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {nextNews.subtitle}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsSection;