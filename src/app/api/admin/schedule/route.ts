import { NextRequest, NextResponse } from 'next/server';
import { loadServerlessJson, saveServerlessJson, ServerlessDbOptions } from '@/lib/serverless-db';
import scheduleDbJson from '@/data/schedule-database.json';

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

const DB_OPTIONS: ServerlessDbOptions<ScheduleDatabaseData> = {
  fileName: 'schedule-database.json',
  localRelativePath: 'src/data/schedule-database.json',
  s3Key: 'tunglamhoaphuc2/database/schedule-database.json',
  defaultData: scheduleDbJson as unknown as ScheduleDatabaseData,
};

export async function GET() {
  try {
    const data = loadServerlessJson(DB_OPTIONS);
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

    const currentData = loadServerlessJson(DB_OPTIONS);
    const updatedData: ScheduleDatabaseData = {
      featuredPrograms: Array.isArray(body.featuredPrograms) ? body.featuredPrograms : currentData.featuredPrograms,
      monthThemes: body.monthThemes && typeof body.monthThemes === 'object' ? body.monthThemes : currentData.monthThemes,
      customEvents: Array.isArray(body.customEvents) ? body.customEvents : (currentData.customEvents || []),
    };

    const saved = await saveServerlessJson(DB_OPTIONS, updatedData);
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Không thể ghi dữ liệu' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Đã lưu lịch tu học thành công' });
  } catch (error: any) {
    console.error('Error saving schedule:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
