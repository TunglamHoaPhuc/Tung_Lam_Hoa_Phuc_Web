'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MemorialSearchEngine } from '@/features/memorial/components/MemorialSearchEngine';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

function MemorialSearchContent() {
  const searchParams = useSearchParams();
  const cat = searchParams.get('cat') || 'all';

  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      {/* ── HERO BANNER TOP CHUẨN ĐỒNG BỘ ── */}
      <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-24 pb-8 md:pt-28 md:pb-10">
        {/* Background Image with blur */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-[3px] pointer-events-none scale-105"
          style={{
            backgroundImage: "url('/images/toan-canh-chua.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/50 via-[#2A1D14]/80 to-[#2A1D14] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#3a2718] border border-[#f2cc8f]/40 flex items-center justify-center text-[#ffde59] mb-2 shadow-md">
            <span className="text-xl">☸</span>
          </div>

          <div className="flex items-center justify-center w-full my-3 gap-4 md:gap-8">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
            <h1
              style={{ fontFamily: "'UTM Niagara', sans-serif" }}
              className="text-4xl sm:text-6xl md:text-7xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] whitespace-nowrap flex-shrink-0"
            >
              TRA CỨU BÀI VỊ HƯƠNG LINH
            </h1>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
          </div>

          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance text-center"
          >
            Sổ bộ lưu&nbsp;trữ chư vị Hương&nbsp;Linh, Cửu&nbsp;Huyền Thất&nbsp;Tổ an&nbsp;vị tại Vãng&nbsp;Sinh&nbsp;Đường &amp; Nhà&nbsp;Tứ&nbsp;Ân Tùng&nbsp;Lâm&nbsp;Hòa&nbsp;Phúc.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 space-y-12">
        <MemorialSearchEngine initialCategory={cat} />

        {/* Smart Search AI Bar */}
        <div className="mt-12 mb-12">
          <SmartSearchAIBar contextTitle="Tra cứu hương linh & nghi thức cầu siêu Tùng Lâm Hòa Phúc" />
        </div>
      </main>
    </div>
  );
}

export default function TraCuuBaiViPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#2A1D14] flex items-center justify-center text-[#F2C14E]">Đang tải dữ liệu bài vị...</div>}>
      <MemorialSearchContent />
    </Suspense>
  );
}
