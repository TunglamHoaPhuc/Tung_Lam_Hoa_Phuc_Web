import { GetObjectCommand, PutObjectCommand, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getS3ClientInstance, getS3EnvConfig, getS3DbKey } from './s3-core';

/**
 * 🪷 TẦNG CACHE JSON TRÊN S3 (Backblaze B2 · bucket s2-cnv03)
 *
 * WordPress là NGUỒN NỘI DUNG CHÍNH. Tầng này giữ bản cache/backup JSON của nội dung
 * tại `tunglamhoaphuc2/database/<fileName>` để:
 *   1. Trang public vẫn hoạt động khi WordPress chậm/sập.
 *   2. Lưu các field riêng của web (lượt xem, từ khóa, thư viện ảnh, vị trí ảnh…).
 *   3. Làm bộ đệm đọc nhanh, giảm tải WordPress.
 *
 * KHÔNG đọc file cục bộ trong `src/data/` và KHÔNG ghi ra đĩa khi vận hành.
 */

export interface S3DbEntry<T> {
  /** Tên file JSON trên S3, ví dụ `posts-database.json` */
  fileName: string;
  /** Dữ liệu khởi tạo khi object chưa tồn tại trên S3 */
  seed?: () => T;
  /** Thời gian cache bộ nhớ (ms). Mặc định 5 giây, override bằng S3_DB_CACHE_TTL_MS */
  cacheTtlMs?: number;
}

export interface S3DbWriteResult {
  key: string;
  size: number;
  updatedAt: string;
}

const DEFAULT_CACHE_TTL_MS = Number(process.env.S3_DB_CACHE_TTL_MS || 5000);

/** Cache bộ nhớ theo key S3 (mỗi instance giữ bản sao ngắn hạn) */
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();

/** Hàng đợi ghi tuần tự theo key, tránh 2 request ghi đè lẫn nhau trong cùng instance */
const writeLocks = new Map<string, Promise<unknown>>();

export class S3DbError extends Error {
  readonly key: string;
  readonly code: string;
  constructor(message: string, key: string, code: string = 'S3_DB_ERROR') {
    super(message);
    this.name = 'S3DbError';
    this.key = key;
    this.code = code;
  }
}

function assertClient() {
  const client = getS3ClientInstance();
  if (!client) {
    throw new S3DbError(
      'Chưa cấu hình S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY nên không đọc/ghi được cache trên Backblaze B2.',
      '',
      'S3_MISSING_CREDENTIALS'
    );
  }
  return client;
}

function isNotFound(err: any): boolean {
  const name = err?.name || err?.Code || '';
  const status = err?.$metadata?.httpStatusCode;
  return name === 'NoSuchKey' || name === 'NotFound' || status === 404;
}

/** Xoá cache bộ nhớ của 1 file (dùng khi dữ liệu đổi từ bên ngoài). */
export function bustDbCache(fileName: string): void {
  memoryCache.delete(getS3DbKey(fileName));
}

/** Xoá toàn bộ cache bộ nhớ. */
export function bustAllDbCache(): void {
  memoryCache.clear();
}

/**
 * Đọc JSON từ S3. Thứ tự: memory cache (còn hạn) → S3 GetObject → seed.
 * Ném `S3DbError` khi S3 không đọc được (trừ trường hợp object chưa tồn tại → seed).
 */
