'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionData } from '@/types/tong-chi-tu-hoc';
import { getImageUrl } from '@/utils/image';

interface SectionCarouselProps {
  section: SectionData;
  dynamicBgImage?: string;
}

export function SectionCarousel({ section, dynamicBgImage }: SectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Ưu tiên 1: Ảnh động từ WP Taxonomy -> Ưu tiên 2: bgImage của Section -> Ưu tiên 3: bgWatermark
  const bgImage = getImageUrl(dynamicBgImage || section.bgImage || section.bgWatermark || '');

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollability();
    const t1 = setTimeout(checkScrollability, 150);
    const t2 = setTimeout(checkScrollability, 600);
    window.addEventListener('resize', checkScrollability);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [section.cards, checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
      setTimeout(checkScrollability, 350);
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

      {/* SLIDER CARDS WRAPPER VỚI HIỆU ỨNG GRADIENT MỀM MẠI */}
      <div className="relative group/carousel">
        {/* Gradient mờ viền phải làm dịu các slide đang chờ tiếp theo */}
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-4 w-28 sm:w-44 md:w-64 bg-gradient-to-l from-[#2c1c11] via-[#2c1c11]/85 to-transparent z-20 transition-opacity duration-300 rounded-r-xl ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Gradient mờ viền trái khi đã cuộn */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-4 w-16 sm:w-28 md:w-40 bg-gradient-to-r from-[#2c1c11] via-[#2c1c11]/85 to-transparent z-20 transition-opacity duration-300 rounded-l-xl ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          ref={scrollRef}
          onScroll={checkScrollability}
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
                src={getImageUrl(card.imageUrl) || 'https://admin.tunglamhoaphuc.com/wp-content/uploads/2026/07/default-bg.jpg'}
                alt={card.title}
                fill
                loading="lazy"
                unoptimized
                sizes="(max-width: 768px) 280px, 310px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 transform-gpu"
                style={{ objectPosition: (card as any).thumbnailPosition || (card as any).imagePosition || 'center 20%' }}
              />

              {/* Gradient màu nâu đậm đồng màu với nền trang, đổ đậm chân ảnh để tôn chữ trắng sáng chuẩn theo mẫu */}
              <div
                className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none transition-all duration-300 group-hover:h-[56%]"
                style={{
                  background: 'linear-gradient(to top, rgba(35, 21, 12, 0.98) 0%, rgba(35, 21, 12, 0.85) 30%, rgba(35, 21, 12, 0.42) 65%, transparent 100%)',
                }}
              />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f2cc8f]/70 rounded-xl transition-colors duration-300 pointer-events-none" />

              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-left z-10">
                {/* Sub tiêu đề: Ở trên tiêu đề, chữ thường, bold nhẹ, nghiêng */}
                {card.subtitle && (
                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs sm:text-[13px] font-medium italic normal-case text-[#E5A93C] line-clamp-1 leading-normal tracking-wide mb-1"
                  >
                    {card.subtitle}
                  </p>
                )}

                {/* Tiêu đề bài viết: BẮT BUỘC BOLD & VIẾT IN HOA TOÀN BỘ */}
                <h3
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-base md:text-[17px] uppercase font-bold text-[#FFE5A3] group-hover:text-[#FFDE59] transition-all duration-300 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] transform-gpu tracking-wide line-clamp-2"
                >
                  {card.title}
                </h3>
              </div>
            </Link>
          );
        })}
        </div>
      </div>
    </section>
  );
}