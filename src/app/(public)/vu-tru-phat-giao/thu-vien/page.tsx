'use client';

import { useState, useEffect } from 'react';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { StatueCollectionGrid } from '@/features/universe/components/StatueCollectionGrid';
import { ArtisticStatueSection } from '@/features/universe/components/ArtisticStatueSection';
import { ThuVienGrid } from '@/features/universe/components/ThuVienGrid';
import { SpaceGallerySection } from '@/features/universe/components/SpaceGallerySection';
import { OtherAreasSection } from '@/features/universe/components/OtherAreasSection';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function ThuVienPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('gioi-thieu');

  const navItems = [
    { id: 'gioi-thieu', label: 'GIỚI THIỆU' },
    { id: 'bo-suu-tap-bao-tuong', label: 'BỘ SƯU TẬP BẢO TƯỢNG' },
    { id: 'nghe-thuat-phat-giao-khu-vuc', label: 'NGHỆ THUẬT PHẬT GIÁO' },
    { id: 'thu-vien-kinh-sach', label: 'THƯ VIỆN KINH SÁCH (AI SEARCH)' },
    { id: 'khong-gian', label: 'KHÔNG GIAN THƯ VIỆN' },
    { id: 'khu-vuc-khac', label: 'KHU VỰC KHÁC' },
    { id: 'hoi-dap-ai', label: 'HỎI ĐÁP AI' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);

      const sectionIds = navItems.map((n) => n.id);
      const scrollPos = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
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
      {/* ── TOP STICKY SUBNAVBAR & SIDEBAR NAV ── */}
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
        {/* ── HEROBANNER ── */}
        <HeroBanner
          id="herobanner"
          bannerUrl="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&h=900&fit=crop"
          title="THƯ VIỆN KINH SÁCH"
          subtitle="PHÁP BẢO LƯU THÔNG"
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
                Nơi lưu trữ các ấn phẩm Phật giáo quý báu, phòng đọc dành cho quý Phật tử, thiện nam tín nữ nghiên cứu và mở mang tri kiến Phật pháp dưới sự dẫn dắt của chư Tôn Đức Tăng Ni.
              </p>
              <p>
                Kho tàng hơn 400 đầu sách kinh điển, luật tạng, luận giải và tạp chí Phật học lưu trữ tại Bổn Tự Tùng Lâm Hòa Phúc, kết nối tri thức ngàn đời từ các bậc Danh Tăng thạc đức.
              </p>
            </div>
          </section>

          {/* SECTION 2 — BỘ SƯU TẬP BẢO TƯỢNG (TƯỢNG CHÍNH) */}
          <section id="bo-suu-tap-bao-tuong" className="w-full scroll-mt-24 pt-4">
            <StatueCollectionGrid areaTitle="THƯ VIỆN KINH SÁCH" areaSlug="thu-vien" />
          </section>

          {/* SECTION 2B — NGHỆ THUẬT PHẬT GIÁO */}
          <section id="nghe-thuat-phat-giao-khu-vuc" className="w-full scroll-mt-24 pt-4">
            <ArtisticStatueSection areaTitle="THƯ VIỆN KINH SÁCH" areaSlug="thu-vien" />
          </section>

          {/* SECTION 3 — THƯ VIỆN KINH SÁCH SỐ (AI SEARCH & 2X4 GRID) */}
          <section id="thu-vien-kinh-sach" className="w-full scroll-mt-24">
            <ThuVienGrid />
          </section>

          {/* SECTION 4 — KHÔNG GIAN THƯ VIỆN */}
          <section id="khong-gian" className="max-w-5xl mx-auto px-4 scroll-mt-24">
            <SpaceGallerySection
              areaTitle="THƯ VIỆN KINH SÁCH"
              currentSlug="thu-vien"
              showOtherAreas={false}
            />
          </section>

          {/* SECTION 5 — KHÁM PHÁ KHU VỰC KHÁC */}
          <section id="khu-vuc-khac" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <OtherAreasSection currentSlug="thu-vien" />
          </section>

          {/* SECTION 6 — SMART SEARCH AI BAR */}
          <section id="hoi-dap-ai" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <SmartSearchAIBar contextTitle="Thư Viện Kinh Sách Tùng Lâm Hòa Phúc" />
          </section>
        </main>
      </div>
    </div>
  );
}
