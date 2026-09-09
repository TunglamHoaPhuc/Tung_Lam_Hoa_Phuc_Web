import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';

const DATA_FILE = path.resolve(process.cwd(), 'src/data/posts-database.json');
const S3_KEYS_FILE = path.resolve(process.cwd(), 's3_keys.json');

function getS3Config() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  let accessKey = process.env.S3_ACCESS_KEY_ID || '';
  let secretKey = process.env.S3_SECRET_ACCESS_KEY || '';
  let bucketName = process.env.S3_BUCKET_NAME || 's2-cnv03';
  let publicBaseUrl = process.env.S3_PUBLIC_URL || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com';

  if (!secretKey && fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf-8');
    env.split('\n').forEach((l) => {
      const line = l.trim();
      if (line.startsWith('S3_ACCESS_KEY_ID=')) accessKey = line.split('=')[1].replace(/["']/g, '').trim();
      if (line.startsWith('S3_SECRET_ACCESS_KEY=')) secretKey = line.split('=')[1].replace(/["']/g, '').trim();
      if (line.startsWith('S3_BUCKET_NAME=')) bucketName = line.split('=')[1].replace(/["']/g, '').trim();
      if (line.startsWith('S3_PUBLIC_URL=')) publicBaseUrl = line.split('=')[1].replace(/["']/g, '').trim().replace(/\/$/, '');
    });
  }

  return { accessKey, secretKey, bucketName, publicBaseUrl };
}

function mapCategories(catIds: number[] = []) {
  if (catIds.includes(266)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
  if (catIds.includes(237)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  if (catIds.includes(265) || catIds.includes(230)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'dai-le-su-kien', categoryName: 'Đại Lễ Sự Kiện' };
  if (catIds.includes(239)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'tinh-do-nhan-gian', categoryName: 'Tịnh Độ Nhân Gian' };
  if (catIds.includes(233)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };

  if (catIds.includes(242)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'phap-am', categoryName: 'Pháp Âm' };
  if (catIds.includes(244)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'video', categoryName: 'Video Phật Pháp' };
  if (catIds.includes(243)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'an-pham-sach', categoryName: 'Ấn Phẩm Sách' };
  if (catIds.includes(245) || catIds.includes(240)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'bai-viet', categoryName: 'Bài Viết' };

  return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
}

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

  html = html.replace(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi, (_m, inner) => `\n\n### ${inner.replace(/<[^>]+>/g, '').trim()}\n\n`);
  html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, bqInner) => {
    const clean = bqInner.replace(/<[^>]+>/g, '').trim();
    return `\n\n> ${clean}\n\n`;
  });
  html = html.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_m, figInner) => {
    const srcMatch = figInner.match(/src=["']([^"']+)["']/i);
    const altMatch = figInner.match(/alt=["']([^"']*)["']/i);
    return srcMatch ? `\n\n![${altMatch ? altMatch[1] : ''}](${srcMatch[1]})\n\n` : '';
  });
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');
  html = html.replace(/<p[^>]*>(.*?)<\/p>/gi, (_m, pText) => `\n\n${pText.replace(/<[^>]+>/g, '').trim()}\n\n`);
  html = html.replace(/<[^>]+>/g, '');
  return html.replace(/\n{3,}/g, '\n\n').trim();
}

export async function POST() {
  try {
    const s3Config = getS3Config();
    const s3 = new S3Client({
      endpoint: 'https://s3.us-east-005.backblazeb2.com',
      region: 'us-east-005',
      credentials: { accessKeyId: s3Config.accessKey, secretAccessKey: s3Config.secretKey },
      forcePathStyle: true,
    });

    let page = 1;
    let allWpPosts: any[] = [];
    let hasMore = true;

    while (hasMore && page <= 10) {
      const res = await fetch(`https://tunglamhoaphuc.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=true`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
      });
      if (!res.ok) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      allWpPosts.push(...data);
      if (data.length < 100) break;
      page++;
    }

    if (allWpPosts.length === 0) {
      return NextResponse.json({ success: false, error: 'Không lấy được bài viết từ WordPress' }, { status: 502 });
    }

    let currentPosts: any[] = [];
    if (fs.existsSync(DATA_FILE)) {
      currentPosts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }

    const postMap = new Map();
    currentPosts.forEach((p) => postMap.set(p.wpPostId ? `wp-${p.wpPostId}` : (p.slug || p.id), p));

    let s3CopiedCount = 0;
    const s3KeySet = new Set<string>(fs.existsSync(S3_KEYS_FILE) ? JSON.parse(fs.readFileSync(S3_KEYS_FILE, 'utf-8')) : []);

    for (const wp of allWpPosts) {
      const wpId = wp.id;
      const wpSlug = wp.slug || `bai-viet-${wpId}`;
      const wpTitle = (wp.title?.rendered || '')
        .replace(/&#8211;/g, '–')
        .replace(/&#8217;/g, '’')
        .replace(/&amp;/g, '&')
        .trim();

      const categoryMapping = mapCategories(wp.categories || []);
      const rawFeaturedUrl = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      let finalBannerUrl = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

      if (rawFeaturedUrl) {
        const match = rawFeaturedUrl.match(/tunglamhoaphuc-com\/wp-content\/uploads\/(.+)$/);
        if (match) {
          const sourceKey = `tunglamhoaphuc-com/wp-content/uploads/${match[1]}`;
          const cleanFileName = (sourceKey.split('/').pop() || 'image.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
          const targetKey = `tunglamhoaphuc2/03-dong-chay-hoang-phap/${categoryMapping.subCategory}/${cleanFileName}`;
          finalBannerUrl = `${s3Config.publicBaseUrl}/${targetKey}`;

          if (!s3KeySet.has(targetKey)) {
            try {
              await s3.send(new CopyObjectCommand({
                Bucket: s3Config.bucketName,
                CopySource: `${s3Config.bucketName}/${encodeURIComponent(sourceKey).replace(/%2F/g, '/')}`,
                Key: targetKey,
              }));
              s3KeySet.add(targetKey);
              s3CopiedCount++;
            } catch {
              finalBannerUrl = `${s3Config.publicBaseUrl}/${sourceKey}`;
            }
          }
        } else {
          finalBannerUrl = rawFeaturedUrl;
        }
      }

      const lookupKey = `wp-${wpId}`;
      const existing = postMap.get(lookupKey) || postMap.get(wpSlug);

      postMap.set(lookupKey, {
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
        bannerUrl: finalBannerUrl,
        thumbnailPosition: existing?.thumbnailPosition || 'center 50%',
        bannerPosition: existing?.bannerPosition || 'center 50%',
        summary: (wp.excerpt?.rendered || '').replace(/<[^>]+>/g, '').replace(/&#8211;/g, '–').replace(/&amp;/g, '&').trim() || existing?.summary || 'Tóm tắt bài viết...',
        content: cleanWpHtml(wp.content?.rendered || '') || existing?.content || '',
        keywords: existing?.keywords || [],
        photoGallery: existing?.photoGallery || [],
      });
    }

    const finalArray = Array.from(postMap.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(finalArray, null, 2), 'utf-8');
    fs.writeFileSync(S3_KEYS_FILE, JSON.stringify(Array.from(s3KeySet), null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      totalPosts: finalArray.length,
      syncedWpPosts: allWpPosts.length,
      newS3ImagesCopied: s3CopiedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
