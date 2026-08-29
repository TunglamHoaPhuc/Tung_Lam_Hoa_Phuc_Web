'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { ArrowLeft, ArrowRight, Calendar, Sparkles, Scroll, Landmark, User, HeartHandshake, BookOpen } from 'lucide-react';
import { GioiThieuTopicDetail, GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { InfographicArticleRenderer } from '@/components/tong-chi-tu-hoc/chi-tiet/InfographicArticleRenderer';

interface Props {
  detail: GioiThieuTopicDetail;
  slug?: string;
}

export function GioiThieuDetailLayout({ detail: initialDetail, slug }: Props) {
  const [topic, setTopic] = useState<any>(initialDetail);

  const topicSlug = slug || initialDetail?.slug || initialDetail?.id;

  useEffect(() => {
    async function loadDynamicTopic() {
      if (!topicSlug) return;
      try {
        const res = await fetch(`/api/admin/gioi-thieu/${topicSlug}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.topic) {
            setTopic(json.topic);
          }
        }
      } catch (err) {
        console.log('Dynamic topic load fallback:', err);
      }
    }
    loadDynamicTopic();
  }, [topicSlug]);

  const otherTopics = Object.values(GIOI_THIEU_DETAILS).filter((t) => t.id !== topic.id && t.slug !== topic.slug);

  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black flex flex-col justify-between">
      <Header scrolled={true} />

      <main className="flex-1 pb-16 pt-20">
        {/* ── HERO BANNER TOP ── */}
        <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-12 pb-14 border-b border-[#F2C14E]/20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 blur-[2px] pointer-events-none scale-105"
            style={{
              backgroundImage: `url('${topic.heroBanner || '/images/toan-canh-chua.jpg'}')`,
              backgroundPosition: topic.heroBannerPosition || 'center 50%',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/60 via-[#2A1D14]/85 to-[#2A1D14] pointer-events-none" />

          <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 text-center flex flex-col items-center">
            {/* Back link */}
            <Link
              href="/gioi-thieu"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F2C14E]/40 bg-[#25170E]/80 text-[#F2C14E] text-xs font-bold uppercase tracking-wider hover:bg-[#F2C14E] hover:text-black transition-all mb-6 shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tất Cả Mục Giới Thiệu</span>
            </Link>

            {/* Tag badge */}
            <div className="px-3.5 py-1 rounded-full bg-[#F2C14E]/15 border border-[#F2C14E]/50 text-[#F2C14E] text-[11px] font-bold tracking-widest uppercase mb-3">
              {topic.tag || topic.groupCategoryName || 'Tùng Lâm Hòa Phúc'}
            </div>

            {/* Main title with golden decorative lines */}
            <div className="flex items-center justify-center w-full my-2 gap-3 md:gap-6">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
              <h1
                style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] text-center leading-tight max-w-3xl"
              >
                {topic.title}
              </h1>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
            </div>

            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance text-center mt-2"
            >
              {topic.subtitle}
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT CONTAINER ── */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 mt-10 space-y-12">
          {/* 1. OVERVIEW & PORTRAIT BLOCK */}
          {topic.overviewSummary && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#25170E]/80 border border-[#F2C14E]/30 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xs">
              {topic.portraitImage && (
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#F2C14E]/60 shadow-[0_0_30px_rgba(242,193,78,0.2)] aspect-[4/3] sm:aspect-[16/11] bg-[#1A120B]">
                    <img
                      src={topic.portraitImage}
                      alt={topic.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A120B]/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              )}

              <div className={`${topic.portraitImage ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col justify-center space-y-4 text-left`}>
                <div className="flex items-center gap-2 text-[#F2C14E] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Tổng Quan Khái Lược</span>
                </div>
                <p
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-sm sm:text-base text-[#e3d2c1] leading-relaxed"
                >
                  {topic.overviewSummary}
                </p>
              </div>
            </div>
          )}

          {/* 2. GOLDEN QUOTE / PHÁP NGỮ BLOCK */}
          {topic.quoteContent && topic.quoteContent.length > 0 && (
            <div className="relative rounded-2xl border border-[#F2C14E]/60 bg-gradient-to-b from-[#321F14] to-[#20140D] p-6 sm:p-10 text-center shadow-xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent" />
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#3a2718] border border-[#F2C14E]/80 flex items-center justify-center text-[#ffde59] shadow-md">
                <span className="text-xl">🪔</span>
              </div>
              <h3
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-2xl sm:text-3xl text-[#F2C14E] uppercase tracking-widest mb-4 font-normal"
              >
                {topic.quoteTitle || 'LỜI DẠY'}
              </h3>
              <div className="space-y-1.5 max-w-2xl mx-auto italic text-sm sm:text-base text-[#FFE5A3]">
                {topic.quoteContent.map((line: string, idx: number) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
              {topic.quoteAuthor && (
                <div className="mt-4 pt-3 border-t border-[#F2C14E]/20 text-xs font-bold text-[#F2C14E] uppercase tracking-widest">
                  — {topic.quoteAuthor} —
                </div>
              )}
            </div>
          )}

          {/* 3. MILESTONES TIMELINE (IF EXISTS) */}
          {topic.milestones && topic.milestones.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-center w-full my-4 gap-4">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/40 to-[#F2C14E]" />
                <h2
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-3xl sm:text-4xl text-[#ffde59] uppercase tracking-wider font-normal whitespace-nowrap"
                >
                  DẤU MỐC LỊCH SỬ &amp; CÔNG HẠNH
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/40 to-[#F2C14E]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {topic.milestones.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full bg-[#F2C14E]/15 border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold tracking-wider mb-3">
                        {m.year}
                      </div>
                      <h4 className="text-base font-bold text-white mb-2 leading-snug">
                        {m.title}
                      </h4>
                      <p className="text-xs text-[#e3d2c1]/80 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MAIN ARTICLE BODY */}
          <div className="p-6 sm:p-10 rounded-2xl border border-[#F2C14E]/30 bg-[#25170E]/60 shadow-xl space-y-6 text-sm sm:text-base leading-relaxed text-[#e3d2c1] text-left">
            <InfographicArticleRenderer
              rawContent={topic.content || topic.mainContentHtml || ''}
              title={topic.title}
              subtitle={topic.subtitle}
            />
          </div>

          {/* 5. PHOTO GALLERY (IF EXISTS) */}
          {topic.galleryImages && topic.galleryImages.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-center w-full my-4 gap-4">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/40 to-[#F2C14E]" />
                <h2
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-3xl sm:text-4xl text-[#ffde59] uppercase tracking-wider font-normal whitespace-nowrap"
                >
                  HÌNH ẢNH TƯ LIỆU THỰC TẾ
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/40 to-[#F2C14E]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topic.galleryImages.map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl overflow-hidden border border-[#F2C14E]/30 bg-[#1A120B] shadow-md"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.caption}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                        }}
                      />
                    </div>
                    <div className="p-3 bg-[#20140D] border-t border-[#F2C14E]/20 text-[11px] text-[#e3d2c1]/90 italic text-center">
                      {img.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. DISCOVER MORE TOPICS GRID */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-center w-full my-4 gap-4">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/40 to-[#F2C14E]" />
              <h2
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-3xl sm:text-4xl text-[#ffde59] uppercase tracking-wider font-normal whitespace-nowrap"
              >
                CÁC MỤC GIỚI THIỆU KHÁC
              </h2>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/40 to-[#F2C14E]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherTopics.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/gioi-thieu/${item.slug}`}
                  className="p-4 rounded-xl border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] hover:-translate-y-1 transition-all flex items-center justify-between group shadow-lg"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#F2C14E] tracking-wider">
                      {item.tag}
                    </span>
                    <h4
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                      className="text-xl text-[#F2C14E] group-hover:text-white transition-colors"
                    >
                      {item.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#F2C14E] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* 7. SMART SEARCH AI BAR */}
          <div className="pt-8">
            <SmartSearchAIBar contextTitle={`Tra cứu về ${topic.title}`} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
