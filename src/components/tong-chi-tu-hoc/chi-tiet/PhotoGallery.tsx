'use client';

import React from 'react';
import Image from 'next/image';

interface AnhTuLieu {
  imageUrl?: string;
  url?: string;
  imagePosition?: string;
  title?: string;
  caption?: string;
  khuVuc?: string;
  noiDung?: string;
  space3dLink?: string;
}

interface PropsBoSuuTapAnh {
  photoGallery?: AnhTuLieu[];
  onSelectPhoto: (index: number) => void;
}

export function PhotoGallery({ photoGallery, onSelectPhoto }: PropsBoSuuTapAnh) {
  const items = photoGallery && photoGallery.length > 0 ? photoGallery : [];

  return (
    <section id="bo-suu-tap-anh" className="scroll-mt-24 pt-8 pb-12 w-full relative">
      <div className="flex flex-col items-center justify-center text-center space-y-3 w-full mb-8">
        <div className="w-10 h-8 border border-[#ffde59]/80 rounded-md bg-[#3a2613] flex items-center justify-center shadow-[0_0_12px_rgba(255,222,89,0.3)] z-10">
          <svg className="w-5 h-5 text-[#ffde59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="flex items-center justify-center w-full my-2">
          <div className="flex-1 flex items-center justify-end">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
          </div>

          <h2
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-3xl sm:text-4xl text-[#ffde59] uppercase tracking-wider mx-6 font-normal"
          >
            BỘ SƯU TẬP ẢNH TƯ LIỆU
          </h2>

          <div className="flex-1 flex items-center justify-start">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
            <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {items.map((item, idx) => {
          const imgSrc = item.imageUrl || item.url || 'https://tunglam.mocwp.com/wp-content/uploads/2026/07/default-bg.jpg';

          return (
            <div
              key={idx}
              onClick={() => onSelectPhoto(idx)}
              className="group relative aspect-[4/3] w-full overflow-hidden border border-[#c8aa6e]/60 shadow-xl cursor-pointer bg-[#2a1a0e]"
            >
              {/* TỐI ƯU HÓA: Dùng img với fallback onError mượt mà */}
              <img
                src={imgSrc}
                alt={item.title || `Ảnh tư liệu ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ objectPosition: item.imagePosition || 'center' }}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                }}
              />

              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 backdrop-blur-[1px] z-10">
                <div className="bg-[#3a2613]/80 border border-[#c8aa6e]/80 rounded-xl px-6 py-5 text-center max-w-[88%] shadow-2xl backdrop-blur-xs">
                  <h3
                    style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Avo', serif" }}
                    className="text-lg sm:text-xl font-bold text-[#ffde59] uppercase tracking-wide leading-snug drop-shadow-md"
                  >
                    {item.title || `ẢNH TƯ LIỆU ${idx + 1}`}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
