'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { Eye, Calendar } from 'lucide-react';
import { PostItem } from '@/types/post';

export interface PostCardProps {
  post: PostItem;
  large?: boolean;
  className?: string;
}

const DEFAULT_TEMPLE_LOGO = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.webp';

/**
 * Standardized Golden Ratio Post Card (φ ≈ 1.618)
 * - Golden Thumbnail Aspect Ratio: aspect-[1.618/1]
 * - Golden Typography Scale:
 *   - Title: text-[18px] md:text-[20px] (Font UTM Avo Bold, Gold #F2C14E)
 *   - Summary: text-[13px] md:text-[14px] (Font UTM Avo Normal, Cream #D3C0AD)
 *   - Tag & Meta: text-[11px] md:text-[12px]
 * - Golden Padding & Spacing: p-4 md:p-6 (16px ~ 24px)
 * - Art Boundary Junction: 1px Gradient line + Floating Centered Temple Logo (z-20)
 */
export const PostCard: FC<PostCardProps> = ({
  post,
  large = false,
  className = '',
}) => {
  const CardWrapper = post.targetUrl ? Link : 'div';
  const wrapperProps = post.targetUrl ? { href: post.targetUrl } : {};

  const formattedViews =
    typeof post.viewsCount === 'number'
      ? post.viewsCount >= 1000
        ? `${(post.viewsCount / 1000).toFixed(1)}K`
        : post.viewsCount.toString()
      : post.viewsCount || '350';

  const categoryTag = post.category1 || 'Phật Pháp – Đời Sống';
  const logoUrl = post.category1IconUrl || DEFAULT_TEMPLE_LOGO;

  return (
    <CardWrapper
      {...(wrapperProps as any)}
      className={`group relative w-full overflow-hidden rounded-xl border border-[#F2C14E]/25 bg-[#2C1C11] cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:border-[#F2C14E] shadow-xl hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex flex-col h-full ${className}`}
    >
      {/* 1. Khung ảnh Thumbnail (Tỷ Lệ Vàng hoặc Ảnh Lớn theo variant) */}
      <div
        className={`relative w-full flex-1 overflow-hidden bg-[#1A120B] ${
          large ? 'min-h-[280px]' : 'min-h-[160px]'
        }`}
      >
        <img
          src={post.imageUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Đường kẻ Gradient cắt ranh giới mép chân ảnh */}
      <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/70 to-transparent z-10 shrink-0">
        {/* Huy hiệu Logo Chùa nổi chính giữa tim đường kẻ */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-[#F2C14E] bg-[#2C1C11] flex items-center justify-center p-1 shadow-[0_0_12px_rgba(242,193,78,0.5)]">
          <img
            src={logoUrl}
            alt="Logo Chùa Tùng Lâm Hòa Phúc"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 3. Khung nội dung tối giản — Không emoji, không bold subtitle, không hover-expand */}
      <div className="p-3 md:p-4 pt-5 flex flex-col gap-1.5 bg-[#2C1C11] shrink-0">
        {/* Tag Danh Mục — không emoji, không in đậm */}
        <div
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="text-[10px] md:text-[11px] font-medium text-[#E5A93C] tracking-widest uppercase"
        >
          {categoryTag}
        </div>

        {/* Tiêu Đề Bài Viết */}
        <h3
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className={`font-bold ${
            large ? 'text-[18px] md:text-[21px]' : 'text-[15px] md:text-[17px]'
          } text-[#F2C14E] group-hover:text-[#FFE5A3] line-clamp-2 leading-snug transition-colors`}
        >
          {post.title}
        </h3>

        {/* Meta: Ngày đăng + Lượt xem — luôn hiển thị, không expand on hover */}
        <div
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="flex items-center justify-between text-[10px] text-[#A69383] pt-1.5 border-t border-[#F2C14E]/15 mt-0.5"
        >
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#F2C14E]/70" />
            <span>{post.publishedDate || '28/11/2025'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{formattedViews}</span>
            <Eye className="w-3 h-3 text-[#F2C14E]/70" />
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default PostCard;
