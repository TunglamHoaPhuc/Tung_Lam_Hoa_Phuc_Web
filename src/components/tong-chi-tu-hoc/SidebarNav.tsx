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
  const pathname = usePathname() || '';
  const titleWords = (pageTitle || 'TÔNG CHỈ TU HỌC').trim().split(/\s+/);

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
    <aside
      className={`fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3 transition-all duration-300 transform-gpu ease-out ${
        isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'
      }`}
    >
      <div ref={dropdownRef} className="relative bg-[#382417]/90 border border-[#f2cc8f]/40 px-2.5 py-4 rounded-3xl flex flex-col items-center shadow-2xl backdrop-blur-md">
        <Link
          href={homeHref}
          title={homeTitle}
          className="group flex flex-col items-center hover:scale-110 transition-transform cursor-pointer"
        >
          <img
            src={logoSrc}
            alt={homeTitle}
            loading="lazy"
            decoding="async"
            className="h-8 w-auto object-contain mb-2 flex-shrink-0 drop-shadow-[0_0_6px_rgba(255,222,89,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(255,222,89,0.9)] transition-all"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/09-icon-minh-hoa/logo-moc-an.webp';
            }}
          />
        </Link>

        {/* NÚT TRÒN ( > ) BẤM VÀO ĐỂ MỞ DROPDOWN */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md flex-shrink-0 my-1 cursor-pointer transition-all duration-300 border ${
            isDropdownOpen
              ? 'bg-[#FFDE59] text-[#1C120A] border-[#FFDE59] shadow-[0_0_12px_#FFDE59] scale-110'
              : 'bg-[#f2cc8f] hover:bg-[#ffde59] text-[#2c1c11] border-[#f2cc8f] hover:scale-110'
          }`}
          title="Bấm để xem danh mục nội dung"
        >
          <ChevronRight
            className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 ${
              isDropdownOpen ? 'rotate-90' : 'rotate-0'
            }`}
          />
        </button>

        <div className="w-4 h-[1px] bg-gradient-to-r from-transparent via-[#f2cc8f]/50 to-transparent mb-1" />

        {/* TIÊU ĐỀ DỌC (BẤM ĐỂ MỞ DROPDOWN) */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Bấm để xem danh mục nội dung"
          style={{ fontFamily: "'UTM Niagara', sans-serif" }}
          className="group/title flex flex-col items-center text-[#ffde59] hover:text-white text-base font-bold tracking-wider leading-tight uppercase select-none drop-shadow-[0_0_4px_rgba(255,222,89,0.3)] my-1 max-w-[60px] text-center cursor-pointer transition-all hover:scale-105 p-1 rounded-xl hover:bg-[#F2C14E]/20"
        >
          {titleWords.map((word, idx) => (
            <span key={idx} className="block leading-snug py-0.5">
              {word}
            </span>
          ))}
        </button>

        {/* 🪷 FLYOUT DROPDOWN BÊN PHẢI SIDEBARNAV VỚI FONT UTM AVO BOLD VIẾT HOA 🪷 */}
        {isDropdownOpen && (
          <div className="absolute left-full top-0 ml-3 z-[100] animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200">
            <NavDropdownPanel
              pageTitle={pageTitle}
              activeSection={activeSection}
              onClose={() => setIsDropdownOpen(false)}
            />
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

        {/* CÁC CHẤM NAV DỌC VÀ NHÃN TOOLTIP BAY RA */}
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
                    className={`absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[#21140b]/95 border border-[#f2cc8f]/50 text-lg sm:text-xl whitespace-nowrap uppercase tracking-wider shadow-xl backdrop-blur-md pointer-events-none transition-all duration-300 transform origin-left ${
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

export default SidebarNav;
