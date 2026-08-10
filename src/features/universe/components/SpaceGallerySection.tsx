'use client';

import React, { FC, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TAM_BAO_SPACES, TamBaoSpaceImage } from '@/data/tam-bao-detail-data';
import { OtherAreasSection } from './OtherAreasSection';

interface SpaceGallerySectionProps {
  areaTitle?: string;
  spaces?: TamBaoSpaceImage[];
  /** Slug hiện tại để loại ra khỏi "Khám Phá Khu Vực Khác" */
  currentSlug?: string;
  /** Cho phép hiển thị hoặc ẩn phần "Khám Phá Khu Vực Khác" đi kèm */
  showOtherAreas?: boolean;
}

export const SpaceGallerySection: FC<SpaceGallerySectionProps> = ({
  areaTitle = 'TAM BẢO',
  spaces = TAM_BAO_SPACES,
  currentSlug = 'tam-bao',
  showOtherAreas = true,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevSlide = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + spaces.length) % spaces.length));
  const nextSlide = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % spaces.length));

  return (
    <>
      {/* ══════════════════════════════════════════════
          SECTION: KHÔNG GIAN [AREA] — PHOTO GRID CÓ KHOẢNG THỞ & KHUNG CHÚ THÍCH 4 CẠNH HỞ
      ══════════════════════════════════════════════ */}
      <section id="khong-gian" className="w-full scroll-mt-24 py-10">
        {/* ── SECTION HEADER: Icon + Tiêu đề + 2 đường kẻ hai bên ── */}
        <div className="flex flex-col items-center text-center mb-10">
          <div
            className="w-10 h-10 mb-3 flex items-center justify-center"
            aria-hidden="true"
          >
            <img
              src="/images/bieu-tuong-tuong-phap.svg"
              alt=""
              className="w-full h-full object-contain filter drop-shadow-[0_0_14px_rgba(242,193,78,0.9)]"
            />
          </div>

          <div className="flex items-center justify-center w-full gap-0">
            {/* Đường kẻ trái */}
            <div className="flex-1 flex items-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
            </div>

            <h2
              style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-5 sm:px-8"
            >
              KHÔNG GIAN {areaTitle}
            </h2>

            {/* Đường kẻ phải */}
            <div className="flex-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
              <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
            </div>
          </div>
        </div>

        {/* ── PHOTO GRID: Khoảng thở rộng rãi (gap-5 sm:gap-6 md:gap-7), Khung chú thích hở 4 cạnh ── */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-7">
          {spaces.map((space, idx) => {
            // Bento sizing: 3rd or 6th image can span full width for dynamic layout
            const isLarge = idx === 2 || idx === 5;

            return (
              <div
                key={space.id}
                onClick={() => openLightbox(idx)}
                className={`
                  group relative overflow-hidden cursor-pointer rounded-2xl
                  border border-[#f2c14e]/30 hover:border-[#ffde59]
                  transition-all duration-500 shadow-xl bg-[#1c120b]
                  ${isLarge ? 'sm:col-span-2 h-[280px] sm:h-[360px] md:h-[400px]' : 'sm:col-span-1 h-[240px] sm:h-[280px] md:h-[320px]'}
                `}
              >
                {/* 1. Ảnh nền hiển thị rõ nét */}
                <img
                  src={space.imgUrl}
                  alt={space.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />

                {/* 2. KHUNG CHÚ THÍCH HỞ 4 CẠNH (TỰA TẤM THẺ TRANSLUCENT ĐẶT TRÊN ẢNH) */}
                <div className="absolute inset-3 sm:inset-4 md:inset-5 rounded-xl md:rounded-2xl border border-[#e2a84d]/60 bg-[#54361e]/65 backdrop-blur-[2px] group-hover:bg-[#452a15]/85 group-hover:border-[#ffde59] group-hover:shadow-[0_0_25px_rgba(242,193,78,0.4)] transition-all duration-500 flex flex-col items-center justify-center p-4 sm:p-6 text-center pointer-events-none">
                  
                  {/* Container căn chính giữa chữ ban đầu */}
                  <div className="flex flex-col items-center justify-center text-center w-full h-full">
                    
                    {/* TIÊU ĐỀ: Căn chính giữa ban đầu, lướt chuột vào đẩy lên một chút. Sử dụng phông UTM Classizism Antiqua THƯỜNG (font-normal) & màu trắng nâng lên */}
                    <h3
                      style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', 'UTM_ClassizismAntiqua', serif" }}
                      className="text-white text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-wide transition-all duration-300 group-hover:-translate-y-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-snug max-w-[92%] mx-auto"
                    >
                      {space.title.includes("TRÊN CAO") ? (
                        <>
                          {space.title.replace("TRÊN CAO", "").trim()}{" "}
                          <span className="inline-block whitespace-nowrap">TRÊN CAO</span>
                        </>
                      ) : space.title.includes("KINH LUÂN") ? (
                        <>
                          {space.title.replace("KINH LUÂN", "").trim()}{" "}
                          <span className="inline-block whitespace-nowrap">KINH LUÂN</span>
                        </>
                      ) : (
                        space.title
                      )}
                    </h3>

                    {/* DÒNG KẺ NGANG: Xuất hiện bên dưới chữ khi lướt chuột vào */}
                    <div className="w-0 opacity-0 scale-x-0 h-0 my-0 overflow-hidden group-hover:w-16 sm:group-hover:w-20 group-hover:h-[2px] group-hover:bg-[#ffde59] group-hover:my-2.5 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 ease-out shadow-[0_0_8px_#ffde59]" />

                    {/* SUB TIÊU ĐỀ / CHÚ THÍCH: Xuất hiện bên dưới dòng kẻ khi lướt chuột vào (Phông UTM Avo THƯỜNG, ko bold) */}
                    {space.caption && (
                      <p
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-[#e3d2c1] text-xs sm:text-sm font-normal leading-relaxed tracking-wide max-h-0 opacity-0 overflow-hidden translate-y-2 group-hover:max-h-24 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out px-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                      >
                        {space.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION: KHÁM PHÁ KHU VỰC KHÁC (Optional if showOtherAreas = true)
      ══════════════════════════════════════════════ */}
      {showOtherAreas && <OtherAreasSection currentSlug={currentSlug} />}

      {/* ══════════════════════════════════════════════
          LIGHTBOX POPUP (Xem ảnh chi tiết)
      ══════════════════════════════════════════════ */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-[90vw] sm:max-w-[680px] mx-4 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #4a3728 0%, #2c1c11 100%)',
              border: '1px solid rgba(242,193,78,0.5)',
              boxShadow: '0 0 60px rgba(242,193,78,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={closeLightbox}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 border border-[#c8aa6e]/40 text-white/80 hover:text-white hover:bg-black/80 flex items-center justify-center cursor-pointer transition-all"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Popup header: UTM Classizism Antiqua, thường, in hoa, trắng, CĂN GIỮA */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-center border-b border-[#c8aa6e]/30">
              <h3
                style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', 'UTM_ClassizismAntiqua', serif" }}
                className="text-lg sm:text-xl font-normal text-white uppercase tracking-widest text-center w-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
              >
                KHÔNG GIAN {areaTitle}
              </h3>
            </div>

            {/* Ảnh chính — tỉ lệ vàng 1.618:1 */}
            <div className="relative mx-5 mt-4 rounded-xl overflow-hidden border border-[#c8aa6e]/30"
              style={{ aspectRatio: '1.618 / 1' }}
            >
              <img
                src={spaces[lightboxIndex].imgUrl}
                alt={spaces[lightboxIndex].title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Điều hướng + dots */}
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={prevSlide}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#c8aa6e]/40 bg-[#3a2613]/80 text-[#f2cc8f] hover:border-[#ffde59] hover:text-[#ffde59] transition-all cursor-pointer text-sm font-bold"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">•</span>
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {spaces.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`rounded-full transition-all cursor-pointer ${
                      i === lightboxIndex
                        ? 'w-3 h-3 bg-[#ffde59] shadow-[0_0_8px_#ffde59]'
                        : 'w-2 h-2 bg-[#c8aa6e]/50 hover:bg-[#c8aa6e]'
                    }`}
                    aria-label={`Ảnh ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#c8aa6e]/40 bg-[#3a2613]/80 text-[#f2cc8f] hover:border-[#ffde59] hover:text-[#ffde59] transition-all cursor-pointer text-sm font-bold"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                aria-label="Ảnh tiếp"
              >
                <span className="hidden sm:inline">•</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tiêu đề & chú thích ảnh */}
            <div className="px-6 pb-7 text-center">
              {/* Tiêu đề: UTM Classizism Antiqua, thường, in hoa, trắng */}
              <h4
                style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', 'UTM_ClassizismAntiqua', serif" }}
                className="text-xl sm:text-2xl font-normal text-white uppercase tracking-widest leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mb-3"
              >
                {spaces[lightboxIndex].title}
              </h4>

              {/* Đường kẻ ngang gradient vàng bên dưới tiêu đề */}
              <div className="mx-auto mb-4 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent"
                style={{ width: '61.8%' }}
              />

              {/* Chú thích: UTM Avo, thường */}
              <p
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-sm text-[#D3C0AD] font-normal leading-relaxed"
              >
                {spaces[lightboxIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
