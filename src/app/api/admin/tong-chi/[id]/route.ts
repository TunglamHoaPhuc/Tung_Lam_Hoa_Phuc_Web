import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';

const DB_CONFIG = {
  fileName: 'tong-chi-data.json',
  localRelativePath: 'src/data/tong-chi-data.json',
  s3Key: 'tunglamhoaphuc2/database/tong-chi-data.json',
  defaultData: [] as any[],
};

async function getArticles(): Promise<any[]> {
  return await loadServerlessJsonAsync<any[]>(DB_CONFIG);
}

async function saveArticles(articles: any[]): Promise<boolean> {
  return await saveServerlessJson<any[]>(DB_CONFIG, articles);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articles = await getArticles();
    const article = articles.find(
      (a: any) =>
        String(a.id) === id ||
        a.slug === id ||
        (id === 'tiep-buoc-thay-toi' && (a.slug === 'tong-phong-truyen-thua-truc-lam' || a.id === 1)) ||
        (id === 'tong-phong-truyen-thua-truc-lam' && (a.slug === 'tiep-buoc-thay-toi' || a.id === 1)) ||
        (id === 'tam-quy-ngu-gioi-nen-tang-nguoi-phat-tu' && (a.slug === 'tam-quy' || a.id === 25))
    );

    if (!article) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, data: article },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const articles = await getArticles();
    const index = articles.findIndex(
      (a: any) =>
        String(a.id) === id ||
        a.slug === id ||
        (id === 'bo-de-tam' && (a.slug === 'bo-de-tam-coi-nguon-thien-phap' || a.id === 4)) ||
        (id === 'tiep-buoc-thay-toi' && (a.slug === 'tong-phong-truyen-thua-truc-lam' || a.id === 1)) ||
        (id === 'tong-phong-truyen-thua-truc-lam' && (a.slug === 'tiep-buoc-thay-toi' || a.id === 1))
    );

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    articles[index] = {
      ...articles[index],
      ...body,
      isLocalEdited: true,
      updatedAt: new Date().toISOString(),
    };

    await saveArticles(articles);

    const updatedSlug = articles[index].slug;
    try {
      revalidatePath('/', 'page');
      revalidatePath('/tong-chi-tu-hoc', 'page');
      if (updatedSlug) {
        revalidatePath(`/tong-chi-tu-hoc/${updatedSlug}`, 'page');
      }
      revalidatePath(`/tong-chi-tu-hoc/${id}`, 'page');
    } catch (revalErr) {
      console.warn('[tong-chi] revalidatePath error:', revalErr);
    }

    return NextResponse.json({ success: true, data: articles[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const PATCH = PUT;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articles = await getArticles();
    const newArticles = articles.filter(
      (a: any) => String(a.id) !== id && a.slug !== id
    );

    if (newArticles.length === articles.length) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết để xóa' }, { status: 404 });
    }

    await saveArticles(newArticles);

    try {
      revalidatePath('/', 'page');
      revalidatePath('/tong-chi-tu-hoc', 'page');
      revalidatePath(`/tong-chi-tu-hoc/${id}`, 'page');
    } catch (revalErr) {
      console.warn('[tong-chi] revalidatePath error:', revalErr);
    }

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
