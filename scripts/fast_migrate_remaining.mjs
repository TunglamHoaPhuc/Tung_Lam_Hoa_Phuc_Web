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

const MIGRATION_MAP = [
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

async function processFolder(oldPrefix, newPrefix) {
  const files = await listAllKeys(oldPrefix);
  console.log(`📂 Processing ${oldPrefix} -> ${newPrefix} (${files.length} files)...`);
  if (files.length === 0) return;

  const concurrency = 20;
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    await Promise.all(batch.map(async file => {
      if (file.Key.endsWith('/')) return;
      const relativePart = file.Key.replace(oldPrefix, '');
      const newKey = `${newPrefix}${relativePart}`;
      try {
        const copyCmd = new CopyObjectCommand({
          Bucket: BUCKET,
          CopySource: `${BUCKET}/${encodeURIComponent(file.Key)}`,
          Key: newKey,
        });
        await client.send(copyCmd);
      } catch (err) {
        console.error(`Copy error ${file.Key}:`, err.message);
      }
    }));
  }

  // Batch delete old keys
  const validFiles = files.filter(f => !f.Key.endsWith('/'));
  for (let i = 0; i < validFiles.length; i += 500) {
    const delBatch = validFiles.slice(i, i + 500);
    const delCmd = new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: { Objects: delBatch.map(f => ({ Key: f.Key })) },
    });
    await client.send(delCmd);
  }
  console.log(`✅ Completed ${newPrefix}!`);
}

async function main() {
  for (const { oldPrefix, newPrefix } of MIGRATION_MAP) {
    await processFolder(oldPrefix, newPrefix);
  }
  console.log('🎉 ALL FAST MIGRATION COMPLETED!');
}

main().catch(console.error);
