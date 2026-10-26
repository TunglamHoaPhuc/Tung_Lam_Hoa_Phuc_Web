'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, CheckCircle2, BookOpen, MapPin, Compass, Sparkles } from 'lucide-react';
import tongChiData from '@/data/tong-chi-data.json';
import { HOANG_PHAP_ARTICLES } from '@/data/dong-chay-hoang-phap-data';
import { UNIVERSE_AREAS } from '@/data/universe-data';

interface NavDropdownPanelProps {
  pageTitle?: string;
  activeSection?: string;
  onClose: () => void;
}

const TONG_CHI_CATEGORIES = [
  { id: 'tong-phong-truyen-thua', name: 'TÔNG PHONG TRUYỀN THỪA', short: 'TÔNG PHONG' },
  { id: 'nen-tang-tu-hoc', name: 'NỀN TẢNG TU HỌC', short: 'NỀN TẢNG' },
  { id: 'phuong-phap-hanh-tri', name: 'PHƯƠNG PHÁP HÀNH TRÌ', short: 'HÀNH TRÌ' },
  { id: 'lo-trinh-tu-hoc', name: 'LỘ TRÌNH TU HỌC', short: 'LỘ TRÌNH' },
  { id: 'nep-song-thien-gia', name: 'NẾP SỐNG THIỀN GIA', short: 'NẾP SỐNG' },
];

