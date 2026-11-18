'use client';

import React, { useEffect, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Copy,
  Download,
  Maximize,
  Minimize,
  MonitorPlay,
  Pause,
  Play,
  QrCode,
  SkipBack,
  SkipForward,
  Smartphone,
  X,
} from 'lucide-react';

export type LedSpeedMode = 'slow' | 'normal' | 'fast';

interface LedFloatingHudProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  speed: LedSpeedMode;
  onChangeSpeed: (s: LedSpeedMode) => void;
  showCornerQr: boolean;
  onToggleCornerQr: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onExitLed: () => void;
  stepLabel: string;
  stepIndex: number;
  totalSteps: number;
}

export function LedCornerQrBadge({ targetUrl }: { targetUrl: string }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: { dark: '#140C07', light: '#FFFFFF' },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        // Ignore transient QR render failure
      });
    return () => {
      active = false;
    };
  }, [targetUrl]);

  if (!qrDataUrl) return null;

  return (
    <div
      style={{ fontFamily: "'UTM Avo', sans-serif" }}
      className="fixed bottom-5 right-5 z-40 hidden md:flex items-center gap-3 p-2.5 rounded-xl bg-[#1A1009]/92 border border-[#F2C14E]/75 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md"
    >
      <div className="bg-white p-1.5 rounded-lg shrink-0">
        <img src={qrDataUrl} alt="Mã QR xem Tiểu Sử Sư Tổ trên điện thoại" className="w-24 h-24 block" />
      </div>
      <div className="pr-1.5 space-y-1 max-w-[140px]">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FFDE59]">
          QUÉT MÃ QR
        </div>
        <p className="text-[11px] text-[#FFE5A3] leading-snug">
          Xem bản đầy đủ &amp; tra cứu kinh sách trên điện thoại
        </p>
      </div>
    </div>
  );
}

