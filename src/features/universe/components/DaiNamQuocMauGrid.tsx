'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { AN_TRIEU_NGUYEN_LIST, AnTrieuNguyenItem } from '@/data/anTrieuNguyenData';

export const DaiNamQuocMauGrid: FC = () => {
  const [selectedSeal, setSelectedSeal] = useState<AnTrieuNguyenItem | null>(null);

  // Sắp xếp các Ấn theo thứ tự năm tăng dần (thời gian tăng dần)
  const sortedSeals = [...AN_TRIEU_NGUYEN_LIST].sort((a, b) => a.yearNumber - b.yearNumber);

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* DIVIDER LINE LIKE TO DUONG SECTION */}
        <div className="w-full border-t mb-8 md:mb-10" style={{ borderColor: 'rgba(242, 193, 78, 0.2)' }} />

        {/* HEADER */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-3.5 py-1 rounded-full text-[11px] font-bold text-[#F2C14E] bg-[#1C130D] border border-[#F2C14E]/40 uppercase tracking-wider"
              style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
            >
              ĐẠI NAM QUỐC MẪU (NHÀ MẪU)
            </span>
          </div>
          <h2
            className="text-2xl md:text-4xl font-normal text-[#F2C14E] uppercase tracking-widest mb-1 leading-tight"
            style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
          >
            BẢO VẬT 12 ẤN TRIỀU VUA THỜI NGUYỄN
          </h2>
          <p className="text-xs md:text-sm text-[#c9b896] leading-relaxed" style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}>
            Trưng bày hình ảnh &amp; ý nghĩa lịch sử của 12 chiếc ấn vàng, ngọc tỷ quý giá thuộc Triều Nguyễn (mô hình phỏng cổ)
          </p>
        </div>

        {/* SEALS GRID (Sorted Chronologically) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {sortedSeals.map((seal) => (
            <div
              key={seal.id}
              onClick={() => setSelectedSeal(seal)}
              className="group relative rounded-2xl border border-[#F2C14E]/35 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-500 shadow-2xl cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 transform-gpu h-[340px]"
            >
              {/* 1. FULL-BLEED IMAGE FRAME (No inner padding, zero exposed image border, 57% Height Ratio) */}
              <div className="relative w-full h-[195px] bg-[#1A120B] overflow-hidden shrink-0">
                <img
                  src={seal.imgUrl}
                  alt={seal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/bao_tuong_phat_giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#25170E] via-transparent to-black/40 pointer-events-none" />

                {/* Code Badge: Top-Left */}
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-[#F2C14E] bg-[#1C130D]/90 border border-[#F2C14E]/50 shadow-md backdrop-blur-sm z-10"
                  style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
                >
                  {seal.codeNumber}
                </div>
              </div>

              {/* 2. CAPTION AREA WITH SPACIOUS AIRY HOVER SPACING (43% Height ~ 145px) */}
              <div className="relative flex-1 bg-gradient-to-b from-[#25170E] to-[#1C130D] flex flex-col justify-between">
                {/* ANIMATED WRAPPER: Moves UP on hover together (Line, Center Logo, Title, Subtitle) */}
                <div className="w-full flex-1 flex flex-col items-center justify-center relative pt-5 pb-2 px-3 transition-transform duration-500 ease-out transform-gpu group-hover:-translate-y-6">
                  
                  {/* HORIZONTAL DIVIDER LINE (Passes through exact vertical center of circle logo) */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-transparent z-20" />

                  {/* FLOATING CIRCULAR GOLD LOGO (Positioned at top-0 -translate-y-1/2, z-30 so NOT clipped) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1A120B] border-2 border-[#F2C14E] p-1 flex items-center justify-center shadow-[0_0_18px_rgba(242,193,78,0.75)] overflow-hidden">
                    <img
                      src="/images/icon-minh-hoa/bieu-tuong-bao-vat-phat-giao.png"
                      alt="Bảo Vật Triều Nguyễn"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(242,193,78,0.95)] scale-145 sm:scale-150 transform-gpu"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/icon-minh-hoa/bieu-tuong-bao-tuong-phat-giao.png';
                      }}
                    />
                  </div>

                  {/* TITLE & TIME PERIOD */}
                  <div className="text-center space-y-1 my-auto w-full pt-1">
                    <h3
                      className="text-[#F2C14E] text-2xl md:text-3xl font-normal leading-snug group-hover:text-white transition-colors line-clamp-2 px-1"
                      style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
                    >
                      {seal.title}
                    </h3>
                    <p
                      className="text-[#FFE5A3] text-xs font-medium line-clamp-1"
                      style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
                    >
                      {seal.timePeriod}
                    </p>
                  </div>
                </div>

                {/* HOVER ACTION BUTTON: Airy spacing from both text and bottom border */}
                <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2.5 group-hover:translate-y-0 transition-all duration-500 ease-out z-20 pointer-events-none group-hover:pointer-events-auto">
                  <span
                    className="px-5 py-1.5 rounded-full text-xs font-bold text-[#1C130D] bg-gradient-to-r from-[#F2C14E] via-[#E5A93B] to-[#F2C14E] shadow-[0_4px_15px_rgba(242,193,78,0.5)] flex items-center gap-1.5 uppercase tracking-wider cursor-pointer font-sans hover:brightness-110"
                    style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
                  >
                    XEM CHI TIẾT ➔
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP DETAIL MODAL */}
      <AnimatePresence>
        {selectedSeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/25 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={() => setSelectedSeal(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl md:max-w-4xl rounded-3xl overflow-hidden p-6 md:p-8 my-auto"
              style={{
                background: 'linear-gradient(160deg, #2C1C11 0%, #1D120B 100%)',
                border: '2px solid rgba(242, 193, 78, 0.65)',
                boxShadow: '0 0 70px rgba(242, 193, 78, 0.25), inset 0 0 30px rgba(0, 0, 0, 0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedSeal(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1C130D]/80 border border-[#F2C14E]/40 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#F2C14E]/20 transition-all shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Layout: Golden Ratio balance (Image ~38%, Content ~62%) */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Image Container (38% Golden Ratio) */}
                <div className="w-full md:w-[38%] shrink-0 rounded-2xl overflow-hidden border-2 border-[#F2C14E]/60 bg-black/60 p-3 shadow-2xl relative self-stretch flex items-center justify-center">
                  <img
                    src={selectedSeal.imgUrl}
                    alt={selectedSeal.title}
                    className="w-full h-auto max-h-[340px] md:max-h-[420px] object-cover rounded-xl shadow-inner"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/bao_tuong_phat_giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam.jpg';
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-xl border border-[#F2C14E]/20" />
                </div>

                {/* Content Container (62% Golden Ratio) */}
                <div className="w-full md:w-[62%] flex-1 min-w-0 text-left space-y-3.5">
                  {/* Badge: Code Number (UTM Avo Bold) */}
                  <div>
                    <span
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F2C14E] bg-[#1C130D] border border-[#F2C14E]/40 uppercase tracking-wider inline-block shadow-sm"
                      style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
                    >
                      {selectedSeal.codeNumber} • {selectedSeal.timePeriod}
                    </span>
                  </div>

                  {/* Title: UTM Niagara, NOT Bold, Larger */}
                  <h3
                    className="text-3xl md:text-4xl font-normal text-[#F2C14E] leading-snug tracking-wide"
                    style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
                  >
                    {selectedSeal.title}
                  </h3>

                  {/* Material: UTM Avo Regular (NOT Bold) */}
                  <p
                    className="text-xs sm:text-sm text-[#FFE5A3]/90 font-normal leading-relaxed"
                    style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
                  >
                    <span className="text-[#F2C14E]/80">Chất liệu:</span> {selectedSeal.material}
                  </p>

                  {/* Golden Ratio Gradient Divider (61.8% width) */}
                  <div
                    className="h-[1px] bg-gradient-to-r from-[#F2C14E]/70 via-[#F2C14E]/30 to-transparent my-3"
                    style={{ width: '61.8%' }}
                  />

                  {/* Description / Full History */}
                  <div
                    className="text-xs sm:text-sm text-[#D3C0AD] leading-relaxed font-normal space-y-2"
                    style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
                  >
                    <p>{selectedSeal.fullHistoryHtml}</p>
                  </div>

                  {/* Meaning Box */}
                  <div
                    className="bg-[#1C130D]/90 p-4 rounded-xl border border-[#F2C14E]/30 text-xs sm:text-sm text-[#FFE5A3] italic leading-relaxed shadow-sm mt-3"
                    style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
                  >
                    <span className="not-italic font-bold text-[#F2C14E] block mb-1">Ý nghĩa lịch sử &amp; tâm linh:</span>
                    "{selectedSeal.meaning}"
                  </div>

                  {/* Source */}
                  <div className="pt-1">
                    <p
                      className="text-[11px] text-[#c9b896]/70 italic tracking-wide"
                      style={{ fontFamily: "'UTM Avo', 'UTM_Avo', sans-serif" }}
                    >
                      Nguồn tư liệu: {selectedSeal.source}
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
