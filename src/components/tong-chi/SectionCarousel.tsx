'use client';

import React, { useRef } from 'react';
<<<<<<< HEAD
import Link from 'next/link';
import { SectionData } from '@/types/tong-chi';

// 🟢 Bổ sung prop dynamicBgImage để nhận ảnh nền động từ API Taxonomy
interface SectionCarouselProps {
  section: SectionData;
  dynamicBgImage?: string;
}

export function SectionCarousel({ section, dynamicBgImage }: SectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🔴 Ưu tiên 1: Ảnh động từ WP Taxonomy -> Ưu tiên 2: bgImage của Section -> Ưu tiên 3: bgWatermark
  const bgImage = dynamicBgImage || section.bgImage || section.bgWatermark || '';
=======
import Link from 'next/link'; // 🟢 Đã import Link từ next/link
import { SectionData } from '@/types/tong-chi';

export function SectionCarousel({ section }: { section: SectionData }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lấy ảnh background cho mỗi phần (Ưu tiên bgImage -> bgWatermark)
  const bgImage = section.bgImage || section.bgWatermark || '';
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06

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
<<<<<<< HEAD
      
      {/* 🔴 HIỆU ỨNG NỀN: NẾU CÓ BGIMAGE THÌ HIỂN THỊ HÒA TRỘN MỜ ẢO SANG TRỌNG */}
=======
      {/* HIỆU ỨNG NỀN GỐC CỦA BẠN - GIỮ NGUYÊN 100% */}
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-luminosity [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      )}

<<<<<<< HEAD
      {/* HEADER SECTION */}
=======
      {/* HEADER SECTION - GIỮ NGUYÊN 100% */}
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
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
            className="w-8 h-8 rounded bg-[#382417] border border-[#593b26] hover:border-[#f2cc8f] text-[#f2cc8f] flex items-center justify-center transition-all cursor-pointer"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded bg-[#382417] border border-[#593b26] hover:border-[#f2cc8f] text-[#f2cc8f] flex items-center justify-center transition-all cursor-pointer"
          >
            →
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
<<<<<<< HEAD
=======
            /* 🟢 CHỖ THAY ĐỔI: Đã đổi thẻ <a> thành <Link> */
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
            <Link
              key={card.id}
              href={card.link || '#'}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="group relative flex-none w-[280px] md:w-[310px] h-[380px] rounded-xl overflow-hidden cursor-pointer border border-[#593b26] hover:border-[#f2cc8f] transition-all duration-500 hover:shadow-[0_0_30px_rgba(242,204,143,0.4)] hover:-translate-y-1.5 snap-start block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${card.imageUrl}')` }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f08] via-[#1a0f08]/60 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f2cc8f]/80 rounded-xl transition-all pointer-events-none" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-left z-10">
                <h3
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-lg md:text-xl text-[#ffffff] font-bold group-hover:text-[#ffde59] transition-colors leading-snug"
                >
                  {card.title}
                </h3>

                {card.subtitle && (
                  <p
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-xs font-normal text-[#e3d2c1] mt-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-24 transition-all duration-500 ease-in-out line-clamp-3 leading-relaxed"
                  >
                    {card.subtitle}
                  </p>
                )}
              </div>
<<<<<<< HEAD
            </Link>
=======
            </Link> /* 🟢 CHỖ THAY ĐỔI: Đã đổi </a> thành </Link> */
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
          );
        })}
      </div>
    </section>
  );
}