'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, MapPin, X, Sparkles, BookOpen, Flame } from 'lucide-react';
import { QuanAm33Grid } from './QuanAm33Grid';

interface PagodaFloor {
  id: string;
  floorNumber: number;
  title: string;
  subtitle: string;
  mandalaMeaning: string;
  statues: string[];
  stories: string;
  x: number; // percentage
  y: number; // percentage
}

const PAGODA_FLOORS: PagodaFloor[] = [
  {
    id: 'floor-3',
    floorNumber: 3,
    title: 'TẦNG 3 — ĐỈNH THÁP XÁ LỢI TAM BẢO',
    subtitle: 'Nơi Thờ Tự Tối Thượng & Xá Lợi Phật',
    mandalaMeaning: 'Mạn Đà La Quang Minh Tịnh Độ - Biểu tượng của Trí Tuệ Viên Mãn và Ánh Sáng Vô Lượng giải thoát khổ đau.',
    statues: ['Tôn Tượng Phật Xá Lợi', 'Đức Phật Thích Ca Mâu Ni Nhập Niết Bàn', 'Bảo Tháp Xá Lợi Thủy Tinh'],
    stories: 'Ngọn tháp lưu giữ Xá Lợi Phật mang nguồn năng lượng từ bi vô biên, soi sáng tâm thức của hành giả khi chiêm bái.',
    x: 50,
    y: 22,
  },
  {
    id: 'floor-2',
    floorNumber: 2,
    title: 'TẦNG 2 — VẠN PHẬT HẢI HỘI',
    subtitle: 'Vạn Phật Điện & Tam Phương Chư Phật',
    mandalaMeaning: 'Mạn Đà La Vạn Phật Tịnh Độ - Thể hiện sự hiện hữu của vạn vị Phật khắp mười phương tam thế.',
    statues: ['Vạn Phật Điện Tôn Tượng', 'Đức Phật A Di Đà Phóng Quang', 'Đức Dược Sư Lưu Ly Quang Vương'],
    stories: 'Nơi tôn trí vạn pho tượng Phật nhỏ mạ vàng chiếu sáng rực rỡ, tượng trưng cho tâm Phật sẵn có trong mọi chúng sinh.',
    x: 50,
    y: 50,
  },
  {
    id: 'floor-1',
    floorNumber: 1,
    title: 'TẦNG 1 — ĐẠI ĐIỆN QUÁN ÂM ỨNG HÓA',
    subtitle: '33 Ứng Hóa Thân Đức Quán Thế Âm Bồ Tát',
    mandalaMeaning: 'Mạn Đà La Đại Từ Đại Bi - Thấm nhuần tinh thần cứu khổ cứu nạn của Bồ Tát Quán Thế Âm.',
    statues: ['Đại Tượng Quán Thế Âm Bồ Tát', '33 Ứng Hóa Thân Bồ Tát', 'Tiêu Diện Đại Sĩ & Hộ Pháp'],
    stories: 'Nơi Phật tử và du khách thành tâm chiêm bái, gieo quẻ xốc quẻ nhận lời chỉ dạy tâm linh của Ngài Quán Âm.',
    x: 50,
    y: 78,
  },
];

