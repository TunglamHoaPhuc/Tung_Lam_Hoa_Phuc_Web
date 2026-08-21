'use client';

import React, { FC, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Layers,
  Eye,
  Info,
  ArrowLeft,
  Volume2,
  VolumeX,
  MessageCircle,
  ArrowRight,
  Send,
} from 'lucide-react';
import {
  BAO_THAP_FLOORS,
  BAO_THAP_MAP_IMAGE,
  BAO_THAP_BANNER_IMAGE,
  BaoThapFloor,
} from '@/data/bao-thap-data';

interface BaoThapMap2DProps {
  onClose: () => void;
}

export const BaoThapMap2D: FC<BaoThapMap2DProps> = ({ onClose }) => {
  // Screen Stage States ('loading' | 'welcome' | 'map')
  const [screenState, setScreenState] = useState<'loading' | 'welcome' | 'map'>('loading');
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  
  // Side Panel initially NULL (không hiện khi mới vào, chỉ hiện khi click)
  const [selectedFloor, setSelectedFloor] = useState<BaoThapFloor | null>(null);
  const [activeTab, setActiveTab] = useState<'mandala' | 'statue'>('mandala');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  // Map transform states
  const [scale, setScale] = useState<number>(1);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Background Meditation Music (YouTube ID: V_hkbEVraSA)
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);

  // AI Chat Assistant State
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiChatLog, setAiChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'A Di Đà Phật! Tôi là Trợ lý Bảo Tháp Vạn Phật Xá Lợi Hòa Bình. Bạn muốn tìm hiểu về tầng tháp nào hoặc ý nghĩa của Mạn Đà La?',
    },
  ]);

  // Lightbox Zoom state
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [lightboxPan, setLightboxPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isLightboxDragging, setIsLightboxDragging] = useState<boolean>(false);
  const lightboxDragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. Loading screen progress simulation & asset preloading
  useEffect(() => {
    if (screenState !== 'loading') return;

    const img = new Image();
    img.src = BAO_THAP_MAP_IMAGE;
    const bannerImg = new Image();
    bannerImg.src = BAO_THAP_BANNER_IMAGE;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScreenState('welcome'), 200);
          return 100;
        }
        return prev + 8;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [screenState]);

  // Lock body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
          setLightboxZoom(1);
          setLightboxPan({ x: 0, y: 0 });
        } else if (isAiChatOpen) {
          setIsAiChatOpen(false);
        } else if (selectedFloor) {
          setSelectedFloor(null);
          handleResetMap();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, lightboxImage, isAiChatOpen, selectedFloor]);

  // Map Zoom & Pan calculation helper (clamping strictly within bounds - ZERO black borders!)
  const getClampedPosition = (rawX: number, rawY: number, targetScale: number) => {
    if (!containerRef.current) return { x: rawX, y: rawY };
    const rect = containerRef.current.getBoundingClientRect();
    if (targetScale <= 1) return { x: 0, y: 0 };

    const minX = rect.width * (1 - targetScale);
    const maxX = 0;
    const minY = rect.height * (1 - targetScale);
    const maxY = 0;

    return {
      x: Math.min(maxX, Math.max(minX, rawX)),
      y: Math.min(maxY, Math.max(minY, rawY)),
    };
  };

  // Reset map view
  const handleResetMap = () => {
    setScale(1);
    setPositionX(0);
    setPositionY(0);
  };

  // Pan / Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - positionX, y: e.clientY - positionY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    const rawX = e.clientX - dragStartRef.current.x;
    const rawY = e.clientY - dragStartRef.current.y;
    const clamped = getClampedPosition(rawX, rawY, scale);
    setPositionX(clamped.x);
    setPositionY(clamped.y);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!containerRef.current) return;
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;
    const newScale = Math.min(Math.max(1, scale * zoomFactor), 3.0);

    if (newScale === 1) {
      setScale(1);
      setPositionX(0);
      setPositionY(0);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const newX = cursorX - (cursorX - positionX) * (newScale / scale);
    const newY = cursorY - (cursorY - positionY) * (newScale / scale);

    const clamped = getClampedPosition(newX, newY, newScale);
    setScale(newScale);
    setPositionX(clamped.x);
    setPositionY(clamped.y);
  };

  // Auto Zoom directly to tower floor center when floor is selected
  const handleSelectFloorWithZoom = (floor: BaoThapFloor) => {
    setSelectedFloor(floor);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Zoom factor
    const targetScale = 1.8;
    
    // Tower X coordinate is 49.3%
    // If side panel is shown on desktop (width ~ 420px), target center is slightly shifted left of visible area
    const isDesktop = rect.width >= 1024;
    const visibleWidth = isDesktop ? rect.width - 420 : rect.width;
    const targetCenterX = visibleWidth / 2;
    const targetCenterY = rect.height / 2;

    const towerPixelX = (floor.hotspot.x / 100) * rect.width;
    const floorPixelY = (floor.hotspot.y / 100) * rect.height;

    const newX = targetCenterX - towerPixelX * targetScale;
    const newY = targetCenterY - floorPixelY * targetScale;

    const clamped = getClampedPosition(newX, newY, targetScale);
    setScale(targetScale);
    setPositionX(clamped.x);
    setPositionY(clamped.y);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // AI Chat question submit
  const handleSendAiQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userText = aiQuestion.trim();
    setAiChatLog((prev) => [...prev, { role: 'user', text: userText }]);
    setAiQuestion('');

    setTimeout(() => {
      let reply =
        'Bảo Tháp Vạn Phật Xá Lợi Hòa Bình gồm 5 tầng tháp thiêng liêng, mỗi tầng tôn thờ chư Phật, Bồ Tát và 1 Đại Mạn Đà La Mật Tông gia trì bình an cho muôn loài.';
      const lower = userText.toLowerCase();
      if (lower.includes('tầng 1') || lower.includes('quan âm') || lower.includes('thiên thủ')) {
        reply =
          'Tầng 1 tôn trí tượng Quan Âm Thiên Thủ Thiên Nhãn và Mạn Đà La Quan Âm Bồ Tát, biểu trưng cho Đại Bi Tâm cứu khổ cứu nạn muôn loài.';
      } else if (lower.includes('tầng 2') || lower.includes('đại nhật') || lower.includes('cực lạc')) {
        reply =
          'Tầng 2 tôn thờ Đức Phật Đại Nhật Như Lai cùng cảnh giới Mạn Đà La Tây Phương Cực Lạc, dẫn dắt hành giả về cõi an vui thanh tịnh.';
      } else if (lower.includes('tầng 3') || lower.includes('thích ca') || lower.includes('đa bảo') || lower.includes('pháp hoa')) {
        reply =
          'Tầng 3 tái hiện sự tích tháp Phật Đa Bảo ấn chứng kinh Diệu Pháp Liên Hoa của Đức Phật Thích Ca Mâu Ni, cùng Mạn Đà La Đa Bảo Như Lai nhiệm màu.';
      } else if (lower.includes('tầng 4') || lower.includes('tam thế') || lower.includes('mahakala')) {
        reply =
          'Tầng 4 tôn thờ Tam Thế Chư Phật ba đời cùng Mạn Đà La Đại Hắc Thiên Mahakala - vị Hộ Pháp uy mãnh hộ trì chánh pháp trường tồn.';
      } else if (lower.includes('tầng 5') || lower.includes('đỉnh tháp') || lower.includes('xá lợi') || lower.includes('srilanka') || lower.includes('kalachakra')) {
        reply =
          'Tầng 5 là đỉnh cao nhất của tháp báu, nơi tôn trí Bảo Tháp Xá Lợi Phật Srilanka thiêng liêng và Mạn Đà La Thập Chủng Tử Kalachakra (Thời Luân Kim Cương) kết tinh năng lượng hòa bình.';
      }
      setAiChatLog((prev) => [...prev, { role: 'assistant', text: reply }]);
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[200] w-full h-full bg-[#0D0907] text-[#E3D2C1] flex flex-col justify-start overflow-hidden select-none overscroll-contain animate-in fade-in duration-300"
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
          0. MÀN HÌNH CHỜ & CHÀO MỪNG (DANH TĂNG STYLE FULLSCREEN WELCOME)
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {screenState !== 'map' && (
          <motion.div
            key="baothap-intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0907]/95 backdrop-blur-md p-4 overflow-hidden"
          >
            {/* Background Ambient Aura & Banner */}
            <div className="absolute inset-0 z-0 bg-[#2c1c11]">
              <img
                src={BAO_THAP_BANNER_IMAGE}
                alt="Bảo Tháp Vạn Phật Xá Lợi"
                className="w-full h-full object-cover scale-105 blur-sm opacity-50"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0907] via-[#0D0907]/75 to-black/60" />
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
                  ĐANG TẢI SƠ ĐỒ BẢO THÁP...
                </h3>

                <p
                  className="text-xs text-[#E3D2C1]/80 max-w-sm mb-6 leading-relaxed"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  Khởi tạo không gian 5 tầng tháp &amp; Mạn Đà La Mật Tông
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
                  title="Đóng sơ đồ"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
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
                    className="text-white text-4xl sm:text-6xl md:text-7xl font-normal tracking-wider mb-4 uppercase drop-shadow-[0_2px_25px_rgba(255,222,89,0.6)] leading-tight"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    BẢO THÁP VẠN PHẬT XÁ LỢI HÒA BÌNH
                  </h1>

                  <p
                    className="text-[#c9b896] text-xs sm:text-sm md:text-base mb-8 max-w-2xl leading-relaxed uppercase tracking-wider font-bold"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    KHÁM PHÁ 5 TẦNG THÁP UY NGHIÊM, CHIÊM BÁI BẢO TƯỢNG VÀ TÌM HIỂU Ý NGHĨA 5 ĐẠI MẠN ĐÀ LA MẬT TÔNG
                  </p>

                  <button
                    type="button"
                    onClick={() => setScreenState('map')}
                    className="bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-sm md:text-base px-9 py-3.5 rounded-full shadow-[0_0_30px_rgba(242,193,78,0.7)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2.5 uppercase tracking-wider"
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
      ══════════════════════════════════════════════ */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 bg-[#1C130D]/90 backdrop-blur-md border border-[#F2C14E]/40 p-2 rounded-2xl shadow-2xl">
        {/* Button 1: Quay lại */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl border border-[#F2C14E]/30 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md group relative"
          title="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
          <span
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Quay lại
          </span>
        </button>

        {/* Button 2: Xem toàn bản đồ (Reset view) */}
        <button
          type="button"
          onClick={() => {
            handleResetMap();
            setSelectedFloor(null);
          }}
          className="w-10 h-10 rounded-xl border border-[#F2C14E]/30 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md group relative"
          title="Xem toàn tháp"
        >
          <Compass className="w-5 h-5" />
          <span
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Xem toàn tháp
          </span>
        </button>

        {/* Button 3: Bật / Tắt Nhạc thiền */}
        <button
          type="button"
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className={`w-10 h-10 rounded-xl border transition-all cursor-pointer shadow-md group relative flex items-center justify-center ${
            isPlayingMusic
              ? 'border-[#F2C14E] bg-[#F2C14E] text-[#2A1D14] shadow-[0_0_15px_rgba(242,193,78,0.5)]'
              : 'border-[#F2C14E]/30 bg-[#2C1C11]/90 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14]'
          }`}
          title={isPlayingMusic ? 'Tắt nhạc thiền' : 'Bật nhạc thiền'}
        >
          {isPlayingMusic ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          <span
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {isPlayingMusic ? 'Tắt nhạc thiền' : 'Bật nhạc thiền'}
          </span>
        </button>

        {/* Button 4: Trợ lý AI */}
        <button
          type="button"
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className={`w-10 h-10 rounded-xl border transition-all cursor-pointer shadow-md group relative flex items-center justify-center ${
            isAiChatOpen
              ? 'border-[#F2C14E] bg-[#F2C14E] text-[#2A1D14] shadow-[0_0_15px_rgba(242,193,78,0.5)]'
              : 'border-[#F2C14E]/30 bg-[#2C1C11]/90 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14]'
          }`}
          title="Trợ lý AI Bảo Tháp"
        >
          <MessageCircle className="w-5 h-5" />
          <span
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Trợ lý AI
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. MINIMAL FLOATING TOP-RIGHT CONTROLS (FULLSCREEN & CLOSE)
      ══════════════════════════════════════════════ */}
      <div className="absolute top-5 right-6 z-40 flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          className="w-10 h-10 rounded-full bg-[#1C130D]/80 border border-[#F2C14E]/40 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
        <button
          onClick={onClose}
          title="Đóng sơ đồ"
          className="w-10 h-10 rounded-full bg-[#1C130D]/80 border border-[#F2C14E]/40 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. MAIN FULLSCREEN MAP WORKSPACE & SLIDE-IN SIDE PANEL
      ══════════════════════════════════════════════ */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* MAP CANVAS CONTAINER (100% WIDTH & HEIGHT FULLSCREEN) */}
        <div
          className="w-full h-full relative bg-[#0D0805] overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {/* Zoomable / Pannable Map Layer */}
          <div
            className="w-full h-full relative origin-top-left"
            style={{
              transform: `scale(${scale}) translate(${positionX / scale}px, ${positionY / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* FULL COVER MAP IMAGE - ZERO BLACK GAPS */}
            <img
              src={BAO_THAP_MAP_IMAGE}
              alt="Sơ đồ Bảo Tháp"
              className="w-full h-full object-cover pointer-events-none select-none"
            />

            {/* 1. ARTISTIC CIRCULAR HOTSPOT PINS ON TOWER FLOORS (CHẤM VÀNG NGHỆ THUẬT TRÒN PHÁT SÁNG NHẸ VIỀN) */}
            {BAO_THAP_FLOORS.map((floor) => {
              const isSelected = selectedFloor?.id === floor.id;
              return (
                <div
                  key={`pin-${floor.id}`}
                  style={{
                    left: `${floor.hotspot.x}%`,
                    top: `${floor.hotspot.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-25"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFloorWithZoom(floor);
                    }}
                    className="relative group cursor-pointer flex items-center justify-center p-1"
                  >
                    {/* Glowing radiant halo when selected */}
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#F2C14E]/50 via-[#FFDE59]/30 to-[#F2C14E]/50 blur-sm animate-pulse" />
                    )}

                    {/* Circular Bead Body */}
                    <div
                      className={`rounded-full transition-all duration-500 flex items-center justify-center ${
                        isSelected
                          ? 'w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#FFF5D0] via-[#F2C14E] to-[#D4A017] border-2 border-white shadow-[0_0_30px_rgba(242,193,78,1),0_0_15px_#FFFFFF] scale-120'
                          : 'w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-[#FFE5A3] via-[#F2C14E] to-[#996515] border border-white/90 shadow-[0_0_15px_rgba(242,193,78,0.85)] group-hover:scale-135 group-hover:border-white'
                      }`}
                    >
                      {/* Inner core dot */}
                      <div
                        className={`rounded-full transition-all duration-300 ${
                          isSelected ? 'w-2.5 h-2.5 bg-[#1C120B]' : 'w-1.5 h-1.5 bg-[#1C120B]/90'
                        }`}
                      />
                    </div>
                  </button>
                </div>
              );
            })}

            {/* 2. 5 FLOORS INTERACTIVE PILL BUTTONS (CONNECTED TO THE RIGHT) */}
            {BAO_THAP_FLOORS.map((floor) => {
              const isSelected = selectedFloor?.id === floor.id;
              const buttonX = floor.hotspot.x + 8.5;
              const buttonY = floor.hotspot.y;

              return (
                <div
                  key={`btn-${floor.id}`}
                  style={{
                    left: `${buttonX}%`,
                    top: `${buttonY}%`,
                  }}
                  className="absolute -translate-y-1/2 z-20"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFloorWithZoom(floor);
                    }}
                    className={`group cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#F2C14E] text-black border-white shadow-[0_0_35px_rgba(242,193,78,1)] scale-115 font-extrabold'
                        : 'bg-[#1C120B]/90 text-[#FFDE59] border-[#F2C14E]/80 hover:bg-[#F2C14E] hover:text-black shadow-[0_0_20px_rgba(0,0,0,0.9)] hover:scale-110'
                    }`}
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    {/* Glowing pulse dot */}
                    <span className="relative flex h-2.5 w-2.5">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isSelected ? 'bg-black' : 'bg-[#FFDE59]'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          isSelected ? 'bg-black' : 'bg-[#FFDE59]'
                        }`}
                      />
                    </span>

                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                      {floor.floorName}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            4. SLIDE-IN SIDE PANEL (CHỈ HIỆN KHI CLICK VÀO TẦNG)
        ══════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedFloor && (
            <motion.aside
              key="baothap-side-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] lg:w-[460px] bg-gradient-to-b from-[#24160D] via-[#1C120B] to-[#120A06] border-l border-[#F2C14E]/40 z-50 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#F2C14E]/30 bg-[#2A1B10]/80 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="px-3.5 py-1 rounded-full bg-[#1C120B] border border-[#F2C14E]/60 text-xs font-bold text-[#F2C14E] uppercase tracking-wider"
                  >
                    CHI TIẾT {selectedFloor.floorName}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Floor */}
                    <button
                      onClick={() => {
                        const idx = BAO_THAP_FLOORS.findIndex((f) => f.id === selectedFloor.id);
                        handleSelectFloorWithZoom(
                          BAO_THAP_FLOORS[(idx - 1 + BAO_THAP_FLOORS.length) % BAO_THAP_FLOORS.length]
                        );
                      }}
                      title="Tầng trước"
                      className="w-8 h-8 rounded-xl bg-[#1C120B] border border-[#F2C14E]/30 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Next Floor */}
                    <button
                      onClick={() => {
                        const idx = BAO_THAP_FLOORS.findIndex((f) => f.id === selectedFloor.id);
                        handleSelectFloorWithZoom(
                          BAO_THAP_FLOORS[(idx + 1) % BAO_THAP_FLOORS.length]
                        );
                      }}
                      title="Tầng tiếp theo"
                      className="w-8 h-8 rounded-xl bg-[#1C120B] border border-[#F2C14E]/30 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Close Side Panel */}
                    <button
                      onClick={() => {
                        setSelectedFloor(null);
                        handleResetMap();
                      }}
                      title="Đóng chi tiết"
                      className="w-8 h-8 rounded-xl bg-[#1C120B] border border-[#F2C14E]/60 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h2
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-3xl sm:text-4xl text-[#FFDE59] uppercase tracking-wide mt-2.5 leading-tight drop-shadow-[0_0_15px_rgba(255,222,89,0.5)]"
                >
                  {activeTab === 'mandala' ? selectedFloor.mandalaName : selectedFloor.statueName}
                </h2>

                <p
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs text-[#FFE5A3]/90 font-bold mt-1"
                >
                  {activeTab === 'mandala' ? `Trần Mạn Đà La — ${selectedFloor.floorName}` : selectedFloor.statueSubtitle}
                </p>
              </div>

              {/* Visual Switcher Tabs */}
              <div className="px-5 pt-4">
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#150D07] rounded-2xl border border-[#F2C14E]/30">
                  <button
                    type="button"
                    onClick={() => setActiveTab('mandala')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'mandala'
                        ? 'bg-[#F2C14E] text-black shadow-md font-extrabold'
                        : 'text-[#FFE5A3]/80 hover:text-[#F2C14E]'
                    }`}
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>TRẦN MANDALA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('statue')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'statue'
                        ? 'bg-[#F2C14E] text-black shadow-md font-extrabold'
                        : 'text-[#FFE5A3]/80 hover:text-[#F2C14E]'
                    }`}
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>TÔN TƯỢNG PHẬT</span>
                  </button>
                </div>
              </div>

              {/* Image Box */}
              <div className="p-5 space-y-4">
                <div
                  onClick={() => {
                    const src =
                      activeTab === 'mandala' ? selectedFloor.mandalaImg : selectedFloor.statueImg;
                    const title =
                      activeTab === 'mandala'
                        ? selectedFloor.mandalaName
                        : selectedFloor.statueName;
                    const subtitle =
                      activeTab === 'mandala'
                        ? `Mạn Đà La Trần Tháp - ${selectedFloor.floorName}`
                        : selectedFloor.statueSubtitle;
                    setLightboxImage({ src, title, subtitle });
                    setLightboxZoom(1);
                    setLightboxPan({ x: 0, y: 0 });
                  }}
                  className="relative h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border-2 border-[#F2C14E]/50 bg-[#120A06] cursor-pointer group shadow-xl"
                >
                  <img
                    src={activeTab === 'mandala' ? selectedFloor.mandalaImg : selectedFloor.statueImg}
                    alt={activeTab === 'mandala' ? selectedFloor.mandalaName : selectedFloor.statueName}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                    <span
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="px-4 py-1 rounded-full bg-[#F2C14E] text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem phóng to chi tiết</span>
                    </span>
                  </div>
                </div>

                {/* Description Content Conditioned on Active Tab */}
                <div className="space-y-3.5">
                  {/* TAB MANDALA: CHỈ HIỂN THỊ Ý NGHĨA MANDALA */}
                  {activeTab === 'mandala' && (
                    <div className="p-4 rounded-2xl bg-[#1C120B]/80 border border-[#F2C14E]/30 space-y-2 shadow-md">
                      <div className="flex items-center gap-2 text-[#FFDE59]">
                        <Sparkles className="w-4 h-4 text-[#F2C14E]" />
                        <h4
                          style={{ fontFamily: "'UTM Niagara', serif" }}
                          className="text-2xl uppercase tracking-wider"
                        >
                          Ý NGHĨA MẠN ĐÀ LA
                        </h4>
                      </div>
                      <p
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-xs sm:text-sm text-[#E3D2C1]/90 leading-relaxed"
                      >
                        {selectedFloor.mandalaMeaning}
                      </p>
                    </div>
                  )}

                  {/* TAB TÔN TƯỢNG: CHỈ HIỂN THỊ TÔN TƯỢNG TẠI KHU TẦNG & Ý NGHĨA */}
                  {activeTab === 'statue' && (
                    <>
                      <div className="p-4 rounded-2xl bg-[#1C120B]/80 border border-[#F2C14E]/30 space-y-2 shadow-md">
                        <div className="flex items-center gap-2 text-[#FFDE59]">
                          <Layers className="w-4 h-4 text-[#F2C14E]" />
                          <h4
                            style={{ fontFamily: "'UTM Niagara', serif" }}
                            className="text-2xl uppercase tracking-wider"
                          >
                            TÔN TƯỢNG TẠI KHU TẦNG
                          </h4>
                        </div>
                        <p
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-xs sm:text-sm text-[#E3D2C1]/90 leading-relaxed"
                        >
                          {selectedFloor.statueDescription}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#1C120B]/80 border border-[#F2C14E]/30 space-y-2 shadow-md">
                        <div className="flex items-center gap-2 text-[#FFDE59]">
                          <Info className="w-4 h-4 text-[#F2C14E]" />
                          <h4
                            style={{ fontFamily: "'UTM Niagara', serif" }}
                            className="text-2xl uppercase tracking-wider"
                          >
                            Ý NGHĨA TÂM LINH
                          </h4>
                        </div>
                        <p
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="text-xs sm:text-sm text-[#E3D2C1]/90 leading-relaxed italic"
                        >
                          "{selectedFloor.stories}"
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. AI ASSISTANT CHAT POPUP (RIGHT DOCK)
      ══════════════════════════════════════════════ */}
      {isAiChatOpen && (
        <div className="fixed bottom-6 left-18 z-50 w-80 sm:w-96 rounded-3xl bg-[#1C120B]/95 border-2 border-[#F2C14E] shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col backdrop-blur-md">
          {/* Header */}
          <div className="p-4 border-b border-[#F2C14E]/30 bg-[#2A1D14] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl text-[#F2C14E]">☸</span>
              <h3
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-xl text-[#FFDE59] uppercase tracking-wider"
              >
                TRỢ LÝ AI BẢO THÁP
              </h3>
            </div>
            <button
              onClick={() => setIsAiChatOpen(false)}
              className="w-7 h-7 rounded-full bg-[#1C120B] border border-[#F2C14E]/30 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto text-xs">
            {aiChatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl ${
                  msg.role === 'assistant'
                    ? 'bg-[#2A1D14] border border-[#F2C14E]/30 text-[#FFE5A3]'
                    : 'bg-[#F2C14E] text-[#1C120B] font-bold ml-6'
                }`}
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendAiQuestion} className="p-3 border-t border-[#F2C14E]/30 flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Hỏi về tầng tháp, mandala..."
              className="flex-1 bg-[#120A06] border border-[#F2C14E]/40 rounded-xl px-3 py-2 text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-[#F2C14E] text-black font-bold hover:bg-[#FFDE59] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          6. INTERACTIVE ZOOMABLE & DRAGGABLE LIGHTBOX FOR STATUE / MANDALA
      ══════════════════════════════════════════════ */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[250] bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            setLightboxImage(null);
            setLightboxZoom(1);
            setLightboxPan({ x: 0, y: 0 });
          }}
          onWheel={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.deltaY < 0) {
              setLightboxZoom((prev) => Math.min(prev + 0.25, 4));
            } else {
              setLightboxZoom((prev) => {
                const next = Math.max(prev - 0.25, 1);
                if (next === 1) setLightboxPan({ x: 0, y: 0 });
                return next;
              });
            }
          }}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl overflow-hidden border-2 border-[#F2C14E] bg-[#1C120B] p-4 sm:p-6 shadow-[0_0_80px_rgba(242,193,78,0.4)] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setLightboxImage(null);
                setLightboxZoom(1);
                setLightboxPan({ x: 0, y: 0 });
              }}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 border border-[#F2C14E]/60 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="w-full text-center pb-3 border-b border-[#F2C14E]/30 mb-3">
              <h3
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-3xl sm:text-4xl text-[#FFDE59] uppercase tracking-wide"
              >
                {lightboxImage.title}
              </h3>
              <p
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-xs text-[#FFE5A3] font-bold mt-0.5"
              >
                {lightboxImage.subtitle}
              </p>
            </div>

            {/* Image Canvas with Drag & Zoom */}
            <div
              className="relative w-full h-[360px] sm:h-[480px] rounded-2xl overflow-hidden bg-black/70 flex items-center justify-center"
              onMouseDown={(e) => {
                if (lightboxZoom <= 1) return;
                setIsLightboxDragging(true);
                lightboxDragStart.current = { x: e.clientX - lightboxPan.x, y: e.clientY - lightboxPan.y };
              }}
              onMouseMove={(e) => {
                if (!isLightboxDragging || lightboxZoom <= 1) return;
                setLightboxPan({
                  x: e.clientX - lightboxDragStart.current.x,
                  y: e.clientY - lightboxDragStart.current.y,
                });
              }}
              onMouseUp={() => setIsLightboxDragging(false)}
              onMouseLeave={() => setIsLightboxDragging(false)}
              style={{ cursor: lightboxZoom > 1 ? (isLightboxDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-full max-w-full object-contain rounded-xl select-none pointer-events-none"
                style={{
                  transform: `scale(${lightboxZoom}) translate(${lightboxPan.x / lightboxZoom}px, ${lightboxPan.y / lightboxZoom}px)`,
                  transition: isLightboxDragging ? 'none' : 'transform 0.2s ease-out',
                }}
              />

              {/* Lightbox Zoom Controls */}
              <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-[#1C120B]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#F2C14E]/40 shadow-xl">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.min(prev + 0.3, 4))}
                  className="w-7 h-7 rounded-lg bg-[#2A1A0E] hover:bg-[#F2C14E] text-[#FFDE59] hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  title="Phóng to"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxZoom((prev) => {
                      const next = Math.max(prev - 0.3, 1);
                      if (next === 1) setLightboxPan({ x: 0, y: 0 });
                      return next;
                    });
                  }}
                  className="w-7 h-7 rounded-lg bg-[#2A1A0E] hover:bg-[#F2C14E] text-[#FFDE59] hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                {lightboxZoom !== 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxZoom(1);
                      setLightboxPan({ x: 0, y: 0 });
                    }}
                    className="w-7 h-7 rounded-lg bg-[#2A1A0E] hover:bg-[#F2C14E] text-[#FFDE59] hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                    title="Khôi phục"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
