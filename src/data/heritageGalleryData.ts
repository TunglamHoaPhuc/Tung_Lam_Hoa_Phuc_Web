export type RegionType = 'ALL' | 'BAC' | 'TRUNG' | 'NAM';
export type ThemeType = 'DOI_SONG' | 'PHAT_GIAO';

export interface HeritagePhotoItem {
  id: string;
  title: string;
  yearStr: string;
  yearNum: number;
  region: 'BAC' | 'TRUNG' | 'NAM';
  theme: ThemeType;
  category: string;
  imgUrl: string;
  caption?: string;
  historicalContext?: string;
  locationName: string;
  compareImgUrl?: string;
  audioHeritageType?: 'CHIEU_CHUONG' | 'TAU_DIEN' | 'PHO_XUA' | 'SONG_NUOC';
}

export interface HeritageBentoCluster {
  id: string;
  title: string;
  subtitle: string;
  eraStr: string;
  yearStart: number;
  yearEnd: number;
  region: 'BAC' | 'TRUNG' | 'NAM';
  theme: ThemeType;
  heroImg: string;
  heroTitle: string;
  heroCaption: string;
  satelliteImgs: Array<{
    title: string;
    imgUrl: string;
    caption?: string;
  }>;
  totalDocuments: number;
  historicalQuote: string;
  quoteAuthor?: string;
  locationName: string;
  compareBeforeImg?: string;
  compareAfterImg?: string;
  compareLabelBefore?: string;
  compareLabelAfter?: string;
}

export const HERITAGE_MAP_IMAGE = '/images/vu-tru-phat-giao/ban-do-danh-tang-viet-nam-final.png';

