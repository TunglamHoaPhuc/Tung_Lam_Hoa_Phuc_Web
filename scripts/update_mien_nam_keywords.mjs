import fs from 'fs';
import path from 'path';

// Copy cao-tang photos for popups
const srcNam = 'public/images/anh-tho-cac-vi-cao-tang/Nam';
const dstDir = 'public/images/tong-chi';

function safeCopy(srcFile, dstFile) {
  const src = path.join(srcNam, srcFile);
  const dst = path.join(dstDir, dstFile);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`Copied ${srcFile} -> ${dstFile}`);
  }
}

safeCopy('Hòa Thượng Nhật Thiện 1929 – 2001.jpg', 'chua-dinh-thanh-ht-le-trang.jpg');
safeCopy('Hòa Thượng Thích Bửu Huệ.jpg', 'chua-hue-nghiem-luat-vien.jpg');
safeCopy('Hòa Thượng Ngộ Chân Tử.jpg', 'su-to-ngo-chan-tu.jpg');

// Update Article ID 3 in tong-chi-data.json
const dataPath = 'src/data/tong-chi-data.json';
const articles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const mienNamDoc = JSON.parse(fs.readFileSync('drive_download/all_parsed_docs.json', 'utf8'))['II_1_TRANG_CHI_TIET_MIEN_NAM_CHON_TO.docx'] || '';

const cleanPoem = mienNamDoc
  .replace(/^MIỀN NAM CHỐN TỔ\s*/i, '')
  .replace(/^Tông chỉ tu học.*?\.jpg\s*/im, '')
  .replace(/Bài thơ được trích trong tác phẩm.*$/im, '')
  .replace(/Vô Trí\s*[-–—]\s*Tâm Hòa\s*$/im, '')
  .trim();

