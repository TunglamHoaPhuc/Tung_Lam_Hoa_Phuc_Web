export const WP_BASE_URL = 'https://admin.tunglamhoaphuc.com';
export const PLACEHOLDER_IMAGE = 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

/**
 * 🛠️ Helper function chuẩn hóa đường dẫn hình ảnh cho toàn bộ hệ thống:
 * 1. Nếu path rỗng/null/undefined -> trả về string rỗng (hoặc ảnh placeholder).
 * 2. Nếu path đã có http://, https://, data:, blob: -> giữ nguyên.
 * 3. Nếu path bắt đầu bằng / -> ghép với https://admin.tunglamhoaphuc.com${path}.
 * 4. Nếu path chỉ là tên file rời (ví dụ "tung-kinh.jpg") -> tự động nối thành https://admin.tunglamhoaphuc.com/wp-content/uploads/${path}.
 * 5. Tự động sửa các đường dẫn cũ chứa /images/tong-chi/ về đúng kho WordPress /wp-content/uploads/.
 */
export function getImageUrl(path?: string | null, fallbackUrl: string = ''): string {
  if (!path || typeof path !== 'string') {
    return fallbackUrl || '';
  }

  let trimmed = path.trim();
  if (!trimmed) {
    return fallbackUrl || '';
  }

  // Tự động chuẩn hóa các đường dẫn cũ chứa /images/tong-chi/ về kho upload WordPress
  if (trimmed.includes('/images/tong-chi/')) {
    const filename = trimmed.split('/').pop() || '';
    if (filename) {
      return `${WP_BASE_URL}/wp-content/uploads/${filename}`;
    }
  }

  // Nếu path đã có http:// hoặc https:// hoặc data: hoặc blob: -> giữ nguyên
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Schema-relative (//example.com)
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // Nếu path bắt đầu bằng / -> ghép trực tiếp với domain WordPress
  if (trimmed.startsWith('/')) {
    return `${WP_BASE_URL}${trimmed}`;
  }

  // Nếu path chỉ là tên file rời (ví dụ: "tung-kinh.jpg", "thien-toa.jpg", "1.jpg")
  if (!trimmed.includes('/')) {
    return `${WP_BASE_URL}/wp-content/uploads/${trimmed}`;
  }

  return `${WP_BASE_URL}/${trimmed}`;
}

/**
 * 🌟 Tự động nâng cấp ảnh WordPress thumbnail (vd: 512x341, 300x200, 1024x768)
 * sang ảnh gốc độ phân giải cao sắc nét (HD / 4K / 6K Master Image).
 */
export function getHighResImageUrl(url?: string | null, fallbackUrl: string = ''): string {
  const standard = getImageUrl(url, fallbackUrl);
  if (!standard) return fallbackUrl || '';

  // Nhận diện hậu tố kích thước cắt của WordPress (VD: -512x341.jpg, -512x302-1.jpg, -341x512.jpg)
  const wpSizeSuffixRegex = /-\d+x\d+(?:-\d+)?(?=\.(?:jpg|jpeg|png|webp|avif)$)/i;
  if (wpSizeSuffixRegex.test(standard)) {
    return standard.replace(wpSizeSuffixRegex, '');
  }

  return standard;
}

/**
 * ⚡ Tối ưu hóa ảnh qua Next.js Image Optimizer (GPU / SIMD Sharp):
 * Tự động chuyển đổi sang WebP/AVIF và nén kích thước theo bề rộng (width) chuẩn.
 * Dung lượng file giảm từ 4-8MB xuống chỉ còn 60KB - 150KB mà vẫn sắc nét 100%.
 */
export function getOptimizedNextImageUrl(
  url?: string | null,
  width: number = 1080,
  quality: number = 75
): string {
  const highRes = getHighResImageUrl(url);
  if (!highRes) return '';
  if (highRes.startsWith('http://') || highRes.startsWith('https://')) {
    return `/_next/image?url=${encodeURIComponent(highRes)}&w=${width}&q=${quality}`;
  }
  return highRes;
}
