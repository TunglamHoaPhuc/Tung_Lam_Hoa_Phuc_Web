'use client';

import { FC, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Calendar as CalendarIcon, MapPin, Clock, Tag } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import {
  getDaysInMonth,
  getStartDayOffset,
  getLunarCellString,
  getBuddhistEraYear,
} from "@/lib/lunar-calendar";

interface CalendarEvent {
  day: number;
  lunarDate: string;
  title: string;
  lunarTag: string;
  description: string;
  category: string;
  location: string;
  time: string;
  color: string;
  imgUrl: string;
}

const EVENTS_DATABASE: Record<string, CalendarEvent[]> = {
  "2026-0-3": [
    {
      day: 3,
      lunarDate: "15/11 Âm Lịch",
      title: "KHÓA LỄ SÁM NGUYỆN HẰNG THÁNG",
      lunarTag: "14 VÀ 29/30 ÂM LỊCH HẰNG THÁNG",
      description: "Sám hối hằng tháng dành cho tất cả quý Phật tử, làm mới thân tâm, tăng trưởng phước báu và tịnh hóa nghiệp chướng.",
      category: "Sám Hối Định Kỳ",
      location: "Chánh Điện Tam Bảo - Tùng Lâm Hòa Phúc",
      time: "19:00 - 21:00",
      color: "#047857",
      imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=600&h=400&fit=crop",
    },
  ],
  "2026-0-8": [
    {
      day: 8,
      lunarDate: "20/11 Âm Lịch",
      title: "THỜI KHÓA SÁU CĂN TỈNH THỨC",
      lunarTag: "CHỦ NHẬT HẰNG TUẦN",
      description: "Thời khóa thực hành chánh niệm quản lý sáu căn trong sinh hoạt hằng ngày, tọa thiền và nghe pháp thoại.",
      category: "Chánh Niệm Định Kỳ",
      location: "Giảng Đường Tùng Lâm Hòa Phúc",
      time: "08:00 - 11:00",
      color: "#3b82f6",
      imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=400&fit=crop",
    },
  ],
  "2026-0-10": [
    {
      day: 10,
      lunarDate: "22/11 Âm Lịch",
      title: "NGÀY TU HỌC AN LẠC HÔM NAY",
      lunarTag: "THỜI KHÓA AN LẠC HẰNG NGÀY",
      description: "Thời khóa tụng kinh, niệm Phật và thiền hành dành cho đại chúng tại Chánh Điện Tam Bảo.",
      category: "Ngày Hiện Tại",
      location: "Chánh Điện Tam Bảo",
      time: "07:30 - 16:30",
      color: "#f59e0b",
      imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=400&fit=crop",
    },
  ],
  "2026-0-14": [
    {
      day: 14,
      lunarDate: "26/11 Âm Lịch",
      title: "KHÓA TU MỘT NGÀY AN LẠC",
      lunarTag: "ĐỊNH KỲ HẰNG THÁNG",
      description: "Trang nghiêm khóa tu hằng tháng dành cho hàng trăm Phật tử tại gia trọn một ngày thanh tịnh.",
      category: "Khóa Tu Định Kỳ",
      location: "Đại Giảng Đường Tùng Lâm",
      time: "07:00 - 17:00",
      color: "#10b981",
      imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop",
    },
  ],
  "2026-0-19": [
    {
      day: 19,
      lunarDate: "1/12 Âm Lịch",
      title: "HUÂN TU NIỆM PHẬT MÙNG 1",
      lunarTag: "MÙNG 1 ÂM LỊCH HẰNG THÁNG",
      description: "Thời khóa huân tu trì danh niệm Phật hướng tâm Tịnh Độ, chuyển hóa phiền não.",
      category: "Huân Tu Niệm Phật",
      location: "Chánh Điện Tam Bảo",
      time: "19:00 - 21:00",
      color: "#7c3aed",
      imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop",
    },
  ],
  "2026-0-26": [
    {
      day: 26,
      lunarDate: "8/12 Âm Lịch (Vía Phật Thành Đạo)",
      title: "ĐẠI LỄ VÍA PHẬT THÀNH ĐẠO",
      lunarTag: "MÙNG 8 THÁNG CHẠP ÂM LỊCH",
      description: "Kỷ niệm ngày Đức Bản Sư Thích Ca Mâu Ni Phật thành đạo dưới cội Bồ Đề, lễ truyền đăng và văn nghệ cúng dưỡng.",
      category: "Đại Lễ Kỷ Niệm",
      location: "Khuôn Viên Tùng Lâm Hòa Phúc",
      time: "18:00 - 21:30",
      color: "#ef4444",
      imgUrl: "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=600&h=400&fit=crop",
    },
  ],
};

