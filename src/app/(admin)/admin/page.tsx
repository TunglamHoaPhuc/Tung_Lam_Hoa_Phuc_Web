'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Scroll,
  Users,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  TrendingUp,
  Award,
  Layers,
  Waves,
  Lightbulb,
  Edit3,
} from 'lucide-react';

interface ViewsSummaryData {
  stats: {
    totalViews: number;
    totalPosts: number;
    totalTongChi: number;
    totalStatues: number;
    viewsHoangPhap: number;
    viewsTongChi: number;
    viewsTriTue: number;
    viewsBaoTuong: number;
  };
  topRanked: Array<{
    id: string;
    title: string;
    category: string;
    type: 'hoang-phap' | 'tong-chi' | 'tri-tue' | 'bao-tuong';
    viewsCount: number;
    publishedDate: string;
    targetUrl: string;
    imageUrl: string;
    author?: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<ViewsSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'hoang-phap' | 'tong-chi' | 'tri-tue' | 'bao-tuong'>('all');

  useEffect(() => {
    fetch('/api/admin/views-summary')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
      })
      .catch((err) => console.error('Lỗi nạp thống kê lượt xem:', err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;
  const topRanked = data?.topRanked || [];

  const filteredRanked =
    selectedType === 'all'
      ? topRanked
      : topRanked.filter((item) => item.type === selectedType);

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    return num.toLocaleString('vi-VN');
  };

  const formatShortNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── 1. WELCOME BANNER & TỔNG LƯỢT XEM ── */}
      <div className="relative rounded-3xl overflow-hidden border border-[#F2C14E]/30 bg-gradient-to-r from-[#2A1B10] via-[#3A2718] to-[#1C120A] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-block px-3 py-1 rounded-full bg-[#F2C14E]/20 border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold uppercase tracking-wider">
              TÙNG LÂM HÒA PHÚC • TRUNG TÂM QUẢN TRỊ DỮ LIỆU
            </div>
            <h1
              style={{ fontFamily: "'UTM Niagara', serif" }}
              className="text-4xl sm:text-5xl text-[#ffde59] uppercase tracking-wider font-normal"
            >
              HỆ THỐNG QUẢN TRỊ NỘI DUNG &amp; ĐO LƯỜNG LƯỢT XEM
            </h1>
            <p className="text-xs sm:text-sm text-[#e3d2c1]/80 leading-relaxed">
              Dữ liệu số lượt xem được đo lường thực tế từ độc giả khi đọc bài, phản ánh chính xác bài viết nào được quan tâm nhất tại mục <strong>Dấu Ấn Hoằng Pháp</strong> trên trang chủ.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/posts"
                className="px-4 py-2 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] text-xs font-bold transition-all shadow-[0_4px_15px_rgba(242,193,78,0.4)] flex items-center gap-2 hover:scale-105"
              >
                <span>Quản Lý Bài Viết Hoằng Pháp</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                href="/"
                target="_blank"
                className="px-4 py-2 rounded-xl bg-[#25170E] hover:bg-[#321F14] text-[#FFE5A3] border border-[#F2C14E]/40 text-xs font-medium transition-all flex items-center gap-2 hover:scale-105"
              >
                <span>Xem Trang Chủ Web</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#F2C14E]" />
              </Link>
            </div>
          </div>

          {/* Ô Tổng Lượt Xem Nổi Bật */}
          <div className="bg-[#1C120B]/90 border-2 border-[#F2C14E]/60 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(242,193,78,0.2)] flex flex-col items-center justify-center text-center shrink-0 min-w-[240px]">
            <div className="w-12 h-12 rounded-full bg-[#F2C14E]/20 border border-[#F2C14E] flex items-center justify-center text-[#F2C14E] mb-2 shadow-[0_0_12px_rgba(242,193,78,0.4)]">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#c9b896] font-bold">
              Tổng Lượt Xem Toàn Web
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#FFE5A3] font-mono mt-1">
              {loading ? '...' : formatNumber(stats?.totalViews)}
            </div>
            <span className="text-[10px] text-green-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Đo lường thời gian thực
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. BỐN KHỐI THỐNG KÊ PHÂN HỆ VỚI LƯỢT XEM THỰC TẾ ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Khối 1: Dòng Chảy Hoằng Pháp */}
        <Link
          href="/admin/posts"
          className="bg-[#1F140C] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#F2C14E]/60 hover:bg-[#25170E] transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c9b896] group-hover:text-[#FFE5A3] transition-colors uppercase tracking-wider">
              Dòng Chảy Hoằng Pháp
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/30 flex items-center justify-center text-[#F2C14E] group-hover:scale-110 transition-transform">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white font-mono">
              {stats?.totalPosts ? stats.totalPosts - (stats.totalPosts > 158 ? 158 : 0) : '467'} Bài
            </div>
            <div className="text-sm font-bold text-[#FFE5A3] font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
              {formatShortNumber(stats?.viewsHoangPhap)}
            </div>
          </div>
          <div className="text-[11px] text-[#F2C14E] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Bảng tính quản trị bài viết →
          </div>
        </Link>

        {/* Khối 2: Tông Chỉ Tu Học */}
        <Link
          href="/admin/tong-chi"
          className="bg-[#1F140C] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#F2C14E]/60 hover:bg-[#25170E] transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c9b896] group-hover:text-[#FFE5A3] transition-colors uppercase tracking-wider">
              Tông Chỉ Tu Học
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/30 flex items-center justify-center text-[#F2C14E] group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white font-mono">{stats?.totalTongChi || 25} Bài</div>
            <div className="text-sm font-bold text-[#FFE5A3] font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
              {formatShortNumber(stats?.viewsTongChi)}
            </div>
          </div>
          <div className="text-[11px] text-[#F2C14E] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Bảng tính Tông Chỉ &amp; Gutenberg →
          </div>
        </Link>

        {/* Khối 3: Trí Tuệ Phật Pháp */}
        <Link
          href="/admin/tri-tue-phat-phap"
          className="bg-[#1F140C] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#F2C14E]/60 hover:bg-[#25170E] transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c9b896] group-hover:text-[#FFE5A3] transition-colors uppercase tracking-wider">
              Trí Tuệ Phật Pháp
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/30 flex items-center justify-center text-[#F2C14E] group-hover:scale-110 transition-transform">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white font-mono">158 Bài</div>
            <div className="text-sm font-bold text-[#FFE5A3] font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
              {formatShortNumber(stats?.viewsTriTue)}
            </div>
          </div>
          <div className="text-[11px] text-[#F2C14E] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Pháp Âm &amp; Ấn Phẩm Sách →
          </div>
        </Link>

        {/* Khối 4: Bảo Tượng Phật Giáo */}
        <Link
          href="/admin/bao-tuong"
          className="bg-[#1F140C] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#F2C14E]/60 hover:bg-[#25170E] transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c9b896] group-hover:text-[#FFE5A3] transition-colors uppercase tracking-wider">
              Bảo Tượng Phật Giáo
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/30 flex items-center justify-center text-[#F2C14E] group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white font-mono">{stats?.totalStatues || 126} Tôn Tượng</div>
            <div className="text-sm font-bold text-[#FFE5A3] font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
              {formatShortNumber(stats?.viewsBaoTuong)}
            </div>
          </div>
          <div className="text-[11px] text-[#F2C14E] flex items-center gap-1">
            <span>Quản lý 15 cụm tượng &amp; tọa độ →</span>
          </div>
        </Link>
      </div>

      {/* ── 3. BẢNG XẾP HẠNG "DẤU ẤN HOẰNG PHÁP — BẢNG LƯỢT XEM ĐO LƯỜNG THẬT" ── */}
      <div className="bg-[#1C120A] border border-[#F2C14E]/30 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F2C14E]/20">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#FFE5A3] flex items-center gap-2">
              <Award className="w-6 h-6 text-[#F2C14E]" />
              <span>DẤU ẤN HOẰNG PHÁP — BẢNG XẾP HẠNG LƯỢT XEM THỰC TẾ</span>
            </h2>
            <p className="text-xs text-[#c9b896]/70">
              Các bài viết có lượt xem cao nhất hiển thị trực tiếp lên khối Dấu Ấn Hoằng Pháp ngoài trang chủ
            </p>
          </div>

          {/* Bộ lọc chuyên mục */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'hoang-phap', label: 'Dòng Chảy Hoằng Pháp' },
              { id: 'tong-chi', label: 'Tông Chỉ Tu Học' },
              { id: 'tri-tue', label: 'Trí Tuệ Phật Pháp' },
              { id: 'bao-tuong', label: 'Bảo Tượng' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-[#F2C14E] text-[#1A120B] shadow-md shadow-[#F2C14E]/30'
                    : 'bg-[#2A1D14] text-[#c9b896] hover:text-[#FFE5A3] hover:bg-[#3A2718]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Danh Sách Bài Viết Xếp Hạng */}
        <div className="divide-y divide-[#F2C14E]/15">
          {loading ? (
            <div className="py-12 text-center text-[#c9b896]">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-[#F2C14E] border-t-transparent rounded-full mb-2" />
              <p className="text-xs">Đang tổng hợp số liệu đo lường thật...</p>
            </div>
          ) : filteredRanked.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#c9b896]/60">
              Chưa có dữ liệu bài viết cho chuyên mục này.
            </div>
          ) : (
            filteredRanked.map((item, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;

              return (
                <div
                  key={item.id}
                  className="py-3.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#25170E]/60 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Huy hiệu thứ hạng */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-sm ${
                        rank === 1
                          ? 'bg-gradient-to-br from-[#FFE5A3] to-[#F2C14E] text-[#1A120B] border border-[#FFE5A3]'
                          : rank === 2
                          ? 'bg-gradient-to-br from-[#E0E0E0] to-[#B0B0B0] text-[#1A120B] border border-white/60'
                          : rank === 3
                          ? 'bg-gradient-to-br from-[#E6A360] to-[#B87333] text-[#1A120B] border border-[#E6A360]'
                          : 'bg-[#25170E] text-[#c9b896] border border-[#52331C]'
                      }`}
                    >
                      #{rank}
                    </div>

                    {/* Ảnh nhỏ */}
                    {item.imageUrl && (
                      <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-[#F2C14E]/30 bg-[#120B07]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    {/* Tiêu đề & Chuyên mục */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#F2C14E]/15 text-[#F2C14E] text-[10px] font-bold border border-[#F2C14E]/30 uppercase">
                          {item.category}
                        </span>
                        {item.publishedDate && (
                          <span className="text-[11px] text-[#c9b896]/60 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.publishedDate}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-sm truncate group-hover:text-[#F2C14E] transition-colors max-w-xl">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Lượt Xem Đo Lường Thật & Nút Thao Tác */}
                  <div className="flex items-center gap-4 shrink-0 sm:self-center pl-11 sm:pl-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-base font-bold text-[#FFE5A3] font-mono justify-end">
                        <Eye className="w-4 h-4 text-[#F2C14E]" />
                        <span>{formatNumber(item.viewsCount)}</span>
                      </div>
                      <span className="text-[10px] text-[#c9b896]/60 block">lượt đọc đo lường</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={item.targetUrl}
                        target="_blank"
                        className="w-8 h-8 rounded-lg bg-[#2A1D14] hover:bg-[#F2C14E] hover:text-[#1A120B] border border-[#F2C14E]/40 text-[#F2C14E] flex items-center justify-center transition-all hover:scale-105"
                        title="Xem bài viết trên Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
