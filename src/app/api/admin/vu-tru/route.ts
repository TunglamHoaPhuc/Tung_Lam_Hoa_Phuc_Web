import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UNIVERSE_AREAS, UniverseArea } from '@/data/universe-data';

const DB_PATH = path.resolve(process.cwd(), 'src/data/universe-database.json');

function getAreas(): UniverseArea[] {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(UNIVERSE_AREAS, null, 2), 'utf-8');
    return UNIVERSE_AREAS;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return UNIVERSE_AREAS;
  }
}

function saveAreas(areas: UniverseArea[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(areas, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  try {
    const areas = getAreas();
    return NextResponse.json({ success: true, areas });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, error: 'Dữ liệu phải là một mảng khu vực' }, { status: 400 });
    }
    saveAreas(body);
    return NextResponse.json({ success: true, count: body.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