/**
 * Gets events for a specific date, with fallback recurring schedule so event data persists across month changes
 */
function getEventsForDate(year: number, month: number, day: number): CalendarEvent[] | null {
  const monthKey = `${year}-${month}-${day}`;
  if (EVENTS_DATABASE[monthKey]) {
    return EVENTS_DATABASE[monthKey];
  }

  const genericEvents: Record<number, CalendarEvent> = {
    3: {
      day: 3,
      lunarDate: "15 Âm Lịch",
      title: "KHÓA LỄ SÁM NGUYỆN HẰNG THÁNG",
      lunarTag: "14 VÀ 29/30 ÂM LỊCH HẰNG THÁNG",
      description: "Sám hối hằng tháng dành cho tất cả quý Phật tử, làm mới thân tâm, tăng trưởng phước báu và tịnh hóa nghiệp chướng.",
      category: "Sám Hối Định Kỳ",
      location: "Chánh Điện Tam Bảo - Tùng Lâm Hòa Phúc",
      time: "19:00 - 21:00",
      color: "#047857",
      imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=600&h=400&fit=crop",
    },
    8: {
      day: 8,
      lunarDate: "20 Âm Lịch",
      title: "THỜI KHÓA SÁU CĂN TỈNH THỨC",
      lunarTag: "CHỦ NHẬT HẰNG TUẦN",
      description: "Thời khóa thực hành chánh niệm quản lý sáu căn trong sinh hoạt hằng ngày, tọa thiền và nghe pháp thoại.",
      category: "Chánh Niệm Định Kỳ",
      location: "Giảng Đường Tùng Lâm Hòa Phúc",
      time: "08:00 - 11:00",
      color: "#3b82f6",
      imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=400&fit=crop",
    },
    10: {
      day: 10,
      lunarDate: "22 Âm Lịch",
      title: "NGÀY TU HỌC AN LẠC HÔM NAY",
      lunarTag: "THỜI KHÓA AN LẠC HẰNG NGÀY",
      description: "Thời khóa tụng kinh, niệm Phật và thiền hành dành cho đại chúng tại Chánh Điện Tam Bảo.",
      category: "Ngày Hiện Tại",
      location: "Chánh Điện Tam Bảo",
      time: "07:30 - 16:30",
      color: "#f59e0b",
      imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=400&fit=crop",
    },
    14: {
      day: 14,
      lunarDate: "26 Âm Lịch",
      title: "KHÓA TU MỘT NGÀY AN LẠC",
      lunarTag: "ĐỊNH KỲ HẰNG THÁNG",
      description: "Trang nghiêm khóa tu hằng tháng dành cho hàng trăm Phật tử tại gia trọn một ngày thanh tịnh.",
      category: "Khóa Tu Định Kỳ",
      location: "Đại Giảng Đường Tùng Lâm",
      time: "07:00 - 17:00",
      color: "#10b981",
      imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop",
    },
    19: {
      day: 19,
      lunarDate: "1 Âm Lịch",
      title: "HUÂN TU NIỆM PHẬT MÙNG 1",
      lunarTag: "MÙNG 1 ÂM LỊCH HẰNG THÁNG",
      description: "Thời khóa huân tu trì danh niệm Phật hướng tâm Tịnh Độ, chuyển hóa phiền não.",
      category: "Huân Tu Niệm Phật",
      location: "Chánh Điện Tam Bảo",
      time: "19:00 - 21:00",
      color: "#7c3aed",
      imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop",
    },
    26: {
      day: 26,
      lunarDate: "8 Âm Lịch",
      title: "ĐẠI LỄ KỶ NIỆM TÂM LINH",
      lunarTag: "ĐỊNH KỲ HẰNG THÁNG",
      description: "Thời khóa huân tu niệm Phật và pháp thoại tâm linh định kỳ hằng tháng.",
      category: "Đại Lễ Kỷ Niệm",
      location: "Khuôn Viên Tùng Lâm Hòa Phúc",
      time: "18:00 - 21:30",
      color: "#ef4444",
      imgUrl: "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=600&h=400&fit=crop",
    },
  };

  if (genericEvents[day]) {
    return [genericEvents[day]];
  }

  return null;
}

