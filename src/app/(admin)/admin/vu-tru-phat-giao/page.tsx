import React from 'react';
import { Metadata } from 'next';
import SpreadsheetVuTru from '@/components/admin/SpreadsheetVuTru';

export const metadata: Metadata = {
  title: 'Quản Trị Vũ Trụ Phật Giáo | Tùng Lâm Hòa Phúc Admin',
  description: 'Bảng tính quản trị toàn bộ các không gian kiến trúc, tượng pháp, câu chuyện và bảo tàng số Vũ Trụ Phật Giáo',
};

export default function AdminVuTruPage() {
  return (
    <div className="w-full min-h-screen bg-[#140D07]">
      <SpreadsheetVuTru />
    </div>
  );
}
