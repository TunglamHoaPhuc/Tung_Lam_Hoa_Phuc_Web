'use client';

import { FC, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface KeywordPopup {
  keyword: string;
  title: string;
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
 * Layout: Ảnh minh họa + Tiêu đề + Nội dung tóm tắt + Nút "Tìm hiểu thêm ➔"
 */
export const KeywordTooltipModal: FC<KeywordTooltipModalProps> = ({ popup, onClose }) => {
  // Đóng khi nhấn Escape
  useEffect(() => {
    if (!popup) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [popup, onClose]);

  if (!popup) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={popup.title}
    >
      {/* Modal container — Glassmorphism vàng */}
      <div
        className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95"
        style={{
          background: 'linear-gradient(160deg, rgba(74,55,40,0.92) 0%, rgba(26,15,8,0.96) 100%)',
          border: '1.5px solid rgba(242,193,78,0.55)',
          boxShadow: '0 0 48px rgba(242,193,78,0.18), 0 24px 64px rgba(0,0,0,0.55)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Ảnh minh họa ── */}
        {popup.imageUrl && (
          <div className="relative overflow-hidden" style={{ height: 180 }}>
            <img
              src={popup.imageUrl}
              alt={popup.title}
              className="w-full h-full object-cover"
            />
            {/* overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(26,15,8,0.85) 0%, transparent 55%)',
              }}
            />
            {/* Keyword badge */}
            <div className="absolute top-3 left-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  background: 'rgba(242,193,78,0.15)',
                  border: '1px solid rgba(242,193,78,0.5)',
                  color: '#F2C14E',
                  backdropFilter: 'blur(4px)',
                  fontFamily: "'UTM Avo', sans-serif",
                  fontWeight: 'bold',
                }}
              >
                {popup.keyword}
              </span>
            </div>
          </div>
        )}

        {/* ── Nút đóng ── */}
        <button
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/20"
          style={{ background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.8)' }}
          onClick={onClose}
          aria-label="Đóng chú thích"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* ── Nội dung ── */}
        <div className="p-5">
          {/* divider vàng */}
          <div
            className="h-px w-10 mb-3"
            style={{ background: 'linear-gradient(to right, #F2C14E, transparent)' }}
          />

          <h3
            className="text-lg font-bold mb-2 leading-snug"
            style={{
              color: '#F2C14E',
              textShadow: '0 0 16px rgba(242,193,78,0.5)',
              fontFamily: "'UTM ClassizismAntiqua', serif",
            }}
          >
            {popup.title}
          </h3>

          <p
            className="text-sm leading-relaxed"
            style={{
              color: '#e3d2c1',
              fontFamily: "'UTM Avo', sans-serif",
            }}
          >
            {popup.description}
          </p>

          {/* ── Nút Tìm Hiểu Thêm ── */}
          {popup.linkUrl && (
            <a
              href={popup.linkUrl}
              className="mt-4 flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3 group"
              style={{
                color: '#F2C14E',
                fontFamily: "'UTM Avo', sans-serif",
                fontWeight: 'bold',
              }}
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Tìm hiểu thêm</span>
              <span className="transition-transform group-hover:translate-x-1">➔</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
