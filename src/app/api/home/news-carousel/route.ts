import { NextResponse } from 'next/server';
import { loadServerlessJsonAsync } from '@/lib/serverless-db';
import { getDeletedPostsAsync } from '@/lib/deleted-posts';
import { PostRecord, SPECIAL_GIOI_THIEU_WP_IDS, SPECIAL_TONG_CHI_WP_IDS } from '@/app/api/admin/posts/route';
import { StatueRecord, OFFICIAL_STATUE_DATASET } from '@/data/statue-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// 🌟 Tính toán thời gian bài viết chính xác theo ngày đăng & timestamp tạo mới (giống hệt 100% trang Admin /admin/posts)
function getPostExactTime(p: PostRecord): number {
  let time = 0;
  if (p.publishedDate) {
    const parsed = new Date(p.publishedDate).getTime();
    if (!isNaN(parsed)) time = parsed;
  }
  // Nếu ID dạng timestamp (ví dụ post-1729700000000 từ admin thêm mới)
  if (p.id && typeof p.id === 'string' && p.id.startsWith('post-')) {
    const rawNum = p.id.replace('post-', '');
    if (/^\d{12,}$/.test(rawNum)) {
      const ts = Number(rawNum);
      if (!isNaN(ts)) {
        time = Math.max(time, ts);
      }
    }
  }
  return time;
}

// 🌟 Điều hướng đường dẫn chuẩn xác theo phân hệ
function getPostTargetUrl(post: PostRecord): string {
  if (post.mainCategory === 'tri-tue-phat-phap') {
    return `/tri-tue-phat-phap/${post.slug}`;
  }
  if (post.mainCategory === 'tong-chi-tu-hoc') {
    return `/tong-chi-tu-hoc/${post.slug}`;
  }
  if (post.mainCategory === 'gioi-thieu') {
    return `/gioi-thieu/${post.slug}`;
  }
  return `/dong-chay-hoang-phap/${post.slug}`;
}

