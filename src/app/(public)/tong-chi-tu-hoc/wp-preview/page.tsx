'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SubNavbar } from '@/components/tong-chi-tu-hoc/SubNavbar';
import { SidebarNav } from '@/components/tong-chi-tu-hoc/SidebarNav';
import { HeroBanner } from '@/components/tong-chi-tu-hoc/HeroBanner';
import { IllustrationVideo } from '@/components/tong-chi-tu-hoc/chi-tiet/IllustrationVideo';
import { FeaturedPosts } from '@/components/tong-chi-tu-hoc/chi-tiet/FeaturedPosts';
import { PhotoGallery } from '@/components/tong-chi-tu-hoc/chi-tiet/PhotoGallery';
import { DiscoverMore } from '@/components/tong-chi-tu-hoc/chi-tiet/DiscoverMore';
import { AiQnA } from '@/components/tong-chi-tu-hoc/chi-tiet/AiQnA';
import { BookCitationSection } from '@/components/tong-chi-tu-hoc/chi-tiet/BookCitationSection';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';
import { ExternalLink, RefreshCw, Sparkles, Edit3, ArrowLeft, CheckCircle2, Globe, FileCode } from 'lucide-react';

// 🪷 Parser biến mã HTML WordPress Gutenberg thành Markdown/Clean format chuẩn cho InfographicArticleRenderer
function convertWpHtmlToCleanContent(wpRawHtml: string): { cleanedContent: string; extractedSubtitle?: string } {
  if (!wpRawHtml) return { cleanedContent: '' };

  let html = wpRawHtml
    .replace(/&#8211;/g, '–')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC');

  // 1. Bóc tách thẻ phụ (Subtitle) nếu dòng đầu tiên là đoạn in nghiêng/in đậm (ví dụ: "Cội nguồn thiện pháp")
  let extractedSubtitle: string | undefined = undefined;
  const firstP = html.match(/^<p[^>]*>(?:<em><strong>|<strong><em>|<em>|<strong>)([\s\S]*?)(?:<\/strong><\/em>|<\/em><\/strong>|<\/em>|<\/strong>)<\/p>/i);
  if (firstP) {
    const rawSub = firstP[1].replace(/<[^>]+>/g, '').trim();
    if (rawSub.length > 0 && rawSub.length < 80 && !rawSub.includes('“') && !rawSub.includes('”')) {
      extractedSubtitle = rawSub;
      html = html.replace(firstP[0], ''); // Loại bỏ dòng này khỏi nội dung chính để không bị lặp
    }
  }

  // 2. Headings
  html = html.replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, (_m, inner) => {
    const cleanText = inner.replace(/<[^>]+>/g, '').trim();
    return `\n\n### ${cleanText}\n\n`;
  });

  // 3. Blockquotes chuẩn của WordPress Gutenberg
  html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, bqInner) => {
    const clean = bqInner
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/^[“"”\s]+|[“"”\s]+$/g, '');
    const lines = clean.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const quoteLines = lines.map((l: string) => `> ${l}`);
    return `\n\n${quoteLines.join('\n')}\n\n`;
  });

  // 4. Khối Hình Ảnh WordPress Gutenberg (<figure>...<img ...>...<figcaption>...</figcaption>...</figure>)
  html = html.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_m, figInner) => {
    const srcMatch = figInner.match(/src=["']([^"']+)["']/i);
    const altMatch = figInner.match(/alt=["']([^"']*)["']/i);
    const capMatch = figInner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const src = srcMatch ? srcMatch[1] : '';
    const caption = capMatch ? capMatch[1].replace(/<[^>]+>/g, '').trim() : (altMatch ? altMatch[1].trim() : '');
    if (!src) return '';
    return `\n\n![${caption}](${src})\n\n`;
  });

  // 5. Ảnh thông thường dạng standalone <img>
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '\n\n![$2]($1)\n\n');
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');

  // 6. HR (Loại bỏ hoàn toàn)
  html = html.replace(/<hr[^>]*\/?>/gi, '\n\n');

  // 7. Quotes dạng đoạn văn in đậm có ngoặc kép
  html = html.replace(/<p[^>]*><strong><em>[“"”]?([\s\S]*?)[”"”]?<\/em><\/strong><\/p>/gi, (_m, quoteText) => {
    const lines = quoteText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '').split('\n');
    const quoteLines = lines.map((l: string) => `> ${l.trim()}`).filter((l: string) => l !== '>');
    return `\n\n${quoteLines.join('\n')}\n\n`;
  });

  html = html.replace(/<p[^>]*><strong>[“"”]?([\s\S]*?)[”"”]?<\/strong><\/p>/gi, (_m, quoteText) => {
    if (quoteText.includes('“') || quoteText.includes('”') || quoteText.includes('Con nguyện') || quoteText.includes('Sống là cống hiến') || quoteText.includes('Sống Là Cống Hiến')) {
      const lines = quoteText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '').split('\n');
      const quoteLines = lines.map((l: string) => `> ${l.trim()}`).filter((l: string) => l !== '>');
      return `\n\n${quoteLines.join('\n')}\n\n`;
    }
    return `\n\n**${quoteText.replace(/<[^>]+>/g, '').trim()}**\n\n`;
  });

  // 8. Tác giả
  html = html.replace(/<p[^>]*>(?:<em>)?(Vô Trí\s*[-–]\s*Tâm Hòa|Sa Môn Vô Trí[^\n<]*)(?:<\/em>)?<\/p>/gi, '\n\n*$1*\n\n');

  // 9. Paragraphs
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, (_m, pText) => {
    const cleanP = pText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '').trim();
    if (!cleanP) return '';
    return `\n\n${cleanP}\n\n`;
  });

  // 10. Clean markdown & Loại bỏ các dòng ghi chú dàn bài thừa & đường gạch phân cách
  html = html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '');

  // Loại bỏ các dòng ghi chú dàn ý thừa từ người nhập & đường gạch phân cách
  const cleanedLines = html
    .split('\n')
    .filter((l) => {
      const trimmed = l.trim();
      if (!trimmed) return true;
      if (/^(?:-{2,}|\*{2,}|_{2,}|\u2014{2,})$/.test(trimmed)) return false;
      if (/^Infographic\s*\d*\s*card/i.test(trimmed)) return false;
      if (/^\d*\s*Ngăn\s*kéo\s*card/i.test(trimmed)) return false;
      if (/^Click\s*ra\s*trang\s*chi\s*tiết/i.test(trimmed)) return false;
      if (/^QUOTE\s*CUỐI\s*TRANG/i.test(trimmed)) return false;
      if (/^TÀI\s*LIỆU\s*THAM\s*KHẢO/i.test(trimmed)) return false;
      if (trimmed === '↓' || trimmed === '->' || trimmed === '-->') return false;
      return true;
    })
    .join('\n');

  const finalHtml = cleanedLines.replace(/\n{3,}/g, '\n\n').trim();

  return { cleanedContent: finalHtml, extractedSubtitle };
}

