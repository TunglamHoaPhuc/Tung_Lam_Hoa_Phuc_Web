'use client';

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { THAP_BAT_LA_HAN_DATA, ThapBatLaHanItem } from '@/data/thapBatLaHanData';

export const ThapBatLaHanGrid: FC = () => {
  const [selectedItem, setSelectedItem] = useState<ThapBatLaHanItem | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative w-full py-10 md:py-14 overflow-hidden bg-transparent transform-gpu">
      {/* ── TOP HEADER BACKGROUND IMAGE ONLY WITH LEFT & RIGHT GRADIENT MASKS ── */}
      <div className="absolute top-8 inset-x-0 h-[360px] z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/vu-tru-phat-giao/toan-canh-chua.jpg"
          alt="Toàn cảnh chùa"
          className="w-full h-full object-cover opacity-12 filter blur-[2px] scale-105"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
          }}
        />
        <div className="absolute inset-0 bg-[#2C1C11]/35" />
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/90 to-transparent" />
        <div className="absolute left-0 inset-y-0 w-32 sm:w-48 bg-gradient-to-r from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
        <div className="absolute right-0 inset-y-0 w-32 sm:w-48 bg-gradient-to-l from-[#2C1C11] via-[#2C1C11]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 flex items-center justify-center" aria-hidden="true">
            <img
              src="/images/icon-minh-hoa/bieu-tuong-tuong-phap.png"
              alt="Thập Bát La Hán"
              className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(242,193,78,0.95)] scale-135 transform-gpu"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/bieu-tuong-tuong-phap.svg';
              }}
            />
          </div>

          <div className="flex items-center justify-center w-full gap-0 mb-2 max-w-5xl mx-auto">
            <div className="flex-1 flex items-center">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
            </div>

            <h2
              style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM Classizism Antiqua', serif" }}
              className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#ffde59] uppercase tracking-widest drop-shadow-[0_0_18px_rgba(255,222,89,0.8)] whitespace-nowrap px-4 sm:px-6 md:px-8"
            >
              BẢO TƯỢNG THẬP BÁT LA HÁN
            </h2>

            <div className="flex-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59] flex-shrink-0" />
              <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#c8aa6e]/60 to-[#f2cc8f]" />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#FFE5A3]/90 max-w-3xl leading-relaxed font-normal" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
            Nghệ thuật Phật giáo bằng gỗ mít
          </p>
        </div>

        {/* 18 LA HÁN GRID WITH EXACT 2-ROW INITIAL VIEW & PEEKING 3RD ROW BEHIND SMOOTH GRADIENT MASK */}
        <div className="relative">
          <div
            className={`transition-all duration-500 ${!isExpanded ? 'max-h-[560px] sm:max-h-[600px] overflow-hidden' : 'max-h-[3000px] overflow-visible'}`}
            style={!isExpanded ? {
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.35) 82%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.35) 82%, rgba(0,0,0,0) 100%)',
            } : undefined}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
              {THAP_BAT_LA_HAN_DATA.map((item) => (
                <div
                  key={item.code}
                  onClick={() => setSelectedItem(item)}
                  className="group relative rounded-2xl border border-[#F2C14E]/35 hover:border-[#ffde59] transition-all duration-300 shadow-xl cursor-pointer overflow-hidden bg-[#1C130D] h-[260px] sm:h-[290px] w-full"
                >
                  {/* FULL BLEED IMAGE */}
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/vu-tru-phat-giao/toan-canh-chua.jpg';
                    }}
                  />

                  {/* Soft gradient fade at bottom of card */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1C130D]/95 via-[#1C130D]/40 to-transparent pointer-events-none" />

                  {/* HOVER OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#25170E]/95 via-[#3D2817]/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2.5 text-center pointer-events-none z-20">
                    <div className="absolute inset-2.5 rounded-xl border border-[#ffde59]/70 bg-[#452a15]/95 flex flex-col items-center justify-center p-2.5 text-center shadow-[0_0_20px_rgba(242,193,78,0.3)]">
                      <h3
                        style={{ fontFamily: "'UTM ClassizismAntiqua', 'UTM_ClassizismAntiqua', serif" }}
                        className="text-white font-normal uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-snug text-xs sm:text-sm text-center line-clamp-2"
                      >
                        {item.name}
                      </h3>

                      <div className="w-10 h-[2px] bg-[#ffde59] my-1.5 shadow-[0_0_8px_#ffde59]" />

                      <p
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-[#FFE5A3] text-[10px] sm:text-[11px] font-semibold leading-tight tracking-wide text-center line-clamp-2"
                      >
                        {item.sanskritName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GRADIENT OVERLAY WITH PEEKING 3RD ROW & XEM THÊM BUTTON WHEN COLLAPSED */}
          {!isExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-64 sm:h-72 bg-gradient-to-t from-[#2C1C11] via-[#2C1C11]/95 via-35% via-[#2C1C11]/60 via-70% to-transparent pointer-events-none flex items-end justify-center pb-3 sm:pb-4 z-20">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="pointer-events-auto px-8 py-3.5 bg-gradient-to-r from-[#54361e] via-[#6B4B2A] to-[#54361e] hover:from-[#6B4B2A] hover:via-[#8B6439] hover:to-[#6B4B2A] border-2 border-[#f2c14e] hover:border-[#ffde59] text-[#ffde59] hover:text-white font-bold text-xs sm:text-sm rounded-2xl transition-all duration-300 shadow-[0_8px_28px_rgba(0,0,0,0.85)] flex items-center gap-3 cursor-pointer uppercase tracking-wider transform hover:-translate-y-0.5"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <span>XEM TẤT CẢ 18 VỊ THẬP BÁT LA HÁN (+6 VỊ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* COLLAPSE BUTTON WHEN EXPANDED */}
          {isExpanded && (
            <div className="w-full flex justify-center mt-8 z-20">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-6 py-2.5 bg-[#1C120B] border border-[#F2C14E]/60 text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#1C120B] font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                <span>THU GỌN THẬP BÁT LA HÁN</span>
                <span className="text-xs">▲</span>
              </button>
            </div>
          )}
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
              className="relative w-full max-w-2xl rounded-3xl overflow-hidden p-6 md:p-8 my-auto text-left"
              style={{
                background: 'linear-gradient(160deg, #2C1C11 0%, #1D120B 100%)',
                border: '2px solid rgba(242, 193, 78, 0.65)',
                boxShadow: '0 0 70px rgba(242, 193, 78, 0.25)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1C130D]/80 border border-[#F2C14E]/40 flex items-center justify-center text-white/80 hover:text-white shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-[45%] shrink-0 rounded-2xl overflow-hidden border-2 border-[#F2C14E]/60 bg-black/60 p-2 shadow-2xl">
                  <img
                    src={selectedItem.imgUrl}
                    alt={selectedItem.name}
                    className="w-full h-auto max-h-[320px] object-cover rounded-xl"
                  />
                </div>

                <div className="w-full md:w-[55%] space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-[#F2C14E] bg-[#1C130D] border border-[#F2C14E]/40 uppercase tracking-wider inline-block">
                    {selectedItem.code} • THẬP BÁT LA HÁN
                  </span>
                  <h3 className="text-3xl font-normal text-[#F2C14E]" style={{ fontFamily: "'UTM Niagara', serif" }}>
                    {selectedItem.name}
                  </h3>
                  <p className="text-xs text-[#FFE5A3]/90 font-semibold">{selectedItem.sanskritName}</p>
                  <div className="h-[1px] bg-gradient-to-r from-[#F2C14E]/70 via-[#F2C14E]/30 to-transparent my-2" />
                  <p className="text-xs text-[#D3C0AD] leading-relaxed" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                    {selectedItem.meaning}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
