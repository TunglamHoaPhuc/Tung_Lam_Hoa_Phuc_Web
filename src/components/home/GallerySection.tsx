import { FC, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { C } from "@/data/palette";
import { AREAS, STATUES } from "@/data/home-data";
import { step } from "@/lib/carousel";
import type { SectionRef } from "@/types/home";
import SecHead from "@/components/ui/SecHead";
import Arrow from "@/components/ui/Arrow";

interface GallerySectionProps {
  /** ref for the "Khu Vực Nổi Bật" (areas) block */
  areasRef: SectionRef;
  /** ref for the "Bảo Tượng Nổi Bật" (statues) block */
  statuesRef: SectionRef;
}

/**
 * "GallerySection" — image showcase of the temple.
 * NOTE: the original page has two separate carousels here ("Khu Vực Nổi Bật"
 * and "Bảo Tượng Nổi Bật"), each with its own scroll-spy anchor. To keep the
 * exact original scroll-spy behavior (6 side-nav dots) both are kept as two
 * distinct <section> blocks inside this single component, each taking its own
 * ref rather than merging into one DOM node.
 */
const GallerySection: FC<GallerySectionProps> = ({ areasRef, statuesRef }) => {
  const [areaI, setAreaI] = useState<number>(0);
  const [statI, setStatI] = useState<number>(0);

  return (
    <>
      {/* KHU VỰC NỔI BẬT */}
      <section
        ref={areasRef}
        id="khu-vuc"
        className="py-24 px-10 text-center"
        style={{ background: "#4A3728" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <SecHead title="Các Khu Vực Nổi Bật" sub="Khám phá không gian" />

          <div className="flex items-center gap-6 justify-center">
            {/* left */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <Arrow
                dir="l"
                onClick={() => setAreaI(step(areaI, AREAS.length, -1))}
              />
              <span
                className="font-inter text-[10px] tracking-[.22em] uppercase"
                style={{
                  color: C.muted,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                Khu vực trước
              </span>
            </div>

            {/* image */}
            <div className="relative flex-1" style={{ maxWidth: 1040 }}>
              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  height: 460,
                  borderColor: "rgba(201,161,92,.2)",
                  boxShadow: "0 16px 48px rgba(0,0,0,.55)",
                }}
              >
                <img
                  src={AREAS[areaI].img}
                  alt={AREAS[areaI].name}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(42,29,20,.72) 0%,transparent 55%)",
                  }}
                />
              </div>

              {/* banner */}
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-7 py-4 rounded-xl border"
                style={{
                  background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
                  borderColor: `rgba(212,169,74,.5)`,
                  minWidth: 420,
                  boxShadow: "0 8px 24px rgba(0,0,0,.4)",
                }}
              >
                <MapPin
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: C.accent }}
                />
                <div className="flex-1 text-left min-w-0">
                  <div
                    className="font-cinzel text-base font-bold tracking-[.15em] truncate"
                    style={{ color: C.accent }}
                  >
                    {AREAS[areaI].name}
                  </div>
                  <div
                    className="font-inter text-[11px] mt-0.5 truncate"
                    style={{ color: C.muted }}
                  >
                    {AREAS[areaI].sub}
                  </div>
                </div>
                <div
                  className="font-inter text-[11px] border-l pl-4 flex-shrink-0"
                  style={{ color: C.muted, borderColor: "rgba(201,161,92,.3)" }}
                >
                  {AREAS[areaI].info}
                </div>
                <button
                  className="font-inter text-[11px] uppercase tracking-[.15em] border rounded-lg px-4 py-2 transition-colors flex-shrink-0"
                  style={{
                    borderColor: `rgba(242,193,78,.4)`,
                    color: C.accent,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(242,193,78,.12)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  Khám phá
                </button>
              </div>
            </div>

            {/* right */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <span
                className="font-inter text-[10px] tracking-[.22em] uppercase"
                style={{ color: C.muted, writingMode: "vertical-rl" }}
              >
                Khu vực sau
              </span>
              <Arrow
                dir="r"
                onClick={() => setAreaI(step(areaI, AREAS.length, 1))}
              />
            </div>
          </div>

          <div style={{ marginTop: 68 }}>
            <button
              className="font-inter text-sm underline underline-offset-4 transition-colors"
              style={{ color: C.muted }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.accent)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.muted)
              }
            >
              Xem tất cả các khu vực →
            </button>
          </div>
        </div>
      </section>

      {/* BẢO TƯỢNG NỔI BẬT */}
      <section
        ref={statuesRef}
        id="bao-tuong"
        className="py-24 px-10 text-center"
        style={{ background: C.bg }}
      >
        <div className="max-w-[1280px] mx-auto">
          <SecHead
            title="Các Bảo Tượng Nổi Bật"
            sub="Chiêm bái & tham quan ảo"
          />

          <div className="flex items-center gap-6 justify-center">
            {/* left */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <Arrow
                dir="l"
                onClick={() => setStatI(step(statI, STATUES.length, -1))}
              />
              <span
                className="font-inter text-[10px] tracking-[.22em] uppercase"
                style={{
                  color: C.muted,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                Bảo tượng trước
              </span>
            </div>

            {/* image */}
            <div className="relative flex-1" style={{ maxWidth: 1040 }}>
              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  height: 460,
                  borderColor: "rgba(201,161,92,.2)",
                  boxShadow: "0 16px 48px rgba(0,0,0,.55)",
                }}
              >
                <img
                  src={STATUES[statI].img}
                  alt={STATUES[statI].name}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(42,29,20,.8) 0%,transparent 55%)",
                  }}
                />
              </div>

              {/* banner */}
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 rounded-xl border"
                style={{
                  background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
                  borderColor: `rgba(212,169,74,.5)`,
                  minWidth: 500,
                  boxShadow: "0 8px 24px rgba(0,0,0,.4)",
                }}
              >
                <Star
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: C.accent }}
                />
                <div className="flex-1 text-left min-w-0">
                  <div
                    className="font-cinzel text-sm font-bold tracking-[.12em] truncate"
                    style={{ color: C.accent }}
                  >
                    {STATUES[statI].name}
                  </div>
                  <div
                    className="font-inter text-[10px] mt-0.5 truncate"
                    style={{ color: C.muted }}
                  >
                    {STATUES[statI].sub}
                  </div>
                </div>

                {/* info table */}
                <div
                  className="flex items-stretch gap-3 border-l pl-4 flex-shrink-0"
                  style={{ borderColor: "rgba(201,161,92,.3)" }}
                >
                  <div className="text-left">
                    <div
                      className="font-inter text-[9px] uppercase tracking-[.15em]"
                      style={{ color: C.muted }}
                    >
                      Cụm tượng
                    </div>
                    <div
                      className="font-inter text-[11px] font-semibold mt-0.5"
                      style={{ color: C.cream }}
                    >
                      {STATUES[statI].cluster}
                    </div>
                  </div>
                  <div
                    className="w-px"
                    style={{ background: "rgba(201,161,92,.3)" }}
                  />
                  <div className="text-left">
                    <div
                      className="font-inter text-[9px] uppercase tracking-[.15em]"
                      style={{ color: C.muted }}
                    >
                      Khu vực
                    </div>
                    <div
                      className="font-inter text-[11px] font-semibold mt-0.5"
                      style={{ color: C.cream }}
                    >
                      {STATUES[statI].area}
                    </div>
                  </div>
                </div>

                <button
                  className="font-inter text-[11px] uppercase tracking-[.15em] border rounded-lg px-4 py-2 transition-colors flex-shrink-0"
                  style={{
                    borderColor: `rgba(242,193,78,.4)`,
                    color: C.accent,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(242,193,78,.12)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  Khám phá
                </button>
              </div>
            </div>

            {/* right */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <span
                className="font-inter text-[10px] tracking-[.22em] uppercase"
                style={{ color: C.muted, writingMode: "vertical-rl" }}
              >
                Bảo tượng sau
              </span>
              <Arrow
                dir="r"
                onClick={() => setStatI(step(statI, STATUES.length, 1))}
              />
            </div>
          </div>

          <div style={{ marginTop: 68 }}>
            <button
              className="font-inter text-sm underline underline-offset-4 transition-colors"
              style={{ color: C.muted }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.accent)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = C.muted)
              }
            >
              Xem tất cả bảo tượng →
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default GallerySection;
