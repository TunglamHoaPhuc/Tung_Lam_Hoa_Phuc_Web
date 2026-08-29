import fs from 'fs';
import path from 'path';

// Let's create a dedicated books database file: src/data/sach-an-pham-data.json
const booksData = [
  {
    id: 'sach-01',
    slug: 'di-qua-kho-vui-cuoc-doi',
    title: 'Đi Qua Khổ Vui Cuộc Đời',
    subtitle: 'Tập Ký Hồi Ức Chiêm Nghiệm & Tri Ân Tam Bảo',
    author: 'Sa Môn Vô Trí (hiệu Thích Tâm Hòa)',
    category: 'Hồi Ký & Tu Tập',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/tong-chi-tu-hoc_tong-phong-truyen-thua_tiep-buoc-thay-toi_thay_-chu-thich-popup-sach-dqkvcd-1787464550735.jpg',
    description: 'Tác phẩm đúc kết chặng đường tu tập, vượt qua muôn vàn gian khó, những bài học sâu sắc về tình thầy trò, sự thịnh suy vô thường và lòng tri ân vô hạn đối với Sư Tổ Ngộ Chân Tử cùng Hòa Thượng Bổn Sư Thích Chân Tính.',
    totalVolumes: 3,
    volumes: [
      {
        volumeNumber: 1,
        volumeTitle: 'Quyển 01: Thuở Ban Đầu & Chốn Tổ Hoằng Pháp',
        pageCount: 180,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Lời Tựa: Đi Qua Khổ Vui Cuộc Đời',
            content: `Cuộc đời như một dòng sông vô tận, trôi mãi giữa những bến bờ khổ vui, vinh nhục, hợp tan.\n\nNgười xuất gia bước vào cửa đạo mang theo hạnh nguyện 'xả phú cầu bần, xả thân cầu đạo', lấy trí tuệ làm sự nghiệp, lấy từ bi làm lẽ sống. Trải qua bao năm tháng tu học dưới bóng mát của chư Tôn đức tiền bối, tôi chiêm nghiệm ra rằng: Khổ đau hay an vui đều là những nấc thang tôi luyện tâm bồ đề kiên cố.\n\nTập sách này ghi lại những ký ức chân thật trên hành trình tiếp bước Sư Tổ và Thầy Bổn sư, với tâm nguyện tri ân Tam Bảo, đền ơn Thầy Tổ và trợ duyên cho hàng hậu học vững bước trên đường đạo.`,
          },
          {
            chapterNumber: 2,
            title: 'Chương 1: Mái Chùa Xưa & Dấu Chân Đầu Tiên',
            content: `Những ngày đầu bước chân vào cửa Phật tại Tổ đình Hoằng Pháp (Hóc Môn), hình ảnh Hòa Thượng Tôn Sư ngày đêm cần mẫn lo toan cho đồ chúng, mở khóa tu Phật Thất, in kinh ấn tống đã khắc sâu vào tâm khảm tôi.\n\nLời dạy giản dị nhưng sâu sắc của Thầy: "Làm việc Phật sự phải bằng cái tâm thanh tịnh, vô ngã vị tha; có khổ có nhọc thì hoa sen giải thoát mới tỏa hương thơm ngát."`,
          },
          {
            chapterNumber: 3,
            title: 'Chương 2: Bài Học Về Chữ Nhẫn & Tâm Tùy Duyên',
            content: `Đời tu không phải lúc nào cũng thuận buồm xuôi gió. Có những lúc thử thách chông gai bủa vây, nếu không có sức Kham Nhẫn và Niềm Tin Tam Bảo thì khó lòng vượt qua.\n\nNhẫn không phải là cam chịu hèn yếu, mà là sức mạnh tĩnh lặng của trí tuệ, nhìn rõ nhân duyên quả báo để chuyển hóa nghịch cảnh thành thuận duyên tu tập.`,
          }
        ]
      },
      {
        volumeNumber: 2,
        volumeTitle: 'Quyển 02: Dấu Ấn Hoằng Pháp & Kiến Thiết Tùng Lâm',
        pageCount: 220,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Duyên Lành Đất Bắc & Khởi Dựng Hòa Phúc',
            content: `Trở về miền Bắc, mảnh đất Thăng Long ngàn năm văn hiến, nhân duyên hội đủ để tái thiết và mở mang Tùng Lâm Hòa Phúc.\n\nTừ ngôi chùa làng hoang sơ thuở trước, chư Tăng cùng quý Phật tử mười phương đã chung sức chung lòng, đặt từng viên đá, dựng từng cột gỗ, làm sống lại tông phong Thiền - Tịnh song tu.`,
          },
          {
            chapterNumber: 2,
            title: 'Chương 2: Đạo Tràng Tu Học & Nếp Sống Thanh Quy',
            content: `Một ngôi chùa tố hảo không chỉ ở cảnh trí trang nghiêm bên ngoài, mà cốt lõi nằm ở nếp sống thanh quy và tinh thần tu học chân chính của đại chúng.\n\nKhóa tu Một Ngày An Lạc, Khóa Tu Tuổi Trẻ, các buổi cộng tu niệm Phật, trì chú Đại Bi đã trở thành dòng sữa pháp ngọt ngào nuôi dưỡng tâm thức bao thế hệ thiện tín.`,
          }
        ]
      },
      {
        volumeNumber: 3,
        volumeTitle: 'Quyển 03: Tâm Nguyện Tiếp Nối & Pháp Mạch Vô Cùng',
        pageCount: 200,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Tri Ân Bậc Thầy Tiếp Dẫn',
            content: `Nhìn lại chặng đường đã qua, lòng tôi dâng trào niềm tri ân vô hạn đối với Tam Bảo, với Sư Tổ Ngộ Chân Tử khai sơn và Hòa Thượng Thích Chân Tính.\n\n'Tiếp bước Thầy tôi' không chỉ là giữ gìn di sản vật chất, mà là kế thừa và lan tỏa tinh thần nhập thế độ sinh, mang an vui đến muôn nhà.`,
          },
          {
            chapterNumber: 2,
            title: 'Chương 2: Lời Nhắn Nhủ Hàng Hậu Học',
            content: `Gửi lại mai sau cho hàng đệ tử và thế hệ kế thừa: Dù thời thế đổi thay, lòng người biến chuyển, hãy luôn giữ vững Bồ Đề Tâm, lấy Giới luật làm Thầy, lấy Lục Hòa làm lẽ sống, cùng chung tay hộ trì chánh pháp trường tồn.`,
          }
        ]
      }
    ]
  },
  {
    id: 'sach-02',
    slug: 'khuyen-phat-bo-de-tam-giang-luan',
    title: 'Khuyến Phát Bồ Đề Tâm Giảng Luận',
    subtitle: 'Giảng Giải Chuyên Sâu Bài Văn Khuyến Phát Bồ Đề Tâm Của Thật Hiền Đại Sư',
    author: 'Sa Môn Vô Trí (hiệu Thích Tâm Hòa)',
    category: 'Giáo Lý & Giảng Giải',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp',
    description: 'Bộ luận giảng giải 4 quyển phân tích sâu sắc 10 nhân duyên phát khởi Bồ Đề Tâm — cội nguồn của mọi công đức và quả vị giải thoát trong Phật giáo.',
    totalVolumes: 4,
    volumes: [
      {
        volumeNumber: 1,
        volumeTitle: 'Quyển I: Tầm Quan Trọng Của Bồ Đề Tâm & Nhân Duyên Niệm Phật Trọng Ân',
        pageCount: 250,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Ý Nghĩa Phát Bồ Đề Tâm',
            content: `Kinh Hoa Nghiêm dạy: 'Quên mất tâm Bồ Đề mà tu các thiện pháp, ấy gọi là ma nghiệp.'\n\nPhát Bồ Đề Tâm là hạt giống đầu tiên và tối thượng để thành tựu Phật quả. Không có tâm Bồ Đề, mọi công hạnh tu tập chỉ dừng lại ở phước báo hữu lậu nhân thiên.`,
          }
        ]
      },
      {
        volumeNumber: 2,
        volumeTitle: 'Quyển II: Nhớ Ơn Cha Mẹ & Ơn Thầy Tổ Giáo Dưỡng',
        pageCount: 230,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Đền Ơn Sâu Nặng Của Cha Mẹ',
            content: `Công ơn cha mẹ sinh thành dưỡng dục sánh bằng trời biển. Người học Phật lấy chữ Hiếu làm đầu, độ cha mẹ vãng sinh cõi Phật mới là trọn vẹn đại hiếu.`,
          }
        ]
      },
      {
        volumeNumber: 3,
        volumeTitle: 'Quyển III: Nhớ Ơn Thí Chủ & Ơn Chúng Sinh',
        pageCount: 240,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Ơn Đàn Na Tín Thí',
            content: `Từng hạt cơm manh áo của người xuất gia đều do mồ hôi nước mắt của thiện tín thập phương dâng cúng. Nếu không tinh tấn tu hành, lấy gì để đền đáp ơn sâu?`,
          }
        ]
      },
      {
        volumeNumber: 4,
        volumeTitle: 'Quyển IV: Sám Hối Nghiệp Chướng & Cầu Sinh Tịnh Độ',
        pageCount: 260,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Phát Nguyện Vãng Sinh Tịnh Độ',
            content: `Đem tất cả công đức tu tập và phát tâm Bồ Đề hồi hướng vãng sinh Tây Phương Cực Lạc, hoa nở thấy Phật ngộ Vô Sanh, trở lại Ta Bà độ tận chúng sinh.`,
          }
        ]
      }
    ]
  },
  {
    id: 'sach-03',
    slug: '37-pham-tro-dao-dien-tho',
    title: '37 Phẩm Trợ Đạo Diễn Thơ',
    subtitle: 'Nghệ Thuật Diễn Kệ 37 Pháp Trợ Đạo Cốt Tủy Phật Giáo',
    author: 'Sa Môn Vô Trí (hiệu Thích Tâm Hòa)',
    category: 'Kinh Kệ & Pháp Bảo',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-doi-thay-_thumbnail_herobanner-1787463508324.jpg',
    description: 'Chuyển hóa 37 Phẩm Trợ Đạo (Tứ Niệm Xứ, Tứ Chánh Cần, Tứ Như Ý Túc, Ngũ Căn, Ngũ Lực, Thất Bồ Đề Phần, Bát Chánh Đạo Phần) thành những vần thơ lục bát mượt mà, dễ nhớ, dễ hành trì.',
    totalVolumes: 1,
    volumes: [
      {
        volumeNumber: 1,
        volumeTitle: 'Toàn Tập Diễn Ca 37 Pháp Trợ Đạo',
        pageCount: 120,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Phần 1: Tứ Niệm Xứ Diễn Thơ',
            content: `Quán thân bất tịnh rõ ràng,\nThịt xương da bọc muôn vàn nhơ nhơ.\nQuán tâm vô thường đổi thay,\nSớm vui chiều giận phút giây chuyển vần.\nQuán thọ là khổ chớ lầm,\nCàng tham hưởng thụ càng chìm đắm sâu.\nQuán pháp vô ngã thâm sâu,\nMuôn duyên hòa hợp chẳng đâu là mình.`,
          }
        ]
      }
    ]
  },
  {
    id: 'sach-04',
    slug: 'ba-nuong-tua-va-nam-thuc-hanh',
    title: 'Ba Nương Tựa Và Năm Thực Hành',
    subtitle: 'Kim Chỉ Nam Nền Tảng Tu Học Cho Người Đệ Tử Phật',
    author: 'Sa Môn Vô Trí (hiệu Thích Tâm Hòa)',
    category: 'Tu Tập Căn Bản',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/cac-su-he-phai-khat-si-ve-tham-chua-hoang-phap-truoc-giai-phong-chup-trc-hien-chinh-dien---tam-bao-trong-1787464519312.jpg',
    description: 'Quy Giới nương tựa Tam Bảo (Phật - Pháp - Tăng) và 5 Điều Thực Tập Căn Bản (Ngũ Giới) để kiến tạo an lạc tự thân và hạnh phúc gia đình.',
    totalVolumes: 1,
    volumes: [
      {
        volumeNumber: 1,
        volumeTitle: 'Tam Quy & Ngũ Giới Thực Hành',
        pageCount: 95,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Tam Tự Quy Y',
            content: `Quy y Phật: Quay về nương tựa tự tánh Giác ngộ sáng suốt.\nQuy y Pháp: Quay về nương tựa Chánh pháp chuyển hóa khổ đau.\nQuy y Tăng: Quay về nương tựa Tăng đoàn thanh tịnh hòa hợp.`,
          }
        ]
      }
    ]
  },
  {
    id: 'sach-05',
    slug: 'bo-de-tam-hanh-tri-nghi-quy',
    title: 'Bồ Đề Tâm Hành Trì Nghi Quỹ',
    subtitle: 'Nghi Thức Khóa Lễ & Pháp Hành Bồ Đề Tâm Hằng Ngày',
    author: 'Sa Môn Vô Trí (hiệu Thích Tâm Hòa)',
    category: 'Nghi Quỹ & Hành Trì',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/su-to-va-cac-em-chup-anh-nhan-dip-tri-an-cac-nha-bao-tro-vien-duc-anh-1968-1787464383648.jpg',
    description: 'Văn bản nghi thức hành trì tụng niệm, phát nguyện và sám hối dành cho đại chúng tu tập thường nhật tại thiền môn và gia đình.',
    totalVolumes: 1,
    volumes: [
      {
        volumeNumber: 1,
        volumeTitle: 'Nghi Quỹ Trì Tụng Thường Nhật',
        pageCount: 110,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Khóa Lễ Phát Khởi Bồ Đề Tâm',
            content: `Đệ tử chúng con chí tâm đảnh lễ mười phương thường trụ Tam Bảo...\nNguyện cho tất cả chúng sinh dứt trừ phiền não, thành tựu Bồ Đề.`,
          }
        ]
      }
    ]
  },
  {
    id: 'sach-06',
    slug: 'loi-day-cua-duc-phat',
    title: 'Lời Dạy Của Đức Phật',
    subtitle: 'Tuyển Tập Lời Vàng Phật Thuyết Trích Dẫn Từ Kinh Điển Nikaya & Đại Thừa',
    author: 'Sa Môn Vô Trí (hiệu Thích Tâm Hòa)',
    category: 'Kinh Điển Căn Bản',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/chua-hoang-phap--kien-an-tinh-hai-phong-1787463859334.jpg',
    description: 'Chắt lọc những lời giáo huấn cốt lõi của Đức Từ Phụ về đời sống đạo đức, nhân quả nghiệp báo, tu dưỡng thân tâm và con đường giải thoát an vui.',
    totalVolumes: 1,
    volumes: [
      {
        volumeNumber: 1,
        volumeTitle: 'Lời Vàng Phật Dạy Về Nhân Sinh',
        pageCount: 160,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Lời Phật Dạy Về Hạnh Phúc Chân Thật',
            content: `Hạnh phúc không đến từ sự sở hữu nhiều của cải, mà đến từ một tâm hồn biết buông xả tham sân si và trân quý phút giây hiện tại.`,
          }
        ]
      }
    ]
  },
  {
    id: 'sach-07',
    slug: 'nghi-thuc-hanh-tri-danh-cho-phat-tu-tai-gia',
    title: 'Nghi Thức Hành Trì Dành Cho Phật Tử Tại Gia',
    subtitle: 'Cẩm Nang Tu Học & Trì Tụng Thường Nhật Tại Tư Gia',
    author: 'Sa Môn Vô Trí (hiệu Thích Tâm Hòa)',
    category: 'Nghi Thức Thường Nhật',
    coverImage: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/uploads/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-doi-thay-_thumbnail_herobanner-1787463550005.jpg',
    description: 'Hướng dẫn chuẩn mực cách lập bàn thờ Phật, nghi thức tụng kinh Sáng - Chiều, lễ Phật, cúng ngọ, cúng thí thực cô hồn và hồi hướng công đức an lành.',
    totalVolumes: 1,
    volumes: [
      {
        volumeNumber: 1,
        volumeTitle: 'Nghi Thức Tu Tập Tại Gia',
        pageCount: 140,
        chapters: [
          {
            chapterNumber: 1,
            title: 'Chương 1: Hướng Dẫn Thiết Lập Bàn Thờ Phật',
            content: `Bàn thờ Phật nên đặt nơi trang nghiêm, sạch sẽ, thoáng mát nhất trong ngôi nhà. Tâm chí thành kính là lễ vật cúng dường quý báu nhất dâng lên Đức Thế Tôn.`,
          }
        ]
      }
    ]
  }
];

const targetPath = path.resolve(process.cwd(), 'src/data/sach-an-pham-data.json');
fs.writeFileSync(targetPath, JSON.stringify(booksData, null, 2), 'utf-8');
console.log('✅ Đã tạo thành công cơ sở dữ liệu kho tàng sách ấn phẩm tại:', targetPath);
