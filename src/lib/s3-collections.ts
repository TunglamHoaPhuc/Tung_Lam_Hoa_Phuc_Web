import { readDb, type S3DbEntry } from './s3-db';
import { OFFICIAL_STATUE_DATASET, StatueRecord } from '@/data/statue-data';
import { UNIVERSE_AREAS, UniverseArea } from '@/data/universe-data';
import scheduleDbJson from '@/data/schedule-database.json';

/**
 * 🪷 BỘ SƯU TẬP (COLLECTION) TRÊN BACKBLAZE B2
 *
 * Mọi bộ dữ liệu JSON của dự án được lưu duy nhất trên S3:
 *   s2-cnv03 / tunglamhoaphuc2/database/<fileName>
 *
 * `seed` chỉ là dữ liệu dự phòng build-time, dùng khi object trên S3 chưa tồn tại.
 */

/** Bài viết (cache WordPress + chỉnh sửa admin). */
export const POSTS_DB: S3DbEntry<any[]> = {
  fileName: 'posts-database.json',
  seed: () => [],
};

/** Bộ bảo tượng. */
export const STATUES_DB: S3DbEntry<StatueRecord[]> = {
  fileName: 'statues-database.json',
  seed: () => OFFICIAL_STATUE_DATASET,
};

/** Tông chỉ tu học. */
export const TONG_CHI_DB: S3DbEntry<any[]> = {
  fileName: 'tong-chi-data.json',
  seed: () => [],
};

/** Chủ đề giới thiệu. */
export const GIOI_THIEU_DB: S3DbEntry<any[]> = {
  fileName: 'gioi-thieu-database.json',
  seed: () => [],
};

/** Danh Tăng. */
export const DANH_TANG_DB: S3DbEntry<any[]> = {
  fileName: 'danh-tang-database.json',
  seed: () => [],
};

/** Lịch tu học. */
export const SCHEDULE_DB: S3DbEntry<any> = {
  fileName: 'schedule-database.json',
  seed: () => scheduleDbJson,
};

/** Vũ trụ Phật giáo. */
export const UNIVERSE_DB: S3DbEntry<UniverseArea[]> = {
  fileName: 'universe-database.json',
  seed: () => UNIVERSE_AREAS,
};

/** Tra cứu bài vị hương linh. */
export const MEMORIAL_DB: S3DbEntry<any[]> = {
  fileName: 'memorial-data.json',
  seed: () => [],
};

/** Sách tuyển chọn (admin quản lý). */
export const REFERENCE_BOOKS_DB: S3DbEntry<any[]> = {
  fileName: 'reference-books-data.json',
  seed: () => [],
};

/** Ấn phẩm sách Tàng Kinh Các. */
export const SACH_AN_PHAM_DB: S3DbEntry<any> = {
  fileName: 'sach-an-pham-data.json',
  seed: () => [],
};

/** Whitelist các collection công khai, phục vụ GET /api/public/data/<key>. */
export const PUBLIC_COLLECTIONS: Record<string, S3DbEntry<any>> = {
  posts: POSTS_DB,
  statues: STATUES_DB,
  'tong-chi': TONG_CHI_DB,
  'gioi-thieu': GIOI_THIEU_DB,
  'danh-tang': DANH_TANG_DB,
  schedule: SCHEDULE_DB,
  universe: UNIVERSE_DB,
  memorial: MEMORIAL_DB,
  'reference-books': REFERENCE_BOOKS_DB,
  'sach-an-pham': SACH_AN_PHAM_DB,
};

/** Đọc collection theo key công khai (server-side). */
export function readPublicCollection<T = any>(key: string): Promise<T> {
  const entry = PUBLIC_COLLECTIONS[key];
  if (!entry) return Promise.reject(new Error(`Collection không tồn tại: ${key}`));
  return readDb<T>(entry);
}