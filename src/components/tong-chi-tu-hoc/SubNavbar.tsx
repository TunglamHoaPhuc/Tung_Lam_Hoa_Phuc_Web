'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '@/data/tong-chi-tu-hoc-data';
import { NavDropdownPanel } from './NavDropdownPanel';

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
  const pathname = usePathname() || '';

  // Nhận diện phân hệ để hiển thị đúng biểu tượng & đường dẫn trang chủ
  const isUniverse = pathname.includes('/vu-tru-phat-giao');
  const isHoangPhap = pathname.includes('/dong-chay-hoang-phap');

  const homeHref = isUniverse
    ? '/vu-tru-phat-giao'
    : isHoangPhap
    ? '/dong-chay-hoang-phap'
    : '/tong-chi-tu-hoc';

  const homeTitle = isUniverse
    ? 'Quay về trang Vũ Trụ Phật Giáo'
    : isHoangPhap
    ? 'Quay về trang Dòng Chảy Hoằng Pháp'
    : 'Quay về trang Tông Chỉ Tu Học';

  const logoSrc = isUniverse || isHoangPhap
    ? 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-moc-an.webp'
    : 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.webp';

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
        {/* KHỐI TRÁI: LOGO + NÚT TRÒN ( > ) MỞ DROPDOWN + TIÊU ĐỀ */}
        <div ref={dropdownRef} className="relative flex items-center justify-center my-auto space-x-2 md:space-x-3 flex-shrink-0">
          <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-[#c8aa6e]/60 to-transparent flex-shrink-0 my-auto" />

          <Link href={homeHref} title={homeTitle} className="flex items-center">
            <img
              src={logoSrc}
              alt={homeTitle}
              loading="lazy"
              decoding="async"
              className="h-10 md:h-12 w-auto object-contain flex-shrink-0 my-auto drop-shadow-[0_0_8px_rgba(242,193,78,0.4)] hover:scale-105 transition-transform"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-moc-an.webp';
              }}
            />
          </Link>

          {/* NÚT TRÒN ( > ) BẤM VÀO ĐỂ MỞ DROPDOWN MƯỢT MÀ */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-md flex-shrink-0 my-auto cursor-pointer transition-all duration-300 border ${
              isDropdownOpen
                ? 'bg-[#FFDE59] text-[#1C120A] border-[#FFDE59] shadow-[0_0_12px_#FFDE59] scale-110'
                : 'bg-[#f2cc8f] hover:bg-[#ffde59] text-[#2c1c11] border-[#f2cc8f] hover:scale-110'
            }`}
            title="Bấm để xem danh mục nội dung"
          >
            <ChevronRight
              className={`w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5] transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-90' : 'rotate-0'
              }`}
            />
          </button>

          {/* TIÊU ĐỀ TRÊN THANH BAR (BẤM ĐỂ MỞ DROPDOWN) */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="group/title text-xl sm:text-2xl md:text-3xl text-[#ffde59] hover:text-white tracking-wide uppercase drop-shadow-[0_0_10px_rgba(255,222,89,0.4)] whitespace-nowrap flex items-center justify-center gap-1.5 my-auto cursor-pointer px-1.5 py-0.5 rounded-xl hover:bg-[#F2C14E]/10 transition-colors"
            title="Bấm để xem danh mục nội dung"
          >
            <span>{pageTitle}</span>
          </button>

          {/* 🪷 DROPDOWN MENU CHUẨN XÁC NỘI DUNG VỚI FONT UTM AVO BOLD VIẾT HOA 🪷 */}
          {isDropdownOpen && (
            <div className="absolute left-10 top-full mt-3 z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
              <NavDropdownPanel
                pageTitle={pageTitle}
                activeSection={activeSection}
                onClose={() => setIsDropdownOpen(false)}
              />
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
                    className={`text-xl sm:text-2xl whitespace-nowrap uppercase tracking-wider transition-all duration-500 ease-in-out transform flex items-center justify-center my-auto ${
                      isActive
                        ? 'max-w-[280px] opacity-100 text-[#ffde59] drop-shadow-[0_0_8px_rgba(255,222,89,0.5)] translate-x-0'
                        : 'max-w-0 opacity-0 text-[#f2cc8f] group-hover:max-w-[280px] group-hover:opacity-100 group-hover:text-[#ffde59] translate-x-1 group-hover:translate-x-0 overflow-hidden'
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
