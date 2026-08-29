"use client";
import { FC, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { NAV_LINKS, DROPDOWN } from "@/features/home/data/home-data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  scrolled: boolean;
}

const Header: FC<HeaderProps> = ({ scrolled }) => {
  const [drop, setDrop] = useState<boolean>(false);
  const [mob, setMob] = useState<boolean>(false);

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
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b overflow-visible py-1.5 md:py-2 bg-[#1A120B]"
      style={{
        height: 64,
        background: scrolled
          ? "rgba(26,15,8,0.96)"
          : "linear-gradient(to bottom, rgba(26,15,8,0.92) 0%, rgba(26,15,8,0.75) 100%)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(242,193,78,0.25)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 h-full flex items-center justify-between lg:justify-start gap-6 md:gap-8 overflow-visible relative z-50">

        {/* Logo Mộc Ấn Treo Thò (Hanging Badge - Dual Logic) */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="relative z-50 shrink-0 -mb-10 md:-mb-16 overflow-visible cursor-pointer group"
          title="Tùng Lâm Hòa Phúc"
        >
          <img
            src="https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-moc-an.webp"
            alt="Logo Mộc Ấn Tùng Lâm Hòa Phúc"
            className="h-24 md:h-32 lg:h-36 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-tung-lam-hoa-phuc-tron.webp';
            }}
          />
        </Link>

        {/* Vạch phân cách 1 (Sau Logo) */}
        <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#F2C14E]/50 to-transparent shrink-0 hidden lg:block" />

        {/* Menu Navigation Phẳng Đẹp Ngay Sau Logo */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0">
          {NAV_LINKS.map((item) => (
            <div
              key={item.label}
              className="relative flex-shrink-0"
              onMouseEnter={() => item.dropdown && setDrop(true)}
              onMouseLeave={() => item.dropdown && setDrop(false)}
            >
              {item.dropdown ? (
                <button
                  className="text-[11px] xl:text-xs uppercase tracking-[.1em] font-bold flex items-center gap-1 transition-colors duration-200 py-1 cursor-pointer whitespace-nowrap"
                  style={{
                    color: "#F2C14E",
                    fontFamily: "'UTM Avo', sans-serif",
                    textShadow: "0 0 10px rgba(242,193,78,0.3)",
                  }}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 rotate-90 text-[#F2C14E] flex-shrink-0" />
                </button>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="text-[11px] xl:text-xs uppercase tracking-[.1em] font-bold flex items-center gap-1 transition-colors duration-200 py-1 hover:text-white whitespace-nowrap"
                  style={{
                    color: "#e3d2c1",
                    fontFamily: "'UTM Avo', sans-serif",
                  }}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              )}

              {/* Dropdown Menu */}
              {item.dropdown && drop && (
                <div className="absolute top-full left-0 pt-2 w-60 z-50">
                  <div
                    className="rounded-xl py-2 border shadow-2xl backdrop-blur-md"
                    style={{
                      background: "rgba(42,29,20,0.96)",
                      borderColor: "rgba(242,193,78,0.4)",
                      boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
                    }}
                  >
                    {DROPDOWN.map((d) => (
                      <Link
                        key={d.label}
                        href={d.href}
                        className="block w-full text-left px-4 py-2.5 text-xs font-bold tracking-wide transition-all hover:bg-[#F2C14E]/20 hover:text-[#F2C14E] whitespace-nowrap"
                        style={{ color: "#e3d2c1", fontFamily: "'UTM Avo', sans-serif" }}
                        onClick={() => setDrop(false)}
                      >
                        ›&ensp;{d.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Vạch phân cách 2 (Kết thúc Nav Bar) */}
        <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#F2C14E]/50 to-transparent shrink-0 hidden lg:block" />

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden ml-auto p-1.5 rounded-lg border border-[#F2C14E]/40 text-[#F2C14E]"
          onClick={() => setMob(!mob)}
          aria-label="Menu"
        >
          {mob ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mob && (
        <div
          className="lg:hidden border-t px-6 py-6 flex flex-col gap-4 shadow-2xl max-h-[calc(100vh-70px)] overflow-y-auto"
          style={{
            background: "rgba(26,15,8,0.98)",
            borderColor: "rgba(242,193,78,0.3)",
          }}
        >
          {NAV_LINKS.map((item) =>
            item.dropdown ? (
              <div key={item.label} className="flex flex-col gap-2">
                <span
                  className="text-xs uppercase font-bold tracking-widest text-[#F2C14E] whitespace-nowrap"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {item.label}
                </span>
                {DROPDOWN.map((d) => (
                  <Link
                    key={d.label}
                    href={d.href}
                    className="pl-4 text-xs font-bold tracking-wide text-[#e3d2c1] hover:text-[#F2C14E] whitespace-nowrap"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    onClick={() => setMob(false)}
                  >
                    › {d.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href || "#"}
                className="text-xs uppercase tracking-widest font-bold text-[#e3d2c1] hover:text-[#F2C14E] whitespace-nowrap"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                onClick={() => setMob(false)}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
