'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { NAV_ITEMS } from '@/data/tong-chi-tu-hoc-data';
import tongChiData from '@/data/tong-chi-data.json';

interface NavItem {
  id: string;
  label: string;
}

interface SidebarNavProps {
  activeSection: string;
  isScrolled: boolean;
  onScrollToSection: (id: string) => void;
  pageTitle?: string;
  navItems?: NavItem[];
}

export function SidebarNav({
  activeSection,
  isScrolled,
  onScrollToSection,
  pageTitle = 'TÔNG CHỈ TU HỌC',
  navItems = NAV_ITEMS,
}: SidebarNavProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const titleWords = (pageTitle || 'TÔNG CHỈ TU HỌC').trim().split(/\s+/);

  // Tìm bài viết hiện tại và lọc danh sách các bài CÙNG CHUYÊN MỤC
  const normalizedTitle = (pageTitle || '').toLowerCase().trim();
  const currentItem = tongChiData.find((a) => {
    const t = a.title.toLowerCase().trim();
    return t === normalizedTitle || normalizedTitle.includes(t) || t.includes(normalizedTitle);
  }) || tongChiData[0];

  const currentCategory = currentItem ? currentItem.category : 'tong-phong-truyen-thua';
  const categoryName = currentItem?.categoryName || 'TÔNG PHONG TRUYỀN THỪA';
  const sameCategoryArticles = tongChiData.filter((a) => a.category === currentCategory);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <aside
      className={`fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3 transition-all duration-300 transform-gpu ease-out ${
        isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'
      }`}
    >
      <div ref={dropdownRef} className="relative bg-[#382417]/90 border border-[#f2cc8f]/40 px-2.5 py-4 rounded-3xl flex flex-col items-center shadow-2xl backdrop-blur-md">
        <Link
          href="/tong-chi-tu-hoc"
          title="Quay về trang Tông Chỉ Tu Học"
          className="group flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
        >
          <img
            src="https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.webp"
            alt="Biểu tượng Tông chỉ tu học"
            loading="lazy"
            decoding="async"
            className="h-8 w-auto object-contain mb-2 flex-shrink-0 drop-shadow-[0_0_6px_rgba(255,222,89,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(255,222,89,0.9)] transition-all"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-moc-an.webp';
            }}
          />
        </Link>

        {/* NÚT TRÒN ( > ) BẤM VÀO ĐỂ MỞ DROPDOWN CÁC BÀI CÙNG CHUYÊN MỤC */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md flex-shrink-0 my-1 cursor-pointer transition-all duration-300 border ${
            isDropdownOpen
              ? 'bg-[#FFDE59] text-[#1C120A] border-[#FFDE59] shadow-[0_0_12px_#FFDE59] scale-110'
              : 'bg-[#f2cc8f] hover:bg-[#ffde59] text-[#2c1c11] border-[#f2cc8f] hover:scale-110'
          }`}
          title="Bấm để xem các bài thơ / nội dung cùng chuyên mục"
        >
          <ChevronRight
            className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 ${
              isDropdownOpen ? 'rotate-90' : 'rotate-0'
            }`}
          />
        </button>

        <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/50 to-transparent mb-1" />

        {/* TIÊU ĐỀ DỌC (CŨNG CÓ THỂ BẤM ĐỂ MỞ DROPDOWN) */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Bấm để xem các bài thơ / nội dung cùng chuyên mục"
          style={{ fontFamily: "'UTM Niagara', sans-serif" }}
          className="group/title flex flex-col items-center text-[#ffde59] hover:text-white text-base font-bold tracking-wider leading-tight uppercase select-none drop-shadow-[0_0_4px_rgba(255,222,89,0.3)] my-1 max-w-[60px] text-center cursor-pointer transition-all hover:scale-105 p-1 rounded-xl hover:bg-[#F2C14E]/20"
        >
          {titleWords.map((word, idx) => (
            <span key={idx} className="block leading-snug py-0.5">
              {word}
            </span>
          ))}
        </button>

        {/* 🪷 FLYOUT DROPDOWN BÊN PHẢI SIDEBARNAV 🪷 */}
        {isDropdownOpen && (
          <div
            className="absolute left-full top-0 ml-3 w-80 sm:w-96 bg-[#1C120A]/98 border-2 border-[#F2C14E] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(242,193,78,0.3)] backdrop-blur-xl p-3 z-[100] animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2C14E]/30 px-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#F2C14E]" />
                <span
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wider"
                >
                  {categoryName}
                </span>
              </div>
              <span
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="px-2 py-0.5 rounded-full bg-[#3A2718] border border-[#F2C14E]/40 text-[10px] font-bold text-[#ffde59]"
              >
                {sameCategoryArticles.length} bài
              </span>
            </div>

            {/* List of articles in same category */}
            <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-1 text-left">
              {sameCategoryArticles.map((art) => {
                const isCurrent =
                  art.id === currentItem?.id ||
                  art.title.toLowerCase().trim() === normalizedTitle;

                return (
                  <Link
                    key={art.id || art.slug}
                    href={`/tong-chi-tu-hoc/${art.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`group flex items-center justify-between gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#3A2718] border-[#F2C14E] shadow-[0_0_15px_rgba(242,193,78,0.25)]'
                        : 'bg-[#25170E]/70 hover:bg-[#352012] border-[#F2C14E]/20 hover:border-[#F2C14E]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                          isCurrent
                            ? 'bg-[#F2C14E] text-[#1C120A] border-[#F2C14E]'
                            : 'bg-[#1C120A] text-[#FFE5A3] border-[#F2C14E]/40 group-hover:border-[#F2C14E]'
                        }`}
                      >
                        #{art.id}
                      </div>

                      <div className="min-w-0">
                        <h4
                          style={{ fontFamily: "'UTM Niagara', serif" }}
                          className={`text-xl sm:text-2xl uppercase tracking-wider font-normal leading-none truncate transition-colors ${
                            isCurrent
                              ? 'text-[#ffde59]'
                              : 'text-[#FFE5A3] group-hover:text-[#ffde59]'
                          }`}
                        >
                          {art.title}
                        </h4>
                        {art.subtitle && (
                          <p
                            style={{ fontFamily: "'UTM Avo', sans-serif" }}
                            className="text-[10px] text-[#c9b896]/80 italic truncate mt-0.5"
                          >
                            {art.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {isCurrent ? (
                      <span
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="px-1.5 py-0.5 rounded bg-[#F2C14E] text-[#1C120A] text-[9px] font-bold uppercase shrink-0 flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Đang xem</span>
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#F2C14E]/60 group-hover:text-[#F2C14E] group-hover:translate-x-0.5 transition-all shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

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
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="w-[1px] h-4 bg-gradient-to-b from-transparent via-[#f2cc8f]/40 to-transparent my-0.5" />
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

