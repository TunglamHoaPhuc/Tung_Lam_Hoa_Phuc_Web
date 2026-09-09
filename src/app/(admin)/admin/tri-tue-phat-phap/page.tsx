import React from 'react';
import { Metadata } from 'next';
import SpreadsheetTriTue from '@/components/admin/SpreadsheetTriTue';

export const metadata: Metadata = {
  title: 'Quản Trị Trí Tuệ Phật Pháp | Tùng Lâm Hòa Phúc Admin',
  description: 'Bảng tính quản trị toàn bộ bài viết, pháp âm, video và ấn phẩm sách Trí Tuệ Phật Pháp',
};

export default function AdminTriTuePage() {
  return (
    <div className="w-full min-h-screen bg-[#140D07]">
      <SpreadsheetTriTue />
    </div>
  );
}
