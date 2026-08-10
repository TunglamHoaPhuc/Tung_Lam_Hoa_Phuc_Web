'use client';

import React, { FC, useCallback, useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export interface AnchorSection {
  id: string;
  label: string;
}

export interface VerticalAnchorNavProps {
  sections: AnchorSection[];
  pageTitle?: string;
  logoUrl?: string;
  activeSectionId?: string;
  onSectionChange?: (id: string) => void;
  position?: "right" | "left";
  showAfterScroll?: number;
  className?: string;
}

/**
 * Standardized VerticalAnchorNav Component (4 Tầng Nav)
 * Used on Home page and detail pages
 * Automatically hides when footer (#footer) enters viewport
 */
export const VerticalAnchorNav: FC<VerticalAnchorNavProps> = ({
  sections,
  pageTitle = "TRANG CHỦ",
  logoUrl = "https://tunglam.mocwp.com/wp-content/uploads/2026/07/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.png",
  activeSectionId,
  onSectionChange,
  position = "left",
  showAfterScroll = 400,
  className = "",
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [internalActiveId, setInternalActiveId] = useState<string>(sections[0]?.id || "");
  const [imageFailed, setImageFailed] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  const activeId = activeSectionId !== undefined ? activeSectionId : internalActiveId;

  // Detect when Footer (#footer) enters viewport
  useEffect(() => {
    const footerEl = document.getElementById("footer") || document.querySelector("footer");
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  // Track window scroll position & determine active section
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (activeSectionId === undefined && sections.length > 0) {
        const midScreenPos = currentScrollY + window.innerHeight / 3;
        let currentSec = sections[0].id;

        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (top <= midScreenPos && top + height > midScreenPos) {
              currentSec = sec.id;
              break;
            }
          }
        }
        setInternalActiveId(currentSec);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, activeSectionId]);

  const handleScrollToSection = useCallback(
    (id: string) => {
      if (onSectionChange) {
        onSectionChange(id);
      } else {
        setInternalActiveId(id);
      }

      const targetEl = document.getElementById(id);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    },
    [onSectionChange]
  );

  const isVisible = scrollY > showAfterScroll && !isFooterVisible;
  const titleWords = (pageTitle || "").trim().split(/\s+/);

  const positionClass =
    position === "right"
      ? "right-3 md:right-6 slide-in-from-right-4"
      : "left-3 md:left-6 slide-in-from-left-4";

  const translateOffClass =
    position === "right" ? "translate-x-20" : "-translate-x-20";

  return (
    <aside
      className={`fixed top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 transition-opacity duration-300 ${positionClass} ${
        isVisible
          ? "opacity-100 translate-x-0"
          : `opacity-0 ${translateOffClass} pointer-events-none`
      } ${className}`}
    >
      <div className="bg-[#23160e]/90 border border-[#F2C14E]/40 px-2.5 py-4 rounded-3xl flex flex-col items-center shadow-2xl backdrop-blur-md">
        {/* ── Tầng 1: Top Logo ── */}
        {!imageFailed && logoUrl ? (
          <img
            src={logoUrl}
            alt="Biểu tượng"
            className="h-8 w-auto object-contain mb-1.5 flex-shrink-0 drop-shadow-[0_0_6px_rgba(242,193,78,0.4)]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-7 h-7 rounded-full border border-[#F2C14E] flex items-center justify-center bg-black/40 text-[#F2C14E] text-xs mb-1">
            🏯
          </div>
        )}

        <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-transparent mb-2" />

        {/* ── Tầng 2: Tên Trang Xếp Dọc ── */}
        <div
          style={{ fontFamily: "'UTM Niagara', sans-serif" }}
          className="flex flex-col items-center text-[#F2C14E] text-base font-bold tracking-wider leading-tight uppercase select-none drop-shadow-[0_0_6px_rgba(242,193,78,0.4)] my-1 max-w-[60px] text-center"
        >
          {titleWords.map((word, idx) => (
            <span key={idx} className="block leading-snug py-0.5">
              {word}
            </span>
          ))}
        </div>

        <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-transparent my-2" />

        {/* ── Tầng 3: Nút Lên Đầu Trang ── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-8 h-8 rounded-full bg-[#e8dbb8] text-[#2c1c11] border-2 border-[#b8a679] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_8px_rgba(255,222,89,0.25)] hover:scale-110 hover:bg-[#F2C14E] hover:border-[#F2C14E] transition-all duration-300 my-1 cursor-pointer flex-shrink-0"
          title="Về đầu trang"
          type="button"
        >
          <ChevronUp className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-transparent my-2" />

        {/* ── Tầng 4: Các Nút Chấm Section & Đường Kẻ Nối ── */}
        <div className="relative flex flex-col items-center py-1">
          {/* Đường kẻ nối dọc mảnh chạy xuyên qua tâm các chấm */}
          <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#F2C14E]/40 to-transparent pointer-events-none" />

          {sections.map((item) => {
            const isActive = activeId === item.id;
            const tooltipOffset =
              position === "right" ? "translate-x-2" : "-translate-x-2";

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScrollToSection(item.id)}
                className="group relative flex items-center justify-center p-2 focus:outline-none cursor-pointer z-10"
                aria-label={item.label}
              >
                {/* Chấm tròn */}
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-3.5 h-3.5 bg-[#F2C14E] shadow-[0_0_12px_#F2C14E] scale-110 ring-2 ring-[#F2C14E]/50"
                      : "w-2 h-2 bg-[#8c6d53]/70 group-hover:bg-[#F2C14E] group-hover:scale-125"
                  }`}
                />

                {/* Thẻ tên Section (Tooltip Badge) */}
                <span
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className={`absolute ${
                    position === "right"
                      ? "right-full mr-3 origin-right"
                      : "left-full ml-3 origin-left"
                  } px-3 py-1 rounded-md bg-[#21140b]/95 border border-[#F2C14E]/50 text-base sm:text-lg whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none transition-all duration-300 transform ${
                    isActive
                      ? "opacity-100 translate-x-0 text-[#F2C14E] drop-shadow-[0_0_6px_rgba(242,193,78,0.4)]"
                      : `opacity-0 ${tooltipOffset} text-[#c9b896] group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#F2C14E]`
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default VerticalAnchorNav;
