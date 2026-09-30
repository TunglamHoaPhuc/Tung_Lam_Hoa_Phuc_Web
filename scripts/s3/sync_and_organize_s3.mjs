import { S3Client, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
const raw = fs.readFileSync(envPath, 'utf-8');
const env = {};
raw.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1]] = val.trim();
  }
});

const client = new S3Client({
  endpoint: env.S3_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com',
  region: env.S3_REGION || 'us-east-005',
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = env.S3_BUCKET_NAME || 's2-cnv03';

async function listAllS3Keys(prefix = 'tunglamhoaphuc2/') {
  let allKeys = [];
  let token = undefined;
  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      ContinuationToken: token,
      MaxKeys: 1000,
    });
    const res = await client.send(cmd);
    if (res.Contents) {
      allKeys.push(...res.Contents);
    }
    token = res.NextContinuationToken;
  } while (token);
  return allKeys;
}

async function copyObject(sourceKey, targetKey) {
  try {
    const cmd = new CopyObjectCommand({
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${encodeURIComponent(sourceKey)}`,
      Key: targetKey,
    });
    await client.send(cmd);
    console.log(`Copied: ${sourceKey} -> ${targetKey}`);
  } catch (err) {
    console.error(`Failed to copy ${sourceKey} -> ${targetKey}:`, err.message);
  }
}

async function main() {
  const allObjects = await listAllS3Keys();
  console.log(`Total objects in S3: ${allObjects.length}`);

  // 1. Phân loại và đồng bộ các file Tông Chỉ Tu Học vào các thư mục con chuẩn
  const tongChiFiles = allObjects.filter(o => o.Key.startsWith('tunglamhoaphuc2/tong-chi/'));
  console.log(`Found ${tongChiFiles.length} files in tunglamhoaphuc2/tong-chi/`);

  for (const file of tongChiFiles) {
    const fileName = file.Key.split('/').pop();
    if (!fileName) continue;

    // Also copy to root tunglamhoaphuc2/tong-chi-tu-hoc/
    await copyObject(file.Key, `tunglamhoaphuc2/tong-chi-tu-hoc/${fileName}`);

    // Tông Phong Truyền Thừa
    if (/tong-phong|truyen-thua|tiep-buoc|doi-thay|mien-nam|su-to|hoang-phap|pho-chieu|kien-an|tung-lam|1\.webp|594929/i.test(fileName)) {
      await copyObject(file.Key, `tunglamhoaphuc2/tong-chi-tu-hoc/tong-phong-truyen-thua/${fileName}`);
    }

    // Nền Tảng Tu Học
    if (/nen-tang|bo-de-tam|tam-quy|thap-thien|bo-tat/i.test(fileName)) {
      await copyObject(file.Key, `tunglamhoaphuc2/tong-chi-tu-hoc/nen-tang-tu-hoc/${fileName}`);
    }

    // Phương Pháp Hành Trì
    if (/niem-phat|tung-kinh|thien|lay-phat|sam-hoi|nghe-phap|phung-su|bo-thi/i.test(fileName)) {
      await copyObject(file.Key, `tunglamhoaphuc2/tong-chi-tu-hoc/phuong-phap-hanh-tri/${fileName}`);
    }

    // Lộ Trình Tu Học
    if (/lo-trinh/i.test(fileName)) {
      await copyObject(file.Key, `tunglamhoaphuc2/tong-chi-tu-hoc/lo-trinh-tu-hoc/${fileName}`);
    }

    // Nếp Sống Thiền Gia
    if (/van-hoa|oai-nghi|bon-phan|an-chay|phong-sinh/i.test(fileName)) {
      await copyObject(file.Key, `tunglamhoaphuc2/tong-chi-tu-hoc/nep-song-thien-gia/${fileName}`);
    }
  }

  console.log('✅ Sync and organize completed successfully!');
}

main().catch(console.error);
