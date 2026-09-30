import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve('src/data/tong-chi-data.json');
const currentArticles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Dữ liệu hình ảnh S3 chất lượng cao
const DEFAULT_IMG = {
  hoangPhap: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-hoang-phap-chu-thich-popup.webp',
  suTo: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup.webp',
  suOng: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-bai-tho-doi-thay-thumbnail-herobanner.webp',
  kienAn: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/su-to-ngo-chan-tu.webp',
  phoChieu: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/chua-pho-chieu-hai-phong.webp',
  datBac: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/su-to-tham-gio-hoc-cac-em-vien-duc-anh.webp',
  troiNam: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-hoang-phap-chu-thich-popup.webp',
  thapNhiNghiem: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-hoang-phap-mien-nam-chon-to-thap-to-nhi-nghiem-popup.webp',
  dinhThanh: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/chua-dinh-thanh-ht-le-trang.webp',
  hueNghiem: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/chua-hue-nghiem-luat-vien.webp',
  boDeTam: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.webp',
  tamQuy: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-nen-tang-tu-hoc-tam-quy-ngu-gioi-hero-banner-thumnail.webp',
  thapThien: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-nen-tang-tu-hoc-thap-thien-thumbnail-herobanner.webp',
  boTatHanh: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-tat-hanh-luc-do-van-hanh-banner-thumbnail.webp',
  sachDQKVCD: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup-sach-dqkvcd.webp',
  niemPhat: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/niem-phat.webp',
  tungKinh: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tung-kinh.webp',
  thienTap: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/thien-toa.webp',
  layPhat: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp',
  samHoi: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp',
  boThi: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/bo-thi-cung-duong.webp',
  loTrinh: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/lo-trinh-danh-cho-nguoi-moi-bat-dau.webp',
  vanHoa: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/van-hoa-ung-xu-giao-tiep-tai-chua.webp',
  tungLam: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tung-lam-hoa-phuc.webp',
};

