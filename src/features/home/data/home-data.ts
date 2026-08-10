import {
  Volume2,
  Video,
  BookOpen,
  FileText,
  Book,
  Users,
  Star,
} from "lucide-react";
import type {
  NavLink,
  NewsItem,
  DharmaCard,
  CalendarDay,
  EventSlide,
  Legend,
  Program,
  Area,
  Statue,
  Contact,
} from "../types";
import { C } from "@/config/theme";

// ─── header nav ─────────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "Giới thiệu", dropdown: true, href: "/gioi-thieu" },
  { label: "Tông Chỉ Tu Học", href: "/tong-chi-tu-hoc" },
  { label: "Dòng Chảy Hoằng Pháp", href: "/dong-chay-hoang-phap" },
  { label: "Vũ Trụ Phật Giáo", href: "/vu-tru-phat-giao" },
  { label: "Bảo Tượng Phật Giáo", href: "/bao-tuong-phat-giao" },
  { label: "Trí Tuệ Phật Pháp", href: "/tri-tue-phat-phap" },
];

export const DROPDOWN: { label: string; href: string }[] = [
  {
    label: "Lịch sử Tùng Lâm Hòa Phúc",
    href: "/gioi-thieu/lich-su-tung-lam-hoa-phuc",
  },
  { label: "Đại sư Liên Đăng", href: "/gioi-thieu/dai-su-lien-dang" },
  { label: "Sư ông Hoằng Pháp", href: "/gioi-thieu/su-ong-hoang-phap" },
  { label: "Sư phụ Trụ trì", href: "/gioi-thieu/su-phu-tru-tri" },
  { label: "Tiểu sử Sư tổ", href: "/gioi-thieu/tieu-su-su-to" },
  { label: "Văn hóa ứng xử", href: "/gioi-thieu/van-hoa-ung-xu" },
];

// ─── hero ───────────────────────────────────────────────────────────────────
export const HERO_CTAS: Array<{ label: string; icon: typeof Volume2 }> = [
  { label: "Pháp Thoại\nMới Nhất", icon: Volume2 },
  { label: "Kho Ảnh\nTư Liệu", icon: FileText },
  { label: "Ấn Phẩm\nPhật Giáo", icon: Book },
  { label: "Đăng Ký\nCộng Tu", icon: Users },
  { label: "Tìm Kiếm\n& Tham Vấn", icon: Star },
];

// ─── news ───────────────────────────────────────────────────────────────────
export const NEWS: NewsItem[] = [
  {
    img: "https://images.unsplash.com/photo-1506870144739-432c2b8141bf?w=800&h=480&fit=crop&auto=format",
    cat: "Tông chỉ tu học",
    title: "Pháp hội Bồ Đề Tâm – Đại lễ khai giảng khóa tu mùa hè 2024",
    date: "15/06/2024",
    side: "Dòng chảy hoằng pháp",
  },
  {
    img: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=800&h=480&fit=crop&auto=format",
    cat: "Dòng chảy hoằng pháp",
    title: "Chư Tôn Đức Tăng Ni thuyết pháp tại Đại giảng đường Hòa Phúc",
    date: "10/06/2024",
    side: "Tượng pháp",
  },
  {
    img: "https://images.unsplash.com/photo-1658834117213-d0b7e7d8b9ec?w=800&h=480&fit=crop&auto=format",
    cat: "Sinh hoạt cộng tu",
    title: "Lễ Sám Hối Sáu Căn tháng 6 – Hơn 500 Phật tử cùng tu học",
    date: "05/06/2024",
    side: "Hoằng pháp",
  },
];

