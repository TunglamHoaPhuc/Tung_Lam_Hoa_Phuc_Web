import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// ── 30 PHỤ ÂM GỐC & 4 NGUYÊN ÂM ĐÃ THU ÂM CHUẨN TU VIỆN (STUDIO NATIVE MP3) ──
const NATIVE_AUDIO_MAP: Record<string, string> = {
  'ཀ': 'cons_1_ka.mp3',
  'ཁ': 'cons_2_kha.mp3',
  'ག': 'cons_3_ga.mp3',
  'ང': 'cons_4_nga.mp3',
  'ཅ': 'cons_5_ca.mp3',
  'ཆ': 'cons_6_cha.mp3',
  'ཇ': 'cons_7_ja.mp3',
  'ཉ': 'cons_8_nya.mp3',
  'ཏ': 'cons_9_ta.mp3',
  'ཐ': 'cons_10_tha.mp3',
  'ད': 'cons_11_da.mp3',
  'ན': 'cons_12_na.mp3',
  'པ': 'cons_13_pa.mp3',
  'ཕ': 'cons_14_pha.mp3',
  'བ': 'cons_15_ba.mp3',
  'མ': 'cons_16_ma.mp3',
  'ཙ': 'cons_17_tsa.mp3',
  'ཚ': 'cons_18_tsha.mp3',
  'ཛ': 'cons_19_dza.mp3',
  'ཝ': 'cons_20_wa.mp3',
  'ཞ': 'cons_21_zha.mp3',
  'ཟ': 'cons_22_za.mp3',
  'འ': 'cons_23_a_chung.mp3',
  'ཡ': 'cons_24_ya.mp3',
  'ར': 'cons_25_ra.mp3',
  'ལ': 'cons_26_la.mp3',
  'ཤ': 'cons_27_sha.mp3',
  'ས': 'cons_28_sa.mp3',
  'ཧ': 'cons_29_ha.mp3',
  'ཨ': 'cons_30_a.mp3',
  'ི': 'vowel_1_i.mp3',
  'ུ': 'vowel_2_u.mp3',
  'ེ': 'vowel_3_e.mp3',
  'ོ': 'vowel_4_o.mp3',
};

const HF_SPACE_URL = 'https://aipmtdd-tibetan-tts-service.hf.space';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText: string = (body.text || '').trim();
    const speed: number = body.speed || 0.75;

    if (!rawText) {
      return NextResponse.json({ status: 'error', message: 'Thiếu text' }, { status: 400 });
    }

    const cleanChar = rawText.replace(/[་།\s]/g, '');

    // 1. Kiểm tra nếu là 1 trong 30 phụ âm hoặc 4 nguyên âm có sẵn file thu âm phòng thu
    if (NATIVE_AUDIO_MAP[cleanChar]) {
      const fileName = NATIVE_AUDIO_MAP[cleanChar];
      const audioPath = `/tibetan-study/audio/${fileName}`;
      return NextResponse.json({
        status: 'success',
        audio_url: audioPath,
        type: 'native_studio',
        text: rawText,
        speed,
      });
    }

    // 2. Thử gọi Tibetan Neural TTS service trên HuggingFace (nếu có kết nối)
    try {
      const queryText = rawText.endsWith('།') ? rawText : `${rawText}།`;
      const callRes = await fetch(`${HF_SPACE_URL}/gradio_api/call/generate_tibetan_speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [queryText] }),
        signal: AbortSignal.timeout(5000),
      });

      if (callRes.ok) {
        const callData = await callRes.json();
        const eventId = callData?.event_id;

        if (eventId) {
          const sseRes = await fetch(`${HF_SPACE_URL}/gradio_api/call/generate_tibetan_speech/${eventId}`, {
            signal: AbortSignal.timeout(12000),
          });
          const textStream = await sseRes.text();
          const lines = textStream.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const parsed = JSON.parse(line.slice(5).trim());
                if (Array.isArray(parsed) && parsed[0]?.url) {
                  return NextResponse.json({
                    status: 'success',
                    audio_url: parsed[0].url,
                    type: 'neural_tibetan',
                    text: rawText,
                    speed,
                  });
                }
              } catch {}
            }
          }
        }
      }
    } catch (ttsErr) {
      console.warn('Tibetan Neural TTS service unavailable:', ttsErr);
    }

    // 3. Nếu là chuỗi nhiều âm tiết, kiểm tra xem âm tiết đầu có audio không
    const firstSyl = cleanChar.slice(0, 1);
    if (NATIVE_AUDIO_MAP[firstSyl]) {
      return NextResponse.json({
        status: 'success',
        audio_url: `/tibetan-study/audio/${NATIVE_AUDIO_MAP[firstSyl]}`,
        type: 'partial_native',
        text: rawText,
        speed,
      });
    }

    return NextResponse.json({
      status: 'fallback',
      text: rawText,
      phonetic: rawText,
      speed,
    });
  } catch (err: any) {
    console.error('[/api/tts] Error:', err);
    return NextResponse.json({ status: 'error', message: 'Lỗi phát âm' }, { status: 500 });
  }
}
