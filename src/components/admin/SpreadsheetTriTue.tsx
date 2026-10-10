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
  Camera,
} from 'lucide-react';

import ZenTipTapEditor from './ZenTipTapEditor';
import { InteractiveImageDrag } from './posts/ImageDragHelper';
import { S3FileExplorerModal } from './S3FileExplorerModal';
import { PostRecord, SourceBook, VideoBlock, FeaturedArticle, PhotoItem } from '@/app/api/admin/posts/route';
import { useTableDragDrop, GripHandleIcon } from './useTableDragDrop';
import { AdminPagination, useAdminPagination } from './AdminPagination';
import { useDebounce } from '@/hooks/useDebounce';

// 🌟 CHUYÊN MỤC TRÍ TUỆ PHẬT PHÁP
export const TRI_TUE_CATEGORIES = [
  { id: 'all', name: 'Tất Cả Mục Trí Tuệ' },
  { id: 'bai-viet', name: '1. Bài Viết Nghiên Cứu' },
  { id: 'phap-am', name: '2. Pháp Âm Giảng Giải' },
  { id: 'video', name: '3. Video Phật Pháp' },
  { id: 'an-pham-sach', name: '4. Ấn Phẩm & Kinh Sách' },
];

const getPrimaryBook = (sb?: SourceBook | SourceBook[]): SourceBook | undefined => {
  if (!sb) return undefined;
  if (Array.isArray(sb)) return sb[0];
  return sb;
};

