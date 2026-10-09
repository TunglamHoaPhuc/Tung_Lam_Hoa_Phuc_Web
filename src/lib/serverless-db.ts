import fs from 'fs';
import path from 'path';
import os from 'os';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// In-memory cache for ultra-fast response within warm Lambda containers
const memoryCache: Record<string, { data: any; timestamp: number }> = {};

/**
 * Lấy đường dẫn file trong thư mục tạm và đảm bảo thư mục cha tồn tại.
 * - Trên Linux / Vercel Serverless: Thư mục tạm mặc định là '/tmp'.
 * - Trên Windows: Sử dụng os.tmpdir() để trỏ đúng thư mục tạm hợp lệ của hệ thống.
 * - Tự động tạo thư mục bằng fs.mkdirSync(..., { recursive: true }) nếu chưa có.
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
 * Ghi file an toàn vào thư mục tạm, tự động tạo thư mục nếu chưa tồn tại
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

function getS3Client(): { client: S3Client; bucketName: string } | null {
  let secretKey = process.env.S3_SECRET_ACCESS_KEY || 'K005/I+vUZ8TcuI2ww8TLeRPtsVzEaA';
  let accessKey = process.env.S3_ACCESS_KEY_ID || '005bc25330e1c1f0000000029';
  let endpoint = process.env.S3_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com';
  let region = process.env.S3_REGION || 'us-east-005';
  let bucketName = process.env.S3_BUCKET_NAME || 's2-cnv03';

  // Fallback: read .env.local on disk if secretKey missing in process.env
  if (!secretKey) {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf-8');
        raw.split('\n').forEach((line) => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            let val = match[2] || '';
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            val = val.trim();
            if (match[1] === 'S3_SECRET_ACCESS_KEY' && val) secretKey = val;
            if (match[1] === 'S3_ACCESS_KEY_ID' && val) accessKey = val;
            if (match[1] === 'S3_ENDPOINT' && val) endpoint = val;
            if (match[1] === 'S3_REGION' && val) region = val;
            if (match[1] === 'S3_BUCKET_NAME' && val) bucketName = val;
          }
        });
      }
    } catch {
      // ignore
    }
  }

  if (!secretKey || !accessKey) return null;

  const client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  });

  return { client, bucketName };
}

export interface ServerlessDbOptions<T> {
  fileName: string;
  localRelativePath: string; // e.g. 'src/data/statues-database.json'
  s3Key?: string; // e.g. 'tunglamhoaphuc2/database/statues-database.json'
  defaultData: T;
}

/**
 * Đọc dữ liệu JSON an toàn trên Vercel Serverless & Local Dev
 * Thứ tự ưu tiên: Memory Cache -> /tmp -> Local file -> Fallback
 */
