export interface BatBoKimCangItem {
  id: string;
  code: string;
  name: string;
  sanskritName: string;
  meaning: string;
  imgUrl: string;
  quote?: string;
  quoteAuthor?: string;
  areaName?: string;
  location?: string;
  description?: string;
  fullHistoryHtml?: string;
}

export const BAT_BO_KIM_CANG_DATA: BatBoKimCangItem[] = [
  {
    id: "KC01",
    code: "KC01",
    name: "Bất Động Kim Cang",
    sanskritName: "Acalanātha",
    meaning: "Biểu tượng của Tâm Định Bất Động, uy lực chém đứt vô minh phiền não",
    imgUrl: "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/bat_dong_kim_cuong.jpg",
    quote: "Tâm kiên cố như Kim Cang, không một chướng duyên nào lay chuyển.",
    quoteAuthor: "Mật Tạng Kim Cang Thừa",
    areaName: "Khu Vực Tam Bảo • Tùng Lâm Hòa Phúc",
    location: "Tam Bảo",
    description: "Bất Động Kim Cang mang uy lực bất biến của định lực và trí tuệ, chém đứt vô minh và che chở hành giả.",
    fullHistoryHtml: "<p>Bất Động Kim Cang (Acalanātha) là vị Tôn uy mãnh biểu trưng cho Trí Tuệ Định Tĩnh và Đại Nguyện kiên cố không thoái chuyển. Ngài tay cầm bảo kiếm chém đứt mọi vọng tưởng vô minh, dây thòng lọng trói buộc ma chướng, bảo hộ người tu học luôn an định trong Chánh Pháp.</p>"
  },
  {
    id: "KC02",
    code: "KC02",
    name: "Bộ Trịch Kim Cang",
    sanskritName: "Ucchuṣma / Bộc Trạch",
    meaning: "Tay cầm chày Kim Cang, hộ trì Chánh Pháp và bảo vệ hành giả",
    imgUrl: "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/bo_trich_kim_cuong.jpg",
    quote: "Dũng mãnh đoạn trừ uế trược, chuyển hóa phiền não thành bồ đề thanh tịnh.",
    quoteAuthor: "Mật Tạng Kim Cang Thừa",
    areaName: "Khu Vực Tam Bảo • Tùng Lâm Hòa Phúc",
    location: "Tam Bảo",
    description: "Bộ Trịch Kim Cang mang oai lực thanh tịnh tuyệt đối, thiêu rụi mọi cấu uế và chướng nạn.",
    fullHistoryHtml: "<p>Bộ Trịch Kim Cang (Ucchuṣma) mang oai lực thanh tịnh tuyệt đối, thiêu rụi mọi cấu uế và chướng nạn. Ngài xuất hiện với tướng phẫn nộ từ bi, hộ trì giới hạnh trang nghiêm của chốn tùng lâm và bảo bọc người hành đạo.</p>"
  },
  {
    id: "KC03",
    code: "KC03",
    name: "Đại Luân Kim Cang",
    sanskritName: "Mahācakra",
    meaning: "Xoay chuyển bánh xe Pháp Luân Kim Cang, đập tan mọi chướng duyên",
    imgUrl: "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/dai_luan_kim_cuong.jpg",
    quote: "Bánh xe Kim Cang chuyển hóa luân hồi, phá tan thành trì mê muội.",
    quoteAuthor: "Mật Tạng Kim Cang Thừa",
    areaName: "Khu Vực Tam Bảo • Tùng Lâm Hòa Phúc",
    location: "Tam Bảo",
    description: "Đại Luân Kim Cang tay cầm Pháp Luân sắc bén, đập tan mọi kiến chấp sai lầm và tà đạo.",
    fullHistoryHtml: "<p>Đại Luân Kim Cang (Mahācakra) tay cầm Pháp Luân sắc bén, tượng trưng cho sự vận hành không ngừng nghỉ của Chân Lý Bất Diệt. Ngài đập tan mọi kiến chấp sai lầm và tà đạo, mở rộng con đường giác ngộ.</p>"
  },
  {
    id: "KC04",
    code: "KC04",
    name: "Đại Tế Kim Cang",
    sanskritName: "Amṛtakuṇḍali / Đại Tiêu",
    meaning: "Ánh sáng ngọn lửa Kim Cang dẹp trừ tâm độc và chướng tà",
    imgUrl: "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/dai_tieu_kim_cuong.jpg",
    quote: "Lửa Cam Lồ Kim Cang thanh lọc độc tố nơi ba nghiệp thân khẩu ý.",
    quoteAuthor: "Mật Tạng Kim Cang Thừa",
    areaName: "Khu Vực Tam Bảo • Tùng Lâm Hòa Phúc",
    location: "Tam Bảo",
    description: "Đại Tế Kim Cang mang năng lượng Cam Lồ vi diệu và ngọn lửa Kim Cang bất diệt.",
    fullHistoryHtml: "<p>Đại Tế Kim Cang (Amṛtakuṇḍali) mang năng lượng Cam Lồ vi diệu và ngọn lửa Kim Cang bất diệt. Ngài tiêu trừ độc tố tham, sân, si và bảo vệ sức khỏe, tâm an lạc cho muôn loài.</p>"
  },
  {
    id: "KC05",
    code: "KC05",
    name: "Đại Uy Đức Kim Cang",
    sanskritName: "Yamāntaka",
    meaning: "Uy lực vĩ đại chiến thắng sinh tử, ban bình an hỷ lạc",
    imgUrl: "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/dai_uy_duc_kim_cuong.jpg",
    quote: "Chiến thắng nỗi sợ hãi sinh tử, chứng đắc cảnh giới đại an lạc vô úy.",
    quoteAuthor: "Mật Tạng Kim Cang Thừa",
    areaName: "Khu Vực Tam Bảo • Tùng Lâm Hòa Phúc",
    location: "Tam Bảo",
    description: "Đại Uy Đức Kim Cang biểu thị cho sức mạnh đoạn tận cội rễ luân hồi và sợ hãi.",
    fullHistoryHtml: "<p>Đại Uy Đức Kim Cang (Yamāntaka) biểu thị cho sức mạnh đoạn tận cội rễ luân hồi và sợ hãi. Ngài ban cho hành giả tâm vô úy kiên cường, vượt qua mọi nghịch cảnh thử thách trên đường tu tập.</p>"
  },
  {
    id: "KC06",
    code: "KC06",
    name: "Hàng Tam Thế Kim Cang",
    sanskritName: "Trailokyavijaya / Giáng Tam Thế",
    meaning: "Hàng phục ba cõi tham - sân - si, đưa tâm về thanh tịnh",
    imgUrl: "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/giang_tam_the_kim_cuong.jpg",
    quote: "Hàng phục ba cõi mê lầm, quy phục vạn pháp về với chân tâm tịch tĩnh.",
    quoteAuthor: "Mật Tạng Kim Cang Thừa",
    areaName: "Khu Vực Tam Bảo • Tùng Lâm Hòa Phúc",
    location: "Tam Bảo",
    description: "Hàng Tam Thế Kim Cang là vị Hộ Pháp tối thượng hàng phục ba độc lớn nhất trong tam giới: Tham, Sân và Si.",
    fullHistoryHtml: "<p>Hàng Tam Thế Kim Cang (Trailokyavijaya) là vị Hộ Pháp tối thượng hàng phục ba độc lớn nhất trong tam giới: Tham, Sân và Si. Ngài là bức tường thành vững chãi bảo vệ Tam Bảo Tùng Lâm Hòa Phúc.</p>"
  },
  {
    id: "KC07",
    code: "KC07",
    name: "Mã Đầu Kim Cang",
    sanskritName: "Hayagrīva",
    meaning: "Hóa thân Dược Vương chữa lành bệnh tật và trừ độc ma",
    imgUrl: "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/ma_dau_kim_cuong.jpg",
    quote: "Tiếng hí Kim Cang đánh thức muôn loài thoát khỏi giấc mộng dài tăm tối.",
    quoteAuthor: "Mật Tạng Kim Cang Thừa",
    areaName: "Khu Vực Tam Bảo • Tùng Lâm Hòa Phúc",
    location: "Tam Bảo",
    description: "Mã Đầu Kim Cang là hiện thân uy lực của Quán Thế Âm Bồ Tát, chữa lành bệnh tật và trừ độc ma.",
    fullHistoryHtml: "<p>Mã Đầu Kim Cang (Hayagrīva) là hiện thân uy lực của Quán Thế Âm Bồ Tát, mang tiếng hí Kim Cang làm kinh sợ loài ma tà, tiêu trừ dịch bệnh và chữa lành thương tổn thân tâm cho chúng sinh.</p>"
  },
  {
    id: "KC08",
    code: "KC08",
    name: "Vô Năng Thắng Kim Cang",
    sanskritName: "Aparājita",
    meaning: "Sức mạnh Trí Tuệ Kim Cang tối thắng không ma chướng nào đánh bại",
    imgUrl: "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/vo_nang_thang_kim_cuong.jpg",
    quote: "Bất khả chiến bại trước vô minh, chiếu soi rực rỡ khắp mười phương.",
    quoteAuthor: "Mật Tạng Kim Cang Thừa",
    areaName: "Khu Vực Tam Bảo • Tùng Lâm Hòa Phúc",
    location: "Tam Bảo",
    description: "Vô Năng Thắng Kim Cang tượng trưng cho Trí Tuệ Bát Nhã vô song không bất kỳ chướng duyên nào khuất phục.",
    fullHistoryHtml: "<p>Vô Năng Thắng Kim Cang (Aparājita) tượng trưng cho Trí Tuệ Bát Nhã vô song không bất kỳ chướng duyên hay cám dỗ trần gian nào có thể khuất phục, hộ trì Chánh Pháp mãi mãi hưng thịnh.</p>"
  }
];
