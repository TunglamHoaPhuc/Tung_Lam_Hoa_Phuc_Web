// "use client";
// import { useState, useEffect, useRef, FC, ReactNode } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Volume2,
//   Video,
//   BookOpen,
//   FileText,
//   Book,
//   MapPin,
//   Phone,
//   Menu,
//   X,
//   Star,
//   Calendar,
//   Users,
//   type LucideIcon,
// } from "lucide-react";

// import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";

// // ─── palette constants ────────────────────────────────────────────────────────
// const C = {
//   primary: "#4A3728",
//   dark: "#2A1D14",
//   secondary: "#6B5238",
//   accent: "#F2C14E",
//   accentDeep: "#E8A94C",
//   bg: "#3A2D20",
//   surface: "#8B6F47",
//   paper: "#F3EEE2",
//   border: "rgba(212,169,74,0.35)",
//   cream: "#F0E4C8",
//   muted: "#C9B896",
//   dotRed: "#8B1E1E",
//   dotPurple: "#5C2D91",
//   dotGreen: "#2E7D32",
//   dotPink: "#D6337B",
// } as const;

// // ─── types ──────────────────────────────────────────────────────────────────
// interface NavLink {
//   label: string;
//   dropdown?: boolean;
// }

// interface NewsItem {
//   img: string;
//   cat: string;
//   title: string;
//   date: string;
//   side: string;
// }

// interface DharmaCard {
//   img: string;
//   type: string;
//   Icon: LucideIcon;
//   title: string;
//   date: string;
//   views: string;
//   large: boolean;
// }

// interface CalendarDay {
//   day: number;
//   lunar: string;
//   events: string[];
// }

// interface EventSlide {
//   img: string;
//   type: string;
//   title: string;
//   date: string;
//   dot: string;
// }

// interface Program {
//   img: string;
//   title: string;
//   schedule: string;
//   emoji: string;
// }

// interface Area {
//   img: string;
//   name: string;
//   sub: string;
//   info: string;
// }

// interface Statue {
//   img: string;
//   name: string;
//   sub: string;
//   cluster: string;
//   area: string;
// }

// interface Legend {
//   color: string;
//   label: string;
// }

// interface Contact {
//   role: string;
//   name: string;
//   tel: string;
// }

// // ─── static data ──────────────────────────────────────────────────────────────
// const NAV_LINKS: NavLink[] = [
//   { label: "Giới thiệu", dropdown: true },
//   { label: "Tông Chỉ Tu Học" },
//   { label: "Dòng Chảy Hoằng Pháp" },
//   { label: "Vũ Trụ Phật Giáo" },
//   { label: "Bảo Tượng Phật Giáo" },
//   { label: "Trí Tuệ Phật Pháp" },
// ];

// const DROPDOWN = [
//   "Lịch sử Tùng Lâm",
//   "Ban lãnh chúng",
//   "Kiến trúc & Không gian",
//   "Sứ mệnh hoằng pháp",
//   "Cộng đồng Phật tử",
//   "Liên hệ & Chỉ đường",
// ];

// const HERO_CTAS: Array<{ label: string; icon: LucideIcon }> = [
//   { label: "Pháp Thoại\nMới Nhất", icon: Volume2 },
//   { label: "Kho Ảnh\nTư Liệu", icon: FileText },
//   { label: "Ấn Phẩm\nPhật Giáo", icon: Book },
//   { label: "Đăng Ký\nCộng Tu", icon: Users },
//   { label: "Tìm Kiếm\n& Tham Vấn", icon: Star },
// ];

// const NEWS: NewsItem[] = [
//   {
//     img: "https://images.unsplash.com/photo-1506870144739-432c2b8141bf?w=800&h=480&fit=crop&auto=format",
//     cat: "Tông chỉ tu học",
//     title: "Pháp hội Bồ Đề Tâm – Đại lễ khai giảng khóa tu mùa hè 2024",
//     date: "15/06/2024",
//     side: "Dòng chảy hoằng pháp",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=800&h=480&fit=crop&auto=format",
//     cat: "Dòng chảy hoằng pháp",
//     title: "Chư Tôn Đức Tăng Ni thuyết pháp tại Đại giảng đường Hòa Phúc",
//     date: "10/06/2024",
//     side: "Tượng pháp",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1658834117213-d0b7e7d8b9ec?w=800&h=480&fit=crop&auto=format",
//     cat: "Sinh hoạt cộng tu",
//     title: "Lễ Sám Hối Sáu Căn tháng 6 – Hơn 500 Phật tử cùng tu học",
//     date: "05/06/2024",
//     side: "Hoằng pháp",
//   },
// ];

// const DHARMA: DharmaCard[] = [
//   {
//     img: "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=440&h=260&fit=crop&auto=format",
//     type: "Pháp Âm",
//     Icon: Volume2,
//     title: "Pháp thoại: Tứ Diệu Đế và con đường giải thoát",
//     date: "12/06/2024",
//     views: "2.4K",
//     large: false,
//   },
//   {
//     img: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=440&h=260&fit=crop&auto=format",
//     type: "Videos",
//     Icon: Video,
//     title: "Phim tài liệu: Hành trình hoằng pháp tại Tùng Lâm Hòa Phúc",
//     date: "08/06/2024",
//     views: "5.1K",
//     large: false,
//   },
//   {
//     img: "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=440&h=260&fit=crop&auto=format",
//     type: "Bài Viết",
//     Icon: FileText,
//     title: "Giáo lý Bát Nhã Ba La Mật và thực hành thiền quán",
//     date: "03/06/2024",
//     views: "1.8K",
//     large: false,
//   },
//   {
//     img: "https://images.unsplash.com/photo-1618061013016-f8307f69f7a7?w=440&h=260&fit=crop&auto=format",
//     type: "Truyện Ngắn",
//     Icon: BookOpen,
//     title: "Câu chuyện thiền: Tiếng chuông ban mai và tâm thức tỉnh",
//     date: "01/06/2024",
//     views: "987",
//     large: false,
//   },
//   {
//     img: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=440&h=640&fit=crop&auto=format",
//     type: "Sách",
//     Icon: Book,
//     title: "Ấn phẩm mới: Tâm Bình Thường Là Đạo – Thiền sư Thích Nhất Hạnh",
//     date: "2024",
//     views: "3.2K",
//     large: true,
//   },
// ];

// const WDAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

// const CAL: CalendarDay[] = [
//   { day: 1, lunar: "25", events: [] },
//   { day: 2, lunar: "26", events: [] },
//   { day: 3, lunar: "27", events: ["green"] },
//   { day: 4, lunar: "28", events: [] },
//   { day: 5, lunar: "29", events: [] },
//   { day: 6, lunar: "30", events: [] },
//   { day: 7, lunar: "1/6", events: ["pink"] },
//   { day: 8, lunar: "2", events: [] },
//   { day: 9, lunar: "3", events: [] },
//   { day: 10, lunar: "4", events: ["green"] },
//   { day: 11, lunar: "5", events: [] },
//   { day: 12, lunar: "6", events: [] },
//   { day: 13, lunar: "7", events: [] },
//   { day: 14, lunar: "8", events: ["red"] },
//   { day: 15, lunar: "9", events: ["purple"] },
//   { day: 16, lunar: "10", events: [] },
//   { day: 17, lunar: "11", events: ["green"] },
//   { day: 18, lunar: "12", events: [] },
//   { day: 19, lunar: "13", events: [] },
//   { day: 20, lunar: "14", events: [] },
//   { day: 21, lunar: "15", events: ["red", "pink"] },
//   { day: 22, lunar: "16", events: [] },
//   { day: 23, lunar: "17", events: [] },
//   { day: 24, lunar: "18", events: ["green"] },
//   { day: 25, lunar: "19", events: [] },
//   { day: 26, lunar: "20", events: [] },
//   { day: 27, lunar: "21", events: [] },
//   { day: 28, lunar: "22", events: ["purple"] },
//   { day: 29, lunar: "23", events: [] },
//   { day: 30, lunar: "24", events: ["green"] },
// ];

