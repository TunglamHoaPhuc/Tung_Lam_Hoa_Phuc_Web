import fs from 'fs';
import path from 'path';

const S3_BASE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2';

const AREA_IMAGES = {
  'tam-bao': `${S3_BASE}/vu-tru-phat-giao/toan-canh-chua.webp`,
  'to-duong': `${S3_BASE}/vu-tru-phat-giao/canh-1.webp`,
  'dai-nam-quoc-mau': `${S3_BASE}/vu-tru-phat-giao/canh-1.webp`,
  'bao-tang': `${S3_BASE}/vu-tru-phat-giao/bao-tang/trien-lam/Phat-giao/CHUA-VIET-NAM-XUA/Chua-Mot-Cot-xua.webp`,
  'bao-thap-van-phat-xa-loi': `${S3_BASE}/vu-tru-phat-giao/bao-thap/bao-thap-banner.webp`,
  'bao-thap': `${S3_BASE}/vu-tru-phat-giao/bao-thap/bao-thap-banner.webp`,
  'giang-duong': `${S3_BASE}/trang-chu/Phap-hoi-niem-Phat.webp`,
  'tu-an': `${S3_BASE}/tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp`,
  'tu-an-duong': `${S3_BASE}/tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp`,
  'vang-sinh-duong': `${S3_BASE}/tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp`,
  'thu-vien': `${S3_BASE}/tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp`,
  'tang-kinh-cac': `${S3_BASE}/tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp`,
  'nha-khach-nha-bep': `${S3_BASE}/vu-tru-phat-giao/canh-1.webp`,
  'nha-phat-tu': `${S3_BASE}/vu-tru-phat-giao/toan-canh-chua.webp`,
  'cong-tam-quan': `${S3_BASE}/trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp`,
  'ho-sen-vuon-la-han': `${S3_BASE}/vu-tru-phat-giao/toan-canh-chua.webp`,
  'ho-phong-sinh': `${S3_BASE}/trang-chu/Phap-hoi-niem-Phat.webp`,
};

// 1. Fix src/data/universe-data.ts
const universeDataPath = path.resolve('src/data/universe-data.ts');
let universeContent = fs.readFileSync(universeDataPath, 'utf8');

// Replace all area imgUrls
universeContent = universeContent.replace(/slug:\s*"([^"]+)",[\s\S]*?imgUrl:\s*"([^"]+)"/g, (match, slug, imgUrl) => {
  const cleanSlug = slug.toLowerCase().trim();
  const realImg = AREA_IMAGES[cleanSlug] || `${S3_BASE}/vu-tru-phat-giao/toan-canh-chua.webp`;
  return match.replace(`imgUrl: "${imgUrl}"`, `imgUrl: "${realImg}"`);
});

// Replace all remaining unsplash urls in universe-data.ts
universeContent = universeContent.replace(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g, `${S3_BASE}/33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp`);

fs.writeFileSync(universeDataPath, universeContent, 'utf8');
console.log('✅ Updated src/data/universe-data.ts');

// 2. Fix src/features/universe/components/InteractiveMap2D.tsx
const map2dPath = path.resolve('src/features/universe/components/InteractiveMap2D.tsx');
if (fs.existsSync(map2dPath)) {
  let map2dContent = fs.readFileSync(map2dPath, 'utf8');
  map2dContent = map2dContent.replace(/slug:\s*"([^"]+)",[\s\S]*?imgUrl:\s*"([^"]+)"/g, (match, slug, imgUrl) => {
    const cleanSlug = slug.toLowerCase().trim();
    const realImg = AREA_IMAGES[cleanSlug] || `${S3_BASE}/vu-tru-phat-giao/toan-canh-chua.webp`;
    return match.replace(`imgUrl: "${imgUrl}"`, `imgUrl: "${realImg}"`);
  });
  map2dContent = map2dContent.replace(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g, `${S3_BASE}/33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp`);
  fs.writeFileSync(map2dPath, map2dContent, 'utf8');
  console.log('✅ Updated InteractiveMap2D.tsx');
}

// 3. Fix ThapDaiDeTuCards.tsx
const thapDaiPath = path.resolve('src/features/universe/components/ThapDaiDeTuCards.tsx');
if (fs.existsSync(thapDaiPath)) {
  let thapDaiContent = fs.readFileSync(thapDaiPath, 'utf8');
  thapDaiContent = thapDaiContent.replace(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g, `${S3_BASE}/33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp`);
  fs.writeFileSync(thapDaiPath, thapDaiContent, 'utf8');
  console.log('✅ Updated ThapDaiDeTuCards.tsx');
}

// 4. Fix RelatedStoriesSection.tsx
const relatedPath = path.resolve('src/features/universe/components/RelatedStoriesSection.tsx');
if (fs.existsSync(relatedPath)) {
  let relatedContent = fs.readFileSync(relatedPath, 'utf8');
  relatedContent = relatedContent.replace(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g, `${S3_BASE}/vu-tru-phat-giao/toan-canh-chua.webp`);
  fs.writeFileSync(relatedPath, relatedContent, 'utf8');
  console.log('✅ Updated RelatedStoriesSection.tsx');
}

// 5. Fix ChayDuongSection.tsx
const chayDuongPath = path.resolve('src/features/universe/components/ChayDuongSection.tsx');
if (fs.existsSync(chayDuongPath)) {
  let chayContent = fs.readFileSync(chayDuongPath, 'utf8');
  chayContent = chayContent.replace(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g, `${S3_BASE}/vu-tru-phat-giao/canh-1.webp`);
  fs.writeFileSync(chayDuongPath, chayContent, 'utf8');
  console.log('✅ Updated ChayDuongSection.tsx');
}

console.log('🎉 All universe areas and statue components successfully connected to S3!');