export function NavDropdownPanel({ pageTitle = '', activeSection = '', onClose }: NavDropdownPanelProps) {
  const pathname = usePathname() || '';

  // 1. Nhận diện phân hệ hiện tại
  const isUniverse = pathname.includes('/vu-tru-phat-giao');
  const isHoangPhap = pathname.includes('/dong-chay-hoang-phap');
  const isTongChi = !isUniverse && !isHoangPhap;

  // 2. State chọn danh mục cho Tông Chỉ Tu Học
  const normalizedTitle = pageTitle.toLowerCase().trim();

  // Xác định category mặc định cho Tông Chỉ
  const defaultCategory = useMemo(() => {
    // Tìm bài viết hiện tại trong tongChiData
    const currentItem = tongChiData.find((a) => {
      if (pathname && a.slug && pathname.includes(a.slug)) return true;
      const t = a.title.toLowerCase().trim();
      return t === normalizedTitle || normalizedTitle.includes(t) || t.includes(normalizedTitle);
    });
    if (currentItem?.category) return currentItem.category;

    // Nếu ở trang chủ, map theo activeSection
    if (activeSection === 'tong-phong') return 'tong-phong-truyen-thua';
    if (activeSection === 'nen-tang') return 'nen-tang-tu-hoc';
    if (activeSection === 'phap-mon') return 'phuong-phap-hanh-tri';
    if (activeSection === 'lo-trinh') return 'lo-trinh-tu-hoc';
    if (activeSection === 'nep-song') return 'nep-song-thien-gia';

    return 'tong-phong-truyen-thua';
  }, [pathname, normalizedTitle, activeSection]);

  const [selectedCat, setSelectedCat] = useState<string>(defaultCategory);

  // ── TRƯỜNG HỢP 1: VŨ TRỤ PHẬT GIÁO ──────────────────────────────────────────
  if (isUniverse) {
    const specialRoutes: Record<string, string> = {
      'tam-bao': '/vu-tru-phat-giao/tam-bao',
      'to-duong': '/vu-tru-phat-giao/to-duong',
      'tu-an': '/vu-tru-phat-giao/tu-an',
      'giang-duong': '/vu-tru-phat-giao/giang-duong',
      'thu-vien': '/vu-tru-phat-giao/thu-vien',
    };

    return (
      <div className="w-80 sm:w-96 bg-[#1C120A]/98 border-2 border-[#F2C14E] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(242,193,78,0.3)] backdrop-blur-xl p-3 z-[100] text-left">
        {/* Dropdown Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2C14E]/30 px-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#F2C14E]" />
            <span
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wider"
            >
              KHU VỰC VŨ TRỤ PHẬT GIÁO
            </span>
          </div>
          <span
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="px-2 py-0.5 rounded-full bg-[#3A2718] border border-[#F2C14E]/40 text-[10px] font-bold text-[#ffde59]"
          >
            {UNIVERSE_AREAS.length} khu vực
          </span>
        </div>

        {/* Danh sách các khu vực */}
        <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {UNIVERSE_AREAS.map((area, idx) => {
            const href = specialRoutes[area.slug] || `/vu-tru-phat-giao/${area.slug}`;
            const isCurrent =
              pathname === href ||
              pathname.endsWith(`/${area.slug}`) ||
              area.name.toLowerCase().trim() === normalizedTitle;

            return (
              <Link
                key={area.id || area.slug}
                href={href}
                onClick={onClose}
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
                    #{area.pinNumber || idx + 1}
                  </div>

                  <div className="min-w-0">
                    <h4
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className={`text-xs sm:text-[13px] uppercase font-bold tracking-wider leading-snug truncate transition-colors ${
                        isCurrent ? 'text-[#ffde59]' : 'text-[#FFE5A3] group-hover:text-[#ffde59]'
                      }`}
                    >
                      {area.name}
                    </h4>
                    {area.subtitle && (
                      <p
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-[10px] text-[#c9b896]/80 italic truncate mt-0.5"
                      >
                        {area.subtitle}
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
    );
  }

  // ── TRƯỜNG HỢP 2: DÒNG CHẢY HOẰNG PHÁP ──────────────────────────────────────
  if (isHoangPhap) {
    return (
      <div className="w-80 sm:w-96 bg-[#1C120A]/98 border-2 border-[#F2C14E] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(242,193,78,0.3)] backdrop-blur-xl p-3 z-[100] text-left">
        {/* Dropdown Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2C14E]/30 px-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#F2C14E]" />
            <span
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wider"
            >
              DÒNG CHẢY HOẰNG PHÁP
            </span>
          </div>
          <span
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="px-2 py-0.5 rounded-full bg-[#3A2718] border border-[#F2C14E]/40 text-[10px] font-bold text-[#ffde59]"
          >
            {HOANG_PHAP_ARTICLES.length} bài
          </span>
        </div>

        {/* Danh sách các bài hoằng pháp */}
        <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {HOANG_PHAP_ARTICLES.map((art, idx) => {
            const href = `/dong-chay-hoang-phap/${art.slug}`;
            const isCurrent =
              pathname === href ||
              pathname.endsWith(`/${art.slug}`) ||
              art.title.toLowerCase().trim() === normalizedTitle;

            return (
              <Link
                key={art.id || art.slug}
                href={href}
                onClick={onClose}
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
                    #{idx + 1}
                  </div>

                  <div className="min-w-0">
                    <h4
                      style={{ fontFamily: "'UTM Avo', sans-serif" }}
                      className={`text-xs sm:text-[13px] uppercase font-bold tracking-wider leading-snug truncate transition-colors ${
                        isCurrent ? 'text-[#ffde59]' : 'text-[#FFE5A3] group-hover:text-[#ffde59]'
                      }`}
                    >
                      {art.title}
                    </h4>
                    {(art.subtitle || art.subCategory) && (
                      <p
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-[10px] text-[#c9b896]/80 italic truncate mt-0.5"
                      >
                        {art.subtitle || art.subCategory}
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
    );
  }

  // ── TRƯỜNG HỢP 3: TÔNG CHỈ TU HỌC (CHUẨN 5 CHUYÊN MỤC VÀ TABS CHUYỂN NHANH) ──
  const activeCategoryMeta =
    TONG_CHI_CATEGORIES.find((c) => c.id === selectedCat) || TONG_CHI_CATEGORIES[0];
  const currentCategoryArticles = tongChiData.filter((a) => a.category === selectedCat);

  return (
    <div className="w-80 sm:w-96 bg-[#1C120A]/98 border-2 border-[#F2C14E] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(242,193,78,0.3)] backdrop-blur-xl p-3 z-[100] text-left">
      {/* 5 Tabs chọn chuyên mục Tông Chỉ Tu Học */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 mb-2 border-b border-[#F2C14E]/20">
        {TONG_CHI_CATEGORIES.map((cat) => {
          const isTabActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className={`px-2 py-1 rounded-lg text-[9.5px] sm:text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
                isTabActive
                  ? 'bg-[#F2C14E] text-[#1C120A] border-[#F2C14E] shadow-[0_0_10px_rgba(242,193,78,0.4)]'
                  : 'bg-[#2A1D14]/80 text-[#d4c3ab] hover:text-[#ffde59] border-[#F2C14E]/20 hover:border-[#F2C14E]/60'
              }`}
            >
              {cat.short}
            </button>
          );
        })}
      </div>

      {/* Header chuyên mục đang chọn */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2C14E]/25 px-1">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#F2C14E] shrink-0" />
          <span
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wider truncate"
          >
            {activeCategoryMeta.name}
          </span>
        </div>
        <span
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="px-2 py-0.5 rounded-full bg-[#3A2718] border border-[#F2C14E]/40 text-[10px] font-bold text-[#ffde59] shrink-0"
        >
          {currentCategoryArticles.length} bài
        </span>
      </div>

      {/* Danh sách các bài viết trong chuyên mục */}
      <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
        {currentCategoryArticles.map((art) => {
          const href = `/tong-chi-tu-hoc/${art.slug}`;
          const isCurrent =
            pathname === href ||
            pathname.endsWith(`/${art.slug}`) ||
            art.title.toLowerCase().trim() === normalizedTitle;

          return (
            <Link
              key={art.id || art.slug}
              href={href}
              onClick={onClose}
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
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className={`text-xs sm:text-[13px] uppercase font-bold tracking-wider leading-snug truncate transition-colors ${
                      isCurrent ? 'text-[#ffde59]' : 'text-[#FFE5A3] group-hover:text-[#ffde59]'
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
  );
}
