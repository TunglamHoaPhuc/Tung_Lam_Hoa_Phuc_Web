import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
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

// Bảng ánh xạ thư mục cũ -> thư mục mới có đánh số thứ tự
const MIGRATION_MAP = [
  { oldPrefix: 'tunglamhoaphuc2/trang-chu/', newPrefix: 'tunglamhoaphuc2/01-trang-chu/' },
  { oldPrefix: 'tunglamhoaphuc2/tong-chi-tu-hoc/', newPrefix: 'tunglamhoaphuc2/02-tong-chi-tu-hoc/' },
  { oldPrefix: 'tunglamhoaphuc2/dong-chay-hoang-phap/', newPrefix: 'tunglamhoaphuc2/03-dong-chay-hoang-phap/' },
  { oldPrefix: 'tunglamhoaphuc2/vu-tru-phat-giao/', newPrefix: 'tunglamhoaphuc2/04-vu-tru-phat-giao/' },
  { oldPrefix: 'tunglamhoaphuc2/bao_tuong_phat_giao/', newPrefix: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/' },
  { oldPrefix: 'tunglamhoaphuc2/33-ung-hoa-than-duc-quan-am/', newPrefix: 'tunglamhoaphuc2/06-33-ung-hoa-than-duc-quan-am/' },
  { oldPrefix: 'tunglamhoaphuc2/anh-tho-cac-vi-cao-tang/', newPrefix: 'tunglamhoaphuc2/07-anh-tho-cac-vi-cao-tang/' },
  { oldPrefix: 'tunglamhoaphuc2/tu-an-book/', newPrefix: 'tunglamhoaphuc2/08-tu-an-book/' },
  { oldPrefix: 'tunglamhoaphuc2/icon-minh-hoa/', newPrefix: 'tunglamhoaphuc2/09-icon-minh-hoa/' },
  { oldPrefix: 'tunglamhoaphuc2/uploads/', newPrefix: 'tunglamhoaphuc2/10-uploads/' },
];

async function listAllKeys(prefix) {
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

async function main() {
  console.log('🚀 Bắt đầu quá trình di chuyển & đổi tên toàn bộ thư mục S3 sang tiền tố 01..10...');

  for (const { oldPrefix, newPrefix } of MIGRATION_MAP) {
    const files = await listAllKeys(oldPrefix);
    console.log(`\n📂 Thư mục: ${oldPrefix} -> ${newPrefix} (${files.length} files)`);

    const filesToDelete = [];

    for (const file of files) {
      if (file.Key.endsWith('/')) continue;
      const relativePart = file.Key.replace(oldPrefix, '');
      const newKey = `${newPrefix}${relativePart}`;

      try {
        const copyCmd = new CopyObjectCommand({
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${encodeURIComponent(file.Key)}`,
          Key: newKey,
        });
        await client.send(copyCmd);
        filesToDelete.push({ Key: file.Key });
      } catch (err) {
        console.error(`Lỗi copy ${file.Key}:`, err.message);
      }
    }

    // Xóa các file cũ
    if (filesToDelete.length > 0) {
      // Delete in batches of 500
      for (let i = 0; i < filesToDelete.length; i += 500) {
        const batch = filesToDelete.slice(i, i + 500);
        const delCmd = new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: batch },
        });
        await client.send(delCmd);
      }
      console.log(`✅ Đã chuyển thành công ${filesToDelete.length} files sang ${newPrefix}!`);
    }
  }

  console.log('\n🎉 Hoàn tất 100% quá trình chuẩn hóa tiền tố 01..10 trên S3!');
}

main().catch(console.error);
