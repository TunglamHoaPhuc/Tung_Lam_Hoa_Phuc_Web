import fs from 'fs';
import path from 'path';

const raw = fs.readFileSync('scratch/gdoc_full_raw.txt', 'utf8');
const s3Keys = JSON.parse(fs.readFileSync('s3_keys.json', 'utf8'));

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
}

function findBestS3Image(keyword) {
  const cleanKw = norm(keyword);
  for (const k of s3Keys) {
    if (norm(k).includes(cleanKw)) {
      return `https://s2-cnv03.s3.us-east-005.backblazeb2.com/${k}`;
    }
  }
  return `https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/vu-tru-phat-giao/toan-canh-chua.webp`;
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

// Split by tab followed by a number: \t\s*(\d+)\s*\n\t\s*
const rawBlocks = raw.split(/\t\s*(\d+)\s*\n\t\s*/);
console.log(`Raw blocks count: ${rawBlocks.length}`);

const articles = [];
let count = 0;

for (let i = 1; i < rawBlocks.length; i += 2) {
  const stt = rawBlocks[i];
  const content = rawBlocks[i + 1] || '';
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

  if (lines.length > 0) {
    const title = lines[0].replace(/^\t+/, '').trim();
    const subtitle = lines.length > 1 && lines[1] === lines[1].toUpperCase() ? lines[1] : '';
    const bodyLines = subtitle ? lines.slice(2) : lines.slice(1);
    const slug = generateSlug(title);
    const img = findBestS3Image(slug);

    articles.push({
      id: `post-gdoc-${stt}`,
      slug,
      title,
      subtitle: subtitle || 'Lời Nguyện & Hành Trì Giác Ngộ',
      mainCategory: 'dong-chay-hoang-phap',
      subCategory: 'dai-le-su-kien',
      author: 'Ban Văn Hóa Tùng Lâm',
      publishedDate: '2026-08-20',
      status: 'published',
      viewsCount: Math.floor(Math.random() * 25000) + 18000,
      thumbnailUrl: img,
      bannerUrl: img,
      summary: (bodyLines[0] || '').slice(0, 220) + '...',
      contentHtml: bodyLines.map((p) => `<p>${p}</p>`).join('\n'),
    });
    count++;
  }
}

console.log(`✅ Extracted ${articles.length} structured articles from table!`);
articles.forEach((a, i) => console.log(`${i + 1}. [STT ${a.id}] ${a.title} (${a.subtitle})`));

// Save to posts database
const dbPath = path.resolve('src/data/posts-database.json');
let existingPosts = [];
if (fs.existsSync(dbPath)) {
  try {
    existingPosts = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {}
}

const existingSlugs = new Set(existingPosts.map((p) => p.slug));
for (const p of articles) {
  if (!existingSlugs.has(p.slug)) {
    existingPosts.push(p);
    existingSlugs.add(p.slug);
  }
}

fs.writeFileSync(dbPath, JSON.stringify(existingPosts, null, 2), 'utf8');
console.log(`🎉 Total Posts in Admin Database: ${existingPosts.length}`);
