'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface UseAdminPaginationOptions<T> {
  items: T[];
  defaultPageSize?: number;
}

export function useAdminPagination<T>({
  items,
  defaultPageSize = 10,
}: UseAdminPaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalItems = items.length;
  const isAll = pageSize <= 0;
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset page when items or filter shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const paginatedItems = useMemo(() => {
    if (isAll) return items;
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize, isAll]);

  const startIndex =
    totalItems === 0 ? 0 : isAll ? 1 : (currentPage - 1) * pageSize + 1;
  const endIndex = isAll ? totalItems : Math.min(currentPage * pageSize, totalItems);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    paginatedItems,
    startIndex,
    endIndex,
    isAll,
  };
}

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  itemName?: string;
  className?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100, -1],
  itemName = 'mục',
  className = '',
}: AdminPaginationProps) {
  const [jumpInput, setJumpInput] = useState('');

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);
    return pages;
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpInput('');
    }
  };

  if (totalItems === 0) return null;

  return (
    <div
      style={{ fontFamily: "'UTM Avo', sans-serif" }}
      className={`bg-[#25170E] border border-[#F2C14E]/30 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#c9b896] ${className}`}
    >
      {/* ── Left: Summary info & Page size selector ── */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ffde59] shadow-[0_0_8px_rgba(255,222,89,0.8)]" />
          <span>
            Hiển thị{' '}
            <strong className="text-[#ffde59] font-bold">
              {startIndex} - {endIndex}
            </strong>{' '}
            / <strong className="text-[#ffde59] font-bold">{totalItems}</strong> {itemName}
          </span>
        </div>

        <div className="h-4 w-px bg-[#F2C14E]/20 hidden sm:block" />

        {/* Page size dropdown */}
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#F2C14E]" />
          <span className="hidden sm:inline">Số dòng:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-[#1C120A] border border-[#F2C14E]/40 text-[#ffde59] font-bold text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#ffde59] cursor-pointer shadow-inner"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === -1 ? 'Tất cả' : `${opt} / trang`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Right: Navigation Controls & Jump Input ── */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 bg-[#1C120A] p-1 rounded-xl border border-[#F2C14E]/25">
          {/* First page */}
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#3A2718] hover:text-[#ffde59] text-[#c9b896]"
            title="Trang đầu"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#3A2718] hover:text-[#ffde59] text-[#c9b896]"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 px-1">
            {getPageNumbers().map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-6 text-center text-[#c9b896]/50 select-none text-xs"
                  >
                    •••
                  </span>
                );
              }
              const pageNum = p as number;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F2C14E] text-[#140D07] shadow-[0_0_12px_rgba(242,193,78,0.5)] scale-105'
                      : 'hover:bg-[#3A2718] text-[#c9b896] hover:text-[#ffde59]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next page */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#3A2718] hover:text-[#ffde59] text-[#c9b896]"
            title="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#3A2718] hover:text-[#ffde59] text-[#c9b896]"
            title="Trang cuối"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        {/* Jump to page form (only when > 3 pages) */}
        {totalPages > 3 && (
          <form
            onSubmit={handleJump}
            className="flex items-center gap-1 bg-[#1C120A] px-2 py-1 rounded-xl border border-[#F2C14E]/25"
          >
            <span className="text-[11px] text-[#c9b896]/70">Đến:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder={`${currentPage}`}
              className="w-10 bg-[#25170E] border border-[#F2C14E]/30 rounded-lg px-1.5 py-1 text-center text-[#ffde59] text-xs font-bold focus:outline-none focus:border-[#ffde59]"
            />
            <button
              type="submit"
              disabled={!jumpInput}
              className="p-1 rounded-lg hover:bg-[#3A2718] text-[#F2C14E] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              title="Đi đến trang"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
