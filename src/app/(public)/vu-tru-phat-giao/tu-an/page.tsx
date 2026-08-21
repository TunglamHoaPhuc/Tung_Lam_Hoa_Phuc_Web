'use client';

import { useState, useEffect } from 'react';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { StatueCollectionGrid } from '@/features/universe/components/StatueCollectionGrid';
import { ArtisticStatueSection } from '@/features/universe/components/ArtisticStatueSection';
import { TuAnVangSinhSystem } from '@/features/universe/components/TuAnVangSinhSystem';
import { TuAnFlipbook } from '@/features/universe/components/TuAnFlipbook';
import { SpaceGallerySection } from '@/features/universe/components/SpaceGallerySection';
import { OtherAreasSection } from '@/features/universe/components/OtherAreasSection';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function TuAnPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('gioi-thieu');

  const navItems = [
    { id: 'gioi-thieu', label: 'GIỚI THIỆU' },
    { id: 'bo-suu-tap-bao-tuong', label: 'BỘ SƯU TẬP BẢO TƯỢNG' },
    { id: 'nghe-thuat-phat-giao-khu-vuc', label: 'NGHỆ THUẬT PHẬT GIÁO' },
    { id: 'tu-an-vang-sinh', label: 'TRA CỨU BÀI VỊ HƯƠNG LINH' },
    { id: 'ky-yeu-tu-an', label: 'KỶ YẾU PHỤC DỰNG SÁCH LẬT' },
    { id: 'khong-gian', label: 'KHÔNG GIAN NHÀ TỨ ÂN' },
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
        {/* ── HEROBANNER ── */}
        <HeroBanner
          id="herobanner"
          bannerUrl="https://images.unsplash.com/photo-1709064159097-91b634741c96?w=1600&h=900&fit=crop"
          title="TỨ ÂN - VÃNG SINH ĐƯỜNG"
          subtitle="CHƯ HƯƠNG LINH VỀ MIỀN TỊNH ĐỘ"
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
                Từ bao đời nay, tình thân gia đình và lòng tri ân tổ tiên luôn được xem là cội nguồn của đạo lý làm người. Nhằm nhắc nhở mọi người nuôi dưỡng tâm hiếu và hướng thiện, Nhà Tứ Ân và Vãng Sinh Đường được kiến lập trang nghiêm tại Tùng Lâm Hòa Phúc.
              </p>
              <p>
                Nơi phụng thờ Đức Địa Tạng Vương Bồ Tát với đại nguyện cứu độ tất cả chúng sinh trong lục đạo luân hồi, là chốn gửi gắm tro cốt và di ảnh chư vị hương linh nương nhờ Tam Bảo nghe kinh thính pháp, cầu nguyện vãng sinh Tây Phương Cực Lạc.
              </p>
            </div>
          </section>

          {/* SECTION 2 — BỘ SƯU TẬP BẢO TƯỢNG (TƯỢNG CHÍNH) */}
          <section id="bo-suu-tap-bao-tuong" className="w-full scroll-mt-24 pt-4">
            <StatueCollectionGrid areaTitle="TỨ ÂN - VÃNG SINH ĐƯỜNG" areaSlug="tu-an" />
          </section>

          {/* SECTION 2B — NGHỆ THUẬT PHẬT GIÁO */}
          <section id="nghe-thuat-phat-giao-khu-vuc" className="w-full scroll-mt-24 pt-4">
            <ArtisticStatueSection areaTitle="TỨ ÂN - VÃNG SINH ĐƯỜNG" areaSlug="tu-an" />
          </section>

          {/* SECTION 3 — HỆ THỐNG TRA CỨU BÀI VỊ HƯƠNG LINH (THANH TRÁT AI / GEMINI TỐI GIẢN) */}
          <section id="tu-an-vang-sinh" className="w-full scroll-mt-24">
            <TuAnVangSinhSystem />
          </section>

          {/* SECTION 4 — SÁCH LẬT TRANG ONLINE KỶ YẾU PHỤC DỰNG NHÀ TỨ ÂN */}
          <section id="ky-yeu-tu-an" className="max-w-6xl mx-auto scroll-mt-24 px-2 sm:px-4">
            <div className="text-center mb-6">
              <span className="text-xs text-[#F2C14E] font-bold uppercase tracking-widest" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                ❖ TƯ LIỆU LỊCH SỬ TÙNG LÂM HÒA PHÚC ❖
              </span>
              <h2
                className="text-3xl sm:text-4xl text-[#FFE5A3] font-normal uppercase mt-1"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                KỶ YẾU QUÁ TRÌNH PHỤC DỰNG NHÀ TỨ ÂN
              </h2>
              <p className="text-xs text-[#c9b896] max-w-xl mx-auto mt-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                Cuốn sách điện tử lật trang lưu giữ toàn bộ hình ảnh, bản vẽ và quá trình đại trùng tu Nhà Tứ Ân.
              </p>
            </div>
            <TuAnFlipbook />
          </section>

          {/* SECTION 5 — KHÔNG GIAN NHÀ TỨ ÂN & VÃNG SINH ĐƯỜNG */}
          <section id="khong-gian" className="max-w-5xl mx-auto px-4 scroll-mt-24">
            <SpaceGallerySection
              areaTitle="TỨ ÂN - VÃNG SINH ĐƯỜNG"
              currentSlug="tu-an"
              showOtherAreas={false}
            />
          </section>

          {/* SECTION 6 — KHÁM PHÁ KHU VỰC KHÁC */}
          <section id="khu-vuc-khac" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <OtherAreasSection currentSlug="tu-an" />
          </section>

          {/* SECTION 7 — SMART SEARCH AI BAR */}
          <section id="hoi-dap-ai" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <SmartSearchAIBar contextTitle="Tứ Ân - Vãng Sinh Đường Tùng Lâm Hòa Phúc" />
          </section>
        </main>
      </div>
    </div>
  );
}
