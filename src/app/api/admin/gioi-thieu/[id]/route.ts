import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GioiThieuRecord } from '../route';

const DB_PATH = path.resolve(process.cwd(), 'src/data/gioi-thieu-database.json');

function getTopics(): GioiThieuRecord[] {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTopics(topics: GioiThieuRecord[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(topics, null, 2), 'utf8');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const topics = getTopics();
  const topic = topics.find((t) => t.id === id || t.slug === id);

  if (!topic) {
    return NextResponse.json(
      { success: false, error: 'Không tìm thấy chủ đề giới thiệu' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, topic });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const topics = getTopics();
    const index = topics.findIndex((t) => t.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy chủ đề giới thiệu' },
        { status: 404 }
      );
    }

    topics[index] = {
      ...topics[index],
      ...body,
      id: topics[index].id,
    };

    saveTopics(topics);

    return NextResponse.json({
      success: true,
      topic: topics[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let topics = getTopics();
    const exists = topics.some((t) => t.id === id);

    if (!exists) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy chủ đề giới thiệu' },
        { status: 404 }
      );
    }

    topics = topics.filter((t) => t.id !== id);
    saveTopics(topics);

    return NextResponse.json({
      success: true,
      message: 'Đã xóa chủ đề giới thiệu thành công',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
