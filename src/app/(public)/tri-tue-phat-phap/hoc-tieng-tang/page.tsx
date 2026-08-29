'use client';

import React from 'react';

export default function HocTiengTangPage() {
  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden bg-[#160E0C] block">
      {/* ── GIAO DIỆN NGUYÊN BẢN CỦA ỨNG DỤNG HỌC TIẾNG TẠNG SARA (TOÀN MÀN HÌNH KHÔNG BỊ HEADER CHE KHUẤT) ── */}
      <iframe
        src="/tibetan-study/index.html"
        title="Ứng Dụng Học Tiếng Tạng & Giáo Trình Sara"
        className="w-full h-full border-none block"
        allow="autoplay; microphone"
      />
    </div>
  );
}