// ── 6 CHÙM BENTO CHỦ ĐẠO (BENTO CLUSTERS) THEO QUY HOẠCH SỰ KIỆN ──
export const HERITAGE_BENTO_CLUSTERS: HeritageBentoCluster[] = [
  // 1. MIỀN BẮC - ĐỜI SỐNG (1900 - 1930)
  {
    id: 'cluster-bac-doisong-1900',
    title: 'Đời Sống & Sinh Hoạt Xưa',
    subtitle: 'Nét thanh lịch Kẻ Chợ, gánh gồng mưu sinh và hội hè đình đám châu thổ Bắc Bộ',
    eraStr: '1900 — 1930',
    yearStart: 1900,
    yearEnd: 1930,
    region: 'BAC',
    theme: 'DOI_SONG',
    heroImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Chợ phiên Bắc bộ xưa.jpg',
    heroTitle: 'Chợ Phiên Đồng Bằng Bắc Bộ',
    heroCaption: 'Bức tranh sống động về nét sinh hoạt giao thương thuần hậu của người dân châu thổ sông Hồng đầu thế kỷ 20.',
    satelliteImgs: [
      {
        title: 'Chợ Bán Đồ Mây',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Chợ bán đồ mây cuối thế kỉ 19 tại Hà Nội.jpg',
        caption: 'Hàng mây tre đan tinh xảo của các làng nghề thủ công ven kinh thành Thăng Long cuối thế kỷ 19.'
      },
      {
        title: 'Nón Quai Thao Truyền Thống',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Nón quai thao chụp năm 1911.jpg',
        caption: 'Nét duyên dáng đặc trưng của phụ nữ Kinh Bắc trong trang phục áo tứ thân và chiếc nón quai thao truyền thống.'
      },
      {
        title: 'Nét Đẹp Phụ Nữ Lao Động',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Chân dung những người phụ nữ thuộc tầng lớp lao động miền Bắc Việt Nam đầu thế kỷ 20..jpg',
        caption: 'Vẻ đẹp mộc mạc, chịu thương chịu khó của những người mẹ, người chị xứ Bắc đầu thế kỷ 20.'
      },
      {
        title: 'Lễ Hội Phủ Giày',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Nhóm phụ nữ vận chuyển đồ thờ tự chuẩn bị cho đám rước của lễ hội Phủ Giày ở Nam Định thập niên 1920.jpg',
        caption: 'Nghi lễ rước kiệu truyền thống chuẩn bị cho hội Phủ Giày, Nam Định.'
      }
    ],
    totalDocuments: 8,
    historicalQuote: 'Thăng Long - Hà Nội ngàn năm văn hiến, nơi nếp sống cần lao hòa quyện cùng cốt cách thanh lịch, thuần phong mỹ tục của dân tộc.',
    quoteAuthor: 'Ký ức Văn hóa Dân gian Bắc Bộ',
    locationName: 'Hà Nội & Châu thổ Bắc Bộ',
    compareBeforeImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Chợ phiên Bắc bộ xưa.jpg',
    compareAfterImg: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&h=600&fit=crop',
    compareLabelBefore: 'Chợ phiên đầu thế kỷ 20',
    compareLabelAfter: 'Phố chợ Hà Nội ngày nay'
  },

  // 2. MIỀN BẮC - PHẬT GIÁO (1872 - 1930)
  {
    id: 'cluster-bac-phatgiao-1872',
    title: 'Chùa Việt Nam & Tăng Đoàn Thăng Long',
    subtitle: 'Đạo phong uy nghiêm của các bậc Trưởng lão tiền bối và dấu tích danh lam cổ tự ngàn năm',
    eraStr: '1872 — 1930',
    yearStart: 1872,
    yearEnd: 1930,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    heroImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Một Cột xưa.jpg',
    heroTitle: 'Chùa Một Cột (Diên Hựu Tự)',
    heroCaption: 'Biểu tượng hoa sen thanh tịnh nở giữa chốn nhân gian, chứng nhân lịch sử ngàn năm của Phật giáo Việt Nam.',
    satelliteImgs: [
      {
        title: 'Tăng Sư An Nam',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Vị Tăng sư An Nam thời Nguyễn trong mũ Ni và áo châu lĩnh – Chân dung lịch sử năm 1872 qua ống kính Esmile Gsell.jpg',
        caption: 'Vị Tăng sư An Nam thời Nguyễn trong mũ Ni và áo châu lĩnh – Chân dung lịch sử năm 1872 qua ống kính Emile Gsell.'
      },
      {
        title: 'Chùa Trấn Quốc Cổ Kính',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Trấn Quốc ảnh chụp bởi nhiếp ảnh gia người Pháp Pierre Dieueflis.jpg',
        caption: 'Cổ tự trấn giữ phía Đông Hồ Tây, ngôi chùa cổ nhất đất Thăng Long lịch sử.'
      },
      {
        title: 'Chùa Đọ (Quang Minh Tự)',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Đọ có tên chữ là Quang Minh tự, ở Làng Đỗ Xá nay thuộc địa phận Ninh Giang, thành phố Bắc Ninh, ảnh được chụp vào năm 1897.jpg',
        caption: 'Kiến trúc gỗ cổ kính của Chùa Đọ, Bắc Ninh ghi lại năm 1897.'
      },
      {
        title: 'Chư Tăng Bắc Kỳ',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Bưu thiếp cổ năm 1900 – Chân dung nhà sư Phật giáo Bắc Kỳ thời kỳ Đông Dương dưới sự cai trị của Pháp.jpg',
        caption: 'Đạo phong tịch tĩnh, từ bi của chư Tăng miền Bắc thời kỳ Đông Dương.'
      }
    ],
    totalDocuments: 11,
    historicalQuote: 'Mái chùa che chở hồn dân tộc, nếp sống muôn đời của tổ tông. Đạo Phật đồng hành cùng dân tộc qua muôn ngàn biến thiên thế sự.',
    quoteAuthor: 'Hòa thượng Thích Mật Thể • Việt Nam Phật Giáo Sử Lược',
    locationName: 'Hà Nội & Bắc Ninh, Hải Phòng, Thái Bình',
    compareBeforeImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Một Cột xưa.jpg',
    compareAfterImg: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=1000&h=600&fit=crop',
    compareLabelBefore: 'Chùa Một Cột đầu TK 20',
    compareLabelAfter: 'Diên Hựu Tự ngày nay'
  },

  // 3. MIỀN BẮC - ĐỜI SỐNG (1930 - 1954)
  {
    id: 'cluster-bac-doisong-1930',
    title: 'Phương Tiện & Phố Thị Thăng Long',
    subtitle: 'Tiếng chuông leng keng tàu điện Bờ Hồ, xe kéo tay và ký ức 36 phố phường xưa',
    eraStr: '1930 — 1954',
    yearStart: 1930,
    yearEnd: 1954,
    region: 'BAC',
    theme: 'DOI_SONG',
    heroImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Tàu điện Hà Nội - Dấu ấn lịch sử từ năm 1900, phương tiện quen thuộc của người dân Thủ đô năm 1975.jpg',
    heroTitle: 'Tàu Điện Leng Keng',
    heroCaption: 'Tiếng chuông leng keng rộn rã trên các tuyến đường Hàng Gai, Hàng Đào in sâu vào tâm khảm bao thế hệ người Hà Nội.',
    satelliteImgs: [
      {
        title: 'Tàu Điện Phố Hàng Gai',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Đường tàu điện trên phố Hàng Gai – Nhịp sống chậm rãi giữa lòng khu phố Cổ Hà Nội.jpg',
        caption: 'Nhịp sống chậm rãi, bình yên giữa lòng khu phố cổ những năm 1930.'
      },
      {
        title: 'Tuổi Thơ Đu Boong Tàu',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Đường tàu điện cắt ngang phố Hà Nội – Ký ức tuổi thơ với những đứa trẻ đu _boong_ tàu.jpg',
        caption: 'Hình ảnh thân thương gắn liền với tuổi thơ trẻ em Hà Nội một thời.'
      },
      {
        title: 'Không Khí Tết Xưa',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Tết tại Hà Nội trước 1954.jpg',
        caption: 'Không khí sắm Tết đầm ấm, đào phai khoe sắc trên hè phố trước năm 1954.'
      },
      {
        title: 'Xe Đạp Thống Nhất',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Xe đạp Thống Nhất – Người bạn đồng hành của gia đình Hà Nội thời bao cấp.jpg',
        caption: 'Vật báu gia đình, phương tiện thân thuộc thời kỳ bao cấp của người Tràng An.'
      }
    ],
    totalDocuments: 9,
    historicalQuote: 'Hà Nội ba mươi sáu phố phường, tiếng chuông tàu điện sớm trưa dặt dìu, giữ gìn một nét duyên sâu lắng của thời gian.',
    quoteAuthor: 'Thạch Lam • Hà Nội 36 Phố Phường',
    locationName: 'Phố Cổ Hoàn Kiếm, Hà Nội',
    compareBeforeImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Đường tàu điện trên phố Hàng Gai – Nhịp sống chậm rãi giữa lòng khu phố Cổ Hà Nội.jpg',
    compareAfterImg: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1000&h=600&fit=crop',
    compareLabelBefore: 'Phố Hàng Gai năm 1930',
    compareLabelAfter: 'Phố Hàng Gai hôm nay'
  },

  // 4. MIỀN TRUNG - PHẬT GIÁO & ĐỜI SỐNG (1920 - 1954)
  {
    id: 'cluster-trung-phatgiao-1920',
    title: 'Di Sản Phật Giáo Cố Đô & Trầm Tích Xứ Huế',
    subtitle: 'Bảo tháp Phước Duyên Thiên Mụ, phong trào Chấn hưng và nếp niệm Phật thuần hậu',
    eraStr: '1920 — 1954',
    yearStart: 1920,
    yearEnd: 1954,
    region: 'TRUNG',
    theme: 'PHAT_GIAO',
    heroImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Bảo tháp Phước Duyên tại chùa Thiên Mụ, Huế – Biểu tượng tôn nghiêm của Phật giáo xứ Huế.jpg',
    heroTitle: 'Bảo Tháp Phước Duyên',
    heroCaption: 'Biểu tượng thiêng liêng bên dòng sông Hương, chiếc nôi phát khởi phong trào Chấn hưng Phật giáo Trung Kỳ.',
    satelliteImgs: [
      {
        title: 'Toàn Cảnh Chùa Thiên Mụ',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Thiên Mụ thập niên 1920 nhìn từ máy bay.jpg',
        caption: 'Toàn cảnh non nước hữu tình của Tổ đình Linh Mụ nhìn từ không trung thập niên 1920.'
      },
      {
        title: 'Ba Vị Cao Tăng',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Ba vị cao Tăng Phật Giáo ở Huế, trong thời kỳ Việt Nam bị Pháp chiếm đóng.jpg',
        caption: 'Các bậc Trưởng lão đạo hạnh sáng ngời, kiên cường giữ gìn mạng mạch Phật pháp.'
      },
      {
        title: 'Cụ Bà Niệm Phật',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Bà lão Annam (nay là miền Trung, Việt Nam), trong trang phục truyền thống, cầm chuỗi tràng hạt cầu nguyện.jpg',
        caption: 'Hình ảnh cụ bà với chuỗi tràng hạt bồ đề, biểu trưng cho niềm tin Tam Bảo son sắt của người dân Trung Bộ.'
      },
      {
        title: 'Gánh Hàng Nông Sản',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Trung/Những người phụ nữ bán nông sản ven đường ở Huế năm 1926..jpg',
        caption: 'Nét chân chất, bình dị của người phụ nữ Cố đô gánh gồng mưu sinh năm 1926.'
      }
    ],
    totalDocuments: 8,
    historicalQuote: 'Tiếng chuông Thiên Mụ canh gà Thọ Xương. Dòng sông Hương phẳng lặng ôm ấp bao trầm tích tâm linh nghìn đời của chốn Thần Kinh.',
    quoteAuthor: 'Ca Dao Xứ Huế',
    locationName: 'Cố Đô Huế & Sông Hương',
    compareBeforeImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Thiên Mụ thập niên 1920 nhìn từ máy bay.jpg',
    compareAfterImg: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1000&h=600&fit=crop',
    compareLabelBefore: 'Chùa Thiên Mụ thập niên 1920',
    compareLabelAfter: 'Chùa Thiên Mụ ngày nay'
  },

  // 5. MIỀN NAM - ĐỜI SỐNG & SÔNG NƯỚC (1950 - 1975)
  {
    id: 'cluster-nam-doisong-1950',
    title: 'Sông Nước & Phố Thị Phương Nam',
    subtitle: 'Chợ Bến Thành hoa lệ, xe thổ mộ Gia Định và nếp sống hào sảng nghĩa tình Nam Bộ',
    eraStr: '1950 — 1975',
    yearStart: 1950,
    yearEnd: 1975,
    region: 'NAM',
    theme: 'DOI_SONG',
    heroImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Chợ Bến Thành Sài Gòn năm 1964 – Vẻ đẹp sôi động qua ống kính người Pháp.jpg',
    heroTitle: 'Chợ Bến Thành Sầm Uất',
    heroCaption: 'Tháp đồng hồ bốn mặt sừng sững – trung tâm giao thương sầm uất và biểu tượng kiến trúc không thể thay thế của Hòn Ngọc Viễn Đông.',
    satelliteImgs: [
      {
        title: 'Xe Thổ Mộ Song Mã',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Xe thổ mộ đầu thế kỷ 20_ Di sản giao thông độc đáo của người Việt biến tấu từ xe song mã Châu Âu.jpg',
        caption: 'Phương tiện độc đáo của người Nam Kỳ lục tỉnh biến tấu từ xe song mã châu Âu.'
      },
      {
        title: 'Gánh Hàng Rong Phố Thị',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Gánh hàng rong phố Sài Gòn năm 1950 – Sắc màu ẩm thực đường phố giữa nhịp sống sôi động của thành phố.jpg',
        caption: 'Nét ẩm thực đường phố bình dị và thân thương của Sài Gòn xưa.'
      }
    ],
    totalDocuments: 8,
    historicalQuote: 'Đất Sài Gòn hoa lệ, lòng người Nam Bộ hào sảng bao dung. Trải qua bao năm tháng đổi thay, nếp sống nghĩa tình vẫn vẹn nguyên.',
    quoteAuthor: 'Ký Ức Đất Phương Nam',
    locationName: 'Sài Gòn - Gia Định & Cửu Long',
    compareBeforeImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Chợ Bến Thành Sài Gòn năm 1964 – Vẻ đẹp sôi động qua ống kính người Pháp.jpg',
    compareAfterImg: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1000&h=600&fit=crop',
    compareLabelBefore: 'Chợ Bến Thành năm 1964',
    compareLabelAfter: 'Chợ Bến Thành ngày nay'
  },

  // 6. PHẬT GIÁO NAM BỘ & TIẾP NỐI ĐƯƠNG ĐẠI
  {
    id: 'cluster-nam-phatgiao-tiepnoi',
    title: 'Phật Giáo Phương Nam & Dòng Chảy Hòa Phúc',
    subtitle: 'Kinh sư Ứng Phú Nam Bộ, chùa Xá Lợi lịch sử và hành trình tiếp nối hoằng pháp',
    eraStr: '1875 — Nay',
    yearStart: 1875,
    yearEnd: 2026,
    region: 'NAM',
    theme: 'PHAT_GIAO',
    heroImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Vị sám chủ (giữa) và kinh sử Ứng phú Nam bộ (ảnh do Émlie Gsell người Pháp chụp khoảng vào năm 1875 – 1879).jpg',
    heroTitle: 'Nghi Lễ Ứng Phú',
    heroCaption: 'Bức ảnh lịch sử quý giá do Emile Gsell chụp ghi lại nghi thức xướng tụng và pháp phục truyền thống của chư Tăng Nam Bộ cuối TK 19.',
    satelliteImgs: [
      {
        title: 'Chùa Xá Lợi',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Xá Lợi trên đường bà Huyện Thanh Quan, quận 3, Tp.HCM.jpg',
        caption: 'Trung tâm phát xuất phong trào Phật giáo miền Nam những năm 1960.'
      },
      {
        title: 'Chùa Hội Phật Học',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Chùa Hội Phật học tại Cần Thơ.jpg',
        caption: 'Cơ sở giáo dục và chấn hưng Phật học vùng Tây Nam Bộ thế kỷ 20.'
      },
      {
        title: 'Chư Tăng Phương Nam',
        imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/PHẬT GIÁO 3 MIỀN/Chư Tăng Phật Giáo Miền Nam.jpg',
        caption: 'Đoàn kết và trang nghiêm trong phụng sự nhân sinh của Phật giáo phương Nam.'
      },
      {
        title: 'Bảo Tháp Tùng Lâm Hòa Phúc',
        imgUrl: '/images/vu-tru-phat-giao/toan-canh-chua.jpg',
        caption: 'Tiếp nối mạng mạch hoằng pháp, kiến tạo không gian di sản tâm linh đương đại.'
      }
    ],
    totalDocuments: 12,
    historicalQuote: 'Phật pháp bất ly thế gian pháp. Nối dòng tiếp mạch chư Tổ, Tùng Lâm Hòa Phúc phụng sự Chánh Pháp, kiến tạo an lạc cho muôn người.',
    quoteAuthor: 'Tùng Lâm Hòa Phúc • Đạo Từ Hoằng Pháp',
    locationName: 'Sài Gòn, Cần Thơ & Tùng Lâm Hòa Phúc',
    compareBeforeImg: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Vị sám chủ (giữa) và kinh sử Ứng phú Nam bộ (ảnh do Émlie Gsell người Pháp chụp khoảng vào năm 1875 – 1879).jpg',
    compareAfterImg: '/images/vu-tru-phat-giao/toan-canh-chua.jpg',
    compareLabelBefore: 'Nghi lễ Phật giáo TK 19',
    compareLabelAfter: 'Tùng Lâm Hòa Phúc ngày nay'
  }
];

