import fs from 'fs';
import path from 'path';
import os from 'os';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Config, S3Config } from './env-config';

// In-memory cache cho các Lambda container đang warm
const memoryCache: Record<string, { data: any; timestamp: number }> = {};

// In-memory mutex lock chống xung đột ghi đè đồng thời trên cùng container
const writeLocks: Map<string, Promise<any>> = new Map();

/**
 * Xóa cache bộ nhớ để ép buộc đọc mới từ S3
 */
export function invalidateServerlessCache(fileName?: string) {
  if (fileName) {
    delete memoryCache[fileName];
  } else {
    Object.keys(memoryCache).forEach((k) => delete memoryCache[k]);
  }
}

/**
 * Lấy đường dẫn file trong thư mục tạm và đảm bảo thư mục cha tồn tại.
 */
function getTmpFilePath(fileName: string): string {
  const tmpDir = process.platform === 'win32' ? os.tmpdir() : '/tmp';
  try {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
  } catch {
    // Bỏ qua lỗi nếu thư mục không tạo được
  }
  return path.join(tmpDir, fileName);
}

/**
 * Ghi file an toàn vào thư mục tạm
 */
function safeWriteTmpFile(filePath: string, content: string): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (err) {
    console.warn(`[serverless-db] Không thể ghi vào ${filePath}:`, err);
    return false;
  }
}

let cachedS3Client: { client: S3Client; bucketName: string; config: S3Config } | null = null;

function getS3Client(strict: boolean = false): { client: S3Client; bucketName: string; config: S3Config } | null {
  if (cachedS3Client) return cachedS3Client;

  const s3Config = getS3Config(strict);
  if (!s3Config) return null;

  const client = new S3Client({
    endpoint: s3Config.endpoint,
    region: s3Config.region,
    credentials: {
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
    },
    forcePathStyle: true,
  });

  cachedS3Client = { client, bucketName: s3Config.bucketName, config: s3Config };
  return cachedS3Client;
}

export interface ServerlessDbOptions<T> {
  fileName: string;
  localRelativePath: string; // e.g. 'src/data/posts-database.json'
  s3Key?: string; // e.g. 'tunglamhoaphuc2/database/posts-database.json'
  defaultData: T;
}

export interface SaveResult {
  success: boolean;
  persistedToS3: boolean;
  persistedLocally: boolean;
  error?: string;
}

/**
 * Đọc dữ liệu JSON an toàn (Đồng bộ)
 */
