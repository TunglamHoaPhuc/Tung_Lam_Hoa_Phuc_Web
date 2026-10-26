import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { THU_VIEN_BOOKS } from '@/data/thu-vien-data';
import { loadServerlessJsonAsync, saveServerlessJson } from '@/lib/serverless-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DB_CONFIG = {
  fileName: 'reference-books-data.json',
  localRelativePath: 'src/data/reference-books-data.json',
  s3Key: 'tunglamhoaphuc2/database/reference-books-data.json',
  defaultData: [] as any[],
};

async function getCustomBooks(): Promise<any[]> {
  return await loadServerlessJsonAsync<any[]>(DB_CONFIG);
}

async function saveCustomBooks(data: any[]): Promise<boolean> {
  return await saveServerlessJson<any[]>(DB_CONFIG, data);
}

// 🪷 GET: Lấy danh sách toàn bộ sách (kết hợp Tủ sách Tuyển chọn + Kho 400+ sách Tàng Kinh Các)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('q') || '').toLowerCase().trim();
    const category = searchParams.get('category') || '';

    const customBooks = await getCustomBooks();

    // Chuẩn hóa 400+ đầu sách từ Tàng Kinh Các
    const tangKinhCacBooks = (THU_VIEN_BOOKS || []).map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle || '',
      author: b.author,
      description: b.description || `Ấn phẩm Phật học lưu trữ tại Tàng Kinh Các Tùng Lâm Hòa Phúc (${b.pages || 0} trang).`,
      coverImage: b.coverUrl,
      category: b.category,
      linkUrl: `/vu-tru-phat-giao/tang-kinh-cac?sach=${b.id}`,
      isTangKinhCac: true,
    }));

    // Gộp cả hai nguồn (ưu tiên sách tuyển chọn của Sư Phụ lên đầu)
    let allBooks = [...customBooks, ...tangKinhCacBooks];

    if (category && category !== 'Tất cả') {
      allBooks = allBooks.filter((b) => b.category === category);
    }

    if (search) {
      allBooks = allBooks.filter(
        (b) =>
          b.title?.toLowerCase().includes(search) ||
          b.author?.toLowerCase().includes(search) ||
          b.description?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: allBooks,
        total: allBooks.length,
        customCount: customBooks.length,
        tangKinhCacCount: tangKinhCacBooks.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 🪷 POST: Thêm hoặc Cập nhật Sách Tham Khảo mới vào Thư Viện
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, subtitle, author, description, coverImage, pdfUrl, linkUrl, category } = body;

    if (!title) {
      return NextResponse.json({ success: false, message: 'Tiêu đề sách là bắt buộc' }, { status: 400 });
    }

    const customBooks = await getCustomBooks();
    const bookId = id || title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const existingIdx = customBooks.findIndex((b: any) => b.id === bookId);

    const newBook = {
      id: bookId,
      title: title.toUpperCase(),
      subtitle: subtitle || '',
      author: author || 'Sa Môn Vô Trí (Thích Tâm Hòa)',
      description: description || '',
      coverImage: coverImage || 'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/uploads/chua-pho-chieu-hai-phong-1787464212629.webp',
      pdfUrl: pdfUrl || '',
      linkUrl: linkUrl || '/vu-tru-phat-giao/tang-kinh-cac',
      category: category || 'Phật Học Phổ Thông',
      isFeatured: true,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      customBooks[existingIdx] = { ...customBooks[existingIdx], ...newBook };
    } else {
      customBooks.unshift(newBook);
    }

    await saveCustomBooks(customBooks);

    try {
      revalidatePath('/', 'page');
      revalidatePath('/vu-tru-phat-giao', 'page');
      revalidatePath('/vu-tru-phat-giao/tang-kinh-cac', 'page');
      revalidatePath('/vu-tru-phat-giao/thu-vien', 'page');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Đã lưu ấn phẩm vào Thư viện Tàng Kinh Các thành công',
      data: newBook,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
