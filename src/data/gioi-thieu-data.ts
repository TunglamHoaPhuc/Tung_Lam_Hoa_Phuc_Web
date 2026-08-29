export interface GioiThieuTopicDetail {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  heroBanner: string;
  portraitImage: string;
  overviewSummary: string;
  quoteTitle: string;
  quoteContent: string[];
  quoteAuthor: string;
  milestones?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  mainContentHtml: string;
  galleryImages?: Array<{
    url: string;
    caption: string;
  }>;
  relatedLinks?: Array<{
    title: string;
    href: string;
    tag: string;
  }>;
}

export const GIOI_THIEU_DETAILS: Record<string, GioiThieuTopicDetail> = {
  'lich-su-tung-lam-hoa-phuc': {
    id: 'lich-su-tung-lam-hoa-phuc',
    slug: 'lich-su-tung-lam-hoa-phuc',
    title: 'LỊCH SỬ TÙNG LÂM HÒA PHÚC',
    subtitle: 'Nguồn gốc hình thành, các giai đoạn trùng tu và phát triển chốn thiền môn.',
    tag: 'Lịch Sử Bổn Tự',
    heroBanner: '/images/toan-canh-chua.jpg',
    portraitImage: '/images/trang-chu/đại - tiểu sám hối và thường kỳ.jpg',
    overviewSummary:
      'Chùa Hòa Phúc (Tùng Lâm Hòa Phúc) tọa lạc tại thôn Yên Nội, xã Đồng Trúc, huyện Thạch Thất, thành phố Hà Nội. Ngôi cổ tự nép mình bên sườn núi Vua Bà thanh bình, trải qua bao thăng trầm của lịch sử, nay đã chuyển mình trở thành một trong những trung tâm tu học Tịnh Độ trang nghiêm, hội tụ hàng ngàn Phật tử về quy ngưỡng mỗi tháng.',
    quoteTitle: 'TINH THẦN KIẾN TẠO ĐẠO TRÀNG',
    quoteContent: [
      'Lập chùa là tạo ra một cõi Tịnh độ giữa nhân gian.',
      'Ở đó, người già, người trẻ, người thương hay người chưa thương đều được mời về,',
      'cùng chung sống hòa hợp trong ánh sáng từ bi và trí tuệ của Phật Pháp.'
    ],
    quoteAuthor: 'Thượng tọa Thích Tâm Hòa',
    milestones: [
      {
        year: 'Thời Cổ Tự',
        title: 'Khởi Dựng Chốn Già Lam',
        description: 'Chùa Hòa Phúc vốn là ngôi chùa làng cổ kính, che chở đời sống tâm linh cho nhân dân thôn Yên Nội qua nhiều thế hệ.'
      },
      {
        year: 'Năm 2008',
        title: 'Đại Đức Thích Tâm Hòa Về Trụ Trì',
        description: 'Theo lời thỉnh nguyện của nhân dân và chính quyền địa phương, ĐĐ. Thích Tâm Hòa chính thức về tiếp quản, bắt đầu công cuộc tái thiết chốn tổ.'
      },
      {
        year: '2009 - 2018',
        title: 'Giai Đoạn Đại Trùng Tu Toàn Diện',
        description: 'Xây dựng Đại Hùng Bảo Điện, Thiền Đường, Tăng Xá, Nhà Khách, tôn tạo tượng Phật A Di Đà lộ thiên và kiến thiết cảnh quan sinh thái tâm linh.'
      },
      {
        year: 'Hiện Nay',
        title: 'Tùng Lâm Hòa Phúc - Đạo Tràng Tu Học Kiểu Mẫu',
        description: 'Phát triển các khóa tu Bát Quan Trai, Pháp hội Niệm Phật, Khóa tu Mùa hè thanh thiếu niên với quy mô hàng ngàn hành giả tham dự.'
      }
    ],
    mainContentHtml: `
      <h3>1. Vị Thế Địa Linh &amp; Cảnh Quan Thanh Tịnh</h3>
      <p>Nằm cách trung tâm thủ đô Hà Nội chừng 30km về phía Tây, Tùng Lâm Hòa Phúc được bao bọc bởi núi đồi trập trùng và không gian xanh mát. Khung cảnh non thanh thủy tú nơi đây tạo nên một môi trường lý tưởng cho người tu học gột rửa bụi trần, tìm lại sự an định trong tâm hồn.</p>
      
      <h3>2. Tinh Thần Hoằng Dương Chánh Pháp</h3>
      <p>Dưới sự hướng dẫn của Thượng tọa Trụ trì, Tùng Lâm Hòa Phúc không chỉ là nơi chiêm bái tâm linh mà còn là một trường học đạo đức nhân sinh. Tông chỉ tu học của bổn tự lấy Tịnh Độ làm nòng cốt, kết hợp Thiền quán và Giới luật tinh nghiêm, hướng dẫn Phật tử ứng dụng Phật pháp vào đời sống gia đình và xã hội.</p>
      
      <h3>3. Các Công Trình Kiến Trúc Tiêu Biểu</h3>
      <p>Khuôn viên chùa bao gồm: Đại Hùng Bảo Điện uy nghiêm, Giảng Đường Ngộ Chân Tử, Lầu Kinh Luân, Vườn tượng 33 Ứng Hóa Thân Quán Thế Âm, Bảo Tháp và khu trưng bày Bảo vật Triều Nguyễn cùng di sản văn hóa Phật giáo thuần Việt.</p>
    `,
    galleryImages: [
      { url: '/images/trang-chu/Cầu an quốc thái dân thường kỳ.jpg', caption: 'Khóa lễ cầu an quốc thái dân an tại Đại Hùng Bảo Điện' },
      { url: '/images/trang-chu/Đại lễ Vu Lan Báo Hiếu.JPG', caption: 'Đại chúng Phật tử trang nghiêm trong ngày Đại lễ Vu Lan' },
      { url: '/images/trang-chu/Pháp hội niệm Phật.jpg', caption: 'Hàng ngàn Phật tử vân tập tham dự Pháp hội Niệm Phật định kỳ' },
      { url: '/images/trang-chu/Lễ Tưởng Niệm Anh Hùng Liệt Sỹ 27.07.JPG', caption: 'Đại lễ tri ân và tưởng niệm các Anh hùng Liệt sĩ' }
    ]
  },

  'dai-su-lien-dang': {
    id: 'dai-su-lien-dang',
    slug: 'dai-su-lien-dang',
    title: 'ĐÔI NÉT VỀ ĐẠI SƯ LIÊN ĐĂNG',
    subtitle: 'Hành trạng và công hạnh của Đại sư Liên Đăng truyền thừa chánh pháp.',
    tag: 'Bậc Tiền Bối',
    heroBanner: '/images/toan-canh-chua.jpg',
    portraitImage: '/images/anh-tho-cac-vi-cao-tang/1.jpg',
    overviewSummary:
      'Đại sư Liên Đăng là bậc cao tăng thạc đức, ngọn đèn chánh pháp chiếu rọi muôn phương. Với tâm nguyện "Truyền đăng tục diệm, tiếp dẫn hậu lai", Đại sư đã cống hiến trọn cuộc đời cho sự nghiệp hoằng pháp lợi sinh, khai mở tuệ giác cho hàng vạn môn đồ đệ tử.',
    quoteTitle: 'LỜI DẠY CỦA ĐẠI SƯ',
    quoteContent: [
      'Ngọn đèn trí tuệ thắp sáng từ bi,',
      'Soi đường dẫn lối cho kẻ lầm mê.',
      'Sống giữa hồng trần không vướng bụi,',
      'Đóa sen thanh khiết ngát muôn phương.'
    ],
    quoteAuthor: 'Đại Sư Liên Đăng',
    milestones: [
      {
        year: 'Xuất Gia Tu Học',
        title: 'Sớm Tỏ Ngộ Lý Vô Thường',
        description: 'Đại sư phát tâm xuất gia từ thuở thiếu thời, chuyên tâm nghiên cứu Tam Tạng thánh điển và thực hành thiền định tinh nghiêm.'
      },
      {
        year: 'Hoằng Hóa',
        title: 'Thắp Sáng Đèn Thiền Tịnh Độ',
        description: 'Du hóa khắp nơi, kiến lập đạo tràng, truyền trao giới pháp và khuyến tấn đại chúng siêng năng niệm Phật cầu sinh Tịnh Độ.'
      },
      {
        year: 'Di Sản',
        title: 'Công Đức Lưu Danh Muôn Thuở',
        description: 'Tấm gương đạo hạnh và những lời khai thị giản dị mà sâu sắc của Đại sư mãi là kim chỉ nam cho thế hệ hậu học noi theo.'
      }
    ],
    mainContentHtml: `
      <h3>1. Cuộc Đời &amp; Đạo Nghiệp</h3>
      <p>Đại sư Liên Đăng là hiện thân của tinh thần tinh tấn và nhẫn nhục. Ngài luôn nhắc nhở đệ tử rằng: Đạo Phật không phải là lý thuyết suông trên trang giấy, mà là sự thực hành chuyển hóa thân tâm trong từng hơi thở và từng bước đi hàng ngày.</p>
      
      <h3>2. Tinh Thần Truyền Đăng Tục Diệm</h3>
      <p>Với hạnh nguyện nối dài mạch nguồn giáo pháp, Đại sư đặc biệt chú trọng việc đào tạo Tăng tài và giáo dục đạo đức Phật giáo cho giới trẻ. Tinh thần của Đại sư luôn hiện diện trong từng sinh hoạt tu học tại Tùng Lâm Hòa Phúc.</p>
    `,
    galleryImages: [
      { url: '/images/anh-tho-cac-vi-cao-tang/1.jpg', caption: 'Chân dung Đại Sư Liên Đăng' },
      { url: '/images/anh-tho-cac-vi-cao-tang/HÒA THƯỢNG THÍCH TỪ THÔNG (1928-2025).jpg', caption: 'Chư vị Trưởng lão Cao Tăng' }
    ]
  },

  'su-ong-hoang-phap': {
    id: 'su-ong-hoang-phap',
    slug: 'su-ong-hoang-phap',
    title: 'SƯ ÔNG HOẰNG PHÁP',
    subtitle: 'Ân đức giáo dưỡng và dấu ấn hoằng truyền Tịnh độ của Sư ông.',
    tag: 'Ân Sư Giáo Dưỡng',
    heroBanner: '/images/toan-canh-chua.jpg',
    portraitImage: '/images/anh-tho-cac-vi-cao-tang/2.jpg',
    overviewSummary:
      'Sư Ông Hoằng Pháp – bậc Trưởng lão tôn kính của Tổ đình Hoằng Pháp, vị Ân sư khả kính đã dày công khai sáng phong trào tu học Phật pháp hiện đại, đem ánh sáng Tịnh Độ nhân gian lan tỏa khắp mọi miền đất nước và hải ngoại.',
    quoteTitle: 'ÂM ĐỨC GIÁO DƯỠNG',
    quoteContent: [
      'Phụng sự nhân sinh là cúng dường chư Phật.',
      'Muốn Phật pháp trường tồn, người xuất gia phải có hoài bão lớn,',
      'lấy giới luật làm thầy, lấy hạnh nguyện độ sinh làm sự nghiệp cả cuộc đời.'
    ],
    quoteAuthor: 'Sư Ông Hoằng Pháp',
    milestones: [
      {
        year: 'Khai Sơn &amp; Tái Thiết',
        title: 'Xây Dựng Đạo Tràng Hoằng Pháp',
        description: 'Khởi xướng các khóa tu Phật Thất 7 ngày, quy tụ hàng vạn hành giả từ khắp mọi miền đất nước về tham dự.'
      },
      {
        year: 'Giáo Dục Tăng Tài',
        title: 'Đào Tạo Các Thế Hệ Đệ Tử',
        description: 'Tận tâm giáo dưỡng chư Tăng trẻ có đầy đủ đạo hạnh, tri thức và nhiệt huyết hoằng pháp, trong đó có Thượng tọa Thích Tâm Hòa.'
      },
      {
        year: 'Hoằng Pháp Hải Ngoại',
        title: 'Lan Tỏa Giáo Pháp Muôn Nơi',
        description: 'Tổ chức các chuyến thuyết pháp, in ấn hàng triệu bản kinh sách và phát hành băng đĩa giảng pháp miễn phí đến tận tay đồng bào.'
      }
    ],
    mainContentHtml: `
      <h3>1. Tấm Gương Giản Dị &amp; Khiêm Cung</h3>
      <p>Sư Ông Hoằng Pháp luôn là tấm gương mẫu mực về nếp sống thanh bần, cần kiệm và khiêm cung. Dù đạo tràng ngày một hưng thịnh, Sư Ông vẫn luôn dành tình thương yêu và sự ân cần chỉ dạy cho từng Phật tử từ nhỏ đến già.</p>
      
      <h3>2. Tầm Nhìn Chiến Lược Về Hoằng Pháp Hiện Đại</h3>
      <p>Sư Ông là người tiên phong áp dụng công nghệ truyền thông, xuất bản sách báo và tổ chức các khóa tu mùa hè cho thanh thiếu niên, đưa đạo Phật đi vào lòng thế hệ trẻ một cách tự nhiên và sinh động.</p>
    `,
    galleryImages: [
      { url: '/images/anh-tho-cac-vi-cao-tang/2.jpg', caption: 'Hình bóng tôn kính của Sư Ông Hoằng Pháp' },
      { url: '/images/anh-tho-cac-vi-cao-tang/Đại lão Hòa thượng Thích Thanh Đàm (1924-2022)  1 1 1.jpg', caption: 'Chư vị Trưởng lão Hòa Thượng thời đại' }
    ]
  },

  'su-phu-tru-tri': {
    id: 'su-phu-tru-tri',
    slug: 'su-phu-tru-tri',
    title: 'SƯ PHỤ TRỤ TRÌ - THÍCH TÂM HÒA',
    subtitle: 'Thầy Thích Tâm Hòa - Người kiến thiết và lãnh đạo đạo tràng Tùng Lâm Hòa Phúc.',
    tag: 'Trụ Trì Bổn Tự',
    heroBanner: '/images/toan-canh-chua.jpg',
    portraitImage: '/images/trang-chu/Pháp hội niệm Phật.jpg',
    overviewSummary:
      'Thượng tọa Thích Tâm Hòa – Viện chủ, Trụ trì Tùng Lâm Hòa Phúc. Với tâm nguyện son sắt nối tiếp bước chân của Chư Tổ và Ân Sư, Thầy đã phát tâm kiến tạo ngôi già lam Hòa Phúc từ mảnh đất hoang sơ trở thành trung tâm tâm linh Tịnh Độ trang nghiêm, ấm áp tình thương của muôn người con Phật.',
    quoteTitle: 'PHÁP NGỮ SƯ PHỤ',
    quoteContent: [
      'Chắp tay khấn nguyện âm thầm,',
      'Dân giàu, nước thịnh, thái bình thiên thu.',
      'Sống giữa đời thường biết thương yêu và hiểu biết,',
      'Đó chính là đóa sen thơm ngát dâng cúng Đức Từ Phụ.'
    ],
    quoteAuthor: 'Vô Trí - Thích Tâm Hòa',
    milestones: [
      {
        year: 'Năm 2008',
        title: 'Phát Nguyện Khởi Dựng Tùng Lâm',
        description: 'Về vùng đất Thạch Thất hoang sơ, vượt qua muôn vàn khó khăn gian khổ để đặt viên đá đầu tiên tái thiết chùa Hòa Phúc.'
      },
      {
        year: '2010 - 2020',
        title: 'Mở Rộng Phật Sự &amp; Từ Thiện Xã Hội',
        description: 'Kiến lập các khóa lễ sám hối thường kỳ, khóa tu một ngày an lạc, xây dựng các công trình phúc lợi và cứu trợ đồng bào thiên tai lũ lụt.'
      },
      {
        year: 'Hiện Tại',
        title: 'Hoằng Dương Tịnh Độ &amp; Văn Hóa Di Sản',
        description: 'Định hình phong cách kiến trúc thuần Việt, phục dựng di sản văn hóa Phật giáo triều Nguyễn và phát triển hệ sinh thái tu học toàn diện.'
      }
    ],
    mainContentHtml: `
      <h3>1. Tâm Nguyện Vì Đạo Pháp &amp; Dân Tộc</h3>
      <p>Thầy Thích Tâm Hòa luôn tâm niệm: Đạo Phật không tách rời đời sống dân tộc. Mỗi Phật tử đến chùa tu học không chỉ để cầu an cho bản thân, mà còn phải biết hiếu thuận với cha mẹ, sống có trách nhiệm với gia đình và cống hiến cho quê hương đất nước.</p>
      
      <h3>2. Tác Phẩm &amp; Lời Khai Thị</h3>
      <p>Thầy là tác giả của nhiều bộ giảng luận sâu sắc như <em>Khuyến Phát Bồ Đề Tâm Giảng Luận</em>, các tập thơ thiền và những bài pháp thoại thực tiễn giải quyết những bế tắc tâm lý cho giới trẻ trong đời sống hiện đại.</p>
    `,
    galleryImages: [
      { url: '/images/trang-chu/Pháp hội niệm Phật.jpg', caption: 'Thầy Thích Tâm Hòa khai thị trong Pháp hội Niệm Phật' },
      { url: '/images/trang-chu/Cầu an quốc thái dân thường kỳ.jpg', caption: 'Khóa lễ cầu an đầu năm tại Tùng Lâm Hòa Phúc' }
    ]
  },

  'tieu-su-su-to': {
    id: 'tieu-su-su-to',
    slug: 'tieu-su-su-to',
    title: 'TIỂU SỬ SƯ TỔ NGỘ CHÂN TỬ',
    subtitle: 'Tôn vinh cuộc đời tu tập và đạo nghiệp của chư vị Tổ Sư khai sơn.',
    tag: 'Khai Sơn Truyền Thừa',
    heroBanner: '/images/toan-canh-chua.jpg',
    portraitImage: '/images/anh-tho-cac-vi-cao-tang/2 (1).jpg',
    overviewSummary:
      'Cố Đại lão Hòa Thượng Ngộ Chân Tử – Khai sơn Tổ đình Hoằng Pháp (Hóc Môn, TP.HCM). Cuộc đời Ngài là một bài ca bất diệt về đức hi sinh, tinh tấn tu trì và lòng từ bi vô lượng dành cho hết thảy chúng sinh.',
    quoteTitle: 'LỜI RĂN DẠY CỦA SƯ TỔ',
    quoteContent: [
      'Uống nước nguồn tâm, nhớ ơn Tam Bảo.',
      'Một ngày không niệm Phật là một ngày uổng phí tấc bóng thời gian.',
      'Hãy lấy giới luật làm thầy, lấy sự thanh tịnh làm nơi nương tựa.'
    ],
    quoteAuthor: 'Sư Tổ Ngộ Chân Tử (1900 - 1988)',
    milestones: [
      {
        year: 'Năm 1957',
        title: 'Khai Sáng Tổ Đình Hoằng Pháp',
        description: 'Đặt nền móng xây dựng Tổ đình Hoằng Pháp, khởi đầu phong trào hoằng truyền pháp môn Tịnh Độ sâu rộng tại miền Nam.'
      },
      {
        year: '1960 - 1985',
        title: 'Cứu Giúp Trẻ Mồ Côi &amp; Nạn Dân',
        description: 'Thành lập Cô nhi viện Lục Hòa, nuôi dưỡng hàng trăm mảnh đời bất hạnh, thể hiện trọn vẹn tinh thần từ bi cứu khổ của đạo Phật.'
      },
      {
        year: 'Năm 1988 (16/10 Âm Lịch)',
        title: 'Viên Tịch Trong Chánh Niệm',
        description: 'Tổ sư xả báo thân an nhiên thị tịch, để lại niềm kính tiếc vô biên cho hàng triệu Tăng Ni, Phật tử cả nước.'
      }
    ],
    mainContentHtml: `
      <h3>1. Cuộc Đời Thanh Cao &amp; Đạo Hạnh</h3>
      <p>Sư Tổ Ngộ Chân Tử suốt đời giữ gìn giới luật tinh nghiêm, ngày đêm chuyên tâm niệm Phật. Dù trong thời kỳ chiến tranh loạn lạc hay hoàn cảnh khó khăn, Tổ vẫn kiên định dựng lập đạo tràng và mở rộng vòng tay che chở cho người nghèo khó.</p>
      
      <h3>2. Ngày Giỗ Tổ Truyền Thống</h3>
      <p>Hằng năm vào ngày 16 tháng 10 Âm lịch, chư Tăng và Phật tử Tùng Lâm Hòa Phúc đều hướng về Tổ đình dâng nén tâm hương tưởng niệm, khắc ghi đạo lý "Uống nước nhớ nguồn".</p>
    `,
    galleryImages: [
      { url: '/images/anh-tho-cac-vi-cao-tang/2 (1).jpg', caption: 'Di ảnh tôn nghiêm của Cố Sư Tổ Ngộ Chân Tử' },
      { url: '/images/trang-chu/Lễ Tưởng Niệm Anh Hùng Liệt Sỹ 27.07.JPG', caption: 'Lễ tưởng niệm công đức Tiền bối và Anh linh Liệt sĩ' }
    ]
  },

  'van-hoa-ung-xu': {
    id: 'van-hoa-ung-xu',
    slug: 'van-hoa-ung-xu',
    title: 'VĂN HÓA ỨNG XỬ THIỀN MÔN',
    subtitle: 'Quy củ, oai nghi tế hạnh và nếp sống đạo đức dành cho Phật tử viếng chùa.',
    tag: 'Thanh Quy Tự Viện',
    heroBanner: '/images/toan-canh-chua.jpg',
    portraitImage: '/images/trang-chu/cộng tu/1.jpg',
    overviewSummary:
      'Chốn thiền môn là nơi tôn nghiêm thanh tịnh. Văn hóa ứng xử của người Phật tử khi về chùa thể hiện nét đẹp đạo đức, sự khiêm cung và lòng tôn kính Tam Bảo, góp phần xây dựng một cộng đồng tu học an vui, thanh nhã.',
    quoteTitle: 'OAI NGHI TẾ HẠNH',
    quoteContent: [
      'Đi đứng nằm ngồi đều trong chánh niệm,',
      'Lời nói nhẹ nhàng, cử chỉ đoan trang.',
      'Vào chùa dứt hết muôn điều phiền não,',
      'Giữ lòng thanh tịnh, phúc báu miên trường.'
    ],
    quoteAuthor: 'Thanh Quy Tùng Lâm Hòa Phúc',
    milestones: [
      {
        year: 'Trang Phục',
        title: 'Trang Nghiêm, Kín Đáo',
        description: 'Mặc áo tràng lam, nâu hoặc trang phục kín đáo lịch sự. Không mặc áo sát nách, quần đùi, váy ngắn khi vào chốn tự viện.'
      },
      {
        year: 'Lời Nói',
        title: 'Ái Ngữ, Điềm Đạm',
        description: 'Giữ yên lặng nơi chánh điện, nói năng nhỏ nhẹ, chào hỏi quý Thầy và đồng tu bằng câu niệm "A Di Đà Phật" chắp tay cung kính.'
      },
      {
        year: 'Hành Vi',
        title: 'Giữ Gìn Vệ Sinh &amp; Cảnh Quan',
        description: 'Bỏ rác đúng nơi quy định, không hái hoa bẻ cành, bảo vệ cảnh quan môi trường và bảo vật tượng Phật trong chùa.'
      }
    ],
    mainContentHtml: `
      <h3>1. Ý Nghĩa Của Việc Giữ Gìn Oai Nghi</h3>
      <p>Oai nghi không phải là sự gò bó ép buộc, mà là phương tiện giúp ta thu thúc lục căn, lắng đọng tâm thức và biểu lộ sự tôn kính chân thật đối với Ba Ngôi Báu Phật - Pháp - Tăng.</p>
      
      <h3>2. Những Điều Cần Lưu Ý Khi Viếng Chùa</h3>
      <ul>
        <li><strong>Lễ Phật:</strong> Đứng thẳng trang nghiêm, hai tay chắp trước ngực, tâm hướng trọn vẹn vào tướng hảo quang minh của Đức Phật.</li>
        <li><strong>Xưng hô:</strong> Kính trọng gọi quý Tăng Ni là "Thầy", "Bạch Thầy" và xưng "Con".</li>
        <li><strong>Điện thoại:</strong> Chuyển sang chế độ rung hoặc im lặng khi bước vào giảng đường và các khóa lễ.</li>
      </ul>
    `,
    galleryImages: [
      { url: '/images/trang-chu/cộng tu/1.jpg', caption: 'Phật tử trang nghiêm trong trang phục áo tràng' },
      { url: '/images/trang-chu/đại - tiểu sám hối và thường kỳ.jpg', caption: 'Khóa lễ sám hối lục căn thanh tịnh' }
    ]
  }
};
