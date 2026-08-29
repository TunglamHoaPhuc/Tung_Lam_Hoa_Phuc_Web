'use client';

import React from 'react';
import { AlertTriangle, Save, Trash2, X, Loader2 } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  saving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function UnsavedChangesModal({
  isOpen,
  saving = false,
  onSave,
  onDiscard,
  onCancel,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1C120A] border-2 border-[#F2C14E]/60 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-center space-y-5 relative animate-in zoom-in-95 duration-200">
        {/* Close Button top-right */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center justify-center transition-all cursor-pointer hover:scale-105"
          title="Đóng & Ở lại chỉnh sửa"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon with Zen glowing pulse */}
        <div className="w-16 h-16 rounded-2xl bg-[#3A2718]/80 border border-[#F2C14E] mx-auto flex items-center justify-center text-[#ffde59] shadow-[0_0_30px_rgba(242,193,78,0.35)]">
          <AlertTriangle className="w-8 h-8 animate-bounce text-[#F2C14E]" />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-3xl text-[#ffde59] uppercase tracking-wide font-normal"
          >
            DỮ LIỆU CHƯA ĐƯỢC LƯU
          </h3>
          <p className="text-xs text-[#FFE5A3]/80 leading-relaxed max-w-xs mx-auto">
            Bạn có các thay đổi chưa bấm lưu. Bạn có muốn lưu lại dữ liệu trước khi rời đi không?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          {/* 1. Lưu Ngay & Tiếp Tục */}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#D4A017] hover:brightness-110 text-[#1C120A] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(242,193,78,0.4)] cursor-pointer disabled:opacity-50 hover:scale-105"
            title="Lưu lại tất cả thay đổi ngay lập tức"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 stroke-[2.5]" />}
            <span>Lưu Ngay</span>
          </button>

          {/* 2. Bỏ Qua Thay Đổi & Thoát */}
          <button
            type="button"
            onClick={onDiscard}
            disabled={saving}
            className="py-2.5 px-3.5 rounded-xl bg-red-950/40 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-105"
            title="Bỏ qua thay đổi và thoát ra"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bỏ Qua</span>
          </button>

          {/* 3. Ở Lại */}
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center justify-center transition-all cursor-pointer hover:scale-105 shrink-0"
            title="Ở lại trang tiếp tục chỉnh sửa"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
