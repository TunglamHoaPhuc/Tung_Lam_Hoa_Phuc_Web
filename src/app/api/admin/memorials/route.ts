import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  getAllMemorialRecords,
  getMemorialSyncMeta,
  saveMemorialSyncData,
} from '@/lib/memorial-db';
import {
  buildGoogleDriveEditUrl,
  downloadExcelFromGoogleDrive,
  extractGoogleDriveFileId,
  parseMemorialExcelBuffer,
} from '@/lib/memorial-excel-sync';
import {
  DEFAULT_MEMORIAL_DRIVE_FILE_ID,
  DEFAULT_MEMORIAL_DRIVE_URL,
  MemorialSyncMeta,
} from '@/lib/memorial-types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

const SyncBodySchema = z.object({
  action: z.enum(['sync-drive', 'save-config']).default('sync-drive'),
  driveUrl: z.string().optional(),
});

export async function GET() {
  try {
    const [records, meta] = await Promise.all([
      getAllMemorialRecords(),
      getMemorialSyncMeta(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          records,
          meta: {
            ...meta,
            driveUrl: meta.driveUrl || DEFAULT_MEMORIAL_DRIVE_URL,
            driveFileId: meta.driveFileId || DEFAULT_MEMORIAL_DRIVE_FILE_ID,
            totalRecords: records.length,
          },
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[GET /api/admin/memorials] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Lỗi tải dữ liệu bài vị' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const existingMeta = await getMemorialSyncMeta();

    let buffer: Uint8Array | null = null;
    let sourceName = '(QUAN TRỌNG) DANH SÁCH BÀI VỊ CHƯ H.LINH.xlsx';
    let driveUrl = existingMeta.driveUrl || DEFAULT_MEMORIAL_DRIVE_URL;
    let driveFileId = existingMeta.driveFileId || DEFAULT_MEMORIAL_DRIVE_FILE_ID;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json(
          { success: false, error: 'Vui lòng chọn file Excel (.xlsx) hợp lệ.' },
          { status: 400 }
        );
      }
      sourceName = file.name || sourceName;
      buffer = new Uint8Array(await file.arrayBuffer());
    } else {
      const rawJson = await request.json().catch(() => ({}));
      const parsedBody = SyncBodySchema.safeParse(rawJson);
      if (!parsedBody.success) {
        return NextResponse.json(
          { success: false, error: 'Tham số yêu cầu không hợp lệ.' },
          { status: 400 }
        );
      }

      const targetInput = parsedBody.data.driveUrl?.trim() || driveUrl;
      driveFileId = extractGoogleDriveFileId(targetInput);
      driveUrl = targetInput.includes('http') ? targetInput : buildGoogleDriveEditUrl(driveFileId);

      if (parsedBody.data.action === 'save-config') {
        const updatedMeta: MemorialSyncMeta = {
          ...existingMeta,
          driveUrl,
          driveFileId,
        };
        const allRecords = await getAllMemorialRecords();
        await saveMemorialSyncData(allRecords, updatedMeta);
        return NextResponse.json({
          success: true,
          data: { meta: updatedMeta },
          message: 'Đã lưu liên kết Google Drive.',
        });
      }

      buffer = await downloadExcelFromGoogleDrive(driveFileId);
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File Excel rỗng hoặc không đọc được.' },
        { status: 400 }
      );
    }

    const parsed = parseMemorialExcelBuffer(buffer);
    if (parsed.records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Không trích xuất được bản ghi bài vị nào từ file Excel. Vui lòng kiểm tra tên sheet và cấu trúc cột.',
          details: parsed.warnings,
        },
        { status: 422 }
      );
    }

    const newMeta: MemorialSyncMeta = {
      driveUrl,
      driveFileId,
      lastSyncedAt: new Date().toISOString(),
      totalRecords: parsed.records.length,
      countsByCategory: parsed.countsByCategory,
      sourceName,
    };

    const saved = await saveMemorialSyncData(parsed.records, newMeta);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Không thể lưu dữ liệu đã đồng bộ.' },
        { status: 500 }
      );
    }

    revalidatePath('/tra-cuu-bai-vi');
    revalidatePath('/vu-tru-phat-giao/tu-an');
    revalidatePath('/vu-tru-phat-giao/tu-an-duong');
    revalidatePath('/vu-tru-phat-giao/vang-sinh-duong');
    revalidatePath('/admin/memorials/danh-sach');

    return NextResponse.json(
      {
        success: true,
        data: {
          meta: newMeta,
          sheetBreakdown: parsed.sheetBreakdown,
          warnings: parsed.warnings,
        },
        message: `Đã đồng bộ thành công ${parsed.records.length} bài vị từ ${parsed.sheetBreakdown.length} sheet.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[POST /api/admin/memorials] Sync Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Đồng bộ dữ liệu Excel thất bại.',
      },
      { status: 500 }
    );
  }
}
