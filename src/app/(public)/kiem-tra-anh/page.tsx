'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { OFFICIAL_STATUE_DATASET, StatueRecord } from '@/data/statue-data';
import { Search, CheckCircle2, AlertTriangle, XCircle, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';

export default function KiemTraAnhPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'matched' | 'fallback'>('all');
  const [selectedAssembly, setSelectedAssembly] = useState('all');

  const statues = OFFICIAL_STATUE_DATASET;

  const assemblies = useMemo(() => {
    const set = new Set<string>();
    statues.forEach((s) => {
      if (s.assembly) set.add(s.assembly);
    });
    return ['all', ...Array.from(set)];
  }, [statues]);

  const filtered = useMemo(() => {
    return statues.filter((s) => {
      const isFallback = s.imgUrl === '/images/toan-canh-chua.jpg';
      if (filterStatus === 'matched' && isFallback) return false;
      if (filterStatus === 'fallback' && !isFallback) return false;

      if (selectedAssembly !== 'all' && s.assembly !== selectedAssembly) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchCode = s.code?.toLowerCase().includes(q);
        const matchName = s.name?.toLowerCase().includes(q);
        const matchSub = s.subtitle?.toLowerCase().includes(q);
        const matchFile = s.characterGroup?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchSub && !matchFile) return false;
      }

      return true;
    });
  }, [statues, search, filterStatus, selectedAssembly]);

  const stats = useMemo(() => {
    let matched = 0;
    let fallback = 0;
    statues.forEach((s) => {
      if (s.imgUrl === '/images/toan-canh-chua.jpg') fallback++;
      else matched++;
    });
    return { total: statues.length, matched, fallback };
  }, [statues]);

  return (
    <div className="min-h-screen bg-[#1A120B] text-[#e3d2c1] p-4 sm:p-8 selection:bg-[#F2C14E] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F2C14E]/30">
          <div>
            <Link
              href="/bao-tuong-phat-giao"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#F2C14E] uppercase tracking-wider mb-2 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Trang Bảo Tượng</span>
            </Link>
            <h1
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-4xl sm:text-5xl text-[#ffde59] uppercase tracking-wider font-normal"
            >
              BẢNG ĐỐI SOÁT &amp; KIỂM TRA ẢNH TƯỢNG PHÁP
            </h1>
            <p className="text-xs sm:text-sm text-[#e3d2c1]/80">
              Công cụ giúp kiểm tra chính xác từng tượng, tên ảnh khai báo trong Google Sheet và ảnh thực tế đang hiển thị trên web.
            </p>
          </div>

          {/* Quick Stats Badge */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#2A1D14] border border-green-500/40 text-green-400 text-xs font-bold flex items-center gap-2 shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>{stats.matched} Khớp ảnh thực tế</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#2A1D14] border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-2 shadow-md">
              <AlertTriangle className="w-4 h-4" />
              <span>{stats.fallback} Đang dùng ảnh tạm</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#25170E] p-4 rounded-2xl border border-[#F2C14E]/30">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#F2C14E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo Mã (TP0001), Tên tượng, Tên ảnh..."
              className="w-full pl-9 pr-3 py-2 bg-[#1A120B] border border-[#F2C14E]/40 rounded-xl text-xs text-[#FFE5A3] placeholder-[#c9b896]/50 focus:outline-none focus:border-[#F2C14E]"
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-[#1A120B] border border-[#F2C14E]/40 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
          >
            <option value="all">Tất cả trạng thái ({stats.total})</option>
            <option value="matched">Chỉ xem ảnh đã khớp ({stats.matched})</option>
            <option value="fallback">Chỉ xem tượng chưa có ảnh ({stats.fallback})</option>
          </select>

          {/* Assembly filter */}
          <select
            value={selectedAssembly}
            onChange={(e) => setSelectedAssembly(e.target.value)}
            className="px-3 py-2 bg-[#1A120B] border border-[#F2C14E]/40 rounded-xl text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
          >
            <option value="all">Tất cả Chúng hội</option>
            {assemblies.filter((a) => a !== 'all').map((asm) => (
              <option key={asm} value={asm}>
                {asm}
              </option>
            ))}
          </select>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-[#F2C14E]/30 bg-[#25170E] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-[#321F14] text-[#F2C14E] uppercase tracking-wider font-bold border-b border-[#F2C14E]/30">
                <tr>
                  <th className="p-3 w-16">Mã</th>
                  <th className="p-3 w-28">Ảnh Hiển Thị</th>
                  <th className="p-3">Tên Tượng &amp; Tên Phụ</th>
                  <th className="p-3">Chúng Hội &amp; Cụm</th>
                  <th className="p-3">Loại</th>
                  <th className="p-3">Tên Ảnh Trong Sheet</th>
                  <th className="p-3">File Thực Tế</th>
                  <th className="p-3 w-24 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2C14E]/10">
                {filtered.map((item, idx) => {
                  const isFallback = item.imgUrl === '/images/toan-canh-chua.jpg';
                  return (
                    <tr key={item.id || idx} className="hover:bg-[#321F14]/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#F2C14E]">
                        {item.code || `TP${String(idx + 1).padStart(4, '0')}`}
                      </td>
                      <td className="p-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#F2C14E]/40 bg-black/40 flex items-center justify-center">
                          <img
                            src={item.imgUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="font-bold text-white text-sm">
                          {item.name}
                        </div>
                        {item.subtitle && (
                          <div className="text-[#FFE5A3]/80 italic">
                            {item.subtitle}
                          </div>
                        )}
                        {item.quote && (
                          <div className="text-[11px] text-[#c9b896]/70 line-clamp-1">
                            &ldquo;{item.quote}&rdquo;
                          </div>
                        )}
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="text-[#F2C14E] font-medium">{item.assembly}</div>
                        <div className="text-[#c9b896]/70">{item.group || '—'}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.categoryType === 'TƯỢNG CHÍNH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {item.categoryType}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#FFE5A3]">
                        {item.characterGroup || '—'}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#c9b896]/80 max-w-[200px] truncate" title={item.imgUrl}>
                        {item.imgUrl}
                      </td>
                      <td className="p-3 text-center">
                        {!isFallback ? (
                          <span className="inline-flex items-center gap-1 text-green-400 font-bold text-[11px] bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã khớp</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[11px] bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/30">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Ảnh tạm</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
