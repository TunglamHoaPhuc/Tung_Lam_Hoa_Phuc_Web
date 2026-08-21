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
    description: "Tam Bảo là nơi tôn thờ Đức Phật Bổn Sư Thích Ca Mâu Ni, chư Phật Dược Sư, chư Bồ Tát, Hộ Pháp và các bậc Tiền bối Tổ sư truyền thừa chánh pháp.",
    fullContent: "• Tiền đường: Tôn trí tượng 7 vị Phật Dược Sư cùng 12 pho tượng Dược Xoa Đại Tướng thể theo kinh Dược Sư Bản Nguyện Công Đức.\n• Chính điện: Tôn thờ tượng Đức Phật Thích Ca Mâu Ni (cao 3m), tượng Đại Ca Diếp (cao 2m, bên trái), tượng A Nan (cao 2m, bên phải) bằng gỗ mít.\n• Hậu cung:\n- Chính giữa: tôn thờ ngài Vi Đà Hộ Pháp\n- Bên trái: tôn thờ Tổ Long Thọ và Phật Hoàng Trần Nhân Tông\n- Bên phải: tôn thờ Tổ Bồ Đề Đạt Ma và Sư Tổ Ngộ Chân Tử",
    statues: [
      {"name": "ĐỨC PHẬT THÍCH CA MÂU NI", "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg", "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đã đoạn trừ mầm mống dẫn đến sinh tử luân hồi; đã đoạn trừ lậu hoặc, phiền não, nhiễm ô. Thế nên, cùng tột bờ sinh tử, cho nên gọi là Phật", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "CỤM TƯỢNG TÔN THỜ", "type": "TƯỢNG CHÍNH"},
      {"name": "ĐỨC PHẬT DƯỢC SƯ", "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.jpg", "quote": "Khi làm chủ tâm sân, bệnh tật và đau khổ dần được chuyển hóa.", "group": "CHƯ PHẬT HẢI HỘI", "cluster": "ĐÔNG PHƯƠNG TAM THÁNH", "type": "TƯỢNG CHÍNH"},
      {"name": "NHẬT QUANG BỒ TÁT", "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG", "quote": "Ánh sáng soi chiếu phá tan đêm tối vô minh của thế gian.", "group": "THANH TỊNH ĐẠI HẢI CHÚNG", "cluster": "ĐÔNG PHƯƠNG TAM THÁNH", "type": "TƯỢNG CHÍNH"},
      {"name": "NGUYỆT QUANG BỒ TÁT", "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG", "quote": "Ánh sáng soi chiếu xoa dịu mọi muộn phiền khổ đau của vạn loài.", "group": "THANH TỊNH ĐẠI HẢI CHÚNG", "cluster": "ĐÔNG PHƯƠNG TAM THÁNH", "type": "TƯỢNG CHÍNH"},
      {"name": "TỔ SƯ ĐẠT MA", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_dat_ma.jpg", "quote": "Đạo không phải tìm từ nơi dễ chịu. Vì dễ chịu là sự nuông chiều cảm xúc và nô lệ giác quan.", "group": "CHƯ LỊCH ĐẠI TỔ SƯ", "cluster": "TÂY THIÊN ĐÔNG ĐỘ", "type": "TƯỢNG CHÍNH"},
      {"name": "TỔ SƯ LONG THỌ", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_long_tho.jpg", "quote": "Khai mở Trung Quán, soi sáng tính Không và thực tướng vạn pháp.", "group": "CHƯ LỊCH ĐẠI TỔ SƯ", "cluster": "TÂY THIÊN ĐÔNG ĐỘ", "type": "TƯỢNG CHÍNH"},
      {"name": "PHẬT HOÀNG TRẦN NHÂN TÔNG", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/phat_hoang_tran_nhan_tong.jpg", "quote": "Ở đời vui đạo hãy tùy duyên, hễ đói thì ăn mệt ngủ liền.", "group": "CHƯ LỊCH ĐẠI TỔ SƯ", "cluster": "VIỆT NAM PHẬT GIÁO", "type": "TƯỢNG CHÍNH"},
      {"name": "TỔ SƯ KHƯƠNG TĂNG HỘI", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_khuong_tang_hoi.jpg", "quote": "Gieo mầm Bồ đề đầu tiên trên đất Việt, tiếp dẫn hậu nhân.", "group": "CHƯ LỊCH ĐẠI TỔ SƯ", "cluster": "VIỆT NAM PHẬT GIÁO", "type": "TƯỢNG CHÍNH"},
      {"name": "SƯ TỔ NGỘ CHÂN TỬ", "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/su_to_ngo_chan_tu.jpg", "quote": "Khai sơn Tổ đình Hoằng Pháp, hoằng dương chánh pháp độ muôn người.", "group": "CHƯ LỊCH ĐẠI TỔ SƯ", "cluster": "VIỆT NAM PHẬT GIÁO", "type": "TƯỢNG CHÍNH"},
      {"name": "VI ĐÀ HỘ PHÁP", "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/vi_da_ho_phap.jpg", "quote": "Hộ trì chánh pháp trang nghiêm thanh tịnh, bảo hộ người tu học.", "group": "HỘ PHÁP THẦN VƯƠNG", "cluster": "ỨNG HÓA NHÂN GIAN", "type": "TƯỢNG CHÍNH"},
      {"name": "NGÀI TRỪNG ÁC", "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/trung_ac.jpg", "quote": "Nếu người làm điều ác, chớ tiếp tục làm thêm, chớ ước muốn điều ác, chứa ác tất chịu khổ.", "group": "HỘ PHÁP THẦN VƯƠNG", "cluster": "ỨNG HÓA NHÂN GIAN", "type": "TƯỢNG CHÍNH"},
      {"name": "NGÀI KHUYẾN THIỆN", "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/khuyen_thien.jpg", "quote": "Nếu người làm điều thiện, nên tiếp tục làm thêm, hãy ước muốn điều thiện, chứa thiện được an lạc.", "group": "HỘ PHÁP THẦN VƯƠNG", "cluster": "ỨNG HÓA NHÂN GIAN", "type": "TƯỢNG CHÍNH"},
      {"name": "THẬP NHỊ DƯỢC XOA ĐẠI TƯỚNG", "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thap_nhi_duoc_xoa/an_de_la_dai_tuong.jpg", "quote": "Mười hai đại tướng bảo hộ người trì tụng kinh Dược Sư tiêu trừ tai ách.", "group": "HỘ PHÁP THẦN VƯƠNG", "cluster": "ỨNG HÓA NHÂN GIAN", "type": "TƯỢNG CHÍNH"},
      {"name": "ĐỨC ÔNG CẤP CÔ ĐỘC", "imgUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/duc_ong_cap_co_doc.jpg", "quote": "Muốn đến được quả vị tối thượng, bố thí cúng dàng Đức Phật và chư Tăng là bước đầu tiên; không thể không làm.", "group": "ĐẠI THÍ CHỦ", "cluster": "ỨNG HÓA NHÂN GIAN", "type": "TƯỢNG CHÍNH"}
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
    description: "Nhà Đại Nam Quốc Mẫu được phục dựng theo nguyên mẫu kiến trúc cổ của vùng xứ Đoài bằng đá ong và gỗ tự nhiên, không sử dụng sắt thép, thể hiện tinh thần thuần Việt và vẻ đẹp mộc mạc nguyên sơ.",
    fullContent: "Nhà Đại Nam Quốc Mẫu được phục dựng theo nguyên mẫu kiến trúc cổ của vùng xứ Đoài – mảnh đất linh thiêng lưu giữ nhiều giá trị văn hóa tâm linh lâu đời.\n\nToàn bộ công trình được xây dựng bằng đá ong và gỗ tự nhiên, không sử dụng sắt thép, thể hiện tinh thần thuần Việt và tôn trọng vẻ đẹp mộc mạc, nguyên sơ của kiến trúc cổ truyền.\n\nBên trong được bài trí trang nghiêm:\n• Chính giữa: Tôn thờ Quan Âm Thiên Thủ Thiên Nhãn, bên cạnh là Ngài Văn Thù Bồ Tát và Phổ Hiền Bồ Tát.\n• Tòa bên trái: Phối thờ Tam Tòa Thánh Mẫu, Thánh Mẫu Liễu Hạnh Công chúa – vị Mẫu Thượng Thiên trong Tứ Bất Tử.\n• Bên tay phải:\n- Cao nhất là Đế Thích Thiên Chủ cai quản cõi trời Đao Lợi.\n- Bên dưới thờ Đức Ông và Hưng Đạo Đại Vương.\n- Phía dưới cùng là tôn tượng bán thân của Doãn Quốc Công - Nguyễn Hoàng (1525–1613).\n\nHai bên là các bảo vật khai quật được trong quá trình xây dựng chùa cùng các kinh sách khảo cổ và hiện vật Phật giáo cổ quý giá.",
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
    name: "BẢO TÀNG",
    subtitle: "DẤU XƯA LƯU TRUYỀN",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/triển lãm sư tổ ngộ chân tử.JPG",
    mapPos: { x: 70, y: 72 },
    description: "Bảo tàng Dấu Xưa Lưu Truyền tọa lạc dưới tôn tượng đại tượng Nguyệt Trí Quan Âm cao 33m, nơi lưu giữ kỷ vật xưa, tư liệu hoằng pháp và các pho tượng cổ linh thiêng của Phật giáo Việt Nam.",
    fullContent: "Nhằm lưu giữ lại dấu ấn của quá khứ, tôn vinh bề dày lịch sử dân tộc và Phật giáo, đồng thời gìn giữ nét đẹp cổ kính, trang nghiêm của đạo mạch Việt Nam – Bảo tàng “Dấu Xưa Lưu Truyền” được hình thành dưới chân tôn tượng Đại tượng Nguyệt Trí Quan Âm (cao 33m tượng trưng 33 ứng hóa thân).\n\nKhông gian bảo tàng gồm hai tầng:\n• Tầng dưới: Lưu giữ kỷ vật xưa trong đời sống sinh hoạt của người dân Việt Nam, gợi lại nếp sống thanh bần, dung dị thấm đượm đạo vị. Trưng bày hình ảnh và thông tin về ba bậc Đạo sư lớn: HT. Thích Chân Tính, TT. Thích Tiến Đạt, ĐĐ. Thích Tâm Hòa, cùng văn bia duyên khởi và những lời dạy quý báu.\n• Tầng trên: Tôn thờ các pho tượng cổ mang giá trị lịch sử lâu đời và lưu giữ tư liệu ghi lại hành trình gần 20 năm kiến tạo, hoằng pháp của chư Tăng Tùng Lâm Hòa Phúc.",
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
    imgUrl: "/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg",
    mapPos: { x: 42, y: 22 },
    description: "Bảo tháp cao 37 mét gồm 7 tầng và 10.000 pho tượng Phật lấy nguyên mẫu từ vườn Lộc Uyển (Sarnath - Ấn Độ), nơi tôn trí Xá Lợi Phật Srilanka cùng 5 Đại Mạn Đà La Mật Tông nhiệm màu.",
    fullContent: "Bảo Tháp “Xá Lợi Hòa Bình Vạn Phật” – Chùa Hòa Phúc được kiến tạo để tôn trí và cúng dường Xá-lợi của Đức Phật Thích Ca Mâu Ni, giúp chúng sinh đời sau gieo duyên lành, tăng trưởng niềm tin vào con đường giải thoát.\n\nMặt trong và ngoài Bảo tháp được tôn trí với 10.000 pho tượng Phật lấy nguyên mẫu từ vườn Lộc Uyển (Sarnath – Ấn Độ), nơi Đức Phật chuyển bánh xe Pháp đầu tiên. Tháp cao 37 mét với 7 tầng tượng trưng cho 37 phẩm trợ đạo.\n\nMỗi tầng bảo tháp đều tôn trí kinh Pháp, tôn tượng Phật và các Đại Mạn Đà La:\n• Tầng 1: Mandala Quan Âm Bồ Tát - Tượng Quan Âm Thiên Thủ Thiên Nhãn\n• Tầng 2: Mandala Tây Phương Cực Lạc - Tượng Đại Nhật Như Lai\n• Tầng 3: Mandala Đa Bảo Như Lai - Tượng Đức Phật Thích Ca, Bảo Tháp và kinh Diệu Pháp Liên Hoa\n• Tầng 4: Mandala Đại Hắc Thiên Mahakala - Tượng Tam Thế Phật\n• Tầng 5: Mandala Thập Chủng Tử Kalachakra – Bảo tháp Xá Lợi Phật Srilanka",
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
    description: "Giảng đường chính có diện tích khoảng 700m², là trung tâm sinh hoạt tu học của đại chúng và nơi tổ chức các khóa tu hàng tháng cho quý Phật tử gần xa.",
    fullContent: "Giảng đường chính có diện tích khoảng 700m², là trung tâm sinh hoạt và tu học của đại chúng trong chùa, đồng thời là nơi tổ chức các khóa tu hàng tháng dành cho quý Phật tử gần xa.\n\nBên trong giảng đường tôn thờ Bồ Tát Chuẩn Đề, bên trái là Bộ kinh Pháp Hoa và tượng Quán Tự Tại Bồ Tát, bên phải là tượng Đức Tuyết Sơn khổ hạnh. Xung quanh là không gian tu tập trang nghiêm, ấm cúng để lắng tâm niệm Phật, tụng kinh, nghe pháp.\n\nPhần mái giảng đường được thiết kế hai tầng có khe thoáng cao nửa mét để đón gió và ánh sáng tự nhiên, giúp lưu thông không khí, tiết kiệm điện năng và tạo sự hài hòa giữa kiến trúc hiện đại và thân thiện với môi trường.",
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
    description: "Nhà Tứ Ân và Vãng Sinh Đường được kiến lập trang nghiêm nhằm nhắc nhở mọi người nuôi dưỡng tâm hiếu, cội nguồn tri ân tổ tiên và hướng thiện.",
    fullContent: "Từ bao đời nay, tình thân gia đình và lòng tri ân tổ tiên luôn được xem là cội nguồn của đạo lý làm người. Nhằm nhắc nhở mọi người nuôi dưỡng tâm hiếu và hướng thiện, Nhà Tứ Ân được kiến lập trang nghiêm nằm cạnh Giảng đường 02.\n\nCông trình gồm hai tầng:\n• Tầng 1: Nhà Vãng Sinh\n- Chính giữa: tôn thờ Đức Địa Tạng Vương Bồ Tát\n- Xung quanh: Tủ an vị tro cốt của thân nhân các quý Phật tử trong Chùa.\n\n• Tầng 2: Nhà Tứ Ân\n- Phía chính diện: tôn thờ Đức Địa Tạng Bồ Tát với đại nguyện cứu độ tất cả chúng sinh trong lục đạo luân hồi.\n- Xung quanh: là những dãy tủ trang nghiêm để di ảnh các hương linh, cửu huyền thất tổ của các gia tộc được gửi gắm nương nhờ Tam Bảo nghe kinh nghe Pháp, cầu nguyện siêu sinh Tịnh Độ.",
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
    description: "Nơi lưu trữ các ấn phẩm Phật giáo quý báu và là phòng đọc thanh tịnh dành cho quý Phật tử, thiện nam tín nữ.",
    fullContent: "Nơi lưu trữ các ấn phẩm Phật giáo quý báu, phòng đọc dành cho quý Phật tử, thiện nam tín nữ nghiên cứu và mở mang tri kiến Phật pháp.\n\nLưu ý khi vào Thư viện:\n- Đọc sách đúng nơi, giữ gìn oai nghi người Phật tử\n- Tôn trọng Kinh sách, lấy và trả đúng chỗ\n- Mượn hay thỉnh Kinh sách cần có sự cho phép của chư Tăng",
    statues: [],
    stories: [],
  },
  {
    id: "9",
    pinNumber: 9,
    slug: "trai-duong",
    name: "CHAY ĐƯỜNG - NHÀ BẾP",
    subtitle: "HÒA CHÍNH TRAI ĐƯỜNG & HƯƠNG TÍCH BẾP",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1100&h=600&fit=crop",
    mapPos: { x: 64, y: 14 },
    description: "Không gian ẩm thực chay thanh tịnh, dinh dưỡng dưỡng sinh và nơi phụng sự của chư Tăng Ni, Phật tử tại Bổn Tự Tùng Lâm Hòa Phúc.",
    fullContent: "CHAY ĐƯỜNG & KHÔNG GIAN BẾP HƯƠNG TÍCH TÙNG LÂM HÒA PHÚC\n\n1. TƯỢNG PHÁP & NĂNG LƯỢNG TÂM LINH:\n• Tôn tượng Đức Phật A Di Đà tiếp dẫn: Chiêm bái tiếp dẫn tâm thiện lành, thanh lọc thân tâm trước mỗi bữa thọ trai.\n• Tôn tượng Đức Giám Trai Sứ Giả (Đại Thánh Khẩn Na La Vương): Vị Bồ Tát hộ trì trai trạo, giám sát việc ẩm thực trong chốn tùng lâm thanh tịnh, hóa giải chướng ngại và bảo hộ sức khỏe cho đại chúng.\n\n2. ĐẠO LÝ THỌ TRAI TRONG CHÁNH NIỆM (ĂN CHAY DƯỠNG SINH):\n• Ẩm thực tại Chùa hoàn toàn từ thực vật tươi sạch, cân bằng ngũ hành, không chất bảo quản, kết hợp bài thuốc thảo dược tự nhiên.\n• Năm phép quán khi thọ trai: Nhớ ơn người gieo trồng, xét đức hạnh của mình, ngừa tâm tham sân si, xem thức ăn là vị thuốc chữa bệnh khô gầy, nuôi thân tu tập đạo giác ngộ.\n\n3. NỘI QUY & NẾP SỐNG THANH TỊNH:\n• Rửa tay sạch sẽ trước khi lấy cơm\n• Tuân thủ theo sự hướng dẫn sắp xếp của ban Trai soạn\n• Tắt chuông điện thoại, giữ gìn im lặng và chánh niệm khi ăn uống\n• Ăn từ tốn, không lãng phí thức ăn, dọn dẹp sạch sẽ sau khi dùng bữa.",
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
    description: "Không gian Sân Lâm Tỳ Ni tôn nghiêm tôn trí Tượng Đức Phật Đản Sinh một tay chỉ trời một tay chỉ đất cùng 4 ngôi Bảo Tháp hai bên.",
    fullContent: "Không gian Sân Lâm Tỳ Ni - Sân Đản Sinh tôn nghiêm:\n- Chính giữa: tôn thờ Tượng Đức Phật Đản Sinh, một tay chỉ trời một tay chỉ đất (“Thiên thượng thiên hạ, duy ngã độc tôn”).\n- Hai bên: An trí 4 ngôi Bảo Tháp trang nghiêm hộ trì không gian tu học.",
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
    name: "CỔNG TAM QUAN - SÂN DI LẶC",
    subtitle: "TAM GIẢI THOÁT MÔN & SÂN DI LẶC",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg",
    mapPos: { x: 12, y: 55 },
    description: "Cửa ngõ đầu tiên dẫn lối vào chốn thiêng gồm hệ thống Cổng Tam Quan uy nghi, kết nối qua cây Cầu Bát Chánh Đạo vượt dòng nước tịnh, dẫn lên Thềm Thất Thánh Tài và Sân Di Lặc - nơi tôn trí tôn tượng Bồ Tát Di Lặc hoan hỷ vô lượng.",
    fullContent: "CỬA NGÕ TÂM LINH: CỔNG TAM QUAN • CẦU BÁT CHÁNH ĐẠO • SÂN DI LẶC\n\n1. CỔNG TAM QUAN (TAM GIẢI THOÁT MÔN):\n• Đại diện cho ba cửa ngõ giải thoát của đạo Phật: Không Môn (Thấy rõ vạn pháp vô ngã), Vô Tướng Môn (Không chấp vào hình tướng bề ngoài), và Vô Tác/Vô Nguyện Môn (Tâm không mong cầu vọng niệm, an trú tự tại).\n\n2. CẦU BÁT CHÁNH ĐẠO & THỀM THẤT THÁNH TÀI:\n• Vượt qua dòng nước tịnh gột rửa trần tâm, tượng trưng cho 8 con đường chân chánh đưa đến chấm dứt khổ đau và 7 báu vật tâm linh quý báu của bậc Thánh.\n\n3. SÂN DI LẶC:\n• Nơi tôn trí đại tượng Bồ Tát Di Lặc mang nét cười hoan hỷ, nhắc nhở hành giả mở rộng tâm từ bi, bao dung và an lạc ngay khi bước chân vào chốn thiền môn.",
    statues: [
      {
        name: "DI LẶC BỒ TÁT",
        imgUrl: "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg",
        quote: "Nụ cười Di Lặc xua tan muộn phiền nhân thế, mở lòng từ bi ôm trọn vạn loại chúng sinh.",
        group: "Thanh Tịnh Đại Hải Chúng",
        cluster: "Cụm Di Lặc Tôn Phật",
        type: "TƯỢNG CHÍNH"
      },
      {
        name: "PHẬT DI LẶC (TƯỢNG GỖ)",
        imgUrl: "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/Phật Di Lặc - tượng gỗ.JPG",
        quote: "Nghệ thuật tạc tượng gỗ quý tôn vinh nét hoan hỷ bất tận của Đức Di Lặc.",
        group: "Thanh Tịnh Đại Hải Chúng",
        cluster: "Nghệ Thuật Phật Giáo",
        type: "NTPG"
      }
    ],
    stories: [],
  },
  {
    id: "13",
    pinNumber: 13,
    slug: "lang-xa-tam-linh",
    name: "KHÔNG GIAN TÂM LINH",
    subtitle: "VĂN HÓA LÀNG XÃ BẮC BỘ",
    temple: "tung-lam-hoa-phuc",
    templeName: "Tùng Lâm Hòa Phúc",
    imgUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=1100&h=600&fit=crop",
    mapPos: { x: 42, y: 57 },
    description: "Đình làng Trúc Đóng mang hồn quê Bắc Bộ xưa, khuôn viên cây đa cổ thụ, sân đình và hồ nước mênh mông, nơi tôn thờ các bậc tiền nhân mở làng dựng xóm.",
    fullContent: "KHÔNG GIAN TÂM LINH: VĂN HÓA LÀNG XÃ BẮC BỘ\n\nLà linh hồn của chốn làng quê Bắc Bộ xưa, đình làng Trúc Đóng được thành lập vào những năm đầu thế kỷ 19, với khuôn viên gồm có cây đa cổ thụ, sân đình, phía trước là hồ nước rộng mênh mông.\n\nĐây là nơi sinh hoạt tâm linh, văn hóa của làng, nơi tôn thờ các bậc tiền nhân có công khai hoang lập ấp mở làng dựng xóm và các vị anh hùng có công trong các cuộc kháng chiến vệ quốc, kết nối truyền thống Uống Nước Nhớ Nguồn muôn đời của dân tộc.",
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
