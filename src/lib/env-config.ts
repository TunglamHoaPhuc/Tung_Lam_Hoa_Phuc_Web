import fs from 'fs';
import path from 'path';

/**
 * 🛡️ Quản lý tập trung cấu hình môi trường an toàn (S3, WordPress, Auth)
 * Không hard-code mật khẩu hoặc secret keys trong mã nguồn.
 */

let cachedEnvLocal: Record<string, string> | null = null;

function readEnvLocalFile(): Record<string, string> {
  if (cachedEnvLocal !== null) return cachedEnvLocal;
  cachedEnvLocal = {};
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
          cachedEnvLocal![match[1].trim()] = val.trim();
        }
      });
    }
  } catch {
    // Ignore read errors
  }
  return cachedEnvLocal;
}

export function getEnv(key: string, defaultValue?: string): string {
  const fromProcess = process.env[key];
  if (fromProcess !== undefined && fromProcess !== '') {
    return fromProcess.replace(/["']/g, '').trim();
  }
  const fromFile = readEnvLocalFile()[key];
  if (fromFile !== undefined && fromFile !== '') {
    return fromFile.replace(/["']/g, '').trim();
  }
  return defaultValue ?? '';
}

export function requireEnv(key: string, description?: string): string {
  const val = getEnv(key);
  if (!val) {
    throw new Error(
      `[env-config] Thiếu biến môi trường bắt buộc: ${key}${
        description ? ` (${description})` : ''
      }. Vui lòng cấu hình trong .env.local hoặc Vercel Environment Variables.`
    );
  }
  return val;
}

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucketName: string;
  publicUrl: string;
}

export function getS3Config(strict: boolean = false): S3Config | null {
  const accessKeyId = getEnv('S3_ACCESS_KEY_ID');
  const secretAccessKey = getEnv('S3_SECRET_ACCESS_KEY');
  const endpoint = getEnv('S3_ENDPOINT', 'https://s3.us-east-005.backblazeb2.com').replace(/\/+$/, '');
  const region = getEnv('S3_REGION', 'us-east-005');
  const bucketName = getEnv('S3_BUCKET_NAME', 'media-tunglamhoaphuc');
  const publicUrl = getEnv('S3_PUBLIC_URL', `https://${bucketName}.s3.${region}.backblazeb2.com`).replace(/\/+$/, '');

  if (!accessKeyId || !secretAccessKey) {
    if (strict) {
      requireEnv('S3_ACCESS_KEY_ID', 'Backblaze B2 Access Key ID');
      requireEnv('S3_SECRET_ACCESS_KEY', 'Backblaze B2 Secret Access Key');
    }
    return null;
  }

  return {
    accessKeyId,
    secretAccessKey,
    endpoint,
    region,
    bucketName,
    publicUrl,
  };
}

export interface WpConfig {
  baseUrl: string;
  username: string;
  password?: string;
  webhookSecret: string;
}

export function getWpConfig(requireAuth: boolean = false): WpConfig {
  const rawBase = getEnv('WP_ADMIN_BASE_URL', 'https://admin.tunglamhoaphuc.com').replace(/\/+$/, '');
  const baseUrl = rawBase.includes('mocwp.com') ? 'https://admin.tunglamhoaphuc.com' : rawBase;
  const username = getEnv('WP_ADMIN_USERNAME');
  const password = getEnv('WP_ADMIN_PASSWORD');
  const webhookSecret = getEnv('WP_WEBHOOK_SECRET', 'tunglamhoaphuc_secure_sync_2026');

  if (requireAuth) {
    if (!username) requireEnv('WP_ADMIN_USERNAME', 'Tài khoản quản trị WordPress');
    if (!password) requireEnv('WP_ADMIN_PASSWORD', 'Mật khẩu ứng dụng hoặc mật khẩu quản trị WordPress');
  }

  return {
    baseUrl,
    username,
    password,
    webhookSecret,
  };
}
