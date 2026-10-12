import { NextRequest, NextResponse } from 'next/server';
import { getAreas } from '../route';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const areas = await getAreas();
    const area = areas.find((a) => a.slug.toLowerCase() === (slug || '').toLowerCase());

    if (!area) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy không gian' }, { status: 404 });
    }

    return NextResponse.json({ success: true, area });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
