'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import NextLink from 'next/link';
import { ArrowLeft, Play, ArrowRight, Video, BookOpen, Sparkles } from 'lucide-react';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { STATUE_LIST, StatueItem } from '@/data/statue-data';
import { StatueDetailCoreLayout } from '@/features/statues/components/StatueDetailCoreLayout';
import { BuddhistArtGallery } from '@/features/statues/components/BuddhistArtGallery';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';

export default function StatueDetailPage() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = typeof rawSlug === 'string' ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : '';

  // Find statue strictly by slug or id
  const statue = STATUE_LIST.find((s) => s.slug === slug || s.id.toLowerCase() === slug.toLowerCase());
  if (!statue) {
    notFound();
  }

  const relatedStatues = STATUE_LIST.filter((s) => s.id !== statue.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black">
      <Header scrolled={true} />

      {/* ── 1. HERO BANNER BẢO TƯỢNG ── */}
      <div
        className="relative overflow-hidden flex flex-col justify-end"
        style={{ height: 'clamp(340px, 55vh, 580px)' }}
      >
        <img
          src={statue.imgUrl}
          alt={statue.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(42,29,20,0.5) 0%, rgba(42,29,20,0.3) 40%, rgba(42,29,20,0.95) 100%)',
          }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-16 pb-12 w-full text-center md:text-left">
          <NextLink
            href="/bao-tuong-phat-giao"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#F2C14E] mb-4 hover:underline"
            style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: 'bold' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trở về Danh Sách Bảo Tượng</span>
          </NextLink>

          <h1
            className="text-4xl md:text-6xl font-bold uppercase leading-none text-[#F2C14E]"
            style={{
              fontFamily: "'UTM Niagara', 'Playfair Display', serif",
              textShadow: '0 0 32px rgba(242,193,78,0.6), 0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            {statue.name}
          </h1>

          <p
            className="mt-2 text-base md:text-xl text-[#e3d2c1] uppercase tracking-widest"
            style={{
              fontFamily: "'UTM ClassizismAntiqua', 'Playfair Display', serif",
            }}
          >
            {statue.titleName}
          </p>
        </div>
      </div>

      {/* ── 2. BỐ CỤC NÒNG CỐT 3 CỘT ── */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-10">
        <StatueDetailCoreLayout statue={statue} />

        {/* ── 3. KHỐI VIDEO MINH HỌA & BÀI VIẾT NỔI BẬT ── */}
        <div className="my-16 space-y-12">
          {/* Section Video Minh Họa */}
          {statue.video && (
            <div>
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-10 h-10 rounded-full border flex items-center justify-center mb-2" style={{ background: 'rgba(242,193,78,0.15)', borderColor: '#F2C14E', color: '#F2C14E' }}>
                  <Video className="w-5 h-5 animate-pulse" />
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-[#F2C14E]"
                  style={{
                    fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                    textShadow: '0 0 24px rgba(242,193,78,0.5)',
                  }}
                >
                  VIDEO MINH HỌA
                </h2>
              </div>

              <div
                className="rounded-2xl overflow-hidden border grid grid-cols-1 md:grid-cols-12 gap-0 max-w-4xl mx-auto"
                style={{
                  background: 'linear-gradient(160deg, rgba(74,55,40,0.85) 0%, rgba(26,15,8,0.95) 100%)',
                  borderColor: 'rgba(242,193,78,0.4)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                {/* Thumbnail bên trái với Play button tròn */}
                <div className="md:col-span-6 relative group overflow-hidden" style={{ minHeight: 240 }}>
                  <img
                    src={statue.video.thumbnailUrl}
                    alt={statue.video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.35)' }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: '#F2C14E',
                        borderColor: '#ffffff',
                        boxShadow: '0 0 28px rgba(242,193,78,0.7)',
                      }}
                    >
                      <Play className="w-7 h-7 text-[#2A1D14] ml-0.5 fill-[#2A1D14]" />
                    </div>
                  </div>
                </div>

                {/* Tiêu đề UTM Niagara & Nội dung bên phải */}
                <div className="md:col-span-6 p-6 flex flex-col justify-center">
                  <h3
                    className="text-2xl md:text-3xl font-bold uppercase leading-snug text-[#F2C14E] mb-3"
                    style={{
                      fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                      textShadow: '0 0 16px rgba(242,193,78,0.4)',
                    }}
                  >
                    {statue.video.title}
                  </h3>

                  <div className="h-0.5 w-12 mb-3" style={{ background: '#F2C14E' }} />

                  <p className="text-xs text-[#c9b896] leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {statue.video.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section Bài Viết Nổi Bật Banner lớn đè nền */}
          {statue.article && (
            <div
              className="relative rounded-2xl overflow-hidden border p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl flex flex-col items-center justify-center"
              style={{
                borderColor: 'rgba(242,193,78,0.4)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                minHeight: 280,
              }}
            >
              <img src={statue.article.bannerUrl} alt={statue.article.title} className="absolute inset-0 w-full h-full object-cover opacity-35" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,15,8,0.92) 0%, rgba(42,29,20,0.85) 100%)' }} />

              <div className="relative z-10 flex flex-col items-center gap-3">
                <span className="text-xs uppercase font-bold tracking-widest text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                  Bài viết
                </span>

                <h2
                  className="text-3xl md:text-5xl font-bold uppercase text-[#F2C14E] tracking-wider"
                  style={{
                    fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                    textShadow: '0 0 32px rgba(242,193,78,0.6)',
                  }}
                >
                  {statue.article.title}
                </h2>

                <h4 className="text-sm uppercase font-bold text-[#c9b896] tracking-widest" style={{ fontFamily: "'UTM Niagara', serif" }}>
                  {statue.article.author}
                </h4>

                <NextLink
                  href={statue.article.url}
                  className="mt-4 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #8B6914 0%, #5C4630 100%)',
                    border: '1.5px solid #F2C14E',
                    color: '#ffffff',
                    fontFamily: "'UTM Avo', sans-serif",
                    fontWeight: 'bold',
                    boxShadow: '0 0 20px rgba(242,193,78,0.3)',
                  }}
                >
                  <span>ĐỌC BÀI VIẾT</span>
                  <ArrowRight className="w-4 h-4" />
                </NextLink>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. KHỐI NGHỆ THUẬT PHẬT GIÁO GALLERY ── */}
        <BuddhistArtGallery variations={statue.artVariations || []} />

        {/* ── Smart Search AI Bar ── */}
        <SmartSearchAIBar contextTitle={`Tôn Tượng ${statue.name}`} />

        {/* ── 5. KHỐI BẢO TƯỢNG LIÊN QUAN (PRE-FOOTER) ── */}
        <div className="my-16 border-t pt-12" style={{ borderColor: 'rgba(242,193,78,0.2)' }}>
          <div className="text-center mb-8">
            <h2
              className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-[#F2C14E]"
              style={{
                fontFamily: "'UTM Niagara', 'Playfair Display', serif",
                textShadow: '0 0 20px rgba(242,193,78,0.4)',
              }}
            >
              BẢO TƯỢNG LIÊN QUAN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {relatedStatues.slice(0, 2).map((rel) => (
              <NextLink
                key={rel.id}
                href={`/bao-tuong-phat-giao/${rel.slug}`}
                className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:border-[#F2C14E] hover:-translate-y-1 hover:shadow-xl flex flex-col"
                style={{
                  borderColor: 'rgba(242,193,78,0.25)',
                  background: 'linear-gradient(145deg, rgba(74,55,40,0.7), rgba(26,15,8,0.9))',
                }}
              >
                <div className="overflow-hidden relative" style={{ height: 200 }}>
                  <img
                    src={rel.imgUrl}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold text-[#F2C14E]"
                      style={{
                        background: 'rgba(26,15,8,0.85)',
                        border: '1px solid rgba(242,193,78,0.4)',
                        fontFamily: "'UTM Avo', sans-serif",
                        fontWeight: 'bold',
                      }}
                    >
                      {rel.assemblyName}
                    </span>
                  </div>
                </div>

                <div className="p-4 text-center flex-1 flex flex-col justify-between" style={{ background: 'rgba(42,29,20,0.6)' }}>
                  <div>
                    <h3
                      className="text-xl font-bold uppercase leading-snug text-[#F2C14E] group-hover:text-white transition-colors mb-1"
                      style={{ fontFamily: "'UTM Niagara', 'Playfair Display', serif" }}
                    >
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[#c9b896] uppercase" style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}>
                      {rel.areaName}
                    </p>
                  </div>
                </div>
              </NextLink>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
