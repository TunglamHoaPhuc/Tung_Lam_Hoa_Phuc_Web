'use client';

import { FC, useRef } from 'react';
import Image from 'next/image';
import { SectionData } from '@/types/tong-chi-tu-hoc';

interface SectionBlockProps {
  section: SectionData;
}

const SectionBlock: FC<SectionBlockProps> = ({ section }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id={section.id} className="scroll-mt-36 md:scroll-mt-40 space-y-6 relative rounded-2xl p-6 overflow-hidden">
      {/* Background Watermark mờ */}
      {section.bgWatermark && (
        <div className="absolute inset-0 pointer-events-none mix-blend-luminosity [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] opacity-30">
          <Image
            src={section.bgWatermark}
            alt="watermark"
            fill
            className="object-cover object-center"
            loading="lazy"
            unoptimized
          />
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-[#523622] pb-3 relative z-10 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h2
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="text-3xl md:text-5xl text-[#ffde59] uppercase font-bold tracking-wider drop-shadow-[0_0_10px_rgba(255,222,89,0.5)]"
          >
            {section.title}
          </h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-[#ffde59]/60 via-[#ffde59]/20 to-transparent hidden sm:block" />
        </div>

        {/* Nút điều hướng Carousel */}
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
        {section.cards.map((card) => (
          <a
            key={card.id}
            href={card.link || '#'}
            target={card.link ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="group relative flex-none w-[280px] md:w-[310px] h-[380px] rounded-xl overflow-hidden cursor-pointer border border-[#593b26] hover:border-[#f2cc8f] transition-all duration-500 hover:shadow-[0_0_30px_rgba(242,204,143,0.4)] hover:-translate-y-1.5 snap-start block"
          >
            <Image
              src={card.imageUrl}
              alt={card.title}
              fill
              loading="lazy"
              unoptimized
              sizes="(max-width: 768px) 280px, 310px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
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
          </a>
        ))}
      </div>
    </section>
  );
};

export default SectionBlock;
