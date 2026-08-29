'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  BookMarked,
  Layers,
} from 'lucide-react';

export interface SourceBookData {
  bookTitle: string;
  author?: string;
  coverImage?: string;
  coverPosition?: string;
  description?: string;
  linkUrl?: string;
  pageNumber?: string; // Số trang, chương trích dẫn
  edition?: string; // Năm xuất bản, nhà xuất bản
}

interface BookCitationProps {
  sourceBook?: SourceBookData | SourceBookData[];
}

export function BookCitationSection({ sourceBook }: BookCitationProps) {
  // Normalize to array
  const rawList: SourceBookData[] = Array.isArray(sourceBook)
    ? sourceBook
    : sourceBook && sourceBook.bookTitle
    ? [sourceBook]
    : [];

  const list = rawList.filter((item) => item && item.bookTitle && item.bookTitle.trim() !== '');

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (list.length === 0) {
    return null;
  }

  // Single Book Display (Trường hợp chỉ có 1 cuốn sách)
  if (list.length === 1) {
    const single = list[0];
    const hasLink = Boolean(single.linkUrl && single.linkUrl.trim() !== '' && single.linkUrl !== '#');
    const isExternal = Boolean(
      single.linkUrl &&
        (single.linkUrl.startsWith('http://') || single.linkUrl.startsWith('https://'))
    );

    return (
      <section id="trich-nguon-sach" className="scroll-mt-24 max-w-2xl mx-auto px-4 my-6">
        <div
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#22150C] via-[#2A190F] to-[#22150C] border border-[#F2C14E]/40 shadow-[0_6px_25px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden"
        >
          {/* Top Header Badge */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#F2C14E]/20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#4A321D] border border-[#F2C14E]/60 flex items-center justify-center text-[#ffde59] shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wider">
                NGUỒN THAM KHẢO
              </span>
            </div>
          </div>

          {/* Main Content: Square Cover + Info */}
          <div className="flex items-start gap-4">
            {single.coverImage && (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-xl overflow-hidden border border-[#F2C14E]/60 shadow-md shrink-0 bg-black/60 group">
                <img
                  src={single.coverImage}
                  alt={single.bookTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: single.coverPosition || 'center' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                  }}
                />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-xl sm:text-2xl text-[#ffde59] uppercase tracking-wider font-normal leading-tight truncate"
                >
                  {single.bookTitle}
                </h3>
                {hasLink && (
                  <Link
                    href={single.linkUrl!}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#140D07] transition-all shadow-sm hover:scale-105 cursor-pointer shrink-0"
                    title="Xem chi tiết tác phẩm"
                  >
                    <BookOpen className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {single.author && (
                <div className="text-xs text-[#FFE5A3]/90">
                  <span className="text-[#c9b896]/70">Tác giả: </span>
                  <span className="text-[#F2C14E] font-bold">{single.author}</span>
                </div>
              )}

              {single.description && (
                <p className="text-xs text-[#e3d2c1]/85 leading-relaxed font-normal line-clamp-2">
                  {single.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Multi-Book Display (Trường hợp có từ 2 đến HÀNG CHỤC TRÍCH DẪN)
  const filteredList = searchTerm.trim()
    ? list.filter(
        (b) =>
          b.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : list;

  // Giới hạn hiển thị ban đầu: 4 mục, bấm "Xem thêm" mở toàn bộ
  const INITIAL_COUNT = 4;
  const displayedList = isExpanded || searchTerm.trim() ? filteredList : filteredList.slice(0, INITIAL_COUNT);
  const remainingCount = filteredList.length - INITIAL_COUNT;

  return (
    <section id="trich-nguon-sach" className="scroll-mt-24 max-w-3xl mx-auto px-4 my-6">
      <div
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
        className="relative rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-[#22150C] via-[#2A190F] to-[#22150C] border border-[#F2C14E]/40 shadow-[0_6px_25px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden space-y-4"
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2C14E]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4A321D] border border-[#F2C14E]/60 flex items-center justify-center text-[#ffde59] shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider">
                  NGUỒN THAM KHẢO
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#ffde59] text-[10px] font-bold border border-[#F2C14E]/40 font-mono">
                  {list.length} Tác phẩm
                </span>
              </div>
            </div>
          </div>

          {/* Search bar when many items */}
          {list.length > 3 && (
            <div className="relative w-full sm:w-56">
              <Search className="w-3 h-3 text-[#F2C14E] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên sách / tác giả..."
                className="w-full pl-7 pr-3 py-1 bg-[#1C120A] border border-[#F2C14E]/30 rounded-lg text-xs text-[#FFE5A3] placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
              />
            </div>
          )}
        </div>

        {/* Multi-Book Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedList.map((item, idx) => {
            const hasLink = Boolean(item.linkUrl && item.linkUrl.trim() !== '' && item.linkUrl !== '#');
            const isExternal = Boolean(
              item.linkUrl &&
                (item.linkUrl.startsWith('http://') || item.linkUrl.startsWith('https://'))
            );

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#1C120A]/85 border border-[#F2C14E]/30 hover:border-[#F2C14E] transition-all hover:scale-[1.01] flex gap-3 group shadow-md items-start"
              >
                {/* Book Index / Square Cover */}
                {item.coverImage ? (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-lg overflow-hidden border border-[#F2C14E]/40 bg-black shrink-0">
                    <img
                      src={item.coverImage}
                      alt={item.bookTitle}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-lg bg-[#2A1D14] border border-[#F2C14E]/20 flex items-center justify-center text-[#F2C14E]/40 shrink-0">
                    <BookMarked className="w-5 h-5" />
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                      className="text-xl text-[#ffde59] uppercase leading-tight tracking-wide truncate"
                    >
                      {item.bookTitle}
                    </h4>
                    {hasLink && (
                      <Link
                        href={item.linkUrl!}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#F2C14E] hover:bg-[#ffde59] text-[#140D07] transition-all shadow-sm shrink-0"
                        title="Xem chi tiết tác phẩm"
                      >
                        <BookOpen className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {item.author && (
                    <div className="text-[11px] text-[#FFE5A3]/90">
                      <span className="text-[#c9b896]/70">Tác giả: </span>
                      <span className="text-[#F2C14E] font-bold">{item.author}</span>
                      {item.pageNumber && (
                        <span className="text-[#c9b896]/70 ml-1">({item.pageNumber})</span>
                      )}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-xs text-[#e3d2c1]/80 line-clamp-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expand / Collapse Button when more than INITIAL_COUNT items */}
        {list.length > INITIAL_COUNT && !searchTerm.trim() && (
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-5 py-2 rounded-xl bg-[#3A2718] hover:bg-[#4A3220] border border-[#F2C14E]/60 text-[#FFE5A3] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow hover:scale-105"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Thu gọn</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Xem thêm {remainingCount} tác phẩm khác</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
