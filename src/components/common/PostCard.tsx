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

const DEFAULT_TEMPLE_LOGO = 'https://tunglam.mocwp.com/wp-content/uploads/2026/07/bieu-tuong-tong-chi-tu-hoc-tung-lam-hoa-phuc.png';

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
      className={`group relative w-full overflow-hidden rounded-xl border border-[#F2C14E]/20 bg-[#2C1C11] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F2C14E] shadow-xl hover:shadow-2xl flex flex-col h-full ${className}`}
    >
      {/* 1. Khung ảnh Thumbnail Tỷ Lệ Vàng (1.618 : 1) */}
      <div className="relative w-full aspect-[1.618/1] overflow-hidden bg-[#1A120B] shrink-0">
        <img
          src={post.imageUrl || 'https://images.unsplash.com/photo-1618165220283-e85246c4171c?w=800&h=450&fit=crop'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      </div>

      {/* 2. Đường kẻ Gradient cắt ĐÚNG ranh giới mép chân ảnh Tỷ Lệ Vàng */}
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

      {/* 3. Khung nội dung chú thích chữ (Padding & Typography Tỷ Lệ Vàng) */}
      <div className="p-4 md:p-6 pt-6 md:pt-8 flex flex-col gap-2.5 bg-[#2C1C11] flex-1 justify-between">
        <div className="space-y-2">
          {/* Tag Danh Mục (Golden Scale: text-[11px] md:text-[12px]) */}
          <div
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="text-[11px] md:text-[12px] font-bold text-[#F2C14E] tracking-wide uppercase flex items-center gap-1.5"
          >
            <span>🪔</span>
            <span className="truncate">{categoryTag}</span>
          </div>

          {/* Tiêu Đề Bài Viết (Golden Scale: text-[18px] md:text-[20px]) */}
          <h3
            style={{ fontFamily: "'UTM Avo', sans-serif" }}
            className="font-bold text-[18px] md:text-[20px] text-[#F2C14E] hover:text-[#FFE5A3] line-clamp-2 leading-snug transition-colors"
          >
            {post.title}
          </h3>

          {/* Mô Tả / Bối Cảnh (Golden Scale: text-[13px] md:text-[14px]) */}
          {post.description && (
            <p
              style={{ fontFamily: "'UTM Avo', sans-serif" }}
              className="text-[13px] md:text-[14px] text-[#D3C0AD] line-clamp-2 leading-relaxed font-normal"
            >
              {post.description}
            </p>
          )}
        </div>

        {/* Thanh Chân Bài Viết (Golden Scale: text-[11px] md:text-[12px]) */}
        <div
          style={{ fontFamily: "'UTM Avo', sans-serif" }}
          className="border-t border-[#F2C14E]/15 pt-3 mt-3 flex items-center justify-between text-[11px] md:text-[12px] text-[#A69383]"
        >
          {/* Trái: Icon Lịch + Ngày đăng */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F2C14E]" />
            <span>{post.publishedDate || '28/11/2025'}</span>
          </div>

          {/* Phải: Lượt xem + Icon Mắt */}
          <div className="flex items-center gap-1.5">
            <span>{formattedViews}</span>
            <Eye className="w-3.5 h-3.5 text-[#F2C14E]" />
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default PostCard;
