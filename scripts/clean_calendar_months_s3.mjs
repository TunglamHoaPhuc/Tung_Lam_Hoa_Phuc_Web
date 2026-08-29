import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
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

async function deleteCalendarMonthsJunk() {
  const cmd = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: 'tunglamhoaphuc2/trang-chu/calendar_months/',
    MaxKeys: 1000,
  });

  const res = await client.send(cmd);
  const items = res.Contents || [];
  console.log(`Found ${items.length} junk files to delete in calendar_months...`);

  if (items.length > 0) {
    const deleteCmd = new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: items.map(i => ({ Key: i.Key })),
      },
    });
    await client.send(deleteCmd);
    console.log(`✅ Deleted ${items.length} junk files from calendar_months on S3!`);
  }
}

deleteCalendarMonthsJunk().catch(console.error);
