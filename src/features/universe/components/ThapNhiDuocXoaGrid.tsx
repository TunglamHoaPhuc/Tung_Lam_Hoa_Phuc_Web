'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';
import { THAP_NHI_DUOC_XOA_FULL_DATA, ThapNhiDuocXoaItem } from '@/data/thapNhiDuocXoaData';
import { ZodiacGoldIcon } from '@/components/common/ZodiacGoldIcon';

export const ThapNhiDuocXoaGrid: FC = () => {
  const [selectedItem, setSelectedItem] = useState<ThapNhiDuocXoaItem | null>(null);

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* SECTION HEADER: ICON & TIÊU ĐỀ */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 flex items-center justify-center" aria-hidden="true">
            <img
              src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
              alt="Thập Nhị Dược Xoa"
              className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(242,193,78,0.95)] scale-135 transform-gpu"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
              }}
            />
          </div>

          <div className="flex items-center justify-center w-full gap-0 mb-3">
            <div className="flex-1 flex items-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
            </div>

            <h2
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
              className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#ffde59] uppercase tracking-widest drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-4 sm:px-6 md:px-8"
            >
              BẢO TƯỢNG THẬP NHỊ DƯỢC XOA ĐẠI TƯỚNG
            </h2>

            <div className="flex-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
              <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#FFE5A3]/90 max-w-3xl leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            12 Vị Dược Xoa Đại Tướng • Thủ Hộ Thần 12 Con Giáp &amp; Hóa Thân Chư Phật Bồ Tát (Kinh Dược Sư Bổn Nguyện Công Đức)
          </p>
        </div>

        {/* 12 DƯỢC XOA GRID: 6 TRÊN, 6 DƯỚI (grid-cols-2 md:grid-cols-3 lg:grid-cols-6) */}
        {/* MẶC ĐỊNH CHỈ HIỆN ẢNH FULL-FRAME, RÊ CHUỘT VÀO MỚI HIỆN TÊN + TỶ LỆ CÂN ĐỐI */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {THAP_NHI_DUOC_XOA_FULL_DATA.map((item) => (
            <div
              key={item.code}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-2xl border border-[#F2C14E]/35 bg-[#1C130D] hover:border-[#F2C14E] transition-all duration-500 shadow-xl cursor-pointer overflow-hidden flex flex-col hover:-translate-y-1.5 transform-gpu h-[270px] sm:h-[290px]"
            >
              {/* FULL BLEED STATUE IMAGE (NO INITIAL TEXT) */}
              <div className="relative w-full h-full bg-[#1A120B] overflow-hidden">
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
                  }}
                />

                {/* Subtle top-gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* ZODIAC BADGE: TOP-RIGHT */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <ZodiacGoldIcon sign={item.zodiacSign} className="scale-90" />
                </div>
              </div>

              {/* CAPTION BLOCK: OPACITY 0 DEFAULT, SLIDES UP ON HOVER */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1C130D] via-[#1C130D]/95 to-transparent pt-8 pb-3 px-2.5 text-center flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 pointer-events-none group-hover:pointer-events-auto">
                <div className="space-y-1 w-full translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  {/* TITLE: UTM Niagara */}
                  <h3
                    className="text-[#F2C14E] text-xl sm:text-2xl font-normal leading-tight line-clamp-1 group-hover:text-white transition-colors"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    {item.title}
                  </h3>

                  {/* SUBTITLE WITH ZODIAC ICON */}
                  <p
                    className="text-[#FFE5A3] text-[10px] font-medium line-clamp-1 flex items-center justify-center gap-1"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <ZodiacGoldIcon sign={item.zodiacSign} className="text-[10px] py-0 px-1" />
                    <span className="truncate">{item.subtitle}</span>
                  </p>

                  {/* BUTTON */}
                  <div className="pt-2">
                    <span
                      className="px-4 py-1 rounded-full text-[10px] font-bold text-[#1C130D] bg-gradient-to-r from-[#F2C14E] via-[#E5A93B] to-[#F2C14E] shadow-[0_4px_12px_rgba(242,193,78,0.5)] inline-flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      XEM CHI TIẾT ➔
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/25 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl md:max-w-4xl rounded-3xl overflow-hidden p-6 md:p-8 my-auto text-left"
              style={{
                background: 'linear-gradient(160deg, #2C1C11 0%, #1D120B 100%)',
                border: '2px solid rgba(242, 193, 78, 0.65)',
                boxShadow: '0 0 70px rgba(242, 193, 78, 0.25), inset 0 0 30px rgba(0, 0, 0, 0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1C130D]/80 border border-[#F2C14E]/40 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#F2C14E]/20 transition-all shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* IMAGE CONTAINER */}
                <div className="w-full md:w-[38%] shrink-0 rounded-2xl overflow-hidden border-2 border-[#F2C14E]/60 bg-black/60 p-3 shadow-2xl relative self-stretch flex items-center justify-center">
                  <img
                    src={selectedItem.imgUrl}
                    alt={selectedItem.title}
                    className="w-full h-auto max-h-[340px] md:max-h-[420px] object-cover rounded-xl shadow-inner"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-xl border border-[#F2C14E]/20" />
                </div>

                {/* CONTENT CONTAINER */}
                <div className="w-full md:w-[62%] flex-1 min-w-0 text-left space-y-3.5">
                  {/* BADGES & ZODIAC SIGN */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-bold text-[#F2C14E] bg-[#1C130D] border border-[#F2C14E]/40 uppercase tracking-wider inline-block shadow-sm"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {selectedItem.code} • {selectedItem.timePeriod}
                    </span>
                    <ZodiacGoldIcon sign={selectedItem.zodiacSign} className="py-1 px-2.5 text-xs" />
                  </div>

                  {/* TITLE */}
                  <h3
                    className="text-3xl md:text-4xl font-normal text-[#F2C14E] leading-snug tracking-wide"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    {selectedItem.title}
                  </h3>

                  {/* SUBTITLE */}
                  <p
                    className="text-xs sm:text-sm text-[#FFE5A3]/90 font-semibold leading-relaxed"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    {selectedItem.subtitle}
                  </p>

                  {/* INCARNATION & GUARDIAN INFO */}
                  <div className="space-y-1.5 bg-[#1C130D]/80 p-3.5 rounded-xl border border-[#F2C14E]/30 text-xs text-[#FFE5A3]">
                    <p><span className="text-[#F2C14E] font-bold">Hóa Thân:</span> {selectedItem.incarnation}</p>
                    <p><span className="text-[#F2C14E] font-bold">Thủ Hộ Thần:</span> {selectedItem.guardianSign}</p>
                    <p><span className="text-[#F2C14E] font-bold">Chất Liệu:</span> {selectedItem.material}</p>
                  </div>

                  {/* FULL HISTORY HTML */}
                  <div
                    className="text-xs sm:text-sm text-[#D3C0AD] leading-relaxed font-normal space-y-2"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <p>{selectedItem.fullHistoryHtml}</p>
                  </div>

                  {/* MEANING BOX */}
                  <div
                    className="bg-[#1C130D]/90 p-4 rounded-xl border border-[#F2C14E]/30 text-xs sm:text-sm text-[#FFE5A3] italic leading-relaxed shadow-sm"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    <span className="not-italic font-bold text-[#F2C14E] block mb-1">Ý Nghĩa &amp; Công Đức:</span>
                    "{selectedItem.meaning}"
                  </div>

                  {/* SOURCE */}
                  <div className="pt-1">
                    <p
                      className="text-[11px] text-[#c9b896]/70 italic tracking-wide"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      Nguồn tư liệu: {selectedItem.source}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
