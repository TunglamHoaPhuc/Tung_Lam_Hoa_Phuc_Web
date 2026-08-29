'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Layers, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import tongChiRawData from '@/data/tong-chi-data.json';

export interface SwitcherArticleItem {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  categoryName?: string;
  bannerImage?: string;
  excerpt?: string;
}

interface TongChiArticleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug?: string;
  currentTitle?: string;
}

const CATEGORIES = [
  { id: 'all', name: 'TẤT CẢ' },
  { id: 'tong-phong-truyen-thua', name: 'TÔNG PHONG TRUYỀN THỪA' },
  { id: 'nen-tang-tu-hoc', name: 'NỀN TẢNG TU HỌC' },
  { id: 'phuong-phap-hanh-tri', name: 'PHƯƠNG PHÁP HÀNH TRÌ' },
  { id: 'lo-trinh-tu-hoc', name: 'LỘ TRÌNH TU HỌC' },
  { id: 'nep-song-thien-gia', name: 'NẾP SỐNG THIỀN GIA' },
];

export function TongChiArticleSwitcherModal({
  isOpen,
  onClose,
  currentSlug,
  currentTitle,
}: TongChiArticleSwitcherModalProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<SwitcherArticleItem[]>(() => tongChiRawData as SwitcherArticleItem[]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch updated data from backend if available
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/admin/tong-chi', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setArticles(json.data);
        }
      })
      .catch(() => {
        // Fall back to imported JSON
      });
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.categoryName?.toLowerCase().includes(q) ||
        item.excerpt?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#1C120A] border-2 border-[#F2C14E] rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_80px_rgba(242,193,78,0.35)] overflow-hidden text-[#FFE5A3]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2C14E]/30 bg-[#25170E] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shadow-md shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-2xl sm:text-3xl text-[#ffde59] uppercase tracking-wider font-normal"
              >
                DANH SÁCH BÀI THƠ &amp; BÀI VIẾT TÔNG CHỈ
              </h2>
              <p
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-[11px] text-[#c9b896]/80 font-medium"
              >
                Chọn bài để chuyển nhanh đến nội dung tu học tương ứng ({articles.length} bài)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#2A1D14] hover:bg-red-900/60 border border-[#F2C14E]/40 text-[#c9b896] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Đóng danh sách (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-4 sm:px-6 bg-[#180E07] border-b border-[#F2C14E]/20 space-y-3 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#F2C14E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài thơ, bài viết theo tiêu đề hoặc từ khóa..."
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="w-full pl-10 pr-10 py-2.5 bg-[#25170E] border border-[#F2C14E]/40 rounded-xl text-xs sm:text-sm text-white placeholder:text-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E]/50 shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#c9b896] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? articles.length
                  : articles.filter((a) => a.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#F2C14E] text-[#1A120B] shadow-[0_0_15px_rgba(242,193,78,0.4)] scale-105'
                      : 'bg-[#25170E] hover:bg-[#352012] text-[#c9b896] hover:text-white border border-[#F2C14E]/30'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                      isActive ? 'bg-[#1A120B]/20 text-[#1A120B]' : 'bg-[#1C120A] text-[#FFE5A3]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles List / Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-[#1C120A]">
          {filteredArticles.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <BookOpen className="w-10 h-10 text-[#F2C14E]/40 mx-auto mb-2" />
              <p
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-sm font-bold text-[#FFE5A3]"
              >
                Không tìm thấy bài viết nào phù hợp
              </p>
              <p className="text-xs text-[#c9b896]/70">
                Thử tìm với từ khóa khác hoặc chuyển sang chuyên mục Tất cả
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredArticles.map((item, idx) => {
                const isCurrent =
                  currentSlug === item.slug ||
                  (currentTitle && currentTitle.toLowerCase() === item.title?.toLowerCase());

                return (
                  <Link
                    key={item.id || item.slug || idx}
                    href={`/tong-chi-tu-hoc/${item.slug}`}
                    onClick={() => onClose()}
                    className={`group relative p-3 rounded-2xl transition-all duration-200 flex flex-col justify-between border cursor-pointer ${
                      isCurrent
                        ? 'bg-[#3A2718] border-[#F2C14E] shadow-[0_0_20px_rgba(242,193,78,0.25)] ring-1 ring-[#F2C14E]'
                        : 'bg-[#25170E]/80 hover:bg-[#2F1D12] border-[#F2C14E]/30 hover:border-[#F2C14E]/70 hover:scale-[1.02] shadow-sm'
                    }`}
                  >
                    {/* Header: Thumbnail + Number + Info */}
                    <div className="flex items-start gap-3">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/50 border border-[#F2C14E]/40 shrink-0 shadow-md">
                        <img
                          src={item.bannerImage || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-banner.webp'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-[#ffde59] border border-[#F2C14E]/50">
                          #{item.id}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            className="text-[9px] font-bold tracking-wider text-[#F2C14E] uppercase truncate"
                          >
                            {item.categoryName || 'TÔNG CHỈ'}
                          </span>
                          {isCurrent && (
                            <span
                              style={{ fontFamily: "'UTM Avo', sans-serif" }}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F2C14E] text-[#1A120B] text-[9px] font-bold uppercase shrink-0"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Đang xem</span>
                            </span>
                          )}
                        </div>

                        <h3
                          style={{ fontFamily: "'UTM Niagara', serif" }}
                          className="text-xl sm:text-2xl text-[#ffde59] group-hover:text-white uppercase tracking-wider font-normal leading-tight line-clamp-2 transition-colors"
                        >
                          {item.title}
                        </h3>

                        {item.subtitle && (
                          <p
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            className="text-[10px] text-[#c9b896] italic truncate mt-0.5"
                          >
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-2.5 pt-2 border-t border-[#F2C14E]/15 flex items-center justify-between text-[10px] text-[#c9b896]/70 group-hover:text-[#FFE5A3] transition-colors">
                      <span style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                        Bấm để xem nội dung bài thơ
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#F2C14E] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#25170E] border-t border-[#F2C14E]/30 flex items-center justify-between shrink-0">
          <span
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[11px] text-[#c9b896]/80"
          >
            Đang hiển thị <span className="text-[#FFE5A3] font-bold">{filteredArticles.length}</span> / {articles.length} bài
          </span>

          <button
            type="button"
            onClick={onClose}
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="px-4 py-1.5 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default TongChiArticleSwitcherModal;