export function loadServerlessJson<T>(opts: ServerlessDbOptions<T>): T {
  const { fileName, localRelativePath, defaultData } = opts;

  // 1. Kiểm tra Memory Cache (chỉ cache trong production dưới 10 giây)
  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev && memoryCache[fileName] && Date.now() - memoryCache[fileName].timestamp < 10000) {
    return memoryCache[fileName].data as T;
  }

  const localPath = path.resolve(process.cwd(), localRelativePath);
  const tmpPath = getTmpFilePath(fileName);

  // Nếu file cục bộ mới hơn file /tmp (ví dụ vừa deploy bản build mới), ưu tiên file cục bộ
  let useTmp = fs.existsSync(tmpPath);
  if (useTmp && fs.existsSync(localPath)) {
    try {
      if (fs.statSync(localPath).mtimeMs > fs.statSync(tmpPath).mtimeMs) {
        useTmp = false;
      }
    } catch {
      // ignore
    }
  }

  // 2. Kiểm tra thư mục /tmp (Vercel Lambda writable space)
  if (useTmp) {
    try {
      const raw = fs.readFileSync(tmpPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[fileName] = { data: parsed, timestamp: Date.now() };
      return parsed;
    } catch {
      // Tiếp tục fallback
    }
  }

  // 3. Kiểm tra file cục bộ dự án
  if (fs.existsSync(localPath)) {
    try {
      const raw = fs.readFileSync(localPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[fileName] = { data: parsed, timestamp: Date.now() };
      return parsed;
    } catch {
      // Tiếp tục fallback
    }
  }

  return defaultData;
}

/**
 * Đọc dữ liệu JSON bất đồng bộ (Ưu tiên S3 để mọi Lambda container luôn thấy dữ liệu mới nhất)
 * Thứ tự ưu tiên: Memory Cache (< 15s) -> S3 Backblaze B2 -> /tmp -> Local file -> Fallback
 */
export async function loadServerlessJsonAsync<T>(opts: ServerlessDbOptions<T>): Promise<T> {
  const { fileName, localRelativePath, s3Key, defaultData } = opts;

  // 1. Kiểm tra Memory Cache (áp dụng cho cả dev và prod trong 3 giây để tránh giật lag giữa các request liên tiếp)
  if (memoryCache[fileName] && Date.now() - memoryCache[fileName].timestamp < 3000) {
    return memoryCache[fileName].data as T;
  }

  const localPath = path.resolve(process.cwd(), localRelativePath);
  const tmpPath = getTmpFilePath(fileName);

  // 2. Nếu đang chạy môi trường phát triển cục bộ (Local Dev) và có file local -> Luôn ưu tiên file cục bộ!
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev && fs.existsSync(localPath)) {
    try {
      const raw = fs.readFileSync(localPath, 'utf8');
      const parsed = JSON.parse(raw);
      memoryCache[fileName] = { data: parsed, timestamp: Date.now() };
      return parsed;
    } catch {
      // Tiếp tục fallback nếu file hỏng
    }
  }

  // 3. Tải từ S3 Backblaze B2 (chủ yếu trên Vercel Serverless Production)
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

        // Lưu vào /tmp để container dùng nhanh
        safeWriteTmpFile(tmpPath, str);

        return parsed;
      }
    } catch (err: any) {
      // S3 lỗi mạng hoặc chưa có file, chuyển sang fallback
    }
  }

  // 4. Fallback xuống cơ chế đọc đồng bộ (/tmp -> local file)
  return loadServerlessJson<T>(opts);
}

/**
 * Lưu dữ liệu JSON an toàn:
 * 1. Ghi đè file cục bộ nếu có quyền ghi (Local dev).
 * 2. Ghi vào /tmp nếu chạy trên Vercel (bảo vệ chống lỗi EROFS).
 * 3. Đồng bộ trực tiếp lên S3 Backblaze B2 để dữ liệu tồn tại vĩnh viễn giữa các Lambda instance.
 */
export async function saveServerlessJson<T>(opts: ServerlessDbOptions<T>, data: T): Promise<boolean> {
  const { fileName, localRelativePath, s3Key, defaultData } = opts;
  const jsonStr = JSON.stringify(data, null, 2);

  // 1. Cập nhật Memory Cache
  memoryCache[fileName] = { data, timestamp: Date.now() };

  // 2. Thử ghi vào local file (nếu writable)
  let localWritten = false;
  const localPath = path.resolve(process.cwd(), localRelativePath);
  try {
    const localDir = path.dirname(localPath);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(localPath, jsonStr, 'utf8');
    localWritten = true;
  } catch (err: any) {
    // EROFS: read-only file system on Vercel - Đây là hành vi dự kiến của Serverless
  }

  // 3. Luôn ghi vào /tmp để container hiện tại luôn có dữ liệu mới nhất
  const tmpPath = getTmpFilePath(fileName);
  safeWriteTmpFile(tmpPath, jsonStr);

  // 4. Đồng bộ lên S3 Backblaze B2 để các Lambda khác hoặc lần truy cập sau đều đọc được
  const s3Target = s3Key || `tunglamhoaphuc2/database/${fileName}`;
  const s3Info = getS3Client();
  if (s3Info) {
    const isDev = process.env.NODE_ENV !== 'production';
    const s3Promise = s3Info.client.send(
      new PutObjectCommand({
        Bucket: s3Info.bucketName,
        Key: s3Target,
        Body: jsonStr,
        ContentType: 'application/json',
      })
    ).then(() => {
      console.log(`✅ [serverless-db] Đã đồng bộ ${fileName} lên S3 (${s3Target}) thành công!`);
    }).catch((err) => {
      console.error(`❌ [serverless-db] Lỗi đồng bộ S3 ${s3Target}:`, err);
    });

    // Trên production (Vercel): chờ S3 hoàn tất trước khi kết thúc Lambda lifecycle
    // Trên local dev: không chặn luồng để phản hồi tức thì
    if (!isDev) {
      await s3Promise;
    }
  }

  return true;
}
