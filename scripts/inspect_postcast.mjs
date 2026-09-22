import fs from 'fs';
import path from 'path';

const postcastDir = 'E:\\VIDEO AND SOUND\\POSTCAST';

function scanExts(dir) {
  let counts = {};
  function walk(d) {
    try {
      const list = fs.readdirSync(d);
      for (const item of list) {
        const p = path.join(d, item);
        const s = fs.statSync(p);
        if (s.isDirectory()) {
          walk(p);
        } else {
          const ext = path.extname(item).toLowerCase() || '(none)';
          counts[ext] = (counts[ext] || 0) + 1;
        }
      }
    } catch(e) {}
  }
  walk(dir);
  return counts;
}

const exts = scanExts(postcastDir);
console.log('Extensions in POSTCAST:');
Object.entries(exts).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => {
  console.log(`  ${k}: ${v} files`);
});