// ─── dharma ─────────────────────────────────────────────────────────────────
export const DHARMA: DharmaCard[] = [
  {
    img: "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=440&h=260&fit=crop&auto=format",
    type: "Pháp Âm",
    Icon: Volume2,
    title: "Pháp thoại: Tứ Diệu Đế và con đường giải thoát",
    date: "12/06/2024",
    views: "2.4K",
    large: false,
  },
  {
    img: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=440&h=260&fit=crop&auto=format",
    type: "Videos",
    Icon: Video,
    title: "Phim tài liệu: Hành trình hoằng pháp tại Tùng Lâm Hòa Phúc",
    date: "08/06/2024",
    views: "5.1K",
    large: false,
  },
  {
    img: "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=440&h=260&fit=crop&auto=format",
    type: "Bài Viết",
    Icon: FileText,
    title: "Giáo lý Bát Nhã Ba La Mật và thực hành thiền quán",
    date: "03/06/2024",
    views: "1.8K",
    large: false,
  },
  {
    img: "https://images.unsplash.com/photo-1618061013016-f8307f69f7a7?w=440&h=260&fit=crop&auto=format",
    type: "Truyện Ngắn",
    Icon: BookOpen,
    title: "Câu chuyện thiền: Tiếng chuông ban mai và tâm thức tỉnh",
    date: "01/06/2024",
    views: "987",
    large: false,
  },
  {
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=440&h=640&fit=crop&auto=format",
    type: "Giáo Lý Phật Giáo",
    Icon: Book,
    title: "Khuyến Phát Bồ Đề Tâm Giảng Luận (4 quyển) – Thích Tâm Hòa",
    date: "2024",
    views: "3.2K",
    large: true,
  },
];

// ─── calendar ───────────────────────────────────────────────────────────────
export const WDAYS: string[] = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "CN",
];

export const CAL: CalendarDay[] = [
  { day: 1, lunar: "13/11", events: [] },
  { day: 2, lunar: "14", events: ["red"] },
  { day: 3, lunar: "15", events: ["pink"] },
  { day: 4, lunar: "16", events: [] },
  { day: 5, lunar: "17", events: [] },
  { day: 6, lunar: "18", events: [] },
  { day: 7, lunar: "19", events: [] },
  { day: 8, lunar: "20", events: [] },
  { day: 9, lunar: "21", events: [] },
  { day: 10, lunar: "22", events: [] },
  { day: 11, lunar: "23", events: [] },
  { day: 12, lunar: "24", events: [] },
  { day: 13, lunar: "25", events: [] },
  { day: 14, lunar: "26", events: [] },
  { day: 15, lunar: "27", events: [] },
  { day: 16, lunar: "28", events: [] },
  { day: 17, lunar: "29/30", events: ["red", "green"] },
  { day: 18, lunar: "1/12", events: ["purple"] },
  { day: 19, lunar: "2", events: ["pink"] },
  { day: 20, lunar: "3", events: [] },
  { day: 21, lunar: "4", events: [] },
  { day: 22, lunar: "5", events: [] },
  { day: 23, lunar: "6", events: [] },
  { day: 24, lunar: "7", events: [] },
  { day: 25, lunar: "8", events: [] },
  { day: 26, lunar: "9", events: ["green"] },
  { day: 27, lunar: "10", events: [] },
  { day: 28, lunar: "11", events: [] },
  { day: 29, lunar: "12", events: [] },
  { day: 30, lunar: "13", events: ["red"] },
  { day: 31, lunar: "14", events: ["red"] },
];

export const DOT_COLOR: Record<string, string> = {
  red: C.dotRed,
  purple: C.dotPurple,
  green: C.dotGreen,
  pink: C.dotPink,
};

export const LEGEND: Legend[] = [
  { color: C.dotRed, label: "Huân tu niệm Phật" },
  { color: C.dotPurple, label: "Cộng tu Sư Giả Như Lai" },
  { color: C.dotGreen, label: "Sám hối định kỳ" },
  { color: C.dotPink, label: "Lễ cầu quốc thái dân an" },
];

export const EVT_SLIDES: EventSlide[] = [
  {
    img: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=560&h=300&fit=crop&auto=format",
    type: "Sám Nguyện",
    title: "Lễ Sám Nguyện tháng 6",
    date: "14 & 29 âm lịch",
    dot: C.dotRed,
  },
  {
    img: "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=560&h=300&fit=crop&auto=format",
    type: "Sám Hối Sáu Căn",
    title: "Khóa Sám Hối Sáu Căn định kỳ",
    date: "Mỗi thứ 7 đầu tháng",
    dot: C.dotPurple,
  },
  {
    img: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=560&h=300&fit=crop&auto=format",
    type: "Sinh Hoạt Ngoại Khóa",
    title: "Sinh Hoạt Ngoại Khóa – Mùa hè 2024",
    date: "Chủ nhật, 30/06/2024",
    dot: C.dotGreen,
  },
];

