'use client';

import { FC, useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
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
  parseSolarDateStr,
  formatSolarDateStr,
  calcDaysDifference,
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

export function cleanEventTitle(title?: string): string {
  if (!title) return '';
  let t = title.trim();
  // Nếu bắt đầu bằng "KHÓA LỄ " hoặc "Khóa lễ " hoặc "Khóa Lễ "
  if (/^khóa lễ\s+/i.test(t)) {
    t = t.replace(/^khóa lễ\s+/i, '').trim();
  }
  return t;
}

/**
 * Chống nhảy chữ rớt từ đơn (Orphan words) và hỗ trợ ngắt dòng chủ động:
 * 1. Nếu có ký tự '|' -> ngắt dòng chủ động theo ý biên tập viên.
 * 2. Thay khoảng trắng giữa 2 từ cuối cùng bằng \u00A0 (non-breaking space) để từ cuối cùng không bao giờ bị rớt lại 1 mình.
 */
export function formatBalancedTitle(title?: string): string {
  if (!title) return '';
  let t = cleanEventTitle(title);

  // Nếu người quản trị chủ động ngắt dòng bằng '|'
  if (t.includes('|')) {
    return t.replace(/\s*\|\s*/g, '\n');
  }

  // Chống rớt 1 từ đơn lẻ xuống dòng (Orphan Word Prevention)
  const words = t.split(/\s+/);
  if (words.length >= 3) {
    const lastTwo = words.slice(-2).join('\u00A0');
    return [...words.slice(0, -2), lastTwo].join(' ');
  }
  return t;
}

/**
 * Tự động tính toán cỡ chữ linh hoạt theo độ dài tiêu đề (Fluid Typography)
 */
export function getAdaptiveTitleClasses(title?: string): { fontSize: string; lineHeight: string; tracking: string } {
  if (!title) {
    return {
      fontSize: 'text-4xl sm:text-5xl md:text-[50px]',
      lineHeight: 'leading-none',
      tracking: 'tracking-normal',
    };
  }

  const clean = cleanEventTitle(title);
  const len = clean.length;
  const wordCount = clean.split(/\s+/).length;

  if (len <= 14 && wordCount <= 3) {
    // Ngắn: "ĐẠI SÁM HỐI", "TIỂU SÁM HỐI", "CẦU AN"
    return {
      fontSize: 'text-4xl sm:text-5xl md:text-[50px]',
      lineHeight: 'leading-none',
      tracking: 'tracking-wide',
    };
  } else if (len <= 22) {
    // Vừa: "LÃO TỔ SƯ NGỘ CHÂN TỬ", "PHÁP HỘI NIỆM PHẬT", "LƯƠNG HOÀNG SÁM"
    return {
      fontSize: 'text-3xl sm:text-4xl md:text-[40px]',
      lineHeight: 'leading-tight',
      tracking: 'tracking-normal',
    };
  } else if (len <= 32) {
    // Dài: "ĐẠI LỄ TRI ÂN CHA MẸ MÙA VU LAN"
    return {
      fontSize: 'text-2xl sm:text-3xl md:text-[34px]',
      lineHeight: 'leading-tight',
      tracking: 'tracking-normal',
    };
  } else {
    // Rất dài: > 32 ký tự
    return {
      fontSize: 'text-xl sm:text-2xl md:text-[28px]',
      lineHeight: 'leading-snug',
      tracking: 'tracking-tight',
    };
  }
}

export function getDisplaySubtitle(event?: { subtitle?: string; subTitle1?: string; category?: string } | null): string | null {
  if (!event) return null;
  const sub = (event.subtitle || event.subTitle1 || '').trim();
  if (!sub) return null;
  // Bỏ chữ "KHÓA LỄ TRUYỀN THỐNG" / "Khóa Lễ Truyền Thống" / "KHOA LE TRUYEN THONG"
  const normalized = sub
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
  if (normalized === 'khoa le truyen thong') {
    return null;
  }
  return sub;
}

export const CalendarSection: FC = () => {
  // Mặc định mở Tháng 10 Dương Lịch 2026 (Tương ứng Tháng 9 Âm Lịch Bính Ngọ - Học Hạnh Buông Xả)
  const [activeDate, setActiveDate] = useState<Date>(new Date(2026, 9, 1));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất Cả");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Khóa cuộn trang nền khi mở pop-up xem chi tiết thời khóa
  useEffect(() => {
    if (selectedEvent) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedEvent]);

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
        const res = await fetch(`/api/admin/schedule?t=${Date.now()}`, {
          cache: 'no-store',
          next: { revalidate: 0 },
        });
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
    // Bổ sung slug mặc định cho các sự kiện cơ bản và cập nhật cấu hình từ featuredPrograms (nếu admin có sửa)
    Object.keys(baseMap).forEach((dayKey) => {
      const d = Number(dayKey);
      baseMap[d] = baseMap[d].map((ev) => {
        let enhancedEv = {
          ...ev,
          slug: ev.slug || toSlug(ev.title),
        };

        if (dbData?.featuredPrograms && Array.isArray(dbData.featuredPrograms)) {
          const matchedProg = dbData.featuredPrograms.find((p: any) => {
            const pTitle = (p.title || '').toLowerCase().trim();
            const evTitle = (ev.title || '').toLowerCase().trim();
            if (!pTitle) return false;
            if (evTitle.includes(pTitle) || pTitle.includes(evTitle)) return true;
            if (evTitle.includes('tiểu sám hối') && pTitle.includes('tiểu sám hối')) return true;
            if (evTitle.includes('đại sám hối') && pTitle.includes('đại sám hối')) return true;
            if ((evTitle.includes('cầu an') || evTitle.includes('quốc thái')) && (pTitle.includes('cầu an') || pTitle.includes('quốc thái'))) return true;
            if (evTitle.includes('niệm phật') && pTitle.includes('niệm phật')) return true;
            return false;
          });
          if (matchedProg) {
            enhancedEv = {
              ...enhancedEv,
              title: (matchedProg.title && matchedProg.title.trim()) || enhancedEv.title,
              subtitle: matchedProg.subtitle !== undefined ? matchedProg.subtitle : enhancedEv.subtitle,
              subTitle1: matchedProg.subtitle || enhancedEv.subTitle1,
              timeSlot1Time: (matchedProg.time && matchedProg.time.trim()) || (matchedProg.schedule && matchedProg.schedule.trim()) || enhancedEv.timeSlot1Time,
              timeSlot2Time: (matchedProg.duration && matchedProg.duration.trim()) || enhancedEv.timeSlot2Time,
              location: (matchedProg.location && matchedProg.location.trim()) ? matchedProg.location.trim() : enhancedEv.location,
              description: (matchedProg.summary && matchedProg.summary.trim()) || enhancedEv.description,
              imgUrl: (matchedProg.imgUrl && matchedProg.imgUrl.trim()) || enhancedEv.imgUrl,
              imgPositionY: matchedProg.imgPositionY !== undefined ? matchedProg.imgPositionY : enhancedEv.imgPositionY,
            };
          }
        }

        return enhancedEv;
      });
    });

    // Nếu người quản trị đã xóa khóa lễ khỏi featuredPrograms (ví dụ: Pháp Hội Niệm Phật), tự động lọc bỏ khỏi baseMap
    if (dbData?.featuredPrograms && Array.isArray(dbData.featuredPrograms)) {
      const hasNiemPhat = dbData.featuredPrograms.some((p: any) =>
        (p.title || '').toLowerCase().includes('niệm phật') || (p.title || '').toLowerCase().includes('niem phat')
      );
      if (!hasNiemPhat) {
        Object.keys(baseMap).forEach((dayKey) => {
          const d = Number(dayKey);
          baseMap[d] = baseMap[d].filter((ev) => !ev.title.toLowerCase().includes('niệm phật'));
          if (baseMap[d].length === 0) {
            delete baseMap[d];
          }
        });
      }
    }

    if (dbData?.customEvents && Array.isArray(dbData.customEvents)) {
      dbData.customEvents.forEach((ce: any) => {
        const isMulti = !!(ce.isMultiDay || (ce.endDateStr && ce.endDateStr.trim() !== '' && ce.endDateStr.trim() !== ce.solarDateStr.trim()));
        const startDate = parseSolarDateStr(ce.solarDateStr);
        const endDate = isMulti && ce.endDateStr ? parseSolarDateStr(ce.endDateStr) : startDate;

        if (!startDate) return;

        const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
        const coreEndTime = endDate
          ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime()
          : startTime;

        const continueUntilDate = (ce.continueChanting && ce.continueChantingUntil)
          ? parseSolarDateStr(ce.continueChantingUntil)
          : null;
        const finalEndTime = continueUntilDate && continueUntilDate.getTime() > coreEndTime
          ? new Date(continueUntilDate.getFullYear(), continueUntilDate.getMonth(), continueUntilDate.getDate()).getTime()
          : coreEndTime;

        // Phủ sự kiện vào tất cả các ngày d trong tháng hiện tại nằm trong khoảng [startDate, finalEndTime]
        for (let d = 1; d <= daysInMonth; d++) {
          const currentDate = new Date(currentYear, currentMonth, d);
          const currentTime = currentDate.getTime();

          if (currentTime >= startTime && currentTime <= finalEndTime) {
            // Loại bỏ sự kiện mặc định bị trùng lặp hoặc mâu thuẫn trong ngày d
            if (baseMap[d]) {
              const ceTitleLower = (ce.title || '').toLowerCase().trim();
              baseMap[d] = baseMap[d].filter((ev) => {
                const evTitleLower = (ev.title || '').toLowerCase().trim();
                if (evTitleLower === ceTitleLower) return false;
                if (
                  (ceTitleLower.includes('ngũ bách danh') || ceTitleLower.includes('quan am') || ceTitleLower.includes('quán âm')) &&
                  (evTitleLower.includes('quán thế âm') || evTitleLower.includes('ngũ bách danh'))
                ) {
                  return false;
                }
                return true;
              });
            }

            const lunar = convertSolarToLunar(d, currentMonth, currentYear);
            const isCongTu = ce.category === 'Cộng Tu';

            // Phân biệt các giai đoạn:
            // 1. Giai đoạn khóa tu chính: currentTime <= coreEndTime
            // 2. Giai đoạn tụng kinh duy trì tiếp: currentTime > coreEndTime && currentTime < finalEndTime
            // 3. Ngày tạ đàn hoàn mãn: currentTime === finalEndTime && currentTime > coreEndTime
            const isChantingFinalDay = currentTime === finalEndTime && currentTime > coreEndTime;
            const isChantingExtension = currentTime > coreEndTime && currentTime < finalEndTime;
            const isCoreLastDay = currentTime === coreEndTime;

            // Tính multiDayInfo
            let multiDayInfo = undefined;
            if (isMulti) {
              const totalDays = Math.max(1, Math.round((coreEndTime - startTime) / 86400000) + 1);
              const currentDayIndex = Math.max(1, Math.round((currentTime - startTime) / 86400000) + 1);
              multiDayInfo = {
                totalDays,
                currentDayIndex,
                isFirstDay: currentDayIndex === 1,
                isLastDay: isCoreLastDay,
                startDateStr: ce.solarDateStr,
                endDateStr: ce.endDateStr,
                isChantingExtension,
                isChantingFinalDay,
              };
            }

            // Tự động xử lý giờ thời khóa và lưu ý hành trì:
            let eventTime = ce.timeSlot1Time || '08h00';
            let eventNotes = ce.notes || '';
            let eventSubtitle = ce.subtitle || '';
            let eventSubTitle1 = ce.subtitle || (isCongTu ? 'Cộng tu' : 'Đại lễ sự kiện');

            if (isCoreLastDay) {
              // Ngày kết khóa chính
              if (ce.endDayTime && ce.endDayTime.trim()) {
                eventTime = ce.endDayTime.trim();
              }
              if (ce.continueChanting && ce.continueChantingUntil) {
                const rawName = (ce.continueChantingName && ce.continueChantingName.trim()) || ce.title;
                const chantName = rawName.toLowerCase().startsWith('kinh') ? rawName : `Kinh ${rawName}`;
                const autoNotice = `❖ Lưu ý: Thời khóa tụng ${chantName} sẽ được tiếp tục duy trì tụng tiếp đến ngày ${ce.continueChantingUntil}.`;
                eventNotes = eventNotes ? `${eventNotes}\n\n${autoNotice}` : autoNotice;
              }
            } else if (isChantingFinalDay) {
              // Ngày Tạ Đàn tự động
              eventSubtitle = 'Tạ đàn';
              eventSubTitle1 = 'Tạ đàn';
              const autoNotice = `❖ Lễ Tạ đàn hoàn mãn thời khóa tụng kinh.`;
              eventNotes = eventNotes ? `${eventNotes}\n\n${autoNotice}` : autoNotice;
            } else if (isChantingExtension) {
              // Ngày tụng kinh tiếp
              eventSubtitle = 'Tụng kinh tiếp';
              eventSubTitle1 = 'Tụng kinh tiếp';
            }

            const customEvt: CalendarEvent = {
              id: isChantingFinalDay || isChantingExtension ? `${ce.id}-chant-${d}` : ce.id,
              day: d,
              solarDateStr: `${String(d).padStart(2, '0')}.${String(currentMonth + 1).padStart(2, '0')}.${currentYear}`,
              endDateStr: ce.endDateStr,
              isMultiDay: isMulti,
              multiDayInfo,
              dayOfWeekStr: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][currentDate.getDay()],
              lunarDate: `(${String(lunar.day).padStart(2, '0')}.${String(lunar.month).padStart(2, '0')}.ÂL)`,
              lunarTag: isCongTu ? 'CỘNG TU' : 'SỰ KIỆN',
              subTitle1: eventSubTitle1,
              title: ce.title,
              subtitle: eventSubtitle,
              subTitle2: ce.location || 'Tùng Lâm Hòa Phúc',
              description: ce.description || '',
              category: ce.category || 'Đại Lễ Sự Kiện',
              location: ce.location || 'Tùng Lâm Hòa Phúc',
              timeSlot1Label: isCoreLastDay && ce.endDayTime ? 'Thời Khóa Kết Khóa' : (ce.timeSlot1Label || 'Thời Khóa'),
              timeSlot1Time: eventTime,
              timeSlot2Label: ce.timeSlot2Label,
              timeSlot2Time: ce.timeSlot2Time,
              color: isCongTu ? '#10B981' : '#F2C14E',
              imgUrl: ce.imgUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
              imgPositionY: ce.imgPositionY !== undefined ? ce.imgPositionY : 50,
              isImportant: true,
              slug: ce.slug || toSlug(ce.title),
              notes: eventNotes,
              endDayType: ce.endDayType,
              endDayLabel: ce.endDayLabel,
              endDayTime: ce.endDayTime,
              continueChanting: ce.continueChanting,
              continueChantingUntil: ce.continueChantingUntil,
              continueChantingName: ce.continueChantingName,
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
  // Tối ưu: Gộp (Deduplicate) các sự kiện kéo dài nhiều ngày để CHỈ HIỆN 1 SLIDE DUY NHẤT
  type SlideItem =
    | { type: 'theme'; day: null }
    | { type: 'event'; day: number; event: CalendarEvent };

  const slides: SlideItem[] = useMemo(() => {
    const seenEventKeys = new Set<string>();
    const uniqueEvents: CalendarEvent[] = [];

    allMonthEvents.forEach((ev) => {
      const key = ev.id ? String(ev.id) : `${ev.title}_${ev.category}`;
      if (!seenEventKeys.has(key)) {
        seenEventKeys.add(key);
        uniqueEvents.push(ev);
      }
    });

    const eventSlides: SlideItem[] = uniqueEvents.map((ev) => ({
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

  // Xác định sự kiện đang được kích hoạt highlight từ Slide cột trái (áp dụng cho toàn chuỗi ngày)
  const activeHighlightedEvent = useMemo(() => {
    const cur = slides[activeSlideIdx];
    if (cur && cur.type === 'event') {
      return cur.event;
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
      const clickedEv = dayEvents[0];
      const targetIdx = slides.findIndex(
        (s) =>
          s.type === 'event' &&
          (s.event.id === clickedEv.id || (s.event.title && s.event.title === clickedEv.title))
      );
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
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                    style={{
                      objectPosition: `center ${currentSlide.event.imgPositionY ?? 50}%`,
                    }}
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
                  <div className="space-y-1.5 my-auto w-full">
                    {/* Sub Tiêu Đề NẰM Ở TRÊN - Lọc bỏ chữ mặc định "KHÓA LỄ TRUYỀN THỐNG", chỉ hiện khi có tiêu đề phụ thực tế, font UTM Avo */}
                    {(() => {
                      const cleanSub = getDisplaySubtitle(currentSlide.event);
                      return cleanSub ? (
                        <p
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-sm sm:text-base md:text-[18px] text-amber-200/95 font-medium italic normal-case tracking-wide line-clamp-1 w-full text-center"
                        >
                          {cleanSub}
                        </p>
                      ) : null;
                    })()}

                    {/* Tiêu Đề Chính NẰM Ở DƯỚI - Tự động co giãn kích thước, cân bằng dòng text-wrap: balance, chống nhảy chữ */}
                    {(() => {
                      const titleStr = cleanEventTitle(currentSlide.event.title);
                      const styleInfo = getAdaptiveTitleClasses(titleStr);
                      const formatted = formatBalancedTitle(titleStr);

                      return (
                        <h3
                          style={{
                            fontFamily: "'UTM Niagara', serif",
                            textWrap: 'balance',
                            whiteSpace: formatted.includes('\n') ? 'pre-line' : 'normal',
                          }}
                          className={`${styleInfo.fontSize} ${styleInfo.lineHeight} ${styleInfo.tracking} font-normal uppercase text-[#FFDE59] drop-shadow-[0_0_16px_rgba(255,222,89,0.65)] w-full text-center mt-1.5 px-0.5`}
                        >
                          {formatted}
                        </h3>
                      );
                    })()}

                    {/* Khung Thời Gian, Thời Lượng & Vị Trí - Xếp DỌC: Thời gian ghi riêng, Thời lượng xuống dòng ghi riêng */}
                    <div
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="flex flex-col items-center justify-center gap-2 pt-2.5 w-full"
                    >
                      {/* Dòng 1: Thời Gian Bắt Đầu (Ghi riêng, chữ to rõ, dùng icon Lịch Tu Học) */}
                      <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-bold text-[#FFDE59] tracking-wide">
                        <img
                          src="/images/icons/icon-lich-tu-hoc.webp"
                          alt="Thời gian"
                          className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(242,193,78,0.6)]"
                        />
                        <span>{currentSlide.event.timeSlot1Time || '08h00'}</span>
                      </div>

                      {/* Huy hiệu chuỗi ngày nếu là Khóa tu nhiều ngày */}
                      {currentSlide.event.multiDayInfo && (
                        <div
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="flex items-center justify-center gap-1.5 text-xs sm:text-[13px] text-[#FFDE59] font-bold tracking-wide px-3 py-1 rounded-full bg-[#F2C14E]/20 border border-[#F2C14E]/40 shadow-xs"
                        >
                          <Clock className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
                          <span>Kỳ hạn: {currentSlide.event.multiDayInfo.totalDays} ngày</span>
                        </div>
                      )}

                      {/* Dòng 2: Thời Lượng (Xuống dòng ghi riêng nếu có) */}
                      {currentSlide.event.timeSlot2Time && (
                        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-[13.5px] text-[#FFE5A3]/95 font-medium tracking-wide">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F2C14E] shrink-0 drop-shadow-[0_0_6px_rgba(242,193,78,0.5)]" />
                          <span>
                            {currentSlide.event.timeSlot2Time.toLowerCase().includes('phút') ||
                            currentSlide.event.timeSlot2Time.toLowerCase().includes('giờ') ||
                            currentSlide.event.timeSlot2Time.toLowerCase().includes('ngày')
                              ? `Thời lượng: ${currentSlide.event.timeSlot2Time}`
                              : currentSlide.event.timeSlot2Label && !currentSlide.event.timeSlot2Label.toLowerCase().includes('tiếp')
                              ? `${currentSlide.event.timeSlot2Label}: ${currentSlide.event.timeSlot2Time}`
                              : currentSlide.event.timeSlot2Time}
                          </span>
                        </div>
                      )}

                      {/* Dòng 3: Vị Trí / Địa Điểm (Dùng icon Các Khu Vực Nổi Bật) */}
                      <div className="flex items-center justify-center gap-2 text-xs sm:text-[13.5px] text-[#FFE5A3]/95 font-medium tracking-wide">
                        <img
                          src="/images/icons/icon-cac-khu-vuc-noi-bat.webp"
                          alt="Địa điểm"
                          className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(242,193,78,0.6)]"
                        />
                        <span>{currentSlide.event.location || 'Tùng Lâm Hòa Phúc'}</span>
                      </div>
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
                  // ĐỒNG BỘ VIỀN VÀNG: Ô ngày trùng khớp với sự kiện trên Slide Cột Trái (toàn dải ngày)
                  const isHighlightedBySlide =
                    activeHighlightedEvent !== null &&
                    cell.events.some(
                      (e) =>
                        (e.id && e.id === activeHighlightedEvent.id) ||
                        (e.title && e.title === activeHighlightedEvent.title)
                    );

                  // Kiểm tra ô này có chứa khóa tu nhiều ngày không
                  const multiDayEvent = cell.events.find((e) => e.multiDayInfo);

                  return (
                    <div
                      key={`day-${cell.dayNumber}`}
                      onClick={() => handleDayCellClick(cell.dayNumber, cell.events)}
                      className={`min-h-[58px] sm:min-h-[64px] md:min-h-[68px] p-1 sm:p-1.5 flex flex-col justify-between relative rounded-xl transition-all duration-300 cursor-pointer group/cell ${
                        isHighlightedBySlide
                          ? "border-2 border-[#FFDE59] shadow-[0_0_25px_rgba(255,222,89,0.95)] ring-2 ring-[#FFDE59]/70 scale-105 z-20 bg-gradient-to-b from-[#633B18] via-[#4A260F] to-[#2B1408] hover:z-50"
                          : multiDayEvent
                          ? "bg-[#25150C]/90 border border-[#F2C14E]/50 shadow-[0_0_10px_rgba(242,193,78,0.2)] hover:border-[#FFDE59] hover:bg-[#351C0F] z-10 hover:z-50"
                          : "bg-black/45 border border-[#F2C14E]/20 hover:border-[#F2C14E]/60 hover:bg-black/65 z-10 hover:z-50"
                      }`}
                    >
                      {/* Hàng trên: Số ngày dương & Ngày âm */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className={`text-sm sm:text-base md:text-lg font-black leading-none ${
                            isHighlightedBySlide
                              ? "text-[#FFDE59] drop-shadow-[0_0_8px_rgba(255,222,89,0.9)]"
                              : multiDayEvent
                              ? "text-[#FFDE59]"
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
                                {/* Logo Biểu Tượng Nằm Trực Tiếp Trên Nền Ô */}
                                <img
                                  src={iconUrl}
                                  alt={ev.title}
                                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                />

                                {/* Tooltip Gọn Gàng 2 Dòng: Sub-tiêu đề ở trên, Tiêu đề chính ở dưới */}
                                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[220px] sm:max-w-[250px] px-2.5 py-1.5 rounded-xl bg-[#1C0F08]/98 border border-[#FFDE59] shadow-[0_10px_25px_rgba(0,0,0,0.95)] backdrop-blur-xl opacity-0 group-hover/icon:opacity-100 transition-all duration-200 z-[100] text-center transform scale-95 group-hover/icon:scale-100">
                                  {/* Dòng 1 (Ở TRÊN): Sub-tiêu đề (Lấy từ edit + bổ sung tiến trình ngày, tự động Tạ đàn / Kết khóa) */}
                                  <div
                                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                    className="text-[10px] sm:text-[11px] text-amber-200/90 italic font-normal leading-tight"
                                  >
                                    {(() => {
                                      const rawSub = getDisplaySubtitle(ev);
                                      if (ev.multiDayInfo) {
                                        if (ev.multiDayInfo.isChantingFinalDay) {
                                          return '(Tạ đàn)';
                                        }
                                        if (ev.multiDayInfo.isChantingExtension) {
                                          return '(Tụng kinh tiếp)';
                                        }

                                        const baseSub = rawSub
                                          ? rawSub.replace(/\s*\((Khai Đàn|Khai đàn|Tạ đàn|Hoàn Mãn|Kết khóa|Kết khoá|ngày\s*\d+\/\d+)[^)]*\)/gi, '').trim()
                                          : '';

                                        // Nhận diện tính chất: Pháp hội (Tạ đàn) vs Cộng tu (Kết khóa)
                                        const isPhapHoi =
                                          ev.category === 'Đại Lễ Sự Kiện' ||
                                          (ev.title || '').toLowerCase().includes('pháp hội') ||
                                          (ev.title || '').toLowerCase().includes('sám') ||
                                          (rawSub || '').toLowerCase().includes('pháp hội');

                                        let suffix = `ngày ${ev.multiDayInfo.currentDayIndex}/${ev.multiDayInfo.totalDays}`;
                                        if (ev.multiDayInfo.isFirstDay) {
                                          suffix = isPhapHoi
                                            ? `Khai đàn - ngày 1/${ev.multiDayInfo.totalDays}`
                                            : `Khai khóa - ngày 1/${ev.multiDayInfo.totalDays}`;
                                        } else if (ev.multiDayInfo.isLastDay) {
                                          if (ev.continueChanting) {
                                            suffix = `Kết khóa`;
                                          } else if (ev.endDayLabel) {
                                            suffix = ev.endDayLabel;
                                          } else {
                                            suffix = isPhapHoi
                                              ? `Tạ đàn - ngày ${ev.multiDayInfo.totalDays}/${ev.multiDayInfo.totalDays}`
                                              : `Kết khóa - ngày ${ev.multiDayInfo.totalDays}/${ev.multiDayInfo.totalDays}`;
                                          }
                                        }

                                        const progressStr = `(${suffix})`;
                                        return baseSub ? `${baseSub} ${progressStr}` : progressStr;
                                      }
                                      return rawSub || (ev.category === 'Khóa Lễ Truyền Thống' ? 'Khóa lễ' : ev.category);
                                    })()}
                                  </div>

                                  {/* Dòng 2 (Ở DƯỚI): Tiêu đề chính (Lấy từ edit, VD: LƯƠNG HOÀNG SÁM) */}
                                  <div
                                    style={{
                                      fontFamily: "'UTM Avo', sans-serif",
                                      textWrap: 'balance',
                                    }}
                                    className="text-xs sm:text-[13px] font-bold uppercase text-[#FFDE59] leading-tight mt-0.5"
                                  >
                                    {cleanEventTitle(ev.title)}
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

            {/* 2.4 THANH CHÚ THÍCH Ý NGHĨA LOGO BIỂU TƯỢNG (ĐƯỜNG KẺ GRADIENT, CĂN GIỮA TUYỆT ĐỐI) */}
            <div className="-mx-4 sm:-mx-5 md:-mx-6 -mb-4 sm:-mb-5 md:-mb-6 px-4 sm:px-5 md:px-6 pt-2">
              {/* Đường kẻ dạng gradient */}
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/35 to-transparent" />

              {/* Dòng chú thích căn CHÍNH GIỮA tuyệt đối giữa đường kẻ và mép đáy khung */}
              <div
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="py-3.5 sm:py-4 flex flex-wrap items-center justify-end gap-3.5 sm:gap-4 text-[11px] sm:text-xs"
              >
                <span className="text-[#F2C14E] font-bold uppercase tracking-wider flex items-center gap-1">
                  ❖ Chú thích:
                </span>

                {/* Logo 1: Cộng Tu (Bỏ khung, để trên nền, chữ nghiêng) */}
                <div className="flex items-center gap-1.5">
                  <img
                    src="/images/icons/icon-cong-tu.png"
                    alt="Cộng Tu"
                    className="w-4 h-4 object-contain"
                  />
                  <span className="font-normal italic text-[#FFE5A3]/95">Cộng Tu</span>
                </div>

                {/* Logo 2: Khóa Lễ Truyền Thống (Bỏ khung, để trên nền, chữ nghiêng) */}
                <div className="flex items-center gap-1.5">
                  <img
                    src="/images/icons/icon-khoa-le-truyen-thong.png"
                    alt="Khóa Lễ Truyền Thống"
                    className="w-4 h-4 object-contain"
                  />
                  <span className="font-normal italic text-[#FFE5A3]/95">Khóa Lễ Truyền Thống</span>
                </div>

                {/* Logo 3: Đại Lễ Sự Kiện (Bỏ khung, để trên nền, chữ nghiêng) */}
                <div className="flex items-center gap-1.5">
                  <img
                    src="/images/icons/icon-dai-le-su-kien.png"
                    alt="Đại Lễ Sự Kiện"
                    className="w-4 h-4 object-contain"
                  />
                  <span className="font-normal italic text-[#FFE5A3]/95">Đại Lễ Sự Kiện</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            POPUP POSTER MODEL (PORTAL VÀO BODY, TRÁNH CHE KHUẤT KHI CUỘN, TỶ LỆ VÀNG)
        ══════════════════════════════════════════════ */}
        {mounted && selectedEvent && typeof document !== "undefined" && createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 pt-16 sm:pt-20 pb-6 sm:pb-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="relative max-w-md w-full max-h-[82vh] overflow-y-auto rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] border bg-[#1E1108] transition-all animate-in zoom-in-95 flex flex-col scrollbar-none my-auto"
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
              <div className="relative w-full h-[160px] sm:h-[185px] bg-black shrink-0 overflow-hidden">
                <img
                  src={selectedEvent.imgUrl}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `center ${selectedEvent.imgPositionY ?? 50}%`,
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1108] via-transparent to-black/40" />
              </div>

              {/* 2. ĐƯỜNG KẺ GRADIENT CẮT MẾP CHÂN ẢNH CÓ BIỂU TƯỢNG HÌNH TRÒN CHÍNH GIỮA (GIỐNG POSTER, BỎ CHỮ DANH MỤC) */}
              <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-transparent z-10 shrink-0">
                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#F2C14E] bg-[#24160E] flex items-center justify-center p-2 shadow-[0_0_16px_rgba(242,193,78,0.6)]">
                  <img
                    src={getEventCategoryIcon(selectedEvent.category)}
                    alt={selectedEvent.category}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.5)]"
                  />
                </div>
              </div>

              {/* 3. POSTER CONTENT BODY */}
              <div className="p-4 sm:p-5 pt-7 sm:pt-8 pb-6 sm:pb-7 space-y-3.5 text-center bg-[#1E1108] text-white">
                {/* 3.1 & 3.2 KHỐI TIÊU ĐỀ: Sub Tiêu Đề trên, Tiêu Đề dưới - To rõ, uy nghiêm */}
                <div className="space-y-1">
                  {(() => {
                    const cleanSub = getDisplaySubtitle(selectedEvent);
                    return cleanSub ? (
                      <p
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-sm sm:text-base text-amber-200/95 font-medium italic normal-case tracking-wide line-clamp-1 w-full text-center"
                      >
                        {cleanSub}
                      </p>
                    ) : null;
                  })()}

                  {(() => {
                    const titleStr = cleanEventTitle(selectedEvent.title);
                    const styleInfo = getAdaptiveTitleClasses(titleStr);
                    const formatted = formatBalancedTitle(titleStr);

                    return (
                      <h3
                        style={{
                          fontFamily: "'UTM Niagara', serif",
                          textWrap: 'balance',
                          whiteSpace: formatted.includes('\n') ? 'pre-line' : 'normal',
                        }}
                        className={`${styleInfo.fontSize} ${styleInfo.lineHeight} ${styleInfo.tracking} font-normal uppercase text-[#FFDE59] drop-shadow-[0_0_16px_rgba(255,222,89,0.6)] w-full text-center px-1`}
                      >
                        {formatted}
                      </h3>
                    );
                  })()}
                </div>

                {/* 3.3 KHỐI LỊCH & THỜI KHÓA (SCHEDULE GLASS BOX) */}
                <div className="rounded-xl p-3 sm:p-3.5 bg-[#2C180E]/90 border border-[#F2C14E]/35 shadow-inner grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch text-left">
                  {/* Left Column: Căn chính giữa so với chiều cao khung hình */}
                  <div className="border-b sm:border-b-0 sm:border-r border-[#F2C14E]/25 pb-2.5 sm:pb-0 sm:pr-3 flex flex-col justify-center items-center text-center my-auto h-full">
                    {selectedEvent.multiDayInfo && !selectedEvent.multiDayInfo.isChantingFinalDay && !selectedEvent.multiDayInfo.isChantingExtension ? (
                      <>
                        {/* Dòng Ngày Dương: 09.11 - 18.11 (UTM avo bold to hơn) */}
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-lg sm:text-xl md:text-[22px] font-bold text-[#F2C14E] block tracking-normal leading-tight py-0.5 whitespace-nowrap"
                        >
                          {(() => {
                            const startParts = (selectedEvent.multiDayInfo.startDateStr || '').split('.');
                            const endParts = (selectedEvent.multiDayInfo.endDateStr || '').split('.');
                            const startShort = startParts.length >= 2 ? `${startParts[0]}.${startParts[1]}` : selectedEvent.multiDayInfo.startDateStr;
                            const endShort = endParts.length >= 2 ? `${endParts[0]}.${endParts[1]}` : selectedEvent.multiDayInfo.endDateStr;
                            return `${startShort} - ${endShort}`;
                          })()}
                        </span>

                        {/* Dòng Ngày Âm: (XX.XX - XX.XX ÂL) (UTM avo thường nhỏ hơn) */}
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-xs sm:text-[13px] font-normal text-[#FFE5A3]/95 block leading-tight text-center mt-1 whitespace-nowrap"
                        >
                          {(() => {
                            const d1 = parseSolarDateStr(selectedEvent.multiDayInfo.startDateStr);
                            const d2 = parseSolarDateStr(selectedEvent.multiDayInfo.endDateStr);
                            if (d1 && d2) {
                              const l1 = convertSolarToLunar(d1.getDate(), d1.getMonth(), d1.getFullYear());
                              const l2 = convertSolarToLunar(d2.getDate(), d2.getMonth(), d2.getFullYear());
                              return `(${String(l1.day).padStart(2, '0')}.${String(l1.month).padStart(2, '0')} - ${String(l2.day).padStart(2, '0')}.${String(l2.month).padStart(2, '0')} ÂL)`;
                            }
                            return `(${selectedEvent.multiDayInfo.startDateStr} - ${selectedEvent.multiDayInfo.endDateStr})`;
                          })()}
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-[11px] sm:text-xs font-medium uppercase text-[#FFE5A3]/90 tracking-wider block"
                        >
                          {selectedEvent.dayOfWeekStr}
                        </span>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-xl sm:text-[22px] font-bold text-[#F2C14E] block tracking-normal leading-tight py-0.5"
                        >
                          {selectedEvent.solarDateStr}
                        </span>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-xs sm:text-[13px] font-normal text-[#FFE5A3]/95 block uppercase tracking-[0.38em] pl-[0.38em] leading-tight text-center mt-0.5 whitespace-nowrap"
                        >
                          {`(${(selectedEvent.lunarDate || '').replace(/[()]/g, '').trim()})`}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Right Column: Giờ và Thời Khóa cân đối thanh thoát */}
                  <div className="space-y-2 sm:pl-2 flex flex-col justify-center h-full my-auto text-left">
                    {selectedEvent.timeSlot1Time && (
                      <div>
                        {(() => {
                          const rawLabel = (selectedEvent.timeSlot1Label || '').trim();
                          const isDefaultOrEmpty =
                            !rawLabel ||
                            rawLabel.toLowerCase() === 'buổi sáng' ||
                            rawLabel.toLowerCase() === 'thời khóa' ||
                            rawLabel.toLowerCase() === 'buoi sang';
                          const displayLabel = isDefaultOrEmpty ? 'Thời Gian Bắt Đầu' : rawLabel;
                          return (
                            <span
                              style={{ fontFamily: "'UTM Avo', sans-serif" }}
                              className="text-xs sm:text-[13px] text-[#FFE5A3]/85 block tracking-wide font-normal mb-0.5"
                            >
                              {displayLabel}
                            </span>
                          );
                        })()}
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-base sm:text-lg font-bold text-white block leading-tight"
                        >
                          {selectedEvent.timeSlot1Time}
                        </span>
                      </div>
                    )}

                    {selectedEvent.timeSlot2Time && (
                      <div>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-xs sm:text-[13px] text-[#FFE5A3]/85 block tracking-wide font-normal mb-0.5"
                        >
                          {selectedEvent.timeSlot2Label ||
                            (selectedEvent.timeSlot2Time.toLowerCase().includes('phút') ||
                            selectedEvent.timeSlot2Time.toLowerCase().includes('giờ') ||
                            selectedEvent.timeSlot2Time.toLowerCase().includes('ngày')
                              ? 'Thời Lượng'
                              : 'Thời Khóa Tiếp')}
                        </span>
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-base sm:text-lg font-bold text-[#F2C14E] block leading-tight"
                        >
                          {selectedEvent.timeSlot2Time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3.4 NỘI DUNG MÔ TẢ & ĐỊA ĐIỂM (DÙNG FONT UTM AVO) */}
                <div className="space-y-2 text-left pt-1">
                  {selectedEvent.description && (
                    <p
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-xs sm:text-[13.5px] text-white/95 leading-relaxed font-normal text-justify"
                    >
                      {selectedEvent.description}
                    </p>
                  )}
                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs sm:text-[13px] text-[#FFE5A3] flex items-center gap-2 font-medium"
                  >
                    <img
                      src="/images/icons/icon-cac-khu-vuc-noi-bat.webp"
                      alt="Địa điểm"
                      className="w-4 h-4 object-contain shrink-0 drop-shadow-[0_0_6px_rgba(242,193,78,0.5)]"
                    />
                    <span>{selectedEvent.location}</span>
                  </p>
                </div>

                {/* 3.5 LƯU Ý HÀNH TRÌ (NẾU CÓ) - DÙNG FONT UTM AVO */}
                {selectedEvent.notes && (
                  <div className="p-3 rounded-xl bg-[#2A180E] border border-[#F2C14E]/35 text-left space-y-1 shadow-inner">
                    <span
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="font-bold text-xs text-[#FFDE59] flex items-center gap-1.5 uppercase tracking-wide"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F2C14E]" /> Lưu ý hành trì:
                    </span>
                    <p
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-xs sm:text-[13px] text-[#FFE5A3]/95 leading-relaxed italic font-normal"
                    >
                      {selectedEvent.notes}
                    </p>
                  </div>
                )}

                {/* 3.6 NÚT XEM CHI TIẾT BÀI VIẾT - FONT UTM AVO KHÔNG BOLD, KHÔNG IN HOA */}
                <Link
                  href={`/lich-tu-hoc/${selectedEvent.slug || toSlug(selectedEvent.title)}`}
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="mt-3.5 mb-1 w-full py-2.5 px-6 rounded-full bg-[#2A180E] hover:bg-[#F2C14E] text-[#FFE5A3] hover:text-[#1A120B] border border-[#F2C14E]/60 hover:border-[#FFDE59] font-normal text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(242,193,78,0.5)] transition-all duration-300 hover:scale-[1.01] cursor-pointer group/link"
                >
                  <span>Xem chi tiết bài viết</span>
                  <ArrowRight className="w-4 h-4 text-[#F2C14E] group-hover/link:text-[#1A120B] transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
};

export default CalendarSection;
