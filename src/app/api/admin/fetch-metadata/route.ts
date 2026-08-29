import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ success: false, error: 'Thiếu tham số url' }, { status: 400 });
    }

    const trimmedUrl = url.trim();

    // 1. KIỂM TRA LINK YOUTUBE
    const ytMatch = trimmedUrl.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (ytMatch) {
      const videoId = ytMatch[1];
      const standardWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      let title = '';
      let author = 'Chùa Hoằng Pháp';

      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(standardWatchUrl)}&format=json`,
          { next: { revalidate: 3600 } }
        );
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          title = oembedData.title || '';
          if (oembedData.author_name) author = oembedData.author_name;
        }
      } catch (err) {
        console.error('Error fetching YouTube oEmbed:', err);
      }

      if (!title) {
        title = `Video Pháp Thoại — YouTube (${videoId})`;
      }

      return NextResponse.json({
        success: true,
        type: 'youtube',
        videoId,
        title: title.toUpperCase(),
        subtitle: 'Video Pháp Thoại / Phim Tư Liệu',
        author,
        thumbnailUrl,
        videoUrl: embedUrl,
        rawUrl: standardWatchUrl,
        description: `Thước phim tư liệu và bài giảng pháp thoại ý nghĩa hoằng truyền chánh pháp.`,
      });
    }

    // 2. KIỂM TRA LINK BÀI VIẾT WEBSITE (VÍ DỤ: CHỦA HOẰNG PHÁP, BÁO GIÁC NGỘ, TÙNG LÂM HÒA PHÚC...)
    try {
      const res = await fetch(trimmedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          error: `Không thể kết nối đến website (${res.status})`,
        });
      }

      const html = await res.text();

      // Extract Open Graph & Meta tags via regex
      const getMeta = (prop: string) => {
        const match =
          html.match(new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i')) ||
          html.match(new RegExp(`<meta[^>]*name=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i')) ||
          html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${prop}["']`, 'i')) ||
          html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${prop}["']`, 'i'));
        return match ? match[1] : '';
      };

      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      let title = getMeta('og:title') || (titleMatch ? titleMatch[1] : '');
      title = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").trim();

      // Tách tên trang ở cuối tiêu đề nếu có
      if (title.includes(' - ')) {
        const parts = title.split(' - ');
        if (parts.length > 1 && parts[parts.length - 1].length < 35) {
          title = parts.slice(0, parts.length - 1).join(' - ').trim();
        }
      } else if (title.includes(' | ')) {
        const parts = title.split(' | ');
        if (parts.length > 1 && parts[parts.length - 1].length < 35) {
          title = parts.slice(0, parts.length - 1).join(' | ').trim();
        }
      }

      let description = getMeta('og:description') || getMeta('description') || '';
      description = description.replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();

      let image = getMeta('og:image') || getMeta('twitter:image') || '';
      if (image && !image.startsWith('http')) {
        try {
          const origin = new URL(trimmedUrl).origin;
          image = new URL(image, origin).href;
        } catch {
          // ignore
        }
      }

      let author = getMeta('author') || getMeta('article:author') || 'Chùa Hoằng Pháp';
      let siteName = getMeta('og:site_name') || 'TÔNG PHONG HOẰNG PHÁP';

      return NextResponse.json({
        success: true,
        type: 'web',
        title: title.toUpperCase(),
        label: (siteName || 'BÀI VIẾT NỔI BẬT').toUpperCase(),
        author,
        description,
        bgImage: image,
        linkUrl: trimmedUrl,
      });
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        error: `Lỗi phân tích trang web: ${err.message}`,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body.url;
    if (!url) {
      return NextResponse.json({ success: false, error: 'Thiếu tham số url' }, { status: 400 });
    }
    const mockRequest = new Request(`http://localhost/api/admin/fetch-metadata?url=${encodeURIComponent(url)}`);
    return GET(mockRequest);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
