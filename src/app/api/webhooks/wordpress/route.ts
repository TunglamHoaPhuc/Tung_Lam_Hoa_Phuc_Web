import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getWpConfig } from '@/lib/env-config';
import { isDuplicateWebhookEvent, isRecentSyncLoop, markRecentSync, enqueueSyncTask } from '@/lib/sync-queue';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';
import { parseGutenbergPostContent } from '@/lib/wp-post-parser';
import { recordDeletedPost, isPostDeletedAsync } from '@/lib/deleted-posts';
import { decodeHtmlEntities } from '@/lib/html-entities';
import { PostRecord } from '@/app/api/admin/posts/route';

const DB_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as PostRecord[],
};

function mapWpCategory(catIds: number[] = []) {
  if (catIds.includes(2)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  if (catIds.includes(5)) return { mainCategory: 'tri-tue-phat-phap', subCategory: 'bai-viet', categoryName: 'Bài Viết' };
  if (catIds.includes(1)) return { mainCategory: 'tong-chi-tu-hoc', subCategory: 'cong-tu', categoryName: 'Tông Chỉ Tu Học' };
  if (catIds.includes(3)) return { mainCategory: 'vu-tru-phat-giao', subCategory: 'cong-tu', categoryName: 'Vũ Trụ Phật Giáo' };
  if (catIds.includes(266)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
  if (catIds.includes(237)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'khoa-le-truyen-thong', categoryName: 'Khóa Lễ Truyền Thống' };
  if (catIds.includes(265) || catIds.includes(230)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'dai-le-su-kien', categoryName: 'Đại Lễ Sự Kiện' };
  if (catIds.includes(239)) return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'tinh-do-nhan-gian', categoryName: 'Tịnh Độ Nhân Gian' };
  return { mainCategory: 'dong-chay-hoang-phap', subCategory: 'cong-tu', categoryName: 'Cộng Tu Định Kỳ' };
}

export async function POST(req: NextRequest) {
  try {
    const wpConfig = getWpConfig();
    const url = new URL(req.url);

    // 1. Xác thực Webhook Secret
    const headerSecret = req.headers.get('x-wp-webhook-secret') || req.headers.get('x-webhook-secret');
    const querySecret = url.searchParams.get('secret');
    const providedSecret = headerSecret || querySecret;

    if (!providedSecret || providedSecret !== wpConfig.webhookSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Sai mã bí mật Webhook' },
        { status: 401 }
      );
    }

    // 2. Đọc payload từ WordPress
    const body = await req.json().catch(() => ({}));
    const event = body.event || body.action || url.searchParams.get('event') || 'post_update';
    const wpId = body.post_id || body.ID || body.id || url.searchParams.get('post_id');

    if (!wpId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu post_id trong payload' },
        { status: 400 }
      );
    }

    const eventId = String(body.event_id || `${event}-${wpId}-${body.post_modified || Date.now()}`);

    // 3. Chống trùng lặp Webhook
    if (isDuplicateWebhookEvent(eventId)) {
      return NextResponse.json({
        success: true,
        message: 'Bỏ qua sự kiện trùng lặp (Idempotent)',
        eventId,
      });
    }

    // 4. Chống vòng lặp đồng bộ (Loop Prevention)
    if (isRecentSyncLoop(String(wpId), 'wordpress')) {
      return NextResponse.json({
        success: true,
        message: 'Bỏ qua sự kiện phản xạ do chính Next.js vừa gửi sang WordPress',
        wpId,
      });
    }

    markRecentSync(String(wpId), 'wordpress');

    // 5. Xử lý sự kiện XÓA bài viết (trash hoặc delete)
    if (event === 'post_trash' || event === 'post_delete' || event === 'trashed' || event === 'deleted') {
      const posts = await loadServerlessJsonAsync<PostRecord[]>(DB_CONFIG);
      const matchIdx = posts.findIndex((p) => String(p.wpPostId) === String(wpId) || p.id === `post-${wpId}`);

      if (matchIdx !== -1) {
        const deletedPost = posts[matchIdx];
        posts.splice(matchIdx, 1);
        await Promise.all([
          saveServerlessJson(DB_CONFIG, posts),
          recordDeletedPost(deletedPost.id, deletedPost.wpPostId, deletedPost.slug),
        ]);

        try {
          revalidatePath('/', 'page');
          revalidatePath('/dong-chay-hoang-phap', 'page');
          revalidatePath('/tri-tue-phat-phap', 'page');
          if (deletedPost.slug) {
            revalidatePath(`/dong-chay-hoang-phap/${deletedPost.slug}`, 'page');
          }
        } catch {}

        return NextResponse.json({
          success: true,
          message: `Đã xóa bài viết #${wpId} khỏi kho dữ liệu theo tín hiệu từ WordPress.`,
        });
      }

      await recordDeletedPost(`post-${wpId}`, wpId);
      return NextResponse.json({
        success: true,
        message: `Đã ghi nhận bài viết #${wpId} vào danh sách bài đã xóa.`,
      });
    }

    // 6. Xử lý sự kiện TẠO MỚI HOẶC CẬP NHẬT (create, update, publish)
    // Tải thông tin chi tiết bài viết từ WordPress REST API
    const wpRes = await fetch(`${wpConfig.baseUrl}/wp-json/wp/v2/posts/${wpId}?_embed=true`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Next.js Webhook Sync)' },
      cache: 'no-store',
    });

    if (!wpRes.ok) {
      // Nếu bài viết bị 404 (có thể đã bị xóa hoàn toàn trên WP)
      if (wpRes.status === 404) {
        await recordDeletedPost(`post-${wpId}`, wpId);
        return NextResponse.json({ success: true, message: `Bài viết #${wpId} không tồn tại trên WP, đã ghi nhận xóa.` });
      }

      await enqueueSyncTask('sync_from_wp', String(wpId), body, `WP REST API status ${wpRes.status}`);
      return NextResponse.json(
        { success: false, error: `Không thể tải bài viết từ WP REST API (${wpRes.status})` },
        { status: 502 }
      );
    }

    const wp = await wpRes.json();
    const wpSlug = wp.slug || `bai-viet-${wpId}`;

    if (await isPostDeletedAsync(`post-${wpId}`, wpId, wpSlug)) {
      return NextResponse.json({ success: true, message: `Bài viết #${wpId} đã bị người quản trị xóa trên Next.js, bỏ qua.` });
    }

    const cleanTitle = decodeHtmlEntities(wp.title?.rendered || '').trim();
    const parsed = parseGutenbergPostContent(wp.content?.rendered || '', cleanTitle);
    const mappedCat = mapWpCategory(wp.categories || []);

    const featuredUrl =
      wp._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      parsed.featuredImageUrl ||
      'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

    const rawWpAuthor = wp._embedded?.author?.[0]?.name;
    const author = rawWpAuthor && rawWpAuthor !== 'admin_tunglam' && rawWpAuthor !== 'admin'
      ? rawWpAuthor
      : 'Ban Văn Hóa Tùng Lâm';

    const wpPublishedDate = wp.date ? wp.date.split('T')[0] : (wp.date_gmt ? wp.date_gmt.split('T')[0] : '');

    const posts = await loadServerlessJsonAsync<PostRecord[]>(DB_CONFIG);
    const existingIdx = posts.findIndex(
      (p) => String(p.wpPostId) === String(wpId) || p.id === `post-${wpId}` || p.slug === wpSlug
    );

    const existing = existingIdx !== -1 ? posts[existingIdx] : null;

    const mergedPost: PostRecord = {
      id: existing?.id || `post-${wpId}`,
      wpPostId: wpId,
      slug: wpSlug,
      title: cleanTitle || existing?.title || 'Tiêu đề bài viết',
      subtitle: existing?.subtitle || 'Tùng Lâm Hòa Phúc',
      mainCategory: existing?.mainCategory || mappedCat.mainCategory,
      subCategory: existing?.subCategory || mappedCat.subCategory,
      categoryName: existing?.categoryName || mappedCat.categoryName,
      author,
      publishedDate: wpPublishedDate || existing?.publishedDate || new Date().toISOString().split('T')[0],
      status: wp.status === 'publish' ? 'published' : 'draft',
      viewsCount: existing?.viewsCount || 108,
      thumbnailUrl: featuredUrl || existing?.thumbnailUrl || '',
      bannerUrl: featuredUrl || existing?.bannerUrl || '',
      thumbnailPosition: existing?.thumbnailPosition || 'center 50%',
      bannerPosition: existing?.bannerPosition || 'center 50%',
      summary: (wp.excerpt?.rendered || '').replace(/<[^>]+>/g, '').trim() || existing?.summary || '',
      content: parsed.cleanedContent || existing?.content || '',
      contentHtml: wp.content?.rendered || existing?.contentHtml || '',
      keywords: existing?.keywords || [],
      sourceBook: existing?.sourceBook,
      videoBlock: existing?.videoBlock,
      featuredArticle: existing?.featuredArticle,
      photoGallery: parsed.photoGallery.length > 0 ? parsed.photoGallery : (existing?.photoGallery || []),
      previousEditions: existing?.previousEditions || [],
      upcomingEvents: existing?.upcomingEvents || [],
      wpModified: wp.modified,
    };

    if (existingIdx !== -1) {
      posts[existingIdx] = mergedPost;
    } else {
      posts.unshift(mergedPost);
    }

    await saveServerlessJson(DB_CONFIG, posts);

    // ⚡ LÀM MỚI TỨC THỜI CÁC TRANG CÔNG KHAI
    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/dong-chay-hoang-phap', 'page');
      revalidatePath('/tri-tue-phat-phap', 'page');
      revalidatePath(`/dong-chay-hoang-phap/${mergedPost.slug}`, 'page');
      revalidatePath(`/tri-tue-phat-phap/${mergedPost.slug}`, 'page');
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Đã đồng bộ bài viết #${wpId} (${mergedPost.title}) vào Next.js thành công gần thời gian thực!`,
      post: {
        id: mergedPost.id,
        wpPostId: mergedPost.wpPostId,
        slug: mergedPost.slug,
        title: mergedPost.title,
        status: mergedPost.status,
      },
    });
  } catch (err: any) {
    console.error('[webhook-wordpress] Lỗi xử lý webhook:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi server xử lý webhook' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Endpoint kiểm tra trạng thái hoạt động của Webhook
  const wpConfig = getWpConfig();
  const querySecret = new URL(req.url).searchParams.get('secret');

  if (querySecret !== wpConfig.webhookSecret) {
    return NextResponse.json({ status: 'active', note: 'WordPress Webhook Endpoint for Tung Lam Hoa Phuc' });
  }

  return NextResponse.json({
    status: 'healthy',
    configured: Boolean(wpConfig.webhookSecret),
    endpoint: '/api/webhooks/wordpress',
  });
}
