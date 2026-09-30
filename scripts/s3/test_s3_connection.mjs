import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
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

async function run() {
  console.log('Testing S3 connection...');
  try {
    const listRes = await client.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        MaxKeys: 10,
      })
    );
    console.log('✅ S3 Connected successfully!');
    console.log('Objects in bucket:', listRes.KeyCount);
    if (listRes.Contents) {
      listRes.Contents.forEach((c) => console.log(' -', c.Key, `(${c.Size} bytes)`));
    }
  } catch (err) {
    console.error('❌ S3 Error:', err);
  }
}

run();
