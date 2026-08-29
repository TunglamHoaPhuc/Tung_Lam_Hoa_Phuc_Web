import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page_num, rect, canvas_size, fallback_text } = body;

    let detectedText = (fallback_text || '').trim();

    // Neu khong co fallback_text, thu tim tu sara_book_data.json theo page_num
    if (!detectedText && page_num) {
      try {
        const jsonPath = path.join(process.cwd(), 'public', 'tibetan-study', 'sara_book_data.json');
        if (fs.existsSync(jsonPath)) {
          const raw = fs.readFileSync(jsonPath, 'utf8');
          const pages = JSON.parse(raw);
          const p = pages.find((item: any) => item.page_number === Number(page_num));
          if (p && p.sentences && p.sentences.length > 0) {
            // Uoc luong dong theo toa do Y
            if (rect && canvas_size && canvas_size[1] > 0) {
              const relY = (rect[1] + rect[3]) / 2 / canvas_size[1];
              const lineIndex = Math.min(
                p.sentences.length - 1,
                Math.max(0, Math.floor(relY * p.sentences.length))
              );
              detectedText = p.sentences[lineIndex] || p.full_content || p.title || '';
            } else {
              detectedText = p.sentences[0] || p.full_content || '';
            }
          }
        }
      } catch (err) {
        console.error('sara_book_data lookup error:', err);
      }
    }

    if (!detectedText) {
      detectedText = `Trang ${page_num || 1}: Chữ Tạng Sara Book`;
    }

    // Goi Gemini de phan tich hoac lay fallback
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      const fallback = generateFallbackAnalysis(detectedText);
      return NextResponse.json({
        status: 'success',
        detected_text: detectedText,
        ...fallback,
        analysis: fallback,
      });
    }

    const prompt = `Phân tích đoạn chữ Tạng sau: "${detectedText}".
Trả về DUY NHẤT một JSON hợp lệ với cấu trúc sau (không kèm markdown \`\`\`json):
{
  "detected_text": "${detectedText}",
  "wylie": "chuyển tự Wylie đầy đủ",
  "full_translation": "Dịch nghĩa hoàn chỉnh câu sang tiếng Việt",
  "dictionary": {
    "vn": "Nghĩa tổng quát tiếng Việt",
    "usage": "Ngữ cảnh sử dụng"
  },
  "table_rows": [
    {
      "tibetan": "từ/cụm từ Tạng",
      "phonetic": "phiên âm đọc tiếng Việt/IPA",
      "wylie": "chuyển tự wylie của từ này",
      "meaning": "nghĩa tiếng Việt",
      "pos": "Danh từ/Động từ/Trợ từ..."
    }
  ],
  "syllables": [
    {
      "syllable": "từng âm tiết Tạng",
      "wylie": "wylie âm tiết",
      "root": "căn tự gốc",
      "prefix": "tiền tự (nếu có)",
      "suffix": "hậu tự (nếu có)",
      "vowel": "nguyên âm",
      "spelling_steps": ["bước ghép vần 1", "bước 2"],
      "coach_guide": {
        "correction_tips": ["mẹo khẩu hình uốn lưỡi/bật hơi"]
      }
    }
  ],
  "usage_context": {
    "situation": "Tình huống giao tiếp thực tế",
    "cultural_notes": "Ghi chú văn hóa Phật giáo Tây Tạng",
    "dialogue_examples": []
  },
  "buddhist_context": {
    "scripture_quote": "${detectedText}",
    "teachings": "Ý nghĩa giáo lý",
    "philosophy_reflection": "Ứng dụng tu tập"
  }
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1500 },
        }),
      }
    );

    if (geminiRes.ok) {
      const geminiData = await geminiRes.json();
      const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          status: 'success',
          detected_text: parsed.detected_text || detectedText,
          ...parsed,
          analysis: parsed,
        });
      }
    }

    const fallback = generateFallbackAnalysis(detectedText);
    return NextResponse.json({
      status: 'success',
      detected_text: detectedText,
      ...fallback,
      analysis: fallback,
    });
  } catch (err: any) {
    console.error('[/api/crop-analyze] Error:', err);
    const fallback = generateFallbackAnalysis('Chữ Tạng');
    return NextResponse.json({
      status: 'success',
      detected_text: 'Chữ Tạng',
      ...fallback,
      analysis: fallback,
    });
  }
}

function generateFallbackAnalysis(text: string) {
  const wylie = toSimpleWylie(text);
  return {
    wylie: wylie || text,
    full_translation: `Bản dịch nghĩa: "${text}"`,
    dictionary: {
      vn: `Ý nghĩa: ${text}`,
      usage: 'Học viện Phật học Sara (Dharamsala)',
    },
    table_rows: [
      {
        tibetan: text,
        phonetic: wylie,
        wylie: wylie,
        meaning: 'Cụm từ tiếng Tạng trong bài học',
        pos: 'Ngữ liệu',
      },
    ],
    syllables: [
      {
        syllable: text,
        wylie: wylie,
        root: text.slice(0, 1) || '-',
        prefix: '-',
        suffix: '-',
        vowel: 'a',
        spelling_steps: [`Đọc căn tự: ${wylie}`],
        coach_guide: {
          correction_tips: ['Mở khẩu hình tự nhiên, phát âm rõ ràng chuẩn tu viện.'],
        },
      },
    ],
    usage_context: {
      situation: 'Giao tiếp tu học đàm thoại và tụng niệm.',
      cultural_notes: 'Chữ Tạng mang âm ba cát tường thanh tịnh.',
      dialogue_examples: [],
    },
    buddhist_context: {
      scripture_quote: text,
      teachings: 'Trí tuệ thanh lương qua từng câu chữ.',
      philosophy_reflection: 'Thân - Khẩu - Ý thanh tịnh khi trì tụng.',
    },
  };
}

function toSimpleWylie(text: string): string {
  const map: Record<string, string> = {
    'ཀ':'ka','ཁ':'kha','ག':'ga','ང':'nga','ཅ':'ca','ཆ':'cha','ཇ':'ja','ཉ':'nya',
    'ཏ':'ta','ཐ':'tha','ད':'da','ན':'na','པ':'pa','ཕ':'pha','བ':'ba','མ':'ma',
    'ཙ':'tsa','ཚ':'tsha','ཛ':'dza','ཝ':'wa','ཞ':'zha','ཟ':'za','འ':"'a",'ཡ':'ya',
    'ར':'ra','ལ':'la','ཤ':'sha','ས':'sa','ཧ':'ha','ཨ':'a',
    'ི':'i','ུ':'u','ེ':'e','ོ':'o','་':' ','།':'|',
  };
  return text.split('').map(c => map[c] !== undefined ? map[c] : c).join('').replace(/\s+/g, ' ').trim();
}
