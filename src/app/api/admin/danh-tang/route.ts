import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { readDb, updateDb } from '@/lib/s3-db';
import { DANH_TANG_DB } from '@/lib/s3-collections';

// 🪷 Lấy danh sách Danh Tăng
export async function GET(req: Request) {
  try {
    const monks = await readDb<any[]>(DANH_TANG_DB);
    return NextResponse.json({ success: true, total: monks.length, data: monks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🪷 Cập nhật hoặc thêm mới Danh Tăng
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.id) {
      const saved = await updateDb<any[]>(DANH_TANG_DB, (monks) => {
        const idx = monks.findIndex((m: any) => m.id === body.id);
        if (idx >= 0) {
          monks[idx] = { ...monks[idx], ...body };
        } else {
          monks.unshift(body);
        }
        return monks;
      });

      try {
        revalidatePath('/');
        revalidatePath('/vu-tru-phat-giao/to-duong');
      } catch (e) {
        console.warn('Revalidation warning:', e);
      }

      return NextResponse.json({
        success: true,
        message: 'Đã lưu thông tin Danh Tăng thành công!',
        data: body,
        total: saved.length,
      });
    }

    return NextResponse.json({ success: false, error: 'Thiếu ID Danh Tăng' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🪷 Cập nhật toàn bộ thứ tự Danh Tăng (Reorder)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, error: 'Dữ liệu phải là một mảng Danh Tăng' }, { status: 400 });
    }
    const saved = await updateDb<any[]>(DANH_TANG_DB, () => body);

    try {
      revalidatePath('/');
      revalidatePath('/vu-tru-phat-giao/to-duong');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, count: saved.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