export default function WpPreviewPage() {
  const [postId, setPostId] = useState<number>(470);
  const [wpData, setWpData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [viewSource, setViewSource] = useState<boolean>(false);

  const fetchWpPost = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch live directly from WordPress API (kèm ?_embed để lấy ảnh đại diện Featured Image)
      const res = await fetch(`https://admin.tunglamhoaphuc.com/wp-json/wp/v2/tong-chi/${id}?_embed`, {
        cache: 'no-store',
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      if (!res.ok) {
        throw new Error(`WordPress API trả về mã lỗi HTTP ${res.status} (${res.statusText})`);
      }

      const post = await res.json();
      setWpData(post);
      setLastRefreshed(new Date().toLocaleTimeString('vi-VN'));
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu từ WordPress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWpPost(postId);
  }, [postId]);

  const rawHtml = wpData?.content?.rendered || '';
  const parsed = convertWpHtmlToCleanContent(rawHtml);
  const parsedContent = parsed.cleanedContent;
  const articleTitle = wpData?.title?.rendered || 'BỒ ĐỀ TÂM';
  const articleSubtitle = wpData?.acf?.tieu_de_phu || parsed.extractedSubtitle || 'Cội nguồn thiện pháp';
  
  // Tự động lấy Hero Banner từ: Ảnh đại diện WordPress (Featured Media) HOẶC trường ACF anh_nen
  const heroBannerUrl =
    wpData?.acf?.anh_nen ||
    wpData?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/nen-tang-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp';

  // Dynamic Navigation Items
  const navItems = React.useMemo(() => {
    const items: Array<{ id: string; label: string }> = [];
    if (parsedContent) {
      const lines = parsedContent.split('\n');
      for (const l of lines) {
        const line = l.trim();
        if (line.startsWith('### ')) {
          const cleanHeading = line.replace('### ', '').trim();
          const id = cleanHeading
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          if (id && !items.some((it) => it.id === id)) {
            items.push({ id, label: cleanHeading });
          }
        }
      }
    }
    if (items.length === 0) {
      items.push({ id: 'bai-tho', label: 'Bài Thơ / Nội Dung' });
    }
    items.push({ id: 'trich-nguon-sach', label: 'Tài Liệu Tham Khảo' });
    items.push({ id: 'video-minh-hoa', label: 'Video Pháp Thoại' });
    items.push({ id: 'tim-hieu-them', label: 'Bài Viết Liên Quan' });
    return items;
  }, [parsedContent]);

  const [activeSection, setActiveSection] = useState<string>('intro');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
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
    <div className="min-h-screen bg-[#120A05] text-[#FFE5A3] flex flex-col font-sans selection:bg-[#F2C14E] selection:text-[#120A05]">
      {/* 🌟 1. LIVE FLOATING CONTROL BAR ĐỂ VỪA SOẠN WP VỪA XEM TRỰC TIẾP */}
      <div className="sticky top-0 z-50 bg-[#1C120A]/95 backdrop-blur-md border-b-2 border-[#F2C14E] px-4 py-2.5 shadow-[0_5px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left info badge */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/tong-chi-tu-hoc/bo-de-tam-coi-nguon-thien-phap"
              className="p-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] text-[#FFE5A3] border border-[#F2C14E]/30 transition-all flex items-center gap-1 text-xs"
              title="Quay lại trang gốc"
            >
              <ArrowLeft className="w-4 h-4 text-[#F2C14E]" />
              <span className="hidden sm:inline">Về Trang Gốc</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-[#FFDE59] uppercase tracking-wider">
                LIVE API WORDPRESS • ID: {postId}
              </span>
            </div>

            {lastRefreshed && (
              <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Đã đồng bộ lúc {lastRefreshed}
              </span>
            )}
          </div>

          {/* Center Post ID Switcher */}
          <div className="flex items-center gap-2 bg-[#25170E] p-1 rounded-xl border border-[#F2C14E]/30">
            <span className="text-[11px] text-[#c9b896] pl-2 font-medium">Post ID:</span>
            <input
              type="number"
              value={postId}
              onChange={(e) => setPostId(Number(e.target.value) || 470)}
              className="w-16 px-2 py-1 bg-[#1A1008] border border-[#F2C14E]/40 rounded-lg text-xs font-bold text-[#FFDE59] text-center focus:outline-none focus:border-[#F2C14E]"
            />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Nút Xem mã HTML thô từ WP */}
            <button
              type="button"
              onClick={() => setViewSource(!viewSource)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewSource ? 'bg-[#F2C14E] text-[#1A120B]' : 'bg-[#25170E] text-[#FFE5A3] border border-[#F2C14E]/30 hover:border-[#F2C14E]'
              }`}
              title="Xem mã HTML gốc WordPress trả về"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{viewSource ? 'Ẩn Mã HTML' : 'Xem Mã HTML WP'}</span>
            </button>

            {/* Nút Làm mới dữ liệu */}
            <button
              type="button"
              onClick={() => fetchWpPost(postId)}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#FFDE59] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 disabled:opacity-50"
              title="Tải lại dữ liệu mới nhất từ WordPress ngay lập tức"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F2C14E] ${loading ? 'animate-spin' : ''}`} />
              <span>Làm Mới</span>
            </button>

            {/* Nút Mở trang sửa trên WordPress */}
            <a
              href={`https://admin.tunglamhoaphuc.com/wp-admin/post.php?post=${postId}&action=edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] hover:from-[#FFDE59] hover:to-[#F2C14E] text-[#1A120B] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Sửa Trên WP</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal / Panel Xem Mã HTML Thô Nếu Bật */}
      {viewSource && (
        <div className="bg-[#180E07] border-b border-[#F2C14E]/40 p-4 max-w-7xl mx-auto w-full animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#FFDE59] flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              Mã HTML thô nhận từ WordPress API (/wp-json/wp/v2/tong-chi/{postId})
            </span>
            <span className="text-[11px] text-[#c9b896]/70">{rawHtml.length} ký tự</span>
          </div>
          <pre className="bg-[#0E0704] p-4 rounded-xl text-[11px] text-emerald-400 font-mono overflow-x-auto max-h-60 custom-scrollbar border border-[#F2C14E]/20 select-all whitespace-pre-wrap">
            {rawHtml || 'Chưa có nội dung từ WordPress'}
          </pre>
        </div>
      )}

      {/* Hero Banner */}
      <HeroBanner
        bannerUrl={heroBannerUrl}
        bannerPosition="center 47%"
        title={articleTitle}
        subtitle={articleSubtitle}
      />

      {/* SubNavbar */}
      <SubNavbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onScrollToSection={scrollToSection}
        pageTitle={articleTitle}
        navItems={navItems}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#F2C14E] animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#FFE5A3]">Đang tải dữ liệu trực tiếp từ WordPress API...</p>
            <p className="text-xs text-[#c9b896]/60">https://admin.tunglamhoaphuc.com/wp-json/wp/v2/tong-chi/{postId}</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-4 max-w-xl mx-auto bg-[#25170E] p-8 rounded-3xl border-2 border-red-500/50 shadow-2xl">
            <p className="text-red-400 font-bold text-base">⚠️ {error}</p>
            <p className="text-xs text-[#c9b896]">
              Hãy chắc chắn rằng bài viết ID <strong>{postId}</strong> đã được bấm nút <strong>&quot;Đăng (Publish)&quot;</strong> trên trang quản trị WordPress.
            </p>
            <a
              href={`https://admin.tunglamhoaphuc.com/wp-admin/post.php?post=${postId}&action=edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2C14E] text-[#1A120B] text-xs font-bold hover:scale-105 transition-all"
            >
              <Edit3 className="w-4 h-4" /> Mở WordPress để Kiểm Tra Trạng Thái Đăng
            </a>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0">
              <SidebarNav
                activeSection={activeSection}
                isScrolled={isScrolled}
                onScrollToSection={scrollToSection}
                pageTitle={articleTitle}
                navItems={navItems}
              />
            </aside>

            {/* Main Content Rendered */}
            <article className="flex-1 min-w-0 space-y-12 w-full">
              {/* Infographic Article Renderer */}
              <section id="bai-tho" className="relative pt-2 scroll-mt-28">
                <InfographicArticleRenderer
                  rawContent={parsedContent}
                  title={articleTitle}
                  subtitle={articleSubtitle}
                  author="Sa Môn Vô Trí (Thích Tâm Hòa)"
                  authorLink="/gioi-thieu/su-phu-tru-tri"
                  popups={[]}
                />
              </section>

              {/* Source Books */}
              <section id="trich-nguon-sach" className="scroll-mt-28">
                <BookCitationSection
                  sourceBook={[
                    {
                      bookTitle: 'Khuyến Phát Bồ Đề Tâm Giảng Luận (Trọn bộ 4 quyển)',
                      author: 'Đại Đức Thích Tâm Hòa',
                      coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-banner-sach.webp',
                      description: 'Bộ sách giảng giải chi tiết về tầm quan trọng của việc phát Bồ Đề Tâm trong đời sống tu học và phụng sự nhân sinh.',
                      linkUrl: '/tri-tue-phat-phap',
                    },
                    {
                      bookTitle: 'Đi Qua Khổ Vui Cuộc Đời (Quyển 01, 02, 03)',
                      author: 'Sa Môn Vô Trí (hiệu Tâm Hòa)',
                      coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-phong-truyen-thua/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup-sach-dqkvcd.webp',
                      description: 'Những chia sẻ chân thật và sâu sắc về hành trình vượt qua chông gai, chuyển hóa khổ đau thành an lạc thảnh thơi.',
                      linkUrl: '/tri-tue-phat-phap/di-qua-kho-vui-cuoc-doi',
                    },
                  ]}
                />
              </section>

              {/* Video Block */}
              <section id="video-minh-hoa" className="scroll-mt-28">
                <IllustrationVideo
                  videoBlock={{
                    title: 'KHUYẾN PHÁT BỒ ĐỀ TÂM VĂN - TRỌN BỘ | ĐẠI ĐỨC THÍCH TÂM HÒA',
                    subtitle: 'Khơi dậy ngọn đèn trí tuệ và tình thương vô ngã.',
                    description: 'Chư Phật ba đời không rời Bồ Đề tâm để thành tựu các pháp.',
                    videoUrl: 'https://www.youtube.com/playlist?list=PL2aRqXTU1nn456nh72vOF1W7Au764sTVN',
                  }}
                />
              </section>

              {/* AI Q&A */}
              <AiQnA />
            </article>
          </div>
        )}
      </main>
    </div>
  );
}
