import { NextResponse } from 'next/server';
import { loadServerlessJson } from '@/lib/serverless-db';
import { PostRecord } from '@/app/api/admin/posts/route';
import { StatueRecord, OFFICIAL_STATUE_DATASET } from '@/data/statue-data';

export const dynamic = 'force-dynamic';

export interface CarouselNewsItem {
  id: string;
  sourceType: 'posts' | 'tong-chi' | 'bao-tuong' | 'tri-tue-phat-phap';
  category: string;
  subCategory?: string;
  iconUrl: string;
  title: string;
  subtitle: string;
  imgUrl: string;
  targetUrl: string;
  imgPosition?: string;
  date?: string;
}

const POSTS_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as PostRecord[],
};

const TONG_CHI_CONFIG = {
  fileName: 'tong-chi-data.json',
  localRelativePath: 'src/data/tong-chi-data.json',
  s3Key: 'tunglamhoaphuc2/database/tong-chi-data.json',
  defaultData: [] as any[],
};

const STATUES_CONFIG = {
  fileName: 'statues-database.json',
  localRelativePath: 'src/data/statues-database.json',
  s3Key: 'tunglamhoaphuc2/database/statues-database.json',
  defaultData: OFFICIAL_STATUE_DATASET,
};

// 🌟 Hàm mapping icon chuẩn xác theo phân hệ và chuyên mục con
function getIconForCategory(mainCategory: string, subCategory?: string): string {
  const sub = (subCategory || '').toLowerCase();

  if (mainCategory === 'tong-chi-tu-hoc') {
    return '/images/icons/icon-tong-chi-tu-hoc.webp';
  }

  if (mainCategory === 'bao-tuong') {
    return '/images/icons/icon-cac-bao-tuong-noi-bat.webp';
  }

  if (mainCategory === 'tri-tue-phat-phap') {
    if (sub === 'phap-am') {
      return '/images/icons/icon-phap-am.webp';
    }
    return '/images/icons/icon-tri-tue-phat-phap.webp';
  }

  // Dòng Chảy Hoằng Pháp
  if (sub === 'khoa-le-truyen-thong') {
    return '/images/icons/icon-khoa-le-truyen-thong.png';
  }
  if (sub === 'dai-le-su-kien') {
    return '/images/icons/icon-dai-le-su-kien.png';
  }
  if (sub === 'cong-tu' || sub === 'su-kien-dinh-ky') {
    return '/images/icons/icon-cong-tu.png';
  }
  if (sub === 'tinh-do-nhan-gian') {
    return '/images/icons/icon-tinh-do-nhan-gian.png';
  }

  return '/images/icons/icon-dong-chay-hoang-phap.webp';
}

