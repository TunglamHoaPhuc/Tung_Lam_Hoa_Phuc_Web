import { NextRequest, NextResponse } from 'next/server';
import { readDb, updateDb } from '@/lib/s3-db';
import { GIOI_THIEU_DB } from '@/lib/s3-collections';
import { GioiThieuRecord } from '../route';

async function getTopics(): Promise<GioiThieuRecord[]> {
  return readDb<GioiThieuRecord[]>(GIOI_THIEU_DB);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const topics = await getTopics();
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

    let updated: GioiThieuRecord | null = null;
    try {
      await updateDb<GioiThieuRecord[]>(GIOI_THIEU_DB, (topics) => {
        const index = topics.findIndex((t) => t.id === id);
        if (index === -1) throw new Error('KHONG_TIM_THAY_CHU_DE');
        topics[index] = {
          ...topics[index],
          ...body,
          id: topics[index].id,
        };
        updated = topics[index];
        return topics;
      });
    } catch (err: any) {
      if (err?.message === 'KHONG_TIM_THAY_CHU_DE') {
        return NextResponse.json(
          { success: false, error: 'Không tìm thấy chủ đề giới thiệu' },
          { status: 404 }
        );
      }
      throw err;
    }

    return NextResponse.json({
      success: true,
      topic: updated,
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
    let removed = false;

    await updateDb<GioiThieuRecord[]>(GIOI_THIEU_DB, (topics) => {
      if (!topics.some((t) => t.id === id)) return topics;
      removed = true;
      return topics.filter((t) => t.id !== id);
    });

    if (!removed) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy chủ đề giới thiệu' },
        { status: 404 }
      );
    }

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
