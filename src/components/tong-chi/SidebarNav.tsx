'use client';

import React from 'react';
<<<<<<< HEAD

interface NavItem {
  id: string;
  label: string;
}
=======
import { NAV_ITEMS } from '@/data/tong-chi-data';
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06

interface SidebarNavProps {
  activeSection: string;
  isScrolled: boolean;
  onScrollToSection: (id: string) => void;
<<<<<<< HEAD
  pageTitle?: string;
  navItems?: NavItem[];
}

export function SidebarNav({
  activeSection,
  isScrolled,
  onScrollToSection,
  pageTitle = 'TÔNG PHONG TRUYỀN THỪA',
  navItems = [],
}: SidebarNavProps) {
  const titleWords = (pageTitle || 'TÔNG PHONG TRUYỀN THỪA').trim().split(/\s+/);

=======
}

export function SidebarNav({ activeSection, isScrolled, onScrollToSection }: SidebarNavProps) {
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
  return (
    <aside
      className={`fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 transition-all duration-500 ${
        isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'
      }`}
    >
      <div className="bg-[#382417]/90 border border-[#f2cc8f]/40 px-2.5 py-4 rounded-3xl flex flex-col items-center shadow-2xl backdrop-blur-md">
        <img
          src="https://tunglam.mocwp.com/wp-content/uploads/2026/07/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.png"
<<<<<<< HEAD
          alt="Biểu tượng"
=======
          alt="Biểu tượng Tông chỉ tu học"
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
          className="h-8 w-auto object-contain mb-2 flex-shrink-0 drop-shadow-[0_0_6px_rgba(255,222,89,0.4)]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/50 to-transparent mb-2" />

        <div
          style={{ fontFamily: "'UTM Niagara', sans-serif" }}
<<<<<<< HEAD
          className="flex flex-col items-center text-[#ffde59] text-base font-bold tracking-wider leading-tight uppercase select-none drop-shadow-[0_0_4px_rgba(255,222,89,0.3)] my-1 max-w-[60px] text-center"
        >
          {titleWords.map((word, idx) => (
            <span key={idx} className="block leading-snug py-0.5">{word}</span>
          ))}
=======
          className="flex flex-col items-center text-[#ffde59] text-base font-bold tracking-wider leading-tight uppercase select-none drop-shadow-[0_0_4px_rgba(255,222,89,0.3)] my-1"
        >
          <span>TÔNG</span>
          <span>CHỈ</span>
          <span>TU</span>
          <span>HỌC</span>
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
        </div>

        <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/50 to-transparent my-2" />

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-8 h-8 rounded-full bg-[#e8dbb8] text-[#2c1c11] border-2 border-[#b8a679] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_8px_rgba(255,222,89,0.25)] hover:scale-110 hover:bg-[#ffde59] hover:border-[#ffde59] transition-all duration-300 my-1 cursor-pointer flex-shrink-0"
          title="Lên đầu trang"
          type="button"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>

        <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/50 to-transparent my-2" />

        <div className="flex flex-col items-center">
<<<<<<< HEAD
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <React.Fragment key={item.id}>
                {/* 🔴 ĐƯỜNG KẺ MỀM MẠI GRADIENT DỌC NHƯ THANH NGANG */}
                {index > 0 && (
                  <div className="w-[1px] h-4 bg-gradient-to-b from-transparent via-[#f2cc8f]/40 to-transparent my-0.5" />
=======
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="w-[1px] h-5 bg-gradient-to-b from-[#f2cc8f]/10 via-[#f2cc8f]/30 to-[#f2cc8f]/10 my-1" />
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
                )}

                <button
                  type="button"
                  onClick={() => onScrollToSection(item.id)}
                  className="group relative flex items-center justify-center p-1 focus:outline-none cursor-pointer"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-3 h-3 bg-[#ffde59] shadow-[0_0_10px_#ffde59] scale-110 ring-2 ring-[#ffde59]/40'
                        : 'w-2 h-2 bg-[#8c6d53]/70 group-hover:bg-[#ffde59] group-hover:scale-125'
                    }`}
                  />

<<<<<<< HEAD
                  {/* THẺ TEXT HOVER */}
=======
>>>>>>> 2a82a66dcaa066641e502cd6bf81f25b64731f06
                  <span
                    style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                    className={`absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[#21140b]/95 border border-[#f2cc8f]/50 text-lg sm:text-xl whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none transition-all duration-300 transform origin-left ${
                      isActive
                        ? 'opacity-100 translate-x-0 text-[#ffde59] drop-shadow-[0_0_6px_rgba(255,222,89,0.4)]'
                        : 'opacity-0 -translate-x-2 text-[#f2cc8f] group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#ffde59]'
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
    </aside>
  );
}