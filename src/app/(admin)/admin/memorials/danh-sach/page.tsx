'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Loader2,
  QrCode,
  RefreshCw,
  Search,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DEFAULT_MEMORIAL_DRIVE_FILE_ID,
  DEFAULT_MEMORIAL_DRIVE_URL,
  MEMORIAL_CATEGORY_OPTIONS,
  MemorialRecord,
  MemorialSyncMeta,
  normalizeVietnamese,
} from '@/lib/memorial-types';

interface QrPreset {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  fileName: string;
}

const QR_PRESETS: QrPreset[] = [
  {
    id: 'all',
    title: 'Tra Cứu Toàn Chùa',
    subtitle:
      'Tích hợp toàn bộ Nhà Tưởng Ân (Chung, Cá Nhân, Tổ Tiên, Phụ Mẫu Xuất Gia) & Vãng Sinh Đường (Nam, Nữ)',
    path: '/tra-cuu-bai-vi',
    fileName: 'QR-Tra-Cuu-Bai-Vi-Toan-Chua.png',
  },
];

const SHEET_STATS_CONFIG = [
  { slug: 'nha-tu-an-ca-nhan', label: 'Tưởng Ân - Cá Nhân' },
  { slug: 'nha-tu-an-to-tien', label: 'Tưởng Ân - Tổ Tiên' },
  { slug: 'vang-sinh-duong-nam', label: 'VSĐ (Nam)' },
  { slug: 'vang-sinh-duong-nu', label: 'VSĐ (Nữ)' },
  { slug: 'phu-mau-xuat-gia', label: 'Phụ Mẫu X.Gia' },
];

const PRODUCTION_SITE_ORIGIN = 'https://www.tunglamhoaphuc.com';

