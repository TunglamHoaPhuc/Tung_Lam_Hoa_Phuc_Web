import React from 'react';
import Link from 'next/link';
import Header from '@/components/public/layout/Header';
import { Footer } from '@/components/public/layout/Footer';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { Home, Compass, Landmark, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1C130D] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black flex flex-col justify-between">
      <Header scrolled={true} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 pt-28 pb-16 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F2C14E]/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(28,19,13,0.8)_100%)]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Dharmachakra Symbol */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#2C1C11] border-2 border-[#F2C14E]/60 flex items-center justify-center text-[#F2C14E] mb-6 shadow-[0_0_40px_rgba(242,193,78,0.35)] animate-pulse">
            <span className="text-4xl md:text-5xl">☸</span>
          </div>

          {/* 404 Number */}
          <span
            className="text-7xl sm:text-8xl md:text-9xl font-normal text-[#F2C14E] tracking-widest block leading-none drop-shadow-[0_0_30px_rgba(242,193,78,0.5)]"
            style={{ fontFamily: "'UTM Niagara', serif" }}
          >
            404
          </span>

          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#FFE5A3] uppercase tracking-wider mt-2 mb-4"
            style={{ fontFamily: "'UTM Niagara', serif" }}
          >
            TRANG KHÔNG TỒN TẠI HOẶC ĐÃ ĐƯỢC CHUYỂN DỜI
          </h1>

          {/* Subtitle */}
          <p
            className="text-xs sm:text-sm md:text-base text-[#e3d2c1]/80 max-w-xl mx-auto leading-relaxed mb-8"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            A Di Đà Phật! Đường dẫn Quý Phật tử vừa truy cập không tìm thấy nội dung. Kính mời Quý vị quay trở lại trang chủ hoặc chọn các không gian tâm linh bên dưới.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
            <Link
              href="/"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1A120B] shadow-[0_0_20px_rgba(242,193,78,0.4)] hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <Home className="w-4 h-4" />
              <span>VỀ TRANG CHỦ</span>
            </Link>

            <Link
              href="/vu-tru-phat-giao"
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 bg-[#2C1C11] border border-[#F2C14E]/60 text-[#FFE5A3] hover:bg-[#F2C14E]/15 hover:border-[#F2C14E] transition-all duration-300 shadow-md"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <Compass className="w-4 h-4 text-[#F2C14E]" />
              <span>VŨ TRỤ PHẬT GIÁO</span>
            </Link>

            <Link
              href="/bao-tuong-phat-giao"
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 bg-[#2C1C11] border border-[#F2C14E]/60 text-[#FFE5A3] hover:bg-[#F2C14E]/15 hover:border-[#F2C14E] transition-all duration-300 shadow-md"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <Landmark className="w-4 h-4 text-[#F2C14E]" />
              <span>BẢO TƯỢNG PHẬT GIÁO</span>
            </Link>

            <Link
              href="/tong-chi-tu-hoc"
              className="px-5 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 bg-[#2C1C11] border border-[#F2C14E]/60 text-[#FFE5A3] hover:bg-[#F2C14E]/15 hover:border-[#F2C14E] transition-all duration-300 shadow-md"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <BookOpen className="w-4 h-4 text-[#F2C14E]" />
              <span>TÔNG CHỈ TU HỌC</span>
            </Link>
          </div>

          {/* Integrated AI Search Bar */}
          <div className="w-full mt-4">
            <SmartSearchAIBar contextTitle="Tìm kiếm nội dung tại Tùng Lâm Hòa Phúc" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
