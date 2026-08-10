import { FC } from "react";

export interface SectionTransitionOverlayProps {
  position?: "top" | "bottom" | "both";
  height?: string;
  className?: string;
}

export const SectionTransitionOverlay: FC<SectionTransitionOverlayProps> = ({
  position = "both",
  height = "h-24 md:h-36",
  className = "",
}) => {
  const showTop = position === "top" || position === "both";
  const showBottom = position === "bottom" || position === "both";

  return (
    <>
      {showTop && (
        <div
          className={`absolute top-0 inset-x-0 pointer-events-none z-10 ${height} bg-gradient-to-b from-[#120d0a] via-[#120d0a]/60 to-transparent backdrop-blur-[2px] ${className}`}
        />
      )}
      {showBottom && (
        <div
          className={`absolute bottom-0 inset-x-0 pointer-events-none z-10 ${height} bg-gradient-to-t from-[#120d0a] via-[#120d0a]/60 to-transparent backdrop-blur-[2px] ${className}`}
        />
      )}
    </>
  );
};

export default SectionTransitionOverlay;
