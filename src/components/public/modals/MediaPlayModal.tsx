'use client';

import { FC } from "react";
import { X, Play, Volume2, Sparkles } from "lucide-react";
import { WisdomItem } from "@/types/wisdom-tags";

interface MediaPlayModalProps {
  item: WisdomItem | null;
  onClose: () => void;
}

export const MediaPlayModal: FC<MediaPlayModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{
        background: "rgba(0,0,0,0.86)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden border shadow-2xl animate-in zoom-in-95 flex flex-col"
        style={{
          background: "linear-gradient(160deg, rgba(74,55,40,0.96) 0%, rgba(26,15,8,0.98) 100%)",
          borderColor: "#F2C14E",
          boxShadow: "0 0 60px rgba(242,193,78,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. Top Bar Header ── */}
        <div
          className="p-4 md:p-5 border-b flex items-center justify-between relative z-10"
          style={{
            background: "rgba(42,29,20,0.7)",
            borderColor: "rgba(242,193,78,0.3)",
          }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#F2C14E] animate-pulse" />
            <h3
              className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#F2C14E]"
              style={{ fontFamily: "'UTM Niagara', 'Playfair Display', serif" }}
            >
              {item.primaryCategoryTag}
            </h3>
          </div>

          {/* Close button [X] */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:scale-110"
            style={{
              background: "rgba(0,0,0,0.5)",
              borderColor: "#F2C14E",
              color: "#F2C14E",
            }}
            aria-label="Đóng Pop-up"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── 2. Khối Player Trung Tâm ── */}
        <div className="relative overflow-hidden group" style={{ minHeight: 320, maxHeight: 420 }}>
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(26,15,8,0.95) 0%, rgba(0,0,0,0.3) 60%)",
            }}
          />

          {/* Large Play Button center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110 shadow-2xl"
              style={{
                background: "#F2C14E",
                borderColor: "#ffffff",
                boxShadow: "0 0 40px rgba(242,193,78,0.8)",
              }}
            >
              <Play className="w-9 h-9 text-[#2A1D14] ml-1 fill-[#2A1D14]" />
            </div>
          </div>

          {/* Audio Waveform overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-[#F2C14E]"
            style={{
              background: "rgba(26,15,8,0.85)",
              border: "1px solid rgba(242,193,78,0.4)",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>Phát Pháp Âm / Video</span>
          </div>
        </div>

        {/* ── 3. Khối Thông Tin Chi Tiết Phía Dưới Player ── */}
        <div
          className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t"
          style={{
            background: "rgba(42,29,20,0.85)",
            borderColor: "rgba(242,193,78,0.25)",
          }}
        >
          {/* Bên trái: Tiêu đề & Nguồn phát */}
          <div className="md:col-span-6 space-y-2">
            <h4
              className="text-lg md:text-xl font-bold leading-snug text-[#F2C14E]"
              style={{
                fontFamily: "'UTM Avo', sans-serif",
                fontWeight: "bold",
              }}
            >
              {item.title}
            </h4>

            <div className="flex items-center gap-2 text-xs font-bold text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              <span className="text-[#F2C14E]">NGUỒN:</span>
              <span className="uppercase tracking-wider">{item.originTag.label}</span>
            </div>
          </div>

          {/* Bên phải: Đoạn trích Pháp ngữ / Lời dạy */}
          <div className="md:col-span-6 border-l-0 md:border-l pl-0 md:pl-6" style={{ borderColor: "rgba(242,193,78,0.2)" }}>
            <p
              className="text-xs md:text-sm text-[#e3d2c1] leading-relaxed"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {item.excerpt || "Nội dung pháp âm giúp hành giả hiểu đúng chánh pháp và thiết lập an lạc nội tâm."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
