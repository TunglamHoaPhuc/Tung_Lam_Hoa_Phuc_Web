import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/auth-guard';
import { getWpConfig } from '@/lib/env-config';
import { getPendingSyncTasks, removeSyncTask, enqueueSyncTask } from '@/lib/sync-queue';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';
import { parseGutenbergPostContent } from '@/lib/wp-post-parser';
import { getDeletedPostsAsync, isPostDeletedAsync } from '@/lib/deleted-posts';
import { deleteWpPost, updateWpPostFields, createOrUpdateWpPost } from '@/lib/wp-admin-client';
import { decodeHtmlEntities } from '@/lib/html-entities';
import { PostRecord, SPECIAL_GIOI_THIEU_WP_IDS, SPECIAL_GIOI_THIEU_SLUGS, SPECIAL_TONG_CHI_WP_IDS } from '@/app/api/admin/posts/route';

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
  // 1. Kiểm tra xác thực Quản trị viên
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  const wpConfig = getWpConfig();
  const results = {
    retriedTasks: 0,
    retrySuccess: 0,
    reconciledWpPosts: 0,
    newPostsImported: 0,
    errors: [] as string[],
  };

  try {
    // 2. Xử lý các tác vụ pending retry trong queue
    const pendingTasks = await getPendingSyncTasks();
    for (const task of pendingTasks) {
      results.retriedTasks++;
      try {
        if (task.action === 'delete_wp_post') {
          const numId = Number(task.entityId);
          if (!isNaN(numId) && numId > 0) {
            const delRes = await deleteWpPost(numId);
            if (delRes.success) {
              await removeSyncTask(task.id);
              results.retrySuccess++;
            } else {
              task.retryCount++;
              task.lastError = delRes.error;
            }
          }
        } else if (task.action === 'update_wp_post') {
          const numId = Number(task.entityId);
          if (!isNaN(numId) && numId > 0 && task.payload) {
            const updRes = await updateWpPostFields(numId, task.payload);
            if (updRes.success) {
              await removeSyncTask(task.id);
              results.retrySuccess++;
            } else {
              task.retryCount++;
              task.lastError = updRes.error;
            }
          }
        }
      } catch (tErr: any) {
        task.retryCount++;
        task.lastError = tErr.message;
        results.errors.push(`Lỗi xử lý retry task ${task.id}: ${tErr.message}`);
      }
    }

    // 3. Đối soát 30 bài viết gần nhất từ WordPress
    const [rawAllPosts, deletedList] = await Promise.all([
      loadServerlessJsonAsync<PostRecord[]>(DB_CONFIG),
      getDeletedPostsAsync(),
    ]);

    const deletedSet = new Set(deletedList.map((d) => d.id));
    const deletedWpIds = new Set(deletedList.filter((d) => d.wpPostId).map((d) => String(d.wpPostId)));
    const deletedSlugs = new Set(deletedList.filter((d) => d.slug).map((d) => d.slug));

    const wpRes = await fetch(`${wpConfig.baseUrl}/wp-json/wp/v2/posts?per_page=30&orderby=modified&order=desc&_embed=true`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Reconciliation Engine)' },
      cache: 'no-store',
    });

    let hasChanges = false;

    if (wpRes.ok) {
      const wpPosts = await wpRes.json();
      if (Array.isArray(wpPosts)) {
        for (const wp of wpPosts) {
          if (!wp || !wp.id) continue;
          const wpId = wp.id;
          const wpSlug = wp.slug || `bai-viet-${wpId}`;

          if (
            deletedSet.has(`post-${wpId}`) ||
            deletedWpIds.has(String(wpId)) ||
            (wpSlug && deletedSlugs.has(wpSlug)) ||
            SPECIAL_GIOI_THIEU_WP_IDS.has(String(wpId)) ||
            SPECIAL_GIOI_THIEU_SLUGS.has(wpSlug) ||
            SPECIAL_TONG_CHI_WP_IDS.has(String(wpId))
          ) {
            continue;
          }

          const existingIdx = rawAllPosts.findIndex(
            (p) => String(p.wpPostId) === String(wpId) || p.id === `post-${wpId}` || p.slug === wpSlug
          );

          const existing = existingIdx !== -1 ? rawAllPosts[existingIdx] : null;
          const isNew = !existing;
          const isWpModifiedNewer = Boolean(
            wp.modified &&
            existing &&
            (existing as any).wpModified &&
            (existing as any).wpModified !== wp.modified
          );

          if (isNew || isWpModifiedNewer) {
            const cleanTitle = decodeHtmlEntities(wp.title?.rendered || '').trim();
            const parsed = parseGutenbergPostContent(wp.content?.rendered || '', cleanTitle);
            const mappedCat = mapWpCategory(wp.categories || []);

            const featuredUrl =
              wp._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
              parsed.featuredImageUrl ||
              'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';

            const rawWpAuthor = wp._embedded?.author?.[0]?.name;
            const wpAuthor = rawWpAuthor && rawWpAuthor !== 'admin_tunglam' && rawWpAuthor !== 'admin'
              ? rawWpAuthor
              : (existing?.author || 'Ban Văn Hóa Tùng Lâm');

            const wpPublishedDate = wp.date ? wp.date.split('T')[0] : (wp.date_gmt ? wp.date_gmt.split('T')[0] : '');

            const mergedPost: PostRecord = {
              id: existing?.id || `post-${wpId}`,
              wpPostId: wpId,
              slug: wpSlug,
              title: cleanTitle || existing?.title || 'Tiêu đề bài viết',
              subtitle: existing?.subtitle || 'Tùng Lâm Hòa Phúc',
              mainCategory: existing?.mainCategory || mappedCat.mainCategory,
              subCategory: existing?.subCategory || mappedCat.subCategory,
              categoryName: existing?.categoryName || mappedCat.categoryName,
              author: wpAuthor,
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
              rawAllPosts[existingIdx] = mergedPost;
              results.reconciledWpPosts++;
            } else {
              rawAllPosts.unshift(mergedPost);
              results.newPostsImported++;
            }
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      await saveServerlessJson(DB_CONFIG, rawAllPosts);
      try {
        revalidatePath('/', 'page');
        revalidatePath('/dong-chay-hoang-phap', 'page');
        revalidatePath('/tri-tue-phat-phap', 'page');
      } catch {}
    }

    return NextResponse.json({
      success: true,
      message: 'Đối soát và phục hồi đồng bộ WordPress thành công!',
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