export function LedFloatingHud({
  isPlaying,
  onTogglePlay,
  onPrevStep,
  onNextStep,
  speed,
  onChangeSpeed,
  showCornerQr,
  onToggleCornerQr,
  isFullscreen,
  onToggleFullscreen,
  onExitLed,
  stepLabel,
  stepIndex,
  totalSteps,
}: LedFloatingHudProps) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), 4500);
    };
    wake();
    window.addEventListener('mousemove', wake, { passive: true });
    window.addEventListener('keydown', wake, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', wake);
      window.removeEventListener('keydown', wake);
    };
  }, []);

  return (
    <div
      style={{ fontFamily: "'UTM Avo', sans-serif" }}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(95vw,820px)] rounded-2xl border border-[#F2C14E]/60 bg-[#140C07]/92 px-3.5 py-2.5 shadow-[0_16px_50px_rgba(0,0,0,0.9)] backdrop-blur-md transition-opacity duration-500 ${
        idle ? 'opacity-20 hover:opacity-100 focus-within:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#F2C14E]/20 border border-[#F2C14E]/45 text-[10px] font-bold uppercase tracking-widest text-[#FFDE59] shrink-0">
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>LED {stepIndex + 1}/{totalSteps}</span>
          </span>
          <span className="text-xs font-semibold text-[#FFE5A3] truncate">{stepLabel}</span>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onPrevStep}
            aria-label="Phân đoạn trước"
            className="p-2 rounded-lg border border-[#F2C14E]/35 bg-[#23150C] text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F2C14E] text-[#140C07] text-xs font-extrabold uppercase tracking-wider hover:bg-[#FFDE59] transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Tạm Dừng' : 'Tiếp Tục'}</span>
          </button>

          <button
            type="button"
            onClick={onNextStep}
            aria-label="Phân đoạn tiếp theo"
            className="p-2 rounded-lg border border-[#F2C14E]/35 bg-[#23150C] text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="hidden sm:flex items-center rounded-lg border border-[#F2C14E]/35 bg-[#1D120B] p-0.5 text-[10px] font-bold uppercase">
            {([
              { id: 'slow', label: 'Chậm' },
              { id: 'normal', label: 'Vừa' },
              { id: 'fast', label: 'Nhanh' },
            ] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeSpeed(item.id)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  speed === item.id ? 'bg-[#F2C14E] text-black' : 'text-[#e3d2c1]/70 hover:text-[#FFDE59]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleCornerQr}
            title="Hiện / Ẩn mã QR ở góc màn hình LED"
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold uppercase transition-colors cursor-pointer ${
              showCornerQr
                ? 'bg-[#F2C14E]/25 border-[#FFDE59] text-[#FFDE59]'
                : 'bg-[#23150C] border-[#F2C14E]/35 text-[#e3d2c1]/75 hover:text-[#FFDE59]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Góc</span>
          </button>

          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Thu nhỏ màn hình' : 'Phóng toàn màn hình'}
            className="p-2 rounded-lg border border-[#F2C14E]/35 bg-[#23150C] text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onExitLed}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-400/45 bg-red-950/60 text-red-200 text-[11px] font-bold uppercase hover:bg-red-800/80 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thoát LED</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface EventQrPanelProps {
  onClose: () => void;
  onStartLed: () => void;
  productionDomainDefault?: string;
}

export function EventQrPanel({
  onClose,
  onStartLed,
  productionDomainDefault = 'https://tunglamhoaphuc.com',
}: EventQrPanelProps) {
  const [originInput, setOriginInput] = useState<string>(productionDomainDefault);
  const [isLocalhost, setIsLocalhost] = useState<boolean>(false);
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<'mobile' | 'led' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const local = origin.includes('localhost') || origin.includes('127.0.0.1');
      setIsLocalhost(local);
      setOriginInput(local ? productionDomainDefault : origin);
    }
  }, [productionDomainDefault]);

  const cleanOrigin = originInput.replace(/\/+$/, '');
  const mobileUrl = `${cleanOrigin}/gioi-thieu/tieu-su-su-to`;
  const ledUrl = `${cleanOrigin}/gioi-thieu/tieu-su-su-to?led=1`;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(mobileUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 600,
      color: { dark: '#140C07', light: '#FFFFFF' },
    })
      .then((url) => {
        if (active) setQrPngUrl(url);
      })
      .catch(() => {
        // Ignore error
      });
    return () => {
      active = false;
    };
  }, [mobileUrl]);

  const handleCopy = useCallback(async (text: string, key: 'mobile' | 'led') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch {
      // Clipboard blocked
    }
  }, []);

  const handleDownloadPoster = useCallback(async () => {
    if (!qrPngUrl) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Deep obsidian radial backdrop
    const grad = ctx.createRadialGradient(600, 560, 80, 600, 780, 920);
    grad.addColorStop(0, '#2B190E');
    grad.addColorStop(1, '#100804');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 1560);

    // Double gold border frame
    ctx.strokeStyle = '#F2C14E';
    ctx.lineWidth = 6;
    ctx.strokeRect(42, 42, 1116, 1476);
    ctx.strokeStyle = 'rgba(255, 222, 89, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, 1080, 1440);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#F2C14E';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('TÙNG LÂM HÒA PHÚC · TÔNG PHONG HOẰNG PHÁP', 600, 150);

    ctx.fillStyle = '#FFDE59';
    ctx.font = 'bold 74px sans-serif';
    ctx.fillText('SƯ TỔ NGỘ CHÂN TỬ', 600, 245);

    ctx.fillStyle = '#FFE5A3';
    ctx.font = '600 32px sans-serif';
    ctx.fillText('1901 – 1988 · BẢN TIỂU SỬ & KỶ VẬT TƯ LIỆU', 600, 305);

    // White high-contrast QR container
    const boxX = 270;
    const boxY = 380;
    const boxSize = 660;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxSize, boxSize, 32);
    ctx.fill();

    ctx.strokeStyle = '#F2C14E';
    ctx.lineWidth = 8;
    ctx.stroke();

    const qrImg = new Image();
    qrImg.src = qrPngUrl;
    await new Promise<void>((resolve) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => resolve();
    });
    ctx.drawImage(qrImg, boxX + 40, boxY + 40, boxSize - 80, boxSize - 80);

    ctx.fillStyle = '#FFDE59';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText('QUÉT MÃ QR ĐỂ XEM TRÊN ĐIỆN THOẠI', 600, 1165);

    ctx.fillStyle = '#E3D2C1';
    ctx.font = '28px sans-serif';
    ctx.fillText('Hỗ trợ mượt mà trên điện thoại · Đọc tiểu sử, kinh sách & kỷ vật', 600, 1225);

    ctx.fillStyle = '#F2C14E';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(mobileUrl, 600, 1385);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qr-su-to-ngo-chan-tu-tung-lam-hoa-phuc.png';
    a.click();
  }, [qrPngUrl, mobileUrl]);

  return (
    <div
      style={{ fontFamily: "'UTM Avo', sans-serif" }}
      className="relative w-[min(94vw,680px)] bg-[#190F09] border border-[#F2C14E]/60 shadow-[0_30px_100px_rgba(0,0,0,0.95)] p-5 sm:p-7 max-h-[90dvh] overflow-y-auto"
    >
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F2C14E]/20">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
            PHỤC VỤ SỰ KIỆN · TRÌNH CHIẾU &amp; MÃ QR
          </div>
          <h3
            id="odyssey-qr-modal-title"
            style={{ fontFamily: "'UTM Niagara', sans-serif" }}
            className="text-3xl sm:text-4xl text-[#FFDE59] uppercase tracking-wider mt-0.5"
          >
            CHIA SẺ DUYỆT BẢN MOBILE &amp; IN MÃ QR
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng hộp thoại mã QR"
          autoFocus
          className="p-2 bg-[#2B1B11] border border-[#F2C14E]/40 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left QR Card */}
        <div className="md:col-span-5 flex flex-col items-center gap-3 p-4 bg-[#120A05] border border-[#F2C14E]/35 rounded-xl">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            {qrPngUrl ? (
              <img
                src={qrPngUrl}
                alt="Mã QR trang Tiểu Sử Sư Tổ Ngộ Chân Tử"
                className="w-44 h-44 sm:w-48 sm:h-48 block"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-500">
                Đang tạo QR...
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleDownloadPoster}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F2C14E] text-[#140C07] text-xs font-extrabold uppercase tracking-wider hover:bg-[#FFDE59] transition-colors cursor-pointer rounded-lg"
          >
            <Download className="w-4 h-4" />
            <span>Tải Poster QR In Ấn (.PNG)</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="qr-domain-input"
              className="block text-[11px] font-bold uppercase tracking-widest text-[#F2C14E]"
            >
              Tên miền trang web khi phát hành QR
            </label>
            <input
              id="qr-domain-input"
              type="url"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#120A05] border border-[#F2C14E]/40 text-xs sm:text-sm text-[#FFE5A3] rounded-lg focus:outline-none focus:border-[#FFDE59]"
            />
            {isLocalhost && (
              <p className="text-[11px] text-[#FFE5A3]/75 leading-relaxed">
                Đang chạy ở <code className="text-[#FFDE59]">localhost</code> — đã tự động gợi ý{' '}
                <code className="text-[#FFDE59]">{productionDomainDefault}</code> để in mã QR chuẩn cho Phật tử.
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-[#140C07] border border-[#F2C14E]/25 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FFDE59]">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Link Gửi Sư Phụ Duyệt &amp; Phật Tử (Responsive)</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(mobileUrl, 'mobile')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#28180E] border border-[#F2C14E]/45 text-[10px] font-bold uppercase text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black rounded transition-colors cursor-pointer"
                >
                  {copiedKey === 'mobile' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'mobile' ? 'Đã Chép' : 'Sao Chép'}</span>
                </button>
              </div>
              <div className="text-[11px] text-[#e3d2c1]/80 break-all">{mobileUrl}</div>
            </div>

            <div className="p-3 bg-[#140C07] border border-[#F2C14E]/25 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FFDE59]">
                  <MonitorPlay className="w-3.5 h-3.5" />
                  <span>Link Trình Chiếu Màn Hình LED Tự Động</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(ledUrl, 'led')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#28180E] border border-[#F2C14E]/45 text-[10px] font-bold uppercase text-[#FFE5A3] hover:bg-[#F2C14E] hover:text-black rounded transition-colors cursor-pointer"
                >
                  {copiedKey === 'led' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'led' ? 'Đã Chép' : 'Sao Chép'}</span>
                </button>
              </div>
              <div className="text-[11px] text-[#e3d2c1]/80 break-all">{ledUrl}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onStartLed();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2B1B10] border border-[#FFDE59]/70 text-[#FFDE59] text-xs font-extrabold uppercase tracking-wider hover:bg-[#FFDE59] hover:text-black transition-colors cursor-pointer rounded-lg"
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Chạy Thử Chế Độ Trình Chiếu LED Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
