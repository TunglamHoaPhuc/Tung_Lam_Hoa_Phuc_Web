'use client';

import { FC, useState } from "react";
import { X, Volume2, ArrowLeft } from "lucide-react";
import { C } from "@/config/theme";

// ─── Dữ liệu Timeline ──────────────────────────────────────────────────────
const TIMELINE_YEARS = [
  {
    year: "2015",
    label: "Giai Đoạn Khai Sáng",
    desc: "Văn bản mô tả giai đoạn nền móng kiến tạo đầu tiên, đặt những viên gạch đầu tiên cho Tùng Lâm Hòa Phúc.",
    icon: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=80&h=80&fit=crop",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=220&h=130&fit=crop",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1618061013016-f8307f69f7a7?w=220&h=130&fit=crop",
        ],
      },
    ],
  },
  {
    year: "2018",
    label: "Giai Đoạn Phát Triển",
    desc: "Giai đoạn phát triển rộng khắp, tổ chức nhiều khóa tu và đại lễ, thu hút đông đảo Phật tử về tham dự tu học.",
    icon: "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=80&h=80&fit=crop",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1658834117213-d0b7e7d8b9ec?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1506870144739-432c2b8141bf?w=220&h=130&fit=crop",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=220&h=130&fit=crop",
        ],
      },
    ],
  },
  {
    year: "2021",
    label: "Sự Kiện Trọng Đại",
    desc: "Sự kiện quan trọng nhất: Đại lễ Phật đản Giai đoạn II, ghi dấu ấn sâu đậm trong lịch sử Tùng Lâm Hòa Phúc.",
    icon: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=80&h=80&fit=crop",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1618061013016-f8307f69f7a7?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=220&h=130&fit=crop",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=220&h=130&fit=crop",
        ],
      },
    ],
  },
  {
    year: "2024",
    label: "Hoằng Pháp Phát Triển",
    desc: "Giai đoạn hoằng pháp phát triển rộng khắp, tổ chức nhiều khóa tu và đại lễ lớn trong và ngoài nước.",
    icon: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=80&h=80&fit=crop",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1658834117213-d0b7e7d8b9ec?w=220&h=130&fit=crop",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=220&h=130&fit=crop",
        ],
      },
    ],
  },
  {
    year: "2026+",
    label: "Tương Lai Phát Triển",
    desc: "Tầm nhìn phát triển bền vững — mở rộng không gian tu học, số hóa kho tư liệu Phật học và hoằng pháp toàn cầu.",
    icon: "https://images.unsplash.com/photo-1618061013016-f8307f69f7a7?w=80&h=80&fit=crop",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://images.unsplash.com/photo-1659513704374-0dc63b98dbb5?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=220&h=130&fit=crop",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1618061013016-f8307f69f7a7?w=220&h=130&fit=crop",
          "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=220&h=130&fit=crop",
        ],
      },
    ],
  },
];

interface GalaxyTimelineGalleryProps {
  onClose?: () => void;
}

