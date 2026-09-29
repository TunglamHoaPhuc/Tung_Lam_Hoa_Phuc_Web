import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PostItem } from '@/types/post';
import { loadServerlessJsonAsync } from '@/lib/serverless-db';
import { getDeletedPostsAsync } from '@/lib/deleted-posts';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache 60s trên edge

const POSTS_DB_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as any[],
};

const TONG_CHI_DB_CONFIG = {
  fileName: 'tong-chi-data.json',
  localRelativePath: 'src/data/tong-chi-data.json',
  s3Key: 'tunglamhoaphuc2/database/tong-chi-data.json',
  defaultData: [] as any[],
};

function formatDate(rawDate?: string): string {
  if (!rawDate) return '01/08/2026';
  // If already DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) return rawDate;
  // If YYYY-MM-DD
  const m = rawDate.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (m) {
    const [, y, mo, d] = m;
    return `${d.padStart(2, '0')}/${mo.padStart(2, '0')}/${y}`;
  }
  return rawDate;
}

export async function GET() {
  try {
    // 1. Đọc dữ liệu từ Serverless DB & danh sách đã xóa
    const [allPosts, allTongChi, deletedList] = await Promise.all([
      loadServerlessJsonAsync<any[]>(POSTS_DB_CONFIG),
      loadServerlessJsonAsync<any[]>(TONG_CHI_DB_CONFIG),
      getDeletedPostsAsync(),
    ]);

    const deletedSet = new Set(deletedList.map((d) => d.id));
    const deletedWpIds = new Set(deletedList.filter((d) => d.wpPostId).map((d) => String(d.wpPostId)));
    const deletedSlugs = new Set(deletedList.filter((d) => d.slug).map((d) => d.slug));

    const validPosts = allPosts.filter(
      (p) => !deletedSet.has(p.id) && !deletedWpIds.has(String(p.wpPostId)) && !deletedSlugs.has(p.slug)
    );

    // 2. Tông Chỉ Tu Học
    const tongChiSorted = (allTongChi || [])
      .map((item: any): PostItem => ({
        id: `tc-${item.id}`,
        imageUrl: item.bannerImage || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/tong-chi-tu-hoc-hub-banner.webp',
        category1: 'Tông Chỉ Tu Học',
        category2: item.categoryName || 'NỀN TẢNG TU HỌC',
        category1Url: '/tong-chi-tu-hoc',
        title: item.title,
        description: item.excerpt || item.subtitle || 'Hệ thống tông chỉ tu học kế thừa tông phong chư Tổ Tùng Lâm Hòa Phúc.',
        publishedDate: formatDate(item.publishedAt),
        viewsCount: item.viewsCount || 35000,
        targetUrl: `/tong-chi-tu-hoc/${item.slug}`,
      }))
      .sort((a, b) => (Number(b.viewsCount) || 0) - (Number(a.viewsCount) || 0));

    // 3. Dòng Chảy Hoằng Pháp
    const dongChaySorted = validPosts
      .filter((p) => p.mainCategory === 'dong-chay-hoang-phap')
      .map((p: any): PostItem => ({
        id: p.id,
        imageUrl: p.thumbnailUrl || p.bannerUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/Phap-hoi-niem-Phat.webp',
        category1: 'Dòng Chảy Hoằng Pháp',
        category2: p.categoryName || p.subCategory || 'HOẰNG PHÁP ĐỘ SINH',
        category1Url: '/dong-chay-hoang-phap',
        title: p.title,
        description: p.summary || p.subtitle || 'Hành trình lan tỏa chánh pháp, các sự kiện pháp hội và Phật sự trọng đại.',
        publishedDate: formatDate(p.publishedDate),
        viewsCount: p.viewsCount || 108,
        targetUrl: `/dong-chay-hoang-phap/${p.slug || p.id}`,
      }))
      .sort((a, b) => (Number(b.viewsCount) || 0) - (Number(a.viewsCount) || 0));

    // 4. Trí Tuệ Phật Pháp
    const triTueSorted = validPosts
      .filter((p) => p.mainCategory === 'tri-tue-phat-phap')
      .map((p: any): PostItem => ({
        id: p.id,
        imageUrl: p.thumbnailUrl || p.bannerUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/08-tu-an-book/page_01.webp',
        category1: 'Trí Tuệ Phật Pháp',
        category2: p.categoryName || p.subCategory || 'PHÁP ÂM & KHAI THỊ',
        category1Url: '/tri-tue-phat-phap',
        title: p.title,
        description: p.summary || p.subtitle || 'Kho tàng giáo lý Phật đà, pháp âm giảng giải và các tác phẩm Phật học sâu sắc.',
        publishedDate: formatDate(p.publishedDate),
        viewsCount: p.viewsCount || 108,
        targetUrl: `/tri-tue-phat-phap/${p.slug || p.id}`,
      }))
      .sort((a, b) => (Number(b.viewsCount) || 0) - (Number(a.viewsCount) || 0));

    // 5. Kết hợp 6 bài tiêu biểu đại diện 3 chuyên mục cốt lõi (2 Tông Chỉ + 2 Dòng Chảy + 2 Trí Tuệ)
    const featured: PostItem[] = [
      tongChiSorted[0],
      dongChaySorted[0],
      triTueSorted[0],
      tongChiSorted[1],
      dongChaySorted[1],
      triTueSorted[1],
    ].filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        featured,
        tongChi: tongChiSorted.slice(0, 6),
        dongChay: dongChaySorted.slice(0, 6),
        triTue: triTueSorted.slice(0, 6),
      },
    });
  } catch (error: any) {
    console.error('Error fetching dharma featured posts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
