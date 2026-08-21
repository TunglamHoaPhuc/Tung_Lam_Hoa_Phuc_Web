'use client';

import React, { FC, useState, useEffect, useRef } from 'react';
import { HeritageBentoCluster, HeritagePhotoItem } from '@/data/heritageGalleryData';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, MapPin, Calendar, Layers, Sliders, Info, Check } from 'lucide-react';

interface HeritageStoryLightboxProps {
  cluster: HeritageBentoCluster | null;
  initialIndex?: number;
  onClose: () => void;
}

export const HeritageStoryLightbox: FC<HeritageStoryLightboxProps> = ({
  cluster,
  initialIndex = 0,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'GALLERY' | 'COMPARE' | 'AUDIO'>('GALLERY');
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [sliderPos, setSliderPos] = useState(50);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorIntervalRef = useRef<any>(null);

  if (!cluster) return null;

  // Build combined items list for this cluster
  const items: Array<{ title: string; imgUrl: string; caption?: string }> = [
    {
      title: cluster.heroTitle,
      imgUrl: cluster.heroImg,
      caption: cluster.heroCaption,
    },
    ...cluster.satelliteImgs,
  ];

  const currentItem = items[currentIndex] || items[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % items.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, onClose]);

  // Clean Web Audio soundscape generator (harmonic temple bells)
  const toggleAudioSoundscape = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      if (oscillatorIntervalRef.current) {
        clearInterval(oscillatorIntervalRef.current);
        oscillatorIntervalRef.current = null;
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const playBellStroke = () => {
          if (!ctx || ctx.state === 'closed') return;
          const now = ctx.currentTime;
          
          // Fundamental and overtone frequencies
          const freqs = [216, 432, 648, 864];
          freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = i === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.08 / (i + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 4.6);
          });
        };

        playBellStroke();
        oscillatorIntervalRef.current = setInterval(playBellStroke, 5000);
        setIsPlayingAudio(true);
      } catch (err) {
        console.log('Web audio initialized', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      if (oscillatorIntervalRef.current) {
        clearInterval(oscillatorIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[150] w-full h-full bg-[#0D0907]/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-300 select-none">
      {/* ── TOP NAV BAR ── */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[#F2C14E]/20 bg-[#1A1009]/80 backdrop-blur-md flex items-center justify-between gap-4">
        {/* Left: Cluster Title & Era */}
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2C14E] animate-ping hidden sm:inline-block" />
          <div>
            <h3
              className="text-xl sm:text-2xl font-bold uppercase text-[#F2C14E] tracking-wider leading-none"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              {cluster.title}
            </h3>
            <p className="text-xs text-[#C4B5A5] mt-1 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#F2C14E]" />
              <span>{cluster.locationName}</span>
              <span>•</span>
              <Calendar className="w-3 h-3 text-[#F2C14E]" />
              <span>{cluster.eraStr}</span>
            </p>
          </div>
        </div>

        {/* Center: 3 Mode Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-[#2A1D14] p-1 rounded-full border border-[#F2C14E]/30">
          <button
            onClick={() => setActiveTab('GALLERY')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'GALLERY'
                ? 'bg-[#F2C14E] text-[#1A110B] shadow-[0_0_12px_rgba(242,193,78,0.4)]'
                : 'text-[#D4C3B3] hover:text-[#FFE5A3]'
            }`}
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phòng Tranh 4K ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPARE')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'COMPARE'
                ? 'bg-[#F2C14E] text-[#1A110B] shadow-[0_0_12px_rgba(242,193,78,0.4)]'
                : 'text-[#D4C3B3] hover:text-[#FFE5A3]'
            }`}
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>So Sánh Xưa & Nay</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('AUDIO');
              if (!isPlayingAudio) toggleAudioSoundscape();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'AUDIO' || isPlayingAudio
                ? 'bg-[#E59866] text-[#1A110B] shadow-[0_0_12px_rgba(229,152,102,0.5)]'
                : 'text-[#D4C3B3] hover:text-[#FFE5A3]'
            }`}
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingAudio ? 'Đang Phát Âm Thanh' : 'Âm Thanh Ký Ức'}</span>
          </button>
        </div>

        {/* Right: Audio Toggle & Close Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudioSoundscape}
            className={`p-2.5 rounded-full border transition-all cursor-pointer ${
              isPlayingAudio
                ? 'border-[#F2C14E] bg-[#F2C14E]/20 text-[#F2C14E]'
                : 'border-[#F2C14E]/30 bg-[#2A1D14] text-[#C4B5A5] hover:text-[#FFE5A3]'
            }`}
            title={isPlayingAudio ? 'Tắt âm thanh ký ức' : 'Bật tiếng chuông chùa & âm thanh ký ức'}
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#2A1D14] border border-[#F2C14E]/40 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1A110B] transition-all cursor-pointer shadow-lg"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── MAIN STAGE ── */}
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {/* ── TAB 1: 4K GALLERY VIEWER ── */}
        {activeTab === 'GALLERY' && (
          <div className="relative w-full h-full max-w-6xl flex flex-col items-center justify-center">
            {/* Main Photo Frame */}
            <div className="relative w-full flex-1 max-h-[70vh] flex items-center justify-center rounded-2xl overflow-hidden bg-black/60 border border-[#F2C14E]/30 shadow-2xl p-2">
              <img
                src={currentItem.imgUrl}
                alt={currentItem.title}
                className="max-h-full max-w-full object-contain rounded-lg drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1A110B]/85 hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1A110B] border border-[#F2C14E]/40 transition-all flex items-center justify-center cursor-pointer shadow-2xl z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#1A110B]/85 hover:bg-[#F2C14E] text-[#F2C14E] hover:text-[#1A110B] border border-[#F2C14E]/40 transition-all flex items-center justify-center cursor-pointer shadow-2xl z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Index Indicator */}
              <div className="absolute bottom-4 right-4 bg-[#1A110B]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#F2C14E]/30 text-xs font-bold text-[#F2C14E]">
                {currentIndex + 1} / {items.length}
              </div>
            </div>

            {/* Photo Title & Caption */}
            <div className="w-full mt-3 text-center max-w-3xl px-4">
              <h4
                className="text-lg sm:text-2xl font-bold uppercase text-[#FFE5A3] leading-snug"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                {currentItem.title}
              </h4>
              {currentItem.caption && (
                <p className="text-xs sm:text-sm text-[#D4C3B3] mt-1 leading-relaxed line-clamp-2">
                  {currentItem.caption}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: SO SÁNH XƯA & NAY (BEFORE/AFTER SLIDER) ── */}
        {activeTab === 'COMPARE' && (
          <div className="relative w-full h-full max-w-4xl flex flex-col items-center justify-center">
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F2C14E] px-3 py-1 rounded-full border border-[#F2C14E]/40 bg-[#1A110B]/80">
                KÉO THANH TRƯỢT ĐỂ ĐỐI CHIẾU XƯA & NAY
              </span>
            </div>

            {/* Interactive Before/After Split Container */}
            <div className="relative w-full h-[55vh] rounded-2xl overflow-hidden border-2 border-[#F2C14E]/50 shadow-2xl bg-black select-none">
              {/* After Image (Modern) */}
              <img
                src={cluster.compareAfterImg || cluster.heroImg}
                alt="Ngày Nay"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-[#1A110B]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-bold uppercase">
                {cluster.compareLabelAfter || 'Diện Mạo Ngày Nay'}
              </div>

              {/* Before Image (Historic) Clipped */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={cluster.compareBeforeImg || cluster.heroImg}
                  alt="Thời Xưa"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%', minWidth: '100%' }}
                />
                <div className="absolute top-4 left-4 bg-[#1A110B]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold uppercase">
                  {cluster.compareLabelBefore || 'Ký Ức Đầu Thế Kỷ XX'}
                </div>
              </div>

              {/* Draggable Divider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#F2C14E] shadow-[0_0_15px_#F2C14E] cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-[#F2C14E] text-[#1A110B] flex items-center justify-center shadow-2xl border-2 border-[#1A110B] font-bold text-xs">
                  ⇆
                </div>
              </div>

              {/* Invisible full-range input for touch & mouse drag */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            </div>
          </div>
        )}

        {/* ── TAB 3: ÂM THANH KÝ ỨC (AUDIO GUIDE) ── */}
        {activeTab === 'AUDIO' && (
          <div className="relative w-full max-w-2xl text-center space-y-6 bg-[#1A110B]/90 p-8 rounded-3xl border border-[#F2C14E]/40 shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#2A1D14] border-2 border-[#F2C14E] flex items-center justify-center text-[#F2C14E] shadow-[0_0_30px_rgba(242,193,78,0.4)]">
              <Volume2 className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4
                className="text-3xl font-bold uppercase text-[#F2C14E]"
                style={{ fontFamily: "'UTM Niagara', serif" }}
              >
                Âm Thanh Ký Ức · Chuông Chùa & Không Gian Di Sản
              </h4>
              <p className="text-sm text-[#D4C3B3] leading-relaxed">
                Lắng đọng tâm tư với thanh âm chuông chùa ngân vang hòa cùng tiếng bước chân trăm năm trên sỏi đá, đưa hành giả quay về chốn thiêng thanh tịnh.
              </p>
            </div>

            {/* Sound wave bars visualizer */}
            <div className="flex items-center justify-center gap-1.5 h-12">
              {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 50, 85].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-[#F2C14E] rounded-full transition-all duration-300"
                  style={{
                    height: isPlayingAudio ? `${h}%` : '20%',
                    opacity: isPlayingAudio ? 0.9 : 0.3,
                  }}
                />
              ))}
            </div>

            <button
              onClick={toggleAudioSoundscape}
              className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider bg-[#F2C14E] hover:bg-[#FFE5A3] text-[#1A110B] transition-all cursor-pointer shadow-xl flex items-center gap-2 mx-auto"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Tạm Dừng Âm Thanh' : 'Bật Thuyết Minh & Chuông Ngân'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── BOTTOM THUMBNAIL CAROUSEL STRIP (FOR GALLERY MODE) ── */}
      {activeTab === 'GALLERY' && (
        <div className="flex-shrink-0 px-6 py-3 border-t border-[#F2C14E]/20 bg-[#1A1009]/90 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center gap-2.5 mx-auto min-w-max">
            {items.map((item, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'border-[#F2C14E] scale-110 shadow-[0_0_12px_rgba(242,193,78,0.6)]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={item.imgUrl} alt={item.title} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
