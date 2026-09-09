'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Image as ImageIcon,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export interface WordPressMediaItem {
  id: number;
  title: string;
  url: string;
  thumb: string;
  width?: number;
  height?: number;
  date?: string;
}

interface WordPressMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, item: WordPressMediaItem) => void;
  title?: string;
}

export function WordPressMediaModal({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Thư Viện Ảnh Dùng Chung WordPress',
}: WordPressMediaModalProps) {
  const [items, setItems] = useState<WordPressMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState<WordPressMediaItem | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch media from API
  const fetchMedia = async (targetPage = page, search = debouncedSearch) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        page: String(targetPage),
        per_page: '18',
        search: search.trim(),
      });
      const res = await fetch(`/api/admin/wp-media?${qs.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Không thể tải ảnh từ WordPress`);
      }
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
      } else {
        throw new Error(data.error || 'Lỗi tải ảnh');
      }
    } catch (err: any) {
      console.error('Error fetching WP media:', err);
      setError(err.message || 'Lỗi kết nối máy chủ WordPress Media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia(page, debouncedSearch);
    }
  }, [isOpen, page, debouncedSearch]);

  if (!isOpen) return null;

  const handleConfirmSelect = (item: WordPressMediaItem) => {
    onSelectImage(item.url, item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#1C120A] via-[#170E08] to-[#0D0804] border-2 border-[#F2C14E]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F2C14E]/25 bg-[#25170E]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C14E]/20 border border-[#F2C14E]/40 flex items-center justify-center text-[#F2C14E]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#FFDE59] uppercase tracking-wide flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#FFE5A3] border border-[#F2C14E]/30 font-semibold normal-case">
                  Dùng Chung WordPress
                </span>
              </h2>
              <p className="text-xs text-[#c9b896]/80">
                Toàn bộ ảnh lưu trên WordPress (<code>admin.tunglamhoaphuc.com</code>) — Chọn 1 click là dùng ngay
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#c9b896] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="p-4 border-b border-[#F2C14E]/20 bg-[#1E130B]/60 flex flex-wrap items-center justify-between gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm ảnh (ví dụ: banner, thay, hoa-phuc, bo-de...)"
              className="w-full pl-10 pr-9 py-2 bg-[#120A05] border border-[#F2C14E]/40 rounded-xl text-xs text-white placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#c9b896]/70 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#FFE5A3]/80">
              Tổng: <strong className="text-[#FFDE59]">{totalItems}</strong> ảnh
            </span>

            <button
              type="button"
              onClick={() => fetchMedia(page, debouncedSearch)}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-xs font-semibold text-[#FFE5A3] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Tải lại danh sách ảnh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#F2C14E] ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            <a
              href="https://admin.tunglamhoaphuc.com/wp-admin/upload.php"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#F2C14E]/20 hover:bg-[#F2C14E]/30 border border-[#F2C14E]/50 text-xs font-bold text-[#FFDE59] flex items-center gap-1.5 transition-all cursor-pointer"
              title="Mở Thư Viện Media trên trang quản trị WordPress để tải thêm ảnh mới"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span className="hidden sm:inline">Mở Thư Viện WP</span>
            </a>
          </div>
        </div>

        {/* MEDIA GRID CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 min-h-[360px]">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-[#FFE5A3]">
              <Loader2 className="w-8 h-8 animate-spin text-[#F2C14E]" />
              <p className="text-xs">Đang tải thư viện ảnh từ WordPress...</p>
            </div>
          ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-red-300">
              <p className="text-sm font-semibold">{error}</p>
              <button
                type="button"
                onClick={() => fetchMedia(page, debouncedSearch)}
                className="px-4 py-2 rounded-xl bg-[#2A1D14] border border-[#F2C14E]/40 text-xs font-bold text-[#FFE5A3] hover:bg-[#3A2718]"
              >
                Thử lại
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-[#c9b896]/70">
              <ImageIcon className="w-12 h-12 text-[#F2C14E]/30" />
              <p className="text-sm">Không tìm thấy hình ảnh nào phù hợp.</p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#F2C14E] underline mt-1"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    onDoubleClick={() => handleConfirmSelect(item)}
                    className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col bg-[#140C07] ${
                      isSelected
                        ? 'border-[#FFDE59] ring-2 ring-[#FFDE59]/60 shadow-[0_0_15px_rgba(255,222,89,0.3)] scale-[1.02]'
                        : 'border-[#F2C14E]/25 hover:border-[#F2C14E]/70 hover:scale-[1.01]'
                    }`}
                  >
                    {/* Hình ảnh preview */}
                    <div className="aspect-square w-full bg-black/50 overflow-hidden relative">
                      <img
                        src={item.thumb || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F2C14E] text-[#120A05] flex items-center justify-center shadow-lg font-bold">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      {/* Quick Select Button on Hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmSelect(item);
                        }}
                        className="absolute inset-x-2 bottom-2 py-1.5 rounded-lg bg-[#F2C14E] hover:bg-[#FFDE59] text-[#120A05] text-[11px] font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Chọn ngay</span>
                      </button>
                    </div>

                    {/* Tiêu đề & Thông tin */}
                    <div className="p-2 flex flex-col justify-between flex-1">
                      <p
                        className="text-[11px] font-medium text-[#FFE5A3] line-clamp-2 leading-tight group-hover:text-[#FFDE59]"
                        title={item.title}
                      >
                        {item.title}
                      </p>
                      {item.width && item.height ? (
                        <span className="text-[9px] text-[#c9b896]/60 mt-1">
                          {item.width} × {item.height}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER & PAGINATION */}
        <div className="px-5 py-3 border-t border-[#F2C14E]/25 bg-[#25170E]/80 flex flex-wrap items-center justify-between gap-3">
          {/* Phân trang */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#FFE5A3] font-medium">
              Trang <strong className="text-[#FFDE59]">{page}</strong> / {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-[#1C120A] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1C120A] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-xs font-semibold text-[#c9b896] hover:text-white transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              disabled={!selectedItem}
              onClick={() => selectedItem && handleConfirmSelect(selectedItem)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] hover:brightness-110 text-[#120A05] text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Sử Dụng Ảnh Đã Chọn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
