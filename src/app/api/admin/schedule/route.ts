import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, updateDb } from '@/lib/s3-db';
import { SCHEDULE_DB } from '@/lib/s3-collections';

export interface ScheduleDatabaseData {
  featuredPrograms: Array<{
    id: string;
    title: string;
    schedule: string;
    summary: string;
    imgUrl: string;
  }>;
  monthThemes: Record<string, {
    month: number;
    bannerImg: string;
    title: string;
    quoteLines: string[];
    author: string;
    primaryColor: string;
    secondaryColor: string;
    themeBg: string;
  }>;
  customEvents: Array<{
    id: string;
    solarDateStr: string; // "DD.MM.YYYY"
    title: string;
    category: string;
    timeSlot1Label?: string;
    timeSlot1Time?: string;
    location: string;
    description: string;
    imgUrl?: string;
  }>;
}

/** Lịch tu học lưu trên Backblaze B2: tunglamhoaphuc2/database/schedule-database.json (định nghĩa chung trong s3-collections) */

export async function GET() {
  try {
    const data = await readDb<ScheduleDatabaseData>(SCHEDULE_DB);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const updatedData = await updateDb<ScheduleDatabaseData>(SCHEDULE_DB, (currentData) => ({
      featuredPrograms: Array.isArray(body.featuredPrograms) ? body.featuredPrograms : currentData.featuredPrograms,
      monthThemes: body.monthThemes && typeof body.monthThemes === 'object' ? body.monthThemes : currentData.monthThemes,
      customEvents: Array.isArray(body.customEvents) ? body.customEvents : (currentData.customEvents || []),
    }));

    return NextResponse.json({ success: true, message: 'Đã lưu lịch tu học thành công' });
  } catch (error: any) {
    console.error('Error saving schedule:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
