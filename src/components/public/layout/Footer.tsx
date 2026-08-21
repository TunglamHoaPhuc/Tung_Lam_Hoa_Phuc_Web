'use client';

import { FC } from "react";
import { Phone, Clock } from "lucide-react";
import { FaFacebook, FaYoutube, FaInstagram, FaTiktok, FaGlobe, FaUsers } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";

/**
 * Footer chuẩn hệ thống (Responsive & Grid 12 Cột Optimized):
 * - Logo tròn Tùng Lâm Hòa Phúc chính giữa
 * - Tiêu đề TÙNG LÂM HÒA PHÚC (UTM Niagara, font-normal, text-[#F2C14E] drop-shadow-[0_0_12px_rgba(242,193,78,0.5)])
 * - Subtitle: THÔN HOÀ TRÚC - XÃ PHÚ CÁT - THÀNH PHỐ HÀ NỘI
 * - Cột trái (4 Cột - col-span-12 lg:col-span-4): Mạng xã hội + Ngắt 2 dòng giờ mở cửa
 * - Divider: Vạch dọc mờ ở giữa (Desktop), Vạch ngang mờ (Mobile)
 * - Cột phải (8 Cột - col-span-12 lg:col-span-8): Khối "THÔNG TIN LIÊN HỆ" (4 dòng 2-sub-column alignment)
 */
