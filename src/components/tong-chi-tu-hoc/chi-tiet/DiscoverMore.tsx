'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BaiVietLienQuan {
  category?: string;
  title: string;
  url: string;
  link?: string;
}

interface PropsTimHieuThem {
  relatedArticles?: BaiVietLienQuan[];
}

export function DiscoverMore({ relatedArticles }: PropsTimHieuThem) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 🔴 1. DỮ LIỆU MẶC ĐỊNH SANG TRỌNG KHI CHƯA CÓ API TRẢ VỀ (TRÁNH BỊ TRỐNG KHUNG)
  const defaultArticles: BaiVietLienQuan[] = [
    {
      category: 'TÔNG PHONG TRUYỀN THỪA',
      title: 'Hành Trình Tiếp Nối Dòng Mạng Mạch Hoằng Pháp',
      url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      link: '#',
    },
    {
      category: 'NỀN TẢNG TU HỌC',
      title: 'Quy Củ Thiền Môn Và Pháp Môn Tịnh Độ Tu Tập',
      url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/canh-1.webp',
      link: '#',
    },
    {
      category: 'CÔNG HẠNH SƯ TỔ',
      title: 'Tấm Gương Sáng Ngời Của Chư Vị Tổ Sư Khai Sơn',
      url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp',
      link: '#',
    },
    {
      category: 'TRUYỀN THỐNG ĐẠO TRÀNG',
      title: 'Nét Đẹp Tâm Linh Trong Các Khóa Tu Mùa Hè',
      url: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp',
      link: '#',
    },
  ];

  const items = relatedArticles && relatedArticles.length > 0 ? relatedArticles : defaultArticles;

  // HÀM XỬ LÝ CUỘN SLIDER TRÁI / PHẢI
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="tim-hieu-them" className="scroll-mt-24 pt-8 pb-10 w-full relative">
      <div className="w-full space-y-6">

        {/* 🔴 2. HEADER TƯƠNG THÍCH 100% VỚI KHỐI "TÔNG PHONG TRUYỀN THỪA" */}
        <div className="flex items-center justify-between gap-4 w-full border-b border-[#c8aa6e]/30 pb-3">

          {/* TIÊU ĐỀ "TÌM HIỂU THÊM" (FONT UTM CLASSIC SANG TRỌNG) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <h2
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Niagara', serif" }}
              className="text-2xl sm:text-4xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_2px_10px_rgba(255,222,89,0.3)]"
            >
              TÌM HIỂU THÊM
            </h2>
          </div>

          {/* ĐƯỜNG KẺ VÀNG KIM DÀI PHỦ RỘNG */}
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#ffde59]/80 via-[#c8aa6e]/50 to-transparent mx-2 hidden sm:block" />

          {/* HÌNH THOI NỐI VỚI HAI NÚT MŨI TÊN TRÁI / PHẢI */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-2.5 h-2.5 bg-[#ffde59] rotate-45 shadow-[0_0_8px_#ffde59] hidden sm:block" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-9 h-9 rounded-lg border border-[#c8aa6e]/60 bg-[#3a2613]/80 hover:bg-[#ffde59] text-[#ffde59] hover:text-[#2c1c11] flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
                title="Trượt sang trái"
              >
                &larr;
              </button>

              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-9 h-9 rounded-lg border border-[#c8aa6e]/60 bg-[#3a2613]/80 hover:bg-[#ffde59] text-[#ffde59] hover:text-[#2c1c11] flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer"
                title="Trượt sang phải"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* 🔴 3. DANH SÁCH BÀI VIẾT DẠNG TAXONOMY CARD TRƯỢT NGANG */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-3 w-full"
        >
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.link || '#'}
              className="group relative flex-shrink-0 w-[260px] sm:w-[300px] h-[360px] sm:h-[380px] overflow-hidden rounded-xl border border-[#593b26] hover:border-[#f2cc8f] shadow-2xl block transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(242,204,143,0.35)]"
            >
              {/* Ảnh bìa */}
              <div className="w-full h-full relative">
                <img
                  src={item.url || '/images/toan-canh-chua.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
                  }}
                />
              </div>

              {/* OVERLAY GRADIENT NÂU ĐỒNG MÀU VỚI NỀN TRANG */}
              <div
                className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none transition-all duration-300 group-hover:h-[58%]"
                style={{
                  background: 'linear-gradient(to top, rgba(35, 21, 12, 0.98) 0%, rgba(35, 21, 12, 0.85) 30%, rgba(35, 21, 12, 0.42) 65%, transparent 100%)',
                }}
              />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f2cc8f]/70 rounded-xl transition-colors duration-300 pointer-events-none" />

              {/* NỘI DUNG CARD: CHUYÊN MỤC TAXONOMY + TIÊU ĐỀ */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-left space-y-1 z-20">
                <span
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-[11px] sm:text-xs font-semibold text-[#F2C14E] uppercase tracking-wider block"
                >
                  {item.category || 'TÔNG CHỈ TU HỌC'}
                </span>

                <h3
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-base sm:text-[17px] font-normal text-white uppercase tracking-wide leading-snug group-hover:font-bold group-hover:text-[#FFE5A3] transition-all line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                >
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
