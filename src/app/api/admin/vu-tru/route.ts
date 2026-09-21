import { NextRequest, NextResponse } from 'next/server';
import { UNIVERSE_AREAS, UniverseArea } from '@/data/universe-data';
import { readDb, writeDb } from '@/lib/s3-db';
import { UNIVERSE_DB } from '@/lib/s3-collections';

export async function GET(req: NextRequest) {
  try {
    const areas = await readDb<UniverseArea[]>(UNIVERSE_DB);
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
    await writeDb(UNIVERSE_DB, body);
    return NextResponse.json({ success: true, count: body.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
