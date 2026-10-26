import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DB_CONFIG = {
  fileName: 'danh-tang-database.json',
  localRelativePath: 'src/data/danh-tang-database.json',
  s3Key: 'tunglamhoaphuc2/database/danh-tang-database.json',
  defaultData: [] as any[],
};

async function getMonks(): Promise<any[]> {
  return await loadServerlessJsonAsync<any[]>(DB_CONFIG);
}

async function saveMonks(monks: any[]): Promise<boolean> {
  return await saveServerlessJson<any[]>(DB_CONFIG, monks);
}

function triggerRevalidation() {
  try {
    revalidatePath('/', 'page');
    revalidatePath('/vu-tru-phat-giao', 'page');
    revalidatePath('/vu-tru-phat-giao/to-duong', 'page');
  } catch (e) {
    console.warn('Revalidation warning:', e);
  }
}

// 🪷 Lấy danh sách Danh Tăng
export async function GET(req: Request) {
  try {
    const monks = await getMonks();
    return NextResponse.json(
      { success: true, total: monks.length, data: monks },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🪷 Cập nhật hoặc thêm mới Danh Tăng
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const monks = await getMonks();

    if (body.id) {
      const idx = monks.findIndex((m: any) => m.id === body.id);
      if (idx >= 0) {
        monks[idx] = { ...monks[idx], ...body, updatedAt: new Date().toISOString() };
      } else {
        monks.unshift({ ...body, updatedAt: new Date().toISOString() });
      }
      await saveMonks(monks);
      triggerRevalidation();
      return NextResponse.json({ success: true, message: 'Đã lưu thông tin Danh Tăng thành công!', data: body });
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
    await saveMonks(body);
    triggerRevalidation();

    return NextResponse.json({ success: true, count: body.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
