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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const isLinkActive = (href?: string) => {
    if (!href || href === '#') return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b overflow-visible py-1.5 md:py-2 bg-[#1A120B]"
      style={{
        height: 64,
        background: scrolled
          ? "rgba(26,15,8,0.96)"
          : "linear-gradient(to bottom, rgba(26,15,8,0.95) 0%, rgba(26,15,8,0.82) 100%)",
        backdropFilter: "blur(14px)",
        borderColor: "rgba(242,193,78,0.28)",
        boxShadow: "0 4px 28px rgba(0,0,0,0.55)",
      }}
    >
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 h-full flex items-center justify-between lg:justify-start gap-6 md:gap-8 overflow-visible relative z-[100]">

        {/* Logo Mộc Ấn Treo Thò (Hanging Badge) */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="relative z-50 shrink-0 -mb-10 md:-mb-16 overflow-visible cursor-pointer group"
          title="Tùng Lâm Hòa Phúc"
        >
          <img
            src="https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-moc-an.webp"
            alt="Logo Mộc Ấn Tùng Lâm Hòa Phúc"
            className="h-24 md:h-32 lg:h-36 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-tung-lam-hoa-phuc-tron.webp';
            }}
          />
        </Link>

        {/* Vạch phân cách 1 (Sau Logo) */}
        <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#F2C14E]/50 to-transparent shrink-0 hidden lg:block" />

        {/* Menu Navigation Hoàng Kim Với Hiệu Ứng Hover Đẳng Cấp */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-shrink-0">
          {NAV_LINKS.map((item) => {
            const isDropdownActive = item.dropdown && (pathname.startsWith('/gioi-thieu') || drop);
            const active = isLinkActive(item.href);

            return (
              <div
                key={item.label}
                className="relative flex-shrink-0 py-2"
                onMouseEnter={() => item.dropdown && setDrop(true)}
                onMouseLeave={() => item.dropdown && setDrop(false)}
              >
                {item.dropdown ? (
                  <button
                    className={`group/btn text-[11px] xl:text-[12px] uppercase tracking-[.1em] font-bold flex items-center gap-1.5 py-1.5 cursor-pointer whitespace-nowrap transition-all duration-300 relative ${
                      isDropdownActive
                        ? 'text-[#FFDE59] drop-shadow-[0_0_12px_rgba(242,193,78,0.75)]'
                        : 'text-[#e3d2c1] hover:text-[#FFDE59] hover:drop-shadow-[0_0_10px_rgba(242,193,78,0.6)] hover:-translate-y-0.5'
                    }`}
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    onClick={() => router.push('/gioi-thieu')}
                  >
                    <span>{item.label}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 ${
                        drop
                          ? 'rotate-[-90deg] text-[#FFDE59]'
                          : 'rotate-90 text-[#F2C14E] group-hover/btn:text-[#FFDE59] group-hover/btn:translate-y-0.5'
                      }`}
                    />
                    {/* Thanh gạch chân hoàng kim ánh hào quang */}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent transition-all duration-300 origin-center ${
                        isDropdownActive
                          ? 'scale-x-100 opacity-100 shadow-[0_0_10px_#F2C14E]'
                          : 'scale-x-0 opacity-0 group-hover/btn:scale-x-100 group-hover/btn:opacity-100 group-hover/btn:shadow-[0_0_8px_#F2C14E]'
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`group/link text-[11px] xl:text-[12px] uppercase tracking-[.1em] font-bold flex items-center gap-1 py-1.5 whitespace-nowrap transition-all duration-300 relative ${
                      active
                        ? 'text-[#FFDE59] drop-shadow-[0_0_12px_rgba(242,193,78,0.75)]'
                        : 'text-[#e3d2c1] hover:text-[#FFDE59] hover:drop-shadow-[0_0_10px_rgba(242,193,78,0.6)] hover:-translate-y-0.5'
                    }`}
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <span>{item.label}</span>
                    {/* Thanh gạch chân hoàng kim ánh hào quang */}
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent transition-all duration-300 origin-center ${
                        active
                          ? 'scale-x-100 opacity-100 shadow-[0_0_10px_#F2C14E]'
                          : 'scale-x-0 opacity-0 group-hover/link:scale-x-100 group-hover/link:opacity-100 group-hover/link:shadow-[0_0_8px_#F2C14E]'
                      }`}
                    />
                  </Link>
                )}

                {/* Dropdown Menu Giới Thiệu Hoàng Kim */}
                {item.dropdown && drop && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div
                      className="rounded-2xl py-2.5 border shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden"
                      style={{
                        background: "linear-gradient(165deg, rgba(42,29,20,0.98) 0%, rgba(26,15,8,0.98) 100%)",
                        borderColor: "rgba(242,193,78,0.45)",
                      }}
                    >
                      {DROPDOWN.map((d) => {
                        const isSubActive = pathname === d.href;
                        return (
                          <Link
                            key={d.label}
                            href={d.href}
                            className={`group/sub flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap border-l-3 ${
                              isSubActive
                                ? 'border-[#F2C14E] bg-gradient-to-r from-[#F2C14E]/25 to-transparent text-[#FFDE59] shadow-inner'
                                : 'border-transparent text-[#e3d2c1] hover:border-[#F2C14E] hover:bg-gradient-to-r hover:from-[#F2C14E]/20 hover:to-transparent hover:text-[#FFDE59] hover:translate-x-1'
                            }`}
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            onClick={() => setDrop(false)}
                          >
                            <span className="text-[#F2C14E] text-[10px] opacity-70 group-hover/sub:opacity-100 group-hover/sub:scale-125 transition-all">☸</span>
                            <span className="drop-shadow-sm">{d.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Vạch phân cách 2 (Kết thúc Nav Bar) */}
        <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#F2C14E]/50 to-transparent shrink-0 hidden lg:block" />

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden ml-auto p-1.5 rounded-lg border border-[#F2C14E]/40 text-[#F2C14E] hover:text-[#FFDE59] hover:border-[#FFDE59] transition-colors"
          onClick={() => setMob(!mob)}
          aria-label="Menu"
        >
          {mob ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mob && (
        <div
          className="lg:hidden border-t px-6 py-6 flex flex-col gap-4 shadow-2xl max-h-[calc(100vh-70px)] overflow-y-auto relative z-[100] animate-in fade-in slide-in-from-top-4 duration-300"
          style={{
            background: "linear-gradient(180deg, rgba(26,15,8,0.98) 0%, rgba(18,10,5,0.99) 100%)",
            borderColor: "rgba(242,193,78,0.35)",
          }}
        >
          {NAV_LINKS.map((item) =>
            item.dropdown ? (
              <div key={item.label} className="flex flex-col gap-2 border-b border-[#F2C14E]/15 pb-3">
                <Link
                  href={item.href || "/gioi-thieu"}
                  onClick={() => setMob(false)}
                  className="text-xs uppercase font-bold tracking-widest text-[#FFDE59] flex items-center justify-between whitespace-nowrap hover:text-[#FFE5A3] transition-colors"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#F2C14E]" />
                </Link>
                <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-[#F2C14E]/30 mt-1">
                  {DROPDOWN.map((d) => {
                    const isSubActive = pathname === d.href;
                    return (
                      <Link
                        key={d.label}
                        href={d.href}
                        className={`text-xs font-bold tracking-wide whitespace-nowrap transition-colors py-1 ${
                          isSubActive
                            ? 'text-[#FFDE59]'
                            : 'text-[#e3d2c1] hover:text-[#FFDE59]'
                        }`}
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        onClick={() => setMob(false)}
                      >
                        › {d.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href || "#"}
                className={`text-xs uppercase tracking-widest font-bold whitespace-nowrap py-2 border-b border-[#F2C14E]/15 transition-colors ${
                  isLinkActive(item.href)
                    ? 'text-[#FFDE59] drop-shadow-[0_0_8px_rgba(242,193,78,0.6)]'
                    : 'text-[#e3d2c1] hover:text-[#FFDE59]'
                }`}
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
