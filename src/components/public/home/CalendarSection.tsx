import { FC, useState } from "react";
import { Calendar } from "lucide-react";
import { C } from "@/config/theme";

import {
  WDAYS,
  CAL,
  DOT_COLOR,
  LEGEND,
  EVT_SLIDES,
} from "@/features/home/data/home-data";

import type { SectionRef } from "@/features/home/types";
import SecHead from "@/components/ui/SecHead";
import Dots from "@/components/ui/Dots";

interface CalendarSectionProps {
  sectionRef: SectionRef;
}

/** "Lịch Tu Học Định Kỳ" — monthly calendar grid with lunar dates/event dots, plus 3 event preview cards. */
const CalendarSection: FC<CalendarSectionProps> = ({ sectionRef }) => {
  const [evtI, setEvtI] = useState<number>(0);

  return (
    <section
      ref={sectionRef}
      id="lich-tu"
      className="py-24 px-10"
      style={{ background: C.bg }}
    >
      <div className="max-w-[1280px] mx-auto">
        <SecHead
          title="Lịch Tu Học Định Kỳ"
          sub="Hằng tháng · Âm – Dương lịch"
        />

        {/* calendar card */}
        <div
          className="rounded-3xl overflow-hidden mb-10"
          style={{
            background: C.paper,
            boxShadow: "0 12px 40px rgba(0,0,0,.45)",
          }}
        >
          <div className="p-8 md:p-10">
            {/* header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-7">
              <div>
                <h3
                  className="font-cinzel text-2xl font-bold"
                  style={{ color: C.dark }}
                >
                  Tháng 6 – 2024
                </h3>
                <p
                  className="font-inter text-sm mt-1"
                  style={{ color: C.surface }}
                >
                  Âm lịch: Tháng 5–6 năm Giáp Thìn
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {LEGEND.map((l) => (
                  <div key={l.label} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: l.color }}
                    />
                    <span
                      className="font-inter text-xs"
                      style={{ color: "#5C4630" }}
                    >
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* weekday header */}
            <div
              className="grid grid-cols-7 border-b"
              style={{ borderColor: "rgba(139,105,20,.2)" }}
            >
              {WDAYS.map((d) => (
                <div
                  key={d}
                  className="text-center font-inter text-[11px] font-bold uppercase py-2.5"
                  style={{ color: C.surface }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* date grid */}
            <div className="grid grid-cols-7">
              {CAL.map((d, i) => (
                <div
                  key={i}
                  className="border-b border-r transition-colors cursor-pointer"
                  style={{
                    minHeight: 72,
                    padding: "6px 8px",
                    borderColor: "rgba(139,105,20,.15)",
                    borderLeft:
                      i % 7 === 0
                        ? "1px solid rgba(139,105,20,.15)"
                        : undefined,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(232,217,176,.4)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="font-inter font-bold"
                      style={{ fontSize: 18, color: C.dark }}
                    >
                      {d.day}
                    </span>
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      {d.events.map((ev, ei) => (
                        <div
                          key={ei}
                          className="w-2 h-2 rounded-full"
                          style={{ background: DOT_COLOR[ev] }}
                        />
                      ))}
                    </div>
                  </div>
                  <span
                    className="font-inter text-[10px]"
                    style={{ color: C.surface }}
                  >
                    {d.lunar}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* event slides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EVT_SLIDES.map((ev, i) => (
            <div
              key={i}
              onClick={() => setEvtI(i)}
              className="rounded-xl overflow-hidden border cursor-pointer transition-all duration-200"
              style={{
                borderColor: i === evtI ? C.accent : C.border,
                background: `linear-gradient(145deg,${C.secondary},${C.dark})`,
                opacity: i === evtI ? 1 : 0.65,
                outline: i === evtI ? `2px solid ${C.accent}` : "none",
              }}
            >
              <div className="relative overflow-hidden" style={{ height: 170 }}>
                <img
                  src={ev.img}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(42,29,20,.75) 0%,transparent 60%)",
                  }}
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: ev.dot }}
                  />
                  <span
                    className="font-inter text-[11px] font-semibold"
                    style={{ color: C.cream }}
                  >
                    {ev.type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4
                  className="font-playfair text-sm font-semibold mb-1.5"
                  style={{ color: C.cream }}
                >
                  {ev.title}
                </h4>
                <div
                  className="flex items-center gap-1.5 font-inter text-[11px]"
                  style={{ color: C.muted }}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{ev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Dots n={EVT_SLIDES.length} active={evtI} set={setEvtI} />
      </div>
    </section>
  );
};

export default CalendarSection;
