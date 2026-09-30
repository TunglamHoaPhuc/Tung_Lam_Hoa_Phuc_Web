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

async function listAll(prefix = 'tunglamhoaphuc2/') {
  let items = [];
  let token = undefined;
  do {
    const cmd = new ListObjectsV2Command({
      Bucket: env.S3_BUCKET_NAME || 's2-cnv03',
      Prefix: prefix,
      ContinuationToken: token,
    });
    const res = await client.send(cmd);
    if (res.Contents) {
      items.push(...res.Contents);
    }
    token = res.NextContinuationToken;
  } while (token);
  return items;
}

async function main() {
  const all = await listAll();
  console.log(`Total objects in S3: ${all.length}`);

  console.log('\n--- LOGO FILES IN S3 ---');
  const logos = all.filter(item => item.Key.toLowerCase().includes('logo') || item.Key.toLowerCase().includes('moc-an') || item.Key.toLowerCase().includes('moc_an') || item.Key.toLowerCase().includes('hoa-phuc'));
  logos.forEach(l => console.log(l.Key, `(${(l.Size / 1024).toFixed(1)} KB)`));

  console.log('\n--- 08-TU-AN-BOOK / AN PHAM PHAT GIAO IN S3 ---');
  const books = all.filter(item => item.Key.toLowerCase().includes('08-tu-an-book') || item.Key.toLowerCase().includes('book') || item.Key.toLowerCase().includes('sach') || item.Key.toLowerCase().includes('an-pham'));
  console.log(`Found ${books.length} book files:`);
  books.forEach(b => console.log(' - ' + b.Key, `(${(b.Size / 1024).toFixed(1)} KB)`));

  console.log('\n--- 09-ICON-MINH-HOA IN S3 ---');
  const icons = all.filter(item => item.Key.toLowerCase().includes('09-icon-minh-hoa'));
  console.log(`Found ${icons.length} icon files:`);
  icons.forEach(i => console.log(' - ' + i.Key, `(${(i.Size / 1024).toFixed(1)} KB)`));
}

main().catch(console.error);
