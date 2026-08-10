'use client';

import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { WisdomArchiveSection } from '@/features/wisdom/components/WisdomArchiveSection';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function TriTuePhatPhapPage() {
  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      <Header scrolled={true} />

      {/* ── HERO BANNER TOP CHUẨN ĐỒNG BỘ DÒNG CHẢY HOẰNG PHÁP ── */}
      <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-28 pb-10">
        {/* Ảnh nền đằng sau mờ */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px] pointer-events-none"
          style={{
            backgroundImage: "url('/images/toan-canh-chua.jpg')",
          }}
        />
        {/* Hiệu ứng mờ mềm mại hòa vào nền nâu */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/40 via-[#2A1D14]/75 to-[#2A1D14] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#3a2718] border border-[#f2cc8f]/40 flex items-center justify-center text-[#ffde59] mb-2 shadow-md">
            <span className="text-xl">☸</span>
          </div>

          {/* 1. KHUNG FLEXBOX CĂN ĐƯỜNG KẺ HAI BÊN ĐÂM TỪ TIM TIÊU ĐỀ */}
          <div className="flex items-center justify-center w-full my-4 gap-4 md:gap-8">
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

      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
        <WisdomArchiveSection />

        {/* Smart Search AI Bar */}
        <div className="mt-16">
          <SmartSearchAIBar contextTitle="Kho Tàng Trí Tuệ Phật Pháp" />
        </div>
      </main>
    </div>
  );
}
