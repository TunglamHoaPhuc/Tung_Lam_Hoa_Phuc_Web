import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'src/data/tong-chi-data.json');

function getArticles() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading tong-chi-data.json:', err);
    return [];
  }
}

function saveArticles(articles: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf-8');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articles = getArticles();
    const article = articles.find(
      (a: any) =>
        String(a.id) === id ||
        a.slug === id ||
        (id === 'tiep-buoc-thay-toi' && (a.slug === 'tong-phong-truyen-thua-truc-lam' || a.id === 1)) ||
        (id === 'tong-phong-truyen-thua-truc-lam' && (a.slug === 'tiep-buoc-thay-toi' || a.id === 1))
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
    const articles = getArticles();
    const index = articles.findIndex(
      (a: any) => String(a.id) === id || a.slug === id
    );

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    articles[index] = {
      ...articles[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    saveArticles(articles);

    return NextResponse.json({ success: true, data: articles[index] });
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
    const articles = getArticles();
    const newArticles = articles.filter(
      (a: any) => String(a.id) !== id && a.slug !== id
    );

    if (newArticles.length === articles.length) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết để xóa' }, { status: 404 });
    }

    saveArticles(newArticles);

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
