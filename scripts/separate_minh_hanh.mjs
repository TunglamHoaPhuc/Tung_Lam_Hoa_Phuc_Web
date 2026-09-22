import fs from 'fs';
import path from 'path';

console.log('=== TIẾN HÀNH TÁCH BIỆT CẢNH SÁCH CỦA ĐĐ. MINH HẠNH KHỎI PHÁP THOẠI CỦA SƯ PHỤ ===\n');

// 1. XỬ LÝ TRONG E:\VIDEO AND SOUND\POSTCAST\00_TONG_HOP_SERIES_PHAP_THOAI_HOAN_CHINH
const postcastMaster = 'E:\\VIDEO AND SOUND\\POSTCAST\\00_TONG_HOP_SERIES_PHAP_THOAI_HOAN_CHINH';
const oldSeries8 = path.join(postcastMaster, '08_SERIES_LA_THU_KHAI_THI_VA_CANH_SACH');
const newSeries8 = path.join(postcastMaster, '08_SERIES_LA_THU_KHAI_THI_SU_PHU');
const separateDirPostcast = path.join(postcastMaster, '11_CHU_TANG_DIEN_NOM_CANH_SACH (ĐĐ. MINH HẠNH)');

if (!fs.existsSync(separateDirPostcast)) {
  fs.mkdirSync(separateDirPostcast, { recursive: true });
}

// Di chuyển 3 file của ĐĐ. Minh Hạnh sang 11_CHU_TANG_DIEN_NOM_CANH_SACH
const minhHanhFiles = [
  '04. Cảnh Sách Diễn Nôm Sáng Chiều - ĐĐ. Minh Hạnh.mp3',
  '05. Cảnh Sách Ngày Trai Buổi Chiều - ĐĐ. Minh Hạnh.mp3',
  '06. Cảnh Sách Ngày Trai Buổi Sáng - ĐĐ. Minh Hạnh.mp3'
];

minhHanhFiles.forEach(f => {
  const oldPath = path.join(oldSeries8, f);
  const newPath = path.join(separateDirPostcast, f);
  if (fs.existsSync(oldPath)) {
    console.log(`-> Di chuyển: ${f} -> 11_CHU_TANG_DIEN_NOM_CANH_SACH/`);
    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);
  }
});

// Đổi tên thư mục 08 thành chỉ dành riêng cho Sư Phụ
if (fs.existsSync(oldSeries8)) {
  if (fs.existsSync(newSeries8)) {
    // nếu newSeries8 đã có, chuyển các file còn lại sang
    fs.readdirSync(oldSeries8).forEach(f => {
      fs.copyFileSync(path.join(oldSeries8, f), path.join(newSeries8, f));
      fs.unlinkSync(path.join(oldSeries8, f));
    });
    fs.rmdirSync(oldSeries8);
  } else {
    fs.renameSync(oldSeries8, newSeries8);
  }
  console.log(`✅ Đã đổi tên thư mục thành: 08_SERIES_LA_THU_KHAI_THI_SU_PHU`);
}

// 2. XỬ LÝ TRONG E:\PHAP_THOAI_PHAT_TU_CHON_LOC
const phatTuRoot = 'E:\\PHAP_THOAI_PHAT_TU_CHON_LOC';
const oldPhatTu5 = path.join(phatTuRoot, '05. SERIES - KHAI THỊ & CẢNH SÁCH NGÀY TRAI');
const newPhatTu5 = path.join(phatTuRoot, '05. SERIES - LÁ THƯ KHAI THỊ SƯ PHỤ (ĐĐ. THÍCH TÂM HÒA)');
const separatePhatTu = path.join(phatTuRoot, '06. CHƯ TĂNG TỤNG ĐỌC DIỄN NÔM (ĐĐ. MINH HẠNH)');

if (!fs.existsSync(separatePhatTu)) {
  fs.mkdirSync(separatePhatTu, { recursive: true });
}

const minhHanhPhatTuFiles = [
  '03. Cảnh Sách Diễn Nôm Sáng Chiều - ĐĐ. Minh Hạnh.mp3',
  '04. Cảnh Sách Ngày Trai Buổi Chiều - ĐĐ. Minh Hạnh.mp3',
  '05. Cảnh Sách Ngày Trai Buổi Sáng - ĐĐ. Minh Hạnh.mp3'
];

minhHanhPhatTuFiles.forEach(f => {
  const oldPath = path.join(oldPhatTu5, f);
  const newPath = path.join(separatePhatTu, f);
  if (fs.existsSync(oldPath)) {
    console.log(`-> Di chuyển bản Phật tử: ${f} -> 06. CHƯ TĂNG TỤNG ĐỌC DIỄN NÔM/`);
    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);
  }
});

if (fs.existsSync(oldPhatTu5)) {
  if (fs.existsSync(newPhatTu5)) {
    fs.readdirSync(oldPhatTu5).forEach(f => {
      fs.copyFileSync(path.join(oldPhatTu5, f), path.join(newPhatTu5, f));
      fs.unlinkSync(path.join(oldPhatTu5, f));
    });
    fs.rmdirSync(oldPhatTu5);
  } else {
    fs.renameSync(oldPhatTu5, newPhatTu5);
  }
  console.log(`✅ Đã đổi tên thư mục Phật tử thành: 05. SERIES - LÁ THƯ KHAI THỊ SƯ PHỤ (ĐĐ. THÍCH TÂM HÒA)`);
}

// Bổ sung thêm bài Trái Tim Người Phụng Sự và Thực Dưỡng Oshawa của Sư Phụ vào E:\PHAP_THOAI_PHAT_TU_CHON_LOC
const oshawaSrc = 'E:\\VIDEO AND SOUND\\PHÁP THOẠI\\PHÁP THOẠI MỘT NGÀY AN LẠC MỘT GÓC NHÌN VỀ THỰC DƯỠNG OSHAWA.mp3';
const oshawaDest = path.join(phatTuRoot, '05. SERIES - LÁ THƯ KHAI THỊ SƯ PHỤ (ĐĐ. THÍCH TÂM HÒA)', '03. Một Góc Nhìn Về Thực Dưỡng Oshawa Dưới Ánh Sáng Phật Pháp - ĐĐ. Thích Tâm Hòa.mp3');
if (fs.existsSync(oshawaSrc) && !fs.existsSync(oshawaDest)) {
  console.log(`-> Bổ sung bài Thực Dưỡng Oshawa của Sư Phụ vào mục Phật tử`);
  fs.copyFileSync(oshawaSrc, oshawaDest);
}

const phungSuSrc = 'E:\\VIDEO AND SOUND\\POSTCAST\\KHÓA TU TUỔI TRẺ\\TRÁI TIM NGƯỜI PHỤNG SỰ\\MP3\\TRÁI TIM NGƯỜI PHỤNG SỰ.mp3';
const phungSuDest = path.join(phatTuRoot, '04. SERIES - BỒ ĐỀ TÂM HÀNH TRÌ NGHI QUỸ', '02. Trái Tim Người Phụng Sự - ĐĐ. Thích Tâm Hòa.mp3');
if (fs.existsSync(phungSuSrc) && !fs.existsSync(phungSuDest)) {
  console.log(`-> Bổ sung bài Trái Tim Người Phụng Sự của Sư Phụ vào mục Bồ Đề Tâm`);
  fs.copyFileSync(phungSuSrc, phungSuDest);
}

console.log('\n🎉 ĐÃ HOÀN TẤT VIỆC TÁCH BIỆT RÕ RÀNG VÀ BỔ SUNG CÁC BÀI CỦA SƯ PHỤ!');
