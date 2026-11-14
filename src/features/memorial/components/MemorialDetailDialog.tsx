'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, Copy, X } from 'lucide-react';
import { MemorialPublicRecord } from '@/lib/memorial-types';

interface MemorialDetailDialogProps {
  record: MemorialPublicRecord | null;
  onClose: () => void;
}

export function MemorialDetailDialog({ record, onClose }: MemorialDetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (record) {
      setCopied(false);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [record]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('close', handleClose);

    // Fallback light-dismiss cho trình duyệt chưa hỗ trợ thuộc tính closedby="any" (Safari)
    let cleanupOutside: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const isOutside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      let pressedOutside = false;
      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e)) {
          dialog.close();
        }
        pressedOutside = false;
      };
      dialog.addEventListener('pointerdown', onPointerDown);
      dialog.addEventListener('pointerup', onPointerUp);
      cleanupOutside = () => {
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupOutside?.();
    };
  }, [onClose]);

  const handleCopy = async () => {
    if (!record) return;
    const lines = [
      `Tra cứu bài vị — Tùng Lâm Hòa Phúc`,
      `Mã số bài vị: ${record.code || 'Đang cập nhật'}`,
      `Hương linh / Tổ tiên: ${record.name}`,
      record.dharmaName ? `Pháp danh: ${record.dharmaName}` : '',
      record.lineageType ? `Phân loại: ${record.lineageType}` : '',
      `Khu vực: ${record.category}`,
      record.deathDate ? `Ngày mất: ${record.deathDate}${record.age ? ` (Hưởng ${record.age} tuổi)` : ''}` : '',
      record.address ? `Địa chỉ / An táng: ${record.address}` : '',
    ].filter(Boolean);

    try {
      await navigator.clipboard?.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Bỏ qua nếu trình duyệt chặn clipboard
    }
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby={titleId}
      className="m-auto w-[calc(100%-1.5rem)] max-w-md rounded-2xl border border-[#F2C14E]/60 bg-gradient-to-b from-[#2A180D] via-[#1C1008] to-[#120904] p-0 text-[#e3d2c1] shadow-[0_0_50px_rgba(242,193,78,0.28)]"
    >
      {record && (
        <div className="p-5 sm:p-6 space-y-4">
          {/* Header & Close button */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-widest text-[#F2C14E]/80"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {record.category}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Đóng hộp thoại chi tiết bài vị"
              className="w-8 h-8 rounded-full bg-black/50 border border-[#F2C14E]/40 text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-[#1C1008] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mã Số Bài Vị Nổi Bật */}
          <div className="rounded-xl border border-[#F2C14E]/50 bg-[#140B05] px-4 py-4 text-center space-y-2">
            <span
              className="inline-block text-[11px] uppercase tracking-widest text-[#c9b896]"
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
            >
              Mã số bài vị
            </span>
            <div className="flex justify-center">
              <span className="inline-flex items-center justify-center px-5 py-1.5 rounded-lg bg-[#8B1E0F] border border-[#F2C14E] text-[#FFE5A3] font-mono text-2xl sm:text-3xl font-bold tracking-wider shadow-md">
                {record.code || '—'}
              </span>
            </div>

            <h2
              id={titleId}
              className="text-2xl sm:text-3xl text-[#FFE5A3] font-normal uppercase pt-1 leading-snug"
              style={{ fontFamily: "'UTM Niagara', serif" }}
            >
              {record.name}
            </h2>

            {(record.dharmaName || record.lineageType) && (
              <div
                className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#F2C14E] font-semibold"
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
              >
                {record.dharmaName && <span>Pháp danh: {record.dharmaName}</span>}
                {record.lineageType && (
                  <span className="px-2 py-0.5 rounded bg-[#F2C14E]/15 border border-[#F2C14E]/35 text-[11px]">
                    {record.lineageType}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Thông tin đối chiếu cơ bản */}
          <dl
            className="divide-y divide-[#F2C14E]/15 rounded-xl bg-[#180E08] border border-[#F2C14E]/20 px-4 py-2 text-xs sm:text-sm"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {record.birthDate && (
              <div className="py-2 flex justify-between gap-4">
                <dt className="text-[#c9b896] shrink-0">Sinh ngày / Năm:</dt>
                <dd className="text-white text-right font-medium">{record.birthDate}</dd>
              </div>
            )}
            {record.deathDate && (
              <div className="py-2 flex justify-between gap-4">
                <dt className="text-[#c9b896] shrink-0">Tạ thế / Kỷ niệm:</dt>
                <dd className="text-white text-right font-medium">
                  {record.deathDate}
                  {record.age ? ` (${record.age} tuổi)` : ''}
                </dd>
              </div>
            )}
            {!record.deathDate && record.age && (
              <div className="py-2 flex justify-between gap-4">
                <dt className="text-[#c9b896] shrink-0">Hưởng dương / thọ:</dt>
                <dd className="text-white text-right font-medium">{record.age} tuổi</dd>
              </div>
            )}
            {record.gender && (
              <div className="py-2 flex justify-between gap-4">
                <dt className="text-[#c9b896] shrink-0">Giới tính:</dt>
                <dd className="text-white text-right">{record.gender}</dd>
              </div>
            )}
            {(record.address || record.burialLocation) && (
              <div className="py-2 flex justify-between gap-4">
                <dt className="text-[#c9b896] shrink-0">Địa chỉ / An táng:</dt>
                <dd className="text-[#FFE5A3] text-right">
                  {record.address || record.burialLocation}
                </dd>
              </div>
            )}
            {record.contactMasked && (
              <div className="py-2 flex justify-between gap-4">
                <dt className="text-[#c9b896] shrink-0">Thân nhân:</dt>
                <dd className="text-[#e3d2c1] text-right">{record.contactMasked}</dd>
              </div>
            )}
          </dl>

          {/* Action button */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C130D] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép mã số & thông tin' : 'Sao chép mã số bài vị'}</span>
          </button>
        </div>
      )}
    </dialog>
  );
}
