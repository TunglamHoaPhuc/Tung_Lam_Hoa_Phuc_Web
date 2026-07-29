import { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { C } from "@/config/theme";
import type { ArrowDir } from "@/features/home/types";

interface ArrowProps {
  dir: ArrowDir;
  onClick: () => void;
}

/** Round prev/next button used by every carousel (news, areas, statues). */
const Arrow: FC<ArrowProps> = ({ dir, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
      style={{ background: C.cream }}
      aria-label={dir === "l" ? "Ảnh trước" : "Ảnh sau"}
    >
      {dir === "l" ? (
        <ChevronLeft className="w-5 h-5" style={{ color: C.primary }} />
      ) : (
        <ChevronRight className="w-5 h-5" style={{ color: C.primary }} />
      )}
    </button>
  );
};

export default Arrow;