export function SpreadsheetTriTue() {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'views-desc' | 'views-asc'>('default');
  const [openingWpId, setOpeningWpId] = useState<string | null>(null);

  // S3 File Explorer Modal
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false);
  const [targetImageCallback, setTargetImageCallback] = useState<((url: string, caption?: string) => void) | null>(null);

  // Media Modal State
  const [mediaModal, setMediaModal] = useState<{
    isOpen: boolean;
    rowIndex: number;
    tab: 'banner' | 'video' | 'gallery' | 'featured' | 'book';
  } | null>(null);

  // Big WYSIWYG Editor State
  const [bigEditor, setBigEditor] = useState<{
    rowIndex: number;
    value: string;
  } | null>(null);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 🪷 Quản lý Kéo Thả Sắp Xếp Thứ Tự Bài Viết Trí Tuệ
  const {
    draggedId,
    dragOverId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useTableDragDrop({
    items: posts,
    setItems: setPosts,
    setIsDirty,
    onToast: showToast,
    getId: (p) => p.id,
  });

  // Đồng bộ ảnh bìa cho ấn phẩm / sách nếu có trường sourceBook
  const syncBookCoverIfPresent = (post: PostRecord, newImageUrl: string) => {
    if (post.sourceBook) {
      if (Array.isArray(post.sourceBook)) {
        if (post.sourceBook[0]) post.sourceBook[0].coverImage = newImageUrl;
      } else {
        post.sourceBook.coverImage = newImageUrl;
      }
    }
  };

  // Fetch posts from API - Tối ưu chỉ lấy các bài thuộc chuyên mục Trí Tuệ Phật Pháp
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/posts?category=tri-tue-phat-phap&t=${Date.now()}`, { cache: 'no-store' });
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

  // Upload file trực tiếp lên S3
  const uploadImageFileDirectly = async (file: File, folderPath: string = '04-vu-tru-phat-giao'): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderPath', folderPath);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        showToast('✨ Đã tải ảnh lên S3 thành công!');
        return data.url;
      } else {
        showToast(data.error || 'Lỗi khi tải ảnh lên S3');
        return null;
      }
    } catch (err: any) {
      showToast(`Lỗi tải ảnh: ${err.message}`);
      return null;
    }
  };

  // 💾 Core function lưu toàn bộ dữ liệu vào Backend
  const savePostsToBackend = async (postsToSave: PostRecord[], silent: boolean = false) => {
    if (saving) return;
    setSaving(true);

    // 🚀 Tối ưu payload: Chỉ gửi các bài thuộc 'tri-tue-phat-phap' và loại bỏ contentHtml
    // Tránh vượt giới hạn 4.5MB của Vercel (chỉ ~400KB thay vì 7MB)
    const triTuePosts = postsToSave.filter((p) => !p.mainCategory || p.mainCategory === 'tri-tue-phat-phap');
    const normalized = triTuePosts.map(({ contentHtml: _ch, ...p }) => ({
      ...p,
      mainCategory: 'tri-tue-phat-phap',
      status: 'published' as const,
    }));

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setPosts(postsToSave);
        setIsDirty(false);
        const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
        if (!silent) showToast(`✅ Đã lưu thành công ${normalized.length} bài viết!`);
      } else {
        showToast(data.error || `Có lỗi khi lưu bài viết (Mã lỗi ${res.status})`);
      }
    } catch (err: any) {
      showToast(`Không thể kết nối đến máy chủ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 💾 Lưu nhanh trực tiếp 1 dòng bài viết (1-Click Save tức thì)
  const handleSaveSinglePost = async (target: PostRecord) => {
    showToast(`⏳ Đang lưu bài viết "${(target.title || '').slice(0, 35)}..."`);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: target.title,
          subtitle: target.subtitle,
          author: target.author,
          publishedDate: target.publishedDate,
          mainCategory: target.mainCategory || 'tri-tue-phat-phap',
          subCategory: target.subCategory,
          categoryName: target.categoryName,
          thumbnailUrl: target.thumbnailUrl,
          thumbnailPosition: target.thumbnailPosition,
          bannerUrl: target.bannerUrl,
          bannerPosition: target.bannerPosition,
          videoBlock: target.videoBlock,
          featuredArticle: target.featuredArticle,
          photoGallery: target.photoGallery,
          sourceBook: target.sourceBook,
          summary: target.summary,
          status: 'published',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast(`✅ Đã lưu thành công bài viết "${(target.title || '').slice(0, 35)}"!`);
        setIsDirty(false);
      } else {
        showToast(`❌ Lỗi: ${data.error || `Lỗi máy chủ (${res.status})`}`);
      }
    } catch (e: any) {
      showToast(`❌ Lỗi kết nối: ${e.message}`);
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

  // Open Big Editor for a row
  const openBigEditor = (index: number) => {
    const post = posts[index];
    if (!post) return;
    setBigEditor({
      rowIndex: index,
      value: post.content || post.summary || '',
    });
  };

  // Mở Media Modal - On-demand fetch nếu thiếu photoGallery
  const handleOpenMediaModal = async (
    actualIdx: number,
    tab: 'banner' | 'video' | 'gallery' | 'featured' | 'book'
  ) => {
    const target = posts[actualIdx];
    if (!target) return;

    if (tab === 'gallery' && (!target.photoGallery || target.photoGallery.length === 0)) {
      try {
        const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`);
        const data = await res.json();
        if (data.success && data.post?.photoGallery) {
          setPosts((prev) => {
            const next = [...prev];
            next[actualIdx] = {
              ...next[actualIdx],
              photoGallery: data.post.photoGallery,
            };
            return next;
          });
        }
      } catch (err) {
        console.warn('Lỗi tải album ảnh:', err);
      }
    }

    setMediaModal({ isOpen: true, rowIndex: actualIdx, tab });
  };

  // Lưu Album tức thời
  const handleSaveGallery = async (actualIdx: number) => {
    const target = posts[actualIdx];
    if (!target) return;
    showToast(`⏳ Đang lưu bộ ảnh "${target.title}"...`);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoGallery: target.photoGallery || [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Đã lưu ${target.photoGallery?.length || 0} ảnh thành công!`);
        setIsDirty(false);
      } else {
        showToast(`❌ Lỗi: ${data.error || 'Không xác định'}`);
      }
    } catch (e: any) {
      showToast(`❌ Lỗi kết nối: ${e.message}`);
    }
  };

  // Lưu Đa phương tiện tức thời (Banner, Video, Sách, v.v.) kèm thông tin bài viết
  const handleSaveMediaModal = async (actualIdx: number) => {
    const target = posts[actualIdx];
    if (!target) return;
    showToast(`⏳ Đang lưu thiết lập bài viết & đa phương tiện...`);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: target.title,
          subtitle: target.subtitle,
          author: target.author,
          publishedDate: target.publishedDate,
          mainCategory: target.mainCategory || 'tri-tue-phat-phap',
          subCategory: target.subCategory,
          categoryName: target.categoryName,
          thumbnailUrl: target.thumbnailUrl,
          thumbnailPosition: target.thumbnailPosition,
          bannerUrl: target.bannerUrl,
          bannerPosition: target.bannerPosition,
          videoBlock: target.videoBlock,
          featuredArticle: target.featuredArticle,
          photoGallery: target.photoGallery,
          sourceBook: target.sourceBook,
          summary: target.summary,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast(`✅ Đã lưu thành công bài viết & đa phương tiện!`);
        setIsDirty(false);
      } else {
        showToast(`❌ Lỗi: ${data.error || `Lỗi máy chủ (${res.status})`}`);
      }
    } catch (e: any) {
      showToast(`❌ Lỗi kết nối: ${e.message}`);
    }
  };

  // 🌟 MỞ TRỰC TIẾP TRÌNH SOẠN THẢO WORDPRESS GUTENBERG (1-CLICK)
  const handleOpenGutenberg = async (row: PostRecord, index: number) => {
    setOpeningWpId(row.id);
    showToast('⚡ Đang kết nối WordPress và nạp nội dung bài viết vào Gutenberg...');

    // Mở tab trống trước để chống popup blocker của trình duyệt
    const newTab = window.open('about:blank', '_blank');
    if (newTab) {
      try {
        newTab.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Đang kết nối WordPress Gutenberg...</title>
  <style>
    body { background: #140D07; color: #FFE5A3; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 24px; box-sizing: border-box; }
    .spin { width: 48px; height: 48px; border: 4px solid rgba(242,193,78,0.2); border-top-color: #F2C14E; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { color: #ffde59; margin: 0 0 10px; font-size: 18px; font-weight: bold; }
    p { color: #d3c0ad; margin: 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="spin"></div>
  <h2>⚡ ĐANG KẾT NỐI WORDPRESS GUTENBERG...</h2>
  <p>Hệ thống đang đồng bộ bài viết. Trình soạn thảo sẽ xuất hiện trong giây lát!</p>
</body>
</html>`);
        newTab.document.close();
      } catch {}
    }

    try {
      const res = await fetch('/api/admin/wp-post-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: row.wpPostId,
          title: row.title || 'Bài viết Trí Tuệ Phật Pháp',
          subtitle: row.subtitle || row.summary || '',
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
        showToast('✨ Đã mở trình soạn thảo WordPress Gutenberg!');
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
  const handleAddNewPost = async () => {
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
      thumbnailUrl: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      thumbnailPosition: 'center 50%',
      bannerUrl: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
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
    showToast('✨ Đang lưu bài viết mới vào hệ thống máy chủ...');

    try {
      await savePostsToBackend(updated, true);
      showToast('✨ Đã thêm và lưu bài viết mới thành công!');
    } catch {
      showToast('⚠️ Đã thêm bài mới, hãy nhấn nút Lưu (hoặc Ctrl+S)');
    }
  };

  // Xóa bài viết
  const handleDeletePost = async (target: PostRecord) => {
    if (!target) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết:\n"${target.title}"?`)) return;

    setPosts((prev) => prev.filter((p) => p.id !== target.id));
    showToast(`🗑️ Đã xóa bài viết "${target.title}"`);

    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok && res.status !== 404) {
        setPosts((prev) => [target, ...prev]);
        showToast(`❌ Không thể xóa trên máy chủ: ${data.error || 'Lỗi xử lý'}. Đã khôi phục.`);
      }
    } catch (err: any) {
      setPosts((prev) => [target, ...prev]);
      showToast(`❌ Không thể kết nối máy chủ: ${err.message}. Đã khôi phục.`);
    }
  };

  const debouncedSearch = useDebounce(searchQuery, 250);

  // Danh sách đã lọc: Chỉ hiển thị các bài thuộc 'tri-tue-phat-phap'
  const filteredPosts = useMemo(() => {
    let result = posts.filter((p) => {
      if (p.mainCategory !== 'tri-tue-phat-phap') return false;
      if (selectedCategory !== 'all' && p.subCategory !== selectedCategory) return false;

      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchAuthor = (p.author || '').toLowerCase().includes(q);
        const matchContent = (p.content || '').toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchContent) return false;
      }
      return true;
    });

    if (sortBy === 'views-desc') {
      result = [...result].sort((a, b) => (Number(b.viewsCount) || 0) - (Number(a.viewsCount) || 0));
    } else if (sortBy === 'views-asc') {
      result = [...result].sort((a, b) => (Number(a.viewsCount) || 0) - (Number(b.viewsCount) || 0));
    }

    return result;
  }, [posts, selectedCategory, debouncedSearch, sortBy]);

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    paginatedItems: paginatedPosts,
    startIndex,
    endIndex,
  } = useAdminPagination({
    items: filteredPosts,
    defaultPageSize: 10,
  });

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
            <div className="flex items-center gap-2 text-xs text-[#c9b896]/70 mt-0.5">
              <span>{isDirty ? '⚠️ Có thay đổi chưa lưu' : '✅ Đã đồng bộ với máy chủ'}</span>
              {lastSavedTime && <span>• Lưu lần cuối: {lastSavedTime}</span>}
              <span className="hidden sm:inline">• Nhấn <kbd className="px-1.5 py-0.5 rounded bg-[#2A1D14] text-[#F2C14E] border border-[#F2C14E]/30 font-mono text-[10px]">Ctrl+S</kbd> để lưu nhanh</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleAddNewPost}
            className="px-4 py-2.5 rounded-xl bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#ffde59] text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:scale-102"
          >
            <Plus className="w-4 h-4 text-[#F2C14E]" />
            <span>Thêm Bài Viết Mới</span>
          </button>

          <button
            type="button"
            onClick={() => savePostsToBackend(posts, false)}
            disabled={saving}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              isDirty
                ? 'bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#1A120B] shadow-[0_0_20px_rgba(242,193,78,0.4)] animate-pulse'
                : 'bg-[#2A1D14] text-[#FFE5A3] border border-[#F2C14E]/30 hover:border-[#F2C14E]'
            } disabled:opacity-50`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </div>

      {/* 🌟 2. CATEGORY TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#1C120A] rounded-2xl border border-[#F2C14E]/25">
          {TRI_TUE_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? posts.filter((p) => p.mainCategory === 'tri-tue-phat-phap').length
                : posts.filter((p) => p.mainCategory === 'tri-tue-phat-phap' && p.subCategory === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                    : 'text-[#c9b896] hover:text-[#FFE5A3] hover:bg-[#2A1D14]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-[#1A120B]/20 text-[#1A120B]' : 'bg-[#2A1D14] text-[#F2C14E]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Sort Dropdown */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#F2C14E]/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tiêu đề, tác giả..."
              className="w-full pl-9 pr-3 py-2 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E] shadow-inner"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] font-bold focus:outline-none focus:border-[#F2C14E] cursor-pointer shadow-inner shrink-0"
          >
            <option value="default">Thứ tự mặc định</option>
            <option value="views-desc">👁️ Lượt xem cao nhất</option>
            <option value="views-asc">👁️ Lượt xem thấp nhất</option>
          </select>
        </div>
      </div>

      {/* 🌟 3. MAIN SPREADSHEET TABLE */}
      <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#25170E] text-[#F2C14E] font-bold border-b border-[#F2C14E]/30 uppercase tracking-wider text-[11px] select-none">
                <th className="p-3 w-[55px] min-w-[55px] text-center border-r border-[#F2C14E]/20">STT</th>
                <th className="p-3 w-[160px] min-w-[160px] border-r border-[#F2C14E]/20">Tiểu Mục</th>
                <th className="p-3 w-[85px] min-w-[85px] border-r border-[#F2C14E]/20 text-center">Ảnh Bìa</th>
                <th className="p-3 w-[220px] min-w-[220px] border-r border-[#F2C14E]/20">Tiêu Đề Bài Viết</th>
                <th className="p-3 w-[200px] min-w-[200px] border-r border-[#F2C14E]/20">Tiêu Đề Phụ</th>
                <th className="p-3 w-[180px] min-w-[180px] border-r border-[#F2C14E]/20">Tác Giả & Ngày</th>
                <th className="p-3 w-[110px] min-w-[110px] border-r border-[#F2C14E]/20 text-center" title="Lượt xem đo lường thực tế từ độc giả khi đọc bài">Lượt Xem</th>
                <th className="p-3 w-[150px] min-w-[150px] border-r border-[#F2C14E]/20 text-center">Đa Phương Tiện</th>
                <th className="p-3 border-r border-[#F2C14E]/20 cursor-help" title="Nhấp vào ô để mở trình soạn thảo bài viết trực tiếp">
                  <div className="flex items-center gap-1.5">
                    <span>Nội Dung Chi Tiết</span>
                    <Edit3 className="w-3.5 h-3.5 text-[#F2C14E]/80 shrink-0" />
                  </div>
                </th>
                <th className="p-3 w-[90px] min-w-[90px] text-center sticky right-0 z-30 bg-[#321F14] border-l border-[#F2C14E]/30 shadow-[-4px_0_8px_rgba(0,0,0,0.3)]">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2C14E]/15">
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-[#c9b896]/70">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#F2C14E]" />
                    <span>Đang tải dữ liệu bài viết Trí Tuệ Phật Pháp...</span>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-[#c9b896]/70">
                    Chưa có bài viết nào trong chuyên mục Trí Tuệ Phật Pháp này.
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((row, filterIdx) => {
                  const targetIdx = posts.findIndex((p) => p.id === row.id);
                  const actualIdx = targetIdx !== -1 ? targetIdx : filterIdx;

                  const kwCount = row.keywords?.length || 0;
                  const galleryCount = row.photoGallery?.length || 0;
                  const hasVideo = Boolean(row.videoBlock?.videoUrl);
                  const primaryBook = getPrimaryBook(row.sourceBook);
                  const hasBook = Boolean(primaryBook?.bookTitle || primaryBook?.coverImage);
                  const hasFeatured = Boolean(row.featuredArticle?.title);
                  const publicUrl = `/tri-tue-phat-phap/${row.slug}`;

                  const isDragged = String(row.id) === draggedId;
                  const isDragOver = String(row.id) === dragOverId;

                  return (
                    <tr
                      key={row.id || filterIdx}
                      onDragOver={(e) => handleDragOver(e, row.id)}
                      onDrop={(e) => handleDrop(e, row.id)}
                      onDragLeave={handleDragLeave}
                      className={`transition-all duration-150 group focus-within:bg-[#2D1B0F] ${
                        filterIdx % 2 === 0 ? 'bg-[#170E08]' : 'bg-[#120A05]'
                      } hover:bg-[#26160B] ${
                        isDragged ? 'opacity-30 bg-[#2A180D] ring-1 ring-amber-400/50' : ''
                      } ${
                        isDragOver && dropPosition === 'above'
                          ? 'border-t-2 border-[#ffde59] bg-[#321C0E] shadow-[0_-4px_12px_rgba(255,222,89,0.35)]'
                          : ''
                      } ${
                        isDragOver && dropPosition === 'below'
                          ? 'border-b-2 border-[#ffde59] bg-[#321C0E] shadow-[0_4px_12px_rgba(255,222,89,0.35)]'
                          : ''
                      }`}
                    >
                      {/* 1. STT & KÉO THẢ SẮP XẾP */}
                      <td className="p-2 w-[55px] min-w-[55px] text-center font-mono font-bold text-[#F2C14E] border-r border-[#F2C14E]/15 bg-[#140D07]/60 align-middle select-none">
                        <div
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, row.id)}
                          onDragEnd={handleDragEnd}
                          title="Bấm giữ và kéo thả chuột để thay đổi vị trí bài viết"
                          className="flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-[#3A2213] text-[#F2C14E]/70 hover:text-[#ffde59] transition-all hover:scale-105 group/grip"
                        >
                          <GripHandleIcon className="w-3.5 h-3.5 text-[#F2C14E]/60 group-hover/grip:text-[#ffde59] shrink-0" />
                          <span className="text-xs font-mono">{actualIdx + 1}</span>
                        </div>
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
                      <td className="p-2 w-[85px] min-w-[85px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div className="relative group/banner inline-block">
                          <div
                            onClick={() => handleOpenMediaModal(actualIdx, 'banner')}
                            className="w-14 h-12 mx-auto rounded-xl overflow-hidden border border-[#F2C14E]/40 hover:border-[#F2C14E] bg-black/60 cursor-pointer shadow-sm transition-all hover:scale-105 relative"
                            title="Bấm để mở cài đặt Ảnh Bìa Hero / Thumbnail"
                          >
                            <img
                              src={row.thumbnailUrl || row.bannerUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp'}
                              alt="Ảnh bìa"
                              className="w-full h-full object-cover"
                              style={{ objectPosition: row.thumbnailPosition || row.bannerPosition || 'center 50%' }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-[#ffde59] font-bold">
                              Đổi
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openS3Library((url) => {
                                const updated = [...posts];
                                updated[actualIdx].thumbnailUrl = url;
                                updated[actualIdx].bannerUrl = url;
                                syncBookCoverIfPresent(updated[actualIdx], url);
                                setPosts(updated);
                                setIsDirty(true);
                                showToast('✨ Đã cập nhật ảnh bìa từ S3!');
                              });
                            }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F2C14E] text-black hover:bg-[#ffde59] flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-115"
                            title="Chọn nhanh từ Kho Ảnh S3"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* 4. Tiêu Đề Bài Viết */}
                      <td className="p-2.5 w-[220px] min-w-[220px] border-r border-[#F2C14E]/15 align-middle">
                        <textarea
                          rows={3}
                          value={row.title || ''}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[actualIdx].title = e.target.value;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Tiêu đề bài viết..."
                          className="w-full min-h-[72px] px-2.5 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs font-bold text-[#ffde59] uppercase focus:outline-none leading-snug transition-all resize-none shadow-sm flex items-center"
                        />
                      </td>

                      {/* 5. Tiêu Đề Phụ (Lời Tựa / Phụ Đề) */}
                      <td className="p-2.5 w-[200px] min-w-[200px] border-r border-[#F2C14E]/15 align-middle">
                        <textarea
                          rows={3}
                          value={row.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[actualIdx].subtitle = e.target.value;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Nhập lời tựa / tiêu đề phụ..."
                          className="w-full min-h-[72px] px-3 py-2.5 bg-[#22140A] border border-[#52331C] hover:border-[#F2C14E]/60 focus:border-[#F2C14E] rounded-xl text-xs text-[#FFE5A3] italic focus:outline-none leading-relaxed transition-all resize-none shadow-sm flex items-center"
                        />
                      </td>

                      {/* 5. Tác Giả & Ngày */}
                      <td className="p-2.5 w-[180px] min-w-[180px] border-r border-[#F2C14E]/15 align-middle">
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

                      {/* 5.5. Số Lượt Xem Thực Tế (Đo lường từ độc giả đọc bài) */}
                      <td className="p-2 w-[110px] min-w-[110px] border-r border-[#F2C14E]/15 align-middle text-center bg-[#170E08]/40">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span
                            title={`Lượt xem đo lường thực tế: ${typeof row.viewsCount === 'number' ? row.viewsCount.toLocaleString('vi-VN') : row.viewsCount || 0} lượt`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#25170E] border border-[#F2C14E]/40 text-[#FFE5A3] font-mono text-xs font-bold shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
                            <span>
                              {typeof row.viewsCount === 'number'
                                ? row.viewsCount >= 10000
                                  ? `${(row.viewsCount / 1000).toFixed(1)}K`
                                  : row.viewsCount.toLocaleString('vi-VN')
                                : row.viewsCount || 0}
                            </span>
                          </span>
                          <span className="text-[10px] text-[#c9b896]/60 font-sans">
                            {typeof row.viewsCount === 'number' && row.viewsCount >= 10000
                              ? `(${row.viewsCount.toLocaleString('vi-VN')})`
                              : 'lượt đọc'}
                          </span>
                        </div>
                      </td>

                      {/* 6. Đa Phương Tiện (4 Nút Vector Chuẩn Hóa) */}
                      <td className="p-2.5 w-[150px] min-w-[150px] border-r border-[#F2C14E]/15 align-middle text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Video */}
                          <button
                            type="button"
                            onClick={() => handleOpenMediaModal(actualIdx, 'video')}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              hasVideo
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={hasVideo ? `Video: ${row.videoBlock?.title || 'Đã cài đặt video'}` : 'Cài đặt Video bài viết'}
                          >
                            <Video className="w-4 h-4" />
                            {hasVideo && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F2C14E] rounded-full animate-ping" />
                            )}
                          </button>

                          {/* Nút Nổi Bật */}
                          <button
                            type="button"
                            onClick={() => handleOpenMediaModal(actualIdx, 'featured')}
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
                            onClick={() => handleOpenMediaModal(actualIdx, 'gallery')}
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

                          {/* Nút Sách Tham Khảo / Ấn Phẩm */}
                          <button
                            type="button"
                            onClick={() => handleOpenMediaModal(actualIdx, 'book')}
                            className={`p-2 rounded-xl border flex items-center justify-center relative transition-all cursor-pointer shadow-sm hover:scale-110 ${
                              hasBook
                                ? 'bg-[#352012] border-[#F2C14E] text-[#ffde59] shadow-[0_0_10px_rgba(242,193,78,0.2)]'
                                : 'bg-[#1C120A] border-[#52331C] text-[#c9b896]/60 hover:text-[#FFE5A3]'
                            }`}
                            title={hasBook ? `Sách: ${primaryBook?.bookTitle || 'Ấn phẩm'}` : 'Cài đặt Nguồn Sách / Kinh Điển'}
                          >
                            <BookOpen className="w-4 h-4" />
                            {hasBook && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold rounded-full flex items-center justify-center">
                                1
                              </span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 7. Nội Dung Chi Tiết (Nhấp để Soạn Thảo Trực Tiếp trên Web hoặc Mở Gutenberg) */}
                      <td className="p-2.5 border-r border-[#F2C14E]/15 align-middle max-w-full overflow-hidden">
                        <div
                          onClick={() => openBigEditor(actualIdx)}
                          className="w-full min-h-[72px] p-2.5 bg-[#22140A] hover:bg-[#2C1A0E] border border-[#52331C] hover:border-[#F2C14E] rounded-xl cursor-pointer transition-all flex flex-col justify-between group/cell shadow-inner overflow-hidden"
                          title="Nhấp vào để mở Trình Soạn Thảo WYSIWYG trực tiếp trên website"
                        >
                          <p className="text-xs text-[#F5EADB]/80 line-clamp-2 leading-relaxed truncate">
                            {row.content
                              ? row.content.replace(/!\[.*?\]\(.*?\)/g, '[Hình Ảnh]').replace(/<[^>]+>/g, '').slice(0, 140) + '...'
                              : row.summary
                              ? row.summary.slice(0, 140) + '...'
                              : row.contentHtml
                              ? row.contentHtml.replace(/<[^>]+>/g, '').slice(0, 140) + '...'
                              : 'Chưa có nội dung, bấm để soạn thảo...'}
                          </p>
                          <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-[#F2C14E]/15 text-[11px] text-[#F2C14E] overflow-hidden">
                            <span className="flex items-center gap-1.5 font-bold text-[#F2C14E] group-hover/cell:text-[#ffde59]">
                              <Edit3 className="w-3.5 h-3.5 shrink-0 text-[#F2C14E]" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffde59]">
                                Soạn Thảo Web
                              </span>
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Nút bấm mở Gutenberg WordPress phụ trợ */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenGutenberg(row, actualIdx);
                                }}
                                className="px-2 py-0.5 rounded-lg bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#ffde59] text-[10px] font-bold flex items-center gap-1 transition-all"
                                title="Mở bài viết trong WordPress Gutenberg"
                              >
                                {openingWpId === row.id ? (
                                  <Loader2 className="w-2.5 h-2.5 animate-spin text-[#F2C14E]" />
                                ) : (
                                  <ExternalLink className="w-2.5 h-2.5 text-[#F2C14E]" />
                                )}
                                <span>{row.wpPostId ? `WP #${row.wpPostId}` : 'Gutenberg'}</span>
                              </button>

                              {kwCount > 0 && (
                                <span
                                  title={`${kwCount} chú thích từ khóa`}
                                  className="px-1.5 py-0.5 rounded-lg bg-[#180E07] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center gap-1 font-bold text-[10px]"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-[#F2C14E]" />
                                  <span>{kwCount}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 8. Thao Tác (Lưu Nhanh Dòng, Xem Web & Xóa) */}
                      <td className="p-2 w-[125px] min-w-[125px] text-center align-middle sticky right-0 z-10 bg-[#1C120A] group-hover:bg-[#26160B] group-focus-within:bg-[#2D1B0F] border-l border-[#F2C14E]/20 shadow-[-4px_0_8px_rgba(0,0,0,0.3)]">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút Lưu Nhanh Dòng Này */}
                          <button
                            type="button"
                            onClick={() => handleSaveSinglePost(row)}
                            className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#F2C14E] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#1A120B] transition-all cursor-pointer shadow-sm hover:scale-105"
                            title="Lưu ngay thay đổi của riêng bài viết này"
                          >
                            <Save className="w-4 h-4" />
                          </button>

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
                            onClick={() => handleDeletePost(row)}
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

        {/* ── BẢNG ĐIỀU KHIỂN PHÂN TRANG (ADMIN PAGINATION BAR) ── */}
        <div className="mt-4 p-2">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemName="bài viết trí tuệ"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🌟 4. TRÌNH SOẠN THẢO WYSIWYG TOÀN MÀN HÌNH (BIG EDITOR MODAL) */}
      {/* ============================================================ */}
      {bigEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div
            className={`bg-[#1C120A] border-2 border-[#F2C14E] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)] transition-all duration-200 ${
              isEditorMaximized
                ? 'fixed inset-0 rounded-none w-screen h-screen max-w-none max-h-none p-4 sm:p-6'
                : 'rounded-3xl p-5 sm:p-7 w-full max-w-5xl max-h-[94vh]'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F2C14E]/30 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shrink-0 shadow-sm">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="px-2.5 py-0.5 rounded-lg bg-[#3A2718] text-[#ffde59] text-xs font-bold border border-[#F2C14E]/40 shrink-0"
                  >
                    Bài #{bigEditor.rowIndex + 1}
                  </span>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-2xl sm:text-3xl text-[#ffde59] uppercase tracking-wider font-normal truncate max-w-lg"
                  >
                    {posts[bigEditor.rowIndex]?.title || 'Chưa đặt tiêu đề'}
                  </h3>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditorMaximized(!isEditorMaximized)}
                  className="p-2 rounded-xl hover:bg-[#25170E] text-[#FFE5A3] border border-transparent hover:border-[#F2C14E]/30 transition-all cursor-pointer"
                  title={isEditorMaximized ? 'Thu nhỏ' : 'Toàn màn hình'}
                >
                  {isEditorMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setBigEditor(null)}
                  className="p-2 rounded-xl hover:bg-red-900/60 text-[#c9b896] hover:text-white transition-all cursor-pointer"
                  title="Đóng cửa sổ soạn thảo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 py-3 flex flex-col min-h-0 space-y-3 relative">
              <ZenTipTapEditor
                content={posts[bigEditor.rowIndex]?.content || posts[bigEditor.rowIndex]?.summary || ''}
                onChange={(newMd) => {
                  const updated = [...posts];
                  updated[bigEditor.rowIndex].content = newMd;
                  setPosts(updated);
                  setIsDirty(true);
                }}
                folderPath="04-vu-tru-phat-giao"
                onOpenS3Explorer={() => {
                  openS3Library((url, caption) => {
                    const currentMd = posts[bigEditor.rowIndex].content || '';
                    const imgMd = `\n\n![${caption || 'Hình ảnh tư liệu'}](${url})\n\n`;
                    const updated = [...posts];
                    updated[bigEditor.rowIndex].content = currentMd + imgMd;
                    setPosts(updated);
                    setIsDirty(true);
                  });
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#F2C14E]/30 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenGutenberg(posts[bigEditor.rowIndex], bigEditor.rowIndex)}
                  className="px-3.5 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#ffde59] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Mở sang WordPress Gutenberg để dùng các block nâng cao"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Mở Trong WordPress Gutenberg</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBigEditor(null)}
                  className="px-4 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-xs font-bold text-[#c9b896] hover:text-white transition-all cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const target = posts[bigEditor.rowIndex];
                    if (!target) return;
                    showToast('⏳ Đang lưu nội dung bài viết...');
                    try {
                      const res = await fetch(`/api/admin/posts/${encodeURIComponent(target.id)}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          content: target.content,
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        showToast('✅ Đã lưu nội dung bài viết thành công!');
                        setIsDirty(false);
                      } else {
                        showToast(`❌ Lỗi: ${data.error}`);
                      }
                    } catch (e: any) {
                      showToast(`❌ Lỗi kết nối: ${e.message}`);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#1A120B] text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-102"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Nội Dung Bài Viết</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 5. MODAL ĐA PHƯƠNG TIỆN (MEDIA MODAL: BANNER, VIDEO, GALLERY, BOOK) */}
      {/* ============================================================ */}
      {mediaModal && posts[mediaModal.rowIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl p-5 sm:p-6 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(242,193,78,0.4)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F2C14E]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D1B10] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                    className="text-2xl sm:text-3xl text-[#ffde59] uppercase tracking-wider font-normal"
                  >
                    THIẾT LẬP ĐA PHƯƠNG TIỆN
                  </h3>
                  <p className="text-xs text-[#c9b896] truncate max-w-lg">
                    {posts[mediaModal.rowIndex]?.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMediaModal(null)}
                className="p-2 rounded-full hover:bg-[#25170E] text-[#c9b896] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector Tabs (5 Tabs Đa Phương Tiện Chuẩn) */}
            <div className="flex items-center gap-2 p-1.5 bg-[#25170E] rounded-2xl border border-[#F2C14E]/30 my-4 overflow-x-auto custom-scrollbar shrink-0">
              {[
                { id: 'banner', label: '1. Banner & Ảnh Bìa', icon: ImageIcon },
                { id: 'video', label: '2. Video Pháp Thoại', icon: Video },
                { id: 'featured', label: '3. Bài Viết Nổi Bật', icon: Flame },
                { id: 'gallery', label: '4. Album Ảnh Tư Liệu', icon: Images },
                { id: 'book', label: '5. Sách & Kinh Điển', icon: BookOpen },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = mediaModal.tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setMediaModal({ ...mediaModal, tab: t.id as any })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#F2C14E] text-[#1A120B] shadow-md'
                        : 'text-[#c9b896] hover:text-white hover:bg-[#352012]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 py-2 pr-1">
              {/* TAB 1: BANNER & ẢNH BÌA */}
              {mediaModal.tab === 'banner' && (
                <div className="space-y-6">
                  {/* Khối Banner Hero Ngang */}
                  <div className="space-y-3 p-4 bg-[#21140B] rounded-2xl border border-[#F2C14E]/30">
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#F2C14E]" />
                        <span>Ảnh Banner Hero Ngang (Tiêu Điểm Đầu Bài)</span>
                      </span>
                      <span className="text-[11px] text-[#F2C14E] font-mono">
                        Vị trí: {posts[mediaModal.rowIndex].bannerPosition || 'center 50%'}
                      </span>
                    </div>

                    {posts[mediaModal.rowIndex].bannerUrl ? (
                      <div className="space-y-3">
                        <InteractiveImageDrag
                          imageUrl={posts[mediaModal.rowIndex].bannerUrl!}
                          position={posts[mediaModal.rowIndex].bannerPosition || 'center 50%'}
                          onPositionChange={(pos) => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].bannerPosition = pos;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          className="w-full h-52"
                        >
                          <div className="absolute top-3 right-3 flex items-center gap-2 z-40">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openS3Library((url) => {
                                  const updated = [...posts];
                                  updated[mediaModal.rowIndex].bannerUrl = url;
                                  setPosts(updated);
                                  setIsDirty(true);
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer hover:scale-105"
                              title="Đổi ảnh từ S3"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Đổi từ S3</span>
                            </button>
                          </div>
                        </InteractiveImageDrag>
                        <p className="text-[11px] text-[#c9b896]/70 italic text-center">
                          💡 Nhấp và kéo chuột trên ảnh để điều chỉnh trọng tâm hiển thị khung hình
                        </p>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          openS3Library((url) => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].bannerUrl = url;
                            setPosts(updated);
                            setIsDirty(true);
                          })
                        }
                        className="border-2 border-dashed border-[#F2C14E]/40 hover:border-[#F2C14E] rounded-2xl p-8 text-center cursor-pointer bg-[#25170E]/50 hover:bg-[#25170E] transition-all group"
                      >
                        <ImageIcon className="w-8 h-8 text-[#F2C14E]/60 mx-auto mb-2" />
                        <p className="text-xs font-bold text-[#FFE5A3]">Bấm vào đây để chọn ảnh Banner Hero từ S3</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={posts[mediaModal.rowIndex].bannerUrl || ''}
                        onChange={(e) => {
                          const updated = [...posts];
                          updated[mediaModal.rowIndex].bannerUrl = e.target.value;
                          setPosts(updated);
                          setIsDirty(true);
                        }}
                        placeholder="Dán URL ảnh banner..."
                        className="flex-1 px-3 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const banner = posts[mediaModal.rowIndex].bannerUrl;
                          if (banner) {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].thumbnailUrl = banner;
                            setPosts(updated);
                            setIsDirty(true);
                            showToast('✅ Đã đồng bộ sang Ảnh Đại Diện!');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] text-xs font-bold shrink-0 cursor-pointer"
                        title="Dùng luôn làm ảnh đại diện"
                      >
                        Dùng làm Thumbnail
                      </button>
                    </div>
                  </div>

                  {/* Khối Ảnh Đại Diện (Thumbnail) */}
                  <div className="space-y-3 p-4 bg-[#21140B] rounded-2xl border border-[#F2C14E]/30">
                    <div className="flex items-center justify-between text-xs font-bold text-[#FFE5A3]">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#F2C14E]" />
                        <span>Ảnh Đại Diện / Thumbnail (Hiển Thị Trong Danh Sách)</span>
                      </span>
                      <span className="text-[11px] text-[#F2C14E] font-mono">
                        Vị trí: {posts[mediaModal.rowIndex].thumbnailPosition || 'center 50%'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-48 h-36 shrink-0 rounded-2xl overflow-hidden border-2 border-[#F2C14E]/60 bg-black relative shadow-lg">
                        <InteractiveImageDrag
                          imageUrl={posts[mediaModal.rowIndex].thumbnailUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp'}
                          position={posts[mediaModal.rowIndex].thumbnailPosition || 'center 50%'}
                          onPositionChange={(pos) => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].thumbnailPosition = pos;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={posts[mediaModal.rowIndex].thumbnailUrl || ''}
                          onChange={(e) => {
                            const updated = [...posts];
                            updated[mediaModal.rowIndex].thumbnailUrl = e.target.value;
                            setPosts(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Dán URL ảnh thumbnail..."
                          className="w-full px-3 py-2 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono"
                        />

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openS3Library((url) => {
                                const updated = [...posts];
                                updated[mediaModal.rowIndex].thumbnailUrl = url;
                                setPosts(updated);
                                setIsDirty(true);
                              })
                            }
                            className="px-3 py-2 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Chọn từ Kho S3</span>
                          </button>

                          {/* Kéo thả hoặc tải lên nhanh */}
                          <label className="px-3 py-2 rounded-xl bg-[#2A1D14] hover:bg-[#382618] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-[#ffde59] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
                            <Upload className="w-3.5 h-3.5 text-[#F2C14E]" />
                            <span>Tải từ Máy Tính</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  showToast('⏳ Đang tải ảnh lên S3...');
                                  const url = await uploadImageFileDirectly(file);
                                  if (url) {
                                    const updated = [...posts];
                                    updated[mediaModal.rowIndex].thumbnailUrl = url;
                                    setPosts(updated);
                                    setIsDirty(true);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút lưu riêng cho Banner */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveMediaModal(mediaModal.rowIndex)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#1A120B] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer hover:scale-102"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Thiết Lập Ảnh Bìa</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEO PHÁP THOẠI */}
              {mediaModal.tab === 'video' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Link Video (YouTube Embed hoặc S3 MP4/M3U8)</span>
                    </label>
                    <input
                      type="text"
                      value={posts[mediaModal.rowIndex].videoBlock?.videoUrl || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].videoBlock) {
                          updated[mediaModal.rowIndex].videoBlock = { videoUrl: '', title: '', summary: '' };
                        }
                        updated[mediaModal.rowIndex].videoBlock!.videoUrl = e.target.value;
                        setPosts(updated);
                        setIsDirty(true);
                      }}
                      placeholder="https://www.youtube.com/embed/... hoặc https://...mp4"
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tiêu Đề Video Pháp Thoại</span>
                    </label>
                    <input
                      type="text"
                      value={posts[mediaModal.rowIndex].videoBlock?.title || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].videoBlock) {
                          updated[mediaModal.rowIndex].videoBlock = { videoUrl: '', title: '', summary: '' };
                        }
                        updated[mediaModal.rowIndex].videoBlock!.title = e.target.value;
                        setPosts(updated);
                        setIsDirty(true);
                      }}
                      placeholder="Pháp thoại: Giáo Lý Duyên Khởi & Tứ Diệu Đế..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tóm Tắt Lời Khai Thị Trong Video</span>
                    </label>
                    <textarea
                      rows={3}
                      value={posts[mediaModal.rowIndex].videoBlock?.summary || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].videoBlock) {
                          updated[mediaModal.rowIndex].videoBlock = { videoUrl: '', title: '', summary: '' };
                        }
                        updated[mediaModal.rowIndex].videoBlock!.summary = e.target.value;
                        setPosts(updated);
                        setIsDirty(true);
                      }}
                      placeholder="Tóm tắt nội dung chính được thuyết giảng..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveMediaModal(mediaModal.rowIndex)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#1A120B] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer hover:scale-102"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Thiết Lập Video</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: BÀI VIẾT NỔI BẬT */}
              {mediaModal.tab === 'featured' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Tiêu Đề Bài Viết Nổi Bật</span>
                    </label>
                    <input
                      type="text"
                      value={posts[mediaModal.rowIndex].featuredArticle?.title || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                        updated[mediaModal.rowIndex].featuredArticle!.title = e.target.value;
                        setPosts(updated);
                        setIsDirty(true);
                      }}
                      placeholder="Tiêu đề bài viết nổi bật liên quan..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Đường Dẫn Liên Kết (Link)</span>
                    </label>
                    <input
                      type="text"
                      value={posts[mediaModal.rowIndex].featuredArticle?.linkUrl || ''}
                      onChange={(e) => {
                        const updated = [...posts];
                        if (!updated[mediaModal.rowIndex].featuredArticle) updated[mediaModal.rowIndex].featuredArticle = {};
                        updated[mediaModal.rowIndex].featuredArticle!.linkUrl = e.target.value;
                        setPosts(updated);
                        setIsDirty(true);
                      }}
                      placeholder="/tri-tue-phat-phap/... hoặc /dong-chay-hoang-phap/..."
                      className="w-full px-3.5 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveMediaModal(mediaModal.rowIndex)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#1A120B] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer hover:scale-102"
                    >
                      <Save className="w-4 h-4" />
                      <span>Lưu Bài Viết Nổi Bật</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: ALBUM ẢNH TƯ LIỆU */}
              {mediaModal.tab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FFE5A3] flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5 text-[#F2C14E]" />
                      <span>Bộ Sưu Tập Ảnh Tư Liệu ({posts[mediaModal.rowIndex].photoGallery?.length || 0})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveGallery(mediaModal.rowIndex)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#ffde59] text-[#1A120B] font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 cursor-pointer"
                        title="Lưu ngay thay đổi của bộ ảnh này"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu Album</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openS3Library((url) => {
                            const updated = [...posts];
                            if (!updated[mediaModal.rowIndex].photoGallery) updated[mediaModal.rowIndex].photoGallery = [];
                            updated[mediaModal.rowIndex].photoGallery!.push({
                              title: 'Ảnh tư liệu mới',
                              imageUrl: url,
                              imagePosition: 'center 50%',
                              khuVuc: 'Tùng Lâm Hòa Phúc',
                              noiDung: 'Mô tả hình ảnh...',
                            });
                            setPosts(updated);
                            setIsDirty(true);
                          })
                        }
                        className="w-8 h-8 rounded-xl bg-[#F2C14E] text-[#1A120B] flex items-center justify-center cursor-pointer hover:bg-[#ffde59] shadow-md hover:scale-105"
                        title="Thêm ảnh mới từ S3"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>

                  {/* Drop zone to upload multiple images at once */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        for (let i = 0; i < files.length; i++) {
                          const f = files[i];
                          if (f.type.startsWith('image/')) {
                            showToast(`⏳ Đang tải ảnh ${i + 1}/${files.length} lên S3...`);
                            const url = await uploadImageFileDirectly(f);
                            if (url) {
                              const updated = [...posts];
                              if (!updated[mediaModal.rowIndex].photoGallery) updated[mediaModal.rowIndex].photoGallery = [];
                              updated[mediaModal.rowIndex].photoGallery!.push({
                                title: f.name.replace(/\.[^/.]+$/, ''),
                                imageUrl: url,
                                imagePosition: 'center 50%',
                                khuVuc: 'Tùng Lâm Hòa Phúc',
                                noiDung: 'Mô tả hình ảnh sự kiện...',
                              });
                              setPosts(updated);
                              setIsDirty(true);
                            }
                          }
                        }
                      }
                    }}
                    className="border-2 border-dashed border-[#F2C14E]/30 rounded-2xl p-4 text-center cursor-pointer hover:border-[#F2C14E] bg-[#25170E]/30 transition-all"
                  >
                    <p className="text-xs text-[#FFE5A3]/80">Kéo thả nhiều ảnh cùng lúc vào đây để tự động tải lên S3 & thêm vào album</p>
                  </div>

                  {/* Photos list in Adaptive Responsive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                    {posts[mediaModal.rowIndex].photoGallery?.map((item, pIdx) => (
                      <div key={pIdx} className="p-3 bg-[#25170E] border border-[#F2C14E]/30 rounded-2xl flex gap-3 relative group/card hover:border-[#F2C14E] transition-all">
                        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black border border-[#F2C14E]/40 relative">
                          <img src={item.imageUrl} alt={item.title || 'Ảnh'} className="w-full h-full object-cover" />
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[#ffde59] text-[9px] font-bold">
                            #{pIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].photoGallery!.splice(pIdx, 1);
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-md bg-red-900/90 text-white hover:bg-red-700 transition-colors"
                            title="Xóa ảnh này"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-1.5 text-xs">
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].photoGallery![pIdx].title = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Tiêu đề ảnh..."
                            className="w-full px-2.5 py-1.5 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-white font-bold text-xs"
                          />
                          <textarea
                            rows={2}
                            value={item.noiDung || ''}
                            onChange={(e) => {
                              const updated = [...posts];
                              updated[mediaModal.rowIndex].photoGallery![pIdx].noiDung = e.target.value;
                              setPosts(updated);
                              setIsDirty(true);
                            }}
                            placeholder="Chú thích ảnh chi tiết..."
                            className="w-full px-2.5 py-1 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-[#FFE5A3] text-xs resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SÁCH & KINH ĐIỂN THAM KHẢO */}
              {mediaModal.tab === 'book' && (() => {
                const book = getPrimaryBook(posts[mediaModal.rowIndex].sourceBook);
                const updateBook = (patch: Partial<SourceBook>) => {
                  const updated = [...posts];
                  const existing = getPrimaryBook(updated[mediaModal.rowIndex].sourceBook) || { bookTitle: '', author: '', coverImage: '', description: '', linkUrl: '' };
                  updated[mediaModal.rowIndex].sourceBook = { ...existing, ...patch };
                  if (patch.coverImage) {
                    updated[mediaModal.rowIndex].thumbnailUrl = patch.coverImage;
                    updated[mediaModal.rowIndex].bannerUrl = patch.coverImage;
                  }
                  setPosts(updated);
                  setIsDirty(true);
                };

                return (
                  <div className="space-y-4">
                    <div className="p-3 bg-[#25170E] rounded-xl border border-[#F2C14E]/30 text-xs text-[#FFE5A3]/90 leading-relaxed">
                      📖 Ấn phẩm kinh sách tham khảo sẽ hiển thị trang trọng ở cuối bài viết và liên kết trực tiếp vào <b>Tàng Kinh Các</b> của chùa.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#FFE5A3]">Tên Sách / Kinh Điển</label>
                        <input
                          type="text"
                          value={book?.bookTitle || ''}
                          onChange={(e) => updateBook({ bookTitle: e.target.value })}
                          placeholder="VD: Kinh Kim Cương Bát Nhã Ba La Mật..."
                          className="w-full px-3 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#FFE5A3]">Tác Giả / Dịch Giả</label>
                        <input
                          type="text"
                          value={book?.author || ''}
                          onChange={(e) => updateBook({ author: e.target.value })}
                          placeholder="VD: Thích Nhất Hạnh / Thiền Sư Thích Thanh Từ..."
                          className="w-full px-3 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#FFE5A3]">Ảnh Bìa Sách</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={book?.coverImage || ''}
                          onChange={(e) => updateBook({ coverImage: e.target.value })}
                          placeholder="URL ảnh bìa sách..."
                          className="flex-1 px-3 py-2 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            openS3Library((url) => {
                              updateBook({ coverImage: url });
                            })
                          }
                          className="px-3.5 py-2 rounded-xl bg-[#F2C14E] text-black text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Chọn S3</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#FFE5A3]">Đường Dẫn Đọc Sách / Tàng Kinh Các</label>
                      <input
                        type="text"
                        value={book?.linkUrl || ''}
                        onChange={(e) => updateBook({ linkUrl: e.target.value })}
                        placeholder="/vu-tru-phat-giao/tang-kinh-cac/... hoặc link PDF"
                        className="w-full px-3 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#FFE5A3]">Tóm Tắt Giới Thiệu Ấn Phẩm</label>
                      <textarea
                        rows={3}
                        value={book?.description || ''}
                        onChange={(e) => updateBook({ description: e.target.value })}
                        placeholder="Mô tả tóm lược giá trị của ấn phẩm kinh sách này..."
                        className="w-full px-3 py-2 mt-1 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2C14E]"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => handleSaveMediaModal(mediaModal.rowIndex)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#E5A93C] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#1A120B] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer hover:scale-102"
                      >
                        <Save className="w-4 h-4" />
                        <span>Lưu Nguồn Sách Tham Khảo</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

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
          setImageLibraryOpen(false);
          setTargetImageCallback(null);
        }}
        initialPath="04-vu-tru-phat-giao"
      />
    </div>
  );
}

export default SpreadsheetTriTue;
