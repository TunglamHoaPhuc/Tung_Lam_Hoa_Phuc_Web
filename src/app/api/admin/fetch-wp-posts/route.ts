import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://admin.tunglamhoaphuc.com/wp-json/wp/v2/tong-chi?per_page=100', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 }, // Cache 60s
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Không thể kết nối WordPress API' }, { status: 502 });
    }

    const data = await res.json();
    const posts = (Array.isArray(data) ? data : []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title?.rendered || `Bài viết #${p.id}`,
      date: p.date,
      modified: p.modified,
    }));

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
