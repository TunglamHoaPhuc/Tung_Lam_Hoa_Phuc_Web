"use client";

import { FC, useEffect, useState } from "react";
import Header from "@/components/public/layout/Header";
import Footer from "@/components/public/layout/Footer";
import Hero from "@/features/home/components/Hero";
import NewsSection from "@/features/home/components/NewsSection";
import DharmaSection from "@/features/home/components/DharmaSection";
import CalendarSection from "@/features/home/components/CalendarSection";
import GallerySection from "@/features/home/components/GallerySection";
import { SmartSearchAIBar } from "@/components/public/SmartSearchAIBar";
import { VerticalAnchorNav } from "@/components/common/VerticalAnchorNav";

const HOME_SECTIONS = [
  { id: "hero", label: "NƠI ĐỂ TRỞ VỀ" },
  { id: "ai-search", label: "TRỢ LÝ PHẬT HỌC" },
  { id: "news", label: "TIN MỚI NHẤT" },
  { id: "dharma", label: "DẤU ẤN HOẰNG PHÁP" },
  { id: "calendar", label: "LỊCH TU HỌC" },
  { id: "gallery", label: "KHU VỰC & BẢO TƯỢNG" },
];

const Home: FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{ background: "#1A120B" }}
      className="min-h-screen overflow-x-hidden relative font-sans text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black"
    >
      {/* ── THANH NEO DỌC SANG BÊN PHẢI MÀN HÌNH ── */}
      <VerticalAnchorNav pageTitle="TRANG CHỦ" sections={HOME_SECTIONS} />

      <Header scrolled={scrollY > 64} />

      <main>
        {/* Section 0: Hero Video Banner */}
        <section id="hero">
          <Hero />
        </section>

        {/* Section 1: TRỢ LÝ PHẬT HỌC AI NGAY DƯỚI HERO VIDEO */}
        <section id="ai-search" className="max-w-[1280px] mx-auto px-4 md:px-10 my-10 relative z-20">
          <SmartSearchAIBar contextTitle="Tùng Lâm Hòa Phúc - Bạn muốn tìm điều gì / đặt câu hỏi gì?" />
        </section>

        {/* Section 2: News */}
        <section id="news">
          <NewsSection />
        </section>

        {/* Section 3: Dharma */}
        <section id="dharma">
          <DharmaSection />
        </section>

        {/* Section 4: Calendar */}
        <section id="calendar">
          <CalendarSection />
        </section>

        {/* Section 5: Featured Areas & Statues */}
        <section id="gallery">
          <GallerySection />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
