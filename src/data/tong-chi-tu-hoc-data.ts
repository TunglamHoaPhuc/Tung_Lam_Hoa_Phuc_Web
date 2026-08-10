import { NavItem, SectionData } from '@/types/tong-chi-tu-hoc';

// ─── Navigation Items ───────────────────────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { id: 'tong-chi-tu-hoc', label: 'Giới Thiệu' },
  { id: 'tong-phong',       label: 'Tông Phong' },
  { id: 'phap-mon',         label: 'Pháp Môn' },
  { id: 'lo-trinh',         label: 'Lộ Trình' },
  { id: 'nep-song',         label: 'Nếp Sống' },
];

// ─── Mock Sections Data (Fallback khi API rỗng) ─────────────────────────────
export const INITIAL_SECTIONS_DATA: SectionData[] = [

  // ── SECTION 1: TÔNG PHONG TRUYỀN THỪA ───────────────────────────────────
  {
    id: 'tong-phong',
    title: 'TÔNG PHONG TRUYỀN THỪA',
    bgWatermark: 'https://images.unsplash.com/photo-1618165220283-e85246c4171c?auto=format&fit=crop&q=80',
    stt: 1,
    cards: [
      {
        id: 1,
        title: 'TIẾP BƯỚC THẦY TÔI',
        subtitle: 'Bài thơ quan trọng kể lại hành trình tiếp nối của Sư Phụ — ngọn lửa hoằng pháp truyền đời, dòng mạch tâm linh bất diệt.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/tiep-buoc-thay-toi',
      },
      {
        id: 2,
        title: 'ĐỜI THẦY',
        subtitle: 'Hành trạng và công hạnh phụng sự nhân sinh của vị Bổn Sư — cuộc đời cống hiến trọn vẹn cho giáo pháp và đồ chúng.',
        imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/doi-thay',
      },
      {
        id: 3,
        title: 'MIỀN NAM CHỐN TỔ',
        subtitle: 'Kế thừa dòng mạng mạch tâm linh từ tổ đình Hoằng Pháp — chiếc cầu nối giữa truyền thống và hiện đại.',
        imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/mien-nam-chon-to',
      },
      {
        id: 4,
        title: 'DI HUẤN SƯ TỔ',
        subtitle: 'Những lời giáo huấn cuối cùng và di nguyện của Sư Tổ — ngọn đèn soi đường cho các thế hệ đệ tử nối tiếp.',
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/di-huan-su-to',
      },
    ],
  },

  // ── SECTION 2: PHÁP MÔN HÀNH TRÌ ───────────────────────────────────────
  {
    id: 'phap-mon',
    title: 'PHÁP MÔN HÀNH TRÌ',
    bgWatermark: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80',
    stt: 2,
    cards: [
      {
        id: 101,
        title: 'NIỆM PHẬT',
        subtitle: 'Con đường niệm danh hiệu A-Di-Đà Phật — phương pháp tu tập phổ cập nhất, phù hợp mọi căn cơ, dẫn đến Tịnh Độ an lành.',
        imageUrl: 'https://images.unsplash.com/photo-1618554565982-3497a2e70642?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/niem-phat',
      },
      {
        id: 102,
        title: 'TỤNG KINH',
        subtitle: 'Hành trì tụng đọc kinh điển — nuôi dưỡng trí tuệ Bát-nhã, thanh tịnh hóa tâm thức và thiết lập nhân duyên giải thoát.',
        imageUrl: 'https://images.unsplash.com/photo-1618061013016-f8307f69f7a7?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/tung-kinh',
      },
      {
        id: 103,
        title: 'THIỀN TỌA',
        subtitle: 'Phương pháp thiền định tĩnh lặng — quán chiếu nội tâm, nhận ra bản tâm thanh tịnh và đạt đến an lạc giải thoát tự tại.',
        imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/thien-toa',
      },
      {
        id: 104,
        title: 'SÁM HỐI',
        subtitle: 'Nghi lễ sám hối sáu căn định kỳ — nhận ra và hóa giải nghiệp nhân từ thân khẩu ý, hướng đến đời sống thanh tịnh viên dung.',
        imageUrl: 'https://images.unsplash.com/photo-1763994683525-885156ac4aa4?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/sam-hoi',
      },
    ],
  },

  // ── SECTION 3: LỘ TRÌNH TU HỌC ──────────────────────────────────────────
  {
    id: 'lo-trinh',
    title: 'LỘ TRÌNH TU HỌC',
    bgWatermark: 'https://images.unsplash.com/photo-1709064159097-91b634741c96?auto=format&fit=crop&q=80',
    stt: 3,
    cards: [
      {
        id: 201,
        title: 'LỘ TRÌNH NGƯỜI MỚI BẮT ĐẦU',
        subtitle: 'Chương trình nhập môn 3 tháng — từ lễ nghi cơ bản, gieo duyên lành với Tam Bảo đến thiết lập thói quen tu học hằng ngày.',
        imageUrl: 'https://images.unsplash.com/photo-1769488287238-6b82889f4bb4?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/lo-trinh-nguoi-moi',
      },
      {
        id: 202,
        title: 'LỘ TRÌNH NGƯỜI CHUYÊN TU',
        subtitle: 'Chương trình chuyên sâu 1 năm — tu học hệ thống, nhập thất định kỳ, tăng trưởng định lực và trí tuệ Phật pháp toàn diện.',
        imageUrl: 'https://images.unsplash.com/photo-1618165220283-e85246c4171c?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/lo-trinh-chuyen-tu',
      },
      {
        id: 203,
        title: 'LỘ TRÌNH NGƯỜI TRẺ',
        subtitle: 'Hành trình tu học dành cho tuổi 18-35 — kết hợp tu học và phục vụ, phát triển toàn diện thân-tâm-trí trong tinh thần Phật giáo.',
        imageUrl: 'https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/lo-trinh-nguoi-tre',
      },
    ],
  },

  // ── SECTION 4: NẾP SỐNG THIỀN GIA ───────────────────────────────────────
  {
    id: 'nep-song',
    title: 'NẾP SỐNG THIỀN GIA',
    bgWatermark: 'https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?auto=format&fit=crop&q=80',
    stt: 4,
    cards: [
      {
        id: 301,
        title: 'VĂN HÓA ỨNG XỬ TẠI CHÙA',
        subtitle: 'Hướng dẫn văn hóa ứng xử và giao tiếp tại chùa — từ cách chào hỏi, đi đứng, ăn mặc đến oai nghi trong các buổi lễ và tu học.',
        imageUrl: 'https://images.unsplash.com/photo-1498747468843-5ec2ad31cb89?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/van-hoa-ung-xu',
      },
      {
        id: 302,
        title: 'OAI NGHI NGƯỜI CON PHẬT',
        subtitle: 'Chuẩn mực oai nghi đi, đứng, nằm, ngồi của người Phật tử — biểu hiện của tâm thức thanh tịnh và hành trì giới luật nghiêm mật.',
        imageUrl: 'https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/oai-nghi',
      },
      {
        id: 303,
        title: 'BỔN PHẬN PHẬT TỬ TẠI GIA',
        subtitle: 'Trách nhiệm và bổn phận của người Phật tử sống đời thường — tu tập ngay trong cuộc sống gia đình, công việc và xã hội.',
        imageUrl: 'https://images.unsplash.com/photo-1721113411239-3e87d435dda6?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/bon-phan-phat-tu',
      },
      {
        id: 304,
        title: 'THIỀN HÀNH TRONG ĐỜI SỐNG',
        subtitle: 'Ứng dụng thiền định vào cuộc sống hằng ngày — biến mỗi bước đi, mỗi hơi thở thành phương tiện tu tập và thức tỉnh tâm linh.',
        imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80',
        link: '/tong-chi-tu-hoc/thien-hanh',
      },
    ],
  },
];
