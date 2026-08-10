'use client';

import React, { FC, useState } from "react";
import { Video, Play } from "lucide-react";

export interface StoryItem {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  thumbnailUrl: string;
  videoUrl?: string;
}

interface RelatedStoriesSectionProps {
  areaTitle?: string;
  stories?: StoryItem[];
}

const DEFAULT_STORIES: StoryItem[] = [
  {
    id: "v1",
    title: "CÂU CHUYỆN VỀ KHU VỰC TAM BẢO",
    subtitle: "Tùng Lâm Hòa Phúc - Chốn Tổ Trang Nghiêm",
    summary: "Phật có phải một đấng quyền năng, một đấng thần linh để cứu rỗi, đáp ứng những nguyện vọng, ham muốn của chúng ta hay không?",
    thumbnailUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1000&h=562&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "v2",
    title: "Ý NGHĨA CỦA LỄ GIỖ TỔ & TINH THẦN TRI ÂN",
    subtitle: "Ngày 16/10 Âm Lịch, Lễ Giỗ Tổ lần thứ 37 tại Tổ đình Hoằng Pháp",
    summary: "Bài pháp thoại sâu sắc của Thượng tọa Trụ trì giảng giải về đạo lý Uống nước nhớ nguồn và trách nhiệm tiếp nối ngọn đèn hoằng pháp.",
    thumbnailUrl: "https://images.unsplash.com/photo-1545232979-fbf5963d13a2?w=1000&h=562&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

interface StoryCardProps {
  story: StoryItem;
  isPlaying: boolean;
  onPlay: (id: string) => void;
}

const StoryCard = React.memo(({ story, isPlaying, onPlay }: StoryCardProps) => {
  return (
    <div className="relative bg-[#3a2613]/80 border border-[#c8aa6e]/70 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
        {/* Left: Thumbnail / Video */}
        <div className="lg:col-span-7 relative aspect-video w-full rounded-xl overflow-hidden border border-[#c8aa6e]/50 shadow-2xl bg-black group">
          {isPlaying && story.videoUrl ? (
            <iframe
              src={story.videoUrl}
              title={story.title}
              className="w-full h-full border-0 rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() => onPlay(story.id)}
            >
              <img
                src={story.thumbnailUrl}
                alt={story.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(story.id);
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F2C14E] border-2 border-white flex items-center justify-center shadow-[0_0_24px_rgba(242,193,78,0.8)] transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  aria-label="Phát Video"
                >
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 text-[#2C1C11] fill-[#2C1C11] ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 space-y-4 text-left pl-0 lg:pl-2">
          <h3
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffde59] uppercase leading-tight tracking-normal drop-shadow-[0_0_14px_rgba(255,222,89,0.8)]"
          >
            {story.title}
          </h3>

          {story.subtitle && (
            <h4
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-base sm:text-xl font-bold text-[#f2cc8f] leading-snug tracking-normal"
            >
              {story.subtitle}
            </h4>
          )}

          <div className="w-full h-[1px] bg-gradient-to-r from-[#c8aa6e]/80 via-[#c8aa6e]/30 to-transparent my-3" />

          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-sm sm:text-base text-white/90 font-normal leading-relaxed tracking-normal"
          >
            {story.summary}
          </p>
        </div>
      </div>
    </div>
  );
});

StoryCard.displayName = "StoryCard";

export const RelatedStoriesSection: FC<RelatedStoriesSectionProps> = ({
  areaTitle = "TÙNG LÂM HÒA PHÚC",
  stories = DEFAULT_STORIES,
}) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  return (
    <section id="cau-chuyen-lien-quan" className="w-full scroll-mt-24 py-8">
      {/* ── 1. HEADER ── */}
      <div className="relative -mx-4 md:-mx-8 mb-10">
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[#523622]" />

        <div className="flex items-center gap-0 pb-3 pl-4 md:pl-8 pr-0 overflow-visible">
          <h2
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Niagara', serif" }}
            className="text-xl sm:text-2xl md:text-3xl font-normal text-white tracking-wider uppercase whitespace-nowrap drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] shrink-0 mr-4"
          >
            KHÁM PHÁ NHỮNG CÂU CHUYỆN LIÊN QUAN
          </h2>

          <div className="flex-1 flex items-center gap-2">
            <div className="h-[1.5px] w-full bg-gradient-to-r from-[#f2cc8f] via-[#f2cc8f]/50 to-transparent" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#f2cc8f] bg-[#2c1c11] flex-shrink-0 mr-4 shadow-[0_0_6px_rgba(242,204,143,0.5)]" />
          </div>
        </div>
      </div>

      {/* ── 2. VIDEO HEADER ── */}
      <div className="flex flex-col items-center text-center mb-10 w-full">
        <div className="w-9 h-9 rounded-xl border border-[#c8aa6e]/60 bg-[#3a2613]/80 text-[#ffde59] flex items-center justify-center mb-2 shadow-[0_0_12px_rgba(255,222,89,0.3)]">
          <Video className="w-5 h-5 text-[#ffde59]" />
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

      {/* ── 3. STORIES LIST WITH MEMOIZED CARDS ── */}
      <div className="space-y-10 max-w-5xl mx-auto">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            isPlaying={playingVideoId === story.id}
            onPlay={setPlayingVideoId}
          />
        ))}
      </div>
    </section>
  );
};