const mienNamKeywords = [
  {
    keyword: 'Chốn Tổ đình Hoằng Pháp',
    title: 'CHỐN TỔ ĐÌNH HOẰNG PHÁP (HÓC MÔN)',
    subtitle: 'TRUNG TÂM HOẰNG PHÁP VÀ TU HỌC TỊNH ĐỘ LỚN NHẤT CẢ NƯỚC',
    imageUrl: '/images/tong-chi/tong-chi-tu-hoc-tong-phong-hoang-phap-mien-nam-chon-to-thap-to-nhi-nghiem-popup.jpg',
    description: 'Chùa Hoằng Pháp do Cố Đại Lão Hòa Thượng Ngộ Chân Tử khai sơn năm 1957 tại huyện Hóc Môn, TP.HCM. Nơi đây là chiếc nôi tâm linh truyền thừa Tông phong Hoằng Pháp, khởi xướng các khóa tu Phật thất hàng vạn người và ươm mầm Bồ Đề tâm cho biết bao thế hệ Tăng Ni, Phật tử.',
    linkUrl: 'https://chuahoangphap.com.vn',
  },
  {
    keyword: 'Tâm Sư Ông',
    title: 'TÂM SƯ ÔNG HOẰNG PHÁP (HT. THÍCH CHÂN TÍNH)',
    subtitle: 'ĐẠI SƯ THANH LƯƠNG — TÂM TỪ BI RỘNG LỚN NHƯ BIỂN CẢ BAO LA',
    imageUrl: '/images/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-bai-tho-doi-thay-thumbnail-herobanner.jpg',
    description: '"Tâm Sư Ông" là tấm lòng bao dung, đức hạnh khiêm từ và hạnh nguyện độ sinh cao cả của Hòa Thượng Thích Chân Tính — Viện chủ Tổ đình Hoằng Pháp, Bổn sư của Thượng tọa Thích Tâm Hòa. Người suốt đời giản dị, đem nguồn ánh sáng Chánh pháp soi rọi khắp muôn phương.',
    linkUrl: '/gioi-thieu/su-ong-hoang-phap',
  },
  {
    keyword: 'Nhị Nghiêm uy linh tháp',
    title: 'BẢO THÁP NHỊ NGHIÊM UY LINH',
    subtitle: 'NƠI LƯU GIỮ NHỤC THÂN VÀ LINH CỐT SƯ TỔ KHAI SƠN NGỘ CHÂN TỬ',
    imageUrl: '/images/tong-chi/tong-chi-tu-hoc-tong-phong-hoang-phap-mien-nam-chon-to-thap-to-nhi-nghiem-popup.jpg',
    description: 'Bảo tháp Nhị Nghiêm tọa lạc trang nghiêm trong khuôn viên Tổ Đình Hoằng Pháp (Hóc Môn, TP.HCM), là nơi phụng thờ di cốt và ngàn thu lưu dấu công đức khai sáng của Sư Tổ Ngộ Chân Tử, nơi hàng triệu con tim hậu học hướng về đảnh lễ tri ân.',
    linkUrl: '/gioi-thieu/tieu-su-su-to',
  },
  {
    keyword: 'Ngộ Chân Tử',
    title: 'CỐ ĐẠI LÃO HÒA THƯỢNG NGỘ CHÂN TỬ (1901 – 1988)',
    subtitle: 'BẬC CAO TĂNG KHAI SƠN CHÙA HOẰNG PHÁP VÀ VIỆN DỤC ANH',
    imageUrl: '/images/tong-chi/su-to-ngo-chan-tu.jpg',
    description: 'Đại Lão Hòa Thượng Thích Ngộ Chân Tử là bậc tiền bối khai sáng Chùa Hoằng Pháp năm 1957. Cả một đời Người tận tụy vì đạo pháp và nhân sinh, mở Viện Dục Anh nuôi dạy cô nhi, truyền bá giáo lý Tịnh Độ và dựng xây nền móng vững chắc cho Tông phong hoằng hóa.',
    linkUrl: '/gioi-thieu/tieu-su-su-to',
  },
  {
    keyword: 'chốn Định Thành',
    title: 'CHÙA ĐỊNH THÀNH (QUẬN 10, TP.HCM)',
    subtitle: 'TỔ ĐÌNH ĐỊNH THÀNH — NƠI TRỤ TRÌ CỦA TRƯỞNG LÃO HT. THÍCH LỆ TRANG',
    imageUrl: '/images/tong-chi/chua-dinh-thanh-ht-le-trang.jpg',
    description: 'Chùa Định Thành là ngôi già lam thanh tịnh tọa lạc tại Quận 10 (TP.HCM), do Cố HT. Thích Nhật Thiện khai sơn, nay do Trưởng lão Hòa Thượng Thích Lệ Trang (Trưởng BTS GHPGVN TP.HCM, bậc Tông sư tinh thông nghi lễ Phật giáo miền Nam) trụ trì. Ngôi chùa lặng lẽ giữa phố phường, là nơi nương tựa tu học và giữ gìn nếp sống giới luật thiền gia mẫu mực.',
    linkUrl: '/gioi-thieu/lich-su-tung-lam-hoa-phuc',
  },
  {
    keyword: 'Luật viện và chùa Huê Nghiêm',
    title: 'CHÙA HUỆ NGHIÊM & LUẬT VIỆN HUỆ NGHIÊM',
    subtitle: 'TRUNG TÂM PHẬT HỌC VIỆN VÀ TRUYỀN DẠY GIỚI LUẬT UY NGHIÊM',
    imageUrl: '/images/tong-chi/chua-hue-nghiem-luat-vien.jpg',
    description: 'Chùa Huệ Nghiêm (Bình Tân, TP.HCM) là một trong những trung tâm Phật học viện danh tiếng lâu đời nhất miền Nam, nơi đào tạo bao thế hệ danh Tăng thạc đức. Dưới sự lãnh đạo của Trưởng lão HT. Thích Minh Thông, Giới Đài Viện Huệ Nghiêm là nơi chuyên sâu nghiên cứu, hành trì và trùng tuyên Luật tạng Tỳ-kheo.',
    linkUrl: '/tri-tue-phat-phap',
  },
  {
    keyword: 'Chùa Huệ Nghiêm',
    title: 'CHÙA HUỆ NGHIÊM — GIỚI ĐÀI VIỆN HUỆ NGHIÊM',
    subtitle: 'NƠI DƯỠNG NUÔI BAO THẾ HỆ TĂNG TÀI CỦA PHẬT GIÁO VIỆT NAM',
    imageUrl: '/images/tong-chi/chua-hue-nghiem-luat-vien.jpg',
    description: 'Phật học viện Huệ Nghiêm năm xưa thắp sáng ngọn đuốc soi nhân thế, là chiếc nôi đào tạo Tăng tài uy tín bậc nhất, nơi các bậc hành giả quay về trau dồi Giới – Định – Tuệ.',
    linkUrl: '/tri-tue-phat-phap',
  },
  {
    keyword: 'Sư hiệu thượng Minh hạ Thông',
    title: 'TRƯỞNG LÃO HÒA THƯỢNG THÍCH MINH THÔNG',
    subtitle: 'BẬC CAO ĐỨC TUYÊN TRUYỀN GIỚI LUẬT — BÓNG LÃO TÙNG NƠI GIỚI ĐÀI VIỆN',
    imageUrl: '/images/tong-chi/chua-hue-nghiem-luat-vien.jpg',
    description: 'Trưởng lão Hòa Thượng Thích Minh Thông (Viện chủ Chùa Huệ Nghiêm) là bậc danh sư đức cao vọng trọng, cả cuộc đời cống hiến cho sự nghiệp hoằng dương Giới luật Phật giáo. Dù tuổi đã quá thất tuần, Hòa Thượng vẫn dõng dạc khuyên nhắc hậu học gìn giữ giới luật: "Đạo pháp muốn trường tồn, đừng đánh mất Giới châu nơi tự tánh".',
    linkUrl: '/gioi-thieu/su-phu-tru-tri',
  },
  {
    keyword: 'Tuyên Luật Sư Thích Minh Thông',
    title: 'TUYÊN LUẬT SƯ THÍCH MINH THÔNG',
    subtitle: 'BẬC ĐỆ NHẤT TUYÊN LUẬT SƯ CỦA PHẬT GIÁO VIỆT NAM ĐƯƠNG ĐẠI',
    imageUrl: '/images/tong-chi/chua-hue-nghiem-luat-vien.jpg',
    description: 'Bậc Tuyên Luật Sư đăng đàn truyền trao Giới pháp tại hầu hết các Đại Giới Đàn lớn trên cả nước. Người là bậc thạch trụ thiền gia, biểu tượng của sự tinh nghiêm giới luật và trí tuệ giải thoát nhiệm màu.',
    linkUrl: '/gioi-thieu/su-phu-tru-tri',
  },
];

// Update item index 2 (id: 3)
const targetIndex = articles.findIndex((a) => a.id === 3 || a.slug === 'mien-nam-chon-to');
if (targetIndex !== -1) {
  articles[targetIndex].content = cleanPoem;
  articles[targetIndex].author = 'Sa Môn Vô Trí (Thích Tâm Hòa)';
  articles[targetIndex].authorLink = '/gioi-thieu/su-phu-tru-tri';
  articles[targetIndex].keywords = mienNamKeywords;
  articles[targetIndex].sourceBook = {
    bookTitle: 'Đi Qua Khổ Vui Cuộc Đời',
    author: 'Sa Môn Vô Trí (hiệu Tâm Hòa)',
    coverImage: '/images/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup-sach-dqkvcd.jpg',
    description: 'Ký ức đúc kết hành trình tu tập và tri ân chốn Tổ Hoằng Pháp.',
    linkUrl: '/tri-tue-phat-phap/di-qua-kho-vui-cuoc-doi',
  };
}

fs.writeFileSync(dataPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Successfully updated Mien Nam Chon To keywords and content in tong-chi-data.json!');
