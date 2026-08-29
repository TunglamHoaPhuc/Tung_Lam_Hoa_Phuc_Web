'use client';

import { WisdomArchiveSection } from '@/features/wisdom/components/WisdomArchiveSection';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function TriTuePhatPhapPage() {
  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      {/* ── HERO BANNER TOP CHUẨN ĐỒNG BỘ DÒNG CHẢY HOẰNG PHÁP ── */}
      <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-24 pb-8 md:pt-28 md:pb-10">
        {/* Ảnh nền đằng sau mờ phủ gradient & giảm opacity nhẹ */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-35 blur-[2.5px] pointer-events-none scale-105"
          style={{
            backgroundImage: "url('/images/toan-canh-chua.jpg')",
          }}
        />
        {/* Hiệu ứng mờ mềm mại hòa vào nền nâu */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/45 via-[#2A1D14]/75 to-[#2A1D14] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#3a2718] border border-[#f2cc8f]/40 flex items-center justify-center text-[#ffde59] mb-2 shadow-md">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="9" />
              <line x1="12" y1="15" x2="12" y2="22" />
              <line x1="2" y1="12" x2="9" y2="12" />
              <line x1="15" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="9.88" y2="9.88" />
              <line x1="14.12" y1="14.12" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="9.88" y2="14.12" />
              <line x1="14.12" y1="9.88" x2="19.07" y2="4.93" />
            </svg>
          </div>

          {/* 1. KHUNG FLEXBOX CĂN ĐƯỜNG KẺ HAI BÊN ĐÂM TỪ TIM TIÊU ĐỀ */}
          <div className="flex items-center justify-center w-full my-3 gap-4 md:gap-8">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
            <h1
              style={{ fontFamily: "'UTM Niagara', sans-serif" }}
              className="text-5xl sm:text-6xl md:text-7xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] whitespace-nowrap flex-shrink-0"
            >
              TRÍ TUỆ PHẬT PHÁP
            </h1>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
          </div>

          {/* 2. Subtitle: UTM Avo, Sentence case, Text-balance */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance text-center"
          >
            Tổng hợp bài&nbsp;viết, câu&nbsp;chuyện, pháp&nbsp;âm &amp; video lưu&nbsp;thông pháp&nbsp;bảo của Tùng&nbsp;Lâm&nbsp;Hòa&nbsp;Phúc.
          </p>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
        <WisdomArchiveSection />

        {/* Smart Search AI Bar */}
        <div className="mt-16 mb-12">
          <SmartSearchAIBar contextTitle="Kho Tàng Trí Tuệ Phật Pháp" />
        </div>
      </main>
    </div>
  );
}