export const BaoThapGrid: FC = () => {
  const [selectedFloor, setSelectedFloor] = useState<PagodaFloor | null>(PAGODA_FLOORS[2]);

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* SECTION HEADER */}
        <div className="mb-8">
          <h2
            className="text-2xl md:text-4xl font-normal text-[#F2C14E] uppercase tracking-widest mb-1"
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
          >
            SƠ ĐỒ 2D BẢO THÁP VẠN PHẬT XÁ LỢI HÒA BÌNH
          </h2>
          <p className="text-xs md:text-sm text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Nhấp chọn các tầng tháp để xem thông tin chi tiết bảo tượng, ý nghĩa Mạn Đà La và các câu chuyện liên quan
          </p>
        </div>

        {/* 2D PAGODA INTERACTIVE MAP CONTAINER */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#F2C14E]/40 shadow-2xl bg-[#1A120B] mb-12 flex flex-col lg:flex-row">
          {/* LEFT: PAGODA BACKGROUND IMAGE MAP */}
          <div className="relative w-full lg:w-3/5 h-[480px] md:h-[550px] bg-[#120B06] flex items-center justify-center p-4 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=800&fit=crop"
              alt="Bảo Tháp Vạn Phật Xá Lợi"
              className="w-full h-full object-cover opacity-60 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C130D] via-transparent to-black/50" />

            {/* Interactive Pins on Pagoda Floors */}
            {PAGODA_FLOORS.map((floor) => {
              const isSelected = selectedFloor?.id === floor.id;
              return (
                <button
                  key={floor.id}
                  type="button"
                  onClick={() => setSelectedFloor(floor)}
                  style={{ top: `${floor.y}%`, left: `${floor.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all z-20 flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                    isSelected
                      ? 'bg-[#F2C14E] text-[#1C130D] border-white shadow-[0_0_30px_rgba(242,193,78,0.9)] scale-110'
                      : 'bg-[#1C130D]/90 text-[#F2C14E] border-[#F2C14E]/60 hover:bg-[#F2C14E] hover:text-[#1C130D] shadow-lg'
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? 'animate-bounce' : ''}`} />
                  <span className="text-xs font-bold whitespace-nowrap" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {floor.title.split('—')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: SIDE PANEL FLOOR DETAILS */}
          <div className="w-full lg:w-2/5 bg-gradient-to-b from-[#25170E] to-[#1A120B] p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#F2C14E]/30">
            {selectedFloor ? (
              <div className="space-y-4 text-left">
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold text-[#F2C14E] bg-[#1C130D] border border-[#F2C14E]/40 uppercase tracking-wider">
                    SƠ ĐỒ CHI TIẾT TẦNG THÁP
                  </span>
                  <h3
                    className="text-2xl md:text-3xl font-bold text-[#F2C14E] mt-2 leading-tight"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    {selectedFloor.title}
                  </h3>
                  <p className="text-xs text-[#FFE5A3] font-bold mt-1" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {selectedFloor.subtitle}
                  </p>
                </div>

                <div className="h-[1px] bg-gradient-to-r from-[#F2C14E]/60 to-transparent" style={{ width: '61.8%' }} />

                {/* Ý NGHĨA MẠN ĐÀ LA */}
                <div>
                  <h4 className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    <Sparkles className="w-4 h-4 text-[#F2C14E]" />
                    <span>Ý NGHĨA MẠN ĐÀ LA:</span>
                  </h4>
                  <p className="text-xs text-[#D3C0AD] leading-relaxed bg-[#1C130D] p-3 rounded-xl border border-[#F2C14E]/20" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {selectedFloor.mandalaMeaning}
                  </p>
                </div>

                {/* DANH SÁCH BẢO TƯỢNG */}
                <div>
                  <h4 className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    <Layers className="w-4 h-4 text-[#F2C14E]" />
                    <span>BẢO TƯỢNG TẠI KHU TẦNG:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedFloor.statues.map((statue, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-[#FFE5A3] bg-[#2A1D14] px-3 py-1.5 rounded-lg border border-[#F2C14E]/15" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F2C14E]" />
                        <span>{statue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CÂU CHUYỆN LIÊN QUAN */}
                <div>
                  <h4 className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    <BookOpen className="w-4 h-4 text-[#F2C14E]" />
                    <span>CÂU CHUYỆN LIÊN QUAN:</span>
                  </h4>
                  <p className="text-xs text-[#c9b896] leading-relaxed italic" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    "{selectedFloor.stories}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-[#c9b896]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                Nhấp chọn tầng tháp trên sơ đồ để xem chi tiết
              </div>
            )}
          </div>
        </div>

        {/* 33 ỨNG HÓA THÂN ĐỨC QUAN ÂM GRID & GIEO QUẺ 3D */}
        <div className="mt-12">
          <QuanAm33Grid />
        </div>
      </div>
    </div>
  );
};
