'use client';

import { FC } from "react";
import { C } from "@/config/theme";
import type { SectionRef } from "@/features/home/types";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PostCard } from "@/components/common/PostCard";
import { PostItem } from "@/types/post";

// ─── Dữ liệu bài viết chuẩn Taxonomy & Hoạt Động Tùng Lâm Hòa Phúc thực tế ─────────────
const TOP_POSTS: PostItem[] = [
  {
    id: "p1",
    imageUrl: "https://images.unsplash.com/photo-1772333137181-6ff2ce04afd2?w=640&h=380&fit=crop",
    category1: "Tu tập – chuyển hóa",
    category2: "CỘNG TU MỘT NGÀY AN LẠC",
    title: "Pháp thoại: Tứ Diệu Đế và Con Đường Giải Thoát",
    description: "Phát triển bản thân nội tâm qua hiểu biết về khổ, nguyên nhân, diệt khổ và con đường tu học chánh pháp.",
    publishedDate: "12/06/2026",
    viewsCount: "24.5K",
    targetUrl: "/dong-chay-hoang-phap",
  },
  {
    id: "p2",
    imageUrl: "https://images.unsplash.com/photo-1763994683525-885156ac4aa4?w=640&h=380&fit=crop",
    category1: "Phật pháp – đời sống",
    category2: "KHÓA TU TUỔI TRẺ",
    title: "Hành Trình Hoằng Pháp tại Tùng Lâm Hòa Phúc",
    description: "Ghi lại hành trình cống hiến và hoằng pháp không ngừng nghỉ của chư Tăng Tùng Lâm qua các năm.",
    publishedDate: "08/06/2026",
    viewsCount: "51.2K",
    targetUrl: "/dong-chay-hoang-phap",
  },
  {
    id: "p3",
    imageUrl: "https://images.unsplash.com/photo-1662036955112-dbc89df9d895?w=640&h=380&fit=crop",
    category1: "Giáo lý Phật giáo",
    category2: "PHÁP HỘI NIỆM PHẬT",
    title: "Giáo Lý Bát Nhã Ba La Mật và Thực Hành Thiền Quán",
    description: "Hiểu sâu về Bát Nhã qua thiền quán — chìa khóa mở cửa giải thoát và tuệ giác rạng ngời.",
    publishedDate: "03/06/2026",
    viewsCount: "18.7K",
    targetUrl: "/dong-chay-hoang-phap",
  },
  {
    id: "p4",
    imageUrl: "https://images.unsplash.com/photo-1618061013016-f8307f69f7a7?w=640&h=380&fit=crop",
    category1: "Chánh niệm – tỉnh thức",
    category2: "XUẤT GIA GIEO DUYÊN",
    title: "Câu Chuyện Thiền: Tiếng Chuông Ban Mai và Tâm Thức Tỉnh",
    description: "Mỗi tiếng chuông là một lời nhắc nhở trở về hiện tại — nguồn cội của mọi giải thoát an lạc.",
    publishedDate: "01/06/2026",
    viewsCount: "9.8K",
    targetUrl: "/dong-chay-hoang-phap",
  },
  {
    id: "p5",
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=640&h=380&fit=crop",
    category1: "Bồ tát hạnh",
    category2: "PHẬT THẤT NIỆM PHẬT",
    title: "Khuyến Phát Bồ Đề Tâm Giảng Luận — Thích Tâm Hòa",
    description: "Bộ sách giảng luận quan trọng nhất về Bồ Đề Tâm — nền tảng tu học của mọi hành giả Đại thừa.",
    publishedDate: "28/11/2025",
    viewsCount: "32.1K",
    targetUrl: "/dong-chay-hoang-phap",
  },
  {
    id: "p6",
    imageUrl: "https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=640&h=380&fit=crop",
    category1: "Giáo lý Tịnh Độ",
    category2: "ĐẠI LỄ VU LAN",
    title: "Ý Nghĩa Tri Ân & Báo Ân Trong Mùa Vu Lan Thắng Hội",
    description: "Thắp sáng ngọn đèn hiếu đạo, nuôi dưỡng tâm tri ân đối với Tứ Trọng Ân sâu nặng.",
    publishedDate: "15/07/2025",
    viewsCount: "42.8K",
    targetUrl: "/dong-chay-hoang-phap",
  },
];

interface DharmaSectionProps {
  sectionRef?: SectionRef;
}

/** "Dấu Ấn Hoằng Pháp" — Bố cục chuẩn 3 cột x 2 hàng (6 thẻ) đồng bộ */
const DharmaSection: FC<DharmaSectionProps> = ({ sectionRef }) => {
  return (
    <section
      ref={sectionRef}
      id="hoang-phap"
      className="py-16 px-4 md:px-10"
      style={{ background: C.dark }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* ── Section Header ── */}
        <SectionHeader
          title="DẤU ẤN HOẰNG PHÁP"
          subtitle="Kho tư liệu Phật học · Xem nhiều nhất"
        />

        {/* ── Grid: 3 Cột x 2 Hàng (6 Thẻ) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOP_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DharmaSection;
