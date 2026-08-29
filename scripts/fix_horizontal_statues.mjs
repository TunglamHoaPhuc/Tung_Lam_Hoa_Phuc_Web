import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';

const s3Client = new S3Client({
  region: 'us-east-005',
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  credentials: {
    accessKeyId: '005bc25330e1c1f0000000029',
    secretAccessKey: 'K005/I+vUZ8TcuI2ww8TLeRPtsVzEaA',
  },
});

async function rotateImage(key, deg) {
  const getRes = await s3Client.send(new GetObjectCommand({
    Bucket: 's2-cnv03',
    Key: key,
  }));
  const streamToBuffer = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
  };
  const buf = await streamToBuffer(getRes.Body);
  const rotated = await sharp(buf).rotate(deg).webp({ quality: 90 }).toBuffer();
  await s3Client.send(new PutObjectCommand({
    Bucket: 's2-cnv03',
    Key: key,
    Body: rotated,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  console.log(`✅ Rotated ${key} by ${deg} degrees`);
}

// Rotate phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.webp by 90 deg clockwise back to horizontal
async function run() {
  const keysToRotate90 = [
    'tunglamhoaphuc2/bao_tuong_phat_giao/chu_phat_hai_hoi/duc_phat_duoc_su/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.webp',
  ];

  for (const k of keysToRotate90) {
    await rotateImage(k, 90);
  }
}

run().catch(console.error);
