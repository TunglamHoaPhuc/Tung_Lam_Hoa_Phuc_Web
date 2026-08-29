import fs from 'fs';
import path from 'path';

const s3Keys = JSON.parse(fs.readFileSync('s3_keys.json', 'utf8'));

// Build lookup dictionary for fuzzy matching
// Map normalized clean filename or relative path -> exact S3 CDN URL
const s3Map = new Map();

for (const fullKey of s3Keys) {
  // e.g. tunglamhoaphuc2/bao_tuong_phat_giao/thanh_van_thanh_chung/thap_dai_de_tu/ton_gia_la_hau_la.webp
  const url = `https://s2-cnv03.s3.us-east-005.backblazeb2.com/${fullKey}`;
  const relPath = fullKey.replace(/^tunglamhoaphuc2\//, ''); // bao_tuong_phat_giao/...
  const filename = path.basename(fullKey); // ton_gia_la_hau_la.webp
  const nameNoExt = filename.replace(/\.[^.]+$/, ''); // ton_gia_la_hau_la

  // Normalize helper
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '');

  s3Map.set(norm(relPath), url);
  s3Map.set(norm(filename), url);
  s3Map.set(norm(nameNoExt), url);
}

function resolveS3Url(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return rawPath;
  if (rawPath.startsWith('https://s2-cnv03.s3.us-east-005.backblazeb2.com')) return rawPath;

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '');
  const clean = rawPath.replace(/^\/images\//, '').replace(/^images\//, '');
  const filename = path.basename(clean);
  const nameNoExt = filename.replace(/\.[^.]+$/, '');

  // 1. Exact match on normalized full path
  if (s3Map.has(norm(clean))) return s3Map.get(norm(clean));
  // 2. Match on filename
  if (s3Map.has(norm(filename))) return s3Map.get(norm(filename));
  // 3. Match on name without extension
  if (s3Map.has(norm(nameNoExt))) return s3Map.get(norm(nameNoExt));

  // Fallback: convert directly to S3 format
  const s3Path = clean.toLowerCase().replace(/\.(jpg|jpeg|png|JPG|PNG)$/, '.webp');
  return `https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/${s3Path}`;
}

const targetFiles = [
  'src/data/statue-data.ts',
  'src/data/universe-data.ts',
  'src/data/anTrieuNguyenData.ts',
  'src/data/heritageGalleryData.ts',
  'src/data/schedule-data.ts',
];

for (const relFile of targetFiles) {
  const filePath = path.resolve(relFile);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let matchCount = 0;

  // Replace all "/images/..." strings
  content = content.replace(/"(\/images\/[^"]+)"/g, (match, raw) => {
    matchCount++;
    const resolved = resolveS3Url(raw);
    return `"${resolved}"`;
  });

  // Replace all 'imgUrl: "/images/..."'
  content = content.replace(/'(\/images\/[^']+)'/g, (match, raw) => {
    matchCount++;
    const resolved = resolveS3Url(raw);
    return `'${resolved}'`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Replaced ${matchCount} image paths in ${relFile}`);
}

console.log('🎉 Completed remapping all codebase images to S3 CDN!');