// const DOT_COLOR: Record<string, string> = {
//   red: C.dotRed,
//   purple: C.dotPurple,
//   green: C.dotGreen,
//   pink: C.dotPink,
// };

// const LEGEND: Legend[] = [
//   { color: C.dotRed, label: "Huân tu niệm Phật" },
//   { color: C.dotPurple, label: "Cộng tu Sư Giả Như Lai" },
//   { color: C.dotGreen, label: "Sám hối định kỳ" },
//   { color: C.dotPink, label: "Lễ cầu quốc thái dân an" },
// ];

// const EVT_SLIDES: EventSlide[] = [
//   {
//     img: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=560&h=300&fit=crop&auto=format",
//     type: "Sám Nguyện",
//     title: "Lễ Sám Nguyện tháng 6",
//     date: "14 & 29 âm lịch",
//     dot: C.dotRed,
//   },
//   {
//     img: "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=560&h=300&fit=crop&auto=format",
//     type: "Sám Hối Sáu Căn",
//     title: "Khóa Sám Hối Sáu Căn định kỳ",
//     date: "Mỗi thứ 7 đầu tháng",
//     dot: C.dotPurple,
//   },
//   {
//     img: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=560&h=300&fit=crop&auto=format",
//     type: "Sinh Hoạt Ngoại Khóa",
//     title: "Sinh Hoạt Ngoại Khóa – Mùa hè 2024",
//     date: "Chủ nhật, 30/06/2024",
//     dot: C.dotGreen,
//   },
// ];

// const PROGRAMS: Program[] = [
//   {
//     img: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=500&h=320&fit=crop&auto=format",
//     title: "Sám Nguyện",
//     schedule: "Mùng 1 và Rằm âm lịch hằng tháng",
//     emoji: "🪷",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=500&h=320&fit=crop&auto=format",
//     title: "Sám Hối Sáu Căn",
//     schedule: "14 và 29/30 âm lịch hằng tháng",
//     emoji: "🔔",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=500&h=320&fit=crop&auto=format",
//     title: "Sinh Hoạt Ngoại Khóa",
//     schedule: "Chủ nhật đầu tháng âm lịch",
//     emoji: "🌿",
//   },
// ];

// const AREAS: Area[] = [
//   {
//     img: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1100&h=520&fit=crop&auto=format",
//     name: "TAM BẢO",
//     sub: "Chánh điện – Trung tâm tu học",
//     info: "Diện tích: 2.500 m²",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=1100&h=520&fit=crop&auto=format",
//     name: "THIỀN ĐƯỜNG",
//     sub: "Không gian thiền tọa tĩnh lặng",
//     info: "Sức chứa: 300 người",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=1100&h=520&fit=crop&auto=format",
//     name: "HỒ PHÓNG SINH",
//     sub: "Vườn phóng sinh & thiền hành",
//     info: "Diện tích: 1.200 m²",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?w=1100&h=520&fit=crop&auto=format",
//     name: "ĐẠI GIẢNG ĐƯỜNG",
//     sub: "Hội trường đa năng hoằng pháp",
//     info: "Sức chứa: 500 người",
//   },
// ];

// const STATUES: Statue[] = [
//   {
//     img: "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=1100&h=520&fit=crop&auto=format",
//     name: "THÍCH CA MÂU NI PHẬT",
//     sub: "Bảo tượng ngoài trời – Sân chính",
//     cluster: "Tứ Phật Cảnh",
//     area: "Tam Bảo",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=1100&h=520&fit=crop&auto=format",
//     name: "QUAN THẾ ÂM BỒ TÁT",
//     sub: "Bảo tượng giữa hồ phóng sinh",
//     cluster: "Bồ Tát Đạo Tràng",
//     area: "Hồ Phóng Sinh",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=1100&h=520&fit=crop&auto=format",
//     name: "A DI ĐÀ PHẬT",
//     sub: "Bảo tượng vườn thiền hành",
//     cluster: "Tịnh Độ Đạo Tràng",
//     area: "Thiền Đường",
//   },
// ];

// const SECTION_IDS = [
//   "tin-moi",
//   "hoang-phap",
//   "lich-tu",
//   "cong-tu",
//   "khu-vuc",
//   "bao-tuong",
// ];

// // ─── tiny helpers ─────────────────────────────────────────────────────────────
// const step = (i: number, len: number, d: 1 | -1): number => (i + d + len) % len;

// // ─── reusable components ──────────────────────────────────────────────────────
// interface SecHeadProps {
//   title: string;
//   sub?: string;
// }

// const SecHead: FC<SecHeadProps> = ({ title, sub }) => {
//   return (
//     <div className="flex flex-col items-center gap-2 mb-14">
//       <span style={{ color: C.accent, fontSize: 22, lineHeight: 1 }}>✦</span>
//       <div className="flex items-center gap-5 w-full max-w-3xl">
//         <div
//           className="flex-1 h-px"
//           style={{
//             background: `linear-gradient(to right, transparent, ${C.accent}80)`,
//           }}
//         />
//         <h2
//           className="font-cinzel text-2xl md:text-[2.2rem] font-bold uppercase tracking-[.14em] text-center whitespace-nowrap"
//           style={{
//             color: C.accent,
//             textShadow: `0 0 28px ${C.accent}70`,
//           }}
//         >
//           {title}
//         </h2>
//         <div
//           className="flex-1 h-px"
//           style={{
//             background: `linear-gradient(to left, transparent, ${C.accent}80)`,
//           }}
//         />
//       </div>
//       {sub && (
//         <p
//           className="font-inter text-[11px] tracking-[.3em] uppercase"
//           style={{ color: C.muted }}
//         >
//           {sub}
//         </p>
//       )}
//     </div>
//   );
// };

// interface ArrowProps {
//   dir: "l" | "r";
//   onClick: () => void;
// }

// const Arrow: FC<ArrowProps> = ({ dir, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
//       style={{ background: C.cream }}
//       aria-label={dir === "l" ? "Ảnh trước" : "Ảnh sau"}
//     >
//       {dir === "l" ? (
//         <ChevronLeft className="w-5 h-5" style={{ color: C.primary }} />
//       ) : (
//         <ChevronRight className="w-5 h-5" style={{ color: C.primary }} />
//       )}
//     </button>
//   );
// };

// interface DotsProps {
//   n: number;
//   active: number;
//   set: (i: number) => void;
// }

// const Dots: FC<DotsProps> = ({ n, active, set }) => {
//   return (
//     <div className="flex items-center gap-2 justify-center mt-7">
//       {Array.from({ length: n }).map((_, i) => (
//         <button
//           key={i}
//           onClick={() => set(i)}
//           className="w-2.5 h-2.5 rounded-full border transition-all duration-200"
//           style={{
//             borderColor: C.accent,
//             background: i === active ? C.accentDeep : "transparent",
//           }}
//           aria-label={`Mục ${i + 1}`}
//         />
//       ))}
//     </div>
//   );
// };

