import fs from 'fs';
import path from 'path';

const postcastRoot = 'E:\\VIDEO AND SOUND\\POSTCAST';
const masterDir = path.join(postcastRoot, '00_TONG_HOP_SERIES_PHAP_THOAI_HOAN_CHINH');

const guideLines = [
  "================================================================================",
  "🛕 TÙNG LÂM HÒA PHÚC — TOÀN BỘ KHO PHÁP THOẠI QUY VỀ DUY NHẤT 1 NƠI LƯU TRỮ 🛕",
  "================================================================================",
  "ĐỊA ĐIỂM DUY NHẤT TRÊN MÁY TÍNH:",
  "👉 E:\\VIDEO AND SOUND\\POSTCAST\\00_TONG_HOP_SERIES_PHAP_THOAI_HOAN_CHINH\\",
  "",
  "Kính thưa Ban Văn Thư & Ban Hoằng Pháp,",
  "",
  "Theo đúng chỉ đạo của Quý vị, toàn bộ dữ liệu pháp thoại đã được quy về DUY NHẤT",
  "MỘT NƠI lưu trữ trên máy tính (đã xóa bỏ các thư mục rải rác bên ngoài để tránh bị rối).",
  "Đồng thời, toàn bộ 4 nguồn Google Drive Quý vị cung cấp đã được tải xuống và tích hợp trọn vẹn.",
  "",
  "--------------------------------------------------------------------------------",
  "TỔNG KẾT CHI TIẾT CÁC SERIES TRONG KHO LƯU TRỮ:",
  "--------------------------------------------------------------------------------",
  "",
  "📂 01_SERIES_DAI_MUC_KIEN_LIEN (09 TẬP HOÀN MÃN)",
  "   • Giảng sư: Đại đức Thích Tâm Hòa",
  "   • Đầy đủ 9 tập MP3 Master + Tài liệu Marker & Timestamps chi tiết.",
  "",
  "📂 02_SERIES_HIEU_DUONG_CHA_ME_KINH_A_HAM (03 TẬP)",
  "   • Giảng sư: Đại đức Thích Tâm Hòa",
  "   • Đầy đủ 3 tập MP3 Master (Hiếu Dưỡng Cha Mẹ - Gia Đình Hạnh Phúc - Báo Đáp Thâm Ân).",
  "",
  "📂 03_SERIES_PHAP_AM_CHUYEN_HOA_TAM_LY (SA-MÔN VÔ TRÍ)",
  "   • Giảng sư: Sa-môn Vô Trí",
  "   • 4 bài podcast: Gia đình hạnh phúc, Duy trì bình an, Con đường hạnh phúc, Làm việc chánh niệm.",
  "",
  "📂 04_SERIES_BO_DE_TAM_HANH_TRI_NGHI_QUY",
  "   • Giảng sư: Đại đức Thích Tâm Hòa",
  "   • Bài giảng Bồ Đề Tâm + Trái Tim Người Phụng Sự + Tài liệu Word 3 buổi giảng luận.",
  "",
  "📂 05_SERIES_CONG_TU_MOT_NGAY_AN_LAC",
  "   • Bài giảng Một Góc Nhìn Về Thực Dưỡng Oshawa Dưới Ánh Sáng Phật Pháp (ĐĐ. Thích Tâm Hòa).",
  "   • Tóm Tắt Chương Trước & Cộng Tu Một Ngày An Lạc Tháng 07 & Giới Luật Nền Tảng Người Tu.",
  "",
  "📂 06_SERIES_PHAP_HOI_NIEM_PHAT_CTNP (ĐÃ BỔ SUNG ĐỦ CẢ 5 THÁNG BÍNH NGỌ) 🌟",
  "   • Tháng 03: Kinh A Hàm Giới Luật Pháp Vị Tăng Hữu (155 MB)",
  "   • Tháng 04: Kinh A Hàm Bản Gốc (155 MB) + Tóm Tắt Docx",
  "   • Tháng 05: Hương Vị Giải Thoát Thứ 8 & Xả Pháp Y (45 MB)",
  "   • Tháng 06: Pháp Vị Tăng Hữu Số 8 Xả Pháp Y Thập Thiện (186 MB) & Truyền Pháp Y (181 MB)",
  "   • Tháng 07: Thấy Nghiệp Để Chuyển Hóa, Giữ Giới Để Tiến Tu (MP3 + M4A Final + Docx)",
  "",
  "📂 07_SERIES_KINH_DI_GIAO_PPUD (ĐÃ TẢI TRỌN BỘ 5 BUỔI TỪ GDRIVE) 🌟",
  "   • Buổi 01: Kinh Di Giáo (Bản Gốc MP3 - 69.7 MB)",
  "   • Buổi 02: Kinh Di Giáo (Bản Gốc M4A - 145.5 MB)",
  "   • Buổi 03: Kinh Di Giáo (Bản Gốc M4A - 140.5 MB)",
  "   • Buổi 04: Sư Phụ Tâm Hòa Giảng Kinh Di Giáo Tại Chùa Hoằng Pháp (153.0 MB)",
  "   • Buổi 05: Kinh Di Giáo (Bản Gốc M4A - 139.0 MB)",
  "   • Kèm Timeline & Kế hoạch trích đoạn.",
  "",
  "📂 08_SERIES_LA_THU_KHAI_THI_SU_PHU (CHỈ DÀNH RIÊNG CHO SƯ PHỤ)",
  "   • Lá Thư Khai Thị Trước Thềm Năm Bính Ngọ",
  "   • Lá Thư Mùa Trung Thu",
  "   • Khai Tràng Thảm Lễ Nghi Thức Cúng Đàn (20 Phút)",
  "",
  "📂 09_SERIES_KHOA_TU_TUOI_TRE_VA_PHUNG_SU (ĐÃ BỔ SUNG THÁNG 9.2026 & VÀO HÈ) 🌟",
  "   • Trái Tim Người Phụng Sự - ĐĐ. Thích Tâm Hòa",
  "   • CTTT Tháng 09.2026: Sư Phụ Khai Khóa Pháp Thoại (104 MB)",
  "   • CTTT Tháng 09.2026: Sư Phụ Chia Sẻ Đại Lễ Vu Lan (154 MB)",
  "   • CTTT Tháng 09.2026: Lễ Truyền Thọ Tam Quy Ngũ Giới (102 MB)",
  "   • CTTT Tháng 09.2026: Pháp Thoại Ngắn Sau Thời Khóa Tụng Kinh (41 MB)",
  "   • CTTT - Lễ Vào Hè 2026 (137 MB)",
  "   • Pháp Đàm Khóa Tu Tuổi Trẻ Buổi 1 (133 MB)",
  "",
  "📂 10_SERIES_DAI_LE_SU_KIEN_PHAP_THOAI (ĐÃ BỔ SUNG PHẬT ĐẢN 2025 & 2026) 🌟",
  "   • Đại Lễ Phật Đản 2026: Khai Mạc & Pháp Thoại Sư Phụ (153 MB) + Bài Khai Mạc Docx",
  "   • Đại Lễ Phật Đản 2026: Lễ Quy Y Tam Bảo (184 MB) + Nghi Thức Docx",
  "   • Đại Lễ Phật Đản 2025: Phật Thất 7 Ngày Bồ Đề Tâm Buổi 2 (146 MB)",
  "   • Đại Lễ Phật Đản 2025: Phật Thất 7 Ngày Bồ Đề Tâm Buổi 3 (139 MB) + Ghi Chú Docx",
  "",
  "📂 11_CHU_TANG_DIEN_NOM_CANH_SACH (ĐĐ. MINH HẠNH) (PHÂN KHU RIÊNG)",
  "   • Đã tách riêng biệt 3 bài diễn Nôm của ĐĐ. Minh Hạnh.",
  "================================================================================"
];

