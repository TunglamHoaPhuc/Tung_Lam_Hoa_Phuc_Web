import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { getImageUrl } from '@/utils/image';
import { formatWpDate, updateWpPostFields } from '@/lib/wp-admin-client';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';

const DATA_FILE = path.resolve(process.cwd(), 'src/data/tong-chi-data.json');
const DB_CONFIG = {
  fileName: 'tong-chi-data.json',
  localRelativePath: 'src/data/tong-chi-data.json',
  s3Key: 'tunglamhoaphuc2/database/tong-chi-data.json',
  defaultData: [] as any[],
};

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

async function handleSyncOrUpdate(req: NextRequest) {
  try {
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      // Body rỗng -> Chế độ đồng bộ từ WordPress về hệ thống
    }

    // Đọc danh sách bài viết an toàn (kết hợp cả Serverless S3 và File cục bộ)
    let articles: any[] = await loadServerlessJsonAsync(DB_CONFIG);
    if (!articles || articles.length === 0) {
      if (fs.existsSync(DATA_FILE)) {
        try {
          articles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        } catch {
          articles = [];
        }
      }
    }

    // =========================================================================
    // 🌟 TRƯỜNG HỢP 1: CẬP NHẬT NGÀY ĐĂNG BÀI VIẾT TỪ ADMIN SANG WORDPRESS & DB
    // =========================================================================
    if (body && (body.action === 'update-date' || body.date || body.publishedAt)) {
      const targetId = body.id !== undefined && body.id !== null ? String(body.id) : null;
      const targetWpId = body.wpPostId !== undefined && body.wpPostId !== null ? String(body.wpPostId) : null;
      const rawDate = body.date || body.publishedAt;

      if (!targetId && !targetWpId) {
        return NextResponse.json({ success: false, error: 'Thiếu id hoặc wpPostId của bài viết' }, { status: 400 });
      }

      if (!rawDate) {
        return NextResponse.json({ success: false, error: 'Thiếu thông tin ngày đăng (date hoặc publishedAt)' }, { status: 400 });
      }

      const matchIdx = articles.findIndex((a: any) => {
        if (targetWpId && a.wpPostId && String(a.wpPostId) === targetWpId) return true;
        if (targetId && String(a.id) === targetId) return true;
        return false;
      });

      if (matchIdx === -1) {
        return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết trong cơ sở dữ liệu' }, { status: 404 });
      }

      const target = articles[matchIdx];
      const formattedWpDate = formatWpDate(rawDate);
      let isoDate = new Date(formattedWpDate).toISOString();
      if (isNaN(new Date(isoDate).getTime())) {
        isoDate = new Date().toISOString();
      }

      // Cập nhật trường ngày trong bài viết nội bộ
      target.publishedAt = isoDate;
      target.updatedAt = new Date().toISOString();

      let syncedToWp = false;
      let wpError: string | undefined = undefined;

      const effectiveWpId = targetWpId || target.wpPostId;
      if (effectiveWpId && Number(effectiveWpId) > 0) {
        const wpUpdateRes = await updateWpPostFields(
          Number(effectiveWpId),
          { date: formattedWpDate },
          'tong-chi'
        );
        syncedToWp = wpUpdateRes.success;
        if (!wpUpdateRes.success) {
          wpError = wpUpdateRes.error;
          console.warn(`[sync-wp] Cảnh báo cập nhật ngày lên WP #${effectiveWpId}:`, wpError);
        }
      }

      // Lưu lại dữ liệu an toàn (cả local file và S3 serverless)
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf-8');
      } catch (fsErr: any) {
        console.warn('[sync-wp] Ghi file cục bộ thất bại, tiếp tục lưu S3:', fsErr.message);
      }
      await saveServerlessJson(DB_CONFIG, articles);

      try {
        revalidatePath('/', 'page');
        revalidatePath('/tong-chi-tu-hoc', 'page');
        if (target.slug) {
          revalidatePath(`/tong-chi-tu-hoc/${target.slug}`, 'page');
        }
      } catch (e) {
        console.warn('[revalidatePath error]', e);
      }

      return NextResponse.json({
        success: true,
        message: syncedToWp
          ? `Đã cập nhật ngày đăng thành công trên cả Admin và WordPress (#${effectiveWpId})!`
          : `Đã lưu ngày đăng vào hệ thống nội bộ${wpError ? ` (Cảnh báo WordPress: ${wpError})` : ''}`,
        publishedAt: isoDate,
        wpDate: formattedWpDate,
        syncedToWp,
        post: target,
      });
    }

    // =========================================================================
    // 🌟 TRƯỜNG HỢP 2: ĐỒNG BỘ TOÀN BỘ NỘI DUNG & NGÀY ĐĂNG TỪ WORDPRESS VỀ ADMIN
    // =========================================================================
    let wpRes: Response;
    try {
      wpRes = await fetch('https://admin.tunglamhoaphuc.com/wp-json/wp/v2/tong-chi?per_page=100', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      });
    } catch (netErr: any) {
      console.error('[sync-wp] Lỗi kết nối WordPress REST API:', netErr.message);
      return NextResponse.json(
        {
          success: false,
          error: `Không thể kết nối đến máy chủ WordPress (timeout hoặc lỗi mạng): ${netErr.message}`,
        },
        { status: 504 }
      );
    }

    if (!wpRes.ok) {
      const errText = await wpRes.text().catch(() => '');
      return NextResponse.json(
        {
          success: false,
          error: `WordPress REST API phản hồi mã lỗi ${wpRes.status}: ${errText.slice(0, 200)}`,
        },
        { status: 502 }
      );
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
        target.wpPostId = wpId; // Cố định wpPostId vĩnh viễn
        if (cleanedContent && cleanedContent.length > 10) {
          target.content = cleanedContent;
        }
        if (excerpt) target.excerpt = excerpt;
        if (wpTitle) target.title = wpTitle;
        if (acf.tieu_de_phu || extractedSubtitle) {
          target.subtitle = acf.tieu_de_phu || extractedSubtitle || target.subtitle;
        }

        // 🌟 Đồng bộ ngày đăng từ WordPress về publishedAt
        if (wpPost.date) {
          try {
            target.publishedAt = new Date(wpPost.date).toISOString();
          } catch {
            target.publishedAt = wpPost.date;
          }
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

    // Lưu lại file JSON cả cục bộ và S3
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf-8');
    } catch (fsErr: any) {
      console.warn('[sync-wp] Ghi file cục bộ thất bại, tiếp tục lưu S3:', fsErr.message);
    }
    await saveServerlessJson(DB_CONFIG, articles);

    // Revalidate cache Next.js
    try {
      revalidatePath('/', 'page');
      revalidatePath('/tong-chi-tu-hoc', 'page');
    } catch (e) {
      console.warn('[revalidatePath error]', e);
    }

    return NextResponse.json({
      success: true,
      count: updatedCount,
      updatedTitles,
      message: `Đã đồng bộ thành công ${updatedCount} bài viết và ngày đăng từ WordPress Gutenberg!`,
    });
  } catch (error: any) {
    console.error('Lỗi khi đồng bộ WordPress:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return handleSyncOrUpdate(req);
}

export async function PUT(req: NextRequest) {
  return handleSyncOrUpdate(req);
}