// 1. TIẾP BƯỚC THẦY TÔI
const article1 = currentArticles.find(a => a.id === 1);
if (article1) {
  article1.content = `<b>Hoằng Pháp</b> - <b>Kiến An</b> mãi nhớ <b>Thầy</b>
<b>Hải Phòng - Phổ Chiếu</b> vẫn còn đây
Người đi năm tháng chưa phai dấu
<b>Chánh pháp</b> hoằng truyền khắp đông tây
<b>Đất bắc</b> mở mang dòng bất tử
<b>Trời nam</b> kết tụ giới hương bay
Dáng xưa vững chãi như tùng bách
<b>Cháu con</b> tiếp bước đẹp tháng ngày.`;

  article1.keywords = [
    {
      keyword: 'Hoằng Pháp',
      title: 'TỔ ĐÌNH HOẰNG PHÁP (HÓC MÔN)',
      subtitle: 'CÁI NÔI HOẰNG PHÁP LỢI SINH',
      imageUrl: DEFAULT_IMG.hoangPhap,
      description: 'Chùa Hoằng Pháp do Đại lão Hòa thượng Ngộ Chân Tử khai sơn năm 1957 tại huyện Hóc Môn, TP. Hồ Chí Minh. Đây là trung tâm tu học Tịnh Độ và hoằng dương chánh pháp quy mô lớn hàng đầu cả nước.',
      linkUrl: 'https://chuahoangphap.com.vn'
    },
    {
      keyword: 'Kiến An',
      title: 'KIẾN AN – NƠI KHỞI DỰNG CHÙA HOẰNG PHÁP ĐẦU TIÊN & VIỆN DỤC ANH',
      subtitle: 'DẤU ẤN HOẰNG TRUYỀN & BỒ TÁT HẠNH (1935 - 1938)',
      imageUrl: DEFAULT_IMG.kienAn,
      description: 'Năm 1935, Sư Tổ Ngộ Chân Tử mua đất tại Kiến An sáng lập ngôi chùa Hoằng Pháp đầu tiên để độ chúng tu hành. Năm 1938, ngài thành lập Viện Dục Anh tại Kiến An nhằm cưu mang, nuôi dạy hàng trăm trẻ em mồ côi ăn học thành tài và mở xưởng thủ công giúp dân nghèo mưu sinh.',
      linkUrl: '/gioi-thieu/tieu-su-su-to'
    },
    {
      keyword: 'Thầy',
      title: 'ĐẠI LÃO HÒA THƯỢNG NGỘ CHÂN TỬ (1901 - 1988)',
      subtitle: 'SƯ TỔ KHAI SƠN TÔNG PHONG HOẰNG PHÁP',
      imageUrl: DEFAULT_IMG.suTo,
      description: 'Bậc cao tăng thạc đức trọn đời "xả phú cầu bần, xả thân cầu đạo". Ngài đắc pháp với cụ Tổ chùa Bà Đá (Hà Nội), khai sáng Tông phong Hoằng Pháp, lập Viện Dục Anh nuôi dạy cô nhi và cống hiến trọn vẹn cho Đạo pháp và Dân tộc.',
      linkUrl: '/gioi-thieu/tieu-su-su-to'
    },
    {
      keyword: 'Hải Phòng - Phổ Chiếu',
      title: 'CHÙA PHỔ CHIẾU & VIỆN DƯỠNG LÃO (HẢI PHÒNG)',
      subtitle: 'TÙNG LÂM TU VIỆN & NƠI CƯU MANG CÁC CỤ GIÀ NEO ĐƠN (1953)',
      imageUrl: DEFAULT_IMG.phoChieu,
      description: 'Năm 1953, Sư Tổ Ngộ Chân Tử kiến lập Tùng Lâm Tu Viện Chùa Phổ Chiếu tại Dư Hàng Kênh, Hải Phòng và thành lập Viện Dưỡng Lão để phụng dưỡng, chăm sóc các cụ già không nơi nương tựa, tạo duyên lành cho mọi người tu niệm niệm Phật.',
      linkUrl: '/gioi-thieu/tieu-su-su-to'
    },
    {
      keyword: 'Phổ Chiếu',
      title: 'CHÙA PHỔ CHIẾU & VIỆN DƯỠNG LÃO (HẢI PHÒNG)',
      subtitle: 'TÙNG LÂM TU VIỆN & NƠI CƯU MANG CÁC CỤ GIÀ NEO ĐƠN (1953)',
      imageUrl: DEFAULT_IMG.phoChieu,
      description: 'Năm 1953, Sư Tổ Ngộ Chân Tử kiến lập Tùng Lâm Tu Viện Chùa Phổ Chiếu tại Dư Hàng Kênh, Hải Phòng và thành lập Viện Dưỡng Lão để phụng dưỡng, chăm sóc các cụ già không nơi nương tựa, tạo duyên lành cho mọi người tu niệm niệm Phật.',
      linkUrl: '/gioi-thieu/tieu-su-su-to'
    },
    {
      keyword: 'Chánh pháp',
      title: 'CHÁNH PHÁP NHƯ LAI',
      subtitle: 'NGỌN ĐUỐC TRÍ TUỆ SOI SÁNG NHÂN GIAN',
      imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp',
      description: 'Chánh pháp là giáo lý giác ngộ chân thật của Đức Phật Thích Ca Mâu Ni, đưa muôn loài vượt thoát khổ đau, được các bậc Tổ sư đời đời kế thừa và hoằng truyền khắp muôn phương.',
      linkUrl: '/tri-tue-phat-phap'
    },
    {
      keyword: 'Đất bắc',
      title: 'ĐẤT BẮC – NƠI SINH TRƯỞNG, TẦM ĐẠO & CỨU TẾ ĐỒNG BÀO',
      subtitle: 'HÀNH TRÌNH VÂN DU DANH LAM & DẤU ẤN ĐẠI TỪ BI (1901 - 1955)',
      imageUrl: DEFAULT_IMG.datBac,
      description: 'Đất Bắc (Thái Bình, Hà Nội, Hải Phòng, Hải Dương) là quê hương sinh trưởng, xuất gia đắc pháp và tu học của Sư Tổ. Ngài đã trùng tu hàng loạt danh lam cổ tự (Yên Tử, Côn Sơn, Hương Tích, Bà Đá...). Trong nạn đói năm 1945, ngài trực tiếp mai táng và cứu tế hàng vạn đồng bào qua cơn nguy khốn.',
      linkUrl: '/gioi-thieu/tieu-su-su-to'
    },
    {
      keyword: 'Trời nam',
      title: 'TRỜI NAM – NƠI KHAI SƠN TỔ ĐÌNH HOẰNG PHÁP & VIÊN TỊCH',
      subtitle: 'TIẾP ĐỘ CHÚNG TĂNG, CỨU TRỢ CHIẾN TRANH & AN NHIÊN THỊ TỊCH (1957 - 1988)',
      imageUrl: DEFAULT_IMG.troiNam,
      description: 'Năm 1957, Sư Tổ vào Nam khai sơn Chùa Hoằng Pháp tại Hóc Môn. Tại đây ngài cưu mang 60 gia đình tị nạn chiến tranh, lập Viện Dục Anh nuôi 355 cô nhi, ấn tống kinh sách và an nhiên thị tịch năm 1988.',
      linkUrl: '/gioi-thieu/tieu-su-su-to'
    },
    {
      keyword: 'Cháu con',
      title: 'HÀNG HẬU HỌC & CÁC TỰ VIỆN TÔNG PHONG HOẰNG PHÁP',
      subtitle: 'TIẾP NỐI MẠNG MẠCH – HƠN 40 CHI NHÁNH TỰ VIỆN BẮC TRUNG NAM',
      imageUrl: DEFAULT_IMG.tungLam,
      description: 'Hàng hậu học noi gương sáng Sư Tổ Ngộ Chân Tử và Hòa Thượng Thích Chân Tính, hiện diện khắp ba miền với hơn 40 chi nhánh tự viện tiêu biểu: Chùa Hòa Phúc (Hà Nội - Thầy Thích Tâm Hòa), Tổ đình Hoằng Pháp (TP.HCM - Thầy Thích Tâm Trường), Chùa Diên Quang (Bắc Ninh), Chùa Cổ Am & Phúc Lạc (Nghệ An), Chùa Giai Lam (Hà Tĩnh), Chùa Hưng Pháp (Đồng Nai), Chùa Tiêu Dao (Quảng Ninh), Chùa Tây Khánh (Thái Bình)...',
      linkUrl: 'https://chuahoangphap.com.vn'
    }
  ];

  article1.sourceBook = [
    {
      bookTitle: 'Đóa Sen Khắc Vách Núi',
      author: 'Vô Trí - Tâm Hòa',
      coverImage: DEFAULT_IMG.sachDQKVCD,
      description: 'Tác phẩm văn học Phật giáo khắc họa hành trình xây dựng Tùng Lâm Hòa Phúc và tiếp nối tông phong của Thầy Tổ.',
      linkUrl: '/tri-tue-phat-phap'
    }
  ];
}

fs.writeFileSync(DATA_FILE, JSON.stringify(currentArticles, null, 2), 'utf8');
console.log('✅ Synchronized all exact Sư Tổ Ngộ Chân Tử annotations into tong-chi-data.json');
