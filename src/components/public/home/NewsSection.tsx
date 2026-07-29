import { FC, useState } from "react";
import { C } from "@/config/theme";
import { NEWS } from "@/features/home/data/home-data";
import type { SectionRef } from "@/features/home/types";
import { step } from "@/lib/carousel";
import SecHead from "@/components/ui/SecHead";
import Arrow from "@/components/ui/Arrow";
import Dots from "@/components/ui/Dots";

interface NewsSectionProps {
  sectionRef: SectionRef;
}

/** "Tin Mới Nhất" — news carousel with hexagon category label and prev/next side previews. */
const NewsSection: FC<NewsSectionProps> = ({ sectionRef }) => {
  const [newsI, setNewsI] = useState<number>(0);

  return (
    <section
      ref={sectionRef}
      id="tin-moi"
      className="relative py-24 px-10 overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* subtle bg texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <img
          src="https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1440&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[1280px] mx-auto relative">
        <SecHead title="Tin Mới Nhất" sub="Hoạt động & Sự kiện" />

        <div className="flex flex-col items-center">
          {/* carousel image */}
          <div className="relative w-full max-w-[760px]">
            <div
              className="rounded-xl overflow-hidden border relative"
              style={{
                aspectRatio: "760/430",
                borderColor: `rgba(201,161,92,.3)`,
                boxShadow: "0 8px 32px rgba(0,0,0,.45)",
              }}
            >
              <img
                src={NEWS[newsI].img}
                alt={NEWS[newsI].title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(42,29,20,.75) 0%, transparent 55%)",
                }}
              />
            </div>

            {/* arrows */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6">
              <Arrow
                dir="l"
                onClick={() => setNewsI(step(newsI, NEWS.length, -1))}
              />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6">
              <Arrow
                dir="r"
                onClick={() => setNewsI(step(newsI, NEWS.length, 1))}
              />
            </div>

            {/* label row */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-0 pointer-events-none">
              {/* side left */}
              <div className="flex-1 flex justify-end pr-3">
                <span
                  className="font-inter text-[10px] uppercase tracking-[.2em] px-3 py-1.5 rounded border"
                  style={{
                    color: C.muted,
                    borderColor: `rgba(212,169,74,.3)`,
                    background: `rgba(42,29,20,.8)`,
                  }}
                >
                  {NEWS[(newsI + NEWS.length - 1) % NEWS.length].side ||
                    NEWS[(newsI + NEWS.length - 1) % NEWS.length].cat}
                </span>
              </div>
              {/* hexagon center */}
              <div
                className="flex flex-col items-center justify-center px-10 py-3.5 text-center z-10 relative"
                style={{
                  background: `linear-gradient(135deg,${C.surface},${C.primary})`,
                  border: `1.5px solid ${C.accent}`,
                  clipPath:
                    "polygon(7% 0%,93% 0%,100% 50%,93% 100%,7% 100%,0% 50%)",
                  minWidth: 280,
                }}
              >
                <span
                  className="font-inter text-[10px] uppercase tracking-[.2em]"
                  style={{ color: C.accent }}
                >
                  {NEWS[newsI].cat}
                </span>
                <span
                  className="font-inter text-xs font-semibold mt-0.5"
                  style={{ color: C.cream }}
                >
                  {NEWS[newsI].date}
                </span>
              </div>
              {/* side right */}
              <div className="flex-1 flex justify-start pl-3">
                <span
                  className="font-inter text-[10px] uppercase tracking-[.2em] px-3 py-1.5 rounded border"
                  style={{
                    color: C.muted,
                    borderColor: `rgba(212,169,74,.3)`,
                    background: `rgba(42,29,20,.8)`,
                  }}
                >
                  {NEWS[(newsI + 1) % NEWS.length].side ||
                    NEWS[(newsI + 1) % NEWS.length].cat}
                </span>
              </div>
            </div>
          </div>

          {/* title */}
          <div className="mt-16 text-center max-w-2xl px-4">
            <h3
              className="font-playfair text-lg md:text-xl font-semibold leading-snug"
              style={{ color: C.cream }}
            >
              {NEWS[newsI].title}
            </h3>
          </div>

          <Dots n={NEWS.length} active={newsI} set={setNewsI} />
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