// ── TOÀN BỘ ẢNH TƯ LIỆU LẺ VỚI TIÊU ĐỀ ĐÃ ĐƯỢC TINH GỌN (LỌC BỎ THỜI GIAN & ĐỊA ĐIỂM TRÙNG LẶP) ──
export const ALL_HERITAGE_PHOTOS: HeritagePhotoItem[] = [
  // ── MIỀN BẮC - ĐỜI SỐNG ──
  {
    id: 'bac-ds-01',
    title: 'Chợ Bán Đồ Mây',
    yearStr: 'Cuối TK 19',
    yearNum: 1890,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Chợ phiên & Lao động',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Chợ bán đồ mây cuối thế kỉ 19 tại Hà Nội.jpg',
    locationName: 'Hà Nội',
    caption: 'Hàng mây tre đan tinh xảo của các làng nghề thủ công ven kinh thành Thăng Long cuối thế kỷ 19.',
    historicalContext: 'Thời kỳ đồ thủ công mây tre đan truyền thống là sản phẩm gia dụng không thể thiếu của các gia đình Hà Nội cổ xưa.'
  },
  {
    id: 'bac-ds-02',
    title: 'Tàu Điện Leng Keng',
    yearStr: '1900 — 1975',
    yearNum: 1900,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Phương tiện giao thông',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Tàu điện Hà Nội - Dấu ấn lịch sử từ năm 1900, phương tiện quen thuộc của người dân Thủ đô năm 1975.jpg',
    locationName: 'Bờ Hồ, Hà Nội',
    caption: 'Phương tiện giao thông công cộng đầu tiên của Hà Nội, bắt đầu vận hành từ năm 1900.',
    historicalContext: 'Tuyến tàu điện Bờ Hồ - Bạch Mai, Hà Đông gắn bó với ký ức của biết bao thế hệ người Hà Nội thế kỷ 20.'
  },
  {
    id: 'bac-ds-03',
    title: 'Nét Đẹp Phụ Nữ Lao Động',
    yearStr: 'Đầu TK 20',
    yearNum: 1905,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Phụ nữ & Trang phục',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Chân dung những người phụ nữ thuộc tầng lớp lao động miền Bắc Việt Nam đầu thế kỷ 20..jpg',
    locationName: 'Bắc Bộ',
    caption: 'Chân dung chân thực về người phụ nữ nông thôn Bắc Bộ với trang phục áo yếm, khăn mỏ quạ mộc mạc.',
    historicalContext: 'Ghi lại vẻ đẹp dung dị, nhẫn nại và đức hy sinh cao cả của người phụ nữ Việt Nam trong giai đoạn lịch sử giao thời.'
  },
  {
    id: 'bac-ds-04',
    title: 'Nón Quai Thao Truyền Thống',
    yearStr: '1911',
    yearNum: 1911,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Phụ nữ & Trang phục',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Nón quai thao chụp năm 1911.jpg',
    locationName: 'Kinh Bắc',
    caption: 'Nón quai thao đặc trưng vùng đồng bằng Bắc Bộ, tôn vinh nét e ấp của thiếu nữ xưa.',
    historicalContext: 'Chiếc nón Ba Tầm / nón quai thao với dải lụa tao nhã, thường được dùng trong các dịp trẩy hội mùa xuân.'
  },
  {
    id: 'bac-ds-05',
    title: 'Chợ Phiên Xưa',
    yearStr: 'Đầu TK 20',
    yearNum: 1915,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Chợ phiên & Lao động',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Chợ phiên Bắc bộ xưa.jpg',
    locationName: 'Đồng bằng Bắc Bộ',
    caption: 'Cảnh chợ quê tấp nập với những sạp hàng cói, gốm sứ và sản vật địa phương.',
    historicalContext: 'Chợ phiên là trung tâm sinh hoạt kinh tế và văn hóa cộng đồng gắn kết tình làng nghĩa xóm chốn thôn quê.'
  },
  {
    id: 'bac-ds-06',
    title: 'Lễ Hội Phủ Giày',
    yearStr: '1920s',
    yearNum: 1925,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Lễ hội & Tín ngưỡng',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Nhóm phụ nữ vận chuyển đồ thờ tự chuẩn bị cho đám rước của lễ hội Phủ Giày ở Nam Định thập niên 1920.jpg',
    locationName: 'Vụ Bản, Nam Định',
    caption: 'Nhóm phụ nữ khiêng rước đồ thờ tự chuẩn bị cho lễ hội Mẫu Liễu Hạnh tại Phủ Giày.',
    historicalContext: 'Di sản thực hành Tín ngưỡng Thờ Mẫu Tam Phủ của người Việt được bảo tồn qua bao thế hệ.'
  },
  {
    id: 'bac-ds-07',
    title: 'Tàu Điện Phố Hàng Gai',
    yearStr: '1930 — 1940',
    yearNum: 1935,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Ký ức Phố cổ',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Đường tàu điện trên phố Hàng Gai – Nhịp sống chậm rãi giữa lòng khu phố Cổ Hà Nội.jpg',
    locationName: 'Phố Hàng Gai, Hà Nội',
    caption: 'Tàu điện lướt nhẹ qua những mái ngói rêu phong phố cổ Hàng Gai.',
    historicalContext: 'Phố Hàng Gai thời kỳ này là trung tâm tơ lụa sầm uất bậc nhất của Hà Nội xưa.'
  },
  {
    id: 'bac-ds-08',
    title: 'Không Khí Tết Xưa',
    yearStr: 'Trước 1954',
    yearNum: 1950,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Phong tục & Lễ hội',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Tết tại Hà Nội trước 1954.jpg',
    locationName: 'Hà Nội',
    caption: 'Chợ hoa Tết rộn ràng trên hè phố Hàng Lược với cành đào bích truyền thống.',
    historicalContext: 'Nếp đón Tết trang trọng, ấm cúng và tao nhã của người Hà Nội giữa giai đoạn lịch sử chuyển biến.'
  },
  {
    id: 'bac-ds-09',
    title: 'Xe Đạp Thống Nhất',
    yearStr: 'Thời Bao cấp',
    yearNum: 1975,
    region: 'BAC',
    theme: 'DOI_SONG',
    category: 'Đời sống Bao cấp',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Bắc/Xe đạp Thống Nhất – Người bạn đồng hành của gia đình Hà Nội thời bao cấp.jpg',
    locationName: 'Hà Nội',
    caption: 'Chiếc xe đạp Thống Nhất có biển số xe – gia tài quý giá của mỗi gia đình thời bao cấp.',
    historicalContext: 'Chiếc xe đạp Thống Nhất trở thành biểu tượng của sự bền bỉ, tiết kiệm và tinh thần vượt khó của người Việt.'
  },

  // ── MIỀN TRUNG - ĐỜI SỐNG ──
  {
    id: 'trung-ds-01',
    title: 'Gánh Hàng Mã Chợ Quê',
    yearStr: 'Đầu TK 20',
    yearNum: 1910,
    region: 'TRUNG',
    theme: 'DOI_SONG',
    category: 'Phong tục & Chợ quê',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Trung/Một phụ nữ gánh vàng mã ra chợ ở làng Đông Sơn, Thanh Hóa..jpg',
    locationName: 'Đông Sơn, Thanh Hóa',
    caption: 'Hình ảnh phụ nữ gánh hàng mã ra chợ làng Đông Sơn, Thanh Hóa đầu thế kỷ 20.',
    historicalContext: 'Vùng đất Đông Sơn cổ kính lưu giữ những phong tục tín ngưỡng dân gian đậm đà bản sắc.'
  },
  {
    id: 'trung-ds-02',
    title: 'Gánh Hàng Nông Sản',
    yearStr: '1926',
    yearNum: 1926,
    region: 'TRUNG',
    theme: 'DOI_SONG',
    category: 'Đời sống Cố đô',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Trung/Những người phụ nữ bán nông sản ven đường ở Huế năm 1926..jpg',
    locationName: 'Huế',
    caption: 'Hình ảnh gánh rau quả ven thành nội Huế năm 1926.',
    historicalContext: 'Cuộc sống mộc mạc bên dòng sông Hương và những con đường rợp bóng cây xanh xứ Huế.'
  },
  {
    id: 'trung-ds-03',
    title: 'Nếp Sống Dân Nghèo',
    yearStr: '1961',
    yearNum: 1961,
    region: 'TRUNG',
    theme: 'DOI_SONG',
    category: 'Xã hội Miền Trung',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Trung/Cận cảnh cuộc sống của dân nghèo ở Huế năm 1961.jpg',
    locationName: 'Huế',
    caption: 'Hình ảnh chân thực về đời sống người dân lao động Huế thập niên 1960.',
    historicalContext: 'Tư liệu quý giá phản ánh đời sống xã hội miền Trung trước năm 1975.'
  },

  // ── MIỀN NAM - ĐỜI SỐNG ──
  {
    id: 'nam-ds-01',
    title: 'Lăng Ông - Bà Chiểu',
    yearStr: 'Thế kỷ 19',
    yearNum: 1885,
    region: 'NAM',
    theme: 'DOI_SONG',
    category: 'Di tích Gia Định',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Lăng Ông - Bà Chiểu_ Khu lăng mộ Tả quân Lê Văn Duyệt tại Gia Định, dấu ấn lịch sử Sài Gòn thế kỷ 19.jpg',
    locationName: 'Bình Thạnh, Gia Định',
    caption: 'Di tích Lăng Tả quân Lê Văn Duyệt – trung tâm sinh hoạt văn hóa tâm linh bậc nhất Nam Bộ.',
    historicalContext: 'Nơi người dân Sài Gòn - Gia Định kính ngưỡng vị công thần khai phá và bảo bọc vùng đất phương Nam.'
  },
  {
    id: 'nam-ds-02',
    title: 'Xe Thổ Mộ Song Mã',
    yearStr: 'Đầu TK 20',
    yearNum: 1910,
    region: 'NAM',
    theme: 'DOI_SONG',
    category: 'Giao thông Nam Bộ',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Xe thổ mộ đầu thế kỷ 20_ Di sản giao thông độc đáo của người Việt biến tấu từ xe song mã Châu Âu.jpg',
    locationName: 'Sài Gòn - Lục Tỉnh',
    caption: 'Chiếc xe ngựa thổ mộ lóc cóc trên các nẻo đường Lục Tỉnh Nam Kỳ xưa.',
    historicalContext: 'Phương tiện vận chuyển người và hàng hóa độc đáo, ăn sâu vào đời sống văn hóa Nam Bộ.'
  },
  {
    id: 'nam-ds-03',
    title: 'Thuyền Gỗ Sông Nước',
    yearStr: 'Đầu TK 20',
    yearNum: 1920,
    region: 'NAM',
    theme: 'DOI_SONG',
    category: 'Sông nước Cửu Long',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Con thuyền gắn với cuộc sống miền Tây Nam bộ xưa.jpg',
    locationName: 'Miền Tây Nam Bộ',
    caption: 'Chiếc thuyền gỗ xuôi ngược trên những kênh rạch chằng chịt miền Tây.',
    historicalContext: 'Văn hóa sông nước định hình lối sống, tính cách hào hiệp, phóng khoáng của người miền Tây.'
  },
  {
    id: 'nam-ds-04',
    title: 'Gánh Hàng Rong Phố Thị',
    yearStr: '1950',
    yearNum: 1950,
    region: 'NAM',
    theme: 'DOI_SONG',
    category: 'Ẩm thực đường phố',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Gánh hàng rong phố Sài Gòn năm 1950 – Sắc màu ẩm thực đường phố giữa nhịp sống sôi động của thành phố.jpg',
    locationName: 'Sài Gòn',
    caption: 'Đôi quang gánh trĩu nặng ân tình của những người mẹ, người chị trên đường phố Sài Gòn.',
    historicalContext: 'Ẩm thực đường phố Sài Gòn là sự giao thoa phong phú giữa ba miền và văn hóa bản địa.'
  },
  {
    id: 'nam-ds-05',
    title: 'Chợ Bến Thành',
    yearStr: '1964',
    yearNum: 1964,
    region: 'NAM',
    theme: 'DOI_SONG',
    category: 'Phố thị Sài Gòn',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Chợ Bến Thành Sài Gòn năm 1964 – Vẻ đẹp sôi động qua ống kính người Pháp.jpg',
    locationName: 'Quận 1, Sài Gòn',
    caption: 'Toàn cảnh chợ Bến Thành với tháp đồng hồ trứ danh năm 1964.',
    historicalContext: 'Ngôi chợ trung tâm chứng kiến bao bước thăng trầm lịch sử và sự phát triển vượt bậc của Sài Gòn.'
  },
  {
    id: 'nam-ds-06',
    title: 'Thuyền Gỗ Sông Hậu',
    yearStr: '1965',
    yearNum: 1965,
    region: 'NAM',
    theme: 'DOI_SONG',
    category: 'Sông nước Cửu Long',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Thuyền gỗ trên sông Hậu năm 1965 – Vận chuyển hàng hóa và người dân đến chợ Cần Thơ, giữa lòng Sông Cửu Long.jpg',
    locationName: 'Cần Thơ',
    caption: 'Những chuyến đò chở đầy hoa trái tươi ngon đến chợ nổi Tây Đô.',
    historicalContext: 'Cần Thơ - thủ phủ miền Tây Nam Bộ rộn rã thuyền bè giao thương trên dòng sông Hậu hiền hòa.'
  },

  // ── PHẬT GIÁO MIỀN BẮC ──
  {
    id: 'bac-pg-01',
    title: 'Tăng Sư An Nam',
    yearStr: '1872',
    yearNum: 1872,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    category: 'Chân dung & Tăng đoàn',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Vị Tăng sư An Nam thời Nguyễn trong mũ Ni và áo châu lĩnh – Chân dung lịch sử năm 1872 qua ống kính Esmile Gsell.jpg',
    locationName: 'Bắc Bộ',
    caption: 'Vị Tăng sư An Nam thời Nguyễn trong mũ Ni và áo châu lĩnh – Chân dung lịch sử năm 1872 qua ống kính Emile Gsell.',
    historicalContext: 'Bức ảnh chân dung cổ quý hiếm bậc nhất về tăng phục cổ truyền Việt Nam thế kỷ 19.'
  },
  {
    id: 'bac-pg-02',
    title: 'Chùa Một Cột',
    yearStr: 'Đầu TK 20',
    yearNum: 1905,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    category: 'Danh Lam Cổ Tự',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Một Cột xưa.jpg',
    locationName: 'Ba Đình, Hà Nội',
    caption: 'Chùa Diên Hựu thời Nguyễn với ao sen và trụ đá nghìn năm.',
    historicalContext: 'Kiến trúc hoa sen độc nhất vô nhị do vua Lý Thái Tông khởi dựng năm 1049.'
  },
  {
    id: 'bac-pg-03',
    title: 'Chùa Trấn Quốc',
    yearStr: 'Đầu TK 20',
    yearNum: 1910,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    category: 'Danh Lam Cổ Tự',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Trấn Quốc ảnh chụp bởi nhiếp ảnh gia người Pháp Pierre Dieueflis.jpg',
    locationName: 'Tây Hồ, Hà Nội',
    caption: 'Cổ tự Khai Quốc trên bán đảo Kim Ngư giữa lòng Hồ Tây mênh mang sóng nước.',
    historicalContext: 'Ngôi chùa cổ nhất của thủ đô Hà Nội, khởi lập từ thời Tiền Lý (thế kỷ thứ 6).'
  },
  {
    id: 'bac-pg-04',
    title: 'Chùa Láng (Chiêu Thiền Tự)',
    yearStr: 'Đầu TK 20',
    yearNum: 1920,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    category: 'Danh Lam Cổ Tự',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Láng, tên chữ là Chiêu Thiền Tự ở Láng Thượng.jpg',
    locationName: 'Đống Đa, Hà Nội',
    caption: 'Chiêu Thiền Tự uy nghiêm nơi thờ Thiền sư Từ Đạo Hạnh thời Lý.',
    historicalContext: 'Ngôi chùa có kiến trúc hàng thông cổ thụ và quần thể di tích tâm linh linh thiêng của đất Thăng Long.'
  },
  {
    id: 'bac-pg-05',
    title: 'Chùa Đọ (Quang Minh Tự)',
    yearStr: '1897',
    yearNum: 1897,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    category: 'Danh Lam Cổ Tự',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Đọ có tên chữ là Quang Minh tự, ở Làng Đỗ Xá nay thuộc địa phận Ninh Giang, thành phố Bắc Ninh, ảnh được chụp vào năm 1897.jpg',
    locationName: 'Bắc Ninh',
    caption: 'Kiến trúc gỗ cổ truyền chụp năm 1897 của chùa Đọ, Bắc Ninh.',
    historicalContext: 'Minh chứng cho kỹ thuật điêu khắc gỗ tinh xảo và truyền thống thờ Phật tại xứ Kinh Bắc.'
  },
  {
    id: 'bac-pg-06',
    title: 'Tháp Chùa Báo Ân',
    yearStr: 'Cuối TK 19',
    yearNum: 1888,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    category: 'Danh Lam Cổ Tự',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Một cái tháp của chùa Bảo-Ân bên bờ hồ Hoàn-Kiếm.jpg',
    locationName: 'Hồ Hoàn Kiếm, Hà Nội',
    caption: 'Dấu tích Tháp Hòa Phong – hạng mục còn lại của quần thể đại cổ tự Báo Ân bên hồ Gươm.',
    historicalContext: 'Chùa Báo Ân (chùa Liên Trì) từng là một trong những ngôi chùa quy mô tráng lệ nhất Hà Nội thế kỷ 19.'
  },
  {
    id: 'bac-pg-07',
    title: 'Di Dời Đại Tượng Phật',
    yearStr: '1950',
    yearNum: 1950,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    category: 'Sự Kiện Lịch Sử',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Công binh di dời tượng Phật nặng 9 tấn ở chùa Thần Quang, Ngũ Xá (tháng 12.1950).jpg',
    locationName: 'Ngũ Xá, Hà Nội',
    caption: 'Công binh phối hợp di dời đại tượng Phật A Di Đà bằng đồng nặng 9 tấn vào Phật điện chùa Thần Quang tháng 12/1950.',
    historicalContext: 'Pho đại tượng đồng đúc nguyên khối kỳ vĩ – kiệt tác của nghệ nhân đúc đồng làng Ngũ Xá.'
  },
  {
    id: 'bac-pg-08',
    title: 'Tượng Quan Thế Âm',
    yearStr: '1954',
    yearNum: 1954,
    region: 'BAC',
    theme: 'PHAT_GIAO',
    category: 'Sự Kiện Lịch Sử',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Bức tượng Quan thế âm chùa Một Cột sau vụ nổ năm 1954.jpg',
    locationName: 'Hà Nội',
    caption: 'Bức tôn tượng Quan Thế Âm linh thiêng vẫn vẹn nguyên sau vụ nổ năm 1954 trước ngày Giải phóng Thủ đô.',
    historicalContext: 'Minh chứng cho sự trường tồn và linh ứng của ngôi cổ tự thiêng liêng đất Thăng Long.'
  },

  // ── PHẬT GIÁO MIỀN TRUNG ──
  {
    id: 'trung-pg-01',
    title: 'Bảo Tháp Phước Duyên',
    yearStr: '1920',
    yearNum: 1920,
    region: 'TRUNG',
    theme: 'PHAT_GIAO',
    category: 'Danh Lam & Tháp Cổ',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Bảo tháp Phước Duyên tại chùa Thiên Mụ, Huế – Biểu tượng tôn nghiêm của Phật giáo xứ Huế.jpg',
    locationName: 'Chùa Thiên Mụ, Huế',
    caption: 'Bảo tháp Phước Duyên 7 tầng hình bát giác vươn cao bên dòng Hương Giang thơ mộng.',
    historicalContext: 'Xây dựng năm 1844 dưới thời vua Thiệu Trị, mỗi tầng tháp thờ một vị Phật thiêng liêng.'
  },
  {
    id: 'trung-pg-02',
    title: 'Toàn Cảnh Chùa Thiên Mụ',
    yearStr: '1920s',
    yearNum: 1920,
    region: 'TRUNG',
    theme: 'PHAT_GIAO',
    category: 'Danh Lam & Tháp Cổ',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Thiên Mụ thập niên 1920 nhìn từ máy bay.jpg',
    locationName: 'Đồi Hà Khê, Huế',
    caption: 'Bức ảnh chụp trên không độc đáo ghi lại toàn cảnh đồi Hà Khê và chùa Thiên Mụ.',
    historicalContext: 'Cổ tự do chúa Tiên Nguyễn Hoàng khởi lập năm 1601, biểu tượng Phật giáo xứ Đàng Trong.'
  },
  {
    id: 'trung-pg-03',
    title: 'Ba Vị Cao Tăng',
    yearStr: 'Đầu TK 20',
    yearNum: 1925,
    region: 'TRUNG',
    theme: 'PHAT_GIAO',
    category: 'Tăng Già & Đạo Phong',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Ba vị cao Tăng Phật Giáo ở Huế, trong thời kỳ Việt Nam bị Pháp chiếm đóng.jpg',
    locationName: 'Huế',
    caption: 'Chân dung đạo hạnh uy nghiêm của ba vị cao Tăng xứ Huế thời kỳ Pháp thuộc.',
    historicalContext: 'Các bậc Tăng tài đức độ đã đặt nền móng cho phong trào Chấn hưng Phật giáo Trung Bộ năm 1932.'
  },
  {
    id: 'trung-pg-04',
    title: 'Nghi Lễ Tăng Cang Triều Đình',
    yearStr: '1925 — 1926',
    yearNum: 1925,
    region: 'TRUNG',
    theme: 'PHAT_GIAO',
    category: 'Nghi Lễ Phật Giáo',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Tăng Cang trong Pháp phục cà sa, mũ Hiếp Chưởng tại đám tang vua Khải Định (1925) – Hình ảnh các vị Tăng Sắc Tứ trong nghi lễ triều đình thời Pháp thuộc.jpg',
    locationName: 'Kinh Thành Huế',
    caption: 'Tăng Cang trong Pháp phục cà sa gấm và mũ Hiếp Chưởng thực hiện nghi lễ cầu siêu chốn cung đình.',
    historicalContext: 'Nghi lễ Phật giáo truyền thống gắn bó mật thiết với hoàng gia triều Nguyễn.'
  },

  // ── PHẬT GIÁO MIỀN NAM ──
  {
    id: 'nam-pg-01',
    title: 'Nghi Lễ Ứng Phú',
    yearStr: '1875 — 1879',
    yearNum: 1875,
    region: 'NAM',
    theme: 'PHAT_GIAO',
    category: 'Nghi Lễ & Tăng Đoàn',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/Vị sám chủ (giữa) và kinh sử Ứng phú Nam bộ (ảnh do Émlie Gsell người Pháp chụp khoảng vào năm 1875 – 1879).jpg',
    locationName: 'Gia Định - Nam Bộ',
    caption: 'Bức ảnh chụp bởi Emile Gsell ghi lại nghi thức tụng niệm và pháp khí Kim Cang của Tăng sĩ Nam Bộ.',
    historicalContext: 'Nghi lễ Ứng Phú Nam Bộ mang nét đặc sắc của văn hóa nghi lễ Phật giáo Nam Bộ xưa.'
  },
  {
    id: 'nam-pg-02',
    title: 'Chùa Xá Lợi',
    yearStr: '1958',
    yearNum: 1958,
    region: 'NAM',
    theme: 'PHAT_GIAO',
    category: 'Cơ Sở Hoằng Pháp',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/CHÙA VIỆT NAM XƯA/Chùa Xá Lợi trên đường bà Huyện Thanh Quan, quận 3, Tp.HCM.jpg',
    locationName: 'Quận 3, Sài Gòn',
    caption: 'Chùa Xá Lợi với tháp chuông 7 tầng – trung tâm của phong trào Phật giáo miền Nam.',
    historicalContext: 'Ngôi chùa lịch sử được xây dựng năm 1956 để phụng thờ Xá Lợi Phật và hoằng dương Chánh pháp.'
  },
  {
    id: 'nam-pg-03',
    title: 'Chùa Hội Phật Học',
    yearStr: 'Thập niên 1950',
    yearNum: 1950,
    region: 'NAM',
    theme: 'PHAT_GIAO',
    category: 'Cơ Sở Hoằng Pháp',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Đời sống/Miền Nam/Chùa Hội Phật học tại Cần Thơ.jpg',
    locationName: 'Cần Thơ',
    caption: 'Trụ sở Hội Phật học Cần Thơ – nơi đào tạo tăng tài và ấn tống kinh sách vùng Tây Nam Bộ.',
    historicalContext: 'Dấu ấn rực rỡ của phong trào Chấn hưng Phật giáo Nam Kỳ lục tỉnh.'
  },
  {
    id: 'nam-pg-04',
    title: 'Chư Tăng Phương Nam',
    yearStr: 'Thập niên 1960',
    yearNum: 1960,
    region: 'NAM',
    theme: 'PHAT_GIAO',
    category: 'Nghi Lễ & Tăng Đoàn',
    imgUrl: '/images/vu-tru-phat-giao/bao-tang/trien-lam/Phật giáo/PHẬT GIÁO 3 MIỀN/Chư Tăng Phật Giáo Miền Nam.jpg',
    locationName: 'Sài Gòn - Nam Bộ',
    caption: 'Chư Tăng Nam Bộ trong pháp hội trang nghiêm, đoàn kết phụng sự đạo pháp và nhân sinh.',
    historicalContext: 'Tinh thần lục hòa cộng trụ và phụng sự nhân sinh của tăng đoàn phương Nam.'
  }
];

