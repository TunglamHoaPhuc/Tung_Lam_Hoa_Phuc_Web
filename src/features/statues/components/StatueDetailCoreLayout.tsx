'use client';

import { FC, useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, ArrowRight, Video, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { StatueItem, OFFICIAL_STATUE_DATASET, OFFICIAL_NTPG_LIST, STATUE_LIST } from "@/data/statue-data";
import { ThatPhatDuocSuSection } from "@/features/universe/components/ThatPhatDuocSuSection";
import { BatBoKimCangSection } from "@/features/universe/components/BatBoKimCangSection";

interface StatueDetailCoreLayoutProps {
  statue: StatueItem;
}

function formatAreaTitleCase(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const StatueDetailCoreLayout: FC<StatueDetailCoreLayoutProps> = ({ statue }) => {
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // ── PINNED VIEWPORT SCROLL PROGRESS (0.0 -> 1.0) - FAST & IMMEDIATE TRANSITION ──
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const totalDist = heroRef.current.offsetHeight - window.innerHeight;
      if (totalDist > 0) {
        const scrolled = -rect.top;
        const p = Math.min(Math.max(scrolled / totalDist, 0), 1);
        setHeroProgress(p);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent parent scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      setZoomScale(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxIndex]);

  // ── 1. TÌM CÁC TƯỢNG TRONG CÙNG CỤM TƯỢNG (GROUP) ──
  const clusterMembers = useMemo(() => {
    const groupName = statue.group || statue.clusterName;
    if (groupName) {
      const sameGroup = OFFICIAL_STATUE_DATASET.filter(
        (s) => (s.group === groupName || s.clusterName === groupName) && s.id !== statue.id && s.categoryType === 'TƯỢNG CHÍNH'
      );
      if (sameGroup.length > 0) {
        return sameGroup.map((s) => ({
          name: s.name,
          slug: s.slug || s.id,
          imgUrl: s.avatarUrl || s.imgUrl,
        }));
      }
    }
    if (statue.clusterMembers && statue.clusterMembers.length > 0) {
      return statue.clusterMembers;
    }
    return [
      { name: 'BỒ TÁT VĂN THÙ', slug: 'bo_tat_van_thu', imgUrl: '/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_VAN_THU/bo_tat_van_thu.JPG' },
      { name: 'BỒ TÁT PHỔ HIỀN', slug: 'bo_tat_pho_hien', imgUrl: '/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG' },
    ];
  }, [statue]);

  // ── 2. TỰ ĐỘNG LẤY TÁC PHẨM NGHỆ THUẬT PHẬT GIÁO LIÊN QUAN ĐẾN TƯỢNG CHÍNH ──
  const artisticWorks = useMemo(() => {
    const stGroup = (statue.characterGroup || statue.slug || '').toLowerCase().replace(/[-_]/g, '');
    const stCode = (statue.code || '').toUpperCase();

    let matches = OFFICIAL_NTPG_LIST.filter((item) => {
      const itemGroup = (item.characterGroup || item.slug || '').toLowerCase().replace(/[-_]/g, '');
      const itemParent = ((item as any).parentId || '').toUpperCase();
      if (itemGroup && stGroup && (itemGroup.includes(stGroup) || stGroup.includes(itemGroup))) return true;
      if (itemParent && stCode && itemParent === stCode) return true;
      if (item.name?.toLowerCase().includes(statue.name?.toLowerCase().slice(0, 10))) return true;
      return false;
    });

    if (matches.length < 3) {
      const general = OFFICIAL_NTPG_LIST.slice(0, 6);
      matches = Array.from(new Set([...matches, ...general]));
    }

    return matches.map((m, idx) => ({
      id: m.id || `ntpg-${idx}`,
      title: m.title || m.name || statue.name || 'TÁC PHẨM NGHỆ THUẬT PHẬT GIÁO',
      subtitle: m.subtitle || m.caption || 'Đản Sinh cưỡi tòa Cửu Long',
      imgUrl: m.imgUrl || statue.imgUrl,
      areaName: formatAreaTitleCase(m.areaName || m.location || 'Tam Bảo'),
      meaning: m.description || m.quote || (m as any).meaning || 'Bảo vật di sản văn hóa tâm linh Phật giáo truyền thống.',
    }));
  }, [statue]);

  // ── 3. BẢO TƯỢNG LIÊN QUAN Ở CHÂN TRANG (ĐÚNG 2 BẢO TƯỢNG) ──
  const relatedStatues = useMemo(() => {
    const sameAssembly = STATUE_LIST.filter(
      (s) => s.id !== statue.id && (s.assemblyId === statue.assemblyId || s.assembly === statue.assembly)
    ).slice(0, 2);

    if (sameAssembly.length >= 2) return sameAssembly;
    return STATUE_LIST.filter((s) => s.id !== statue.id).slice(0, 2);
  }, [statue]);

  // Video fallback
  const videoTitle = statue.video?.title || `CUỘC ĐỜI ${statue.name || 'ĐỨC PHẬT THÍCH CA'}`;
  const videoSummary = statue.video?.summary || 'Phật có phải một đấng quyền năng, một đấng thần linh để cứu rỗi, đáp ứng những nguyện vọng, ham muốn của chúng ta hay không?';
  const videoUrl = statue.video?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  const videoThumbnail = statue.video?.thumbnailUrl || statue.imgUrl;

  const currentLightboxItem = lightboxIndex !== null ? artisticWorks[lightboxIndex] : null;

  // ── NHANH CHÓNG FADE VÀ CHUYỂN NGAY SANG NỘI DUNG TRUNG TÂM KHI CUỘN ──
  const heroOpacity = Math.max(0, 1 - heroProgress / 0.7);
  const heroTranslateY = heroProgress * 120;
  const bgOpacity = Math.max(0.2, 0.65 - heroProgress * 0.45);
  const bgScale = 1 + heroProgress * 0.08;

  // Pan & Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const delta = e.deltaY * -0.0025;
    setZoomScale((prev) => {
      const next = Math.min(Math.max(1, prev + delta), 4);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale > 1) {
      e.preventDefault();
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const clusterCount = clusterMembers.length;
  const showBackButtonInCol1 = clusterCount <= 3;

  return (
    <div className="w-full bg-[#2A1D14] text-[#e3d2c1] font-sans selection:bg-[#F2C14E] selection:text-black overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════════════
          1. PINNED HERO VIEWPORT (KHÓA 100VH, KHI CHỮ BIẾN MẤT THÌ NỘI DUNG HIỆN NGAY)
      ══════════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative w-full h-[125vh]">
        
        {/* Sticky Pinned 100vh Viewport */}
        <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#2A1D14] flex flex-col justify-end items-center text-center p-6 sm:p-12 select-none">
          
          {/* Full Viewport Background Image - Focus [center 28%] rõ hào quang và mặt tượng */}
          <div
            className="absolute inset-0 bg-cover bg-[center_28%] pointer-events-none transition-transform duration-75"
            style={{
              backgroundImage: `url('${statue.imgUrl || '/images/toan-canh-chua.jpg'}')`,
              opacity: bgOpacity,
              transform: `scale(${bgScale}) translateY(${heroProgress * 30}px)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#2A1D14]/40 to-[#2A1D14] pointer-events-none" />

          {/* Decorative Corner Anchors */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-[#F2C14E]/60 pointer-events-none hidden sm:block" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-[#F2C14E]/60 pointer-events-none hidden sm:block" />
          <div className="absolute bottom-16 left-8 w-6 h-6 border-b-2 border-l-2 border-[#F2C14E]/60 pointer-events-none hidden sm:block" />
          <div className="absolute bottom-16 right-8 w-6 h-6 border-b-2 border-r-2 border-[#F2C14E]/60 pointer-events-none hidden sm:block" />

          {/* Tên tượng & Subtitle - Cuộn xuống thì trượt nhẹ và mờ đi nhanh chóng */}
          <div
            className="relative z-10 max-w-5xl mx-auto space-y-3 px-4 mb-12 will-change-transform transition-all duration-75"
            style={{
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px)`,
              pointerEvents: heroOpacity < 0.1 ? 'none' : 'auto',
            }}
          >
            <h1
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-6xl sm:text-8xl md:text-9xl lg:text-[130px] font-normal text-[#FFE5A3] uppercase tracking-normal drop-shadow-[0_4px_30px_rgba(242,193,78,0.95)] leading-none py-1"
            >
              {statue.name || "ĐỨC PHẬT THÍCH CA MÂU NI"}
            </h1>

            {/* Dấu gạch ngang vàng phân định có chóp kim cương ◇ ở giữa */}
            <div className="w-full max-w-2xl mx-auto flex items-center justify-center my-3 md:my-4">
              <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2C14E]/80 to-[#F2C14E]" />
              <div className="w-3 h-3 border-r-2 border-b-2 border-[#F2C14E] rotate-45 -mt-1 mx-3 shrink-0 shadow-[0_0_12px_#F2C14E]" />
              <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#F2C14E]/80 to-[#F2C14E]" />
            </div>

            {/* Subtitle font UTM Classic Antiqua */}
            <p
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif" }}
              className="text-sm sm:text-lg md:text-xl tracking-[0.25em] text-[#FFE5A3] uppercase font-normal max-w-3xl mx-auto px-4 leading-relaxed text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              {statue.subtitle || "VÔ THƯỢNG NĂNG NHÂN"}
            </p>
          </div>

          {/* Scroll Indicator */}
          <div
            className="relative z-10 pb-6 flex flex-col items-center gap-1.5 text-[#FFE5A3] opacity-80 hover:opacity-100 transition-opacity"
            style={{ opacity: Math.max(0, 1 - heroProgress / 0.3) }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              CUỘN XUỐNG KHÁM PHÁ
            </span>
            <div className="flex flex-col items-center -space-y-1.5 animate-bounce">
              <ChevronDown className="w-4 h-4 text-[#F2C14E]" />
              <ChevronDown className="w-4 h-4 text-[#F2C14E]/60" />
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. KHU VỰC 3 CỘT THÔNG TIN CHÍNH (HIỆN RA NGAY KHI CHỮ HERO MỜ ĐI)
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 pt-12 pb-20 z-20">
        
        {/* 3 Columns Grid - items-stretch to guarantee 100% flush alignment top & bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ── CỘT 1 (BÊN TRÁI - CỤM TƯỢNG + NÚT QUAY LẠI CÙNG NẰM TRONG CỘT CĂN ĐỀU ĐÁY) ── */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full gap-4">
            
            {/* Card Cụm tượng */}
            <div className="rounded-2xl border border-[#F2C14E]/50 bg-gradient-to-b from-[#3A2718]/95 to-[#1C130D]/95 p-5 text-center flex-1 flex flex-col justify-between shadow-2xl">
              <div>
                {/* Header cụm tượng - UTM Niagara thường ko bold */}
                <div className="border-b border-[#F2C14E]/30 pb-3 mb-5">
                  <span
                    className="text-xs text-[#c9b896] uppercase tracking-widest block mb-1 font-semibold"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    CỤM TƯỢNG
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-normal uppercase text-[#FFE5A3] tracking-wide"
                    style={{ fontFamily: "'UTM Niagara', serif", fontWeight: "normal" }}
                  >
                    {statue.group || statue.clusterName || "HOA NGHIÊM TAM THÁNH"}
                  </h3>
                </div>

                {/* Danh sách các tượng trong cụm - Focus [center 28%] rõ mặt tượng */}
                <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#F2C14E]/40">
                  {clusterMembers.map((member, idx) => (
                    <Link
                      key={idx}
                      href={`/bao-tuong/${member.slug}`}
                      className="group relative flex flex-col items-center cursor-pointer block"
                    >
                      {/* Avatar tròn viền vàng phát sáng - object-[center_28%] */}
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-[#F2C14E] p-0.5 overflow-hidden bg-[#1C130D] shadow-[0_0_20px_rgba(242,193,78,0.5)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(242,193,78,0.9)] transition-all duration-300">
                        <img
                          src={member.imgUrl}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover object-[center_28%]"
                        />
                      </div>

                      {/* Tên tượng hiện ra fade in mềm mại bỏ viền khi hover - Font UTM Niagara */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2 text-center">
                        <span
                          className="text-xl sm:text-2xl text-[#FFE5A3] font-normal uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                          style={{ fontFamily: "'UTM Niagara', serif" }}
                        >
                          {member.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ghi chú rê chuột */}
              <div className="mt-4 pt-3 border-t border-[#F2C14E]/20 text-[10px] text-[#FFE5A3]/60 italic" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                ❖ Rê chuột vào ảnh để xem danh xưng
              </div>
            </div>

            {/* Nút Quay lại trang bảo tượng ở Cột 1 (Căn mép dưới cùng bằng phẳng với 2 cột bên cạnh) */}
            {showBackButtonInCol1 && (
              <Link
                href="/bao-tuong-phat-giao"
                className="rounded-2xl border border-[#F2C14E]/50 bg-gradient-to-b from-[#3A2718]/95 to-[#1C130D]/95 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 hover:border-[#F2C14E] hover:brightness-110 transition-all duration-300 shadow-2xl cursor-pointer group shrink-0"
              >
                {/* Logo Bảo tượng nổi lên trên */}
                <div className="w-9 h-9 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(242,193,78,0.7)] group-hover:scale-110 transition-transform">
                  <img
                    src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
                    alt="Logo Bảo tượng"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-wider text-[#FFE5A3] group-hover:text-white"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  QUAY LẠI TRANG BẢO TƯỢNG
                </span>
              </Link>
            )}
          </div>

          {/* ── CỘT 2 (CHÍNH GIỮA - QUOTE & TÓM TẮT CÓ ẢNH NỀN) ── */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full gap-4">
            
            {/* Card 1: Khối Pháp Ngữ với Avatar Thuần Viền Trắng / Vàng Phát Sáng */}
            <div className="relative rounded-2xl border border-[#F2C14E]/50 bg-gradient-to-b from-[#3A2718]/95 to-[#1C130D]/95 px-6 pt-16 pb-6 text-center shadow-2xl shrink-0">
              
              {/* Logo Avatar Nổi Đè Lên Viền Mép Trên Cùng (Focus [center 28%] rõ mặt tượng) */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 group cursor-pointer">
                <div className="relative w-24 h-24 rounded-full border-2 border-[#F2C14E] p-0.5 bg-[#2C1C11] shadow-[0_0_30px_rgba(242,193,78,0.95)] overflow-hidden flex items-center justify-center">
                  <img
                    src={statue.avatarUrl || statue.imgUrl}
                    alt={statue.name}
                    className="w-full h-full rounded-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Nội dung Quote */}
              <p
                className="text-sm sm:text-base md:text-lg leading-relaxed text-[#FFE5A3] font-normal mb-2.5 italic text-justify sm:text-center"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                &ldquo;{statue.quote || "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đã đoạn trừ mầm mống dẫn đến sinh tử luân hồi; đã đoạn trừ lậu hoặc, phiền não, nhiễm ô. Thế nên, cùng tột bờ sinh tử, cho nên gọi là Phật.”"}&rdquo;
              </p>
              
              <h4
                className="text-2xl sm:text-3xl font-normal uppercase tracking-wider text-[#FFE5A3]"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                {statue.quoteAuthor || "VÔ TRÍ - TÂM HÒA"}
              </h4>
            </div>

            {/* Card 2: Khối Lịch Sử / Tóm Tắt Chi Tiết (flex-1 để kéo đều đáy bằng 2 cột bên) */}
            <div className="group/summary flex-1 rounded-2xl border border-[#F2C14E]/50 bg-gradient-to-b from-[#3A2718]/95 to-[#1C130D]/95 p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              
              {/* Ảnh nền mờ sau khối tóm tắt */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none scale-105"
                style={{
                  backgroundImage: `url('${statue.areaImgUrl || '/images/toan-canh-chua.jpg'}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/70 via-[#2A1D14]/90 to-[#1C130D] pointer-events-none" />

              <div
                className={`relative z-10 text-xs sm:text-sm text-[#FFE5A3] leading-relaxed text-justify space-y-4 ${
                  expandedSummary ? "" : "line-clamp-6"
                }`}
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <div
                  className="
                    [&>p]:text-justify [&>p]:mb-3
                    [&>p:first-of-type::first-letter]:[font-family:'UTM_ClassizismAntiqua','UTM_ClassicAntiqua',serif]
                    [&>p:first-of-type::first-letter]:text-6xl sm:[&>p:first-of-type::first-letter]:text-7xl
                    [&>p:first-of-type::first-letter]:font-bold [&>p:first-of-type::first-letter]:text-[#FFE5A3]
                    [&>p:first-of-type::first-letter]:mr-3 [&>p:first-of-type::first-letter]:float-left
                    [&>p:first-of-type::first-letter]:leading-none
                  "
                  dangerouslySetInnerHTML={{
                    __html: statue.fullHistoryHtml || statue.description || `<p>Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya - "dòng dõi anh hùng" - lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện. Người đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết "ba tòa Cung Vui" để đi thẳng vào con đường tỉnh thức. Và từ bước chân ấy, thế gian bắt đầu học lại một điều tưởng như đã quên: không phải quyền lực làm người cao quý, mà là trí tuệ và từ bi. Một đời Ngài đi qua, như một vầng nhật nguyệt soi đường cho muôn nẻo.</p>`
                  }}
                />
              </div>

              {/* Nút XEM THÊM (Chỉ hiện rõ khi đưa chuột vào card) */}
              <div className="relative z-10 flex justify-center mt-4 pt-3 border-t border-[#F2C14E]/30 opacity-70 group-hover/summary:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={() => setExpandedSummary(!expandedSummary)}
                  className="px-8 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#5C3F28] hover:bg-[#7A5435] border border-[#F2C14E] text-[#FFE5A3] hover:text-white transition-all duration-300 shadow-md cursor-pointer flex items-center gap-1.5"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  <span>{expandedSummary ? "THU GỌN" : "XEM THÊM"}</span>
                  {expandedSummary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* ── CỘT 3 (BÊN PHẢI - CHÚNG HỘI, KHU VỰC CÓ KHOANG LOGO TO & ĐÁY BẰNG NHAU) ── */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full gap-4">
            
            {/* Card 1: Khối Chúng Hội chia 2 khoang (Khoang Logo To bên trái + Chữ căn giữa bên phải) */}
            <Link
              href={`/bao-tuong-phat-giao?assembly=${statue.assemblyId || 'all'}`}
              className="rounded-2xl border border-[#F2C14E]/50 bg-gradient-to-b from-[#3A2718]/95 to-[#1C130D]/95 p-3 flex items-center shadow-2xl hover:border-[#F2C14E] transition-all cursor-pointer group gap-3 min-h-[90px] shrink-0"
            >
              {/* Khoang Logo To bên trái */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl border border-[#F2C14E]/60 bg-[#1C130D] p-2 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#F2C14E] transition-transform shadow-inner">
                <img
                  src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
                  alt="Biểu tượng Chúng hội"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.8)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
                  }}
                />
              </div>

              {/* Tên Chúng Hội căn chính giữa ô */}
              <div className="flex-1 text-center pr-2">
                <h3
                  className="text-2xl sm:text-3xl font-normal uppercase text-[#FFE5A3] group-hover:text-white transition-colors leading-tight"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  {statue.assemblyName || statue.assembly || "CHƯ PHẬT HẢI HỘI"}
                </h3>
              </div>
            </Link>

            {/* Card 2: Khối Phối Cảnh & Vị Trí Tôn Thờ (flex-1 để kéo đều đáy với Cột 1 và Cột 2) */}
            <div className="flex-1 rounded-2xl border border-[#F2C14E]/50 bg-[#1C130D] overflow-hidden flex flex-col justify-between relative shadow-2xl">
              {/* Background Photo - focus [center 28%] */}
              <img
                src={statue.areaImgUrl || statue.avatarUrl || statue.imgUrl}
                alt={statue.areaName || "Khu Vực Tam Bảo"}
                className="absolute inset-0 w-full h-full object-cover object-[center_28%] opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C130D] via-[#1C130D]/40 to-transparent" />

              {/* Central Altar Photo Frame - Focus [center 28%] rõ hào quang và khuôn mặt */}
              <div className="relative z-10 p-4 flex items-center justify-center flex-1 min-h-[220px]">
                <div className="w-40 h-52 sm:w-44 sm:h-56 rounded-xl border border-[#F2C14E] overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.9)] bg-black/50 p-1">
                  <img
                    src={statue.imgUrl}
                    alt={statue.name}
                    className="w-full h-full object-cover object-[center_28%] rounded-lg"
                  />
                </div>
              </div>

              {/* Bottom Info Bar - Khu vực căn giữa + Khoang Logo To bên phải có hover nhẹ */}
              <Link
                href={`/vu-tru-phat-giao/${statue.areaSlug || 'tam-bao'}`}
                className="relative z-10 p-3 bg-gradient-to-r from-[#3A2718]/95 via-[#1C130D]/95 to-[#3A2718]/95 border-t border-[#F2C14E]/50 flex items-center justify-between hover:brightness-125 transition-all cursor-pointer group/area gap-3 shrink-0"
              >
                {/* Chữ Khu vực & Tên khu vực căn chính giữa */}
                <div className="flex-1 text-center pl-2">
                  <span className="text-[10px] text-[#FFE5A3]/80 uppercase block tracking-wider font-semibold" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    KHU VỰC
                  </span>
                  <span
                    className="text-2xl sm:text-3xl text-[#FFE5A3] font-normal uppercase leading-tight block mt-0.5"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    {statue.areaName || "TAM BẢO"}
                  </span>
                </div>

                {/* Khoang Logo Khu vực to có hiệu ứng hover nhẹ */}
                <div className="w-12 h-12 rounded-xl border border-[#F2C14E]/60 bg-[#1C130D] p-1.5 flex items-center justify-center text-[#F2C14E] shrink-0 group-hover/area:scale-108 group-hover/area:border-[#F2C14E] transition-all duration-300 shadow-md">
                  <img
                    src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
                    alt="Logo Khu vực"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.8)]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Nút Quay lại trang bảo tượng ở Cột 3 (nếu cụm tượng có nhiều vị) */}
            {!showBackButtonInCol1 && (
              <Link
                href="/bao-tuong-phat-giao"
                className="rounded-2xl border border-[#F2C14E]/50 bg-gradient-to-b from-[#3A2718]/95 to-[#1C130D]/95 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 hover:border-[#F2C14E] hover:brightness-110 transition-all duration-300 shadow-2xl cursor-pointer group shrink-0"
              >
                <div className="w-9 h-9 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(242,193,78,0.7)] group-hover:scale-110 transition-transform">
                  <img
                    src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
                    alt="Logo Bảo tượng"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-wider text-[#FFE5A3] group-hover:text-white"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  QUAY LẠI TRANG BẢO TƯỢNG
                </span>
              </Link>
            )}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. SECTION NGHỆ THUẬT PHẬT GIÁO (HOVER CARD CHUẨN VŨ TRỤ PHẬT GIÁO)
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 pb-16">
        
        {/* Header Section căn giữa đồng bộ với nghệ thuật Phật giáo các khu vực */}
        <div className="flex flex-col items-center text-center my-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 flex items-center justify-center" aria-hidden="true">
            <img
              src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
              alt=""
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(242,193,78,0.95)] scale-135 transform-gpu"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
              }}
            />
          </div>

          <div className="flex items-center justify-center w-full gap-0 max-w-4xl mx-auto px-4">
            <div className="flex-1 flex items-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
            </div>

            <h2
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-5 sm:px-8"
            >
              NGHỆ THUẬT PHẬT GIÁO
            </h2>

            <div className="flex-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
              <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
            </div>
          </div>

          {/* Subtitle font UTM Avo */}
          <p
            className="text-xs sm:text-sm text-[#e3d2c1] tracking-wide font-normal max-w-xl mx-auto mt-2"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Tác phẩm Nghệ Thuật Phật Giáo phỏng cổ &amp; độc bản tôn thờ tại Tùng Lâm Hòa Phúc
          </p>
        </div>

        {/* Bento Grid Gallery (Giao diện hover chuẩn Vũ Trụ Phật Giáo) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Cột 1: 2 ảnh xếp chồng bên trái - focus [center 28%] */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <BentoCard
              item={artisticWorks[0]}
              idx={0}
              openLightbox={setLightboxIndex}
              focusPosition="object-[center_28%]"
              heightClass="h-[240px]"
            />
            <BentoCard
              item={artisticWorks[1]}
              idx={1}
              openLightbox={setLightboxIndex}
              focusPosition="object-[center_28%]"
              heightClass="h-[240px]"
            />
          </div>

          {/* Cột 2: Khám thờ / tượng đứng giữa cao - focus [center 28%] */}
          <div className="md:col-span-4 h-[496px]">
            <BentoCard
              item={artisticWorks[2]}
              idx={2}
              openLightbox={setLightboxIndex}
              focusPosition="object-[center_28%]"
              heightClass="h-full"
            />
          </div>

          {/* Cột 3: Tượng đứng cao bên phải - focus [center 28%] */}
          <div className="md:col-span-4 h-[496px]">
            <BentoCard
              item={artisticWorks[3]}
              idx={3}
              openLightbox={setLightboxIndex}
              focusPosition="object-[center_28%]"
              heightClass="h-full"
            />
          </div>

          {/* Hàng Dưới: Banner ngang lớn */}
          <div className="col-span-1 md:col-span-12 h-[240px]">
            <BentoCard
              item={artisticWorks[4] || artisticWorks[0]}
              idx={4}
              openLightbox={setLightboxIndex}
              focusPosition="object-[center_28%]"
              heightClass="h-full"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. POP-UP MODAL NGHỆ THUẬT PHẬT GIÁO (HỖ TRỢ ZOOM, DRAG PAN & KHÔNG LĂN TRANG)
      ══════════════════════════════════════════════════════════════ */}
      {lightboxIndex !== null && currentLightboxItem && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none"
          onClick={() => setLightboxIndex(null)}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Modal Container */}
          <div
            className="relative max-w-3xl w-full rounded-2xl border border-[#F2C14E]/60 bg-[#25170E] p-4 sm:p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col items-center max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
          >
            {/* 1. Header Bar */}
            <div className="relative w-full flex items-center justify-center border-b border-[#F2C14E]/30 pb-3.5 mb-4">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase text-[#ffde59] tracking-wider text-center drop-shadow-[0_0_15px_rgba(255,222,89,0.7)]"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                NGHỆ THUẬT PHẬT GIÁO
              </h2>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Đóng"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl border border-[#F2C14E]/50 bg-[#1C120B]/80 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#25170E] transition-all cursor-pointer shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Image Frame with Zoom & Drag / Pan */}
            <div
              className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] rounded-xl overflow-hidden border border-[#F2C14E]/40 bg-[#1C120B] p-2 flex items-center justify-center shadow-inner group"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              {/* Zoomable & Pannable Image Container */}
              <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
                <img
                  src={currentLightboxItem.imgUrl}
                  alt={currentLightboxItem.title}
                  draggable={false}
                  style={{
                    transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  }}
                  className="max-h-full max-w-full object-contain rounded-lg filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] select-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                  }}
                />
              </div>

              {/* Side Floating Navigation Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + artisticWorks.length) % artisticWorks.length);
                  setZoomScale(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                aria-label="Ảnh trước"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#F2C14E]/60 bg-[#25170E]/80 backdrop-blur-md flex items-center justify-center text-[#ffde59] hover:bg-[#F2C14E] hover:text-[#25170E] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.7)] z-20"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % artisticWorks.length);
                  setZoomScale(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                aria-label="Ảnh sau"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#F2C14E]/60 bg-[#25170E]/80 backdrop-blur-md flex items-center justify-center text-[#ffde59] hover:bg-[#F2C14E] hover:text-[#25170E] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.7)] z-20"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* Zoom Controls Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#1C120B]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#F2C14E]/50 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale((prev) => Math.min(prev + 0.35, 4));
                  }}
                  title="Phóng to (Lăn chuột lên)"
                  className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale((prev) => {
                      const next = Math.max(prev - 0.35, 1);
                      if (next === 1) setPanOffset({ x: 0, y: 0 });
                      return next;
                    });
                  }}
                  title="Thu nhỏ (Lăn chuột xuống)"
                  className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                {(zoomScale !== 1 || panOffset.x !== 0 || panOffset.y !== 0) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomScale(1);
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    title="Khôi phục gốc"
                    className="w-8 h-8 rounded-lg bg-[#25170E] hover:bg-[#F2C14E] text-[#ffde59] hover:text-[#25170E] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Hint Badge when zoomed */}
              {zoomScale > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 border border-[#F2C14E]/40 text-[11px] text-[#ffde59] font-medium backdrop-blur-md pointer-events-none z-20">
                  Nhấp giữ &amp; Kéo để xem các góc tượng
                </div>
              )}
            </div>

            {/* 3. Pagination Dots */}
            <div className="flex items-center justify-center gap-2 my-3">
              {artisticWorks.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setZoomScale(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className={`rounded-full transition-all cursor-pointer ${
                    idx === lightboxIndex
                      ? 'w-7 h-2.5 bg-[#ffde59] shadow-[0_0_10px_#ffde59]'
                      : 'w-2.5 h-2.5 bg-[#F2C14E]/30 hover:bg-[#F2C14E]'
                  }`}
                />
              ))}
            </div>

            {/* 4. Title (UTM ClassizismAntiqua) */}
            <h3
              className="text-white text-lg sm:text-xl md:text-2xl font-normal uppercase text-center mt-1 mb-1 tracking-wide leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif" }}
            >
              {currentLightboxItem.title}
            </h3>

            {/* Subtitle (UTM Avo) */}
            {currentLightboxItem.subtitle && (
              <p
                className="text-[#ffde59] text-xs sm:text-sm font-normal tracking-wide text-center mb-3 opacity-90"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {currentLightboxItem.subtitle}
              </p>
            )}

            {/* 5. Two Column Details (KHU VỰC & Ý NGHĨA) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-[#F2C14E]/30 pt-4 mt-1 bg-[#1C120B]/60 p-4 rounded-xl border border-[#F2C14E]/20">
              {/* Cột Khu vực */}
              <div className="flex flex-col items-center text-center">
                <span
                  className="text-[#ffde59] text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-wider drop-shadow-[0_0_8px_rgba(242,193,78,0.5)] mb-1"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  KHU VỰC
                </span>
                <span
                  className="text-white text-sm sm:text-base font-semibold leading-relaxed"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {currentLightboxItem.areaName || "Tam Bảo"}
                </span>
              </div>

              {/* Cột Ý nghĩa */}
              <div className="flex flex-col items-center text-center border-t md:border-t-0 md:border-l border-[#F2C14E]/30 pt-3 md:pt-0 md:pl-4">
                <span
                  className="text-[#ffde59] text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-wider drop-shadow-[0_0_8px_rgba(242,193,78,0.5)] mb-1"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  Ý NGHĨA
                </span>
                <p
                  className="text-xs sm:text-sm text-[#c9b896] leading-relaxed italic"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  &ldquo;{currentLightboxItem.meaning}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          5. SECTION VIDEO MINH HỌA
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 pb-16">
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-lg border border-[#F2C14E] bg-[#1C130D] flex items-center justify-center text-[#F2C14E] shadow-[0_0_10px_rgba(242,193,78,0.4)]">
              <Video className="w-4 h-4 text-[#F2C14E]" />
            </div>
            <h2
              className="text-3xl sm:text-5xl text-[#FFE5A3] font-normal uppercase tracking-wider"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              VIDEO MINH HỌA
            </h2>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
        </div>

        <div className="rounded-2xl border border-[#F2C14E]/50 bg-gradient-to-b from-[#3A2718]/95 to-[#1C130D]/95 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-6 relative aspect-video rounded-xl overflow-hidden border border-[#F2C14E]/50 bg-black group shadow-lg">
              {isPlayingVideo ? (
                <iframe
                  src={`${videoUrl}?autoplay=1`}
                  title={videoTitle}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setIsPlayingVideo(true)}
                >
                  <img
                    src={videoThumbnail}
                    alt={videoTitle}
                    className="w-full h-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600/90 border-2 border-white flex items-center justify-center shadow-[0_0_25px_rgba(255,0,0,0.8)] group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white fill-current ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-6 space-y-4">
              <h3
                className="text-3xl sm:text-4xl text-[#FFE5A3] font-normal uppercase leading-tight"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                {videoTitle}
              </h3>
              <div className="w-16 h-[1.5px] bg-[#F2C14E]" />
              <p
                className="text-xs sm:text-sm text-[#FFE5A3] leading-relaxed text-justify font-normal"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {videoSummary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. BANNER BÀI VIẾT & TRUYỆN NGẮN FULL WIDTH
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full border-y border-[#F2C14E]/40 overflow-hidden bg-[#160B04] min-h-[380px] sm:min-h-[440px] flex items-center justify-center text-center p-6 sm:p-12 group my-6">
        <div className="absolute inset-0 opacity-40 scale-105 transition-transform duration-1000 group-hover:scale-100">
          <img
            src={statue.article?.bannerUrl || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&h=600&fit=crop"}
            alt="Bài viết"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/90 via-[#160B04]/70 to-[#2A1D14]/90" />

        <div className="relative z-10 w-full max-w-3xl mx-auto space-y-3 sm:space-y-4 px-4">
          <span
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-2xl sm:text-3xl font-normal text-[#FFE5A3] block tracking-wide opacity-90"
          >
            Bài viết
          </span>

          <h2
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-4xl sm:text-6xl lg:text-7xl font-normal text-[#FFE5A3] uppercase tracking-normal drop-shadow-[0_2px_20px_rgba(242,193,78,0.7)] py-1"
          >
            {statue.article?.title || `ĐỨC PHẬT LÀ AI?`}
          </h2>

          <p
            style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
            className="text-base sm:text-xl font-normal text-[#FFE5A3] tracking-widest uppercase py-0.5"
          >
            {statue.article?.author || "VÔ TRÍ - TÂM HÒA"}
          </p>

          <div className="pt-3 sm:pt-4">
            <Link
              href={statue.article?.url || `/bao-tuong-phat-giao/${statue.slug}`}
              className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-2 sm:py-2.5 rounded-full border border-[#F2C14E] bg-[#3A2718]/80 hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#1C130D] text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(242,193,78,0.3)] hover:shadow-[0_0_25px_rgba(242,193,78,0.6)] cursor-pointer"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <span>ĐỌC BÀI VIẾT</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. SECTION BẢO TƯỢNG LIÊN QUAN (CHỈ 2 BẢO TƯỢNG - TRÊN VÀNG NIAGARA, DƯỚI TRẮNG CLASSIC ANTIQUA)
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-10 py-16">
        {/* Header Bảo Tượng Liên Quan */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-full flex items-center justify-center gap-4">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
            <h2
              className="text-3xl sm:text-5xl md:text-6xl text-[#FFE5A3] font-normal uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] px-4"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              BẢO TƯỢNG LIÊN QUAN
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
          </div>
        </div>

        {/* Lưới 2 thẻ bảo tượng liên quan căn giữa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {relatedStatues.map((rel) => {
            const parts = rel.name.replace(/ĐỨC PHẬT\s*|BỒ TÁT\s*|TỔ SƯ\s*/i, '').trim();
            const prefix = rel.name.includes('PHẬT') ? 'ĐỨC PHẬT' : (rel.name.includes('BỒ TÁT') ? 'BỒ TÁT' : 'BẢO TƯỢNG');

            return (
              <Link
                key={rel.id}
                href={`/bao-tuong/${rel.slug}`}
                className="group rounded-2xl overflow-hidden border border-[#F2C14E]/50 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer block hover:scale-[1.03]"
              >
                {/* Thumbnail Image - lấy [center 28%] rõ mặt tượng */}
                <div className="relative w-full h-[280px] overflow-hidden bg-[#1A120B]">
                  <img
                    src={rel.imgUrl}
                    alt={rel.name}
                    className="w-full h-full object-cover object-[center_28%] group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#25170E] via-transparent to-transparent" />
                </div>

                {/* Footer Label: Trên là UTM Niagara màu vàng, dưới là màu trắng UTM Classic Antiqua */}
                <div className="bg-[#3A2718] group-hover:bg-[#4D3420] transition-colors p-4 text-center border-t border-[#F2C14E]/40 flex flex-col items-center justify-center">
                  <span
                    className="text-xl sm:text-2xl text-[#F2C14E] block leading-none mb-1 font-normal"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    {prefix}
                  </span>
                  <h3
                    className="text-base sm:text-lg text-white font-normal uppercase tracking-wider leading-snug"
                    style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif" }}
                  >
                    {parts || rel.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. CHUYÊN ĐỀ DƯỢC SƯ / BÁT BỘ KIM CANG NẾU CÓ
      ══════════════════════════════════════════════════════════════ */}
      {(statue.code === 'TP0018' || statue.id === 'TP0018' || statue.slug === 'duc_phat_duoc_su' || statue.characterGroup === 'duc_phat_duoc_su' || (statue.name?.toUpperCase().includes('DƯỢC SƯ') && !statue.name?.toUpperCase().includes('DƯỢC XOA'))) && (
        <div className="max-w-[1280px] mx-auto px-4 pb-16">
          <ThatPhatDuocSuSection />
        </div>
      )}

      {(statue.slug === 'bat_bo_kim_cang' || statue.code === 'TP0079' || statue.id === 'TP0079' || statue.characterGroup === 'bat_bo_kim_cang' || (statue.name?.toUpperCase().includes('KIM CANG') && !statue.name?.toUpperCase().includes('DƯỢC XOA') && !statue.name?.toUpperCase().includes('MẬT TÍCH') && !statue.name?.toUpperCase().includes('NA LA DIEN'))) && (
        <div className="max-w-[1280px] mx-auto px-4 pb-16">
          <BatBoKimCangSection />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          9. BOTTOM ORNAMENT EMBLEM
      ══════════════════════════════════════════════════════════════ */}
      <div className="w-full flex justify-center py-12">
        <div className="w-12 h-12 flex items-center justify-center text-[#F2C14E] opacity-75">
          <svg viewBox="0 0 100 100" className="w-10 h-10 fill-current">
            <path d="M50 10 C55 25 75 35 75 50 C75 65 55 75 50 90 C45 75 25 65 25 50 C25 35 45 25 50 10 Z" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <path d="M30 40 Q50 20 70 40 Q50 60 30 40 Z" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M30 60 Q50 80 70 60 Q50 40 30 60 Z" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ── REUSABLE BENTO CARD VỚI GIAO DIỆN HOVER CHUẨN VŨ TRỤ PHẬT GIÁO ── */
interface BentoCardProps {
  item: {
    id: string;
    title: string;
    subtitle?: string;
    imgUrl: string;
    meaning?: string;
  };
  idx: number;
  openLightbox: (idx: number) => void;
  focusPosition?: string;
  heightClass?: string;
}

const BentoCard: FC<BentoCardProps> = ({
  item,
  idx,
  openLightbox,
  focusPosition = 'object-[center_28%]',
  heightClass = 'h-full',
}) => {
  return (
    <div
      onClick={() => openLightbox(idx)}
      className={`group relative overflow-hidden cursor-pointer rounded-2xl border border-[#f2c14e]/35 hover:border-[#ffde59] transition-all duration-500 shadow-xl bg-[#1c120b] w-full ${heightClass}`}
    >
      {/* Image with vertical statue face focus [center 28%] */}
      <img
        src={item.imgUrl}
        alt={item.title}
        className={`w-full h-full object-cover ${focusPosition} transition-transform duration-700 group-hover:scale-105`}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
        }}
      />

      {/* Soft gradient fade at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1C120B]/95 via-[#1C120B]/50 to-transparent pointer-events-none" />

      {/* Hover Modal Overlay - Đồng bộ chuẩn giao diện Nghệ thuật Phật giáo Vũ trụ */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#25170E]/90 via-[#3D2817]/65 to-transparent backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center p-3 sm:p-5 text-center pointer-events-none z-20">
        <div className="absolute inset-3 sm:inset-4 md:inset-5 rounded-xl md:rounded-2xl border border-[#ffde59]/70 bg-[#452a15]/85 flex flex-col items-center justify-center p-3 sm:p-5 text-center shadow-[0_0_30px_rgba(242,193,78,0.3)]">
          <h3
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif" }}
            className="text-white font-normal uppercase tracking-wide transition-all duration-300 group-hover:-translate-y-0.5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-snug max-w-[95%] mx-auto text-sm sm:text-base md:text-lg text-center line-clamp-2"
          >
            {item.title}
          </h3>

          <div className="w-12 sm:w-16 h-[2px] bg-[#ffde59] my-2 sm:my-2.5 shadow-[0_0_8px_#ffde59]" />

          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[#e3d2c1] text-xs sm:text-sm font-normal leading-relaxed tracking-wide px-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] text-center line-clamp-3 sm:line-clamp-4"
          >
            {item.subtitle || item.meaning || 'Nghệ Thuật Phật Giáo Tùng Lâm Hòa Phúc'}
          </p>
        </div>
      </div>
    </div>
  );
};
