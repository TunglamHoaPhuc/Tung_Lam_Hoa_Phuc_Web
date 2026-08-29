import { NextResponse } from 'next/server';
import path from 'path';
import { uploadImageFile, listS3Explorer, createS3Folder, deleteS3Object, renameS3Object } from '@/lib/s3-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderPath = searchParams.get('path') || '';
    const result = await listS3Explorer(folderPath);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, currentPath: '', folders: [], files: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string | null;

    // 1. Hành động Tạo Thư Mục Mới
    if (action === 'create-folder') {
      const folderPath = (formData.get('folderPath') as string | null) || '';
      if (!folderPath.trim()) {
        return NextResponse.json({ success: false, error: 'Tên thư mục không được để trống' }, { status: 400 });
      }
      const res = await createS3Folder(folderPath.trim());
      return NextResponse.json(res);
    }

    // 2. Hành động Đổi Tên File S3
    if (action === 'rename') {
      const oldKey = (formData.get('oldKey') as string | null) || '';
      const newFileName = (formData.get('newFileName') as string | null) || '';
      if (!oldKey || !newFileName.trim()) {
        return NextResponse.json({ success: false, error: 'Thiếu key cũ hoặc tên file mới' }, { status: 400 });
      }
      const res = await renameS3Object(oldKey, newFileName.trim());
      return NextResponse.json(res);
    }

    // 2. Hành động Tải Ảnh Lên Thư Mục
    const file = formData.get('file') as File | null;
    const folderPath = (formData.get('folderPath') as string | null) || 'tong-chi-tu-hoc';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy file tải lên' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const fileName = `${baseName}-${Date.now()}`;
    const contentType = file.type || 'image/jpeg';

    const result = await uploadImageFile(buffer, fileName, contentType, folderPath);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Lỗi khi lưu ảnh' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: result.fileName,
      isS3: result.isS3,
      size: result.size,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ success: false, error: 'Thiếu tham số key cần xóa' }, { status: 400 });
    }

    const res = await deleteS3Object(key);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
