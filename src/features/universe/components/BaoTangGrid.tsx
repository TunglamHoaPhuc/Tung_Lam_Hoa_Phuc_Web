'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Calendar, Sparkles, X, ChevronRight, Image as ImageIcon, Flame, Layers } from 'lucide-react';
import { ArtisticStatueSection } from './ArtisticStatueSection';

interface ExhibitionTheme {
  id: string;
  title: string;
  period: string;
  season: string;
  description: string;
  timelineEvents: {
    yearOrDate: string;
    eventTitle: string;
    description: string;
    imgUrl: string;
    qrCodeText: string;
  }[];
}

const EXHIBITION_THEMES: ExhibitionTheme[] = [
  {
    id: 'theme-phat-dan',
    title: 'TRIỂN LÃM 1: ĐẠI LỄ PHẬT ĐẢN — ÁNH SÁNG GIÁC NGỘ',
    period: 'Tháng 4 Âm Lịch (Dịp Đại Lễ Phật Đản)',
    season: 'Chủ đề Mùa Xuân - Hè',
    description: 'Tái hiện cuộc đời Đức Phật Thích Ca Mâu Ni từ khi đản sinh dưới cây Vô Ưu tại Lâm Tỳ Ni cho đến khi thành đạo dưới cội Bồ Đề.',
    timelineEvents: [
      {
        yearOrDate: 'Lâm Tỳ Ni',
        eventTitle: 'Đức Bản Sư Sơ Sinh Bảy Bước Sen Vàng',
        description: 'Tôn tượng Đức Phật Sơ Sinh tay chỉ trời tay chỉ đất, dưới chân nở 7 đóa hoa sen mạ vàng lung linh.',
        imgUrl: 'https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=600&h=800&fit=crop',
        qrCodeText: 'https://tunglamhoaphuc.com/trien-lam/phat-dan-01',
      },
      {
        yearOrDate: 'Bồ Đề Đạo Tràng',
        eventTitle: 'Đức Phật Thích Ca Thành Đạo Cội Bồ Đề',
        description: 'Bảo tượng Ngài tọa thiền nhập định kiên cố dưới cội Bồ Đề, hàng phục ma quân chiến thắng phiền não.',
        imgUrl: 'https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=600&h=800&fit=crop',
        qrCodeText: 'https://tunglamhoaphuc.com/trien-lam/phat-dan-02',
      },
    ],
  },
  {
    id: 'theme-vu-lan',
    title: 'TRIỂN LÃM 2: VU LAN BÁO HIẾU — ĐẠO HIẾU TÂM LINH',
    period: 'Tháng 7 Âm Lịch (Dịp Đại Lễ Vu Lan)',
    season: 'Chủ đề Mùa Thu',
    description: 'Tôn vinh hạnh nguyện hiếu thảo của Tôn Giả Mục Kiền Liên và truyền thống tri ân cha mẹ tổ tiên của dân tộc Việt Nam.',
    timelineEvents: [
      {
        yearOrDate: 'Tháng 7 Âm Lịch',
        eventTitle: 'Tôn Giả Mục Kiền Liên Cứu Mẹ',
        description: 'Pho tượng gỗ nghệ thuật chạm khắc hình ảnh Tôn giả dâng bình bát cơm cứu mẫu thân thoát cảnh ngạ quỷ.',
        imgUrl: 'https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=600&h=800&fit=crop',
        qrCodeText: 'https://tunglamhoaphuc.com/trien-lam/vu-lan-01',
      },
    ],
  },
  {
    id: 'theme-truc-lam',
    title: 'TRIỂN LÃM 3: PHẬT HOÀNG TRẦN NHÂN TÔNG & THIỀN PHÁI TRÚC LÂM',
    period: 'Tháng 11 Âm Lịch (Dịp Kỷ Niệm Phật Hoàng)',
    season: 'Chủ đề Mùa Đông',
    description: 'Trưng bày các hiện vật di sản Thiền phái Trúc Lâm Yên Tử và công hạnh nhập thế hộ quốc an dân của Phật Hoàng Trần Nhân Tông.',
    timelineEvents: [
      {
        yearOrDate: 'Thế kỷ XIII',
        eventTitle: 'Phật Hoàng Trần Nhân Tông Xuất Gia Yên Tử',
        description: 'Tượng đá nguyên khối ghi dấu công hạnh Phật Hoàng Trần Nhân Tông cởi áo hoàng bào khoác áo nâu sồng.',
        imgUrl: 'https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=600&h=800&fit=crop',
        qrCodeText: 'https://tunglamhoaphuc.com/trien-lam/truc-lam-01',
      },
    ],
  },
];

const ARTISTIC_STATUES = [
  {
    name: 'ĐỨC PHẬT THÍCH CA RỜI NÚI KHỔ HẠNH',
    type: 'Nghệ Thuật Phật Giáo (Gỗ Mít Cổ)',
    description: 'Nghệ thuật chạm khắc tinh xảo khắc họa sự kiên trì nhẫn nại của Đức Phật trong 6 năm ép xác khổ hành.',
    imgUrl: 'https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=400&h=400&fit=crop',
  },
  {
    name: 'ĐỨC BẢN SƯ SƠ SINH BẢY BƯỚC SEN VÀNG',
    type: 'Nghệ Thuật Tạc Tượng Đồng Mạ Vàng',
    description: 'Tôn tượng Phật Sơ Sinh đứng trên đóa sen mạ vàng sáng lạn.',
    imgUrl: 'https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=400&h=400&fit=crop',
  },
  {
    name: 'BỒ TÁT CHUẨN ĐỀ NGHỆ THUẬT PHỎNG CỔ',
    type: 'Nghệ Thuật Sơn Son ThếP Vàng',
    description: 'Pho tượng Bồ Tát Chuẩn Đề nhiều tay mang pháp khí giải thoát.',
    imgUrl: 'https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=400&h=400&fit=crop',
  },
  {
    name: 'TIÊU DIỆN ĐẠI SỸ NGHỆ THUẬT MIỀN NAM',
    type: 'Nghệ Thuật Chạm Đá Tự Nhiên',
    description: 'Hình tướng uy nghi của Tiêu Diện Đại Sĩ hóa thân Quán Âm.',
    imgUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=400&fit=crop',
  },
];

