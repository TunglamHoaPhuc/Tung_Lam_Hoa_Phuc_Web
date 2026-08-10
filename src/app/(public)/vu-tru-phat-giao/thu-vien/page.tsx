'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { ThuVienGrid } from '@/features/universe/components/ThuVienGrid';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function ThuVienPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('thu-vien-kinh-sach');

  const navItems = [
    { id: 'gioi-thieu', label: 'GIỚI THIỆU' },
    { id: 'thu-vien-kinh-sach', label: 'THƯ VIỆN KINH SÁCH' },
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
        pageTitle="THƯ VIỆN KINH SÁCH"
        navItems={navItems}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle="THƯ VIỆN KINH SÁCH"
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        <HeroBanner
          id="herobanner"
          bannerUrl="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&h=900&fit=crop"
          title="THƯ VIỆN KINH SÁCH"
          subtitle="PHÁP BẢO LƯU THÔNG"
        />

        <main className="w-full pt-6 pb-16 space-y-12">
          {/* SECTION 1 — THƯ VIỆN KINH SÁCH GRID SYSTEM */}
          <section id="thu-vien-kinh-sach" className="w-full scroll-mt-24">
            <ThuVienGrid />
          </section>

          {/* SECTION 2 — SMART SEARCH AI BAR */}
          <section id="hoi-dap-ai" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <SmartSearchAIBar contextTitle="Thư Viện Kinh Sách Tùng Lâm Hòa Phúc" />
          </section>
        </main>
      </div>
    </div>
  );
}
