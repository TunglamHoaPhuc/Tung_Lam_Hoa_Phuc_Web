import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'src/data/tong-chi-data.json');

// 🪷 Parser biến mã HTML WordPress Gutenberg thành Markdown/Clean format chuẩn
function convertWpHtmlToCleanContent(wpRawHtml: string): { cleanedContent: string; extractedSubtitle?: string } {
  if (!wpRawHtml) return { cleanedContent: '' };

  let html = wpRawHtml
    .replace(/&#8211;/g, '–')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC');

  // 1. Bóc tách thẻ phụ (Subtitle)
  let extractedSubtitle: string | undefined = undefined;
  const firstP = html.match(/^<p[^>]*>(?:<em><strong>|<strong><em>|<em>|<strong>)([\s\S]*?)(?:<\/strong><\/em>|<\/em><\/strong>|<\/em>|<\/strong>)<\/p>/i);
  if (firstP) {
    const rawSub = firstP[1].replace(/<[^>]+>/g, '').trim();
    if (rawSub.length > 0 && rawSub.length < 80 && !rawSub.includes('“') && !rawSub.includes('”')) {
      extractedSubtitle = rawSub;
      html = html.replace(firstP[0], '');
    }
  }

  // 2. Headings
  html = html.replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, (_m, inner) => {
    const cleanText = inner.replace(/<[^>]+>/g, '').replace(/^\*\*|\*\*$/g, '').trim();
    return `\n\n### ${cleanText}\n\n`;
  });

  // 3. Blockquotes chuẩn của WordPress Gutenberg
  html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, bqInner) => {
    const clean = bqInner
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/^[“"”\s]+|[“"”\s]+$/g, '');
    const lines = clean.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const quoteLines = lines.map((l: string) => `> ${l}`);
    return `\n\n${quoteLines.join('\n')}\n\n`;
  });

  // 4. Khối Hình Ảnh WordPress Gutenberg
  html = html.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_m, figInner) => {
    const srcMatch = figInner.match(/src=["']([^"']+)["']/i);
    const altMatch = figInner.match(/alt=["']([^"']*)["']/i);
    const capMatch = figInner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const src = srcMatch ? srcMatch[1] : '';
    const caption = capMatch ? capMatch[1].replace(/<[^>]+>/g, '').trim() : (altMatch ? altMatch[1].trim() : '');
    if (!src) return '';
    return `\n\n![${caption}](${src})\n\n`;
  });

  // 5. Standalone <img>
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '\n\n![$2]($1)\n\n');
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');

  // 6. HR
  html = html.replace(/<hr[^>]*\/?>/gi, '\n\n');

  // 7. Paragraphs
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, (_m, pText) => {
    const cleanP = pText.replace(/<br\s*[\/]?>/gi, '\n').replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '').trim();
    if (!cleanP) return '';
    return `\n\n${cleanP}\n\n`;
  });

  // 8. Clean markdown
  html = html
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '');

  const cleanedLines = html
    .split('\n')
    .filter((l) => {
      const trimmed = l.trim();
      if (!trimmed) return true;
      if (/^(?:-{2,}|\*{2,}|_{2,}|\u2014{2,})$/.test(trimmed)) return false;
      if (/^Infographic\s*\d*\s*card/i.test(trimmed)) return false;
      if (/^\d*\s*Ngăn\s*kéo\s*card/i.test(trimmed)) return false;
      if (/^Click\s*ra\s*trang\s*chi\s*tiết/i.test(trimmed)) return false;
      if (/^QUOTE\s*CUỐI\s*TRANG/i.test(trimmed)) return false;
      if (/^TÀI\s*LIỆU\s*THAM\s*KHẢO/i.test(trimmed)) return false;
      if (trimmed === '↓' || trimmed === '->' || trimmed === '-->') return false;
      return true;
    })
    .join('\n');

  const finalHtml = cleanedLines.replace(/\n{3,}/g, '\n\n').trim();

  return { cleanedContent: finalHtml, extractedSubtitle };
}

export async function POST() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file dữ liệu tong-chi-data.json' }, { status: 404 });
    }

    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const articles = JSON.parse(rawData);

    // Fetch live posts from WordPress Gutenberg API
    const wpRes = await fetch('https://admin.tunglamhoaphuc.com/wp-json/wp/v2/tong-chi?per_page=100', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });

    if (!wpRes.ok) {
      return NextResponse.json({ success: false, error: 'Không thể kết nối đến WordPress REST API' }, { status: 502 });
    }

    const wpPosts = await wpRes.json();
    if (!Array.isArray(wpPosts)) {
      return NextResponse.json({ success: false, error: 'Dữ liệu trả về từ WordPress không hợp lệ' }, { status: 502 });
    }

    let updatedCount = 0;
    const updatedTitles: string[] = [];

    // Map normalize function
    const norm = (s: string) =>
      (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]/g, '');

    for (const wpPost of wpPosts) {
      const wpId = String(wpPost.id);
      const wpSlug = wpPost.slug || '';
      const wpTitle = (wpPost.title?.rendered || '').trim();
      const rawHtml = wpPost.content?.rendered || '';
      const { cleanedContent, extractedSubtitle } = convertWpHtmlToCleanContent(rawHtml);
      const acf = wpPost.acf || {};
      const excerpt = (wpPost.excerpt?.rendered || '').replace(/<[^>]+>/g, '').replace(/&#8230;/g, '...').trim();

      // Find matching article in local database
      const matchIdx = articles.findIndex((a: any) => {
        if (a.wpPostId && String(a.wpPostId) === wpId) return true;
        if (wpSlug && a.slug === wpSlug) return true;
        if (norm(a.title) === norm(wpTitle)) return true;
        return false;
      });

      if (matchIdx !== -1) {
        const target = articles[matchIdx];
        target.wpPostId = wpId;
        if (cleanedContent && cleanedContent.length > 10) {
          target.content = cleanedContent;
        }
        if (excerpt) target.excerpt = excerpt;
        if (wpTitle) target.title = wpTitle;
        if (acf.tieu_de_phu || extractedSubtitle) {
          target.subtitle = acf.tieu_de_phu || extractedSubtitle || target.subtitle;
        }
        target.updatedAt = new Date().toISOString();
        updatedCount++;
        updatedTitles.push(`${target.title} (WP #${wpId})`);
      }
    }

    // Save back to JSON file
    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      count: updatedCount,
      updatedTitles,
      message: `Đã đồng bộ thành công ${updatedCount} bài viết từ WordPress Gutenberg!`,
    });
  } catch (error: any) {
    console.error('Lỗi khi đồng bộ WordPress:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
