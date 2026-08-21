'use client';

import React, { FC } from 'react';
import { TIMELINE_ERAS } from '@/data/heritageGalleryData';
import { Clock, Sparkles } from 'lucide-react';

interface GoldenTimelineBarProps {
  activeEra: string;
  onSelectEra: (eraId: string) => void;
  className?: string;
}

export const GoldenTimelineBar: FC<GoldenTimelineBarProps> = ({
  activeEra,
  onSelectEra,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full bg-[#1A110B]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#F2C14E]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center overflow-x-auto no-scrollbar gap-2 ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[#F2C14E] font-bold text-xs uppercase tracking-widest pl-1 pr-2 flex-shrink-0 border-r border-[#F2C14E]/20">
        <Clock className="w-3.5 h-3.5" />
        <span className="hidden sm:inline" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
          NIÊN ĐẠI
        </span>
      </div>

      {/* ── Timeline Track & Bullets ── */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-max">
        {TIMELINE_ERAS.map((era, index) => {
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => onSelectEra(era.id)}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-300 cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1A110B] font-bold shadow-[0_0_15px_rgba(242,193,78,0.6)] scale-105'
                  : 'bg-[#2A1D14]/80 text-[#D2B48C] hover:bg-[#3D2B1F] hover:text-[#FFE5A3] border border-[#F2C14E]/20'
              }`}
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {/* Bullet Node */}
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive ? 'bg-[#1A110B] shadow-[0_0_6px_#1A110B]' : 'bg-[#F2C14E]/60 group-hover:bg-[#F2C14E]'
                }`}
              />

              <span className="font-bold tracking-wider">{era.yearStr}</span>

              {/* Sub-label for large screens */}
              {isActive && (
                <span className="hidden lg:inline text-[10px] opacity-85 font-medium border-l border-[#1A110B]/30 pl-1.5">
                  {era.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
