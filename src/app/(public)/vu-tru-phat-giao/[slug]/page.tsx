'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { UNIVERSE_AREAS, UniverseArea } from '@/data/universe-data';
import { OFFICIAL_TUONG_CHINH_LIST, OFFICIAL_NTPG_LIST } from '@/data/statue-data';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { StatueCollectionGrid } from '@/features/universe/components/StatueCollectionGrid';
import { ArtisticStatueSection } from '@/features/universe/components/ArtisticStatueSection';
import { RelatedStoriesSection } from '@/features/universe/components/RelatedStoriesSection';
import { SpaceGallerySection } from '@/features/universe/components/SpaceGallerySection';
import { OtherAreasSection } from '@/features/universe/components/OtherAreasSection';
import { ThuVienGrid } from '@/features/universe/components/ThuVienGrid';
import { TuAnVangSinhSystem } from '@/features/universe/components/TuAnVangSinhSystem';
import { BaoThapGrid } from '@/features/universe/components/BaoThapGrid';
import { BaoTangGrid } from '@/features/universe/components/BaoTangGrid';
import { DaiNamQuocMauGrid } from '@/features/universe/components/DaiNamQuocMauGrid';
import { CongTamQuanSection } from '@/features/universe/components/CongTamQuanSection';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

function formatParagraphsHtml(fullContent?: string, description?: string): string {
  const sourceText = (fullContent && fullContent.trim().length > 0) ? fullContent : (description || '');
  if (!sourceText) return '';

  const paragraphs = sourceText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs.map((p) => `<p>${p}</p>`).join('');
}

function matchesArea(itemAreaSlug: string, pageSlug: string, areaSlug: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const a1 = norm(itemAreaSlug);
  const a2 = norm(pageSlug);
  const a3 = norm(areaSlug);

  if (a1 === a2 || a1 === a3) return true;
  if ((a1.includes('mau') || a1.includes('dai_nam')) && (a2.includes('mau') || a2.includes('dai_nam') || a3.includes('mau') || a3.includes('dai_nam'))) return true;
  if ((a1.includes('vang_sinh') || a1.includes('tu_an')) && (a2.includes('vang_sinh') || a2.includes('tu_an') || a3.includes('vang_sinh') || a3.includes('tu_an'))) return true;
  if (a1.includes('bao_tang') && (a2.includes('bao_tang') || a3.includes('bao_tang'))) return true;
  if ((a1.includes('luan') || a1.includes('phong_sinh')) && (a2.includes('luan') || a2.includes('phong_sinh') || a3.includes('luan') || a3.includes('phong_sinh'))) return true;
  if (a1.includes('cong') && (a2.includes('cong') || a3.includes('cong'))) return true;
  return false;
}

