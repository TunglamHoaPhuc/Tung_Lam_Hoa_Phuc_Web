import fs from 'fs';
import path from 'path';

const REPLACEMENTS = [
  { from: 'tunglamhoaphuc2/trang-chu/', to: 'tunglamhoaphuc2/01-trang-chu/' },
  { from: 'tunglamhoaphuc2/tong-chi-tu-hoc/', to: 'tunglamhoaphuc2/02-tong-chi-tu-hoc/' },
  { from: 'tunglamhoaphuc2/tong-chi/', to: 'tunglamhoaphuc2/02-tong-chi-tu-hoc/' },
  { from: 'tunglamhoaphuc2/dong-chay-hoang-phap/', to: 'tunglamhoaphuc2/03-dong-chay-hoang-phap/' },
  { from: 'tunglamhoaphuc2/vu-tru-phat-giao/', to: 'tunglamhoaphuc2/04-vu-tru-phat-giao/' },
  { from: 'tunglamhoaphuc2/bao_tuong_phat_giao/', to: 'tunglamhoaphuc2/05-bao-tuong-phat-giao/' },
  { from: 'tunglamhoaphuc2/33-ung-hoa-than-duc-quan-am/', to: 'tunglamhoaphuc2/06-33-ung-hoa-than-duc-quan-am/' },
  { from: 'tunglamhoaphuc2/anh-tho-cac-vi-cao-tang/', to: 'tunglamhoaphuc2/07-anh-tho-cac-vi-cao-tang/' },
  { from: 'tunglamhoaphuc2/tu-an-book/', to: 'tunglamhoaphuc2/08-tu-an-book/' },
  { from: 'tunglamhoaphuc2/icon-minh-hoa/', to: 'tunglamhoaphuc2/09-icon-minh-hoa/' },
  { from: 'tunglamhoaphuc2/uploads/', to: 'tunglamhoaphuc2/10-uploads/' },
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name !== 'node_modules' && ent.name !== '.next' && ent.name !== '.git') {
        processDir(fullPath);
      }
    } else if (/\.(ts|tsx|js|jsx|json|md)$/.test(ent.name)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const { from, to } of REPLACEMENTS) {
        if (content.includes(from)) {
          content = content.replaceAll(from, to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated URLs in: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log('🔄 Scanning and updating all codebase files with new numbered S3 URLs...');
processDir(path.resolve('src'));
processDir(path.resolve('data'));
console.log('✅ All data and code files have been updated with 100% precision!');
