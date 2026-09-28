'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, BookOpen, Images, ExternalLink, X, ArrowUpRight } from 'lucide-react';
import { getImageUrl } from '@/utils/image';
import { SourceBookData } from './BookCitationSection';
import { AnhTuLieu } from './PhotoGallery';

interface PropsTaiNguyenLienQuanCompact {
  videoBlock?: {
    title?: string;
    subtitle?: string;
    description?: string;
    videoUrl?: string;
  };
  sourceBook?: SourceBookData | SourceBookData[];
  photoGallery?: AnhTuLieu[];
  heroBanner?: string;
  onSelectPhoto?: (idx: number) => void;
}

function formatYoutubeEmbed(url?: string): string {
  if (!url) return 'https://www.youtube.com/embed/MKt_sLwxmNU?start=5547';
  if (url.includes('youtube.com/embed/')) return url;

  try {
    if (url.includes('watch?v=')) {
      const parsed = new URL(url);
      const v = parsed.searchParams.get('v');
      const t = parsed.searchParams.get('t')?.replace('s', '');
      if (v) {
        return `https://www.youtube.com/embed/${v}${t ? `?start=${t}` : ''}`;
      }
    }
    if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')[1]?.split('?');
      const v = parts?.[0];
      const params = parts?.[1] ? new URLSearchParams(parts[1]) : null;
      const t = params?.get('t')?.replace('s', '');
      if (v) {
        return `https://www.youtube.com/embed/${v}${t ? `?start=${t}` : ''}`;
      }
    }
  } catch (e) {}

  return url;
}

