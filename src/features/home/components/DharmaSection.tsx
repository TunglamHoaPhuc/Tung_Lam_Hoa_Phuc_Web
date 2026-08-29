'use client';

import { FC } from "react";
import { C } from "@/config/theme";
import type { SectionRef } from "@/features/home/types";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PostCard } from "@/components/common/PostCard";
import { PostItem } from "@/types/post";

// ─── Dấu Ấn Hoằng Pháp: Đại diện tinh hoa từ 5 Chuyên Mục Cốt Lõi Tùng Lâm Hòa Phúc ─────────────
const TOP_POSTS: PostItem[] = [
  {
    id: "p1",
    imageUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-_-tong-phong-truyen-thua_-bai-tho-mien-nam-chon-to_thumbnail_herobanner-1787470412489.webp",
    category1: "Tông Chỉ Tu Học",
    category2: "TÔNG PHONG TRUYỀN THỪA",
    title: "Tiếp Bước Thầy Tôi — Hành Trình Nối Mạng Mạch Tông Phong",
    description: "Bài thơ và văn ký quan trọng đúc kết hạnh nguyện tiếp nối ánh sáng chánh pháp của Sư Tổ Ngộ Chân Tử và Sư Phụ Trụ Trì.",
    publishedDate: "23/08/2026",
    viewsCount: "54.2K",
    targetUrl: "/tong-chi-tu-hoc/tong-phong-truyen-thua-truc-lam",
  },
  {
    id: "p2",
    imageUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp",
    category1: "Dòng Chảy Hoằng Pháp",
    category2: "CỘNG TU ĐỊNH KỲ",
    title: "Pháp Hội Niệm Phật & Khóa Lễ Bát Quan Trai Giới",
    description: "Đạo tràng niệm Phật thanh tịnh hàng tuần, nuôi dưỡng bồ đề tâm và gieo trồng nhân lành về cõi Tây Phương Cực Lạc.",
    publishedDate: "20/08/2026",
    viewsCount: "38.6K",
    targetUrl: "/dong-chay-hoang-phap",
  },
  {
    id: "p3",
    imageUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-thap/bao-thap-banner.webp",
    category1: "Vũ Trụ Phật Giáo",
    category2: "BẢO THÁP & MANDALA",
    title: "Bảo Tháp Srilanka & Hệ Thống Mandala Ngũ Trí Như Lai",
    description: "Công trình tâm linh biểu tượng tôn thờ Xá Lợi Phật, Mandala 5 tầng và lịch sử nghệ thuật Phật giáo phương Đông.",
    publishedDate: "15/08/2026",
    viewsCount: "47.1K",
    targetUrl: "/vu-tru-phat-giao/bao-thap",
  },
  {
    id: "p4",
    imageUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/06-33-ung-hoa-than-duc-quan-am/33-ung-hoa-01.webp",
    category1: "Bảo Tượng Phật Giáo",
    category2: "THÁNH TỊNH ĐẠI HẢI CHÚNG",
    title: "33 Ứng Hóa Thân Quán Thế Âm Bồ Tát & Linh Vật Phật Giáo",
    description: "Chiêm bái trọn bộ 33 hóa thân đại từ đại bi của Đức Quán Âm và hệ thống bảo tượng tôn trí trang nghiêm tại tự viện.",
    publishedDate: "10/08/2026",
    viewsCount: "62.9K",
    targetUrl: "/bao-tuong-phat-giao",
  },
  {
    id: "p5",
    imageUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/di-qua-kho-vui-cuoc-doi-bia-1.webp",
    category1: "Trí Tuệ Phật Pháp",
    category2: "TỦ SÁCH TỨ ÂN",
    title: "Tác Phẩm 'Đi Qua Khổ Vui Cuộc Đời' — Thích Tâm Hòa",
    description: "Tập văn ký hồi ức đúc kết hành trình tu tập, chiêm nghiệm nhân sinh và lòng tri ân sâu sắc đối với Tam Bảo cùng Thầy Tổ.",
    publishedDate: "05/08/2026",
    viewsCount: "35.4K",
    targetUrl: "/tri-tue-phat-phap",
  },
  {
    id: "p6",
    imageUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp",
    category1: "Giới Thiệu Tông Phong",
    category2: "LỊCH SỬ TÙNG LÂM",
    title: "Lịch Sử Tùng Lâm Hòa Phúc — Nơi Gìn Giữ Mạng Mạch Chánh Pháp",
    description: "Tìm hiểu nguồn gốc khởi dựng ngôi tự viện và hành trình hoằng hóa độ sinh của Đại lão Hòa thượng Ngộ Chân Tử.",
    publishedDate: "01/08/2026",
    viewsCount: "71.3K",
    targetUrl: "/gioi-thieu/lich-su-tung-lam-hoa-phuc",
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
          subtitle="Kho tư liệu Phật học · Xem nhiều nhất từ 5 Chuyên mục cốt lõi"
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
