import { NextRequest, NextResponse } from 'next/server';
import { OFFICIAL_STATUE_DATASET, StatueRecord } from '@/data/statue-data';
import { readDb, updateDb } from '@/lib/s3-db';
import { STATUES_DB } from '@/lib/s3-collections';

async function getStatues(): Promise<StatueRecord[]> {
  const data = await readDb<StatueRecord[]>(STATUES_DB);
  return Array.isArray(data) && data.length > 0 ? data : OFFICIAL_STATUE_DATASET;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const assembly = searchParams.get('assembly');
    const areaId = searchParams.get('areaId');
    const categoryType = searchParams.get('type');
    const search = searchParams.get('search');

    let statues = await getStatues();

    if (assembly && assembly !== 'all') {
      statues = statues.filter((s) => s.assembly === assembly || s.assemblyId === assembly);
    }

    if (areaId && areaId !== 'all') {
      statues = statues.filter((s) => s.areaId === areaId || s.areaSlug === areaId);
    }

    if (categoryType && categoryType !== 'all') {
      statues = statues.filter((s) => s.categoryType === categoryType);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      statues = statues.filter(
        (s) =>
          s.code?.toLowerCase().includes(q) ||
          s.name?.toLowerCase().includes(q) ||
          s.subtitle?.toLowerCase().includes(q) ||
          s.location?.toLowerCase().includes(q) ||
          s.quote?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      total: statues.length,
      statues,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, code, updates } = body;

    if (!id && !code) {
      return NextResponse.json(
        { success: false, error: 'Cần cung cấp ID hoặc Mã tượng (code)' },
        { status: 400 }
      );
    }

    let updated: StatueRecord | undefined;
    try {
      await updateDb<StatueRecord[]>(STATUES_DB, (statues) => {
        const index = statues.findIndex((s) => (id && s.id === id) || (code && s.code === code));
        if (index === -1) throw new Error('KHONG_TIM_THAY_BAO_TUONG');
        statues[index] = {
          ...statues[index],
          ...updates,
        };
        updated = statues[index];
        return statues;
      });
    } catch (err: any) {
      if (err?.message === 'KHONG_TIM_THAY_BAO_TUONG') {
        return NextResponse.json(
          { success: false, error: 'Không tìm thấy bảo tượng tương ứng' },
          { status: 404 }
        );
      }
      throw err;
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let created!: StatueRecord;
    await updateDb<StatueRecord[]>(STATUES_DB, (statues) => {
      const newId = body.id || `statue-${Date.now()}`;
      created = {
        ...body,
        id: newId,
        code: body.code || `TP${String(statues.length + 1).padStart(4, '0')}`,
      };
      statues.unshift(created);
      return statues;
    });

    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
