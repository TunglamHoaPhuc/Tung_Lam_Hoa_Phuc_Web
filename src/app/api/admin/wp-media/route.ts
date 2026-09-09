import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '24';
    const search = searchParams.get('search') || '';

    const wpParams = new URLSearchParams({
      page,
      per_page: perPage,
      _fields: 'id,date,title,source_url,media_details,mime_type',
    });

    if (search.trim()) {
      wpParams.set('search', search.trim());
    }

    const res = await fetch(`https://admin.tunglamhoaphuc.com/wp-json/wp/v2/media?${wpParams.toString()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 30 }, // Cache 30s
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `WordPress API lỗi HTTP ${res.status}` },
        { status: res.status }
      );
    }

    const totalItems = res.headers.get('X-WP-Total') || '0';
    const totalPages = res.headers.get('X-WP-TotalPages') || '1';
    const data = await res.json();

    const items = (Array.isArray(data) ? data : []).map((item: any) => {
      const sizes = item.media_details?.sizes || {};
      const thumb =
        sizes.medium?.source_url ||
        sizes.thumbnail?.source_url ||
        sizes.large?.source_url ||
        item.source_url;

      return {
        id: item.id,
        title: item.title?.rendered || `Media #${item.id}`,
        url: item.source_url,
        thumb,
        width: item.media_details?.width || 0,
        height: item.media_details?.height || 0,
        date: item.date,
        mimeType: item.mime_type,
      };
    });

    return NextResponse.json({
      success: true,
      items,
      totalItems: parseInt(totalItems, 10),
      totalPages: parseInt(totalPages, 10),
      page: parseInt(page, 10),
    });
  } catch (error: any) {
    console.error('Error fetching WP media:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi kết nối WordPress Media' },
      { status: 500 }
    );
  }
}
