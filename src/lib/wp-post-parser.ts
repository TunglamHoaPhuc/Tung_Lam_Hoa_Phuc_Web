import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import sharp from 'sharp';

// Cấu hình S3 chuẩn
const S3_BUCKET = process.env.S3_BUCKET_NAME || 's2-cnv03';
const S3_REGION = process.env.S3_REGION || 'us-east-005';
const S3_ENDPOINT = (process.env.S3_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com').replace(/\/+$/, '');
const S3_ACCESS_KEY = (process.env.S3_ACCESS_KEY_ID || '005bc25330e1c1f0000000029').replace(/["']/g, '').trim();
const S3_SECRET_KEY = (process.env.S3_SECRET_ACCESS_KEY || 'K005/I+vUZ8TcuI2ww8TLeRPtsVzEaA').replace(/["']/g, '').trim();
const S3_PUBLIC_BASE = (process.env.S3_PUBLIC_URL || `https://${S3_BUCKET}.s3.${S3_REGION}.backblazeb2.com`).replace(/\/+$/, '');

export interface ExtractedPhoto {
  imageUrl: string;
  title: string;
  caption?: string;
  noiDung?: string;
  isInline?: boolean;
}

export interface ParsePostResult {
  photoGallery: ExtractedPhoto[];
  cleanedContent: string;
  trailingImageCount: number;
  inlineImageCount: number;
  featuredImageUrl?: string;
}

/**
 * Bóc tách toàn bộ ảnh trong nội dung Gutenberg WordPress:
 * 1. Nhận diện các ảnh ở cuối bài viết (trailing figures) -> đưa vào photoGallery và gỡ khỏi nội dung bài viết.
 * 2. Nhận diện các ảnh ở giữa bài viết (inline figures) -> giữ nguyên trong nội dung bài viết và đồng thời đưa vào photoGallery.
 */
export function parseGutenbergPostContent(rawHtml: string = '', postTitle: string = ''): ParsePostResult {
  if (!rawHtml) {
    return { photoGallery: [], cleanedContent: '', trailingImageCount: 0, inlineImageCount: 0 };
  }

  // 1. Quét tất cả thẻ <figure> và <img> trong HTML
  const figureRegex = /<figure[^>]*>([\s\S]*?)<\/figure>/gi;
  let match: RegExpExecArray | null;
  const figures: Array<{
    fullTag: string;
    src: string;
    alt: string;
    caption: string;
    index: number;
    endIndex: number;
  }> = [];

  while ((match = figureRegex.exec(rawHtml)) !== null) {
    const figContent = match[1];
    const srcMatch = figContent.match(/src=["']([^"']+)["']/i);
    const altMatch = figContent.match(/alt=["']([^"']*)["']/i);
    const capMatch = figContent.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);

    if (srcMatch) {
      figures.push({
        fullTag: match[0],
        src: srcMatch[1],
        alt: altMatch ? altMatch[1].trim() : '',
        caption: capMatch ? capMatch[1].replace(/<[^>]+>/g, '').trim() : '',
        index: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // Quét thêm thẻ <img> đơn lẻ không nằm trong <figure>
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>/gi;
  while ((match = imgRegex.exec(rawHtml)) !== null) {
    const src = match[1];
    const mIndex = match.index;
    const isInsideFigure = figures.some((f) => mIndex >= f.index && mIndex <= f.endIndex);
    if (!isInsideFigure && src) {
      const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
      figures.push({
        fullTag: match[0],
        src,
        alt: altMatch ? altMatch[1].trim() : '',
        caption: '',
        index: mIndex,
        endIndex: mIndex + match[0].length,
      });
    }
  }

  // Sắp xếp theo thứ tự xuất hiện trong bài viết
  figures.sort((a, b) => a.index - b.index);

  // 2. Xác định ranh giới ảnh cuối bài (trailing figures)
  // Quét ngược từ cuối bài: nếu từ một figure đến cuối bài chỉ có khoảng trắng hoặc thẻ đóng, đó là trailing figure
  let trailingStartIndex = rawHtml.length;

  for (let i = figures.length - 1; i >= 0; i--) {
    const f = figures[i];
    const textBetween = rawHtml.slice(f.endIndex, trailingStartIndex).replace(/<[^>]+>/g, '').trim();
    if (textBetween.length < 5) {
      trailingStartIndex = f.index;
    } else {
      break;
    }
  }

  const trailingFigures = figures.filter((f) => f.index >= trailingStartIndex);
  const inlineFigures = figures.filter((f) => f.index < trailingStartIndex);

  // 3. Xây dựng mảng photoGallery đầy đủ
  const photoGallery: ExtractedPhoto[] = figures.map((f, idx) => {
    const title = f.caption || (postTitle ? `${postTitle} - Ảnh #${idx + 1}` : `Ảnh tư liệu #${idx + 1}`);
    return {
      imageUrl: f.src,
      title,
      caption: f.caption || undefined,
      noiDung: f.caption || undefined,
      isInline: f.index < trailingStartIndex,
    };
  });

  // 4. Nội dung bài viết sạch:
  // Cắt bỏ toàn bộ phần ảnh xếp chồng ở cuối bài (từ trailingStartIndex)
  let cleanedHtml = rawHtml.slice(0, trailingStartIndex).trim();

  // Chuẩn hóa định dạng văn bản cho bài viết
  cleanedHtml = cleanRemainingHtml(cleanedHtml);

  return {
    photoGallery,
    cleanedContent: cleanedHtml,
    trailingImageCount: trailingFigures.length,
    inlineImageCount: inlineFigures.length,
    featuredImageUrl: figures.length > 0 ? figures[0].src : undefined,
  };
}

/**
 * Làm sạch HTML còn lại của bài viết thành Markdown / HTML thanh thoát
 */
function cleanRemainingHtml(html: string): string {
  if (!html) return '';

  let cleaned = html
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC');

  // Chuyển đổi các tiêu đề
  cleaned = cleaned.replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, (_m, inner) => `\n\n### ${inner.replace(/<[^>]+>/g, '').trim()}\n\n`);

  // Chuyển blockquote
  cleaned = cleaned.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, bqInner) => {
    const clean = bqInner.replace(/<[^>]+>/g, '').trim();
    return `\n\n> ${clean}\n\n`;
  });

  // Chuyển các figure inline còn lại thành markdown image
  cleaned = cleaned.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_m, figInner) => {
    const srcMatch = figInner.match(/src=["']([^"']+)["']/i);
    const altMatch = figInner.match(/alt=["']([^"']*)["']/i);
    const capMatch = figInner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const cap = capMatch ? capMatch[1].replace(/<[^>]+>/g, '').trim() : (altMatch ? altMatch[1].trim() : '');
    return srcMatch ? `\n\n![${cap}](${srcMatch[1]})\n\n` : '';
  });

  cleaned = cleaned.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');
  cleaned = cleaned.replace(/<p[^>]*>(.*?)<\/p>/gi, (_m, pText) => `\n\n${pText.replace(/<[^>]+>/g, '').trim()}\n\n`);
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Tự động đồng bộ ảnh từ WordPress sang kho S3 tương ứng
 * Ví dụ: https://admin.tunglamhoaphuc.com/wp-content/uploads/2026/09/48.3.jpg
 * -> S3: tunglamhoaphuc2/03-dong-chay-hoang-phap/cong-tu/48.3.webp
 */
export async function mirrorWpImageToS3(
  sourceUrl: string,
  subCategory: string = 'cong-tu',
  categoryRoot: string = '03-dong-chay-hoang-phap'
): Promise<string> {
  if (!sourceUrl || !sourceUrl.includes('wp-content/uploads')) {
    return sourceUrl;
  }

  // Nếu URL đã ở S3 thì không cần chuyển
  if (sourceUrl.includes('backblazeb2.com') || sourceUrl.includes('tunglamhoaphuc2')) {
    return sourceUrl;
  }

  try {
    const s3Client = new S3Client({
      endpoint: S3_ENDPOINT,
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
      },
      forcePathStyle: true,
    });

    // Lấy tên file gốc
    const urlObj = new URL(sourceUrl);
    const rawFileName = path.basename(urlObj.pathname);
    const baseName = rawFileName
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9._-]/g, '_');

    const s3Key = `tunglamhoaphuc2/${categoryRoot}/${subCategory}/${baseName}.webp`;
    const targetUrl = `${S3_PUBLIC_BASE}/${s3Key}`;

    // Tải ảnh từ WordPress
    const res = await fetch(sourceUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    if (!res.ok) return sourceUrl;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Tối ưu nén sang WebP 1920px
    const optimized = await sharp(buffer)
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84 })
      .toBuffer();

    // Đẩy lên S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: optimized,
        ContentType: 'image/webp',
      })
    );

    return targetUrl;
  } catch (err) {
    console.warn('mirrorWpImageToS3 fallback to source:', err);
    return sourceUrl;
  }
}
