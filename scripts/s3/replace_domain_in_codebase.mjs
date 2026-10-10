import fs from 'fs';
import path from 'path';

const OLD_DOMAIN = 's2-cnv03.s3.us-east-005.backblazeb2.com';
const NEW_DOMAIN = 'media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com';

const OLD_BUCKET = 's2-cnv03';
const NEW_BUCKET = 'media-tunglamhoaphuc';

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        walkDir(fullPath, callback);
      }
    } else {
      callback(fullPath);
    }
  }
}

let changedCount = 0;
let totalReplacements = 0;

const targetDirs = [
  path.resolve(process.cwd(), 'src'),
  path.resolve(process.cwd(), 'public'),
  path.resolve(process.cwd(), 'scripts'),
];

for (const targetDir of targetDirs) {
  if (!fs.existsSync(targetDir)) continue;

  walkDir(targetDir, (filePath) => {
    // Only process text / code / json files
    const ext = path.extname(filePath).toLowerCase();
    if (!['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.md', '.css'].includes(ext)) {
      return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    if (content.includes(OLD_DOMAIN)) {
      const count = (content.match(new RegExp(OLD_DOMAIN, 'g')) || []).length;
      content = content.replaceAll(OLD_DOMAIN, NEW_DOMAIN);
      totalReplacements += count;
      modified = true;
    }

    if (content.includes(`|| '${OLD_BUCKET}'`)) {
      content = content.replaceAll(`|| '${OLD_BUCKET}'`, `|| '${NEW_BUCKET}'`);
      modified = true;
    }
    if (content.includes(`|| "${OLD_BUCKET}"`)) {
      content = content.replaceAll(`|| "${OLD_BUCKET}"`, `|| "${NEW_BUCKET}"`);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      changedCount++;
      console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
    }
  });
}

console.log('\n====================================================');
console.log(`🎉 HOÀN TẤT THAY THẾ DOMAIN S3!`);
console.log(`Số file đã cập nhật: ${changedCount}`);
console.log(`Tổng số đường dẫn đã chuyển đổi: ${totalReplacements}`);
console.log('====================================================');
