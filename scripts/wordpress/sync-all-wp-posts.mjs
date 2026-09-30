import { S3Client, CopyObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// 1. Config & Credentials
const envPath = path.resolve('.env.local');
const env = fs.readFileSync(envPath, 'utf-8');
let accessKey = '', secretKey = '', bucketName = 's2-cnv03', publicBaseUrl = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com';

env.split('\n').forEach((l) => {
  const line = l.trim();
  if (line.startsWith('S3_ACCESS_KEY_ID=')) accessKey = line.split('=')[1].replace(/["']/g, '').trim();
  if (line.startsWith('S3_SECRET_ACCESS_KEY=')) secretKey = line.split('=')[1].replace(/["']/g, '').trim();
  if (line.startsWith('S3_BUCKET_NAME=')) bucketName = line.split('=')[1].replace(/["']/g, '').trim();
  if (line.startsWith('S3_PUBLIC_URL=')) publicBaseUrl = line.split('=')[1].replace(/["']/g, '').trim().replace(/\/$/, '');
});

const s3 = new S3Client({
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  region: 'us-east-005',
  credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  forcePathStyle: true,
});

// Category mapping
// 233 = DÒNG CHẢY HOẰNG PHÁP
// 266 = CỘNG TU
// 265 = ĐẠI LỄ & SỰ KIỆN
// 237 = KHÓA LỄ TRUYỀN THỐNG
// 239 = TỊNH ĐỘ NHÂN GIAN
// 230 = Các đại lễ lớn
// 240 = TRÍ TUỆ PHẬT PHÁP (245: Bài Viết, 242: Pháp Âm, 244: Video, 243: Sách Phật)
function mapCategories(catIds = []) {
  if (catIds.includes(266)) {
    return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
  }
  if (catIds.includes(237)) {
    return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  }
  if (catIds.includes(265) || catIds.includes(230)) {
    return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'dai-le-su-kien', categoryName: 'Đại Lễ Sự Kiện' };
  }
  if (catIds.includes(239)) {
    return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'tinh-do-nhan-gian', categoryName: 'Tịnh Độ Nhân Gian' };
  }
  if (catIds.includes(233)) {
    return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
  }

  // Trí Tuệ Phật Pháp
  if (catIds.includes(242)) {
    return { mainCategory: 'tri-tue-phat-phap', subCategory: 'phap-am', categoryName: 'Pháp Âm' };
  }
  if (catIds.includes(244)) {
    return { mainCategory: 'tri-tue-phat-phap', subCategory: 'video', categoryName: 'Video Phật Pháp' };
  }
  if (catIds.includes(243)) {
    return { mainCategory: 'tri-tue-phat-phap', subCategory: 'an-pham-sach', categoryName: 'Ấn Phẩm Sách' };
  }
  if (catIds.includes(245) || catIds.includes(240)) {
    return { mainCategory: 'tri-tue-phat-phap', subCategory: 'bai-viet', categoryName: 'Bài Viết' };
  }

  // Mặc định cho các bài còn lại
  return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
}

// Convert WordPress HTML to clean Markdown
function cleanWpHtml(rawHtml = '') {
  if (!rawHtml) return '';
  let html = rawHtml
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&#8230;/g, '...')
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFC');

  // Headings
  html = html.replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, (_m, inner) => {
    const cleanText = inner.replace(/<[^>]+>/g, '').replace(/^\*\*|\*\*$/g, '').trim();
    return `\n\n### ${cleanText}\n\n`;
  });

  // Blockquotes
  html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, bqInner) => {
    const clean = bqInner
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/^[“"”\s]+|[“"”\s]+$/g, '');
    const lines = clean.split('\n').map((l) => l.trim()).filter(Boolean);
    return `\n\n${lines.map((l) => `> ${l}`).join('\n')}\n\n`;
  });

  // Figures
  html = html.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_m, figInner) => {
    const srcMatch = figInner.match(/src=["']([^"']+)["']/i);
    const altMatch = figInner.match(/alt=["']([^"']*)["']/i);
    const capMatch = figInner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const src = srcMatch ? srcMatch[1] : '';
    const caption = capMatch ? capMatch[1].replace(/<[^>]+>/g, '').trim() : (altMatch ? altMatch[1].trim() : '');
    return src ? `\n\n![${caption}](${src})\n\n` : '';
  });

  // Standalone images
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '\n\n![$2]($1)\n\n');
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');

  // Paragraphs
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, (_m, pText) => {
    const cleanP = pText.replace(/<br\s*\/?>/gi, '\n').replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '').trim();
    return cleanP ? `\n\n${cleanP}\n\n` : '';
  });

  // Format tags
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
      return true;
    })
    .join('\n');

  return cleanedLines.replace(/\n{3,}/g, '\n\n').trim();
}