// // ─── main component ──────────────────────────────────────────────────────────
// const Home: FC = () => {
//   const [scrollY, setScrollY] = useState<number>(0);
//   const [drop, setDrop] = useState<boolean>(false);
//   const [mob, setMob] = useState<boolean>(false);
//   const [newsI, setNewsI] = useState<number>(0);
//   const [areaI, setAreaI] = useState<number>(0);
//   const [statI, setStatI] = useState<number>(0);
//   const [evtI, setEvtI] = useState<number>(0);
//   const [activeSection, setActive] = useState<number>(0);
//   const sectionRefs = useRef<(HTMLElement | null)[]>([]);

//   useEffect(() => {
//     const onScroll = () => {
//       setScrollY(window.scrollY);
//       const pos = window.scrollY + window.innerHeight / 2;
//       sectionRefs.current.forEach((el, i) => {
//         if (el && el.offsetTop <= pos && el.offsetTop + el.offsetHeight > pos) {
//           setActive(i);
//         }
//       });
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const scrolled = scrollY > 64;

//   const registerRef = (i: number) => (el: HTMLElement | null) => {
//     sectionRefs.current[i] = el;
//   };

//   return (
//     <div
//       style={{ background: C.bg, fontFamily: "'Noto Serif', serif" }}
//       className="min-h-screen overflow-x-hidden"
//     >
//       {/* ── sticky side section dots ──────────────────────────────────────── */}
//       <nav
//         className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3"
//         aria-label="Điều hướng section"
//       >
//         {SECTION_IDS.map((id, i) => (
//           <button
//             key={id}
//             onClick={() =>
//               sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" })
//             }
//             className="w-2.5 h-2.5 rounded-full border-2 transition-all duration-300"
//             style={{
//               borderColor: C.accent,
//               background: i === activeSection ? C.accent : "transparent",
//               transform: i === activeSection ? "scale(1.3)" : "scale(1)",
//             }}
//             aria-label={`Section ${id}`}
//           />
//         ))}
//       </nav>

//       {/* HEADER */}
//       <header
//         className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
//         style={{
//           height: 72,
//           background: scrolled ? `rgba(42,29,20,0.97)` : "transparent",
//           backdropFilter: scrolled ? "blur(10px)" : "none",
//           boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.35)" : "none",
//         }}
//       >
//         <div className="max-w-[1280px] mx-auto px-10 h-full flex items-center justify-between">
//           {/* logo */}
//           <div className="flex items-center gap-3">
//             <div
//               className="w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden flex-shrink-0"
//               style={{
//                 borderColor: C.accentDeep,
//                 background: `linear-gradient(135deg,${C.accent},${C.surface})`,
//               }}
//             >
//               <span
//                 className="font-cinzel font-black text-center leading-tight"
//                 style={{ fontSize: 7.5, color: C.dark }}
//               >
//                 TL
//                 <br />
//                 HP
//               </span>
//             </div>
//             <div className="hidden md:block">
//               <div
//                 className="font-cinzel text-xs font-bold tracking-[.2em]"
//                 style={{ color: C.cream }}
//               >
//                 TÙNG LÂM HÒA PHÚC
//               </div>
//               <div
//                 className="font-inter text-[10px] tracking-[.25em] uppercase"
//                 style={{ color: C.muted }}
//               >
//                 Thiền Viện · Hà Nội
//               </div>
//             </div>
//           </div>

//           {/* desktop nav */}
//           <nav className="hidden lg:flex items-center gap-7">
//             {NAV_LINKS.map((item) => (
//               <div
//                 key={item.label}
//                 className="relative"
//                 onMouseEnter={() => item.dropdown && setDrop(true)}
//                 onMouseLeave={() => item.dropdown && setDrop(false)}
//               >
//                 <button
//                   className="font-inter text-[11px] uppercase tracking-[.1em] font-semibold flex items-center gap-1 transition-colors duration-200 pb-0.5"
//                   style={{
//                     color: C.cream,
//                     borderBottom: `1.5px solid transparent`,
//                   }}
//                   onMouseEnter={(e) =>
//                     ((e.currentTarget as HTMLElement).style.color = C.accent)
//                   }
//                   onMouseLeave={(e) =>
//                     ((e.currentTarget as HTMLElement).style.color = C.cream)
//                   }
//                 >
//                   {item.label}
//                   {item.dropdown && (
//                     <ChevronRight className="w-3 h-3 rotate-90 opacity-50" />
//                   )}
//                 </button>

//                 {/* dropdown */}
//                 {item.dropdown && drop && (
//                   <div
//                     className="absolute top-full left-0 mt-2 w-56 rounded-lg py-1.5 z-50 border"
//                     style={{
//                       background: C.secondary,
//                       borderColor: `rgba(212,169,74,.4)`,
//                       boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
//                     }}
//                   >
//                     {DROPDOWN.map((d) => (
//                       <button
//                         key={d}
//                         className="w-full text-left px-4 py-2.5 font-inter text-[11px] tracking-wide transition-colors"
//                         style={{ color: C.cream }}
//                         onMouseEnter={(e) => {
//                           (e.currentTarget as HTMLElement).style.color =
//                             C.accent;
//                           (e.currentTarget as HTMLElement).style.background =
//                             "rgba(74,55,40,.5)";
//                         }}
//                         onMouseLeave={(e) => {
//                           (e.currentTarget as HTMLElement).style.color =
//                             C.cream;
//                           (e.currentTarget as HTMLElement).style.background =
//                             "transparent";
//                         }}
//                       >
//                         ›&ensp;{d}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </nav>

//           <button
//             className="lg:hidden p-1"
//             style={{ color: C.cream }}
//             onClick={() => setMob(!mob)}
//             aria-label="Menu"
//           >
//             {mob ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* mobile */}
//         {mob && (
//           <div
//             className="lg:hidden border-t px-8 py-5 flex flex-col gap-4"
//             style={{
//               background: "rgba(42,29,20,.98)",
//               borderColor: "rgba(201,161,92,.3)",
//             }}
//           >
//             {NAV_LINKS.map((item) => (
//               <button
//                 key={item.label}
//                 className="font-inter text-sm uppercase tracking-widest text-left transition-colors"
//                 style={{ color: C.cream }}
//               >
//                 {item.label}
//               </button>
//             ))}
//           </div>
//         )}
//       </header>

//       {/* HERO */}
//       <section
//         className="relative flex flex-col items-center justify-center text-center overflow-hidden"
//         style={{ minHeight: 780, background: C.dark }}
//       >
//         <img
//           src="https://images.unsplash.com/photo-1759367205550-3dc1cb7055a8?w=1440&h=820&fit=crop&auto=format"
//           alt="Người lễ Phật trong không gian thiền định linh thiêng"
//           className="absolute inset-0 w-full h-full object-cover"
//           style={{ opacity: 0.42 }}
//         />
//         <div
//           className="absolute inset-0"
//           style={{
//             background:
//               "linear-gradient(to bottom, rgba(42,29,20,.55) 0%, rgba(42,29,20,.3) 45%, rgba(42,29,20,.92) 100%)",
//           }}
//         />

//         <div className="relative z-10 max-w-[1280px] mx-auto px-10 pt-28 pb-20 flex flex-col items-center gap-5 w-full">
//           {/* eyebrow */}
//           <span
//             className="font-inter text-[10px] uppercase tracking-[.4em] px-5 py-2 rounded-full border"
//             style={{ color: C.muted, borderColor: "rgba(242,193,78,.3)" }}
//           >
//             Thiền Viện Hà Nội &middot; Thành lập 2005
//           </span>

