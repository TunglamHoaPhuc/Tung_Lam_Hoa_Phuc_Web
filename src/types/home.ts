import type { LucideIcon } from "lucide-react";

// ─── nav ──────────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  dropdown?: boolean;
}

// ─── news ─────────────────────────────────────────────────────────────────
export interface NewsItem {
  img: string;
  cat: string;
  title: string;
  date: string;
  side: string;
}

// ─── dharma ───────────────────────────────────────────────────────────────
export interface DharmaCard {
  img: string;
  type: string;
  Icon: LucideIcon;
  title: string;
  date: string;
  views: string;
  large: boolean;
}

// ─── calendar ─────────────────────────────────────────────────────────────
export interface CalendarDay {
  day: number;
  lunar: string;
  events: string[];
}

export interface EventSlide {
  img: string;
  type: string;
  title: string;
  date: string;
  dot: string;
}

export interface Legend {
  color: string;
  label: string;
}

// ─── programs ─────────────────────────────────────────────────────────────
export interface Program {
  img: string;
  title: string;
  schedule: string;
  emoji: string;
}

// ─── gallery (areas / statues) ─────────────────────────────────────────────
export interface Area {
  img: string;
  name: string;
  sub: string;
  info: string;
}

export interface Statue {
  img: string;
  name: string;
  sub: string;
  cluster: string;
  area: string;
}

// ─── contact ──────────────────────────────────────────────────────────────
export interface Contact {
  role: string;
  name: string;
  tel: string;
}

// ─── shared UI ────────────────────────────────────────────────────────────
export type ArrowDir = "l" | "r";

/** Callback ref used by page.tsx to register a section DOM node for scroll-spy. */
export type SectionRef = (el: HTMLElement | null) => void;
