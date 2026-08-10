'use client';

import { FC, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, BookOpen, Calendar, Search, Volume2 } from "lucide-react";
import GalaxyTimelineGallery from "./GalaxyTimelineGallery";

// ⏱️ MỐC THỜI GIAN CẮT BỎ ĐOẠN DÍNH NGƯỜI (TÍNH BẰNG GIÂY)
const CUT_START = 96;   // 1:36 (Bắt đầu đoạn dính người -> Cắt)
const RESUME_TIME = 164; // 2:44 (Hết đoạn dính người -> Phát tiếp)

export const Hero: FC = () => {
  const [isGalaxyOpen, setIsGalaxyOpen] = useState(false);
  const playerRef = useRef<any>(null);

  // ✂️ TỰ ĐỘNG NHẢY CÓC BỎ QUA ĐOẠN 1:36 -> 2:43
  useEffect(() => {
    // 1. Tải script YouTube IFrame API nếu chưa có
    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    let intervalId: NodeJS.Timeout;

    // 2. Hàm khởi tạo Player
    const initPlayer = () => {
      if (!document.getElementById('hero-yt-player')) return;

      playerRef.current = new (window as any).YT.Player('hero-yt-player', {
        videoId: 'HE2MnR8Hl5c',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          start: 0,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();

            // Giám sát thời gian liên tục mỗi 200ms để bỏ đoạn dính người
            intervalId = setInterval(() => {
              if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                const currentTime = playerRef.current.getCurrentTime();

                // Nếu video phát chạm tới mốc 1:36 (96s) -> Bỏ qua đến thẳng 2:44 (164s)
                if (currentTime >= CUT_START && currentTime < RESUME_TIME) {
                  playerRef.current.seekTo(RESUME_TIME, true);
                }
              }
            }, 200);
          },
          onStateChange: (event: any) => {
            // Khi video chạy hết -> Quay về từ 0:00 phát lại
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              event.target.seekTo(0, true);
              event.target.playVideo();
            }
          }
        }
      });
    };

    // 3. Kích hoạt Player khi YouTube API sẵn sàng
    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const scrollToAiSearch = () => {
    const el = document.getElementById("smart-search-ai-bar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center justify-between" style={{ minHeight: "100vh", background: "#1A120B" }}>
      {/* ── Background Video YouTube API (Khóa hoàn toàn chuột, không hiện Pause) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div
          id="hero-yt-player"
          className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none scale-125"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(42,29,20,0.3) 0%, rgba(26,15,8,0.85) 75%, rgba(26,15,8,0.98) 100%)",
          }}
        />
      </div>

      {/* ── Top Spacing for Fixed Header ── */}
      <div className="h-28" />

      {/* ── Hero Center Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center flex flex-col items-center gap-4 my-auto py-8">

        {/* Tiêu đề chính phông UTM Niagara */}
        <h1
          className="text-6xl md:text-9xl tracking-normal text-[#F2C14E] uppercase leading-none font-normal"
          style={{
            fontFamily: "'UTM Niagara', 'Playfair Display', serif",
            fontWeight: "normal",
            textShadow: "0 0 36px rgba(242,193,78,0.8), 0 0 72px rgba(242,193,78,0.4)",
          }}
        >
          NƠI ĐỂ TRỞ VỀ
        </h1>

        {/* Phụ tiêu đề phông UTM Classizism Antiqua */}
        <p
          className="text-xl md:text-3xl text-[#e3d2c1] uppercase font-semibold leading-tight w-full max-w-4xl mx-auto"
          style={{
            fontFamily: "'UTM ClassizismAntiqua', 'Playfair Display', serif",
            letterSpacing: "0.38em",
          }}
        >
          CHỐN THIÊNG BÌNH YÊN
        </p>

        {/* ── Dải 5 nút thao tác nhanh ── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3.5 mt-8 w-full max-w-6xl">
          {/* 1. PHÁP THOẠI MỚI NHẤT */}
          <Link
            href="/vu-tru-phat-giao/giang-duong"
            className="px-4 md:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #4A3728 0%, #3D2B1F 100%)",
              border: "1.5px solid #F2C14E",
              color: "#F2C14E",
              fontFamily: "'UTM Avo', sans-serif",
              fontWeight: "bold",
              boxShadow: "0 0 20px rgba(242,193,78,0.25)",
            }}
          >
            <Volume2 className="w-4 h-4 text-[#F2C14E] flex-shrink-0" />
            <span className="whitespace-nowrap">PHÁP THOẠI MỚI NHẤT</span>
          </Link>

          {/* 2. KHO ẢNH TƯ LIỆU */}
          <button
            onClick={() => setIsGalaxyOpen(true)}
            className="px-4 md:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap flex-shrink-0"
            style={{
              background: "rgba(42,29,20,0.85)",
              border: "1px solid rgba(242,193,78,0.5)",
              color: "#e3d2c1",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <Sparkles className="w-4 h-4 text-[#F2C14E] flex-shrink-0" />
            <span className="whitespace-nowrap">KHO ẢNH TƯ LIỆU</span>
          </button>

          {/* 3. ẤN PHẨM PHẬT GIÁO */}
          <Link
            href="/tri-tue-phat-phap"
            className="px-4 md:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap flex-shrink-0"
            style={{
              background: "rgba(42,29,20,0.85)",
              border: "1px solid rgba(242,193,78,0.5)",
              color: "#e3d2c1",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <BookOpen className="w-4 h-4 text-[#F2C14E] flex-shrink-0" />
            <span className="whitespace-nowrap">ẤN PHẨM PHẬT GIÁO</span>
          </Link>

          {/* 4. ĐĂNG KÝ CỘNG TU */}
          <Link
            href="/dong-chay-hoang-phap"
            className="px-4 md:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap flex-shrink-0"
            style={{
              background: "rgba(42,29,20,0.85)",
              border: "1px solid rgba(242,193,78,0.5)",
              color: "#e3d2c1",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <Calendar className="w-4 h-4 text-[#F2C14E] flex-shrink-0" />
            <span className="whitespace-nowrap">ĐĂNG KÝ CỘNG TU</span>
          </Link>

          {/* 5. TÌM KIẾM & THAM VẤN */}
          <button
            onClick={scrollToAiSearch}
            className="px-4 md:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 whitespace-nowrap flex-shrink-0"
            style={{
              background: "rgba(42,29,20,0.85)",
              border: "1px solid rgba(242,193,78,0.5)",
              color: "#e3d2c1",
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            <Search className="w-4 h-4 text-[#F2C14E] flex-shrink-0" />
            <span className="whitespace-nowrap">TÌM KIẾM &amp; THAM VẤN</span>
          </button>
        </div>
      </div>

      <div className="h-10" />

      {/* ── Pop-up Galaxy Timeline Gallery Modal ── */}
      {isGalaxyOpen && <GalaxyTimelineGallery onClose={() => setIsGalaxyOpen(false)} />}
    </section>
  );
};

export default Hero;