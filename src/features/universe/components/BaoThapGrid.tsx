'use client';

import React, { FC, useState } from 'react';
import Image from 'next/image';
import { Compass, Sparkles, Layers, Eye } from 'lucide-react';
import { BaoThapMap2D } from './BaoThapMap2D';
import { QuanAm33Grid } from './QuanAm33Grid';
import { BAO_THAP_FLOORS } from '@/data/bao-thap-data';

export const BaoThapGrid: FC = () => {
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-16">
        {/* ── 1. 33 ỨNG HÓA THÂN CỦA ĐỨC QUAN ÂM BỒ TÁT (GIEO QUẺ QUAN ÂM) ── */}
        <section id="gieo-que-quan-am" className="pt-2">
          <QuanAm33Grid />
        </section>

        {/* ── 2. HERO BANNER: SƠ ĐỒ 2D BẢO THÁP VẠN PHẬT XÁ LỢI HÒA BÌNH ── */}
        <section id="so-do-bao-thap-banner" className="scroll-mt-24 relative w-full pt-4">
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[380px] sm:min-h-[460px] flex items-center justify-center text-center p-6 sm:p-12 border-y border-[#c8aa6e]/40 overflow-hidden bg-[#120a06] group">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-45 scale-105 transition-transform duration-1000 ease-out group-hover:scale-100">
              <Image
                src="/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg"
                alt="Sơ đồ 2D Bảo Tháp Vạn Phật Xá Lợi Hòa Bình"
                fill
                sizes="100vw"
                className="object-cover object-center"
                loading="lazy"
                onError={(e) => {
                  (e.target as any).src = '/images/toan-canh-chua.jpg';
                }}
              />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2c1c11]/90 via-[#120a06]/70 to-[#2c1c11]/90" />
            <div className="absolute inset-0 bg-black/35" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-3 sm:space-y-4 px-4">
              <span
                style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                className="text-2xl sm:text-3xl font-normal text-[#e3d2c1] block tracking-wide opacity-90"
              >
                Sơ đồ 2D tương tác
              </span>

              <h2
                style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_2px_20px_rgba(255,222,89,0.7)] py-1 leading-tight"
              >
                BẢO THÁP VẠN PHẬT XÁ LỢI HÒA BÌNH
              </h2>

              <p
                style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                className="text-base sm:text-2xl font-normal text-[#f2cc8f] tracking-widest uppercase py-1 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
              >
                NƠI TINH HOA HỘI TỤ
              </p>

              <div className="pt-3 sm:pt-5">
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                  className="inline-flex items-center justify-center border border-[#c8aa6e]/80 bg-[#2a1a0e]/90 hover:bg-[#ffde59] text-[#ffde59] hover:text-[#2c1c11] font-normal px-8 sm:px-10 py-2.5 sm:py-3.5 rounded-xl transition-all duration-300 shadow-2xl group/btn uppercase text-sm sm:text-base tracking-wider backdrop-blur-xs cursor-pointer transform hover:scale-105"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  <span>KHÁM PHÁ SƠ ĐỒ BẢO THÁP</span>
                  <span className="ml-2 group-hover/btn:translate-x-1.5 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 3. FULLSCREEN INTERACTIVE 2D BAO THAP MAP MODAL ── */}
      {isMapOpen && <BaoThapMap2D onClose={() => setIsMapOpen(false)} />}
    </div>
  );
};
