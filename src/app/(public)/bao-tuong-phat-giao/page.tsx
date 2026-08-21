'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { STATUE_ASSEMBLIES, STATUE_LIST, StatueItem } from '@/data/statue-data';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { CustomDropdown } from '@/components/common/CustomDropdown';

function toSentenceCase(str?: string): string {
  if (!str) return '';
  if (/[a-z]/.test(str)) return str;
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatAreaTitleCase(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizeStr(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[-_\s]/g, '');
}

export default function BaoTuongPhatGiaoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssembly, setSelectedAssembly] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique areas with title case format
  const areaOptions = useMemo(() => {
    const set = new Set<string>();
    STATUE_LIST.forEach((s) => {
      if (s.areaName) set.add(s.areaName);
    });
    return [
      { id: 'all', name: 'Tất cả' },
      ...Array.from(set).map((a) => ({ id: a, name: formatAreaTitleCase(a) })),
    ];
  }, []);

  const assemblyOptions = useMemo(() => {
    return [
      { id: 'all', name: 'Tất cả' },
      ...STATUE_ASSEMBLIES.filter((a) => a.id !== 'all').map((a) => ({ id: a.id, name: a.name })),
    ];
  }, []);

  // Filter statues
  const filteredStatues = useMemo(() => {
    return STATUE_LIST.filter((st) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = st.name.toLowerCase().includes(q);
        const matchesSub = st.subtitle?.toLowerCase().includes(q);
        const matchesArea = st.areaName?.toLowerCase().includes(q);
        const matchesCluster = (st.group || st.clusterName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesArea && !matchesCluster) return false;
      }
      if (selectedAssembly !== 'all') {
        const stAsm = normalizeStr(st.assemblyId || st.assembly || st.assemblyName);
        const selAsm = normalizeStr(selectedAssembly);
        if (stAsm !== selAsm && !stAsm.includes(selAsm) && !selAsm.includes(stAsm)) {
          return false;
        }
      }
      if (selectedArea !== 'all' && st.areaName !== selectedArea) return false;
      return true;
    });
  }, [searchQuery, selectedAssembly, selectedArea]);

  // Active assemblies to display
  const activeAssemblies = useMemo(() => {
    if (selectedAssembly !== 'all') {
      return STATUE_ASSEMBLIES.filter((asm) => normalizeStr(asm.id) === normalizeStr(selectedAssembly));
    }
    return STATUE_ASSEMBLIES.filter((asm) => asm.id !== 'all');
  }, [selectedAssembly]);

  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      {/* ── 1. HERO BANNER VỚI GRADIENT BLUR NỐI DÀI ĐẾN SMART FILTER ── */}
      <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-24 pb-8 md:pt-28 md:pb-10">
        {/* Ảnh nền đằng sau mờ phủ gradient & giảm opacity nhẹ */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-35 blur-[2.5px] pointer-events-none scale-105"
          style={{
            backgroundImage: "url('/images/toan-canh-chua.jpg')",
          }}
        />
        {/* Hiệu ứng gradient mờ mềm mại hòa vào nền nâu kéo dài đến bộ lọc */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/45 via-[#2A1D14]/75 to-[#2A1D14] pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#3a2718] border border-[#f2cc8f]/40 flex items-center justify-center text-[#ffde59] mb-2 shadow-md">
            <span className="text-xl">☸</span>
          </div>

          {/* Tiêu đề chính với 2 đường kẻ tim */}
          <div className="flex items-center justify-center w-full my-3 gap-4 md:gap-8">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
            <h1
              style={{ fontFamily: "'UTM Niagara', sans-serif" }}
              className="text-5xl sm:text-6xl md:text-7xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] whitespace-nowrap flex-shrink-0"
            >
              BẢO TƯỢNG PHẬT GIÁO
            </h1>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
          </div>

          {/* Subtitle */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance text-center"
          >
            Hệ thống tượng&nbsp;pháp dát&nbsp;vàng, sơn&nbsp;son thếp&nbsp;vàng tôn&nbsp;thờ tại Tùng&nbsp;Lâm&nbsp;Hòa&nbsp;Phúc.
          </p>
        </div>
      </div>

      {/* ── 2. THANH BỘ LỌC TỐI GIẢN & TINH TẾ (BỎ ĐƯỜNG KẺ DƯỚI, DROPDOWN GRADIENT & HOVER NÂU VÀNG) ── */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10 pb-2">
          
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Nhãn LỰA CHỌN nhẹ nhàng thanh lịch */}
            <span
              className="text-[11px] font-bold uppercase tracking-widest text-[#F2C14E]/80 shrink-0 select-none mr-0.5"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              LỰA CHỌN:
            </span>

            {/* Search Box Tinh Gọn */}
            <div className="relative flex-1 min-w-[170px] max-w-xs group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]/60 group-hover:text-[#F2C14E] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên bảo tượng..."
                className="w-full pl-9 pr-3 py-1.5 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 border border-[#F2C14E]/35 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] hover:border-[#F2C14E]/70 transition-all shadow-inner"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              />
            </div>

            {/* Vạch phân định nhẹ mờ */}
            <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

            {/* Dropdown 1: Chúng Hội (Custom Gradient & Warm Hover) */}
            <CustomDropdown
              labelPrefix="Hội chúng"
              value={selectedAssembly}
              options={assemblyOptions}
              onChange={setSelectedAssembly}
              placeholder="Tất cả"
            />

            {/* Vạch phân định nhẹ mờ */}
            <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

            {/* Dropdown 2: Khu Vực Tôn Thờ (Custom Gradient & Warm Hover) */}
            <CustomDropdown
              labelPrefix="Khu vực"
              value={selectedArea}
              options={areaOptions}
              onChange={setSelectedArea}
              placeholder="Tất cả"
            />
          </div>

          {/* Count Badge Tinh Gọn */}
          <div className="text-xs text-[#F2C14E] font-bold shrink-0 px-3 py-1.5 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 rounded-xl border border-[#F2C14E]/35 shadow-sm" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            {filteredStatues.length} Bảo tượng
          </div>
        </div>

        {/* ── 3. KHUNG DANH MỤC BẢO TƯỢNG (PHÂN LOẠI THEO CHÚNG HỘI) ── */}
        <div className="relative mb-12">
          <div
            className={`relative transition-all duration-500 overflow-hidden ${
              !isExpanded && filteredStatues.length > 8 ? 'max-h-[950px] md:max-h-[1050px]' : 'max-h-[25000px] pb-8'
            }`}
          >
            {/* Nếu đang tìm kiếm cụ thể hoặc lọc theo 1 Khu vực -> Hiển thị dạng lưới trực tiếp */}
            {searchQuery.trim() || selectedArea !== 'all' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-2xl md:text-3xl font-normal uppercase tracking-widest text-[#F2C14E]"
                    style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif" }}
                  >
                    {selectedAssembly !== 'all' ? (STATUE_ASSEMBLIES.find(a => a.id === selectedAssembly)?.name || 'KẾT QUẢ TÌM KIẾM') : (selectedArea !== 'all' ? `KHU VỰC: ${formatAreaTitleCase(selectedArea)}` : 'KẾT QUẢ TÌM KIẾM')}
                  </h2>
                  <span className="text-xs text-[#FFE5A3]/70 font-bold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {filteredStatues.length} Tôn tượng
                  </span>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-[#F2C14E] via-[#F2C14E]/40 to-transparent" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredStatues.map((statue) => (
                    <StatueItemCard key={statue.id} statue={statue} />
                  ))}
                </div>
              </div>
            ) : (
              /* Hiển thị theo từng Chúng Hội */
              <div className="space-y-16">
                {activeAssemblies.map((asm) => {
                  const statuesInAsm = filteredStatues.filter((s) => {
                    const stAsm = normalizeStr(s.assemblyId || s.assembly || s.assemblyName);
                    const curAsm = normalizeStr(asm.id || asm.name);
                    return stAsm === curAsm || stAsm.includes(curAsm) || curAsm.includes(stAsm);
                  });
                  if (statuesInAsm.length === 0) return null;

                  return (
                    <div key={asm.id} className="space-y-6">
                      {/* Assembly Header (UTM Classic Antiqua đồng bộ Bản đồ danh tăng) */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#F2C14E]/40">
                        <h2
                          className="text-2xl md:text-3xl font-normal uppercase tracking-widest text-[#F2C14E]"
                          style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif" }}
                        >
                          {asm.name}
                        </h2>
                        <span className="text-xs text-[#FFE5A3] font-bold px-3 py-1 rounded-full bg-[#1C130D] border border-[#F2C14E]/40 shadow-sm" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                          {statuesInAsm.length} Tôn tượng
                        </span>
                      </div>

                      {/* Grid các thẻ tôn tượng */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {statuesInAsm.map((st) => (
                          <StatueItemCard key={st.id} statue={st} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredStatues.length === 0 && (
              <div className="text-center py-20 text-[#c9b896]/70" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                Không tìm thấy bảo tượng nào phù hợp với bộ lọc hiện tại.
              </div>
            )}

            {/* Gradient Mask Overlay when Collapsed */}
            {!isExpanded && filteredStatues.length > 8 && (
              <div className="absolute bottom-0 inset-x-0 h-48 md:h-64 bg-gradient-to-t from-[#2A1D14] via-[#2A1D14]/85 to-transparent pointer-events-none z-10" />
            )}
          </div>

          {/* Nút Xem Tất Cả */}
          {!isExpanded && filteredStatues.length > 8 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center px-4">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="px-8 py-3 md:px-10 md:py-3.5 bg-[#6B4B2A] hover:bg-[#8B6439] border border-[#F2C14E] text-[#F2C14E] hover:text-[#FFE5A3] font-bold text-sm md:text-base rounded-xl transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.7)] flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <span>XEM TẤT CẢ {filteredStatues.length} BẢO TƯỢNG PHẬT GIÁO</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ── 4. KHUNG TRỢ LÝ AI PHẬT HỌC ── */}
        <div className="mt-12 mb-12">
          <SmartSearchAIBar contextTitle="Bảo Tượng Phật Giáo Tùng Lâm Hòa Phúc" />
        </div>
      </main>
    </div>
  );
}

// ── Item Card Component Đồng Bộ Tam Bảo Chuẩn Tỷ Lệ & Hover ──
function StatueItemCard({ statue }: { statue: StatueItem }) {
  const displayArea = statue.areaName ? formatAreaTitleCase(statue.areaName) : 'Tùng Lâm Hòa Phúc';

  return (
    <Link
      href={`/bao-tuong/${statue.slug}`}
      className="group relative w-full overflow-hidden rounded-2xl border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl h-[415px] cursor-pointer flex flex-col justify-between block transform-gpu will-change-transform"
    >
      {/* 1. KHUNG ẢNH THUMBNAIL (Focus [center 28%] rõ mặt tượng) */}
      <div className="relative w-full h-[330px] overflow-hidden bg-[#1A120B] shrink-0">
        <img
          src={statue.imgUrl}
          alt={statue.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-700 transform-gpu"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(37,23,14,0.95) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* 2. CỤM CHÚ THÍCH KÈM BADGE NỔI HOVER */}
      <div className="absolute inset-x-0 bottom-0 z-20 transition-transform duration-500 ease-out translate-y-[28px] group-hover:translate-y-0 transform-gpu">
        {/* ĐƯỜNG KẺ GRADIENT VÀNG 1PX */}
        <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent z-30 opacity-90 shadow-[0_0_8px_rgba(242,193,78,0.5)]" />

        {/* KHUNG CHÚ THÍCH */}
        <div className="relative w-full bg-gradient-to-b from-[#25170E] to-[#1C130D] px-3 pt-5 pb-3.5 text-center flex flex-col items-center justify-start">
          {/* LOGO BADGE CĂN GIỮA */}
          <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#F2C14E] bg-[#25170E] flex items-center justify-center p-1 shadow-[0_0_18px_rgba(242,193,78,0.75)] overflow-hidden">
            <img
              src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
              alt="Logo Bảo tượng"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.95)] scale-145 sm:scale-150 transform-gpu"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
              }}
            />
          </div>

          {/* TIÊU ĐỀ & KHU VỰC */}
          <div className="w-full flex flex-col items-center mt-1.5 shrink-0">
            <h3
              className="text-[#F2C14E] text-2xl md:text-3xl font-normal tracking-wide uppercase group-hover:text-white transition-colors mb-0.5"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              {statue.name}
            </h3>

            <p
              className="text-[#FFE5A3]/90 text-xs font-bold line-clamp-1"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {statue.subtitle ? toSentenceCase(statue.subtitle) : displayArea}
            </p>
          </div>

          {/* NÚT KHÁM PHÁ ON HOVER */}
          <div className="w-full mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-center shrink-0">
            <span
              className="inline-flex items-center justify-center gap-1.5 px-5 py-1 rounded-full bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-xs uppercase shadow-md hover:brightness-110 transition-all cursor-pointer"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <span>XEM CHI TIẾT</span>
              <span>➔</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
