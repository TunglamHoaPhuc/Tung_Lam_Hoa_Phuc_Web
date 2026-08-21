export interface SpaceGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  caption?: string;
  imgUrl: string;
  category: string;
  areaCode: string;
  description?: string;
}

export const BAO_TANG_BACKGROUND_IMAGE =
  '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/triển lãm sư tổ ngộ chân tử.JPG';

export const BAO_TANG_SPACE_ITEMS: SpaceGalleryItem[] = [
  {
    id: 'bt-space-1',
    title: 'Tượng pháp nghệ thuật',
    subtitle: 'Bộ sưu tập tượng pháp và kinh sách quý',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/tượng pháp nghệ thuật.jpg',
    category: 'TRÀ ĐẠO & KHÔNG GIAN',
    areaCode: 'BAO_TANG',
    description: 'Tượng Phật và Bồ Tát chế tác tinh vi mang đậm dấu ấn mỹ thuật điêu khắc cổ truyền.',
  },
  {
    id: 'bt-space-2',
    title: 'Các chú thích Phật giáo',
    subtitle: 'Mỗi điểm tượng đều có chú thích ý nghĩa để tu học',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/các chú thích phật giáo.jpg',
    category: 'KỶ VẬT SƯ TỔ & TRIỂN LÃM',
    areaCode: 'BAO_TANG',
    description: 'Hệ thống chú giải chi tiết giúp Phật tử và du khách thập phương thấu hiểu sâu sắc giáo lý và đạo nghiệp tu học.',
  },
  {
    id: 'bt-space-3',
    title: 'Dụng cụ của Sư Tổ',
    subtitle: 'Các đồ dùng cổ được lưu giữ tại chùa',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/dụng cụ của sư tổ.jpg',
    category: 'KỶ VẬT SƯ TỔ & TRIỂN LÃM',
    areaCode: 'BAO_TANG',
    description: 'Những vật dụng sinh hoạt giản dị gắn liền với năm tháng hành đạo và hoằng hóa của Sư Tổ.',
  },
  {
    id: 'bt-space-4',
    title: 'Hiện vật cổ',
    subtitle: 'Bát dùng hằng ngày',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/hiện vật cổ - bát.JPG',
    category: 'HIỆN VẬT CỔ',
    areaCode: 'BAO_TANG',
    description: 'Chiếc bát ăn cổ thể hiện nếp sống thanh bần, tri túc của người tu sĩ chốn già lam xưa.',
  },
  {
    id: 'bt-space-5',
    title: 'Hiện vật cổ',
    subtitle: 'Gạch xây chùa',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/hiện vật cổ - gạch.JPG',
    category: 'HIỆN VẬT CỔ',
    areaCode: 'BAO_TANG',
    description: 'Những viên gạch cổ mang dấu ấn thời gian trong các giai đoạn kiến thiết và trùng tu bổn tự.',
  },
  {
    id: 'bt-space-6',
    title: 'Hiện vật cổ',
    subtitle: 'Lư hương',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/hiện vật cổ - lư hương 2.JPG',
    category: 'HIỆN VẬT CỔ',
    areaCode: 'BAO_TANG',
    description: 'Lư hương đồng cổ phụng thờ trong chốn Phật đường với hoa văn chạm khắc tinh xảo.',
  },
  {
    id: 'bt-space-7',
    title: 'Hiện vật cổ',
    subtitle: 'Ngói xây chùa',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/hiện vật cổ - ngói.JPG',
    category: 'HIỆN VẬT CỔ',
    areaCode: 'BAO_TANG',
    description: 'Mẫu ngói mũi hài cổ kính lưu giữ giá trị kiến trúc truyền thống thuần Việt.',
  },
  {
    id: 'bt-space-8',
    title: 'Không gian trưng bày theo chủ đề',
    subtitle: 'Triển lãm đặc trưng cho các sự kiện, đại lễ như Giỗ Tổ, Phật Đản, v.v.',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/không gian trưng bày theo chủ đề.jpg',
    category: 'TRÀ ĐẠO & KHÔNG GIAN',
    areaCode: 'BAO_TANG',
    description: 'Không gian trưng bày biến chuyển linh hoạt theo từng mùa đại lễ thiêng liêng.',
  },
  {
    id: 'bt-space-9',
    title: 'Các kinh điển bằng tiếng cổ',
    subtitle: 'Bộ sưu tập kinh điển cổ bằng các ngôn ngữ cổ',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/kinh bằng tiếng cổ.jpg',
    category: 'KINH ĐIỂN & PHÁP KHÍ',
    areaCode: 'BAO_TANG',
    description: 'Bộ sưu tập Pháp bảo kinh điển chép tay trên lá bối và giấy dó bằng văn tự cổ ngàn xưa.',
  },
  {
    id: 'bt-space-10',
    title: 'Nghệ thuật trà của các nước trên thế giới',
    subtitle: 'Bộ sưu tập trà đạo của các nước - đại diện cho văn hóa của từng nước',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/nghệ thuật trà của các nước.JPG',
    category: 'TRÀ ĐẠO & KHÔNG GIAN',
    areaCode: 'BAO_TANG',
    description: 'Không gian Thiền Trà quy tụ dụng cụ trà đạo đặc sắc của nhiều nền văn hóa phương Đông.',
  },
  {
    id: 'bt-space-11',
    title: 'Pháp khí thiền gia',
    subtitle: 'Pháp khí trang nghiêm chốn thiền môn',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/pháp khí thiền gia.jpg',
    category: 'KINH ĐIỂN & PHÁP KHÍ',
    areaCode: 'BAO_TANG',
    description: 'Chuông, mõ, khánh và pháp khí trợ đạo giúp hành giả nhiếp tâm vào thời khóa tu tập.',
  },
  {
    id: 'bt-space-12',
    title: 'Tranh thư pháp nghệ thuật',
    subtitle: 'Bồ Đề Đạt Ma Sư Tổ',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/tranh thư pháp nghệ thuật.jpg',
    category: 'TRANH THƯ PHÁP',
    areaCode: 'BAO_TANG',
    description: 'Nét bút thủy mặc tái hiện thần thái uy nghiêm, siêu thoát của Sơ Tổ Thiền Tông Tây Thiên Đông Độ.',
  },
  {
    id: 'bt-space-13',
    title: 'Tranh thư pháp nghệ thuật',
    subtitle: 'Chữ Hòa',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/tranh thư pháp nghệ thuật 2.jpg',
    category: 'TRANH THƯ PHÁP',
    areaCode: 'BAO_TANG',
    description: 'Bức thư pháp tâm đắc biểu trưng cho tinh thần Lục Hòa cộng trụ và hòa hợp an vui của Tùng Lâm.',
  },
  {
    id: 'bt-space-14',
    title: 'Triển lãm Sư Tổ Ngộ Chân Tử',
    subtitle: 'Sưu tập ảnh và hiện vật liên quan đến Sư Tổ',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/triển lãm sư tổ ngộ chân tử.JPG',
    category: 'KỶ VẬT SƯ TỔ & TRIỂN LÃM',
    areaCode: 'BAO_TANG',
    description: 'Khu vực triển lãm trang trọng tôn vinh cuộc đời, công hạnh và đạo nghiệp khai sơn của Sư Tổ.',
  },
  {
    id: 'bt-space-15',
    title: 'Tư tưởng chủ đạo triều đại nhà Lý',
    subtitle: 'Các câu Quote nổi tiếng gắn liền với ý nghĩa trọng tâm của Bảo tàng',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/tư tưởng chủ đạo triều đại nhà Lý.jpg',
    category: 'TRÀ ĐẠO & KHÔNG GIAN',
    areaCode: 'BAO_TANG',
    description: 'Những lời huấn thị và triết lý Phật giáo nhập thế rực rỡ thời Lý đồng hành cùng sự thịnh trị của quốc gia.',
  },
  {
    id: 'bt-space-16',
    title: 'Băng đĩa hoằng pháp',
    subtitle: 'Bộ sưu tập băng đĩa Phật giáo',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/không gian bảo tàng/băng đĩa hoằng pháp.jpg',
    category: 'KINH ĐIỂN & PHÁP KHÍ',
    areaCode: 'BAO_TANG',
    description: 'Kho tư liệu lưu trữ các băng đĩa pháp âm, bài giảng Phật pháp của chư tôn đức qua nhiều thời kỳ.',
  },
];
