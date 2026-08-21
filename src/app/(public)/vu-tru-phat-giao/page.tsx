'use client';

import { useState } from 'react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { InteractiveMap2D } from '@/features/universe/components/InteractiveMap2D';
import { UniverseGridMode } from '@/features/universe/components/UniverseGridMode';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function VuTruPhatGiaoPage() {
  const [viewMode, setViewMode] = useState<'grid' | '2d'>('grid');

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          CHẾ ĐỘ 1: VIEWMODE === '2d' (CHỈ KHI NHẤP NÚT SƠ ĐỒ 2D)
          TOÀN MÀN HÌNH KHÔNG HEADER - KHÔNG FOOTER - CÓ NÚT QUAY LẠI DẠNG LƯỚI
      ════════════════════════════════════════════════════════════════════════ */}
      {viewMode === '2d' ? (
        <main className="w-screen h-screen overflow-hidden fixed inset-0 z-50 bg-[#1C130D] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
          <InteractiveMap2D onExit2DMode={() => setViewMode('grid')} />
        </main>
      ) : (
        /* ════════════════════════════════════════════════════════════════════════
            CHẾ ĐỘ 2: VIEWMODE === 'grid' (MẶC ĐỊNH HIỂN THỊ DẠNG LƯỚI CÁC KHU VỰC)
        ════════════════════════════════════════════════════════════════════════ */
        <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black flex flex-col">
          {/* Header Title Centered */}
          <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-28 pb-10">
            {/* Ảnh nền đằng sau mờ phủ gradient & giảm opacity nhẹ */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-35 blur-[2.5px] pointer-events-none scale-105"
              style={{
                backgroundImage: "url('/images/toan-canh-chua.jpg')",
              }}
            />
            {/* Hiệu ứng gradient mờ mềm mại hòa vào nền nâu */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/45 via-[#2A1D14]/75 to-[#2A1D14] pointer-events-none" />

            <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#3a2718] border border-[#f2cc8f]/40 flex items-center justify-center text-[#ffde59] mb-2 shadow-md">
                <span className="text-xl">☸</span>
              </div>

              <div className="flex items-center justify-center w-full my-4 gap-4 md:gap-8">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
                <h1
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className="text-5xl sm:text-6xl md:text-7xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] whitespace-nowrap flex-shrink-0"
                >
                  VŨ TRỤ PHẬT GIÁO
                </h1>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
              </div>

              <p
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance text-center"
              >
                Sơ đồ không gian kiến&nbsp;trúc &amp; Hệ&nbsp;thống tự&nbsp;viện Tùng&nbsp;Lâm&nbsp;Hòa&nbsp;Phúc.
              </p>
            </div>
          </div>

          <main className="max-w-[1280px] mx-auto px-4 md:px-10 pb-16 w-full flex-1">
            <UniverseGridMode viewMode={viewMode} onToggleViewMode={setViewMode} />

            {/* Smart Search AI Bar */}
            <div className="mt-16">
              <SmartSearchAIBar contextTitle="Khung Cảnh &amp; Bảo Tượng Vũ Trụ Phật Giáo" />
            </div>
          </main>
        </div>
      )}
    </>
  );
}
