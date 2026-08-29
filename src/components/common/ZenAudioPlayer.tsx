'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  ChevronDown,
  ChevronUp,
  Radio,
  SkipForward,
  Sparkles,
} from 'lucide-react';

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration?: string;
}

const DEFAULT_PLAYLIST: AudioTrack[] = [
  {
    id: 'zen-bell',
    title: 'Tiếng Chuông Bát Nhã & Nhạc Thiền Môn',
    artist: 'Tùng Lâm Hòa Phúc',
    src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-bell-111978.mp3',
  },
  {
    id: 'dai-bi-chu',
    title: 'Thần Chú Đại Bi - Thanh Âm Tịnh Hóa',
    artist: 'Ban Nghi Lễ Chùa Hòa Phúc',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=tibetan-singing-bowl-meditation-ambient-om-10826.mp3',
  },
  {
    id: 'niem-phat',
    title: 'Niệm Phật An Lạc - Trầm Hương Thiền Vị',
    artist: 'Chư Tôn Đức Tăng Ni',
    src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-mountains-rivers-streams-running-water-18178.mp3',
  },
];

export function ZenAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DEFAULT_PLAYLIST[currentTrackIdx];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % DEFAULT_PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIdx]);

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans select-none">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        preload="metadata"
      />

      {isMinimized ? (
        /* ── NÚT TRÒN THU NHỎ NỔI GÓC DƯỚI (MINI FLOATING ZEN BUTTON) ── */
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className={`group flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2.5 rounded-full bg-[#1C120A]/95 border-2 border-[#F2C14E] text-[#FFDE59] shadow-[0_0_25px_rgba(242,193,78,0.4)] backdrop-blur-md hover:scale-105 transition-all cursor-pointer ${
            isPlaying ? 'animate-pulse' : ''
          }`}
          title="Mở trình phát Pháp Âm Thiền Môn"
        >
          <div className="w-6 h-6 rounded-full bg-[#3A2718] border border-[#F2C14E]/60 flex items-center justify-center">
            {isPlaying ? (
              <Radio className="w-3.5 h-3.5 text-[#F2C14E] animate-spin" style={{ animationDuration: '4s' }} />
            ) : (
              <Music className="w-3.5 h-3.5 text-[#F2C14E]" />
            )}
          </div>
          <span className="hidden sm:inline text-xs font-bold tracking-wider uppercase text-[#FFE5A3]">
            {isPlaying ? 'Đang Phát Pháp Âm' : 'Pháp Âm Thiền Môn'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#F2C14E] group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        /* ── HỘP ĐIỀU KHIỂN ĐẦY ĐỦ (FULL ZEN AUDIO PLAYER) ── */
        <div className="w-80 rounded-2xl bg-gradient-to-b from-[#2A180F] via-[#1C120A] to-[#140A04] border-2 border-[#F2C14E] shadow-[0_10px_40px_rgba(0,0,0,0.9)] p-4 text-[#F5EADB] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F2C14E]/20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center">
                <Music className="w-3.5 h-3.5 text-[#F2C14E]" />
              </div>
              <span
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-lg text-[#FFDE59] uppercase tracking-widest font-normal"
              >
                PHÁP ÂM THIỀN MÔN
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg hover:bg-[#3A2718] text-[#FFE5A3]/80 hover:text-white transition-all cursor-pointer"
              title="Thu nhỏ trình phát"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Track Info */}
          <div className="py-3 text-center space-y-1">
            <p className="text-xs font-bold text-white tracking-wide truncate">
              {currentTrack.title}
            </p>
            <p className="text-[11px] text-[#FFE5A3]/70 italic truncate">
              {currentTrack.artist}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#3A2718] h-1.5 rounded-full overflow-hidden mb-3 cursor-pointer">
            <div
              className="bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] h-full transition-all duration-300 shadow-[0_0_8px_rgba(242,193,78,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-xl hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] transition-all cursor-pointer"
              title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] hover:from-[#ffd56b] hover:to-[#ffe885] text-[#1C120A] flex items-center justify-center shadow-[0_0_15px_rgba(242,193,78,0.5)] hover:scale-105 transition-all cursor-pointer"
              title={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-xl hover:bg-[#3A2718] text-[#FFE5A3] hover:text-[#FFDE59] transition-all cursor-pointer"
              title="Bài tiếp theo"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
