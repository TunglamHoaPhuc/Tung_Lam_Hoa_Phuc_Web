import { FC } from "react";

export interface SectionTransitionOverlayProps {
  position?: "top" | "bottom" | "both";
  height?: string;
  className?: string;
}

export const SectionTransitionOverlay: FC<SectionTransitionOverlayProps> = ({
  position = "both",
  height = "h-28 md:h-44",
  className = "",
}) => {
  const showTop = position === "top" || position === "both";
  const showBottom = position === "bottom" || position === "both";

  return (
    <>
      {showTop && (
        <div
          className={`absolute top-0 inset-x-0 pointer-events-none z-10 ${height} bg-gradient-to-b from-[#1A120B] via-[#1A120B]/70 to-transparent backdrop-blur-[3px] ${className}`}
        />
      )}
      {showBottom && (
        <div
          className={`absolute bottom-0 inset-x-0 pointer-events-none z-10 ${height} bg-gradient-to-t from-[#1A120B] via-[#1A120B]/70 to-transparent backdrop-blur-[3px] ${className}`}
        />
      )}
    </>
  );
};

export default SectionTransitionOverlay;
