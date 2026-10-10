'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getImageUrl } from '@/utils/image';

interface PortalItem {
  id: string;
  name: string;
  subtitle: string;
  categoryName: string;
  categoryKey: string;
  description: string;
  link: string;
  image: string;
}

const PORTAL_ITEMS: PortalItem[] = [
  // 1. NỀN TẢNG TU HỌC
  {
    id: 'tam-quy',
    name: 'Tam Quy - Ngũ Giới',
    subtitle: 'Nền Tảng Căn Bản',
    categoryName: 'Nền Tảng Tu Học',
    categoryKey: 'nen-tang',
    description: 'Quy y Tam Bảo & Thọ trì năm giới lành của người con Phật tại gia.',
    link: '/tong-chi-tu-hoc/tam-quy',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/nen-tang-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-tam-quy-ngu-gioi-banner-sach-3-nt-5-th-jpg.webp',
  },
  {
    id: 'thap-thien',
    name: 'Thập Thiện Nghiệp',
    subtitle: 'Con Đường Phước Đức',
    categoryName: 'Nền Tảng Tu Học',
    categoryKey: 'nen-tang',
    description: 'Chuyển hóa mười nghiệp xấu thành mười nhân lành an vui, giải thoát.',
    link: '/tong-chi-tu-hoc/thap-thien-nghiep-con-duong-phuoc-duc',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/nen-tang-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-thap-thien-thumbnail-herobanner.webp',
  },
  {
    id: 'bo-tat-hanh',
    name: 'Bồ Tát Hạnh',
    subtitle: 'Lục Độ Ba La Mật',
    categoryName: 'Nền Tảng Tu Học',
    categoryKey: 'nen-tang',
    description: 'Sáu hạnh nguyện dấn thân phụng sự, đem an vui chan rải đến muôn loài.',
    link: '/tong-chi-tu-hoc/bo-tat-hanh-luc-do-ba-la-mat',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/tinh-do-nhan-gian/BO-TAT-QUAN-AM.jpg',
  },

  // 2. PHƯƠNG PHÁP HÀNH TRÌ
  {
    id: 'niem-phat',
    name: 'Niệm Phật',
    subtitle: 'Phương Pháp Trợ Hạnh',
    categoryName: 'Phương Pháp Hành Trì',
    categoryKey: 'phuong-phap',
    description: 'Nhất tâm quy kính hồng danh Phật, an định thân tâm giữa sóng gió cuộc đời.',
    link: '/tong-chi-tu-hoc/niem-phat-phuong-phap-tro-hanh',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
  },
  {
    id: 'thien-tap',
    name: 'Thiền Tập',
    subtitle: 'Tĩnh Lặng Thân Tâm',
    categoryName: 'Phương Pháp Hành Trì',
    categoryKey: 'phuong-phap',
    description: 'Trở về quan sát hơi thở và tâm ý, nuôi dưỡng an lạc trong hiện tại.',
    link: '/tong-chi-tu-hoc/thien-tap-tinh-lang-tu-than',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/03-dong-chay-hoang-phap/cong-tu/thien-su-thich-nhat-hanh-4-0950.jpg',
  },
  {
    id: 'nghe-phap-tung-kinh',
    name: 'Nghe Pháp & Tụng Kinh',
    subtitle: 'Khai Mở Chánh Kiến',
    categoryName: 'Phương Pháp Hành Trì',
    categoryKey: 'phuong-phap',
    description: 'Huân tập lời Phật dạy, thắp sáng ngọn đèn trí tuệ và chánh tín vững bền.',
    link: '/dong-chay-hoang-phap',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tung-kinh.webp',
  },

  // 3. LỘ TRÌNH TU HỌC
  {
    id: 'lo-trinh-nguoi-moi',
    name: 'Lộ Trình Người Mới',
    subtitle: 'Khởi Đầu Vững Chãi',
    categoryName: 'Lộ Trình Tu Học',
    categoryKey: 'lo-trinh',
    description: 'Các bước nhập môn căn bản, làm quen nếp sống thiền môn và giáo lý.',
    link: '/tong-chi-tu-hoc/lo-trinh-tu-hoc-nguoi-moi-bat-dau',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
  },
  {
    id: 'lo-trinh-nguoi-tre',
    name: 'Lộ Trình Người Trẻ',
    subtitle: 'Tuổi Trẻ Tỉnh Thức',
    categoryName: 'Lộ Trình Tu Học',
    categoryKey: 'lo-trinh',
    description: 'Ứng dụng Phật pháp xây dựng lý tưởng sống, rèn luyện bản lĩnh và vượt áp lực.',
    link: '/tong-chi-tu-hoc/lo-trinh-tu-hoc-nguoi-tre',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/giang-duong/giang-duong-hoa-phuc-canh-1.webp',
  },
  {
    id: 'lo-trinh-nguoi-ban-ron',
    name: 'Lộ Trình Người Bận Rộn',
    subtitle: 'Tu Trong Đời Sống',
    categoryName: 'Lộ Trình Tu Học',
    categoryKey: 'lo-trinh',
    description: 'Phương pháp tu tập ngắn gọn, chuyển hóa công việc và gia đình thành đạo tràng.',
    link: '/tong-chi-tu-hoc/lo-trinh-tu-hoc-nguoi-ban-ron',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/bao-tang/trien-lam/phat-giao/chua-viet-nam-xua/Bao-thap-Phuoc-Duyen-tai-chua-Thien-Mu-Hue-Bieu-tuong-ton-nghiem-cua-Phat-giao-xu-Hue.webp',
  },

  // 4. NẾP SỐNG THIỀN GIA
  {
    id: 'van-hoa-ung-xu',
    name: 'Văn Hóa Ứng Xử',
    subtitle: 'Giao Tiếp Tại Chùa',
    categoryName: 'Nếp Sống Thiền Gia',
    categoryKey: 'nep-song',
    description: 'Lời nói khiêm cung, cử chỉ trang nghiêm nơi chốn thiền môn thanh tịnh.',
    link: '/gioi-thieu/van-hoa-ung-xu',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/van-hoa-ung-xu-giao-tiep-tai-chua.webp',
  },
  {
    id: 'oai-nghi',
    name: 'Oai Nghi Người Phật Tử',
    subtitle: 'Bốn Oai Nghi Tề Chỉnh',
    categoryName: 'Nếp Sống Thiền Gia',
    categoryKey: 'nep-song',
    description: 'Đi đứng nằm ngồi trong tỉnh thức, toát lên phong thái an nhiên giải thoát.',
    link: '/tong-chi-tu-hoc/oai-nghi-nguoi-con-phat',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/ho_phap_than_vuong/nghe_thuat_phat_giao/vi_da_ho_phap_phu_dong_thien_vuong.webp',
  },
  {
    id: 'bon-phan-tai-gia',
    name: 'Bổn Phận Tại Gia',
    subtitle: 'Hiếu Đạo & Trách Nhiệm',
    categoryName: 'Nếp Sống Thiền Gia',
    categoryKey: 'nep-song',
    description: 'Tròn đạo làm con, giữ vẹn nghĩa vụ gia đình và chung tay lợi ích xã hội.',
    link: '/tong-chi-tu-hoc/bon-phan-nguoi-phat-tu-tai-gia',
    image: 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_thanh_ho_quoc/phu_dong_thien_vuong.webp',
  },
];

