'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Filter, ChevronLeft, ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { STATUE_ASSEMBLIES, STATUE_LIST, OFFICIAL_NTPG_LIST, StatueItem } from '@/data/statue-data';
import { ArtisticStatueSection } from '@/features/universe/components/ArtisticStatueSection';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function BaoTuongPhatGiaoPage() {
  const [selectedAssembly, setSelectedAssembly] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter assemblies
  const activeAssemblies = STATUE_ASSEMBLIES.filter((asm) => {
    if (asm.id === 'all') return false;
    if (selectedAssembly !== 'all' && asm.id !== selectedAssembly) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      <Header scrolled={true} />

      {/* ── 1. HERO BANNER CHUẨN ĐỒNG BỘ DÒNG CHẢY HOẰNG PHÁP ── */}
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
              BẢO TƯỢNG PHẬT GIÁO
            </h1>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
          </div>

          {/* 2. Subtitle: UTM Avo, Sentence case, Text-balance */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance text-center"
          >
            Hệ thống tượng&nbsp;pháp dát&nbsp;vàng, sơn&nbsp;son thếp&nbsp;vàng tôn&nbsp;thờ tại Tùng&nbsp;Lâm&nbsp;Hòa&nbsp;Phúc.
          </p>
        </div>
      </div>

      {/* ── 2. THANH BỘ LỌC TAXONOMIES "LỰA CHỌN" (FILTER BAR) ── */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b" style={{ borderColor: 'rgba(242,193,78,0.2)' }}>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#F2C14E]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F2C14E]" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: 'bold' }}>
              LỰA CHỌN CHÚNG HỘI:
            </span>
          </div>

          <select
            value={selectedAssembly}
            onChange={(e) => setSelectedAssembly(e.target.value)}
            className="py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #4A3728 0%, #3D2B1F 100%)',
              border: '1.5px solid #F2C14E',
              color: '#F2C14E',
              fontFamily: "'UTM Avo', sans-serif",
              fontWeight: 'bold',
            }}
          >
            {STATUE_ASSEMBLIES.map((asm) => (
              <option key={asm.id} value={asm.id} className="bg-[#2A1D14] text-[#e3d2c1]">
                {asm.name}
              </option>
            ))}
          </select>
        </div>

        {/* ── 3. KHUNG DANH MỤC PHÂN LOẠI CHÚNG HỘI VỚI DẢI MỜ & NÚT XEM TẤT CẢ NỔI ── */}
        <div className="relative mb-12">
          {/* Khung bọc danh sách Tượng Pháp có max-h chứa 6 bài (2 hàng x 3 cột) khi chưa bấm mở rộng */}
          <div
            className={`relative transition-all duration-500 overflow-hidden ${
              !isExpanded ? 'max-h-[850px] md:max-h-[880px]' : 'max-h-[10000px] pb-8'
            }`}
          >
            <div className="space-y-16">
              {activeAssemblies.map((asm) => {
                const statuesInAsm = STATUE_LIST.filter((s) => s.assemblyId === asm.id || selectedAssembly === 'all');
                if (statuesInAsm.length === 0) return null;

                return (
                  <div key={asm.id} className="space-y-6">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="/images/bieu-tuong-tuong-phap.png"
                          alt="Biểu tượng Bảo tượng"
                          className="w-7 h-7 object-contain filter drop-shadow-[0_0_8px_rgba(242,193,78,0.6)]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
                          }}
                        />
                        <h2
                          className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#F2C14E]"
                          style={{ fontFamily: "'UTM Niagara', 'Playfair Display', serif" }}
                        >
                          {asm.name}
                        </h2>
                      </div>
                    </div>

                    <div className="h-px w-full" style={{ background: 'linear-gradient(to right, #F2C14E, transparent)' }} />

                    {/* Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {statuesInAsm.map((st) => (
                        <Link
                          key={st.id}
                          href={`/bao-tuong-phat-giao/${st.slug}`}
                          className="group relative w-full overflow-hidden rounded-xl border border-[#F2C14E]/20 bg-[#2C1C11] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F2C14E] shadow-xl hover:shadow-2xl flex flex-col h-full"
                        >
                          {/* Thumbnail with Badge Logo overlay */}
                          <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#1A120B] shrink-0">
                            <img
                              src={st.imgUrl}
                              alt={st.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: 'linear-gradient(to top, rgba(44,28,17,0.92) 0%, transparent 60%)',
                              }}
                            />
                          </div>

                          {/* Seam line and badge logo */}
                          <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-transparent z-10 shrink-0">
                            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-[#F2C14E] bg-[#2C1C11] flex items-center justify-center p-1.5 shadow-[0_0_12px_rgba(242,193,78,0.5)]">
                              <img
                                src="/images/bieu-tuong-tuong-phap.png"
                                alt="Biểu tượng Bảo tượng"
                                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.8)]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
                                }}
                              />
                            </div>
                          </div>

                          {/* Content Card */}
                          <div className="p-4 md:p-6 pt-6 md:pt-8 flex flex-col gap-2 bg-[#2C1C11] flex-1 justify-between text-center items-center">
                            <div>
                              <h3
                                className="font-bold text-xl md:text-2xl text-[#F2C14E] group-hover:text-white transition-colors mb-1"
                                style={{
                                  fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                                  textShadow: '0 0 16px rgba(242,193,78,0.4)',
                                }}
                              >
                                {st.name}
                              </h3>

                              <p
                                className="text-xs text-[#c9b896] uppercase tracking-wider"
                                style={{
                                  fontFamily: "'UTM ClassizismAntiqua', 'Playfair Display', serif",
                                }}
                              >
                                {st.areaName}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lớp dải mờ Gradient Mask Overlay ở chân hàng Card thứ 2 (khi chưa mở rộng) */}
            {!isExpanded && (
              <div className="absolute bottom-0 inset-x-0 h-48 md:h-64 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/85 to-transparent pointer-events-none z-10" />
            )}
          </div>

          {/* Nút Xem Tất Cả Tượng Pháp nổi chính giữa dải mờ (Giống 100% Dòng Chảy Hoằng Pháp) */}
          {!isExpanded && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center px-4">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="px-8 py-3 md:px-10 md:py-3.5 bg-[#6B4B2A] hover:bg-[#8B6439] border border-[#F2C14E] text-[#F2C14E] hover:text-[#FFE5A3] font-bold text-sm md:text-base rounded-xl transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.7)] flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <span>XEM TẤT CẢ 45 BẢO TƯỢNG PHẬT GIÁO</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ── 4. NGHỆ THUẬT PHẬT GIÁO SECTION (51 PHO TƯỢNG) ── */}
        <div className="mt-12 mb-12">
          <ArtisticStatueSection items={OFFICIAL_NTPG_LIST} />
        </div>

        {/* ── 5. KHUNG TRỢ LÝ AI PHẬT HỌC NẰM PHÍA DƯỚI KHỐI GRID ── */}
        <div className="mt-8 mb-12">
          <SmartSearchAIBar contextTitle="Bảo Tượng Phật Giáo Tùng Lâm Hòa Phúc" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
