'use client';

import React, { useState, useRef } from 'react';

// ============================================================
// INTERACTIVE IMAGE DRAG — Component kéo thả tiêu điểm hình ảnh
// ============================================================
export function InteractiveImageDrag({
  imageUrl,
  position,
  onPositionChange,
  className = 'w-full h-48',
  children,
}: {
  imageUrl: string;
  position: string;
  onPositionChange: (newPos: string) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointer = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)));

    onPositionChange(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => { setIsDragging(true); handlePointer(e); }}
      onMouseMove={(e) => { if (isDragging) handlePointer(e); }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={(e) => { setIsDragging(true); handlePointer(e); }}
      onTouchMove={(e) => { if (isDragging) handlePointer(e); }}
      onTouchEnd={() => setIsDragging(false)}
      className={`relative overflow-hidden select-none cursor-crosshair rounded-2xl border border-[#F2C14E]/60 shadow-lg group bg-black ${className}`}
    >
      <img
        src={imageUrl}
        alt="Căn chỉnh khung nhìn"
        style={{ objectPosition: position || 'center 50%' }}
        className="w-full h-full object-cover pointer-events-none transition-none"
        onError={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.4'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Grid 3x3 mờ hướng dẫn bố cục */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="border-r border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-r border-b border-white/60" />
        <div className="border-b border-white/60" />
        <div className="border-r border-white/60" />
        <div className="border-r border-white/60" />
        <div />
      </div>

      {/* Điểm tiêu điểm vàng */}
      <div
        style={{ left: position.split(' ')[0] || '50%', top: position.split(' ')[1] || '50%' }}
        className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#F2C14E] shadow-[0_0_12px_#F2C14E] pointer-events-none flex items-center justify-center"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-black" />
      </div>

      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-[#FFE5A3] font-mono pointer-events-none border border-[#F2C14E]/30">
        Tiêu điểm: {position}
      </div>

      {children}
    </div>
  );
}

// ============================================================
// CONSTANTS — Danh mục Dòng Chảy Hoằng Pháp
// ============================================================
export const HOANG_PHAP_CATEGORIES = [
  { id: 'all', name: 'Tất Cả Mục Hoằng Pháp' },
  { id: 'cong-tu', name: '1. Cộng Tu Định Kỳ' },
  { id: 'khoa-le-truyen-thong', name: '2. Khóa Lễ Truyền Thống' },
  { id: 'dai-le-su-kien', name: '3. Đại Lễ Sự Kiện' },
  { id: 'tinh-do-nhan-gian', name: '4. Tịnh Độ Nhân Gian' },
];