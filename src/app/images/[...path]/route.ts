import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const S3_BASE_DOMAIN = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com';

// Cache lookup map trong bộ nhớ để tốc độ xử lý đạt micro-seconds
let keyLookupMap: Map<string, string> | null = null;

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp|svg|gif)$/i, '')
    .replace(/[^a-z0-9]/g, '');
}

function getLookupMap(): Map<string, string> {
  if (keyLookupMap) return keyLookupMap;

  const map = new Map<string, string>();
  const s3KeysPath = path.resolve(process.cwd(), 's3_keys.json');

  if (fs.existsSync(s3KeysPath)) {
    try {
      const raw = fs.readFileSync(s3KeysPath, 'utf-8');
      const keys: string[] = JSON.parse(raw);

      for (const fullKey of keys) {
        const fullUrl = `${S3_BASE_DOMAIN}/${fullKey}`;
        const keyWithoutPrefix = fullKey.replace(/^tunglamhoaphuc2\//, '');
        const fileName = keyWithoutPrefix.split('/').pop() || '';

        // 1. Lưu theo đường dẫn tương đối gốc
        map.set(keyWithoutPrefix.toLowerCase(), fullUrl);

        // 2. Lưu theo tên file gốc (case-insensitive)
        if (fileName) {
          map.set(fileName.toLowerCase(), fullUrl);
          // Lưu theo tên file chuẩn hóa (bỏ đuôi, bỏ dấu gạch ngang/dưới)
          const norm = normalizeKey(fileName);
          if (norm && !map.has(norm)) {
            map.set(norm, fullUrl);
          }
        }
      }
    } catch (e) {
      console.error('Lỗi khi nạp s3_keys.json trong images proxy:', e);
    }
  }

  keyLookupMap = map;
  return map;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path || [];
  const joinedPath = pathSegments.join('/');

  if (!joinedPath) {
    return new NextResponse('Image path missing', { status: 404 });
  }

  const map = getLookupMap();
  const reqFileName = pathSegments[pathSegments.length - 1] || '';

  // 1. Thử khớp theo đường dẫn tương đối
  const lowerPath = joinedPath.toLowerCase().replace(/\.(jpg|jpeg|png)$/i, '.webp');
  if (map.has(lowerPath)) {
    return NextResponse.redirect(map.get(lowerPath)!, {
      status: 307,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  }

  // 2. Thử khớp theo tên file chính xác (không phân biệt hoa thường)
  const lowerFileName = reqFileName.toLowerCase().replace(/\.(jpg|jpeg|png)$/i, '.webp');
  if (map.has(lowerFileName)) {
    return NextResponse.redirect(map.get(lowerFileName)!, {
      status: 307,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  }

  // 3. Thử khớp theo tên chuẩn hóa bỏ ký tự đặc biệt (_ vs -)
  const normFileName = normalizeKey(reqFileName);
  if (map.has(normFileName)) {
    return NextResponse.redirect(map.get(normFileName)!, {
      status: 307,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  }

  // 4. Fallback ánh xạ thư mục truyền thống
  const folderMap: Record<string, string> = {
    'trang-chu': '01-trang-chu',
    'tong-chi': 'tong-chi',
    'tong-chi-tu-hoc': '02-tong-chi-tu-hoc',
    'dong-chay-hoang-phap': '03-dong-chay-hoang-phap',
    'vu-tru-phat-giao': '04-vu-tru-phat-giao',
    'bao-tuong-phat-giao': '05-bao-tuong-phat-giao',
    '33-ung-hoa-than-duc-quan-am': '06-33-ung-hoa-than-duc-quan-am',
    'anh-tho-cac-vi-cao-tang': '07-anh-tho-cac-vi-cao-tang',
    'tu-an-book': '08-tu-an-book',
    'icon-minh-hoa': '09-icon-minh-hoa',
    'uploads': '10-uploads',
  };

  let s3Key = joinedPath.replace(/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/, '.webp');
  const firstSlash = s3Key.indexOf('/');
  if (firstSlash !== -1) {
    const firstPart = s3Key.substring(0, firstSlash);
    if (folderMap[firstPart]) {
      s3Key = `${folderMap[firstPart]}/${s3Key.substring(firstSlash + 1)}`;
    }
  }

  const s3Url = `${S3_BASE_DOMAIN}/tunglamhoaphuc2/${s3Key}`;

  return NextResponse.redirect(s3Url, {
    status: 307,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
