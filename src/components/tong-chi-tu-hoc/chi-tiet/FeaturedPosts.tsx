'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PropsBaiVietNoiBat {
  heroBanner?: string;
  featuredArticle?: {
    label?: string;
    title?: string;
    author?: string;
    bgImage?: string;
    linkUrl?: string;
  };
}

export function FeaturedPosts({ heroBanner, featuredArticle }: PropsBaiVietNoiBat) {
  const bgImageSrc = featuredArticle?.bgImage || heroBanner || 'https://tunglam.mocwp.com/wp-content/uploads/2026/07/bg-chua.jpg';

  return (
    <section id="bai-viet-noibat" className="scroll-mt-24 py-12 relative w-full">
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[380px] sm:min-h-[460px] flex items-center justify-center text-center p-6 sm:p-12 border-y border-[#c8aa6e]/40 overflow-hidden bg-[#120a06] group">

        {/* TỐI ƯU HÓA: Dùng thẻ img với fallback onError mượt mà, không bị crash nếu ảnh WordPress lỗi */}
        <div className="absolute inset-0 opacity-40 scale-105 transition-transform duration-1000 ease-out group-hover:scale-100">
          <img
            src={bgImageSrc}
            alt={featuredArticle?.title || 'Bài viết nổi bật'}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
            }}
          />
        </div>

        {/* Các lớp phủ Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c1c11]/90 via-[#120a06]/70 to-[#2c1c11]/90" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 w-full max-w-3xl mx-auto space-y-3 sm:space-y-4 px-4">
          <span
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-2xl sm:text-3xl font-normal text-[#e3d2c1] block tracking-wide opacity-90"
          >
            {featuredArticle?.label || 'Bài viết'}
          </span>

          <h2
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-4xl sm:text-6xl lg:text-7xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_2px_20px_rgba(255,222,89,0.7)] py-1"
          >
            {featuredArticle?.title || 'CÔNG HẠNH CỦA SƯ TỔ'}
          </h2>

          <p
            style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
            className="text-base sm:text-xl font-normal text-[#f2cc8f] tracking-widest uppercase py-0.5"
          >
            {featuredArticle?.author || 'VÔ TRÍ - TÂM HÒA'}
          </p>

          <div className="pt-4 sm:pt-6">
            {/* TỐI ƯU HÓA: Thay thẻ <a> bằng <Link> để chuyển trang không bị reload */}
            <Link
              href={featuredArticle?.linkUrl || '#'}
              style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
              className="inline-flex items-center justify-center border border-[#c8aa6e]/80 bg-[#2a1a0e]/90 hover:bg-[#ffde59] text-[#ffde59] hover:text-[#2c1c11] font-normal px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-2xl group/btn uppercase text-sm sm:text-base tracking-wider backdrop-blur-xs"
            >
              ĐỌC BÀI VIẾT
              <span className="ml-2 group-hover/btn:translate-x-1.5 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
