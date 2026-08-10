'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { TuAnVangSinhSystem } from '@/features/universe/components/TuAnVangSinhSystem';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function TuAnPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('tu-an-vang-sinh');

  const navItems = [
    { id: 'gioi-thieu', label: 'GIỚI THIỆU' },
    { id: 'tu-an-vang-sinh', label: 'TỨ ÂN - VÃNG SINH ĐƯỜNG' },
    { id: 'hoi-dap-ai', label: 'HỎI ĐÁP AI' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#2c1c11] text-[#e3d2c1] font-sans relative selection:bg-[#f2cc8f] selection:text-black overflow-x-hidden">
      <Header scrolled={true} />

      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle="TỨ ÂN - VÃNG SINH ĐƯỜNG"
        navItems={navItems}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle="TỨ ÂN - VÃNG SINH ĐƯỜNG"
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        <HeroBanner
          id="herobanner"
          bannerUrl="https://images.unsplash.com/photo-1709064159097-91b634741c96?w=1600&h=900&fit=crop"
          title="TỨ ÂN - VÃNG SINH ĐƯỜNG"
          subtitle="CHƯ HƯƠNG LINH VỀ MIỀN TỊNH ĐỘ"
        />

        <main className="w-full pt-6 pb-16 space-y-12">
          {/* SECTION 1 — TỨ ÂN VÃNG SINH SYSTEM */}
          <section id="tu-an-vang-sinh" className="w-full scroll-mt-24">
            <TuAnVangSinhSystem />
          </section>

          {/* SECTION 2 — SMART SEARCH AI BAR */}
          <section id="hoi-dap-ai" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <SmartSearchAIBar contextTitle="Tứ Ân - Vãng Sinh Đường Tùng Lâm Hòa Phúc" />
          </section>
        </main>
      </div>
    </div>
  );
}
