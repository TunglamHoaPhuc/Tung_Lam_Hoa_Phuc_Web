import { S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

/**
 * 🪷 CẤU HÌNH LÕI BACKBLAZE B2 / S3 — Kho dữ liệu DUY NHẤT của dự án
 *
 * Tất cả dữ liệu (JSON database + ảnh + tài liệu số) đều nằm trong bucket
 * `s2-cnv03` tại prefix `tunglamhoaphuc2/`.
 *
 * Module này KHÔNG phụ thuộc `sharp` nên có thể import ở mọi route/route-handler
 * mà không kéo theo thư viện xử lý ảnh.
 */

export const S3_ROOT_PREFIX = 'tunglamhoaphuc2';

/** Thư mục chứa toàn bộ JSON database trên S3 (nguồn dữ liệu duy nhất). */
export const S3_DB_PREFIX = `${S3_ROOT_PREFIX}/database`;

export interface S3EnvConfig {
  accessKey: string;
  secretKey: string;
  endpoint: string;
  region: string;
  bucketName: string;
  publicUrl: string;
}

const DEFAULTS = {
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  region: 'us-east-005',
  bucketName: 's2-cnv03',
};

let cachedEnvConfig: S3EnvConfig | null = null;

/**
 * Đọc cấu hình S3 từ biến môi trường.
 * Trên local dev (không phải production) có thêm fallback đọc trực tiếp file `.env.local`
 * để các script Node chạy ngoài Next.js vẫn kết nối được S3.
 * ⚠️ Không hardcode credential trong mã nguồn.
 */
export function getS3EnvConfig(): S3EnvConfig {
  if (cachedEnvConfig) return cachedEnvConfig;

  let accessKey = process.env.S3_ACCESS_KEY_ID || '';
  let secretKey = process.env.S3_SECRET_ACCESS_KEY || '';
  let endpoint = process.env.S3_ENDPOINT || DEFAULTS.endpoint;
  let region = process.env.S3_REGION || DEFAULTS.region;
  let bucketName = process.env.S3_BUCKET_NAME || DEFAULTS.bucketName;
  let publicUrl = process.env.S3_PUBLIC_URL || `https://${bucketName}.s3.${region}.backblazeb2.com`;

  if ((!accessKey || !secretKey) && process.env.NODE_ENV !== 'production') {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf-8');
        raw.split('\n').forEach((line) => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (!match) return;
          let val = (match[2] || '').trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (match[1] === 'S3_ACCESS_KEY_ID' && val && !accessKey) accessKey = val;
          if (match[1] === 'S3_SECRET_ACCESS_KEY' && val && !secretKey) secretKey = val;
          if (match[1] === 'S3_ENDPOINT' && val) endpoint = val;
          if (match[1] === 'S3_REGION' && val) region = val;
          if (match[1] === 'S3_BUCKET_NAME' && val) bucketName = val;
          if (match[1] === 'S3_PUBLIC_URL' && val) publicUrl = val;
        });
      }
    } catch {
      // Bỏ qua: production luôn lấy từ biến môi trường
    }
  }

  cachedEnvConfig = {
    accessKey,
    secretKey,
    endpoint,
    region,
    bucketName,
    publicUrl: publicUrl.replace(/\/$/, ''),
  };
  return cachedEnvConfig;
}

let cachedS3Client: S3Client | null = null;

/** Trả về S3Client dùng chung, hoặc `null` nếu thiếu credential. */
export function getS3ClientInstance(): S3Client | null {
  const config = getS3EnvConfig();
  if (!config.accessKey || !config.secretKey) return null;
  if (!cachedS3Client) {
    cachedS3Client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      forcePathStyle: true,
    });
  }
  return cachedS3Client;
}

/** Tạo key S3 chuẩn cho 1 file JSON database: tunglamhoaphuc2/database/<fileName> */
export function getS3DbKey(fileName: string): string {
  return `${S3_DB_PREFIX}/${fileName.replace(/^\/+/, '')}`;
}

/** URL công khai của 1 key S3 (dùng cho ảnh/tài liệu). */
export function getS3PublicUrl(key: string): string {
  const { publicUrl } = getS3EnvConfig();
  return `${publicUrl}/${key.replace(/^\/+/, '')}`;
}
