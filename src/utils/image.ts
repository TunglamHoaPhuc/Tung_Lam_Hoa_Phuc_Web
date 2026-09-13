export const WP_BASE_URL = 'https://admin.tunglamhoaphuc.com';
export const PLACEHOLDER_IMAGE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

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
