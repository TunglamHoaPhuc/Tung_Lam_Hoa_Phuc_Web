'use client';

import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import {
  HERITAGE_MAP_IMAGE,
  HeritagePhotoItem,
  ALL_HERITAGE_PHOTOS,
} from '@/data/heritageGalleryData';
import {
  ArrowLeft,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
  Compass,
  Bot,
  MapPin,
  Calendar,
  Send,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeritageMap2DProps {
  onClose: () => void;
}

// ── 3 REGION HUBS AT EXACT MAINLAND COORDINATES ──
interface HeritageRegionHub {
  id: 'BAC' | 'TRUNG' | 'NAM';
  name: string;
  countLabel: string;
  top: string;
  left: string;
  zoomScale: number;
}

const HERITAGE_REGION_HUBS: Record<'BAC' | 'TRUNG' | 'NAM', HeritageRegionHub> = {
  BAC: {
    id: 'BAC',
    name: 'MIỀN BẮC',
    countLabel: '17 TƯ LIỆU QUÝ',
    top: '18%',
    left: '33.8%',
    zoomScale: 1.6,
  },
  TRUNG: {
    id: 'TRUNG',
    name: 'MIỀN TRUNG',
    countLabel: '8 TƯ LIỆU QUÝ',
    top: '42%',
    left: '35%',
    zoomScale: 1.6,
  },
  NAM: {
    id: 'NAM',
    name: 'MIỀN NAM',
    countLabel: '15 TƯ LIỆU QUÝ',
    top: '79%',
    left: '34.8%',
    zoomScale: 1.6,
  },
};

export const HeritageMap2D: FC<HeritageMap2DProps> = ({ onClose }) => {
  // Screen Stage States ('loading' | 'welcome' | 'map')
  const [screenState, setScreenState] = useState<'loading' | 'welcome' | 'map'>('loading');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Map transform states
  const [scale, setScale] = useState<number>(1);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Active Region Hub & Side Panel View State ('list' | 'detail')
  const [activeRegion, setActiveRegion] = useState<'BAC' | 'TRUNG' | 'NAM' | null>(null);
  const [sidePanelView, setSidePanelView] = useState<'list' | 'detail'>('list');
  const [selectedPhoto, setSelectedPhoto] = useState<HeritagePhotoItem | null>(null);
  const [themeFilter, setThemeFilter] = useState<'ALL' | 'PHAT_GIAO' | 'DOI_SONG'>('ALL');

  // Photo Interactive Zoom & Drag in Detail View
  const [photoZoom, setPhotoZoom] = useState<number>(1);
  const [photoPan, setPhotoPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPhotoDragging, setIsPhotoDragging] = useState<boolean>(false);
  const photoDragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // YouTube Background Meditation Music (https://www.youtube.com/watch?v=V_hkbEVraSA)
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);

  // AI Chat Assistant State
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiChatLog, setAiChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'A Di Đà Phật! Tôi là Trợ lý Di sản Phật giáo. Bạn muốn tìm hiểu về cổ tự, tăng đoàn hay nét văn hóa nào trong triển lãm?',
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Preload Map Image & Progress bar counter
  useEffect(() => {
    if (screenState !== 'loading') return;

    // Preload image in background
    const img = new window.Image();
    img.src = HERITAGE_MAP_IMAGE;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScreenState('welcome'), 200);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [screenState]);

  // Start exploring handler
  const handleStartExplore = () => {
    setScreenState('map');
  };

  // Lock body scroll while component is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Map Zoom & Pan calculation helper
  const getClampedPosition = (rawX: number, rawY: number, targetScale: number) => {
    if (!containerRef.current) return { x: rawX, y: rawY };
    const rect = containerRef.current.getBoundingClientRect();
    const maxTranslateX = 0;
    const minTranslateX = rect.width * (1 - targetScale);
    const maxTranslateY = 0;
    const minTranslateY = rect.height * (1 - targetScale);
    return {
      x: Math.min(maxTranslateX, Math.max(minTranslateX, rawX)),
      y: Math.min(maxTranslateY, Math.max(minTranslateY, rawY)),
    };
  };

  // Map Zoom & Pan controls
  const handleResetMap = () => {
    setScale(1);
    setPositionX(0);
    setPositionY(0);
    setActiveRegion(null);
    setSelectedPhoto(null);
    setSidePanelView('list');
    setPhotoZoom(1);
    setPhotoPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - positionX, y: e.clientY - positionY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;
    const clamped = getClampedPosition(rawX, rawY, scale);
    setPositionX(clamped.x);
    setPositionY(clamped.y);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom handler on map container (Minimum scale is strictly 1.0)
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    let newScale = scale;
    if (e.deltaY < 0) {
      newScale = Math.min(scale + 0.15, 2.8);
    } else {
      newScale = Math.max(scale - 0.15, 1.0);
    }

    const clamped = getClampedPosition(positionX, positionY, newScale);
    setScale(newScale);
    setPositionX(clamped.x);
    setPositionY(clamped.y);
  };

  // Select Region Hub with Smooth Fly-to Zoom Effect
  const handleSelectRegion = (regionId: 'BAC' | 'TRUNG' | 'NAM') => {
    setActiveRegion(regionId);
    setSidePanelView('list');
    setPhotoZoom(1);
    setPhotoPan({ x: 0, y: 0 });
    const hub = HERITAGE_REGION_HUBS[regionId];
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const targetScale = hub.zoomScale || 1.6;
      const pctX = parseFloat(hub.left) / 100;
      const pctY = parseFloat(hub.top) / 100;
      const spotX = pctX * rect.width;
      const spotY = pctY * rect.height;
      const rawX = rect.width / 2 - spotX * targetScale;
      const rawY = rect.height / 2 - spotY * targetScale;
      const clamped = getClampedPosition(rawX, rawY, targetScale);
      setScale(targetScale);
      setPositionX(clamped.x);
      setPositionY(clamped.y);
    }
  };

  // Handle clicking a photo inside the side panel -> switch to Detail View
  const handleSelectSidePanelPhoto = (photo: HeritagePhotoItem) => {
    setSelectedPhoto(photo);
    setSidePanelView('detail');
    setPhotoZoom(1);
    setPhotoPan({ x: 0, y: 0 });
  };

  // Regional photo counts
  const regionalCounts = useMemo(() => {
    return {
      BAC: ALL_HERITAGE_PHOTOS.filter((p) => p.region === 'BAC').length,
      TRUNG: ALL_HERITAGE_PHOTOS.filter((p) => p.region === 'TRUNG').length,
      NAM: ALL_HERITAGE_PHOTOS.filter((p) => p.region === 'NAM').length,
    };
  }, []);

  // Filtered photos for Side Panel (Phật Giáo trước, Đời Sống sau)
  const sidePanelPhotos = useMemo(() => {
    if (!activeRegion) return [];
    const regionPhotos = ALL_HERITAGE_PHOTOS.filter((photo) => photo.region === activeRegion);

    const filtered = regionPhotos.filter((photo) => {
      if (themeFilter !== 'ALL' && photo.theme !== themeFilter) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (a.theme === 'PHAT_GIAO' && b.theme !== 'PHAT_GIAO') return -1;
      if (a.theme !== 'PHAT_GIAO' && b.theme === 'PHAT_GIAO') return 1;
      return a.yearNum - b.yearNum;
    });
  }, [activeRegion, themeFilter]);

  // AI Chat question submit
  const handleSendAiQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userText = aiQuestion.trim();
    setAiChatLog((prev) => [...prev, { role: 'user', text: userText }]);
    setAiQuestion('');

    setTimeout(() => {
      let reply = 'Tư liệu lịch sử ghi nhận sự đồng hành sâu sắc của Phật giáo Việt Nam cùng dân tộc qua các thời kỳ chấn hưng và bảo tồn văn hóa.';
      const lower = userText.toLowerCase();
      if (lower.includes('bắc') || lower.includes('hà nội') || lower.includes('một cột')) {
        reply = 'Tại Miền Bắc, các danh lam cổ tự như Chùa Một Cột, Chùa Trấn Quốc, Chùa Báo Ân và Chùa Đọ cùng hình ảnh chư Tăng đầu thế kỷ 20 thể hiện cội nguồn văn hóa nghìn năm Thăng Long.';
      } else if (lower.includes('trung') || lower.includes('huế') || lower.includes('thiên mụ')) {
        reply = 'Tại Miền Trung, Tháp Phước Duyên (Chùa Thiên Mụ) và đạo phong chư Tăng Cố đô Huế là chiếc nôi phát khởi phong trào Chấn hưng Phật giáo năm 1932.';
      } else if (lower.includes('nam') || lower.includes('sài gòn') || lower.includes('xá lợi') || lower.includes('ứng phú')) {
        reply = 'Tại Miền Nam, nghi lễ Ứng Phú Nam Bộ (1875), Chùa Xá Lợi và Hội Phật học Cần Thơ gắn liền với nhịp sống sông nước hào sảng và phong trào Phật học phương Nam.';
      }
      setAiChatLog((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 400);
  };

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[120] w-full h-full bg-[#0D0907] text-[#E3D2C1] flex flex-col justify-start overflow-hidden select-none overscroll-contain animate-in fade-in duration-300"
    >
      {/* ── HIDDEN YOUTUBE BACKGROUND MEDITATION MUSIC PLAYER (ID: V_hkbEVraSA) ── */}
      {isPlayingMusic && (
        <div className="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none">
          <iframe
            src="https://www.youtube.com/embed/V_hkbEVraSA?autoplay=1&loop=1&playlist=V_hkbEVraSA&start=7&controls=0&mute=0"
            title="Nhạc thiền tịnh tâm"
            allow="autoplay"
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          0. MÀN HÌNH CHỜ & CHÀO MỪNG TRIỂN LÃM (LOADING & WELCOME SPLASH SCREEN)
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {screenState !== 'map' && (
          <motion.div
            key="heritage-intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0907]/95 backdrop-blur-md p-4 overflow-hidden"
          >
            {/* Background Ambient Aura */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#F2C14E]/10 rounded-full blur-[140px]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(13,9,7,0.85)_100%)]" />
            </div>

            {/* STAGE 1: LOADING SCREEN */}
            {screenState === 'loading' && (
              <motion.div
                key="loading-stage"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg px-6 py-10"
              >
                {/* Rotating Dharma Wheel */}
                <div className="relative w-20 h-20 rounded-full bg-[#2C1C11] border-2 border-[#F2C14E]/70 flex items-center justify-center text-[#F2C14E] mb-6 shadow-[0_0_35px_rgba(242,193,78,0.4)]">
                  <span className="text-4xl animate-spin">☸</span>
                  <div className="absolute inset-0 -m-2 rounded-full border border-[#F2C14E]/30 animate-ping opacity-60" />
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-normal text-[#F2C14E] uppercase tracking-wider mb-2"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  ĐANG TẢI SƠ ĐỒ TRIỂN LÃM DI SẢN...
                </h3>

                <p
                  className="text-xs text-[#E3D2C1]/80 max-w-sm mb-6 leading-relaxed"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  Nạp dữ liệu không gian di sản Phật giáo & Đời sống 3 miền Bắc - Trung - Nam
                </p>

                {/* Progress Bar */}
                <div className="w-64 sm:w-80 h-2 bg-[#2C1C11] rounded-full overflow-hidden border border-[#F2C14E]/40 shadow-inner relative mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4A017] via-[#F2C14E] to-[#FFE5A3] transition-all duration-150 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>

                <span
                  className="text-xs font-bold text-[#FFE5A3]"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {loadingProgress}%
                </span>
              </motion.div>
            )}

            {/* STAGE 2: WELCOME SCREEN (MATCHING DANH TĂNG FULLSCREEN STYLE) */}
            {screenState === 'welcome' && (
              <motion.div
                key="welcome-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6"
              >
                {/* Close X button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-5 right-6 z-20 w-10 h-10 rounded-full border border-[#F2C14E]/40 bg-[#1C130D]/80 flex items-center justify-center text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black transition-all cursor-pointer shadow-lg backdrop-blur-md"
                  title="Đóng triển lãm"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                  {/* Center Glowing Symbol */}
                  <div className="w-16 h-16 rounded-full bg-[#2C1C11]/90 border-2 border-[#F2C14E] flex items-center justify-center text-[#F2C14E] mb-6 shadow-[0_0_30px_rgba(242,193,78,0.5)]">
                    <span className="text-3xl">☸</span>
                  </div>

                  <p
                    className="text-[#F2C14E] text-2xl md:text-3xl normal-case mb-2 font-normal tracking-wide"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    Triển lãm số
                  </p>

                  <h1
                    className="text-white text-5xl md:text-7xl font-normal tracking-wider mb-3 uppercase drop-shadow-[0_2px_25px_rgba(255,222,89,0.5)]"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    HOÀI NIỆM DẤU XƯA
                  </h1>

                  <p
                    className="text-[#c9b896] text-sm md:text-base mb-8 max-w-lg leading-relaxed uppercase tracking-wider"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    PHẬT GIÁO VIỆT NAM ĐỒNG HÀNH CÙNG DÂN TỘC (CUỐI TK 19 — TK 20)
                  </p>

                  <button
                    type="button"
                    onClick={handleStartExplore}
                    className="bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-sm md:text-base px-9 py-3.5 rounded-full shadow-[0_0_25px_rgba(242,193,78,0.6)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2.5 uppercase tracking-wider"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <span>BẮT ĐẦU KHÁM PHÁ</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          1. 4 COMPACT GOLDEN TOOL DOCK BUTTONS (VERTICALLY ALIGNED ALONG LEFT EDGE)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3.5 bg-[#1C130D]/90 backdrop-blur-md border border-[#F2C14E]/40 p-2 rounded-2xl shadow-2xl">
        {/* Button 1: Quay lại */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl border border-[#F2C14E]/30 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md group relative"
          title="Quay lại Bảo Tàng"
        >
          <ArrowLeft className="w-5 h-5" />
          <span
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Quay lại Bảo Tàng
          </span>
        </button>

        {/* Button 2: Xem toàn bản đồ (Reset view) */}
        <button
          type="button"
          onClick={handleResetMap}
          className="w-10 h-10 rounded-xl border border-[#F2C14E]/30 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md group relative"
          title="Xem toàn bản đồ"
        >
          <Compass className="w-5 h-5" />
          <span
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Xem toàn bản đồ
          </span>
        </button>

        {/* Button 3: Bật / Tắt Nhạc nền YouTube */}
        <button
          type="button"
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className={`w-10 h-10 rounded-xl border transition-all cursor-pointer shadow-md group relative flex items-center justify-center ${
            isPlayingMusic
              ? 'border-[#F2C14E] bg-[#F2C14E]/20 text-[#F2C14E]'
              : 'border-[#F2C14E]/30 bg-[#2C1C11]/90 text-[#C4B5A5] hover:text-[#FFE5A3]'
          }`}
          title={isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc thiền'}
        >
          {isPlayingMusic ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          <span
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {isPlayingMusic ? 'Tắt nhạc nền' : 'Bật nhạc thiền'}
          </span>
        </button>

        {/* Button 4: Trợ lý Chatbot AI */}
        <button
          type="button"
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className="w-10 h-10 rounded-xl border border-[#F2C14E]/30 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md group relative"
          title="Tham vấn Trợ lý AI"
        >
          <Bot className="w-5 h-5 text-[#F2C14E]" />
          <span
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Tham vấn Trợ lý AI
          </span>
        </button>
      </div>

      {/* ── AI CHATBOT BUBBLE OVERLAY ── */}
      <AnimatePresence>
        {isAiChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed left-20 top-1/2 -translate-y-1/2 z-50 w-80 sm:w-96 rounded-2xl border border-[#F2C14E]/40 overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(160deg, rgba(30,19,12,0.96) 0%, rgba(18,11,6,0.98) 100%)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-[#F2C14E]/25 bg-[#2C1C11]/80">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#F2C14E]" />
                <span
                  className="text-xs font-bold text-[#F2C14E] tracking-wider uppercase"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  TRỢ LÝ DI SẢN PHẬT GIÁO
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAiChatOpen(false)}
                className="text-[#FFE5A3]/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 h-64 overflow-y-auto space-y-3 text-xs leading-relaxed custom-scrollbar">
              {aiChatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-[#F2C14E]/15 border border-[#F2C14E]/30 text-[#FFE5A3] ml-4'
                      : 'bg-[#2C1C11]/80 border border-[#F2C14E]/20 text-[#E3D2C1] mr-4'
                  }`}
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendAiQuestion} className="p-2.5 border-t border-[#F2C14E]/20 bg-[#24160E] flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Hỏi về lịch sử, chùa cổ 3 miền..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#1A1009] border border-[#F2C14E]/30 text-xs text-[#E3D2C1] focus:outline-none focus:border-[#F2C14E]"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#F2C14E] text-[#1A1009] hover:bg-[#FFE5A3] font-bold text-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          2. FULLSCREEN INTERACTIVE 2D MAP VIEWPORT
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} overflow-hidden select-none pointer-events-auto bg-[#150D08]`}
      >
        <div
          className="relative w-full h-full select-none"
          style={{
            transform: `translate3d(${positionX}px, ${positionY}px, 0px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* FULL MAP IMAGE: BAN-DO-DANH-TANG-VIET-NAM-FINAL */}
          <img
            src={HERITAGE_MAP_IMAGE}
            alt="Bản đồ Di sản Phật giáo Việt Nam"
            className="w-full h-full object-cover select-none pointer-events-auto block filter brightness-95 contrast-105"
            loading="lazy"
            draggable={false}
          />

          {/* ── 3 GOLDEN REGION HUBS IDENTICAL TO DANH TANG MAP ── */}
          {(['BAC', 'TRUNG', 'NAM'] as const).map((key) => {
            const hub = HERITAGE_REGION_HUBS[key];
            const isSelected = activeRegion === hub.id;
            const count = regionalCounts[hub.id] || 0;

            return (
              <div
                key={hub.id}
                style={{ top: hub.top, left: hub.left }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRegion(hub.id);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group pointer-events-auto cursor-pointer"
              >
                <div className="relative flex flex-col items-center">
                  {/* Glowing aura */}
                  <div
                    className={`absolute inset-0 -m-3 rounded-2xl border-2 border-[#F2C14E] pointer-events-none transition-all duration-300 ${
                      isSelected
                        ? 'animate-ping opacity-90 shadow-[0_0_35px_rgba(242,193,78,0.95)]'
                        : 'animate-pulse opacity-60 shadow-[0_0_20px_rgba(242,193,78,0.6)]'
                    }`}
                  />

                  {/* Golden Glassmorphic Hub Badge */}
                  <div
                    className={`relative px-5 py-2.5 rounded-2xl border-2 backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#2C1C11] border-[#ffde59] text-[#ffde59] scale-110 shadow-[0_0_30px_rgba(242,193,78,0.9)]'
                        : 'bg-[#1C130D]/90 border-[#F2C14E] text-[#FFE5A3] shadow-[0_0_20px_rgba(242,193,78,0.6)] hover:scale-105'
                    }`}
                  >
                    <span
                      className="text-xs md:text-sm font-bold tracking-widest uppercase text-[#F2C14E]"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {hub.name}
                    </span>
                    <span
                      className="text-[11px] text-[#FFE5A3] font-bold mt-0.5"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {count > 0 ? `${count} TƯ LIỆU QUÝ` : hub.countLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DISCLAIMER WATERMARK AT BOTTOM ── */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-[11px] text-[#FFE5A3]/50 italic text-center px-4"
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          * Hình ảnh sơ đồ tạo bởi Gemini AI chỉ mang tính minh họa
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. SLIDE-OUT SIDE PANEL (IDENTICAL UX TO DANH TANG MAP)
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeRegion && (
          <motion.aside
            onWheel={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] z-40 overflow-y-auto border-l border-[#F2C14E]/40 flex flex-col justify-between shadow-[-20px_0_60px_rgba(0,0,0,0.95)]"
            style={{
              background: 'linear-gradient(160deg, rgba(44,28,17,0.98) 0%, rgba(28,18,11,0.99) 100%)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* ── MODE 1: LIST VIEW ── */}
            {sidePanelView === 'list' && (
              <div className="flex flex-col h-full justify-between">
                {/* Header */}
                <div className="p-6 border-b border-[#F2C14E]/30 bg-[#2C1C11]/80 space-y-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-2xl md:text-3xl font-normal text-[#F2C14E] uppercase tracking-wider"
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                      >
                        TƯ LIỆU {HERITAGE_REGION_HUBS[activeRegion].name}
                      </h3>
                      <p
                        className="text-xs text-[#FFE5A3]/90 font-bold mt-0.5"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {sidePanelPhotos.length} tư liệu hình ảnh lịch sử
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetMap}
                      className="w-8 h-8 rounded-full bg-black/60 border border-[#F2C14E]/40 text-[#F2C14E] flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-md"
                      title="Đóng Bảng"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Theme filter tabs (Phật Giáo trước, Đời Sống sau) */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {[
                      { id: 'ALL', label: 'TẤT CẢ' },
                      { id: 'PHAT_GIAO', label: 'PHẬT GIÁO' },
                      { id: 'DOI_SONG', label: 'ĐỜI SỐNG' },
                    ].map((f) => {
                      const isSelected = themeFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setThemeFilter(f.id as any)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#F2C14E] text-[#1C130D]'
                              : 'bg-[#2A1D14] text-[#C4B5A5] hover:text-[#FFE5A3] border border-[#F2C14E]/20'
                          }`}
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Photo List (Identical Card Layout to DanhTangMap) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3.5 custom-scrollbar">
                  {sidePanelPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => handleSelectSidePanelPhoto(photo)}
                      className="p-3.5 rounded-2xl border bg-[#25170E]/90 border-[#F2C14E]/30 hover:border-[#F2C14E] hover:bg-[#352215] transition-all duration-300 cursor-pointer flex gap-4 items-center shadow-lg group"
                    >
                      {/* Thumbnail Frame */}
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden border-2 border-[#F2C14E]/50 shrink-0 bg-[#1A120B] shadow-md group-hover:border-[#F2C14E]">
                        <img
                          src={photo.imgUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4
                            className="text-xl md:text-2xl font-normal text-[#F2C14E] group-hover:text-white transition-colors truncate"
                            style={{ fontFamily: "'UTM Niagara', serif" }}
                          >
                            {photo.title}
                          </h4>
                          <p
                            className="text-xs text-[#FFE5A3]/90 font-bold truncate mb-1.5"
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          >
                            {photo.yearStr} • {photo.locationName}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              photo.theme === 'PHAT_GIAO'
                                ? 'bg-[#F2C14E]/15 text-[#F2C14E] border border-[#F2C14E]/40'
                                : 'bg-[#264E4C]/60 text-[#8CE8DE] border border-[#8CE8DE]/40'
                            }`}
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          >
                            {photo.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div
                  className="p-4 border-t border-[#F2C14E]/20 bg-[#170E08] text-center"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  <p className="text-[11px] text-[#C4B5A5] italic">
                    Nhấp vào từng tư liệu để xem chi tiết
                  </p>
                </div>
              </div>
            )}

            {/* ── MODE 2: DETAIL VIEW (WITH INTERACTIVE ZOOM & DRAG ON PHOTO) ── */}
            {sidePanelView === 'detail' && selectedPhoto && (
              <div className="flex flex-col h-full justify-between animate-in fade-in">
                {/* Header */}
                <div className="p-6 border-b border-[#F2C14E]/30 bg-[#2C1C11]/80 flex items-center justify-between flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSidePanelView('list');
                      setPhotoZoom(1);
                      setPhotoPan({ x: 0, y: 0 });
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2C1C11] border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-md"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>QUAY LẠI DANH SÁCH</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetMap}
                      className="w-8 h-8 rounded-full bg-black/60 border border-[#F2C14E]/40 text-[#F2C14E] flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Detail Content Card */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                  <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-[#F2C14E]/40 bg-[#25170E] shadow-2xl">
                    {/* Main Interactive Zoomable & Draggable Photo Frame with Mouse Wheel Support */}
                    <div
                      onWheel={(e) => {
                        e.stopPropagation();
                        if (e.deltaY < 0) {
                          setPhotoZoom((z) => Math.min(z + 0.25, 3.5));
                        } else {
                          setPhotoZoom((z) => {
                            const nextZ = Math.max(z - 0.25, 1);
                            if (nextZ <= 1.1) setPhotoPan({ x: 0, y: 0 });
                            return nextZ;
                          });
                        }
                      }}
                      className="relative w-full h-72 rounded-2xl overflow-hidden border-2 border-[#F2C14E] shadow-2xl mb-4 bg-black/70 flex items-center justify-center select-none group/photo"
                    >
                      <div
                        onMouseDown={(e) => {
                          if (photoZoom > 1) {
                            setIsPhotoDragging(true);
                            photoDragStartRef.current = { x: e.clientX - photoPan.x, y: e.clientY - photoPan.y };
                          }
                        }}
                        onMouseMove={(e) => {
                          if (isPhotoDragging && photoZoom > 1) {
                            setPhotoPan({
                              x: e.clientX - photoDragStartRef.current.x,
                              y: e.clientY - photoDragStartRef.current.y,
                            });
                          }
                        }}
                        onMouseUp={() => setIsPhotoDragging(false)}
                        onMouseLeave={() => setIsPhotoDragging(false)}
                        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                        style={{
                          transform: `translate(${photoPan.x}px, ${photoPan.y}px) scale(${photoZoom})`,
                          transition: isPhotoDragging ? 'none' : 'transform 0.2s ease-out',
                        }}
                      >
                        <img
                          src={selectedPhoto.imgUrl}
                          alt={selectedPhoto.title}
                          className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-2xl"
                          loading="lazy"
                        />
                      </div>

                      {/* Photo Zoom Controls Floating Toolbar */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-[#1A1009]/85 backdrop-blur-md p-1 rounded-xl border border-[#F2C14E]/40 z-20 shadow-lg">
                        <button
                          type="button"
                          onClick={() => setPhotoZoom((z) => Math.min(z + 0.35, 3.5))}
                          className="p-1.5 rounded-lg text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1A1009] transition-all cursor-pointer"
                          title="Phóng to ảnh (hoặc lăn chuột)"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoZoom((z) => {
                              const nextZ = Math.max(z - 0.35, 1);
                              if (nextZ <= 1.1) setPhotoPan({ x: 0, y: 0 });
                              return nextZ;
                            });
                          }}
                          className="p-1.5 rounded-lg text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1A1009] transition-all cursor-pointer"
                          title="Thu nhỏ ảnh (hoặc lăn chuột)"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoZoom(1);
                            setPhotoPan({ x: 0, y: 0 });
                          }}
                          className="p-1.5 rounded-lg text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1A1009] transition-all cursor-pointer"
                          title="Đặt lại khung hình"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Clean Title in UTM Niagara font-normal */}
                    <h3
                      className="text-3xl md:text-4xl font-normal text-[#F2C14E] uppercase tracking-wide leading-tight mb-1"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      {selectedPhoto.title}
                    </h3>

                    <p
                      className="text-xs text-[#FFE5A3] font-bold mb-3"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      Niên đại: {selectedPhoto.yearStr} • Địa danh: {selectedPhoto.locationName}
                    </p>

                    {/* Tag badges */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border text-[#F2C14E] border-[#F2C14E]/40 bg-[#F2C14E]/10"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {selectedPhoto.category}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border text-[#FFE5A3] border-[#FFE5A3]/40 bg-[#FFE5A3]/10"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {selectedPhoto.theme === 'PHAT_GIAO' ? 'Phật Giáo' : 'Đời Sống Xưa'}
                      </span>
                    </div>

                    {/* Golden divider */}
                    <div className="h-[1px] w-3/5 bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent my-2" />

                    {/* Caption */}
                    {selectedPhoto.caption && (
                      <p
                        className="text-xs md:text-sm text-[#D3C0AD] leading-relaxed text-justify mt-2"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {selectedPhoto.caption}
                      </p>
                    )}

                    {/* Historical Context Callout */}
                    {selectedPhoto.historicalContext && (
                      <blockquote
                        className="w-full border-l-2 border-[#F2C14E] bg-[#3a2718]/80 p-3.5 italic text-xs md:text-sm text-[#FFE5A3] rounded-r-xl leading-relaxed text-left mt-4 shadow-md"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        <span className="text-[#F2C14E] font-bold not-italic text-[10px] uppercase tracking-wider block mb-1">
                          Bối Cảnh Lịch Sử &amp; Giá Trị Di Sản
                        </span>
                        "{selectedPhoto.historicalContext}"
                      </blockquote>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};
