'use client';

import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowRight, ArrowLeft, Search,
  LayoutGrid, Compass, ZoomIn, ZoomOut, Target,
  Volume2, VolumeX, ChevronDown, Filter, RefreshCw, RotateCcw,
  Bot, Send
} from 'lucide-react';
import {
  MONK_PROFILES, DANH_TANG_MAP_IMAGE,
  Region, Assembly, Sect, Era, SubEra, MonkProfile,
  REGIONS, ASSEMBLIES, SECTS, ERAS, SUB_ERA_BY_ERA, ERA_ORDER,
  KNOWN_MONK_LOCATIONS, VIETNAM_PROVINCE_COORDINATES, getMonkLocation,
} from '@/data/danh-tang-data';
import { CustomDropdown } from '@/components/common/CustomDropdown';

interface DanhTangMapProps {
  onExitMapMode?: () => void;
}

type ViewMode = 'grid' | 'map';
type ScreenState = 'loading' | 'welcome' | 'map';
type SidePanelView = 'list' | 'detail';

const SIDE_PANEL_PAGE_SIZE = 8;

// ── REGION HUBS DEFINITION (EXACT MAINLAND COORDINATES FROM RED BOXES) ──
export interface RegionHub {
  id: Region;
  title: string;
  countLabel: string;
  top: string;
  left: string;
  zoomScale: number;
}

export const REGION_HUBS: Record<Exclude<Region, 'Quốc tế'>, RegionHub> = {
  'Miền Bắc': {
    id: 'Miền Bắc',
    title: 'MIỀN BẮC',
    countLabel: '21 VỊ DANH TĂNG',
    top: '18%',
    left: '33.8%',
    zoomScale: 1.5,
  },
  'Miền Trung': {
    id: 'Miền Trung',
    title: 'MIỀN TRUNG',
    countLabel: '22 VỊ DANH TĂNG',
    top: '42%',
    left: '35%',
    zoomScale: 1.5,
  },
  'Miền Nam': {
    id: 'Miền Nam',
    title: 'MIỀN NAM',
    countLabel: '45 VỊ DANH TĂNG',
    top: '79%',
    left: '34.8%',
    zoomScale: 1.5,
  },
};

// ── Helper: nhận diện Chư Ni qua danh xưng & thuộc tính ──
export const isChuni = (monk: MonkProfile): boolean => {
  if (monk.hoi_chung === 'Ni chúng') return true;
  const text = `${monk.name || ''} ${monk.bio || ''} ${monk.phapNgu || ''}`.toLowerCase();
  return /ni|ni trưởng|ni sư|sư cô|tỷ-kheo-ni|bản ni|sư bà/i.test(text);
};

// ── Memoized Level 1 Region Hub Node ──
interface RegionHubNodeProps {
  hub: RegionHub;
  count: number;
  isSelected: boolean;
  onSelect: (hubId: Region) => void;
}

const RegionHubNode = React.memo(({ hub, count, isSelected, onSelect }: RegionHubNodeProps) => {
  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer"
      style={{ top: hub.top, left: hub.left }}
      onClick={() => onSelect(hub.id)}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing aura */}
        <div className={`absolute inset-0 -m-3 rounded-2xl border-2 border-[#F2C14E] pointer-events-none transition-all duration-300 ${
          isSelected ? 'animate-ping opacity-90 shadow-[0_0_35px_rgba(242,193,78,0.95)]' : 'animate-pulse opacity-60 shadow-[0_0_20px_rgba(242,193,78,0.6)]'
        }`} />

        {/* Golden Glassmorphic Hub Badge */}
        <div className={`relative px-5 py-2.5 rounded-2xl border-2 backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
          isSelected
            ? 'bg-[#2C1C11] border-[#ffde59] text-[#ffde59] scale-110 shadow-[0_0_30px_rgba(242,193,78,0.9)]'
            : 'bg-[#1C130D]/90 border-[#F2C14E] text-[#FFE5A3] shadow-[0_0_20px_rgba(242,193,78,0.6)] hover:scale-105'
        }`}>
          <span
            className="text-xs md:text-sm font-bold tracking-widest uppercase text-[#F2C14E]"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {hub.title}
          </span>
          <span
            className="text-[11px] text-[#FFE5A3] font-bold mt-0.5"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {count > 0 ? `${count} VỊ DANH TĂNG` : hub.countLabel}
          </span>
        </div>
      </div>
    </div>
  );
});

RegionHubNode.displayName = 'RegionHubNode';

// ── Memoized Monk Card Component for Grid View ──
interface MonkGridCardProps {
  monk: MonkProfile;
  onSelect: (monk: MonkProfile) => void;
}

const MonkGridCard = React.memo(({ monk, onSelect }: MonkGridCardProps) => {
  return (
    <div
      onClick={() => onSelect(monk)}
      className="group relative w-full overflow-hidden rounded-2xl border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl h-[390px] cursor-pointer flex flex-col justify-between hover:-translate-y-1"
    >
      <div className="relative w-full h-[310px] overflow-hidden bg-[#1A120B] shrink-0">
        <img
          src={monk.avatarUrl}
          alt={monk.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/icon-minh-hoa/logo-tung-lam-hoa-phuc-tron.png'; }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(37,23,14,0.95) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 transition-transform duration-500 ease-out translate-y-[10px] group-hover:translate-y-0">
        <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent z-30 opacity-90 shadow-[0_0_8px_rgba(242,193,78,0.5)]" />

        <div className="relative w-full bg-gradient-to-b from-[#25170E] to-[#1C130D] px-3 pt-5 pb-4 text-center flex flex-col items-center justify-start">
          <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#F2C14E] bg-[#25170E] flex items-center justify-center p-1 shadow-[0_0_18px_rgba(242,193,78,0.65)] overflow-hidden">
            <img
              src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
              alt="Biểu tượng Bảo tượng"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.95)] scale-135 transform-gpu"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
              }}
            />
          </div>

          <div className="w-full flex flex-col items-center mt-1.5 shrink-0">
            <h3
              className="text-[#F2C14E] text-2xl md:text-3xl font-normal tracking-wide uppercase line-clamp-1 group-hover:text-white transition-colors mb-0.5"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              {monk.name}
            </h3>

            <div className="h-5 flex items-center justify-center overflow-hidden">
              <p
                className="text-[#FFE5A3]/90 text-xs font-bold transition-all duration-300 group-hover:hidden"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {monk.sect}
              </p>
              <p
                className="text-[#F2C14E] text-xs font-bold hidden group-hover:block animate-in fade-in"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                Năm sinh - năm mất: {monk.lifespan}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MonkGridCard.displayName = 'MonkGridCard';

