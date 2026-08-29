import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'src/data/gioi-thieu-database.json');

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
  status: 'published' | 'draft';
  orderIndex: number;
}

function getTopics(): GioiThieuRecord[] {
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

function saveTopics(topics: GioiThieuRecord[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(topics, null, 2), 'utf8');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get('group');
  const search = searchParams.get('search');

  let topics = getTopics();

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

    const currentTopics = getTopics();
    const currentMap = new Map(currentTopics.map((t) => [t.id, t]));

    // Safeguard
    const validated = body.map((t: GioiThieuRecord) => {
      const orig = currentMap.get(t.id);
      if (orig && (!t.content || t.content.trim() === '') && orig.content && orig.content.trim() !== '') {
        t.content = orig.content;
      }
      return t;
    });

    saveTopics(validated);

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
    const topics = getTopics();

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
    };

    topics.push(newTopic);
    saveTopics(topics);

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
