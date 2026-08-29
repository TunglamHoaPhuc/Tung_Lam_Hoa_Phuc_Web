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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let articles = getArticles();

    if (category && category !== 'all') {
      articles = articles.filter((a: any) => a.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(
        (a: any) =>
          a.title?.toLowerCase().includes(q) ||
          a.subtitle?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề và nội dung bài viết là bắt buộc' },
        { status: 400 }
      );
    }

    const articles = getArticles();

    function slugify(text: string) {
      return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    const newId = articles.length > 0 ? Math.max(...articles.map((a: any) => a.id || 0)) + 1 : 1;
    const slug = body.slug ? slugify(body.slug) : slugify(body.title);

    const newArticle = {
      id: newId,
      slug: slug,
      title: body.title,
      subtitle: body.subtitle || '',
      category: body.category || 'tong-phong-truyen-thua',
      categoryName: body.categoryName || 'TÔNG PHONG TRUYỀN THỪA',
      bannerImage: body.bannerImage || '/images/trang-chu/z5856417756187_3b9aa0f55b1ca50d9934ff24e27fdbad.jpg',
      excerpt: body.excerpt || '',
      content: body.content,
      author: body.author || 'Tùng Lâm Hòa Phúc',
      publishedAt: body.publishedAt || new Date().toISOString(),
      status: body.status || 'published',
      keywords: body.keywords || [],
    };

    articles.unshift(newArticle);
    saveArticles(articles);

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      const existingArticles = getArticles();
      const merged = body.map((incoming: any) => {
        const match = existingArticles.find((ex: any) => String(ex.id) === String(incoming.id) || ex.slug === incoming.slug);
        if (match && (!incoming.content || incoming.content.trim() === '') && match.content && match.content.trim() !== '') {
          // Bảo vệ nội dung phong phú không bị ghi đè rỗng từ client chưa tải xong
          return { ...incoming, content: match.content };
        }
        return incoming;
      });
      saveArticles(merged);
      return NextResponse.json({ success: true, count: merged.length });
    }
    return NextResponse.json({ success: false, error: 'Dữ liệu phải là một mảng danh sách bài viết' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

