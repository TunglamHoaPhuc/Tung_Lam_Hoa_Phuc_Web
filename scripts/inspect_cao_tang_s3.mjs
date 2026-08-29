import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
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
  const files = await listAllKeys('tunglamhoaphuc2/07-anh-tho-cac-vi-cao-tang/');
  console.log(`Total Cao Tăng files on S3: ${files.length}`);
  const list = files.map(f => f.Key);
  fs.writeFileSync('scratch/cao_tang_s3_files.json', JSON.stringify(list, null, 2), 'utf-8');
  console.log('Sample 20 Cao Tăng files:', list.slice(0, 20));
}

main().catch(console.error);
