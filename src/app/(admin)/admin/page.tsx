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
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { STATUE_LIST } from '@/data/statue-data';

export default function AdminDashboardPage() {
  const [tongChiCount, setTongChiCount] = useState(2);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/tong-chi')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setTongChiCount(data.data.length);
          setRecentArticles(data.data.slice(0, 5));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const statueCount = STATUE_LIST.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#F2C14E]/30 bg-gradient-to-r from-[#2A1B10] via-[#3A2718] to-[#1C120A] p-8 shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-[#F2C14E]/20 border border-[#F2C14E]/40 text-[#F2C14E] text-xs font-bold uppercase tracking-wider">
            TÙNG LÂM HÒA PHÚC • TRUNG TÂM QUẢN TRỊ DỮ LIỆU
          </div>
          <h1
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-4xl sm:text-5xl text-[#ffde59] uppercase tracking-wider font-normal"
          >
            HỆ THỐNG QUẢN TRỊ NỘI DUNG THUẦN VIỆT
          </h1>
          <p className="text-xs sm:text-sm text-[#e3d2c1]/80 max-w-2xl leading-relaxed">
            Chào mừng bạn đến với trang quản trị trực tiếp của Tùng Lâm Hòa Phúc. Dữ liệu được lưu trữ, đồng bộ và hiển thị tức thì mà không cần qua các hệ thống trung gian phức tạp.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/admin/tong-chi/new"
              className="w-10 h-10 rounded-xl bg-[#F2C14E] hover:bg-[#ffde59] text-[#1A120B] transition-all shadow-[0_4px_15px_rgba(242,193,78,0.4)] flex items-center justify-center hover:scale-105"
              title="Thêm Bài Viết / Kệ Thơ Mới"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <Link
              href="/kiem-tra-anh"
              className="w-10 h-10 rounded-xl bg-[#25170E] hover:bg-[#321F14] text-[#FFE5A3] border border-[#F2C14E]/40 transition-all flex items-center justify-center hover:scale-105"
              title="Đối Soát Ảnh Tượng Pháp"
            >
              <ArrowRight className="w-5 h-5 text-[#F2C14E]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#1F140C] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#F2C14E]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c9b896] uppercase tracking-wider">
              Tông Chỉ Tu Học
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/30 flex items-center justify-center text-[#F2C14E]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{tongChiCount}</div>
          <div className="text-[11px] text-green-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Có hỗ trợ chú thích từ khóa Popup
          </div>
        </div>

        <div className="bg-[#1F140C] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#F2C14E]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c9b896] uppercase tracking-wider">
              Bảo Tượng Phật Giáo
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/30 flex items-center justify-center text-[#F2C14E]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">{statueCount}</div>
          <div className="text-[11px] text-[#F2C14E] flex items-center gap-1">
            <span>8 Chúng Hội • 11 Khu Vực</span>
          </div>
        </div>

        <div className="bg-[#1F140C] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#F2C14E]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c9b896] uppercase tracking-wider">
              Tra Cứu Bài Vị
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/30 flex items-center justify-center text-[#F2C14E]">
              <Scroll className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">Tứ Ân</div>
          <div className="text-[11px] text-[#c9b896]/80 flex items-center gap-1">
            <span>Sơ đồ vị trí số hóa</span>
          </div>
        </div>

        <div className="bg-[#1F140C] border border-[#F2C14E]/25 rounded-2xl p-5 space-y-3 shadow-lg hover:border-[#F2C14E]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c9b896] uppercase tracking-wider">
              Khóa Tu &amp; Công Quả
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F2C14E]/15 border border-[#F2C14E]/30 flex items-center justify-center text-[#F2C14E]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono">Đang Mở</div>
          <div className="text-[11px] text-green-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Biểu mẫu trực tuyến hoạt động
          </div>
        </div>
      </div>

      {/* Recent Articles Section */}
      <div className="bg-[#1C120A] border border-[#F2C14E]/25 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2C14E]/20">
          <h2 className="text-lg font-bold text-[#FFE5A3] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#F2C14E]" />
            <span>Bài Viết Tông Chỉ Tu Học Gần Đây</span>
          </h2>
          <Link
            href="/admin/tong-chi"
            className="w-8 h-8 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#F2C14E] flex items-center justify-center transition-all hover:scale-105"
            title="Xem tất cả bài viết"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-[#F2C14E]/10">
          {recentArticles.map((article) => (
            <div
              key={article.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#25170E]/50 p-2 rounded-xl transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F2C14E]/15 text-[#F2C14E] text-[10px] font-bold border border-[#F2C14E]/30">
                    {article.categoryName || 'Tông Chỉ'}
                  </span>
                  <span className="text-xs text-[#c9b896]/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(article.publishedAt || Date.now()).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm hover:text-[#F2C14E] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-[#c9b896]/80 line-clamp-1">{article.excerpt}</p>
                <div className="text-[11px] text-[#FFE5A3]/70">
                  ⚡ Có <strong>{article.keywords?.length || 0}</strong> từ khóa có Popup chú thích
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/tong-chi/${article.id}`}
                  className="w-8 h-8 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/40 text-[#FFE5A3] flex items-center justify-center transition-all hover:scale-105"
                  title="Chỉnh sửa bài viết"
                >
                  <Scroll className="w-4 h-4 text-[#F2C14E]" />
                </Link>
                <Link
                  href={`/tong-chi-tu-hoc/${article.slug}`}
                  target="_blank"
                  className="w-8 h-8 rounded-xl bg-[#F2C14E]/20 hover:bg-[#F2C14E]/30 border border-[#F2C14E]/50 text-[#F2C14E] flex items-center justify-center transition-all hover:scale-105"
                  title="Xem bài viết trên Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
