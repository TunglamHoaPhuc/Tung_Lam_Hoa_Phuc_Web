// --- DỮ LIỆU CẤP 1 & 2 (TRANG TỔNG) ---

// NavItem dùng cho SubNavbar / SidebarNav
export interface NavItem {
  id: string;
  label: string;
}

// CardItem — alias của ACFCardItem (dùng trong SectionCarousel, SectionBlock)
export interface CardItem {
  id: string | number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
}

// SectionData — alias của ACFTongChiSection với CardItem (dùng trong page + components)
export interface SectionData {
  id: string;
  title: string;
  bgWatermark?: string;
  bgImage?: string; // ảnh nền động từ WordPress taxonomy
  stt?: number;
  cards: CardItem[];
}


export interface ACFCardItem {
  id: string | number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
}

export interface ACFTongChiSection {
  id: string;
  stt: number;
  title: string;
  subtitle?: string;
  bgWatermark?: string;
  cards: ACFCardItem[];
}

export interface TongChiPageData {
  pageTitle: string;
  pageSubtitle: string;
  heroBannerUrl: string;
  sections: ACFTongChiSection[];
}

// --- DỮ LIỆU CẤP 3 (TRANG CHI TIẾT BÀI VIẾT) ---

export interface TimelineItem {
  title: string;
  timeMark: string;
  content: string;
  imageUrl?: string;
}

export interface KeywordPopup {
  keyword: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  summary: string;
  relatedLink?: string;
}

export interface PhotoAlbumItem {
  imageUrl: string;
  caption?: string;
  space3dLink?: string; // Link đến không gian 3D / di tích
}

export interface RelatedContentBlock {
  video?: {
    title: string;
    subtitle?: string;
    description?: string;
    videoUrl: string;
  };
  article?: {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    articleUrl: string;
  };
}

export interface LearnMoreCard {
  tag: string;
  title: string;
  shortDesc: string;
  bgImage: string;
  linkUrl: string;
}

export interface TongChiDetailData {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  bannerImage: string;
  contentWysiwyg: string;
  photoAlbum: PhotoAlbumItem[];       // Trường 5
  timeline: TimelineItem[];            // Trường 6
  popups: KeywordPopup[];              // Trường 7
  relatedContent?: RelatedContentBlock; // Trường 8
  learnMoreCards: LearnMoreCard[];     // Trường 9
}
