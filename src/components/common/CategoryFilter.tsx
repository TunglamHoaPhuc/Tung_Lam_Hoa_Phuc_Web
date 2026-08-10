'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CategoryItem {
  id: string;
  label: string;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface CategoryFilterProps {
  categories: CategoryItem[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  sortOptions?: SortOption[];
  currentSort?: string;
  onSelectSort?: (id: string) => void;
  sortLabel?: string;
  className?: string;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  sortOptions,
  currentSort,
  onSelectSort,
  sortLabel = 'Phân loại',
  className = '',
}: CategoryFilterProps) {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(categories.length);

  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Logic tự động tính toán tab hiển thị vs tab bị tràn dòng
  const updateOverflow = useCallback(() => {
    if (!navRef.current) return;
    const containerWidth = navRef.current.clientWidth;
    if (!containerWidth) return;

    let totalWidth = 0;
    let count = 0;
    const DROPDOWN_BTN_WIDTH = 130;

    for (let i = 0; i < categories.length; i++) {
      const estimatedTabWidth = categories[i].label.length * 9 + 36;
      if (totalWidth + estimatedTabWidth > containerWidth - DROPDOWN_BTN_WIDTH && i > 0) {
        break;
      }
      totalWidth += estimatedTabWidth;
      count++;
    }

    if (totalWidth + (categories[categories.length - 1]?.label.length * 9 + 36) <= containerWidth) {
      setVisibleCount(categories.length);
    } else {
      setVisibleCount(Math.max(1, count));
    }
  }, [categories]);

  useEffect(() => {
    updateOverflow();
    window.addEventListener('resize', updateOverflow);
    return () => window.removeEventListener('resize', updateOverflow);
  }, [updateOverflow]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleCategories = categories.slice(0, visibleCount);
  const overflowCategories = categories.slice(visibleCount);
  const hasOverflow = overflowCategories.length > 0;

  const activeOverflowCat = overflowCategories.find((cat) => cat.id === activeCategory);
  const currentSortLabel = sortOptions?.find((s) => s.id === currentSort)?.label || 'Mới nhất';

  return (
    <div className={`relative w-full ${className}`}>
      {/* Container chính không dùng overflow-hidden để menu xổ nổi hoàn toàn */}
      <div className="border-b border-[#F2C14E]/30 flex flex-wrap items-center justify-between gap-4 pb-2 relative z-20">
        {/* Vùng các Tab Danh Mục & Nút Lựa chọn khi tràn */}
        <div ref={navRef} className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0 py-1">
          {/* Các tab hiển thị trực tiếp */}
          {visibleCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className={`pb-2.5 -mb-[10px] text-xs sm:text-sm tracking-wide capitalize whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'text-[#F2C14E] border-b-2 border-[#F2C14E] font-bold drop-shadow-[0_0_8px_rgba(242,193,78,0.5)]'
                    : 'text-[#e3d2c1]/80 hover:text-[#F2C14E] border-b-2 border-transparent font-normal'
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          {/* NÚT "Lựa chọn ˅" CHỈ HIỂN THỊ KHI TRÀN DÒNG (OVERFLOW ONLY) Ở CUỐI DÃY TAB */}
          {hasOverflow && (
            <div ref={dropdownRef} className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className={`pb-2.5 -mb-[10px] text-xs sm:text-sm tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeOverflowCat
                    ? 'text-[#F2C14E] border-[#F2C14E] font-bold drop-shadow-[0_0_8px_rgba(242,193,78,0.5)]'
                    : 'text-white hover:text-[#F2C14E] border-transparent font-normal'
                }`}
              >
                <span>{activeOverflowCat ? activeOverflowCat.label : 'Lựa chọn'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#F2C14E] transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu Dropdown nổi đè phía trên cùng (z-[99]) */}
              {isCategoryDropdownOpen && (
                <div
                  className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 z-[99] min-w-[200px] bg-[#2C1C11] border border-[#F2C14E]/40 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-2 space-y-1 backdrop-blur-md"
                >
                  {overflowCategories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setIsCategoryDropdownOpen(false);
                        }}
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className={`w-full text-left px-3.5 py-2 rounded-lg text-xs sm:text-sm capitalize tracking-wide transition-colors flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'text-[#F2C14E] font-bold bg-[#4a321a]'
                            : 'text-[#e3d2c1] hover:text-[#F2C14E] hover:bg-[#4a321a]/50'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isActive && <Check className="w-4 h-4 text-[#F2C14E]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vùng Sắp Xếp / Phân Loại */}
        {sortOptions && onSelectSort && (
          <div ref={sortDropdownRef} className="flex items-center gap-3 relative flex-shrink-0">
            <span
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-white text-xs sm:text-sm font-normal capitalize tracking-wide"
            >
              {sortLabel}
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-[#F2C14E] text-xs sm:text-sm font-normal capitalize tracking-wide flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer border border-[#F2C14E]/40 px-3 py-1.5 rounded-lg bg-[#3a2718]/80 shadow-md"
              >
                <span>{currentSortLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#F2C14E] transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 z-[99] rounded-xl border border-[#F2C14E]/40 bg-[#2C1C11] shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-2 space-y-1 backdrop-blur-md"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onSelectSort(opt.id);
                        setIsSortDropdownOpen(false);
                      }}
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs sm:text-sm capitalize tracking-wide transition-colors flex items-center justify-between cursor-pointer ${
                        currentSort === opt.id ? 'text-[#F2C14E] font-bold bg-[#4a321a]' : 'text-[#e3d2c1] hover:text-[#F2C14E] hover:bg-[#4a321a]/50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {currentSort === opt.id && <Check className="w-3.5 h-3.5 text-[#F2C14E]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryFilter;
