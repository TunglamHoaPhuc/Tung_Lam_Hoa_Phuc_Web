'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { GiangDuongPhapThoai } from '@/features/universe/components/GiangDuongPhapThoai';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { StatueCollectionGrid } from '@/features/universe/components/StatueCollectionGrid';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';

export default function GiangDuongPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('gioi-thieu');

  const navItems = [
    { id: 'gioi-thieu', label: 'GIỚI THIỆU' },
    { id: 'bo-suu-tap-bao-tuong', label: 'BỘ SƯU TẬP BẢO TƯỢNG' },
    { id: 'kho-tang-phap-thoai', label: 'KHO TÀNG PHÁP THOẠI' },
    { id: 'hoi-dap-ai', label: 'HỎI ĐÁP AI' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);

      const sectionIds = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 220;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

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
      {/* ── TOP STICKY SUBNAVBAR & SIDEBAR NAV ── */}
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle="GIẢNG ĐƯỜNG"
        navItems={navItems}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle="GIẢNG ĐƯỜNG"
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        {/* ── HEROBANNER ── */}
        <HeroBanner
          id="herobanner"
          bannerUrl="https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp"
          title="GIẢNG ĐƯỜNG"
          subtitle="CHƯ PHẬT HẢI HỘI"
        />

        <main className="w-full pt-6 pb-16 space-y-16">
          {/* SECTION 1 — GIỚI THIỆU */}
          <section id="gioi-thieu" className="max-w-4xl mx-auto px-4 scroll-mt-24 relative">
            <div
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="
                text-base sm:text-lg md:text-xl text-[#ffde59]
                leading-relaxed md:leading-loose tracking-wide
                space-y-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                text-justify
                [&>p]:text-justify [&>p]:mb-6
                [&>p:not(:first-of-type)]:indent-6 md:[&>p:not(:first-of-type)]:indent-8
                [&>p:first-of-type::first-letter]:[font-family:'UTM_ClassizismAntiqua','UTM_ClassicAntiqua',serif]
                [&>p:first-of-type::first-letter]:text-6xl md:[&>p:first-of-type::first-letter]:text-7xl
                [&>p:first-of-type::first-letter]:font-bold [&>p:first-of-type::first-letter]:text-[#ffde59]
                [&>p:first-of-type::first-letter]:mr-3 [&>p:first-of-type::first-letter]:pb-1
                [&>p:first-of-type::first-letter]:border-b-2 [&>p:first-of-type::first-letter]:border-[#ffde59]
                [&>p:first-of-type::first-letter]:float-left [&>p:first-of-type::first-letter]:leading-none
              "
            >
              <p>
                Khu vực giảng đường với diện tích 700m² chia làm hai tầng, tầng trên làm giảng đường, tầng dưới làm trai đường. Giảng đường là nơi tu tập, sinh hoạt và học hỏi giáo lý nhà Phật theo các khóa tu được tổ chức định kỳ tại Tùng Lâm.
              </p>
              <p>
                Không gian Giảng đường là nơi mỗi người có thể tìm thấy lời giảng của Sư phụ giúp cho bản thân trở về tỉnh thức.
              </p>
            </div>
          </section>

          {/* SECTION 2 — BỘ SƯU TẬP BẢO TƯỢNG (TRÀN 100% TOÀN MÀN HÌNH) */}
          <section id="bo-suu-tap-bao-tuong" className="w-full scroll-mt-24 pt-4">
            <StatueCollectionGrid areaTitle="GIẢNG ĐƯỜNG" areaSlug="giang-duong" />
          </section>

          {/* SECTION 3 — KHO TÀNG PHÁP THOẠI */}
          <section id="kho-tang-phap-thoai" className="max-w-4xl mx-auto px-4 scroll-mt-24 border-t pt-10" style={{ borderColor: 'rgba(242,193,78,0.2)' }}>
            <GiangDuongPhapThoai />
          </section>

          {/* SECTION 4 — SMART SEARCH AI BAR */}
          <section id="hoi-dap-ai" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <SmartSearchAIBar contextTitle="Giảng Đường &amp; Kho Tàng Pháp Thoại" />
          </section>
        </main>
      </div>
    </div>
  );
}
