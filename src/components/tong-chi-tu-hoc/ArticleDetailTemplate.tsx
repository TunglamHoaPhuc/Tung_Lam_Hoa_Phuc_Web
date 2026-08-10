'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { KeywordTooltipModal } from '@/components/tong-chi-tu-hoc/KeywordTooltipModal';

// ─── Types ─────────────────────────────────────────────────────────────────
interface KeywordPopup {
  keyword: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
}

interface RelatedArticle {
  category: string;
  title: string;
  url: string;
  imgUrl?: string;
}

interface VideoBlock {
  title?: string;
  description?: string;
  videoUrl?: string;
}

interface ArticleDetailTemplateProps {
  /** Tiêu đề bài viết (font UTM ClassizismAntiqua) */
  title: string;
  /** Phụ đề / slogan */
  subtitle?: string;
  /** URL ảnh banner đầu trang */
  heroBannerUrl: string;
  /** Nội dung HTML đầy đủ (WordPress rendered HTML) */
  contentHtml: string;
  /** Danh sách từ khóa chú thích tương tác (UTM Avo Bold → click mở popup) */
  keywords?: KeywordPopup[];
  /** Khối video minh họa */
  videoBlock?: VideoBlock;
  /** Danh sách bài viết liên quan (Tìm Hiểu Thêm) */
  relatedArticles?: RelatedArticle[];
  /** Breadcrumb path */
  breadcrumb?: Array<{ label: string; href: string }>;
}

// ─── Helper: inject keyword highlights vào HTML ─────────────────────────────
function injectKeywords(html: string, keywords: KeywordPopup[]): string {
  if (!keywords || keywords.length === 0) return html;
  let result = html;
  keywords.forEach((kw) => {
    const escaped = kw.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'g');
    result = result.replace(
      regex,
      `<span class="keyword-highlight" data-keyword="${kw.keyword}" style="font-family:'UTM Avo',sans-serif;font-weight:bold;color:#F2C14E;border-bottom:1.5px dotted rgba(242,193,78,0.6);cursor:pointer;transition:all 0.2s;" onmouseenter="this.style.textShadow='0 0 12px rgba(242,193,78,0.7)'" onmouseleave="this.style.textShadow='none'">$1</span>`
    );
  });
  return result;
}

// ─── ArticleDetailTemplate ──────────────────────────────────────────────────
/**
 * Template trang chi tiết bài viết — dùng chung cho:
 * - /tong-chi-tu-hoc/[slug]
 * - /gioi-thieu/*
 * - /dong-chay-hoang-phap/[slug]
 *
 * Layout: Hero Banner → Breadcrumb → Drop Cap Content → Video → Tìm Hiểu Thêm
 */
