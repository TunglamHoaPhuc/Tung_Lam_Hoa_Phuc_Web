"use client";
//import { FC, useEffect, useRef, useState } from "react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { C } from "@/data/palette";
import { SECTION_IDS } from "@/data/home-data";
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import NewsSection from "@/components/home/NewsSection";
import DharmaSection from "@/components/home/DharmaSection";
import CalendarSection from "@/components/home/CalendarSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import GallerySection from "@/components/home/GallerySection";
import ContactSection from "@/components/home/ContactSection";

// NOTE: there is no "Introduction" section in the source page — the original
// markup goes straight from Hero to the news carousel. Add an Introduction
// component here once real content (chùa history / giới thiệu) is available.

const Home: FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [activeSection, setActive] = useState<number>(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const pos = window.scrollY + window.innerHeight / 2;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.offsetTop <= pos && el.offsetTop + el.offsetHeight > pos) {
          setActive(i);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrolled = scrollY > 64;

  const registerRef = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      sectionRefs.current[i] = el;
    },
    [],
  );

  return (
    <div
      style={{ background: C.bg, fontFamily: "'Noto Serif', serif" }}
      className="min-h-screen overflow-x-hidden"
    >
      {/* sticky side section dots */}
      <nav
        className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3"
        aria-label="Điều hướng section"
      >
        {SECTION_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() =>
              sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-2.5 h-2.5 rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: C.accent,
              background: i === activeSection ? C.accent : "transparent",
              transform: i === activeSection ? "scale(1.3)" : "scale(1)",
            }}
            aria-label={`Section ${id}`}
          />
        ))}
      </nav>

      <Header scrolled={scrolled} />

      <Hero />

      <NewsSection sectionRef={registerRef(0)} />
      <DharmaSection sectionRef={registerRef(1)} />
      <CalendarSection sectionRef={registerRef(2)} />
      <ProgramsSection sectionRef={registerRef(3)} />
      <GallerySection areasRef={registerRef(4)} statuesRef={registerRef(5)} />

      <ContactSection />
    </div>
  );
};

export default Home;
