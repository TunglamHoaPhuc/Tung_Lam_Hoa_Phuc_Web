'use client';

import React, { FC, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Repeat,
} from 'lucide-react';
import { QUAN_AM_33_DATA, QuanAm33Item } from '@/data/quan-am-33-data';

// ── Web Audio Sound Generator for Authentic Shaking & Card Flip Chime ──
function playBambooRattleSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180 + Math.random() * 240, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    // Ignore audio error if blocked by browser policy
  }
}

function playSacredChimeSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now); // 528Hz Solfeggio sacred frequency
    osc.frequency.exponentialRampToValueAtTime(524, now + 1.2);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.5);
  } catch {
    // Ignore
  }
}

interface CardProps {
  item: QuanAm33Item;
  onSelect: (item: QuanAm33Item) => void;
}

const QuanAmCard = React.memo(({ item, onSelect }: CardProps) => {
  return (
    <div
      className="group relative w-full rounded-2xl overflow-hidden border border-[#F2C14E]/35 bg-[#1C120B] shadow-2xl hover:border-[#FFDE59] transition-all duration-500 flex flex-col justify-between cursor-pointer min-h-[390px] sm:min-h-[420px]"
      onClick={() => onSelect(item)}
    >
      {/* 1. TOP ARTWORK IMAGE FRAME */}
      <div className="relative w-full h-[270px] sm:h-[295px] bg-[#120A06] overflow-hidden shrink-0">
        <img
          src={item.imgUrl}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-[center_12%] transition-transform duration-700 ease-out group-hover:scale-108 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp';
          }}
        />

        {/* Ambient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#25170E] via-transparent to-black/30 pointer-events-none" />

        {/* Number Badge Top-Left */}
        <div
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#F2C14E] bg-[#1C120B]/90 border border-[#F2C14E]/50 backdrop-blur-md shadow-md z-10"
        >
          QUẺ SỐ {item.number}
        </div>
      </div>

      {/* 2. CAPTION AREA: VÒNG TRÒN NỔI & ĐƯỜNG KẺ GRADIENT NỐI SÁT 2 BÊN MÉP */}
      <div className="relative flex-1 bg-gradient-to-b from-[#25170E] to-[#160E08] flex flex-col justify-between pt-1 pb-3 px-3 overflow-hidden">
        
        {/* ANIMATED WRAPPER: Moves UP on hover smoothly */}
        <div className="w-full flex-1 flex flex-col items-center justify-center relative transition-transform duration-400 ease-out transform-gpu group-hover:-translate-y-4">
          
          {/* HORIZONTAL DIVIDER WITH CENTER EMBLEM NẰM NỔI RÕ RÀNG */}
          <div className="w-full flex items-center justify-center mb-1 relative z-30">
            {/* Left gradient line */}
            <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-[#F2C14E]" />
            
            {/* Center Circle with Logo (Nổi trên bề mặt, tiếp giáp sát đường kẻ) */}
            <div className="w-8 h-8 rounded-full border border-[#F2C14E] bg-[#1C120B] flex items-center justify-center mx-1.5 shadow-[0_0_12px_rgba(242,193,78,0.6)] z-30 shrink-0">
              <img
                src="/images/icon-minh-hoa/GIEO THẺ QUAN ÂM LOGO.svg"
                alt=""
                className="w-4 h-4 object-contain filter drop-shadow-[0_0_4px_rgba(242,193,78,0.9)]"
              />
            </div>

            {/* Right gradient line */}
            <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#F2C14E]/70 to-[#F2C14E]" />
          </div>

          {/* TITLE & SUBTITLE */}
          <div className="text-center space-y-0.5 my-auto w-full pt-0.5">
            <h3
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-[#F2C14E] text-2xl sm:text-3xl font-normal leading-tight group-hover:text-white transition-colors line-clamp-1 uppercase px-1 tracking-wider"
            >
              QUÁN THẾ ÂM BỒ TÁT
            </h3>
            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-[#FFE5A3] text-xs font-bold line-clamp-1 uppercase tracking-wider opacity-90"
            >
              QUẺ SỐ {item.number} • {item.title}
            </p>
          </div>
        </div>

        {/* HOVER ACTION BUTTON: Xuất hiện dưới đáy khi hover mà không đè vào chữ */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out z-20 pointer-events-none group-hover:pointer-events-auto">
          <span
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="px-4 py-1 rounded-full text-[11px] font-bold text-[#1C130D] bg-gradient-to-r from-[#F2C14E] via-[#FFDE59] to-[#F2C14E] shadow-[0_4px_15px_rgba(242,193,78,0.6)] flex items-center gap-1.5 uppercase tracking-wider cursor-pointer hover:brightness-110"
          >
            <span>Xem lời dạy và chiêm bái</span>
          </span>
        </div>
      </div>
    </div>
  );
});

QuanAmCard.displayName = 'QuanAmCard';

export const QuanAm33Grid: FC = () => {
  const [selectedItem, setSelectedItem] = useState<QuanAm33Item | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [shuffleCard, setShuffleCard] = useState<QuanAm33Item>(QUAN_AM_33_DATA[0]);

  // Zoom & Pan inside Lightbox Modal (Bounded so it never drags past edges)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 8 Cards Display Limit on Grid
  const DISPLAYED_ITEMS = QUAN_AM_33_DATA.slice(0, 8);

  // Bounded Pan Handler
  const handlePan = useCallback((clientX: number, clientY: number) => {
    if (zoom <= 1) {
      setPan({ x: 0, y: 0 });
      return;
    }
    const maxPanX = (containerRef.current ? containerRef.current.clientWidth : 400) * (zoom - 1) * 0.45;
    const maxPanY = (containerRef.current ? containerRef.current.clientHeight : 500) * (zoom - 1) * 0.45;

    const rawX = clientX - dragStartRef.current.x;
    const rawY = clientY - dragStartRef.current.y;

    const boundedX = Math.max(-maxPanX, Math.min(maxPanX, rawX));
    const boundedY = Math.max(-maxPanY, Math.min(maxPanY, rawY));

    setPan({ x: boundedX, y: boundedY });
  }, [zoom]);

  // SHUFFLE ALGORITHM: Runs from SLOW -> FAST -> SLOW DOWN -> STOPS AT FINAL CARD + SOUNDS
  const handleRandomDraw = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    setIsFlipped(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });

    const totalSteps = 22;
    let currentStep = 0;
    const finalIndex = Math.floor(Math.random() * QUAN_AM_33_DATA.length);
    const finalItem = QUAN_AM_33_DATA[finalIndex];

    const delays = [
      260, 210, 160, 120, 90, 70, 60, 50, 50, 50, 50, 60, 70, 90, 120, 160, 210, 270, 340, 420, 520, 650
    ];

    function step() {
      if (currentStep < totalSteps) {
        const randIdx = Math.floor(Math.random() * QUAN_AM_33_DATA.length);
        setShuffleCard(QUAN_AM_33_DATA[randIdx]);
        playBambooRattleSound();

        const delay = delays[currentStep] || 100;
        currentStep++;
        setTimeout(step, delay);
      } else {
        // Final card revealed
        setShuffleCard(finalItem);
        setSelectedItem(finalItem);
        setIsShuffling(false);
        playSacredChimeSound();

        // Smooth auto-flip to back after 1.8s
        setTimeout(() => {
          setIsFlipped(true);
        }, 1800);
      }
    }

    step();
  };

  const handleOpenCard = (item: QuanAm33Item) => {
    setSelectedItem(item);
    setIsFlipped(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    playSacredChimeSound();
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem || isShuffling) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedItem, isShuffling]);

  return (
    <section id="quan-am-33-ung-hoa" className="relative w-full py-8 md:py-12 bg-transparent overflow-hidden">
      {/* ── AMBIENT BACKGROUND GLOW ── */}
      <div className="absolute top-0 inset-x-0 h-[450px] z-0 pointer-events-none overflow-hidden">
        <div className="w-full h-full bg-radial from-[#F2C14E]/10 via-[#2C1C11]/30 to-transparent blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col items-center text-center">
          {/* Standalone Logo above section title */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <img
              src="/images/icon-minh-hoa/GIEO THẺ QUAN ÂM LOGO.svg"
              alt="Gieo Quẻ Quan Âm"
              className="w-full h-full object-contain filter drop-shadow-[0_0_16px_rgba(242,193,78,0.95)]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/icon-minh-hoa/bieu-tuong-bao-tuong-phat-giao.png';
              }}
            />
          </div>

          {/* Golden Divider Lines & Title */}
          <div className="flex items-center justify-center w-full max-w-5xl mx-auto px-4">
            <div className="flex-1 flex items-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
            </div>

            <h2
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-5 sm:px-8 leading-tight"
            >
              33 ỨNG HÓA THÂN
            </h2>

            <div className="flex-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
              <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
            </div>
          </div>

          {/* Subtitle */}
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm md:text-base text-[#e3d2c1] tracking-widest uppercase font-bold max-w-xl mx-auto mt-2"
          >
            CỦA ĐỨC QUAN ÂM BỒ TÁT
          </p>

          {/* NÚT GIEO QUẺ QUAN ÂM: LIỀN MỘT CHỮ, LOGO MÀU NÂU TRẦM TRÊN NỀN VÀNG */}
          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={handleRandomDraw}
              disabled={isShuffling}
              className="group cursor-pointer inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[#F2C14E]/70 bg-gradient-to-r from-[#D4A017] via-[#F2C14E] to-[#FFE5A3] text-[#2C180B] font-bold shadow-[0_0_25px_rgba(242,193,78,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 uppercase text-xs sm:text-sm tracking-wider"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <span className="whitespace-nowrap font-extrabold text-[#2A170A]">
                {isShuffling ? 'Đang gieo quẻ...' : 'Gieo quẻ Quan Âm'}
              </span>

              {/* Logo icon màu nâu trầm đồng bộ */}
              <span className="w-5 h-5 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <img
                  src="/images/icon-minh-hoa/GIEO THẺ QUAN ÂM LOGO.svg"
                  alt=""
                  className="w-full h-full object-contain filter brightness-0 sepia hue-rotate-[320deg] saturate-[600%]"
                />
              </span>
            </button>
          </div>
        </div>

        {/* ── GRID: 8 CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 pt-2">
          {DISPLAYED_ITEMS.map((item) => (
            <QuanAmCard
              key={item.id}
              item={item}
              onSelect={handleOpenCard}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SHUFFLING OVERLAY (CÁC LÁ BÀI CHẠY TỪ CHẬM -> NHANH -> CHẬM DẦN KÈM TIẾNG XÓC)
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {isShuffling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/92 backdrop-blur-xl flex flex-col items-center justify-center p-4 select-none"
          >
            {/* Luminous aura */}
            <div className="w-64 h-64 bg-radial from-[#F2C14E]/30 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-5">
              {/* Tiêu đề: Đang kính cẩn gieo quẻ Quan Âm */}
              <span
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-[#F2C14E] text-sm sm:text-base font-bold uppercase tracking-widest animate-bounce"
              >
                ✦ Đang kính cẩn gieo quẻ Quan Âm ✦
              </span>

              {/* Shuffling Card Animation (Không có text ngoài ảnh) */}
              <motion.div
                key={shuffleCard.id}
                initial={{ scale: 0.9, y: 15, opacity: 0.7 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: -15, opacity: 0.7 }}
                transition={{ duration: 0.08 }}
                className="w-[280px] sm:w-[320px] h-[400px] sm:h-[460px] rounded-3xl overflow-hidden border-2 border-[#F2C14E] bg-[#1C120B] shadow-[0_0_50px_rgba(242,193,78,0.7)] p-2 flex flex-col items-center justify-center"
              >
                <img
                  src={shuffleCard.imgUrl}
                  alt={shuffleCard.name}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          3D FLIPPABLE SACRED CARD RITUAL LIGHTBOX
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedItem && !isShuffling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-black/94 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none overscroll-contain"
            onClick={() => setSelectedItem(null)}
            onWheel={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (e.deltaY < 0) {
                setZoom((prev) => Math.min(prev + 0.3, 3.0));
              } else {
                setZoom((prev) => {
                  const next = Math.max(prev - 0.3, 1);
                  if (next === 1) setPan({ x: 0, y: 0 });
                  return next;
                });
              }
            }}
          >
            {/* Ambient Sparkles Aura */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[500px] h-[500px] bg-radial from-[#F2C14E]/25 via-[#F2C14E]/5 to-transparent rounded-full blur-3xl animate-pulse" />
            </div>

            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative max-w-lg w-full flex flex-col items-center z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button X */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 sm:right-2 z-30 w-10 h-10 rounded-full bg-[#1C120B]/90 border border-[#F2C14E]/60 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-md"
                title="Đóng chiêm bái"
              >
                <X className="w-5 h-5" />
              </button>

              {/* ── 3D CARD FLIP CONTAINER: Khung viền khớp đúng kích thước ảnh ── */}
              <div
                ref={containerRef}
                className="relative w-full h-[470px] sm:h-[550px] perspective-[1400px] cursor-pointer select-none overflow-hidden rounded-3xl"
                onClick={() => {
                  if (zoom === 1) {
                    setIsFlipped(!isFlipped);
                    playBambooRattleSound();
                  }
                }}
                onMouseDown={(e) => {
                  if (zoom <= 1) return;
                  setIsDragging(true);
                  dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
                }}
                onMouseMove={(e) => {
                  if (!isDragging || zoom <= 1) return;
                  handlePan(e.clientX, e.clientY);
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {/* ── MẶT TRƯỚC (FRONT): TÔN TƯỢNG ĐỨC BỒ TÁT QUÁN THẾ ÂM ── */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border-2 border-[#F2C14E] bg-[#140C07] shadow-[0_0_60px_rgba(242,193,78,0.4)] flex items-center justify-center p-1.5"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img
                      src={selectedItem.imgUrl}
                      alt={selectedItem.name}
                      className="w-full h-full object-contain rounded-2xl pointer-events-none"
                      style={{
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                      }}
                    />

                    {/* Badge: Mặt trước Tôn Tượng */}
                    <div
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#F2C14E] bg-[#1C120B]/90 border border-[#F2C14E]/50 shadow-md backdrop-blur-md uppercase"
                    >
                      Mặt trước • Tôn Tượng
                    </div>
                  </div>

                  {/* ── MẶT SAU (BACK): THẺ ĐỎ LỜI DẠY QUAN ÂM & QUẺ XĂM ── */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border-2 border-[#F2C14E] bg-[#6B0000] shadow-[0_0_60px_rgba(242,193,78,0.5)] flex items-center justify-center p-1.5"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <img
                      src={selectedItem.backImgUrl || selectedItem.imgUrl}
                      alt={`Mặt sau Lời Dạy Quẻ Số ${selectedItem.number}`}
                      className="w-full h-full object-contain rounded-2xl pointer-events-none"
                      style={{
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                      }}
                    />

                    {/* Badge: Mặt sau Lời Dạy */}
                    <div
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#FFE5A3] bg-[#3B0000]/90 border border-[#F2C14E]/60 shadow-md backdrop-blur-md uppercase"
                    >
                      Mặt sau • Lời Dạy Quẻ Số {selectedItem.number}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* ── CONTROLS BAR: TỐI GIẢN GỌN GÀNG, BỎ NÚT XỐC LẠI ── */}
              <div className="w-full mt-3 flex items-center justify-between gap-3 bg-[#1C120B]/90 border border-[#F2C14E]/40 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md">
                {/* Button: Lật Thẻ 3D */}
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(!isFlipped);
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                    playBambooRattleSound();
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4A017] via-[#F2C14E] to-[#FFE5A3] text-[#1C120B] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(242,193,78,0.5)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  <Repeat className="w-4 h-4" />
                  <span>{isFlipped ? 'Xem Tôn Tượng' : 'Xem Lời Dạy (Mặt Sau)'}</span>
                </button>

                {/* Zoom Controls (Bounded) */}
                <div className="flex items-center gap-1 bg-[#2A1A0E] p-1 rounded-xl border border-[#F2C14E]/30">
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.min(prev + 0.3, 3.0))}
                    className="w-8 h-8 rounded-lg hover:bg-[#F2C14E] text-[#FFDE59] hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                    title="Phóng to để đọc chữ rõ hơn"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom((prev) => {
                        const next = Math.max(prev - 0.3, 1);
                        if (next === 1) setPan({ x: 0, y: 0 });
                        return next;
                      });
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-[#F2C14E] text-[#FFDE59] hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                    title="Thu nhỏ"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  {zoom !== 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-[#F2C14E] text-[#FFDE59] hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                      title="Khôi phục góc nhìn"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
