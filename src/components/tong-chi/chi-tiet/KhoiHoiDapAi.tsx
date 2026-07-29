'use client';

import React from 'react';

export function KhoiHoiDapAi() {
  return (
    <section id="hoi-dap-ai" className="scroll-mt-24 pt-6 pb-12 w-full relative">
      <div className="relative bg-[#3a2613]/90 border border-[#c8aa6e]/80 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#ffde59] to-[#c8aa6e] text-[#2c1c11] shadow-[0_0_20px_rgba(255,222,89,0.5)]">
          <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2
            style={{ fontFamily: "'UTM Niagara', 'UTM ClassizismAntiqua', serif" }}
            className="text-3xl sm:text-5xl font-normal text-[#ffde59] uppercase tracking-widest drop-shadow-md"
          >
            HỎI ĐÁP CÙNG TRỢ LÝ AI TU HỌC
          </h2>
          <p
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Hệ thống AI đã tổng hợp toàn bộ dữ liệu bài viết, tư liệu lịch sử và giáo lý tu học trên trang web. Bạn có thể đặt câu hỏi để nhận câu trả lời tức thì.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
            <input
              type="text"
              placeholder="Ví dụ: Lịch sử Tông Phong Hoằng Pháp? Lịch tu học hằng tháng tại chùa?..."
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="w-full bg-[#2a1a0e] border-2 border-[#c8aa6e]/70 focus:border-[#ffde59] text-white placeholder-white/40 rounded-xl px-5 py-4 pr-16 sm:pr-36 text-sm sm:text-base focus:outline-none transition-colors shadow-inner"
            />
            <button
              type="submit"
              style={{ fontFamily: "'UTM ClassizismAntiqua', serif" }}
              className="absolute right-2 bg-gradient-to-r from-[#ffde59] to-[#c8aa6e] hover:from-[#ffe885] hover:to-[#dfc387] text-[#2c1c11] font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 shadow-md flex items-center gap-2 text-sm sm:text-base"
            >
              <span>GỬI CÂU HỎI</span>
              <svg className="w-4 h-4 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs sm:text-sm text-[#f2cc8f]">
            <span className="opacity-70">Gợi ý câu hỏi:</span>
            {['Tổ Sư Khai Sơn là ai?', 'Các khóa tu sắp diễn ra', 'Tông Phong Hoằng Pháp'].map((tag, tIdx) => (
              <button
                key={tIdx}
                type="button"
                className="bg-[#2a1a0e]/80 border border-[#c8aa6e]/40 hover:border-[#ffde59] hover:text-[#ffde59] px-3 py-1 rounded-full transition-colors backdrop-blur-xs cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}