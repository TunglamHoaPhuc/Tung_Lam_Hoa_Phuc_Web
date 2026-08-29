'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { TAM_BAO_VIDEOS, TAM_BAO_SPACES } from '@/data/tam-bao-detail-data';
import { StatueCollectionGrid } from '@/features/universe/components/StatueCollectionGrid';
import { ArtisticStatueSection } from '@/features/universe/components/ArtisticStatueSection';
import { RelatedStoriesSection } from '@/features/universe/components/RelatedStoriesSection';
import { SpaceGallerySection } from '@/features/universe/components/SpaceGallerySection';
import { OtherAreasSection } from '@/features/universe/components/OtherAreasSection';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';

export default function TamBaoDetailPage() {
  const [activeSection, setActiveSection] = useState('gioi-thieu');
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'gioi-thieu', label: 'GIỚI THIỆU' },
    { id: 'bo-suu-tap-bao-tuong', label: 'BỘ SƯU TẬP BẢO TƯỢNG' },
    { id: 'cau-chuyen-lien-quan', label: 'CÂU CHUYỆN LIÊN QUAN' },
    { id: 'khong-gian', label: 'KHÔNG GIAN' },
    { id: 'khu-vuc-khac', label: 'KHU VỰC KHÁC' },
    { id: 'hoi-dap-ai', label: 'HỎI ĐÁP AI' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

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
        pageTitle="TAM BẢO"
        navItems={navItems}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle="TAM BẢO"
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        {/* ── HEROBANNER ── */}
        <HeroBanner
          id="herobanner"
          bannerUrl="https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp"
          title="TAM BẢO"
          subtitle="ĐẠI HÙNG BẢO ĐIỆN"
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
                Với kiến trúc hình chữ công (工) và phối thờ theo phong cách của ba miền Bắc - Trung - Nam, Tam Bảo là nơi tôn thờ Đức Phật Bổn Sư Thích Ca Mâu Ni, cùng chư Bồ Tát, chư Hiền Thánh Tăng và các vị Tổ sư có công rất lớn trong việc duy trì mạng mạch chánh Pháp của Như Lai.
              </p>
              <p>
                Nơi hội tụ chư Phật hải hội, chư đại Bồ Tát và Thánh Tăng, điểm tựa tinh thần vững chãi cho hàng vạn Phật tử thập phương trở về tu học và tìm kiếm sự bình an trong tâm hồn.
              </p>
            </div>
          </section>

          {/* SECTION 2 — BỘ SƯU TẬP BẢO TƯỢNG (TƯỢNG CHÍNH TẠI TAM BẢO) */}
          <section id="bo-suu-tap-bao-tuong" className="w-full scroll-mt-24 pt-4">
            <StatueCollectionGrid areaTitle="TAM BẢO" areaSlug="tam-bao" />
          </section>

          {/* SECTION 2B — NGHỆ THUẬT PHẬT GIÁO TẠI TAM BẢO */}
          <section id="nghe-thuat-phat-giao-khu-vuc" className="w-full scroll-mt-24 pt-4">
            <ArtisticStatueSection areaTitle="TAM BẢO" areaSlug="tam-bao" />
          </section>

          {/* SECTION 3 — CÂU CHUYỆN LIÊN QUAN (KHÁM PHÁ CÁC CÂU CHUYỆN LIÊN QUAN) */}
          <section id="cau-chuyen-lien-quan" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <RelatedStoriesSection
              areaTitle="TAM BẢO"
              stories={TAM_BAO_VIDEOS.map((v) => ({
                id: v.id,
                title: v.title,
                subtitle: 'Tùng Lâm Hòa Phúc',
                summary: v.summary,
                thumbnailUrl: v.thumbnailUrl,
                videoUrl: v.videoUrl,
              }))}
            />
          </section>

          {/* SECTION 4 — KHÔNG GIAN TAM BẢO (ĐƯA KHÔNG GIAN TAM BẢO XUỐNG DƯỚI CÂU CHUYỆN LIÊN QUAN) */}
          <section id="khong-gian" className="max-w-5xl mx-auto px-4 scroll-mt-24">
            <SpaceGallerySection
              areaTitle="TAM BẢO"
              spaces={TAM_BAO_SPACES}
              currentSlug="tam-bao"
              showOtherAreas={false}
            />
          </section>

          {/* SECTION 5 — KHÁM PHÁ KHU VỰC KHÁC (SHOW GRID 2 ẢNH CÓ CHÚ THÍCH BANNER DƯỚI) */}
          <section id="khu-vuc-khac" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <OtherAreasSection currentSlug="tam-bao" />
          </section>

          {/* SECTION 6 — SMART SEARCH AI BAR */}
          <section id="hoi-dap-ai" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <SmartSearchAIBar contextTitle="Khu Vực Tam Bảo &amp; Tùng Lâm Hòa Phúc" />
          </section>
        </main>
      </div>
    </div>
  );
}
