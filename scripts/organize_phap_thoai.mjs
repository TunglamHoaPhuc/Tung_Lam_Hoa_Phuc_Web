import fs from 'fs';
import path from 'path';

const targetBase = 'E:\\PHAP_THOAI_PHAT_TU_CHON_LOC';

const seriesConfig = [
  {
    folder: '01. SERIES - TÔN GIẢ ĐẠI MỤC KIỀN LIÊN (09 TẬP)',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 01 - AUDIO MARKER.mp3', dest: '01. Tôn Giả Mục Kiền Liên - Tập 01 - Hạnh Nguyện Ban Sơ.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 02 - AUDIO MARKER.mp3', dest: '02. Tôn Giả Mục Kiền Liên - Tập 02 - Ưu Tư Thời Niên Thiếu.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 03 - AUDIO MARKER.mp3', dest: '03. Tôn Giả Mục Kiền Liên - Tập 03 - Khơi Nguồn Hạnh Nguyện.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 04 - AUDIO MARKER.mp3', dest: '04. Tôn Giả Mục Kiền Liên - Tập 04 - Giữ Vững Chí Nguyện.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 05 - AUDIO MARKER.mp3', dest: '05. Tôn Giả Mục Kiền Liên - Tập 05 - Tự Do Đích Thực.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 06 - AUDIO MARKER.mp3', dest: '06. Tôn Giả Mục Kiền Liên - Tập 06 - Mục Đích Tối Hậu.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 07 - AUDIO MARKER.mp3', dest: '07. Tôn Giả Mục Kiền Liên - Tập 07 - Giữ Chất Người Tu.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 08 - AUDIO MARKER.mp3', dest: '08. Tôn Giả Mục Kiền Liên - Tập 08 - Cánh Cửa Bất Tử.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 09 - AUDIO MARKER.mp3', dest: '09. Tôn Giả Mục Kiền Liên - Tập 09 - Đạo Lộ Giải Thoát.mp3' }
    ]
  },
  {
    folder: '02. SERIES - KINH TẠP A HÀM - HIẾU DƯỠNG CHA MẸ (03 TẬP)',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\HIẾU DƯỠNG CHA MẸ\\MP3\\Hiếu Dưỡng Cha Mẹ - Phần 01 (Bản Podcast Hoàn Chỉnh).mp3', dest: '01. Lời Phật Dạy Về Hiếu Dưỡng Cha Mẹ - Phần 1 - ĐĐ. Thích Tâm Hòa.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\HIẾU DƯỠNG CHA MẸ\\MP3\\Hiếu Dưỡng Cha Mẹ - Phần 02 (Bản Podcast Hoàn Chỉnh).mp3', dest: '02. Lời Phật Dạy Về Hiếu Dưỡng Cha Mẹ - Phần 2 - Hạnh Phúc Gia Đình.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\HIẾU DƯỠNG CHA MẸ\\MP3\\Hiếu Dưỡng Cha Mẹ - Phần 03 (Bản Podcast Hoàn Chỉnh).mp3', dest: '03. Lời Phật Dạy Về Hiếu Dưỡng Cha Mẹ - Phần 3 - Báo Đáp Thâm Ân.mp3' }
    ]
  },
  {
    folder: '03. SERIES - PHÁP ÂM CHUYỂN HÓA & BÌNH AN NỘI TÂM (SA-MÔN VÔ TRÍ)',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\LIST PODCAST\\Pháp âm “Làm thế nào để gia đình hạnh phúc” - #phap thoai003.mp3', dest: '01. Làm Thế Nào Để Gia Đình Hạnh Phúc - Sa-môn Vô Trí.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\LIST PODCAST\\Pháp âm “làm cách nào để duy trì được sự bình an” – Sa-môn Vô Trí - #phapthoai004.mp3', dest: '02. Làm Cách Nào Để Duy Trì Sự Bình An - Sa-môn Vô Trí.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\LIST PODCAST\\Pháp âm “đâu là con đường đi đến hạnh phúc” – Sa-môn Vô Trí - #phapthoai005.mp3', dest: '03. Đâu Là Con Đường Đi Đến Hạnh Phúc - Sa-môn Vô Trí.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\LIST PODCAST\\Pháp âm - Làm thế nào để làm việc hiệu quả - Sa-môn Vô Trí - phapthoai006.mp3', dest: '04. Làm Việc Hiệu Quả Trong Chánh Niệm - Sa-môn Vô Trí.mp3' }
    ]
  },
  {
    folder: '04. SERIES - BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ\\BUỔI 1\\BUỔI 1_ĐIỀU GÌ GIÚP NGƯỜI CON PHẬT LUÔN VỮNG VÀNG.mp3', dest: '01. Điều Gì Giúp Người Con Phật Luôn Vững Vàng - ĐĐ. Thích Tâm Hòa.mp3' }
    ]
  },
  {
    folder: '05. SERIES - KHAI THỊ & CẢNH SÁCH NGÀY TRAI',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\LÁ THƯ\\(2214) LÁ THƯ SƯ PHỤ GỬI ĐẠI CHÚNG TRƯỚC THỀM NĂM BÍNH NGỌ - YouTube.mp3', dest: '01. Lá Thư Khai Thị Trước Thềm Năm Bính Ngọ - Thầy Viện Chủ Thích Tâm Hòa.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\SU_PHU\\01 - LA THU MUA TRUNG THU - SU PHU.mp3', dest: '02. Lá Thư Mùa Trung Thu - Thầy Viện Chủ Thích Tâm Hòa.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\CẢNH SÁCH\\Y2meta.app - Cảnh sách diễn Nôm - sáng chiều _ Giọng đọc_ ĐĐ. Minh Hạnh (128 kbps).mp3', dest: '03. Cảnh Sách Diễn Nôm Sáng Chiều - ĐĐ. Minh Hạnh.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\CẢNH SÁCH\\Y2meta.app - Cảnh sách ngày trai - Buổi chiều _ Giọng đọc_ ĐĐ. Minh Hạnh (128 kbps).mp3', dest: '04. Cảnh Sách Ngày Trai Buổi Chiều - ĐĐ. Minh Hạnh.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\CẢNH SÁCH\\Y2meta.app - Cảnh sách ngày Trai - Buổi sáng _ Giọng đọc_ ĐĐ. Minh Hạnh (128 kbps).mp3', dest: '05. Cảnh Sách Ngày Trai Buổi Sáng - ĐĐ. Minh Hạnh.mp3' }
    ]
  }
];

