import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { getImageUrl } from '@/utils/image';

const DATA_FILE = path.resolve(process.cwd(), 'src/data/tong-chi-data.json');

// 🪷 Parser HTML WordPress Gutenberg bằng Cheerio thành Markdown/Clean format chuẩn
function convertWpHtmlToCleanContent(wpRawHtml: string): { cleanedContent: string; extractedSubtitle?: string } {
  if (!wpRawHtml) return { cleanedContent: '' };

  // Chuẩn hóa ký tự cơ bản & thực thể HTML
  const normalizedHtml = wpRawHtml
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC');

  const $ = cheerio.load(normalizedHtml, null, false);

  // 1. Chuẩn hóa toàn bộ thuộc tính src của mọi thẻ <img> thành URL tuyệt đối WordPress
  $('img').each((_, el) => {
    const currentSrc = $(el).attr('src');
    if (currentSrc) {
      $(el).attr('src', getImageUrl(currentSrc));
    }
  });

  // 2. Bóc tách Subtitle (thẻ phụ) nếu thẻ <p> đầu tiên in đậm/nghiêng
  let extractedSubtitle: string | undefined = undefined;
  const firstP = $('p').first();
  if (firstP.length > 0) {
    const hasEmOrStrong = firstP.find('em, strong, b, i').length > 0;
    const text = firstP.text().trim();
    if (hasEmOrStrong && text.length > 0 && text.length < 120 && !text.includes('“') && !text.includes('”')) {
      extractedSubtitle = text;
      firstP.remove();
    }
  }

  // 3. Chuẩn hóa và biến đổi <figure> thành Markdown Image
  $('figure').each((_, el) => {
    const fig = $(el);
    const img = fig.find('img');
    const src = img.attr('src') ? getImageUrl(img.attr('src')) : '';
    const alt = img.attr('alt') || '';
    const figcaption = fig.find('figcaption').text().trim();
    const caption = figcaption || alt;

    if (src) {
      fig.replaceWith(`\n\n![${caption}](${src})\n\n`);
    } else {
      fig.remove();
    }
  });

  // 4. Biến đổi các thẻ <img> độc lập còn lại thành Markdown Image
  $('img').each((_, el) => {
    const img = $(el);
    const src = img.attr('src') ? getImageUrl(img.attr('src')) : '';
    const alt = img.attr('alt') || '';
    if (src) {
      img.replaceWith(`\n\n![${alt}](${src})\n\n`);
    } else {
      img.remove();
    }
  });

  // 5. Chuyển đổi Headings (h1 - h6)
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const h = $(el);
    const text = h.text().trim().replace(/^\*\*|\*\*$/g, '');
    h.replaceWith(`\n\n### ${text}\n\n`);
  });

  // 6. Chuyển đổi Blockquotes của WordPress Gutenberg
  $('blockquote').each((_, el) => {
    const bq = $(el);
    const clean = bq.text().trim().replace(/^[“"”\s]+|[“"”\s]+$/g, '');
    const lines = clean.split('\n').map((l) => l.trim()).filter(Boolean);
    const quoteLines = lines.map((l) => `> ${l}`);
    bq.replaceWith(`\n\n${quoteLines.join('\n')}\n\n`);
  });

  // 7. Chuyển đổi các thẻ in đậm, nghiêng, link
  $('strong, b').each((_, el) => {
    const st = $(el);
    st.replaceWith(`**${st.text().trim()}**`);
  });

  $('em, i').each((_, el) => {
    const em = $(el);
    em.replaceWith(`*${em.text().trim()}*`);
  });

  $('a').each((_, el) => {
    const a = $(el);
    const href = a.attr('href') || '#';
    a.replaceWith(`[${a.text().trim()}](${href})`);
  });

  $('hr').replaceWith('\n\n');
  $('br').replaceWith('\n');

  // 8. Chuyển đổi Paragraphs <p>
  $('p').each((_, el) => {
    const p = $(el);
    const text = p.text().trim();
    if (text) {
      p.replaceWith(`\n\n${text}\n\n`);
    } else {
      p.remove();
    }
  });

  const markdownText = $.text();

  // 9. Lọc các dòng meta thừa và khoảng trống
  const cleanedLines = markdownText
    .split('\n')
    .map((l) => l.trim())
    .filter((trimmed) => {
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

// 🖼️ Hàm chuẩn hóa toàn diện các thuộc tính ảnh tĩnh của đối tượng JSON bài viết
function normalizeArticleImages(article: any) {
  if (!article || typeof article !== 'object') return;

  const imageKeys = [
    'thumbnail',
    'thumbnailUrl',
    'banner',
    'bannerUrl',
    'bannerImage',
    'cover',
    'coverUrl',
    'coverImage',
    'bgImage',
    'imageUrl',
    'image',
    'featuredImage',
  ];

  for (const key of imageKeys) {
    if (typeof article[key] === 'string' && article[key]) {
      article[key] = getImageUrl(article[key]);
    }
  }

  // Khối bài viết nổi bật
  if (article.featuredArticle && typeof article.featuredArticle === 'object') {
    if (typeof article.featuredArticle.bgImage === 'string') {
      article.featuredArticle.bgImage = getImageUrl(article.featuredArticle.bgImage);
    }
    if (typeof article.featuredArticle.imageUrl === 'string') {
      article.featuredArticle.imageUrl = getImageUrl(article.featuredArticle.imageUrl);
    }
  }

  // Nguồn sách tham khảo (Object hoặc Array)
  if (article.sourceBook && typeof article.sourceBook === 'object') {
    if (typeof article.sourceBook.coverImage === 'string') {
      article.sourceBook.coverImage = getImageUrl(article.sourceBook.coverImage);
    }
    if (typeof article.sourceBook.imageUrl === 'string') {
      article.sourceBook.imageUrl = getImageUrl(article.sourceBook.imageUrl);
    }
  }
  if (Array.isArray(article.sourceBook)) {
    article.sourceBook.forEach((b: any) => {
      if (b && typeof b.coverImage === 'string') b.coverImage = getImageUrl(b.coverImage);
      if (b && typeof b.imageUrl === 'string') b.imageUrl = getImageUrl(b.imageUrl);
    });
  }

  // Thư viện ảnh photoGallery
  if (Array.isArray(article.photoGallery)) {
    article.photoGallery.forEach((item: any) => {
      if (item && typeof item.imageUrl === 'string') {
        item.imageUrl = getImageUrl(item.imageUrl);
      }
      if (item && typeof item.image === 'string') {
        item.image = getImageUrl(item.image);
      }
    });
  }

  // Khối từ khóa / thẻ đính kèm keywords
  if (Array.isArray(article.keywords)) {
    article.keywords.forEach((kw: any) => {
      if (kw && typeof kw.imageUrl === 'string') {
        kw.imageUrl = getImageUrl(kw.imageUrl);
      }
    });
  }

  // Các phân đoạn nội dung sections & cards
  if (Array.isArray(article.sections)) {
    article.sections.forEach((sec: any) => {
      if (sec && typeof sec.bgImage === 'string') sec.bgImage = getImageUrl(sec.bgImage);
      if (sec && typeof sec.coverImage === 'string') sec.coverImage = getImageUrl(sec.coverImage);
      if (sec && typeof sec.imageUrl === 'string') sec.imageUrl = getImageUrl(sec.imageUrl);
      if (Array.isArray(sec.cards)) {
        sec.cards.forEach((c: any) => {
          if (c && typeof c.imageUrl === 'string') c.imageUrl = getImageUrl(c.imageUrl);
          if (c && typeof c.image === 'string') c.image = getImageUrl(c.image);
        });
      }
    });
  }
}

export async function POST() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file dữ liệu tong-chi-data.json' }, { status: 404 });
    }

    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const articles = JSON.parse(rawData);

    // Fetch bài viết từ WordPress Gutenberg API
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

      // Tìm bài viết tương ứng trong dữ liệu nội bộ
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

    // Chuẩn hóa toàn bộ URL hình ảnh tĩnh trong tất cả bài viết trước khi lưu
    articles.forEach((article: any) => {
      normalizeArticleImages(article);
    });

    // Lưu lại file JSON
    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      count: updatedCount,
      updatedTitles,
      message: `Đã đồng bộ thành công ${updatedCount} bài viết từ WordPress Gutenberg và chuẩn hóa toàn bộ URL hình ảnh!`,
    });
  } catch (error: any) {
    console.error('Lỗi khi đồng bộ WordPress:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
