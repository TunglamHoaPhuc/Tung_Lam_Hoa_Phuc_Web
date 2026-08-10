'use client';

import { FC, useState } from "react";
import { X, Maximize2, Sparkles, MapPin, BookOpen } from "lucide-react";

interface ArtVariation {
  id: string;
  title: string;
  location: string;
  meaning: string;
  imgUrl: string;
}

interface BuddhistArtGalleryProps {
  variations: ArtVariation[];
}

export const BuddhistArtGallery: FC<BuddhistArtGalleryProps> = ({ variations }) => {
  const [selectedArt, setSelectedArt] = useState<ArtVariation | null>(null);

  if (!variations || variations.length === 0) return null;

  return (
    <div className="w-full my-16 border-t pt-12" style={{ borderColor: "rgba(242,193,78,0.2)" }}>
      {/* ── Section Header ── */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-3" style={{ background: "rgba(242,193,78,0.15)", borderColor: "#F2C14E", color: "#F2C14E" }}>
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <h2
          className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-[#F2C14E]"
          style={{
            fontFamily: "'UTM Niagara', 'Playfair Display', serif",
            textShadow: "0 0 28px rgba(242,193,78,0.6)",
          }}
        >
          NGHỆ THUẬT PHẬT GIÁO
        </h2>
        <p className="text-xs text-[#c9b896] uppercase tracking-widest mt-2" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
          Các hình thái &amp; dị bản nghệ thuật tôn giáo qua các thời kỳ lịch sử
        </p>
      </div>

      {/* ── Grid 3 cột các tác phẩm nghệ thuật ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {variations.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArt(art)}
            className="group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col"
            style={{
              background: "linear-gradient(160deg, rgba(74,55,40,0.8) 0%, rgba(26,15,8,0.95) 100%)",
              borderColor: "rgba(242,193,78,0.35)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={art.imgUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(26,15,8,0.9) 0%, transparent 60%)",
                }}
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-black/60 text-[#F2C14E] border border-[#F2C14E]/50 flex items-center justify-center">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between" style={{ background: "rgba(42,29,20,0.6)" }}>
              <div>
                <h3
                  className="text-base font-bold leading-snug text-[#F2C14E] group-hover:text-white transition-colors mb-2"
                  style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}
                >
                  {art.title}
                </h3>
                <p className="text-xs text-[#c9b896] line-clamp-2 leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  {art.meaning}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t text-[10px] text-[#F2C14E] font-bold flex items-center gap-1.5" style={{ borderColor: "rgba(242,193,78,0.15)", fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
                <MapPin className="w-3 h-3 text-[#F2C14E]" />
                <span>{art.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pop-up Lightbox khi nhấp chọn Dị Bản ── */}
      {selectedArt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
          onClick={() => setSelectedArt(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden border shadow-2xl animate-in zoom-in-95"
            style={{
              background: "linear-gradient(160deg, rgba(74,55,40,0.96) 0%, rgba(26,15,8,0.98) 100%)",
              borderColor: "#F2C14E",
              boxShadow: "0 0 60px rgba(242,193,78,0.35)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArt(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/80"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image */}
            <div className="relative overflow-hidden" style={{ maxHeight: "50vh" }}>
              <img src={selectedArt.imgUrl} alt={selectedArt.title} className="w-full h-full object-cover max-h-[50vh]" />
            </div>

            {/* Title & Split Info Box */}
            <div className="p-6">
              <h3
                className="text-2xl font-bold uppercase text-[#F2C14E] mb-4"
                style={{ fontFamily: "'UTM Niagara', 'Playfair Display', serif" }}
              >
                {selectedArt.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: "rgba(242,193,78,0.2)" }}>
                {/* Khu vực */}
                <div className="p-4 rounded-xl border" style={{ background: "rgba(26,15,8,0.8)", borderColor: "rgba(242,193,78,0.25)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#F2C14E]" />
                    <span className="text-xs uppercase font-bold text-[#F2C14E]" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
                      KHU VỰC LƯU GIỮ:
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#e3d2c1]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {selectedArt.location}
                  </p>
                </div>

                {/* Ý nghĩa */}
                <div className="p-4 rounded-xl border" style={{ background: "rgba(26,15,8,0.8)", borderColor: "rgba(242,193,78,0.25)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-[#F2C14E]" />
                    <span className="text-xs uppercase font-bold text-[#F2C14E]" style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: "bold" }}>
                      Ý NGHĨA BIỂU TƯỢNG:
                    </span>
                  </div>
                  <p className="text-xs text-[#c9b896] leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {selectedArt.meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