function normalizeQrOrigin(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return PRODUCTION_SITE_ORIGIN;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    return parsed.origin;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

export default function AdminMemorialsDanhSachPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [records, setRecords] = useState<MemorialRecord[]>([]);
  const [meta, setMeta] = useState<MemorialSyncMeta>({
    driveUrl: DEFAULT_MEMORIAL_DRIVE_URL,
    driveFileId: DEFAULT_MEMORIAL_DRIVE_FILE_ID,
    lastSyncedAt: '',
    totalRecords: 0,
    countsByCategory: {},
  });
  const [driveUrlInput, setDriveUrlInput] = useState(DEFAULT_MEMORIAL_DRIVE_URL);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [baseOrigin, setBaseOrigin] = useState(PRODUCTION_SITE_ORIGIN);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [copiedQrId, setCopiedQrId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const fetchAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/memorials', { cache: 'no-store' });
      const json = await res.json();
      if (json?.success && json.data) {
        setRecords(json.data.records || []);
        if (json.data.meta) {
          setMeta(json.data.meta);
          setDriveUrlInput(json.data.meta.driveUrl || DEFAULT_MEMORIAL_DRIVE_URL);
        }
      }
    } catch {
      toast.error('Không thể tải dữ liệu bài vị từ hệ thống.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const isPublicDomain =
        host.includes('.') && !host.endsWith('.local') && !/^\d+\.\d+\.\d+\.\d+$/.test(host);
      setBaseOrigin(isPublicDomain ? window.location.origin : PRODUCTION_SITE_ORIGIN);
    }
  }, [fetchAdminData]);

  // Sinh mã QR mỗi khi baseOrigin thay đổi (tự động chuẩn hóa tránh lặp path hoặc thiếu http://)
  useEffect(() => {
    const cleanOrigin = normalizeQrOrigin(baseOrigin);
    if (!cleanOrigin) return;

    let active = true;
    Promise.all(
      QR_PRESETS.map(async (preset) => {
        const url = `${cleanOrigin}${preset.path}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 480,
          margin: 2,
          color: { dark: '#1C1008', light: '#FFFFFF' },
        });
        return [preset.id, dataUrl] as const;
      })
    )
      .then((entries) => {
        if (active) {
          setQrImages(Object.fromEntries(entries));
        }
      })
      .catch(() => {
        // Bỏ qua lỗi render QR tạm thời nếu người dùng đang sửa URL
      });

    return () => {
      active = false;
    };
  }, [baseOrigin]);

  const handleSyncDrive = async () => {
    try {
      setIsSyncing(true);
      toast.info('Đang tải file Excel từ Google Drive và trích xuất 5 sheet...');
      const res = await fetch('/api/admin/memorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync-drive',
          driveUrl: driveUrlInput.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.error || 'Đồng bộ từ Google Drive thất bại.');
        return;
      }
      toast.success(json.message || 'Đồng bộ thành công!');
      await fetchAdminData();
    } catch (err: any) {
      toast.error(err?.message || 'Lỗi kết nối khi đồng bộ từ Google Drive.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsSyncing(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/memorials', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        toast.error(json?.error || 'Đọc file Excel tải lên thất bại.');
        return;
      }
      toast.success(json.message || 'Đã cập nhật dữ liệu từ file Excel.');
      await fetchAdminData();
    } catch {
      toast.error('Lỗi khi tải lên file Excel.');
    } finally {
      setIsSyncing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownloadQrPng = async (preset: QrPreset) => {
    const cleanOrigin = normalizeQrOrigin(baseOrigin);
    const fullUrl = `${cleanOrigin}${preset.path}`;
    try {
      const highResUrl = await QRCode.toDataURL(fullUrl, {
        width: 1000,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      const a = document.createElement('a');
      a.href = highResUrl;
      a.download = preset.fileName;
      a.click();
    } catch {
      toast.error('Không thể tạo file ảnh QR.');
    }
  };

  const handleDownloadA4Poster = async (preset: QrPreset) => {
    const cleanOrigin = normalizeQrOrigin(baseOrigin);
    const fullUrl = `${cleanOrigin}${preset.path}`;
    try {
      // A4 200 DPI (1654 x 2339 px) sắc nét cho in đen trắng
      const W = 1654;
      const H = 2339;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);

      // Khung viền kép trang nghiêm đen trắng
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.strokeRect(72, 72, W - 144, H - 144);
      ctx.lineWidth = 2;
      ctx.strokeRect(92, 92, W - 184, H - 184);

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';

      // Eyebrow
      ctx.font = 'bold 34px Arial, sans-serif';
      ctx.fillText('TÙNG LÂM HÒA PHÚC', W / 2, 220);

      // Đường kẻ mảnh
      ctx.beginPath();
      ctx.moveTo(W / 2 - 220, 255);
      ctx.lineTo(W / 2 + 220, 255);
      ctx.lineWidth = 3;
      ctx.stroke();

      // Tiêu đề chính
      ctx.font = 'bold 78px Arial, sans-serif';
      ctx.fillText('TRA CỨU MÃ SỐ BÀI VỊ', W / 2, 370);

      // Phụ đề
      ctx.font = '600 40px Arial, sans-serif';
      ctx.fillText('Nhà Tứ Ân  •  Vãng Sinh Đường', W / 2, 445);

      // Tạo ảnh QR sắc nét đặt chính giữa
      const qrDataUrl = await QRCode.toDataURL(fullUrl, {
        width: 920,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      const qrImg = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => reject(new Error('QR image load error'));
        qrImg.src = qrDataUrl;
      });

      const qrSize = 860;
      const qrX = (W - qrSize) / 2;
      const qrY = 535;
      ctx.lineWidth = 4;
      ctx.strokeRect(qrX - 24, qrY - 24, qrSize + 48, qrSize + 48);
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      ctx.font = 'bold 34px Arial, sans-serif';
      ctx.fillText('QUÉT MÃ QR ĐỂ TRA CỨU TRÊN ĐIỆN THOẠI', W / 2, 1495);

      // Khung hướng dẫn 3 bước đơn giản
      const boxX = 165;
      const boxY = 1565;
      const boxW = W - 330;
      const boxH = 470;
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.font = 'bold 38px Arial, sans-serif';
      ctx.fillText('HƯỚNG DẪN SỬ DỤNG', W / 2, boxY + 75);

      ctx.textAlign = 'left';
      const steps = [
        'Bước 1: Mở Camera điện thoại hoặc ứng dụng Zalo → chọn quét mã QR phía trên.',
        'Bước 2: Nhấn vào đường dẫn hiện lên trên màn hình điện thoại.',
        'Bước 3: Gõ Tên hương linh, Tên dòng họ (Tổ tiên), Pháp danh hoặc',
        '              4 số cuối SĐT người thân để xem ngay Mã số bài vị.',
      ];
      ctx.font = '32px Arial, sans-serif';
      let sy = boxY + 150;
      steps.forEach((line) => {
        ctx.fillText(line, boxX + 55, sy);
        sy += 68;
      });

      // Chân trang
      ctx.textAlign = 'center';
      ctx.font = '28px monospace';
      ctx.fillText(fullUrl, W / 2, H - 190);
      ctx.font = 'italic 30px Arial, sans-serif';
      ctx.fillText('Hoan hỷ liên hệ Ban Tri Khách nếu cần hỗ trợ kiểm tra sổ gốc.', W / 2, H - 135);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'QR-Tra-Cuu-Bai-Vi-A4-Den-Trang.png';
      a.click();
    } catch {
      toast.error('Không thể tạo bản in A4 đen trắng.');
    }
  };

  const handleCopyQrLink = async (preset: QrPreset) => {
    const cleanOrigin = normalizeQrOrigin(baseOrigin);
    const fullUrl = `${cleanOrigin}${preset.path}`;
    try {
      await navigator.clipboard?.writeText(fullUrl);
      setCopiedQrId(preset.id);
      setTimeout(() => setCopiedQrId(null), 2000);
      toast.success('Đã sao chép đường link QR.');
    } catch {
      toast.error('Không thể sao chép link.');
    }
  };

  const countsMap = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of records) {
      counts[r.categorySlug] = (counts[r.categorySlug] || 0) + 1;
    }
    return counts;
  }, [records]);

  const filteredRecords = useMemo(() => {
    let list = records;
    if (activeTab !== 'all') {
      list = list.filter((r) => r.categorySlug === activeTab);
    }
    const q = normalizeVietnamese(searchQuery);
    if (!q) return list;
    const tokens = q.split(' ').filter(Boolean);
    return list.filter((r) => {
      const hay = normalizeVietnamese(
        [
          r.code,
          r.name,
          r.dharmaName,
          r.lineageType,
          r.deathDate,
          r.age,
          r.address,
          r.contactName,
          r.contactPhone,
        ]
          .filter(Boolean)
          .join(' ')
      );
      return tokens.every((t) => hay.includes(t));
    });
  }, [records, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  const formattedSyncTime = meta.lastSyncedAt
    ? new Date(meta.lastSyncedAt).toLocaleString('vi-VN')
    : 'Chưa đồng bộ lần nào từ giao diện mới';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2C14E]/20 pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#F2C14E]">
            Nhà Tưởng Ân &amp; Vãng Sinh Đường
          </span>
          <h1
            style={{ fontFamily: "'UTM Niagara', serif" }}
            className="text-3xl md:text-4xl text-[#FFE5A3] font-normal uppercase tracking-wide mt-1"
          >
            QUẢN LÝ SỔ BỘ BÀI VỊ &amp; MÃ QR TRA CỨU
          </h1>
          <p className="text-xs text-[#c9b896] mt-1">
            Nguồn chuẩn trực tiếp từ file Excel trên Google Drive • Cập nhật 1 chạm không cần thao tác thủ công.
          </p>
        </div>

        <Link
          href="/tra-cuu-bai-vi"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25170E] border border-[#F2C14E]/45 text-xs font-bold text-[#FFE5A3] hover:border-[#F2C14E] hover:bg-[#332014] transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-[#F2C14E]" />
          <span>Xem trang tra cứu QR thực tế</span>
        </Link>
      </div>

      {/* ── KHỐI 1: ĐỒNG BỘ TỪ GOOGLE DRIVE ── */}
      <section className="rounded-2xl border border-[#F2C14E]/35 bg-[#1C110A] p-5 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex-1 space-y-2">
            <label
              htmlFor="drive-link-input"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F2C14E]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Đường link Google Drive / Excel gốc (Công khai)</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                id="drive-link-input"
                type="url"
                value={driveUrlInput}
                onChange={(e) => setDriveUrlInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#120B06] border border-[#F2C14E]/35 text-xs sm:text-sm text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
              />
              <a
                href={driveUrlInput || DEFAULT_MEMORIAL_DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#F2C14E]/30 bg-[#140C06] text-xs text-[#e3d2c1] hover:border-[#F2C14E] hover:text-[#FFE5A3] transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#F2C14E]" />
                <span>Mở file Drive</span>
              </a>
            </div>
            <p className="text-[11px] text-[#c9b896]/80">
              Lần đồng bộ gần nhất: <strong className="text-[#FFE5A3]">{formattedSyncTime}</strong> • Tổng số:{' '}
              <strong className="text-[#F2C14E]">{records.length}</strong> bài vị
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSyncDrive}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F2C14E] text-[#1C1008] font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-60 transition-all cursor-pointer shadow-lg"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{isSyncing ? 'Đang đồng bộ Excel...' : 'Đồng bộ ngay từ Drive'}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={handleUploadExcel}
              className="hidden"
            />
            <button
              type="button"
              disabled={isSyncing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#F2C14E]/35 bg-[#140B06] text-xs font-medium text-[#FFE5A3] hover:border-[#F2C14E] disabled:opacity-60 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#F2C14E]" />
              <span>Tải file .xlsx lên</span>
            </button>
          </div>
        </div>

        {/* Thống kê số lượng từng sheet */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {SHEET_STATS_CONFIG.map((s) => (
            <div
              key={s.slug}
              className="rounded-xl border border-[#F2C14E]/20 bg-[#140B06] px-3.5 py-2.5"
            >
              <p className="text-[11px] text-[#c9b896] truncate">{s.label}</p>
              <p className="text-xl font-bold text-[#F2C14E] mt-0.5 font-mono">
                {countsMap[s.slug] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KHỐI 2: MÃ QR DUY NHẤT ĐỂ IN TẠI CHÙA ── */}
      <section className="rounded-2xl border border-[#F2C14E]/30 bg-[#1C110A] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#FFE5A3] flex items-center gap-2 uppercase tracking-wide">
              <QrCode className="w-4 h-4 text-[#F2C14E]" />
              <span>Mã QR Tra Cứu Toàn Chùa (Dùng Chung Tại Nhà Tưởng Ân)</span>
            </h2>
            <p className="text-xs text-[#c9b896] mt-0.5">
              Chỉ cần 1 mã QR duy nhất để in dán tại Nhà Tứ Ân — quét vào có thể tìm tất cả khu vực Nhà Tứ Ân &amp; Vãng Sinh Đường.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="qr-domain-input" className="text-xs text-[#c9b896] shrink-0">
              Tên miền QR:
            </label>
            <input
              id="qr-domain-input"
              type="url"
              value={baseOrigin}
              onChange={(e) => setBaseOrigin(e.target.value)}
              onBlur={() => {
                const normalized = normalizeQrOrigin(baseOrigin);
                if (normalized) setBaseOrigin(normalized);
              }}
              placeholder="https://www.tunglamhoaphuc.com"
              className="w-64 px-3 py-1.5 rounded-lg bg-[#120B06] border border-[#F2C14E]/35 text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
            />
          </div>
        </div>

        {QR_PRESETS.map((preset) => {
          const fullUrl = `${normalizeQrOrigin(baseOrigin)}${preset.path}`;
          return (
            <div
              key={preset.id}
              className="rounded-xl border border-[#F2C14E]/25 bg-[#140B06] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5"
            >
              <div className="w-36 h-36 rounded-xl bg-white p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                {qrImages[preset.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrImages[preset.id]}
                    alt={`Mã QR ${preset.title}`}
                    width={144}
                    height={144}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode className="w-12 h-12 text-neutral-800" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left space-y-2.5">
                <div>
                  <h3 className="text-base font-bold text-[#FFE5A3] uppercase tracking-wide">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-[#c9b896] mt-0.5 leading-relaxed">{preset.subtitle}</p>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] font-mono text-[#F2C14E]/90 hover:text-[#FFE5A3] underline underline-offset-2 mt-1 break-all"
                  >
                    {fullUrl}
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleDownloadA4Poster(preset)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#F2C14E] text-[#1C1008] font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải bản in A4 đen trắng (PNG)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadQrPng(preset)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#F2C14E]/45 text-[#F2C14E] hover:bg-[#F2C14E]/15 font-semibold text-xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải riêng mã QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyQrLink(preset)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#F2C14E]/35 text-[#FFE5A3] hover:border-[#F2C14E] text-xs cursor-pointer"
                  >
                    {copiedQrId === preset.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span>Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── KHỐI 3: BẢNG KIỂM TRA DỮ LIỆU ĐÃ ĐỒNG BỘ ── */}
      <section className="rounded-2xl border border-[#F2C14E]/30 bg-[#1C110A] p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {MEMORIAL_CATEGORY_OPTIONS.filter(
              (o) => o.id !== 'tu-an' && o.id !== 'vang-sinh-duong'
            ).map((opt) => {
              const active = activeTab === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(opt.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F2C14E] text-[#1C1008] border-[#F2C14E] font-bold'
                      : 'bg-[#140B06] text-[#e3d2c1] border-[#F2C14E]/25 hover:border-[#F2C14E]'
                  }`}
                >
                  {opt.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#F2C14E]/70 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Lọc tên, mã số, SĐT..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#120B06] border border-[#F2C14E]/35 text-xs text-[#FFE5A3] focus:outline-none focus:border-[#F2C14E]"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#F2C14E]/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#140B06] text-[#F2C14E] uppercase tracking-wider border-b border-[#F2C14E]/25">
              <tr>
                <th className="px-3 py-2.5 w-24">Mã Số</th>
                <th className="px-3 py-2.5">Họ Tên / Tổ Tiên</th>
                <th className="px-3 py-2.5">Pháp Danh / Tộc</th>
                <th className="px-3 py-2.5">Khu Vực</th>
                <th className="px-3 py-2.5">Mất / Tuổi</th>
                <th className="px-3 py-2.5">Địa Chỉ / An Táng</th>
                <th className="px-3 py-2.5">Liên Hệ (Admin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2C14E]/10">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#c9b896]">
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#c9b896]">
                    Không có bản ghi nào khớp điều kiện lọc.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#25170E]/60 transition-colors">
                    <td className="px-3 py-2.5 font-mono font-bold text-[#F2C14E]">
                      {rec.code || '—'}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-[#FFE5A3]">{rec.name}</td>
                    <td className="px-3 py-2.5 text-[#e3d2c1]">
                      {rec.dharmaName || rec.lineageType || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-[#c9b896]">{rec.category}</td>
                    <td className="px-3 py-2.5 text-[#e3d2c1]">
                      {[rec.deathDate, rec.age ? `${rec.age}t` : ''].filter(Boolean).join(' • ') ||
                        '—'}
                    </td>
                    <td className="px-3 py-2.5 text-[#c9b896] max-w-[220px] truncate">
                      {rec.address || rec.burialLocation || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-[#e3d2c1]">
                      {[rec.contactName, rec.contactPhone].filter(Boolean).join(' • ') || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs text-[#c9b896]">
            <span>
              Hiển thị {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filteredRecords.length)} / {filteredRecords.length} bản ghi
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg border border-[#F2C14E]/30 disabled:opacity-40 hover:border-[#F2C14E] cursor-pointer"
              >
                Trước
              </button>
              <span className="text-[#FFE5A3] font-semibold">
                Trang {page}/{totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg border border-[#F2C14E]/30 disabled:opacity-40 hover:border-[#F2C14E] cursor-pointer"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
