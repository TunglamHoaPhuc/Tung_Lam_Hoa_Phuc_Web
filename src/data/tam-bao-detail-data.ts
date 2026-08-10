export interface TamBaoStatue {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  imgUrl: string;
}

export interface TamBaoVideo {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationText: string;
  date: string;
  views: number;
}

export interface TamBaoSpaceImage {
  id: string;
  title: string;
  description: string;
  caption?: string;
  imgUrl: string;
  category: string;
}

export const TAM_BAO_STATUES: TamBaoStatue[] = [
  {
    id: "tb-1",
    title: "ĐỨC PHẬT THÍCH CA MÂU NI",
    subtitle: "Vô Thượng Năng Nhân",
    badge: "TƯỢNG CHÍNH",
    description: "Tôn tượng Đức Bản Sư Thích Ca Mâu Ni Phật tôn thờ tại Chánh Điện Tam Bảo Tùng Lâm Hòa Phúc.",
    imgUrl: "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg"
  },
  {
    id: "tb-2",
    title: "ĐỨC PHẬT A DI ĐÀ",
    subtitle: "Ánh Sáng Vô Lượng - Thọ Mạng Vô Lượng",
    badge: "TƯỢNG CHÍNH",
    description: "Tôn tượng Đức Phật A Di Đà phóng quang tiếp dẫn chúng sinh về cõi Tây Phương Tịnh Độ.",
    imgUrl: "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_A_DI_DA/TUONG_CHINH/duc_phat_a_di_da_tuong_chinh.JPG"
  },
  {
    id: "tb-3",
    title: "ĐỨC PHẬT DƯỢC SƯ LƯU LY",
    subtitle: "Giáo Chủ Cõi Đông Phương Tịnh Độ",
    badge: "TƯỢNG CHÍNH",
    description: "Đức Phật Dược Sư Lưu Ly Quang Vương Như Lai với 12 đại nguyện cứu độ chữa lành bệnh tật thân tâm.",
    imgUrl: "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/Phật Dược Sư Lưu Ly Quang Vương Như Lai_tuong_chinh.JPG"
  },
  {
    id: "tb-4",
    title: "ĐỨC PHẬT TỲ LÔ GIÁ NA",
    subtitle: "Đại Nhật Như Lai",
    badge: "TƯỢNG CHÍNH",
    description: "Đức Phật Tỳ Lô Giá Na biểu tượng cho Pháp Thân thanh tịnh chiếu soi khắp vũ trụ vô biên.",
    imgUrl: "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG"
  },
  {
    id: "tb-5",
    title: "QUÁN THẾ ÂM BỒ TÁT",
    subtitle: "Đại Từ Đại Bi Cứu Khổ Cứu Nạn",
    badge: "BỒ TÁT",
    description: "Tôn tượng Quán Thế Âm Bồ Tát Nguyệt Trí thanh tịnh lắng nghe tiếng kêu cầu của chúng sinh.",
    imgUrl: "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg"
  },
  {
    id: "tb-6",
    title: "ĐẠI THẾ CHÍ BỒ TÁT",
    subtitle: "Trí Tuệ Quang Minh Tiếp Dẫn",
    badge: "BỒ TÁT",
    description: "Đại Thế Chí Bồ Tát dùng ánh sáng trí tuệ chiếu soi khắp mười phương, tiếp dẫn chúng sinh an lạc.",
    imgUrl: "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG"
  },
  {
    id: "tb-7",
    title: "ĐỊA TẠNG VƯƠNG BỒ TÁT",
    subtitle: "Địa Ngục Vị Không Thề Không Thành Phật",
    badge: "BỒ TÁT",
    description: "Tôn tượng Địa Tạng Bồ Tát mang đại nguyện cứu độ tất cả chúng sinh trong cảnh giới đau khổ.",
    imgUrl: "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG"
  },
  {
    id: "tb-8",
    title: "DI LẶC BỒ TÁT",
    subtitle: "Đương Lai Hạ Sinh Di Lặc Tôn Phật",
    badge: "BỒ TÁT",
    description: "Bồ Tát Di Lặc mang nụ cười từ bi hoan hỷ, biểu tượng cho sự an lạc và hy vọng tương lai.",
    imgUrl: "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg"
  }
];

export const TAM_BAO_VIDEOS: TamBaoVideo[] = [
  {
    id: "vid-tb-1",
    title: "Phim Tư Liệu: Khám Phá Kiến Trúc Tôn Nghiêm Chánh Điện Tam Bảo",
    summary: "Thuyết minh chi tiết về nghệ thuật tạc tượng và không gian tôn thờ tại Chánh Điện.",
    thumbnailUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    durationText: "15:30",
    date: "15/08/2023",
    views: 12500
  }
];

export const TAM_BAO_SPACES: TamBaoSpaceImage[] = [
  {
    id: "sp-tb-1",
    title: "Khuôn Viên Chánh Điện Tam Bảo",
    description: "Không gian trang nghiêm thanh tịnh là nơi diễn ra các khóa tu tụng kinh bái sám.",
    imgUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop",
    category: "CHÁNH ĐIỆN"
  },
  {
    id: "sp-tb-2",
    title: "Sân Thiền Hành Tam Bảo",
    description: "Khuôn viên tĩnh mịch cho chư Tăng và Phật tử thiền hành chánh niệm.",
    imgUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop",
    category: "SÂN THIỀN"
  }
];
