import { NextResponse } from 'next/server';
import { readDb, updateDb } from '@/lib/s3-db';
import { TONG_CHI_DB } from '@/lib/s3-collections';

async function getArticles(): Promise<any[]> {
  return readDb<any[]>(TONG_CHI_DB);
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

    return NextResponse.json({ success: true, data: article });
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
    let updatedArticle: any = null;
    await updateDb<any[]>(TONG_CHI_DB, (articles) => {
      const index = articles.findIndex(
        (a: any) =>
          String(a.id) === id ||
          a.slug === id ||
          (id === 'bo-de-tam' && (a.slug === 'bo-de-tam-coi-nguon-thien-phap' || a.id === 4)) ||
          (id === 'tiep-buoc-thay-toi' && (a.slug === 'tong-phong-truyen-thua-truc-lam' || a.id === 1)) ||
          (id === 'tong-phong-truyen-thua-truc-lam' && (a.slug === 'tiep-buoc-thay-toi' || a.id === 1))
      );
      if (index === -1) return articles;

      articles[index] = {
        ...articles[index],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      updatedArticle = articles[index];
      return articles;
    });

    if (!updatedArticle) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let removedCount = 0;
    await updateDb<any[]>(TONG_CHI_DB, (articles) => {
      const newArticles = articles.filter(
        (a: any) => String(a.id) !== id && a.slug !== id
      );
      removedCount = articles.length - newArticles.length;
      return newArticles;
    });

    if (removedCount === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết để xóa' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