export async function GET() {
  try {
    // 1. Đọc dữ liệu từ 3 database cốt lõi
    const allPosts = loadServerlessJson<PostRecord[]>(POSTS_CONFIG) || [];
    const allTongChi = loadServerlessJson<any[]>(TONG_CHI_CONFIG) || [];
    const allStatues = loadServerlessJson<StatueRecord[]>(STATUES_CONFIG) || [];

    const result: CarouselNewsItem[] = [];

    // ── 2A. Lấy bài viết Dòng Chảy Hoằng Pháp (Admin Posts) ──
    const dchpPosts = allPosts
      .filter((p) => p.mainCategory === 'dong-chay-hoang-phap' && p.status === 'published')
      .sort((a, b) => {
        const timeA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const timeB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return timeB - timeA;
      });

    // Lấy bài mới nhất của Khóa Lễ Truyền Thống hoặc bài hot (ưu tiên post-632 Địa Tạng Bồ Tát nếu có)
    const postDiaTang = dchpPosts.find((p) => p.id === 'post-632') || dchpPosts[0];
    if (postDiaTang) {
      result.push({
        id: postDiaTang.id,
        sourceType: 'posts',
        category: postDiaTang.categoryName || 'Khóa Lễ Truyền Thống',
        subCategory: postDiaTang.subCategory || 'khoa-le-truyen-thong',
        iconUrl: getIconForCategory('dong-chay-hoang-phap', postDiaTang.subCategory || 'khoa-le-truyen-thong'),
        title: (postDiaTang.title || '').toUpperCase(),
        subtitle: postDiaTang.subtitle || 'Dòng Chảy Hoằng Pháp Tùng Lâm Hòa Phúc',
        imgUrl: postDiaTang.thumbnailUrl || postDiaTang.bannerUrl || '',
        imgPosition: postDiaTang.thumbnailPosition || postDiaTang.bannerPosition || 'center 35%',
        targetUrl: `/dong-chay-hoang-phap/${postDiaTang.slug}`,
        date: postDiaTang.publishedDate,
      });
    }

    // ── 2B. Lấy bài viết Tông Chỉ Tu Học (Admin Tong Chi) ──
    // Ưu tiên bài Bồ Đề Tâm hoặc bài đầu tiên
    const bdtTongChi =
      allTongChi.find((tc) => tc.slug === 'bo-de-tam-coi-nguon-thien-phap' || (tc.title && tc.title.includes('BỒ ĐỀ TÂM'))) ||
      allTongChi[0];

    if (bdtTongChi) {
      result.push({
        id: `tong-chi-${bdtTongChi.id || bdtTongChi.slug}`,
        sourceType: 'tong-chi',
        category: 'Tông Chỉ Tu Học',
        subCategory: bdtTongChi.category,
        iconUrl: getIconForCategory('tong-chi-tu-hoc'),
        title: (bdtTongChi.title || 'BỒ ĐỀ TÂM').toUpperCase(),
        subtitle: bdtTongChi.subtitle || 'Cội Nguồn Thiện Pháp',
        imgUrl:
          bdtTongChi.bannerImage ||
          'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/02-tong-chi-tu-hoc/nen-tang-tu-hoc/tong-chi-tu-hoc-nen-tang-tu-hoc-bo-de-tam-herobanner-thumbnail.webp',
        imgPosition: bdtTongChi.bannerPosition || 'center 35%',
        targetUrl: `/tong-chi-tu-hoc/${bdtTongChi.slug}`,
      });
    }

    // ── 2C. Lấy Bảo Tượng Phật Giáo (Admin Bao Tuong) ──
    // Ưu tiên tượng chính Đức Phật Thích Ca Mâu Ni (TP0001)
    const statueThichCa = allStatues.find((s) => s.code === 'TP0001') || allStatues[0];
    if (statueThichCa) {
      result.push({
        id: `statue-${statueThichCa.code || statueThichCa.id}`,
        sourceType: 'bao-tuong',
        category: 'Bảo Tượng Phật Giáo',
        iconUrl: getIconForCategory('bao-tuong'),
        title: (statueThichCa.title || statueThichCa.name || 'ĐỨC PHẬT THÍCH CA MÂU NI').toUpperCase(),
        subtitle: statueThichCa.subtitle || 'Vô Thượng Năng Nhân',
        imgUrl: statueThichCa.imgUrl || statueThichCa.avatarUrl || '',
        imgPosition: statueThichCa.imgPosition || 'center 35%',
        targetUrl: `/bao-tuong/${statueThichCa.slug}`,
      });
    }

    // ── 2D. Lấy bài viết Đại Lễ Sự Kiện từ Dòng Chảy Hoằng Pháp ──
    const postDaiLe = dchpPosts.find(
      (p) => p.subCategory === 'dai-le-su-kien' && p.id !== (postDiaTang ? postDiaTang.id : '')
    ) || dchpPosts[1];

    if (postDaiLe && !result.some((r) => r.id === postDaiLe.id)) {
      result.push({
        id: postDaiLe.id,
        sourceType: 'posts',
        category: postDaiLe.categoryName || 'Đại Lễ Sự Kiện',
        subCategory: postDaiLe.subCategory || 'dai-le-su-kien',
        iconUrl: getIconForCategory('dong-chay-hoang-phap', postDaiLe.subCategory || 'dai-le-su-kien'),
        title: (postDaiLe.title || '').toUpperCase(),
        subtitle: postDaiLe.subtitle || 'Đại Lễ Sự Kiện Tùng Lâm Hòa Phúc',
        imgUrl: postDaiLe.thumbnailUrl || postDaiLe.bannerUrl || '',
        imgPosition: postDaiLe.thumbnailPosition || postDaiLe.bannerPosition || 'center 35%',
        targetUrl: `/dong-chay-hoang-phap/${postDaiLe.slug}`,
        date: postDaiLe.publishedDate,
      });
    }

    // ── 2E. Lấy bài viết Trí Tuệ Phật Pháp (Admin Tri Tue Phat Phap) ──
    const triTuePosts = allPosts
      .filter((p) => p.mainCategory === 'tri-tue-phat-phap' && p.status === 'published')
      .sort((a, b) => {
        const timeA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const timeB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return timeB - timeA;
      });

    // Ưu tiên tác phẩm hoặc bài viết có phụ đề hay
    const postTriTue =
      triTuePosts.find((p) => p.subCategory === 'an-pham-sach' || p.subCategory === 'phap-am') || triTuePosts[0];

    if (postTriTue) {
      result.push({
        id: postTriTue.id,
        sourceType: 'tri-tue-phat-phap',
        category: 'Trí Tuệ Phật Pháp',
        subCategory: postTriTue.subCategory,
        iconUrl: getIconForCategory('tri-tue-phat-phap', postTriTue.subCategory),
        title: (postTriTue.title || '').toUpperCase(),
        subtitle: postTriTue.subtitle || 'Trí Tuệ Phật Pháp Tùng Lâm Hòa Phúc',
        imgUrl: postTriTue.thumbnailUrl || postTriTue.bannerUrl || '',
        imgPosition: postTriTue.thumbnailPosition || postTriTue.bannerPosition || 'center 35%',
        targetUrl: `/tri-tue-phat-phap/${postTriTue.slug}`,
        date: postTriTue.publishedDate,
      });
    }

    // ── 2F. Thêm 1 bài Cộng Tu / Sự Kiện Định Kỳ từ Hoằng Pháp ──
    const postCongTu = dchpPosts.find(
      (p) =>
        (p.subCategory === 'cong-tu' || p.subCategory === 'tinh-do-nhan-gian') &&
        !result.some((r) => r.id === p.id)
    );

    if (postCongTu) {
      result.push({
        id: postCongTu.id,
        sourceType: 'posts',
        category: postCongTu.categoryName || 'Cộng Tu Định Kỳ',
        subCategory: postCongTu.subCategory,
        iconUrl: getIconForCategory('dong-chay-hoang-phap', postCongTu.subCategory),
        title: (postCongTu.title || '').toUpperCase(),
        subtitle: postCongTu.subtitle || 'Dòng Chảy Hoằng Pháp Tùng Lâm Hòa Phúc',
        imgUrl: postCongTu.thumbnailUrl || postCongTu.bannerUrl || '',
        imgPosition: postCongTu.thumbnailPosition || postCongTu.bannerPosition || 'center 35%',
        targetUrl: `/dong-chay-hoang-phap/${postCongTu.slug}`,
        date: postCongTu.publishedDate,
      });
    }

    // ── 2G. Nếu còn bài Tông Chỉ nổi bật thứ 2 (Ví dụ: Tiếp Bước Thầy Tôi) ──
    const tongChiTiepBuoc = allTongChi.find(
      (tc) => tc.id !== (bdtTongChi ? bdtTongChi.id : null) && !result.some((r) => r.targetUrl === `/tong-chi-tu-hoc/${tc.slug}`)
    );
    if (tongChiTiepBuoc) {
      result.push({
        id: `tong-chi-${tongChiTiepBuoc.id || tongChiTiepBuoc.slug}`,
        sourceType: 'tong-chi',
        category: 'Tông Chỉ Tu Học',
        subCategory: tongChiTiepBuoc.category,
        iconUrl: getIconForCategory('tong-chi-tu-hoc'),
        title: (tongChiTiepBuoc.title || '').toUpperCase(),
        subtitle: tongChiTiepBuoc.subtitle || tongChiTiepBuoc.excerpt || 'Tông Phong Truyền Thừa',
        imgUrl: tongChiTiepBuoc.bannerImage || '',
        imgPosition: tongChiTiepBuoc.bannerPosition || 'center 35%',
        targetUrl: `/tong-chi-tu-hoc/${tongChiTiepBuoc.slug}`,
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length,
    });
  } catch (error: any) {
    console.error('[API /api/home/news-carousel] Lỗi:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi lấy tin tức carousel',
      },
      { status: 500 }
    );
  }
}