export default function UniverseDetailPage() {
  const routeParams = useParams();
  const rawSlug = typeof routeParams?.slug === 'string' ? routeParams.slug : (Array.isArray(routeParams?.slug) ? routeParams.slug[0] : '');
  const slug = (rawSlug || '').toLowerCase().trim();

  // Find area matching slug, or generate a rich fallback object to NEVER trigger a 404 error!
  let area: UniverseArea | undefined = UNIVERSE_AREAS.find((a) => a.slug.toLowerCase() === slug);
  if (!area) {
    const formattedTitle = (slug || 'khu-vuc-tam-linh')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    area = {
      id: slug || 'khu-vuc',
      pinNumber: 99,
      slug: slug || 'khu-vuc',
      name: formattedTitle.toUpperCase(),
      subtitle: "TÙNG LÂM HÒA PHÚC",
      temple: "tung-lam-hoa-phuc",
      templeName: "Tùng Lâm Hòa Phúc",
      imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1100&h=600&fit=crop",
      mapPos: { x: 50, y: 50 },
      description: `Không gian tâm linh ${formattedTitle} thuộc tự viện Tùng Lâm Hòa Phúc. Nơi đây là điểm tựa tinh thần trang nghiêm để chư tôn đức và Phật tử thập phương cúng dường lễ bái, tụng kinh và chiêm bái các pho bảo tượng Phật giáo truyền thống.`,
      fullContent: `Không gian tâm linh ${formattedTitle} thuộc tự viện Tùng Lâm Hòa Phúc. Nơi đây là điểm tựa tinh thần trang nghiêm để chư tôn đức và Phật tử thập phương cúng dường lễ bái, tụng kinh và chiêm bái các pho bảo tượng Phật giáo truyền thống.`,
      statues: [],
      stories: [],
    };
  }

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
      <Header scrolled={true} />

      {/* ── TOP STICKY SUBNAVBAR & SIDEBAR NAV ── */}
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={area.name.toUpperCase()}
        navItems={navItems}
      />
      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={area.name.toUpperCase()}
        navItems={navItems}
      />

      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        {/* ── HEROBANNER ── */}
        <HeroBanner
          id="herobanner"
          bannerUrl={area.imgUrl}
          title={area.name.toUpperCase()}
          subtitle={area.subtitle.toUpperCase()}
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
              dangerouslySetInnerHTML={{
                __html: formatParagraphsHtml(area.fullContent, area.description),
              }}
            />
          </section>

          {/* SECTION 2 — BỘ SƯU TẬP BẢO TƯỢNG (TƯỢNG CHÍNH) */}
          <section id="bo-suu-tap-bao-tuong" className="w-full scroll-mt-24 pt-4">
            <StatueCollectionGrid
              statues={OFFICIAL_TUONG_CHINH_LIST}
              areaTitle={area.name}
              areaSlug={area.slug || slug}
            />
          </section>

          {/* SECTION 2B — NGHỆ THUẬT PHẬT GIÁO (BỔ SUNG CHO TẤT CẢ KHU VỰC - FONT UTM NIAGARA) */}
          <section id="nghe-thuat-phat-giao-khu-vuc" className="w-full scroll-mt-24 pt-4">
            <ArtisticStatueSection
              areaTitle={area.name}
              areaSlug={area.slug || slug}
              items={OFFICIAL_NTPG_LIST}
            />
          </section>

          {/* SECTION 3 — TÍNH NĂNG CHUYÊN BIỆT THEO KHU VỰC */}
          <section id="cau-chuyen-lien-quan" className="w-full scroll-mt-24">
            {slug === 'thu-vien' || slug === 'tang-kinh-cac' ? (
              <ThuVienGrid />
            ) : slug === 'tu-an' || slug === 'tu-an-duong' || slug === 'vang-sinh-duong' ? (
              <TuAnVangSinhSystem />
            ) : slug === 'bao-thap-van-phat-xa-loi' || slug === 'bao-thap' ? (
              <BaoThapGrid />
            ) : slug === 'bao-tang' || slug === 'bao-tang-phat-giao' ? (
              <BaoTangGrid />
            ) : slug === 'dai-nam-quoc-mau' ? (
              <DaiNamQuocMauGrid />
            ) : slug === 'cong-tam-quan' ? (
              <CongTamQuanSection />
            ) : (
              <div className="max-w-4xl mx-auto px-4">
                <RelatedStoriesSection
                  areaTitle={area.name}
                  stories={area.stories && area.stories.length > 0 ? area.stories.map((st, i) => ({
                    id: `st-story-${i}`,
                    title: st.title || `CÂU CHUYỆN LIÊN QUAN TẠI ${area.name}`,
                    summary: st.summary || `Khám phá câu chuyện ý nghĩa lịch sử tại ${area.name}.`,
                    thumbnailUrl: st.imgUrl || area.imgUrl,
                  })) : undefined}
                />
              </div>
            )}
          </section>

          {/* SECTION 4 — KHÔNG GIAN TAM BẢO / KHU VỰC */}
          <section id="khong-gian" className="max-w-5xl mx-auto px-4 scroll-mt-24">
            <SpaceGallerySection
              areaTitle={area.name}
              currentSlug={area.slug}
              showOtherAreas={false}
            />
          </section>

          {/* SECTION 5 — KHÁM PHÁ KHU VỰC KHÁC */}
          <section id="khu-vuc-khac" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <OtherAreasSection currentSlug={area.slug} />
          </section>

          {/* SECTION 6 — HỎI ĐÁP AI */}
          <section id="hoi-dap-ai" className="max-w-4xl mx-auto px-4 scroll-mt-24">
            <SmartSearchAIBar contextTitle={`Không Gian Tâm Linh ${area.name}`} />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
