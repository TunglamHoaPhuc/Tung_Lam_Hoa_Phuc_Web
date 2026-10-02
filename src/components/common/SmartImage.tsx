'use client';

import React, { useState, useRef, useEffect, FC } from 'react';

export interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  /**
   * Chế độ hiển thị:
   * - 'auto': Tự động nhận diện tỷ lệ trên trình duyệt.
   *           Ảnh đứng / vuông (< 1.15) tự động contain + hào quang;
   *           Ảnh ngang (>= 1.15) tự động cover.
   * - 'contain': Luôn luôn hiển thị trọn vẹn 100% kèm nền hào quang.
   * - 'cover': Luôn tràn viền (ưu tiên căn object-position không cắt đầu tượng).
   */
  fitMode?: 'auto' | 'contain' | 'cover';
  /** Vị trí căn ảnh khi cover (mặc định 'center 15%' để giữ đỉnh đầu tượng Phật) */
  objectPosition?: string;
  /** Hiệu ứng zoom nhẹ khi hover group */
  hoverZoom?: boolean;
  /** Padding cho ảnh contain để không chạm viền */
  containPadding?: string;
  /** Màng gradient mờ tạo chiều sâu tâm linh */
  darkOverlay?: boolean;
  /** Fallback URL nếu ảnh bị lỗi */
  fallbackSrc?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  style?: React.CSSProperties;
}

/** Kiểm tra nhanh URL có dấu hiệu ảnh đứng / tượng Phật để SSR không bị nhảy */
function isLikelyPortrait(url: string = ''): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes('tuong') ||
    lower.includes('statue') ||
    lower.includes('quan-am') ||
    lower.includes('33-ung-hoa') ||
    lower.includes('tu-an-book') ||
    lower.includes('page_') ||
    lower.includes('de-tu') ||
    lower.includes('kim-cang') ||
    lower.includes('la-han') ||
    lower.includes('duoc-xoa') ||
    lower.includes('dai-nhat') ||
    lower.includes('tam-the')
  );
}

/**
 * 🪷 SmartImage — Bộ điều phối hiển thị ảnh tối ưu Front-end tại trình duyệt:
 * 1. Tự động nhận diện tỷ lệ ảnh thực tế tại client-side (naturalWidth / naturalHeight).
 * 2. Bảo toàn 100% Tôn tượng Phật / Di sản / Bìa sách (không bao giờ cắt đỉnh đầu nhục kế hay chân sen).
 * 3. Tự động kích hoạt hiệu ứng vầng hào quang Ambient Glow lan tỏa màu sắc phía sau.
 * 4. Tự động căn chỉnh trọng tâm (focal point) cho ảnh phong cảnh.
 */
export const SmartImage: FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  fitMode = 'auto',
  objectPosition,
  hoverZoom = true,
  containPadding = 'p-3 sm:p-4',
  darkOverlay = true,
  fallbackSrc = '/images/toan-canh-chua.jpg',
  onLoad,
  onError,
  style,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);

  // Khởi tạo phỏng đoán ban đầu
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (fitMode === 'contain') return true;
    if (fitMode === 'cover') return false;
    return isLikelyPortrait(src);
  });

  // Đo kích thước thực tế ngay khi ảnh load xong tại trình duyệt
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      setAspectRatio(ratio);

      if (fitMode === 'auto') {
        // Tỷ lệ < 1.15: ảnh đứng hoặc vuông -> cần contain để thấy trọn vẹn
        setIsPortrait(ratio < 1.15);
      }
    }
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(e);
  };

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth) {
      const ratio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      setAspectRatio(ratio);
      if (fitMode === 'auto') {
        setIsPortrait(ratio < 1.15);
      }
    }
  }, [src, fitMode]);

  const activeSrc = hasError ? fallbackSrc : src;
  const isContain = fitMode === 'contain' || (fitMode === 'auto' && isPortrait);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#150D08] ${containerClassName}`}>
      {isContain ? (
        <>
          {/* Lớp 1: Nền Hào Quang Ambient Glow mờ sâu lan tỏa màu sắc tôn tượng */}
          <img
            src={activeSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-135 opacity-40 brightness-75 pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:opacity-60"
          />

          {/* Lớp 2: Màng mờ tối vi diệu tăng tương phản cho pho tượng */}
          {darkOverlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#150D08]/95 via-black/25 to-black/35 pointer-events-none" />
          )}

          {/* Lớp 3: Tôn tượng / Tác phẩm chính hiển thị TRỌN VẸN 100% không cắt gọt */}
          <img
            ref={imgRef}
            src={activeSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? undefined : 'lazy'}
            style={{
              objectPosition: objectPosition || 'center center',
              ...style,
            }}
            className={`relative z-10 w-full h-full object-contain ${containPadding} ${
              hoverZoom ? 'group-hover:scale-105' : ''
            } transition-transform duration-700 drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] ${className}`}
          />
        </>
      ) : (
        <>
          {/* Ảnh ngang: Tràn viền sắc nét, ưu tiên căn đỉnh đầu không bị cắt */}
          <img
            ref={imgRef}
            src={activeSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? undefined : 'lazy'}
            style={{
              objectPosition: objectPosition || 'center 20%',
              ...style,
            }}
            className={`w-full h-full object-cover ${
              hoverZoom ? 'group-hover:scale-105' : ''
            } transition-transform duration-700 ${className}`}
          />
          {darkOverlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#150D08]/95 via-black/15 to-transparent pointer-events-none" />
          )}
        </>
      )}
    </div>
  );
};

export default SmartImage;
