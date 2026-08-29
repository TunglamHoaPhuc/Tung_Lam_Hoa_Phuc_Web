'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Check,
  RotateCcw,
  Crosshair,
  Sliders,
  Eye,
  Maximize2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ImageFocalPositionerModalProps {
  isOpen: boolean;
  imageUrl: string;
  initialPosition?: string;
  title?: string;
  onSave: (position: string) => void;
  onClose: () => void;
}

const PRESET_GRIDS = [
  { label: 'Góc trên trái', x: 0, y: 0 },
  { label: 'Chính giữa trên (Đầu/Mặt)', x: 50, y: 0 },
  { label: 'Góc trên phải', x: 100, y: 0 },
  { label: 'Chính giữa trái', x: 0, y: 50 },
  { label: 'Trung tâm', x: 50, y: 50 },
  { label: 'Chính giữa phải', x: 100, y: 50 },
  { label: 'Góc dưới trái', x: 0, y: 100 },
  { label: 'Chính giữa dưới', x: 50, y: 100 },
  { label: 'Góc dưới phải', x: 100, y: 100 },
];

const ASPECT_RATIOS = [
  { id: '21-9', label: '21:9 (Banner Ngang)', aspectClass: 'aspect-[21/9]' },
  { id: '16-9', label: '16:9 (Bài Viết / Video)', aspectClass: 'aspect-[16/9]' },
  { id: '4-3', label: '4:3 (Thẻ Danh Mục)', aspectClass: 'aspect-[4/3]' },
  { id: '3-4', label: '3:4 (Chân Dung / Tượng)', aspectClass: 'aspect-[3/4]' },
  { id: '1-1', label: '1:1 (Ảnh Vuông)', aspectClass: 'aspect-square' },
];

function parsePosition(posStr?: string): { x: number; y: number } {
  if (!posStr) return { x: 50, y: 50 };
  if (posStr === 'center' || posStr === 'center center') return { x: 50, y: 50 };
  if (posStr === 'top' || posStr === 'top center') return { x: 50, y: 0 };
  if (posStr === 'bottom' || posStr === 'bottom center') return { x: 50, y: 100 };
  if (posStr === 'left' || posStr === 'left center') return { x: 0, y: 50 };
  if (posStr === 'right' || posStr === 'right center') return { x: 100, y: 50 };

  const parts = posStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    const x = parseFloat(parts[0].replace('%', ''));
    const y = parseFloat(parts[1].replace('%', ''));
    return {
      x: isNaN(x) ? 50 : Math.max(0, Math.min(100, x)),
      y: isNaN(y) ? 50 : Math.max(0, Math.min(100, y)),
    };
  }
  return { x: 50, y: 50 };
}

