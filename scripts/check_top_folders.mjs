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

async function run() {
  const cmd = new ListObjectsV2Command({
    Bucket: env.S3_BUCKET_NAME || 's2-cnv03',
    Prefix: 'tunglamhoaphuc2/',
    Delimiter: '/',
    MaxKeys: 1000,
  });

  const res = await client.send(cmd);
  console.log('Top level prefixes under tunglamhoaphuc2/:');
  (res.CommonPrefixes || []).forEach((p) => console.log(' - ', p.Prefix));
}

run().catch(console.error);
