import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET_NAME || 's2-cnv03';
const PUBLIC_URL = (process.env.S3_PUBLIC_URL || `https://${BUCKET}.s3.us-east-005.backblazeb2.com`).replace(/\/$/, '');
const ROOT_FOLDER = 'tunglamhoaphuc2';

// Chuẩn hóa tên thư mục sang không dấu gọn gàng
function sanitizeFolderName(folder) {
  return folder
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9-_\/]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

// Lấy tất cả file ảnh trong thư mục
function getAllImageFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllImageFiles(fullPath, arrayOfFiles);
    } else if (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(file)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadToS3(filePath) {
  const relPath = path.relative(path.resolve('public/images'), filePath).replace(/\\/g, '/');
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Chuẩn hóa đường dẫn đích trong ROOT_FOLDER
  const dirName = path.dirname(relPath);
  const baseName = path.basename(relPath, ext);
  const cleanDir = sanitizeFolderName(dirName === '.' ? 'uploads' : dirName);
  const cleanBaseName = baseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-');

  // Nén WebP
  let finalBuffer = buffer;
  let targetExt = ext;
  let contentType = 'image/jpeg';

  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    try {
      finalBuffer = await sharp(buffer)
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      targetExt = '.webp';
      contentType = 'image/webp';
    } catch (err) {
      console.warn(`Lỗi nén ảnh ${relPath}, tải bản gốc:`, err.message);
    }
  }

  const finalKey = `${ROOT_FOLDER}/${cleanDir}/${cleanBaseName}${targetExt}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: finalKey,
    Body: finalBuffer,
    ContentType: contentType,
  });

  await client.send(command);
  console.log(`✅ [${Math.round(finalBuffer.length / 1024)} KB] ${finalKey}`);
}

async function startSync() {
  console.log(`🚀 Bắt đầu gom toàn bộ ảnh vào thư mục chuẩn S3: "${ROOT_FOLDER}/"...`);
  const imagesDir = path.resolve('public/images');
  const allImages = getAllImageFiles(imagesDir);

  console.log(`Tìm thấy ${allImages.length} hình ảnh cần chuẩn hóa.`);

  let count = 0;
  for (const img of allImages) {
    count++;
    console.log(`[${count}/${allImages.length}] Đang xử lý: ${path.basename(img)}`);
    try {
      await uploadToS3(img);
    } catch (err) {
      console.error(`❌ Lỗi upload ${img}:`, err.message);
    }
  }

  console.log(`\n🎉 ĐÃ CẤU TRÚC VÀ ĐỒNG BỘ THÀNH CÔNG ${count} ẢNH VÀO ${ROOT_FOLDER}/ TRÊN S3!`);
}

startSync();