//           {/* title */}
//           <h1
//             className="font-cinzel font-black uppercase leading-none tracking-[.07em]"
//             style={{
//               fontSize: "clamp(2.8rem,6.8vw,5.5rem)",
//               color: C.accent,
//               textShadow: `0 0 52px ${C.accent}cc, 0 0 100px ${C.accent}44`,
//             }}
//           >
//             NƠI ĐỂ TRỞ VỀ
//           </h1>
//           <p
//             className="font-cinzel font-light uppercase tracking-[.35em]"
//             style={{
//               fontSize: "clamp(.9rem,1.8vw,1.3rem)",
//               color: C.cream,
//             }}
//           >
//             Chốn Thiêng Bình Yên
//           </p>
//           <p
//             className="text-sm max-w-lg leading-relaxed mt-1"
//             style={{ color: C.muted }}
//           >
//             Tùng Lâm Hòa Phúc — nơi giao thoa của thiền định, trí tuệ và tâm
//             linh. Cửa ngõ để mỗi tâm hồn tìm về sự an trú đích thực.
//           </p>

//           {/* CTA row */}
//           <div className="flex flex-wrap justify-center gap-3 mt-5">
//             {HERO_CTAS.map(({ label, icon: Icon }) => (
//               <button
//                 key={label}
//                 className="group flex flex-col items-center gap-2 border rounded-xl px-5 py-4 min-w-[130px] transition-all duration-200 hover:scale-[1.03] active:scale-[.97]"
//                 style={{
//                   borderColor: C.accentDeep,
//                   background: "rgba(74,55,40,.52)",
//                   backdropFilter: "blur(4px)",
//                 }}
//                 onMouseEnter={(e) =>
//                   ((e.currentTarget as HTMLElement).style.background =
//                     "rgba(139,105,20,.8)")
//                 }
//                 onMouseLeave={(e) =>
//                   ((e.currentTarget as HTMLElement).style.background =
//                     "rgba(74,55,40,.52)")
//                 }
//               >
//                 <Icon className="w-5 h-5" style={{ color: C.accent }} />
//                 <span
//                   className="font-inter text-[11px] font-bold uppercase tracking-wide text-center leading-snug whitespace-pre-line"
//                   style={{ color: C.cream }}
//                 >
//                   {label}
//                 </span>
//               </button>
//             ))}
//           </div>

//           {/* YouTube bar */}
//           <div
//             className="flex items-center gap-3 mt-2 px-5 py-3 rounded-xl border cursor-pointer transition-colors"
//             style={{
//               background: "rgba(42,29,20,.75)",
//               borderColor: "rgba(201,161,92,.25)",
//               backdropFilter: "blur(4px)",
//             }}
//           >
//             <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
//               <FaYoutube className="w-4 h-4 text-white" />
//             </div>
//             <div className="text-left">
//               <div
//                 className="font-inter text-xs font-semibold"
//                 style={{ color: C.cream }}
//               >
//                 Pháp thoại: Bát Nhã Tâm Kinh – Toàn bộ ý nghĩa
//               </div>
//               <div
//                 className="font-inter text-[11px]"
//                 style={{ color: C.muted }}
//               >
//                 Watch on YouTube &middot; 2.1M lượt xem
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* scroll cue */}
//         <div
//           className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
//           style={{ opacity: 0.5 }}
//         >
//           <div
//             className="w-px h-10"
//             style={{
//               background: `linear-gradient(to bottom, transparent, ${C.accent})`,
//             }}
//           />
//           <span
//             className="font-inter text-[10px] tracking-[.3em] uppercase"
//             style={{ color: C.muted }}
//           >
//             Cuộn xuống
//           </span>
//         </div>
//       </section>

//       {/* TIN MỚI NHẤT */}
//       <section
//         ref={registerRef(0)}
//         id="tin-moi"
//         className="relative py-24 px-10 overflow-hidden"
//         style={{ background: C.bg }}
//       >
//         {/* subtle bg texture */}
//         <div
//           className="absolute inset-0 pointer-events-none"
//           style={{ opacity: 0.04 }}
//         >
//           <img
//             src="https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1440&fit=crop&auto=format"
//             alt=""
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <div className="max-w-[1280px] mx-auto relative">
//           <SecHead title="Tin Mới Nhất" sub="Hoạt động & Sự kiện" />

//           <div className="flex flex-col items-center">
//             {/* carousel image */}
//             <div className="relative w-full max-w-[760px]">
//               <div
//                 className="rounded-xl overflow-hidden border relative"
//                 style={{
//                   aspectRatio: "760/430",
//                   borderColor: `rgba(201,161,92,.3)`,
//                   boxShadow: "0 8px 32px rgba(0,0,0,.45)",
//                 }}
//               >
//                 <img
//                   src={NEWS[newsI].img}
//                   alt={NEWS[newsI].title}
//                   className="w-full h-full object-cover transition-opacity duration-500"
//                 />
//                 <div
//                   className="absolute inset-0"
//                   style={{
//                     background:
//                       "linear-gradient(to top, rgba(42,29,20,.75) 0%, transparent 55%)",
//                   }}
//                 />
//               </div>

//               {/* arrows */}
//               <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6">
//                 <Arrow
//                   dir="l"
//                   onClick={() => setNewsI(step(newsI, NEWS.length, -1))}
//                 />
//               </div>
//               <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6">
//                 <Arrow
//                   dir="r"
//                   onClick={() => setNewsI(step(newsI, NEWS.length, 1))}
//                 />
//               </div>

//               {/* label row */}
//               <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-0 pointer-events-none">
//                 {/* side left */}
//                 <div className="flex-1 flex justify-end pr-3">
//                   <span
//                     className="font-inter text-[10px] uppercase tracking-[.2em] px-3 py-1.5 rounded border"
//                     style={{
//                       color: C.muted,
//                       borderColor: `rgba(212,169,74,.3)`,
//                       background: `rgba(42,29,20,.8)`,
//                     }}
//                   >
//                     {NEWS[(newsI + NEWS.length - 1) % NEWS.length].side ||
//                       NEWS[(newsI + NEWS.length - 1) % NEWS.length].cat}
//                   </span>
//                 </div>
//                 {/* hexagon center */}
//                 <div
//                   className="flex flex-col items-center justify-center px-10 py-3.5 text-center z-10 relative"
//                   style={{
//                     background: `linear-gradient(135deg,${C.surface},${C.primary})`,
//                     border: `1.5px solid ${C.accent}`,
//                     clipPath:
//                       "polygon(7% 0%,93% 0%,100% 50%,93% 100%,7% 100%,0% 50%)",
//                     minWidth: 280,
//                   }}
//                 >
//                   <span
//                     className="font-inter text-[10px] uppercase tracking-[.2em]"
//                     style={{ color: C.accent }}
//                   >
//                     {NEWS[newsI].cat}
//                   </span>
//                   <span
//                     className="font-inter text-xs font-semibold mt-0.5"
//                     style={{ color: C.cream }}
//                   >
//                     {NEWS[newsI].date}
//                   </span>
//                 </div>
//                 {/* side right */}
//                 <div className="flex-1 flex justify-start pl-3">
//                   <span
//                     className="font-inter text-[10px] uppercase tracking-[.2em] px-3 py-1.5 rounded border"
//                     style={{
//                       color: C.muted,
//                       borderColor: `rgba(212,169,74,.3)`,
//                       background: `rgba(42,29,20,.8)`,
//                     }}
//                   >
//                     {NEWS[(newsI + 1) % NEWS.length].side ||
//                       NEWS[(newsI + 1) % NEWS.length].cat}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* title */}
//             <div className="mt-16 text-center max-w-2xl px-4">
//               <h3
//                 className="font-playfair text-lg md:text-xl font-semibold leading-snug"
//                 style={{ color: C.cream }}
//               >
//                 {NEWS[newsI].title}
//               </h3>
//             </div>

