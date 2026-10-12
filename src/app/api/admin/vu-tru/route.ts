import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { UNIVERSE_AREAS, UniverseArea } from '@/data/universe-data';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';
import { parseGutenbergPostContent } from '@/lib/wp-post-parser';

export const DB_CONFIG = {
  fileName: 'universe-database.json',
  localRelativePath: 'src/data/universe-database.json',
  s3Key: 'tunglamhoaphuc2/database/universe-database.json',
  defaultData: UNIVERSE_AREAS,
};

const DB_PATH = path.resolve(process.cwd(), 'src/data/universe-database.json');

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

export async function getAreas(): Promise<UniverseArea[]> {
  try {
    const cloud = await loadServerlessJsonAsync<UniverseArea[]>(DB_CONFIG);
    if (cloud && Array.isArray(cloud) && cloud.length > 0) {
      return cloud;
    }
  } catch (e) {
    console.warn('Could not load universe-database from S3, falling back to local file:', e);
  }

  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return UNIVERSE_AREAS;
    }
  }
  return UNIVERSE_AREAS;
}

export async function saveAreas(areas: UniverseArea[]) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(areas, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local universe-database.json:', err);
  }

  await saveServerlessJson(DB_CONFIG, areas);

  try {
    revalidatePath('/', 'page');
    revalidatePath('/vu-tru-phat-giao', 'page');
    revalidatePath('/admin/vu-tru-phat-giao', 'page');
    areas.forEach((a) => {
      if (a.slug) revalidatePath(`/vu-tru-phat-giao/${a.slug}`, 'page');
    });
  } catch (e) {
    console.warn('Revalidation warning:', e);
  }
}

export async function syncWpForAreas(
  areas: UniverseArea[],
  targetWpId?: string | number
): Promise<{ count: number; updatedSlugs: string[] }> {
  let count = 0;
  const updatedSlugs: string[] = [];

  for (const area of areas) {
    if (!area.wpPostId) continue;
    const wpId = String(area.wpPostId).trim();
    if (!wpId || isNaN(Number(wpId))) continue;
    if (targetWpId && String(targetWpId) !== wpId) continue;

    try {
      const wpRes = await fetch(
        `https://admin.tunglamhoaphuc.com/wp-json/wp/v2/posts/${wpId}?_embed=true`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          cache: 'no-store',
        }
      );
      if (!wpRes.ok) continue;

      const wp = await wpRes.json();
      const rawHtml = wp.content?.rendered || '';
      const cleanTitle = decodeHtmlEntities(wp.title?.rendered || '').trim();
      const parsed = parseGutenbergPostContent(rawHtml, cleanTitle || area.name);
      const featuredUrl = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url;

      const titleChanged = Boolean(cleanTitle && area.name !== cleanTitle);
      const contentChanged = Boolean(parsed.cleanedContent && area.fullContent !== parsed.cleanedContent);
      const modifiedChanged = Boolean(wp.modified && area.wpModified !== wp.modified);
      const missingHtml = !area.contentHtml || area.contentHtml.trim() === '';

      if (titleChanged || contentChanged || modifiedChanged || missingHtml) {
        if (cleanTitle) area.name = cleanTitle;
        if (parsed.cleanedContent) area.fullContent = parsed.cleanedContent;
        area.contentHtml = rawHtml;
        area.wpModified = wp.modified;

        // Trích xuất mô tả ngắn (bảo đảm không nhận nhầm văn bản cũ của sân khác)
        if (wp.excerpt?.rendered) {
          const cleanEx = decodeHtmlEntities(wp.excerpt.rendered.replace(/<[^>]+>/g, '').trim());
          if (cleanEx && cleanEx.length > 20 && !cleanEx.includes('Lâm Tỳ Ni')) {
            area.description = cleanEx;
          } else if (parsed.cleanedContent) {
            const firstPara = parsed.cleanedContent.split('\n\n')[0].replace(/<[^>]+>/g, '').trim();
            if (firstPara) area.description = firstPara;
          }
        } else if (parsed.cleanedContent) {
          const firstPara = parsed.cleanedContent.split('\n\n')[0].replace(/<[^>]+>/g, '').trim();
          if (firstPara) area.description = firstPara;
        }

        if (featuredUrl) {
          area.imgUrl = featuredUrl;
        }

        count++;
        updatedSlugs.push(area.slug);
      }
    } catch (err) {
      console.warn(`Error syncing WP post ${wpId} for area ${area.id}:`, err);
    }
  }

  return { count, updatedSlugs };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const syncWp = searchParams.get('syncWp') === 'true';
    const syncPostId = searchParams.get('syncPostId');

    let areas = await getAreas();

    if (syncWp || syncPostId) {
      const { count } = await syncWpForAreas(areas, syncPostId || undefined);
      if (count > 0) {
        await saveAreas(areas);
      }
    }

    return NextResponse.json({ success: true, areas, count: areas.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, error: 'Dữ liệu phải là một mảng khu vực' }, { status: 400 });
    }

    const currentAreas = await getAreas();
    const currentMap = new Map(currentAreas.map((a) => [a.id, a]));

    // Bảo vệ nội dung không bị ghi đè rỗng
    const validated = body.map((incoming: UniverseArea) => {
      const orig = currentMap.get(incoming.id);
      if (orig && (!incoming.fullContent || incoming.fullContent.trim() === '') && orig.fullContent && orig.fullContent.trim() !== '') {
        incoming.fullContent = orig.fullContent;
      }
      return incoming;
    });

    await saveAreas(validated);
    return NextResponse.json({ success: true, count: validated.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
