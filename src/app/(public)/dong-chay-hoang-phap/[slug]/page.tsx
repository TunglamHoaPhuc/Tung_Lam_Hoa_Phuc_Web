'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, Calendar, Play, Video, Clock, Landmark, Sparkles, Images, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { HOANG_PHAP_ARTICLES } from '@/data/dong-chay-hoang-phap-data';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';
import { BookCitationSection } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';
import { DetailModal } from '@/components/tong-chi-tu-hoc/chi-tiet/DetailModal';

const NAV_ITEMS = [
  { id: 'overview', label: 'TỔNG QUAN' },
  { id: 'article-body', label: 'NỘI DUNG CHÍNH' },
  { id: 'video-section', label: 'VIDEO' },
  { id: 'gallery-section', label: 'ALBUM ẢNH' },
  { id: 'editions-section', label: 'CÁC KỲ TRƯỚC' },
  { id: 'events-section', label: 'SẮP DIỄN RA' },
  { id: 'related-section', label: 'TÌM HIỂU THÊM' },
];

export default function DongChayHoangPhapDetailPage() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = typeof rawSlug === 'string' ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : '';
  const [activeSection, setActiveSection] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);

  // Detail Modal Keyword state
  const [activeKeyword, setActiveKeyword] = useState<any>(null);

  // Dynamic article state with fallback
  const initialFallback = HOANG_PHAP_ARTICLES.find((a) => a.slug === slug) || HOANG_PHAP_ARTICLES[0];
  const [article, setArticle] = useState<any>(initialFallback);

  useEffect(() => {
    async function loadDynamicPost() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/admin/posts/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.post) {
            setArticle(json.post);
          }
        }
      } catch (err) {
        console.log('Detail post load fallback:', err);
      }
    }
    loadDynamicPost();
  }, [slug]);

  const relatedArticles = HOANG_PHAP_ARTICLES.filter((a) => a.id !== article.id);
  const relatedArticlesFormatted = relatedArticles.map((rel) => ({
    category: rel.subCategory || 'DÒNG CHẢY HOẰNG PHÁP',
    title: rel.title,
    url: rel.thumbnailUrl,
    link: `/dong-chay-hoang-phap/${rel.slug}`,
  }));

  const shortAnchorTitle = article.subtitle || article.subCategory || 'DÒNG CHẢY HOẰNG PHÁP';

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 400);

      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(NAV_ITEMS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#2C1C11] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      {/* ── 1. STICKY ANCHOR NAV ── */}
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={shortAnchorTitle}
        navItems={NAV_ITEMS}
      />

      <SidebarNav
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={shortAnchorTitle}
        navItems={NAV_ITEMS}
      />

      {/* ── 2. HERO BANNER BÊ NGUYÊN TỪ TÔNG CHỈ TU HỌC ── */}
      <div className={`w-full transition-all duration-500 ${isScrolled ? 'pl-16 md:pl-24' : 'pl-4'} pr-4 md:pr-12`}>
        <HeroBanner
          id="overview"
          bannerUrl={article.bannerUrl || article.thumbnailUrl}
          bannerPosition={article.bannerPosition || article.thumbnailPosition || 'center 50%'}
          title={article.title}
          subtitle={article.subtitle || 'TÙNG LÂM HÒA PHÚC'}
        />

        {/* ── 3. NỘI DUNG BÀI VIẾT & CÁC KHỐI CHUẨN 100% TỪ TÔNG CHỈ TU HỌC ── */}
        <main className="max-w-5xl mx-auto pt-4 pb-16 space-y-16 w-full">
          <div id="article-body" className="max-w-4xl mx-auto">
            <InfographicArticleRenderer
              rawContent={article.content || article.contentHtml || article.summary || ''}
              title={article.title}
              subtitle={article.subtitle}
              author={article.author}
              authorLink={article.authorLink}
              popups={article.keywords}
              onKeywordClick={(kwStr) => {
                const kws = article.keywords || [];
                const found = kws.find((k: any) => k.keyword.toLowerCase() === kwStr.toLowerCase());
                if (found) {
                  setActiveKeyword(found);
                }
              }}
            />

            {/* BLOCK META FOOTER */}
            <div
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="border-t border-[#F2C14E]/20 pt-6 mt-12 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-[#D3C0AD]"
            >
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F2C14E]" />
                  <span>Ngày đăng: <strong className="text-[#F2C14E]">{article.publishedDate || article.date}</strong></span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#F2C14E]" />
                  <span>Lượt xem: <strong className="text-[#F2C14E]">{article.viewsCount || article.views || 108}</strong></span>
                </span>
              </div>

              {article.author && (
                <div>
                  <span>Tác giả / Biên tập: <strong className="text-[#F2C14E]">{article.author}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* ── 4. BLOCK VIDEO LIÊN QUAN / PHÁP THOẠI ── */}
          {article.videoBlock?.videoUrl && (
            <div id="video-section" className="w-full">
              <IllustrationVideo
                heroBanner={article.bannerUrl || article.thumbnailUrl}
                videoBlock={article.videoBlock}
              />
            </div>
          )}

          {/* ── 5. BLOCK BỘ SƯU TẬP ẢNH TƯ LIỆU SỰ KIỆN (PHOTO GALLERY) ── */}
          {article.photoGallery && article.photoGallery.length > 0 && (
            <div id="gallery-section" className="w-full">
              <PhotoGallery photoGallery={article.photoGallery} onSelectPhoto={() => {}} />
            </div>
          )}

          {/* ── 6. BLOCK TRÍCH DẪN NGUỒN SÁCH (SOURCE BOOK) ── */}
          {article.sourceBook && (
            <BookCitationSection sourceBook={article.sourceBook} />
          )}

          {/* ── 7. BLOCK KHÓA TU / BÀI VIẾT CÁC KỲ TRƯỚC (PREVIOUS EDITIONS) ── */}
          {article.previousEditions && article.previousEditions.length > 0 && (
            <div id="editions-section" className="w-full my-12">
              <div className="flex flex-col items-center justify-center text-center space-y-3 w-full mb-8">
                <div className="w-10 h-8 border border-[#ffde59]/80 rounded-md bg-[#3a2613] flex items-center justify-center shadow-[0_0_12px_rgba(255,222,89,0.3)] z-10">
                  <Clock className="w-5 h-5 text-[#ffde59]" />
                </div>
                <div className="flex items-center justify-center w-full my-2">
                  <div className="flex-1 flex items-center justify-end">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
                  </div>
                  <h2
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-3xl sm:text-5xl font-normal text-[#ffde59] uppercase px-4 sm:px-6 drop-shadow-[0_0_16px_rgba(255,222,89,0.85)] whitespace-nowrap"
                  >
                    KHÓA TU & SỰ KIỆN CÁC KỲ TRƯỚC
                  </h2>
                  <div className="flex-1 flex items-center justify-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
                    <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {article.previousEditions.map((ed: any, edIdx: number) => (
                  <Link
                    key={edIdx}
                    href={`/dong-chay-hoang-phap/${ed.slug || ''}`}
                    className="p-5 rounded-2xl bg-[#3A2718]/80 border border-[#F2C14E]/30 hover:border-[#F2C14E] transition-all duration-300 hover:-translate-y-1 block shadow-lg group"
                  >
                    <span className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider">{ed.period}</span>
                    <h4
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-base font-bold text-white group-hover:text-[#ffde59] transition-colors mt-2 leading-snug line-clamp-2"
                    >
                      {ed.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-[#FFE5A3]/70 group-hover:text-[#F2C14E] mt-4 font-semibold">
                      <span>Xem lại thời khóa</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── 8. BLOCK CHƯƠNG TRÌNH SẮP TỚI (UPCOMING EVENTS / KHÓA TU SẮP DIỄN RA) ── */}
          {article.upcomingEvents && article.upcomingEvents.length > 0 && (
            <div id="events-section" className="w-full my-12">
              <div className="flex flex-col items-center justify-center text-center space-y-3 w-full mb-8">
                <div className="w-10 h-8 border border-[#ffde59]/80 rounded-md bg-[#3a2613] flex items-center justify-center shadow-[0_0_12px_rgba(255,222,89,0.3)] z-10">
                  <Calendar className="w-5 h-5 text-[#ffde59] animate-pulse" />
                </div>
                <div className="flex items-center justify-center w-full my-2">
                  <div className="flex-1 flex items-center justify-end">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
                  </div>
                  <h2
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-3xl sm:text-5xl font-normal text-[#ffde59] uppercase px-4 sm:px-6 drop-shadow-[0_0_16px_rgba(255,222,89,0.85)] whitespace-nowrap"
                  >
                    CHƯƠNG TRÌNH / KHÓA TU SẮP DIỄN RA
                  </h2>
                  <div className="flex-1 flex items-center justify-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
                    <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {article.upcomingEvents.map((ev: any, evIdx: number) => (
                  <div
                    key={evIdx}
                    className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#3A2718] to-[#25170E] border-2 border-[#F2C14E]/60 shadow-[0_0_30px_rgba(242,193,78,0.2)] space-y-3 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2C14E]/5 rounded-full blur-2xl pointer-events-none" />
                    <h3
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-lg sm:text-xl font-bold text-[#ffde59] uppercase leading-tight"
                    >
                      {ev.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#FFE5A3] font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#F2C14E] shrink-0" />
                      <span>{ev.timeString}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-[#D3C0AD] flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-[#F2C14E] shrink-0" />
                      <span>{ev.location}</span>
                    </p>
                    {ev.description && (
                      <p className="text-xs sm:text-sm text-white/90 pt-2 leading-relaxed border-t border-[#F2C14E]/20">
                        {ev.description}
                      </p>
                    )}
                    {ev.registrationLink && (
                      <div className="pt-3">
                        <Link
                          href={ev.registrationLink}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] text-black text-xs font-bold shadow-[0_0_15px_rgba(242,193,78,0.4)] hover:scale-105 transition-transform cursor-pointer"
                        >
                          <span>Đăng Ký Tham Gia Khóa Tu</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 9. BLOCK TÌM HIỂU THÊM ── */}
          <div id="related-section" className="w-full">
            <DiscoverMore relatedArticles={relatedArticlesFormatted} />
          </div>

          {/* ── Smart Search AI Bar ── */}
          <div className="my-10">
            <SmartSearchAIBar contextTitle={article.title} />
          </div>
        </main>
      </div>

      {/* Detail Modal for Keyword Click */}
      <DetailModal
        activePhotoIndex={null}
        photoGallery={[]}
        onClosePhotoModal={() => {}}
        onPrevPhoto={() => {}}
        onNextPhoto={() => {}}
        onSelectPhotoIndex={() => {}}
        activeKeywordPopup={activeKeyword}
        onCloseKeywordPopup={() => setActiveKeyword(null)}
      />
    </div>
  );
}
