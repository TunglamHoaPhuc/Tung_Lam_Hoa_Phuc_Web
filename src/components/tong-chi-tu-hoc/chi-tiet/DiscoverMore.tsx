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
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      link: '#',
    },
    {
      category: 'NỀN TẢNG TU HỌC',
      title: 'Quy Củ Thiền Môn Và Pháp Môn Tịnh Độ Tu Tập',
      url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
      link: '#',
    },
    {
      category: 'CÔNG HẠNH SƯ TỔ',
      title: 'Tấm Gương Sáng Ngời Của Chư Vị Tổ Sư Khai Sơn',
      url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
      link: '#',
    },
    {
      category: 'TRUYỀN THỐNG ĐẠO TRÀNG',
      title: 'Nét Đẹp Tâm Linh Trong Các Khóa Tu Mùa Hè',
      url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
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
          className="flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 w-full"
        >
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.link || '#'}
              className="group relative flex-shrink-0 w-[260px] sm:w-[320px] aspect-[3/4] overflow-hidden rounded-xl border border-[#c8aa6e]/50 shadow-2xl bg-black block transition-all duration-500 hover:-translate-y-1.5 hover:border-[#ffde59]"
            >
              {/* TỐI ƯU HÓA: Dùng Next Image cho background card */}
              <div className="w-full h-full relative">
                <Image
                  src={item.url || 'https://tunglam.mocwp.com/wp-content/uploads/2026/07/default-bg.jpg'}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 260px, 320px"
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* OVERLAY GRADIENT ĐEN NÂU LÀM NỔI CHỮ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/90 transition-colors z-10" />

              {/* NỘI DUNG CARD: CHUYÊN MỤC TAXONOMY + TIÊU ĐỀ */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-left space-y-1.5 z-20">
                <span
                  style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                  className="text-xl sm:text-2xl font-normal text-[#ffde59] uppercase block tracking-wider drop-shadow-md leading-none"
                >
                  {item.category || 'TÔNG PHONG'}
                </span>

                <h3
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-sm sm:text-base font-bold text-white uppercase tracking-wide leading-snug group-hover:text-[#ffde59] transition-colors line-clamp-2"
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
