import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicMemorialRecords } from '@/lib/memorial-db';
import { MemorialSearchEngine } from '@/features/memorial/components/MemorialSearchEngine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Tra Cứu Mã Số Bài Vị | Nhà Tứ Ân - Tùng Lâm Hòa Phúc',
  description:
    'Tra cứu nhanh mã số bài vị chư Hương Linh, Cửu Huyền Thất Tổ an vị tại Nhà Tứ Ân Vãng Sinh Đường - Tùng Lâm Hòa Phúc.',
};

interface PageProps {
  searchParams: Promise<{ khu?: string; cat?: string }>;
}

export default async function TraCuuBaiViPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialCategory = (params.khu || params.cat || 'all').trim();
  const initialRecords = await getPublicMemorialRecords();

  return (
    <div className="min-h-screen bg-[#22150D] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black flex flex-col">
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 pt-7 pb-10 sm:pt-10">
        {/* Header tối giản dành riêng cho quét mã QR trên điện thoại */}
        <header className="text-center space-y-2 mb-5">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-[#F2C14E]/60" />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F2C14E]/85"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Tùng Lâm Hòa Phúc
            </span>
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-[#F2C14E]/60" />
          </div>

          <h1
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-4xl sm:text-5xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_2px_12px_rgba(242,193,78,0.4)]"
          >
            TRA CỨU MÃ SỐ BÀI VỊ
          </h1>

          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-xs sm:text-sm text-[#c9b896]"
          >
            Nhà Tứ Ân • Vãng Sinh Đường
          </p>
        </header>

        <MemorialSearchEngine
          initialRecords={initialRecords}
          initialCategory={initialCategory}
        />
      </div>

      {/* Footer siêu nhỏ gọn */}
      <footer
        className="py-4 px-4 text-center text-[11px] text-[#c9b896]/70 border-t border-[#F2C14E]/15"
        style={{ fontFamily: "'UTM Avo', sans-serif" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/" className="hover:text-[#F2C14E] transition-colors">
            ← Trang chủ Tùng Lâm Hòa Phúc
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/vu-tru-phat-giao/tu-an" className="hover:text-[#F2C14E] transition-colors">
            Không gian Nhà Tứ Ân
          </Link>
        </div>
      </footer>
    </div>
  );
}