//             <Dots n={NEWS.length} active={newsI} set={setNewsI} />
//           </div>
//         </div>
//       </section>

//       {/* DẤU ẤN HOẰNG PHÁP */}
//       <section
//         ref={registerRef(1)}
//         id="hoang-phap"
//         className="py-24 px-10"
//         style={{ background: C.dark }}
//       >
//         <div className="max-w-[1280px] mx-auto">
//           <SecHead title="Dấu Ấn Hoằng Pháp" sub="Kho tư liệu Phật học" />

//           <div className="grid grid-cols-12 gap-6">
//             {/* small cards */}
//             <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6">
//               {DHARMA.filter((c) => !c.large).map((card) => {
//                 const { Icon } = card;
//                 return (
//                   <div
//                     key={card.title}
//                     className="group rounded-xl overflow-hidden border cursor-pointer transition-all duration-300"
//                     style={{
//                       borderColor: C.border,
//                       background: `linear-gradient(145deg,${C.surface},${C.primary})`,
//                       boxShadow: "0 4px 12px rgba(0,0,0,.28)",
//                     }}
//                     onMouseEnter={(e) =>
//                       ((
//                         e.currentTarget as HTMLElement
//                       ).style.borderColor = `${C.accent}99`)
//                     }
//                     onMouseLeave={(e) =>
//                       ((e.currentTarget as HTMLElement).style.borderColor =
//                         C.border)
//                     }
//                   >
//                     <div className="overflow-hidden" style={{ height: 185 }}>
//                       <img
//                         src={card.img}
//                         alt={card.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     </div>
//                     <div className="p-5">
//                       <div className="flex items-center gap-1.5 mb-2">
//                         <Icon
//                           className="w-3.5 h-3.5"
//                           style={{ color: C.accent }}
//                         />
//                         <span
//                           className="font-inter text-[10px] font-bold uppercase tracking-[.2em]"
//                           style={{ color: C.accent }}
//                         >
//                           {card.type}
//                         </span>
//                       </div>
//                       <h4
//                         className="font-playfair text-sm font-semibold leading-snug mb-3"
//                         style={{ color: C.cream }}
//                       >
//                         {card.title}
//                       </h4>
//                       <div
//                         className="flex items-center gap-2 font-inter text-[11px]"
//                         style={{ color: C.muted }}
//                       >
//                         <span>{card.date}</span>
//                         <span>·</span>
//                         <span>{card.views} lượt xem</span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* large book card */}
//             {DHARMA.filter((c) => c.large).map((card) => {
//               const { Icon } = card;
//               return (
//                 <div
//                   key={card.title}
//                   className="col-span-12 lg:col-span-4 group rounded-xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col"
//                   style={{
//                     borderColor: C.border,
//                     background: `linear-gradient(145deg,${C.surface},${C.primary})`,
//                     boxShadow: "0 4px 12px rgba(0,0,0,.28)",
//                   }}
//                   onMouseEnter={(e) =>
//                     ((
//                       e.currentTarget as HTMLElement
//                     ).style.borderColor = `${C.accent}99`)
//                   }
//                   onMouseLeave={(e) =>
//                     ((e.currentTarget as HTMLElement).style.borderColor =
//                       C.border)
//                   }
//                 >
//                   <div
//                     className="overflow-hidden flex-1"
//                     style={{ minHeight: 390 }}
//                   >
//                     <img
//                       src={card.img}
//                       alt={card.title}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                   </div>
//                   <div className="p-6">
//                     <div className="flex items-center gap-1.5 mb-2">
//                       <Icon className="w-4 h-4" style={{ color: C.accent }} />
//                       <span
//                         className="font-inter text-[10px] font-bold uppercase tracking-[.2em]"
//                         style={{ color: C.accent }}
//                       >
//                         {card.type}
//                       </span>
//                     </div>
//                     <h3
//                       className="font-playfair text-base font-semibold leading-snug mb-3"
//                       style={{ color: C.cream }}
//                     >
//                       {card.title}
//                     </h3>
//                     <div
//                       className="flex items-center gap-2 font-inter text-[11px]"
//                       style={{ color: C.muted }}
//                     >
//                       <span>{card.date}</span>
//                       <span>·</span>
//                       <span>{card.views} lượt xem</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* LỊCH TU HỌC */}
//       <section
//         ref={registerRef(2)}
//         id="lich-tu"
//         className="py-24 px-10"
//         style={{ background: C.bg }}
//       >
//         <div className="max-w-[1280px] mx-auto">
//           <SecHead
//             title="Lịch Tu Học Định Kỳ"
//             sub="Hằng tháng · Âm – Dương lịch"
//           />

