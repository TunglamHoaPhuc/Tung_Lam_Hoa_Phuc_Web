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
 * Render câu trích dẫn hỗ trợ phần chữ bôi đậm (bold):
 * - Phần bôi đậm (thẻ <b>, <strong> hoặc **...**) hiển thị font UTM Niagara thường, cỡ to hơn, phát sáng vàng gold
 * - Nằm xen kẽ trực tiếp trên cùng một dòng văn (inline text)
 * - Các phần chữ thường hiển thị font UTM Avo hài hòa
 */
function renderQuoteSegment(text: string): React.ReactNode {
  if (!text) return null;
  const regex = /(?:<b>(.*?)<\/b>|<strong>(.*?)<\/strong>|\*\*(.*?)\*\*)/gi;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span
          key={`t-${lastIndex}`}
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="text-xs sm:text-[13.5px] md:text-sm text-[#FFE5A3]/95 inline align-baseline"
        >
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }
    const boldContent = match[1] || match[2] || match[3] || '';
    if (boldContent) {
      parts.push(
        <span
          key={`b-${match.index}`}
          style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
          className="text-2xl sm:text-[26px] md:text-[28px] font-normal text-[#FFDE59] drop-shadow-[0_0_12px_rgba(255,222,89,0.85)] tracking-normal inline align-baseline mx-1 leading-none"
        >
          {boldContent}
        </span>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span
        key={`t-${lastIndex}`}
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
        className="text-xs sm:text-[13.5px] md:text-sm text-[#FFE5A3]/95 inline align-baseline"
      >
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts;
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
  // Ngày thực tế trên thiết bị người dùng (Đồng bộ thời gian thực khi Hydration)
  const [clientRealToday, setClientRealToday] = useState<{ day: number; month: number; year: number } | null>(null);

  // Mặc định khởi tạo mở Tháng & Năm hiện tại theo thời gian thực
  const [activeDate, setActiveDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất Cả");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setClientRealToday({
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    });
    // Đảm bảo activeDate đồng bộ đúng tháng/năm thực tế tại máy người dùng khi vào trang
    setActiveDate(new Date(now.getFullYear(), now.getMonth(), 1));
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

  // State cho Pop-up Xem Ảnh Quote Tinh Gọn
  const [isQuoteZoomOpen, setIsQuoteZoomOpen] = useState<boolean>(false);
  const [selectedZoomQuote, setSelectedZoomQuote] = useState<{ url: string; title?: string } | null>(null);

  // Khóa cuộn trang và lắng nghe phím ESC khi mở pop-up zoom ảnh quote
  useEffect(() => {
    if (isQuoteZoomOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsQuoteZoomOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isQuoteZoomOpen]);

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
    quoteGallery?: Array<{ id: string; url: string; title?: string }>;
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
        quoteImg: mt.quoteImg || MONTH_THEMES[currentMonth]?.quoteImg,
        quoteTitle: mt.quoteTitle || MONTH_THEMES[currentMonth]?.quoteTitle,
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
            const ceTitleLower = (ce.title || '').toLowerCase().trim();

            // Tìm xem trước khi lọc, trong ngày d đã có sự kiện multiDayInfo cùng tên chưa (để kế thừa cho ngày Tạ đàn)
            const existingMatchingMultiEv = baseMap[d]?.find(
              (ev) => (ev.title || '').toLowerCase().trim() === ceTitleLower && ev.multiDayInfo
            );

            // Loại bỏ sự kiện mặc định bị trùng lặp hoặc mâu thuẫn trong ngày d
            if (baseMap[d]) {
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
            } else if (existingMatchingMultiEv?.multiDayInfo) {
              // Kế thừa multiDayInfo nếu sự kiện riêng này là ngày kết khóa / tạ đàn của chuỗi khóa tu đã phủ
              multiDayInfo = {
                ...existingMatchingMultiEv.multiDayInfo,
                isLastDay: true,
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

  // Danh sách toàn bộ ảnh quote dùng chung (ưu tiên ảnh quote của tháng đang chọn lên trước)
  const allQuoteList = useMemo(() => {
    let list: Array<{ id: string; url: string; title?: string }> = [];

    if (dbData?.quoteGallery && dbData.quoteGallery.length > 0) {
      list = [...dbData.quoteGallery];
    } else {
      // Fallback lấy toàn bộ quoteImg từ 12 tháng nếu quoteGallery chưa có
      const defaultList: Array<{ id: string; url: string; title?: string }> = [];
      for (let m = 0; m < 12; m++) {
        const theme = (dbData?.monthThemes && dbData.monthThemes[String(m)]) || MONTH_THEMES[m];
        if (theme?.quoteImg) {
          defaultList.push({
            id: `quote-${m + 1}`,
            url: theme.quoteImg,
            title: theme.quoteTitle || theme.title || `Quote Tu Học Tháng ${m + 1}`,
          });
        }
      }
      list = defaultList;
    }

    // Ưu tiên đưa quote của tháng đang chọn lên đầu danh sách slide (ngay sau slide chủ đề)
    if (list.length > 1) {
      const curQuoteUrl = monthTheme.quoteImg;
      const curIdx = list.findIndex(
        (q) => (curQuoteUrl && q.url === curQuoteUrl) || q.id === `quote-${currentMonth + 1}`
      );
      if (curIdx > 0) {
        const matching = list[curIdx];
        list = [matching, ...list.slice(0, curIdx), ...list.slice(curIdx + 1)];
      }
    }

    return list;
  }, [dbData, monthTheme, currentMonth]);

  // Cấu trúc Slides Cột Trái: Slide 0 là Chủ Đề Tháng, Slide 1..N là toàn bộ Kho Ảnh Quote
  type SlideItem =
    | { type: 'theme' }
    | { type: 'quote'; quote: { id: string; url: string; title?: string } };

  const slides: SlideItem[] = useMemo(() => {
    const s: SlideItem[] = [{ type: 'theme' }];
    allQuoteList.forEach((q) => {
      s.push({ type: 'quote', quote: q });
    });
    return s;
  }, [allQuoteList]);

  // Reset slide index khi đổi tháng
  useEffect(() => {
    setActiveSlideIdx(0);
  }, [currentMonth, currentYear]);

  // Tự động chạy Slide (Auto-play mỗi 6 giây, tạm dừng khi hover)
  useEffect(() => {
    if (slides.length <= 1 || isSlidePaused) return;
    const interval = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length, isSlidePaused]);

  // Cố định lịch không nhảy theo khóa tu nữa
  const activeHighlightedEvent = null;

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

  // Khi click vào ô ngày trên bảng lịch: Mở popup chi tiết khóa tu/sự kiện đầu tiên của ngày
  const handleDayCellClick = (dayNumber: number, dayEvents: CalendarEvent[]) => {
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0]);
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

          {/* ── 1. CỘT TRÁI: SLIDE POSTER TƯƠNG TÁC ĐA NĂNG (TỐI ƯU GỌN GÀNG TRÊN MOBILE, ĐỒNG BỘ CHIỀU CAO VỚI LỊCH TRÊN DESKTOP) ── */}
          <div
            onMouseEnter={() => setIsSlidePaused(true)}
            onMouseLeave={() => setIsSlidePaused(false)}
            className="w-full lg:w-[350px] xl:w-[380px] shrink-0 rounded-3xl bg-gradient-to-b from-[#2A170F] via-[#201007] to-[#150A04] border border-[#F2C14E]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col justify-between overflow-hidden transition-all min-h-[440px] sm:min-h-[470px] lg:min-h-[610px] xl:min-h-[620px] h-full lg:self-stretch relative group/leftcol"
          >

            {/* Slide Navigation Buttons (Prev / Next nổi tinh tế khi hover) */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#FFDE59] hover:text-[#1C0F08] transition-all flex items-center justify-center cursor-pointer opacity-70 group-hover/leftcol:opacity-100 shadow-lg backdrop-blur-sm"
                  aria-label="Slide trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#FFDE59] hover:text-[#1C0F08] transition-all flex items-center justify-center cursor-pointer opacity-70 group-hover/leftcol:opacity-100 shadow-lg backdrop-blur-sm"
                  aria-label="Slide tiếp theo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* ── NỘI DUNG SLIDE: CHỦ ĐỀ THÁNG HOẶC QUOTE TU HỌC ── */}
            {currentSlide.type === 'theme' ? (
              /* SLIDE 0: CHỦ ĐỀ KHÓA TU THÁNG (TIÊU ĐỀ NỔI BẬT UTM NIAGARA + QUOTE GỐC CÂN ĐỐI) */
              <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-500 overflow-hidden h-full">
                {/* 1.1 TRANH MINH HỌA NGHỆ THUẬT (TỈ LỆ GỐC ASPECT 1200/1015 TRÊN DESKTOP, ASPECT 16/10 TRÊN MOBILE) */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[1200/900] lg:aspect-[1200/1015] shrink-0 overflow-hidden bg-black/40">
                  <img
                    src={monthTheme.bannerImg}
                    alt={monthTheme.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-102"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg';
                    }}
                  />
                  {/* Lớp gradient đáy chuyển tiếp mượt mà (h-12 sm:h-14), phủ dài hơn một xíu tạo độ hòa trộn êm ái mà không che mất chữ poster */}
                  <div className="absolute inset-x-0 bottom-0 h-12 sm:h-14 bg-gradient-to-t from-[#201007] from-10% via-[#201007]/60 via-35% via-[#201007]/15 via-70% to-transparent pointer-events-none" />
                </div>

                {/* 2. Đường kẻ Gradient cắt ranh giới mép chân ảnh có icon tròn chính giữa (phong cách Dấu Ấn Hoằng Pháp) */}
                <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-transparent z-10 shrink-0 my-3">
                  {/* Huy hiệu Logo Quote Chủ Đề nổi chính giữa tim đường kẻ */}
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#F2C14E] bg-[#24160E] flex items-center justify-center p-2 shadow-[0_0_16px_rgba(242,193,78,0.6)]">
                    <img
                      src="/images/icons/icon-quote-chu-de.png"
                      alt="Quote Chủ Đề"
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                </div>

                {/* 1.2 KHỐI NỘI DUNG CÂU QUOTE & TÁC GIẢ */}
                <div className="px-4 sm:px-5 pt-5 sm:pt-6 pb-2 flex-1 flex flex-col justify-between items-center text-center overflow-visible">
                  <div className="w-full flex-1 flex flex-col justify-center my-auto overflow-visible py-1">
                    {/* Nội dung trích dẫn (Thơ / Văn xuôi hỗ trợ chữ bôi đậm UTM Niagara thường vàng to phát sáng inline) */}
                    {(() => {
                      const isPoem = [1, 3, 4, 5, 10].includes(currentMonth);
                      const hasAnyBold = (monthTheme.quoteLines || []).some((l: string) => /<b>|<strong>|\*\*/i.test(l));

                      if (isPoem) {
                        return (
                          <div className="w-full my-auto space-y-1 sm:space-y-1.5 py-1 overflow-visible">
                            {monthTheme.quoteLines.map((line: string, idx: number) => {
                              if (line === "") return <div key={idx} className="h-0.5" />;
                              const cleanLine = line.replace(/[“”"']/g, '').trim();
                              if (!cleanLine) return null;
                              return (
                                <div
                                  key={idx}
                                  className="h-6 sm:h-7 flex items-center justify-center overflow-visible"
                                >
                                  <p className="text-xs sm:text-[13px] md:text-sm text-[#FFE5A3]/95 tracking-wide text-center leading-none flex items-center justify-center overflow-visible">
                                    {renderQuoteSegment(cleanLine)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        );
                      } else {
                        // Văn xuôi (Prose): Nối liền mạch thành đoạn văn hoàn chỉnh với chiều cao dòng cố định đồng nhất
                        const cleanLines = (monthTheme.quoteLines || [])
                          .map((l: string) => l.replace(/[“”"']/g, '').trim())
                          .filter(Boolean);

                        let fullProse = cleanLines.join(' ');
                        // Nếu chưa có thẻ bôi đậm nào, tự động bôi đậm câu đầu tiên
                        if (!hasAnyBold && cleanLines.length > 0) {
                          const first = cleanLines[0];
                          const rest = cleanLines.slice(1).join(' ');
                          fullProse = `<b>${first}</b> ${rest}`.trim();
                        }

                        return (
                          <div className="w-full my-auto flex flex-col items-center justify-center overflow-visible px-1 sm:px-3">
                            <p className="text-xs sm:text-[13.5px] md:text-sm leading-[26px] sm:leading-[30px] md:leading-[32px] text-center text-[#FFE5A3]/95 tracking-wide overflow-visible w-full">
                              {renderQuoteSegment(fullProse)}
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* 1.3 NGUỒN TRÍCH DẪN (Không có dấu ngoặc đơn theo yêu cầu) */}
                  <div className="pt-2 pb-1 w-full flex items-center justify-center shrink-0">
                    <span
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-xs sm:text-[13px] text-amber-200/90 italic tracking-wider"
                    >
                      {monthTheme.author}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* SLIDE QUOTE: KHO ẢNH PHÁP NGỮ / QUOTE TU HỌC (AMBIENT BLUR NỀN + LỚP MỜ LÀM MỀM KHUNG + CLICK MỞ POPUP TINH GỌN) */
              <div className="flex-1 flex flex-col justify-center items-center overflow-hidden h-full relative p-2.5 sm:p-3 animate-in fade-in duration-500">
                <div className="w-full h-full flex items-center justify-center overflow-hidden relative rounded-2xl bg-black/60 shadow-inner group/quote">
                  {/* Lớp nền ambient blur tạo hiệu ứng mờ viền hòa sắc tuyệt đẹp */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-40 pointer-events-none transition-all duration-700"
                    style={{
                      backgroundImage: `url(${currentSlide.quote.url || monthTheme.quoteImg || monthTheme.bannerImg})`,
                    }}
                  />
                  {/* Lớp vignette phủ nhẹ làm nổi bật bức tranh chính */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/60 pointer-events-none" />

                  {/* Bức ảnh Quote với Feather Mask mờ viền ~14px làm mềm khung, không che chữ */}
                  <div
                    className="relative z-10 h-full w-auto max-w-full flex items-center justify-center cursor-zoom-in group/imgbox"
                    onClick={() => {
                      setSelectedZoomQuote(currentSlide.quote);
                      setIsQuoteZoomOpen(true);
                    }}
                  >
                    <div className="relative h-full w-auto max-w-full flex items-center justify-center rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.95)]">
                      <img
                        src={currentSlide.quote.url}
                        alt={currentSlide.quote.title || 'Quote tu học'}
                        className="h-full w-auto max-w-full object-contain mx-auto transition-transform duration-500 group-hover/imgbox:scale-[1.01]"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = monthTheme.bannerImg;
                        }}
                        title="Bấm để xem ảnh rõ nét"
                      />
                      {/* Lớp viền mờ mềm mại (Feather Mask 14px) quanh mép khung ảnh */}
                      <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_14px_rgba(26,18,11,0.92)]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dải Điều Hướng Slide: Các Dấu Chấm Nhảy Dần Dần (Hỗ trợ cuộn ngang mượt nếu nhiều quote) */}
            <div className="flex items-center justify-center gap-1.5 px-3 pt-2.5 pb-3 shrink-0 overflow-x-auto overflow-y-visible max-w-full scrollbar-none">
              {slides.map((_, idx) => {
                const isActive = activeSlideIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer shrink-0 ${
                      isActive
                        ? 'w-6 bg-[#FFDE59] shadow-[0_0_8px_rgba(255,222,89,0.9)] scale-100'
                        : 'w-2 bg-[#F2C14E]/30 hover:bg-[#F2C14E]/60 hover:scale-110'
                    }`}
                    aria-label={`Chuyển sang trang ${idx + 1}`}
                  />
                );
              })}
            </div>

          </div>

          {/* ── 2. CỘT PHẢI: BẢNG LỊCH CỐ ĐỊNH 6 HÀNG (42 Ô) - LOGO BIỂU TƯỢNG & ĐỒNG BỘ VIỀN VÀNG ── */}
          <div className="flex-1 rounded-3xl p-4 sm:p-5 md:p-6 bg-gradient-to-b from-[#2A170F]/95 via-[#1D0F08]/95 to-[#140A04]/98 border border-[#F2C14E]/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col justify-between space-y-3 transition-all min-h-[530px] md:min-h-[550px]">

            {/* 2.1 THANH ĐIỀU HƯỚNG THÁNG & PHẬT LỊCH / DƯƠNG LỊCH (TỐI ƯU GỌN GÀNG 1 HÀNG TRÊN MOBILE, KHÔNG VỠ DÒNG) */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-black/60 border border-[#F2C14E]/35 shadow-inner">
              {/* Nút lùi tháng - Pinned Trái */}
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#3D2210] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-[#1C0F08] transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Khối Nhãn Trung Tâm: Tháng Dương Lịch & Phật Lịch (Gọn gàng trên Mobile) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-center min-w-0 flex-1 px-1">
                {/* Pill 1: Tháng Dương Lịch */}
                <div className="flex items-center justify-center px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#201007]/90 border border-[#F2C14E]/50 shadow-xs">
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-[#FFDE59] whitespace-nowrap"
                  >
                    THÁNG {String(currentMonth + 1).padStart(2, '0')} / {currentYear}
                  </span>
                </div>

                {/* Pill 2: Phật Lịch & Âm Lịch */}
                <div className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 border border-[#F2C14E]/40 shadow-xs">
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-[9.5px] sm:text-xs font-bold text-[#FFDE59] tracking-wide shrink-0"
                  >
                    PL. {buddhistEra}
                  </span>
                  <span className="text-[#F2C14E]/60 text-[9px] sm:text-xs">•</span>
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-[9px] sm:text-xs font-medium text-amber-200/90 whitespace-nowrap"
                  >
                    Tháng {firstDayLunar.month === lastDayLunar.month ? firstDayLunar.month : `${firstDayLunar.month}-${lastDayLunar.month}`} ÂL {firstDayLunar.canChiYear || 'Bính Ngọ'}
                  </span>
                </div>
              </div>

              {/* Nút tiến tháng - Pinned Phải */}
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-[#3D2210] border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-[#1C0F08] transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
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
                  // Khung viền vàng cố định ngày Hôm Nay (Realtime Today từ đồng hồ thiết bị người dùng)
                  const isToday =
                    mounted &&
                    clientRealToday !== null &&
                    cell.dayNumber === clientRealToday.day &&
                    currentMonth === clientRealToday.month &&
                    currentYear === clientRealToday.year;

                  // Kiểm tra ô này có chứa khóa tu nhiều ngày không
                  const multiDayEvent = cell.events.find((e) => e.multiDayInfo);

                  return (
                    <div
                      key={`day-${cell.dayNumber}`}
                      onClick={() => handleDayCellClick(cell.dayNumber, cell.events)}
                      className={`min-h-[46px] sm:min-h-[58px] md:min-h-[66px] p-1 sm:p-1.5 flex flex-col justify-between relative rounded-xl transition-all duration-300 cursor-pointer group/cell ${
                        isToday
                          ? "border-2 border-[#FFDE59] shadow-[0_0_22px_rgba(255,222,89,0.9)] ring-2 ring-[#FFDE59]/70 bg-gradient-to-b from-[#552E14] via-[#3C1F0B] to-[#201007] z-20"
                          : multiDayEvent
                          ? "bg-[#25150C]/90 border border-[#F2C14E]/50 shadow-[0_0_10px_rgba(242,193,78,0.2)] hover:border-[#FFDE59] hover:bg-[#351C0F] z-10 hover:z-50"
                          : "bg-black/45 border border-[#F2C14E]/20 hover:border-[#F2C14E]/60 hover:bg-black/65 z-10 hover:z-50"
                      }`}
                    >
                      {/* Hàng trên: Số ngày dương & Ngày âm */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className={`text-xs sm:text-base md:text-lg font-black leading-none ${
                            isToday
                              ? "text-[#FFDE59] drop-shadow-[0_0_8px_rgba(255,222,89,0.95)]"
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
                          className={`text-[7.5px] sm:text-[9px] font-bold rounded px-1 leading-tight ${
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
                        <div className="flex items-center justify-center gap-1 sm:gap-1.5 my-auto flex-wrap py-0.5">
                          {cell.events.map((ev, i) => {
                            const iconUrl = getEventCategoryIcon(ev.category);
                            const isMulti = !!ev.multiDayInfo;
                            const isBoundaryDay =
                              !isMulti ||
                              ev.multiDayInfo?.isFirstDay ||
                              ev.multiDayInfo?.isLastDay ||
                              ev.multiDayInfo?.isChantingFinalDay;

                            return (
                              <div
                                key={i}
                                className={`relative group/icon cursor-pointer transition-transform hover:scale-125 z-10 hover:z-50 ${
                                  isBoundaryDay ? "p-0.5" : "p-0"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(ev);
                                }}
                              >
                                {/* Logo Biểu Tượng: Cân đối kích thước vừa vặn rõ ràng cho các ngày trong khóa tu */}
                                <img
                                  src={iconUrl}
                                  alt={ev.title}
                                  className={`${
                                    isBoundaryDay
                                      ? "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                      : "w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-85 group-hover/icon:opacity-100 group-hover/icon:scale-125"
                                  } object-contain`}
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

        {/* ── 4. POPUP XEM ẢNH QUOTE RÕ CHỮ TINH GỌN (CHỈ HIỂN THỊ ẢNH RÕ NÉT, NÚT X ĐÓNG VÀ ESC) ── */}
        {mounted && isQuoteZoomOpen && createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none cursor-zoom-out"
            onClick={() => setIsQuoteZoomOpen(false)}
          >
            {/* Nút đóng X góc trên bên phải */}
            <button
              type="button"
              onClick={() => setIsQuoteZoomOpen(false)}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 rounded-full bg-black/75 border border-[#F2C14E]/60 text-[#FFDE59] hover:bg-[#FFDE59] hover:text-[#1A120B] transition-all flex items-center justify-center cursor-pointer shadow-2xl backdrop-blur-sm group"
              title="Đóng (ESC hoặc click ra ngoài)"
              aria-label="Đóng xem ảnh"
            >
              <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
            </button>

            {/* Bức ảnh Quote độ phân giải gốc sắc nét, không bị che bởi bất kỳ thanh nút hay chú thích nào */}
            <div
              className="relative max-h-full max-w-full flex items-center justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedZoomQuote?.url || monthTheme.quoteImg || monthTheme.bannerImg}
                alt={selectedZoomQuote?.title || monthTheme.quoteTitle || monthTheme.title || 'Quote tu học'}
                className="max-h-[92vh] max-w-[94vw] w-auto h-auto object-contain rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-[#F2C14E]/30 animate-in zoom-in-95 duration-200"
              />
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
};

export default CalendarSection;
