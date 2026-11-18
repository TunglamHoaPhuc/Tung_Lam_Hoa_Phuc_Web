import { NextRequest, NextResponse } from 'next/server';

const MAX_TTS_LENGTH = 260;

function normalizeVietnameseTtsText(raw: string): string {
  return raw
    .replace(/\bTP\.\s*HCM\b/gi, 'Thành phố Hồ Chí Minh')
    .replace(/\bHT\.\s*/g, 'Hòa thượng ')
    .replace(/\bÂL\b/g, 'Âm lịch')
    .replace(/\b(\d{1,2})h(\d{2})\b/gi, '$1 giờ $2 phút')
    .replace(/[–—]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    const rawText = req.nextUrl.searchParams.get('text') || '';
    const cleaned = normalizeVietnameseTtsText(rawText);

    if (!cleaned) {
      return NextResponse.json({ error: 'Thiếu nội dung text cần đọc' }, { status: 400 });
    }

    const capped = cleaned.slice(0, MAX_TTS_LENGTH);
    const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(
      capped
    )}`;

    const upstream = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://translate.google.com/',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Không thể lấy giọng đọc (${upstream.status})` },
        { status: 502 }
      );
    }

    const audioBuffer = await upstream.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi dịch vụ đọc tiếng Việt';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
