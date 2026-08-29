import fs from 'fs';
import path from 'path';

const S3_BASE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2';

const fallbackImages = [
  `${S3_BASE}/trang-chu/Phap-hoi-niem-Phat.webp`,
  `${S3_BASE}/trang-chu/-ai-le-Vu-Lan-Bao-Hieu-JPG.webp`,
  `${S3_BASE}/vu-tru-phat-giao/toan-canh-chua.webp`,
  `${S3_BASE}/vu-tru-phat-giao/canh-1.webp`,
  `${S3_BASE}/tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp`,
  `${S3_BASE}/tong-chi/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp`,
  `${S3_BASE}/vu-tru-phat-giao/bao-thap/bao-thap-banner.webp`,
  `${S3_BASE}/33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp`,
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (/\.(tsx|ts|js|mjs|json)$/.test(file)) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(path.resolve('src'));
let totalReplaced = 0;
let idx = 0;

for (const fp of allFiles) {
  let content = fs.readFileSync(fp, 'utf8');
  if (content.includes('images.unsplash.com')) {
    const matches = content.match(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g);
    if (matches) {
      totalReplaced += matches.length;
      content = content.replace(/https:\/\/images\.unsplash\.com\/[^\s"',]+/g, () => {
        const img = fallbackImages[idx % fallbackImages.length];
        idx++;
        return img;
      });
      fs.writeFileSync(fp, content, 'utf8');
      console.log(`✅ Cleaned ${matches.length} unsplash URLs in ${path.relative(process.cwd(), fp)}`);
    }
  }
}

console.log(`🎉 COMPLETED: Cleaned a total of ${totalReplaced} unsplash URLs across entire src/ codebase!`);
