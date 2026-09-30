import fs from 'fs';
import path from 'path';

try {
  const items = fs.readdirSync('E:\\');
  console.log('Items in E:\\:');
  for (const it of items) {
    const full = path.join('E:\\', it);
    const stat = fs.statSync(full);
    console.log(`- [${stat.isDirectory() ? 'DIR' : 'FILE'}] ${it}`);
    if (stat.isDirectory() && it.toLowerCase().includes('co so') || it.toLowerCase().includes('cơ sở') || it.toLowerCase().includes('tung lam')) {
      console.log(`  Sub-items of ${it}:`);
      const sub = fs.readdirSync(full);
      sub.forEach(s => console.log(`    * ${s}`));
    }
  }
} catch (e) {
  console.error('Error reading E:\\:', e.message);
}