const GalaxyTimelineGallery: FC<GalaxyTimelineGalleryProps> = ({ onClose }) => {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const active = activeYear !== null ? TIMELINE_YEARS[activeYear] : null;

  // Tọa độ orbit cho 5 mốc năm trên dải thiên hà
  const orbitPositions = [
    { x: "8%",  y: "70%" },
    { x: "25%", y: "30%" },
    { x: "50%", y: "52%" },
    { x: "72%", y: "20%" },
    { x: "88%", y: "65%" },
  ];

  return (
    <div
      id="kho-anh-tu-lieu"
      className="fixed inset-0 z-[100] w-full h-full min-h-screen overflow-y-auto bg-[#0d0a06] text-[#e3d2c1] flex flex-col justify-start animate-in fade-in duration-300"
    >
      {/* ── Thanh Tiêu Đề Dính Đỉnh Có Nút Back ── */}
      <div className="sticky top-0 z-50 bg-[#1a0f08]/95 backdrop-blur-md border-b border-[#f2cc8f]/20 px-6 py-4 flex items-center justify-between shadow-2xl">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#f2cc8f]/50 bg-[#2a1d14] text-[#ffde59] hover:bg-[#ffde59] hover:text-[#2a1d14] transition-all duration-300 cursor-pointer font-bold text-xs uppercase tracking-wider shadow-md"
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </button>

        <div
          style={{ fontFamily: "'UTM Niagara', sans-serif" }}
          className="text-2xl md:text-4xl text-[#ffde59] tracking-wider uppercase font-bold hidden sm:block drop-shadow-[0_0_10px_rgba(255,222,89,0.4)]"
        >
          KHO ẢNH TƯ LIỆU TÙNG LÂM HÒA PHÚC
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-[#f2cc8f]/50 bg-[#2a1d14] text-[#ffde59] hover:scale-110 transition-all flex items-center justify-center cursor-pointer shadow-lg"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="py-12 px-6 md:px-12 relative overflow-hidden flex-1">
        {/* ── Nền không gian thiên hà ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* starfield gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 40%, rgba(74,55,40,.6) 0%, rgba(13,10,6,1) 65%)",
            }}
          />
          {/* orbit arc - animated glow path */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1440 700" preserveAspectRatio="none">
            <path
              d="M 80,490 Q 200,120 520,370 Q 720,540 1040,140 Q 1250,20 1370,460"
              fill="none"
              stroke={`url(#orbitGrad)`}
              strokeWidth="2"
              strokeDasharray="8 6"
            />
            <defs>
              <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={C.accent} stopOpacity="0" />
                <stop offset="30%" stopColor={C.accent} stopOpacity="0.8" />
                <stop offset="70%" stopColor={C.accent} stopOpacity="0.5" />
                <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* small star dots */}
            {[...Array(40)].map((_, i) => (
              <circle
                key={i}
                cx={`${(i * 37 + 20) % 1440}`}
                cy={`${(i * 53 + 15) % 700}`}
                r={i % 5 === 0 ? 2 : 1}
                fill={C.accent}
                opacity={0.15 + (i % 4) * 0.1}
              />
            ))}
          </svg>
          {/* center glow */}
          <div
            className="absolute"
            style={{
              left: "48%", top: "48%",
              width: 180, height: 180,
              transform: "translate(-50%,-50%)",
              background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`,
            }}
          />
        </div>

        <div className="max-w-[1440px] mx-auto relative z-10">
          {/* ── Tiêu đề Chuẩn Font UTM Niagara & UTM Avo ── */}
          <div className="text-center mb-12">
            <span
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-xs uppercase tracking-[.3em] px-5 py-2 rounded-full border border-[#f2cc8f]/40 inline-block mb-4 text-[#f2cc8f] font-bold"
            >
              ORBIT TIMELINE · DÒNG THỜI GIAN QUỶ ĐẠO
            </span>
            <h2
              style={{ fontFamily: "'UTM Niagara', sans-serif" }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-[#ffde59] drop-shadow-[0_0_20px_rgba(255,222,89,0.5)]"
            >
              KHO ẢNH TƯ LIỆU: TÙNG LÂM HÒA PHÚC
            </h2>
          </div>

          {/* ── Orbit Map ── */}
          <div className="relative" style={{ height: 380 }}>
            {TIMELINE_YEARS.map((yt, i) => {
              const pos = orbitPositions[i];
              const isActive = activeYear === i;
              return (
                <button
                  key={yt.year}
                  onClick={() => setActiveYear(activeYear === i ? null : i)}
                  className="absolute flex flex-col items-center gap-2 group transition-all duration-300 cursor-pointer"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    transform: "translate(-50%, -50%)",
                    zIndex: isActive ? 20 : 10,
                  }}
                  aria-label={`Xem ảnh năm ${yt.year}`}
                >
                  {/* orbit ring glow */}
                  <div
                    className="absolute rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 80 : 56,
                      height: isActive ? 80 : 56,
                      border: `2px solid ${C.accent}`,
                      opacity: isActive ? 1 : 0.4,
                      boxShadow: isActive ? `0 0 24px ${C.accent}88, 0 0 48px ${C.accent}44` : "none",
                      transform: "translate(-50%, -50%)",
                      left: "50%", top: "50%",
                      animation: isActive ? "pulse 2s infinite" : "none",
                    }}
                  />
                  {/* planet dot */}
                  <div
                    className="rounded-full border-2 overflow-hidden relative z-10 transition-all duration-300"
                    style={{
                      width: isActive ? 60 : 44,
                      height: isActive ? 60 : 44,
                      borderColor: C.accent,
                      boxShadow: `0 0 16px ${C.accent}66`,
                      background: C.dark,
                    }}
                  >
                    <img src={yt.icon} alt={yt.year} className="w-full h-full object-cover opacity-70" />
                  </div>
                  {/* year label chuẩn font UTM Niagara */}
                  <span
                    style={{
                      fontFamily: "'UTM Niagara', sans-serif",
                      color: isActive ? C.accent : C.cream,
                      textShadow: isActive ? `0 0 16px ${C.accent}` : "none",
                    }}
                    className="text-2xl sm:text-3xl font-bold uppercase leading-none mt-1 transition-all duration-300"
                  >
                    {yt.year}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Modal Pop-up Filmstrip ── */}
          {active && activeYear !== null && (
            <div
              className="mt-4 rounded-2xl overflow-hidden border transition-all duration-500"
              style={{
                background: `linear-gradient(160deg, rgba(74,55,40,.95), rgba(26,15,8,.97))`,
                borderColor: `${C.accent}55`,
                boxShadow: `0 0 60px ${C.accent}22`,
              }}
            >
              {/* header modal dùng font UTM Niagara & UTM Avo */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: `${C.accent}22` }}
              >
                <div>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                    className="text-3xl md:text-4xl text-[#ffde59] uppercase font-bold tracking-wide"
                  >
                    {active.year} — {active.label}
                  </h3>
                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs sm:text-sm text-[#e3d2c1] leading-relaxed mt-1 opacity-90 font-normal"
                  >
                    {active.desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveYear(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                  style={{ background: "rgba(42,29,20,.8)", color: C.cream }}
                  aria-label="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* filmstrip by category */}
              <div className="p-6 space-y-6">
                {active.photos.map((cat) => (
                  <div key={cat.cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 rounded" style={{ background: C.accent }} />
                      <span
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-xs font-bold uppercase tracking-widest text-[#ffde59]"
                      >
                        {cat.cat}
                      </span>
                    </div>
                    {/* filmstrip row */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {cat.imgs.map((img, j) => (
                        <button
                          key={j}
                          onClick={() => setLightboxImg(img)}
                          className="flex-none rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
                          style={{
                            width: 220, height: 130,
                            borderColor: `${C.accent}44`,
                          }}
                          aria-label={`Xem ảnh ${j + 1}`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ambient sound player */}
              <div
                className="flex items-center gap-3 px-6 py-3 border-t"
                style={{ borderColor: `${C.accent}22` }}
              >
                <Volume2 className="w-4 h-4 flex-shrink-0" style={{ color: C.accent }} />
                <span
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs text-[#e3d2c1]/80 font-normal"
                >
                  Gàu thoma liên mục — nhạc thiền thanh tĩnh
                </span>
                {/* fake audio slider */}
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(242,193,78,.2)" }}>
                  <div className="h-full w-1/3 rounded-full" style={{ background: C.accent }} />
                </div>
                <span
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs text-[#e3d2c1]/60 font-normal"
                >
                  timeline.gsap
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)" }}
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white border border-[#f2cc8f]/40 bg-[#2a1d14] hover:scale-110 transition-transform cursor-pointer"
            onClick={() => setLightboxImg(null)}
            aria-label="Đóng lightbox"
          >
            <X className="w-5 h-5 text-[#ffde59]" />
          </button>
          <img
            src={lightboxImg}
            alt="Ảnh tư liệu Tùng Lâm Hòa Phúc"
            className="max-w-5xl max-h-[85vh] w-full object-contain rounded-xl shadow-2xl border border-[#f2cc8f]/30"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* CSS animation cho pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); }
        }
      `}</style>
    </div>
  );
};

export default GalaxyTimelineGallery;
