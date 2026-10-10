'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MoveVertical } from 'lucide-react';
import { getImageUrl } from '@/utils/image';

interface HeroBannerProps {
  id?: string;
  bannerUrl?: string;
  bgImage?: string; // Nhận thêm prop này để không bị mismatch dữ liệu
  bannerPosition?: string; // Căn chỉnh vị trí ảnh (vd: 'center 20%', 'top', 'bottom')
  isEditable?: boolean; // Cho phép kéo thả trực tiếp trên banner
  onPositionChange?: (newPosition: string) => void;
  title?: string;
  subtitle?: string;
  emblemUrl?: string | null; // 🌟 Biểu tượng linh thiêng trên tiêu đề (Bilgewater style)
  emblemAlt?: string;
  backLink?: string;
  backText?: string;
}

const DEFAULT_BANNER_IMAGE = 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

export function HeroBanner({
  id = 'tong-chi-tu-hoc',
  bannerUrl,
  bgImage,
  bannerPosition = 'center 50%',
  isEditable = false,
  onPositionChange,
  title = 'TÔNG CHỈ TU HỌC',
  subtitle = 'TÙNG LÂM HÒA PHÚC',
  emblemUrl,
  emblemAlt,
  backLink,
  backText = 'Trở về Sơ Đồ Bản Đồ 2D Vũ Trụ Phật Giáo',
}: HeroBannerProps) {
  // Lấy URL ảnh banner từ WP, prop hoặc ảnh mặc định
  const initialUrl = getImageUrl(bannerUrl || bgImage) || DEFAULT_BANNER_IMAGE;
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);

  // Chỉ hiển thị biểu tượng khi có prop emblemUrl được truyền trực tiếp (trang chính Tông Chỉ Tu Học)
  const resolvedEmblem = emblemUrl || null;

  // Kéo thả căn chỉnh vị trí chuột (Interactive Dragging)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragStartPercent, setDragStartPercent] = useState<number>(50);
  const [currentPos, setCurrentPos] = useState<string>(bannerPosition);

  useEffect(() => {
    setCurrentPos(bannerPosition);
  }, [bannerPosition]);

  useEffect(() => {
    const nextUrl = bannerUrl || bgImage;
    if (nextUrl) {
      setImgSrc(getImageUrl(nextUrl));
    } else {
      setImgSrc(DEFAULT_BANNER_IMAGE);
    }
  }, [bannerUrl, bgImage]);

  // Xử lý kéo thả vị trí chuột
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditable) return;
    setIsDragging(true);
    setDragStartY(e.clientY);
    const parsed = parseInt((currentPos || '50%').replace(/[^0-9]/g, ''), 10) || 50;
    setDragStartPercent(parsed);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !isEditable) return;
    const deltaY = e.clientY - dragStartY;
    // Kéo chuột xuống -> lấy phần trên ảnh (giảm %); kéo chuột lên -> lấy phần dưới ảnh (tăng %)
    const newPercent = Math.max(0, Math.min(100, Math.round(dragStartPercent + deltaY * 0.25)));
    const nextPos = `center ${newPercent}%`;
    setCurrentPos(nextPos);
    if (onPositionChange) {
      onPositionChange(nextPos);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  return (
    <section
      id={id}
      className="relative w-full mb-0 flex flex-col items-center overflow-hidden select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 🌟 KHUNG ẢNH MỞ RỘNG CHIỀU CAO ĐIỆN ẢNH (CINEMATIC EXPANSIVE HEIGHT) */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className={`relative w-full min-h-[500px] sm:min-h-[560px] md:min-h-[640px] lg:min-h-[720px] h-[70vh] sm:h-[75vh] md:h-[78vh] lg:h-[82vh] max-h-[860px] overflow-hidden flex items-end justify-center bg-[#2c1c11] ${
          isEditable ? 'cursor-grab active:cursor-grabbing group/banner' : ''
        }`}
      >
        <Image
          src={imgSrc || DEFAULT_BANNER_IMAGE}
          alt={title || 'Hero Banner Tông Chỉ Tu Học'}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover transition-all duration-300 scale-105 pointer-events-none"
          style={{ objectPosition: currentPos || 'center' }}
          onError={() => {
            if (imgSrc !== DEFAULT_BANNER_IMAGE) {
              setImgSrc(DEFAULT_BANNER_IMAGE);
            }
          }}
        />

        {/* 🌟 LƯỚI 3x3 VÀ CHỈ BÁO VỊ TRÍ KHI KÉO THẢ HOẶC HOVER VÀO BANNER */}
        {isEditable && (
          <div
            className={`absolute inset-0 z-30 transition-opacity pointer-events-none ${
              isDragging ? 'opacity-100 bg-black/20' : 'opacity-0 group-hover/banner:opacity-100'
            }`}
          >
            {/* Lưới 9 ô 3x3 thanh mảnh */}
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-[#F2C14E]/30">
              <div className="border-r border-b border-[#F2C14E]/20" />
              <div className="border-r border-b border-[#F2C14E]/20" />
              <div className="border-b border-[#F2C14E]/20" />
              <div className="border-r border-b border-[#F2C14E]/20" />
              <div className="border-r border-b border-[#F2C14E]/20" />
              <div className="border-b border-[#F2C14E]/20" />
              <div className="border-r border-b border-[#F2C14E]/20" />
              <div className="border-r border-b border-[#F2C14E]/20" />
              <div />
            </div>

            {/* Badge vị trí nhỏ gọn đặt ở góc trên, không che mặt nhân vật */}
            <div className="absolute top-3 left-3 z-40">
              <span
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="px-3 py-1 rounded-full bg-black/85 border border-[#F2C14E]/70 text-[#ffde59] text-[11px] font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5"
              >
                <MoveVertical className="w-3.5 h-3.5 text-[#ffde59] shrink-0" />
                <span>{isDragging ? currentPos : 'Kéo để căn chỉnh'}</span>
              </span>
            </div>
          </div>
        )}

        {/* 🌌 LỚP PHỦ MỜ 4 CẠNH VIỀN VỪA ĐỦ ĐỂ KHÔNG BỊ LỘ VIỀN ẢNH */}
        {/* 1. Viền đỉnh: dải mờ mỏng 32-48px xóa đường cắt trên */}
        <div className="absolute inset-x-0 top-0 h-8 sm:h-12 bg-gradient-to-b from-[#2c1c11] to-transparent z-10 pointer-events-none" />

        {/* 2. Viền 2 bên sườn: dải mờ mỏng 32-48px xóa đường cắt trái & phải */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-[#2c1c11] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-[#2c1c11] to-transparent z-10 pointer-events-none" />

        {/* 3. Chân ảnh: dải mờ vừa đủ che đường cắt đáy và tạo độ tương phản cho tiêu đề */}
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 md:h-52 bg-gradient-to-t from-[#2c1c11] via-[#2c1c11]/80 via-35% to-transparent z-10 pointer-events-none" />

        {/* 👑 CỤM TIÊU ĐỀ, EMBLEM & PHỤ ĐỀ ĐẨY XUỐNG SÁT CHÂN MÀN HÌNH */}
        <div className="relative z-20 pb-2 sm:pb-3 md:pb-4 lg:pb-5 w-full flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
          {/* 1. Biểu tượng linh thiêng trên tiêu đề - Giữ nguyên vị trí thoáng đãng, khôi phục phát sáng hoàng kim ban đầu */}
          {resolvedEmblem && (
            <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-7 flex items-center justify-center animate-in fade-in zoom-in duration-500">
              <div className="relative group/emblem flex items-center justify-center">
                <div className="absolute -inset-2 rounded-full bg-[#F2C14E]/25 blur-md pointer-events-none" />
                <img
                  src={resolvedEmblem}
                  alt={emblemAlt || title || 'Biểu tượng linh thiêng Tùng Lâm Hòa Phúc'}
                  className="h-[48px] sm:h-[72px] md:h-[96px] lg:h-[116px] xl:h-[128px] w-auto object-contain drop-shadow-[0_0_20px_rgba(242,193,78,0.7)] transition-transform duration-300 group-hover/emblem:scale-105 select-none"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* 2. Tiêu đề chính hùng tráng */}
          <h1
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#ffde59] tracking-normal uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] leading-[0.9] mb-1 px-2"
          >
            {title}
          </h1>

          {/* 3. Dấu kẻ trang trí hoa văn hoàng kim tỏa sang 2 bên */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl flex items-center justify-center my-1 sm:my-1.5 px-4">
            <div className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(to right, transparent, rgba(242,204,143,0.85))" }} />
            <div className="mx-3 text-[#f2cc8f] text-[10px] bg-[#2c1c11] px-1 border border-[#f2cc8f]/80 rotate-45 w-3 h-3 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(242,204,143,0.6)]" />
            <div className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(to left, transparent, rgba(242,204,143,0.85))" }} />
          </div>

          {/* 4. Subtitle / Tiêu đề phụ nằm sâu dưới đường kẻ hoa văn */}
          {subtitle && (
            <p
              style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
              className="text-xs sm:text-sm md:text-base lg:text-lg tracking-[0.2em] sm:tracking-[0.25em] text-[#FFE5A3] uppercase opacity-95 mt-0.5 text-center px-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-4xl"
            >
              {subtitle}
            </p>
          )}

          {/* 5. Nút quay lại bản đồ 2D (nếu có) */}
          {backLink && (
            <a
              href={backLink}
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-[#F2C14E] border border-[#F2C14E]/40 px-5 py-1.5 rounded-full bg-[#1C130D]/90 hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all shadow-xl mt-2 cursor-pointer z-20 hover:scale-105"
              style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: 'bold' }}
            >
              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{backText}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
