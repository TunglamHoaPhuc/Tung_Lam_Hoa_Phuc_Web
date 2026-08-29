'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';
import { NAV_ITEMS } from '@/data/tong-chi-tu-hoc-data';
import tongChiData from '@/data/tong-chi-data.json';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <nav
      className={`sticky top-[64px] z-30 bg-[#2c1c11]/95 w-full py-3.5 md:py-4 flex items-center min-h-[56px] border-t border-[#F2C14E]/20 backdrop-blur-md border-b border-[#f2cc8f]/20 shadow-xl transition-all duration-300 transform-gpu ease-out ${
        isScrolled ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 pl-28 md:pl-40 lg:pl-48 h-full flex items-center justify-between gap-4 py-1 w-full my-auto">
        {/* KHỐI TRÁI: LOGO + NÚT TRÒN ( > ) MỞ DROPDOWN CÙNG CHUYÊN MỤC + TIÊU ĐỀ */}
        <div ref={dropdownRef} className="relative flex items-center justify-center my-auto space-x-2 md:space-x-3 flex-shrink-0">
          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-[#c8aa6e]/60 to-transparent flex-shrink-0 my-auto" />

          <Link href="/tong-chi-tu-hoc" title="Quay về trang Tông Chỉ Tu Học" className="flex items-center">
            <img
              src="https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.webp"
              alt="Biểu tượng Tông Chỉ Tu Học"
              loading="lazy"
              decoding="async"
              className="h-10 md:h-12 w-auto object-contain flex-shrink-0 my-auto drop-shadow-[0_0_8px_rgba(242,193,78,0.4)] hover:scale-105 transition-transform"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-moc-an.webp';
              }}
            />
          </Link>

          {/* NÚT TRÒN ( > ) BẤM VÀO ĐỂ MỞ DROPDOWN MƯỢT MÀ CÁC BÀI THƠ CÙNG CHUYÊN MỤC */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-md flex-shrink-0 my-auto cursor-pointer transition-all duration-300 border ${
              isDropdownOpen
                ? 'bg-[#FFDE59] text-[#1C120A] border-[#FFDE59] shadow-[0_0_12px_#FFDE59] scale-110'
                : 'bg-[#f2cc8f] hover:bg-[#ffde59] text-[#2c1c11] border-[#f2cc8f] hover:scale-110'
            }`}
            title="Bấm để xem các bài thơ / nội dung cùng chuyên mục"
          >
            <ChevronRight
              className={`w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5] transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-90' : 'rotate-0'
              }`}
            />
          </button>

          {/* TIÊU ĐỀ BÀI VIẾT (CŨNG CÓ THỂ BẤM ĐỂ MỞ DROPDOWN) */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="group/title text-xl sm:text-2xl md:text-3xl text-[#ffde59] hover:text-white tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,222,89,0.4)] whitespace-nowrap flex items-center justify-center gap-1.5 my-auto cursor-pointer px-1.5 py-0.5 rounded-xl hover:bg-[#F2C14E]/10 transition-colors"
            title="Bấm để xem các bài thơ / nội dung cùng chuyên mục"
          >
            <span>{pageTitle}</span>
          </button>

          {/* 🪷 DROPDOWN MENU CÙNG CHUYÊN MỤC 🪷 */}
          {isDropdownOpen && (
            <div
              className="absolute left-10 top-full mt-3 w-80 sm:w-96 bg-[#1C120A]/98 border-2 border-[#F2C14E] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(242,193,78,0.3)] backdrop-blur-xl p-3 z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
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
              <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
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

        {/* KHỐI PHẢI: NAV NGANG */}
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

