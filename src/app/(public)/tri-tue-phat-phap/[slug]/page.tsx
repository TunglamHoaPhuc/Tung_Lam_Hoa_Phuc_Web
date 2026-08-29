'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, Calendar, Play, ArrowLeft, ChevronRight, Bell, Sparkles, Video, Images, BookOpen, Clock, Landmark, ArrowRight } from 'lucide-react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { WISDOM_ITEMS } from '@/data/wisdom-archive-data';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import sachAnPhamData from '@/data/sach-an-pham-data.json';
import { BookDualReader } from '@/components/tri-tue-phat-phap/BookDualReader';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';
import { BookCitationSection } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';
import { DetailModal } from '@/components/tong-chi-tu-hoc/chi-tiet/DetailModal';

export default function WisdomDetailPage() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = typeof rawSlug === 'string' ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : '';
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeKeyword, setActiveKeyword] = useState<any>(null);

  // Check if this slug is a Book from Publications
  const matchedBook = sachAnPhamData.find((b) => b.slug === slug);

  // Dynamic Item State
  const initialFallback = WISDOM_ITEMS.find((w) => w.slug === slug) || WISDOM_ITEMS[5];
  const [item, setItem] = useState<any>(initialFallback);

  useEffect(() => {
    async function loadDynamicPost() {
      if (!slug || matchedBook) return;
      try {
        const res = await fetch(`/api/admin/posts/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.post) {
            setItem({
              ...json.post,
              primaryCategoryTag: json.post.subtitle || json.post.categoryName || 'Trí Tuệ Phật Pháp',
              publishDate: json.post.publishedDate || '2026-08-01',
              views: json.post.viewsCount || 108,
            });
          }
        }
      } catch (err) {
        console.log('Wisdom detail dynamic fetch fallback:', err);
      }
    }
    loadDynamicPost();
  }, [slug, matchedBook]);

  if (matchedBook) {
    return <BookDualReader book={matchedBook as any} />;
  }

  const relatedItems = WISDOM_ITEMS.filter((w) => w.id !== item.id).slice(0, 3);
  const relatedFormatted = relatedItems.map((r) => ({
    category: r.primaryCategoryTag || 'Trí Tuệ Phật Pháp',
    title: r.title,
    url: r.thumbnailUrl,
    link: `/tri-tue-phat-phap/${r.slug}`,
  }));

  return (
    <div className="min-h-screen bg-[#2C1C11] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      {/* ── 1. HERO BANNER & TIÊU ĐỀ TRANG ── */}
      <HeroBanner
        id="overview"
        bannerUrl={item.bannerUrl || item.thumbnailUrl}
        bannerPosition={item.bannerPosition || item.thumbnailPosition || 'center 50%'}
        title={item.title}
        subtitle={item.subtitle || 'KHO TÀNG TRÍ TUỆ PHẬT PHÁP'}
      />

      {/* ── 2. NỘI DUNG PHÁP BẢO & INFOGRAPHIC ARTICLE RENDERER ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/tri-tue-phat-phap"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#F2C14E] hover:text-[#FFE5A3] transition-colors"
              style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: 'bold' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Kho Tàng Trí Tuệ Phật Pháp</span>
            </Link>
          </div>

          <InfographicArticleRenderer
            rawContent={item.content || item.contentHtml || item.excerpt || ''}
            title={item.title}
            subtitle={item.subtitle}
            author={item.author}
            popups={item.keywords}
            onKeywordClick={(kwStr) => {
              const kws = item.keywords || [];
              const found = kws.find((k: any) => k.keyword.toLowerCase() === kwStr.toLowerCase());
              if (found) {
                setActiveKeyword(found);
              }
            }}
          />

          {/* Meta footer */}
          <div
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="border-t border-[#F2C14E]/20 pt-6 mt-12 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-[#D3C0AD]"
          >
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#F2C14E]" />
                <span>Ngày đăng: <strong className="text-[#F2C14E]">{item.publishDate || item.publishedDate || '2026-08-01'}</strong></span>
              </span>

              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#F2C14E]" />
                <span>Lượt xem: <strong className="text-[#F2C14E]">{item.views || item.viewsCount || 108}</strong></span>
              </span>
            </div>

            {item.author && (
              <div>
                <span>Tác giả / Diễn giảng: <strong className="text-[#F2C14E]">{item.author}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* ── 3. BLOCK VIDEO PHÁP THOẠI / MINH HỌA ── */}
        {(item.videoBlock?.videoUrl || item.mediaUrl) && (
          <div className="w-full">
            <IllustrationVideo
              heroBanner={item.bannerUrl || item.thumbnailUrl}
              videoBlock={item.videoBlock || {
                videoUrl: item.mediaUrl,
                title: item.title,
                summary: item.excerpt || '',
                thumbnailUrl: item.thumbnailUrl,
              }}
            />
          </div>
        )}

        {/* ── 4. BLOCK BỘ SƯU TẬP ẢNH TƯ LIỆU (PHOTO GALLERY) ── */}
        {item.photoGallery && item.photoGallery.length > 0 && (
          <div className="w-full">
            <PhotoGallery photoGallery={item.photoGallery} onSelectPhoto={() => {}} />
          </div>
        )}

        {/* ── 5. BLOCK TRÍCH DẪN NGUỒN SÁCH & ẤN PHẨM ── */}
        {item.sourceBook && (
          <BookCitationSection sourceBook={item.sourceBook} />
        )}

        {/* ── 6. BLOCK TÌM HIỂU THÊM ── */}
        <div className="w-full">
          <DiscoverMore relatedArticles={relatedFormatted} />
        </div>

        {/* Smart Search AI Bar */}
        <div className="my-10">
          <SmartSearchAIBar contextTitle={item.title} />
        </div>
      </main>

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
