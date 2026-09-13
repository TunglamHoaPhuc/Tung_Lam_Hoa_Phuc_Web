'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ExternalLink,
  Edit3,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Image as ImageIcon,
  Crosshair,
  Cloud,
  LayoutGrid,
  List,
  Filter,
  Save,
  X,
  MapPin,
  Compass,
  Landmark,
  Layers,
  ChevronDown,
  RotateCcw,
  RotateCw,
  Film,
  Video,
  Images,
  FileText,
  BookOpen,
  Plus,
  Trash2,
  Play,
} from 'lucide-react';
import { ImageFocalPositionerModal } from '@/components/admin/ImageFocalPositionerModal';
import S3FileExplorerModal from '@/components/admin/S3FileExplorerModal';

export interface StatueAdminItem {
  id: string;
  code: string;
  name: string;
  titleName?: string;
  subtitle?: string;
  assembly: string;
  assemblyId?: string;
  categoryType: 'TƯỢNG CHÍNH' | 'NTPG' | string;
  areaId: string;
  areaSlug?: string;
  areaName?: string;
  location?: string;
  imgUrl: string;
  imgPosition?: string;
  imgRotation?: number;
  quote?: string;
  quoteAuthor?: string;
  summary?: string;
  description?: string;
  fullHistoryHtml?: string;
  articleContent?: string;
  slug?: string;
  video?: {
    title: string;
    thumbnailUrl: string;
    summary: string;
    videoUrl: string;
  };
  article?: {
    title: string;
    author: string;
    bannerUrl: string;
    url: string;
  };
  artVariations?: Array<{
    id: string;
    title: string;
    location: string;
    meaning: string;
    imgUrl: string;
    imgPosition?: string;
  }>;
}

const UNIVERSE_AREAS = [
  { id: 'all', name: 'Tất cả Không gian' },
  { id: 'tam-bao', name: 'Chánh Điện Tam Bảo' },
  { id: 'to-duong', name: 'Tổ Đường & Triển Lãm' },
  { id: 'giang-duong', name: 'Giảng Đường Pháp Loa' },
  { id: 'san-di-da', name: 'Sân Đại Tượng Di Đà' },
  { id: 'cong-tam-quan-san-di-lac', name: 'Cổng Tam Quan & Sân Di Lặc' },
  { id: 'nha-mau', name: 'Đại Nam Quốc Mẫu' },
  { id: 'bao-thap', name: 'Bảo Tháp Vạn Phật Xá Lợi' },
  { id: 'vang-sinh-duong', name: 'Tứ Ân Vãng Sinh Đường' },
  { id: 'bao-tang', name: 'Bảo Tàng Di Sản' },
];

