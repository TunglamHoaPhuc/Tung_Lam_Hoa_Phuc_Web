'use client';

import React, { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, Compass, Waves } from 'lucide-react';
import { C } from '@/config/theme';
import type { SectionRef } from '@/features/home/types';
import { SectionHeader } from '@/components/common/SectionHeader';
import { PostCard } from '@/components/common/PostCard';
import { PostItem } from '@/types/post';

// ─── Dữ liệu khởi tạo hiển thị tức thì (Zero-flicker SSR fallback) ─────────────
const INITIAL_TOP_POSTS: PostItem[] = [
  {
    id: 'tc-4',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp',
    category1: 'Tông Chỉ Tu Học',
    category2: 'NỀN TẢNG TU HỌC',
    category1Url: '/tong-chi-tu-hoc',
    title: 'BỒ ĐỀ TÂM — CỘI NGUỒN MỌI THIỆN PHÁP',
    description: 'Nền tảng khởi đầu và động lực tối thượng trên lộ trình tu học giác ngộ, xây dựng nếp sống tỉnh thức an lạc.',
    publishedDate: '01/08/2026',
    viewsCount: '58.2K',
    targetUrl: '/tong-chi-tu-hoc/bo-de-tam-coi-nguon-thien-phap',
  },
  {
    id: 'post-02',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
    category1: 'Dòng Chảy Hoằng Pháp',
    category2: 'HOẰNG PHÁP ĐỘ SINH',
    category1Url: '/dong-chay-hoang-phap',
    title: 'Đại Lễ Vu Lan Báo Hiếu — Thắp Sáng Ngọn Đèn Tri Ân Cha Mẹ',
    description: 'Mùa báo hiếu thiêng liêng trở về nguồn cội, nuôi dưỡng tình thương và sự tri ân công đức sinh thành dưỡng dục.',
    publishedDate: '15/08/2026',
    viewsCount: '52.4K',
    targetUrl: '/dong-chay-hoang-phap/dai-le-vu-lan-bao-hieu-tri-an',
  },
  {
    id: 'post-26827',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/page_01.webp',
    category1: 'Trí Tuệ Phật Pháp',
    category2: 'PHÁP ÂM & KHAI THỊ',
    category1Url: '/tri-tue-phat-phap',
    title: 'Pháp Âm Chủ Đề: “Tu Tập Đúng Cách” — Sa-môn Vô Trí',
    description: 'Chỉ dẫn tinh tế về phương pháp điều phục thân tâm, nhận diện chướng ngại và chuyển hóa khổ đau trong đời sống thường nhật.',
    publishedDate: '10/08/2026',
    viewsCount: '41.2K',
    targetUrl: '/tri-tue-phat-phap/phap-am-chu-de-tu-tap-dung-cach-cong-tu-mot-ngay-an-lac',
  },
  {
    id: 'tc-1',
    imageUrl: 'https://admin.tunglamhoaphuc.com/wp-content/uploads/2026/07/tong-chi-tu-hoc-tong-phong-truyen-thua-tiep-buoc-thay-toi-banner-thumnail-scaled.jpg',
    category1: 'Tông Chỉ Tu Học',
    category2: 'TÔNG PHONG TRUYỀN THỪA',
    category1Url: '/tong-chi-tu-hoc',
    title: 'TIẾP BƯỚC THẦY TÔI — NỐI NGUỒN TỔ ĐẠO',
    description: 'Kính dâng bậc Ân Sư Sư Tổ Ngộ Chân Tử khai sơn chốn Tổ Hoằng Pháp, kế thừa mạng mạch chánh pháp ngàn đời.',
    publishedDate: '01/08/2026',
    viewsCount: '54.2K',
    targetUrl: '/tong-chi-tu-hoc/tong-phong-truyen-thua-truc-lam',
  },
  {
    id: 'post-01',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
    category1: 'Dòng Chảy Hoằng Pháp',
    category2: 'CỘNG TU ĐỊNH KỲ',
    category1Url: '/dong-chay-hoang-phap',
    title: 'Pháp Hội Niệm Phật & Khóa Lễ Bát Quan Trai Giới',
    description: 'Ngày thanh tịnh trau dồi phạm hạnh, nhiếp tâm niệm Phật cầu an lạc cho muôn loài đệ tử tại gia.',
    publishedDate: '23/08/2026',
    viewsCount: '38.6K',
    targetUrl: '/dong-chay-hoang-phap/phap-hoi-niem-phat-hang-tuan',
  },
  {
    id: 'post-03',
    imageUrl: 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/page_01.webp',
    category1: 'Trí Tuệ Phật Pháp',
    category2: 'TỦ SÁCH TỨ ÂN',
    category1Url: '/tri-tue-phat-phap',
    title: "Tác Phẩm 'Đi Qua Khổ Vui Cuộc Đời' — Thích Tâm Hòa",
    description: 'Tập văn ký hồi ức đúc kết hành trình tu tập, chiêm nghiệm nhân sinh và lòng tri ân sâu sắc đối với Tam Bảo cùng Thầy Tổ.',
    publishedDate: '05/08/2026',
    viewsCount: '35.4K',
    targetUrl: '/tri-tue-phat-phap/tac-pham-di-qua-kho-vui-cuoc-doi',
  },
];