// S3 Cache to avoid copying the same image twice
const copiedS3KeysMap = new Map();

// Helper to extract S3 key from WP upload URL
function extractSourceS3Key(url = '') {
  if (!url) return null;
  // Match tunglamhoaphuc-com/wp-content/uploads/...
  const match = url.match(/tunglamhoaphuc-com\/wp-content\/uploads\/(.+)$/);
  if (match) {
    return `tunglamhoaphuc-com/wp-content/uploads/${match[1]}`;
  }
  return null;
}

// Perform S3 Server-side Copy
async function copyImageToCategorizedS3(sourceUrl, subFolder) {
  const sourceKey = extractSourceS3Key(sourceUrl);
  if (!sourceKey) return sourceUrl; // Not on our S3 bucket

  if (copiedS3KeysMap.has(sourceKey)) {
    return copiedS3KeysMap.get(sourceKey);
  }

  // Filename
  const rawFileName = sourceKey.split('/').pop() || 'image.jpg';
  const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const targetKey = `tunglamhoaphuc2/03-dong-chay-hoang-phap/${subFolder}/${cleanFileName}`;
  const targetUrl = `${publicBaseUrl}/${targetKey}`;

  try {
    const copyCmd = new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `${bucketName}/${encodeURIComponent(sourceKey).replace(/%2F/g, '/')}`,
      Key: targetKey,
    });
    await s3.send(copyCmd);
    copiedS3KeysMap.set(sourceKey, targetUrl);
    return targetUrl;
  } catch (err) {
    // If source not found or copy fails, fallback to direct S3 URL
    const fallbackDirect = `${publicBaseUrl}/${sourceKey}`;
    copiedS3KeysMap.set(sourceKey, fallbackDirect);
    return fallbackDirect;
  }
}