// 🌟 Mapping icon chuẩn xác theo phân hệ và chuyên mục con
function getIconForCategory(mainCategory?: string, subCategory?: string): string {
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
    // 1. Đọc dữ liệu từ Serverless DB (Ưu tiên S3 để phản ánh bài viết mới tức thời trên Vercel)
    const [allPosts, allTongChi, allStatues, deletedList] = await Promise.all([
      loadServerlessJsonAsync<PostRecord[]>(POSTS_CONFIG),
      loadServerlessJsonAsync<any[]>(TONG_CHI_CONFIG),
      loadServerlessJsonAsync<StatueRecord[]>(STATUES_CONFIG),
      getDeletedPostsAsync(),
    ]);

    const deletedSet = new Set((deletedList || []).map((d) => d.id));
    const deletedWpIds = new Set((deletedList || []).filter((d) => d.wpPostId).map((d) => String(d.wpPostId)));
    const deletedSlugs = new Set((deletedList || []).filter((d) => d.slug).map((d) => d.slug));

    // Lọc bỏ bài đã xóa, các chuyên mục đặc thù độc lập (giống hệt logic getPosts() của /admin/posts)
    const validPosts = (allPosts || []).filter(
      (p) =>
        !deletedSet.has(p.id) &&
        !deletedWpIds.has(String(p.wpPostId)) &&
        !deletedSlugs.has(p.slug) &&
        !SPECIAL_GIOI_THIEU_WP_IDS.has(String(p.wpPostId)) &&
        !SPECIAL_GIOI_THIEU_WP_IDS.has(String(p.id).replace('post-', '')) &&
        !SPECIAL_TONG_CHI_WP_IDS.has(String(p.wpPostId)) &&
        (p.status === 'published' || !p.status) &&
        p.title &&
        p.slug
    );

    // 🚀 Sắp xếp toàn bộ bài viết mới nhất lên đầu theo thời gian xuất bản chính xác
    const sortedPosts = [...validPosts].sort((a, b) => {
      const timeA = getPostExactTime(a);
      const timeB = getPostExactTime(b);
      if (timeB !== timeA) return timeB - timeA;
      const wpA = typeof a.wpPostId === 'number' ? a.wpPostId : parseInt(String(a.wpPostId || 0), 10);
      const wpB = typeof b.wpPostId === 'number' ? b.wpPostId : parseInt(String(b.wpPostId || 0), 10);
      return (wpB || 0) - (wpA || 0);
    });

    const result: CarouselNewsItem[] = [];

    // ── 2A. SLOT 1: BÀI VIẾT MỚI NHẤT VỪA ĐƯỢC TẠO HOẶC CẬP NHẬT TRÊN HỆ THỐNG ADMIN ──
    // Đảm bảo hiển thị ngay lập tức bài mới nhất ở vị trí trung tâm chính diện của Trang Chủ
    const newestPost = sortedPosts[0];
    if (newestPost) {
      result.push({
        id: newestPost.id,
        sourceType: (newestPost.mainCategory as any) || 'posts',
        category: newestPost.categoryName || (newestPost.mainCategory === 'tri-tue-phat-phap' ? 'Trí Tuệ Phật Pháp' : 'Dòng Chảy Hoằng Pháp'),
        subCategory: newestPost.subCategory || 'khoa-le-truyen-thong',
        iconUrl: getIconForCategory(newestPost.mainCategory || 'dong-chay-hoang-phap', newestPost.subCategory),
        title: (newestPost.title || '').toUpperCase(),
        subtitle: newestPost.subtitle || 'Dòng Chảy Hoằng Pháp Tùng Lâm Hòa Phúc',
        imgUrl: newestPost.thumbnailUrl || newestPost.bannerUrl || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
        imgPosition: newestPost.thumbnailPosition || newestPost.bannerPosition || 'center 35%',
        targetUrl: getPostTargetUrl(newestPost),
        date: newestPost.publishedDate,
      });
    }

    // ── 2B. SLOT 2: TÔNG CHỈ TU HỌC (Bồ Đề Tâm) ──
    const bdtTongChi =
      (allTongChi || []).find((tc) => tc.slug === 'bo-de-tam-coi-nguon-thien-phap' || (tc.title && tc.title.includes('BỒ ĐỀ TÂM'))) ||
      (allTongChi || [])[0];

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

    // ── 2C. SLOT 3: BẢO TƯỢNG PHẬT GIÁO (Đức Phật Thích Ca Mâu Ni) ──
    const statueThichCa = (allStatues || []).find((s) => s.code === 'TP0001') || (allStatues || [])[0];
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

    // ── 2D. SLOT 4: BÀI VIẾT NỔI BẬT THỨ HAI TỪ ADMIN POSTS (Khác với bài mới nhất) ──
    const secondPost = sortedPosts.find((p) => p.id !== newestPost?.id && !result.some((r) => r.id === p.id));
    if (secondPost) {
      result.push({
        id: secondPost.id,
        sourceType: (secondPost.mainCategory as any) || 'posts',
        category: secondPost.categoryName || 'Đại Lễ Sự Kiện',
        subCategory: secondPost.subCategory || 'dai-le-su-kien',
        iconUrl: getIconForCategory(secondPost.mainCategory || 'dong-chay-hoang-phap', secondPost.subCategory || 'dai-le-su-kien'),
        title: (secondPost.title || '').toUpperCase(),
        subtitle: secondPost.subtitle || 'Dòng Chảy Hoằng Pháp Tùng Lâm Hòa Phúc',
        imgUrl: secondPost.thumbnailUrl || secondPost.bannerUrl || '',
        imgPosition: secondPost.thumbnailPosition || secondPost.bannerPosition || 'center 35%',
        targetUrl: getPostTargetUrl(secondPost),
        date: secondPost.publishedDate,
      });
    }

    // ── 2E. SLOT 5: BÀI VIẾT TRÍ TUỆ PHẬT PHÁP ──
    const triTuePosts = sortedPosts.filter((p) => p.mainCategory === 'tri-tue-phat-phap');
    const postTriTue = triTuePosts.find((p) => !result.some((r) => r.id === p.id)) || sortedPosts.find((p) => !result.some((r) => r.id === p.id));

    if (postTriTue && !result.some((r) => r.id === postTriTue.id)) {
      result.push({
        id: postTriTue.id,
        sourceType: 'tri-tue-phat-phap',
        category: postTriTue.categoryName || 'Trí Tuệ Phật Pháp',
        subCategory: postTriTue.subCategory,
        iconUrl: getIconForCategory('tri-tue-phat-phap', postTriTue.subCategory),
        title: (postTriTue.title || '').toUpperCase(),
        subtitle: postTriTue.subtitle || 'Trí Tuệ Phật Pháp Tùng Lâm Hòa Phúc',
        imgUrl: postTriTue.thumbnailUrl || postTriTue.bannerUrl || '',
        imgPosition: postTriTue.thumbnailPosition || postTriTue.bannerPosition || 'center 35%',
        targetUrl: getPostTargetUrl(postTriTue),
        date: postTriTue.publishedDate,
      });
    }

    // ── 2F. SLOT 6: BÀI VIẾT HOẰNG PHÁP TIẾP THEO (Cộng Tu / Sự Kiện) ──
    const nextPost = sortedPosts.find((p) => !result.some((r) => r.id === p.id));
    if (nextPost) {
      result.push({
        id: nextPost.id,
        sourceType: (nextPost.mainCategory as any) || 'posts',
        category: nextPost.categoryName || 'Cộng Tu Định Kỳ',
        subCategory: nextPost.subCategory,
        iconUrl: getIconForCategory(nextPost.mainCategory || 'dong-chay-hoang-phap', nextPost.subCategory),
        title: (nextPost.title || '').toUpperCase(),
        subtitle: nextPost.subtitle || 'Dòng Chảy Hoằng Pháp Tùng Lâm Hòa Phúc',
        imgUrl: nextPost.thumbnailUrl || nextPost.bannerUrl || '',
        imgPosition: nextPost.thumbnailPosition || nextPost.bannerPosition || 'center 35%',
        targetUrl: getPostTargetUrl(nextPost),
        date: nextPost.publishedDate,
      });
    }

    // ── 2G. SLOT 7: TÔNG PHONG TRUYỀN THỪA (Tiếp Bước Thầy Tôi) ──
    const tongChiTiepBuoc = (allTongChi || []).find(
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

    return NextResponse.json(
      {
        success: true,
        data: result,
        total: result.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/home/news-carousel] Lỗi:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi lấy tin tức carousel',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  }
}