fs.writeFileSync(path.join(postcastRoot, '00_DANH_MUC_VA_QUY_HOACH_POSTCAST.txt'), guideLines.join('\r\n'), 'utf8');

// 2. CẬP NHẬT CSV
const rows = [
  ["STT", "SERIES", "TÊN BÀI PHÁP THOẠI", "GIẢNG SƯ", "NGUỒN DỮ LIỆU", "TRẠNG THÁI"],
  // Mục Kiền Liên
  ["1", "Tôn Giả Mục Kiền Liên", "Tập 01 - Hạnh Nguyện Ban Sơ", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["2", "Tôn Giả Mục Kiền Liên", "Tập 02 - Ưu Tư Thời Niên Thiếu", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["3", "Tôn Giả Mục Kiền Liên", "Tập 03 - Khơi Nguồn Hạnh Nguyện", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["4", "Tôn Giả Mục Kiền Liên", "Tập 04 - Giữ Vững Chí Nguyện", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["5", "Tôn Giả Mục Kiền Liên", "Tập 05 - Tự Do Đích Thực", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["6", "Tôn Giả Mục Kiền Liên", "Tập 06 - Mục Đích Tối Hậu", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["7", "Tôn Giả Mục Kiền Liên", "Tập 07 - Giữ Chất Người Tu", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["8", "Tôn Giả Mục Kiền Liên", "Tập 08 - Cánh Cửa Bất Tử", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["9", "Tôn Giả Mục Kiền Liên", "Tập 09 - Đạo Lộ Giải Thoát", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  // Hiếu Dưỡng Cha Mẹ
  ["10", "Kinh Tạp A Hàm", "Lời Phật Dạy Về Hiếu Dưỡng Cha Mẹ - Phần 1", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất podcast"],
  ["11", "Kinh Tạp A Hàm", "Hiếu Dưỡng Cha Mẹ - Phần 2 - Hạnh Phúc Gia Đình", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất podcast"],
  ["12", "Kinh Tạp A Hàm", "Hiếu Dưỡng Cha Mẹ - Phần 3 - Báo Đáp Thâm Ân", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất podcast"],
  // Chuyển Hóa
  ["13", "Pháp Âm Chuyển Hóa", "Làm Thế Nào Để Gia Đình Hạnh Phúc", "Sa-môn Vô Trí", "Kho POSTCAST", "Hoàn tất master"],
  ["14", "Pháp Âm Chuyển Hóa", "Làm Cách Nào Để Duy Trì Sự Bình An", "Sa-môn Vô Trí", "Kho POSTCAST", "Hoàn tất master"],
  ["15", "Pháp Âm Chuyển Hóa", "Đâu Là Con Đường Đi Đến Hạnh Phúc", "Sa-môn Vô Trí", "Kho POSTCAST", "Hoàn tất master"],
  ["16", "Pháp Âm Chuyển Hóa", "Làm Việc Hiệu Quả Trong Chánh Niệm", "Sa-môn Vô Trí", "Kho POSTCAST", "Hoàn tất master"],
  // Kinh Di Giáo
  ["17", "Kinh Di Giáo", "Kinh Di Giáo - Buổi 01 (Bản Gốc)", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["18", "Kinh Di Giáo", "Kinh Di Giáo - Buổi 02 (Bản Gốc)", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["19", "Kinh Di Giáo", "Kinh Di Giáo - Buổi 03 (Bản Gốc)", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["20", "Kinh Di Giáo", "Kinh Di Giáo - Buổi 04 (Chùa Hoằng Pháp)", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["21", "Kinh Di Giáo", "Kinh Di Giáo - Buổi 05 (Bản Gốc)", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  // Pháp Hội Niệm Phật
  ["22", "Pháp Hội Niệm Phật", "PHNP Tháng 03 - Kinh A Hàm Giới Luật Pháp Vị Tăng Hữu", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["23", "Pháp Hội Niệm Phật", "PHNP Tháng 04 - Kinh A Hàm Bản Gốc", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["24", "Pháp Hội Niệm Phật", "PHNP Tháng 05 - Hương Vị Giải Thoát Thứ 8 & Xả Pháp Y", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["25", "Pháp Hội Niệm Phật", "PHNP Tháng 06 - Pháp Vị Tăng Hữu Số 8 Xả Pháp Y Thập Thiện", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["26", "Pháp Hội Niệm Phật", "PHNP Tháng 06 - Truyền Pháp Y Thập Thiện", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["27", "Pháp Hội Niệm Phật", "PHNP Tháng 07 - Thấy Nghiệp Để Chuyển Hóa, Giữ Giới Để Tiến Tu", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  // Cộng Tu Tuổi Trẻ
  ["28", "Khóa Tu Tuổi Trẻ", "Trái Tim Người Phụng Sự", "ĐĐ. Thích Tâm Hòa", "Kho POSTCAST", "Hoàn tất master"],
  ["29", "Khóa Tu Tuổi Trẻ", "CTTT Tháng 09.2026 - Thầy Tâm Hòa Khai Khóa", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["30", "Khóa Tu Tuổi Trẻ", "CTTT Tháng 09.2026 - Sư Phụ Chia Sẻ Đại Lễ Vu Lan", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["31", "Khóa Tu Tuổi Trẻ", "CTTT Tháng 09.2026 - Lễ Truyền Thọ Tam Quy Ngũ Giới", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["32", "Khóa Tu Tuổi Trẻ", "CTTT Tháng 09.2026 - Pháp Thoại Ngắn Sau Tụng Kinh", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["33", "Khóa Tu Tuổi Trẻ", "CTTT - Lễ Vào Hè 2026", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  // Đại Lễ Sự Kiện
  ["34", "Đại Lễ Sự Kiện", "Đại Lễ Phật Đản 2026 - Khai Mạc & Pháp Thoại Sư Phụ", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["35", "Đại Lễ Sự Kiện", "Đại Lễ Phật Đản 2026 - Lễ Quy Y Tam Bảo", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["36", "Đại Lễ Sự Kiện", "Đại Lễ Phật Đản 2025 - Phật Thất 7 Ngày Bồ Đề Tâm (Buổi 2)", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"],
  ["37", "Đại Lễ Sự Kiện", "Đại Lễ Phật Đản 2025 - Phật Thất 7 Ngày Bồ Đề Tâm (Buổi 3)", "ĐĐ. Thích Tâm Hòa", "Google Drive", "Đã bổ sung"]
];

const csvStr = '\uFEFF' + rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\r\n');
fs.writeFileSync(path.join(postcastRoot, '00_BANG_TRA_CUU_PHAP_THOAI_POSTCAST.csv'), csvStr, 'utf8');

console.log('✅ Đã cập nhật xong bảng tra cứu và tài liệu quy hoạch cho DUY NHẤT 1 NƠI!');