const CATEGORIES = [
  { key: 'all', name: 'TẤT CẢ PHÁP MÔN', icon: '🪷' },
  { key: 'nen-tang', name: 'NỀN TẢNG TU HỌC', icon: '🌿' },
  { key: 'phuong-phap', name: 'PHƯƠNG PHÁP HÀNH TRÌ', icon: '🙏' },
  { key: 'lo-trinh', name: 'LỘ TRÌNH TU HỌC', icon: '🌱' },
  { key: 'nep-song', name: 'NẾP SỐNG THIỀN GIA', icon: '🌸' },
];

export function FourCirclesPortalSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? PORTAL_ITEMS
    : PORTAL_ITEMS.filter((item) => item.categoryKey === selectedCategory);

  // Nhóm theo 4 danh mục khi xem "all"
  const groupedCategories = [
    { key: 'nen-tang', name: 'NỀN TẢNG TU HỌC', subtitle: 'Những nền tảng song hành cùng Bồ Đề tâm', icon: '🌿' },
    { key: 'phuong-phap', name: 'PHƯƠNG PHÁP HÀNH TRÌ', subtitle: 'Thực tập mỗi ngày với những cách thức tu tập', icon: '🙏' },
    { key: 'lo-trinh', name: 'LỘ TRÌNH TU HỌC', subtitle: 'Lựa chọn lộ trình phù hợp với hoàn cảnh tu học', icon: '🌱' },
    { key: 'nep-song', name: 'NẾP SỐNG THIỀN GIA', subtitle: 'Đưa lời Phật dạy vào từng nếp sống, lời nói và việc làm', icon: '🌸' },
  ];

  return (
    <div className="my-14 space-y-10">
      {/* ── 1. BỘ LỌC DANH MỤC DẠNG PILL VÀNG HOÀNG KIM ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#F2C14E] to-[#FFDE59] text-[#1A120B] shadow-[0_0_20px_rgba(242,193,78,0.45)] scale-105'
                  : 'bg-[#2A180E]/90 hover:bg-[#3B2315] text-[#FFE5A3] border border-[#F2C14E]/30 hover:border-[#F2C14E]/70'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="tracking-wide">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── 2. HIỂN THỊ CÁC THẺ TRÒN (THEO CHUẨN DESIGN ẢNH 2 - RIOT / LOL UNIVERSE STYLE) ── */}
      {selectedCategory === 'all' ? (
        // Chế độ xem TẤT CẢ: Phân theo 4 nhóm trang nghiêm
        <div className="space-y-12">
          {groupedCategories.map((group) => {
            const items = PORTAL_ITEMS.filter((it) => it.categoryKey === group.key);
            return (
              <div key={group.key} className="space-y-6">
                <div className="text-center space-y-1">
                  <h4
                    style={{ fontFamily: "'UTM Avo', sans-serif" }}
                    className="text-base sm:text-lg font-bold text-[#FFDE59] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <span>{group.icon}</span>
                    <span>{group.name}</span>
                  </h4>
                  <p className="text-xs text-[#FFE5A3]/75 italic">
                    {group.subtitle}
                  </p>
                  <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/60 to-transparent mx-auto mt-2" />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 pt-2">
                  {items.map((item) => (
                    <CirclePortalCard
                      key={item.id}
                      item={item}
                      isHovered={hoveredId === item.id}
                      onHover={() => setHoveredId(item.id)}
                      onLeave={() => setHoveredId(null)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Chế độ xem theo Danh Mục đã chọn: Grid các hình tròn căn giữa
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 pt-4">
          {filteredItems.map((item) => (
            <CirclePortalCard
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              onHover={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 🪷 Component Thẻ Hình Tròn chuẩn mực theo phong cách Riot / LoL Universe (Ảnh 2)
function CirclePortalCard({
  item,
  isHovered,
  onHover,
  onLeave,
}: {
  item: PortalItem;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      href={item.link}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="flex flex-col items-center group cursor-pointer text-center relative focus:outline-none"
    >
      {/* ── KHUNG TRÒN MINH HỌA (CIRCLE PORTAL) ── */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-b from-[#C8AA6E] via-[#8B4513] to-[#452D1D] shadow-[0_0_20px_rgba(200,170,110,0.25)] group-hover:shadow-[0_0_35px_rgba(255,222,89,0.55)] group-hover:from-[#FFDE59] group-hover:to-[#F2C14E] transition-all duration-500 ease-out">
        {/* Vòng đệm bên trong */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#160D07] relative border-2 border-black/80">
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/toan-canh-chua.jpg';
            }}
          />

          {/* Lớp phủ Cinematic Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

          {/* Shimmer vàng khi hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FFDE59]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icon mở rộng góc nhỏ */}
          <div className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-[#FFDE59] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* ── TIÊU ĐỀ & PHỤ ĐỀ DƯỚI HÌNH TRÒN (CHỈ HIỂN THỊ KHI ĐƯA CHUỘT HOẶC HOVER VÀO) ── */}
      <div
        className={`mt-3.5 space-y-1 max-w-[180px] sm:max-w-[200px] min-h-[48px] flex flex-col items-center justify-start transition-all duration-300 transform ${
          isHovered
            ? 'opacity-100 translate-y-0'
            : 'opacity-90 sm:opacity-0 sm:translate-y-2'
        } group-hover:opacity-100 group-hover:translate-y-0`}
      >
        <h5
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="text-xs sm:text-sm font-bold text-[#FFDE59] uppercase tracking-wider line-clamp-1 drop-shadow-md"
        >
          {item.name}
        </h5>
        <p className="text-[11px] text-[#FFE5A3]/85 uppercase tracking-widest font-medium">
          {item.subtitle}
        </p>
      </div>
    </Link>
  );
}
