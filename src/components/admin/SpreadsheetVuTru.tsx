'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Plus,
  Save,
  Trash2,
  Edit3,
  Search,
  ExternalLink,
  RefreshCw,
  Loader2,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Cloud,
  Layers,
  MapPin,
  Mic,
  Landmark,
  X,
  Check,
} from 'lucide-react';

import { UniverseArea } from '@/data/universe-data';
import { S3FileExplorerModal } from './S3FileExplorerModal';

export function SpreadsheetVuTru() {
  const [areas, setAreas] = useState<UniverseArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedTemple, setSelectedTemple] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // S3 File Explorer Modal
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);
  const [targetImageCallback, setTargetImageCallback] = useState<((url: string) => void) | null>(null);

  const [openingWpId, setOpeningWpId] = useState<string | null>(null);

  // Sub-items Modal (Statues, Stories, Special features)
  const [activeModal, setActiveModal] = useState<{
    type: 'statues' | 'stories' | 'dharma' | 'museum';
    rowIndex: number;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch areas from API
  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/vu-tru');
      const data = await res.json();
      if (data.success && data.areas) {
        setAreas(data.areas);
      }
    } catch (err: any) {
      showToast(`Lỗi khi tải dữ liệu vũ trụ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const openS3Library = (callback: (url: string) => void) => {
    setTargetImageCallback(() => callback);
    setImageLibraryOpen(true);
  };

  // Save areas to backend
  const saveAreasToBackend = async (areasToSave: UniverseArea[], silent: boolean = false) => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/vu-tru', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(areasToSave),
      });
      const data = await res.json();
      if (data.success) {
        setAreas(areasToSave);
        setIsDirty(false);
        if (!silent) showToast(`✅ Đã lưu thành công ${areasToSave.length} không gian kiến trúc!`);
      } else {
        showToast(data.error || 'Có lỗi xảy ra khi lưu không gian');
      }
    } catch (err: any) {
      showToast(`Không thể kết nối đến máy chủ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Global Ctrl+S Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveAreasToBackend(areas, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [areas]);

  // 🌟 MỞ TRỰC TIẾP TRÌNH SOẠN THẢO WORDPRESS GUTENBERG (1-CLICK)
  const handleOpenGutenberg = async (row: UniverseArea, index: number) => {
    setOpeningWpId(row.id);
    showToast('⚡ Đang kết nối WordPress và nạp nội dung không gian vào Gutenberg...');

    // Mở tab trống trước để chống popup blocker của trình duyệt
    const newTab = window.open('about:blank', '_blank');

    try {
      const res = await fetch('/api/admin/wp-post-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: row.wpPostId,
          title: row.name || 'Không gian Vũ Trụ Phật Giáo Mới',
          subtitle: row.subtitle || row.description || '',
          content: (row as any).contentHtml || (row as any).content || row.description || row.subtitle || '',
          contentHtml: (row as any).contentHtml || '',
          summary: row.description || row.subtitle || '',
          category: 'vu-tru-phat-giao',
          postType: 'post',
        }),
      });
      const data = await res.json();
      if (data.success && data.editUrl) {
        if (data.wpPostId && String(data.wpPostId) !== String(row.wpPostId)) {
          const updated = [...areas];
          updated[index].wpPostId = String(data.wpPostId);
          setAreas(updated);
          await saveAreasToBackend(updated, true);
        }
        if (newTab) {
          newTab.location.href = data.editUrl;
        } else {
          window.open(data.editUrl, '_blank', 'noopener,noreferrer');
        }
        showToast('✨ Đã mở trình soạn thảo WordPress Gutenberg với đầy đủ nội dung bài viết!');
      } else {
        const fallbackUrl = 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php';
        if (newTab) newTab.location.href = fallbackUrl;
        else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      const fallbackUrl = 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php';
      if (newTab) newTab.location.href = fallbackUrl;
      else window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setOpeningWpId(null);
    }
  };

  // Thêm không gian mới
  const handleAddNewArea = () => {
    const newArea: UniverseArea = {
      id: `area-${Date.now()}`,
      pinNumber: areas.length + 1,
      slug: `khong-gian-${Date.now().toString().slice(-4)}`,
      name: 'KHÔNG GIAN KIẾN TRÚC MỚI',
      subtitle: 'Tùng Lâm Hòa Phúc',
      temple: selectedTemple === 'quynh-nhai-cam-lo-tu' ? 'quynh-nhai-cam-lo-tu' : 'tung-lam-hoa-phuc',
      templeName: selectedTemple === 'quynh-nhai-cam-lo-tu' ? 'Quỳnh Nhai Cam Lộ Tự' : 'Tùng Lâm Hòa Phúc',
      imgUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      mapPos: { x: 50, y: 50 },
      description: 'Mô tả tổng quan về không gian tâm linh này...',
      fullContent: 'Nội dung chi tiết về kiến trúc, lịch sử và ý nghĩa của không gian...',
      statues: [],
      stories: [],
    };

    const updated = [newArea, ...areas];
    setAreas(updated);
    setIsDirty(true);
    showToast('✨ Đã thêm không gian mới vào Vũ Trụ Phật Giáo!');
  };

  // Xóa không gian
  const handleDeleteArea = (index: number) => {
    const target = areas[index];
    if (!target) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa không gian:\n"${target.name}"?`)) return;

    const updated = areas.filter((_, i) => i !== index);
    setAreas(updated);
    setIsDirty(true);
    saveAreasToBackend(updated, false);
    showToast(`🗑️ Đã xóa không gian "${target.name}"`);
  };

  // Filtered areas
  const filteredAreas = useMemo(() => {
    return areas.filter((a) => {
      if (selectedTemple !== 'all' && a.temple !== selectedTemple) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (a.name || '').toLowerCase().includes(q);
        const matchSub = (a.subtitle || '').toLowerCase().includes(q);
        const matchDesc = (a.description || '').toLowerCase().includes(q);
        const matchContent = (a.fullContent || '').toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchDesc && !matchContent) return false;
      }
      return true;
    });
  }, [areas, selectedTemple, searchQuery]);

  return (
    <div
      style={{ fontFamily: "'UTM Avo', sans-serif" }}
      className="w-full min-h-screen bg-[#140D07] text-[#FFE5A3] p-4 sm:p-6 lg:p-8 selection:bg-[#F2C14E] selection:text-black space-y-6"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl bg-[#2A1D14] border-2 border-[#F2C14E] text-[#ffde59] text-xs sm:text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}

      {/* 🌟 1. TOOLBAR HEADER */}
      <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D1B10] border border-[#F2C14E]/60 flex items-center justify-center text-[#F2C14E] shadow-inner shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#FFE5A3] flex items-center gap-2">
              <span>Bảng Quản Trị Vũ Trụ Phật Giáo</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#F2C14E] text-xs font-mono font-bold border border-[#F2C14E]/40">
                {areas.length} Không Gian
              </span>
            </h2>
            <p className="text-[11px] text-[#c9b896] flex items-center gap-1.5 flex-wrap">
              <span>Chính Điện Tam Bảo, Tổ Đường, Giảng Đường, Tứ Ân, Bảo Tháp, Bảo Tàng Số 3 Miền</span>
              <span>•</span>
              <span>Đồng bộ giao diện Frontend</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Nút 0: Quản Lý Tệp S3 */}
          <button
            type="button"
            onClick={() => {
              setTargetImageCallback(null);
              setImageLibraryOpen(true);
            }}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Mở Trình Quản Lý Tệp S3 Đám Mây (Cây Thư Mục & Quản Lý Ảnh)"
          >
            <Cloud className="w-5 h-5" />
          </button>

          {/* Nút 1: Thêm Không Gian */}
          <button
            type="button"
            onClick={handleAddNewArea}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Thêm Không Gian Kiến Trúc Mới"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Nút 2: Tải lại */}
          <button
            type="button"
            onClick={fetchAreas}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Tải lại dữ liệu không gian"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Nút 3: Lưu Bảng Tính */}
          <button
            type="button"
            onClick={() => saveAreasToBackend(areas, false)}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#1A120B] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 disabled:opacity-50"
            title="Lưu toàn bộ bảng tính ngay (Ctrl+S)"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#F2C14E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên không gian, phụ đề hoặc nội dung..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] shadow-sm"
          />
        </div>

        {/* Dropdown Lọc Tự Viện */}
        <select
          value={selectedTemple}
          onChange={(e) => setSelectedTemple(e.target.value)}
          className="px-3.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none cursor-pointer shadow-sm min-w-[240px]"
        >
          <option value="all">Tất Cả Tự Viện ({areas.length})</option>
          <option value="tung-lam-hoa-phuc">
            Tùng Lâm Hòa Phúc ({areas.filter((a) => a.temple === 'tung-lam-hoa-phuc').length})
          </option>
          <option value="quynh-nhai-cam-lo-tu">
            Quỳnh Nhai Cam Lộ Tự ({areas.filter((a) => a.temple === 'quynh-nhai-cam-lo-tu').length})
          </option>
        </select>
      </div>

      {/* 🌟 2. BẢNG TÍNH SPREADSHEET 8 CỘT CHUẨN HÓA */}
      <div className="rounded-2xl border border-[#F2C14E]/35 bg-[#1C120A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[78vh] custom-scrollbar">
          <table className="w-full border-collapse text-xs text-left min-w-[1100px] table-fixed">
            <thead className="sticky top-0 z-20 bg-[#321F14] text-[#F2C14E] uppercase tracking-wider font-bold border-b border-[#F2C14E]/40 select-none shadow-md">
              <tr>
                <th className="p-3 w-[45px] min-w-[45px] text-center border-r border-[#F2C14E]/20">#</th>
                <th className="p-3 w-[160px] min-w-[160px] border-r border-[#F2C14E]/20 text-center">Tự Viện / Phân Khu</th>
                <th className="p-3 w-[80px] min-w-[80px] text-center border-r border-[#F2C14E]/20">Ảnh Bìa</th>
                <th className="p-3 w-[220px] min-w-[220px] border-r border-[#F2C14E]/20">Tên Không Gian</th>
                <th className="p-3 w-[200px] min-w-[200px] border-r border-[#F2C14E]/20">Phụ Đề & Vị Trí</th>
                <th className="p-3 w-[160px] min-w-[160px] border-r border-[#F2C14E]/20 text-center">Tượng & Câu Chuyện</th>
                <th
                  className="p-3 border-r border-[#F2C14E]/20 cursor-help"
                  title="Bấm vào từng ô để mở trình soạn thảo toàn màn hình"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Nội Dung Chi Tiết</span>
                    <Edit3 className="w-3.5 h-3.5 text-[#F2C14E]/80 shrink-0" />
                  </div>
                </th>
                <th className="p-3 w-[85px] min-w-[85px] text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2C14E]/15">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#c9b896]/70">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#F2C14E]" />
                    <span>Đang tải dữ liệu không gian kiến trúc...</span>
                  </td>
                </tr>
              ) : filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#c9b896]/70">
                    Không có không gian nào trong danh mục này.
                  </td>
                </tr>
              ) : (
                filteredAreas.map((row, filterIdx) => {
                  const targetIdx = areas.findIndex((a) => a.id === row.id);
                  const actualIdx = targetIdx !== -1 ? targetIdx : filterIdx;

                  const statueCount = row.statues?.length || 0;
                  const storyCount = row.stories?.length || 0;
                  const isGiangDuong = row.slug === 'giang-duong';
                  const isBaoTang = row.slug.includes('bao-tang');
                  const publicUrl = `/vu-tru-phat-giao/${row.slug}`;

                  return (
                    <tr
                      key={row.id || filterIdx}
                      className={`transition-colors group focus-within:bg-[#2D1B0F] ${
                        filterIdx % 2 === 0 ? 'bg-[#170E08]' : 'bg-[#120A05]'
                      } hover:bg-[#26160B]`}
                    >
                      {/* 1. STT */}
                      <td className="p-3 w-[45px] min-w-[45px] text-center font-mono font-bold text-[#F2C14E] border-r border-[#F2C14E]/15 bg-[#140D07]/60 align-middle">
                        {actualIdx + 1}
                      </td>

                      {/* 2. Tự Viện / Phân Khu */}
                      <td className="p-2.5 w-[160px] min-w-[160px] border-r border-[#F2C14E]/15 align-middle">
                        <select
                          value={row.temple}
                          onChange={(e) => {
                            const updated = [...areas];
                            updated[actualIdx].temple = e.target.value as any;
                            updated[actualIdx].templeName =
                              e.target.value === 'quynh-nhai-cam-lo-tu' ? 'Quỳnh Nhai Cam Lộ Tự' : 'Tùng Lâm Hòa Phúc';
                            setAreas(updated);
                            setIsDirty(true);
                          }}
                          className="w-full px-2.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none transition-all cursor-pointer shadow-sm"
                        >
                          <option value="tung-lam-hoa-phuc">Tùng Lâm Hòa Phúc</option>
                          <option value="quynh-nhai-cam-lo-tu">Quỳnh Nhai Cam Lộ Tự</option>
                        </select>
                      </td>

                      {/* 3. Ảnh Bìa / 3D */}
                      <td className="p-2 w-[80px] min-w-[80px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div
                          onClick={() =>
                            openS3Library((url) => {
                              const updated = [...areas];
                              updated[actualIdx].imgUrl = url;
                              setAreas(updated);
                              setIsDirty(true);
                            })
                          }
                          className="relative w-14 h-12 mx-auto rounded-xl overflow-hidden border border-[#F2C14E]/40 hover:border-[#F2C14E] bg-black/60 cursor-pointer group/banner shadow-sm transition-all hover:scale-105"
                          title="Bấm để đổi ảnh không gian từ S3"
                        >
                          <img
                            src={row.imgUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp'}
                            alt="Banner"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                            Sửa
                          </div>
                        </div>
                      </td>

                      {/* 4. Tên Không Gian */}
                      <td className="p-2.5 w-[220px] min-w-[220px] border-r border-[#F2C14E]/15 align-middle">
                        <input
                          type="text"
                          value={row.name || ''}
                          onChange={(e) => {
                            const updated = [...areas];
                            updated[actualIdx].name = e.target.value;
                            setAreas(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Tên không gian..."
                          className="w-full px-2.5 py-2 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none transition-all shadow-sm uppercase tracking-wide"
                        />
                      </td>

                      {/* 5. Phụ Đề & Vị Trí */}
                      <td className="p-2.5 w-[200px] min-w-[200px] border-r border-[#F2C14E]/15 align-middle">
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={row.subtitle || ''}
                            onChange={(e) => {
                              const updated = [...areas];
                              updated[actualIdx].subtitle = e.target.value;
                              setAreas(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Phụ đề không gian..."
                            className="w-full px-2.5 py-1.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] focus:outline-none transition-all shadow-sm"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#c9b896]/60 font-mono">Pin #{row.pinNumber}</span>
                            <span className="text-[10px] text-[#F2C14E]/70 font-mono">
                              ({row.mapPos?.x ?? 50}%, {row.mapPos?.y ?? 50}%)
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 6. Tượng Pháp, Câu Chuyện & Đặc Thù */}
                      <td className="p-2.5 w-[160px] min-w-[160px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Nút Tượng Pháp */}
                          <button
                            type="button"
                            onClick={() => setActiveModal({ type: 'statues', rowIndex: actualIdx })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              statueCount > 0
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={`Tượng pháp tại không gian này (${statueCount} pho)`}
                          >
                            <Sparkles className="w-4 h-4" />
                            {statueCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                {statueCount}
                              </span>
                            )}
                          </button>

                          {/* Nút Câu Chuyện */}
                          <button
                            type="button"
                            onClick={() => setActiveModal({ type: 'stories', rowIndex: actualIdx })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              storyCount > 0
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={`Câu chuyện kiến trúc (${storyCount} chuyện)`}
                          >
                            <BookOpen className="w-4 h-4" />
                            {storyCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                {storyCount}
                              </span>
                            )}
                          </button>

                          {/* Nút Đặc thù Giảng Đường (Pháp thoại) */}
                          {isGiangDuong && (
                            <button
                              type="button"
                              onClick={() => setActiveModal({ type: 'dharma', rowIndex: actualIdx })}
                              className="p-2 rounded-xl border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110"
                              title="Quản lý Pháp Thoại Giảng Đường"
                            >
                              <Mic className="w-4 h-4" />
                            </button>
                          )}

                          {/* Nút Đặc thù Bảo Tàng (Bảo tàng số) */}
                          {isBaoTang && (
                            <button
                              type="button"
                              onClick={() => setActiveModal({ type: 'museum', rowIndex: actualIdx })}
                              className="p-2 rounded-xl border border-indigo-500/50 bg-indigo-950/40 text-indigo-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110"
                              title="Quản lý Bảo Tàng Số 3 Miền"
                            >
                              <Landmark className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 7. Nội Dung Chi Tiết (Bấm Mở Trực Tiếp WordPress Gutenberg) */}
                      <td className="p-2.5 border-r border-[#F2C14E]/15 align-middle max-w-full overflow-hidden">
                        <div
                          onClick={() => handleOpenGutenberg(row, actualIdx)}
                          className="w-full min-h-[72px] p-2.5 bg-[#22140A] hover:bg-[#2C1A0E] border border-[#52331C] hover:border-[#F2C14E] rounded-xl cursor-pointer transition-all flex flex-col justify-between group/cell shadow-inner overflow-hidden"
                          title="Bấm vào để mở trực tiếp trong trình soạn thảo WordPress Gutenberg"
                        >
                          <p className="text-xs text-[#F5EADB]/80 line-clamp-2 leading-relaxed truncate">
                            {row.fullContent
                              ? row.fullContent.replace(/!\[.*?\]\(.*?\)/g, '[Hình Ảnh]').replace(/<[^>]+>/g, '').slice(0, 140) + '...'
                              : row.description
                              ? row.description.slice(0, 140) + '...'
                              : 'Chưa có mô tả chi tiết...'}
                          </p>
                          <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-[#F2C14E]/15 text-[11px] text-[#F2C14E] overflow-hidden">
                            <span className="flex items-center gap-1.5 font-bold text-[#F2C14E] group-hover/cell:text-[#ffde59]">
                              {openingWpId === row.id ? (
                                <Loader2 className="w-3.5 h-3.5 shrink-0 text-[#F2C14E] animate-spin" />
                              ) : (
                                <Edit3 className="w-3.5 h-3.5 shrink-0 text-[#F2C14E]" />
                              )}
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffde59]">
                                {openingWpId === row.id
                                  ? 'Đang mở WP...'
                                  : row.wpPostId
                                  ? `Gutenberg #${row.wpPostId}`
                                  : 'Mở Gutenberg'}
                              </span>
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-[#c9b896]/75 shrink-0">
                              {row.stories?.length > 0 && (
                                <span
                                  title={`${row.stories.length} câu chuyện`}
                                  className="px-1.5 py-0.5 rounded-lg bg-[#180E07] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <BookOpen className="w-2.5 h-2.5 text-[#F2C14E]" />
                                  <span>{row.stories.length}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 8. Thao Tác (Xem Web Trực Tiếp & Xóa) */}
                      <td className="p-2 w-[85px] min-w-[85px] text-center align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Xem Web Trực Tiếp */}
                          {row.slug ? (
                            <Link
                              href={publicUrl}
                              target="_blank"
                              className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#FFDE59] transition-all cursor-pointer shadow-sm hover:scale-105"
                              title="Mở không gian này trên trang web chính thức (tab mới)"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          ) : (
                            <span className="p-2 rounded-xl bg-[#1A110A] border border-[#52331C]/30 text-[#6B5A4E] opacity-50 cursor-not-allowed">
                              <ExternalLink className="w-4 h-4" />
                            </span>
                          )}

                          {/* Nút Xóa */}
                          <button
                            type="button"
                            onClick={() => handleDeleteArea(actualIdx)}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xóa không gian này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* S3 File Explorer Modal */}
      <S3FileExplorerModal
        isOpen={imageLibraryOpen}
        onClose={() => {
          setImageLibraryOpen(false);
          setTargetImageCallback(null);
        }}
        onSelectImage={(url) => {
          if (targetImageCallback) {
            targetImageCallback(url);
          }
        }}
        initialPath="vu-tru-phat-giao"
      />
    </div>
  );
}

export default SpreadsheetVuTru;
