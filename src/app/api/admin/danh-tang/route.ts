import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'src/data/danh-tang-database.json');

function getMonks() {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveMonks(monks: any[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(monks, null, 2), 'utf-8');
}

// 🪷 Lấy danh sách Danh Tăng
export async function GET(req: Request) {
  try {
    const monks = getMonks();
    return NextResponse.json({ success: true, total: monks.length, data: monks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🪷 Cập nhật hoặc thêm mới Danh Tăng
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const monks = getMonks();

    if (body.id) {
      const idx = monks.findIndex((m: any) => m.id === body.id);
      if (idx >= 0) {
        monks[idx] = { ...monks[idx], ...body };
      } else {
        monks.unshift(body);
      }
      saveMonks(monks);
      return NextResponse.json({ success: true, message: 'Đã lưu thông tin Danh Tăng thành công!', data: body });
    }

    return NextResponse.json({ success: false, error: 'Thiếu ID Danh Tăng' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
