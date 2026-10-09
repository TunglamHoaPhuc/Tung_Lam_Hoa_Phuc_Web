import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getTopics, saveTopics, syncWpForGioiThieu } from '../route';

export async function POST(req: NextRequest) {
  try {
    const topics = await getTopics();
    const { count, updatedSlugs } = await syncWpForGioiThieu(topics);

    if (count > 0) {
      await saveTopics(topics);

      // Revalidate cache các trang giới thiệu
      try {
        revalidatePath('/', 'page');
        revalidatePath('/gioi-thieu', 'page');
        updatedSlugs.forEach((slug) => {
          revalidatePath(`/gioi-thieu/${slug}`, 'page');
        });
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
