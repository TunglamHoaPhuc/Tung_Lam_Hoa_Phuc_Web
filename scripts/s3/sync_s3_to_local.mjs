import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

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
const TARGET_DIR = path.resolve('public/images');

async function listAllS3Keys() {
  let allKeys = [];
  let token = undefined;
  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'tunglamhoaphuc2/',
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

async function downloadFile(key) {
  if (key.endsWith('/')) return;
  // Key: tunglamhoaphuc2/category/subfolder/file.webp
  const localRelative = key.replace(/^tunglamhoaphuc2\//, '');
  const localFilePath = path.join(TARGET_DIR, localRelative);

  if (fs.existsSync(localFilePath)) {
    return; // Already downloaded
  }

  const dir = path.dirname(localFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    const cmd = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    const res = await client.send(cmd);
    if (res.Body instanceof Readable) {
      await pipeline(res.Body, fs.createWriteStream(localFilePath));
    }
  } catch (err) {
    console.error(`Failed downloading ${key}:`, err.message);
  }
}

async function main() {
  console.log('Downloading and mirroring S3 bucket to local public/images/...');
  const allObjects = await listAllS3Keys();
  console.log(`Total objects to sync: ${allObjects.length}`);

  let count = 0;
  // Batch download 10 files concurrently
  const concurrency = 10;
  for (let i = 0; i < allObjects.length; i += concurrency) {
    const batch = allObjects.slice(i, i + concurrency);
    await Promise.all(batch.map(obj => downloadFile(obj.Key)));
    count += batch.length;
    if (count % 100 === 0 || count >= allObjects.length) {
      console.log(`Synced ${count}/${allObjects.length} files...`);
    }
  }

  console.log('✅ Local sync completed successfully!');
}

main().catch(console.error);
