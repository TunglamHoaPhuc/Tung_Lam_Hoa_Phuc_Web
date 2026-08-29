'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, X } from 'lucide-react';

interface TuKhoaPopup {
  keyword: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  imagePosition?: string;
  linkUrl?: string;
}

interface PropsModal {
  activePhotoIndex: number | null;
  photoGallery?: any[];
  onClosePhotoModal: () => void;
  onPrevPhoto: () => void;
  onNextPhoto: () => void;
  onSelectPhotoIndex: (index: number) => void;
  activeKeywordPopup: TuKhoaPopup | null;
  onCloseKeywordPopup: () => void;
}

export function DetailModal({
  activePhotoIndex,
  photoGallery,
  onClosePhotoModal,
  onPrevPhoto,
  onNextPhoto,
  onSelectPhotoIndex,
  activeKeywordPopup,
  onCloseKeywordPopup,
}: PropsModal) {
  const currentPhoto =
    activePhotoIndex !== null && photoGallery && photoGallery[activePhotoIndex]
      ? photoGallery[activePhotoIndex]
      : null;

  const rawLink = activeKeywordPopup?.linkUrl?.trim() || '';
  const hasLink = Boolean(rawLink !== '' && rawLink !== '#');
  const isExternal = rawLink.startsWith('http://') || rawLink.startsWith('https://');

  return (
    <>
      {/* ==================== POPUP BỘ SƯ TẬP ẢNH ==================== */}
      {currentPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-[#5a3e21] border border-[#c8aa6e]/80 rounded-2xl max-w-2xl w-full shadow-2xl text-left text-[#e3d2c1] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#c8aa6e]/50 px-6 py-4 bg-[#4a321a]">
              <h3
                style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                className="text-lg sm:text-xl font-bold text-[#ffde59] uppercase tracking-wider mx-auto pl-6"
              >
                BỘ SƯ TẬP ẢNH TƯ LIỆU
              </h3>
              <button
                type="button"
                onClick={onClosePhotoModal}
                className="border border-[#c8aa6e]/60 rounded-lg p-1.5 text-[#ffde59] hover:text-white hover:bg-[#c8aa6e]/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative aspect-[4/3] w-full max-h-[380px] rounded-xl overflow-hidden border border-[#c8aa6e]/40 shadow-inner bg-black/40 flex items-center justify-center">
                <img
                  src={currentPhoto.imageUrl || currentPhoto.url || '/images/toan-canh-chua.jpg'}
                  alt={currentPhoto.title || 'Ảnh tư liệu'}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={onPrevPhoto}
                    className="border border-[#c8aa6e] bg-[#3a2613] hover:bg-[#ffde59] text-[#ffde59] hover:text-[#2c1c11] px-4 py-2 rounded-xl transition-all font-bold flex items-center justify-center cursor-pointer"
                  >
                    &larr;
                  </button>

                  <div className="flex items-center gap-1.5">
                    {photoGallery?.map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        onClick={() => onSelectPhotoIndex(dotIdx)}
                        className={`cursor-pointer rounded-full transition-all ${
                          dotIdx === activePhotoIndex
                            ? 'w-3 h-3 bg-[#ffde59] border border-[#ffde59]'
                            : 'w-2 h-2 bg-[#c8aa6e]/40 hover:bg-[#c8aa6e]'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={onNextPhoto}
                    className="border border-[#c8aa6e] bg-[#3a2613] hover:bg-[#ffde59] text-[#ffde59] hover:text-[#2c1c11] px-4 py-2 rounded-xl transition-all font-bold flex items-center justify-center cursor-pointer"
                  >
                    &rarr;
                  </button>
                </div>

                <div className="bg-[#4a321a]/80 p-4 rounded-xl border border-[#c8aa6e]/30 space-y-1">
                  <h4 className="font-bold text-[#ffde59] text-base">{currentPhoto.title}</h4>
                  {currentPhoto.noiDung && (
                    <p className="text-xs sm:text-sm text-[#e3d2c1]/90 leading-relaxed font-sans">
                      {currentPhoto.noiDung}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POPUP CHÚ THÍCH TỪ KHÓA ==================== */}
      {activeKeywordPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={onCloseKeywordPopup}
        >
          <div
            className="relative bg-[#3A2718]/95 border-2 border-[#F2C14E]/70 p-6 sm:p-7 rounded-3xl max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-md text-left space-y-4 transition-all animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {/* NÚT ĐÓNG */}
            <button
              type="button"
              onClick={onCloseKeywordPopup}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 border border-[#F2C14E]/40 text-[#FFE5A3] hover:text-black hover:bg-[#F2C14E] flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* HEADER: ẢNH + TIÊU ĐỀ */}
            <div className="flex items-center gap-4 sm:gap-5 pr-6 pt-1">
              {activeKeywordPopup.imageUrl && (
                <div className="relative w-24 sm:w-28 h-24 sm:h-28 flex-shrink-0 rounded-2xl overflow-hidden border border-[#F2C14E]/60 shadow-[0_0_20px_rgba(242,193,78,0.2)] bg-black">
                  <img
                    src={activeKeywordPopup.imageUrl}
                    alt={activeKeywordPopup.title}
                    style={{ objectPosition: activeKeywordPopup.imagePosition || 'center 50%' }}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                    }}
                  />
                </div>
              )}

              <div className="space-y-1 min-w-0 flex-1">
                {/* Chỉ hiện badge nếu keyword khác biệt với title */}
                {activeKeywordPopup.keyword &&
                  activeKeywordPopup.title &&
                  activeKeywordPopup.keyword.trim().toLowerCase() !== activeKeywordPopup.title.trim().toLowerCase() && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#F2C14E] text-[10px] font-bold border border-[#F2C14E]/40 uppercase tracking-wider inline-block">
                      {activeKeywordPopup.keyword}
                    </span>
                  )}

                {activeKeywordPopup.subtitle && (
                  <div className="text-[11px] text-[#FFE5A3]/90 font-medium tracking-wide">
                    {activeKeywordPopup.subtitle}
                  </div>
                )}

                <h3
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-2xl sm:text-3xl text-[#ffde59] uppercase leading-tight tracking-wide drop-shadow-md"
                >
                  {activeKeywordPopup.title || activeKeywordPopup.keyword}
                </h3>
              </div>
            </div>

            {/* ĐƯỜNG KẺ GRADIENT VÀNG KIM 1 BÊN */}
            <div className="w-full py-1">
              <div className="h-[1.5px] w-full bg-gradient-to-r from-[#F2C14E] via-[#F2C14E]/50 to-transparent" />
            </div>

            {/* MÔ TẢ CHI TIẾT */}
            <p className="text-xs sm:text-sm text-[#f7e7ce] leading-relaxed font-normal text-justify whitespace-pre-line">
              {activeKeywordPopup.description}
            </p>

            {/* NÚT XEM THÊM (CHỈ HIỆN KHI CÓ LINK) */}
            {hasLink && (
              <div className="pt-2">
                <Link
                  href={rawLink}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#d4a029] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#140D07] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(242,193,78,0.35)] hover:scale-[1.02] group cursor-pointer"
                >
                  <span>Xem thêm chi tiết</span>
                  {isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
