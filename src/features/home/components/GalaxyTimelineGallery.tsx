'use client';

import { FC, useState } from "react";
import { X, Volume2, ArrowLeft } from "lucide-react";
import { C } from "@/config/theme";

// ─── Dữ liệu Timeline Ban Đầu ──────────────────────────────────────────────────────
const TIMELINE_YEARS = [
  {
    year: "2015",
    label: "Giai Đoạn Khai Sáng",
    desc: "Văn bản mô tả giai đoạn nền móng kiến tạo đầu tiên, đặt những viên gạch đầu tiên cho Tùng Lâm Hòa Phúc.",
    icon: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-thap/bao-thap-banner.webp",
        ],
      },
    ],
  },
  {
    year: "2018",
    label: "Giai Đoạn Phát Triển",
    desc: "Giai đoạn phát triển rộng khắp, tổ chức nhiều khóa tu và đại lễ, thu hút đông đảo Phật tử về tham dự tu học.",
    icon: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/06-33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp",
        ],
      },
    ],
  },
  {
    year: "2021",
    label: "Sự Kiện Trọng Đại",
    desc: "Sự kiện quan trọng nhất: Đại lễ Phật đản Giai đoạn II, ghi dấu ấn sâu đậm trong lịch sử Tùng Lâm Hòa Phúc.",
    icon: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-thap/bao-thap-banner.webp",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/06-33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp",
        ],
      },
    ],
  },
  {
    year: "2024",
    label: "Hoằng Pháp Phát Triển",
    desc: "Giai đoạn hoằng pháp phát triển rộng khắp, tổ chức nhiều khóa tu và đại lễ lớn trong và ngoài nước.",
    icon: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-thap/bao-thap-banner.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/06-33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp",
        ],
      },
    ],
  },
  {
    year: "2026+",
    label: "Tương Lai Phát Triển",
    desc: "Tầm nhìn phát triển bền vững — mở rộng không gian tu học, số hóa kho tư liệu Phật học và hoằng pháp toàn cầu.",
    icon: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp",
    photos: [
      {
        cat: "Dòng Chảy Hoằng Pháp",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-thap/bao-thap-banner.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/06-33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp",
        ],
      },
      {
        cat: "Sứ Giả Như Lai",
        imgs: [
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp",
          "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp",
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
              ORBIT TIMELINE · DÒNG THỜI GIAN QUỸ ĐẠO
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
                  <span
                    style={{
                      fontFamily: "'UTM Niagara', sans-serif",
                      color: isActive ? C.accent : C.cream,
                      textShadow: isActive ? `0 0 16px ${C.accent}` : "none",
                      fontSize: isActive ? "2.2rem" : "1.6rem",
                      letterSpacing: "0.05em",
                    }}
                    className="transition-all duration-300 font-bold"
                  >
                    {yt.year}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Active Year Card Detail Panel ── */}
          {active && (
            <div
              className="mt-8 rounded-2xl p-6 md:p-8 border relative z-20 shadow-2xl transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(42,29,20,.95) 0%, rgba(26,15,8,.98) 100%)",
                borderColor: `${C.accent}66`,
                boxShadow: `0 0 40px ${C.accent}22`,
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f2cc8f]/20">
                <div>
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs uppercase tracking-widest text-[#f2cc8f] font-bold"
                  >
                    MỐC THỜI GIAN {active.year}
                  </span>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-[#ffde59] tracking-wider mt-1"
                  >
                    {active.label}
                  </h3>
                </div>
                <p className="text-sm text-[#e3d2c1] max-w-xl leading-relaxed">
                  {active.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {active.photos.map((group, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-sm font-bold uppercase tracking-wider text-[#ffde59] flex items-center gap-2 border-b border-[#f2cc8f]/30 pb-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#ffde59]" />
                      <span>{group.cat}</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {group.imgs.map((src, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setLightboxImg(src)}
                          className="relative h-24 sm:h-28 rounded-lg overflow-hidden border border-[#f2cc8f]/30 hover:border-[#ffde59] group/img cursor-pointer transition-all duration-300 shadow-md"
                        >
                          <img
                            src={src}
                            alt={`${active.year} - ${group.cat} ${pIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover/img:bg-transparent transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#f2cc8f]/50 shadow-2xl">
            <img src={lightboxImg} alt="Ảnh Phóng To" className="w-full h-full object-contain" />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 text-[#ffde59] border border-[#f2cc8f]/40 flex items-center justify-center cursor-pointer hover:scale-110 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalaxyTimelineGallery;
