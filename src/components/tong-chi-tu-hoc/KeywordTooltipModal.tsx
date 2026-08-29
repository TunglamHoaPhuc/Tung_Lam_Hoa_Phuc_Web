'use client';

import { FC, useEffect } from 'react';
import Link from 'next/link';
import { X, ArrowRight, ExternalLink } from 'lucide-react';

interface KeywordPopup {
  keyword: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
}

interface KeywordTooltipModalProps {
  popup: KeywordPopup | null;
  onClose: () => void;
}

/**
 * KeywordTooltipModal — Glassmorphism popup viền vàng phát sáng.
 * Hiển thị khi click vào từ khóa UTM Avo Bold trong nội dung bài viết/thơ.
 * Layout: Ảnh minh họa + Tiêu đề + Nội dung tóm tắt + Nút "Xem thêm ➔" (nếu có link)
 */
export const KeywordTooltipModal: FC<KeywordTooltipModalProps> = ({ popup, onClose }) => {
  // Đóng khi nhấn Escape
  useEffect(() => {
    if (!popup) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [popup, onClose]);

  if (!popup) return null;

  const rawLink = popup.linkUrl?.trim() || '';
  const hasLink = Boolean(rawLink !== '' && rawLink !== '#');
  const isExternal = rawLink.startsWith('http://') || rawLink.startsWith('https://');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={popup.title}
    >
      {/* Modal container — Glassmorphism vàng */}
      <div
        className="relative max-w-md w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 border border-[#F2C14E]/60"
        style={{
          background: 'linear-gradient(160deg, rgba(58,39,24,0.96) 0%, rgba(20,13,7,0.98) 100%)',
          boxShadow: '0 0 50px rgba(242,193,78,0.25), 0 25px 60px rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
          fontFamily: "'UTM Avo', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Ảnh minh họa ── */}
        {popup.imageUrl && (
          <div className="relative overflow-hidden w-full" style={{ height: 210 }}>
            <img
              src={popup.imageUrl}
              alt={popup.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
              }}
            />
            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(20,13,7,0.9) 0%, transparent 60%)',
              }}
            />
            {/* Keyword badge */}
            <div className="absolute top-3.5 left-3.5">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#140D07] shadow-lg flex items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, #FFE5A3 0%, #F2C14E 100%)',
                }}
              >
                <span>☸</span>
                <span>{popup.keyword}</span>
              </span>
            </div>
          </div>
        )}

        {/* ── Nút đóng ── */}
        <button
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-[#F2C14E] text-white hover:text-black shadow-lg cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(242,193,78,0.4)' }}
          onClick={onClose}
          aria-label="Đóng chú thích"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Nội dung ── */}
        <div className="p-6 space-y-3.5 text-left">
          {/* Subtitle / Chuyên mục */}
          {popup.subtitle && (
            <div className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2C14E]" />
              <span>{popup.subtitle}</span>
            </div>
          )}

          {/* Title */}
          <h3
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-3xl text-[#ffde59] uppercase tracking-wider font-normal leading-tight"
          >
            {popup.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#e3d2c1] leading-relaxed">
            {popup.description}
          </p>

          {/* ── Nút Xem Thêm (Hỗ trợ cả link nội bộ và link ngoài web) ── */}
          {hasLink && (
            <div className="pt-2">
              <Link
                href={rawLink}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#e5b338] hover:from-[#ffde59] hover:to-[#F2C14E] text-[#140D07] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(242,193,78,0.35)] hover:scale-[1.02] group cursor-pointer"
              >
                <span>Xem thêm chi tiết</span>
                {isExternal ? (
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
