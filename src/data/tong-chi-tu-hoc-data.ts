import { NavItem, SectionData } from '@/types/tong-chi-tu-hoc';

// ─── Navigation Items ───────────────────────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { id: 'tong-chi-tu-hoc', label: 'Giới Thiệu' },
  { id: 'tong-phong',       label: 'Tông Phong' },
  { id: 'nen-tang',         label: 'Nền Tảng' },
  { id: 'phap-mon',         label: 'Hành Trì' },
  { id: 'lo-trinh',         label: 'Lộ Trình' },
  { id: 'nep-song',         label: 'Nếp Sống' },
];

// ─── Mock Sections Data (Fallback khi API rỗng) ─────────────────────────────
export const INITIAL_SECTIONS_DATA: SectionData[] = [

  // ── SECTION 1: TÔNG PHONG TRUYỀN THỪA ───────────────────────────────────
  {
    id: 'tong-phong',
    title: 'TÔNG PHONG TRUYỀN THỪA',
    bgWatermark: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-banner.jpg',
    stt: 1,
    cards: [
      {
        id: 1,
        title: 'TIẾP BƯỚC THẦY TÔI',
        subtitle: 'Kính dâng bậc Ân sư khả kính – Sư Tổ Ngộ Chân Tử khai sơn chốn Tổ Hoằng Pháp.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-banner-thumnail.jpg',
        link: '/tong-chi-tu-hoc/tiep-buoc-thay-toi',
      },
      {
        id: 2,
        title: 'ĐỜI THẦY',
        subtitle: 'Kính dâng bậc Ân Sư Bổn Sư — Hòa Thượng Thích Chân Tính (Đại Sư Thanh Lương).',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-tong-phong-truyen-thua-bai-tho-doi-thay-thumbnail-herobanner.jpg',
        link: '/tong-chi-tu-hoc/tong-phong-truyen-thua-doi-thay',
      },
      {
        id: 3,
        title: 'MIỀN NAM CHỐN TỔ',
        subtitle: 'Hướng về Tổ Đình Hoằng Pháp & Tháp Tổ Nhị Nghiêm (Hóc Môn, TP.HCM).',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-tong-phong-truyen-thua-bai-tho-mien-nam-chon-to-thumbnail-herobanner.jpg',
        link: '/tong-chi-tu-hoc/mien-nam-chon-to',
      },
    ],
  },

  // ── SECTION 2: NỀN TẢNG TU HỌC ──────────────────────────────────────────
  {
    id: 'nen-tang',
    title: 'NỀN TẢNG TU HỌC',
    bgWatermark: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.jpg',
    stt: 2,
    cards: [
      {
        id: 4,
        title: 'BỒ ĐỀ TÂM — CỘI NGUỒN MỌI THIỆN PHÁP',
        subtitle: 'Nền tảng khởi đầu và động lực tối thượng trên lộ trình giác ngộ giải thoát.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.jpg',
        link: '/tong-chi-tu-hoc/bo-de-tam-coi-nguon-thien-phap',
      },
      {
        id: 25,
        title: 'TAM QUY — NƯƠNG TỰA BA NGÔI BÁU',
        subtitle: 'Quay về nương tựa ân đức Phật – Pháp – Tăng, đánh thức năng lực giác ngộ nơi chính mình.',
        imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/nen-tang-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-tam-quy-ngu-gioi-banner-sach-3-nt-5-th-jpg.webp',
        link: '/tong-chi-tu-hoc/tam-quy',
      },
      {
        id: 6,
        title: 'THẬP THIỆN NGHIỆP — CON ĐƯỜNG PHƯỚC ĐỨC & AN LẠC',
        subtitle: 'Mười việc lành chuyển hóa ba nghiệp Thân – Khẩu – Ý thanh tịnh.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-nen-tang-tu-hoc-thap-thien-thumbnail-herobanner.jpg',
        link: '/tong-chi-tu-hoc/thap-thien-nghiep-con-duong-phuoc-duc',
      },
      {
        id: 7,
        title: 'BỒ TÁT HẠNH — LỤC ĐỘ BA LA MẬT',
        subtitle: 'Sáu pháp tu vi diệu đưa người con Phật từ bờ mê sang bến giác an vui.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-tat-hanh-luc-do-van-hanh-banner-thumbnail.jpg',
        link: '/tong-chi-tu-hoc/bo-tat-hanh-luc-do-ba-la-mat',
      },
    ],
  },

  // ── SECTION 3: PHƯƠNG PHÁP HÀNH TRÌ ───────────────────────────────────────
  {
    id: 'phap-mon',
    title: 'PHƯƠNG PHÁP HÀNH TRÌ',
    bgWatermark: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/thien-toa.jpg',
    stt: 3,
    cards: [
      {
        id: 8,
        title: 'NIỆM PHẬT',
        subtitle: 'Con đường niệm danh hiệu A-Di-Đà Phật — phương pháp tu tập thù thắng, dẫn đến Tịnh Độ an lành.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/niem-phat.jpg',
        link: '/tong-chi-tu-hoc/niem-phat-phuong-phap-tro-hanh',
      },
      {
        id: 9,
        title: 'TỤNG KINH',
        subtitle: 'Hành trì tụng đọc kinh điển — nuôi dưỡng trí tuệ Bát-nhã, thanh tịnh hóa tâm thức và chuyển hóa nghiệp chướng.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tung-kinh.jpg',
        link: '/tong-chi-tu-hoc/tung-kinh-soi-sang-tri-tue',
      },
      {
        id: 10,
        title: 'THIỀN TẬP',
        subtitle: 'Phương pháp thiền định tĩnh lặng — quán chiếu nội tâm, nhận ra bản tâm thanh tịnh và an trú hiện tại.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/thien-toa.jpg',
        link: '/tong-chi-tu-hoc/thien-tap-tinh-lang-tu-than',
      },
      {
        id: 11,
        title: 'LẠY PHẬT',
        subtitle: 'Ngũ thể đầu địa — đảnh lễ bậc Đại Giác để tiêu trừ bản ngã kiêu mạn và nghiệp chướng nhiều đời.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/1.jpg',
        link: '/tong-chi-tu-hoc/lay-phat-tieu-tru-ban-nga',
      },
      {
        id: 12,
        title: 'SÁM HỐI',
        subtitle: 'Ăn năn lỗi trước, phòng ngừa lỗi sau — tịnh hóa thân tâm và làm mới chính mình.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/594929082-1281299250704762-2908984688896417320-n.jpg',
        link: '/tong-chi-tu-hoc/sam-hoi-tinh-hoa-than-tam',
      },
      {
        id: 13,
        title: 'NGHE PHÁP',
        subtitle: 'Thính pháp khai mở chánh kiến — nấc thang Văn trong tiến trình Văn – Tư – Tu.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/nghe-phap.png',
        link: '/tong-chi-tu-hoc/nghe-phap-khai-mo-chanh-kien',
      },
      {
        id: 14,
        title: 'PHỤNG SỰ',
        subtitle: 'Phụng sự chúng sinh là cúng dường chư Phật — dấn thân công quả tạo phúc báu thiền môn.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/bon-phan-nguoi-phat-tu-tai-gia.jpg',
        link: '/tong-chi-tu-hoc/phung-su-tot-doi-dep-dao',
      },
      {
        id: 15,
        title: 'BỐ THÍ CÚNG DƯỜNG',
        subtitle: 'Mở rộng bàn tay san sẻ tài vật, giáo pháp và sự không sợ hãi cho muôn loài.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/bo-thi-cung-duong.jpg',
        link: '/tong-chi-tu-hoc/bo-thi-cung-duong-nuoi-lon-phuc-bau',
      },
    ],
  },

  // ── SECTION 4: LỘ TRÌNH TU HỌC ──────────────────────────────────────────
  {
    id: 'lo-trinh',
    title: 'LỘ TRÌNH TU HỌC',
    bgWatermark: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/lo-trinh-danh-cho-nguoi-moi-bat-dau.jpg',
    stt: 4,
    cards: [
      {
        id: 16,
        title: 'LỘ TRÌNH DÀNH CHO NGƯỜI MỚI BẮT ĐẦU',
        subtitle: 'Chương trình nhập môn 5 bước — Khởi tâm, Học hỏi, Thực hành, Kiên trì, Chuyển hóa.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/lo-trinh-danh-cho-nguoi-moi-bat-dau.jpg',
        link: '/tong-chi-tu-hoc/lo-trinh-tu-hoc-nguoi-moi-bat-dau',
      },
      {
        id: 17,
        title: 'LỘ TRÌNH DÀNH CHO NGƯỜI TRẺ',
        subtitle: 'Nuôi dưỡng lý tưởng sống, rèn luyện nhân cách và xây dựng điểm tựa tâm linh vững chắc.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/lo-trinh-danh-cho-nguoi-tre.jpg',
        link: '/tong-chi-tu-hoc/lo-trinh-tu-hoc-nguoi-tre',
      },
      {
        id: 18,
        title: 'LỘ TRÌNH CHO NGƯỜI BẬN RỘN',
        subtitle: 'Nuôi dưỡng đời sống tỉnh thức ngay giữa công việc, gia đình và bộn bề thường nhật.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/lo-trinh-danh-cho-nguoi-moi-bat-dau.jpg',
        link: '/tong-chi-tu-hoc/lo-trinh-tu-hoc-nguoi-ban-ron',
      },
      {
        id: 19,
        title: 'LỘ TRÌNH DÀNH CHO NGƯỜI CHUYÊN TU',
        subtitle: 'Cân bằng Học – Tu – Chấp tác để giữ vững sơ tâm Bồ Đề và đạt đến giải thoát rốt ráo.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/lo-trinh-danh-cho-nguoi-chuyen-tu.png',
        link: '/tong-chi-tu-hoc/lo-trinh-tu-hoc-nguoi-chuyen-tu',
      },
    ],
  },

  // ── SECTION 5: NẾP SỐNG THIỀN GIA ───────────────────────────────────────
  {
    id: 'nep-song',
    title: 'NẾP SỐNG THIỀN GIA',
    bgWatermark: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/van-hoa-ung-xu-giao-tiep-tai-chua.jpg',
    stt: 5,
    cards: [
      {
        id: 20,
        title: 'VĂN HÓA GIAO TIẾP & ỨNG XỬ TẠI CHÙA',
        subtitle: 'Hướng dẫn văn hóa ứng xử tại Nhà Khách, Trai Đường, Nhà Bếp và Chánh Điện.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/van-hoa-ung-xu-giao-tiep-tai-chua.jpg',
        link: '/tong-chi-tu-hoc/van-hoa-ung-xu-giao-tiep-tai-chua',
      },
      {
        id: 21,
        title: 'OAI NGHI NGƯỜI CON PHẬT',
        subtitle: 'Giữ gìn thân hành đoan chính trong từng bước đi, đứng, nằm, ngồi của người học Phật.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/oai-nghi-nguoi-con-phat.jpg',
        link: '/tong-chi-tu-hoc/oai-nghi-nguoi-con-phat',
      },
      {
        id: 22,
        title: 'BỔN PHẬN NGƯỜI PHẬT TỬ TẠI GIA',
        subtitle: 'Sống tốt đời đẹp đạo, làm tròn trách nhiệm đối với gia đình, xã hội và Tam Bảo.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/bon-phan-nguoi-phat-tu-tai-gia.jpg',
        link: '/tong-chi-tu-hoc/bon-phan-nguoi-phat-tu-tai-gia',
      },
      {
        id: 23,
        title: 'ĂN CHAY — TỊNH HÓA THÂN TÂM',
        subtitle: 'Tôn trọng sự sống, nuôi dưỡng lòng từ bi và giữ gìn hạnh phúc gia đình.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/tong-chi-tu-hoc-banner.jpg',
        link: '/tong-chi-tu-hoc/an-chay-tinh-hoa-than-tam',
      },
      {
        id: 24,
        title: 'PHÓNG SINH & BẢO VỆ MÔI TRƯỜNG',
        subtitle: 'Mở rộng lòng từ, tôn trọng sự sống và hành động phóng sinh có trí tuệ.',
        imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/phong-sinh-tu-phuc.jpg',
        link: '/tong-chi-tu-hoc/phong-sinh-tu-phuc-bao-ve-moi-truong',
      },
    ],
  },
];