if (!fs.existsSync(targetBase)) {
  fs.mkdirSync(targetBase, { recursive: true });
}

console.log('=== TIẾN HÀNH SAO CHÉP & CHUẨN HÓA PHÁP THOẠI CHO PHẬT TỬ ===');
let totalCopied = 0;
let totalSkipped = 0;

for (const s of seriesConfig) {
  const dirPath = path.join(targetBase, s.folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  console.log(`\n📂 [${s.folder}]`);
  for (const f of s.files) {
    const destPath = path.join(dirPath, f.dest);
    if (fs.existsSync(f.src)) {
      if (!fs.existsSync(destPath)) {
        console.log(`   ⏳ Đang sao chép: ${f.dest}`);
        fs.copyFileSync(f.src, destPath);
        console.log(`   ✅ Đã chép xong: ${f.dest}`);
        totalCopied++;
      } else {
        console.log(`   ⚡ Đã có sẵn: ${f.dest}`);
        totalSkipped++;
      }
    } else {
      console.log(`   ⚠️  Không tìm thấy nguồn: ${f.src}`);
    }
  }
}

console.log(`\n======================================================`);
console.log(`🎉 TỔNG KẾT: Đã sao chép mới ${totalCopied} files, đã có sẵn ${totalSkipped} files.`);
console.log(`📁 Đường dẫn thư mục hoàn chỉnh: ${targetBase}`);
