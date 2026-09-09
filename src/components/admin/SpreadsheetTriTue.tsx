'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Plus,
  Save,
  Trash2,
  Eye,
  Edit3,
  Search,
  Filter,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  Video,
  Layers,
  Images,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Quote,
  Heading1,
  Heading2,
  Link as LinkIcon,
  RefreshCw,
  FolderOpen,
  Loader2,
  Zap,
  Info,
  Waves,
  Landmark,
  Compass,
  Flame,
  ArrowLeft,
  ChevronRight,
  Bell,
  Cloud,
  Star,
  Globe,
} from 'lucide-react';

import { S3FileExplorerModal } from './S3FileExplorerModal';
import { PostRecord } from '@/app/api/admin/posts/route';

// 🌟 CHUYÊN MỤC TRÍ TUỆ PHẬT PHÁP
export const TRI_TUE_CATEGORIES = [
  { id: 'all', name: 'Tất Cả Mục Trí Tuệ' },
  { id: 'bai-viet', name: '1. Bài Viết Nghiên Cứu' },
  { id: 'phap-am', name: '2. Pháp Âm Giảng Giải' },
  { id: 'video', name: '3. Video Phật Pháp' },
  { id: 'an-pham-sach', name: '4. Ấn Phẩm & Kinh Sách' },
];

