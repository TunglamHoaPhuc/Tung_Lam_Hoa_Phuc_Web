import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log('Dir does not exist:', dir);
    return;
  }
  console.log('\n========================================');
  console.log('SCANNING:', dir);
  console.log('========================================');
  
  function walk(current) {
    const items = fs.readdirSync(current);
    for (const item of items) {
      const full = path.join(current, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        console.log('[DIR] ', full);
        walk(full);
      } else {
        console.log(`[FILE] (${stat.size}b) `, full);
      }
    }
  }
  
  walk(dir);
}

scanDir('E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\TÔNG CHỈ TU HỌC');
scanDir('E:\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC\\CƠ SỞ DỮ LIỆU TÙNG LÂM HÒA PHÚC_V2\\TÔNG CHỈ TU HỌC');
