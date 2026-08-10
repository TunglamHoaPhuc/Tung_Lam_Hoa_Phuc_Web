export type MediaType = 'article' | 'story' | 'audio' | 'book' | 'video' | 'music' | 'movie';

export interface OriginTag {
  type: 'event' | 'statue' | 'space' | 'principle';
  label: string; // e.g. "CỘNG TU MỘT NGÀY AN LẠC", "ĐỨC PHẬT THÍCH CA", "TAM BẢO", "TÔNG CHỈ TU HỌC"
  targetUrl: string;
}

export interface AttributedEntity {
  name: string; // e.g. "TÔN GIẢ ĐẠI CA DIẾP"
  title: string; // e.g. "ĐẦU ĐÀ ĐỆ NHẤT"
  avatarUrl: string;
}

export interface WisdomItem {
  id: string;
  slug: string;
  title: string;
  type: MediaType;
  primaryCategoryTag: string; // e.g. "Phát triển bản thân - Nội tâm", "Phật học phổ thông", "Tu tập - Chuyển hóa", "Giáo lý Phật giáo", "Phật học - Biểu tượng tâm linh"
  originTag: OriginTag;
  publishDate: string; // '28/11/2025'
  views: number;
  thumbnailUrl: string;
  mediaUrl?: string;
  excerpt?: string;
  contentHtml?: string;
  attributedEntity?: AttributedEntity;
}