export function loadServerlessJson<T>(opts: ServerlessDbOptions<T>): T {
  const { fileName, localRelativePath, defaultData } = opts;

  // 1. Kiểm tra Memory Cache (chỉ giữ dưới 3 giây)
  if (memoryCache[fileName] && Date.now() - memoryCache[fileName].timestamp < 3000) {
    return memoryCache[fileName].data as T;
  }

  const localPath = path.resolve(process.cwd(), localRelativePath);
  const tmpPath = getTmpFilePath(fileName);

  // 2. Kiểm tra file cục bộ (ưu tiên ở development)
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev && fs.existsSync(localPath)) {
    try {
      const raw = fs.readFileSync(localPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[fileName] = { data: parsed, timestamp: Date.now() };
      return parsed;
    } catch {
      // Fallback
    }
  }

  // 3. Kiểm tra thư mục /tmp
  if (fs.existsSync(tmpPath)) {
    try {
      const raw = fs.readFileSync(tmpPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[fileName] = { data: parsed, timestamp: Date.now() };
      return parsed;
    } catch {
      // Fallback
    }
  }

  // 4. File cục bộ nếu có
  if (fs.existsSync(localPath)) {
    try {
      const raw = fs.readFileSync(localPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[fileName] = { data: parsed, timestamp: Date.now() };
      return parsed;
    } catch {
      // Fallback
    }
  }

  return defaultData;
}

/**
 * Đọc dữ liệu JSON bất đồng bộ (Ưu tiên S3 để mọi Lambda container luôn thấy dữ liệu mới nhất)
 */
export async function loadServerlessJsonAsync<T>(opts: ServerlessDbOptions<T>): Promise<T> {
  const { fileName, localRelativePath, s3Key, defaultData } = opts;

  // 1. Kiểm tra Memory Cache (trong 3 giây để tránh tải lặp cùng 1 request flow)
  if (memoryCache[fileName] && Date.now() - memoryCache[fileName].timestamp < 3000) {
    return memoryCache[fileName].data as T;
  }

  const localPath = path.resolve(process.cwd(), localRelativePath);
  const tmpPath = getTmpFilePath(fileName);

  // 2. Ở môi trường local dev: Nếu có file local, ưu tiên file local
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev && fs.existsSync(localPath)) {
    try {
      const raw = fs.readFileSync(localPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[fileName] = { data: parsed, timestamp: Date.now() };
      return parsed;
    } catch {
      // Fallback
    }
  }

  // 3. Tải từ S3 Backblaze B2 (Nguồn sự thật Single Source of Truth trên Production)
  const s3Info = getS3Client();
  if (s3Info) {
    try {
      const s3Target = s3Key || `tunglamhoaphuc2/database/${fileName}`;
      const res = await s3Info.client.send(
        new GetObjectCommand({
          Bucket: s3Info.bucketName,
          Key: s3Target,
        })
      );
      const str = await res.Body?.transformToString();
      if (str) {
        const parsed = JSON.parse(str);
        memoryCache[fileName] = { data: parsed, timestamp: Date.now() };
        safeWriteTmpFile(tmpPath, str);
        return parsed;
      }
    } catch (err: any) {
      console.warn(`[serverless-db] S3 get error cho ${fileName}:`, err.message);
    }
  }

  // 4. Fallback xuống cơ chế đọc đồng bộ (/tmp -> local file)
  return loadServerlessJson<T>(opts);
}

/**
 * Lưu dữ liệu JSON an toàn & bền vững:
 * 1. Khóa Mutex chống ghi đè đồng thời trên cùng container.
 * 2. Ghi đè file cục bộ (nếu có quyền ghi).
 * 3. Ghi vào /tmp để container hiện tại luôn có bản mới nhất.
 * 4. Đồng bộ trực tiếp lên S3 Backblaze B2 và kiểm tra lỗi nghiêm ngặt.
 * KHÔNG trả kết quả thành công giả nếu S3 thất bại trên production.
 */
export async function saveServerlessJson<T>(opts: ServerlessDbOptions<T>, data: T): Promise<boolean> {
  const { fileName, localRelativePath, s3Key } = opts;
  const isDev = process.env.NODE_ENV !== 'production';

  // Chờ khóa mutex nếu đang có thao tác ghi khác cho cùng fileName
  const currentLock = writeLocks.get(fileName) || Promise.resolve();
  let releaseLock: () => void = () => {};
  const nextLock = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });
  writeLocks.set(fileName, nextLock);

  try {
    await currentLock;

    const jsonStr = JSON.stringify(data, null, 2);

    // 1. Cập nhật Memory Cache
    memoryCache[fileName] = { data, timestamp: Date.now() };

    // 2. Thử ghi vào local file nếu có thể
    let localWritten = false;
    const localPath = path.resolve(process.cwd(), localRelativePath);
    try {
      const localDir = path.dirname(localPath);
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      fs.writeFileSync(localPath, jsonStr, 'utf8');
      localWritten = true;
    } catch {
      // EROFS on serverless is expected
    }

    // 3. Luôn ghi vào /tmp
    const tmpPath = getTmpFilePath(fileName);
    safeWriteTmpFile(tmpPath, jsonStr);

    // 4. Đồng bộ lên S3 Backblaze B2
    const s3Info = getS3Client();
    if (!s3Info) {
      if (!isDev) {
        const errMsg = `[serverless-db] Không thể lưu ${fileName}: Thiếu cấu hình S3 trên môi trường Production!`;
        console.error(errMsg);
        throw new Error(errMsg);
      }
      // Trên local dev nếu không có S3 thì cho phép chỉ lưu local
      return localWritten;
    }

    const s3Target = s3Key || `tunglamhoaphuc2/database/${fileName}`;
    try {
      await s3Info.client.send(
        new PutObjectCommand({
          Bucket: s3Info.bucketName,
          Key: s3Target,
          Body: jsonStr,
          ContentType: 'application/json',
          CacheControl: 'no-cache, no-store, must-revalidate',
        })
      );
      return true;
    } catch (s3Err: any) {
      console.error(`❌ [serverless-db] Lỗi đồng bộ S3 ${s3Target}:`, s3Err.message);
      // Ném lỗi rõ ràng nếu là production để caller không báo thành công giả
      if (!isDev) {
        throw new Error(`Lưu vào bộ lưu trữ đám mây S3 thất bại: ${s3Err.message}`);
      }
      return localWritten;
    }
  } finally {
    releaseLock();
    if (writeLocks.get(fileName) === nextLock) {
      writeLocks.delete(fileName);
    }
  }
}
