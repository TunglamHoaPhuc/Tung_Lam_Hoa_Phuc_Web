'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MoveVertical } from 'lucide-react';

interface HeroBannerProps {
  id?: string;
  bannerUrl?: string;
  bgImage?: string; // Nhận thêm prop này để không bị mismatch dữ liệu
  bannerPosition?: string; // Căn chỉnh vị trí ảnh (vd: 'center 20%', 'top', 'bottom')
  isEditable?: boolean; // Cho phép kéo thả trực tiếp trên banner
  onPositionChange?: (newPosition: string) => void;
  title?: string;
  subtitle?: string;
  backLink?: string;
  backText?: string;
}

const DEFAULT_BANNER_IMAGE = 'https://tunglam.mocwp.com/wp-content/uploads/2026/07/bg-chua.jpg';

export function HeroBanner({
  id = 'tong-chi-tu-hoc',
  bannerUrl,
  bgImage,
  bannerPosition = 'center 50%',
  isEditable = false,
  onPositionChange,
  title = 'TÔNG CHỈ TU HỌC',
  subtitle = 'TÙNG LÂM HÒA PHÚC',
  backLink,
  backText = 'Trở về Sơ Đồ Bản Đồ 2D Vũ Trụ Phật Giáo',
}: HeroBannerProps) {
  // Lấy URL ảnh banner từ WP, prop hoặc ảnh mặc định
  const initialUrl = bannerUrl || bgImage || DEFAULT_BANNER_IMAGE;
  const [imgSrc, setImgSrc] = useState<string>(initialUrl);

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
      setImgSrc(nextUrl);
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
      className="relative w-full mb-6 flex flex-col items-center overflow-hidden select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className={`relative w-full h-[350px] md:h-[480px] lg:h-[550px] overflow-hidden flex items-end justify-center bg-[#2c1c11] ${
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
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#2c1c11] via-[#2c1c11]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#2c1c11] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#2c1c11] to-transparent z-10 pointer-events-none" />

        <div className="relative z-20 pb-4 w-full flex flex-col items-center text-center px-4">
          {/* Tiêu đề chính động */}
          <h1
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="text-6xl md:text-9xl text-[#ffde59] tracking-normal uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
          >
            {title}
          </h1>

          {/* Đường kẻ trang trí hoa văn với 2 nét kẻ ngang mạ vàng sang 2 bên */}
          <div className="relative w-full max-w-3xl flex items-center justify-center my-2 px-4">
            <div className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(to right, transparent, rgba(242,204,143,0.9))" }} />
            <div className="mx-3 text-[#f2cc8f] text-[10px] bg-[#2c1c11] px-1 border border-[#f2cc8f]/80 rotate-45 w-3 h-3 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(242,204,143,0.6)]" />
            <div className="flex-1 h-[1.5px]" style={{ background: "linear-gradient(to left, transparent, rgba(242,204,143,0.9))" }} />
          </div>
        </div>
      </div>

      {/* Subtitle / Tiêu đề phụ động */}
      {subtitle && (
        <p
          style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
          className="text-base md:text-2xl tracking-[0.2em] text-[#ffde59] uppercase opacity-95 mt-4 text-center px-4"
        >
          {subtitle}
        </p>
      )}

      {/* Nút quay lại bản đồ 2D ngay dưới sub tiêu đề */}
      {backLink && (
        <a
          href={backLink}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#F2C14E] border border-[#F2C14E]/40 px-5 py-2.5 rounded-full bg-[#1C130D]/90 hover:bg-[#F2C14E] hover:text-[#2A1D14] transition-all shadow-xl mt-4 cursor-pointer z-20"
          style={{ fontFamily: "'UTM Avo', sans-serif", fontWeight: 'bold' }}
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{backText}</span>
        </a>
      )}
    </section>
  );
}

export default HeroBanner;