export default function AdminBaoTuongPage() {
  const [statues, setStatues] = useState<StatueAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedAssembly, setSelectedAssembly] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Focal Point Modal State
  const [focalModalOpen, setFocalModalOpen] = useState(false);
  const [focalTargetStatue, setFocalTargetStatue] = useState<StatueAdminItem | null>(null);

  // S3 Picker Modal State
  const [s3ModalOpen, setS3ModalOpen] = useState(false);
  const [s3TargetStatueId, setS3TargetStatueId] = useState<string | null>(null);

  // Quick Edit Modal State
  const [editingStatue, setEditingStatue] = useState<StatueAdminItem | null>(null);

  // Active Tab in Editing Modal (Đa Phương Tiện)
  const [modalTab, setModalTab] = useState<'info' | 'article' | 'video' | 'gallery' | 'related'>('info');

  // S3 Target Picker State
  type S3Target =
    | { type: 'main'; statueId: string }
    | { type: 'videoThumb' }
    | { type: 'articleBanner' }
    | { type: 'galleryItem'; index: number };

  const [s3Target, setS3Target] = useState<S3Target | null>(null);

  // Gallery handlers for statue
  const handleAddGalleryItem = () => {
    if (!editingStatue) return;
    const currentList = editingStatue.artVariations || [];
    const newItem = {
      id: `variation-${Date.now()}`,
      title: `${editingStatue.name} — Chi tiết tôn tượng ${currentList.length + 1}`,
      location: editingStatue.location || editingStatue.areaName || 'Tam Bảo',
      meaning: 'Bảo vật di sản văn hóa tâm linh Phật giáo tôn nghiêm.',
      imgUrl: editingStatue.imgUrl,
    };
    setEditingStatue({
      ...editingStatue,
      artVariations: [...currentList, newItem],
    });
  };

  const handleRemoveGalleryItem = (index: number) => {
    if (!editingStatue) return;
    const currentList = [...(editingStatue.artVariations || [])];
    currentList.splice(index, 1);
    setEditingStatue({
      ...editingStatue,
      artVariations: currentList,
    });
  };

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch Statues from Backend API
  const fetchStatues = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bao-tuong');
      const data = await res.json();
      if (data.success && Array.isArray(data.statues)) {
        setStatues(data.statues);
      }
    } catch (err) {
      console.error('Error fetching statues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatues();
  }, []);

  // Assemblies list
  const assemblies = useMemo(() => {
    const set = new Set<string>();
    statues.forEach((s) => {
      if (s.assembly) set.add(s.assembly);
    });
    return ['all', ...Array.from(set)];
  }, [statues]);

  // Filter logic
  const filtered = useMemo(() => {
    return statues.filter((s) => {
      if (selectedAssembly !== 'all' && s.assembly !== selectedAssembly && s.assemblyId !== selectedAssembly) {
        return false;
      }
      if (selectedArea !== 'all') {
        const normArea = (s.areaSlug || s.areaId || '').toLowerCase().replace(/_/g, '-');
        const targetArea = selectedArea.toLowerCase().replace(/_/g, '-');
        if (!normArea.includes(targetArea) && !targetArea.includes(normArea)) {
          return false;
        }
      }
      if (selectedType !== 'all') {
        if (selectedType === 'TƯỢNG CHÍNH' && s.categoryType !== 'TƯỢNG CHÍNH') return false;
        if (selectedType === 'NTPG' && s.categoryType === 'TƯỢNG CHÍNH') return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCode = s.code?.toLowerCase().includes(q);
        const matchName = s.name?.toLowerCase().includes(q);
        const matchSub = s.subtitle?.toLowerCase().includes(q);
        const matchLoc = s.location?.toLowerCase().includes(q);
        const matchQuote = s.quote?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchSub && !matchLoc && !matchQuote) return false;
      }
      return true;
    });
  }, [statues, search, selectedAssembly, selectedArea, selectedType]);

  // Update Statue handler
  const handleUpdateStatue = async (id: string, updates: Partial<StatueAdminItem>) => {
    try {
      const res = await fetch('/api/admin/bao-tuong', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      const data = await res.json();
      if (data.success) {
        setStatues((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
        showToast('✨ Đã cập nhật thành công!');
      } else {
        alert(data.error || 'Lỗi khi cập nhật dữ liệu');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi mạng khi cập nhật');
    }
  };

  // Focal Point Save
  const handleSaveFocalPoint = (newPos: string) => {
    if (focalTargetStatue) {
      handleUpdateStatue(focalTargetStatue.id, { imgPosition: newPos });
      setFocalTargetStatue(null);
      setFocalModalOpen(false);
    }
  };

  // S3 Image Select
  const handleSelectS3Image = (url: string) => {
    if (s3Target) {
      if (s3Target.type === 'main') {
        handleUpdateStatue(s3Target.statueId, { imgUrl: url });
        if (editingStatue && (editingStatue.id === s3Target.statueId || editingStatue.code === s3Target.statueId)) {
          setEditingStatue({ ...editingStatue, imgUrl: url });
        }
      } else if (editingStatue) {
        if (s3Target.type === 'videoThumb') {
          setEditingStatue({
            ...editingStatue,
            video: {
              title: editingStatue.video?.title || '',
              summary: editingStatue.video?.summary || '',
              videoUrl: editingStatue.video?.videoUrl || '',
              thumbnailUrl: url,
            },
          });
        } else if (s3Target.type === 'articleBanner') {
          setEditingStatue({
            ...editingStatue,
            article: {
              title: editingStatue.article?.title || '',
              author: editingStatue.article?.author || '',
              url: editingStatue.article?.url || '',
              bannerUrl: url,
            },
          });
        } else if (s3Target.type === 'galleryItem') {
          const list = [...(editingStatue.artVariations || [])];
          if (list[s3Target.index]) {
            list[s3Target.index] = { ...list[s3Target.index], imgUrl: url };
            setEditingStatue({ ...editingStatue, artVariations: list });
          }
        }
      }
      setS3Target(null);
    } else if (s3TargetStatueId) {
      handleUpdateStatue(s3TargetStatueId, { imgUrl: url });
      if (editingStatue && (editingStatue.id === s3TargetStatueId || editingStatue.code === s3TargetStatueId)) {
        setEditingStatue({ ...editingStatue, imgUrl: url });
      }
      setS3TargetStatueId(null);
    }
    setS3ModalOpen(false);
  };

  // Rotate Statue Image 90 Degrees
  const handleRotateStatue = async (st: StatueAdminItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentRot = st.imgRotation || 0;
    const nextRot = (currentRot + 90) % 360;

    // Optimistic UI update
    setStatues((prev) =>
      prev.map((s) => (s.id === st.id ? { ...s, imgRotation: nextRot } : s))
    );
    if (editingStatue && (editingStatue.id === st.id || editingStatue.code === st.code)) {
      setEditingStatue({ ...editingStatue, imgRotation: nextRot });
    }

    try {
      const res = await fetch('/api/admin/bao-tuong', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: st.id,
          code: st.code,
          updates: { imgRotation: nextRot },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🔄 Đã xoay ảnh ${st.code || st.name} sang ${nextRot}°!`);
      } else {
        showToast(`❌ ${data.error || 'Lỗi lưu xoay ảnh'}`);
      }
    } catch (err: any) {
      showToast('❌ Lỗi kết nối khi lưu xoay ảnh');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── TOAST NOTIFICATION ── */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#25170E] border-2 border-[#F2C14E] text-[#FFE5A3] font-bold text-sm shadow-[0_0_30px_rgba(242,193,78,0.4)] animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#F2C14E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── HEADER BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2C14E]/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#F2C14E]" />
            <span className="text-[10px] uppercase tracking-widest text-[#F2C14E]/80 font-bold">
              Phân Hệ Vũ Trụ &amp; Bảo Tượng Phật Giáo
            </span>
          </div>
          <h1
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-4xl sm:text-5xl text-[#ffde59] uppercase tracking-wider font-normal leading-tight"
          >
            QUẢN LÝ BẢO TƯỢNG TOÀN TỰ
          </h1>
          <p className="text-xs text-[#c9b896]/80">
            Quản lý {statues.length} pho tượng tôn nghiêm tại các không gian Tam Bảo, Tổ Đường, Giảng Đường, Sân Di Đà, Thư Viện, Tứ Ân...
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#25170E] p-1 rounded-xl border border-[#F2C14E]/30">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm'
                  : 'text-[#FFE5A3]/60 hover:text-[#FFE5A3]'
              }`}
              title="Chế độ xem dạng Thẻ Trực Quan"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#F2C14E] text-[#1C120A] shadow-sm'
                  : 'text-[#FFE5A3]/60 hover:text-[#FFE5A3]'
              }`}
              title="Chế độ xem dạng Bảng Danh Sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/kiem-tra-anh"
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#F2C14E] flex items-center justify-center transition-all cursor-pointer hover:scale-105 shadow-sm"
            title="Mở bảng Đối Soát & Kiểm Tra File Ảnh Toàn Bộ Tượng"
          >
            <ImageIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── FILTER TOOLBAR ── */}
      <div className="bg-[#25170E] p-4 rounded-2xl border border-[#F2C14E]/25 space-y-3 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#F2C14E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo Mã (TP0001), Tên tượng, Vị trí..."
              className="w-full pl-9 pr-3 py-2 bg-[#1A120B] border border-[#F2C14E]/40 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9b896] hover:text-[#F2C14E] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Assembly Filter */}
          <select
            value={selectedAssembly}
            onChange={(e) => setSelectedAssembly(e.target.value)}
            className="px-3 py-2 bg-[#1A120B] border border-[#F2C14E]/40 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
          >
            <option value="all">Tất cả Chúng Hội ({statues.length})</option>
            {assemblies
              .filter((a) => a !== 'all')
              .map((asm) => (
                <option key={asm} value={asm}>
                  {asm}
                </option>
              ))}
          </select>

          {/* Universe Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 bg-[#1A120B] border border-[#F2C14E]/40 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
          >
            {UNIVERSE_AREAS.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>

          {/* Statue Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-[#1A120B] border border-[#F2C14E]/40 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
          >
            <option value="all">Tất cả Loại tượng</option>
            <option value="TƯỢNG CHÍNH">TƯỢNG CHÍNH (Tôn tượng)</option>
            <option value="NTPG">Nghệ Thuật Phật Giáo (NTPG)</option>
          </select>
        </div>

        {/* Status Count Line */}
        <div className="flex items-center justify-between text-[11px] text-[#c9b896]/70 pt-1 border-t border-[#F2C14E]/10">
          <span>
            Đang hiển thị: <strong className="text-[#F2C14E]">{filtered.length}</strong> / {statues.length} bảo tượng
          </span>
          {(search || selectedAssembly !== 'all' || selectedArea !== 'all' || selectedType !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedAssembly('all');
                setSelectedArea('all');
                setSelectedType('all');
              }}
              className="text-[#F2C14E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 1. CHẾ ĐỘ THẺ ẢNH TRỰC QUAN (VISUAL GALLERY CARDS) ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((st) => {
            const focalPos = st.imgPosition || '50% 25%';
            return (
              <div
                key={st.id || st.code}
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#25170E] to-[#180E07] border border-[#F2C14E]/30 hover:border-[#F2C14E] p-3 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_12px_35px_rgba(242,193,78,0.25)] hover:-translate-y-1"
              >
                <div>
                  {/* Photo Frame with Focal Position Applied */}
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-black/60 border border-[#F2C14E]/30 mb-3 shadow-inner">
                    <img
                      src={st.imgUrl}
                      alt={st.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      style={{
                        objectPosition: focalPos,
                        transform: st.imgRotation ? `rotate(${st.imgRotation}deg)` : undefined,
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#F2C14E] font-mono text-[10px] font-bold border border-[#F2C14E]/40">
                          {st.code}
                        </span>
                        {st.imgRotation ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/90 text-black font-mono text-[9px] font-extrabold shadow-sm">
                            {st.imgRotation}°
                          </span>
                        ) : null}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase backdrop-blur-md ${
                          st.categoryType === 'TƯỢNG CHÍNH'
                            ? 'bg-amber-500/80 text-black border border-amber-300'
                            : 'bg-blue-600/80 text-white border border-blue-400'
                        }`}
                      >
                        {st.categoryType === 'TƯỢNG CHÍNH' ? 'Tượng Chính' : 'NTPG'}
                      </span>
                    </div>

                    {/* Interactive Action Buttons on Card */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
                      <button
                        type="button"
                        onClick={(e) => handleRotateStatue(st, e)}
                        className="w-7 h-7 rounded-lg bg-black/85 hover:bg-[#F2C14E] border border-[#F2C14E]/60 text-[#ffde59] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
                        title={`Xoay ảnh 90° (Hiện tại: ${st.imgRotation || 0}°)`}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFocalTargetStatue(st);
                          setFocalModalOpen(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-black/85 hover:bg-[#F2C14E] border border-[#F2C14E]/60 text-[#ffde59] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
                        title={`Kéo thả căn tiêu điểm ảnh (Hiện tại: ${focalPos})`}
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setS3TargetStatueId(st.id);
                          setS3ModalOpen(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-black/85 hover:bg-[#F2C14E] border border-[#F2C14E]/60 text-[#ffde59] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
                        title="Đổi ảnh tượng từ kho S3"
                      >
                        <Cloud className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Area Badge at Bottom-Left */}
                    <div className="absolute bottom-2 left-2 pointer-events-none">
                      <span className="text-[10px] text-[#FFE5A3]/90 font-medium bg-black/70 px-2 py-0.5 rounded-md border border-[#F2C14E]/20 truncate block max-w-[130px]">
                        {st.location || st.areaName || 'Tùng Lâm Hòa Phúc'}
                      </span>
                    </div>
                  </div>

                  {/* Statue Name and Subtitle */}
                  <div className="space-y-1">
                    <h3
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                      className="text-2xl text-[#FFE5A3] group-hover:text-[#F2C14E] transition-colors leading-tight uppercase line-clamp-1"
                    >
                      {st.name}
                    </h3>
                    {st.subtitle && (
                      <p className="text-[11px] text-[#c9b896]/80 italic line-clamp-1 font-sans">
                        {st.subtitle}
                      </p>
                    )}
                    <div className="text-[11px] text-[#F2C14E] font-medium truncate">
                      {st.assembly}
                    </div>

                    {/* NTPG Variations & Multimedia Badges */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                      {st.video?.videoUrl && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-950/70 text-red-300 text-[9px] font-bold border border-red-500/40" title="Có video minh họa">
                          <Film className="w-2.5 h-2.5 text-red-400" />
                          <span>Video</span>
                        </span>
                      )}
                      {st.artVariations && st.artVariations.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[9px] font-bold border border-amber-500/30" title="Bộ sưu tập ảnh chi tiết">
                          <Images className="w-2.5 h-2.5 text-amber-400" />
                          <span>{st.artVariations.length} ảnh</span>
                        </span>
                      )}
                      {((st.fullHistoryHtml && st.fullHistoryHtml.length > 50) || st.article?.url) && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-950/70 text-emerald-300 text-[9px] font-bold border border-emerald-500/40" title="Có bài viết chi tiết / liên kết">
                          <FileText className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Bài viết</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-[#F2C14E]/15">
                  <button
                    type="button"
                    onClick={() => setEditingStatue(st)}
                    className="flex-1 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-102"
                    title="Chỉnh sửa thông tin tượng"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span>Sửa Thông Tin</span>
                  </button>

                  <Link
                    href={`/bao-tuong-phat-giao/${st.slug || st.id}`}
                    target="_blank"
                    className="w-8 h-8 rounded-xl bg-[#1C120A] hover:bg-[#F2C14E] border border-[#F2C14E]/30 text-[#F2C14E] hover:text-[#1C120A] flex items-center justify-center transition-all cursor-pointer hover:scale-105 shrink-0"
                    title="Xem chi tiết trên website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 2. CHẾ ĐỘ BẢNG TINH GỌN (COMPACT HIGH-DENSITY TABLE) ── */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-[#F2C14E]/30 bg-[#1C120A] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto max-h-[75vh]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-[#2A1D14] text-[#F2C14E] uppercase tracking-wider font-bold border-b border-[#F2C14E]/30">
                <tr>
                  <th className="p-3 w-16">Mã</th>
                  <th className="p-3 w-20">Ảnh &amp; Tiêu Điểm</th>
                  <th className="p-3">Tên Tôn Tượng</th>
                  <th className="p-3">Chúng Hội &amp; Khu Vực</th>
                  <th className="p-3">Loại Tượng</th>
                  <th className="p-3">Lời Dạy Sư Phụ (Quote)</th>
                  <th className="p-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2C14E]/10">
                {filtered.map((st) => {
                  const focalPos = st.imgPosition || '50% 25%';
                  return (
                    <tr key={st.id || st.code} className="hover:bg-[#25170E]/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#F2C14E]">{st.code}</td>
                      <td className="p-3">
                        <div className="relative w-14 h-16 rounded-lg overflow-hidden border border-[#F2C14E]/30 bg-black/40 group/thumb">
                          <img
                            src={st.imgUrl}
                            alt={st.name}
                            className="w-full h-full object-cover transition-all duration-300"
                            style={{
                              objectPosition: focalPos,
                              transform: st.imgRotation ? `rotate(${st.imgRotation}deg)` : undefined,
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFocalTargetStatue(st);
                              setFocalModalOpen(true);
                            }}
                            className="absolute inset-0 bg-black/70 text-[#ffde59] opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                            title="Bấm để chỉnh tiêu điểm"
                          >
                            <Crosshair className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="font-bold text-white text-sm">{st.name}</div>
                        {st.subtitle && <div className="text-[11px] text-[#FFE5A3]/80 italic">{st.subtitle}</div>}
                        {st.artVariations && st.artVariations.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>{st.artVariations.length} Tác phẩm NTPG kèm theo</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="text-[#F2C14E] font-medium">{st.assembly}</div>
                        <div className="text-[11px] text-[#c9b896]/70">{st.location || st.areaName}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            st.categoryType === 'TƯỢNG CHÍNH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {st.categoryType}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs text-[11px] text-[#c9b896]/80 line-clamp-2">
                        {st.quote ? `"${st.quote}"` : '—'}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleRotateStatue(st, e)}
                            className="p-2 rounded-lg bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all cursor-pointer"
                            title={`Xoay ảnh 90° (Hiện tại: ${st.imgRotation || 0}°)`}
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFocalTargetStatue(st);
                              setFocalModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all cursor-pointer"
                            title="Kéo thả căn tiêu điểm ảnh"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setS3TargetStatueId(st.id);
                              setS3ModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all cursor-pointer"
                            title="Đổi ảnh từ kho S3"
                          >
                            <Cloud className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingStatue(st)}
                            className="p-2 rounded-lg bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all cursor-pointer"
                            title="Sửa thông tin"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/bao-tuong-phat-giao/${st.slug || st.id}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-[#F2C14E]/20 hover:bg-[#F2C14E]/30 border border-[#F2C14E]/50 text-[#F2C14E] transition-all"
                            title="Xem chi tiết trên website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL ĐỊNH VỊ TIÊU ĐIỂM ẢNH (IMAGE FOCAL POSITIONER) ── */}
      {focalTargetStatue && (
        <ImageFocalPositionerModal
          isOpen={focalModalOpen}
          imageUrl={focalTargetStatue.imgUrl}
          initialPosition={focalTargetStatue.imgPosition || '50% 25%'}
          title={`Căn Tiêu Điểm: ${focalTargetStatue.name}`}
          onSave={handleSaveFocalPoint}
          onClose={() => {
            setFocalModalOpen(false);
            setFocalTargetStatue(null);
          }}
        />
      )}

      {/* ── MODAL CHỌN ẢNH S3 (S3 EXPLORER) ── */}
      <S3FileExplorerModal
        isOpen={s3ModalOpen}
        onClose={() => {
          setS3ModalOpen(false);
          setS3TargetStatueId(null);
        }}
        onSelectImage={handleSelectS3Image}
      />

      {/* ── MODAL CHỈNH SỬA THÔNG TIN BẢO TƯỢNG (KÈM BÀI VIẾT & XOAY ẢNH) ── */}
      {editingStatue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#180E07] border-2 border-[#F2C14E] rounded-3xl p-6 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-[#F2C14E]/30 pb-3">
              <div className="flex items-center gap-3">
                <h3 style={{ fontFamily: "'UTM Niagara', serif" }} className="text-3xl text-[#ffde59] uppercase">
                  CHỈNH SỬA BẢO TƯỢNG {editingStatue.code}
                </h3>
                {editingStatue.imgRotation ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    Đã xoay {editingStatue.imgRotation}°
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setEditingStatue(null)}
                className="w-8 h-8 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Image Preview & Instant Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-[#25170E]/70 border border-[#F2C14E]/25">
              <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-black/70 border border-[#F2C14E]/50 shrink-0 shadow-md">
                <img
                  src={editingStatue.imgUrl}
                  alt={editingStatue.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{
                    objectPosition: editingStatue.imgPosition || '50% 25%',
                    transform: editingStatue.imgRotation ? `rotate(${editingStatue.imgRotation}deg)` : undefined,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
                  }}
                />
              </div>

              <div className="flex-1 space-y-2 text-xs w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRotateStatue(editingStatue)}
                    className="px-3 py-1.5 rounded-xl bg-[#3A2718] hover:bg-[#F2C14E] border border-[#F2C14E]/50 text-[#FFE5A3] hover:text-black font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    title="Xoay ảnh 90 độ theo chiều kim đồng hồ"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Xoay ảnh 90° ({editingStatue.imgRotation || 0}°)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setS3TargetStatueId(editingStatue.id);
                      setS3ModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F2C14E] text-black font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Chọn ảnh từ S3</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFocalTargetStatue(editingStatue);
                      setFocalModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#3A2718] hover:bg-[#4A3220] border border-[#F2C14E]/40 text-[#FFE5A3] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                  >
                    <Crosshair className="w-3.5 h-3.5 text-[#F2C14E]" />
                    <span>Căn tiêu điểm</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#c9b896]/70 truncate">
                  Đường dẫn: <span className="font-mono text-[#FFE5A3]">{editingStatue.imgUrl}</span>
                </div>
              </div>
            </div>

            {/* ── BỘ CHỌN TAB ĐA PHƯƠNG TIỆN (5 TABS CHUẨN HOÀNG KIM) ── */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#25170E] rounded-2xl border border-[#F2C14E]/30 shrink-0 my-1">
              <button
                type="button"
                onClick={() => setModalTab('info')}
                className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modalTab === 'info' ? 'bg-[#F2C14E] text-[#1A120B] shadow-md' : 'text-[#c9b896] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>1. Cơ Bản</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('article')}
                className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modalTab === 'article' ? 'bg-[#F2C14E] text-[#1A120B] shadow-md' : 'text-[#c9b896] hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>2. Bài Viết Chi Tiết</span>
                {editingStatue.fullHistoryHtml && editingStatue.fullHistoryHtml.length > 50 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setModalTab('video')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modalTab === 'video' ? 'bg-[#F2C14E] text-[#1A120B] shadow-md' : 'text-[#c9b896] hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>3. Video</span>
                {editingStatue.video?.videoUrl && (
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setModalTab('gallery')}
                className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modalTab === 'gallery' ? 'bg-[#F2C14E] text-[#1A120B] shadow-md' : 'text-[#c9b896] hover:text-white'
                }`}
              >
                <Images className="w-3.5 h-3.5" />
                <span>4. Album Ảnh ({editingStatue.artVariations?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('related')}
                className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modalTab === 'related' ? 'bg-[#F2C14E] text-[#1A120B] shadow-md' : 'text-[#c9b896] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>5. Bài Viết Liên Quan</span>
              </button>
            </div>

            {/* ── NỘI DUNG TỪNG TAB (SCROLLABLE CONTAINER) ── */}
            <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-4 text-xs">
              
              {/* TAB 1: THÔNG TIN CƠ BẢN */}
              {modalTab === 'info' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                  <div>
                    <label className="block text-[#c9b896] font-bold mb-1">Tên Tôn Tượng</label>
                    <input
                      type="text"
                      value={editingStatue.name}
                      onChange={(e) => setEditingStatue({ ...editingStatue, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#c9b896] font-bold mb-1">Danh hiệu / Tên phụ</label>
                    <input
                      type="text"
                      value={editingStatue.subtitle || ''}
                      onChange={(e) => setEditingStatue({ ...editingStatue, subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#c9b896] font-bold mb-1">Chúng Hội</label>
                    <input
                      type="text"
                      value={editingStatue.assembly}
                      onChange={(e) => setEditingStatue({ ...editingStatue, assembly: e.target.value })}
                      className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#c9b896] font-bold mb-1">Vị trí an vị / Không gian</label>
                    <input
                      type="text"
                      value={editingStatue.location || editingStatue.areaName || ''}
                      onChange={(e) => setEditingStatue({ ...editingStatue, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#c9b896] font-bold mb-1">Phân loại Tượng</label>
                    <select
                      value={editingStatue.categoryType}
                      onChange={(e) => setEditingStatue({ ...editingStatue, categoryType: e.target.value })}
                      className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                    >
                      <option value="TƯỢNG CHÍNH">TƯỢNG CHÍNH</option>
                      <option value="NTPG">NTPG (Nghệ Thuật Phật Giáo / Tượng phụ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#c9b896] font-bold mb-1">Tác giả lời dạy (Quote Author)</label>
                    <input
                      type="text"
                      value={editingStatue.quoteAuthor || 'VÔ TRÍ - TÂM HÒA'}
                      onChange={(e) => setEditingStatue({ ...editingStatue, quoteAuthor: e.target.value })}
                      className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#c9b896] font-bold mb-1">Lời Dạy Sư Phụ (Quote Pháp Ngữ)</label>
                    <textarea
                      rows={2}
                      value={editingStatue.quote || ''}
                      onChange={(e) => setEditingStatue({ ...editingStatue, quote: e.target.value })}
                      className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                      placeholder="Nhập lời dạy của Sư Phụ hoặc ý nghĩa biểu tượng..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#c9b896] font-bold mb-1">Mô tả tóm tắt tôn tượng</label>
                    <textarea
                      rows={3}
                      value={editingStatue.description || editingStatue.summary || ''}
                      onChange={(e) => setEditingStatue({ ...editingStatue, description: e.target.value, summary: e.target.value })}
                      className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                      placeholder="Tóm tắt ý nghĩa, biểu tượng hoặc lược sử..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#c9b896] font-bold mb-1">Đường dẫn ảnh Tượng chính</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingStatue.imgUrl}
                        onChange={(e) => setEditingStatue({ ...editingStatue, imgUrl: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] font-mono text-[11px] focus:outline-none focus:border-[#F2C14E]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setS3Target({ type: 'main', statueId: editingStatue.id });
                          setS3ModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-[#F2C14E] text-black font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Cloud className="w-3.5 h-3.5" />
                        <span>Chọn S3</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BÀI VIẾT CHI TIẾT & LỊCH SỬ TÔN TƯỢNG */}
              {modalTab === 'article' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#F2C14E]">Toàn Văn Bài Viết &amp; Lịch Sử Tôn Trí</h4>
                      <p className="text-[11px] text-[#c9b896]/70">
                        Hỗ trợ định dạng HTML (tiêu đề &lt;h3&gt;, đoạn văn &lt;p&gt;, trích dẫn &lt;blockquote&gt;, in đậm &lt;strong&gt;, danh sách &lt;ul&gt;&lt;li&gt;)
                      </p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#25170E] border border-[#F2C14E]/40 text-[#FFE5A3] font-mono">
                      {editingStatue.fullHistoryHtml?.length || 0} ký tự
                    </span>
                  </div>

                  <textarea
                    rows={12}
                    value={editingStatue.fullHistoryHtml || editingStatue.articleContent || ''}
                    onChange={(e) =>
                      setEditingStatue({
                        ...editingStatue,
                        fullHistoryHtml: e.target.value,
                        articleContent: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] font-mono text-[11px] leading-relaxed focus:outline-none focus:border-[#F2C14E] resize-y"
                    placeholder="Nhập toàn văn bài viết chi tiết, lịch sử xuất xứ, thần tích hoặc văn tế an vị bảo tượng..."
                  />

                  {editingStatue.fullHistoryHtml && editingStatue.fullHistoryHtml.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#25170E]/50 border border-[#F2C14E]/20">
                      <div className="text-[10px] uppercase font-bold text-[#F2C14E]/80 tracking-wider mb-2">
                        👁️ Xem trước nội dung bài viết
                      </div>
                      <div
                        className="prose prose-invert max-w-none text-xs text-[#e3d2c1] space-y-2 max-h-48 overflow-y-auto pr-2"
                        dangerouslySetInnerHTML={{ __html: editingStatue.fullHistoryHtml }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: VIDEO LIÊN QUAN */}
              {modalTab === 'video' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                    💡 <strong>Cài đặt Video:</strong> Hỗ trợ liên kết video YouTube thuyết giảng, tài liệu quay cảnh chiêm bái hoặc phóng sự về tôn tượng.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[#c9b896] font-bold mb-1">Tiêu Đề Video</label>
                      <input
                        type="text"
                        value={editingStatue.video?.title || ''}
                        onChange={(e) =>
                          setEditingStatue({
                            ...editingStatue,
                            video: {
                              title: e.target.value,
                              summary: editingStatue.video?.summary || '',
                              videoUrl: editingStatue.video?.videoUrl || '',
                              thumbnailUrl: editingStatue.video?.thumbnailUrl || '',
                            },
                          })
                        }
                        placeholder={`Ví dụ: Ý Nghĩa Thờ Phụng ${editingStatue.name}`}
                        className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#c9b896] font-bold mb-1">Đường Dẫn Video (YouTube Embed hoặc Link xem)</label>
                      <input
                        type="text"
                        value={editingStatue.video?.videoUrl || ''}
                        onChange={(e) =>
                          setEditingStatue({
                            ...editingStatue,
                            video: {
                              title: editingStatue.video?.title || '',
                              summary: editingStatue.video?.summary || '',
                              videoUrl: e.target.value,
                              thumbnailUrl: editingStatue.video?.thumbnailUrl || '',
                            },
                          })
                        }
                        placeholder="Ví dụ: https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                        className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] font-mono text-[11px] focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#c9b896] font-bold mb-1">Ảnh Bìa / Thumbnail Video</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingStatue.video?.thumbnailUrl || ''}
                          onChange={(e) =>
                            setEditingStatue({
                              ...editingStatue,
                              video: {
                                title: editingStatue.video?.title || '',
                                summary: editingStatue.video?.summary || '',
                                videoUrl: editingStatue.video?.videoUrl || '',
                                thumbnailUrl: e.target.value,
                              },
                            })
                          }
                          placeholder="Nhập URL ảnh thumbnail hoặc chọn từ S3..."
                          className="flex-1 px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] font-mono text-[11px] focus:outline-none focus:border-[#F2C14E]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setS3Target({ type: 'videoThumb' });
                            setS3ModalOpen(true);
                          }}
                          className="px-3 py-2 rounded-xl bg-[#F2C14E] text-black font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Cloud className="w-3.5 h-3.5" />
                          <span>Chọn S3</span>
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#c9b896] font-bold mb-1">Tóm Tắt Nội Dung Video</label>
                      <textarea
                        rows={3}
                        value={editingStatue.video?.summary || ''}
                        onChange={(e) =>
                          setEditingStatue({
                            ...editingStatue,
                            video: {
                              title: editingStatue.video?.title || '',
                              summary: e.target.value,
                              videoUrl: editingStatue.video?.videoUrl || '',
                              thumbnailUrl: editingStatue.video?.thumbnailUrl || '',
                            },
                          })
                        }
                        placeholder="Tóm lược nội dung chính của video..."
                        className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BỘ SƯU TẬP ẢNH & DỊ BẢN (GALLERY) */}
              {modalTab === 'gallery' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#F2C14E]">
                        Bộ Sưu Tập Góc Chiêm Bái &amp; Tác Phẩm Nghệ Thuật Liên Quan
                      </h4>
                      <p className="text-[11px] text-[#c9b896]/70">
                        Quản lý các ảnh góc chụp cận cảnh, hoa văn, bảo tòa hoặc tác phẩm NTPG thuộc bảo tượng này.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddGalleryItem}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#ffde59] text-black font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102 transition-transform shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Ảnh Mới</span>
                    </button>
                  </div>

                  {(!editingStatue.artVariations || editingStatue.artVariations.length === 0) ? (
                    <div className="p-8 rounded-2xl bg-[#25170E]/40 border border-[#F2C14E]/20 text-center space-y-3">
                      <Images className="w-10 h-10 text-[#F2C14E]/40 mx-auto" />
                      <p className="text-xs text-[#c9b896]/80">Chưa có ảnh chi tiết nào trong bộ sưu tập.</p>
                      <button
                        type="button"
                        onClick={handleAddGalleryItem}
                        className="px-4 py-2 rounded-xl bg-[#F2C14E] text-black font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow hover:scale-102 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm ảnh đầu tiên</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingStatue.artVariations.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-3.5 rounded-2xl bg-[#25170E] border border-[#F2C14E]/30 flex flex-col sm:flex-row items-start gap-3 shadow-md"
                        >
                          {/* Image Box with S3 trigger */}
                          <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-black/70 border border-[#F2C14E]/40 shrink-0 group">
                            <img
                              src={item.imgUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setS3Target({ type: 'galleryItem', index: idx });
                                setS3ModalOpen(true);
                              }}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-[#F2C14E] font-bold gap-1 cursor-pointer"
                            >
                              <Cloud className="w-4 h-4" />
                              <span>Đổi S3</span>
                            </button>
                          </div>

                          {/* Inputs */}
                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded bg-black/50 text-[#F2C14E] font-mono text-[10px] font-bold">
                                Ảnh #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryItem(idx)}
                                className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors cursor-pointer"
                                title="Xóa ảnh này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[#c9b896]/70 text-[10px] font-bold mb-0.5">Tiêu đề ảnh</label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => {
                                    const list = [...editingStatue.artVariations!];
                                    list[idx] = { ...list[idx], title: e.target.value };
                                    setEditingStatue({ ...editingStatue, artVariations: list });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-lg text-[#FFE5A3] text-xs focus:outline-none focus:border-[#F2C14E]"
                                />
                              </div>

                              <div>
                                <label className="block text-[#c9b896]/70 text-[10px] font-bold mb-0.5">Vị trí an vị / Không gian</label>
                                <input
                                  type="text"
                                  value={item.location}
                                  onChange={(e) => {
                                    const list = [...editingStatue.artVariations!];
                                    list[idx] = { ...list[idx], location: e.target.value };
                                    setEditingStatue({ ...editingStatue, artVariations: list });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-lg text-[#FFE5A3] text-xs focus:outline-none focus:border-[#F2C14E]"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[#c9b896]/70 text-[10px] font-bold mb-0.5">Ý nghĩa tôn trí / Chi tiết nghệ thuật</label>
                                <input
                                  type="text"
                                  value={item.meaning}
                                  onChange={(e) => {
                                    const list = [...editingStatue.artVariations!];
                                    list[idx] = { ...list[idx], meaning: e.target.value };
                                    setEditingStatue({ ...editingStatue, artVariations: list });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-lg text-[#FFE5A3] text-xs focus:outline-none focus:border-[#F2C14E]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: BÀI VIẾT LIÊN QUAN */}
              {modalTab === 'related' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                    💡 <strong>Bài Viết &amp; Ấn Phẩm Liên Quan:</strong> Hiển thị khối liên kết dẫn người xem đến bài viết hoằng pháp hoặc ấn phẩm kinh sách liên quan trực tiếp đến bảo tượng này.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#c9b896] font-bold mb-1">Tiêu Đề Bài Viết</label>
                      <input
                        type="text"
                        value={editingStatue.article?.title || ''}
                        onChange={(e) =>
                          setEditingStatue({
                            ...editingStatue,
                            article: {
                              title: e.target.value,
                              author: editingStatue.article?.author || '',
                              url: editingStatue.article?.url || '',
                              bannerUrl: editingStatue.article?.bannerUrl || '',
                            },
                          })
                        }
                        placeholder="Ví dụ: Đại Lễ An Vị Tôn Tượng"
                        className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#c9b896] font-bold mb-1">Tác Giả / Đơn Vị</label>
                      <input
                        type="text"
                        value={editingStatue.article?.author || ''}
                        onChange={(e) =>
                          setEditingStatue({
                            ...editingStatue,
                            article: {
                              title: editingStatue.article?.title || '',
                              author: e.target.value,
                              url: editingStatue.article?.url || '',
                              bannerUrl: editingStatue.article?.bannerUrl || '',
                            },
                          })
                        }
                        placeholder="Ví dụ: Ban Văn Hóa Tùng Lâm Hòa Phúc"
                        className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#c9b896] font-bold mb-1">Đường Dẫn Liên Kết (URL)</label>
                      <input
                        type="text"
                        value={editingStatue.article?.url || ''}
                        onChange={(e) =>
                          setEditingStatue({
                            ...editingStatue,
                            article: {
                              title: editingStatue.article?.title || '',
                              author: editingStatue.article?.author || '',
                              url: e.target.value,
                              bannerUrl: editingStatue.article?.bannerUrl || '',
                            },
                          })
                        }
                        placeholder="Ví dụ: /dong-chay-hoang-phap/... hoặc /tong-chi-tu-hoc/..."
                        className="w-full px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] font-mono text-[11px] focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#c9b896] font-bold mb-1">Ảnh Bìa Bài Viết (Banner)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingStatue.article?.bannerUrl || ''}
                          onChange={(e) =>
                            setEditingStatue({
                              ...editingStatue,
                              article: {
                                title: editingStatue.article?.title || '',
                                author: editingStatue.article?.author || '',
                                url: editingStatue.article?.url || '',
                                bannerUrl: e.target.value,
                              },
                            })
                          }
                          placeholder="Nhập URL banner hoặc bấm Chọn S3..."
                          className="flex-1 px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-[#FFE5A3] font-mono text-[11px] focus:outline-none focus:border-[#F2C14E]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setS3Target({ type: 'articleBanner' });
                            setS3ModalOpen(true);
                          }}
                          className="px-3 py-2 rounded-xl bg-[#F2C14E] text-black font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Cloud className="w-3.5 h-3.5" />
                          <span>Chọn S3</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F2C14E]/20 shrink-0">
              <button
                type="button"
                onClick={() => setEditingStatue(null)}
                className="px-5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] font-bold text-xs cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  handleUpdateStatue(editingStatue.id, editingStatue);
                  setEditingStatue(null);
                }}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#ffde59] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer hover:scale-102 transition-transform"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