export const Footer: FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      // Nếu đang ở trang chủ: Cuộn mượt lên đầu trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Nếu đang ở trang con: Chuyển hướng về trang chủ
      router.push('/');
    }
  };

  return (
    <footer
      id="footer"
      className="relative overflow-hidden pt-16 pb-10 px-6 md:px-10 border-t z-10"
      style={{
        background: "linear-gradient(180deg, #3D2B1F 0%, #2A1D14 100%)",
        borderColor: "rgba(242,193,78,0.2)",
      }}
    >
      {/* ── nền núi non họa tiết Phật giáo cổ kính ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 left-0 right-0 w-full"
          style={{ opacity: 0.15 }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,144C672,149,768,203,864,224C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#F2C14E"
          />
          <path
            d="M0,256L60,245.3C120,235,240,213,360,208C480,203,600,213,720,229.3C840,245,960,267,1080,266.7C1200,267,1320,245,1380,234.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            fill="#4A3728"
            style={{ opacity: 0.6 }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(242,193,78,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">

        {/* ── Logo Tròn Chính Giữa + Tiêu Đề UTM Niagara Font-Normal & Subtitle ── */}
        <div className="flex flex-col items-center mb-10 text-center">
          {/* Logo Tròn Căn Giữa + Glow Effect & Dual Logic */}
          <button
            onClick={handleLogoClick}
            type="button"
            title="Tùng Lâm Hòa Phúc"
            className="mx-auto flex justify-center items-center mb-4 md:mb-6 p-[2px] bg-gradient-to-tr from-[#F2C14E] via-[#FFE5A3] to-[#B8860B] rounded-full shadow-[0_0_25px_rgba(242,193,78,0.55)] hover:shadow-[0_0_35px_rgba(242,193,78,0.85)] hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <img
              src="/images/icon-minh-hoa/logo-tung-lam-hoa-phuc-tron.png"
              alt="Logo Tùng Lâm Hòa Phúc"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover bg-white/95 p-[1px] group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/logo-tung-lam-hoa-phuc-tron.png';
              }}
            />
          </button>

          {/* Tiêu đề UTM Niagara font-normal + Glow Effect */}
          <h2
            className="text-3xl md:text-5xl font-normal tracking-widest text-[#F2C14E] uppercase drop-shadow-[0_0_12px_rgba(242,193,78,0.5)] select-none"
            style={{
              fontFamily: "'UTM Niagara', 'Playfair Display', serif",
              fontWeight: "normal",
              textShadow: "0 0 12px rgba(242,193,78,0.5)",
            }}
          >
            TÙNG LÂM HÒA PHÚC
          </h2>

          <p
            className="mt-3 text-xs md:text-sm tracking-wider uppercase text-[#e3d2c1]"
            style={{
              fontFamily: "'UTM Avo', sans-serif",
              fontWeight: "bold",
            }}
          >
            THÔN HOÀ TRÚC - XÃ PHÚ CÁT - THÀNH PHỐ HÀ NỘI
          </p>
        </div>

        {/* ── Đường Phân Cách Ngang Toàn Chiều Rộng ── */}
        <div className="h-px w-full mb-10" style={{ background: "linear-gradient(to right, transparent, rgba(242,193,78,0.3), transparent)" }} />

        {/* ── Chia Bố Cục 2 Cột Tân Tiến (Symmetric Margins & Inline Flow) ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 w-full">

          {/* ─ Cột Trái (w-full lg:w-auto shrink-0) ─ */}
          <div className="w-full lg:w-auto shrink-0">
            {/* Kênh 1: Theo dõi Tùng Lâm Hòa Phúc */}
            <h4
              className="text-xs uppercase tracking-widest mb-3 text-[#F2C14E]"
              style={{
                fontFamily: "'UTM Avo', sans-serif",
                fontWeight: "bold",
              }}
            >
              Theo dõi Tùng Lâm Hòa Phúc
            </h4>
            <div className="flex items-center gap-3 mb-6">
              {[
                { Icon: FaUsers, label: "Zalo", bg: "#0068FF" },
                { Icon: FaUsers, label: "Group", bg: "#1877F2" },
                { Icon: FaInstagram, label: "Instagram", bg: "#C13584" },
                { Icon: FaFacebook, label: "Facebook", bg: "#1877F2" },
                { Icon: FaTiktok, label: "TikTok", bg: "#010101" },
                { Icon: FaYoutube, label: "YouTube", bg: "#FF0000" },
              ].map(({ Icon, label, bg }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110 cursor-pointer"
                  style={{ background: bg }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Kênh 2: Theo dõi Quỳnh Nhai Cam Lộ Tự */}
            <h4
              className="text-xs uppercase tracking-widest mb-3 text-[#F2C14E]"
              style={{
                fontFamily: "'UTM Avo', sans-serif",
                fontWeight: "bold",
              }}
            >
              Theo dõi Quỳnh Nhai Cam Lộ Tự
            </h4>
            <div className="flex items-center gap-3 mb-6">
              {[
                { Icon: FaFacebook, label: "Facebook QNCLT", bg: "#1877F2" },
                { Icon: FaGlobe, label: "Website QNCLT", bg: "#5C4630" },
              ].map(({ Icon, label, bg }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110 cursor-pointer"
                  style={{ background: bg }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Thông tin mở cửa (Tách 2 dòng thoáng mắt & Không ngắt cụm (Ngày thường)) */}
            <div
              className="flex flex-col gap-1.5 text-sm md:text-base text-[#E2C89B]/90 mt-4"
              style={{
                fontFamily: "'UTM Avo', sans-serif",
                fontWeight: "normal",
              }}
            >
              <p className="flex items-center gap-2 font-semibold text-[#F2C14E]">
                <Clock className="w-4 h-4 text-[#F2C14E] shrink-0" />
                <span>Giờ mở cửa đón Phật tử:</span>
              </p>
              <p className="pl-6 text-xs sm:text-sm md:text-sm text-[#e3d2c1]">
                Sáng 7:30 – 10:30 | Chiều 13:30 – 17:30 <span className="whitespace-nowrap">(Ngày thường)</span>
              </p>
            </div>
          </div>

          {/* Vạch kẻ phân cách đứng (Desktop) / Ngang (Mobile) */}
          <div className="w-[1px] self-stretch bg-gradient-to-b from-transparent via-[#F2C14E]/30 to-transparent hidden lg:block shrink-0" />
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent my-2 lg:hidden" />

          {/* ─ Cột Phải (w-full lg:w-auto flex-1) ─ */}
          <div className="w-full lg:w-auto flex-1">
            <h4
              className="text-xs sm:text-sm md:text-base uppercase tracking-widest mb-4 text-[#F2C14E]"
              style={{
                fontFamily: "'UTM Avo', sans-serif",
                fontWeight: "bold",
              }}
            >
              THÔNG TIN LIÊN HỆ
            </h4>

            <div className="space-y-3.5" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              
              {/* Dòng 1: Trưởng ban lãnh chúng */}
              <div className="flex items-start md:items-center gap-2 text-xs sm:text-sm lg:text-[15px] text-[#e3d2c1] whitespace-normal md:whitespace-nowrap">
                <Phone className="w-4 h-4 text-[#F2C14E] shrink-0 mt-0.5 md:mt-0" />
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 leading-normal">
                  <span className="font-medium text-[#E2C89B]">Trưởng ban lãnh chúng:</span>
                  <span className="font-medium text-[#E2C89B]">Phật tử Bảo Trâm</span>
                  <span className="text-[#E2C89B]">–</span>
                  <a href="tel:0979345373" className="font-bold text-[#F2C14E] hover:underline">
                    0979.345.373
                  </a>
                </div>
              </div>

              {/* Dòng 2: Thư ký */}
              <div className="flex items-start md:items-center gap-2 text-xs sm:text-sm lg:text-[15px] text-[#e3d2c1] whitespace-normal md:whitespace-nowrap">
                <Phone className="w-4 h-4 text-[#F2C14E] shrink-0 mt-0.5 md:mt-0" />
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 leading-normal">
                  <span className="font-medium text-[#E2C89B]">Thư ký:</span>
                  <span className="font-medium text-[#E2C89B]">Phật tử Liên Vi:</span>
                  <a href="tel:0961533271" className="font-bold text-[#F2C14E] hover:underline">
                    0961.533.271
                  </a>
                  <span className="text-[#E2C89B]">–</span>
                  <span className="font-medium text-[#E2C89B]">Phật tử Liên Nghi:</span>
                  <a href="tel:0984569134" className="font-bold text-[#F2C14E] hover:underline">
                    0984.569.134
                  </a>
                </div>
              </div>

              {/* Dòng 3: Hỗ trợ thông tin 1 */}
              <div className="flex items-start md:items-center gap-2 text-xs sm:text-sm lg:text-[15px] text-[#e3d2c1] whitespace-normal md:whitespace-nowrap">
                <Phone className="w-4 h-4 text-[#F2C14E] shrink-0 mt-0.5 md:mt-0" />
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 leading-normal">
                  <span className="font-medium text-[#E2C89B]">Hỗ trợ thông tin:</span>
                  <span className="font-medium text-[#E2C89B]">Phật tử Tịnh Hoàng:</span>
                  <a href="tel:0919366751" className="font-bold text-[#F2C14E] hover:underline">
                    0919.366.751
                  </a>
                  <span className="text-[#E2C89B]">–</span>
                  <span className="font-medium text-[#E2C89B]">Phật tử Liên Hương:</span>
                  <a href="tel:0348198196" className="font-bold text-[#F2C14E] hover:underline">
                    0348.198.196
                  </a>
                </div>
              </div>

              {/* Dòng 4: Hỗ trợ thông tin 2 */}
              <div className="flex items-start md:items-center gap-2 text-xs sm:text-sm lg:text-[15px] text-[#e3d2c1] whitespace-normal md:whitespace-nowrap">
                <Phone className="w-4 h-4 text-[#F2C14E] shrink-0 mt-0.5 md:mt-0" />
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 leading-normal">
                  <span className="font-medium text-[#E2C89B]">Hỗ trợ thông tin:</span>
                  <span className="font-medium text-[#E2C89B]">Tịnh Hòa Hưng:</span>
                  <a href="tel:0329630394" className="font-bold text-[#F2C14E] hover:underline">
                    0329.630.394
                  </a>
                  <span className="text-[#E2C89B]">–</span>
                  <span className="font-medium text-[#E2C89B]">Liên Phúc Huyền:</span>
                  <a href="tel:0328812922" className="font-bold text-[#F2C14E] hover:underline">
                    0328.812.922
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── Bản Quyền (Copyright) ── */}
        <div
          className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderColor: "rgba(242,193,78,0.15)",
            color: "#c9b896",
            fontFamily: "'UTM Avo', sans-serif",
            fontWeight: "normal",
          }}
        >
          <p>© 2026 Tùng Lâm Hòa Phúc. Bảo lưu mọi quyền.</p>
          <p className="italic" style={{ fontFamily: "'UTM Avo', sans-serif", fontStyle: "italic" }}>
            &quot;Nơi để trở về – Chốn thiêng bình yên&quot; 🪷
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
