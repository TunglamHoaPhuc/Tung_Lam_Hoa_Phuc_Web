'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Sparkles, Info } from 'lucide-react';

export interface CharCounterProps {
  current: number;
  max: number;
  recommendedMin?: number;
  label?: string;
  hint?: string;
  compact?: boolean;
  className?: string;
}

/**
 * 🪷 Bộ đếm ký tự & chuẩn hóa nội dung (Content Guideline & Character Limiter)
 * - Đảm bảo tiêu đề & sub tiêu đề không bao giờ nhảy dòng trên Hero Banner & Post Cards.
 * - Ép content viết ngắn gọn, súc tích, giữ trọn Hook và tính trang nghiêm.
 */
export function CharCounter({
  current,
  max,
  recommendedMin,
  label,
  hint,
  compact = false,
  className = '',
}: CharCounterProps) {
  const isOver = current > max;
  const isWarning = current >= Math.floor(max * 0.85) && !isOver;
  const isIdeal = recommendedMin ? current >= recommendedMin && !isOver : current > 0 && !isOver;
  const percent = Math.min(100, Math.round((current / max) * 100));

  // Chế độ thu nhỏ (Dành cho các ô trong Bảng tính Spreadsheet)
  if (compact) {
    return (
      <div className={`mt-1 flex flex-col gap-0.5 select-none ${className}`}>
        <div className="flex items-center justify-between text-[10px] px-0.5">
          <span className="text-[#A89078]/70 text-[9.5px]">Tối đa {max} kt</span>
          <span
            className={`font-mono text-[10px] font-bold flex items-center gap-0.5 ${
              isOver
                ? 'text-red-400 font-extrabold'
                : isWarning
                ? 'text-amber-400'
                : 'text-[#F2C14E]/70'
            }`}
          >
            {isOver && <AlertCircle className="w-2.5 h-2.5 text-red-400 shrink-0 inline" />}
            {current}/{max}
          </span>
        </div>
        {/* Thanh tiến độ siêu mỏng */}
        <div className="w-full h-[2px] bg-[#3A2718] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isOver
                ? 'bg-red-500'
                : isWarning
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-[#F2C14E]/60 to-[#F2C14E]'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  // Chế độ đầy đủ (Dành cho Form Soạn thảo chi tiết)
  return (
    <div className={`select-none ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="text-xs text-[#F2C14E] font-bold flex items-center gap-1.5">
            <span>{label}</span>
          </label>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          {isOver ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950/80 border border-red-500/60 text-red-300 text-[10.5px] font-bold font-mono animate-pulse">
              <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
              <span>Vượt {current - max} ký tự!</span>
              <span className="text-red-400/80">({current}/{max})</span>
            </span>
          ) : isWarning ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/50 text-amber-300 text-[10.5px] font-semibold font-mono">
              <span>Sắp chạm ngưỡng ({current}/{max})</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#25170E] border border-[#F2C14E]/30 text-[#FFE5A3]/80 text-[10.5px] font-mono">
              {isIdeal && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
              <span>{current}/{max} ký tự</span>
            </span>
          )}
        </div>
      </div>

      {/* Thanh tiến độ */}
      <div className="w-full h-1 bg-[#25170E] border border-[#F2C14E]/20 rounded-full overflow-hidden mb-1.5">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isOver
              ? 'bg-red-500'
              : isWarning
              ? 'bg-amber-400'
              : 'bg-gradient-to-r from-emerald-500 via-[#F2C14E] to-[#F2C14E]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Gợi ý Hook & súc tích */}
      {hint && (
        <p className="text-[11px] text-[#D3C0AD]/75 leading-relaxed flex items-start gap-1 mt-1">
          <Sparkles className="w-3 h-3 text-[#F2C14E] shrink-0 mt-0.5" />
          <span>{hint}</span>
        </p>
      )}
    </div>
  );
}

export default CharCounter;
