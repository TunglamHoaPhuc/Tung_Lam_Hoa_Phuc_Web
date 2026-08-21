'use client';

import React, { FC, useState } from 'react';
import Image from 'next/image';
import { HeritageMap2D } from './heritage-map/HeritageMap2D';
import { Compass, Sparkles } from 'lucide-react';

export const BaoTangGrid: FC = () => {
  const [isHeritageMapOpen, setIsHeritageMapOpen] = useState<boolean>(false);
  const [comingSoonModal, setComingSoonModal] = useState<string | null>(null);

  return (
    <div className="w-full bg-[#2c1c11] text-[#e3d2c1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        {/* ── 1. HERO BANNER: TRIỂN LÃM SỐ 1 - HOÀI NIỆM DẤU XƯA ── */}
        <section id="trien-lam-di-san-banner" className="scroll-mt-24 relative w-full">
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[380px] sm:min-h-[440px] flex items-center justify-center text-center p-6 sm:p-12 border-y border-[#c8aa6e]/40 overflow-hidden bg-[#120a06] group">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-40 scale-105 transition-transform duration-1000 ease-out group-hover:scale-100">
              <Image
                src="/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Bảo tháp Phước Duyên tại chùa Thiên Mụ, Huế – Biểu tượng tôn nghiêm của Phật giáo xứ Huế.jpg"
                alt="Triển lãm số Hoài Niệm Dấu Xưa"
                fill
                sizes="100vw"
                className="object-cover object-center"
                loading="lazy"
              />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2c1c11]/90 via-[#120a06]/70 to-[#2c1c11]/90" />
            <div className="absolute inset-0 bg-black/30" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-3 sm:space-y-4 px-4">
              <span
                style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                className="text-2xl sm:text-3xl font-normal text-[#e3d2c1] block tracking-wide opacity-90"
              >
                Triển lãm số
              </span>

              <h2
                style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                className="text-4xl sm:text-6xl lg:text-7xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_2px_20px_rgba(255,222,89,0.7)] py-1"
              >
                HOÀI NIỆM DẤU XƯA
              </h2>

              <p
                style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                className="text-base sm:text-xl font-normal text-[#f2cc8f] tracking-widest uppercase py-0.5 max-w-3xl mx-auto leading-relaxed"
              >
                PHẬT GIÁO VIỆT NAM ĐỒNG HÀNH CÙNG DÂN TỘC
                <span className="block mt-1 text-sm sm:text-lg text-[#FFE5A3]/90">(CUỐI TK 19 — TK 20)</span>
              </p>

              <div className="pt-3 sm:pt-5">
                <button
                  type="button"
                  onClick={() => setIsHeritageMapOpen(true)}
                  style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                  className="inline-flex items-center justify-center border border-[#c8aa6e]/80 bg-[#2a1a0e]/90 hover:bg-[#ffde59] text-[#ffde59] hover:text-[#2c1c11] font-normal px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-2xl group/btn uppercase text-sm sm:text-base tracking-wider backdrop-blur-xs cursor-pointer"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  <span>KHÁM PHÁ BẢN ĐỒ DI SẢN</span>
                  <span className="ml-2 group-hover/btn:translate-x-1.5 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. HERO BANNER: TRIỂN LÃM SỐ 2 - ÂN ĐỨC TỔ THẦY ── */}
        <section id="trien-lam-an-duc-to-thay" className="scroll-mt-24 relative w-full">
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[380px] sm:min-h-[440px] flex items-center justify-center text-center p-6 sm:p-12 border-y border-[#c8aa6e]/40 overflow-hidden bg-[#120a06] group">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-40 scale-105 transition-transform duration-1000 ease-out group-hover:scale-100">
              <Image
                src="/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/triển lãm sư tổ ngộ chân tử.JPG"
                alt="Triển lãm số Ân Đức Tổ Thầy"
                fill
                sizes="100vw"
                className="object-cover object-center"
                loading="lazy"
                onError={(e) => {
                  (e.target as any).src = '/images/vu-tru-phat-giao/to-duong/to-duong-banner.jpg';
                }}
              />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#2c1c11]/90 via-[#120a06]/70 to-[#2c1c11]/90" />
            <div className="absolute inset-0 bg-black/30" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-3 sm:space-y-4 px-4">
              <span
                style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                className="text-2xl sm:text-3xl font-normal text-[#e3d2c1] block tracking-wide opacity-90"
              >
                Triển lãm số
              </span>

              <h2
                style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
                className="text-4xl sm:text-6xl lg:text-7xl font-normal text-[#ffde59] uppercase tracking-normal drop-shadow-[0_2px_20px_rgba(255,222,89,0.7)] py-1"
              >
                ÂN ĐỨC TỔ THẦY
              </h2>

              <p
                style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                className="text-base sm:text-xl font-normal text-[#f2cc8f] tracking-widest uppercase py-0.5 max-w-3xl mx-auto leading-relaxed"
              >
                TRIỂN LÃM VỀ SƯ TỔ NGỘ CHÂN TỬ VÀ BỒ TÁT THÍCH QUẢNG ĐỨC
              </p>

              <div className="pt-3 sm:pt-5">
                <button
                  type="button"
                  onClick={() => setComingSoonModal('ÂN ĐỨC TỔ THẦY')}
                  style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
                  className="inline-flex items-center justify-center border border-[#c8aa6e]/80 bg-[#2a1a0e]/90 hover:bg-[#ffde59] text-[#ffde59] hover:text-[#2c1c11] font-normal px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-2xl group/btn uppercase text-sm sm:text-base tracking-wider backdrop-blur-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>KHÁM PHÁ TRIỂN LÃM</span>
                  <span className="ml-2 group-hover/btn:translate-x-1.5 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 3. COMING SOON MODAL FOR ÂN ĐỨC TỔ THẦY ── */}
      {comingSoonModal && (
        <div
          onClick={() => setComingSoonModal(null)}
          className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full p-8 rounded-3xl bg-[#1A1009] border-2 border-[#F2C14E]/60 text-center space-y-4 shadow-2xl"
          >
            <div className="w-14 h-14 rounded-full bg-[#2A1D14] border border-[#F2C14E]/50 text-[#F2C14E] flex items-center justify-center mx-auto text-2xl">
              ☸
            </div>
            <h3
              className="text-3xl font-normal text-[#F2C14E] uppercase"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              TRIỂN LÃM {comingSoonModal}
            </h3>
            <p
              className="text-xs text-[#E3D2C1] leading-relaxed"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Nội dung tư liệu và không gian triển lãm số về Sư Tổ Ngộ Chân Tử và Bồ Tát Thích Quảng Đức đang được ban biên tập hoàn thiện và sẽ sớm ra mắt Quý Phật tử.
            </p>
            <button
              onClick={() => setComingSoonModal(null)}
              className="px-6 py-2 rounded-full bg-[#F2C14E] text-[#1A1009] font-bold text-xs uppercase tracking-wider hover:bg-[#FFE5A3] transition-all cursor-pointer"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* ── 4. FULLSCREEN INTERACTIVE 2D HERITAGE MAP MODAL ── */}
      {isHeritageMapOpen && (
        <HeritageMap2D onClose={() => setIsHeritageMapOpen(false)} />
      )}
    </div>
  );
};
