'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionData } from '@/types/tong-chi-tu-hoc';

interface SectionCarouselProps {
  section: SectionData;
  dynamicBgImage?: string;
}

export function SectionCarousel({ section, dynamicBgImage }: SectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ưu tiên 1: Ảnh động từ WP Taxonomy -> Ưu tiên 2: bgImage của Section -> Ưu tiên 3: bgWatermark
  const bgImage = dynamicBgImage || section.bgImage || section.bgWatermark || '';

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id={section.id} className="scroll-mt-24 space-y-6 relative rounded-2xl p-6 overflow-hidden">
      {/* HIỆU ỨNG NỀN MỜ SANG TRỌNG */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-luminosity [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      )}

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-[#523622] pb-3 relative z-10 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h2
            style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
            className="text-2xl md:text-3xl text-[#ffde59] tracking-wider uppercase whitespace-nowrap"
          >
            {section.title}
          </h2>

          <div className="flex-1 flex items-center gap-2">
            <div className="h-[1.5px] w-full bg-gradient-to-r from-[#f2cc8f] via-[#f2cc8f]/50 to-transparent" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#f2cc8f] bg-[#2c1c11] flex-shrink-0 shadow-[0_0_6px_rgba(242,204,143,0.5)]" />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-lg bg-[#382417] border border-[#593b26] hover:border-[#f2cc8f] text-[#f2cc8f] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
            title="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-lg bg-[#382417] border border-[#593b26] hover:border-[#f2cc8f] text-[#f2cc8f] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
            title="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SLIDER CARDS */}
      <div
        ref={scrollRef}
        className="flex items-center gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scroll-smooth relative z-10 no-scrollbar"
      >
        {section.cards.map((card) => {
          const isExternal = card.link?.startsWith('http');

          return (
            <Link
              key={card.id}
              href={card.link || '#'}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="group relative flex-none w-[280px] md:w-[310px] h-[380px] rounded-xl overflow-hidden cursor-pointer border border-[#593b26] hover:border-[#f2cc8f] transition-all duration-300 ease-out hover:shadow-[0_0_30px_rgba(242,204,143,0.4)] hover:-translate-y-1.5 snap-start block transform-gpu"
            >
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                loading="lazy"
                unoptimized
                sizes="(max-width: 768px) 280px, 310px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 transform-gpu"
                style={{ objectPosition: (card as any).imagePosition || 'center center' }}
              />

              {/* Gradient màu nâu đậm đồng màu với nền trang, đổ đậm chân ảnh để tôn chữ trắng sáng chuẩn theo mẫu */}
              <div
                className="absolute inset-x-0 bottom-0 h-[42%] pointer-events-none transition-all duration-300 group-hover:h-[52%]"
                style={{
                  background: 'linear-gradient(to top, rgba(35, 21, 12, 0.98) 0%, rgba(35, 21, 12, 0.85) 30%, rgba(35, 21, 12, 0.42) 65%, transparent 100%)',
                }}
              />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f2cc8f]/70 rounded-xl transition-colors duration-300 pointer-events-none" />

              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-left z-10">
                {/* Tiêu đề in hoa thường, khi đưa chuột vào mới bold */}
                <h3
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-base md:text-[17px] uppercase font-normal text-[#ffffff] group-hover:font-bold group-hover:text-[#FFE5A3] transition-all duration-300 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] transform-gpu group-hover:-translate-y-0.5 tracking-wide"
                >
                  {card.title}
                </h3>

                {/* Sub tiêu đề chỉ hiện ra khi rê chuột vào */}
                {card.subtitle && (
                  <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-36 group-hover:opacity-100 group-hover:mt-2 transition-all duration-300 ease-out transform-gpu translate-y-2 group-hover:translate-y-0">
                    <p
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-xs sm:text-[13px] font-normal text-[#E8D7C8]/95 line-clamp-3 leading-relaxed border-t border-[#F2C14E]/25 pt-1.5 italic"
                    >
                      {card.subtitle}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}