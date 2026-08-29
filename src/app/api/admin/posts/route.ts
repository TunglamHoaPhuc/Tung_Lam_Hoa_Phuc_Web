import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'src/data/posts-database.json');

export interface KeywordItem {
  keyword: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  imagePosition?: string;
  linkUrl?: string;
}

export interface SourceBook {
  bookTitle: string;
  author: string;
  coverImage?: string;
  description?: string;
  linkUrl?: string;
}

export interface VideoBlock {
  videoUrl: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
}

export interface FeaturedArticle {
  label?: string;
  title?: string;
  author?: string;
  bgImage?: string;
  bgPosition?: string;
  linkUrl?: string;
}

export interface PhotoItem {
  title: string;
  imageUrl: string;
  imagePosition?: string;
  khuVuc?: string;
  noiDung?: string;
}

export interface RelatedEdition {
  title: string;
  period: string;
  slug: string;
  thumbnailUrl?: string;
}

export interface UpcomingEvent {
  title: string;
  timeString: string;
  location: string;
  description?: string;
  registrationLink?: string;
}

export interface PostRecord {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  mainCategory: 'dong-chay-hoang-phap' | 'tri-tue-phat-phap' | 'tong-chi-tu-hoc' | 'gioi-thieu' | string;
  subCategory?: string;
  categoryName?: string;
  author: string;
  authorLink?: string;
  publishedDate: string;
  status: 'published' | 'draft';
  viewsCount: number;
  thumbnailUrl: string;
  thumbnailPosition?: string;
  bannerUrl: string;
  bannerPosition?: string;
  summary: string;
  content: string;
  contentHtml?: string;
  keywords?: KeywordItem[];
  sourceBook?: SourceBook | SourceBook[];
  videoBlock?: VideoBlock;
  featuredArticle?: FeaturedArticle;
  photoGallery?: PhotoItem[];
  previousEditions?: RelatedEdition[];
  upcomingEvents?: UpcomingEvent[];
}

function getPosts(): PostRecord[] {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '[]', 'utf8');
    return [];
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function savePosts(posts: PostRecord[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(posts, null, 2), 'utf8');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  let posts = getPosts();

  if (category && category !== 'all') {
    posts = posts.filter(
      (p) => p.mainCategory === category || p.subCategory === category
    );
  }

  if (status && status !== 'all') {
    posts = posts.filter((p) => p.status === status);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    total: posts.length,
    posts,
  });
}

// 🌟 PUT: Cập nhật toàn bộ mảng bài viết (Batch Save từ Bảng tính Spreadsheet)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu gửi lên phải là một danh sách bài viết' },
        { status: 400 }
      );
    }

    const currentPosts = getPosts();
    const currentMap = new Map(currentPosts.map((p) => [p.id, p]));

    // Safeguard bảo vệ không bao giờ làm rỗng nội dung nếu client gửi rỗng ngoài ý muốn
    const validatedPosts = body.map((p: PostRecord) => {
      const orig = currentMap.get(p.id);
      if (orig && (!p.content || p.content.trim() === '') && orig.content && orig.content.trim() !== '') {
        p.content = orig.content;
      }
      return p;
    });

    savePosts(validatedPosts);

    return NextResponse.json({
      success: true,
      message: 'Đã lưu danh sách bài viết thành công!',
      total: validatedPosts.length,
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
    const posts = getPosts();

    const newId = body.id || `post-${Date.now()}`;
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newPost: PostRecord = {
      id: newId,
      slug,
      title: body.title || 'Tiêu đề bài viết',
      subtitle: body.subtitle || '',
      mainCategory: body.mainCategory || 'dong-chay-hoang-phap',
      subCategory: body.subCategory || 'cong-tu',
      categoryName: body.categoryName || '',
      author: body.author || 'Ban Văn Hóa Tùng Lâm',
      authorLink: body.authorLink || '',
      publishedDate: body.publishedDate || new Date().toISOString().split('T')[0],
      status: body.status || 'published',
      viewsCount: body.viewsCount || 0,
      thumbnailUrl: body.thumbnailUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      thumbnailPosition: body.thumbnailPosition || 'center 50%',
      bannerUrl: body.bannerUrl || body.thumbnailUrl || 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp',
      bannerPosition: body.bannerPosition || 'center 50%',
      summary: body.summary || '',
      content: body.content || body.contentHtml || '',
      contentHtml: body.contentHtml || '',
      keywords: body.keywords || [],
      sourceBook: body.sourceBook,
      videoBlock: body.videoBlock,
      featuredArticle: body.featuredArticle,
      photoGallery: body.photoGallery || [],
      previousEditions: body.previousEditions || [],
      upcomingEvents: body.upcomingEvents || [],
    };

    posts.unshift(newPost);
    savePosts(posts);

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
