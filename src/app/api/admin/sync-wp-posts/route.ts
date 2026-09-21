import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';
import { loadServerlessJson, saveServerlessJson } from '@/lib/serverless-db';

const DB_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as any[],
};

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
  // WordPress Admin Categories (admin.tunglamhoaphuc.com)
  if (catIds.includes(2)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  if (catIds.includes(5)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'bai-viet', categoryName: 'Bài Viết' };
  if (catIds.includes(1)) return { mainCategory: 'tong-chi-tu-hoc', subCategory: 'cong-tu', categoryName: 'Tông Chỉ Tu Học' };
  if (catIds.includes(3)) return { mainCategory: 'vu-tru-phat-giao', subCategory: 'cong-tu', categoryName: 'Vũ Trụ Phật Giáo' };

  // Legacy WordPress Categories (tunglamhoaphuc.com)
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

    let allWpPosts: any[] = [];

    // 1. Quét từ WordPress Admin CMS đang hoạt động (admin.tunglamhoaphuc.com)
    try {
      const adminRes = await fetch('https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts?per_page=100&_embed=true', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
      });
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        if (Array.isArray(adminData)) {
          allWpPosts.push(...adminData);
        }
      }
    } catch (e) {
      console.warn('Không thể kết nối admin.tunglamhoaphuc.com:', e);
    }

    // 2. Quét từ WordPress công khai (tunglamhoaphuc.com)
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= 10) {
      const res = await fetch(`https://tunglamhoaphuc.com/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=true`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
      });
      if (!res.ok) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      // Tránh trùng ID đã có từ admin
      for (const p of data) {
        if (!allWpPosts.some((x) => x.id === p.id)) {
          allWpPosts.push(p);
        }
      }
      if (data.length < 100) break;
      page++;
    }

    if (allWpPosts.length === 0) {
      return NextResponse.json({ success: false, error: 'Không lấy được bài viết từ WordPress' }, { status: 502 });
    }

    let currentPosts: any[] = loadServerlessJson(DB_CONFIG);

    const postMap = new Map();
    currentPosts.forEach((p) => postMap.set(p.wpPostId ? `wp-${p.wpPostId}` : (p.slug || p.id), p));

    // 🛡️ Chống trùng ID: nếu bài viết đã tồn tại dưới một ID/wpPostId khác (sync chéo
    // giữa admin.tunglamhoaphuc.com và tunglamhoaphuc.com), hãy gộp thay vì tạo bản ghi mới.
    const postIds = new Set(currentPosts.map((p) => p.id));
    const claimedWpIds = new Set(currentPosts.filter((p) => p.wpPostId).map((p) => p.wpPostId));

    let s3CopiedCount = 0;
    const s3KeysPath = path.resolve(process.cwd(), 's3_keys.json');
    const s3KeySet = new Set<string>(fs.existsSync(s3KeysPath) ? JSON.parse(fs.readFileSync(s3KeysPath, 'utf-8')) : []);

    // 🛡️ Chống trùng lặp giữa 2 nguồn WP: cùng 1 bài viết có thể được trả về bởi cả
    // admin.tunglamhoaphuc.com và tunglamhoaphuc.com với 2 ID khác nhau nhưng cùng slug.
    const seenWpSlugs = new Set<string>();

    for (const wp of allWpPosts) {
      const wpId = wp.id;
      const wpSlug = wp.slug || `bai-viet-${wpId}`;
      const wpTitle = (wp.title?.rendered || '')
        .replace(/&#8211;/g, '–')
        .replace(/&#8217;/g, '’')
        .replace(/&amp;/g, '&')
        .trim();

      // Bỏ qua bản WP trùng slug đã xử lý ở nguồn trước đó
      if (seenWpSlugs.has(wpSlug)) continue;
      seenWpSlugs.add(wpSlug);

      const categoryMapping = mapCategories(wp.categories || []);
      let rawFeaturedUrl = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

      // Tự động dò tìm ảnh đầu tiên nếu không có featured media
      if (!rawFeaturedUrl && wp.content?.rendered) {
        const firstImgMatch = wp.content.rendered.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/i);
        if (firstImgMatch) {
          rawFeaturedUrl = firstImgMatch[1];
        }
      }

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
      let existing = postMap.get(lookupKey) || postMap.get(wpSlug);
      let existingId = existing?.id;

      // 🛡️ Bài viết đã tồn tại trong DB dưới một ID khác (VD: cùng bài viết từng được
      // sync từ 2 nguồn WP với wpPostId 504 và 29200) → tái sử dụng ID cũ, không tạo bản mới.
      if (!existingId && postIds.has(`post-${wpId}`)) {
        existing = currentPosts.find((p) => p.id === `post-${wpId}`);
        existingId = existing?.id;
      } else if (!existingId && claimedWpIds.has(wpId)) {
        const claim = currentPosts.find((p) => String(p.wpPostId) === String(wpId));
        if (claim) {
          existing = claim;
          existingId = claim.id;
        }
      }

      postMap.set(lookupKey, {
        ...(existing || {}),
        id: existingId || `post-${wpId}`,
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
    await saveServerlessJson(DB_CONFIG, finalArray);
    try {
      if (fs.existsSync(path.dirname(s3KeysPath))) {
        fs.writeFileSync(s3KeysPath, JSON.stringify(Array.from(s3KeySet), null, 2), 'utf-8');
      }
    } catch {
      // ignore on serverless
    }

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
