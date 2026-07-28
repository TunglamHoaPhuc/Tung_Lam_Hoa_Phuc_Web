'use client';

import React from 'react';

interface HeroBannerProps {
  bannerUrl?: string;
  bgImage?: string; // Nhận thêm prop này để không bị mismatch dữ liệu
  title?: string;
  subtitle?: string;
}

export function HeroBanner({
  bannerUrl,
  bgImage,
  title = 'TÔNG CHỈ TU HỌC',
  subtitle = 'TÙNG LÂM HÒA PHÚC',
}: HeroBannerProps) {
  // Lấy URL ảnh banner từ WP hoặc prop
  const finalBannerUrl = bannerUrl || bgImage || '';

  return (
    <section
      id="tong-chi"
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-6 flex flex-col items-center overflow-x-hidden"
    >
      <div className="relative w-full h-[50vh] min-h-[380px] md:h-[60vh] overflow-hidden flex items-end justify-center bg-[#2c1c11]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
          style={{ backgroundImage: `url('${finalBannerUrl}')` }}
        />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#2c1c11] via-[#2c1c11]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#2c1c11] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#2c1c11] to-transparent z-10 pointer-events-none" />

        <div className="relative z-20 pb-4 w-full flex flex-col items-center text-center px-4">
          {/* Tiêu đề chính động */}
          <h1
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="text-6xl md:text-9xl text-[#ffde59] tracking-normal uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
          >
            {title}
          </h1>

          {/* Đường kẻ trang trí hoa văn */}
          <div className="relative w-full max-w-2xl flex items-center justify-center my-1">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/80 to-transparent" />
            <div className="absolute text-[#f2cc8f] text-[10px] bg-[#2c1c11] px-1 border border-[#f2cc8f]/50 rotate-45 w-2.5 h-2.5 flex items-center justify-center" />
          </div>
        </div>
      </div>

      {/* Subtitle / Tiêu đề phụ động */}
      {subtitle && (
        <p
          style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
          className="text-base md:text-2xl tracking-[0.2em] text-[#ffde59] uppercase opacity-95 mt-4"
        >
          {subtitle}
        </p>
      )}
    </section>
  );
}

export default HeroBanner;