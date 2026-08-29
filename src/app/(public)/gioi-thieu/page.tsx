'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { Scroll, Landmark, User, HeartHandshake, BookOpen, Compass, ArrowRight } from 'lucide-react';

const INTRO_TOPICS = [
  {
    id: 'lich-su',
    title: 'Lịch Sử Tùng Lâm Hòa Phúc',
    subtitle: 'Nguồn gốc hình thành, các giai đoạn trùng tu và phát triển chốn thiền môn.',
    href: '/gioi-thieu/lich-su-tung-lam-hoa-phuc',
    icon: Landmark,
    image: '/images/toan-canh-chua.jpg',
    tag: 'Lịch Sử Bổn Tự',
  },
  {
    id: 'dai-su-lien-dang',
    title: 'Đại Sư Liên Đăng',
    subtitle: 'Hành trạng và công hạnh của Đại sư Liên Đăng truyền thừa chánh pháp.',
    href: '/gioi-thieu/dai-su-lien-dang',
    icon: User,
    image: '/images/anh-tho-cac-vi-cao-tang/1.jpg',
    tag: 'Bậc Tiền Bối',
  },
  {
    id: 'su-ong-hoang-phap',
    title: 'Sư Ông Hoằng Pháp',
    subtitle: 'Ân đức giáo dưỡng và dấu ấn hoằng truyền Tịnh độ của Sư ông.',
    href: '/gioi-thieu/su-ong-hoang-phap',
    icon: Scroll,
    image: '/images/anh-tho-cac-vi-cao-tang/2.jpg',
    tag: 'Ân Sư Giáo Dưỡng',
  },
  {
    id: 'su-phu-tru-tri',
    title: 'Sư Phụ Trụ Trì',
    subtitle: 'Thầy Thích Tâm Hòa - Người kiến thiết và lãnh đạo đạo tràng Tùng Lâm Hòa Phúc.',
    href: '/gioi-thieu/su-phu-tru-tri',
    icon: User,
    image: '/images/trang-chu/Pháp hội niệm Phật.jpg',
    tag: 'Trụ Trì Bổn Tự',
  },
  {
    id: 'tieu-su-su-to',
    title: 'Tiểu Sử Sư Tổ',
    subtitle: 'Tôn vinh cuộc đời tu tập và đạo nghiệp của chư vị Tổ Sư khai sơn.',
    href: '/gioi-thieu/tieu-su-su-to',
    icon: BookOpen,
    image: '/images/anh-tho-cac-vi-cao-tang/2 (1).jpg',
    tag: 'Khai Sơn Truyền Thừa',
  },
  {
    id: 'van-hoa-ung-xu',
    title: 'Văn Hóa Ứng Xử Thiền Môn',
    subtitle: 'Quy củ, oai nghi tế hạnh và nếp sống đạo đức dành cho Phật tử viếng chùa.',
    href: '/gioi-thieu/van-hoa-ung-xu',
    icon: HeartHandshake,
    image: '/images/trang-chu/cộng tu/1.jpg',
    tag: 'Thanh Quy Tự Viện',
  },
];

export default function GioiThieuOverviewPage() {
  return (
    <div className="min-h-screen bg-[#2A1D14] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black flex flex-col justify-between">
      <main className="flex-1 pb-16">
        {/* ── HERO BANNER TOP ── */}
        <div className="relative w-full overflow-hidden bg-[#2A1D14] pt-28 pb-12">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px] pointer-events-none"
            style={{
              backgroundImage: "url('/images/toan-canh-chua.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A1D14]/40 via-[#2A1D14]/80 to-[#2A1D14] pointer-events-none" />

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#3a2718] border border-[#f2cc8f]/40 flex items-center justify-center text-[#ffde59] mb-3 shadow-md">
              <span className="text-2xl">☸</span>
            </div>

            <div className="flex items-center justify-center w-full my-4 gap-4 md:gap-8">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
              <h1
                style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                className="text-5xl sm:text-6xl md:text-7xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(242,193,78,0.7)] whitespace-nowrap flex-shrink-0"
              >
                GIỚI THIỆU TÙNG LÂM HÒA PHÚC
              </h1>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/50 to-[#F2C14E]" />
            </div>

            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-wide font-normal max-w-2xl mx-auto px-4 leading-relaxed text-balance text-center"
            >
              Chốn già lam thanh tịnh – Nơi hội tụ truyền thống truyền thừa, tâm nguyện độ sanh và tinh hoa văn hóa Phật giáo Việt Nam.
            </p>
          </div>
        </div>

        {/* ── 6 TOPICS GRID ── */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {INTRO_TOPICS.map((topic) => {
              const IconComp = topic.icon;
              return (
                <Link
                  key={topic.id}
                  href={topic.href}
                  className="group relative rounded-2xl overflow-hidden border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl flex flex-col hover:-translate-y-1.5 transform-gpu"
                >
                  {/* Thumbnail frame */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#1A120B]">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to top, rgba(37,23,14,0.95) 0%, rgba(37,23,14,0.3) 60%, transparent 100%)',
                      }}
                    />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full border border-[#F2C14E]/60 bg-[#2C1C11]/90 text-[#F2C14E] text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1.5">
                      <IconComp className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>{topic.tag}</span>
                    </div>
                  </div>

                  {/* Golden divider */}
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/40 to-transparent" />

                  {/* Body content */}
                  <div className="p-5 flex flex-col justify-between flex-1 bg-gradient-to-b from-[#25170E] to-[#1C130D]">
                    <div>
                      <h3
                        className="text-2xl md:text-3xl font-normal text-[#F2C14E] uppercase group-hover:text-white transition-colors duration-300 leading-tight mb-2"
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                      >
                        {topic.title}
                      </h3>
                      <p
                        className="text-xs sm:text-sm text-[#e3d2c1]/80 leading-relaxed line-clamp-3"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {topic.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F2C14E]/20 flex items-center justify-between text-xs font-bold text-[#F2C14E] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                      <span>XEM CHI TIẾT</span>
                      <ArrowRight className="w-4 h-4 text-[#F2C14E]" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Smart Search AI Bar */}
          <div className="mt-16 mb-12">
            <SmartSearchAIBar contextTitle="Tra cứu Giới thiệu Tùng Lâm Hòa Phúc" />
          </div>
        </div>
      </main>
    </div>
  );
}
