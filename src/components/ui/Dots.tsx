import { FC } from "react";
import { C } from "@/data/palette";

interface DotsProps {
  n: number;
  active: number;
  set: (i: number) => void;
}

/** Pagination dots used by every carousel (news, calendar events, ...). */
const Dots: FC<DotsProps> = ({ n, active, set }) => {
  return (
    <div className="flex items-center gap-2 justify-center mt-7">
      {Array.from({ length: n }).map((_, i) => (
        <button
          key={i}
          onClick={() => set(i)}
          className="w-2.5 h-2.5 rounded-full border transition-all duration-200"
          style={{
            borderColor: C.accent,
            background: i === active ? C.accentDeep : "transparent",
          }}
          aria-label={`Mục ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default Dots;
