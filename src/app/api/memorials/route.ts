import { NextResponse } from 'next/server';
import {
  filterMemorialRecords,
  getAllMemorialRecords,
  getMemorialSyncMeta,
} from '@/lib/memorial-db';
import { matchesCategoryFilter, toPublicMemorialRecord } from '@/lib/memorial-types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const khu = (searchParams.get('khu') || searchParams.get('cat') || 'all').trim();

    const [allRecords, meta] = await Promise.all([
      getAllMemorialRecords(),
      getMemorialSyncMeta(),
    ]);

    const byCategory =
      khu && khu !== 'all'
        ? allRecords.filter((rec) => matchesCategoryFilter(rec.categorySlug, khu))
        : allRecords;

    const publicRecords = q
      ? filterMemorialRecords(byCategory, q)
      : byCategory.map(toPublicMemorialRecord);

    return NextResponse.json(
      {
        success: true,
        data: {
          records: publicRecords,
          totalInCategory: byCategory.length,
          meta: {
            lastSyncedAt: meta.lastSyncedAt,
            totalRecords: meta.totalRecords || allRecords.length,
            countsByCategory: meta.countsByCategory,
          },
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[GET /api/memorials] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải dữ liệu tra cứu bài vị.' },
      { status: 500 }
    );
  }
}
