import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';
import { parseGutenbergPostContent } from '@/lib/wp-post-parser';

const DB_PATH = path.resolve(process.cwd(), 'src/data/gioi-thieu-database.json');
export const DB_CONFIG = {
  fileName: 'gioi-thieu-database.json',
  localRelativePath: 'src/data/gioi-thieu-database.json',
  s3Key: 'tunglamhoaphuc2/database/gioi-thieu-database.json',
  defaultData: [] as GioiThieuRecord[],
};

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

export interface GioiThieuRecord {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  groupCategory: 'lich-su-chua' | 'nguoi-lien-quan' | 'thanh-quy-van-hoa';
  groupCategoryName?: string;
  heroBanner: string;
  heroBannerPosition?: string;
  portraitImage?: string;
  portraitImagePosition?: string;
  overviewSummary: string;
  quoteTitle?: string;
  quoteContent?: string[];
  quoteAuthor?: string;
  milestones?: MilestoneItem[];
  content: string;
  mainContentHtml?: string;
  galleryImages?: Array<{ url: string; caption: string; position?: string }>;
  videoBlock?: { videoUrl: string; title: string; summary: string };
  sourceBook?: { bookTitle: string; author: string; coverImage?: string; description?: string };
  wpPostId?: string | number;
  status: 'published' | 'draft';
  orderIndex: number;
  wpModified?: string;
}

function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&#8230;/g, '…')
    .replace(/&hellip;/g, '…')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(parseInt(dec, 10)))
    .normalize('NFC');
}

export async function getTopics(): Promise<GioiThieuRecord[]> {
  try {
    const cloudTopics = await loadServerlessJsonAsync<GioiThieuRecord[]>(DB_CONFIG);
    if (cloudTopics && Array.isArray(cloudTopics) && cloudTopics.length > 0) {
      return cloudTopics;
    }
  } catch (e) {
    console.warn('Could not load gioi-thieu from S3, falling back to local file:', e);
  }

  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

export async function saveTopics(topics: GioiThieuRecord[]) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(topics, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing local gioi-thieu-database.json:', e);
  }
  await saveServerlessJson(DB_CONFIG, topics);
}

