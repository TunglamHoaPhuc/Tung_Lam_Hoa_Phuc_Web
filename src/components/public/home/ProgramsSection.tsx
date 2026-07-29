import { FC } from "react";
import { Calendar } from "lucide-react";
import { C } from "@/config/theme";
import { PROGRAMS } from "@/features/home/data/home-data";
import type { SectionRef } from "@/features/home/types";
import SecHead from "@/components/ui/SecHead";

interface ProgramsSectionProps {
  sectionRef: SectionRef;
}

/**
 * "Các Chương Trình Cộng Tu" — recurring program cards.
 * NOTE: this section has no direct match in the requested 7-component list
 * (Hero/Introduction/News/Dharma/Calendar/Gallery/Contact); it is real content
 * from the original page, so it's kept as its own component rather than
 * force-fit into an unrelated section.
 */
const ProgramsSection: FC<ProgramsSectionProps> = ({ sectionRef }) => {
  return (
    <section
      ref={sectionRef}
      id="cong-tu"
      className="py-24 px-10"
      style={{ background: C.dark }}
    >
      <div className="max-w-[1280px] mx-auto">
        <SecHead title="Các Chương Trình Cộng Tu" sub="Tu học định kỳ" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROGRAMS.map((prog) => (
            <div
              key={prog.title}
              className="group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: C.border,
                background: `linear-gradient(145deg,${C.secondary},${C.bg})`,
                boxShadow: "0 4px 20px rgba(0,0,0,.3)",
              }}
              onMouseEnter={(e) =>
                ((
                  e.currentTarget as HTMLElement
                ).style.borderColor = `${C.accent}88`)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = C.border)
              }
            >
              {/* image + badge */}
              <div className="relative overflow-hidden" style={{ height: 240 }}>
                <img
                  src={prog.img}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(42,29,20,.65) 0%,transparent 60%)",
                  }}
                />
                {/* badge */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2"
                  style={{
                    background: C.accent,
                    borderColor: C.accentDeep,
                    boxShadow: "0 4px 14px rgba(0,0,0,.35)",
                  }}
                >
                  {prog.emoji}
                </div>
              </div>
              {/* caption */}
              <div className="px-6 pt-10 pb-7 text-center">
                <h3
                  className="font-cinzel text-lg font-bold mb-2"
                  style={{ color: C.cream }}
                >
                  {prog.title}
                </h3>
                <div
                  className="flex items-center justify-center gap-1.5 font-inter text-xs"
                  style={{ color: C.muted }}
                >
                  <Calendar
                    className="w-3.5 h-3.5"
                    style={{ color: C.accent }}
                  />
                  <span>{prog.schedule}</span>
                </div>
                <button
                  className="mt-5 font-inter text-[11px] uppercase tracking-[.15em] border rounded-lg px-5 py-2 transition-colors"
                  style={{
                    borderColor: `rgba(242,193,78,.4)`,
                    color: C.accent,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(242,193,78,.1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  Đăng ký tham gia
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
