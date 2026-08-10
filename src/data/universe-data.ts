export interface UniverseArea {
  id: string;
  pinNumber: number;
  slug: string;
  name: string;
  subtitle: string;
  temple: "tung-lam-hoa-phuc" | "quynh-nhai-cam-lo-tu";
  templeName: string;
  imgUrl: string;
  mapPos: { x: number; y: number };
  description: string;
  fullContent?: string;
  statues: Array<{
    name: string;
    imgUrl: string;
    quote?: string;
    group?: string;
    cluster?: string;
    type?: string;
  }>;
  stories: Array<{
    title: string;
    imgUrl: string;
    summary: string;
  }>;
}

export interface SutraChapter {
  id: string;
  title: string;
  chapterNumber: number;
  content: string[];
}

export interface MemorialRecord {
  id: string;
  code: string;
  fullName: string;
  dharmaName: string;
  birthYear: string;
  deathYear: string;
  hometown: string;
  positionSlot: string;
  registeredBy: string;
  dateSent: string;
}

export const UNIVERSE_AREAS: UniverseArea[] = [
  {
    id: "1",
    pinNumber: 1,
    slug: "tam-bao",
    name: "TAM BẢO",
    subtitle: "ĐẠI HÙNG BẢO ĐIỆN",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1100&h=600&fit=crop",
    mapPos: { x: 58, y: 52 },
    description: "Trung tâm tâm linh của toàn Chùa, được xây dựng theo lối kiến trúc truyền thống chữ CÔNG (工), hội tụ tinh hoa Phật giáo 3 miền Bắc - Trung - Nam. Nơi đại chúng trang nghiêm lễ bái cúng dường, mang nhiều ý nghĩa biểu tượng sâu sắc.",
    fullContent: "Trung tâm tâm linh của toàn Chùa, được xây dựng theo lối kiến trúc truyền thống chữ CÔNG (工), hội tụ tinh hoa Phật giáo 3 miền Bắc - Trung - Nam. Nơi đại chúng trang nghiêm lễ bái cúng dường, mang nhiều ý nghĩa biểu tượng sâu sắc.",
    statues: [
      {"name": "ĐỨC PHẬT THÍCH CA MÂU NI", "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "ĐỨC PHẬT DƯỢC SƯ", "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "NHẬT QUANG BỒ TÁT", "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "NGUYỆT QUANG BỒ TÁT", "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "TỔ SƯ ĐẠT MA", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_dat_ma.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "TỔ SƯ LONG THỌ", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_long_tho.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "PHẬT HOÀNG TRẦN NHÂN TÔNG", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/phat_hoang_tran_nhan_tong.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "TỔ SƯ KHƯƠNG TĂNG HỘI", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_khuong_tang_hoi.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "SƯ TỔ NGỘ CHÂN TỬ", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/su_to_ngo_chan_tu.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "VI ĐÀ HỘ PHÁP", "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/vi_da_ho_phap.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "NGÀI TRỪNG ÁC", "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/trung_ac.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "NGÀI KHUYẾN THIỆN", "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/khuyen_thien.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "THẬP NHỊ DƯỢC XOA ĐẠI TƯỚNG", "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thap_nhi_duoc_xoa/an_de_la_dai_tuong.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "ĐỨC ÔNG CẤP CÔ ĐỘC", "imgUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/duc_ong_cap_co_doc.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"}
    ],
    stories: [],
  },
  {
    id: "2",
    pinNumber: 2,
    slug: "to-duong",
    name: "TỔ ĐƯỜNG",
    subtitle: "TỔ ẤN TRÙNG QUANG",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=1100&h=600&fit=crop",
    mapPos: { x: 62, y: 38 },
    description: "Không gian tôn nghiêm phụng thờ chư vị Tổ Sư qua các thời kỳ, tổ sư có công khai sơn và truyền thừa dòng mạch Phật pháp tại bổn tự. Nơi đón tiếp quý thiện nam tín nữ và ghi dấu tinh thần tri ân sâu sắc.",
    fullContent: "Không gian tôn nghiêm phụng thờ chư vị Tổ Sư qua các thời kỳ, tổ sư có công khai sơn và truyền thừa dòng mạch Phật pháp tại bổn tự. Nơi đón tiếp quý thiện nam tín nữ và ghi dấu tinh thần tri ân sâu sắc.",
    statues: [
      {
            "name": "QUAN ÂM BỒ TÁT TAM DIỆN",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "NTPG"
      },
      {
            "name": "ĐỊA TẠNG BỒ TÁT PHỎNG CỎ",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "THIỀN SƯ TỪ ĐẠO HẠNH",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Chư Lịch Đại Tổ Sư",
            "cluster": "Việt Nam Phật Giáo",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "TUỆ TĨNH THIỀN SƯ",
            "imgUrl": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Chư Lịch Đại Tổ Sư",
            "cluster": "Việt Nam Phật Giáo",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "TIÊU DIỆN ĐẠI SỸ",
            "imgUrl": "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=300&h=300&fit=crop",
            "quote": "Hiện tướng quỷ vương, độ kẻ lầm đường.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      }
],
    stories: [],
  },
  {
    id: "3",
    pinNumber: 3,
    slug: "dai-nam-quoc-mau",
    name: "ĐẠI NAM QUỐC MẪU",
    subtitle: "MẪU NGHI THIÊN HẠ",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=1100&h=600&fit=crop",
    mapPos: { x: 48, y: 65 },
    description: "Với kiến trúc nguyên bản nhà đá ong nổi tiếng của vùng văn hóa xứ Đoài, nhà Đại Nam Quốc Mẫu được xây dựng để nhắc nhở mỗi người ý thức về truyền thống \"Uống nước nhớ nguồn\" của dân tộc Việt.",
    fullContent: "Với kiến trúc nguyên bản nhà đá ong nổi tiếng của vùng văn hóa xứ Đoài, nhà Đại Nam Quốc Mẫu được xây dựng để nhắc nhở mỗi người ý thức về truyền thống \"Uống nước nhớ nguồn\" của dân tộc Việt.",
    statues: [
      {
            "name": "ĐỨC PHẬT A DI ĐÀ CHẤT LIỆU GỐM TRUYỀN THỐNG",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "\"Giữ lòng thuần khiết và vững chãi giữa cuộc đời đổi thay.\"",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "QUAN ÂM THIÊN THỦ THIÊN NHÃN",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐẠI THẾ CHÍ PHỎNG CỔ",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Tây Phương Tam Thánh",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "CHUẨN ĐỀ BỒ TÁT",
            "imgUrl": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "NTPG"
      },
      {
            "name": "THÍCH ĐẾ HOÀN NHÂN",
            "imgUrl": "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=300&h=300&fit=crop",
            "quote": "Người động viên khuyến khích chúng ta vượt qua những chướng ngại từ gia đình, xã hội, những định kiến cuộc sống, củng cố đức tin trên con đường của bậc Thánh, đó chính là sự hiện thân của trời đế Thích.",
            "group": "Hộ Pháp Thần Vương",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "ĐOAN QUỐC CÔNG NGUYỄN HOÀNG",
            "imgUrl": "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Chư Thánh Hộ Quốc",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "TAM TÒA THÁNH MẪU",
            "imgUrl": "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Chư Thánh Hộ Quốc",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "HƯNG ĐẠO ĐẠI VƯƠNG",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Chư Thánh Hộ Quốc",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "BÀ NGUYỆT TRANG ĐÀI (ĐỨC BÀ VISHAKHA)",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "Cúng dường không nhất thiết phải là những vật phẩm quý giá, lớn lao, mà là ở lòng thành và sự cống hiến vô điều kiện với những gì trong khả năng.",
            "group": "Đại Thí Chủ",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "LINH QUY TRƯỜNG THỌ",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Linh Vật Phật Giáo",
            "cluster": "Linh Thú Hộ Đạo",
            "type": "TƯỢNG CHÍNH"
      }
],
    stories: [],
  },
  {
    id: "4",
    pinNumber: 4,
    slug: "bao-tang",
    name: "BẢO TÀNG PHẬT GIÁO VÀ TƯỢNG ĐÀI NGUYỆT TRÍ QUAN ÂM",
    subtitle: "DẤU XƯA LƯU TRUYỀN",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1100&h=600&fit=crop",
    mapPos: { x: 70, y: 72 },
    description: "Bảo tàng là nơi lưu giữ và tái hiện dòng chảy lịch sử, đồng thời phản ánh sinh động hành trình đồng hành của Phật giáo cùng dân tộc qua các thời kỳ. Còn Tượng đài Nguyệt Trí Quan Âm là một trong những hóa thân của Bồ Tát Quán Âm, tay phải cầm minh châu, tay trái cầm bình tịnh thủy tượng trưng cho sự trí tuệ và từ bi của Ngài, luôn soi sáng và làm dịu mát lửa não phiền của hết thảy chúng sinh.",
    fullContent: "Bảo tàng là nơi lưu giữ và tái hiện dòng chảy lịch sử, đồng thời phản ánh sinh động hành trình đồng hành của Phật giáo cùng dân tộc qua các thời kỳ. Còn Tượng đài Nguyệt Trí Quan Âm là một trong những hóa thân của Bồ Tát Quán Âm, tay phải cầm minh châu, tay trái cầm bình tịnh thủy tượng trưng cho sự trí tuệ và từ bi của Ngài, luôn soi sáng và làm dịu mát lửa não phiền của hết thảy chúng sinh.",
    statues: [
      {
            "name": "ĐỨC BẢN SƯ THÍCH CA MÂU NI RỜI NÚI TƯỢNG ĐẦU, RỪNG KHỔ HẠNH HƯỚNG VỀ SÔNG NI-LIÊN-THIỀN",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "Trải nghiệm nào cũng có giá trị nhất định.",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "TƯỢNG ĐỨC BẢN SƯ THÀNH ĐẠO  PHỎNG CỔ, THẾ KỶ 18",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "\"Im lặng là sức mạnh của nội tâm.\"",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC BẢN SƯ THÍCH CA MÂU NI GIƠ CÀNH HOA TRÊN HỘI LINH SƠN- NGHỆ THUẬT TẠC TƯỢNG BẢO HÀ, THẾ KỶ 18",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "Hoa là quả chứng, đâu là nhân tu.",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC PHẬT THÍCH CA - NGƯỜI THẦY GIÁO",
            "imgUrl": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop",
            "quote": "Ba vị Thầy có trong một vị Thầy, \nMột vị Thầy gồm đủ ba vị Thầy.",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC BẢN SƯ SƠ SINH ĐỨNG TRÊN ĐẦU THẦN LONG VƯƠNG -THỜI HẬU LÊ",
            "imgUrl": "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=300&h=300&fit=crop",
            "quote": "“Quyền lực không là gì với sự hồn nhiên của một đứa bé.”",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC BẢN SƯ SƠ SINH NGHỆ THUẬT PHẬT GIÁO BẮC BỘ",
            "imgUrl": "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=300&h=300&fit=crop",
            "quote": "“Sinh ra là quý khi biết song và làm lợi ích cho muôn người.”",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC PHẬT A DI ĐÀ PHỎNG CỘ NGHỆ THUẬT TƯỢNG GHÉP NHẬT BẢN",
            "imgUrl": "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "TƯỢNG ĐỨC PHẬT A DI ĐÀ PHỎNG CỔ,  NGHỆ THUẬT TẠC TƯỢNG ĐỜI TỐNG, TRUNG HOA",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "Không nghèo cũng không giàu,\nChẳng trí cũng chẳng ngu,\nA Di Đà chuyên niệm,\nMặc kệ! Tự tại đi…",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC PHẬT DI ĐÀ TIỂU BẢN",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "Bản chất cõi Tịnh độ của Đức Phật A Di Đà được xây dựng trên nền tảng của thương yêu và hiểu biết thật sự.",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC PHẬT DƯỢC SƯ - THẦY THUỐC",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "3 vị Thầy có trong 1 vị Thầy; 1 vị Thầy gồm đủ 3 vị Thầy.",
            "group": "Chư Phật Hải Hội",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "NTPG"
      },
      {
            "name": "PHẬT TỲ LÔ GIÁ NA PHỎNG CỔ \nNGHỆ THUẬT TẠC TƯỢNG ĐỜI ĐƯỜNG, TRUNG HOA",
            "imgUrl": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop",
            "quote": "Vũ trụ nằm trong hạt cải, hạt cải chứa cả vũ trụ.",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "BỒ TÁT VĂN THÙ",
            "imgUrl": "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=300&h=300&fit=crop",
            "quote": "Biến kinh nghiệm của người khác thành cái biết của bản thân.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Hoa Nghiêm Tam Thánh",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "BỒ TÁT PHỔ HIỀN",
            "imgUrl": "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=300&h=300&fit=crop",
            "quote": "Trí tuệ sẽ sống mãi nếu biết hiến tặng hạnh phúc cho chúng sinh.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Hoa Nghiêm Tam Thánh",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "QUAN ÂM NGUYỆT TRÍ",
            "imgUrl": "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=300&h=300&fit=crop",
            "quote": "Cơn mưa tình thương không phân biệt giúp tưới mát, chuyển hóa sức nóng của tham dục, sân hận và vô minh trong bạn.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Tây Phương Tam Thánh",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "QUÁN ÂM HƯƠNG TÍCH",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "Hương thiền không dứt, tích cũ lưu danh.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC BỒ TÁT QUÁN TỰ TẠI",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "Tự tại nơi sinh tử quyền lực có là gì!",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "BỒ TÁT ĐỊA TẠNG PHỎNG CỔ, NGHỆ THUẬT TẠC TƯỢNG PHẬT GIÁO MIỀN NAM",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "Tâm lành như đất, chứa hết vạn vật.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "THÁNH TĂNG A-NAN, NGHỆ THUẬT TẠC TƯỢNG BẢO HÀ, THẾ KỶ 18",
            "imgUrl": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop",
            "quote": "Trí tuệ là sự trau dồi không ngừng nghỉ,",
            "group": "Thanh Văn Thánh Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "NTPG"
      },
      {
            "name": "THÁNH TĂNG ĐẠI CA-DIẾP, NGHỆ THUẬT TẠC TƯỢNG BẢO HÀ, THẾ KỶ 18",
            "imgUrl": "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=300&h=300&fit=crop",
            "quote": "Đạo đức là sự biết đủ và tỉnh thức với ham muốn bản năng.",
            "group": "Thanh Văn Thánh Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "NTPG"
      },
      {
            "name": "THIỀN SƯ TỲ-NI-DA-LƯU-CHI - (? – 594) SƠ TỔ THIỀN PHÁI MANG TÊN NGÀI, MỘT TRONG NHỮNG DÒNG THIỀN ĐẦU TIÊN TẠI VIỆT NAM",
            "imgUrl": "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=300&h=300&fit=crop",
            "quote": "Xứ xứ đều là Đạo tràng, nơi nơi đều là Phật địa.",
            "group": "Chư Lịch Đại Tổ Sư",
            "cluster": "Tây Thiên Đông Độ",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "THIỀN SƯ VẠN HẠNH (938 - 1018) VỪA LÀ THẦY, VỪA LÀ QUỐC SƯ GIÚP \nVUA LÝ CÔNG UẨN SÁNG LẬP TRIỀU ĐẠI NHÀ LÝ NĂM 1010",
            "imgUrl": "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=300&h=300&fit=crop",
            "quote": "Đế nghiệp muốn vững, đạo nghiệp chớ xem thường,",
            "group": "Chư Lịch Đại Tổ Sư",
            "cluster": "Việt Nam Phật Giáo",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "QUỐC SƯ KHUÔNG VIỆT (933–1011) VỪA LÀ THẦY CỦA VUA, VỪA LÀ QUỐC SƯ CỦA HAI TRIỀU ĐẠI ĐINH VÀ TIỀN LÊ (968 - 1009)",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "Quốc Sư hai triều, \nXưa tiếp nối,\nNay lưu truyền,\nMãi mãi muôn đời, \nĐại Việt thái bình.",
            "group": "Chư Lịch Đại Tổ Sư",
            "cluster": "Việt Nam Phật Giáo",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "TUỆ TRUNG THƯỢNG SĨ (1230–1291) VỪA LÀ PHẬT TỬ,VỪA LÀ THẦY CỦA PHẬT HOÀNG TRẦN NHÂN TÔNG",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "Phản quang tự kỷ bản phận sự, bất tùng tha đắc.\n(nghĩa: thường xuyên nhìn lại chính mình, chớ vọng hướng bên ngoài)",
            "group": "Chư Lịch Đại Tổ Sư",
            "cluster": "Việt Nam Phật Giáo",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "ĐẾ THÍCH THIÊN CHỦ , TỤC GỌI VUA CHA NGỌC HOÀNG, PHỎNG CỔ THẾ KỶ 18",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "Bảo tồn phú quý vinh hoa bằng cách hộ trì phụng sự tam bảo với tâm trong sạch.",
            "group": "Hộ Pháp Thần Vương",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "VI ĐÀ HỘ PHÁP HÓA THÂN PHÙ ĐỔNG THIÊN VƯƠNG",
            "imgUrl": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Hộ Pháp Thần Vương",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "NGÀI TRỪNG ÁC CẬN ĐẠI",
            "imgUrl": "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Hộ Pháp Thần Vương",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "NGÀI KHUYẾN THIỆN CẬN ĐẠI",
            "imgUrl": "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Hộ Pháp Thần Vương",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "MẬT TÍCH KIM CANG TƯỢNG CỔ",
            "imgUrl": "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Hộ Pháp Thần Vương",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "NA LA DIEN KIM CANG TƯỢNG CỔ",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Hộ Pháp Thần Vương",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "TIÊU DIỆN ĐẠI SỸ PHỎNG CỔ, NGHỆ THUẬT TẠC TƯỢNG PHẬT GIÁO MIỀN NAM",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "TƯỢNG PHÙ ĐỔNG THIÊN VƯƠNG PHỎNG CỔ, NGHỆ THUẬT TẠC TƯỢNG ĐỜI TỐNG, TRUNG HOA",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "Hộ Phật chắp tay kiếm nằm ngang, \nHộ Pháp uy nghiêm cưỡi long thần,\nHộ Tăng kiếm báu cầm sáng lóa,\nTam bảo miên trường, Phật Pháp Tăng.",
            "group": "Chư Thánh Hộ Quốc",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "NTPG"
      },
      {
            "name": "LÝ THÁNH TÔNG (1023–1072) VỪA LÀ VUA, VỪA LÀ MỘT PHẬT TỬ ĐƯỢC XEM LÀ NHỊ TỔ CỦA THIỀN PHÁI THẢO ĐƯỜNG TẠI VIỆT NAM",
            "imgUrl": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop",
            "quote": "Đại ngộ thiền cơ,\nKhoan dân trị nước,\nThảo Đường Nhị Tổ,\nPhật Pháp xương minh.",
            "group": "Chư Thánh Hộ Quốc",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "NGUYỄN TRÃI ĐẠI TƯ ĐỒ (1380 –1442)",
            "imgUrl": "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=300&h=300&fit=crop",
            "quote": "Bình Ngô Đại Cáo dựng cơ đồ,\nCôn Sơn thắp đèn soi hậu thế,\nNgoài giữ nho phong, trong rèn Phật đạo\nDanh chẳng màng, lợi chẳng nghĩ,\nRõ nguồn cơn, hai chữ vô thường.",
            "group": "Chư Thánh Hộ Quốc",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "THÁNH NỮ SUJATA",
            "imgUrl": "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Đại Thí Chủ",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "THIỀM THỨ CÓC",
            "imgUrl": "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Linh Vật Phật Giáo",
            "cluster": "Linh Thú Hộ Đạo",
            "type": "TƯỢNG CHÍNH"
      }
],
    stories: [],
  },
  {
    id: "5",
    pinNumber: 5,
    slug: "bao-thap-van-phat-xa-loi",
    name: "BẢO THÁP VẠN PHẬT XÁ LỢI HÒA BÌNH",
    subtitle: "VẠN PHẬT QUANG MINH",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1659513704374-0dc63b98dbb5?w=1100&h=600&fit=crop",
    mapPos: { x: 42, y: 22 },
    description: "Ngôi bảo tháp uy nghiêm, nơi tôn trí tượng Phật, kinh sách, biểu tượng cho ánh sáng tuệ giác. Đúng như tên gọi của bảo tháp, mặt trong và ngoài bảo tháp được tôn trí với gần một vạn tượng Phật - chế tác bởi thợ gốm Bát Tràng lấy mẫu từ vườn Nai Sannath-Varanasi nơi Đức Phật chuyển Pháp Luân. Bên trong chứa cấu trúc MẠN ĐÀ LA (Mandala) linh thiêng, đồng tâm vũ trụ với vạn Phật quang minh.",
    fullContent: "Ngôi bảo tháp uy nghiêm, nơi tôn trí tượng Phật, kinh sách, biểu tượng cho ánh sáng tuệ giác. Đúng như tên gọi của bảo tháp, mặt trong và ngoài bảo tháp được tôn trí với gần một vạn tượng Phật - chế tác bởi thợ gốm Bát Tràng lấy mẫu từ vườn Nai Sannath-Varanasi nơi Đức Phật chuyển Pháp Luân. Bên trong chứa cấu trúc MẠN ĐÀ LA (Mandala) linh thiêng, đồng tâm vũ trụ với vạn Phật quang minh.",
    statues: [
      {
            "name": "QUAN ÂM THIÊN THỦ THIÊN NHÃN",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "Sống cho riêng mình là người chật hẹp. Sống cho muôn người thì rộng lớn thênh thang.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "",
            "type": "NTPG"
      }
],
    stories: [],
  },
  {
    id: "6",
    pinNumber: 6,
    slug: "giang-duong",
    name: "GIẢNG ĐƯỜNG",
    subtitle: "CHƯ PHẬT HẢI HỘI",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?w=1100&h=600&fit=crop",
    mapPos: { x: 78, y: 48 },
    description: "Khu vực giảng đường với diện tích 700m vuông chia làm hai tầng, tầng trên làm giảng đường, tầng dưới làm trai đường. Giảng đường là nơi tu tập, sinh hoạt và học hỏi giáo lý nhà Phật theo các khóa tu được tổ chức định kỳ tại Tùng Lâm.",
    fullContent: "Khu vực giảng đường với diện tích 700m vuông chia làm hai tầng, tầng trên làm giảng đường, tầng dưới làm trai đường. Giảng đường là nơi tu tập, sinh hoạt và học hỏi giáo lý nhà Phật theo các khóa tu được tổ chức định kỳ tại Tùng Lâm.",
    statues: [
      {
            "name": "ĐỨC PHẬT THÍCH CA MÂU NI KHỔ HẠNH",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "\"Tận cùng của đau khổ, năng lực tỉnh thức hiển bày.\"",
            "group": "Chư Phật Hải Hội",
            "cluster": "",
            "type": "NTPG"
      },
      {
            "name": "ĐỨC PHẬT A DI ĐÀ",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "\"Tâm bình an thì ở đâu cũng là Tịnh Độ.\"",
            "group": "Chư Phật Hải Hội",
            "cluster": "Tây Phương Tam Thánh",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "PHẬT MẪU CHUẨN ĐỀ",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Sứ Giả Như Lai",
            "type": "TƯỢNG CHÍNH"
      }
],
    stories: [],
  },
  {
    id: "7",
    pinNumber: 7,
    slug: "tu-an",
    name: "TỨ ÂN - VÃNG SINH ĐƯỜNG",
    subtitle: "CHƯ HƯƠNG LINH VỀ MIỀN TỊNH ĐỘ",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=1100&h=600&fit=crop",
    mapPos: { x: 30, y: 78 },
    description: "Khu vực Nhà Tứ Ân để thờ chư Hương Linh, Cửu Huyền Thất Tổ của bách gia trăm họ, với ý nghĩa nhắc nhở mọi người hằng nhớ đến công ơn của Tam Bảo, Tổ Thầy, cha mẹ và quốc gia, dân tộc. Còn nhà vãng sinh là nơi để quý Phật tử, thiện nam, tín nữ ký gửi tro cốt của người thân đã khuất để chư Hương Linh được nghe kinh, nghe Pháp chuyển hóa và siêu tiến về các cảnh giới an lành.",
    fullContent: "Khu vực Nhà Tứ Ân để thờ chư Hương Linh, Cửu Huyền Thất Tổ của bách gia trăm họ, với ý nghĩa nhắc nhở mọi người hằng nhớ đến công ơn của Tam Bảo, Tổ Thầy, cha mẹ và quốc gia, dân tộc. Còn nhà vãng sinh là nơi để quý Phật tử, thiện nam, tín nữ ký gửi tro cốt của người thân đã khuất để chư Hương Linh được nghe kinh, nghe Pháp chuyển hóa và siêu tiến về các cảnh giới an lành.",
    statues: [
      {
            "name": "ĐỊA TẠNG BỒ TÁT HIỆN ĐẠI",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "NTPG"
      },
      {
            "name": "ĐỊA TẠNG BỒ TÁT",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Sứ Giả Như Lai",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "ĐỊA TẠNG BỒ TÁT THUẦN VIỆT",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "Trên bước đường tu, chúng ta phải thấy hạnh phúc khi được làm những công việc hoằng pháp lợi sinh, phải nuôi dưỡng tâm này bằng cách quán chiếu tất cả chúng sinh là cha mẹ, là thân bằng quyến thuộc.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Sứ Giả Như Lai",
            "type": "NTPG"
      }
],
    stories: [],
  },
  {
    id: "8",
    pinNumber: 8,
    slug: "tang-kinh-cac",
    name: "THƯ VIỆN",
    subtitle: "PHÁP BẢO LƯU THÔNG",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1100&h=600&fit=crop",
    mapPos: { x: 82, y: 28 },
    description: "Thư viện là không gian lưu giữ Pháp tạng và những trang kinh, sách quý, góp phần lan tỏa đạo đức, trí tuệ Phật pháp đến mọi người.",
    fullContent: "Thư viện là không gian lưu giữ Pháp tạng và những trang kinh, sách quý, góp phần lan tỏa đạo đức, trí tuệ Phật pháp đến mọi người.",
    statues: [],
    stories: [],
  },
  {
    id: "9",
    pinNumber: 9,
    slug: "trai-duong",
    name: "TRAI ĐƯỜNG",
    subtitle: "HÒA CHÍNH TRAI ĐƯỜNG",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1100&h=600&fit=crop",
    mapPos: { x: 64, y: 14 },
    description: "Nơi đại chúng và Phật tử thực hành nghi thức quá đường, thọ trai trong chánh niệm. Không gian nuôi dưỡng lòng biết ơn đối với đàn na tín thí và nuôi lớn tình pháp lữ, thực hành ăn trong tỉnh thức.",
    fullContent: "Nơi đại chúng và Phật tử thực hành nghi thức quá đường, thọ trai trong chánh niệm. Không gian nuôi dưỡng lòng biết ơn đối với đàn na tín thí và nuôi lớn tình pháp lữ, thực hành ăn trong tỉnh thức.",
    statues: [],
    stories: [],
  },
  {
    id: "11",
    pinNumber: 11,
    slug: "san-di-da",
    name: "SÂN DI ĐÀ",
    subtitle: "QUANG MINH DI ĐÀ",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=1100&h=600&fit=crop",
    mapPos: { x: 57, y: 33 },
    description: "Không gian sân rộng lớn phía trước Chánh điện, trung tâm diễn ra các đại lễ truyền thống hoành tráng của Chùa, có tôn trí tôn tượng Đức Phật A Di Đà phóng quang tiếp dẫn đại chúng.",
    fullContent: "Không gian sân rộng lớn phía trước Chánh điện, trung tâm diễn ra các đại lễ truyền thống hoành tráng của Chùa, có tôn trí tôn tượng Đức Phật A Di Đà phóng quang tiếp dẫn đại chúng.",
    statues: [
      {
            "name": "ĐỨC PHẬT THÍCH CA MÂU NI CHUYỂN PHÁP LUÂN",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "\"Hiểu rõ khổ đau để tìm ra con đường hạnh phúc thực sự.\"",
            "group": "Chư Phật Hải Hội",
            "cluster": "Nghệ Thuật Phật Giáo\n(mỗi một tượng là một nhân vật, một tượng có nhiều biến thể khác nhau gọi là nghệ thuật phật giáo, nghệ thuật phật giáo xuất hiện ở trong trang của mỗi NHÂN VẬT)",
            "type": "NTPG (Nghệ thuật Phật Giáo)"
      },
      {
            "name": "QUAN ÂM BỒ TÁT BẠCH Y",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "Tự tính thanh tịnh vốn có sẵn ngay nơi tâm của mỗi người.",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "NTPG"
      },
      {
            "name": "QUAN ÂM BỒ TÁT TỐNG TỬ",
            "imgUrl": "https://images.unsplash.com/photo-1721113411239-3e87d435dda6?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "NTPG"
      },
      {
            "name": "DI LẶC BỒ TÁT",
            "imgUrl": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Tịnh Đại Hải Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "TƯỢNG CHÍNH"
      }
],
    stories: [],
  },
  {
    id: "12",
    pinNumber: 12,
    slug: "cong-tam-quan",
    name: "CỔNG TAM QUAN",
    subtitle: "TAM GIẢI THOÁT MÔN",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=1100&h=600&fit=crop",
    mapPos: { x: 12, y: 55 },
    description: "Cửa ngõ đầu tiên dẫn lối vào chốn thiêng gồm hệ thống Cổng Tam Quan uy nghi, kết nối qua cây Cầu Bát Chánh Đạo vượt dòng nước tịnh, dẫn lên Thềm Thất Thánh Tài (7 bậc đá). Giúp hành giả rũ bỏ bụi trần, tu tập 8 con đường chân chính để gặt hái 7 báu vật tâm linh của bậc Thánh.",
    fullContent: "Cửa ngõ đầu tiên dẫn lối vào chốn thiêng gồm hệ thống Cổng Tam Quan uy nghi, kết nối qua cây Cầu Bát Chánh Đạo vượt dòng nước tịnh, dẫn lên Thềm Thất Thánh Tài (7 bậc đá). Giúp hành giả rũ bỏ bụi trần, tu tập 8 con đường chân chính để gặt hái 7 báu vật tâm linh của bậc Thánh.",
    statues: [],
    stories: [],
  },
  {
    id: "13",
    pinNumber: 13,
    slug: "lang-xa-tam-linh",
    name: "KHÔNG GIAN TÂM LINH VĂN HÓA LÀNG XÃ BẮC BỘ",
    subtitle: "DI SẢN TÂM LINH VIỆT",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1100&h=600&fit=crop",
    mapPos: { x: 42, y: 57 },
    description: "Khuôn viên đền thờ mang đậm nét kiến trúc thuần Việt cổ kính, kết nối với gốc cây Đa, sân đình và cổng đình. Nơi tôn vinh giá trị văn hóa lịch sử, làm nổi bật lên nét đẹp làng xã xưa gắn liền với mảnh đất bổn tự.",
    fullContent: "Khuôn viên đền thờ mang đậm nét kiến trúc thuần Việt cổ kính, kết nối với gốc cây Đa, sân đình và cổng đình. Nơi tôn vinh giá trị văn hóa lịch sử, làm nổi bật lên nét đẹp làng xã xưa gắn liền với mảnh đất bổn tự.",
    statues: [],
    stories: [],
  },
  {
    id: "14",
    pinNumber: 14,
    slug: "san-la-han",
    name: "SÂN LA HÁN",
    subtitle: "THÁNH TĂNG ỨNG HÓA",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?w=1100&h=600&fit=crop",
    mapPos: { x: 42, y: 79 },
    description: "Nằm ngay dưới chân Lầu Chuyển Kinh Luân, Sân La Hán được kiến tạo theo lối vườn cảnh thiền, kết hợp hài hòa giữa những khối đá nguyên sơ và sắc xanh của cỏ cây để Phật tử tĩnh tâm thiền hành, chiêm bái các chư vị Thập Bát La Hán.",
    fullContent: "Nằm ngay dưới chân Lầu Chuyển Kinh Luân, Sân La Hán được kiến tạo theo lối vườn cảnh thiền, kết hợp hài hòa giữa những khối đá nguyên sơ và sắc xanh của cỏ cây để Phật tử tĩnh tâm thiền hành, chiêm bái các chư vị Thập Bát La Hán.",
    statues: [
      {
            "name": "THẬP BÁT LA HÁN ĐÁ",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Thanh Văn Thánh Chúng",
            "cluster": "Nghệ Thuật Phật Giáo",
            "type": "TƯỢNG CHÍNH"
      },
      {
            "name": "KIÊN LAO ĐỊA THẦN",
            "imgUrl": "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=300&h=300&fit=crop",
            "quote": "",
            "group": "Hộ Pháp Thần Vương",
            "cluster": "Ứng Hóa Nhân Gian",
            "type": "TƯỢNG CHÍNH"
      }
],
    stories: [],
  },
  {
    id: "15",
    pinNumber: 15,
    slug: "ho-phong-sinh",
    name: "LẦU KINH LUÂN",
    subtitle: "PHÁP LUÂN THƯỜNG CHUYỂN",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1709064159097-91b634741c96?w=1100&h=600&fit=crop",
    mapPos: { x: 6, y: 46 },
    description: "Là biểu tượng cho Tam Bảo hiện hữu giữa nhân gian, nơi Phật, Pháp và Tăng cùng soi sáng con đường giác ngộ. Mỗi vòng xoay của Kinh Luân thể hiện sứ mệnh cao quý của Tăng Bảo - thay Đức Phật hoằng dương chánh pháp, lan tỏa ánh sáng từ bi và trí tuệ rộng khắp thế gian.",
    fullContent: "Là biểu tượng cho Tam Bảo hiện hữu giữa nhân gian, nơi Phật, Pháp và Tăng cùng soi sáng con đường giác ngộ. Mỗi vòng xoay của Kinh Luân thể hiện sứ mệnh cao quý của Tăng Bảo - thay Đức Phật hoằng dương chánh pháp, lan tỏa ánh sáng từ bi và trí tuệ rộng khắp thế gian.",
    statues: [
      {
            "name": "THẬP ĐẠI ĐỆ TỬ",
            "imgUrl": "https://images.unsplash.com/photo-1618554565982-3497a2e70642?w=300&h=300&fit=crop",
            "quote": "Tấm gương của các Ngài, lời dạy của các Ngài là chất liệu nuôi dưỡng chúng ta.",
            "group": "Thanh Văn Thánh Chúng",
            "cluster": "Thập Đại Đệ Tử",
            "type": "TƯỢNG CHÍNH"
      }
],
    stories: [],
  },

];

// ─── Sutra Reader Data (Tàng Kinh Các Layer 2) ─────────────────────────────
export const SUTRA_CHAPTERS: SutraChapter[] = [
  {
    id: "1",
    chapterNumber: 1,
    title: "Chương I: Quán Tự Tại Bát Nhã Ba La Mật",
    content: [
      "Quán Tự Tại Bát Nhã Ba La Mật Đa tâm kinh.",
      "Quán Tự Tại Bồ Tát hành sâu Bát Nhã Ba La Mật Đa thời soi thấy ngũ uẩn đều trống rỗng, qua hết thảy khổ ách.",
      "Xá Lợi Tử! Sắc chẳng khác không, không chẳng khác sắc, sắc tức là không, không tức là sắc. Thọ, tưởng, hành, thức cũng lại như thế.",
    ],
  },
  {
    id: "2",
    chapterNumber: 2,
    title: "Chương II: Tướng Không Của Các Pháp",
    content: [
      "Xá Lợi Tử! Tướng không của các pháp: Chẳng sinh, chẳng diệt, chẳng dơ, chẳng sạch, chẳng thêm, chẳng bớt.",
      "Cho nên trong không không có sắc, không có thọ, tưởng, hành, thức. Không có mắt, tai, mũi, lưỡi, thân, ý. Không có sắc, thanh, hương, vị, xúc, pháp.",
      "Không có nhãn giới cho đến không có ý thức giới. Không có vô minh, cũng không có cái hết vô minh, cho đến không có già chết, cũng không có cái hết già chết.",
    ],
  },
  {
    id: "3",
    chapterNumber: 3,
    title: "Chương III: Con Đường Của Hàng Bồ Tát",
    content: [
      "Cho nên Bồ Tát nương theo Bát Nhã Ba La Mật Đa tâm không ngăn ngại, vì không ngăn ngại nên không sợ hãi, xa lìa mộng tưởng đảo điên, đạt đến cứu kính Niết Bàn.",
      "Chư Phật trong ba đời cũng nương theo Bát Nhã Ba La Mật Đa mà chứng được Quả Vị Chánh Đẳng Chánh Giác.",
      "Nên biết Bát Nhã Ba La Mật Đa là đại thần chú, là đại minh chú, là vô thượng chú, là vô đẳng đẳng chú, trừ được hết thảy khổ, thực sự không xảo dối.",
    ],
  },
];

// ─── Memorial Data (Tứ Ân - Vãng Sinh Đường Layer 2) ────────────────────────
export const MEMORIAL_RECORDS: MemorialRecord[] = [
  {
    id: "1",
    code: "HL-2024-001",
    fullName: "Nguyễn Văn An",
    dharmaName: "Tịnh Tâm",
    birthYear: "1945",
    deathYear: "2023",
    hometown: "Hà Nội",
    positionSlot: "Gian Tứ Ân - Ô B12",
    registeredBy: "Nguyễn Văn Bình (Con trai)",
    dateSent: "15/03/2023",
  },
  {
    id: "2",
    code: "HL-2024-002",
    fullName: "Trần Thị Hương",
    dharmaName: "Diệu Âm",
    birthYear: "1950",
    deathYear: "2024",
    hometown: "Sơn La",
    positionSlot: "Gian Vãng Sinh - Ô A08",
    registeredBy: "Trần Thị Mai (Con gái)",
    dateSent: "10/01/2024",
  },
  {
    id: "3",
    code: "HL-2024-003",
    fullName: "Lê Hoàng Nam",
    dharmaName: "Phúc Trí",
    birthYear: "1962",
    deathYear: "2023",
    hometown: "Hải Phòng",
    positionSlot: "Gian Tứ Ân - Ô C05",
    registeredBy: "Lê Thị Thu (Vợ)",
    dateSent: "20/08/2023",
  },
  {
    id: "4",
    code: "HL-2024-004",
    fullName: "Phạm Thiện Nhân",
    dharmaName: "Tâm Nghiêm",
    birthYear: "1938",
    deathYear: "2022",
    hometown: "Hà Tây",
    positionSlot: "Gian Tứ Ân - Ô A15",
    registeredBy: "Phạm Đức Thắng (Con trai)",
    dateSent: "05/05/2022",
  },
];