export const BaoTangGrid: FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<ExhibitionTheme>(EXHIBITION_THEMES[0]);
  const [qrModalItem, setQrModalItem] = useState<{ title: string; qrCodeText: string; imgUrl: string } | null>(null);

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ── 1. NGHỆ THUẬT PHẬT GIÁO IN BẢO TÀNG (CHỦẨN GIAO DIỆN KHÔNG GIAN KHU VỰC) ── */}
        <div className="mb-14">
          <ArtisticStatueSection areaTitle="BẢO TÀNG PHẬT GIÁO" />
        </div>

        {/* ── 2. TRIỂN LÃM THEO CHỦ ĐỀ (TIMELINE & MÃ QR CODE) ── */}
        <div className="bg-[#1C130D] p-6 md:p-8 rounded-2xl border border-[#F2C14E]/40 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold text-[#F2C14E] bg-[#2A1D14] border border-[#F2C14E]/40 uppercase tracking-wider">
                CHƯƠNG TRÌNH TRIỂN LÃM HẰNG NĂM
              </span>
              <h2
                className="text-2xl md:text-3xl font-normal text-[#F2C14E] uppercase tracking-widest mt-1"
                style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
              >
                TRIỂN LÃM THEO CHỦ ĐỀ &amp; DÒNG THỜI GIAN
              </h2>
            </div>

            {/* Theme Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {EXHIBITION_THEMES.map((theme) => {
                const isSelected = selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#F2C14E] text-[#1C130D] border-white shadow-lg'
                        : 'bg-[#2A1D14] text-[#c9b896] border-[#F2C14E]/30 hover:border-[#F2C14E] hover:text-[#F2C14E]'
                    }`}
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    {theme.season}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Banner & Description */}
          <div className="bg-[#2C1C11] p-5 rounded-xl border border-[#F2C14E]/25 mb-8">
            <h3 className="text-xl font-bold text-[#F2C14E] mb-1" style={{ fontFamily: "'UTM Niagara', serif" }}>
              {selectedTheme.title}
            </h3>
            <p className="text-xs text-[#FFE5A3] font-bold mb-2" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              Thời gian: {selectedTheme.period}
            </p>
            <p className="text-xs text-[#D3C0AD] leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              {selectedTheme.description}
            </p>
          </div>

          {/* Timeline Events Gallery */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-[#F2C14E] uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
              <Calendar className="w-4 h-4 text-[#F2C14E]" />
              <span>DÒNG THỜI GIAN SỰ KIỆN TRIỂN LÃM &amp; MÃ QR KHÁM PHÁ:</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedTheme.timelineEvents.map((ev, idx) => (
                <div key={idx} className="bg-[#2A1D14] p-5 rounded-xl border border-[#F2C14E]/30 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden border border-[#F2C14E]/40 bg-black">
                    <img src={ev.imgUrl} alt={ev.eventTitle} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[10px] font-mono text-[#F2C14E] bg-[#1C130D] px-2 py-0.5 rounded border border-[#F2C14E]/20">
                      {ev.yearOrDate}
                    </span>
                    <h5 className="text-lg font-bold text-[#F2C14E] mt-1 leading-snug" style={{ fontFamily: "'UTM Niagara', serif" }}>
                      {ev.eventTitle}
                    </h5>
                    <p className="text-xs text-[#c9b896] line-clamp-2 my-1.5" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                      {ev.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => setQrModalItem({ title: ev.eventTitle, qrCodeText: ev.qrCodeText, imgUrl: ev.imgUrl })}
                      className="px-3 py-1.5 rounded-lg bg-[#F2C14E]/15 border border-[#F2C14E]/40 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1C130D] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 mt-2"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Quét Mã QR Đọc Câu Chuyện</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR CODE POPUP MODAL */}
      <AnimatePresence>
        {qrModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setQrModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[420px] rounded-2xl overflow-hidden p-6 text-center"
              style={{
                background: 'linear-gradient(160deg, #2C1C11 0%, #1A120B 100%)',
                border: '2px solid rgba(242,193,78,0.6)',
                boxShadow: '0 0 60px rgba(242,193,78,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setQrModalItem(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <QrCode className="w-12 h-12 text-[#F2C14E] mx-auto mb-2" />
              <h3 className="text-xl font-bold text-[#F2C14E] mb-1" style={{ fontFamily: "'UTM Niagara', serif" }}>
                {qrModalItem.title}
              </h3>
              <p className="text-xs text-[#c9b896] mb-4" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                Quét mã QR bằng điện thoại để xem ảnh chi tiết &amp; nghe thuyết minh câu chuyện
              </p>

              <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto border-4 border-[#F2C14E] shadow-2xl flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrModalItem.qrCodeText)}`}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-[11px] text-[#FFE5A3] font-mono mt-4 truncate px-2 bg-[#1C130D] py-1.5 rounded border border-[#F2C14E]/20">
                {qrModalItem.qrCodeText}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
