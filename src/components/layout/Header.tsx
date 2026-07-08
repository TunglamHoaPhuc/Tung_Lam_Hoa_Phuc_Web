"use client";
import { FC, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { C } from "@/data/palette";
import { NAV_LINKS, DROPDOWN } from "@/data/home-data";

interface HeaderProps {
  /** true once the page has scrolled past the hero threshold (opaque bg). */
  scrolled: boolean;
}

/** Fixed top header: logo, desktop dropdown nav, mobile hamburger menu. */
const Header: FC<HeaderProps> = ({ scrolled }) => {
  const [drop, setDrop] = useState<boolean>(false);
  const [mob, setMob] = useState<boolean>(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: 72,
        background: scrolled ? `rgba(42,29,20,0.97)` : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.35)" : "none",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-10 h-full flex items-center justify-between">
        {/* logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              borderColor: C.accentDeep,
              background: `linear-gradient(135deg,${C.accent},${C.surface})`,
            }}
          >
            <span
              className="font-cinzel font-black text-center leading-tight"
              style={{ fontSize: 7.5, color: C.dark }}
            >
              TL
              <br />
              HP
            </span>
          </div>
          <div className="hidden md:block">
            <div
              className="font-cinzel text-xs font-bold tracking-[.2em]"
              style={{ color: C.cream }}
            >
              TÙNG LÂM HÒA PHÚC
            </div>
            <div
              className="font-inter text-[10px] tracking-[.25em] uppercase"
              style={{ color: C.muted }}
            >
              Thiền Viện · Hà Nội
            </div>
          </div>
        </div>

        {/* desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setDrop(true)}
              onMouseLeave={() => item.dropdown && setDrop(false)}
            >
              <button
                className="font-inter text-[11px] uppercase tracking-[.1em] font-semibold flex items-center gap-1 transition-colors duration-200 pb-0.5"
                style={{
                  color: C.cream,
                  borderBottom: `1.5px solid transparent`,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = C.accent)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = C.cream)
                }
              >
                {item.label}
                {item.dropdown && (
                  <ChevronRight className="w-3 h-3 rotate-90 opacity-50" />
                )}
              </button>

              {/* dropdown */}
              {item.dropdown && drop && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 rounded-lg py-1.5 z-50 border"
                  style={{
                    background: C.secondary,
                    borderColor: `rgba(212,169,74,.4)`,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                  }}
                >
                  {DROPDOWN.map((d) => (
                    <button
                      key={d}
                      className="w-full text-left px-4 py-2.5 font-inter text-[11px] tracking-wide transition-colors"
                      style={{ color: C.cream }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = C.accent;
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(74,55,40,.5)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = C.cream;
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      ›&ensp;{d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <button
          className="lg:hidden p-1"
          style={{ color: C.cream }}
          onClick={() => setMob(!mob)}
          aria-label="Menu"
        >
          {mob ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* mobile */}
      {mob && (
        <div
          className="lg:hidden border-t px-8 py-5 flex flex-col gap-4"
          style={{
            background: "rgba(42,29,20,.98)",
            borderColor: "rgba(201,161,92,.3)",
          }}
        >
          {NAV_LINKS.map((item) => (
            <button
              key={item.label}
              className="font-inter text-sm uppercase tracking-widest text-left transition-colors"
              style={{ color: C.cream }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
