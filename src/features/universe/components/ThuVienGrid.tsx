'use client';

import React, { FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, RefreshCw, X, BookOpen, User, FileText, Calendar, ArrowRight, Building } from 'lucide-react';
import { THU_VIEN_BOOKS, BOOK_CATEGORIES, BookItem } from '@/data/thu-vien-data';

interface BookCardProps {
  book: BookItem;
  onSelect: (book: BookItem) => void;
}

const BookCard = React.memo(({ book, onSelect }: BookCardProps) => {
  return (
    <div
      onClick={() => onSelect(book)}
      className="group relative w-full overflow-hidden rounded-2xl border border-[#F2C14E]/30 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between hover:-translate-y-1 transform-gpu will-change-transform h-[430px]"
    >
      {/* 1. BOOK COVER IMAGE FRAME */}
      <div className="relative w-full h-[260px] overflow-hidden bg-[#1A120B] shrink-0 flex items-center justify-center p-3">
        <img
          src={book.coverUrl}
          alt={book.title}
          loading="lazy"
          decoding="async"
          className="w-auto h-full max-h-[230px] object-contain shadow-2xl rounded-lg group-hover:scale-105 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=800&fit=crop';
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(37,23,14,0.95) 0%, transparent 70%)",
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#F2C14E] bg-[#1C130D]/90 border border-[#F2C14E]/40 backdrop-blur-md">
          {book.category}
        </div>
      </div>

      {/* 2. CARD CAPTION CONTAINER */}
      <div className="relative w-full bg-gradient-to-b from-[#25170E] to-[#1C130D] px-4 pt-3 pb-4 flex flex-col justify-between flex-1 text-center">
        <div>
          <h3
            className="text-[#F2C14E] text-xl md:text-2xl font-bold leading-snug group-hover:text-white transition-colors mb-1 line-clamp-1"
            style={{ fontFamily: "'UTM Niagara', serif" }}
          >
            {book.title}
          </h3>

          <p
            className="text-[#FFE5A3]/90 text-xs font-bold line-clamp-1 mb-1.5"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {book.author}
          </p>

          <p
            className="text-[#c9b896] text-[11px] leading-relaxed line-clamp-2"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {book.description}
          </p>
        </div>

        {/* Footer info row */}
        <div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/30 to-transparent my-2" />
          <div
            className="flex items-center justify-between text-[11px] text-[#FFE5A3]/70 font-bold px-1"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <Building className="w-3 h-3 text-[#F2C14E] shrink-0" />
              <span className="truncate">{book.publisher || 'NXB Tôn Giáo'}</span>
            </span>
            <span className="text-[#F2C14E] group-hover:translate-x-1 transition-transform shrink-0">
              Chi tiết ➔
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';

export const ThuVienGrid: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'newest' | 'pages' | 'title'>('newest');
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [displayCount, setDisplayCount] = useState(12);

  // Fast Instant Real-time Filter across all 427 books
  const filteredBooks = useMemo(() => {
    let result = THU_VIEN_BOOKS;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const matchTitle = b.title.toLowerCase().includes(q);
        const matchAuthor = b.author.toLowerCase().includes(q);
        const matchPublisher = b.publisher?.toLowerCase().includes(q) || false;
        const matchDesc = b.description.toLowerCase().includes(q);
        return matchTitle || matchAuthor || matchPublisher || matchDesc;
      });
    }

    if (selectedCategory !== 'Tất cả') {
      result = result.filter((b) => b.category === selectedCategory);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'pages') return b.pages - a.pages;
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'vi');
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const visibleBooks = useMemo(() => {
    return filteredBooks.slice(0, displayCount);
  }, [filteredBooks, displayCount]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Tất cả');
    setSortBy('newest');
    setDisplayCount(12);
  };

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1] py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── 1. SECTION HEADER SYNCHRONIZED WITH HOMEPAGE ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className="text-2xl md:text-4xl font-normal text-[#F2C14E] uppercase tracking-widest mb-1"
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
            >
              THƯ VIỆN KINH SÁCH TÙNG LÂM HÒA PHÚC
            </h2>
            <p
              className="text-xs md:text-sm text-[#c9b896]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Kho tàng 400+ kinh điển, luật tạng, luận giải và tạp chí Phật học lưu trữ tại Bổn Tự
            </p>
          </div>
        </div>

        {/* ── 2. FILTER TOOLBAR MATCHING DANH TĂNG ── */}
        <div className="bg-[#1C130D] p-4 md:p-6 rounded-2xl border border-[#F2C14E]/30 shadow-2xl mb-8">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2C14E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayCount(12);
                }}
                placeholder="Tìm tên kinh sách, tác giả, nhà xuất bản..."
                className="w-full pl-9 pr-8 py-2 bg-[#2A1D14] border border-[#F2C14E]/40 rounded-xl text-xs md:text-sm text-[#FFE5A3] placeholder-[#c9b896]/60 focus:outline-none focus:border-[#F2C14E]"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9b896] hover:text-[#F2C14E] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdown 1: Loại Sách */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setDisplayCount(12);
                }}
                className="appearance-none bg-[#2A1D14] border border-[#F2C14E]/40 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-[#F2C14E] focus:outline-none focus:border-[#F2C14E] cursor-pointer"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {BOOK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>Loại sách: {cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F2C14E] pointer-events-none" />
            </div>

            {/* Filter Dropdown 2: Sắp Xếp */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-[#2A1D14] border border-[#F2C14E]/40 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E] cursor-pointer"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <option value="newest">Sắp xếp: Mới nhất</option>
                <option value="pages">Sắp xếp: Số trang nhiều</option>
                <option value="title">Sắp xếp: Tên A-Z</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F2C14E]/60 pointer-events-none" />
            </div>

            {/* Reset Filters button */}
            {(searchQuery || selectedCategory !== 'Tất cả' || sortBy !== 'newest') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#F2C14E]/40 bg-[#2A1D14] text-xs font-bold text-[#c9b896] hover:text-[#F2C14E] hover:border-[#F2C14E] transition-all cursor-pointer"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>

          {/* Quick Info Bar */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F2C14E]/15 text-xs text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            <span>
              {searchQuery.trim() ? (
                <>Tìm thấy <strong className="text-[#F2C14E] font-bold">{filteredBooks.length}</strong> kinh sách phù hợp</>
              ) : (
                <>Tổng số <strong className="text-[#F2C14E] font-bold">{filteredBooks.length}</strong> đầu sách Phật học đang hiển thị</>
              )}
            </span>

            <span className="hidden sm:inline text-[#FFE5A3]/60">
              Nhấp vào từng đầu sách để xem tóm tắt &amp; trích dẫn kinh điển
            </span>
          </div>
        </div>

        {/* ── 3. 4-COLUMN BOOK GRID ── */}
        {filteredBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {visibleBooks.map((book) => (
                <BookCard key={book.id} book={book} onSelect={setSelectedBook} />
              ))}
            </div>

            {displayCount < filteredBooks.length && (
              <div className="w-full flex justify-center mt-12">
                <button
                  type="button"
                  onClick={() => setDisplayCount((prev) => prev + 16)}
                  className="px-8 py-3.5 rounded-full bg-[#2C1C11] border border-[#F2C14E]/60 text-[#F2C14E] text-xs md:text-sm font-bold hover:bg-[#F2C14E] hover:text-[#2C1C11] transition-all cursor-pointer shadow-lg uppercase tracking-wider flex items-center gap-2"
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                >
                  <span>XEM THÊM KINHSÁCH (+{filteredBooks.length - displayCount} ĐẦU SÁCH)</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-[#c9b896]/60 text-sm" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Không tìm thấy kinh sách phù hợp với tiêu chí lọc đã chọn. Quý vị vui lòng thử lại từ khóa khác.
          </div>
        )}
      </div>

      {/* ── 4. BOOK DETAIL POPUP MODAL ── */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedBook(null)}
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
                onClick={() => setSelectedBook(null)}
                className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 border border-[#c8aa6e]/40 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Popup Header */}
              <div className="px-6 pt-5 pb-3 flex items-center justify-center border-b border-[#c8aa6e]/30">
                <h3
                  className="text-lg md:text-xl font-normal text-white uppercase tracking-widest text-center"
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                >
                  {selectedBook.category} • THƯ VIỆN KINHSÁCH TÙNG LÂM
                </h3>
              </div>

              {/* 2-Column Content */}
              <div className="flex flex-col sm:flex-row gap-6 p-6">
                {/* Left: Book Cover */}
                <div className="relative w-40 mx-auto sm:mx-0 shrink-0 rounded-xl overflow-hidden border-2 border-[#F2C14E]/50 shadow-2xl self-start bg-[#1A120B] p-2">
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                  />
                </div>

                {/* Right: Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <div>
                    <h2
                      className="text-2xl md:text-3xl font-normal text-[#F2C14E] leading-snug uppercase mb-1"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      {selectedBook.title}
                    </h2>

                    <div className="flex flex-wrap gap-2 text-xs text-[#c9b896] mb-3" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                      <span>Tác giả: <strong className="text-[#FFE5A3]">{selectedBook.author}</strong></span>
                      <span>•</span>
                      <span>NXB: <strong className="text-[#FFE5A3]">{selectedBook.publisher || 'NXB Tôn Giáo'}</strong></span>
                      <span>•</span>
                      <span>{selectedBook.pages} trang</span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gradient-to-r from-[#F2C14E]/60 via-[#F2C14E]/20 to-transparent my-1" style={{ width: '61.8%' }} />

                  <p className="text-xs md:text-sm text-[#D3C0AD] leading-relaxed text-justify" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {selectedBook.description}
                  </p>

                  {selectedBook.quote && (
                    <blockquote
                      className="border-l-2 border-[#F2C14E] bg-[#3a2718]/60 p-3.5 italic text-xs text-[#FFE5A3] rounded-r-lg leading-relaxed mt-2"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      "{selectedBook.quote}"
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
