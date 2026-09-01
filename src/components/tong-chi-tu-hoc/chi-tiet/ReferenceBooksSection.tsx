'use client';

import React from 'react';
import { BookOpen, ExternalLink, Layers } from 'lucide-react';

export interface ReferenceBookItem {
  id?: string;
  title: string;
  subtitle?: string;
  author?: string;
  description?: string;
  coverImage?: string;
  pdfUrl?: string;
  linkUrl?: string;
}

interface ReferenceBooksSectionProps {
  books?: ReferenceBookItem[];
}

export function ReferenceBooksSection({ books = [] }: ReferenceBooksSectionProps) {
  if (!books || books.length === 0) return null;

  return (
    <div className="my-12 w-full max-w-4xl mx-auto">
      <div className="rounded-3xl border border-[#F2C14E]/35 bg-[#170C06]/90 backdrop-blur-md p-5 sm:p-7 md:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.85)] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2C14E]/5 rounded-full blur-3xl pointer-events-none" />

        {/* 🪷 Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#F2C14E]/15 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/40 flex items-center justify-center text-[#F2C14E] shadow-[0_0_15px_rgba(242,193,78,0.2)]">
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

          <div className="px-3.5 py-1 rounded-full bg-[#2A160C] border border-[#F2C14E]/30 text-[#FFE5A3] text-xs sm:text-sm font-medium shadow-inner">
            {books.length} Tác phẩm
          </div>
        </div>

        {/* 📚 Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {books.map((book, idx) => {
            const targetLink = book.pdfUrl || book.linkUrl || '/vu-tru-phat-giao/tang-kinh-cac';
            const isClickable = Boolean(book.pdfUrl || book.linkUrl);

            return (
              <div
                key={book.id || idx}
                className="group relative rounded-2xl p-4 bg-[#231208]/90 border border-[#F2C14E]/25 hover:border-[#F2C14E]/70 transition-all duration-300 flex items-start gap-4 hover:shadow-[0_8px_30px_rgba(242,193,78,0.18)] hover:-translate-y-0.5"
              >
                {/* Book Cover */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border border-[#F2C14E]/35 shadow-md flex-shrink-0 bg-black/40">
                  <img
                    src={book.coverImage || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0 pr-2">
                  <h5
                    style={{ fontFamily: "'UTM Niagara', var(--font-playfair), 'Playfair Display', serif" }}
                    className="text-base sm:text-lg font-bold text-[#FFDE59] uppercase tracking-wide line-clamp-1 group-hover:text-amber-300 transition-colors"
                    title={book.title}
                  >
                    {book.title}
                  </h5>

                  {book.author && (
                    <p className="text-xs text-[#FFE5A3]/90 mt-1">
                      <span className="text-[#F2C14E] font-semibold">Tác giả: </span>
                      <span>{book.author}</span>
                    </p>
                  )}

                  {book.description && (
                    <p className="text-xs text-[#FFE5A3]/65 mt-1.5 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  )}
                </div>

                {/* Action / Read Button */}
                {isClickable ? (
                  <a
                    href={targetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/40 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#170C06] transition-all duration-200 flex-shrink-0 shadow-sm self-center group/btn"
                    title="Mở xem tài liệu / Ebook Tàng Kinh Các"
                  >
                    <BookOpen className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                  </a>
                ) : (
                  <div
                    className="p-2.5 rounded-xl bg-[#F2C14E]/10 border border-[#F2C14E]/20 text-[#F2C14E]/60 flex-shrink-0 shadow-sm self-center"
                    title="Ấn phẩm lưu hành Tàng Kinh Các"
                  >
                    <BookOpen className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
