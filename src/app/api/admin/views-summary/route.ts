import { NextResponse } from 'next/server';
import { loadServerlessJsonAsync } from '@/lib/serverless-db';
import { OFFICIAL_STATUE_DATASET } from '@/data/statue-data';

export const dynamic = 'force-dynamic';

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

const STATUES_DB_CONFIG = {
  fileName: 'statues-database.json',
  localRelativePath: 'src/data/statues-database.json',
  s3Key: 'tunglamhoaphuc2/database/statues-database.json',
  defaultData: OFFICIAL_STATUE_DATASET,
};

export async function GET() {
  try {
    const [allPosts, allTongChi, allStatues] = await Promise.all([
      loadServerlessJsonAsync<any[]>(POSTS_DB_CONFIG),
      loadServerlessJsonAsync<any[]>(TONG_CHI_DB_CONFIG),
      loadServerlessJsonAsync<any[]>(STATUES_DB_CONFIG),
    ]);

    const posts = allPosts || [];
    const tongChi = allTongChi || [];
    const statues = allStatues || [];

    // Tách các phân hệ
    const hoangPhapPosts = posts.filter((p) => p.mainCategory === 'dong-chay-hoang-phap');
    const triTuePosts = posts.filter((p) => p.mainCategory === 'tri-tue-phat-phap');

    // Tính tổng lượt xem từng phân hệ
    const viewsHoangPhap = hoangPhapPosts.reduce((acc, p) => acc + (Number(p.viewsCount) || 0), 0);
    const viewsTriTue = triTuePosts.reduce((acc, p) => acc + (Number(p.viewsCount) || 0), 0);
    const viewsTongChi = tongChi.reduce((acc, p) => acc + (Number(p.viewsCount) || 0), 0);
    const viewsBaoTuong = statues.reduce((acc, s) => acc + (Number(s.viewsCount) || 0), 0);
    const totalViews = viewsHoangPhap + viewsTriTue + viewsTongChi + viewsBaoTuong;

    // Tổng hợp danh sách xếp hạng Lượt xem cao nhất toàn hệ thống
    const rankedItems: Array<{
      id: string;
      title: string;
      category: string;
      type: 'hoang-phap' | 'tong-chi' | 'tri-tue' | 'bao-tuong';
      viewsCount: number;
      publishedDate: string;
      targetUrl: string;
      imageUrl: string;
      author?: string;
    }> = [
      ...hoangPhapPosts.map((p) => ({
        id: p.id,
        title: p.title || 'Không có tiêu đề',
        category: p.categoryName || 'Dòng Chảy Hoằng Pháp',
        type: 'hoang-phap' as const,
        viewsCount: Number(p.viewsCount) || 0,
        publishedDate: p.publishedDate || '',
        targetUrl: `/dong-chay-hoang-phap/${p.slug || p.id}`,
        imageUrl: p.thumbnailUrl || p.bannerUrl || '',
        author: p.author || 'Tùng Lâm Hòa Phúc',
      })),
      ...triTuePosts.map((p) => ({
        id: p.id,
        title: p.title || 'Không có tiêu đề',
        category: p.categoryName || 'Trí Tuệ Phật Pháp',
        type: 'tri-tue' as const,
        viewsCount: Number(p.viewsCount) || 0,
        publishedDate: p.publishedDate || '',
        targetUrl: `/tri-tue-phat-phap/${p.slug || p.id}`,
        imageUrl: p.thumbnailUrl || p.bannerUrl || '',
        author: p.author || 'Tùng Lâm Hòa Phúc',
      })),
      ...tongChi.map((t) => ({
        id: `tc-${t.id}`,
        title: t.title || 'Không có tiêu đề',
        category: t.categoryName || 'Tông Chỉ Tu Học',
        type: 'tong-chi' as const,
        viewsCount: Number(t.viewsCount) || 0,
        publishedDate: t.publishedAt || '',
        targetUrl: `/tong-chi-tu-hoc/${t.slug || t.id}`,
        imageUrl: t.bannerImage || '',
        author: t.author || 'Tùng Lâm Hòa Phúc',
      })),
      ...statues.map((s) => ({
        id: `statue-${s.code || s.id}`,
        title: s.title || s.name || 'Bảo Tượng Phật Giáo',
        category: s.assemblyName || s.areaName || 'Bảo Tượng Phật Giáo',
        type: 'bao-tuong' as const,
        viewsCount: Number(s.viewsCount) || 0,
        publishedDate: '',
        targetUrl: `/bao-tuong/${s.slug || s.code}`,
        imageUrl: s.imgUrl || s.avatarUrl || '',
        author: s.assembly || 'Tùng Lâm Hòa Phúc',
      })),
    ];

    rankedItems.sort((a, b) => b.viewsCount - a.viewsCount);

    return NextResponse.json({
      success: true,
      stats: {
        totalViews,
        totalPosts: posts.length,
        totalTongChi: tongChi.length,
        totalStatues: statues.length,
        viewsHoangPhap,
        viewsTongChi,
        viewsTriTue,
        viewsBaoTuong,
      },
      topRanked: rankedItems.slice(0, 20),
    });
  } catch (error: any) {
    console.error('[API /api/admin/views-summary] Lỗi:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