// ─── programs ───────────────────────────────────────────────────────────────
export const PROGRAMS: Program[] = [
  {
    img: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=500&h=320&fit=crop&auto=format",
    title: "Sám Nguyện",
    schedule: "Mùng 1 và Rằm âm lịch hằng tháng",
    emoji: "🪷",
  },
  {
    img: "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=500&h=320&fit=crop&auto=format",
    title: "Sám Hối Sáu Căn",
    schedule: "14 và 29/30 âm lịch hằng tháng",
    emoji: "🔔",
  },
  {
    img: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=500&h=320&fit=crop&auto=format",
    title: "Sinh Hoạt Ngoại Khóa",
    schedule: "Chủ nhật đầu tháng âm lịch",
    emoji: "🌿",
  },
];

// ─── gallery: areas ────────────────────────────────────────────────────────
export const AREAS: Area[] = [
  {
    img: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1100&h=520&fit=crop&auto=format",
    name: "TAM BẢO",
    sub: "Chánh điện – Trung tâm tu học",
    info: "Diện tích: 2.500 m²",
  },
  {
    img: "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=1100&h=520&fit=crop&auto=format",
    name: "THIỀN ĐƯỜNG",
    sub: "Không gian thiền tọa tĩnh lặng",
    info: "Sức chứa: 300 người",
  },
  {
    img: "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=1100&h=520&fit=crop&auto=format",
    name: "HỒ PHÓNG SINH",
    sub: "Vườn phóng sinh & thiền hành",
    info: "Diện tích: 1.200 m²",
  },
  {
    img: "https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?w=1100&h=520&fit=crop&auto=format",
    name: "ĐẠI GIẢNG ĐƯỜNG",
    sub: "Hội trường đa năng hoằng pháp",
    info: "Sức chứa: 500 người",
  },
];

// ─── gallery: statues ──────────────────────────────────────────────────────
export const STATUES: Statue[] = [
  {
    img: "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=1100&h=520&fit=crop&auto=format",
    name: "THÍCH CA MÂU NI PHẬT",
    sub: "Bảo tượng ngoài trời – Sân chính",
    cluster: "Tứ Phật Cảnh",
    area: "Tam Bảo",
  },
  {
    img: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=1100&h=520&fit=crop&auto=format",
    name: "QUAN THẾ ÂM BỒ TÁT",
    sub: "Bảo tượng giữa hồ phóng sinh",
    cluster: "Bồ Tát Đạo Tràng",
    area: "Hồ Phóng Sinh",
  },
  {
    img: "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=1100&h=520&fit=crop&auto=format",
    name: "A DI ĐÀ PHẬT",
    sub: "Bảo tượng vườn thiền hành",
    cluster: "Tịnh Độ Đạo Tràng",
    area: "Thiền Đường",
  },
];

// ─── contact / footer ───────────────────────────────────────────────────────
export const CONTACTS: Contact[] = [
  {
    role: "Trưởng ban lãnh chúng",
    name: "Phật tử Bảo Trâm",
    tel: "0979.345.373",
  },
  {
    role: "Thư ký",
    name: "Phật tử Liên Vi: 0961.533.271 – Phật tử Liên Nghi",
    tel: "0984.569.134",
  },
  {
    role: "Cố vấn",
    name: "Phật tử Tịnh Hoàng: 0919.366.751 – Phật Tử Liên Hương",
    tel: "0348.198.196",
  },
  {
    role: "Trưởng TNPT",
    name: "Tịnh Hòa Hưng: 0329.630.394 – Liên Phúc Huyền",
    tel: "0328.812.922",
  },
];

// ─── scroll-spy section ids (order matches page.tsx sectionRefs array) ─────
export const SECTION_IDS: string[] = [
  "tin-moi",
  "hoang-phap",
  "lich-tu",
  "cong-tu",
  "khu-vuc",
  "bao-tuong",
];
