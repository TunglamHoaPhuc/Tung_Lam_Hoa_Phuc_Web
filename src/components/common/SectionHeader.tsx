'use client';

import React, { FC, ReactNode } from "react";
import { Sparkles } from "lucide-react";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  iconUrl?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Standardized SectionHeader Component across Home and detail pages.
 * - Tier 1: Icon (iconUrl or ReactNode icon, defaulting to glowing Sparkles)
 * - Tier 2: Title in 'UTM Niagara' font with textShadow glow + 2 flanking 1px gradient lines
 * - Tier 3: Subtitle in 'UTM Avo' font with 0.22em letter spacing
 */
export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  iconUrl,
  icon = <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />,
  className = "",
}) => {
  return (
    <div className={`relative z-10 flex flex-col items-center justify-center text-center mb-10 md:mb-14 ${className}`}>
      {/* Tầng 1: Icon */}
      <div className="mb-2 flex items-center justify-center">
        {iconUrl ? (
          <img src={iconUrl} alt={title || "Section Icon"} className="w-6 h-6 object-contain" />
        ) : (
          icon
        )}
      </div>

      {/* Tầng 2: Tiêu đề chính + Gradient Lines */}
      <div className="relative w-full flex items-center justify-between gap-3 md:gap-6 max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />

        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-normal uppercase text-[#F2C14E] shrink-0 text-center leading-none px-2 md:px-4"
          style={{
            fontFamily: "'UTM Niagara', 'Playfair Display', serif",
            textShadow: "0 0 32px rgba(242,193,78,0.7), 0 0 64px rgba(242,193,78,0.4)",
          }}
        >
          {title}
        </h2>

        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
      </div>

      {/* Tầng 3: Sub-tiêu đề */}
      {subtitle && (
        <p
          className="text-xs md:text-sm tracking-[0.22em] text-amber-100/80 uppercase text-center mt-3 max-w-3xl px-4"
          style={{
            fontFamily: "'UTM Avo', sans-serif",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
