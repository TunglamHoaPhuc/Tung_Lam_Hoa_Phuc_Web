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
import { getImageUrl } from '@/utils/image';
import { BookFlipModal } from './BookFlipModal';

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
  const [selectedBookForFlip, setSelectedBookForFlip] = useState<SourceBookData | null>(null);

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
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
        className="relative rounded-3xl p-5 sm:p-7 md:p-8 bg-[#170C06]/90 border border-[#F2C14E]/30 shadow-[0_15px_45px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden space-y-6"
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
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-2xl sm:text-3xl font-normal uppercase tracking-wider text-[#FFDE59] drop-shadow-sm"
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
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                />
              </div>
            )}
            <div 
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="px-3 py-1 rounded-full bg-[#2A160C] border border-[#F2C14E]/30 text-[#FFE5A3] text-xs font-semibold shadow-inner whitespace-nowrap"
            >
              {list.length} Tác phẩm
            </div>
          </div>
        </div>

        {/* 📚 NỘI DUNG SÁCH THAM KHẢO */}
        {displayedList.length === 1 ? (
          /* 🌟 CHẾ ĐỘ HIỂN THỊ FULL KHI CHỈ CÓ 1 SÁCH (KHÔNG GIẢN LƯỢC NỘI DUNG, FONT UTM AVO) */
          <div className="rounded-2xl p-5 sm:p-7 bg-[#231208]/90 border border-[#F2C14E]/40 hover:border-[#F2C14E] transition-all duration-300 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl hover:shadow-[0_10px_35px_rgba(242,193,78,0.2)]">
            {/* Book Cover Image lớn, sắc nét */}
            <div 
              onClick={() => setSelectedBookForFlip(displayedList[0])}
              className="relative w-32 h-44 sm:w-36 sm:h-48 md:w-44 md:h-60 rounded-2xl overflow-hidden border-2 border-[#F2C14E]/50 shadow-2xl shrink-0 bg-black/40 group cursor-pointer"
            >
              <img
                src={getImageUrl(displayedList[0].coverImage) || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp'}
                alt={displayedList[0].bookTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ objectPosition: displayedList[0].coverPosition || 'center' }}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-[#FFDE59] backdrop-blur-xs">
                <BookOpen className="w-5 h-5 text-[#F2C14E]" />
                <span style={{ fontFamily: "'UTM Avo', sans-serif" }}>Mở Xem Lật Trang</span>
              </div>
            </div>

            {/* Chi tiết nội dung đầy đủ (KHÔNG GIẢN LƯỢC, FONT UTM AVO) */}
            <div className="flex-1 min-w-0 space-y-3 text-left">
              <div className="flex items-start justify-between gap-3">
                <h4
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFDE59] uppercase tracking-wide leading-snug drop-shadow-sm flex-1"
                >
                  {displayedList[0].bookTitle}
                </h4>

                {/* Biểu tượng mở xem sách nhỏ gọn */}
                <button
                  type="button"
                  onClick={() => setSelectedBookForFlip(displayedList[0])}
                  className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] hover:from-[#FFDE59] hover:to-[#F2C14E] text-[#1A120B] shadow-md hover:shadow-[0_0_15px_rgba(242,193,78,0.5)] transition-all hover:scale-110 flex-shrink-0 cursor-pointer"
                  title="Mở xem sách lật trang 3D"
                  aria-label="Mở xem sách lật trang 3D"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </div>

              {displayedList[0].author && (
                <p 
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs sm:text-sm text-[#FFE5A3]"
                >
                  <span className="text-[#c9b896]/70">Tác giả: </span>
                  <strong className="text-[#F2C14E] font-bold text-sm sm:text-base">
                    {displayedList[0].author}
                  </strong>
                  {displayedList[0].pageNumber && (
                    <span className="text-[#c9b896]/80 ml-1.5 font-medium">({displayedList[0].pageNumber})</span>
                  )}
                </p>
              )}

              {displayedList[0].description && (
                <p 
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-xs sm:text-sm text-[#FFE5A3]/90 leading-relaxed sm:leading-loose text-justify [text-align-last:left] whitespace-pre-line"
                >
                  {displayedList[0].description}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* 📚 Multi-Book Grid Cards (2 columns on desktop) */
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
                  <div 
                    onClick={() => setSelectedBookForFlip(item)}
                    className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border border-[#F2C14E]/35 shadow-md flex-shrink-0 bg-black/40 cursor-pointer"
                  >
                    <img
                      src={getImageUrl(item.coverImage) || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp'}
                      alt={item.bookTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: item.coverPosition || 'center' }}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 pr-1 space-y-1">
                    <h5
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className="text-sm sm:text-base font-bold text-[#FFDE59] uppercase tracking-wide line-clamp-1 group-hover:text-amber-300 transition-colors"
                      title={item.bookTitle}
                    >
                      {item.bookTitle}
                    </h5>

                    {item.author && (
                      <p 
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-xs text-[#FFE5A3]/90"
                      >
                        <span className="text-[#c9b896]/70">Tác giả: </span>
                        <span className="text-[#F2C14E] font-bold">{item.author}</span>
                        {item.pageNumber && (
                          <span className="text-[#c9b896]/70 ml-1">({item.pageNumber})</span>
                        )}
                      </p>
                    )}

                    {item.description && (
                      <p 
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-xs text-[#FFE5A3]/75 line-clamp-2 leading-relaxed"
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Action / Read Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedBookForFlip(item)}
                    className="p-2.5 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/40 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#170C06] transition-all duration-200 flex-shrink-0 shadow-sm self-center group/btn cursor-pointer"
                    title="Mở xem sách lật trang 3D"
                  >
                    <BookOpen className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Expand / Collapse Button */}
        {list.length > INITIAL_COUNT && !searchTerm.trim() && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-5 py-2 rounded-xl bg-[#2A160C] hover:bg-[#3A2214] border border-[#F2C14E]/50 text-[#FFE5A3] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow hover:scale-105"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
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

      {/* 📖 MODAL SÁCH LẬT TRANG 3D VỚI CTRL + LĂN CHUỘT ZOOM VÀO VỊ TRÍ CON TRỎ */}
      <BookFlipModal
        isOpen={selectedBookForFlip !== null}
        onClose={() => setSelectedBookForFlip(null)}
        book={selectedBookForFlip}
      />
    </section>
  );
}

