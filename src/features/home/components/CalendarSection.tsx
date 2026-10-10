'use client';

import { FC, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SectionTransitionOverlay } from "@/components/common/SectionTransitionOverlay";
import {
  getDaysInMonth,
  getStartDayOffset,
  getLunarCellString,
  getBuddhistEraYear,
  convertSolarToLunar,
} from "@/lib/lunar-calendar";
import {
  CalendarEvent,
  MONTH_THEMES,
  MonthThemeInfo,
  getEventsForMonth,
  getEventCategoryIcon,
} from "@/data/schedule-data";

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export const CalendarSection: FC = () => {
  // Mặc định mở Tháng 10 Dương Lịch 2026 (Tương ứng Tháng 9 Âm Lịch Bính Ngọ - Học Hạnh Buông Xả)
  const [activeDate, setActiveDate] = useState<Date>(new Date(2026, 9, 1));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất Cả");

  // State cho Slide Poster Tương Tác Cột Trái
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [isSlidePaused, setIsSlidePaused] = useState<boolean>(false);

  const currentYear = activeDate.getFullYear();
  const currentMonth = activeDate.getMonth(); // 0-indexed (0 to 11)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDayOffset = getStartDayOffset(currentYear, currentMonth);
  const buddhistEra = getBuddhistEraYear(currentYear);

  const [dbData, setDbData] = useState<{
    featuredPrograms?: any[];
    monthThemes?: Record<string, any>;
    customEvents?: any[];
  } | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const res = await fetch('/api/admin/schedule');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDbData(json.data);
          }
        }
      } catch {
        // Fallback silently
      }
    }
    loadSchedule();
  }, []);

  // Month Theme Info (Banner, Quote, Colors)
  const monthTheme: MonthThemeInfo = useMemo(() => {
    if (dbData?.monthThemes && dbData.monthThemes[String(currentMonth)]) {
      const mt = dbData.monthThemes[String(currentMonth)];
      return {
        month: mt.month || currentMonth + 1,
        bannerImg: mt.bannerImg || MONTH_THEMES[currentMonth]?.bannerImg || '',
        title: mt.title || '',
        quoteLines: Array.isArray(mt.quoteLines) ? mt.quoteLines : [],
        author: mt.author || 'Vô Trí - Tâm Hòa',
        primaryColor: mt.primaryColor || '#8B3A1C',
        secondaryColor: mt.secondaryColor || '#F2C14E',
        themeBg: mt.themeBg || '#2A170F',
      };
    }
    return MONTH_THEMES[currentMonth] || MONTH_THEMES[0];
  }, [currentMonth, dbData]);

  // Dynamic automatic calculation of all events for this month
  const monthEventsMap = useMemo(() => {
    const baseMap = getEventsForMonth(currentYear, currentMonth);
    // Bổ sung slug mặc định cho các sự kiện cơ bản
    Object.keys(baseMap).forEach((dayKey) => {
      const d = Number(dayKey);
      baseMap[d] = baseMap[d].map((ev) => ({
        ...ev,
        slug: ev.slug || toSlug(ev.title),
      }));
    });

    if (dbData?.customEvents && Array.isArray(dbData.customEvents)) {
      dbData.customEvents.forEach((ce) => {
        const parts = (ce.solarDateStr || '').split('.');
        if (parts.length === 3) {
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parseInt(parts[2], 10);
          if (m === currentMonth && y === currentYear && d >= 1 && d <= daysInMonth) {
            const lunar = convertSolarToLunar(d, currentMonth, currentYear);
            const isCongTu = ce.category === 'Cộng Tu';
            const customEvt: CalendarEvent = {
              id: ce.id,
              day: d,
              solarDateStr: ce.solarDateStr,
              dayOfWeekStr: '',
              lunarDate: `(${String(lunar.day).padStart(2, '0')}.${String(lunar.month).padStart(2, '0')}.ÂL)`,
              lunarTag: `MÙNG ${lunar.day}`,
              subTitle1: isCongTu ? 'CỘNG TU HỌC' : 'SỰ KIỆN ĐẶC BIỆT',
              title: ce.title,
              subtitle: ce.subtitle || '',
              subTitle2: ce.location || 'Tùng Lâm Hòa Phúc',
              description: ce.description || '',
              category: ce.category || 'Đại Lễ Sự Kiện',
              location: ce.location || 'Tùng Lâm Hòa Phúc',
              timeSlot1Label: ce.timeSlot1Label || 'Thời Khóa',
              timeSlot1Time: ce.timeSlot1Time || '08h00',
              timeSlot2Label: ce.timeSlot2Label,
              timeSlot2Time: ce.timeSlot2Time,
              color: isCongTu ? '#10B981' : '#F2C14E',
              imgUrl: ce.imgUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
              isImportant: true,
              slug: ce.slug || toSlug(ce.title),
              notes: ce.notes || '',
            };
            baseMap[d] = [...(baseMap[d] || []), customEvt];
          }
        }
      });
    }
    return baseMap;
  }, [currentYear, currentMonth, dbData, daysInMonth]);

  // Danh sách tất cả sự kiện trong tháng hiện tại (sắp xếp theo ngày tăng dần)
  const allMonthEvents = useMemo(() => {
    const list: CalendarEvent[] = [];
    Object.keys(monthEventsMap)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((d) => {
        const evts = monthEventsMap[d] || [];
        list.push(...evts);
      });
    return list;
  }, [monthEventsMap]);

  // Cấu trúc Slides Cột Trái: Slide 0 là Chủ Đề Tháng, Slide 1..N là các sự kiện trong tháng
  type SlideItem =
    | { type: 'theme'; day: null }
    | { type: 'event'; day: number; event: CalendarEvent };

  const slides: SlideItem[] = useMemo(() => {
    const eventSlides: SlideItem[] = allMonthEvents.map((ev) => ({
      type: 'event',
      day: ev.day,
      event: ev,
    }));
    return [{ type: 'theme', day: null }, ...eventSlides];
  }, [allMonthEvents]);

  // Reset slide index khi đổi tháng
  useEffect(() => {
    setActiveSlideIdx(0);
  }, [currentMonth, currentYear]);

  // Tự động chạy Slide (Auto-play mỗi 5 giây, tạm dừng khi hover)
  useEffect(() => {
    if (slides.length <= 1 || isSlidePaused) return;
    const interval = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isSlidePaused]);

  // Xác định ngày đang được kích hoạt highlight từ Slide cột trái
  const activeHighlightedDay: number | null = useMemo(() => {
    const cur = slides[activeSlideIdx];
    if (cur && cur.type === 'event') {
      return cur.day;
    }
    return null;
  }, [slides, activeSlideIdx]);

  // Chuyển slide tiếp/lùi
  const handlePrevSlide = () => {
    setActiveSlideIdx((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIdx((prev) => (prev + 1) % slides.length);
  };

  // First and last day lunar info for header
  const firstDayLunar = useMemo(() => {
    return convertSolarToLunar(1, currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const lastDayLunar = useMemo(() => {
    return convertSolarToLunar(daysInMonth, currentMonth, currentYear);
  }, [daysInMonth, currentMonth, currentYear]);

  const handlePrevMonth = () => {
    setActiveDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setActiveDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Khi click vào ô ngày trên bảng lịch: Chuyển slide cột trái tới poster sự kiện của ngày đó
  const handleDayCellClick = (dayNumber: number, dayEvents: CalendarEvent[]) => {
    if (dayEvents.length > 0) {
      const targetIdx = slides.findIndex((s) => s.type === 'event' && s.day === dayNumber);
      if (targetIdx !== -1) {
        setActiveSlideIdx(targetIdx);
      }
    }
  };

  const currentSlide = slides[activeSlideIdx] || slides[0];

  return (
    <section className="w-full py-20 relative overflow-hidden bg-[#1A120B]">
      {/* ── Seamless Gradient Blur Overlay ── */}
      <SectionTransitionOverlay position="both" />

      {/* ── Background Ambient Aura ── */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={monthTheme.bannerImg}
          alt="Bối cảnh Lịch tu học"
          className="w-full h-full object-cover opacity-15 blur-sm"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-thap/bao-thap-banner.webp';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A120B] via-transparent to-[#1A120B]" />
      </div>

      {/* ── 1. Top Section Header ── */}
      <SectionHeader
        title={`LỊCH TU HỌC PHẬT LỊCH ${buddhistEra}`}
        iconUrl="/images/icons/icon-lich-tu-hoc.webp"
      />

      {/* ── 2. Unified Side-by-Side Calendar Container ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-6">

        {/* ══════════════════════════════════════════════════════════════════════
            BỐ CỤC NỔI 3D TRÊN BACKGROUND: KHÔNG KHUNG BAO NGOÀI, TỈ LỆ VÀNG 17x19CM
        ══════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-7">

          {/* ── 1. CỘT TRÁI: SLIDE POSTER TƯƠNG TÁC ĐA NĂNG (17x19CM, ĐỒNG BỘ VIỀN VÀNG VỚI LỊCH) ── */}
          <div
            onMouseEnter={() => setIsSlidePaused(true)}
            onMouseLeave={() => setIsSlidePaused(false)}
            className="w-full lg:w-[350px] xl:w-[380px] shrink-0 rounded-3xl bg-gradient-to-b from-[#2A170F] via-[#201007] to-[#150A04] border border-[#F2C14E]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col justify-between overflow-hidden transition-all min-h-[530px] md:min-h-[550px] relative group/leftcol"
          >

            {/* Slide Navigation Buttons (Prev / Next nổi tinh tế) */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-2.5 top-1/3 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/60 flex items-center justify-center opacity-0 group-hover/leftcol:opacity-100 transition-all cursor-pointer shadow-lg active:scale-95"
                  aria-label="Slide trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-2.5 top-1/3 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-black border border-[#F2C14E]/60 flex items-center justify-center opacity-0 group-hover/leftcol:opacity-100 transition-all cursor-pointer shadow-lg active:scale-95"
                  aria-label="Slide sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* ── NỘI DUNG SLIDE: CHỦ ĐỀ THÁNG HOẶC POSTER SỰ KIỆN ── */}
            {currentSlide.type === 'theme' ? (
              /* SLIDE 0: CHỦ ĐỀ THÁNG (TRANH + QUOTE + TÁC GIẢ) */
              <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-500">
                {/* 1.1 TRANH MINH HỌA NGHỆ THUẬT */}
                <div className="relative w-full aspect-[1200/1015] shrink-0 overflow-hidden bg-black/30">
                  <img
                    src={monthTheme.bannerImg}
                    alt={monthTheme.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-102"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg';
                    }}
                  />
                  {/* Lớp gradient đậm che kín đáy */}
                  <div className="absolute inset-x-0 bottom-0 h-4 sm:h-5 bg-gradient-to-t from-[#201007] from-35% via-[#201007]/90 to-transparent pointer-events-none" />
                </div>

                {/* Đường chỉ vàng kim phân định */}
                <div className="flex items-center justify-center gap-2 w-full px-5 py-2 shrink-0 opacity-85">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
                  <span className="text-[#F2C14E] text-xs select-none drop-shadow-[0_0_6px_rgba(242,193,78,0.7)]">❖</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
                </div>

                {/* 1.2 KHỐI NỘI DUNG QUOTE & TÁC GIẢ */}
                <div className="p-4 sm:p-5 pt-0 flex-1 flex flex-col justify-between items-center text-center">
                  <div className="w-full flex-1 flex flex-col justify-center my-auto py-1">
                    {(() => {
                      const isPoem = [1, 3, 4, 5, 10].includes(currentMonth);
                      if (isPoem) {
                        return (
                          <div className="space-y-1 my-auto">
                            {monthTheme.quoteLines.map((line: string, idx: number) => {
                              if (line === "") return <div key={idx} className="h-1" />;
                              const cleanLine = line.replace(/[“”"']/g, '').trim();
                              if (!cleanLine) return null;
                              const isLong = monthTheme.quoteLines.length > 5;
                              return (
                                <p
                                  key={idx}
                                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                  className={`leading-relaxed tracking-wide text-center ${
                                    idx === 0
                                      ? isLong
                                        ? "font-bold text-xs sm:text-sm text-[#FFDE59]"
                                        : "font-bold text-sm sm:text-base text-[#FFDE59]"
                                      : isLong
                                        ? "font-normal text-[11px] sm:text-xs text-[#FFE5A3]/90"
                                        : "font-normal text-xs sm:text-sm text-[#FFE5A3]/90"
                                  }`}
                                >
                                  {cleanLine}
                                </p>
                              );
                            })}
                          </div>
                        );
                      } else {
                        const cleanLines = monthTheme.quoteLines
                          .map((l: string) => l.replace(/[“”"']/g, '').trim())
                          .filter(Boolean);
                        const firstSentence = cleanLines[0] || "";
                        const restSentences = cleanLines.slice(1).join(" ");
                        return (
                          <p
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            className="text-justify leading-relaxed text-xs sm:text-sm text-[#FFE5A3]/90 my-auto px-1 sm:px-2"
                          >
                            <strong className="font-bold text-[#FFDE59] inline mr-1">
                              {firstSentence}
                            </strong>
                            <span className="inline">{restSentences}</span>
                          </p>
                        );
                      }
                    })()}
                  </div>

                  {/* 1.3 HUY HIỆU TÁC GIẢ */}
                  <div className="pt-2 w-full flex justify-center shrink-0">
                    <div className="inline-flex items-center px-5 py-1 rounded-full border border-[#F2C14E]/60 bg-[#7C4A1C]/50 hover:bg-[#7C4A1C]/70 backdrop-blur-sm shadow-md transition-colors">
                      <span
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                        className="text-sm sm:text-base text-[#FFE5A3] uppercase tracking-widest leading-none pt-0.5"
                      >
                        {monthTheme.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* SLIDE 1..N: POSTER SỰ KIỆN TRONG THÁNG (ĐỒNG BỘ VIỀN VÀNG VỚI LỊCH) */
              <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-500">
                {/* Ảnh Poster sự kiện */}
                <div className="relative w-full aspect-[1200/1015] shrink-0 overflow-hidden bg-black/40">
                  <img
                    src={currentSlide.event.imgUrl}
                    alt={currentSlide.event.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-102"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201007] via-transparent to-black/30 pointer-events-none" />
                </div>

                {/* 2. Đường kẻ Gradient cắt ranh giới mép chân ảnh có icon tròn chính giữa (phong cách Dấu Ấn Hoằng Pháp) */}
                <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-transparent z-10 shrink-0 my-1">
                  {/* Huy hiệu Logo Danh mục nổi chính giữa tim đường kẻ */}
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#F2C14E] bg-[#24160E] flex items-center justify-center p-2 shadow-[0_0_16px_rgba(242,193,78,0.6)]">
                    <img
                      src={getEventCategoryIcon(currentSlide.event.category)}
                      alt={currentSlide.event.category}
                      className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.5)]"
                    />
                  </div>
                </div>

                {/* Chi tiết nội dung Sự Kiện */}
                <div className="p-4 sm:p-5 pt-7 sm:pt-8 flex-1 flex flex-col justify-between space-y-3 text-center">
                  <div className="space-y-1 my-auto w-full">
                    {/* Sub Tiêu Đề NẰM Ở TRÊN - Viết thường, nghiêng, không bold, font UTM Avo */}
                    <p
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-xs sm:text-[13px] text-amber-200/90 font-normal italic normal-case tracking-wide line-clamp-1 w-full text-center"
                    >
                      {currentSlide.event.subtitle || currentSlide.event.subTitle1 || currentSlide.event.category}
                    </p>

                    {/* Tiêu Đề Chính NẰM Ở DƯỚI - Bắt buộc BOLD & IN HOA TOÀN BỘ, font UTM Avo */}
                    <h3
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-base sm:text-lg font-bold uppercase text-[#FFDE59] tracking-wider leading-snug drop-shadow w-full text-center mt-1"
                    >
                      {currentSlide.event.title}
                    </h3>

                    {/* Khung giờ & địa điểm */}
                    <div className="flex items-center justify-center gap-3 text-xs text-[#FFE5A3]/90 pt-1.5">
                      {currentSlide.event.timeSlot1Time && (
                        <span className="flex items-center gap-1 font-semibold text-white">
                          <Clock className="w-3.5 h-3.5 text-[#F2C14E]" />
                          {currentSlide.event.timeSlot1Time}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F2C14E]" />
                        {currentSlide.event.location || 'Tùng Lâm Hòa Phúc'}
                      </span>
                    </div>
                  </div>

                  {/* Nút Xem Chi Tiết Bài Viết - Tinh tế, sang trọng, icon nhỏ dễ thương */}
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(currentSlide.event)}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C0F08]/85 hover:bg-[#3D2210] border border-[#F2C14E]/60 hover:border-[#FFDE59] text-[#FFE5A3] hover:text-[#FFDE59] transition-all duration-300 text-xs tracking-wider cursor-pointer shadow-md group/btn"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      <span className="font-medium text-[11px] sm:text-xs">Xem chi tiết bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F2C14E] transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dải Dots Indicators (Chấm điều hướng slide) */}
            {slides.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pb-3 shrink-0">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeSlideIdx === idx
                        ? 'w-6 bg-[#FFDE59] shadow-[0_0_8px_rgba(255,222,89,0.8)]'
                        : 'w-1.5 bg-[#F2C14E]/30 hover:bg-[#F2C14E]/60'
                    }`}
                    aria-label={`Chuyển tới slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

          </div>

          {/* ── 2. CỘT PHẢI: BẢNG LỊCH CỐ ĐỊNH 6 HÀNG (42 Ô) - LOGO BIỂU TƯỢNG & ĐỒNG BỘ VIỀN VÀNG ── */}
          <div className="flex-1 rounded-3xl p-4 sm:p-5 md:p-6 bg-gradient-to-b from-[#2A170F]/95 via-[#1D0F08]/95 to-[#140A04]/98 border border-[#F2C14E]/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col justify-between space-y-3 transition-all min-h-[530px] md:min-h-[550px]">

            {/* 2.1 THANH ĐIỀU HƯỚNG THÁNG & PHẬT LỊCH / DƯƠNG LỊCH */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-black/55 border border-[#F2C14E]/35 shadow-inner">
              {/* Nút lùi tháng */}
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#3D2210] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-[#1C0F08] transition-all flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Nhãn Tháng Dương Lịch & Phật Lịch */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Pill 1: Tháng Dương Lịch */}
                <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#201007]/90 border border-[#F2C14E]/50 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFDE59]"
                  >
                    THÁNG {String(currentMonth + 1).padStart(2, '0')} / {currentYear}
                  </span>
                </div>

                {/* Pill 2: Phật Lịch & Âm Lịch */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-[#F2C14E]/50 shadow-sm">
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-[11px] sm:text-xs font-bold text-[#FFDE59] tracking-wide"
                  >
                    PL. {buddhistEra}
                  </span>
                  <span className="text-[#F2C14E]/60 text-xs">•</span>
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-[11px] sm:text-xs font-medium text-amber-200/90"
                  >
                    Tháng {firstDayLunar.month === lastDayLunar.month ? firstDayLunar.month : `${firstDayLunar.month} - ${lastDayLunar.month}`} ÂL Năm Bính Ngọ
                  </span>
                </div>
              </div>

              {/* Nút tiến tháng */}
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#3D2210] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-[#1C0F08] transition-all flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95"
                aria-label="Tháng sau"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* 2.2 Header thứ trong tuần (T2 - CN) */}
            <div
              className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center font-bold text-xs sm:text-sm uppercase py-2 px-1.5 rounded-xl tracking-wider shadow-inner"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                fontFamily: "'UTM Avo', sans-serif",
                border: "1px solid rgba(242,193,78,0.3)",
              }}
            >
              <div className="text-[#FFE5A3]">T2</div>
              <div className="text-[#FFE5A3]">T3</div>
              <div className="text-[#FFE5A3]">T4</div>
              <div className="text-[#FFE5A3]">T5</div>
              <div className="text-[#FFE5A3]">T6</div>
              <div className="text-[#FFE5A3]">T7</div>
              <div className="text-[#1C0F08] font-black bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] rounded-lg shadow-sm">
                CN
              </div>
            </div>

            {/* 2.3 Lưới 42 Ô Cố Định (6 Hàng x 7 Cột) */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center flex-1">
              {(() => {
                interface DayCellData {
                  dayNumber: number;
                  events: CalendarEvent[];
                  lunarCellStr: string;
                  isFirstOrFullMoon: boolean;
                  isSamHoi: boolean;
                  isSunday: boolean;
                }

                const cells: (DayCellData | null)[] = Array(42).fill(null);

                for (let day = 1; day <= daysInMonth; day++) {
                  const cellIndex = startDayOffset + (day - 1);
                  const rawEvents = monthEventsMap[day] || [];
                  const events = selectedCategory === "Tất Cả"
                    ? rawEvents
                    : rawEvents.filter((ev) => ev.category === selectedCategory);

                  const lunarCellStr = getLunarCellString(day, currentMonth, currentYear);
                  const lunarObj = convertSolarToLunar(day, currentMonth, currentYear);
                  const isFirstOrFullMoon = lunarObj.day === 1 || lunarObj.day === 15;
                  const isSamHoi = lunarObj.day === 8 || lunarObj.day === 14 || lunarObj.day === 23 || lunarObj.day >= 29;
                  const isSunday = cellIndex % 7 === 6;

                  if (cellIndex < 42) {
                    cells[cellIndex] = {
                      dayNumber: day,
                      events,
                      lunarCellStr,
                      isFirstOrFullMoon,
                      isSamHoi,
                      isSunday,
                    };
                  }
                }

                return cells.map((cell, idx) => {
                  if (!cell) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="min-h-[58px] sm:min-h-[64px] md:min-h-[68px] rounded-xl border border-transparent opacity-0 pointer-events-none"
                      />
                    );
                  }

                  const hasEvent = cell.events.length > 0;
                  // ĐỒNG BỘ VIỀN VÀNG: Ô ngày trùng khớp với sự kiện trên Slide Cột Trái
                  const isHighlightedBySlide = activeHighlightedDay !== null && cell.dayNumber === activeHighlightedDay;

                  return (
                    <div
                      key={`day-${cell.dayNumber}`}
                      onClick={() => handleDayCellClick(cell.dayNumber, cell.events)}
                      className={`min-h-[58px] sm:min-h-[64px] md:min-h-[68px] p-1 sm:p-1.5 flex flex-col justify-between relative rounded-xl transition-all duration-300 cursor-pointer group/cell ${
                        isHighlightedBySlide
                          ? "border-2 border-[#FFDE59] shadow-[0_0_25px_rgba(255,222,89,0.95)] ring-2 ring-[#FFDE59]/70 scale-105 z-30 bg-gradient-to-b from-[#633B18] via-[#4A260F] to-[#2B1408]"
                          : "bg-black/45 border border-[#F2C14E]/20 hover:border-[#F2C14E]/60 hover:bg-black/65 hover:z-20"
                      }`}
                    >
                      {/* Hàng trên: Số ngày dương & Ngày âm */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className={`text-sm sm:text-base md:text-lg font-black leading-none ${
                            isHighlightedBySlide
                              ? "text-[#FFDE59] drop-shadow-[0_0_8px_rgba(255,222,89,0.9)]"
                              : cell.isSunday
                                ? "text-[#FFDE59] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                                : "text-white"
                          }`}
                        >
                          {cell.dayNumber}
                        </span>

                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className={`text-[8px] sm:text-[9px] font-bold rounded px-1 leading-tight ${
                            cell.isFirstOrFullMoon
                              ? "bg-[#DC2626] text-white shadow-sm font-black"
                              : cell.isSamHoi
                                ? "text-[#FFC107] font-bold"
                                : "text-amber-200/80"
                          }`}
                        >
                          {cell.lunarCellStr}
                        </span>
                      </div>

                      {/* Phần giữa: LOGO BIỂU TƯỢNG TRỰC TIẾP TRÊN NỀN Ô + TOOLTIP 2 DÒNG GỌN GÀNG */}
                      {hasEvent ? (
                        <div className="flex items-center justify-center gap-1.5 my-auto flex-wrap py-0.5">
                          {cell.events.map((ev, i) => {
                            const iconUrl = getEventCategoryIcon(ev.category);
                            const subtitleText = ev.subtitle || ev.subTitle1 || '';

                            return (
                              <div
                                key={i}
                                className="relative group/icon cursor-pointer transition-transform hover:scale-125 z-10 hover:z-50 p-0.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(ev);
                                }}
                              >
                                {/* Logo Biểu Tượng Nằm Trực Tiếp Trên Nền Ô (Không Khung Tròn, Không Phủ Nền Vàng) */}
                                <img
                                  src={iconUrl}
                                  alt={ev.title}
                                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                />

                                {/* Tooltip Gọn Gàng 2 Dòng (Sub-tiêu đề trên, Tiêu đề chính dưới) */}
                                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] sm:max-w-[220px] px-2.5 py-1.5 rounded-xl bg-[#1C0F08]/98 border border-[#FFDE59] shadow-[0_10px_25px_rgba(0,0,0,0.95)] backdrop-blur-xl opacity-0 group-hover/icon:opacity-100 transition-all duration-200 z-[100] text-center transform scale-95 group-hover/icon:scale-100">
                                  {/* Dòng 1: Sub-tiêu đề (Viết thường, nghiêng, không bold) */}
                                  <div
                                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                    className="text-[10.5px] sm:text-[11px] text-amber-200/90 italic font-normal leading-tight"
                                  >
                                    {subtitleText || ev.category}
                                  </div>

                                  {/* Dòng 2: Tiêu đề chính (In hoa toàn bộ, bold) */}
                                  <div
                                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                    className="text-xs sm:text-[13px] font-bold uppercase text-[#FFDE59] leading-tight mt-0.5"
                                  >
                                    {ev.title}
                                  </div>

                                  {/* Mũi tên tooltip */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#FFDE59]" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-2" />
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* 2.4 THANH CHÚ THÍCH Ý NGHĨA LOGO BIỂU TƯỢNG (GÓC DƯỚI BÊN PHẢI BẢNG LỊCH) */}
            <div
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="flex flex-wrap items-center justify-end gap-2.5 pt-2 text-[11px] border-t border-[#F2C14E]/20"
            >
              <span className="text-[#F2C14E] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                ❖ Chú thích:
              </span>

              {/* Logo 1: Cộng Tu */}
              <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-[#F2C14E]/30 shadow-xs">
                <img
                  src="/images/icons/icon-cong-tu.png"
                  alt="Cộng Tu"
                  className="w-4 h-4 object-contain"
                />
                <span className="font-medium text-[#FFE5A3]">Cộng Tu</span>
              </div>

              {/* Logo 2: Khóa Lễ Truyền Thống */}
              <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-[#F2C14E]/30 shadow-xs">
                <img
                  src="/images/icons/icon-khoa-le-truyen-thong.png"
                  alt="Khóa Lễ Truyền Thống"
                  className="w-4 h-4 object-contain"
                />
                <span className="font-medium text-[#FFE5A3]">Khóa Lễ Truyền Thống</span>
              </div>

              {/* Logo 3: Đại Lễ Sự Kiện */}
              <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-[#F2C14E]/30 shadow-xs">
                <img
                  src="/images/icons/icon-dai-le-su-kien.png"
                  alt="Đại Lễ Sự Kiện"
                  className="w-4 h-4 object-contain"
                />
                <span className="font-medium text-[#FFE5A3]">Đại Lễ Sự Kiện</span>
              </div>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            POPUP POSTER MODEL (BRING TO FRONT Z-[9999], TỶ LỆ VÀNG)
        ══════════════════════════════════════════════ */}
        {selectedEvent && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="relative max-w-md w-full max-h-[85vh] overflow-y-auto rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] border bg-[#1E1108] transition-all animate-in zoom-in-95 flex flex-col scrollbar-none"
              style={{
                borderColor: "#F2C14E",
                boxShadow: "0 0 50px rgba(242,193,78,0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Nút Đóng Popup X */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-[#1A120B]/90 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black border border-[#F2C14E]/60 flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md"
                aria-label="Đóng Pop-up"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 1. TOP BANNER IMAGE */}
              <div className="relative w-full h-[180px] sm:h-[200px] bg-black shrink-0 overflow-hidden">
                <img
                  src={selectedEvent.imgUrl}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1108] via-transparent to-black/40" />
              </div>

              {/* 2. POSTER CONTENT BODY */}
              <div className="p-4 sm:p-5 space-y-3 text-center bg-[#1E1108] text-white">
                {/* Badge Phân Loại */}
                <div className="flex items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#F2C14E]/60 bg-black/60 shadow-md">
                    <img
                      src={getEventCategoryIcon(selectedEvent.category)}
                      alt={selectedEvent.category}
                      className="w-4 h-4 object-contain"
                    />
                    <span className="text-[11px] font-bold uppercase text-[#FFDE59]">
                      {selectedEvent.category}
                    </span>
                  </div>
                </div>

                {/* Tiêu đề chính */}
                <div className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-[#A3520A] via-[#C87515] to-[#A3520A] border border-[#F2C14E] shadow-[0_0_20px_rgba(200,117,21,0.5)]">
                  <h3
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-base sm:text-lg font-bold uppercase text-white tracking-wider leading-snug"
                  >
                    {selectedEvent.title}
                  </h3>
                </div>

                {/* Sub Tiêu Đề Bóc Tách */}
                {(selectedEvent.subtitle || selectedEvent.subTitle1) && (
                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs sm:text-sm text-[#FFE5A3] font-medium italic opacity-95"
                  >
                    {selectedEvent.subtitle || selectedEvent.subTitle1}
                  </p>
                )}

                {/* 3. POSTER SCHEDULE GLASS BOX */}
                <div className="rounded-xl p-3.5 sm:p-4 bg-[#2C180E]/90 border border-[#F2C14E]/35 shadow-inner grid grid-cols-1 sm:grid-cols-2 gap-3 items-center text-left">
                  {/* Left Column: Thứ, Ngày Dương, Ngày Âm */}
                  <div className="border-b sm:border-b-0 sm:border-r border-[#F2C14E]/25 pb-2.5 sm:pb-0 sm:pr-3 space-y-1 flex flex-col justify-between">
                    <span
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-sm sm:text-base font-normal uppercase text-white block tracking-wider leading-none"
                    >
                      {selectedEvent.dayOfWeekStr}
                    </span>
                    <span
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-xl sm:text-2xl font-extrabold text-[#F2C14E] block tracking-wide leading-none py-1"
                    >
                      {selectedEvent.solarDateStr}
                    </span>
                    <span
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-sm sm:text-base font-normal text-[#FFE5A3] block tracking-wide leading-none opacity-95"
                    >
                      {selectedEvent.lunarDate}
                    </span>
                  </div>

                  {/* Right Column: Giờ và Thời Khóa */}
                  <div className="space-y-2 sm:pl-2">
                    {selectedEvent.timeSlot1Time && (
                      <div>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-[11px] text-[#FFE5A3] block tracking-wide font-normal opacity-90"
                        >
                          {selectedEvent.timeSlot1Label || 'Thời Khóa'}
                        </span>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-lg sm:text-xl font-bold text-white block leading-tight"
                        >
                          {selectedEvent.timeSlot1Time}
                        </span>
                      </div>
                    )}

                    {selectedEvent.timeSlot2Time && (
                      <div>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-[11px] text-[#FFE5A3] block tracking-wide font-normal opacity-90"
                        >
                          {selectedEvent.timeSlot2Label || 'Thời Khóa Tiếp'}
                        </span>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-lg sm:text-xl font-bold text-[#F2C14E] block leading-tight"
                        >
                          {selectedEvent.timeSlot2Time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. DESCRIPTION & LOCATION */}
                <div className="space-y-1.5 text-left pt-1">
                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs text-white/90 leading-relaxed font-normal"
                  >
                    {selectedEvent.description}
                  </p>
                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs text-[#F2C14E] flex items-center gap-1.5 font-bold"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedEvent.location}</span>
                  </p>
                </div>

                {/* 5. NOTES (NẾU CÓ) */}
                {selectedEvent.notes && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-amber-200/90 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Lưu ý hành trì:
                    </span>
                    <p className="leading-relaxed">{selectedEvent.notes}</p>
                  </div>
                )}

                {/* 6. NÚT XEM CHI TIẾT BÀI VIẾT */}
                <Link
                  href={`/lich-tu-hoc/${selectedEvent.slug || toSlug(selectedEvent.title)}`}
                  className="mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A3520A] via-[#C87515] to-[#A3520A] hover:from-[#B85D0B] hover:to-[#C87515] text-white font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 border border-[#F2C14E] shadow-[0_4px_15px_rgba(200,117,21,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Xem Chi Tiết Bài Viết</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CalendarSection;