const FEATURED_PROGRAMS = [
  {
    id: "p1",
    title: "SÁM NGUYỆN",
    schedule: "14 VÀ 29/30 ÂM LỊCH HẰNG THÁNG",
    summary: "Sám hối hằng tháng dành cho tất cả mọi người, làm mới thân tâm, tăng trưởng công đức và tịnh hóa nghiệp chướng.",
    imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=600&h=400&fit=crop",
  },
  {
    id: "p2",
    title: "SÁU CĂN TỈNH THỨC",
    schedule: "CHỦ NHẬT HẰNG TUẦN",
    summary: "Thời khóa thực hành chánh niệm quản lý sáu căn trong sinh hoạt hằng ngày.",
    imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=400&fit=crop",
  },
  {
    id: "p3",
    title: "KHÓA TU TUỔI TRẺ",
    schedule: "ĐỊNH KỲ HẰNG THÁNG",
    summary: "Khóa sinh hoạt tu học kết hợp thiện nguyện và phóng sinh dành cho thanh thiếu niên.",
    imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop",
  },
  {
    id: "p4",
    title: "PHẬT THẤT NIỆM PHẬT",
    schedule: "7 NGÀY TẬP TRUNG",
    summary: "Khóa huân tu trì danh niệm Phật 7 ngày đêm hướng tâm Tịnh Độ giải thoát.",
    imgUrl: "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=600&h=400&fit=crop",
  },
  {
    id: "p5",
    title: "XUẤT GIA GIEO DUYÊN",
    schedule: "THƯỜNG NIÊN HẰNG NĂM",
    summary: "Trải nghiệm đời sống xuất gia thanh tịnh dành cho quý Phật tử hữu duyên.",
    imgUrl: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=600&h=400&fit=crop",
  },
];

