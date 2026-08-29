import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
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

// Các thư mục rác ở root cần xóa (vì đã được gom vào tunglamhoaphuc2/)
const FOLDERS_TO_PURGE = [
  '33 ỨNG HÓA THÂN ĐỨC QUAN ÂM',
  'anh-tho-cac-vi-cao-tang',
  'bao_tuong_phat_giao',
  'icon-minh-hoa',
  'tong-chi',
  'trang-chu',
  'tu-an-book',
  'vu-tru-phat-giao',
];

async function purgeFolder(prefix) {
  console.log(`🧹 Đang xóa thư mục trùng lặp: "${prefix}"...`);
  let continuationToken = undefined;

  do {
    const listRes = await client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix.endsWith('/') ? prefix : `${prefix}/`,
        ContinuationToken: continuationToken,
      })
    );

    if (listRes.Contents && listRes.Contents.length > 0) {
      const deleteObjects = listRes.Contents.map((item) => ({ Key: item.Key }));
      await client.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: deleteObjects },
        })
      );
      console.log(`  - Đã xóa ${deleteObjects.length} tệp trong "${prefix}"`);
    }

    continuationToken = listRes.NextContinuationToken;
  } while (continuationToken);

  console.log(`✅ Đã xóa sạch thư mục: "${prefix}"`);
}

async function run() {
  for (const f of FOLDERS_TO_PURGE) {
    try {
      await purgeFolder(f);
    } catch (err) {
      console.error(`Lỗi xóa ${f}:`, err.message);
    }
  }
  console.log('🎉 ĐÃ DỌN DẸP SẠCH TOÀN BỘ CÁC THƯ MỤC TRÙNG LẶP TRÊN S3!');
}

run();