type CategoryTab = 'all' | 'tong-chi' | 'dong-chay' | 'tri-tue';

interface TabItem {
  id: CategoryTab;
  label: string;
  shortLabel: string;
  icon: string;
  exploreUrl: string;
  exploreLabel: string;
}

const TABS: TabItem[] = [
  {
    id: 'all',
    label: 'TẤT CẢ TIÊU BIỂU',
    shortLabel: 'Tiêu Biểu',
    icon: '🌟',
    exploreUrl: '/dong-chay-hoang-phap',
    exploreLabel: 'Khám Phá Dòng Chảy Hoằng Pháp',
  },
  {
    id: 'tong-chi',
    label: 'TÔNG CHỈ TU HỌC',
    shortLabel: 'Tông Chỉ',
    icon: '🪷',
    exploreUrl: '/tong-chi-tu-hoc',
    exploreLabel: 'Khám Phá Toàn Bộ Tông Chỉ Tu Học',
  },
  {
    id: 'dong-chay',
    label: 'DÒNG CHẢY HOẰNG PHÁP',
    shortLabel: 'Hoằng Pháp',
    icon: '🌊',
    exploreUrl: '/dong-chay-hoang-phap',
    exploreLabel: 'Xem Toàn Bộ Dòng Chảy Hoằng Pháp',
  },
  {
    id: 'tri-tue',
    label: 'TRÍ TUỆ PHẬT PHÁP',
    shortLabel: 'Trí Tuệ',
    icon: '💡',
    exploreUrl: '/tri-tue-phat-phap',
    exploreLabel: 'Kho Tàng Trí Tuệ Phật Pháp',
  },
];

interface DharmaSectionProps {
  sectionRef?: SectionRef;
}

/**
 * 🪷 DẤU ẤN HOẰNG PHÁP
 * - Tiêu đề: Font 'UTM Niagara' vàng kim rực rỡ, phát sáng trang nghiêm
 * - Subtitle: Những bài viết được quan tâm & theo dõi nhiều nhất (tối giản, bỏ chữ kho tư liệu)
 * - Bố cục 5 bài viết:
 *   + 1 Post Card ảnh to nhất ở ngoài cùng (Featured Hero Card)
 *   + 4 Post Card xếp lưới 2x2 cân đối bên cạnh
 *   + Hover nhẹ nhàng mới hiển thị mô tả, ngày đăng và lượt xem
 */
const DharmaSection: FC<DharmaSectionProps> = ({ sectionRef }) => {
  const [topPosts, setTopPosts] = useState<PostItem[]>(INITIAL_TOP_POSTS.slice(0, 5));
  const [loading, setLoading] = useState(false);

  // 🚀 Tự động đồng bộ 5 bài viết có lượt theo dõi cao nhất từ API
  useEffect(() => {
    let isMounted = true;
    async function fetchFeatured() {
      try {
        setLoading(true);
        const res = await fetch('/api/public/dharma-featured');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            const list = json.data.featured?.length > 0 ? json.data.featured : INITIAL_TOP_POSTS;
            setTopPosts(list.slice(0, 5));
          }
        }
      } catch (err) {
        console.warn('Lỗi tải dữ liệu Dấu Ấn Hoằng Pháp:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredPost = topPosts[0];
  const sidePosts = topPosts.slice(1, 5);

  return (
    <section
      ref={sectionRef}
      id="hoang-phap"
      className="py-16 md:py-24 px-4 md:px-10 relative overflow-hidden"
      style={{ background: C.dark }}
    >
      {/* Nền hoa văn nhẹ trang nghiêm */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{ backgroundImage: "url('/images/lotus-pattern.png')" }}
      />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* ── Section Header (Tiêu đề font UTM Niagara) ── */}
        <SectionHeader
          title="DẤU ẤN HOẰNG PHÁP"
          subtitle="Những bài viết được quan tâm & theo dõi nhiều nhất"
        />

        {/* ── Bố cục 5 bài viết: 1 Post Card To Bên Ngoài Cùng + 4 Thẻ 2x2 Bên Cạnh ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-7 items-stretch">
          {/* Card 1: ẢNH TO NHẤT BÊN NGOÀI CÙNG (5 Cột Desktop) */}
          {featuredPost && (
            <div className="lg:col-span-5 flex flex-col">
              <PostCard
                post={featuredPost}
                large={true}
                className="h-full min-h-[460px] lg:min-h-[520px]"
              />
            </div>
          )}

          {/* 4 Card còn lại: Xếp lưới 2x2 cân đối (7 Cột Desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {sidePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* ── Nút Khám Phá Toàn Bộ Dòng Chảy Hoằng Pháp ── */}
        <div className="mt-12 md:mt-16 flex items-center justify-center">
          <Link
            href="/dong-chay-hoang-phap"
            className="group inline-flex items-center gap-2.5 px-6 md:px-8 py-3.5 rounded-full border border-[#F2C14E]/50 bg-[#2A1D14]/90 text-[#F2C14E] hover:text-[#2A1D14] hover:bg-[#F2C14E] transition-all duration-300 shadow-lg hover:shadow-[0_0_24px_rgba(242,193,78,0.5)] font-semibold text-xs md:text-sm tracking-wider uppercase"
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
          >
            <span>Khám Phá Dòng Chảy Hoằng Pháp</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DharmaSection;