export function TaiNguyenLienQuanCompact({
  videoBlock,
  sourceBook,
  photoGallery = [],
  heroBanner,
  onSelectPhoto,
}: PropsTaiNguyenLienQuanCompact) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Chuẩn hóa sách tham khảo
  const books: SourceBookData[] = Array.isArray(sourceBook)
    ? sourceBook
    : sourceBook && (sourceBook.bookTitle || sourceBook.title)
    ? [sourceBook]
    : [];

  const mainBook: SourceBookData = books[0] || {
    title: 'KHUYẾN PHÁT BỒ ĐỀ TÂM GIẢNG LUẬN',
    author: 'Đại Đức Thích Tâm Hòa',
    description: 'Giảng giải chi tiết về phương pháp phát khởi và nuôi dưỡng Bồ Đề tâm kiên cố.',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp',
    linkUrl: '/vu-tru-phat-giao/tang-kinh-cac',
  };

  const videoUrl = videoBlock?.videoUrl || 'https://www.youtube.com/watch?v=MKt_sLwxmNU&t=5547s';
  const videoEmbed = formatYoutubeEmbed(videoUrl);
  const videoTitle = videoBlock?.title || 'Pháp Thoại Ý Nghĩa Bồ Đề Tâm';
  const videoThumb = getImageUrl(heroBanner) || 'https://admin.tunglamhoaphuc.com/wp-content/uploads/2026/07/bg-chua.jpg';

  const previewPhotos = photoGallery.slice(0, 4);

  return (
    <section id="tai-nguyen-lien-quan" className="scroll-mt-28 py-10 w-full relative">
      {/* ── TIÊU ĐỀ KHỐI TÀI NGUYÊN HOÀNG KIM TRANG NGHIÊM ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A2616] border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold uppercase tracking-widest mb-2 shadow-xs">
          <span>🪷</span>
          <span>Knowledge Hub</span>
        </div>
        <h3
          style={{ fontFamily: "'UTM Niagara', var(--font-playfair), 'Playfair Display', serif" }}
          className="text-3xl sm:text-4xl font-bold text-[#FFDE59] uppercase tracking-wide drop-shadow-md"
        >
          TÀI NGUYÊN LIÊN QUAN
        </h3>
        <p className="text-xs sm:text-sm text-[#FFE5A3]/80 italic mt-1.5 max-w-xl mx-auto">
          Tư liệu trợ duyên bồi đắp và soi sáng thêm cho bài học Bồ Đề tâm
        </p>
        <div className="w-28 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent mx-auto mt-3" />
      </div>

      {/* ── 3 CARD NGĂN KÉO NGANG NHỎ GỌN, TINH TẾ ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: VIDEO PHÁP THOẠI */}
        <div className="rounded-2xl bg-gradient-to-b from-[#2A180E] to-[#1A0E07] border border-[#F2C14E]/35 hover:border-[#F2C14E] transition-all p-4 flex flex-col justify-between group shadow-lg hover:shadow-[0_8px_30px_rgba(242,193,78,0.18)]">
          <div>
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 border border-[#F2C14E]/30 bg-black/60 group-hover:border-[#F2C14E]/60 transition-colors">
              <img
                src={videoThumb}
                alt={videoTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#F2C14E] text-[#1A120B] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Bấm để phát video"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-[#FFE5A3]">
                <span className="bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">Pháp Thoại</span>
                <span className="bg-[#8B4513]/90 text-[#FFDE59] px-2 py-0.5 rounded-md font-semibold">Bồ Đề Tâm</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5 text-xs text-[#F2C14E] font-bold uppercase tracking-wider">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Video Pháp Thoại</span>
            </div>
            <h4
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-sm sm:text-base font-bold text-[#FFE5A3] group-hover:text-[#FFDE59] transition-colors line-clamp-2 leading-snug"
            >
              {videoTitle}
            </h4>
            <p className="text-xs text-[#FFE5A3]/75 mt-1.5 line-clamp-2 italic">
              {videoBlock?.description || 'Lắng nghe Thầy giảng giải sâu sắc về tâm hạnh bồ đề và con đường tự giác giác tha.'}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-[#F2C14E]/20 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] hover:text-[#FFDE59] transition-colors cursor-pointer"
            >
              <span>Xem video</span>
              <Play className="w-3 h-3 fill-current" />
            </button>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#FFE5A3]/60 hover:text-[#F2C14E] inline-flex items-center gap-1 transition-colors"
              title="Mở trên YouTube"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* CARD 2: KINH SÁCH ẤN PHẨM TÀNG KINH CÁC */}
        <div className="rounded-2xl bg-gradient-to-b from-[#2A180E] to-[#1A0E07] border border-[#F2C14E]/35 hover:border-[#F2C14E] transition-all p-4 flex flex-col justify-between group shadow-lg hover:shadow-[0_8px_30px_rgba(242,193,78,0.18)]">
          <div>
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 border border-[#F2C14E]/30 bg-black/40 p-2 flex items-center justify-center group-hover:border-[#F2C14E]/60 transition-colors">
              <div className="h-full flex items-center justify-center gap-3">
                <img
                  src={getImageUrl(mainBook.coverImage) || '/images/sach-mau.jpg'}
                  alt={mainBook.bookTitle || mainBook.title || 'Sách tham khảo'}
                  className="h-full w-auto object-contain rounded-md shadow-md border border-[#F2C14E]/40 group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="text-left text-xs space-y-1">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-[#F2C14E]/20 text-[#FFDE59] text-[10px] font-bold uppercase">
                    Tàng Kinh Các
                  </span>
                  <p className="text-[11px] text-[#FFE5A3]/90 font-medium line-clamp-2">
                    {mainBook.author || 'Đại Đức Thích Tâm Hòa'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5 text-xs text-[#F2C14E] font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ấn Phẩm & Kinh Sách</span>
            </div>
            <h4
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-sm sm:text-base font-bold text-[#FFE5A3] group-hover:text-[#FFDE59] transition-colors line-clamp-2 leading-snug"
            >
              {mainBook.bookTitle || mainBook.title}
            </h4>
            <p className="text-xs text-[#FFE5A3]/75 mt-1.5 line-clamp-2 italic">
              {mainBook.description || 'Tài liệu kinh sách tham khảo chính thống tại kho tư liệu Tàng Kinh Các.'}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-[#F2C14E]/20 flex items-center justify-between">
            <Link
              href={mainBook.pdfUrl || mainBook.linkUrl || '/vu-tru-phat-giao/tang-kinh-cac'}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] hover:text-[#FFDE59] transition-colors"
            >
              <span>Đọc Ebook / PDF</span>
              <span className="text-sm">📖</span>
            </Link>
            <Link
              href="/vu-tru-phat-giao/tang-kinh-cac"
              className="text-xs text-[#FFE5A3]/60 hover:text-[#F2C14E] inline-flex items-center gap-1 transition-colors"
              title="Vào kho Tàng Kinh Các"
            >
              <span>Tàng Kinh Các</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* CARD 3: BỘ ẢNH TƯ LIỆU */}
        <div className="rounded-2xl bg-gradient-to-b from-[#2A180E] to-[#1A0E07] border border-[#F2C14E]/35 hover:border-[#F2C14E] transition-all p-4 flex flex-col justify-between group shadow-lg hover:shadow-[0_8px_30px_rgba(242,193,78,0.18)]">
          <div>
            <div
              onClick={() => onSelectPhoto && onSelectPhoto(0)}
              className="relative aspect-video rounded-xl overflow-hidden mb-3.5 border border-[#F2C14E]/30 bg-black/40 grid grid-cols-2 gap-1 p-1 cursor-pointer group-hover:border-[#F2C14E]/60 transition-colors"
            >
              {previewPhotos.length > 0 ? (
                previewPhotos.map((p, idx) => (
                  <div key={idx} className="relative h-full overflow-hidden rounded">
                    <img
                      src={getImageUrl(p.imageUrl || p.url) || '/images/toan-canh-chua.jpg'}
                      alt={p.title || `Ảnh tư liệu ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex items-center justify-center h-full">
                  <img
                    src={videoThumb}
                    alt="Bộ sưu tập ảnh"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-[#FFDE59] text-[11px] font-bold border border-[#F2C14E]/50 shadow-md">
                  +{photoGallery.length || 12} hình ảnh
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5 text-xs text-[#F2C14E] font-bold uppercase tracking-wider">
              <Images className="w-3.5 h-3.5" />
              <span>Ảnh Tư Liệu Tu Học</span>
            </div>
            <h4
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-sm sm:text-base font-bold text-[#FFE5A3] group-hover:text-[#FFDE59] transition-colors line-clamp-2 leading-snug"
            >
              Hình Ảnh Huân Tập & Sinh Hoạt
            </h4>
            <p className="text-xs text-[#FFE5A3]/75 mt-1.5 line-clamp-2 italic">
              Khoảnh khắc trang nghiêm trong các thời khóa tu tập nuôi dưỡng Bồ Đề tâm tại Tùng Lâm Hòa Phúc.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-[#F2C14E]/20 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSelectPhoto && onSelectPhoto(0)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2C14E] hover:text-[#FFDE59] transition-colors cursor-pointer"
            >
              <span>Xem bộ sưu tập</span>
              <Images className="w-3 h-3" />
            </button>
            <span className="text-xs text-[#FFE5A3]/60">Sắc nét HD</span>
          </div>
        </div>
      </div>

      {/* ── MODAL VIDEO PLAYER PHÓNG TO NỀN ĐEN ── */}
      {isVideoModalOpen && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#1A120B] rounded-2xl border-2 border-[#F2C14E]/70 overflow-hidden shadow-[0_0_50px_rgba(242,193,78,0.3)]"
          >
            <div className="p-3 bg-[#24170D] border-b border-[#F2C14E]/30 flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#FFDE59] truncate">{videoTitle}</h4>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full">
              <iframe
                src={`${videoEmbed}?autoplay=1`}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
