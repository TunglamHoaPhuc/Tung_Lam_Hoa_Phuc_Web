import { NextResponse } from 'next/server';
import { createOrUpdateWpPost } from '@/lib/wp-admin-client';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      id = null,
      title = 'Bài viết mới',
      subtitle = '',
      content = '',
      contentHtml = '',
      excerpt = '',
      summary = '',
      category = 'dong-chay-hoang-phap',
      categoryName = '',
      postType = 'post',
      status = 'draft',
      photoGallery = [],
    } = body;

    // Ưu tiên category slug nếu có
    const cat = category || (categoryName ? categoryName.toLowerCase().replace(/\s+/g, '-') : 'dong-chay-hoang-phap');

    const result = await createOrUpdateWpPost({
      id,
      title,
      subtitle,
      content,
      contentHtml,
      excerpt: excerpt || summary || subtitle,
      category: cat,
      postType,
      status,
      photoGallery,
    });

    return NextResponse.json({
      success: true,
      wpPostId: result.wpPostId,
      editUrl: result.editUrl,
      isNew: result.isNew,
      message: result.isNew
        ? `Đã đồng bộ bài viết mới #${result.wpPostId} lên WordPress Gutenberg thành công!`
        : `Đã cập nhật nội dung bài viết #${result.wpPostId} trên WordPress Gutenberg!`,
    });
  } catch (error: any) {
    console.error('Error in wp-post-create:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi khi đồng bộ bài viết sang WordPress',
        editUrl: 'https://admin.tunglamhoaphuc.com/wp-admin/post-new.php',
      },
      { status: 500 }
    );
  }
}
