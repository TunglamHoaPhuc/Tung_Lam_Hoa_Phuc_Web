import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PostRecord } from '../route';

const DB_PATH = path.resolve(process.cwd(), 'src/data/posts-database.json');

function getPosts(): PostRecord[] {
  if (!fs.existsSync(DB_PATH)) return [];
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const posts = getPosts();
  const post = posts.find((p) => p.id === id || p.slug === id);

  if (!post) {
    return NextResponse.json(
      { success: false, error: 'Không tìm thấy bài viết' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const posts = getPosts();
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    posts[index] = {
      ...posts[index],
      ...body,
      id: posts[index].id, // Prevent ID override
    };

    savePosts(posts);

    return NextResponse.json({
      success: true,
      post: posts[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let posts = getPosts();
    const exists = posts.some((p) => p.id === id);

    if (!exists) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }

    posts = posts.filter((p) => p.id !== id);
    savePosts(posts);

    return NextResponse.json({
      success: true,
      message: 'Đã xóa bài viết thành công',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
