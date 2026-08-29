import fs from 'fs';
import path from 'path';

const dir = 'C:\\Users\\MY PC\\Tung_Lam_Hoa_Phuc_Web\\public\\images\\tong-chi';
const files = fs.readdirSync(dir);

function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const map = {};
for (const file of files) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const slugName = slugify(base) + ext.toLowerCase();
  
  const src = path.join(dir, file);
  const dst = path.join(dir, slugName);
  
  if (slugName !== file) {
    fs.copyFileSync(src, dst);
  }
  map[file] = `/images/tong-chi/${slugName}`;
}

console.log('Normalized image mapping:');
console.log(JSON.stringify(map, null, 2));

fs.writeFileSync('C:\\Users\\MY PC\\Tung_Lam_Hoa_Phuc_Web\\drive_download\\image_map.json', JSON.stringify(map, null, 2), 'utf8');
