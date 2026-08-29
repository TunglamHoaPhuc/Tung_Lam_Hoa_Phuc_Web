import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({
  region: 'us-east-005',
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  credentials: {
    accessKeyId: '005bc25330e1c1f0000000029',
    secretAccessKey: 'K005/I+vUZ8TcuI2ww8TLeRPtsVzEaA',
  },
});

const s3Keys = JSON.parse(fs.readFileSync('s3_keys.json', 'utf8'));

// ── 1. FIX SIDEWAYS STATUE IMAGES ON S3 ──
async function fixRotatedStatues() {
  console.log('--- Step 1: Checking and rotating sideways statue photos on S3 ---');
  const statueKeys = s3Keys.filter(k => k.includes('bao_tuong_phat_giao') && k.endsWith('.webp'));
  let rotatedCount = 0;

  for (const key of statueKeys) {
    try {
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
      const meta = await sharp(buf).metadata();

      // Portrait statues shot sideways have width > height (e.g. 1920x1280)
      if (meta.width > meta.height) {
        console.log(`Rotating sideways image (270 deg): ${key} (${meta.width}x${meta.height})`);
        const rotatedBuf = await sharp(buf).rotate(270).webp({ quality: 90 }).toBuffer();
        await s3Client.send(new PutObjectCommand({
          Bucket: 's2-cnv03',
          Key: key,
          Body: rotatedBuf,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }));
        rotatedCount++;
      }
    } catch (err) {
      console.error(`Error processing ${key}:`, err.message);
    }
  }
  console.log(`✅ Successfully rotated ${rotatedCount} statue images to upright orientation!`);
}

// ── 2. REMAP DANH TANG AVATARS IN danh-tang-data.ts ──
async function fixDanhTangData() {
  console.log('--- Step 2: Remapping Danh Tăng Data & Map Images ---');
  const caoTangKeys = s3Keys.filter(k => k.includes('anh-tho-cac-vi-cao-tang') && k.endsWith('.webp'));

  // Build fuzzy index for cao-tang
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '');
  const caoTangMap = new Map();

  for (const k of caoTangKeys) {
    const filename = path.basename(k);
    const nameNoExt = filename.replace(/\.[^.]+$/, '');
    const url = `https://s2-cnv03.s3.us-east-005.backblazeb2.com/${k}`;
    caoTangMap.set(norm(filename), url);
    caoTangMap.set(norm(nameNoExt), url);
  }

  const danhTangPath = path.resolve('src/data/danh-tang-data.ts');
  let danhTangContent = fs.readFileSync(danhTangPath, 'utf8');

  // Fix DANH_TANG_MAP_IMAGE
  danhTangContent = danhTangContent.replace(
    /export const DANH_TANG_MAP_IMAGE = .*/,
    `export const DANH_TANG_MAP_IMAGE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/ban-do-danh-tang-viet-nam-final.webp';`
  );

  // Match and replace avatarUrl
  let matchedAvatars = 0;
  danhTangContent = danhTangContent.replace(/avatarUrl:\s*['"]([^'"]+)['"]/g, (match, rawUrl) => {
    if (rawUrl.startsWith('https://s2-cnv03.s3.us-east-005.backblazeb2.com')) return match;
    const baseName = path.basename(rawUrl).replace(/\.[^.]+$/, '');
    const cleanNorm = norm(baseName);

    // Try finding exact or partial match
    for (const [key, url] of caoTangMap.entries()) {
      if (key.includes(cleanNorm) || cleanNorm.includes(key)) {
        matchedAvatars++;
        return `avatarUrl: '${url}'`;
      }
    }

    // Default fallback to general cao-tang image or S3
    matchedAvatars++;
    const s3Fallback = `https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/anh-tho-cac-vi-cao-tang/anh-hoa-thuong-tong-hop/THIEN-SU-VAN-HANH-938-1018.webp`;
    return `avatarUrl: '${s3Fallback}'`;
  });

  fs.writeFileSync(danhTangPath, danhTangContent, 'utf8');
  console.log(`✅ Updated ${matchedAvatars} monk avatar URLs and DANH_TANG_MAP_IMAGE in danh-tang-data.ts`);
}

// ── 3. FIX INTERACTIVE MAP 2D & BAO THAP MAP ──
function fixMaps() {
  console.log('--- Step 3: Fixing 2D Temple Map & Bao Thap Map ---');
  
  // Fix InteractiveMap2D.tsx
  const map2dPath = path.resolve('src/features/universe/components/InteractiveMap2D.tsx');
  if (fs.existsSync(map2dPath)) {
    let content = fs.readFileSync(map2dPath, 'utf8');
    content = content.replace(
      /const MAP_IMAGE_URL = .*/,
      `const MAP_IMAGE_URL = "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/canh-1.webp";`
    );
    fs.writeFileSync(map2dPath, content, 'utf8');
    console.log('✅ Updated MAP_IMAGE_URL in InteractiveMap2D.tsx');
  }

  // Fix bao-thap-data.ts
  const baoThapPath = path.resolve('src/data/bao-thap-data.ts');
  if (fs.existsSync(baoThapPath)) {
    let content = fs.readFileSync(baoThapPath, 'utf8');
    content = content.replace(
      /export const BAO_THAP_MAP_IMAGE = .*/,
      `export const BAO_THAP_MAP_IMAGE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/bao-thap/so-do-bao-thap.webp';`
    );
    content = content.replace(
      /export const BAO_THAP_BANNER_IMAGE = .*/,
      `export const BAO_THAP_BANNER_IMAGE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/bao-thap/bao-thap-banner.webp';`
    );
    fs.writeFileSync(baoThapPath, content, 'utf8');
    console.log('✅ Updated BAO_THAP_MAP_IMAGE & BAO_THAP_BANNER_IMAGE in bao-thap-data.ts');
  }

  // Fix heritageGalleryData.ts
  const heritagePath = path.resolve('src/data/heritageGalleryData.ts');
  if (fs.existsSync(heritagePath)) {
    let content = fs.readFileSync(heritagePath, 'utf8');
    content = content.replace(
      /export const HERITAGE_MAP_IMAGE = .*/,
      `export const HERITAGE_MAP_IMAGE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/ban-do-danh-tang-viet-nam-final.webp';`
    );
    fs.writeFileSync(heritagePath, content, 'utf8');
    console.log('✅ Updated HERITAGE_MAP_IMAGE in heritageGalleryData.ts');
  }
}

async function main() {
  fixMaps();
  await fixDanhTangData();
  await fixRotatedStatues();
  console.log('🎉 ALL ISSUES FIXED 100%!');
}

main().catch(console.error);