const ArticleDetailTemplate: FC<ArticleDetailTemplateProps> = ({
  title,
  subtitle,
  heroBannerUrl,
  contentHtml,
  keywords = [],
  videoBlock,
  relatedArticles = [],
  breadcrumb = [],
}) => {
  const [activePopup, setActivePopup] = useState<KeywordPopup | null>(null);

  // Handler click keyword trong nội dung
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('keyword-highlight')) {
      const kwName = target.getAttribute('data-keyword');
      const kw = keywords.find((k) => k.keyword === kwName);
      if (kw) setActivePopup(kw);
    }
  };

  const processedHtml = injectKeywords(contentHtml, keywords);

  return (
    <article className="min-h-screen" style={{ background: '#2c1c11', color: '#e3d2c1' }}>

      {/* ── 1. HERO BANNER ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: 'clamp(300px, 55vh, 580px)' }}
      >
        <img
          src={heroBannerUrl || 'https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1440&h=600&fit=crop'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(44,28,17,0.45) 0%, rgba(44,28,17,0.25) 40%, rgba(44,28,17,0.92) 100%)',
          }}
        />
        {/* Title overlay trên banner */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-10 md:pb-14">
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <nav className="flex items-center gap-2 mb-3 flex-wrap" aria-label="Breadcrumb">
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span style={{ color: 'rgba(242,193,78,0.5)' }}>›</span>}
                  <Link
                    href={crumb.href}
                    className="font-inter text-xs uppercase tracking-widest transition-colors hover:text-[#F2C14E]"
                    style={{ color: i === breadcrumb.length - 1 ? '#F2C14E' : '#c9b896' }}
                  >
                    {crumb.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}
          <h1
            className="text-3xl md:text-5xl font-bold leading-tight"
            style={{
              fontFamily: "'UTM ClassizismAntiqua', 'Playfair Display', serif",
              color: '#F2C14E',
              textShadow: '0 0 32px rgba(242,193,78,0.4), 0 4px 20px rgba(0,0,0,0.6)',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-3 text-base md:text-lg"
              style={{
                fontFamily: "'UTM Avo', 'Noto Serif', serif",
                color: '#e3d2c1',
                opacity: 0.85,
                maxWidth: '700px',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── 2. NỘI DUNG BÀI VIẾT ── */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-14">
        {/* Drop Cap styling via CSS */}
        <style>{`
          .article-content > p:first-of-type::first-letter {
            font-size: 4.5rem;
            font-weight: 900;
            float: left;
            line-height: 0.75;
            margin-right: 0.12em;
            margin-top: 0.05em;
            color: #F2C14E;
            font-family: 'UTM ClassizismAntiqua', 'Playfair Display', serif;
            text-shadow: 0 0 20px rgba(242,193,78,0.5);
          }
          .article-content p {
            margin-bottom: 1.25em;
            line-height: 1.85;
            font-family: 'UTM Avo', 'Noto Serif', serif;
            color: #e3d2c1;
          }
          .article-content h2, .article-content h3 {
            font-family: 'UTM ClassizismAntiqua', 'Playfair Display', serif;
            color: #F2C14E;
            margin: 2em 0 0.75em;
          }
          .article-content h2 { font-size: 1.6rem; }
          .article-content h3 { font-size: 1.3rem; }
          .article-content blockquote {
            border-left: 3px solid rgba(242,193,78,0.6);
            padding-left: 1.5em;
            margin: 1.5em 0;
            font-style: italic;
            color: #c9b896;
          }
          .article-content img {
            width: 100%;
            border-radius: 0.75rem;
            margin: 1.5em 0;
          }
          .article-content figcaption, .article-content .wp-caption-text {
            font-family: 'UTM Avo', 'Noto Serif', serif;
            font-style: italic;
            font-size: 0.8rem;
            color: #8B6F47;
            text-align: center;
            margin-top: -0.75em;
            margin-bottom: 1em;
          }
        `}</style>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: processedHtml || '<p>Nội dung đang được cập nhật...</p>' }}
          onClick={handleContentClick}
        />
      </div>

      {/* ── 3. KHỐI VIDEO MINH HỌA ── */}
      {videoBlock?.videoUrl && (
        <div
          className="max-w-4xl mx-auto px-6 md:px-10 pb-14"
        >
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: 'rgba(242,193,78,0.25)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
            }}
          >
            {videoBlock.title && (
              <div
                className="px-6 py-4 border-b flex items-center gap-3"
                style={{
                  borderColor: 'rgba(242,193,78,0.15)',
                  background: 'rgba(74,55,40,0.5)',
                }}
              >
                <span className="text-xl">▶</span>
                <div>
                  <h3
                    className="font-bold text-base"
                    style={{ color: '#F2C14E', fontFamily: "'UTM ClassizismAntiqua', serif" }}
                  >
                    {videoBlock.title}
                  </h3>
                  {videoBlock.description && (
                    <p className="text-xs mt-0.5" style={{ color: '#c9b896', fontFamily: "'UTM Avo', sans-serif" }}>
                      {videoBlock.description}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={videoBlock.videoUrl}
                title={videoBlock.title || 'Video minh họa'}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 4. TÌM HIỂU THÊM ── */}
      {relatedArticles.length > 0 && (
        <div
          className="px-6 md:px-10 py-14 border-t"
          style={{
            background: 'rgba(26,15,8,0.6)',
            borderColor: 'rgba(242,193,78,0.12)',
          }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Section heading */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1" style={{ background: 'rgba(242,193,78,0.3)' }} />
              <h2
                className="text-lg font-bold uppercase tracking-widest whitespace-nowrap"
                style={{
                  color: '#F2C14E',
                  fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                  textShadow: '0 0 20px rgba(242,193,78,0.4)',
                }}
              >
                ✦ Tìm Hiểu Thêm
              </h2>
              <div className="h-px flex-1" style={{ background: 'rgba(242,193,78,0.3)' }} />
            </div>

            {/* 3-card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedArticles.slice(0, 3).map((art, i) => (
                <Link
                  key={i}
                  href={art.url}
                  className="group rounded-xl overflow-hidden border transition-all duration-300 hover:border-[#F2C14E] hover:-translate-y-1 hover:shadow-xl block"
                  style={{
                    borderColor: 'rgba(242,193,78,0.2)',
                    background: 'linear-gradient(145deg, rgba(74,55,40,0.7), rgba(26,15,8,0.9))',
                  }}
                >
                  {art.imgUrl && (
                    <div className="overflow-hidden" style={{ height: 140 }}>
                      <img
                        src={art.imgUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold block mb-1"
                      style={{ color: '#F2C14E', fontFamily: "'UTM Avo', sans-serif", fontWeight: 'bold' }}
                    >
                      {art.category}
                    </span>
                    <h4
                      className="text-sm font-semibold leading-snug group-hover:text-[#F2C14E] transition-colors"
                      style={{
                        color: '#e3d2c1',
                        fontFamily: "'UTM Avo', 'Noto Serif', serif",
                      }}
                    >
                      {art.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Keyword Tooltip Modal ── */}
      <KeywordTooltipModal popup={activePopup} onClose={() => setActivePopup(null)} />
    </article>
  );
};

export default ArticleDetailTemplate;
