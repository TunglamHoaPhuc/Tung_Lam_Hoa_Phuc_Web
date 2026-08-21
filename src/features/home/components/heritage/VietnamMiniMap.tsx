'use client';

import React, { FC } from 'react';
import { RegionType } from '@/data/heritageGalleryData';
import { Compass, MapPin } from 'lucide-react';

interface VietnamMiniMapProps {
  activeRegion: RegionType;
  onSelectRegion: (region: RegionType) => void;
  className?: string;
}

export const VietnamMiniMap: FC<VietnamMiniMapProps> = ({
  activeRegion,
  onSelectRegion,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-3 bg-[#1A110B]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#F2C14E]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* ── Mini S-Curve SVG Map ── */}
      <div className="relative w-9 h-14 flex items-center justify-center flex-shrink-0">
        <svg
          viewBox="0 0 100 180"
          className="w-full h-full filter drop-shadow-[0_0_8px_rgba(242,193,78,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vietnam S-Shape simplified vector path */}
          {/* Miền Bắc */}
          <path
            d="M 35 15 C 50 10, 80 18, 75 38 C 70 52, 50 55, 45 65 Z"
            fill={activeRegion === 'BAC' || activeRegion === 'ALL' ? '#F2C14E' : '#4A3728'}
            opacity={activeRegion === 'BAC' ? 1 : activeRegion === 'ALL' ? 0.75 : 0.4}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            onClick={() => onSelectRegion('BAC')}
          />
          {/* Miền Trung */}
          <path
            d="M 45 65 C 55 75, 68 95, 65 115 C 60 125, 45 130, 42 135 Z"
            fill={activeRegion === 'TRUNG' || activeRegion === 'ALL' ? '#E59866' : '#4A3728'}
            opacity={activeRegion === 'TRUNG' ? 1 : activeRegion === 'ALL' ? 0.75 : 0.4}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            onClick={() => onSelectRegion('TRUNG')}
          />
          {/* Miền Nam */}
          <path
            d="M 42 135 C 50 140, 65 145, 55 168 C 45 178, 25 170, 32 150 Z"
            fill={activeRegion === 'NAM' || activeRegion === 'ALL' ? '#58D68D' : '#4A3728'}
            opacity={activeRegion === 'NAM' ? 1 : activeRegion === 'ALL' ? 0.75 : 0.4}
            className="cursor-pointer transition-all duration-300 hover:opacity-100"
            onClick={() => onSelectRegion('NAM')}
          />
          {/* Hoang Sa & Truong Sa Islands Dots */}
          <circle cx="88" cy="90" r="3" fill="#F2C14E" opacity="0.8" />
          <circle cx="82" cy="140" r="3" fill="#F2C14E" opacity="0.8" />
          <circle cx="86" cy="145" r="2" fill="#F2C14E" opacity="0.8" />

          {/* Active Pulsing Indicator Pin */}
          {activeRegion === 'BAC' && (
            <circle cx="50" cy="35" r="5" fill="#FFF" className="animate-ping" />
          )}
          {activeRegion === 'TRUNG' && (
            <circle cx="55" cy="95" r="5" fill="#FFF" className="animate-ping" />
          )}
          {activeRegion === 'NAM' && (
            <circle cx="45" cy="155" r="5" fill="#FFF" className="animate-ping" />
          )}
        </svg>
      </div>

      {/* ── 4 Region Buttons ── */}
      <div className="flex items-center gap-1">
        {[
          { id: 'ALL' as RegionType, label: 'Toàn Quốc', color: 'border-[#F2C14E]/60 text-[#F2C14E]' },
          { id: 'BAC' as RegionType, label: 'Miền Bắc', color: 'border-[#F2C14E]/60 text-[#F2C14E]' },
          { id: 'TRUNG' as RegionType, label: 'Miền Trung', color: 'border-[#E59866]/60 text-[#E59866]' },
          { id: 'NAM' as RegionType, label: 'Miền Nam', color: 'border-[#58D68D]/60 text-[#58D68D]' },
        ].map((tab) => {
          const isActive = activeRegion === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectRegion(tab.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-[#F2C14E] text-[#1A110B] shadow-[0_0_12px_rgba(242,193,78,0.5)] scale-105'
                  : 'bg-[#2A1D14]/70 text-[#C4B5A5] hover:text-[#FFE5A3] hover:bg-[#3D2B1F] border border-transparent'
              }`}
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {tab.id !== 'ALL' && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
