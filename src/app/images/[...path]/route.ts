import { NextRequest, NextResponse } from 'next/server';

const S3_PUBLIC_BASE = 'https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path || [];
  const joinedPath = pathSegments.join('/');

  // Normalize: convert .jpg/.png to .webp, lowercase
  let s3Key = joinedPath;
  if (!s3Key.endsWith('.webp') && !s3Key.endsWith('.svg')) {
    s3Key = s3Key.replace(/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/, '.webp');
  }

  // Auto-prefix folder mapping if missing prefix
  const folderMap: Record<string, string> = {
    'trang-chu': '01-trang-chu',
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

  const firstSlash = s3Key.indexOf('/');
  if (firstSlash !== -1) {
    const firstPart = s3Key.substring(0, firstSlash);
    if (folderMap[firstPart]) {
      s3Key = `${folderMap[firstPart]}/${s3Key.substring(firstSlash + 1)}`;
    }
  } else if (s3Key.includes('logo-moc-an') || s3Key.includes('logo-tung-lam')) {
    s3Key = `09-icon-minh-hoa/${s3Key}`;
  }

  const s3Url = `${S3_PUBLIC_BASE}/${s3Key}`;

  // Redirect client to S3 CDN
  return NextResponse.redirect(s3Url, {
    status: 307,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
