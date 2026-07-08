import { FC } from "react";
import { C } from "@/data/palette";

interface SecHeadProps {
  title: string;
  sub?: string;
}

/** Ornamental section heading (✦ + gradient rules + title) used across all home sections. */
const SecHead: FC<SecHeadProps> = ({ title, sub }) => {
  return (
    <div className="flex flex-col items-center gap-2 mb-14">
      <span style={{ color: C.accent, fontSize: 22, lineHeight: 1 }}>✦</span>
      <div className="flex items-center gap-5 w-full max-w-3xl">
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${C.accent}80)`,
          }}
        />
        <h2
          className="font-cinzel text-2xl md:text-[2.2rem] font-bold uppercase tracking-[.14em] text-center whitespace-nowrap"
          style={{
            color: C.accent,
            textShadow: `0 0 28px ${C.accent}70`,
          }}
        >
          {title}
        </h2>
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to left, transparent, ${C.accent}80)`,
          }}
        />
      </div>
      {sub && (
        <p
          className="font-inter text-[11px] tracking-[.3em] uppercase"
          style={{ color: C.muted }}
        >
          {sub}
        </p>
      )}
    </div>
  );
};

export default SecHead;
