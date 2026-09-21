#!/usr/bin/env node
// 🪷 Nạp / kiểm tra cache JSON trên Backblaze B2 (bucket s2-cnv03)
//
//   node scripts/push-db-to-s3.mjs            → nạp các file CHƯA có trên S3 (không ghi đè)
//   node scripts/push-db-to-s3.mjs --force    → ghi đè toàn bộ bằng bản local
//   node scripts/push-db-to-s3.mjs --status   → chỉ liệt kê object đang có trên S3
//
// Dữ liệu được lưu tại: tunglamhoaphuc2/database/<ten-file>.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env.local') });

const BUCKET = process.env.S3_BUCKET_NAME || 's2-cnv03';
const PREFIX = 'tunglamhoaphuc2/database/';
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const STATUS_ONLY = args.includes('--status');

/** Các file JSON là "database" của web (cache nội dung WordPress + field riêng). */
const DB_FILES = [
  'posts-database.json',
  'statues-database.json',
  'tong-chi-data.json',
  'danh-tang-database.json',
  'gioi-thieu-database.json',
  'schedule-database.json',
  'universe-database.json',
  'memorial-data.json',
  'reference-books-data.json',
  'sach-an-pham-data.json',
];

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com',
  region: process.env.S3_REGION || 'us-east-005',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

async function existsOnS3(key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function listDatabase() {
  const res = await client.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: PREFIX, MaxKeys: 1000 })
  );
  return (res.Contents || []).filter((o) => o.Key && !o.Key.endsWith('/'));
}

async function main() {
  if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
    console.error('❌ Thiếu S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY trong .env.local');
    process.exit(1);
  }

  console.log(`📦 Bucket: ${BUCKET} · Prefix: ${PREFIX}`);
  const existing = await listDatabase();
  console.log(`   Hiện có ${existing.length} object trên S3.\n`);

  if (STATUS_ONLY) {
    for (const obj of existing) {
      console.log(`   • ${obj.Key} — ${(obj.Size / 1024).toFixed(1)} KB — ${obj.LastModified?.toISOString()}`);
    }
    return;
  }

  const existingKeys = new Set(existing.map((o) => o.Key));
  let uploaded = 0;
  let skipped = 0;
  let missing = 0;

  for (const fileName of DB_FILES) {
    const localPath = path.join(ROOT, 'src', 'data', fileName);
    const key = `${PREFIX}${fileName}`;

    if (!fs.existsSync(localPath)) {
      console.log(`   ⚠️  Bỏ qua (không có file local): ${fileName}`);
      missing++;
      continue;
    }

    if (existingKeys.has(key) && !FORCE) {
      console.log(`   ↷  Đã có trên S3, giữ nguyên: ${fileName}`);
      skipped++;
      continue;
    }

    const body = fs.readFileSync(localPath, 'utf-8');
    JSON.parse(body); // kiểm tra JSON hợp lệ trước khi đẩy lên

    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: 'application/json; charset=utf-8',
      })
    );
    console.log(`   ✅ Đã nạp: ${fileName} (${(Buffer.byteLength(body) / 1024).toFixed(1)} KB)`);
    uploaded++;
  }

  console.log(`\n🎉 Hoàn tất: ${uploaded} nạp mới · ${skipped} giữ nguyên · ${missing} thiếu file local`);
  console.log('   (Dùng --force nếu muốn ghi đè bản trên S3 bằng bản local)');
}

main().catch((err) => {
  console.error('❌ Lỗi:', err?.message || err);
  process.exit(1);
});
