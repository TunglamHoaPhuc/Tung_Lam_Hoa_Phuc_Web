import { FC } from "react";
import { FaYoutube } from "react-icons/fa";
import { C } from "@/data/palette";
import { HERO_CTAS } from "@/data/home-data";

/** Top banner: background image, title, CTA button row, YouTube highlight bar. */
const Hero: FC = () => {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ minHeight: 780, background: C.dark }}
    >
      <img
        src="https://images.unsplash.com/photo-1759367205550-3dc1cb7055a8?w=1440&h=820&fit=crop&auto=format"
        alt="Người lễ Phật trong không gian thiền định linh thiêng"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.42 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(42,29,20,.55) 0%, rgba(42,29,20,.3) 45%, rgba(42,29,20,.92) 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-10 pt-28 pb-20 flex flex-col items-center gap-5 w-full">
        {/* eyebrow */}
        <span
          className="font-inter text-[10px] uppercase tracking-[.4em] px-5 py-2 rounded-full border"
          style={{ color: C.muted, borderColor: "rgba(242,193,78,.3)" }}
        >
          Thiền Viện Hà Nội &middot; Thành lập 2005
        </span>

        {/* title */}
        <h1
          className="font-cinzel font-black uppercase leading-none tracking-[.07em]"
          style={{
            fontSize: "clamp(2.8rem,6.8vw,5.5rem)",
            color: C.accent,
            textShadow: `0 0 52px ${C.accent}cc, 0 0 100px ${C.accent}44`,
          }}
        >
          NƠI ĐỂ TRỞ VỀ
        </h1>
        <p
          className="font-cinzel font-light uppercase tracking-[.35em]"
          style={{
            fontSize: "clamp(.9rem,1.8vw,1.3rem)",
            color: C.cream,
          }}
        >
          Chốn Thiêng Bình Yên
        </p>
        <p
          className="text-sm max-w-lg leading-relaxed mt-1"
          style={{ color: C.muted }}
        >
          Tùng Lâm Hòa Phúc — nơi giao thoa của thiền định, trí tuệ và tâm linh.
          Cửa ngõ để mỗi tâm hồn tìm về sự an trú đích thực.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          {HERO_CTAS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="group flex flex-col items-center gap-2 border rounded-xl px-5 py-4 min-w-[130px] transition-all duration-200 hover:scale-[1.03] active:scale-[.97]"
              style={{
                borderColor: C.accentDeep,
                background: "rgba(74,55,40,.52)",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(139,105,20,.8)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(74,55,40,.52)")
              }
            >
              <Icon className="w-5 h-5" style={{ color: C.accent }} />
              <span
                className="font-inter text-[11px] font-bold uppercase tracking-wide text-center leading-snug whitespace-pre-line"
                style={{ color: C.cream }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* YouTube bar */}
        <div
          className="flex items-center gap-3 mt-2 px-5 py-3 rounded-xl border cursor-pointer transition-colors"
          style={{
            background: "rgba(42,29,20,.75)",
            borderColor: "rgba(201,161,92,.25)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
            <FaYoutube className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div
              className="font-inter text-xs font-semibold"
              style={{ color: C.cream }}
            >
              Pháp thoại: Bát Nhã Tâm Kinh – Toàn bộ ý nghĩa
            </div>
            <div className="font-inter text-[11px]" style={{ color: C.muted }}>
              Watch on YouTube &middot; 2.1M lượt xem
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ opacity: 0.5 }}
      >
        <div
          className="w-px h-10"
          style={{
            background: `linear-gradient(to bottom, transparent, ${C.accent})`,
          }}
        />
        <span
          className="font-inter text-[10px] tracking-[.3em] uppercase"
          style={{ color: C.muted }}
        >
          Cuộn xuống
        </span>
      </div>
    </section>
  );
};

export default Hero;
