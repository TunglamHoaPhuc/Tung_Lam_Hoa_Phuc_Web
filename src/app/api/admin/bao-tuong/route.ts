import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { OFFICIAL_STATUE_DATASET, StatueRecord } from '@/data/statue-data';

const DB_PATH = path.resolve(process.cwd(), 'src/data/statues-database.json');

function getStatues(): StatueRecord[] {
  if (!fs.existsSync(DB_PATH)) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(OFFICIAL_STATUE_DATASET, null, 2), 'utf8');
      return OFFICIAL_STATUE_DATASET;
    } catch {
      return OFFICIAL_STATUE_DATASET;
    }
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : OFFICIAL_STATUE_DATASET;
  } catch {
    return OFFICIAL_STATUE_DATASET;
  }
}

function saveStatues(statues: StatueRecord[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(statues, null, 2), 'utf8');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const assembly = searchParams.get('assembly');
    const areaId = searchParams.get('areaId');
    const categoryType = searchParams.get('type');
    const search = searchParams.get('search');

    let statues = getStatues();

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

    const statues = getStatues();
    const index = statues.findIndex((s) => (id && s.id === id) || (code && s.code === code));

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bảo tượng tương ứng' },
        { status: 404 }
      );
    }

    statues[index] = {
      ...statues[index],
      ...updates,
    };

    saveStatues(statues);

    return NextResponse.json({
      success: true,
      data: statues[index],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const statues = getStatues();

    const newId = body.id || `statue-${Date.now()}`;
    const newStatue: StatueRecord = {
      ...body,
      id: newId,
      code: body.code || `TP${String(statues.length + 1).padStart(4, '0')}`,
    };

    statues.unshift(newStatue);
    saveStatues(statues);

    return NextResponse.json({
      success: true,
      data: newStatue,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
