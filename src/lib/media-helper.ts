/**
 * 🪷 Media URL Resolver cho Tùng Lâm Hòa Phúc
 * Chuyển đổi mọi đường dẫn ảnh cục bộ sang URL S3 Backblaze B2 tốc độ cao.
 */

const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2';

export function getMediaUrl(src?: string | null): string {
  if (!src) return '/images/toan-canh-chua.jpg';

  // 1. Nếu đã là URL tuyệt đối (S3, HTTP, HTTPS) -> giữ nguyên
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // 2. Nếu là đường dẫn cục bộ bắt đầu bằng /images/
  if (src.startsWith('/images/')) {
    // Có thể trả về link local hoặc chuyển hướng sang S3
    return src;
  }

  // 3. Nếu là đường dẫn tương đối trong S3 (vd: "tong-chi-tu-hoc/anh-1.webp")
  const cleanPath = src.replace(/^\/+/, '');
  return `${S3_BASE_URL}/${cleanPath}`;
}
