import { ReactNode } from "react";

export interface PostItem {
  id: string;
  imageUrl: string;          // Đường dẫn ảnh thumbnail
  category1: string;         // Danh mục chính (Ví dụ: "PHÁT TRIỂN BẢN THÂN - NỘI TÂM")
  category1Url?: string;      // Link chuyển trang danh mục 1
  category1IconUrl?: string;  // Đường dẫn icon SVG/PNG từ WordPress API sau này
  category1IconName?: string; // Tên Lucide Icon đại diện (nếu có)
  category1Icon?: ReactNode;  // Icon ReactNode trực tiếp (nếu có)
  title: string;             // Tiêu đề bài viết/video
  category2?: string;        // Chuỗi sự kiện/chương trình (Ví dụ: "CỘNG TU MỘT NGÀY AN LẠC")
  publishedDate: string;     // Ngày đăng (Ví dụ: "28/11/2025")
  viewsCount: number | string; // Lượt xem (Ví dụ: 300 hoặc "24.5K")
  description?: string;      // Mô tả ngắn bài viết
  author?: string;           // Tác giả / Diễn giả
  location?: string;         // Địa điểm tổ chức / thu âm
  targetUrl?: string;        // Link bài viết chi tiết
  large?: boolean;           // Cờ bài viết nổi bật (dùng cho card lớn)
}
