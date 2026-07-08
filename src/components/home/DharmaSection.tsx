import { FC } from "react";
import { C } from "@/data/palette";
import { DHARMA } from "@/data/home-data";
import type { SectionRef } from "@/types/home";
import SecHead from "@/components/ui/SecHead";

interface DharmaSectionProps {
  sectionRef: SectionRef;
}

/** "Dấu Ấn Hoằng Pháp" — grid of dharma media cards (talks, videos, articles) + one large book card. */
const DharmaSection: FC<DharmaSectionProps> = ({ sectionRef }) => {
  return (
    <section
      ref={sectionRef}
      id="hoang-phap"
      className="py-24 px-10"
      style={{ background: C.dark }}
    >
      <div className="max-w-[1280px] mx-auto">
        <SecHead title="Dấu Ấn Hoằng Pháp" sub="Kho tư liệu Phật học" />

        <div className="grid grid-cols-12 gap-6">
          {/* small cards */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6">
            {DHARMA.filter((c) => !c.large).map((card) => {
              const { Icon } = card;
              return (
                <div
                  key={card.title}
                  className="group rounded-xl overflow-hidden border cursor-pointer transition-all duration-300"
                  style={{
                    borderColor: C.border,
                    background: `linear-gradient(145deg,${C.surface},${C.primary})`,
                    boxShadow: "0 4px 12px rgba(0,0,0,.28)",
                  }}
                  onMouseEnter={(e) =>
                    ((
                      e.currentTarget as HTMLElement
                    ).style.borderColor = `${C.accent}99`)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      C.border)
                  }
                >
                  <div className="overflow-hidden" style={{ height: 185 }}>
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: C.accent }}
                      />
                      <span
                        className="font-inter text-[10px] font-bold uppercase tracking-[.2em]"
                        style={{ color: C.accent }}
                      >
                        {card.type}
                      </span>
                    </div>
                    <h4
                      className="font-playfair text-sm font-semibold leading-snug mb-3"
                      style={{ color: C.cream }}
                    >
                      {card.title}
                    </h4>
                    <div
                      className="flex items-center gap-2 font-inter text-[11px]"
                      style={{ color: C.muted }}
                    >
                      <span>{card.date}</span>
                      <span>·</span>
                      <span>{card.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* large book card */}
          {DHARMA.filter((c) => c.large).map((card) => {
            const { Icon } = card;
            return (
              <div
                key={card.title}
                className="col-span-12 lg:col-span-4 group rounded-xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col"
                style={{
                  borderColor: C.border,
                  background: `linear-gradient(145deg,${C.surface},${C.primary})`,
                  boxShadow: "0 4px 12px rgba(0,0,0,.28)",
                }}
                onMouseEnter={(e) =>
                  ((
                    e.currentTarget as HTMLElement
                  ).style.borderColor = `${C.accent}99`)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    C.border)
                }
              >
                <div
                  className="overflow-hidden flex-1"
                  style={{ minHeight: 390 }}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="w-4 h-4" style={{ color: C.accent }} />
                    <span
                      className="font-inter text-[10px] font-bold uppercase tracking-[.2em]"
                      style={{ color: C.accent }}
                    >
                      {card.type}
                    </span>
                  </div>
                  <h3
                    className="font-playfair text-base font-semibold leading-snug mb-3"
                    style={{ color: C.cream }}
                  >
                    {card.title}
                  </h3>
                  <div
                    className="flex items-center gap-2 font-inter text-[11px]"
                    style={{ color: C.muted }}
                  >
                    <span>{card.date}</span>
                    <span>·</span>
                    <span>{card.views} lượt xem</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DharmaSection;