export function SpreadsheetTriTue() {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openingWpId, setOpeningWpId] = useState<string | null>(null);

  // S3 File Explorer Modal
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);
  const [targetImageCallback, setTargetImageCallback] = useState<((url: string, caption?: string) => void) | null>(null);

  // Media Modal State
  const [mediaModal, setMediaModal] = useState<{
    isOpen: boolean;
    rowIndex: number;
    tab: 'banner' | 'video' | 'gallery' | 'featured';
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err: any) {
      showToast(`Lỗi khi tải dữ liệu bài viết: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openS3Library = (callback: (url: string, caption?: string) => void) => {
    setTargetImageCallback(() => callback);
    setImageLibraryOpen(true);
  };

  // 💾 Core function lưu toàn bộ dữ liệu vào Backend
  const savePostsToBackend = async (postsToSave: PostRecord[], silent: boolean = false) => {
    if (saving) return;
    setSaving(true);

    const normalized = postsToSave.map((p) => ({
      ...p,
      status: 'published' as const,
    }));

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(normalized);
        setIsDirty(false);
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
        if (!silent) showToast(`✅ Đã lưu thành công ${normalized.length} bài viết!`);
      } else {
        showToast(data.error || 'Có lỗi xảy ra khi lưu bài viết');
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
        savePostsToBackend(posts, false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posts]);

  // 🌟 MỞ TRỰC TIẾP TRÌNH SOẠN THẢO WORDPRESS GUTENBERG (1-CLICK)
  const handleOpenGutenberg = async (row: PostRecord, index: number) => {
    setOpeningWpId(row.id);
    showToast('⚡ Đang kết nối WordPress và nạp nội dung bài viết vào Gutenberg...');

    // Mở tab trống trước để chống popup blocker của trình duyệt
    const newTab = window.open('about:blank', '_blank');

    try {
      const res = await fetch('/api/admin/wp-post-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: row.wpPostId,
          title: row.title || 'Bài viết Trí Tuệ Phật Pháp',
          content: row.content || (row as any).contentHtml || row.summary || '',
          contentHtml: (row as any).contentHtml || '',
          summary: row.summary || '',
          category: 'tri-tue-phat-phap',
          categoryName: row.categoryName || 'Trí Tuệ Phật Pháp',
          postType: 'post',
          photoGallery: row.photoGallery || [],
        }),
      });
      const data = await res.json();
      if (data.success && data.editUrl) {
        if (data.wpPostId && String(data.wpPostId) !== String(row.wpPostId)) {
          const updated = [...posts];
          updated[index].wpPostId = String(data.wpPostId);
          setPosts(updated);
          await savePostsToBackend(updated, true);
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

  // Thêm bài viết mới vào Trí Tuệ Phật Pháp
  const handleAddNewPost = () => {
    const subCat = selectedCategory !== 'all' ? selectedCategory : 'bai-viet';
    const catName = TRI_TUE_CATEGORIES.find((c) => c.id === subCat)?.name.replace(/^\d+\.\s*/, '') || 'Bài Viết';

    const newPost: PostRecord = {
      id: `post-tri-tue-${Date.now()}`,
      slug: `tri-tue-${Date.now().toString().slice(-4)}`,
      title: 'Bài viết trí tuệ Phật pháp mới',
      subtitle: 'Tùng Lâm Hòa Phúc',
      mainCategory: 'tri-tue-phat-phap',
      subCategory: subCat,
      categoryName: catName,
      author: 'Ban Văn Hóa Tùng Lâm',
      publishedDate: new Date().toISOString().split('T')[0],
      status: 'published',
      viewsCount: 0,
      thumbnailUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      thumbnailPosition: 'center 50%',
      bannerUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      bannerPosition: 'center 50%',
      summary: 'Tóm tắt nội dung bài viết...',
      content: 'Nội dung bài viết bắt đầu tại đây...',
      keywords: [],
      photoGallery: [],
      previousEditions: [],
      upcomingEvents: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    setIsDirty(true);
    showToast('✨ Đã thêm bài viết mới vào Trí Tuệ Phật Pháp!');
  };

  // Xóa bài viết
  const handleDeletePost = (index: number) => {
    const target = posts[index];
    if (!target) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết:\n"${target.title}"?`)) return;

    const updated = posts.filter((_, i) => i !== index);
    setPosts(updated);
    setIsDirty(true);
    savePostsToBackend(updated, false);
    showToast(`🗑️ Đã xóa bài viết "${target.title}"`);
  };

  // Danh sách đã lọc: Chỉ hiển thị các bài thuộc 'tri-tue-phat-phap'
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (p.mainCategory !== 'tri-tue-phat-phap') return false;
      if (selectedCategory !== 'all' && p.subCategory !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchAuthor = (p.author || '').toLowerCase().includes(q);
        const matchContent = (p.content || '').toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchContent) return false;
      }
      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

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
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#FFE5A3] flex items-center gap-2">
              <span>Bảng Quản Trị Trí Tuệ Phật Pháp</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#F2C14E] text-xs font-mono font-bold border border-[#F2C14E]/40">
                {posts.filter((p) => p.mainCategory === 'tri-tue-phat-phap').length} Bài Viết
              </span>
            </h2>
            <p className="text-[11px] text-[#c9b896] flex items-center gap-1.5 flex-wrap">
              <span>Bài viết nghiên cứu, Pháp âm giảng giải, Video Phật pháp, Ấn phẩm sách</span>
              <span>•</span>
              <span>Tự động xuất bản</span>
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
            title="Mở Trình Quản Lý Tệp S3 Đám Mây"
          >
            <Cloud className="w-5 h-5" />
          </button>

          {/* Nút 1: Thêm Bài Viết */}
          <button
            type="button"
            onClick={handleAddNewPost}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Thêm Bài Viết Mới vào Trí Tuệ Phật Pháp"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Nút 2: Tải lại */}
          <button
            type="button"
            onClick={fetchPosts}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#ffde59] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            title="Tải lại dữ liệu bài viết"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Nút 3: Lưu Bảng Tính */}
          <button
            type="button"
            onClick={() => savePostsToBackend(posts, false)}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/50 text-[#F2C14E] hover:text-[#1A120B] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 disabled:opacity-50"
            title="Lưu toàn bộ bài viết (Ctrl+S)"
          >
            {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
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
            placeholder="Tìm kiếm theo tiêu đề bài viết, tác giả hoặc nội dung..."
            className="w-full pl-9 pr-3 py-2.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] shadow-sm"
          />
        </div>

        {/* Dropdown Lọc Chuyên Mục Trí Tuệ */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none cursor-pointer shadow-sm min-w-[240px]"
        >
          {TRI_TUE_CATEGORIES.map((c) => {
            const count =
              c.id === 'all'
                ? posts.filter((p) => p.mainCategory === 'tri-tue-phat-phap').length
                : posts.filter((p) => p.mainCategory === 'tri-tue-phat-phap' && p.subCategory === c.id).length;
            return (
              <option key={c.id} value={c.id}>
                {c.name} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* 🌟 2. BẢNG TÍNH SPREADSHEET 8 CỘT CHUẨN HÓA */}
      <div className="rounded-2xl border border-[#F2C14E]/35 bg-[#1C120A] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[78vh] custom-scrollbar">
          <table className="w-full border-collapse text-xs text-left min-w-[1100px] table-fixed">
            <thead className="sticky top-0 z-20 bg-[#321F14] text-[#F2C14E] uppercase tracking-wider font-bold border-b border-[#F2C14E]/40 select-none shadow-md">
              <tr>
                <th className="p-3 w-[45px] min-w-[45px] text-center border-r border-[#F2C14E]/20">#</th>
                <th className="p-3 w-[160px] min-w-[160px] border-r border-[#F2C14E]/20 text-center">Chuyên Mục</th>
                <th className="p-3 w-[80px] min-w-[80px] text-center border-r border-[#F2C14E]/20">Ảnh Bìa</th>
                <th className="p-3 w-[220px] min-w-[220px] border-r border-[#F2C14E]/20">Tiêu Đề Bài Viết</th>
                <th className="p-3 w-[200px] min-w-[200px] border-r border-[#F2C14E]/20">Tác Giả & Ngày</th>
                <th className="p-3 w-[140px] min-w-[140px] border-r border-[#F2C14E]/20 text-center">Đa Phương Tiện</th>
                <th
                  className="p-3 border-r border-[#F2C14E]/20 cursor-help"
                  title="Bấm vào từng ô để mở trực tiếp trong trình soạn thảo Gutenberg"
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
                    <span>Đang tải dữ liệu bài viết...</span>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#c9b896]/70">
                    Chưa có bài viết nào trong chuyên mục Trí Tuệ Phật Pháp này.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((row, filterIdx) => {
                  const targetIdx = posts.findIndex((p) => p.id === row.id);
                  const actualIdx = targetIdx !== -1 ? targetIdx : filterIdx;

                  const kwCount = row.keywords?.length || 0;
                  const galleryCount = row.photoGallery?.length || 0;
                  const hasVideo = Boolean(row.videoBlock?.videoUrl);
                  const hasBook = Boolean(row.sourceBook);
                  const hasFeatured = Boolean(row.featuredArticle?.title);
                  const publicUrl = `/tri-tue-phat-phap/${row.slug}`;

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

                      {/* 2. Chuyên Mục Trí Tuệ */}
                      <td className="p-2.5 w-[160px] min-w-[160px] border-r border-[#F2C14E]/15 align-middle">
                        <select
                          value={row.subCategory || 'bai-viet'}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[actualIdx].mainCategory = 'tri-tue-phat-phap';
                            updated[actualIdx].subCategory = e.target.value;
                            const matched = TRI_TUE_CATEGORIES.find((c) => c.id === e.target.value);
                            if (matched) updated[actualIdx].categoryName = matched.name.replace(/^\d+\.\s*/, '');
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          className="w-full px-2.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none transition-all cursor-pointer shadow-sm"
                        >
                          {TRI_TUE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 3. Ảnh Bìa / Đại diện */}
                      <td className="p-2 w-[80px] min-w-[80px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div
                          onClick={() => setMediaModal({ isOpen: true, rowIndex: actualIdx, tab: 'banner' })}
                          className="relative w-14 h-12 mx-auto rounded-xl overflow-hidden border border-[#F2C14E]/40 hover:border-[#F2C14E] bg-black/60 cursor-pointer group/banner shadow-sm transition-all hover:scale-105"
                          title="Bấm để cài đặt ảnh Banner / Đại diện"
                        >
                          <img
                            src={row.thumbnailUrl || row.bannerUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp'}
                            alt="Banner"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                            Sửa
                          </div>
                        </div>
                      </td>

                      {/* 4. Tiêu Đề Bài Viết */}
                      <td className="p-2.5 w-[220px] min-w-[220px] border-r border-[#F2C14E]/15 align-middle">
                        <input
                          type="text"
                          value={row.title || ''}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[actualIdx].title = e.target.value;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Tiêu đề bài viết..."
                          className="w-full px-2.5 py-2 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none transition-all shadow-sm"
                        />
                      </td>

                      {/* 5. Tác Giả & Ngày */}
                      <td className="p-2.5 w-[200px] min-w-[200px] border-r border-[#F2C14E]/15 align-middle">
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={row.author || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[actualIdx].author = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Tác giả..."
                            className="w-full px-2.5 py-1.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] focus:outline-none transition-all shadow-sm"
                          />
                          <input
                            type="date"
                            value={row.publishedDate ? row.publishedDate.split('T')[0] : ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[actualIdx].publishedDate = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            className="w-full px-2.5 py-1 bg-[#22140A] border border-[#52331C] rounded-xl text-[11px] text-[#c9b896] focus:outline-none cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* 6. Đa Phương Tiện (3 Nút Vector Chuẩn Hóa) */}
                      <td className="p-2.5 w-[140px] min-w-[140px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Video */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: actualIdx, tab: 'video' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              hasVideo
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={hasVideo ? `Video: ${row.videoBlock?.title}` : 'Cài đặt Video bài viết'}
                          >
                            <Video className="w-4 h-4" />
                            {hasVideo && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F2C14E] rounded-full animate-ping" />
                            )}
                          </button>

                          {/* Nút Nổi Bật */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: actualIdx, tab: 'featured' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              hasFeatured
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={hasFeatured ? `Nổi bật: ${row.featuredArticle?.title}` : 'Quản lý Bài Viết Nổi Bật'}
                          >
                            <Star className="w-4 h-4" />
                          </button>

                          {/* Nút Album Ảnh */}
                          <button
                            type="button"
                            onClick={() => setMediaModal({ isOpen: true, rowIndex: actualIdx, tab: 'gallery' })}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              galleryCount > 0
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={`Bộ sưu tập ảnh (${galleryCount} ảnh)`}
                          >
                            <Images className="w-4 h-4" />
                            {galleryCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                {galleryCount}
                              </span>
                            )}
                          </button>
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
                            {row.content
                              ? row.content.replace(/!\[.*?\]\(.*?\)/g, '[Hình Ảnh]').replace(/<[^>]+>/g, '').slice(0, 140) + '...'
                              : row.summary
                              ? row.summary.slice(0, 140) + '...'
                              : row.contentHtml
                              ? row.contentHtml.replace(/<[^>]+>/g, '').slice(0, 140) + '...'
                              : 'Chưa có nội dung...'}
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
                              {kwCount > 0 && (
                                <span
                                  title={`${kwCount} chú thích từ khóa`}
                                  className="px-1.5 py-0.5 rounded-lg bg-[#180E07] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-[#F2C14E]" />
                                  <span>{kwCount}</span>
                                </span>
                              )}
                              {hasBook && (
                                <span
                                  title="Nguồn sách tham khảo"
                                  className="px-1.5 py-0.5 rounded-lg bg-[#352012] border border-[#F2C14E]/40 text-[#ffde59] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <BookOpen className="w-2.5 h-2.5 text-[#F2C14E]" />
                                  <span>1</span>
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
                              title="Mở bài viết trên trang web chính thức (tab mới)"
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
                            onClick={() => handleDeletePost(actualIdx)}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-800 border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Xóa bài viết này"
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
        onSelectImage={(url, caption) => {
          if (targetImageCallback) {
            targetImageCallback(url, caption);
          }
        }}
        initialPath="tri-tue-phat-phap"
      />
    </div>
  );
}

export default SpreadsheetTriTue;