export async function readDb<T>(entry: S3DbEntry<T>): Promise<T> {
  const key = getS3DbKey(entry.fileName);
  const ttl = entry.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;

  const cached = memoryCache.get(key);
  if (cached && ttl > 0 && Date.now() - cached.timestamp < ttl) {
    return cached.data as T;
  }

  const client = assertClient();

  try {
    const res = await client.send(
      new GetObjectCommand({ Bucket: getS3EnvConfig().bucketName, Key: key })
    );
    const raw = await res.Body?.transformToString('utf-8');
    if (!raw) throw new S3DbError(`Object rỗng trên S3: ${key}`, key, 'S3_EMPTY_OBJECT');

    const parsed = JSON.parse(raw) as T;
    memoryCache.set(key, { data: parsed, timestamp: Date.now() });
    return parsed;
  } catch (err: any) {
    if (isNotFound(err)) {
      const seeded = (entry.seed ? entry.seed() : ([] as unknown)) as T;
      memoryCache.set(key, { data: seeded, timestamp: Date.now() });
      return seeded;
    }
    if (err instanceof S3DbError) throw err;
    if (err instanceof SyntaxError) {
      throw new S3DbError(`JSON trên S3 bị hỏng (${key}): ${err.message}`, key, 'S3_INVALID_JSON');
    }
    throw new S3DbError(
      `Không đọc được ${key} từ S3: ${err?.message || String(err)}`,
      key,
      'S3_READ_FAILED'
    );
  }
}

/** Ghi JSON lên S3 (ghi đè object) — dùng cho cache nội dung + field riêng của web. */
export async function writeDb<T>(entry: S3DbEntry<T>, data: T): Promise<S3DbWriteResult> {
  const key = getS3DbKey(entry.fileName);
  const client = assertClient();

  let jsonStr: string;
  try {
    jsonStr = JSON.stringify(data, null, 2);
  } catch (err: any) {
    throw new S3DbError(`Dữ liệu không thể chuyển thành JSON: ${err.message}`, key, 'S3_INVALID_DATA');
  }

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: getS3EnvConfig().bucketName,
        Key: key,
        Body: jsonStr,
        ContentType: 'application/json; charset=utf-8',
      })
    );
  } catch (err: any) {
    throw new S3DbError(`Không ghi được ${key} lên S3: ${err?.message || String(err)}`, key, 'S3_WRITE_FAILED');
  }

  memoryCache.set(key, { data, timestamp: Date.now() });

  return { key, size: Buffer.byteLength(jsonStr, 'utf-8'), updatedAt: new Date().toISOString() };
}

/**
 * Đọc → biến đổi → ghi, có khoá tuần tự theo key để tránh mất dữ liệu
 * khi nhiều request cùng sửa 1 collection.
 */
export async function updateDb<T>(
  entry: S3DbEntry<T>,
  updater: (current: T) => T | Promise<T>
): Promise<T> {
  const key = getS3DbKey(entry.fileName);
  const previous = writeLocks.get(key) || Promise.resolve();

  const task = previous
    .catch(() => undefined)
    .then(async () => {
      const current = await readDb(entry);
      const next = await updater(current);
      await writeDb(entry, next);
      return next;
    });

  writeLocks.set(
    key,
    task.catch(() => undefined)
  );

  try {
    return await task;
  } finally {
    if (writeLocks.get(key) === task) writeLocks.delete(key);
  }
}

export interface S3DbObjectInfo {
  key: string;
  fileName: string;
  size: number;
  lastModified: string | null;
}

/** Liệt kê toàn bộ object JSON cache hiện có trên S3. */
export async function listDbObjects(): Promise<S3DbObjectInfo[]> {
  const client = assertClient();
  const bucket = getS3EnvConfig().bucketName;
  const items: S3DbObjectInfo[] = [];
  let token: string | undefined;

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `${getS3DbKey('')}`,
        ContinuationToken: token,
        MaxKeys: 1000,
      })
    );
    for (const obj of res.Contents || []) {
      if (!obj.Key || obj.Key.endsWith('/')) continue;
      items.push({
        key: obj.Key,
        fileName: obj.Key.split('/').pop() || '',
        size: obj.Size || 0,
        lastModified: obj.LastModified ? obj.LastModified.toISOString() : null,
      });
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);

  return items.sort((a, b) => a.fileName.localeCompare(b.fileName));
}

/** Kiểm tra 1 file JSON đã tồn tại trên S3 chưa (không tải nội dung). */
export async function dbObjectExists(fileName: string): Promise<boolean> {
  const client = assertClient();
  try {
    await client.send(
      new HeadObjectCommand({ Bucket: getS3EnvConfig().bucketName, Key: getS3DbKey(fileName) })
    );
    return true;
  } catch {
    return false;
  }
}
