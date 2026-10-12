import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getTopics, saveTopics, syncWpForGioiThieu } from '../route';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is okay
    }
    const targetWpId = body?.wpPostId;
    const force = Boolean(body?.force);

    const topics = await getTopics();
    const { count, updatedSlugs } = await syncWpForGioiThieu(topics, targetWpId, force);

    if (count > 0 || force) {
      await saveTopics(topics);

      // Revalidate cache các trang giới thiệu
      try {
        revalidatePath('/', 'page');
        revalidatePath('/gioi-thieu', 'page');
        topics.forEach((t) => {
          revalidatePath(`/gioi-thieu/${t.slug}`, 'page');
        });
        revalidatePath('/gioi-thieu/lich-su-tung-lam-hoa-phuc', 'page');
      } catch (e) {
        console.warn('Revalidation warning:', e);
      }
    }

    return NextResponse.json({
      success: true,
      count,
      updatedSlugs,
      message: count > 0 
        ? `Đã đồng bộ thành công ${count} bài viết Giới Thiệu từ WordPress Gutenberg!` 
        : 'Tất cả các bài viết Giới Thiệu đã ở phiên bản mới nhất, không có thay đổi trên WordPress.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi đồng bộ WordPress' },
      { status: 500 }
    );
  }
}
