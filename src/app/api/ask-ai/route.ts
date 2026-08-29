import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: string = (body.question || body.prompt || '').trim();
    const targetText: string = (body.target_text || body.text || '').trim();

    if (!question && !targetText) {
      return NextResponse.json({ answer: 'Xin hãy nhập câu hỏi hoặc chọn một đoạn văn bản tiếng Tạng.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        answer: `**Trợ lý Tiếng Tạng & Phật Pháp:**\n\nĐối với câu hỏi "${question}" liên quan đến văn bản Tạng \`${targetText || 'Sara Book'}\`:\n- Đây là ngữ liệu thuộc hệ thống giáo trình Phật học viện Sara (Dharamsala).\n- Bạn có thể luyện nghe phát âm chuẩn tốc độ 0.5x hoặc dùng bảng viết tay để ghi nhớ căn tự.`,
      });
    }

    const systemPrompt = `Bạn là Đại Đức / Giảng sư & Chuyên gia Cổ ngữ Tạng ngữ Phật giáo tại Tùng Lâm Hòa Phúc.
Người dùng đang học Giáo trình Tiếng Tạng Sara Book.
Văn bản tiếng Tạng đang học: "${targetText}"
Câu hỏi của học viên: "${question}"

Hãy trả lời học viên một cách từ bi, ân cần, uyên bác bằng tiếng Việt chuẩn mực, giải thích rõ ngữ nghĩa, nguồn gốc từ và ý nghĩa tu học Phật pháp.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
        }),
      }
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini status ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const answer = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Trợ lý AI đang cập nhật câu trả lời...';

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error('[/api/ask-ai] Error:', err);
    return NextResponse.json({
      answer: 'Xin lỗi, hệ thống AI trợ lý đang bận xử lý. Bạn hãy thử lại sau giây lát nhé!',
    });
  }
}
