export interface BaoThapFloor {
  id: string;
  floorNumber: number;
  floorName: string;
  mandalaName: string;
  statueName: string;
  statueSubtitle: string;
  statueImg: string;
  mandalaImg: string;
  mandalaMeaning: string;
  statueDescription: string;
  stories: string;
  hotspot: { x: number; y: number }; // percentage on so-do-bao-thap.webp
}

export const BAO_THAP_MAP_IMAGE = '/images/vu-tru-phat-giao/bao-thap/so-do-bao-thap.webp';
export const BAO_THAP_BANNER_IMAGE = '/images/vu-tru-phat-giao/bao-thap/bao-thap-banner.jpg';

export const BAO_THAP_FLOORS: BaoThapFloor[] = [
  {
    id: 'tang-1',
    floorNumber: 1,
    floorName: 'TẦNG 1',
    mandalaName: 'Mandala Quan Âm Bồ Tát',
    statueName: 'Tượng Quan Âm Thiên Thủ Thiên Nhãn',
    statueSubtitle: 'Đại Bi Cứu Khổ Nhân Sinh',
    statueImg:
      '/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu_thien_nhan_dang_dung.jpg',
    mandalaImg: '/images/vu-tru-phat-giao/bao-thap/mandala-tang-1-quan-am-bo-tat.webp',
    mandalaMeaning:
      'Mạn Đà La Quan Thế Âm Bồ Tát biểu trưng cho Đại Bi Tâm vô lượng vô biên, hóa thân nghìn mắt nghìn tay soi thấu và cứu vớt muôn loài thoát khỏi trầm luân đau khổ.',
    statueDescription:
      'Tôn tượng Đức Quan Âm Thiên Thủ Thiên Nhãn uy nghiêm, tay cầm các pháp khí trợ đạo, mắt thấu suốt mười phương, ban bố sự an lành và chở che cho Phật tử thập phương.',
    stories:
      'Tầng 1 là cửa ngõ đầu tiên dẫn lối vào Bảo Tháp, nơi Phật tử phát khởi lòng từ bi rộng lớn trước khi bước lên các tầng giới cao hơn của tháp báu.',
    hotspot: { x: 49.3, y: 73.0 },
  },
  {
    id: 'tang-2',
    floorNumber: 2,
    floorName: 'TẦNG 2',
    mandalaName: 'Mandala Tây Phương Cực Lạc',
    statueName: 'Tượng Đại Nhật Như Lai',
    statueSubtitle: 'Pháp Thân Thanh Tịnh Soi Khắp Pháp Giới',
    statueImg: '/images/vu-tru-phat-giao/bao-thap/Tượng Đại Nhật Như Lai.JPG',
    mandalaImg: '/images/vu-tru-phat-giao/bao-thap/mandala-tang-2-tay-phuong-cuc-lac.webp',
    mandalaMeaning:
      'Mạn Đà La Tây Phương Cực Lạc tái hiện cảnh giới Tịnh Độ trang nghiêm thanh tịnh của Đức Phật A Di Đà với ao Thất Bảo, sen báu cửu phẩm và ánh sáng vi diệu.',
    statueDescription:
      'Tôn tượng Đức Phật Đại Nhật Như Lai (Mahavairocana) thủ ấn Trí Quyền, biểu trưng cho Trí Tuệ Viên Mãn và Pháp Thân thanh tịnh bất sinh bất diệt.',
    stories:
      'Không gian tôn nghiêm giúp hành giả tĩnh tâm niệm Phật, nuôi dưỡng tâm nguyện vãng sinh Tịnh Độ và thành tựu Phật quả.',
    hotspot: { x: 49.3, y: 62.0 },
  },
  {
    id: 'tang-3',
    floorNumber: 3,
    floorName: 'TẦNG 3',
    mandalaName: 'Mandala Đa Bảo Như Lai',
    statueName: 'Tượng đức Phật Thích Ca, Bảo Tháp và kinh Diệu Pháp Liên Hoa',
    statueSubtitle: 'Pháp Hoa Tam Muội - Khai Thị Chúng Sinh',
    statueImg:
      '/images/vu-tru-phat-giao/bao-thap/Tượng đức Phật Thích Ca, báo Tháp và kinh Diệu Pháp Liên Hoa.JPG',
    mandalaImg: '/images/vu-tru-phat-giao/bao-thap/mandala-tang-3-da-bao-nhu-lai.webp',
    mandalaMeaning:
      'Mạn Đà La Đa Bảo Như Lai biểu hiện sự ấn chứng chân lý tối thượng của kinh Diệu Pháp Liên Hoa, khẳng định mọi chúng sinh đều có Phật tánh và khả năng thành Phật.',
    statueDescription:
      'Tôn tượng Đức Phật Thích Ca Mâu Ni đồng tọa cùng Đức Phật Đa Bảo trong tháp báu bảy báu nhiệm màu, tôn vinh Pháp Bảo kinh Diệu Pháp Liên Hoa.',
    stories:
      'Tái hiện khoảnh khắc thiêng liêng khi tháp Phật Đa Bảo từ lòng đất vọt lên giữa hư không để tán thán Phật Thích Ca thuyết kinh Pháp Hoa.',
    hotspot: { x: 49.3, y: 52.8 },
  },
  {
    id: 'tang-4',
    floorNumber: 4,
    floorName: 'TẦNG 4',
    mandalaName: 'Mandala Đại Hắc Thiên Mahakala',
    statueName: 'Tượng Tam Thế Phật',
    statueSubtitle: 'Tam Phương Tam Thế - Hộ Trì Chánh Pháp',
    statueImg: '/images/vu-tru-phat-giao/bao-thap/Tượng Tam Thế Phật.JPG',
    mandalaImg: '/images/vu-tru-phat-giao/bao-thap/mandala-tang-4-dai-hac-thien-mahakala.webp',
    mandalaMeaning:
      'Mạn Đà La Đại Hắc Thiên Mahakala - vị Hộ Pháp uy mãnh tối thượng hàng phục ma chướng, bảo vệ chánh pháp trường tồn và hộ trì người tu hành bình an.',
    statueDescription:
      'Tôn tượng Tam Thế Chư Phật (Phật Quá Khứ Ca Diếp, Phật Hiện Tại Thích Ca, Phật Vị Lai Di Lặc) biểu trưng cho trí tuệ và giác ngộ bất diệt qua ba thời gian.',
    stories:
      'Tầng 4 nhắc nhở người tu học về quy luật nhân quả ba đời, đồng thời nhận được sự gia hộ kiên cố từ chư vị Hộ pháp Mật tông.',
    hotspot: { x: 49.3, y: 43.8 },
  },
  {
    id: 'tang-5',
    floorNumber: 5,
    floorName: 'TẦNG 5',
    mandalaName: 'Mandala Thập Chủng Tử Kalachakra',
    statueName: 'Bảo tháp Srilanka',
    statueSubtitle: 'Xá Lợi Phật Tối Thượng - Thời Luân Kim Cương',
    statueImg: '/images/vu-tru-phat-giao/bao-thap/Bảo tháp Srilanka.JPG',
    mandalaImg: '/images/vu-tru-phat-giao/bao-thap/mandala-tang-5-thap-chung-tu-kalachakra.webp',
    mandalaMeaning:
      'Mạn Đà La Thập Chủng Tử Kalachakra (Thời Luân Kim Cương) kết tinh tinh hoa tối thượng của Mật giáo, chuyển hóa thời gian và không gian hướng tới Đại Hòa Bình thế giới.',
    statueDescription:
      'Bảo tháp ngọc tôn thờ Xá Lợi Đức Phật Thích Ca Mâu Ni được rước từ Srilanka - bảo vật linh thiêng vô giá ngự trên đỉnh tháp cao nhất.',
    stories:
      'Đỉnh cao của Bảo Tháp - nơi linh khí trời đất hội tụ, tỏa chiếu năng lượng an lành, xua tan tai ương và cầu nguyện hòa bình cho quốc thái dân an.',
    hotspot: { x: 49.3, y: 35.5 },
  },
];