//           {/* calendar card */}
//           <div
//             className="rounded-3xl overflow-hidden mb-10"
//             style={{
//               background: C.paper,
//               boxShadow: "0 12px 40px rgba(0,0,0,.45)",
//             }}
//           >
//             <div className="p-8 md:p-10">
//               {/* header */}
//               <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-7">
//                 <div>
//                   <h3
//                     className="font-cinzel text-2xl font-bold"
//                     style={{ color: C.dark }}
//                   >
//                     Tháng 6 – 2024
//                   </h3>
//                   <p
//                     className="font-inter text-sm mt-1"
//                     style={{ color: C.surface }}
//                   >
//                     Âm lịch: Tháng 5–6 năm Giáp Thìn
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   {LEGEND.map((l) => (
//                     <div key={l.label} className="flex items-center gap-2">
//                       <div
//                         className="w-3 h-3 rounded-full flex-shrink-0"
//                         style={{ background: l.color }}
//                       />
//                       <span
//                         className="font-inter text-xs"
//                         style={{ color: "#5C4630" }}
//                       >
//                         {l.label}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* weekday header */}
//               <div
//                 className="grid grid-cols-7 border-b"
//                 style={{ borderColor: "rgba(139,105,20,.2)" }}
//               >
//                 {WDAYS.map((d) => (
//                   <div
//                     key={d}
//                     className="text-center font-inter text-[11px] font-bold uppercase py-2.5"
//                     style={{ color: C.surface }}
//                   >
//                     {d}
//                   </div>
//                 ))}
//               </div>

//               {/* date grid */}
//               <div className="grid grid-cols-7">
//                 {CAL.map((d, i) => (
//                   <div
//                     key={i}
//                     className="border-b border-r transition-colors cursor-pointer"
//                     style={{
//                       minHeight: 72,
//                       padding: "6px 8px",
//                       borderColor: "rgba(139,105,20,.15)",
//                       borderLeft:
//                         i % 7 === 0
//                           ? "1px solid rgba(139,105,20,.15)"
//                           : undefined,
//                     }}
//                     onMouseEnter={(e) =>
//                       ((e.currentTarget as HTMLElement).style.background =
//                         "rgba(232,217,176,.4)")
//                     }
//                     onMouseLeave={(e) =>
//                       ((e.currentTarget as HTMLElement).style.background =
//                         "transparent")
//                     }
//                   >
//                     <div className="flex items-start justify-between">
//                       <span
//                         className="font-inter font-bold"
//                         style={{ fontSize: 18, color: C.dark }}
//                       >
//                         {d.day}
//                       </span>
//                       <div className="flex flex-col gap-0.5 mt-0.5">
//                         {d.events.map((ev, ei) => (
//                           <div
//                             key={ei}
//                             className="w-2 h-2 rounded-full"
//                             style={{ background: DOT_COLOR[ev] }}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <span
//                       className="font-inter text-[10px]"
//                       style={{ color: C.surface }}
//                     >
//                       {d.lunar}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* event slides */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//             {EVT_SLIDES.map((ev, i) => (
//               <div
//                 key={i}
//                 onClick={() => setEvtI(i)}
//                 className="rounded-xl overflow-hidden border cursor-pointer transition-all duration-200"
//                 style={{
//                   borderColor: i === evtI ? C.accent : C.border,
//                   background: `linear-gradient(145deg,${C.secondary},${C.dark})`,
//                   opacity: i === evtI ? 1 : 0.65,
//                   outline: i === evtI ? `2px solid ${C.accent}` : "none",
//                 }}
//               >
//                 <div
//                   className="relative overflow-hidden"
//                   style={{ height: 170 }}
//                 >
//                   <img
//                     src={ev.img}
//                     alt={ev.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div
//                     className="absolute inset-0"
//                     style={{
//                       background:
//                         "linear-gradient(to top,rgba(42,29,20,.75) 0%,transparent 60%)",
//                     }}
//                   />
//                   <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
//                     <div
//                       className="w-2 h-2 rounded-full"
//                       style={{ background: ev.dot }}
//                     />
//                     <span
//                       className="font-inter text-[11px] font-semibold"
//                       style={{ color: C.cream }}
//                     >
//                       {ev.type}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <h4
//                     className="font-playfair text-sm font-semibold mb-1.5"
//                     style={{ color: C.cream }}
//                   >
//                     {ev.title}
//                   </h4>
//                   <div
//                     className="flex items-center gap-1.5 font-inter text-[11px]"
//                     style={{ color: C.muted }}
//                   >
//                     <Calendar className="w-3 h-3" />
//                     <span>{ev.date}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <Dots n={EVT_SLIDES.length} active={evtI} set={setEvtI} />
//         </div>
//       </section>

//       {/* CHƯƠNG TRÌNH CỘNG TU */}
//       <section
//         ref={registerRef(3)}
//         id="cong-tu"
//         className="py-24 px-10"
//         style={{ background: C.dark }}
//       >
//         <div className="max-w-[1280px] mx-auto">
//           <SecHead title="Các Chương Trình Cộng Tu" sub="Tu học định kỳ" />

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {PROGRAMS.map((prog) => (
//               <div
//                 key={prog.title}
//                 className="group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1"
//                 style={{
//                   borderColor: C.border,
//                   background: `linear-gradient(145deg,${C.secondary},${C.bg})`,
//                   boxShadow: "0 4px 20px rgba(0,0,0,.3)",
//                 }}
//                 onMouseEnter={(e) =>
//                   ((
//                     e.currentTarget as HTMLElement
//                   ).style.borderColor = `${C.accent}88`)
//                 }
//                 onMouseLeave={(e) =>
//                   ((e.currentTarget as HTMLElement).style.borderColor =
//                     C.border)
//                 }
//               >
//                 {/* image + badge */}
//                 <div
//                   className="relative overflow-hidden"
//                   style={{ height: 240 }}
//                 >
//                   <img
//                     src={prog.img}
//                     alt={prog.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                   <div
//                     className="absolute inset-0"
//                     style={{
//                       background:
//                         "linear-gradient(to top,rgba(42,29,20,.65) 0%,transparent 60%)",
//                     }}
//                   />
//                   {/* badge */}
//                   <div
//                     className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2"
//                     style={{
//                       background: C.accent,
//                       borderColor: C.accentDeep,
//                       boxShadow: "0 4px 14px rgba(0,0,0,.35)",
//                     }}
//                   >
//                     {prog.emoji}
//                   </div>
//                 </div>
//                 {/* caption */}
//                 <div className="px-6 pt-10 pb-7 text-center">
//                   <h3
//                     className="font-cinzel text-lg font-bold mb-2"
//                     style={{ color: C.cream }}
//                   >
//                     {prog.title}
//                   </h3>
//                   <div
//                     className="flex items-center justify-center gap-1.5 font-inter text-xs"
//                     style={{ color: C.muted }}
//                   >
//                     <Calendar
//                       className="w-3.5 h-3.5"
//                       style={{ color: C.accent }}
//                     />
//                     <span>{prog.schedule}</span>
//                   </div>
//                   <button
//                     className="mt-5 font-inter text-[11px] uppercase tracking-[.15em] border rounded-lg px-5 py-2 transition-colors"
//                     style={{
//                       borderColor: `rgba(242,193,78,.4)`,
//                       color: C.accent,
//                     }}
//                     onMouseEnter={(e) =>
//                       ((e.currentTarget as HTMLElement).style.background =
//                         "rgba(242,193,78,.1)")
//                     }
//                     onMouseLeave={(e) =>
//                       ((e.currentTarget as HTMLElement).style.background =
//                         "transparent")
//                     }
//                   >
//                     Đăng ký tham gia
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* KHU VỰC NỔI BẬT */}
//       <section
//         ref={registerRef(4)}
//         id="khu-vuc"
//         className="py-24 px-10 text-center"
//         style={{ background: "#4A3728" }}
//       >
//         <div className="max-w-[1280px] mx-auto">
//           <SecHead title="Các Khu Vực Nổi Bật" sub="Khám phá không gian" />

//           <div className="flex items-center gap-6 justify-center">
//             {/* left */}
//             <div className="flex flex-col items-center gap-3 flex-shrink-0">
//               <Arrow
//                 dir="l"
//                 onClick={() => setAreaI(step(areaI, AREAS.length, -1))}
//               />
//               <span
//                 className="font-inter text-[10px] tracking-[.22em] uppercase"
//                 style={{
//                   color: C.muted,
//                   writingMode: "vertical-rl",
//                   transform: "rotate(180deg)",
//                 }}
//               >
//                 Khu vực trước
//               </span>
//             </div>

//             {/* image */}
//             <div className="relative flex-1" style={{ maxWidth: 1040 }}>
//               <div
//                 className="rounded-2xl overflow-hidden border"
//                 style={{
//                   height: 460,
//                   borderColor: "rgba(201,161,92,.2)",
//                   boxShadow: "0 16px 48px rgba(0,0,0,.55)",
//                 }}
//               >
//                 <img
//                   src={AREAS[areaI].img}
//                   alt={AREAS[areaI].name}
//                   className="w-full h-full object-cover transition-opacity duration-500"
//                 />
//                 <div
//                   className="absolute inset-0 rounded-2xl"
//                   style={{
//                     background:
//                       "linear-gradient(to top,rgba(42,29,20,.72) 0%,transparent 55%)",
//                   }}
//                 />
//               </div>

//               {/* banner */}
//               <div
//                 className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-7 py-4 rounded-xl border"
//                 style={{
//                   background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
//                   borderColor: `rgba(212,169,74,.5)`,
//                   minWidth: 420,
//                   boxShadow: "0 8px 24px rgba(0,0,0,.4)",
//                 }}
//               >
//                 <MapPin
//                   className="w-5 h-5 flex-shrink-0"
//                   style={{ color: C.accent }}
//                 />
//                 <div className="flex-1 text-left min-w-0">
//                   <div
//                     className="font-cinzel text-base font-bold tracking-[.15em] truncate"
//                     style={{ color: C.accent }}
//                   >
//                     {AREAS[areaI].name}
//                   </div>
//                   <div
//                     className="font-inter text-[11px] mt-0.5 truncate"
//                     style={{ color: C.muted }}
//                   >
//                     {AREAS[areaI].sub}
//                   </div>
//                 </div>
//                 <div
//                   className="font-inter text-[11px] border-l pl-4 flex-shrink-0"
//                   style={{
//                     color: C.muted,
//                     borderColor: "rgba(201,161,92,.3)",
//                   }}
//                 >
//                   {AREAS[areaI].info}
//                 </div>
//                 <button
//                   className="font-inter text-[11px] uppercase tracking-[.15em] border rounded-lg px-4 py-2 transition-colors flex-shrink-0"
//                   style={{
//                     borderColor: `rgba(242,193,78,.4)`,
//                     color: C.accent,
//                   }}
//                   onMouseEnter={(e) =>
//                     ((e.currentTarget as HTMLElement).style.background =
//                       "rgba(242,193,78,.12)")
//                   }
//                   onMouseLeave={(e) =>
//                     ((e.currentTarget as HTMLElement).style.background =
//                       "transparent")
//                   }
//                 >
//                   Khám phá
//                 </button>
//               </div>
//             </div>

//             {/* right */}
//             <div className="flex flex-col items-center gap-3 flex-shrink-0">
//               <span
//                 className="font-inter text-[10px] tracking-[.22em] uppercase"
//                 style={{
//                   color: C.muted,
//                   writingMode: "vertical-rl",
//                 }}
//               >
//                 Khu vực sau
//               </span>
//               <Arrow
//                 dir="r"
//                 onClick={() => setAreaI(step(areaI, AREAS.length, 1))}
//               />
//             </div>
//           </div>

//           <div style={{ marginTop: 68 }}>
//             <button
//               className="font-inter text-sm underline underline-offset-4 transition-colors"
//               style={{ color: C.muted }}
//               onMouseEnter={(e) =>
//                 ((e.currentTarget as HTMLElement).style.color = C.accent)
//               }
//               onMouseLeave={(e) =>
//                 ((e.currentTarget as HTMLElement).style.color = C.muted)
//               }
//             >
//               Xem tất cả các khu vực →
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* BẢO TƯỢNG NỔI BẬT */}
//       <section
//         ref={registerRef(5)}
//         id="bao-tuong"
//         className="py-24 px-10 text-center"
//         style={{ background: C.bg }}
//       >
//         <div className="max-w-[1280px] mx-auto">
//           <SecHead
//             title="Các Bảo Tượng Nổi Bật"
//             sub="Chiêm bái & tham quan ảo"
//           />

//           <div className="flex items-center gap-6 justify-center">
//             {/* left */}
//             <div className="flex flex-col items-center gap-3 flex-shrink-0">
//               <Arrow
//                 dir="l"
//                 onClick={() => setStatI(step(statI, STATUES.length, -1))}
//               />
//               <span
//                 className="font-inter text-[10px] tracking-[.22em] uppercase"
//                 style={{
//                   color: C.muted,
//                   writingMode: "vertical-rl",
//                   transform: "rotate(180deg)",
//                 }}
//               >
//                 Bảo tượng trước
//               </span>
//             </div>

//             {/* image */}
//             <div className="relative flex-1" style={{ maxWidth: 1040 }}>
//               <div
//                 className="rounded-2xl overflow-hidden border"
//                 style={{
//                   height: 460,
//                   borderColor: "rgba(201,161,92,.2)",
//                   boxShadow: "0 16px 48px rgba(0,0,0,.55)",
//                 }}
//               >
//                 <img
//                   src={STATUES[statI].img}
//                   alt={STATUES[statI].name}
//                   className="w-full h-full object-cover transition-opacity duration-500"
//                 />
//                 <div
//                   className="absolute inset-0 rounded-2xl"
//                   style={{
//                     background:
//                       "linear-gradient(to top,rgba(42,29,20,.8) 0%,transparent 55%)",
//                   }}
//                 />
//               </div>

//               {/* banner */}
//               <div
//                 className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 rounded-xl border"
//                 style={{
//                   background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
//                   borderColor: `rgba(212,169,74,.5)`,
//                   minWidth: 500,
//                   boxShadow: "0 8px 24px rgba(0,0,0,.4)",
//                 }}
//               >
//                 <Star
//                   className="w-5 h-5 flex-shrink-0"
//                   style={{ color: C.accent }}
//                 />
//                 <div className="flex-1 text-left min-w-0">
//                   <div
//                     className="font-cinzel text-sm font-bold tracking-[.12em] truncate"
//                     style={{ color: C.accent }}
//                   >
//                     {STATUES[statI].name}
//                   </div>
//                   <div
//                     className="font-inter text-[10px] mt-0.5 truncate"
//                     style={{ color: C.muted }}
//                   >
//                     {STATUES[statI].sub}
//                   </div>
//                 </div>

//                 {/* info table */}
//                 <div
//                   className="flex items-stretch gap-3 border-l pl-4 flex-shrink-0"
//                   style={{ borderColor: "rgba(201,161,92,.3)" }}
//                 >
//                   <div className="text-left">
//                     <div
//                       className="font-inter text-[9px] uppercase tracking-[.15em]"
//                       style={{ color: C.muted }}
//                     >
//                       Cụm tượng
//                     </div>
//                     <div
//                       className="font-inter text-[11px] font-semibold mt-0.5"
//                       style={{ color: C.cream }}
//                     >
//                       {STATUES[statI].cluster}
//                     </div>
//                   </div>
//                   <div
//                     className="w-px"
//                     style={{
//                       background: "rgba(201,161,92,.3)",
//                     }}
//                   />
//                   <div className="text-left">
//                     <div
//                       className="font-inter text-[9px] uppercase tracking-[.15em]"
//                       style={{ color: C.muted }}
//                     >
//                       Khu vực
//                     </div>
//                     <div
//                       className="font-inter text-[11px] font-semibold mt-0.5"
//                       style={{ color: C.cream }}
//                     >
//                       {STATUES[statI].area}
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   className="font-inter text-[11px] uppercase tracking-[.15em] border rounded-lg px-4 py-2 transition-colors flex-shrink-0"
//                   style={{
//                     borderColor: `rgba(242,193,78,.4)`,
//                     color: C.accent,
//                   }}
//                   onMouseEnter={(e) =>
//                     ((e.currentTarget as HTMLElement).style.background =
//                       "rgba(242,193,78,.12)")
//                   }
//                   onMouseLeave={(e) =>
//                     ((e.currentTarget as HTMLElement).style.background =
//                       "transparent")
//                   }
//                 >
//                   Khám phá
//                 </button>
//               </div>
//             </div>

//             {/* right */}
//             <div className="flex flex-col items-center gap-3 flex-shrink-0">
//               <span
//                 className="font-inter text-[10px] tracking-[.22em] uppercase"
//                 style={{
//                   color: C.muted,
//                   writingMode: "vertical-rl",
//                 }}
//               >
//                 Bảo tượng sau
//               </span>
//               <Arrow
//                 dir="r"
//                 onClick={() => setStatI(step(statI, STATUES.length, 1))}
//               />
//             </div>
//           </div>

//           <div style={{ marginTop: 68 }}>
//             <button
//               className="font-inter text-sm underline underline-offset-4 transition-colors"
//               style={{ color: C.muted }}
//               onMouseEnter={(e) =>
//                 ((e.currentTarget as HTMLElement).style.color = C.accent)
//               }
//               onMouseLeave={(e) =>
//                 ((e.currentTarget as HTMLElement).style.color = C.muted)
//               }
//             >
//               Xem tất cả bảo tượng →
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer
//         className="py-16 px-10 relative overflow-hidden"
//         style={{ background: "#C9AD7B" }}
//       >
//         {/* decorative */}
//         <div
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             backgroundImage: `radial-gradient(ellipse at 15% 55%, ${C.surface} 0%, transparent 55%), radial-gradient(ellipse at 82% 28%, ${C.primary} 0%, transparent 52%)`,
//             opacity: 0.18,
//           }}
//         />
//         {/* lines */}
//         <div
//           className="absolute inset-0 pointer-events-none opacity-[.05]"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(42,29,20,.8) 39px, rgba(42,29,20,.8) 40px)",
//           }}
//         />

//         <div className="max-w-[1280px] mx-auto relative">
//           {/* logo + address */}
//           <div className="flex flex-col items-center mb-12">
//             <div
//               className="w-24 h-24 rounded-full border-2 flex items-center justify-center mb-5 shadow-md"
//               style={{
//                 background: C.paper,
//                 borderColor: C.dark,
//               }}
//             >
//               <span
//                 className="font-cinzel font-black text-center leading-tight"
//                 style={{ fontSize: 10, color: C.dark }}
//               >
//                 TÙNG
//                 <br />
//                 LÂM
//                 <br />
//                 HÒA PHÚC
//               </span>
//             </div>
//             <h2
//               className="font-cinzel text-2xl font-bold tracking-[.15em]"
//               style={{ color: C.dark }}
//             >
//               TÙNG LÂM HÒA PHÚC
//             </h2>
//             <p
//               className="font-inter text-sm mt-1 tracking-widest"
//               style={{ color: "#5C4630" }}
//             >
//               Thiền Viện · Hà Nội
//             </p>
//             <p
//               className="font-inter text-sm mt-3 text-center max-w-md leading-relaxed"
//               style={{ color: "#5C4630" }}
//             >
//               Số 12, Đường Hòa Phúc, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội
//             </p>
//           </div>

//           {/* 2-col */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
//             {/* social */}
//             <div>
//               <h4
//                 className="font-cinzel text-xs font-bold uppercase tracking-[.2em] mb-5"
//                 style={{ color: C.dark }}
//               >
//                 Theo Dõi Chúng Tôi
//               </h4>
//               <div className="flex flex-wrap gap-3 mb-6">
//                 {(
//                   [
//                     {
//                       icon: FaFacebook,
//                       label: "Facebook",
//                       bg: "#1877F2",
//                     },
//                     {
//                       icon: FaYoutube,
//                       label: "YouTube",
//                       bg: "#FF0000",
//                     },
//                     {
//                       icon: FaInstagram,
//                       label: "Instagram",
//                       bg: "#C13584",
//                     },
//                     {
//                       label: "TikTok",
//                       bg: "#010101",
//                       text: "TK",
//                     },
//                     {
//                       label: "Zalo",
//                       bg: "#0068FF",
//                       text: "Za",
//                     },
//                   ] as any[]
//                 ).map(({ icon: Icon, label, bg, text }) => (
//                   <button
//                     key={label}
//                     aria-label={label}
//                     className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow transition-transform hover:scale-110"
//                     style={{ background: bg }}
//                   >
//                     {Icon ? (
//                       <Icon className="w-4 h-4" />
//                     ) : (
//                       <span className="font-inter text-xs font-bold">
//                         {text}
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//               <div
//                 className="flex flex-col gap-1.5 font-inter text-sm"
//                 style={{ color: "#5C4630" }}
//               >
//                 <p>📍 Hà Nội, Việt Nam</p>
//                 <p>🕐 Giờ mở cửa: 6:00 – 20:00 hằng ngày</p>
//                 <p>🌐 www.tunglamhoaphu.vn</p>
//               </div>
//             </div>

//             {/* contact */}
//             <div>
//               <h4
//                 className="font-cinzel text-xs font-bold uppercase tracking-[.2em] mb-5"
//                 style={{ color: C.dark }}
//               >
//                 Thông Tin Liên Hệ
//               </h4>
//               <div className="flex flex-col gap-4">
//                 {(
//                   [
//                     {
//                       role: "Trưởng ban lãnh chúng",
//                       name: "Thượng tọa Thích Hòa Phúc",
//                       tel: "024 3868 xxxx",
//                     },
//                     {
//                       role: "Thư ký Ban tổ chức",
//                       name: "Đại đức Thích Tâm An",
//                       tel: "0912 xxx xxx",
//                     },
//                     {
//                       role: "Cố vấn pháp lý",
//                       name: "Cư sĩ Nguyễn Văn Đức",
//                       tel: "0987 xxx xxx",
//                     },
//                     {
//                       role: "Trưởng Ban Thanh Niên PT",
//                       name: "Cư sĩ Trần Thị Bình",
//                       tel: "0978 xxx xxx",
//                     },
//                   ] as Contact[]
//                 ).map((c) => (
//                   <div key={c.role} className="flex items-start gap-3">
//                     <Phone
//                       className="w-4 h-4 mt-0.5 flex-shrink-0"
//                       style={{ color: "#5C4630" }}
//                     />
//                     <div>
//                       <div
//                         className="font-inter text-[10px] uppercase tracking-[.15em]"
//                         style={{ color: "#8B6F47" }}
//                       >
//                         {c.role}
//                       </div>
//                       <div
//                         className="font-inter text-sm font-semibold"
//                         style={{ color: C.dark }}
//                       >
//                         {c.name}
//                       </div>
//                       <div
//                         className="font-inter text-xs"
//                         style={{ color: "#5C4630" }}
//                       >
//                         {c.tel}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* bottom */}
//           <div
//             className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3"
//             style={{ borderColor: "rgba(42,29,20,.2)" }}
//           >
//             <p className="font-inter text-xs" style={{ color: "#5C4630" }}>
//               © 2024 Tùng Lâm Hòa Phúc. Bảo lưu mọi quyền.
//             </p>
//             <p
//               className="font-inter text-xs italic"
//               style={{ color: "#5C4630" }}
//             >
//               "Nơi để trở về – Chốn thiêng bình yên" 🪷
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;

"use client";
//import { FC, useEffect, useRef, useState } from "react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { C } from "@/data/palette";
import { SECTION_IDS } from "@/data/home-data";
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import NewsSection from "@/components/home/NewsSection";
import DharmaSection from "@/components/home/DharmaSection";
import CalendarSection from "@/components/home/CalendarSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import GallerySection from "@/components/home/GallerySection";
import ContactSection from "@/components/home/ContactSection";

// NOTE: there is no "Introduction" section in the source page — the original
// markup goes straight from Hero to the news carousel. Add an Introduction
// component here once real content (chùa history / giới thiệu) is available.

const Home: FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [activeSection, setActive] = useState<number>(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const pos = window.scrollY + window.innerHeight / 2;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.offsetTop <= pos && el.offsetTop + el.offsetHeight > pos) {
          setActive(i);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrolled = scrollY > 64;

  const registerRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      sectionRefs.current[i] = el;
    },
    [],
  );

  return (
    <div
      style={{ background: C.bg, fontFamily: "'Noto Serif', serif" }}
      className="min-h-screen overflow-x-hidden"
    >
      {/* sticky side section dots */}
      <nav
        className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3"
        aria-label="Điều hướng section"
      >
        {SECTION_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() =>
              sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-2.5 h-2.5 rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: C.accent,
              background: i === activeSection ? C.accent : "transparent",
              transform: i === activeSection ? "scale(1.3)" : "scale(1)",
            }}
            aria-label={`Section ${id}`}
          />
        ))}
      </nav>

      <Header scrolled={scrolled} />

      <Hero />

      <NewsSection sectionRef={registerRef(0)} />
      <DharmaSection sectionRef={registerRef(1)} />
      <CalendarSection sectionRef={registerRef(2)} />
      <ProgramsSection sectionRef={registerRef(3)} />
      <GallerySection areasRef={registerRef(4)} statuesRef={registerRef(5)} />

      <ContactSection />
    </div>
  );
};

export default Home;
