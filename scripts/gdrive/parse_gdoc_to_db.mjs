import fs from 'fs';
import path from 'path';

const raw = fs.readFileSync('scratch/gdoc_full_raw.txt', 'utf8');
const s3Keys = JSON.parse(fs.readFileSync('s3_keys.json', 'utf8'));

// Fuzzy matching for S3 image
function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
}

function findBestS3Image(keyword, fallback = '') {
  const cleanKw = norm(keyword);
  for (const k of s3Keys) {
    if (norm(k).includes(cleanKw)) {
      return `https://s2-cnv03.s3.us-east-005.backblazeb2.com/${k}`;
    }
  }
  return fallback || `https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/toan-canh-chua.webp`;
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Split the document into sections based on STT number patterns: "\t 1", "\t 2", "\t 3", etc.
const sections = raw.split(/\n\s*\[?\s*TAB\s*\]?\s*(\d+)\s*\n|\n\t\s*(\d+)\s*\n/g);
console.log(`Document split into chunks...`);

const parsedPosts = [];
let currentId = 10;

// Also parse regular paragraphs and headers
const lines = raw.split('\n');
let currentTitle = '';
let currentSubtitle = '';
let currentBody = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Header detection
  if (
    line.startsWith('ĐỨC PHẬT') ||
    line.startsWith('ĐỨC PHẬT') ||
    line.startsWith('BỒ TÁT') ||
    line.startsWith('BỒ TÁT') ||
    line.startsWith('QUAN ÂM') ||
    line.startsWith('ĐỊA TẠNG') ||
    line.startsWith('VĂN THÙ') ||
    line.startsWith('PHỔ HIỀN') ||
    line.startsWith('THẬP ĐẠI ĐỆ TỬ') ||
    line.startsWith('THẬP BÁT LA HÁN') ||
    line.startsWith('ĐẠT MA SƯ TỔ') ||
    line.startsWith('TỔ SƯ') ||
    line.startsWith('PHẬT HOÀNG') ||
    line.startsWith('THIỀN SƯ') ||
    line.startsWith('HỘ PHÁP') ||
    line.startsWith('CHƯ THÁNH') ||
    line.startsWith('TÔNG CHỈ') ||
    line.startsWith('PHÁP HỘI') ||
    line.startsWith('ĐẠI LỄ')
  ) {
    if (currentTitle && currentBody.length > 0) {
      const fullText = currentBody.join('\n\n');
      const firstPara = currentBody[0] || '';
      const slug = generateSlug(currentTitle);
      const img = findBestS3Image(slug);

      parsedPosts.push({
        id: `post-gdoc-${currentId++}`,
        slug: slug,
        title: currentTitle,
        subtitle: currentSubtitle || 'Chánh Pháp Tùng Lâm Hòa Phúc',
        mainCategory: 'dong-chay-hoang-phap',
        subCategory: 'dai-le-su-kien',
        author: 'Ban Văn Hóa Tùng Lâm',
        publishedDate: '2026-08-20',
        status: 'published',
        viewsCount: Math.floor(Math.random() * 20000) + 15000,
        thumbnailUrl: img,
        bannerUrl: img,
        summary: firstPara.slice(0, 200) + '...',
        contentHtml: currentBody.map((p) => `<p>${p}</p>`).join('\n'),
      });
    }

    currentTitle = line.replace(/^\t+/, '').trim();
    currentSubtitle = '';
    currentBody = [];

    // Next line might be subtitle (uppercase)
    if (i + 1 < lines.length) {
      const next = lines[i + 1].trim();
      if (next && next === next.toUpperCase() && next.length < 80) {
        currentSubtitle = next;
        i++;
      }
    }
  } else {
    currentBody.push(line.replace(/^\t+/, '').trim());
  }
}

// Add the last section
if (currentTitle && currentBody.length > 0) {
  const slug = generateSlug(currentTitle);
  const img = findBestS3Image(slug);
  parsedPosts.push({
    id: `post-gdoc-${currentId++}`,
    slug: slug,
    title: currentTitle,
    subtitle: currentSubtitle || 'Chánh Pháp Tùng Lâm Hòa Phúc',
    mainCategory: 'dong-chay-hoang-phap',
    subCategory: 'dai-le-su-kien',
    author: 'Ban Văn Hóa Tùng Lâm',
    publishedDate: '2026-08-20',
    status: 'published',
    viewsCount: 28500,
    thumbnailUrl: img,
    bannerUrl: img,
    summary: (currentBody[0] || '').slice(0, 200) + '...',
    contentHtml: currentBody.map((p) => `<p>${p}</p>`).join('\n'),
  });
}

console.log(`✅ Parsed ${parsedPosts.length} rich articles from Google Doc!`);

// Merge with existing posts database
const dbPath = path.resolve('src/data/posts-database.json');
let existingPosts = [];
if (fs.existsSync(dbPath)) {
  try {
    existingPosts = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {}
}

const existingSlugs = new Set(existingPosts.map((p) => p.slug));
for (const p of parsedPosts) {
  if (!existingSlugs.has(p.slug)) {
    existingPosts.push(p);
    existingSlugs.add(p.slug);
  }
}

fs.writeFileSync(dbPath, JSON.stringify(existingPosts, null, 2), 'utf8');
console.log(`🎉 Total Posts in Admin Database: ${existingPosts.length}`);