// Main sync runner
async function syncAllPosts() {
  console.log('🚀 Bắt đầu quá trình đồng bộ toàn bộ bài viết từ tunglamhoaphuc.com...');
  
  let page = 1;
  let allWpPosts = [];
  let hasMore = true;

  while (hasMore) {
    console.log(`📥 Đang tải trang ${page} (100 bài/trang)...`);
    try {
      const res = await fetch(`https://tunglamhoaphuc.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=true`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });
      if (!res.ok) {
        console.log(`Dừng tải tại trang ${page}: status ${res.status}`);
        hasMore = false;
        break;
      }
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        hasMore = false;
        break;
      }
      allWpPosts.push(...data);
      console.log(` -> Đã nạp thành công ${data.length} bài. Tổng hiện tại: ${allWpPosts.length}`);
      if (data.length < 100) {
        hasMore = false;
        break;
      }
      page++;
    } catch (err) {
      console.error(`Lỗi khi fetch trang ${page}:`, err.message);
      hasMore = false;
    }
  }

  console.log(`\n🎉 Tổng số bài viết WordPress lấy được: ${allWpPosts.length}`);

  // Load existing database
  const postsDbPath = path.resolve('src/data/posts-database.json');
  let currentPosts = [];
  if (fs.existsSync(postsDbPath)) {
    currentPosts = JSON.parse(fs.readFileSync(postsDbPath, 'utf-8'));
  }

  // Load s3_keys.json
  const s3KeysPath = path.resolve('s3_keys.json');
  let s3Keys = [];
  if (fs.existsSync(s3KeysPath)) {
    s3Keys = JSON.parse(fs.readFileSync(s3KeysPath, 'utf-8'));
  }
  const s3KeySet = new Set(s3Keys);

  console.log(`📊 Số bài viết hiện có trong posts-database.json: ${currentPosts.length}`);

  const updatedPostsMap = new Map();
  // Index existing by wpPostId and slug
  currentPosts.forEach((p) => {
    const key = p.wpPostId ? `wp-${p.wpPostId}` : (p.slug || p.id);
    updatedPostsMap.set(key, p);
  });

  let processedCount = 0;
  let s3CopiedCount = 0;

  for (const wp of allWpPosts) {
    processedCount++;
    const wpId = wp.id;
    const wpSlug = wp.slug || `bai-viet-${wpId}`;
    const wpTitle = (wp.title?.rendered || '')
      .replace(/&#8211;/g, '–')
      .replace(/&#8217;/g, '’')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();

    const categoryMapping = mapCategories(wp.categories || []);
    const rawContent = wp.content?.rendered || '';
    let cleanedContent = cleanWpHtml(rawContent);

    // Featured Image
    const rawFeaturedUrl = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    let finalBannerUrl = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

    if (rawFeaturedUrl) {
      finalBannerUrl = await copyImageToCategorizedS3(rawFeaturedUrl, categoryMapping.subCategory);
      if (finalBannerUrl.includes('tunglamhoaphuc2/')) {
        const newKey = finalBannerUrl.replace(`${publicBaseUrl}/`, '');
        if (!s3KeySet.has(newKey)) {
          s3KeySet.add(newKey);
          s3CopiedCount++;
        }
      }
    }

    // Excerpt
    const cleanExcerpt = (wp.excerpt?.rendered || '')
      .replace(/<[^>]+>/g, '')
      .replace(/&#8211;/g, '–')
      .replace(/&#8230;/g, '...')
      .replace(/&amp;/g, '&')
      .trim();

    // Check existing
    const lookupKey = `wp-${wpId}`;
    const existing = updatedPostsMap.get(lookupKey) || updatedPostsMap.get(wpSlug);

    const postRecord = {
      ...(existing || {}),
      id: existing?.id || `post-${wpId}`,
      wpPostId: wpId,
      slug: wpSlug,
      title: wpTitle,
      subtitle: existing?.subtitle || 'Tùng Lâm Hòa Phúc',
      mainCategory: categoryMapping.mainCategory,
      subCategory: categoryMapping.subCategory,
      categoryName: categoryMapping.categoryName,
      author: existing?.author || 'Ban Văn Hóa Tùng Lâm',
      publishedDate: wp.date ? wp.date.split('T')[0] : new Date().toISOString().split('T')[0],
      status: 'published',
      viewsCount: existing?.viewsCount || 0,
      thumbnailUrl: finalBannerUrl,
      thumbnailPosition: existing?.thumbnailPosition || 'center 50%',
      bannerUrl: finalBannerUrl,
      bannerPosition: existing?.bannerPosition || 'center 50%',
      summary: cleanExcerpt || existing?.summary || 'Tóm tắt bài viết...',
      content: cleanedContent || existing?.content || '',
      keywords: existing?.keywords || [],
      videoBlock: existing?.videoBlock,
      photoGallery: existing?.photoGallery || [],
      sourceBook: existing?.sourceBook,
      previousEditions: existing?.previousEditions || [],
      upcomingEvents: existing?.upcomingEvents || [],
    };

    updatedPostsMap.set(lookupKey, postRecord);

    if (processedCount % 50 === 0 || processedCount === allWpPosts.length) {
      console.log(`  -> Đã xử lý ${processedCount}/${allWpPosts.length} bài viết...`);
    }
  }

  // Convert map back to array
  const finalPostsArray = Array.from(updatedPostsMap.values());
  console.log(`\n💾 Đang ghi cơ sở dữ liệu posts-database.json (${finalPostsArray.length} bài viết)...`);
  fs.writeFileSync(postsDbPath, JSON.stringify(finalPostsArray, null, 2), 'utf-8');

  // Update s3_keys.json
  const finalS3Keys = Array.from(s3KeySet);
  console.log(`📁 Đang cập nhật s3_keys.json (Tổng cộng: ${finalS3Keys.length} file)...`);
  fs.writeFileSync(s3KeysPath, JSON.stringify(finalS3Keys, null, 2), 'utf-8');

  // Summary breakdown
  const summary = {};
  finalPostsArray.forEach((p) => {
    const key = `${p.mainCategory} / ${p.subCategory}`;
    summary[key] = (summary[key] || 0) + 1;
  });

  console.log('\n================ THỐNG KÊ HOÀN TẤT ================');
  console.log('Tổng số bài viết hiện tại:', finalPostsArray.length);
  console.log('Phân bố theo chuyên mục:', summary);
  console.log('Số ảnh S3 mới được thêm vào danh mục:', s3CopiedCount);
  console.log('====================================================\n');
}

syncAllPosts().catch(console.error);