// 🔄 Đồng bộ bài viết từ WordPress Gutenberg vào danh sách chủ đề Giới Thiệu
export async function syncWpForGioiThieu(topics: GioiThieuRecord[]): Promise<{ count: number; updatedSlugs: string[] }> {
  let count = 0;
  const updatedSlugs: string[] = [];

  for (const topic of topics) {
    if (!topic.wpPostId) continue;
    const wpId = String(topic.wpPostId).trim();
    if (!wpId || isNaN(Number(wpId))) continue;

    try {
      const wpRes = await fetch(`https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts/${wpId}?_embed=true`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        cache: 'no-store',
      });
      if (!wpRes.ok) continue;

      const wp = await wpRes.json();
      const rawHtml = wp.content?.rendered || '';
      const cleanTitle = decodeHtmlEntities(wp.title?.rendered || '').trim();
      const parsed = parseGutenbergPostContent(rawHtml, cleanTitle || topic.title);
      const featuredUrl = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url;

      const titleChanged = Boolean(cleanTitle && topic.title !== cleanTitle);
      const contentChanged = Boolean(parsed.cleanedContent && topic.content !== parsed.cleanedContent);
      const modifiedChanged = Boolean(wp.modified && topic.wpModified !== wp.modified);
      const missingHtml = !topic.mainContentHtml || topic.mainContentHtml.trim() === '';

      if (titleChanged || contentChanged || modifiedChanged || missingHtml) {
        if (cleanTitle) topic.title = cleanTitle;
        if (parsed.cleanedContent) topic.content = parsed.cleanedContent;
        topic.mainContentHtml = rawHtml;
        topic.wpModified = wp.modified;

        if (featuredUrl) {
          topic.heroBanner = featuredUrl;
        }

        if (parsed.photoGallery && parsed.photoGallery.length > 0) {
          topic.galleryImages = parsed.photoGallery.map((p) => ({
            url: p.imageUrl,
            caption: p.caption || p.title || '',
          }));
        }

        if (wp.excerpt?.rendered) {
          const cleanEx = decodeHtmlEntities(wp.excerpt.rendered.replace(/<[^>]+>/g, '').trim());
          if (cleanEx && cleanEx.length > 20) {
            topic.overviewSummary = cleanEx;
          }
        }

        count++;
        updatedSlugs.push(topic.slug);
      }
    } catch (err) {
      console.warn(`Error syncing WP post ${wpId} for topic ${topic.id}:`, err);
    }
  }

  return { count, updatedSlugs };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get('group');
  const search = searchParams.get('search');
  const syncWp = searchParams.get('syncWp') === 'true';

  let topics = await getTopics();

  if (syncWp) {
    const { count } = await syncWpForGioiThieu(topics);
    if (count > 0) {
      await saveTopics(topics);
    }
  }

  if (group && group !== 'all') {
    topics = topics.filter((t) => t.groupCategory === group);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    topics = topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle?.toLowerCase().includes(q) ||
        t.overviewSummary?.toLowerCase().includes(q) ||
        t.content?.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    total: topics.length,
    topics,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu gửi lên phải là một danh sách chủ đề giới thiệu' },
        { status: 400 }
      );
    }

    const currentTopics = await getTopics();
    const currentMap = new Map(currentTopics.map((t) => [t.id, t]));

    // Safeguard
    const validated = body.map((t: GioiThieuRecord) => {
      const orig = currentMap.get(t.id);
      if (orig && (!t.content || t.content.trim() === '') && orig.content && orig.content.trim() !== '') {
        t.content = orig.content;
      }
      return t;
    });

    await saveTopics(validated);

    try {
      revalidatePath('/', 'page');
      revalidatePath('/gioi-thieu', 'page');
      revalidatePath('/gioi-thieu/lich-su-tung-lam-hoa-phuc', 'page');
      revalidatePath('/gioi-thieu/su-ong-hoang-phap', 'page');
      revalidatePath('/gioi-thieu/su-phu-tru-tri', 'page');
      revalidatePath('/gioi-thieu/tieu-su-su-to', 'page');
      revalidatePath('/gioi-thieu/van-hoa-ung-xu', 'page');
      revalidatePath('/gioi-thieu/dai-su-lien-dang', 'page');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Đã lưu danh sách chủ đề giới thiệu thành công!',
      total: validated.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topics = await getTopics();

    const newId = body.id || `gt-${Date.now()}`;
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newTopic: GioiThieuRecord = {
      id: newId,
      slug,
      title: body.title || 'Chủ đề giới thiệu mới',
      subtitle: body.subtitle || '',
      tag: body.tag || 'Tùng Lâm Hòa Phúc',
      groupCategory: body.groupCategory || 'lich-su-chua',
      groupCategoryName: body.groupCategoryName || 'Lịch Sử Chùa',
      heroBanner: body.heroBanner || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      heroBannerPosition: body.heroBannerPosition || 'center 50%',
      overviewSummary: body.overviewSummary || '',
      content: body.content || '',
      quoteTitle: body.quoteTitle,
      quoteContent: body.quoteContent || [],
      quoteAuthor: body.quoteAuthor,
      milestones: body.milestones || [],
      galleryImages: body.galleryImages || [],
      status: body.status || 'published',
      orderIndex: body.orderIndex || topics.length + 1,
      wpPostId: body.wpPostId,
    };

    topics.push(newTopic);
    await saveTopics(topics);

    try {
      revalidatePath('/', 'page');
      revalidatePath('/gioi-thieu', 'page');
      revalidatePath('/gioi-thieu/lich-su-tung-lam-hoa-phuc', 'page');
      revalidatePath('/gioi-thieu/su-ong-hoang-phap', 'page');
      revalidatePath('/gioi-thieu/su-phu-tru-tri', 'page');
      revalidatePath('/gioi-thieu/tieu-su-su-to', 'page');
      revalidatePath('/gioi-thieu/van-hoa-ung-xu', 'page');
      revalidatePath('/gioi-thieu/dai-su-lien-dang', 'page');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({
      success: true,
      topic: newTopic,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
