import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({
  region: 'us-east-005',
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  credentials: {
    accessKeyId: '005bc25330e1c1f0000000029',
    secretAccessKey: 'K005/I+vUZ8TcuI2ww8TLeRPtsVzEaA',
  },
});

const s3Keys = new Set(JSON.parse(fs.readFileSync('s3_keys.json', 'utf8')));

function sanitizeKey(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\/._-]/g, '_')
    .replace(/_+/g, '_');
}

async function scanAndUpload(dirPath, s3Prefix) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      const subPrefix = `${s3Prefix}/${sanitizeKey(item)}`;
      await scanAndUpload(fullPath, subPrefix);
    } else if (/\.(jpg|jpeg|png|webp|jfif|bmp)$/i.test(item)) {
      const ext = path.extname(item);
      const baseNoExt = path.basename(item, ext);
      const cleanName = `${sanitizeKey(baseNoExt)}.webp`;
      const s3Key = `${s3Prefix}/${cleanName}`.replace(/\/+/g, '/');

      if (s3Keys.has(s3Key)) {
        // Already on S3
        continue;
      }

      try {
        console.log(`Uploading new image: ${item} -> ${s3Key}`);
        const buf = fs.readFileSync(fullPath);
        const webpBuf = await sharp(buf).rotate().webp({ quality: 85 }).toBuffer();

        await s3Client.send(new PutObjectCommand({
          Bucket: 's2-cnv03',
          Key: s3Key,
          Body: webpBuf,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }));

        s3Keys.add(s3Key);
        console.log(`✅ Success: ${s3Key}`);
      } catch (err) {
        console.error(`❌ Error uploading ${fullPath}:`, err.message);
      }
    }
  }
}

async function main() {
  console.log('--- Starting Drive E: Image Sync to S3 ---');
  const sourceRoot = 'E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC';
  await scanAndUpload(sourceRoot, 'tunglamhoaphuc2');

  // Update s3_keys.json
  const updatedKeys = Array.from(s3Keys);
  fs.writeFileSync('s3_keys.json', JSON.stringify(updatedKeys, null, 2), 'utf8');
  console.log(`🎉 Drive E: Image Sync Complete! Total S3 Keys: ${updatedKeys.length}`);
}

main().catch(console.error);
