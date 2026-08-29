import fs from 'fs';
import path from 'path';
import { MONK_PROFILES } from '../src/data/danh-tang-data.ts';

const dbPath = path.resolve('src/data/danh-tang-database.json');
fs.writeFileSync(dbPath, JSON.stringify(MONK_PROFILES, null, 2), 'utf-8');
console.log(`✅ Đã xuất ${MONK_PROFILES.length} vị Danh Tăng vào file cơ sở dữ liệu: src/data/danh-tang-database.json`);
