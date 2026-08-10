export interface PhapThoaiTalk {
  id: string;
  code: string; // e.g. "#phapthoai 001"
  title: string;
  speaker: string; // e.g. "Sa-môn Vô Trí"
  category: string; // e.g. "Tâm lý – chữa lành"
  categoryBadge: string; // e.g. "🪔 TU TẬP - CHUYỂN HÓA"
  program: string; // e.g. "CỘNG TU MỘT NGÀY AN LẠC"
  durationMinutes: number; // e.g. 45
  durationText: string; // e.g. "45 phút"
  date: string;
  views: number;
  thumbnailUrl: string;
  audioUrl?: string;
  youtubeUrl?: string;
  tags: string[]; // e.g. ["chữa lành", "vượt qua nỗi đau", "tha thứ"]
  summary: string;
}

export const GIANG_DUONG_TOPICS = [
  "Tất cả",
  "Tâm lý – chữa lành",
  "Phật pháp – đời sống",
  "Chánh niệm – tỉnh thức",
  "Tu tập – chuyển hóa",
  "Phát triển bản thân - nội tâm",
  "Phật học phổ thông",
  "Giáo lý Phật giáo",
  "Bồ Tát hạnh",
  "Phật học - biểu tượng tâm linh",
];

export const EMOTION_QUICK_TAGS = [
  "Sang chấn tâm lý",
  "Chấp nhận bản thân",
  "Tha thứ",
  "Mất phương hướng",
  "Vượt qua nỗi đau",
  "Biết ơn sự sống",
  "Giải tỏa lo âu",
  "Bình an nội tâm",
  "Hóa giải hận thù",
];

export const PHAP_THOAI_FEATURED: PhapThoaiTalk[] = [
  {
    id: "f1",
    code: "#phapthoai 002",
    title: 'Pháp âm "Tu tập đúng cách" - Sa-môn Vô Trí',
    speaker: "Sa-môn Vô Trí",
    category: "Tu tập – chuyển hóa",
    categoryBadge: "🪔 TU TẬP - CHUYỂN HÓA",
    program: "CỘNG TU MỘT NGÀY AN LẠC",
    durationMinutes: 65,
    durationText: "65 phút",
    date: "28/11/2025",
    views: 520,
    thumbnailUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=800&h=480&fit=crop",
    tags: ["tu tập", "chuyển hóa", "chân lý"],
    summary: "Hướng dẫn thực hành các thời khóa tu tập chánh niệm hằng ngày, giúp hành giả vượt qua thói quen buông lung và thiết lập an lạc nội tâm.",
  },
  {
    id: "f2",
    code: "#phapthoai 001",
    title: '"Mãi mãi một niềm tin" - Sa-môn Vô Trí',
    speaker: "Sa-môn Vô Trí",
    category: "Phát triển bản thân - nội tâm",
    categoryBadge: "🪔 PHÁT TRIỂN BẢN THÂN - NỘI TÂM",
    program: "KHÓA TU MÙA HÈ TÙNG LÂM",
    durationMinutes: 72,
    durationText: "72 phút",
    date: "15/11/2025",
    views: 890,
    thumbnailUrl: "https://images.unsplash.com/photo-1564834325499-cd770c8ed0ef?w=800&h=480&fit=crop",
    tags: ["niềm tin", "bình an", "chấp nhận bản thân"],
    summary: "Nuôi dưỡng chánh tín trên con đường giải thoát, củng cố lòng tin nơi Tam Bảo và khả năng tự giác ngộ của bản thân.",
  },
];

export const PHAP_THOAI_ALL: PhapThoaiTalk[] = [
  ...PHAP_THOAI_FEATURED,
  {
    id: "f3",
    code: "#phapthoai 003",
    title: "Chữa lành vết thương lòng bằng lòng từ bi",
    speaker: "Thượng tọa Thích Hòa Phúc",
    category: "Tâm lý – chữa lành",
    categoryBadge: "🪔 TÂM LÝ - CHỮA LÀNH",
    program: "KHÓA TU TÂM AN LẠC",
    durationMinutes: 45,
    durationText: "45 phút",
    date: "10/11/2025",
    views: 1240,
    thumbnailUrl: "https://images.unsplash.com/photo-1626807126017-f01e8c07d27e?w=800&h=480&fit=crop",
    tags: ["sang chấn tâm lý", "chữa lành", "vượt qua nỗi đau", "tha thứ"],
    summary: "Hóa giải những tổn thương tâm lý quá khứ bằng năng lượng từ bi và lòng biết ơn sự sống.",
  },
  {
    id: "f4",
    code: "#phapthoai 004",
    title: "Nghệ thuật ứng phó với mất phương hướng tuổi trẻ",
    speaker: "Thượng tọa Thích Hòa Phúc",
    category: "Phật pháp – đời sống",
    categoryBadge: "🪔 PHẬT PHÁP - ĐỜI SỐNG",
    program: "CÂU LẠC BỘ THANH NIÊN PHẬT TỬ",
    durationMinutes: 55,
    durationText: "55 phút",
    date: "05/11/2025",
    views: 670,
    thumbnailUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=480&fit=crop",
    tags: ["mất phương hướng", "chấp nhận bản thân", "giải tỏa lo âu"],
    summary: "Tìm lại điểm tựa tâm linh vững chắc giữa áp lực cuộc sống hiện đại và chọn cho mình hướng đi đúng đắn.",
  },
  {
    id: "f5",
    code: "#phapthoai 005",
    title: "Chánh niệm trong từng bước chân ban mai",
    speaker: "Sa-môn Vô Trí",
    category: "Chánh niệm – tỉnh thức",
    categoryBadge: "🪔 CHÁNH NIỆM - TỈNH THỨC",
    program: "THIỀN HÀNH BAN MAI",
    durationMinutes: 28,
    durationText: "28 phút",
    date: "01/11/2025",
    views: 450,
    thumbnailUrl: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=800&h=480&fit=crop",
    tags: ["bình an nội tâm", "biết ơn sự sống"],
    summary: "Thực hành thiền đi và hơi thở chánh niệm giúp cơ thể giải tỏa căng thẳng ngay trong sinh hoạt thường nhật.",
  },
  {
    id: "f6",
    code: "#phapthoai 006",
    title: "Bồ Tát Hạnh — Phụng sự không điều kiện",
    speaker: "Thượng tọa Thích Hòa Phúc",
    category: "Bồ Tát hạnh",
    categoryBadge: "🪔 BỒ TÁT HẠNH",
    program: "ĐẠI LỄ PHÁT NGUYỆN",
    durationMinutes: 80,
    durationText: "80 phút",
    date: "20/10/2025",
    views: 1100,
    thumbnailUrl: "https://images.unsplash.com/photo-1658834117213-d0b7e7d8b9ec?w=800&h=480&fit=crop",
    tags: ["hóa giải hận thù", "tha thứ"],
    summary: "Khám phá hạnh nguyện cứu khổ ban vui của chư Bồ Tát và ứng dụng tinh thần dấn thân phụng sự nhân sinh.",
  },
];