export const DanhTangMap: FC<DanhTangMapProps> = ({ onExitMapMode }) => {
  // ── View Mode ─────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // ── Filter State ──────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');
  const [selectedAssembly, setSelectedAssembly] = useState<Assembly | 'all'>('all');
  const [selectedSect, setSelectedSect] = useState<Sect | 'all'>('all');
  const [selectedEra, setSelectedEra] = useState<Era | 'all'>('all');
  const [selectedSubEra, setSelectedSubEra] = useState<SubEra | 'all'>('all');

  // Grid Expansion state (Preview Peek Row 4 under "XEM THÊM DANH SÁCH" button)
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Modal / Selection State ───────────────────────────
  const [selectedMonk, setSelectedMonk] = useState<MonkProfile | null>(null);

  // ── 2D Map State ──────────────────────────────────────
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedMapMonk, setSelectedMapMonk] = useState<MonkProfile | null>(null);

  // Level 1 vs Level 2 Drill-down Map Region Hub & Side Panel View
  const [activeRegionHub, setActiveRegionHub] = useState<Region | null>(null);
  const [sidePanelView, setSidePanelView] = useState<SidePanelView>('list');
  const [sidePanelDisplayCount, setSidePanelDisplayCount] = useState(SIDE_PANEL_PAGE_SIZE);

  // AI Chatbot State
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Nam Mô A Di Đà Phật! Con là Trợ lý AI Phật Học Tùng Lâm Hòa Phúc. Con có thể trợ giúp gì cho Quý Phật tử?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Zoom / Pan
  const [scale, setScale] = useState(1);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const posStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sidePanelRef = useRef<HTMLElement | null>(null);

  // Audio
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Cascading Sub-Era Dropdown Options ────────────────
  const availableSubEras = useMemo(() => {
    if (selectedEra === 'all') return [];
    return SUB_ERA_BY_ERA[selectedEra] || [];
  }, [selectedEra]);

  // Reset sub_era when selectedEra changes
  useEffect(() => {
    setSelectedSubEra('all');
  }, [selectedEra]);

  // Reset expansion on filter change
  useEffect(() => {
    setIsExpanded(false);
  }, [searchQuery, selectedRegion, selectedAssembly, selectedSect, selectedEra, selectedSubEra]);

  // Reset side panel count when region changes
  useEffect(() => {
    setSidePanelDisplayCount(SIDE_PANEL_PAGE_SIZE);
    setSidePanelView('list');
  }, [activeRegionHub]);

  // ── Filtered & Sorted Monk List ───────────────────────
  // Algorithm Rules:
  // 1. Auto-Province & Coordinates lookup via getMonkLocation
  // 2. STRICT SORTING RULE: Chư Tăng ALWAYS first, Chư Ni ALWAYS pushed to bottom
  // 3. Within same gender group: Chronological by era (Cổ đại -> Trung đại -> Cận đại -> Hiện đại)
  const processedMonkList = useMemo(() => {
    let result = MONK_PROFILES.map((monk) => {
      const loc = getMonkLocation(monk);
      return {
        ...monk,
        province: monk.province || loc.province,
        region: monk.region || loc.region,
        coordinates: monk.coordinates || loc.coordinates,
      };
    }).filter((monk) => {
      if (searchQuery.trim() && !monk.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
      if (selectedRegion !== 'all' && monk.region !== selectedRegion) return false;
      if (selectedAssembly !== 'all' && monk.hoi_chung !== selectedAssembly) return false;
      if (selectedSect !== 'all' && monk.sect !== selectedSect) return false;
      if (selectedEra !== 'all' && monk.era !== selectedEra) return false;
      if (selectedSubEra !== 'all' && monk.sub_era !== selectedSubEra) return false;
      return true;
    });

    // Auto Sorting: Chư Tăng first, Chư Ni ALWAYS at bottom
    result.sort((a, b) => {
      const aIsNi = isChuni(a);
      const bIsNi = isChuni(b);

      // Primary Key: Tăng vs Ni (Chư Tăng on top, Chư Ni at bottom)
      if (!aIsNi && bIsNi) return -1;
      if (aIsNi && !bIsNi) return 1;

      // Secondary Key: Chronological Era
      const eraDiff = (ERA_ORDER[a.era] || 99) - (ERA_ORDER[b.era] || 99);
      if (eraDiff !== 0) return eraDiff;

      return 0;
    });

    return result;
  }, [searchQuery, selectedRegion, selectedAssembly, selectedSect, selectedEra, selectedSubEra]);

  // Regional monk counts for Level 1 Hubs
  const regionalCounts = useMemo(() => {
    const counts: Record<Region, number> = {
      'Miền Bắc': 0,
      'Miền Trung': 0,
      'Miền Nam': 0,
      'Quốc tế': 0,
    };
    processedMonkList.forEach((m) => {
      if (counts[m.region] !== undefined) {
        counts[m.region] += 1;
      }
    });
    return counts;
  }, [processedMonkList]);

  // Filtered monk list for active region (Side Panel)
  const activeRegionMonks = useMemo(() => {
    if (!activeRegionHub) return [];
    return processedMonkList.filter((m) => m.region === activeRegionHub);
  }, [processedMonkList, activeRegionHub]);

  // Paginated active region monks for Side Panel (Avoid lag)
  const visibleSidePanelMonks = useMemo(() => {
    return activeRegionMonks.slice(0, sidePanelDisplayCount);
  }, [activeRegionMonks, sidePanelDisplayCount]);

  // Counts of Tăng & Ni in active region for side panel header
  const activeRegionCounts = useMemo(() => {
    let tang = 0;
    let ni = 0;
    activeRegionMonks.forEach((m) => {
      if (isChuni(m)) ni += 1;
      else tang += 1;
    });
    return { tang, ni };
  }, [activeRegionMonks]);

  // Render 16 items initially when collapsed (3 full rows of 4 + 1 preview row of 4 peeking under button)
  const visibleMonkList = useMemo(() => {
    return isExpanded ? processedMonkList : processedMonkList.slice(0, 16);
  }, [processedMonkList, isExpanded]);

  // ── Reset Filters ─────────────────────────────────────
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedAssembly('all');
    setSelectedSect('all');
    setSelectedEra('all');
    setSelectedSubEra('all');
    setActiveRegionHub(null);
    setSelectedMapMonk(null);
    setSidePanelView('list');
    setIsExpanded(false);
  };

  // Select a Region Hub (Opens Side Panel directly + gentle camera zoom ~1.5x)
  const handleSelectRegionHub = (region: Region) => {
    setActiveRegionHub(region);
    setSelectedRegion(region);
    setSidePanelView('list');
    setSelectedMapMonk(null);

    const hub = REGION_HUBS[region as keyof typeof REGION_HUBS];
    if (hub && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const targetScale = hub.zoomScale;
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

  // Reset drill-down view back to Level 1
  const handleResetRegionHub = () => {
    setActiveRegionHub(null);
    setSelectedRegion('all');
    setScale(1);
    setPositionX(0);
    setPositionY(0);
    setSelectedMapMonk(null);
    setSidePanelView('list');
  };

  // Handle clicking a monk inside the Side Panel -> switch to detail view
  const handleSelectSidePanelMonk = (monk: MonkProfile) => {
    setSelectedMapMonk(monk);
    setSidePanelView('detail');
  };

  // ── AI Chatbot Send Message ───────────────────────────
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `A Di Đà Phật! Cảm ơn Quý Phật tử đã hỏi về "${userMsg}". Quý vị có thể tra cứu thông tin chi tiết qua sơ đồ 2D và dạng lưới danh tăng của Tùng Lâm Hòa Phúc.`,
        },
      ]);
    }, 600);
  };

  // ── Loading progress (for 2D Map) ─────────────────────
  useEffect(() => {
    if (viewMode !== 'map' || screenState !== 'loading') return;
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScreenState('welcome'), 250);
          return 100;
        }
        return prev + 5;
      });
    }, 70);
    return () => clearInterval(interval);
  }, [viewMode, screenState]);

  // Reset map view state on switching to map mode
  useEffect(() => {
    if (viewMode === 'map') {
      setScreenState('loading');
      setLoadingProgress(0);
      setScale(1);
      setPositionX(0);
      setPositionY(0);
      setSelectedMapMonk(null);
      setActiveRegionHub(null);
      setSidePanelView('list');
    }
  }, [viewMode]);

  // ── Map Zoom Clamping & Pan Helpers ───────────────────
  const getClampedPosition = (x: number, y: number, s: number) => {
    const container = containerRef.current;
    if (!container || s <= 1) return { x: 0, y: 0 };
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const minX = cw - cw * s;
    const minY = ch - ch * s;
    return { x: Math.min(0, Math.max(x, minX)), y: Math.min(0, Math.max(y, minY)) };
  };

  // Wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container || viewMode !== 'map' || screenState !== 'map') return;
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (sidePanelRef.current?.contains(target) || target.closest('.side-panel-scroll'))) return;
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setScale((prev) => {
        const factor = e.deltaY < 0 ? 1.15 : 0.85;
        const next = Math.min(Math.max(prev * factor, 1), 5);
        if (next === 1) { setPositionX(0); setPositionY(0); }
        else {
          const rawX = mouseX - (mouseX - positionX) * (next / prev);
          const rawY = mouseY - (mouseY - positionY) * (next / prev);
          const clamped = getClampedPosition(rawX, rawY, next);
          setPositionX(clamped.x);
          setPositionY(clamped.y);
        }
        return next;
      });
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [positionX, positionY, viewMode, screenState]);

  // Mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target && (sidePanelRef.current?.contains(target) || target.closest('.side-panel-scroll'))) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { x: positionX, y: positionY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const clamped = getClampedPosition(posStartRef.current.x + dx, posStartRef.current.y + dy, scale);
    setPositionX(clamped.x);
    setPositionY(clamped.y);
  };
  const handleMouseUp = () => setIsDragging(false);

  // Audio toggle
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) { audioRef.current.pause(); setIsPlayingAudio(false); }
    else { audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {}); }
  };

  const handleStartExplore = () => {
    setScreenState('map');
    audioRef.current?.play().then(() => setIsPlayingAudio(true)).catch(() => {});
  };

  // ══════════════════════════════════════════════════════
  // RENDER: 2D MAP VIEW MODE
  // ══════════════════════════════════════════════════════
  if (viewMode === 'map') {
    return (
      <div className="w-screen h-screen fixed inset-0 z-50 bg-[#2c1c11] overflow-hidden select-none">
        {/* Background Audio */}
        <audio
          ref={audioRef}
          loop
          preload="auto"
          src="/audio/nhac-thien.mp3"
          onError={(e) => {
            e.currentTarget.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-zen-112195.mp3';
          }}
        />

        {/* Floating Audio Button */}
        <button
          type="button"
          onClick={toggleAudio}
          className="fixed bottom-5 left-5 z-50 w-10 h-10 rounded-full bg-[#1C130D]/80 border border-[#F2C14E]/40 flex items-center justify-center text-[#FFE5A3] cursor-pointer hover:scale-110 transition-all shadow-lg backdrop-blur-md"
          title={isPlayingAudio ? 'Tắt âm thanh nền' : 'Bật âm thanh nền'}
        >
          {isPlayingAudio ? (
            <Volume2 className="w-5 h-5 text-[#F2C14E] animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#FFE5A3]/60" />
          )}
        </button>

        {/* ── LOADING & WELCOME OVERLAY ── */}
        <AnimatePresence mode="wait">
          {screenState !== 'map' && (
            <motion.div
              key="overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              className="fixed inset-0 z-40 overflow-hidden pointer-events-auto"
            >
              <div className="absolute inset-0 z-0 bg-[#2c1c11]">
                <img
                  src={DANH_TANG_MAP_IMAGE}
                  alt="Bản đồ Danh Tăng"
                  className="w-full h-full object-cover scale-105 blur-sm"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c1c11] via-[#2c1c11]/70 to-black/50" />
              </div>

              <AnimatePresence mode="wait">
                {screenState === 'loading' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 z-10 bg-[#0D0907]/80 backdrop-blur-sm flex flex-col items-center justify-center text-[#FFE5A3] p-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#2C1C11] border border-[#F2C14E]/40 flex items-center justify-center text-[#F2C14E] mb-6 shadow-[0_0_25px_rgba(242,193,78,0.4)]">
                      <span className="text-3xl animate-spin">☸</span>
                    </div>
                    <h3
                      className="text-xl md:text-2xl font-normal text-[#F2C14E] uppercase tracking-wider mb-4"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      ĐANG TẢI SƠ ĐỒ DANH TĂNG VIỆT NAM...
                    </h3>
                    <div className="w-64 h-1.5 bg-[#2C1C11] rounded-full overflow-hidden border border-[#F2C14E]/30">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4A017] via-[#F2C14E] to-[#FFE5A3] transition-all duration-150"
                        style={{ width: `${loadingProgress}%` }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold mt-2 text-[#FFE5A3]/90"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {loadingProgress}%
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#2C1C11]/90 border-2 border-[#F2C14E] flex items-center justify-center text-[#F2C14E] mb-6 shadow-[0_0_30px_rgba(242,193,78,0.5)]">
                        <span className="text-3xl">☸</span>
                      </div>
                      <p
                        className="text-[#F2C14E] text-2xl md:text-3xl normal-case mb-2 font-normal tracking-wide"
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                      >
                        Hành trình tìm về
                      </p>
                      <h1
                        className="text-white text-4xl md:text-6xl font-normal tracking-wider mb-4 uppercase"
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                      >
                        DANH TĂNG VIỆT NAM
                      </h1>
                      <p
                        className="text-[#c9b896] text-sm mb-8 max-w-md"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        Bản đồ vị trí địa lý &amp; tư liệu truyền thừa chư vị Hòa Thượng, Thiền sư, Ni trưởng qua các thời đại
                      </p>
                      <button
                        type="button"
                        onClick={handleStartExplore}
                        className="bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-sm md:text-base px-8 py-3.5 rounded-full shadow-[0_0_25px_rgba(242,193,78,0.6)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2.5 uppercase tracking-wider"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        <span>BẮT ĐẦU KHÁM PHÁ</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TOP LEFT TOGGLE BUTTON PILL ── */}
        <div className="absolute top-5 left-6 z-30 flex items-center">
          <div className="flex items-center bg-[#1C130D]/90 border border-[#F2C14E]/40 rounded-full p-1 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer bg-[#F2C14E] text-[#2C1C11] shadow-[0_0_15px_rgba(242,193,78,0.6)]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <Target className="w-4 h-4" />
              <span>SƠ ĐỒ 2D</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer text-[#FFE5A3]/60 hover:text-[#FFE5A3]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>DẠNG LƯỚI GRID</span>
            </button>
          </div>
        </div>

        {/* ── 3 COMPACT GOLDEN TOOL DOCK BUTTONS (VERTICALLY ALIGNED ALONG LEFT EDGE) ── */}
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3.5 bg-[#1C130D]/90 backdrop-blur-md border border-[#F2C14E]/40 p-2 rounded-2xl shadow-2xl">
          {/* Button 1: Quay lại Vũ Trụ */}
          {onExitMapMode && (
            <button
              type="button"
              onClick={onExitMapMode}
              className="w-10 h-10 rounded-xl border border-[#F2C14E]/30 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md group relative"
              title="Quay lại Vũ Trụ"
            >
              <span className="text-lg">☸</span>
              {/* Tooltip displayed to the RIGHT */}
              <span
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                Quay lại Vũ Trụ
              </span>
            </button>
          )}

          {/* Button 2: Reset Bản đồ toàn cảnh */}
          <button
            type="button"
            onClick={handleResetRegionHub}
            className="w-10 h-10 rounded-xl border border-[#F2C14E]/30 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md group relative"
            title="Reset Bản đồ toàn cảnh"
          >
            <Compass className="w-5 h-5" />
            {/* Tooltip displayed to the RIGHT */}
            <span
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Reset Bản đồ toàn cảnh
            </span>
          </button>

          {/* Button 3: Bật / Tắt Nhạc nền YouTube */}
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`w-10 h-10 rounded-xl border transition-all cursor-pointer shadow-md group relative flex items-center justify-center ${
              isPlayingAudio
                ? 'border-[#F2C14E] bg-[#F2C14E]/20 text-[#F2C14E]'
                : 'border-[#F2C14E]/30 bg-[#2C1C11]/90 text-[#C4B5A5] hover:text-[#FFE5A3]'
            }`}
            title={isPlayingAudio ? 'Tắt nhạc nền' : 'Bật nhạc thiền'}
          >
            {isPlayingAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl uppercase"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {isPlayingAudio ? 'Tắt nhạc nền' : 'Bật nhạc thiền'}
            </span>
          </button>

          {/* Button 4: Mở Chatbot AI */}
          <button
            type="button"
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className="w-10 h-10 rounded-xl border border-[#F2C14E]/30 bg-[#2C1C11]/90 flex items-center justify-center text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all cursor-pointer shadow-md group relative"
            title="Trợ lý Chatbot AI"
          >
            <Bot className="w-5 h-5 text-[#F2C14E]" />
            {/* Tooltip displayed to the RIGHT */}
            <span
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1A120B] border border-[#F2C14E] text-[#F2C14E] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Trợ lý Chatbot AI
            </span>
          </button>
        </div>

        {/* ── HIDDEN YOUTUBE BACKGROUND MEDITATION MUSIC PLAYER (ID: V_hkbEVraSA) ── */}
        {isPlayingAudio && (
          <div className="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none">
            <iframe
              src="https://www.youtube.com/embed/V_hkbEVraSA?autoplay=1&loop=1&playlist=V_hkbEVraSA&start=7&controls=0&mute=0"
              title="Nhạc thiền tịnh tâm"
              allow="autoplay"
            />
          </div>
        )}

        {/* ── AI CHATBOT BUBBLE OVERLAY (FROSTED GLASS) ── */}
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
              {/* Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-[#F2C14E]/25 bg-[#2C1C11]/80">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#F2C14E]" />
                  <span
                    className="text-xs font-bold text-[#F2C14E] tracking-wider uppercase"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    TRỢ LÝ AI PHẬT HỌC
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiChatOpen(false)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#c9b896] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="p-3.5 max-h-64 overflow-y-auto space-y-2.5 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#F2C14E] text-[#1C130D] font-bold rounded-br-none'
                          : 'bg-[#2C1C11] border border-[#F2C14E]/30 text-[#FFE5A3] rounded-bl-none'
                      }`}
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Footer */}
              <div className="p-2.5 border-t border-[#F2C14E]/20 bg-[#1C130D] flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Hỏi về danh tăng, lịch sử..."
                  className="flex-1 px-3 py-1.5 bg-[#2C1C11] border border-[#F2C14E]/30 rounded-lg text-xs text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E]"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={handleSendChatMessage}
                  className="w-8 h-8 rounded-lg bg-[#F2C14E] text-[#1C130D] flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FULL SCREEN MAP CONTAINER (OBJECT-COVER BACKGROUND MAP IMAGE) ── */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full h-full flex items-center justify-center overflow-hidden transform-gpu will-change-transform ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <div
            className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
            style={{
              transform: `translate3d(${positionX}px, ${positionY}px, 0px) scale(${scale})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* FULL SCREEN BACKGROUND MAP IMAGE */}
            <img
              src={DANH_TANG_MAP_IMAGE}
              alt="Bản đồ Danh Tăng Việt Nam"
              className="w-full h-full object-cover select-none pointer-events-auto block filter brightness-95 contrast-105"
              loading="lazy"
              draggable={false}
            />

            {/* ONLY 3 GOLDEN REGION HUB BADGES PLACED AT EXACT MAINLAND RED BOXES */}
            {screenState === 'map' && (
              Object.keys(REGION_HUBS).map((key) => {
                const hub = REGION_HUBS[key as keyof typeof REGION_HUBS];
                const count = regionalCounts[hub.id] || 0;
                const isSelected = activeRegionHub === hub.id;
                return (
                  <RegionHubNode
                    key={hub.id}
                    hub={hub}
                    count={count}
                    isSelected={isSelected}
                    onSelect={handleSelectRegionHub}
                  />
                );
              })
            )}
          </div>

          {/* ── DISCLAIMER NOTE AT BOTTOM ── */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-[11px] text-[#FFE5A3]/50 italic text-center px-4" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            * Hình ảnh sơ đồ tạo bởi Gemini AI chỉ mang tính minh họa
          </div>

          {/* ── RIGHT SIDE PANEL (LIST MODE & DETAIL MODE WITH OPTIMIZED PAGINATION) ── */}
          <AnimatePresence>
            {activeRegionHub && (
              <motion.aside
                ref={sidePanelRef as React.RefObject<HTMLElement>}
                onWheel={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="side-panel-scroll absolute right-0 top-0 bottom-0 w-full sm:w-[440px] z-40 overflow-y-auto border-l p-6 flex flex-col gap-4"
                style={{
                  background: 'linear-gradient(160deg, rgba(44,28,17,0.98) 0%, rgba(28,18,11,0.99) 100%)',
                  borderColor: 'rgba(242,193,78,0.4)',
                  boxShadow: '-20px 0 60px rgba(0,0,0,0.95)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* ── MODE 1: MONK LIST VIEW ── */}
                {sidePanelView === 'list' && (
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#F2C14E]/30 pb-3">
                      <div>
                        <h3
                          className="text-2xl md:text-3xl font-normal text-[#F2C14E] uppercase tracking-wider"
                          style={{ fontFamily: "'UTM Niagara', serif" }}
                        >
                          DANH TĂNG {activeRegionHub.toUpperCase()}
                        </h3>
                        <p
                          className="text-xs text-[#FFE5A3]/90 font-bold mt-0.5"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          {activeRegionMonks.length} vị danh tăng ({activeRegionCounts.tang} Chư Tăng • {activeRegionCounts.ni} Chư Ni)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetRegionHub}
                        className="w-8 h-8 rounded-full bg-black/60 border border-[#F2C14E]/40 text-[#F2C14E] flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-md"
                        title="Đóng Bảng"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Paginated Monk List */}
                    <div className="space-y-3.5 mt-1">
                      {visibleSidePanelMonks.map((monk) => {
                        const isNi = isChuni(monk);

                        return (
                          <div
                            key={monk.id}
                            onClick={() => handleSelectSidePanelMonk(monk)}
                            className="p-3.5 rounded-2xl border bg-[#25170E]/90 border-[#F2C14E]/30 hover:border-[#F2C14E] hover:bg-[#352215] transition-all duration-300 cursor-pointer flex gap-4 items-center shadow-lg group"
                          >
                            {/* Larger Avatar Frame (Golden Ratio Proportions) */}
                            <div className="relative w-16 h-20 rounded-xl overflow-hidden border-2 border-[#F2C14E]/50 shrink-0 bg-[#1A120B] shadow-md group-hover:border-[#F2C14E]">
                              <img
                                src={monk.avatarUrl}
                                alt={monk.name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/icon-minh-hoa/logo-tung-lam-hoa-phuc-tron.png'; }}
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h4
                                  className="text-xl md:text-2xl font-normal text-[#F2C14E] group-hover:text-white transition-colors truncate"
                                  style={{ fontFamily: "'UTM Niagara', serif" }}
                                >
                                  {monk.name}
                                </h4>
                                <p
                                  className="text-xs text-[#FFE5A3]/90 font-bold truncate mb-1.5"
                                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                >
                                  {monk.lifespan} • {monk.province || monk.region}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    isNi
                                      ? 'bg-pink-950/80 text-pink-300 border border-pink-500/40'
                                      : 'bg-[#F2C14E]/15 text-[#F2C14E] border border-[#F2C14E]/40'
                                  }`}
                                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                >
                                  {monk.hoi_chung}
                                </span>
                                <span
                                  className="px-2.5 py-0.5 rounded-full text-[10px] text-[#c9b896] bg-[#1C130D] border border-[#c9b896]/30 truncate max-w-[140px]"
                                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                                >
                                  {monk.sect}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination Button: "HIỂN THỊ THÊM DANH SÁCH" */}
                    {sidePanelDisplayCount < activeRegionMonks.length && (
                      <div className="w-full flex justify-center pt-2 pb-4">
                        <button
                          type="button"
                          onClick={() => setSidePanelDisplayCount((prev) => prev + SIDE_PANEL_PAGE_SIZE)}
                          className="w-full py-3 rounded-xl bg-[#2C1C11] border border-[#F2C14E]/50 text-[#F2C14E] text-xs font-bold hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-lg uppercase tracking-wider flex items-center justify-center gap-2"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          <span>XEM THÊM DANH SÁCH ({activeRegionMonks.length - sidePanelDisplayCount} VỊ)</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── MODE 2: MONK DETAIL VIEW ── */}
                {sidePanelView === 'detail' && selectedMapMonk && (
                  <div className="flex flex-col gap-4 animate-in fade-in">
                    {/* Back to List Button */}
                    <div className="flex items-center justify-between border-b border-[#F2C14E]/30 pb-3">
                      <button
                        type="button"
                        onClick={() => setSidePanelView('list')}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2C1C11] border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-md"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>QUAY LẠI DANH SÁCH</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetRegionHub}
                        className="w-8 h-8 rounded-full bg-black/60 border border-[#F2C14E]/40 text-[#F2C14E] flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Enlarged Monk Card (Golden Ratio Design) */}
                    <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-[#F2C14E]/40 bg-[#25170E] shadow-2xl">
                      {/* Portrait */}
                      <div className="relative w-44 h-56 rounded-2xl overflow-hidden border-2 border-[#F2C14E] shadow-2xl mb-4">
                        <img
                          src={selectedMapMonk.avatarUrl}
                          alt={selectedMapMonk.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/icon-minh-hoa/logo-tung-lam-hoa-phuc-tron.png'; }}
                        />
                      </div>

                      {/* Title */}
                      <h3
                        className="text-3xl md:text-4xl font-normal text-[#F2C14E] uppercase tracking-wide leading-tight mb-1"
                        style={{ fontFamily: "'UTM Niagara', serif" }}
                      >
                        {selectedMapMonk.name}
                      </h3>

                      <p
                        className="text-xs text-[#FFE5A3] font-bold mb-3"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        Năm sinh - năm mất: {selectedMapMonk.lifespan}
                      </p>

                      {/* Tag badges */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold border text-[#F2C14E] border-[#F2C14E]/40 bg-[#F2C14E]/10"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          {selectedMapMonk.era}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold border text-[#c9b896] border-[#c9b896]/40 bg-[#c9b896]/10"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          {selectedMapMonk.sub_era}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold border text-[#FFE5A3] border-[#FFE5A3]/40 bg-[#FFE5A3]/10"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          {selectedMapMonk.sect}
                        </span>
                      </div>

                      {/* Golden ratio divider */}
                      <div className="h-[1px] w-3/5 bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent my-2" />

                      {/* Bio */}
                      {selectedMapMonk.bio && (
                        <p
                          className="text-xs md:text-sm text-[#D3C0AD] leading-relaxed text-justify mt-2"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          {selectedMapMonk.bio}
                        </p>
                      )}

                      {/* Pháp ngữ */}
                      {selectedMapMonk.phapNgu && (
                        <blockquote
                          className="w-full border-l-2 border-[#F2C14E] bg-[#3a2718]/80 p-3.5 italic text-xs md:text-sm text-[#FFE5A3] rounded-r-xl leading-relaxed text-left mt-4 shadow-md"
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        >
                          <span className="text-[#F2C14E] font-bold not-italic text-[10px] uppercase tracking-wider block mb-1">
                            Pháp Ngữ
                          </span>
                          "{selectedMapMonk.phapNgu}"
                        </blockquote>
                      )}
                    </div>
                  </div>
                )}
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // RENDER: GRID VIEW MODE (SEAMLESS BACKGROUND MATCHING TỔ ĐƯỜNG PAGE bg-[#2c1c11])
  // ══════════════════════════════════════════════════════
  return (
    <div className="w-full bg-[#2c1c11] min-h-screen">
      {/* ── TOP HEADER: TITLE ON LEFT, TOGGLE PILL ON RIGHT (EXACT ALIGNMENT WITH TOP HEADER) ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2
              className="text-2xl md:text-3xl font-normal text-[#F2C14E] uppercase tracking-widest mb-1"
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
            >
              BẢN ĐỒ DANH TĂNG VIỆT NAM
            </h2>
            <p
              className="text-sm text-[#c9b896]/70"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Tưởng niệm và tri ân các bậc Hòa Thượng, Thiền sư, Ni trưởng tiêu biểu qua các thời đại.
            </p>
          </div>

          {/* Toggle Pill at Top-Right (Positioned at the red oval & arrow in screenshot) */}
          <div className="flex items-center bg-[#1C130D]/90 border border-[#F2C14E]/40 rounded-full p-1 shadow-2xl backdrop-blur-md shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer text-[#FFE5A3]/60 hover:text-[#FFE5A3]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <Target className="w-4 h-4" />
              <span>SƠ ĐỒ 2D</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer bg-[#F2C14E] text-[#2C1C11] shadow-[0_0_15px_rgba(242,193,78,0.6)]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>DẠNG LƯỚI GRID</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Aligned cleanly with subtle dividers and hover lift/glow) */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pb-2">
          {/* Nhãn LỰA CHỌN nhẹ nhàng thanh lịch */}
          <span
            className="text-[11px] font-bold uppercase tracking-widest text-[#F2C14E]/80 shrink-0 select-none mr-0.5"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            LỰA CHỌN:
          </span>

          {/* Search bar */}
          <div className="relative flex-1 min-w-[180px] max-w-xs group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]/60 group-hover:text-[#F2C14E] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên danh tăng..."
              className="w-full pl-9 pr-3 py-1.5 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 border border-[#F2C14E]/35 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] hover:border-[#F2C14E]/70 transition-all shadow-inner"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            />
          </div>

          {/* Vạch phân định nhẹ mờ */}
          <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

          {/* Filter Dropdown 1: Vùng Miền */}
          <CustomDropdown
            labelPrefix="Vùng miền"
            value={selectedRegion}
            options={[
              { id: 'all', name: 'Tất cả' },
              ...REGIONS.map((r) => ({ id: r, name: r })),
            ]}
            onChange={(val) => setSelectedRegion(val as Region | 'all')}
            placeholder="Tất cả"
          />

          {/* Vạch phân định nhẹ mờ */}
          <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

          {/* Filter Dropdown 2: Hội Chúng */}
          <CustomDropdown
            labelPrefix="Hội chúng"
            value={selectedAssembly}
            options={[
              { id: 'all', name: 'Tất cả' },
              ...ASSEMBLIES.map((a) => ({ id: a, name: a })),
            ]}
            onChange={(val) => setSelectedAssembly(val as Assembly | 'all')}
            placeholder="Tất cả"
          />

          {/* Vạch phân định nhẹ mờ */}
          <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

          {/* Filter Dropdown 3: Hệ Phái */}
          <CustomDropdown
            labelPrefix="Hệ phái"
            value={selectedSect}
            options={[
              { id: 'all', name: 'Tất cả' },
              ...SECTS.map((s) => ({ id: s, name: s })),
            ]}
            onChange={(val) => setSelectedSect(val as Sect | 'all')}
            placeholder="Tất cả"
          />

          {/* Vạch phân định nhẹ mờ */}
          <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />

          {/* Filter Dropdown 4: Thời Kỳ (Era) */}
          <CustomDropdown
            labelPrefix="Thời kỳ"
            value={selectedEra}
            options={[
              { id: 'all', name: 'Tất cả' },
              ...ERAS.map((e) => ({ id: e, name: e })),
            ]}
            onChange={(val) => setSelectedEra(val as Era | 'all')}
            placeholder="Tất cả"
          />

          {/* Filter Dropdown 5: Bối Cảnh (SubEra) - Cascading */}
          {selectedEra !== 'all' && availableSubEras.length > 0 && (
            <>
              <div className="h-4 w-px bg-[#F2C14E]/25 hidden sm:block" />
              <CustomDropdown
                labelPrefix="Bối cảnh"
                value={selectedSubEra}
                options={[
                  { id: 'all', name: 'Tất cả' },
                  ...availableSubEras.map((sub) => ({ id: sub, name: sub })),
                ]}
                onChange={(val) => setSelectedSubEra(val as SubEra | 'all')}
                placeholder="Tất cả"
              />
            </>
          )}

          {/* Reset Filters button */}
          {(searchQuery || selectedRegion !== 'all' || selectedAssembly !== 'all' || selectedSect !== 'all' || selectedEra !== 'all' || selectedSubEra !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#F2C14E]/35 bg-gradient-to-b from-[#3A2718]/90 via-[#2A1D14]/90 to-[#1C130D]/90 text-xs text-[#FFE5A3] hover:text-white hover:border-[#F2C14E] transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(242,193,78,0.25)]"
              title="Xóa bộ lọc"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              <RefreshCw className="w-3 h-3 text-[#F2C14E]" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 4 COLUMNS GRID CONTAINER WITH PREVIEW PEEK EXPANSION (MATCHING BẢO TƯỢNG DESIGN) ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div
          className={`relative transition-all duration-700 overflow-hidden ${
            !isExpanded && processedMonkList.length > 12
              ? 'max-h-[1350px]'
              : 'max-h-[10000px] pb-8'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {visibleMonkList.map((monk) => (
              <MonkGridCard
                key={monk.id}
                monk={monk}
                onSelect={setSelectedMonk}
              />
            ))}
          </div>

          {/* Smooth Bottom Gradient Fade Overlay (Preview peek of Row 4 under button) */}
          {!isExpanded && processedMonkList.length > 12 && (
            <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#2c1c11] via-[#2c1c11]/90 to-transparent pointer-events-none z-10" />
          )}
        </div>

        {/* Load More / Expand Toggle Button (Exact match with StatueCollectionGrid) */}
        {processedMonkList.length > 12 && (
          <div className="w-full flex justify-center mt-6 z-20 relative">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-8 py-3 rounded-full bg-[#2C1C11] border border-[#F2C14E]/60 text-[#F2C14E] text-xs font-bold hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-lg uppercase tracking-wider"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              {isExpanded ? 'THU GỌN DANH SÁCH' : 'XEM THÊM DANH SÁCH'}
            </button>
          </div>
        )}

        {processedMonkList.length === 0 && (
          <div
            className="text-center py-20 text-[#c9b896]/60 text-sm"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            Không tìm thấy kết quả danh tăng phù hợp với tiêu chí lọc đã chọn.
          </div>
        )}
      </div>

      {/* ── MODAL POPUP (Grid Card Click) ── */}
      <AnimatePresence>
        {selectedMonk && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedMonk(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="relative w-full max-w-[640px] rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #2C1C11 0%, #1A120B 100%)',
                border: '1px solid rgba(242,193,78,0.45)',
                boxShadow: '0 0 60px rgba(242,193,78,0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedMonk(null)}
                className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 border border-[#c8aa6e]/40 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Popup Header: UTM Niagara Centered Title */}
              <div className="px-6 pt-5 pb-3 flex items-center justify-center border-b border-[#c8aa6e]/30">
                <h3
                  className="text-lg md:text-xl font-normal text-white uppercase tracking-widest text-center"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  {selectedMonk.hoi_chung} • {selectedMonk.province || selectedMonk.region}
                </h3>
              </div>

              {/* 2-Column Modal Content */}
              <div className="flex flex-col sm:flex-row gap-5 p-6">
                {/* Left: Portrait Frame */}
                <div
                  className="relative w-36 mx-auto sm:mx-0 shrink-0 rounded-xl overflow-hidden border-2 shadow-lg self-start"
                  style={{ borderColor: 'rgba(242,193,78,0.5)', aspectRatio: '3/4' }}
                >
                  <img
                    src={selectedMonk.avatarUrl}
                    alt={selectedMonk.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/icon-minh-hoa/logo-tung-lam-hoa-phuc-tron.png'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C130D]/60 via-transparent to-transparent" />
                </div>

                {/* Right: Info Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <div>
                    <h2
                      className="text-3xl font-normal text-[#F2C14E] leading-snug uppercase mb-1"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      {selectedMonk.name}
                    </h2>
                    <p
                      className="text-xs text-[#FFE5A3] font-bold mb-2"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      Năm sinh - năm mất: {selectedMonk.lifespan}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border text-[#F2C14E] border-[#F2C14E]/40 bg-[#F2C14E]/10"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {selectedMonk.era}
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border text-[#c9b896] border-[#c9b896]/40 bg-[#c9b896]/10"
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      >
                        {selectedMonk.sub_era}
                      </span>
                    </div>

                    <p
                      className="text-xs text-[#FFE5A3]/90 font-bold"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      Hệ phái: {selectedMonk.sect}
                    </p>
                  </div>

                  {/* Golden ratio divider */}
                  <div
                    className="h-[1px] bg-gradient-to-r from-[#F2C14E]/60 via-[#F2C14E]/20 to-transparent my-1"
                    style={{ width: '61.8%' }}
                  />

                  {/* Bio */}
                  {selectedMonk.bio && (
                    <p
                      className="text-xs md:text-sm text-[#D3C0AD] leading-relaxed text-justify"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {selectedMonk.bio}
                    </p>
                  )}

                  {/* Pháp ngữ */}
                  {selectedMonk.phapNgu && (
                    <blockquote
                      className="border-l-2 border-[#F2C14E] bg-[#3a2718]/60 p-3 italic text-xs text-[#FFE5A3] rounded-r-lg leading-relaxed"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      <span className="text-[#F2C14E] font-bold not-italic text-[10px] uppercase tracking-wider block mb-1">
                        Pháp Ngữ
                      </span>
                      "{selectedMonk.phapNgu}"
                    </blockquote>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
