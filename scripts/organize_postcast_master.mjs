import fs from 'fs';
import path from 'path';

const postcastRoot = 'E:\\VIDEO AND SOUND\\POSTCAST';
const masterSeriesDir = path.join(postcastRoot, '00_TONG_HOP_SERIES_PHAP_THOAI_HOAN_CHINH');

if (!fs.existsSync(masterSeriesDir)) {
  fs.mkdirSync(masterSeriesDir, { recursive: true });
}

// Cấu trúc 10 Series lớn hoàn chỉnh
const seriesDefinitions = [
  {
    folder: '01_SERIES_DAI_MUC_KIEN_LIEN (09 TẬP)',
    description: 'Series 9 bài giảng về Tôn Giả Đại Mục Kiền Liên - Giảng sư: ĐĐ. Thích Tâm Hòa',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 01 - AUDIO MARKER.mp3', dest: '01. Tôn Giả Mục Kiền Liên - Tập 01 - Hạnh Nguyện Ban Sơ.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 02 - AUDIO MARKER.mp3', dest: '02. Tôn Giả Mục Kiền Liên - Tập 02 - Ưu Tư Thời Niên Thiếu.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 03 - AUDIO MARKER.mp3', dest: '03. Tôn Giả Mục Kiền Liên - Tập 03 - Khơi Nguồn Hạnh Nguyện.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 04 - AUDIO MARKER.mp3', dest: '04. Tôn Giả Mục Kiền Liên - Tập 04 - Giữ Vững Chí Nguyện.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 05 - AUDIO MARKER.mp3', dest: '05. Tôn Giả Mục Kiền Liên - Tập 05 - Tự Do Đích Thực.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 06 - AUDIO MARKER.mp3', dest: '06. Tôn Giả Mục Kiền Liên - Tập 06 - Mục Đích Tối Hậu.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 07 - AUDIO MARKER.mp3', dest: '07. Tôn Giả Mục Kiền Liên - Tập 07 - Giữ Chất Người Tu.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 08 - AUDIO MARKER.mp3', dest: '08. Tôn Giả Mục Kiền Liên - Tập 08 - Cánh Cửa Bất Tử.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MP3\\MKL 09 - AUDIO MARKER.mp3', dest: '09. Tôn Giả Mục Kiền Liên - Tập 09 - Đạo Lộ Giải Thoát.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\ĐẠI ĐỆ TỬ - MỤC KIỀN LIÊN\\MKL 1-9_MARKER EXCEL\\ĐẠI MỤC KIỀN LIÊN MAIN MARKER.docx', dest: 'TÀI LIỆU MARKER - NỘI DUNG VÀ TIMESTAMPS 9 BUỔI.docx' }
    ]
  },
  {
    folder: '02_SERIES_HIEU_DUONG_CHA_ME_KINH_A_HAM (03 TẬP)',
    description: 'Series Kinh Tạp A Hàm - Lời Phật dạy về Hiếu Dưỡng Cha Mẹ - Giảng sư: ĐĐ. Thích Tâm Hòa',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\HIẾU DƯỠNG CHA MẸ\\MP3\\Hiếu Dưỡng Cha Mẹ - Phần 01 (Bản Podcast Hoàn Chỉnh).mp3', dest: '01. Lời Phật Dạy Về Hiếu Dưỡng Cha Mẹ - Phần 1.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\HIẾU DƯỠNG CHA MẸ\\MP3\\Hiếu Dưỡng Cha Mẹ - Phần 02 (Bản Podcast Hoàn Chỉnh).mp3', dest: '02. Lời Phật Dạy Về Hiếu Dưỡng Cha Mẹ - Phần 2 - Hạnh Phúc Gia Đình.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\HIẾU DƯỠNG CHA MẸ\\MP3\\Hiếu Dưỡng Cha Mẹ - Phần 03 (Bản Podcast Hoàn Chỉnh).mp3', dest: '03. Lời Phật Dạy Về Hiếu Dưỡng Cha Mẹ - Phần 3 - Báo Đáp Thâm Ân.mp3' }
    ]
  },
  {
    folder: '03_SERIES_PHAP_AM_CHUYEN_HOA_TAM_LY (SA-MÔN VÔ TRÍ)',
    description: 'Bộ Podcast Chuyển Hóa & Chữa Lành - Giảng sư: Sa-môn Vô Trí',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\LIST PODCAST\\Pháp âm “Làm thế nào để gia đình hạnh phúc” - #phap thoai003.mp3', dest: '01. Làm Thế Nào Để Gia Đình Hạnh Phúc - Sa-môn Vô Trí.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\LIST PODCAST\\Pháp âm “làm cách nào để duy trì được sự bình an” – Sa-môn Vô Trí - #phapthoai004.mp3', dest: '02. Làm Cách Nào Để Duy Trì Sự Bình An - Sa-môn Vô Trí.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\LIST PODCAST\\Pháp âm “đâu là con đường đi đến hạnh phúc” – Sa-môn Vô Trí - #phapthoai005.mp3', dest: '03. Đâu Là Con Đường Đi Đến Hạnh Phúc - Sa-môn Vô Trí.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\LIST PODCAST\\Pháp âm - Làm thế nào để làm việc hiệu quả - Sa-môn Vô Trí - phapthoai006.mp3', dest: '04. Làm Việc Hiệu Quả Trong Chánh Niệm - Sa-môn Vô Trí.mp3' }
    ]
  },
  {
    folder: '04_SERIES_BO_DE_TAM_HANH_TRI_NGHI_QUY',
    description: 'Giảng luận và hành trì Bồ Đề Tâm Nghi Quỹ - Giảng sư: ĐĐ. Thích Tâm Hòa',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ\\BUỔI 1\\BUỔI 1_ĐIỀU GÌ GIÚP NGƯỜI CON PHẬT LUÔN VỮNG VÀNG.mp3', dest: '01. Điều Gì Giúp Người Con Phật Luôn Vững Vàng.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ\\BUỔI 1\\BUỔI 1_ BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ GIẢNG LUẬN_CHI TIẾT.docx', dest: 'Buổi 1 - Giảng luận chi tiết.docx' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ\\BUỔI 2\\BUỔI 2_ BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ GIẢNG LUẬN_CHI TIẾT.docx', dest: 'Buổi 2 - Giảng luận chi tiết.docx' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ\\BUỔI 3\\buoi3_bodetam.docx.docx', dest: 'Buổi 3 - Giảng luận chi tiết.docx' }
    ]
  },
  {
    folder: '05_SERIES_CONG_TU_MOT_NGAY_AN_LAC',
    description: 'Pháp thoại các kỳ tu Một Ngày An Lạc - Bổ sung góc nhìn Thực Dưỡng Oshawa',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\PHÁP THOẠI\\PHÁP THOẠI MỘT NGÀY AN LẠC MỘT GÓC NHÌN VỀ THỰC DƯỠNG OSHAWA.mp3', dest: '01. Một Góc Nhìn Về Thực Dưỡng Oshawa Dưới Ánh Sáng Phật Pháp.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\MỘT NGÀY AN LẠC T5 ẤT TỴ\\MỘT NGÀY AN LẠC T6. TÓM TẮT CHƯƠNG TRƯỚC_01.mp3', dest: '02. Tóm Tắt Chương Trước - Một Ngày An Lạc.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\MỘT NGÀY AN LẠC T7 ẤT TỴ\\CỘNG TU MỘT NGÀY AN LẠC THÁNG 07_01.mp3', dest: '03. Cộng Tu Một Ngày An Lạc Tháng 07.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\MỘT NGÀY AN LẠC T6 ẤT TỴ\\MỘT  NGÀY AN LẠC T6 - GIỚI LUẬT NỀN TẢNG CỦA NGƯỜI TU.m4a', dest: '04. Giới Luật - Nền Tảng Của Người Tu.m4a' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\MỘT NGÀY AN LẠC T6 ẤT TỴ\\Tóm tắt nội dung pháp thoại sáng nay.docx', dest: 'Tóm tắt nội dung pháp thoại Một Ngày An Lạc.docx' }
    ]
  },
  {
    folder: '06_SERIES_PHAP_HOI_NIEM_PHAT_CTNP',
    description: 'Pháp âm các khóa Pháp Hội Niệm Phật định kỳ',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\CTNP_07_BINHNGO\\CT_PHNP_7.BINHNGO.mp3', dest: '01. Thấy Nghiệp Để Chuyển Hóa, Giữ Giới Để Tiến Tu - ĐĐ. Thích Tâm Hòa.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\CTNP_07_BINHNGO\\CT_PHNP_7.BINHNGO.docx', dest: '01. Bài Giảng Chi Tiết - Thấy Nghiệp Để Chuyển Hóa.docx' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\CTNP_05_2026\\PHNP_03_MARKER_EDIT01.mp3', dest: '02. Pháp Hội Niệm Phật 03 - Hương Vị Giải Thoát.mp3' }
    ]
  },
  {
    folder: '07_SERIES_KINH_DI_GIAO_PPUD',
    description: 'Phật Pháp Ứng Dụng - Kinh Di Giáo - ĐĐ. Thích Tâm Hòa',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\PPUD_CHUAHOANGPHAP_KDG\\TIMELINE_PLAN.docx', dest: '01. Kế Hoạch & Trích Đoạn Timeline Kinh Di Giáo.docx' }
    ]
  },
  {
    folder: '08_SERIES_LA_THU_KHAI_THI_VA_CANH_SACH',
    description: 'Bổ sung các bức Thư Khai Thị của Thầy Viện Chủ và Cảnh Sách Diễn Nôm',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\LÁ THƯ\\(2214) LÁ THƯ SƯ PHỤ GỬI ĐẠI CHÚNG TRƯỚC THỀM NĂM BÍNH NGỌ - YouTube.mp3', dest: '01. Lá Thư Khai Thị Trước Thềm Năm Bính Ngọ - Thầy Viện Chủ Thích Tâm Hòa.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\SU_PHU\\01 - LA THU MUA TRUNG THU - SU PHU.mp3', dest: '02. Lá Thư Mùa Trung Thu - Thầy Viện Chủ Thích Tâm Hòa.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\SU_PHU\\Khai_Trang_Tham_Le_Nghi_Thuc_Cung_Dan_20Phut_BanGoc.mp3', dest: '03. Khai Tràng Thảm Lễ Nghi Thức Cúng Đàn (20 Phút).mp3' },
      { src: 'E:\\VIDEO AND SOUND\\CẢNH SÁCH\\Y2meta.app - Cảnh sách diễn Nôm - sáng chiều _ Giọng đọc_ ĐĐ. Minh Hạnh (128 kbps).mp3', dest: '04. Cảnh Sách Diễn Nôm Sáng Chiều - ĐĐ. Minh Hạnh.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\CẢNH SÁCH\\Y2meta.app - Cảnh sách ngày trai - Buổi chiều _ Giọng đọc_ ĐĐ. Minh Hạnh (128 kbps).mp3', dest: '05. Cảnh Sách Ngày Trai Buổi Chiều - ĐĐ. Minh Hạnh.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\CẢNH SÁCH\\Y2meta.app - Cảnh sách ngày Trai - Buổi sáng _ Giọng đọc_ ĐĐ. Minh Hạnh (128 kbps).mp3', dest: '06. Cảnh Sách Ngày Trai Buổi Sáng - ĐĐ. Minh Hạnh.mp3' }
    ]
  },
  {
    folder: '09_SERIES_KHOA_TU_TUOI_TRE_VA_PHUNG_SU',
    description: 'Pháp thoại Khóa Tu Tuổi Trẻ & Tinh thần phụng sự',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\KHÓA TU TUỔI TRẺ\\TRÁI TIM NGƯỜI PHỤNG SỰ\\MP3\\TRÁI TIM NGƯỜI PHỤNG SỰ.mp3', dest: '01. Trái Tim Người Phụng Sự - ĐĐ. Thích Tâm Hòa.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\KHÓA TU TUỔI TRẺ\\TRÁI TIM NGƯỜI PHỤNG SỰ\\TÓM TẮT BÀI CHIA SẺ CỦA SƯ PHỤ - TRÁI TIM NGƯỜI PHỤNG SỰ.docx', dest: '01. Tóm Tắt Bài Chia Sẻ Trái Tim Người Phụng Sự.docx' },
      { src: 'E:\\VIDEO AND SOUND\\CHỐNG ĐỘT QUỴ\\pháp đàm khóa tu tuổi trẻ buổi 1.m4a', dest: '02. Pháp Đàm Khóa Tu Tuổi Trẻ Buổi 1.m4a' }
    ]
  },
  {
    folder: '10_SERIES_KHOA_LE_TRUYEN_THONG_VA_TUNG_KINH',
    description: 'Bổ sung Khóa lễ Huyết Bồn Trai, Lễ Vu Lan và Tụng Tỳ Ni',
    files: [
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\PHÁP THOẠI NGẮN\\PHÁP THOẠI HUYẾT BỒN TRAI NGÀY 1 NGẮN.mp3', dest: '01. Pháp Thoại Huyết Bồn Trai Ngày 1 (Ngắn).mp3' },
      { src: 'E:\\VIDEO AND SOUND\\POSTCAST\\PHÁP THOẠI NGẮN\\PHÁP THOẠI HUYẾT BỒN TRAI NGÀY KHAI ĐÀN NGẮN.mp3', dest: '02. Pháp Thoại Huyết Bồn Trai Ngày Khai Đàn (Ngắn).mp3' },
      { src: 'E:\\VIDEO AND SOUND\\TỤNG KINH\\TỤNG TỲ NI - BẢN GỐC.mp3', dest: '03. Tụng Tỳ Ni Nhật Dụng Thiết Yếu - Bản Gốc.mp3' },
      { src: 'E:\\VIDEO AND SOUND\\ÂM THANH CHÙA\\Sám Nguyện - Đại Đức Thích Thiện Mỹ - (có lời karaoke).mp3', dest: '04. Sám Nguyện - ĐĐ. Thích Thiện Mỹ.mp3' }
    ]
  }
];

console.log('=== TIẾN HÀNH SẮP XẾP VÀ BỔ SUNG DỮ LIỆU TẠI E:\\VIDEO AND SOUND\\POSTCAST ===');
let copiedCount = 0;
let existingCount = 0;

for (const s of seriesDefinitions) {
  const dirPath = path.join(masterSeriesDir, s.folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  console.log(`\n📂 [${s.folder}]`);
  for (const f of s.files) {
    const dest = path.join(dirPath, f.dest);
    if (fs.existsSync(f.src)) {
      if (!fs.existsSync(dest)) {
        console.log(`   ⏳ Sao chép bổ sung: ${f.dest}`);
        fs.copyFileSync(f.src, dest);
        copiedCount++;
      } else {
        console.log(`   ⚡ Đã tồn tại: ${f.dest}`);
        existingCount++;
      }
    } else {
      console.log(`   ⚠️  Không tìm thấy nguồn: ${f.src}`);
    }
  }
}

console.log(`\n======================================================`);
console.log(`🎉 Đã bổ sung thành công ${copiedCount} files mới, ${existingCount} files đã sẵn sàng.`);
console.log(`📁 Thư mục trung tâm: ${masterSeriesDir}`);