export function ImageFocalPositionerModal({
  isOpen,
  imageUrl,
  initialPosition = '50% 50%',
  title = 'Căn Chỉnh Tiêu Điểm Trọng Tâm Ảnh',
  onSave,
  onClose,
}: ImageFocalPositionerModalProps) {
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [selectedPreviewAspect, setSelectedPreviewAspect] = useState('16-9');
  const [isDragging, setIsDragging] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFocalPoint(parsePosition(initialPosition));
    }
  }, [isOpen, initialPosition]);

  const updatePositionFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.round(Math.max(0, Math.min(100, rawX)));
    const clampedY = Math.round(Math.max(0, Math.min(100, rawY)));
    setFocalPoint({ x: clampedX, y: clampedY });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePositionFromEvent(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updatePositionFromEvent(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      updatePositionFromEvent(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      updatePositionFromEvent(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleSave = () => {
    const cssPos = `${focalPoint.x}% ${focalPoint.y}%`;
    onSave(cssPos);
    onClose();
  };

  if (!isOpen) return null;

  const currentCssPos = `${focalPoint.x}% ${focalPoint.y}%`;
  const activeAspect = ASPECT_RATIOS.find((a) => a.id === selectedPreviewAspect) || ASPECT_RATIOS[1];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#1C120A] border-2 border-[#F2C14E]/60 shadow-[0_0_60px_rgba(242,193,78,0.35)] overflow-hidden text-[#FFE5A3]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F2C14E]/25 bg-[#25170E]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3A2718] border border-[#F2C14E] flex items-center justify-center text-[#ffde59] shadow-sm">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h3
                style={{ fontFamily: "'UTM Niagara', serif" }}
                className="text-2xl text-[#ffde59] uppercase tracking-wider font-normal leading-tight"
              >
                {title}
              </h3>
              <p className="text-[11px] text-[#c9b896]/80 flex items-center gap-1.5">
                <span>Kéo thả hồng tâm để chọn vùng trung tâm trang nghiêm của bức ảnh</span>
                <span className="font-mono text-[#F2C14E] font-bold">({currentCssPos})</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#2A1D14] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center justify-center transition-all cursor-pointer hover:scale-105"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── BODY (2 CỘT: TRÁI CANVAS KÉO THẢ, PHẢI XEM TRƯỚC VÀ ĐIỀU KHIỂN) ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* CỘT TRÁI: CANVAS KÉO THẢ CHÍNH (7 CỘT) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#F2C14E]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Crosshair className="w-3.5 h-3.5" />
                VÙNG KÉO THẢ TIÊU ĐIỂM TRỰC QUAN
              </span>
              <span className="text-[11px] text-[#c9b896]/70">Bấm hoặc rê chuột trực tiếp lên ảnh</span>
            </div>

            {/* Container Canvas với ảnh đầy đủ */}
            <div
              ref={canvasContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/60 border-2 border-[#F2C14E]/40 cursor-crosshair group shadow-inner"
            >
              <img
                src={imageUrl}
                alt="Focal Target"
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />

              {/* Lưới tọa độ mờ trợ thị */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                <div className="border-r border-b border-dashed border-[#F2C14E]" />
                <div className="border-r border-b border-dashed border-[#F2C14E]" />
                <div className="border-b border-dashed border-[#F2C14E]" />
                <div className="border-r border-b border-dashed border-[#F2C14E]" />
                <div className="border-r border-b border-dashed border-[#F2C14E]" />
                <div className="border-b border-dashed border-[#F2C14E]" />
                <div className="border-r border-dashed border-[#F2C14E]" />
                <div className="border-r border-dashed border-[#F2C14E]" />
                <div className="" />
              </div>

              {/* HỒNG TÂM ĐỊNH VỊ PHÁT SÁNG (GLOWING RETICLE) */}
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                style={{
                  left: `${focalPoint.x}%`,
                  top: `${focalPoint.y}%`,
                }}
              >
                {/* Vòng tròn bên ngoài */}
                <div className="w-12 h-12 rounded-full border-2 border-[#ffde59] bg-[#F2C14E]/20 shadow-[0_0_20px_rgba(242,193,78,0.9)] flex items-center justify-center animate-pulse">
                  {/* Tâm điểm chữ thập */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffde59] shadow-[0_0_8px_#ffde59]" />
                </div>
                {/* 4 tia căn chỉnh */}
                <div className="absolute top-1/2 -left-3 w-3 h-0.5 bg-[#ffde59]" />
                <div className="absolute top-1/2 -right-3 w-3 h-0.5 bg-[#ffde59]" />
                <div className="absolute left-1/2 -top-3 w-0.5 h-3 bg-[#ffde59]" />
                <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-[#ffde59]" />
              </div>
            </div>

            {/* 9 Điểm Neo Nhanh (9-Grid Presets) */}
            <div className="bg-[#25170E] p-3 rounded-2xl border border-[#F2C14E]/20 space-y-2">
              <div className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wider flex items-center justify-between">
                <span>9 Điểm Neo Chuẩn Định Sẵn</span>
                <button
                  type="button"
                  onClick={() => setFocalPoint({ x: 50, y: 50 })}
                  className="text-[#c9b896] hover:text-[#ffde59] text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Về giữa (50% 50%)</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto">
                {PRESET_GRIDS.map((p, idx) => {
                  const isCurrent = focalPoint.x === p.x && focalPoint.y === p.y;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFocalPoint({ x: p.x, y: p.y })}
                      className={`py-1 px-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#F2C14E] text-[#1C120A] shadow-md scale-102 border border-[#ffde59]'
                          : 'bg-[#1A120B] hover:bg-[#3A2718] text-[#FFE5A3] border border-[#F2C14E]/20'
                      }`}
                      title={p.label}
                    >
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: XEM TRƯỚC ĐA TỈ LỆ THỰC TẾ & THANH TRƯỢT (5 CỘT) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#F2C14E]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5" />
                XEM TRƯỚC THỰC TẾ TRÊN WEBSITE
              </span>
            </div>

            {/* Chọn Tỉ Lệ Xem Trước */}
            <div className="flex flex-wrap gap-1.5">
              {ASPECT_RATIOS.map((asp) => (
                <button
                  key={asp.id}
                  type="button"
                  onClick={() => setSelectedPreviewAspect(asp.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    selectedPreviewAspect === asp.id
                      ? 'bg-[#F2C14E] text-[#1C120A] border border-[#ffde59]'
                      : 'bg-[#25170E] hover:bg-[#3A2718] text-[#FFE5A3]/80 border border-[#F2C14E]/20'
                  }`}
                >
                  {asp.label}
                </button>
              ))}
            </div>

            {/* Khung Render Xem Trước */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-black/80 border-2 border-[#F2C14E]/50 shadow-2xl flex flex-col justify-end p-3">
              <div className={`w-full ${activeAspect.aspectClass} overflow-hidden rounded-xl bg-[#140D07] relative`}>
                <img
                  src={imageUrl}
                  alt="Preview Frame"
                  className="w-full h-full object-cover transition-all duration-200"
                  style={{
                    objectPosition: currentCssPos,
                  }}
                />
              </div>

              <div className="mt-2 text-center text-[10px] text-[#c9b896]/70 italic">
                Khung hiển thị thực tế áp dụng CSS: <span className="font-mono text-[#F2C14E] font-bold">object-position: {currentCssPos};</span>
              </div>
            </div>

            {/* Thanh Trượt Tinh Chỉnh X% và Y% */}
            <div className="bg-[#25170E] p-3.5 rounded-2xl border border-[#F2C14E]/20 space-y-3">
              <div className="text-[11px] font-bold text-[#F2C14E] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Tinh Chỉnh Tọa Độ Chính Xác</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Trục X */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#c9b896]">Căn ngang (Trục X):</span>
                    <span className="font-mono font-bold text-[#F2C14E]">{focalPoint.x}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focalPoint.x}
                    onChange={(e) => setFocalPoint({ ...focalPoint, x: parseInt(e.target.value, 10) })}
                    className="w-full h-1.5 bg-[#140D07] rounded-lg appearance-none cursor-pointer accent-[#F2C14E]"
                  />
                </div>

                {/* Trục Y */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#c9b896]">Căn dọc (Trục Y):</span>
                    <span className="font-mono font-bold text-[#F2C14E]">{focalPoint.y}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focalPoint.y}
                    onChange={(e) => setFocalPoint({ ...focalPoint, y: parseInt(e.target.value, 10) })}
                    className="w-full h-1.5 bg-[#140D07] rounded-lg appearance-none cursor-pointer accent-[#F2C14E]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#F2C14E]/25 bg-[#25170E]/80">
          <div className="text-xs text-[#c9b896]">
            Giá trị sẽ áp dụng: <span className="font-mono font-bold text-[#ffde59]">{currentCssPos}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#1C120A] hover:bg-[#3A2718] border border-[#F2C14E]/30 text-[#FFE5A3] flex items-center justify-center transition-all cursor-pointer hover:scale-105"
              title="Hủy bỏ"
            >
              <X className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#ffde59] text-[#1C120A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(242,193,78,0.4)] hover:brightness-110 transition-all cursor-pointer hover:scale-105"
              title="Xác nhận lưu vị trí này"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Áp Dụng Vị Trí</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
