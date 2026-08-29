import { NextRequest, NextResponse } from 'next/server';

// API Text-to-Speech cho chữ Tạng
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = (body.text || '').trim();
    const speed: number = body.speed || 0.75;

    if (!text) {
      return NextResponse.json({ status: 'error', message: 'Thiếu text' }, { status: 400 });
    }

    // Dung Web Speech API o phia client, server chi tra ve thong bao
    // (Web Speech API khong chay duoc o server-side)
    // Tra ve phonetic de client tu phat am
    return NextResponse.json({
      status: 'success',
      text,
      phonetic: text, // Client se dung SpeechSynthesis
      speed,
      message: 'ok',
    });
  } catch (err) {
    console.error('[/api/tts] Error:', err);
    return NextResponse.json({ status: 'error', message: 'Loi TTS' }, { status: 500 });
  }
}
