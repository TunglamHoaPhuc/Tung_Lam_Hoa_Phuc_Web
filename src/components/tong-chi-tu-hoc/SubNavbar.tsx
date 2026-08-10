'use client';

import React from 'react';
import { NAV_ITEMS } from '@/data/tong-chi-tu-hoc-data';

interface NavItem {
  id: string;
  label: string;
}

interface SubNavbarProps {
  activeSection: string;
  isScrolled: boolean;
  onScrollToSection: (id: string) => void;
  pageTitle?: string;
  navItems?: NavItem[];
}

export function SubNavbar({
  activeSection,
  isScrolled,
  onScrollToSection,
  pageTitle = 'TÔNG CHỈ TU HỌC',
  navItems = NAV_ITEMS,
}: SubNavbarProps) {
  return (
    <nav
      className={`sticky top-[64px] z-30 bg-[#2c1c11]/95 w-full py-3.5 md:py-4 flex items-center min-h-[56px] border-t border-[#F2C14E]/20 backdrop-blur-md border-b border-[#f2cc8f]/20 shadow-xl transition-all duration-300 transform-gpu ease-out ${
        isScrolled ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 pl-28 md:pl-40 lg:pl-48 h-full flex items-center justify-between gap-4 py-1 w-full my-auto">
        {/* KHỐI TRÁI: LOGO + TIÊU ĐỀ (GIỮ NGUYÊN MÀU SẮC & KÍCH THƯỚC) */}
        <div className="flex items-center justify-center my-auto space-x-2 md:space-x-3 flex-shrink-0">
          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-[#c8aa6e]/60 to-transparent flex-shrink-0 my-auto" />

          <img
            src="https://tunglam.mocwp.com/wp-content/uploads/2026/07/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.png"
            alt="Biểu tượng Tông Chỉ Tu Học"
            loading="lazy"
            decoding="async"
            className="h-10 md:h-12 w-auto object-contain flex-shrink-0 my-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          <div className="w-5 h-5 rounded-full bg-[#f2cc8f] text-[#2c1c11] flex items-center justify-center shadow-md flex-shrink-0 my-auto">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </div>

          <span
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="text-xl sm:text-2xl md:text-3xl text-[#ffde59] tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,222,89,0.4)] whitespace-nowrap flex items-center justify-center my-auto"
          >
            {pageTitle}
          </span>

          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-[#c8aa6e]/60 to-transparent flex-shrink-0 ml-2 my-auto" />

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#e8dbb8] text-[#2c1c11] border-2 border-[#b8a679] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_8px_rgba(255,222,89,0.25)] hover:scale-110 hover:bg-[#ffde59] hover:border-[#ffde59] transition-all duration-300 ml-1 md:ml-2 flex-shrink-0 cursor-pointer my-auto"
            title="Lên đầu trang"
            type="button"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>

        {/* KHỐI PHẢI: NAV NGANG (GIỮ NGUYÊN MÀU SẮC & KÍCH THƯỚC) */}
        <div className="flex-1 flex items-center justify-between ml-4 md:ml-8 overflow-x-auto no-scrollbar py-1 my-auto">
          {navItems.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <React.Fragment key={item.id}>
                {idx > 0 && (
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-[#f2cc8f]/10 via-[#f2cc8f]/30 to-[#f2cc8f]/10 min-w-[12px] mx-1 md:mx-2 my-auto" />
                )}

                <button
                  type="button"
                  onClick={() => onScrollToSection(item.id)}
                  className="group relative flex items-center justify-center gap-2 py-1 px-1 transition-all duration-300 focus:outline-none flex-shrink-0 cursor-pointer my-auto"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 flex-shrink-0 my-auto ${
                      isActive
                        ? 'w-3 h-3 bg-[#ffde59] shadow-[0_0_10px_#ffde59] scale-110 ring-2 ring-[#ffde59]/40'
                        : 'w-2 h-2 bg-[#8c6d53]/70 group-hover:bg-[#ffde59] group-hover:scale-125'
                    }`}
                  />

                  <span
                    style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                    className={`text-xl sm:text-2xl whitespace-nowrap transition-all duration-500 ease-in-out transform flex items-center justify-center my-auto ${
                      isActive
                        ? 'max-w-[220px] opacity-100 text-[#ffde59] drop-shadow-[0_0_8px_rgba(255,222,89,0.5)] translate-x-0'
                        : 'max-w-0 opacity-0 text-[#f2cc8f] group-hover:max-w-[220px] group-hover:opacity-100 group-hover:text-[#ffde59] translate-x-1 group-hover:translate-x-0 overflow-hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default SubNavbar;
