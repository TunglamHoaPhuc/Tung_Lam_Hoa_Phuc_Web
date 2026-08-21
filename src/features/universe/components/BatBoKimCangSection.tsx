'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { BAT_BO_KIM_CANG_DATA, BatBoKimCangItem } from '@/data/batBoKimCangData';

export const BatBoKimCangSection: FC = () => {
  const [selectedStatue, setSelectedStatue] = useState<BatBoKimCangItem | null>(null);

  return (
    <div className="w-full py-8 md:py-12 relative overflow-hidden bg-transparent">
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center" aria-hidden="true">
          <img
            src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
            alt="Bát Bộ Kim Cang"
            className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(242,193,78,0.95)] scale-135 transform-gpu"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
            }}
          />
        </div>

        <div className="flex items-center justify-center w-full gap-0 mb-2 max-w-5xl mx-auto px-4">
          <div className="flex-1 flex items-center">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
            <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
          </div>

          <h2
            style={{ fontFamily: "'UTM Niagara', 'UTM_Niagara', serif" }}
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#ffde59] uppercase tracking-wider drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-4 sm:px-8"
          >
            BÁT BỘ KIM CANG
          </h2>

          <div className="flex-1 flex items-center">
            <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
            <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
          </div>
        </div>

        <p
          className="text-xs sm:text-sm text-[#FFE5A3]/90 font-medium tracking-wide max-w-2xl mx-auto px-4"
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
        >
          8 Vị Hộ Pháp Kim Cang Thần Vương • Uy Lực Hộ Trì Chánh Pháp &amp; Bảo Vệ Đàn Tràng Tam Bảo
        </p>
      </div>

      {/* ── 8 STATUES ROW GRID ── */}
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
          {BAT_BO_KIM_CANG_DATA.map((item, idx) => (
            <div
              key={item.id || item.code || idx}
              onClick={() => setSelectedStatue(item)}
              className="group relative rounded-2xl border border-[#F2C14E]/35 bg-[#25170E] hover:border-[#F2C14E] transition-all duration-300 shadow-xl cursor-pointer overflow-hidden flex flex-col justify-between h-[320px] sm:h-[350px] transform-gpu hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(242,193,78,0.25)]"
            >
              {/* IMAGE FRAME */}
              <div className="relative w-full h-[240px] sm:h-[265px] overflow-hidden bg-[#1A120B] shrink-0">
                <img
                  src={item.imgUrl}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-[center_20%] group-hover:scale-108 transition-transform duration-700 transform-gpu filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.8)]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
                  }}
                />

                {/* Subtle vignette gradient */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, rgba(37,23,14,0.95) 0%, transparent 60%)",
                  }}
                />

                {/* Number Badge Top-Left */}
                <div className="absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-full bg-[#1C130D]/90 border border-[#F2C14E]/60 flex items-center justify-center text-[10px] font-bold text-[#FFDE59] shadow-md">
                  {idx + 1}
                </div>
              </div>

              {/* CAPTION BOX WITH HOVER REVEAL */}
              <div className="absolute inset-x-0 bottom-0 z-20 transition-transform duration-500 ease-out translate-y-[28px] group-hover:translate-y-0 transform-gpu">
                {/* 1px Golden Line */}
                <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent z-30 opacity-90 shadow-[0_0_8px_rgba(242,193,78,0.5)]" />

                {/* Content Box */}
                <div className="relative w-full bg-gradient-to-b from-[#25170E] to-[#1C130D] px-2 pt-3.5 pb-2.5 text-center flex flex-col items-center justify-start">
                  {/* Miniature Floating Emblem */}
                  <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 z-40 w-7 h-7 rounded-full border border-[#F2C14E] bg-[#25170E] flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(242,193,78,0.7)] overflow-hidden">
                    <img
                      src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
                      alt=""
                      className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(242,193,78,0.9)] scale-135"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="w-full flex flex-col items-center mt-0.5 shrink-0">
                    <h3
                      className="text-[#F2C14E] text-base sm:text-lg font-normal tracking-wide uppercase group-hover:text-white transition-colors line-clamp-1 mb-0.5"
                      style={{ fontFamily: "'UTM Niagara', serif" }}
                    >
                      {item.name}
                    </h3>

                    <p
                      className="text-[#FFE5A3]/90 text-[9px] sm:text-[10px] font-bold line-clamp-1"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {item.sanskritName}
                    </p>
                  </div>

                  {/* Hover Button */}
                  <div className="w-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center shrink-0">
                    <span
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-[9px] uppercase shadow-md hover:brightness-110 transition-all cursor-pointer"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      <span>CHI TIẾT</span>
                      <span>➔</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── POPUP DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedStatue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/25 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={() => setSelectedStatue(null)}
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
                onClick={() => setSelectedStatue(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1C130D]/80 border border-[#F2C14E]/40 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#F2C14E]/20 transition-all shadow-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* IMAGE CONTAINER */}
                <div className="w-full md:w-[40%] shrink-0 rounded-2xl overflow-hidden border-2 border-[#F2C14E]/60 bg-black/60 p-3 shadow-2xl relative self-stretch flex items-center justify-center">
                  <img
                    src={selectedStatue.imgUrl}
                    alt={selectedStatue.name}
                    className="w-full h-auto max-h-[360px] md:max-h-[440px] object-cover rounded-xl shadow-inner"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-xl border border-[#F2C14E]/20" />
                </div>

                {/* CONTENT CONTAINER */}
                <div className="w-full md:w-[60%] flex-1 min-w-0 text-left space-y-4">
                  {/* BADGES */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-bold text-[#F2C14E] bg-[#1C130D] border border-[#F2C14E]/40 uppercase tracking-wider inline-block shadow-sm"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      BÁT BỘ KIM CANG
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-[#FFE5A3] bg-[#3a2718] border border-[#F2C14E]/30"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      {selectedStatue.sanskritName}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#F2C14E] leading-snug tracking-wide uppercase"
                    style={{ fontFamily: "'UTM Niagara', serif" }}
                  >
                    {selectedStatue.name}
                  </h3>

                  {/* MEANING / BỔN NGUYỆN */}
                  <p
                    className="text-xs sm:text-sm text-[#FFE5A3]/90 font-semibold leading-relaxed"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  >
                    {selectedStatue.meaning}
                  </p>

                  {/* KHU VỰC PHỐI THỜ */}
                  <div className="space-y-1.5 bg-[#1C130D]/80 p-3.5 rounded-xl border border-[#F2C14E]/30 text-xs text-[#FFE5A3]">
                    <p><span className="text-[#F2C14E] font-bold">Danh Hiệu Phạn Hán:</span> {selectedStatue.sanskritName}</p>
                    <p><span className="text-[#F2C14E] font-bold">Khu Vực Tôn Thờ:</span> {selectedStatue.areaName || 'Khu Vực Tam Bảo (Chánh Điện)'}</p>
                  </div>

                  {/* QUOTE BOX */}
                  {selectedStatue.quote && (
                    <div
                      className="bg-[#1C130D]/90 p-4 rounded-xl border border-[#F2C14E]/30 text-xs sm:text-sm text-[#FFE5A3] italic leading-relaxed shadow-sm"
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    >
                      <span className="not-italic font-bold text-[#F2C14E] block mb-1">Hạnh Nguyện Kim Cang:</span>
                      &ldquo;{selectedStatue.quote}&rdquo;
                      {selectedStatue.quoteAuthor && (
                        <span className="block not-italic text-right text-[11px] text-[#F2C14E]/80 mt-1">
                          — {selectedStatue.quoteAuthor}
                        </span>
                      )}
                    </div>
                  )}

                  {/* FULL HISTORY / DESCRIPTION */}
                  <div
                    className="text-xs sm:text-sm text-[#D3C0AD] leading-relaxed font-normal space-y-2 text-justify"
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    dangerouslySetInnerHTML={{
                      __html: selectedStatue.fullHistoryHtml || `<p>${selectedStatue.description}</p>`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