export const CalendarSection: FC = () => {
  const [activeDate, setActiveDate] = useState<Date>(new Date(2026, 0, 1));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);

  const currentYear = activeDate.getFullYear();
  const currentMonth = activeDate.getMonth(); // 0-indexed

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDayOffset = getStartDayOffset(currentYear, currentMonth);
  const buddhistEra = getBuddhistEraYear(currentYear);

  const handlePrevMonth = () => {
    setActiveDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setActiveDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Carousel navigation for programs (> 3 items)
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
      {/* ── Blurred Background Image ── */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=1600&h=900&fit=crop"
          alt="Bối cảnh Lịch tu học"
          className="w-full h-full object-cover opacity-15 blur-[2px]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14] via-transparent to-[#2A1D14]" />
      </div>

      {/* ── 1. Top Section Header ── */}
      <SectionHeader
        title="LỊCH TU HỌC PHẬT LỊCH 2570"
        subtitle="THỜI KHÓA TU TẬP, SÁM HỐI VÀ ĐẠI LỄ TÂM LINH HẰNG THÁNG"
        icon={<CalendarIcon className="w-5 h-5 text-amber-400 animate-pulse" />}
      />

      {/* ── 2. Main Calendar Container ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div
          className="rounded-3xl overflow-hidden border shadow-2xl p-4 md:p-6"
          style={{
            background: "#FAF6EE",
            borderColor: "#F2C14E",
            boxShadow: "0 16px 60px rgba(0,0,0,0.6)",
            color: "#2A1D14",
          }}
        >
          {/* Thanh Điều Hướng Tháng (Calendar Toolbar) */}
          <div className="flex items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-[#3D2B1F] text-[#ffffff] shadow-md">
            {/* Nút bên trái: Icon mỏng < */}
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 rounded-xl bg-[#4A3728] text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all flex items-center justify-center cursor-pointer shadow"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Nhãn tháng ở giữa */}
            <div className="flex items-center justify-center">
              <span
                className="text-base sm:text-lg md:text-xl font-bold px-4 py-1.5 rounded-xl bg-[#4A3728] text-[#F2C14E] shadow-inner text-center"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                Tháng {String(currentMonth + 1).padStart(2, '0')}/{currentYear} (Bính Ngọ) - PL.{buddhistEra}
              </span>
            </div>

            {/* Nút bên phải: Icon mỏng > */}
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 rounded-xl bg-[#4A3728] text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all flex items-center justify-center cursor-pointer shadow"
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thanh Thứ Grid Header (To & Rõ Nét) */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-sm md:text-base uppercase py-3 bg-[#3D2B1F] text-[#F2C14E] rounded-xl mb-2 tracking-wider shadow-md" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            <div>THỨ 2</div>
            <div>THỨ 3</div>
            <div>THỨ 4</div>
            <div>THỨ 5</div>
            <div>THỨ 6</div>
            <div>THỨ 7</div>
            <div>CHỦ NHẬT</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {/* Blank offset cells */}
            {[...Array(startDayOffset)].map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[76px] md:min-h-[88px] rounded-2xl border border-transparent opacity-10" />
            ))}

            {/* Day cells */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isToday = currentYear === 2026 && currentMonth === 0 && day === 10;
              const events = getEventsForDate(currentYear, currentMonth, day);
              const lunarCellStr = getLunarCellString(day, currentMonth, currentYear);

              return (
                <div
                  key={day}
                  onClick={() => events && setSelectedEvent(events[0])}
                  className={`min-h-[76px] md:min-h-[88px] p-2 flex flex-col justify-between relative rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                    isToday
                      ? "bg-amber-500/20 border-2 border-[#F2C14E] shadow-[0_0_20px_rgba(242,193,78,0.8)] scale-105 z-10 font-bold"
                      : events
                      ? "bg-[#FFF8E7] border-[#F2C14E] hover:border-[#D9A329] hover:scale-102"
                      : "bg-white border-amber-200/60 hover:border-[#F2C14E]/60"
                  }`}
                >
                  {/* Solar Date (Rất to & Đậm) */}
                  <span className={`text-2xl md:text-3xl font-extrabold font-mono text-center pt-0.5 leading-none ${isToday ? "text-[#8B6914] font-black" : "text-[#2C1E11]"}`}>
                    {day}
                  </span>

                  {/* Event Dots (Đánh dấu ngày có sự kiện) */}
                  {events ? (
                    <div className="flex items-center justify-center gap-1 my-0.5">
                      {events.map((ev, idx) => (
                        <div
                          key={idx}
                          className="w-3 h-3 rounded-full border-2 border-white shadow-md animate-pulse"
                          style={{ background: ev.color }}
                          title={ev.title}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-3" />
                  )}

                  {/* Lunar Date */}
                  <span
                    className={`text-xs md:text-sm font-semibold font-sans text-right block leading-none pb-0.5 pr-0.5 ${
                      isToday ? "text-[#8B6914] font-bold" : "text-amber-800/80"
                    }`}
                  >
                    {lunarCellStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Pop-up Chi Tiết Sự Kiện (Tối Nền Tăng Tương Phản & Đường Kẻ Ngang Hai Bên Logo Tim) ── */}
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="relative max-w-md w-full rounded-3xl overflow-hidden shadow-2xl border transition-all animate-in zoom-in-95 bg-[#2C1E11]"
              style={{
                borderColor: "#F2C14E",
                boxShadow: "0 0 60px rgba(242,193,78,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Nút Đóng Popup */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-[#1A120B]/80 text-[#F2C14E] border border-[#F2C14E]/50 flex items-center justify-center shadow-lg hover:scale-110 cursor-pointer"
                aria-label="Đóng Pop-up"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Cover Photo Container (relative overflow-visible) */}
              <div className="relative w-full h-[210px] overflow-visible">
                <img
                  src={selectedEvent.imgUrl}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(44,30,17,1) 0%, transparent 65%)",
                  }}
                />

                {/* ── Đường kẻ ngang mảnh xuất phát từ tim logo nối sang hai bên lề ── */}
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2C14E]/80 to-transparent z-10" />

                {/* ── Biểu Tượng Tròn Nổi Đè Lên Đường Ranh Giới (Overlap 50% Top / 50% Bottom - Canva Model 100%) ── */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-[#F2C14E] bg-[#2C1E11] flex items-center justify-center z-20 shadow-2xl">
                  <span className="text-2xl text-[#F2C14E] select-none">🏯</span>
                </div>
              </div>

              {/* Content Container dưới ảnh bìa (Nền tối sẫm bg-[#2C1E11] tăng tương phản tuyệt đối) */}
              <div className="px-6 pt-10 pb-6 text-center space-y-3 bg-[#2C1E11]">
                {/* Tiêu đề sự kiện (Phát sáng Vàng Gold trên nền tối) */}
                <h3
                  className="text-3xl md:text-4xl font-normal uppercase text-[#F2C14E] leading-tight"
                  style={{
                    fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                    fontWeight: "normal",
                    textShadow: "0 0 20px rgba(242,193,78,0.6)",
                  }}
                >
                  {selectedEvent.title}
                </h3>

                {/* Ngày Âm / Lịch trình */}
                <div
                  className="text-xs uppercase font-bold text-[#F2C14E] tracking-widest block"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {selectedEvent.lunarTag}
                </div>

                {/* Phân loại & Thời gian */}
                <div
                  className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#E2C89B] pt-1"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {selectedEvent.category && (
                    <span className="flex items-center gap-1 font-semibold text-[#F2C14E]">
                      <CategoryIcon categoryName={selectedEvent.category} className="w-3.5 h-3.5 text-[#F2C14E]" />
                      {selectedEvent.category}
                    </span>
                  )}
                  {selectedEvent.time && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#FFF5E0]">
                        <Clock className="w-3.5 h-3.5 text-[#F2C14E]" /> {selectedEvent.time}
                      </span>
                    </>
                  )}
                </div>

                {/* Địa điểm */}
                {selectedEvent.location && (
                  <p
                    className="text-xs text-[#E2C89B] flex items-center justify-center gap-1.5"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#F2C14E]" /> {selectedEvent.location}
                  </p>
                )}

                {/* Nội dung mô tả chi tiết (Màu Trắng `#FFFFFF` nổi bật trên nền tối) */}
                <p
                  className="text-xs text-[#FFFFFF] leading-relaxed pt-3 border-t border-[#F2C14E]/30"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {selectedEvent.description}
                </p>

                {/* Nút Đã Hiểu */}
                <div className="pt-3">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F2C14E] text-[#2A1D14] cursor-pointer hover:bg-[#D9A329] transition-all shadow-md"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    ĐÃ HIỂU ✦
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. Header Khu Vực "CHƯƠNG TRÌNH CỘNG TU TRONG THÁNG" ── */}
        <div className="mt-16 mb-6 pb-3 border-b border-[#F2C14E]/30 flex items-end justify-between w-full">
          {/* Bên TÁI (Left-aligned): Tiêu đề phông UTM ClassizismAntiqua màu TRẮNG */}
          <h3
            className="text-xl md:text-2xl font-normal uppercase tracking-wider text-white"
            style={{
              fontFamily: "'UTM ClassizismAntiqua', 'UTM Classic Antiqua', serif",
              fontWeight: "normal",
            }}
          >
            CHƯƠNG TRÌNH CỘNG TU TRONG THÁNG
          </h3>

          {/* Bên PHẢI (Right-aligned): Biểu tượng ◇ + 2 Nút Mũi tên [ ← ] [ → ] */}
          <div className="flex items-center gap-3">
            <span className="text-[#F2C14E]/60 text-sm select-none hidden sm:inline">◇</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="w-9 h-9 rounded-full bg-[#3D2B1F] border border-[#F2C14E]/50 text-[#F2C14E] flex items-center justify-center hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all shadow cursor-pointer"
                aria-label="Khóa tu trước"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-9 h-9 rounded-full bg-[#3D2B1F] border border-[#F2C14E]/50 text-[#F2C14E] flex items-center justify-center hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all shadow cursor-pointer"
                aria-label="Khóa tu sau"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 4. Carousel / Slider Các Khóa Tu ── */}
        <div className="relative w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500">
            {visiblePrograms.map((prog) => (
              <div
                key={prog.id}
                onClick={() =>
                  setSelectedEvent({
                    day: 1,
                    lunarDate: prog.schedule,
                    title: prog.title,
                    lunarTag: prog.schedule,
                    description: prog.summary,
                    category: "Chương Trình Nổi Bật",
                    location: "Chánh Điện / Đại Giảng Đường Tùng Lâm Hòa Phúc",
                    time: "Thời khóa định kỳ",
                    color: "#F2C14E",
                    imgUrl: prog.imgUrl,
                  })
                }
                className="group rounded-2xl overflow-hidden border p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between cursor-pointer"
                style={{
                  background: "linear-gradient(160deg, rgba(74,55,40,0.6) 0%, rgba(26,15,8,0.9) 100%)",
                  borderColor: "rgba(242,193,78,0.3)",
                }}
              >
                <div className="relative overflow-hidden rounded-xl mb-3" style={{ height: 150 }}>
                  <img
                    src={prog.imgUrl}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span
                      className="text-[10px] font-bold text-[#F2C14E] bg-black/80 px-2.5 py-1 rounded uppercase tracking-wider block text-center"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {prog.schedule}
                    </span>
                  </div>
                </div>

                <div>
                  <h4
                    className="text-xl font-normal uppercase text-[#F2C14E] mb-1.5 group-hover:text-amber-200 transition-colors"
                    style={{ fontFamily: "'UTM Niagara', serif", fontWeight: "normal" }}
                  >
                    {prog.title}
                  </h4>
                  <p className="text-xs text-[#c9b896] line-clamp-2 leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {prog.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CalendarSection;
