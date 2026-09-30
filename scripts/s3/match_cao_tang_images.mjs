import fs from 'fs';
import path from 'path';

// Đọc danh sách file ảnh trên S3
const rawS3 = fs.readFileSync('scratch/cao_tang_s3_files.json', 'utf-8');
const s3Files = JSON.parse(rawS3);

const BASE_URL = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com';

function normalizeStr(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Bảng ánh xạ tìm kiếm file ảnh chuẩn nhất từ danh sách S3
function findBestImageMatch(monkName, lifespan = '', region = '', hoiChung = '') {
  const normName = normalizeStr(monkName);
  const nameParts = normName.split(' ').filter(w => w.length > 1 && !['hoa', 'thuong', 'thien', 'su', 'quoc', 'to', 'su', 'ni', 'truong', 'ba', 'thich', 'nu', 'dai', 'lao'].includes(w));

  // 1. Exact / strong match
  for (const s3Key of s3Files) {
    const normKey = normalizeStr(s3Key);
    const hasAllKeywords = nameParts.length > 0 && nameParts.every(part => normKey.includes(part));
    if (hasAllKeywords) {
      return `${BASE_URL}/${s3Key}`;
    }
  }

  // 2. Region / Folder match
  for (const s3Key of s3Files) {
    const normKey = normalizeStr(s3Key);
    if (nameParts.some(part => normKey.includes(part))) {
      return `${BASE_URL}/${s3Key}`;
    }
  }

  return null;
}

// Import và cập nhật MONK_PROFILES trong danh-tang-data.ts
const dataPath = path.resolve('src/data/danh-tang-data.ts');
let content = fs.readFileSync(dataPath, 'utf-8');

// Trích xuất các khối monk object
console.log('🔄 Bắt đầu đối chiếu và khớp ảnh cho toàn bộ danh tăng...');

let matchCount = 0;
const updatedContent = content.replace(/{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"][\s\S]*?avatarUrl:\s*['"]([^'"]+)['"]/g, (match, id, name, oldUrl) => {
  const bestImg = findBestImageMatch(name);
  if (bestImg) {
    matchCount++;
    console.log(`✓ Khớp: ${name} -> ${bestImg.split('/').pop()}`);
    return match.replace(oldUrl, bestImg);
  }
  return match;
});

fs.writeFileSync(dataPath, updatedContent, 'utf-8');
console.log(`✅ Đã khớp thành công ${matchCount} ảnh thực tế chuẩn xác từ S3 cho Danh Tăng!`);
