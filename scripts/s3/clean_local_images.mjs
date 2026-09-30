import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('public/images');

if (fs.existsSync(baseDir)) {
  const entries = fs.readdirSync(baseDir);
  for (const ent of entries) {
    // Clean all downloaded folders except keep empty structure if needed
    const fullPath = path.join(baseDir, ent);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`Removed local folder: ${ent}`);
    } else {
      fs.unlinkSync(fullPath);
      console.log(`Removed local file: ${ent}`);
    }
  }
}
console.log('✅ Cleaned local public/images/ completely!');
