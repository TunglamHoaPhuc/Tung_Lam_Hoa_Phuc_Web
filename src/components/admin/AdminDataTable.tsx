'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminDataTableProps<TData> {
  title: string;
  subtitle?: string;
  data: TData[];
  columns: ColumnDef<TData, any>[];
  onSave?: () => void;
  onAddRow?: () => void;
  onDeleteRow?: (rowIndex: number) => void;
  onRefresh?: () => void;
  saving?: boolean;
  lastSavedTime?: string;
  searchPlaceholder?: string;
  filterCategories?: { id: string; label: string }[];
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
  onRowClick?: (row: TData, index: number) => void;
}

export function AdminDataTable<TData>({
  title,
  subtitle,
  data,
  columns,
  onSave,
  onAddRow,
  onRefresh,
  saving = false,
  lastSavedTime,
  searchPlaceholder = 'Tìm kiếm nhanh bài viết, từ khóa...',
  filterCategories,
  selectedCategory,
  onSelectCategory,
  onRowClick,
}: AdminDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col h-full w-full bg-[#160E08] text-[#F5EADB] rounded-3xl border-2 border-[#F2C14E]/40 shadow-2xl overflow-hidden">
      {/* ── TOP HEADER ── */}
      <div className="p-4 sm:p-6 bg-[#25170E] border-b border-[#F2C14E]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#F2C14E] shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-2xl sm:text-3xl text-[#FFDE59] uppercase tracking-wider font-normal"
              >
                {title}
              </h1>
              {subtitle && <p className="text-xs text-[#FFE5A3]/70 font-sans">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Cụm nút hành động chính */}
        <div className="flex items-center gap-2 flex-wrap">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2.5 rounded-xl bg-[#3A2718] hover:bg-[#4A3220] text-[#FFE5A3] border border-[#F2C14E]/40 hover:border-[#F2C14E] transition-all cursor-pointer shadow-xs"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-4 h-4 text-[#F2C14E]" />
            </button>
          )}

          {onAddRow && (
            <button
              type="button"
              onClick={onAddRow}
              className="px-3.5 py-2 rounded-xl bg-[#3A2718] hover:bg-[#4A3220] text-[#FFE5A3] hover:text-white border border-[#F2C14E]/50 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#F2C14E]" />
              <span>Thêm Mới</span>
            </button>
          )}

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#F2C14E] hover:bg-[#ffd56b] text-[#1C120A] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang Lưu...' : 'Lưu Dữ Liệu'}</span>
            </button>
          )}

          {lastSavedTime && (
            <span className="text-xs font-bold text-red-400 pl-2">Đã lưu: {lastSavedTime}</span>
          )}
        </div>
      </div>

      {/* ── TOOLBAR: TÌM KIẾM & BỘ LỌC DANH MỤC ── */}
      <div className="p-3 sm:p-4 bg-[#1C120A] border-b border-[#F2C14E]/20 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        {/* Tìm kiếm toàn cục */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F2C14E]/70" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 bg-[#25170E] border border-[#F2C14E]/30 rounded-xl text-xs text-[#F5EADB] focus:outline-none focus:border-[#F2C14E] font-sans"
          />
        </div>

        {/* Tab Danh Mục */}
        {filterCategories && filterCategories.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar w-full sm:w-auto py-1">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory?.(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#F2C14E] text-[#1C120A] shadow-xs'
                    : 'bg-[#25170E] text-[#FFE5A3]/80 hover:bg-[#3A2718] border border-[#F2C14E]/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── DATA TABLE ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full border-collapse text-left text-xs font-sans">
          <thead className="sticky top-0 z-10 bg-[#2D1B10] border-b border-[#F2C14E]/40 text-[#FFDE59]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="p-3 font-bold uppercase tracking-wider border-r border-[#F2C14E]/20 select-none"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center justify-between gap-1.5 ${
                          header.column.getCanSort() ? 'cursor-pointer hover:text-white' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && (
                          <span className="text-[#F2C14E]">
                            {{
                              asc: <ArrowUp className="w-3.5 h-3.5" />,
                              desc: <ArrowDown className="w-3.5 h-3.5" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown className="w-3 h-3 opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#F2C14E]/10">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original, row.index)}
                  className={`hover:bg-[#3A2718]/60 transition-colors group cursor-pointer ${
                    idx % 2 === 0 ? 'bg-[#1C120A]' : 'bg-[#22150D]'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-3 border-r border-[#F2C14E]/10 text-[#F5EADB] align-middle"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-12 text-center text-[#FFE5A3]/60 italic font-medium"
                >
                  🍃 Không tìm thấy dữ liệu nào phù hợp...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION CONTROLS ── */}
      <div className="p-3 bg-[#25170E] border-t border-[#F2C14E]/30 flex items-center justify-between text-xs text-[#FFE5A3] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>Tổng số: <strong className="text-[#FFDE59]">{data.length}</strong> hàng</span>
          <span>•</span>
          <span>
            Trang <strong className="text-[#FFDE59]">{table.getState().pagination.pageIndex + 1}</strong> /{' '}
            {table.getPageCount() || 1}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg bg-[#3A2718] hover:bg-[#4A3220] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Trang đầu"
          >
            <ChevronsLeft className="w-4 h-4 text-[#F2C14E]" />
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg bg-[#3A2718] hover:bg-[#4A3220] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4 text-[#F2C14E]" />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg bg-[#3A2718] hover:bg-[#4A3220] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Trang sau"
          >
            <ChevronRight className="w-4 h-4 text-[#F2C14E]" />
          </button>
          <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg bg-[#3A2718] hover:bg-[#4A3220] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Trang cuối"
          >
            <ChevronsRight className="w-4 h-4 text-[#F2C14E]" />
          </button>
        </div>
      </div>
    </div>
  );
}
