import { NextRequest, NextResponse } from 'next/server';
import { readPublicCollection } from '@/lib/s3-collections';

/**
 * 🪷 API CÔNG KHAI ĐỌC DỮ LIỆU TỪ BACKBLAZE B2
 *
 * GET /api/public/data/<key>
 * Chỉ cho phép các collection trong whitelist (PUBLIC_COLLECTIONS).
 * HTTP cache 15s + stale-while-revalidate để giảm số lần đọc S3.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const { file } = await params;
    const data = await readPublicCollection(file);
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          'Cache-Control': 'public, max-age=15, stale-while-revalidate=60',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
}