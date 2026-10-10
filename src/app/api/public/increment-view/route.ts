import { NextRequest, NextResponse } from 'next/server';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';

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
  defaultData: [] as any[],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { type, idOrSlug } = body;

    if (!idOrSlug) {
      return NextResponse.json({ success: false, error: 'Thiếu idOrSlug' }, { status: 400 });
    }

    // 1. Tông Chỉ Tu Học
    if (type === 'tong-chi' || idOrSlug.startsWith('tc-')) {
      const cleanId = idOrSlug.replace(/^tc-/, '');
      const articles = await loadServerlessJsonAsync<any[]>(TONG_CHI_DB_CONFIG);
      const target = articles.find(
        (a) => String(a.id) === cleanId || a.slug === idOrSlug || a.slug === cleanId
      );

      if (target) {
        target.viewsCount = (Number(target.viewsCount) || 30000) + 1;
        // Ghi lại bất đồng bộ
        saveServerlessJson(TONG_CHI_DB_CONFIG, articles).catch((e) =>
          console.error('Lỗi lưu views tong-chi:', e)
        );
        return NextResponse.json({ success: true, viewsCount: target.viewsCount });
      }
    }

    // 2. Bảo Tượng Phật Giáo
    if (type === 'bao-tuong' || type === 'statue') {
      const statues = await loadServerlessJsonAsync<any[]>(STATUES_DB_CONFIG);
      const statue = statues.find(
        (s) =>
          s.slug === idOrSlug ||
          s.id === idOrSlug ||
          s.code === idOrSlug ||
          s.code?.toLowerCase() === idOrSlug.toLowerCase()
      );
      if (statue) {
        statue.viewsCount = (Number(statue.viewsCount) || 108) + 1;
        saveServerlessJson(STATUES_DB_CONFIG, statues).catch((e) =>
          console.error('Lỗi lưu views statue:', e)
        );
        return NextResponse.json({ success: true, viewsCount: statue.viewsCount });
      }
    }

    // 2. Posts Database (Dòng Chảy Hoằng Pháp & Trí Tuệ Phật Pháp)
    const posts = await loadServerlessJsonAsync<any[]>(POSTS_DB_CONFIG);
    const post = posts.find(
      (p) =>
        p.id === idOrSlug ||
        p.slug === idOrSlug ||
        String(p.wpPostId) === idOrSlug
    );

    if (post) {
      post.viewsCount = (Number(post.viewsCount) || 108) + 1;
      saveServerlessJson(POSTS_DB_CONFIG, posts).catch((e) =>
        console.error('Lỗi lưu views post:', e)
      );
      return NextResponse.json({ success: true, viewsCount: post.viewsCount });
    }

    return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
