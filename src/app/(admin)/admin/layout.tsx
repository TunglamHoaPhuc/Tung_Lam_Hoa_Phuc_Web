'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  Scroll,
  Users,
  Globe,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Landmark,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Tổng Quan Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Bài Viết & Sự Kiện',
    href: '/admin/posts',
    icon: BookOpen,
    badge: 'Mới',
  },
  {
    name: 'Giới Thiệu Tông Phong',
    href: '/admin/gioi-thieu',
    icon: Landmark,
    badge: 'Bổn Tự',
  },
  {
    name: 'Tông Chỉ Tu Học',
    href: '/admin/tong-chi',
    icon: Scroll,
  },
  {
    name: 'Bảo Tượng Phật Giáo',
    href: '/admin/bao-tuong',
    icon: Sparkles,
  },
  {
    name: 'Danh Tăng & Tổ Sư',
    href: '/admin/danh-tang',
    icon: Users,
    badge: '89 Vị',
  },
  {
    name: 'Kho Ảnh S3 Cloud',
    href: '/kiem-tra-anh',
    icon: ImageIcon,
  },
  {
    name: 'Tra Cứu Bài Vị Tứ Ân',
    href: '/admin/memorials/danh-sach',
    icon: Scroll,
  },
  {
    name: 'Đăng Ký Khóa Tu & Công Quả',
    href: '/admin/registrations/khoa-tu',
    icon: Users,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Mặc định thu gọn tối giản icon/logo để không bị co hẹp bảng tính
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div
      style={{ fontFamily: "'UTM Avo', sans-serif" }}
      className="min-h-screen bg-[#140D07] text-[#e3d2c1] flex flex-col md:flex-row selection:bg-[#F2C14E] selection:text-black overflow-x-hidden"
    >
      {/* Sidebar (Có thể thu gọn mở rộng mượt mà, chế độ tối giản gọn gàng w-16) */}
      <aside
        className={`bg-[#1C120A] border-r border-[#F2C14E]/25 flex flex-col shrink-0 transition-all duration-300 relative z-40 ${
          isCollapsed ? 'w-full md:w-16' : 'w-full md:w-64'
        }`}
      >
        {/* Brand Header */}
        <div className={`p-3.5 sm:p-4 border-b border-[#F2C14E]/20 bg-[#25170E]/60 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shadow-[0_0_15px_rgba(242,193,78,0.3)] shrink-0">
              <svg className="w-5 h-5 text-[#ffde59]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h2
                  style={{ fontFamily: "'UTM Niagara', serif" }}
                  className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal leading-tight truncate"
                >
                  HÒA PHÚC CMS
                </h2>
                <p className="text-[10px] text-[#F2C14E] font-medium flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" /> Quản trị Nội bộ
                </p>
              </div>
            )}
          </div>

          {/* Toggle Collapse Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#F2C14E] transition-all cursor-pointer hidden md:flex items-center justify-center"
            title={isCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 py-2 text-[10px] font-bold tracking-widest text-[#F2C14E]/60 uppercase">
              Phân hệ Quản trị
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'
                } rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6B4B2A] to-[#422C17] text-[#FFE5A3] border border-[#F2C14E]/60 shadow-[0_4px_12px_rgba(0,0,0,0.4)]'
                    : 'text-[#c9b896]/80 hover:text-[#FFE5A3] hover:bg-[#2A1D14]/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F2C14E]' : 'text-[#c9b896]/60'}`} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F2C14E]/20 text-[#F2C14E] text-[10px] font-bold border border-[#F2C14E]/30 shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-[#F2C14E]/10" />

          <Link
            href="/"
            target="_blank"
            title={isCollapsed ? 'Xem Trang Chủ Website' : undefined}
            className={`flex items-center ${
              isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'
            } rounded-xl text-xs font-semibold text-[#c9b896]/80 hover:text-[#FFE5A3] hover:bg-[#2A1D14]/80 transition-all`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#F2C14E] shrink-0" />
              {!isCollapsed && <span>Xem Trang Chủ Web</span>}
            </div>
            {!isCollapsed && <ExternalLink className="w-3.5 h-3.5 text-[#c9b896]/40" />}
          </Link>
        </nav>

        {/* Footer info */}
        {!isCollapsed ? (
          <div className="p-4 border-t border-[#F2C14E]/15 bg-[#140D07] text-[10px] text-[#c9b896]/60 text-center">
            Tùng Lâm Hòa Phúc • Bản Quyền v1.0.0
          </div>
        ) : (
          <div className="p-3 border-t border-[#F2C14E]/15 bg-[#140D07] text-center text-[#F2C14E] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#F2C14E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2" />
            </svg>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#F2C14E]/20 bg-[#1C120A]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 text-xs text-[#c9b896]">
            <span className="hidden sm:inline">Quản trị</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#F2C14E]/50 hidden sm:inline" />
            <span className="text-[#FFE5A3] font-bold">
              {NAV_ITEMS.find((i) => pathname === i.href || (i.href !== '/admin' && pathname.startsWith(i.href)))?.name || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Minimal right header */}
          </div>
        </header>

        {/* Page Container */}
        <div className="flex-1 p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
