import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/tong-chi-data.json', 'utf8'));

// Article 0 (Tiếp Bước Thầy Tôi)
data[0].content = `<b>Hoằng Pháp</b> - <b>Kiến An</b> mãi nhớ <b>Thầy</b>
<b>Hải Phòng - Phổ Chiếu</b> vẫn còn đây
Người đi năm tháng chưa phai dấu
<b>Chánh pháp</b> hoằng truyền khắp đông tây
<b>Đất bắc</b> mở mang dòng bất tử
<b>Trời nam</b> kết tụ giới hương bay
Dáng xưa vững chãi như tùng bách
<b>Cháu con</b> tiếp bước đẹp tháng ngày.`;

data[0].bannerImage = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-banner-thumnail.webp';

data[0].keywords = [
  {
    keyword: 'Hoằng Pháp',
    title: 'Tổ Đình Hoằng Pháp (Hóc Môn, TP.HCM)',
    subtitle: 'Chốn Tổ Tông Phong Hoằng Pháp',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-hoang-phap-chu-thich-popup.webp',
    description: 'Ngôi tổ đình danh tiếng do Cố Đại Lão Hòa Thượng Ngộ Chân Tử khai sơn, nơi phát tích phong trào Phật hóa gia đình và các khóa tu Phật thất quy tụ hàng vạn Phật tử khắp mọi miền.',
    linkUrl: '/gioi-thieu/su-ong-hoang-phap'
  },
  {
    keyword: 'Kiến An',
    title: 'Chùa Kiến An (Kiến An, Hải Phòng)',
    subtitle: 'Dấu ấn hoằng hóa ban đầu của Sư Tổ',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/su-to-ngo-chan-tu.webp',
    description: 'Nơi gắn liền với những năm tháng tu hành và hoằng hóa ban đầu của Sư Tổ Thích Ngộ Chân Tử tại miền Bắc trước khi người du hóa phương Nam lập chùa Hoằng Pháp.',
    linkUrl: '/gioi-thieu/tieu-su-su-to'
  },
  {
    keyword: 'Thầy',
    title: 'Ân Sư - Hòa Thượng Tôn Sư',
    subtitle: 'Bậc Ân Sư Khai Tâm Chỉ Đạo',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup.webp',
    description: 'Hình tượng bậc Ân Sư khả kính, người Thầy đã truyền trao giới thân huệ mạng, soi sáng con đường chánh pháp và khai mở tuệ giác cho hàng đệ tử tông môn.',
    linkUrl: '/gioi-thieu/su-phu-tru-tri'
  },
  {
    keyword: 'Hải Phòng - Phổ Chiếu',
    title: 'Chùa Phổ Chiếu (Dư Hàng Kênh, Lê Chân, Hải Phòng)',
    subtitle: 'Chốn Tổ Thiêng Liêng Đất Cảng',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/chua-pho-chieu-hai-phong.webp',
    description: 'Ngôi già lam lịch sử nơi in đậm dấu chân hành đạo, đức độ tu trì và tấm lòng từ bi vô lượng của Đức Sư Tổ Thích Ngộ Chân Tử khai sáng hạt giống Bồ Đề đất Bắc.',
    linkUrl: '/gioi-thieu/tieu-su-su-to'
  },
  {
    keyword: 'Phổ Chiếu',
    title: 'Chùa Phổ Chiếu (Hải Phòng)',
    subtitle: 'Chốn Tổ Già Lam Lịch Sử',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/chua-pho-chieu-hai-phong.webp',
    description: 'Ngôi chùa cổ kính nơi in đậm dấu chân hành đạo, đức độ tu trì và tấm lòng từ bi vô lượng của bậc tiền bối khai sơn.',
    linkUrl: '/gioi-thieu/tieu-su-su-to'
  },
  {
    keyword: 'Chánh pháp',
    title: 'Chánh Pháp (Saddharma)',
    subtitle: 'Chân lý giải thoát tối thượng của Đức Phật',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp',
    description: 'Lời dạy chân thật, bất biến của Đức Thế Tôn dẫn dắt chúng sinh thoát khỏi khổ đau, thành tựu an lạc và giải thoát viên mãn.',
    linkUrl: '/tri-tue-phat-phap'
  },
  {
    keyword: 'Đất bắc',
    title: 'Phật Giáo Miền Bắc & Tùng Lâm Hòa Phúc',
    subtitle: 'Hành Trình Mở Mang Mạng Mạch Phật Pháp',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tung-lam-hoa-phuc.webp',
    description: 'Vùng đất văn hiến cội nguồn dân tộc, nơi Tùng Lâm Hòa Phúc phụng sự và kế thừa mạng mạch Phật giáo Trúc Lâm Yên Tử cùng tông phong Hoằng Pháp rạng rỡ.',
    linkUrl: '/gioi-thieu/lich-su-tung-lam-hoa-phuc'
  },
  {
    keyword: 'Trời nam',
    title: 'Tổ Đình Hoằng Pháp Phương Nam',
    subtitle: 'Cái Nôi Hoằng Dương Chánh Pháp',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-hoang-phap-chu-thich-popup.webp',
    description: 'Phương Nam nắng ấm nơi Tổ đình Hoằng Pháp phát tích, kết tụ giới đức thanh tịnh và lan tỏa hương thơm giới luật đến khắp muôn phương.',
    linkUrl: '/gioi-thieu/su-ong-hoang-phap'
  },
  {
    keyword: 'Cháu con',
    title: 'Hậu Học Đệ Tử Tùng Lâm Hòa Phúc',
    subtitle: 'Kế Thừa & Tiếp Nối Sự Nghiệp Hoằng Pháp',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup.webp',
    description: 'Hàng đệ tử xuất gia và tại gia nguyện một lòng khắc ghi lời Thầy dạy, giữ vững giới hạnh, tinh tấn tu học và phụng sự chánh pháp muôn đời.',
    linkUrl: '/gioi-thieu/su-phu-tru-tri'
  },
  {
    keyword: 'Tùng Lâm Hòa Phúc',
    title: 'Chùa Hòa Phúc (Quốc Oai, Hà Nội)',
    subtitle: 'Tùng Lâm Hoằng Pháp Miền Bắc',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tung-lam-hoa-phuc.webp',
    description: 'Chốn tổ già lam linh thiêng tại thôn Hòa Trúc, xã Hòa Thạch, huyện Quốc Oai, Hà Nội. Nơi tiếp nối tông phong Hoằng Pháp, xiển dương chánh pháp và hướng dẫn hàng vạn thiện nam tín nữ tu học.',
    linkUrl: '/gioi-thieu/lich-su-tung-lam-hoa-phuc'
  }
];

data[0].sourceBook = [
  {
    bookTitle: 'Đóa Sen Khắc Vách Núi',
    author: 'Vô Trí - Tâm Hòa',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-thay-chu-thich-popup-sach-dqkvcd.webp',
    description: 'Tác phẩm văn học Phật giáo khắc họa hành trình xây dựng Tùng Lâm Hòa Phúc và tiếp nối tông phong của Thầy Tổ.',
    linkUrl: '/tri-tue-phat-phap'
  }
];

// Ensure all other articles have valid S3 image fallback if needed
data.forEach((art, idx) => {
  if (idx > 0 && art.keywords) {
    art.keywords.forEach((k) => {
      if (k.imageUrl && k.imageUrl.startsWith('/images/')) {
        k.imageUrl = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/tong-chi/tong-chi-tu-hoc-banner.webp';
      }
    });
  }
});

fs.writeFileSync('src/data/tong-chi-data.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated tong-chi-data.json with live S3 image URLs');
