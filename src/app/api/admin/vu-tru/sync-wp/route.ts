import { NextRequest, NextResponse } from 'next/server';
import { getAreas, saveAreas, syncWpForAreas } from '../route';

export async function POST(req: NextRequest) {
  try {
    let targetWpId: string | number | undefined = undefined;
    try {
      const body = await req.json();
      if (body?.wpPostId) targetWpId = body.wpPostId;
    } catch {
      // Body may be empty, proceed to sync all
    }

    const areas = await getAreas();
    const { count, updatedSlugs } = await syncWpForAreas(areas, targetWpId);

    if (count > 0) {
      await saveAreas(areas);
    }

    return NextResponse.json({
      success: true,
      count,
      updatedSlugs,
      message:
        count > 0
          ? `Đã đồng bộ thành công ${count} không gian từ WordPress Gutenberg!`
          : 'Tất cả các không gian đã ở phiên bản mới nhất, không có thay đổi trên WordPress.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi đồng bộ WordPress' },
      { status: 500 }
    );
  }
}
