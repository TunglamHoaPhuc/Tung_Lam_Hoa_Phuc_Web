/**
 * Comprehensive Buddhist Tu Học Schedule & Automated Event Engine
 * Standardized according to Tùng Lâm Hòa Phúc Temple Regulations & PL 2570
 */

import {
  convertSolarToLunar,
  getLunarMonthLength,
  getDaysInMonth,
} from '@/lib/lunar-calendar';

export interface MultiDayInfo {
  totalDays: number;
  currentDayIndex: number;
  isFirstDay: boolean;
  isLastDay: boolean;
  startDateStr: string;
  endDateStr: string;
  isChantingExtension?: boolean;
  isChantingFinalDay?: boolean;
}

export interface CalendarEvent {
  id?: string | number;
  day: number;
  solarDateStr: string;
  endDateStr?: string; // Ngày kết thúc nếu là khóa tu kéo dài nhiều ngày
  isMultiDay?: boolean; // Đánh dấu khóa tu kéo dài nhiều ngày
  multiDayInfo?: MultiDayInfo; // Metadata chi tiết vị trí ngày trong chuỗi khóa tu
  dayOfWeekStr: string;
  lunarDate: string;
  lunarTag: string;
  subTitle1: string; // e.g. "CỘNG TU", "KHÓA LỄ TRUYỀN THỐNG", "ĐẠI LỄ SỰ KIỆN", "TỊNH ĐỘ NHÂN GIAN"
  title: string;      // e.g. "PHÁP HỘI NIỆM PHẬT", "KHÓA LỄ ĐẠI SÁM HỐI"
  subtitle?: string;  // Tiêu đề phụ bóc tách (ngắn gọn, chống dài dòng)
  subTitle2: string; // e.g. "Tháng 7 (Ngày 1)", "Tổ Đường & Đại Giảng Đường Ngộ Chân Tử"
  description: string;
  category: string;  // "Khóa Lễ Truyền Thống", "Đại Lễ Sự Kiện", "Cộng Tu", "Tịnh Độ Nhân Gian"
  location: string;
  timeSlot1Label?: string;
  timeSlot1Time?: string;
  timeSlot2Label?: string;
  timeSlot2Time?: string;
  color: string;
  imgUrl: string;
  imgPositionY?: number; // Tọa độ căn chỉnh trục dọc (0% = Top, 50% = Center, 100% = Bottom)
  isImportant?: boolean;
  slug?: string;
  notes?: string;
  endDayType?: string;
  endDayLabel?: string;
  endDayTime?: string;
  continueChanting?: boolean;
  continueChantingUntil?: string;
  continueChantingName?: string;
}

