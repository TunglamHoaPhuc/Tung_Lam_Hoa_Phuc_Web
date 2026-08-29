import fs from 'fs';
import path from 'path';

const S3_BASE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2';

const filesToClean = [
  'src/data/dong-chay-hoang-phap-data.ts',
  'src/data/tri-tue-phat-phap-data.ts',
  'src/data/gioi-thieu-data.ts',
];

const fallbackImages = [
  `${S3_BASE}/trang-chu/Phap-hoi-niem-Phat.webp`,
  `${S3_BASE}/trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp`,
  `${S3_BASE}/vu-tru-phat-giao/toan-canh-chua.webp`,
  `${S3_BASE}/vu-tru-phat-giao/canh-1.webp`,
  `${S3_BASE}/tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp`,
  `${S3_BASE}/tong-chi/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp`,
];

let idx = 0;
for (const rel of filesToClean) {
  const fp = path.resolve(rel);
  if (!fs.existsSync(fp)) continue;

  let content = fs.readFileSync(fp, 'utf8');
  content = content.replace(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g, () => {
    const img = fallbackImages[idx % fallbackImages.length];
    idx++;
    return img;
  });

  fs.writeFileSync(fp, content, 'utf8');
  console.log(`✅ Cleaned unsplash images from ${rel}`);
}

console.log('🎉 All remaining public data files cleaned with S3 temple images!');
