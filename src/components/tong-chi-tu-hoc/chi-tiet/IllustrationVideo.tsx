'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface PropsKhoiVideo {
  heroBanner?: string;
  videoBlock?: {
    title?: string;
    description?: string;
    videoUrl?: string;
  };
}

function formatYoutubeEmbed(url?: string): string {
  if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  if (url.includes('youtube.com/embed/')) return url;
  if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
  return url;
}

export function IllustrationVideo({ heroBanner, videoBlock }: PropsKhoiVideo) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const thumbnailSrc = heroBanner || 'https://tunglam.mocwp.com/wp-content/uploads/2026/07/bg-chua.jpg';

  return (
    <section id="video-minh-hoa" className="scroll-mt-24 pt-8 pb-4 w-full relative">
      {/* ── 1. SECTION HEADER CHUẨN HOÁ (TRACKING-NORMAL, ĐƯỜNG KẺ & CHẤM TRÒN MẠ VÀNG) ── */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 w-full">
        <div className="w-10 h-8 border border-[#ffde59]/80 rounded-md bg-[#3a2613] flex items-center justify-center shadow-[0_0_12px_rgba(255,222,89,0.3)] z-10">
          <div className="w-5 h-3.5 border border-[#ffde59] rounded-xs flex items-center justify-center">
            <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-l-[6px] border-l-[#ffde59] border-b-[3.5px] border-b-transparent ml-0.5" />
          </div>
        </div>

        <div className="flex items-center justify-center w-full my-2">
          <div className="flex-1 flex items-center justify-end">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
          </div>

          <h2
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-3xl sm:text-5xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_0_16px_rgba(255,222,89,0.85)] whitespace-nowrap px-4 sm:px-6"
          >
            VIDEO MINH HỌA
          </h2>

          <div className="flex-1 flex items-center justify-start">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_10px_#ffde59] flex-shrink-0" />
            <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/80 to-[#ffde59]" />
          </div>
        </div>
      </div>

      {/* ── 2. KHUNG VIDEO MINH HỌA KHỔ CHUẨN ── */}
      <div className="relative bg-[#3a2613]/80 border border-[#c8aa6e]/70 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md w-full mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="lg:col-span-7 relative aspect-video w-full rounded-xl overflow-hidden border border-[#c8aa6e]/50 shadow-2xl bg-black group">
            {isPlayingVideo ? (
              <iframe
                className="w-full h-full border-0 rounded-xl"
                src={formatYoutubeEmbed(videoBlock?.videoUrl)}
                title={videoBlock?.title || 'Video Minh Họa'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full cursor-pointer">
                <Image
                  src={thumbnailSrc}
                  alt="Video Thumbnail"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* ── 3. NÚT PLAY CUSTOM VÀNG PHÁT SÁNG ĐỒNG BỘ ── */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <button
                    type="button"
                    onClick={() => setIsPlayingVideo(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F2C14E] border-2 border-white flex items-center justify-center shadow-[0_0_24px_rgba(242,193,78,0.8)] transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    aria-label="Phát Video Minh Họa"
                  >
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[#2C1C11] fill-[#2C1C11] ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4 text-left pl-0 lg:pl-2">
            <h3
              style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffde59] uppercase leading-tight tracking-normal drop-shadow-[0_0_14px_rgba(255,222,89,0.8)]"
            >
              {videoBlock?.title || 'LỄ TƯỞNG NIỆM LẦN THỨ 33'}
            </h3>

            <h4
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-base sm:text-xl font-bold text-[#f2cc8f] leading-snug tracking-normal"
            >
              Tổ Sư Khai Sơn Tông Phong Hoằng Pháp Viên Tịch
            </h4>

            <div className="w-full h-[1px] bg-gradient-to-r from-[#c8aa6e]/80 via-[#c8aa6e]/30 to-transparent my-3" />

            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-sm sm:text-base text-white/90 font-normal leading-relaxed tracking-normal"
            >
              {videoBlock?.description ||
                'Thước phim tư liệu ghi lại bầu không khí trang nghiêm và lòng thành kính của hàng môn đồ đệ tử trong ngày lễ tưởng niệm Chư Tổ Sư.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
