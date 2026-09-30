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
const PUBLIC_URL = `https://${BUCKET}.s3.${env.S3_REGION || 'us-east-005'}.backblazeb2.com`;

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

async function main() {
  const allObjects = await listAllS3Keys();
  console.log(`Loaded ${allObjects.length} S3 objects.`);

  // Create a fast lookup map: filename -> S3 full URL
  const fileToUrl = new Map();
  for (const obj of allObjects) {
    const fileName = obj.Key.split('/').pop();
    if (fileName && !fileToUrl.has(fileName.toLowerCase())) {
      fileToUrl.set(fileName.toLowerCase(), `${PUBLIC_URL}/${obj.Key}`);
    }
  }

  // 1. Sync quan-am-33-data.ts
  const quanAmPath = 'src/data/quan-am-33-data.ts';
  if (fs.existsSync(quanAmPath)) {
    let content = fs.readFileSync(quanAmPath, 'utf8');
    content = content.replace(/['"]\/images\/[^'"]*\/([^'"/]+)['"]/g, (match, fileName) => {
      const s3Url = fileToUrl.get(fileName.toLowerCase());
      return s3Url ? `'${s3Url}'` : match;
    });
    fs.writeFileSync(quanAmPath, content, 'utf8');
    console.log('✅ Updated quan-am-33-data.ts with S3 URLs');
  }

  // 2. Sync batBoKimCangData.ts
  const kimCangPath = 'src/data/batBoKimCangData.ts';
  if (fs.existsSync(kimCangPath)) {
    let content = fs.readFileSync(kimCangPath, 'utf8');
    content = content.replace(/['"]\/images\/[^'"]*\/([^'"/]+)['"]/g, (match, fileName) => {
      const s3Url = fileToUrl.get(fileName.toLowerCase());
      return s3Url ? `'${s3Url}'` : match;
    });
    fs.writeFileSync(kimCangPath, content, 'utf8');
    console.log('✅ Updated batBoKimCangData.ts with S3 URLs');
  }

  // 3. Sync thapNhiDuocXoaData.ts
  const duocXoaPath = 'src/data/thapNhiDuocXoaData.ts';
  if (fs.existsSync(duocXoaPath)) {
    let content = fs.readFileSync(duocXoaPath, 'utf8');
    content = content.replace(/['"]\/images\/[^'"]*\/([^'"/]+)['"]/g, (match, fileName) => {
      const s3Url = fileToUrl.get(fileName.toLowerCase());
      return s3Url ? `'${s3Url}'` : match;
    });
    fs.writeFileSync(duocXoaPath, content, 'utf8');
    console.log('✅ Updated thapNhiDuocXoaData.ts with S3 URLs');
  }

  // 4. Sync thapBatLaHanData.ts
  const laHanPath = 'src/data/thapBatLaHanData.ts';
  if (fs.existsSync(laHanPath)) {
    let content = fs.readFileSync(laHanPath, 'utf8');
    content = content.replace(/['"]\/images\/[^'"]*\/([^'"/]+)['"]/g, (match, fileName) => {
      const s3Url = fileToUrl.get(fileName.toLowerCase());
      return s3Url ? `'${s3Url}'` : match;
    });
    fs.writeFileSync(laHanPath, content, 'utf8');
    console.log('✅ Updated thapBatLaHanData.ts with S3 URLs');
  }

  // 5. Sync bao-tang-space-data.ts
  const baoTangPath = 'src/data/bao-tang-space-data.ts';
  if (fs.existsSync(baoTangPath)) {
    let content = fs.readFileSync(baoTangPath, 'utf8');
    content = content.replace(/['"]\/images\/[^'"]*\/([^'"/]+)['"]/g, (match, fileName) => {
      const s3Url = fileToUrl.get(fileName.toLowerCase());
      return s3Url ? `'${s3Url}'` : match;
    });
    fs.writeFileSync(baoTangPath, content, 'utf8');
    console.log('✅ Updated bao-tang-space-data.ts with S3 URLs');
  }

  // 6. Sync bao-tuong-full-data.ts and baoTuongFullData.ts
  for (const p of ['src/data/bao-tuong-full-data.ts', 'src/data/baoTuongFullData.ts']) {
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf8');
      content = content.replace(/['"]\/images\/[^'"]*\/([^'"/]+)['"]/g, (match, fileName) => {
        const s3Url = fileToUrl.get(fileName.toLowerCase());
        return s3Url ? `'${s3Url}'` : match;
      });
      fs.writeFileSync(p, content, 'utf8');
      console.log(`✅ Updated ${p} with S3 URLs`);
    }
  }

  // 7. Sync gioi-thieu-data.ts & tam-bao-detail-data.ts
  for (const p of ['src/data/gioi-thieu-data.ts', 'src/data/tam-bao-detail-data.ts', 'src/data/tong-chi-tu-hoc-data.ts']) {
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf8');
      content = content.replace(/['"]\/images\/[^'"]*\/([^'"/]+)['"]/g, (match, fileName) => {
        const s3Url = fileToUrl.get(fileName.toLowerCase());
        return s3Url ? `'${s3Url}'` : match;
      });
      fs.writeFileSync(p, content, 'utf8');
      console.log(`✅ Updated ${p} with S3 URLs`);
    }
  }
}

main().catch(console.error);
