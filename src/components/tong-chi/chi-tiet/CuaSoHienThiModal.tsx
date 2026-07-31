'use client';

import React from 'react';

interface TuKhoaPopup {
  keyword: string;
  title: string;
  description: string;
  imageUrl?: string;
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

export function CuaSoHienThiModal({
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative aspect-[4/3] w-full max-h-[380px] rounded-xl overflow-hidden border border-[#c8aa6e]/40 shadow-inner bg-black/40 flex items-center justify-center">
                <img
                  src={currentPhoto.imageUrl || currentPhoto.url}
                  alt={currentPhoto.title || 'Ảnh tư liệu'}
                  className="w-full h-full object-contain"
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

                <h4
                  style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                  className="text-lg sm:text-xl font-bold text-[#ffde59] text-center uppercase tracking-wide px-2"
                >
                  {currentPhoto.title || currentPhoto.caption || 'ẢNH TƯ LIỆU TÙNG LÂM HÒA PHÚC'}
                </h4>

                <div className="grid grid-cols-12 gap-4 pt-2 border-t border-[#c8aa6e]/30 text-center items-center">
                  <div className="col-span-5 space-y-1">
                    <span
                      style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                      className="text-sm font-bold text-[#ffde59] uppercase block tracking-wider"
                    >
                      KHU VỰC
                    </span>
                    <p className="text-xs sm:text-sm text-white font-sans">{currentPhoto.khuVuc || 'Bảo tàng'}</p>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="w-[1px] h-10 bg-[#c8aa6e]/50" />
                  </div>

                  <div className="col-span-5 space-y-1">
                    <span
                      style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                      className="text-sm font-bold text-[#ffde59] uppercase block tracking-wider"
                    >
                      NỘI DUNG
                    </span>
                    <p className="text-xs sm:text-sm text-white font-sans leading-snug">
                      {currentPhoto.noiDung || currentPhoto.caption || 'Tùng Lâm Hòa Phúc.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POPUP CHÚ THÍCH TỪ KHÓA (BỎ HOÀN TOÀN BORDER TRONG) ==================== */}
{activeKeywordPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
    
    {/* KHUNG NGOÀI DUY NHẤT */}
    <div className="relative bg-[#7d5225]/95 border border-[#f2cc8f]/70 p-6 sm:p-7 rounded-md max-w-lg w-full shadow-[0_0_35px_rgba(0,0,0,0.85)] backdrop-blur-md text-left space-y-5">
      
      {/* 🔴 HUY HIỆU HÌNH THOI GÓC TRÊN PHÍA TRÁI */}
      <div className="absolute -top-3.5 -left-3.5 w-10 h-10 bg-[#7d5225] border border-[#f2cc8f] rotate-45 flex items-center justify-center z-20 shadow-lg">
        <div className="-rotate-45 flex items-center justify-center text-[#ffde59]">
          <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>

      {/* NÚT ĐÓNG X */}
      <button
        type="button"
        onClick={onCloseKeywordPopup}
        className="absolute top-3 right-3 text-[#f2cc8f] hover:text-[#ffde59] text-xl font-light cursor-pointer transition-colors"
      >
        ✕
      </button>

      {/* HEADER: ẢNH BÊN TRÁI + TIÊU ĐỀ BÊN PHẢI */}
      <div className="flex items-center gap-4 sm:gap-5 pr-4 pt-1">
        <div className="w-32 sm:w-36 h-24 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden border border-[#ffde59]/70 shadow-md bg-black">
          <img
            src={activeKeywordPopup.imageUrl || 'https://tunglam.mocwp.com/wp-content/uploads/2026/07/bg-chua.jpg'}
            alt={activeKeywordPopup.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-0.5">
          <h3
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-3xl sm:text-4xl text-[#ffde59] uppercase leading-none tracking-wide drop-shadow-md"
          >
            {activeKeywordPopup.title}
          </h3>
        </div>
      </div>

      {/* ĐƯỜNG KẺ NGANG NỐI LIỀN 2 DẤU CHẤM */}
      <div className="flex items-center w-full py-1">
        <div className="w-2 h-2 rounded-full border-2 border-[#f2cc8f] bg-[#7d5225] flex-shrink-0" />
        <div className="h-[1.5px] w-full bg-[#f2cc8f]/60 -mx-0.5" />
        <div className="w-2 h-2 rounded-full border-2 border-[#f2cc8f] bg-[#7d5225] flex-shrink-0" />
      </div>

      {/* MÔ TẢ CHI TIẾT */}
      <p
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
        className="text-sm sm:text-base text-[#f7e7ce] leading-relaxed font-normal"
      >
        {activeKeywordPopup.description}
      </p>

      {/* LINK CÓ GẠCH CHÂN DÙNG FONT UTM AVO */}
      {activeKeywordPopup.linkUrl && (
        <div className="pt-1">
          <a
            href={activeKeywordPopup.linkUrl}
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-base sm:text-lg text-[#ffde59] hover:text-white underline underline-offset-4 tracking-wide transition-colors inline-block font-normal"
          >
            Tìm hiểu thêm về {activeKeywordPopup.title}
          </a>
        </div>
      )}

    </div>
  </div>
)}
    </>
  );
}