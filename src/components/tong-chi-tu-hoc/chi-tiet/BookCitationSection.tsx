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
  bookTitle?: string;
  title?: string;
  author?: string;
  coverImage?: string;
  coverPosition?: string;
  description?: string;
  linkUrl?: string;
  pdfUrl?: string;
  pageNumber?: string;
  edition?: string;
}

interface BookCitationProps {
  sourceBook?: SourceBookData | SourceBookData[];
}

export function BookCitationSection({ sourceBook }: BookCitationProps) {
  // Normalize to array
  const rawList: SourceBookData[] = Array.isArray(sourceBook)
    ? sourceBook
    : sourceBook && (sourceBook.bookTitle || sourceBook.title)
    ? [sourceBook]
    : [];

  const list = rawList
    .map((item) => ({
      ...item,
      bookTitle: item.bookTitle || item.title || '',
      linkUrl: item.pdfUrl || item.linkUrl || '/vu-tru-phat-giao/tang-kinh-cac',
    }))
    .filter((item) => item.bookTitle.trim() !== '');

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (list.length === 0) {
    return null;
  }

  const filteredList = searchTerm.trim()
    ? list.filter(
        (b) =>
          b.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : list;

  const INITIAL_COUNT = 6;
  const displayedList = isExpanded || searchTerm.trim() ? filteredList : filteredList.slice(0, INITIAL_COUNT);
  const remainingCount = filteredList.length - INITIAL_COUNT;

  return (
    <section id="trich-nguon-sach" className="scroll-mt-24 max-w-4xl mx-auto px-4 my-10">
      <div
        style={{ fontFamily: "var(--font-montserrat), 'Montserrat', 'UTM Avo', sans-serif" }}
        className="relative rounded-3xl p-5 sm:p-7 md:p-8 bg-[#170C06]/90 border border-[#F2C14E]/30 shadow-[0_15px_45px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden space-y-5"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2C14E]/5 rounded-full blur-3xl pointer-events-none" />

        {/* 🪷 Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2C14E]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/40 flex items-center justify-center text-[#F2C14E] shadow-[0_0_15px_rgba(242,193,78,0.2)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4
                style={{ fontFamily: "'UTM Niagara', var(--font-playfair), 'Playfair Display', serif" }}
                className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#FFDE59] drop-shadow-sm"
              >
                NGUỒN THAM KHẢO
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {list.length > 4 && (
              <div className="relative w-48 sm:w-56">
                <Search className="w-3.5 h-3.5 text-[#F2C14E]/70 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm tác phẩm..."
                  className="w-full pl-8 pr-3 py-1 bg-[#1C120A] border border-[#F2C14E]/30 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/40 focus:outline-none focus:border-[#F2C14E]"
                />
              </div>
            )}
            <div className="px-3 py-1 rounded-full bg-[#2A160C] border border-[#F2C14E]/30 text-[#FFE5A3] text-xs font-semibold shadow-inner whitespace-nowrap">
              {list.length} Tác phẩm
            </div>
          </div>
        </div>

        {/* 📚 Multi-Book Grid Cards (2 columns on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {displayedList.map((item, idx) => {
            const isExternal = Boolean(
              item.linkUrl &&
                (item.linkUrl.startsWith('http://') || item.linkUrl.startsWith('https://'))
            );

            return (
              <div
                key={idx}
                className="group relative rounded-2xl p-4 bg-[#231208]/90 border border-[#F2C14E]/25 hover:border-[#F2C14E]/70 transition-all duration-300 flex items-start gap-4 hover:shadow-[0_8px_30px_rgba(242,193,78,0.18)] hover:-translate-y-0.5"
              >
                {/* Book Cover Image */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border border-[#F2C14E]/35 shadow-md flex-shrink-0 bg-black/40">
                  <img
                    src={item.coverImage || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp'}
                    alt={item.bookTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: item.coverPosition || 'center' }}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1 space-y-1">
                  <h5
                    style={{ fontFamily: "'UTM Niagara', var(--font-playfair), 'Playfair Display', serif" }}
                    className="text-base sm:text-lg font-bold text-[#FFDE59] uppercase tracking-wide line-clamp-1 group-hover:text-amber-300 transition-colors"
                    title={item.bookTitle}
                  >
                    {item.bookTitle}
                  </h5>

                  {item.author && (
                    <p className="text-xs text-[#FFE5A3]/90">
                      <span className="text-[#c9b896]/70">Tác giả: </span>
                      <span className="text-[#F2C14E] font-bold">{item.author}</span>
                      {item.pageNumber && (
                        <span className="text-[#c9b896]/70 ml-1">({item.pageNumber})</span>
                      )}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-xs text-[#FFE5A3]/65 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Action / Read Button */}
                <Link
                  href={item.linkUrl}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="p-2.5 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/40 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#170C06] transition-all duration-200 flex-shrink-0 shadow-sm self-center group/btn"
                  title="Mở xem ấn phẩm số / Tàng Kinh Các"
                >
                  <BookOpen className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Expand / Collapse Button */}
        {list.length > INITIAL_COUNT && !searchTerm.trim() && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-5 py-2 rounded-xl bg-[#2A160C] hover:bg-[#3A2214] border border-[#F2C14E]/50 text-[#FFE5A3] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow hover:scale-105"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-[#F2C14E]" />
                  <span>Thu gọn danh sách</span>
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
