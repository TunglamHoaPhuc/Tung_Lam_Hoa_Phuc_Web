import { NavItem, SectionData } from '@/types/tong-chi';

export const NAV_ITEMS: NavItem[] = [
  { id: 'tong-chi', label: 'Tông chỉ' },
  { id: 'tong-phong', label: 'Tông phong' },
  { id: 'nen-tang', label: 'Nền tảng' },
  { id: 'phap-mon', label: 'Pháp môn' },
  { id: 'lo-trinh', label: 'Lộ trình' },
];

export const INITIAL_SECTIONS_DATA: SectionData[] = [
  {
    id: 'tong-phong',
    title: 'TÔNG PHONG TRUYỀN THỪA',
    bgWatermark: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80',
    cards: [
      {
        id: 1,
        title: 'TIẾP BƯỚC THẦY TÔI',
        subtitle: 'Bài thơ quan trọng kể lại hành trình tiếp nối của Sư Phụ.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80',
      },
      {
        id: 2,
        title: 'ĐỜI THẦY',
        subtitle: 'Hành trạng và công hạnh phụng sự nhân sinh.',
        imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80',
      },
      {
        id: 3,
        title: 'MIỀN NAM CHỐN TỔ',
        subtitle: 'Kế thừa dòng mạng mạch tâm linh từ Hoằng Pháp.',
        imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'nen-tang',
    title: 'NỀN TẢNG TU HỌC',
    cards: [
      {
        id: 101,
        title: 'BỒ ĐỀ TÂM',
        subtitle: 'Căn bản của con đường giải thoát và giác ngộ.',
        imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80',
      },
    ],
  },
];