export function parseSolarDateStr(str?: string): Date | null {
  if (!str) return null;
  const parts = str.trim().split('.');
  if (parts.length !== 3) return null;
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const y = parseInt(parts[2], 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  return new Date(y, m, d);
}

export function formatSolarDateStr(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

export function calcDaysDifference(startStr: string, endStr: string): number {
  const d1 = parseSolarDateStr(startStr);
  const d2 = parseSolarDateStr(endStr);
  if (!d1 || !d2) return 1;
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays + 1 : 1;
}

export function getEventCategoryIcon(category?: string): string {
  if (category === 'Cộng Tu') return '/images/icons/icon-cong-tu.png';
  if (category === 'Khóa Lễ Truyền Thống') return '/images/icons/icon-khoa-le-truyen-thong.png';
  if (category === 'Đại Lễ Sự Kiện') return '/images/icons/icon-dai-le-su-kien.png';
  if (category === 'Tịnh Độ Nhân Gian') return '/images/icons/icon-tinh-do-nhan-gian.png';
  return '/images/icons/icon-dai-le-su-kien.png';
}

export function splitEventTitle(rawTitle: string): { title: string; subtitle: string } {
  if (!rawTitle) return { title: '', subtitle: '' };
  const delimiters = [' — ', ' - ', ' – ', ': '];
  for (const d of delimiters) {
    if (rawTitle.includes(d)) {
      const parts = rawTitle.split(d);
      return {
        title: parts[0].trim(),
        subtitle: parts.slice(1).join(' - ').trim(),
      };
    }
  }
  return { title: rawTitle.trim(), subtitle: '' };
}

export interface MonthThemeInfo {
  month: number;
  bannerImg: string;
  title: string;
  quoteLines: string[];
  author: string;
  primaryColor: string;
  secondaryColor: string;
  themeBg: string;
  quoteImg?: string;
  quoteTitle?: string;
}

export const MONTH_THEMES: Record<number, MonthThemeInfo> = {
  0: {
    "month": 1,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-01-duc-ban-su-thanh-dao.webp",
    "title": "Đức Bản Sư Thành Đạo",
    "quoteLines": [
      "Hạnh phúc là khi bạn biết",
      "nhận diện sự có mặt của",
      "niềm vui và nỗi buồn."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#8B3A1C",
    "secondaryColor": "#F2C14E",
    "themeBg": "#2A170F",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-01-quy-y-tam-bao.png"
  },
  1: {
    "month": 2,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-02-nghinh-xuan-di-lac.webp",
    "title": "Nghinh Xuân Di Lặc",
    "quoteLines": [
      "Nam mô Từ phụ Thích Ca",
      "Xuân về khắp chốn, nhà nhà hân hoan.",
      "Giữ lòng nếp sống thanh nhàn",
      "Hộ trì Tam bảo, xây nhà Tăng thân.",
      "Trẻ già, nam nữ xa gần",
      "Quy y hướng đạo, chuyển dần mê tâm.",
      "Chắp tay khấn nguyện âm thầm",
      "Dân giàu, nước thịnh, thái bình thiên thu."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#1E4B3E",
    "secondaryColor": "#FFDE59",
    "themeBg": "#122620",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-02-tu-hoc-phat-phap.jpg"
  },
  2: {
    "month": 3,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-03-huong-sen-tay-bac.webp",
    "title": "Hương Sen Tây Bắc",
    "quoteLines": [
      "Thử thách tạo nên sức mạnh",
      "Mỗi thử thách trong cuộc đời đều mang đến những kinh nghiệm thú vị.",
      "Người biết chấp nhận thử thách, tìm cách thích ứng",
      "và biến thử thách thành động lực mới",
      "là người có sức chịu đựng kiên cường."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#6B2D5C",
    "secondaryColor": "#FFE5A3",
    "themeBg": "#261121",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-03-dung-bo-cuoc.jpg"
  },
  3: {
    "month": 4,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-04-huong-ve-coi-nguon.webp",
    "title": "Hướng Về Cội Nguồn",
    "quoteLines": [
      "Nắng xưa... trở về",
      "Rồi một ngày bầu trời xanh hửng nắng",
      "Ai trở về trong manh áo bùn nâu",
      "Tìm dư hương nơi góc nhỏ năm nào",
      "Chờ được gọi “Con Ơi” trong ký ức.",
      "",
      "Rồi một ngày hiên xưa chiều nhạt nắng",
      "Ai trở về trong hoang lạnh cô liêu",
      "Tìm gì đây bên khói bếp đìu hiu",
      "Chờ được thấy “dáng Thầy” trong tiềm thức."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#B45309",
    "secondaryColor": "#F2C14E",
    "themeBg": "#2E1A08",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-04-tich-cuc-nang-cao.jpg"
  },
  4: {
    "month": 5,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-05-phat-dan.webp",
    "title": "Phật Đản",
    "quoteLines": [
      "Phật về",
      "Phật về nắng đẹp hoan ca",
      "Phật về già trẻ gần xa tưng bừng",
      "Phật về sen nở thơm lừng",
      "Phật về gió mát trong từng lá hoa.",
      "Phật về mang đến vị tha",
      "Phật về kết nối giữa ta và người",
      "Phật về rạng rỡ nụ cười",
      "Phật về tâm đạo thảnh thơi cõi lòng."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#854D0E",
    "secondaryColor": "#FFDE59",
    "themeBg": "#261504",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-05-tu-tap-khiem-ha.jpg"
  },
  5: {
    "month": 6,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-06-uom-mam-sen-viet.webp",
    "title": "Ươm Mầm Sen Việt",
    "quoteLines": [
      "Tuổi trẻ đến chùa",
      "Vui thay tuổi trẻ đến chùa",
      "Học theo hạnh Phật hơn thua mặc người",
      "Uy nghi, lễ phép, tươi cười",
      "Búp sen dâng tặng cho đời bình an."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#0F5132",
    "secondaryColor": "#FFE5A3",
    "themeBg": "#082115",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-06-tinh-thuong-phung-su.jpg"
  },
  6: {
    "month": 7,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-07-den-on-dap-nghia.webp",
    "title": "Đền Ơn Đáp Nghĩa",
    "quoteLines": [
      "Sống cho riêng mình là người chật hẹp.",
      "Sống cho muôn người thì rộng lớn thênh thang."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#991B1B",
    "secondaryColor": "#FFDE59",
    "themeBg": "#2A0A0A",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-07-biet-minh-biet-ta.jpg"
  },
  7: {
    "month": 8,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-08-hieu-hanh-dap-den.webp",
    "title": "Hiếu Hạnh Đáp Đền",
    "quoteLines": [
      "Không một tác phẩm nào đẹp và thiêng liêng",
      "bằng sự hiện hữu của cha và mẹ.",
      "Đó là tượng đài của tình thương",
      "và sự hy sinh bất tử."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#7C2D12",
    "secondaryColor": "#F2C14E",
    "themeBg": "#240E06",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-08-ve-ben-thay.jpg"
  },
  8: {
    "month": 9,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-09-thanh-nguyet-huong-thu.webp",
    "title": "Thanh Nguyệt Hương Thu",
    "quoteLines": [
      "Này bạn, dù bên ngoài bão giông",
      "nhưng đừng đánh mất sự bình an bên trong.",
      "Chất liệu vững chãi được tạo ra từ nội tâm an lạc",
      "sẽ không bao giờ mất nếu bạn biết an trú",
      "vào đoàn thể đẹp của Tăng thân."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#1E3A8A",
    "secondaryColor": "#FFDE59",
    "themeBg": "#0B1533",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-09-nhan-moi-la-suc-manh.jpg"
  },
  9: {
    "month": 10,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-10-hanh-nguyen-quan-am.webp",
    "title": "Học hạnh buông xả",
    "quoteLines": [
      "Học hạnh buông xả là học cách",
      "mở rộng dung lượng trái tim,",
      "để bao dung những điều chưa trọn vẹn",
      "và mỉm cười trước mọi đổi thay."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#8B3A1C",
    "secondaryColor": "#F2C14E",
    "themeBg": "#2A170F",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-10-tim-ve-yen-lang.jpg"
  },
  10: {
    "month": 11,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-11-an-duc-to-thay.webp",
    "title": "Hoằng Pháp - Kiến An mãi nhớ Thầy",
    "quoteLines": [
      "Hoằng Pháp - Kiến An mãi nhớ Thầy",
      "Hải Phòng - Phổ Chiếu vẫn còn đây",
      "Người đi năm tháng chưa phai dấu",
      "Chánh pháp hoằng truyền khắp Đông Tây",
      "Đất Bắc mở mang dòng bất tử",
      "Trời Nam kết tụ giới hương bay",
      "Dáng xưa vững chãi như tùng bách",
      "Cháu con tiếp bước đẹp tháng ngày."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#9A3412",
    "secondaryColor": "#F2C14E",
    "themeBg": "#2B0F05",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-11-ve-ben-thay.jpg"
  },
  11: {
    "month": 12,
    "bannerImg": "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-12-via-phat-di-da.webp",
    "title": "Vía Phật Di Đà",
    "quoteLines": [
      "Hoa sen cần bùn để sống.",
      "Bạn cũng cần chất liệu khổ đau",
      "để vững chãi vươn lên."
    ],
    "author": "Vô Trí - Tâm Hòa",
    "primaryColor": "#78350F",
    "secondaryColor": "#FFDE59",
    "themeBg": "#210E04",
    "quoteImg": "/images/lich-tu-hoc/quotes/thang-12-kho-dau-la-chat-lieu.jpg"
  }
};

const DAY_OF_WEEK_NAMES = [
  "CHỦ NHẬT",
  "THỨ HAI",
  "THỨ BA",
  "THỨ TƯ",
  "THỨ NĂM",
  "THỨ SÁU",
  "THỨ BẢY",
];

export const FEATURED_PROGRAMS = [
  {
    id: "p1",
    title: "ĐẠI SÁM HỐI",
    subtitle: "Khóa lễ",
    schedule: "14 VÀ 29/30 ÂM LỊCH HẰNG THÁNG",
    summary: "Thời khóa sám hối trang nghiêm vào tối 19h00 ngày 14 và cuối tháng âm lịch, gột rửa thân tâm và tịnh hóa nghiệp chướng.",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/dai-tieu-sam-hoi-va-thuong-ky.webp",
  },
  {
    id: "p2",
    title: "TIỂU SÁM HỐI",
    subtitle: "Khóa lễ",
    schedule: "MÙNG 8 VÀ 23 ÂM LỊCH HẰNG THÁNG",
    summary: "Thời khóa tụng kinh sám hối vào tối 19h00 ngày mùng 8 và 23 âm lịch, nuôi dưỡng tâm bồ đề và huân tu công đức lành.",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/dai-tieu-sam-hoi-va-thuong-ky.webp",
  },
  {
    id: "p3",
    title: "CẦU QUỐC THÁI DÂN AN",
    subtitle: "Khóa lễ",
    schedule: "MÙNG 1 VÀ 15 ÂM LỊCH HẰNG THÁNG",
    summary: "Khóa lễ tụng kinh Dược Sư cầu an vào sáng 08h00 mùng 1 và ngày rằm 15 âm lịch, cầu nguyện quốc thái dân an, cát tường như ý.",
    imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Cau-an-quoc-thai-dan-thuong-ky.webp",
  },
];

/**
 * Automatically generates all Tu Học events for any given Solar Month and Year
 * with strict adherence to temple rules and exact Vietnamese Lunar calculations.
 */
export function getEventsForMonth(solarYear: number, solarMonth: number): Record<number, CalendarEvent[]> {
  const daysCount = getDaysInMonth(solarYear, solarMonth);
  const eventsByDay: Record<number, CalendarEvent[]> = {};

  for (let day = 1; day <= daysCount; day++) {
    const lunar = convertSolarToLunar(day, solarMonth, solarYear);
    const dateObj = new Date(solarYear, solarMonth, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
    const dayOfWeekStr = DAY_OF_WEEK_NAMES[dayOfWeek];
    const monthLength = getLunarMonthLength(lunar.month, lunar.year, lunar.isLeap);
    const isLastDayOfLunarMonth = lunar.day === monthLength;

    const dayEvents: CalendarEvent[] = [];
    const solarDateStr = `${String(day).padStart(2, '0')}.${String(solarMonth + 1).padStart(2, '0')}.${solarYear}`;
    const lunarDateStr = `(${String(lunar.day).padStart(2, '0')}.${String(lunar.month).padStart(2, '0')}.ÂL)`;

    // ─────────────────────────────────────────────────────────────────────────────
    // 1. CỘNG TU CỐ ĐỊNH: TIỂU SÁM HỐI ĐỊNH KỲ (MÙNG 8 VÀ 23 ÂM LỊCH HẰNG THÁNG)
    // ─────────────────────────────────────────────────────────────────────────────
    if (lunar.day === 8 || lunar.day === 23) {
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "CỘNG TU",
        subTitle1: "Khóa lễ",
        title: "TIỂU SÁM HỐI",
        subTitle2: `${lunar.day === 8 ? "Mùng 8" : "Ngày 23"} Âm lịch hàng tháng`,
        description: `Thời khóa tụng kinh Tiểu Sám Hối định kỳ tối ngày ${lunar.day} âm lịch, đại chúng chí tâm trì tụng kinh chú, làm mới thân tâm và tăng trưởng thiện căn phước báu.`,
        category: "Khóa Lễ Truyền Thống",
        location: "Chánh Điện Tam Bảo - Tùng Lâm Hòa Phúc",
        timeSlot1Label: "Thời khóa Tiểu Sám Hối",
        timeSlot1Time: "19h00",
        timeSlot2Label: "Thời lượng",
        timeSlot2Time: "90 phút",
        color: "#059669",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/dai-tieu-sam-hoi-va-thuong-ky.webp",
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 2. CỘNG TU CỐ ĐỊNH: ĐẠI SÁM HỐI ĐỊNH KỲ (14 VÀ 29/30 ÂM LỊCH HẰNG THÁNG)
    // ─────────────────────────────────────────────────────────────────────────────
    if (lunar.day === 14 || isLastDayOfLunarMonth) {
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "CỘNG TU",
        subTitle1: "Khóa lễ",
        title: "ĐẠI SÁM HỐI",
        subTitle2: `${lunar.day === 14 ? "14 Âm lịch" : "Cuối tháng Âm lịch"} hàng tháng`,
        description: `Đại lễ Sám Hối trang nghiêm định kỳ tối 19h00 ngày ${lunar.day} âm lịch, đại chúng phủ phục trước mười phương Tam Bảo thành tâm sám trừ nghiệp chướng, đón nhận năng lượng an lành.`,
        category: "Khóa Lễ Truyền Thống",
        location: "Chánh Điện Tam Bảo - Tùng Lâm Hòa Phúc",
        timeSlot1Label: "Thời khóa Đại Sám Hối",
        timeSlot1Time: "19h00",
        timeSlot2Label: "Thời lượng",
        timeSlot2Time: "90 phút",
        color: "#D97706",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/dai-tieu-sam-hoi-va-thuong-ky.webp",
        isImportant: true,
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 3. CỘNG TU CỐ ĐỊNH: LỄ CẦU QUỐC THÁI DÂN AN (Sáng 08h00 ngày mùng 1 và ngày rằm 15)
    // ─────────────────────────────────────────────────────────────────────────────
    if (lunar.day === 1 || lunar.day === 15) {
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "CỘNG TU",
        subTitle1: "Khóa lễ",
        title: "CẦU QUỐC THÁI DÂN AN",
        subTitle2: lunar.day === 1 ? "Mùng 1 đầu tháng Âm lịch" : "Ngày rằm 15 Âm lịch",
        description: `Khóa lễ Cầu An trang nghiêm sáng 08h00 ngày ${lunar.day} âm lịch, trì tụng kinh Dược Sư cầu nguyện quốc thái dân an, mưa thuận gió hòa, gia đạo bình an cát tường.`,
        category: "Khóa Lễ Truyền Thống",
        location: "Chánh Điện Tam Bảo & Sân Di Đà",
        timeSlot1Label: "Chủ trì nghi thức Cầu An",
        timeSlot1Time: "08h00",
        timeSlot2Label: "Thời lượng",
        timeSlot2Time: "90 phút",
        color: "#4F46E5",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Cau-an-quoc-thai-dan-thuong-ky.webp",
        isImportant: true,
      });
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 4. CÁC ĐẠI LỄ & PHÁP HỘI ĐẶC THÙ THEO THÁNG ÂM LỊCH
    // ─────────────────────────────────────────────────────────────────────────────

    // THÁNG 6 ÂL: KHAI ĐÀN VU LAN BÁO HIẾU (Tối 30 hoặc 29/06 ÂL)
    if (lunar.month === 6 && isLastDayOfLunarMonth) {
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "KHAI ĐÀN VU LAN",
        subTitle1: "PHÁP HỘI VU LAN BÁO HIẾU",
        title: "KHAI ĐÀN PHÁP HỘI VU LAN BÁO HIẾU",
        subTitle2: `Tối ${lunar.day} Tháng 6 Âm lịch`,
        description: "Khóa lễ Khai đàn Pháp hội Vu Lan Báo Hiếu, đại chúng thành tâm trì tụng kinh Vu Lan Báo Ân Cha Mẹ.",
        category: "Pháp Hội",
        location: "Chánh Điện Tam Bảo - Tùng Lâm Hòa Phúc",
        timeSlot1Label: "Khai Đàn Vu Lan Báo Hiếu",
        timeSlot1Time: "07:15 TỐI",
        timeSlot2Label: "Thời lượng",
        timeSlot2Time: "120 phút",
        color: "#DC2626",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-08-hieu-hanh-dap-den.webp",
        isImportant: true,
      });
    }

    // THÁNG 7 ÂL: PHÁP HỘI TỤNG KINH VU LAN BÁO HIẾU (MÙNG 1 ĐẾN RẰM 15/07 ÂL)
    if (lunar.month === 7 && lunar.day >= 1 && lunar.day <= 15) {
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "VU LAN BÁO HIẾU",
        subTitle1: "PHÁP HỘI VU LAN BÁO HIẾU",
        title: lunar.day === 15 ? "ĐẠI LỄ VU LAN BÁO HIẾU CHÍNH THỨC" : `PHÁP HỘI TỤNG KINH VU LAN (NGÀY ${lunar.day})`,
        subTitle2: `Ngày ${lunar.day} Tháng 7 Âm lịch`,
        description: `Thời khóa tụng kinh Vu Lan Báo Hiếu hàng ngày trong tuần lễ Vu Lan: Sáng 08h00 tụng kinh Vu Lan & cúng Phật; Chiều 14h00 tụng kinh Báo Ân & cúng thí thực cầu siêu cửu huyền thất tổ.`,
        category: "Pháp Hội",
        location: "Chánh Điện & Khuôn Viên Tùng Lâm Hòa Phúc",
        timeSlot1Label: "Sáng: Tụng kinh Vu Lan Báo Hiếu",
        timeSlot1Time: "08:00 SÁNG",
        timeSlot2Label: "Chiều: Tụng kinh Báo Ân & Cúng Thí Thực",
        timeSlot2Time: "02:00 CHIỀU",
        color: "#DC2626",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-08-hieu-hanh-dap-den.webp",
        isImportant: true,
      });
    }

    // THÁNG 11 ÂL: PHÁP HỘI TỤNG KINH VÔ LƯỢNG THỌ (11 ĐẾN 17/11 ÂL)
    if (lunar.month === 11 && lunar.day >= 11 && lunar.day <= 17) {
      const isViaDiDa = lunar.day === 17;
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "VÔ LƯỢNG THỌ",
        subTitle1: "PHÁP HỘI VÔ LƯỢNG THỌ",
        title: isViaDiDa ? "ĐẠI LỄ VÍA ĐỨC PHẬT A DI ĐÀ & ĐÊM HỘI HOA ĐĂNG" : `PHÁP HỘI TỤNG KINH VÔ LƯỢNG THỌ (NGÀY ${lunar.day - 10})`,
        subTitle2: `Ngày ${lunar.day} Tháng 11 Âm lịch`,
        description: `Tuần lễ Pháp Hội Tụng Kinh Vô Lượng Thọ kính mừng Khánh đản Đức Phật A Di Đà.${isViaDiDa ? " Đêm hội hoa đăng lung linh cầu nguyện thế giới hòa bình, vãng sinh Tây Phương Cực Lạc." : ""}`,
        category: "Pháp Hội",
        location: "Chánh Điện & Sân Di Đà Tùng Lâm Hòa Phúc",
        timeSlot1Label: "Khóa tụng kinh Vô Lượng Thọ",
        timeSlot1Time: "08:00 SÁNG",
        timeSlot2Label: isViaDiDa ? "Đêm Hội Hoa Đăng Khánh Đản" : "Thời khóa Niệm Phật",
        timeSlot2Time: isViaDiDa ? "07:00 TỐI" : "02:00 CHIỀU",
        color: "#DC2626",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-12-via-phat-di-da.webp",
        isImportant: true,
      });
    }

    // THÁNG GIÊNG: Tết Nguyên Đán & Thượng Nguyên
    if (lunar.month === 1) {
      if (lunar.day >= 1 && lunar.day <= 3) {
        dayEvents.push({
          day,
          solarDateStr,
          dayOfWeekStr,
          lunarDate: lunarDateStr,
          lunarTag: "ĐẠI LỄ SỰ KIỆN",
          subTitle1: "ĐẠI LỄ SỰ KIỆN",
          title: "ĐẠI LỄ ĐÓN XUÂN DI LẶC & CẦU AN",
          subTitle2: `Mùng ${lunar.day} Tết Nguyên Đán`,
          description: "Khóa lễ chiêm bái Tam Bảo, khánh chúc Xuân Di Lặc an lạc và thắp hương cầu nguyện đầu năm mới.",
          category: "Đại Lễ Sự Kiện",
          location: "Khuôn Viên Toàn Tự Tùng Lâm Hòa Phúc",
          timeSlot1Label: "Khai mạc Lễ Hội Xuân",
          timeSlot1Time: "08:00 SÁNG",
          timeSlot2Label: "Cầu an Hoa Đăng",
          timeSlot2Time: "07:00 TỐI",
          color: "#DC2626",
          imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-02-nghinh-xuan-di-lac.webp",
          isImportant: true,
        });
      } else if (lunar.day === 15) {
        dayEvents.push({
          day,
          solarDateStr,
          dayOfWeekStr,
          lunarDate: lunarDateStr,
          lunarTag: "ĐẠI LỄ SỰ KIỆN",
          subTitle1: "ĐẠI LỄ SỰ KIỆN",
          title: "ĐẠI LỄ THƯỢNG NGUYÊN CẦU AN ĐẦU NĂM",
          subTitle2: "Rằm Tháng Giêng",
          description: "Đại lễ Cầu an Rằm tháng Giêng, tụng kinh Dược Sư và thắp hoa đăng cầu an cho muôn nhà.",
          category: "Đại Lễ Sự Kiện",
          location: "Chánh Điện & Sân Di Đà",
          timeSlot1Label: "Đại lễ Cầu An",
          timeSlot1Time: "08:00 SÁNG",
          timeSlot2Label: "Đêm hội Hoa Đăng",
          timeSlot2Time: "07:00 TỐI",
          color: "#DC2626",
          imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-02-nghinh-xuan-di-lac.webp",
          isImportant: true,
        });
      }
    }


    // THÁNG 4 ÂL: Đại Lễ Phật Đản Vesak
    if (lunar.month === 4 && lunar.day === 15) {
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "ĐẠI LỄ SỰ KIỆN",
        subTitle1: "ĐẠI LỄ SỰ KIỆN",
        title: "ĐẠI LỄ PHẬT ĐẢN (VESAK) PHẬT LỊCH 2570",
        subTitle2: `Mùa Phật Đản Tháng 4 Âm lịch (${lunar.day}/04 ÂL)`,
        description: "Đại lễ kính mừng Đức Phật Đản Sanh, nghi thức Tắm Phật thiêng liêng, diễu hành xe hoa và văn nghệ cúng dường.",
        category: "Đại Lễ Sự Kiện",
        location: "Sân Lâm Tỳ Ni & Đại Giảng Đường Ngộ Chân Tử",
        timeSlot1Label: "Nghi lễ Tắm Phật",
        timeSlot1Time: "08:00 SÁNG",
        timeSlot2Label: "Đêm hội Văn Nghệ Vesak",
        timeSlot2Time: "07:00 TỐI",
        color: "#DC2626",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-05-phat-dan.webp",
        isImportant: true,
      });
    }


    // THÁNG 7 ÂL: ĐẠI LỄ VU LAN & PHÁP HỘI NIỆM PHẬT THÁNG 7
    if (lunar.month === 7) {
      // 18/07 ÂL là Chủ Nhật: ĐẠI LỄ TRI ÂN CHA MẸ MÙA VU LAN (Tối từ 17h00)
      if (lunar.day === 18 && dayOfWeek === 0) {
        dayEvents.push({
          day,
          solarDateStr,
          dayOfWeekStr,
          lunarDate: lunarDateStr,
          lunarTag: "ĐẠI LỄ SỰ KIỆN",
          subTitle1: "ĐẠI LỄ SỰ KIỆN",
          title: "ĐẠI LỄ TRI ÂN CHA MẸ MÙA VU LAN BÁO HIẾU",
          subTitle2: "18 Tháng 7 Âm lịch",
          description: "Đại lễ Vu Lan Báo Hiếu một ngày, bắt đầu từ 17h00 chiều: Lễ Bông Hồng Cài Áo, dâng trà tri ân cha mẹ và thắp nến cầu siêu cửu huyền thất tổ.",
          category: "Đại Lễ Sự Kiện",
          location: "Khuôn Viên Đại Giảng Đường & Sân Di Đà",
          timeSlot1Label: "Dâng trà Tri Ân Cha Mẹ",
          timeSlot1Time: "05:00 CHIỀU",
          timeSlot2Label: "Đêm Hoa Đăng Cầu Siêu",
          timeSlot2Time: "07:30 TỐI",
          color: "#DC2626",
          imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Đại lễ Vu Lan Báo Hiếu.JPG",
          isImportant: true,
        });
      }

      // 24/07 & 25/07 ÂL (Thứ Bảy & Chủ Nhật): PHÁP HỘI NIỆM PHẬT THÁNG 7
      if (lunar.day === 24) {
        dayEvents.push({
          day,
          solarDateStr,
          dayOfWeekStr,
          lunarDate: lunarDateStr,
          lunarTag: "CỘNG TU",
          subTitle1: "CỘNG TU",
          title: "PHÁP HỘI NIỆM PHẬT",
          subTitle2: "Tháng 7 (Ngày 1)",
          description: "Sáng 07h00 tại Tổ Đường làm lễ truyền giới Bát Quan Trai, bước vào thời khóa hành trì ngày thứ nhất.",
          category: "Cộng Tu",
          location: "Tổ Đường (Truyền giới) & Đại Giảng Đường Ngộ Chân Tử",
          timeSlot1Label: "Truyền giới Bát Quan Trai",
          timeSlot1Time: "07:00 SÁNG",
          timeSlot2Label: "Kinh hành Niệm Phật",
          timeSlot2Time: "02:00 CHIỀU",
          color: "#7C3AED",
          imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Pháp hội niệm Phật.jpg",
          isImportant: true,
        });
      } else if (lunar.day === 25) {
        dayEvents.push({
          day,
          solarDateStr,
          dayOfWeekStr,
          lunarDate: lunarDateStr,
          lunarTag: "CỘNG TU",
          subTitle1: "CỘNG TU",
          title: "PHÁP HỘI NIỆM PHẬT",
          subTitle2: "Tháng 7 (Ngày 2)",
          description: "Tiếp tục thời khóa tọa thiền niệm Phật, nghe pháp thoại và hoàn mãn xả giới vào lúc 16h30 chiều.",
          category: "Cộng Tu",
          location: "Đại Giảng Đường Ngộ Chân Tử",
          timeSlot1Label: "Thời khóa Niệm Phật sáng",
          timeSlot1Time: "04:30 SÁNG",
          timeSlot2Label: "Pháp thoại & Hoàn Mãn",
          timeSlot2Time: "02:00 CHIỀU",
          color: "#7C3AED",
          imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Pháp hội niệm Phật.jpg",
          isImportant: true,
        });
      }
    }


    // THÁNG 11 ÂL: Vía Đức Phật A Di Đà (17/11 ÂL)
    if (lunar.month === 11 && lunar.day === 17) {
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "TỊNH ĐỘ NHÂN GIAN",
        subTitle1: "TỊNH ĐỘ NHÂN GIAN",
        title: "ĐẠI LỄ VÍA ĐỨC PHẬT A DI ĐÀ & ĐÊM HỘI HOA ĐĂNG",
        subTitle2: "17 Tháng 11 Âm lịch",
        description: "Đại lễ kỷ niệm khánh đản Đức Từ Phụ A Di Đà, đêm hội hoa đăng lung linh cầu nguyện thế giới an lành, vãng sinh Cực Lạc.",
        category: "Tịnh Độ Nhân Gian",
        location: "Sân Di Đà & Toàn Tự Tùng Lâm Hòa Phúc",
        timeSlot1Label: "Đại lễ Khánh Đản",
        timeSlot1Time: "08:00 SÁNG",
        timeSlot2Label: "Đêm hội Hoa Đăng Di Đà",
        timeSlot2Time: "06:30 TỐI",
        color: "#DC2626",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/month_12 - Vía Phật Di Đà.webp",
        isImportant: true,
      });
    }

    // THÁNG 12 ÂL (Tháng Chạp): Vía Phật Thành Đạo (08/12 ÂL)
    if (lunar.month === 12 && lunar.day === 8) {
      dayEvents.push({
        day,
        solarDateStr,
        dayOfWeekStr,
        lunarDate: lunarDateStr,
        lunarTag: "ĐẠI LỄ SỰ KIỆN",
        subTitle1: "ĐẠI LỄ SỰ KIỆN",
        title: "ĐẠI LỄ VÍA ĐỨC PHẬT THÍCH CA THÀNH ĐẠO",
        subTitle2: "Mùng 8 Tháng Chạp",
        description: "Kỷ niệm ngày Đức Bản Sư Thích Ca Mâu Ni Phật thành đạo dưới cội Bồ Đề, lễ truyền đăng và tụng kinh chuyển hóa vô minh.",
        category: "Đại Lễ Sự Kiện",
        location: "Khuôn Viên Chánh Điện Tam Bảo",
        timeSlot1Label: "Khóa lễ Truyền Đăng",
        timeSlot1Time: "06:00 TỐI",
        timeSlot2Label: "Pháp thoại Ý Nghĩa",
        timeSlot2Time: "07:30 TỐI",
        color: "#DC2626",
        imgUrl: "https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/month_01 - đức Bản Sư Thành Đạo.webp",
        isImportant: true,
      });
    }

    if (dayEvents.length > 0) {
      eventsByDay[day] = dayEvents;
    }

    if (dayEvents.length > 0) {
      eventsByDay[day] = dayEvents;
    }
  }

  return eventsByDay;
}