export const TIMELINE_ERAS = [
  { id: 'all', yearStr: 'Toàn Bộ', label: 'Dòng Ký Ức Trăm Năm', yearNum: 0 },
  { id: '1870s', yearStr: '1870s', label: 'Cuối Thế Kỷ XIX', yearNum: 1875 },
  { id: '1900', yearStr: '1900', label: 'Đầu Thế Kỷ XX', yearNum: 1900 },
  { id: '1920s', yearStr: '1920s', label: 'Giao Thời & Hội Hè', yearNum: 1920 },
  { id: '1930s', yearStr: '1930', label: 'Chấn Hưng Ba Miền', yearNum: 1930 },
  { id: '1954', yearStr: '1954', label: 'Biến Thiên Lịch Sử', yearNum: 1954 },
  { id: '1975', yearStr: '1975', label: 'Thống Nhất & Tái Thiết', yearNum: 1975 },
  { id: '1990s', yearStr: '1990s', label: 'Đổi Mới & Phố Thị', yearNum: 1990 },
  { id: 'now', yearStr: 'Hiện Nay', label: 'Di Sản Đương Đại', yearNum: 2026 },
];

export const REGION_TABS = [
  { id: 'ALL' as RegionType, name: 'Toàn Quốc', shortName: 'Toàn Quốc', icon: '🇻🇳' },
  { id: 'BAC' as RegionType, name: 'Miền Bắc', shortName: 'Bắc Bộ', icon: '🏮' },
  { id: 'TRUNG' as RegionType, name: 'Miền Trung', shortName: 'Trung Bộ', icon: '🏯' },
  { id: 'NAM' as RegionType, name: 'Miền Nam', shortName: 'Nam Bộ', icon: '⛵' },
];
