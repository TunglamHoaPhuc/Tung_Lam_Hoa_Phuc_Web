import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES_DIR = path.resolve('public/images');

const FOLDERS_TO_REMOVE = [
  'bao_tuong_phat_giao',
  'trang-chu',
  'anh-tho-cac-vi-cao-tang',
  'vu-tru-phat-giao',
  'tong-chi',
  '33 ỨNG HÓA THÂN ĐỨC QUAN ÂM',
  'tu-an-book',
];

console.log('🧹 Bắt đầu dọn dẹp các thư mục ảnh cục bộ trùng lặp trong public/images/...');

for (const folder of FOLDERS_TO_REMOVE) {
  const target = path.join(PUBLIC_IMAGES_DIR, folder);
  if (fs.existsSync(target)) {
    console.log(`Đang xóa thư mục: ${folder}...`);
    fs.rmSync(target, { recursive: true, force: true });
    console.log(`✅ Đã giải phóng: ${folder}`);
  }
}

console.log('🎉 ĐÃ DỌN DẸP SẠCH TOÀN BỘ DỮ LIỆU THỪA TRONG PUBLIC/IMAGES!');
