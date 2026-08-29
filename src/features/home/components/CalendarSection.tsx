'use client';

import { FC, useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  getDaysInMonth,
  getStartDayOffset,
  getLunarCellString,
  getBuddhistEraYear,
  convertSolarToLunar,
} from "@/lib/lunar-calendar";
import {
  CalendarEvent,
  FEATURED_PROGRAMS,
  MONTH_THEMES,
  getEventsForMonth,
} from "@/data/schedule-data";

const CATEGORIES = [
  "Tất Cả",
  "Khóa Lễ Truyền Thống",
  "Đại Lễ Sự Kiện",
  "Cộng Tu",
  "Tịnh Độ Nhân Gian",
];

export const CalendarSection: FC = () => {
  // Default to August 2026 (Tháng 7 Âm Lịch Bính Ngọ Vu Lan)
  const [activeDate, setActiveDate] = useState<Date>(new Date(2026, 7, 1)); // 0-indexed: 7 = August
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất Cả");
  const [carouselIdx, setCarouselIdx] = useState(0);

  const currentYear = activeDate.getFullYear();
  const currentMonth = activeDate.getMonth(); // 0-indexed (0 to 11)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDayOffset = getStartDayOffset(currentYear, currentMonth);
  const buddhistEra = getBuddhistEraYear(currentYear);

  // Month Theme Info (Banner, Quote, Colors)
  const monthTheme = useMemo(() => {
    return MONTH_THEMES[currentMonth] || MONTH_THEMES[0];
  }, [currentMonth]);

  // Dynamic automatic calculation of all events for this month
  const monthEventsMap = useMemo(() => {
    return getEventsForMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

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

  // Carousel navigation for programs
  const maxSlide = Math.max(0, FEATURED_PROGRAMS.length - 3);
  const handlePrevSlide = () => {
    setCarouselIdx((prev) => (prev > 0 ? prev - 1 : maxSlide));
  };
  const handleNextSlide = () => {
    setCarouselIdx((prev) => (prev < maxSlide ? prev + 1 : 0));
  };

  const visiblePrograms = FEATURED_PROGRAMS.slice(carouselIdx, carouselIdx + 3);

  return (
    <section className="w-full py-20 relative overflow-hidden bg-[#2A1D14]">
      {/* ── Background Ambient Aura ── */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={monthTheme.bannerImg}
          alt="Bối cảnh Lịch tu học"
          className="w-full h-full object-cover opacity-15 blur-sm"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14] via-transparent to-[#2A1D14]" />
      </div>

      {/* ── 1. Top Section Header ── */}
      <SectionHeader
        title={`LỊCH TU HỌC PHẬT LỊCH ${buddhistEra}`}
        subtitle={`THỜI KHÓA TU TẬP, SÁM HỐI VÀ ĐẠI LỄ TÂM LINH ĐỊNH KỲ NĂM BÍNH NGỌ ${currentYear}`}
        icon={<CalendarIcon className="w-5 h-5 text-amber-400 animate-pulse" />}
      />

      {/* ── 2. Unified Side-by-Side Calendar Container ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-6">

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-md uppercase tracking-wider ${selectedCategory === cat
                  ? "bg-[#F2C14E] text-[#1C120B] border-2 border-white shadow-[0_0_15px_rgba(242,193,78,0.7)] scale-105"
                  : "bg-[#1C120B]/90 text-[#FFE5A3] border border-[#F2C14E]/40 hover:bg-[#F2C14E] hover:text-[#1C120B]"
                }`}
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            BỐ CỤC NỔI 3D TRÊN BACKGROUND: KHÔNG KHUNG BAO NGOÀI, TỈ LỆ VÀNG 17x19CM
        ══════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-7">

          {/* ── 1. CỘT TRÁI: TRANH THÁNG NGHỆ THUẬT LIỀN KHỐI (CHUẨN TỶ LỆ 17x19CM, CỐ ĐỊNH CHIỀU CAO) ── */}
          <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 rounded-3xl bg-gradient-to-b from-[#2A170F] via-[#201007] to-[#150A04] border border-[#F2C14E]/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col justify-between overflow-hidden transition-all min-h-[530px] md:min-h-[550px]">

            {/* 1.1 TRANH MINH HỌA NGHỆ THUẬT (Đúng tỷ lệ tự nhiên, không bị cắt mất chân chữ) */}
            <div className="relative w-full aspect-[1200/1015] shrink-0 overflow-hidden bg-black/30">
              <img
                src={monthTheme.bannerImg}
                alt={monthTheme.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-102"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg';
                }}
              />

              {/* Lớp gradient đậm sát mép đáy che kín hoàn toàn chi tiết thừa mà không chạm vào chữ */}
              <div className="absolute inset-x-0 bottom-0 h-4 sm:h-5 bg-gradient-to-t from-[#201007] from-35% via-[#201007]/90 to-transparent pointer-events-none" />
            </div>

            {/* Đường chỉ vàng kim phân định chính xác giữa ảnh và phần quote */}
            <div className="flex items-center justify-center gap-2 w-full px-5 py-2 shrink-0 opacity-85">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
              <span className="text-[#F2C14E] text-xs select-none drop-shadow-[0_0_6px_rgba(242,193,78,0.7)]">❖</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#F2C14E]/60 to-[#F2C14E]" />
            </div>

            {/* 1.2 KHỐI NỘI DUNG QUOTE & TÁC GIẢ */}
            <div className="p-4 sm:p-5 pt-0 flex-1 flex flex-col justify-between items-center text-center">

              {/* Câu Quote: Thơ căn giữa - Văn xuôi căn đều 2 bên đoạn văn */}
              <div className="w-full flex-1 flex flex-col justify-center my-auto py-1">
                {(() => {
                  // Phân loại tháng là Thơ (2, 4, 5, 6, 11) hay Văn xuôi
                  const isPoem = [1, 3, 4, 5, 10].includes(currentMonth);

                  if (isPoem) {
                    // THƠ: Căn giữa, ngắt dòng từng câu
                    return (
                      <div className="space-y-1 my-auto">
                        {monthTheme.quoteLines.map((line, idx) => {
                          if (line === "") return <div key={idx} className="h-1" />;
                          const cleanLine = line.replace(/[“”"']/g, '').trim();
                          if (!cleanLine) return null;
                          const isLong = monthTheme.quoteLines.length > 5;

                          return (
                            <p
                              key={idx}
                              style={{ fontFamily: "'UTM Avo', sans-serif" }}
                              className={`leading-relaxed tracking-wide text-center ${idx === 0
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
                    // VĂN XUÔI: Căn 2 bên (text-justify), viết liền đoạn văn, in đậm câu đầu
                    const cleanLines = monthTheme.quoteLines
                      .map((l) => l.replace(/[“”"']/g, '').trim())
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

              {/* 1.3 HUY HIỆU TÁC GIẢ (Font UTM Niagara, nhỏ gọn trang nhã) */}
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

          {/* ── 2. CỘT PHẢI: BẢNG LỊCH CỐ ĐỊNH 6 HÀNG (42 Ô) - ĐỒNG BỘ CHIỀU CAO ── */}
          <div className="flex-1 rounded-3xl p-4 sm:p-5 md:p-6 bg-gradient-to-b from-[#2A170F]/95 via-[#1D0F08]/95 to-[#140A04]/98 border border-[#F2C14E]/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col justify-between space-y-3 transition-all min-h-[530px] md:min-h-[550px]">

            {/* 2.1 THANH ĐIỀU HƯỚNG THÁNG & PHẬT LỊCH / DƯƠNG LỊCH (Chuyển lên trên bảng lịch, nút tròn/pill đẹp mắt) */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-black/55 border border-[#F2C14E]/35 shadow-inner">
              {/* Nút lùi tháng (nút tròn) */}
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#3D2210] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-[#1C0F08] transition-all flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Nhãn Tháng Dương Lịch & Phật Lịch dạng nút tròn / pill nổi bật */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Pill 1: Tháng Dương Lịch */}
                <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#A3520A] via-[#C87515] to-[#A3520A] border border-[#F2C14E] shadow-sm">
                  <span className="text-xs select-none">🪷</span>
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs sm:text-sm font-black uppercase tracking-wider text-white"
                  >
                    THÁNG {String(currentMonth + 1).padStart(2, '0')} / {currentYear}
                  </span>
                  <span className="text-xs select-none">🪷</span>
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

              {/* Nút tiến tháng (nút tròn) */}
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#3D2210] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-[#1C0F08] transition-all flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95"
                aria-label="Tháng sau"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* 2.2 Header thứ trong tuần (T2, T3, T4, T5, T6, T7, CN) */}
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

            {/* 2.3 Lưới 42 Ô Cố Định (6 Hàng x 7 Cột) - Đảm bảo lịch không bao giờ nhảy chiều cao */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center flex-1">
              {(() => {
                // Xây dựng cố định 42 ô (6 hàng x 7 cột)
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
                        className="min-h-[50px] sm:min-h-[56px] md:min-h-[60px] rounded-xl border border-transparent opacity-0 pointer-events-none"
                      />
                    );
                  }

                  const hasEvent = cell.events.length > 0;

                  return (
                    <div
                      key={`day-${cell.dayNumber}`}
                      onClick={() => hasEvent && setSelectedEvent(cell.events[0])}
                      className={`min-h-[50px] sm:min-h-[56px] md:min-h-[60px] p-1 sm:p-1.5 flex flex-col justify-between relative rounded-xl border transition-all duration-200 ${hasEvent
                          ? "bg-gradient-to-b from-[#4A2C14]/90 to-[#2A1608]/95 border-[#F2C14E] shadow-[0_0_15px_rgba(242,193,78,0.4)] hover:border-[#FFDE59] hover:scale-105 cursor-pointer"
                          : "bg-black/45 border-[#F2C14E]/20 hover:border-[#F2C14E]/60 hover:bg-black/65 cursor-pointer"
                        }`}
                    >
                      {/* Số Ngày Dương (To, Rõ Ràng, Font UTM Avo Đậm) */}
                      <span
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className={`text-base sm:text-xl md:text-2xl font-black text-center leading-none ${cell.isSunday
                            ? "text-[#FFDE59] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                            : "text-white"
                          }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {/* Chấm sự kiện tu học phát sáng */}
                      {hasEvent ? (
                        <div className="flex items-center justify-center gap-1 my-0.5">
                          {cell.events.map((ev, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white shadow-md animate-pulse"
                              style={{ background: ev.color }}
                              title={ev.title}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="h-1" />
                      )}

                      {/* Ngày Âm Lịch (Đầy đủ, nổi bật Sóc/Vọng & Sám hối) */}
                      <div className="flex items-center justify-end pr-0.5">
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className={`text-[9px] sm:text-[10px] md:text-[11px] font-bold rounded px-1 leading-tight ${cell.isFirstOrFullMoon
                              ? "bg-[#DC2626] text-white shadow-sm font-black"
                              : cell.isSamHoi
                                ? "text-[#FFC107] font-bold"
                                : "text-amber-200/80"
                            }`}
                        >
                          {cell.lunarCellStr}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            POPUP POSTER MODEL (BRING TO FRONT Z-[9999], TỶ LỆ VÀNG, KHÔNG LỘ VIỀN NỀN)
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
                {/* Tiêu đề phụ 1 */}
                <p
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-2xl sm:text-3xl text-[#FFE5A3] uppercase tracking-widest leading-none"
                >
                  {selectedEvent.subTitle1 || selectedEvent.lunarTag || "CỘNG TU"}
                </p>

                {/* Tiêu đề chính */}
                <div className="inline-block px-5 py-1.5 rounded-xl bg-gradient-to-r from-[#A3520A] via-[#C87515] to-[#A3520A] border border-[#F2C14E] shadow-[0_0_20px_rgba(200,117,21,0.5)]">
                  <h3
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-base sm:text-lg font-bold uppercase text-white tracking-wider leading-snug"
                  >
                    {selectedEvent.title}
                  </h3>
                </div>

                {/* Tiêu đề phụ 2 */}
                <p
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs text-[#FFE5A3] italic opacity-90"
                >
                  {selectedEvent.subTitle2 || selectedEvent.location}
                </p>

                {/* 3. POSTER SCHEDULE GLASS BOX (TỶ LỆ VÀNG) */}
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
                          {selectedEvent.timeSlot1Label}
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
                          {selectedEvent.timeSlot2Label}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CalendarSection;
