export interface AnTrieuNguyenItem {
  id: string;
  codeNumber: string; // "ẤN 01", "ẤN 02",...
  title: string;
  timePeriod: string;
  yearNumber: number; // Phục vụ sắp xếp tăng dần
  material: string;
  areaId: string;
  areaSlug: string;
  areaName: string;
  meaning: string;
  source: string;
  fullHistoryHtml: string;
  imgUrl: string;
  categoryType: 'NTPG';
}

export const AN_TRIEU_NGUYEN_LIST: AnTrieuNguyenItem[] = [
  {
    id: "AN_01",
    codeNumber: "ẤN 01",
    title: "SẮC CHÍNH VẠN DÂN CHI BẢO",
    timePeriod: "TRIỀU VUA GIA LONG THỨ 1 (1802)",
    yearNumber: 1802,
    material: "Đồng mạ vàng / Bạc phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Khẳng định vạn dân quy phục, nền độc lập chính thống và quyền uy tối thượng của triều đại mới thiết lập trật tự thái bình.",
    source: "Đại Nam Thực Lục - Quốc Sử Quán Triều Nguyễn",
    fullHistoryHtml: "Được đúc vào năm Gia Long thứ nhất (1802) ngay sau khi vua Gia Long lên ngôi thống nhất đất nước. Ấn dùng để đóng trên các văn bản ban bố cho toàn thể nhân dân, biểu thị quyền lực ban phước lành và thiết lập kỷ cương bờ cõi.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_01_sac_chinh_van_dan.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_02",
    codeNumber: "ẤN 02",
    title: "QUỐC GIA TÍN BẢO",
    timePeriod: "TRIỀU VUA GIA LONG (1802)",
    yearNumber: 1802,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Biểu tượng tín nhiệm quốc gia, nền tảng uy tín đối ngoại và bảo chứng giao đàm trọng đại.",
    source: "Nghiên cứu Di sản Văn hóa Hoàng thành Thăng Long",
    fullHistoryHtml: "Chưởng ấn triệu giao ngoại giao và đối nội, đóng trên các văn kiện chiêu an, chiếu dụ bang giao ngoại quốc, khẳng định vị thế và uy tín chính trị của triều đình Đại Nam.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_02_quoc_gia_tin_bao.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_03",
    codeNumber: "ẤN 03",
    title: "THẾ TỔ CAO HOÀNG ĐẾ CHI BẢO",
    timePeriod: "TRIỀU VUA GIA LONG (1802)",
    yearNumber: 1802,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Biểu tượng lòng hiếu kính tổ tiên, uống nước nhớ nguồn và ghi nhớ công ơn khai quốc.",
    source: "Nguyễn Phúc Tộc Thế Phả",
    fullHistoryHtml: "Ấn tôn miếu cúng tế, dùng trong các nghi lễ Thái Miếu để tưởng nhớ Thế Tổ Cao Hoàng Đế (Gia Long), dâng lời cầu nguyện quốc thái dân an lên tiên tổ.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_03_the_to_cao_hoang_de.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_04",
    codeNumber: "ẤN 04",
    title: "CHẾ CÁO CHI BẢO",
    timePeriod: "TRIỀU VUA GIA LONG (1802 - 1819)",
    yearNumber: 1802,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Khai truyền mệnh lệnh hoàng gia, ghi nhận công ơn thần dân và thiết lập điển lễ quốc gia.",
    source: "Khâm Định Đại Nam Hội Điển Sự Lệ",
    fullHistoryHtml: "Đúc dưới thời vua Gia Long, chuyên dùng để đóng lên các bản Chế và Cáo ban thưởng cho thân nhân quan lại hoặc bách tính có công.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_04_che_cao_chi_bao.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_05",
    codeNumber: "ẤN 05",
    title: "MỆNH ĐỨC CHI BẢO",
    timePeriod: "TRIỀU VUA GIA LONG (1802 - 1819)",
    yearNumber: 1802,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Tôn vinh đức độ hiền tài, khuyến đức vi tiên, lấy lòng từ bi và đạo đức làm gốc trị quốc.",
    source: "Bảo vật Quốc gia Triều Nguyễn - BTLT Quốc gia",
    fullHistoryHtml: "Ấn chương biểu thị ý chỉ ban thưởng đức hiền, tuyên dương những bậc hủ nho, nghĩa sĩ và nhân dân phụng sự đạo đức.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_05_menh_duc_chi_bao.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_06",
    codeNumber: "ẤN 06",
    title: "SẮC MỆNH CHI BẢO",
    timePeriod: "NĂM MINH MỆNH THỨ 8 (T8/1827)",
    yearNumber: 1827,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Khẳng định Sắc mệnh thiêng liêng, bảo chứng uy quyền thần thánh ban chức sắc và gia phong thiên hạ.",
    source: "Bảo vật Quốc gia Việt Nam - Quyết định Thủ tướng Chính phủ",
    fullHistoryHtml: "Được đúc vào tháng 8 năm Minh Mệnh thứ 8 (1827). Đây là chiếc ấn chuyên dùng đóng lên các Sắc phong ban cho Tướng lĩnh, Quan lại và Sắc phong Thần linh.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_06_sac_menh_chi_bao.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_07",
    codeNumber: "ẤN 07",
    title: "TRỊ LỊCH MINH THỜI CHI BẢO",
    timePeriod: "NĂM MINH MỆNH THỨ 8 (1827)",
    yearNumber: 1827,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Trật tự thời gian và thiên nhiên, thuận theo lẽ trời đất để điều hòa vạn vật.",
    source: "Khâm Định Đại Nam Hội Điển Sự Lệ",
    fullHistoryHtml: "Chuyên dùng đóng trên các bản Lịch pháp do Khâm Thiên Giám biên soạn hàng năm, biểu thị quyền định đoạt thời tiết thuận theo thiên đạo.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_07_tri_lich_minh_thoi.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_08",
    codeNumber: "ẤN 08",
    title: "HOÀNG ĐẾ TÔN THÂN CHI BẢO",
    timePeriod: "NĂM MINH MỆNH THỨ 8 (1827)",
    yearNumber: 1827,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Tình nghĩa hoàng tộc, giữ gìn gia phong và gia hòa vạn sự hưng.",
    source: "Đại Nam Thực Lục Chính Biên",
    fullHistoryHtml: "Ấn chuyên dùng trong Tôn Nhơn Phủ và các văn bản Vua ban cho người trong hoàng tộc (Tôn thất), thể hiện sự tôn kính hiếu nghĩa.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_08_hoang_de_ton_than.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_09",
    codeNumber: "ẤN 09",
    title: "THÁNH TỔ NHÂN HOÀNG ĐẾ CHI BẢO",
    timePeriod: "TRIỀU VUA THIỆU TRỊ (1841)",
    yearNumber: 1841,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Tôn vinh trí tuệ và lòng nhân từ của vua Minh Mệnh, tiếp nối sự nghiệp minh trị.",
    source: "Đại Nam Liệt Truyện",
    fullHistoryHtml: "Do vua Thiệu Trị cho đúc ngay sau khi nối ngôi năm 1841 để dâng miếu hiệu và thụy hiệu cho vua cha Minh Mệnh (Thánh Tổ Nhân Hoàng Đế).",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_09_thanh_to_nhan_hoang_de.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_10",
    codeNumber: "ẤN 10",
    title: "ĐẠI NAM HIỆP KỶ LỊCH CHI BẢO",
    timePeriod: "NĂM THIỆU TRỊ THỨ 7 (1847)",
    yearNumber: 1847,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Sự hòa hợp giữa thiên thời - địa lợi - nhân hòa, cầu mong mùa màng bội thu, mưa thuận gió hòa.",
    source: "Minh Mệnh Khâm Định Hiệp Kỷ Lịch",
    fullHistoryHtml: "Đúc vào năm Thiệu Trị thứ 7 (1847). Dùng riêng đóng lên trang đầu của quyển Lịch Hiệp Kỷ do triều đình ban hành hàng năm.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_10_dai_nam_hiep_ky_lich.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_11",
    codeNumber: "ẤN 11",
    title: "DỰC TÔNG ANH HOÀNG ĐẾ CHI BẢO",
    timePeriod: "NĂM TỰ ĐỨC THỨ 36 (1883)",
    yearNumber: 1883,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Tôn vinh vị vua chí hiếu, giỏi văn thơ và có nhiều đóng góp cho nền học thuật nước nhà.",
    source: "Nghiên cứu Kim Báu Triều Nguyễn",
    fullHistoryHtml: "Ấn miếu hiệu của vua Tự Đức (Dực Tông Anh Hoàng Đế), được đúc năm 1883 sau khi Ngài băng hà để phụng thờ trong Thế Miếu.",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_11_duc_tong_anh_hoang_de.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_12",
    codeNumber: "ẤN 12",
    title: "CẢNH TÔNG THUẦN HOÀNG ĐẾ",
    timePeriod: "NĂM THÀNH THÁI THỨ 1 (1889)",
    yearNumber: 1889,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Kính nhớ Thần phụ Đồng Khánh, khẳng định tinh thần canh tân văn hóa và tiếp nối truyền thống.",
    source: "Đại Nam Thực Lục - Đệ Lục Kỷ Dụ Mệnh",
    fullHistoryHtml: "Đúc vào năm Thành Thái thứ nhất (1889) để dâng miếu hiệu cho vua cha Đồng Khánh (Cảnh Tông Thuần Hoàng Đế).",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_12_canh_tong_thuan_hoang_de.webp",
    categoryType: "NTPG"
  },
  {
    id: "AN_13",
    codeNumber: "ẤN 13",
    title: "HOÀNG TÔNG TUYÊN HOÀNG ĐẾ",
    timePeriod: "NĂM KHẢI ĐỊNH THỨ 10 (1925)",
    yearNumber: 1925,
    material: "Đồng mạ vàng phỏng cổ",
    areaId: "NHA_MAU",
    areaSlug: "nha-mau",
    areaName: "ĐẠI NAM QUỐC MẪU",
    meaning: "Ghi dấu giai đoạn giao thoa văn hóa Đông - Tây, tôn vinh công đức triều vua Khải Định.",
    source: "Bảo vật Kim Ấn Triều Nguyễn - BTLT Quốc Gia",
    fullHistoryHtml: "Được đúc vào năm Khải Định thứ 10 (1925) để dâng thụy hiệu và miếu hiệu cho vua Khải Định (Hoàng Tông Tuyên Hoàng Đế).",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/linh_vat_phat_giao/cac_an_rong_trieu_dai_nha_nguyen_viet_nam/AN_13_hoang_tong_tuyen_hoang_de.webp",
    categoryType: "NTPG"
  }
];
