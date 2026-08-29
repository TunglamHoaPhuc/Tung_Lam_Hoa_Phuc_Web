import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

function getS3Client() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  let env: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf-8');
    raw.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        env[match[1]] = val.trim();
      }
    });
  }

  const accessKeyId = process.env.S3_ACCESS_KEY_ID || env.S3_ACCESS_KEY_ID || '005bc25330e1c1f0000000029';
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || env.S3_SECRET_ACCESS_KEY;
  const endpoint = process.env.S3_ENDPOINT || env.S3_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com';
  const region = process.env.S3_REGION || env.S3_REGION || 'us-east-005';
  const bucketName = process.env.S3_BUCKET_NAME || env.S3_BUCKET_NAME || 's2-cnv03';
  const publicUrl = process.env.S3_PUBLIC_URL || env.S3_PUBLIC_URL || `https://${bucketName}.s3.${region}.backblazeb2.com`;

  const client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey: secretAccessKey || '' },
    forcePathStyle: true,
  });

  return { client, bucketName, publicUrl };
}

// 🪷 Quét và tự động sửa mọi link ảnh trong bài viết khi người dùng sắp xếp/gộp thư mục trên S3 hoặc Ổ Z:
export async function POST() {
  try {
    const { client, bucketName, publicUrl } = getS3Client();

    // 1. Quét toàn bộ S3 bucket để xây dựng bản đồ file hiện tại
    const fileMap = new Map<string, string>(); // filename -> full S3 URL
    let token: string | undefined = undefined;

    do {
      const cmd: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: 'tunglamhoaphuc2/',
        ContinuationToken: token,
        MaxKeys: 1000,
      });
      const res = await client.send(cmd);
      if (res.Contents) {
        for (const item of res.Contents) {
          if (item.Key && !item.Key.endsWith('/')) {
            const fileName = item.Key.split('/').pop() || '';
            if (fileName) {
              fileMap.set(fileName.toLowerCase(), `${publicUrl}/${item.Key}`);
            }
          }
        }
      }
      token = res.NextContinuationToken;
    } while (token);

    let totalRepaired = 0;
    const repairedDetails: string[] = [];

    // 2. Sửa link trong file JSON dữ liệu
    const jsonFiles = [
      path.resolve(process.cwd(), 'src/data/tong-chi-data.json'),
      path.resolve(process.cwd(), 'src/data/posts-database.json'),
    ];

    for (const jsonPath of jsonFiles) {
      if (fs.existsSync(jsonPath)) {
        let content = fs.readFileSync(jsonPath, 'utf-8');
        let modified = false;

        // Quét tìm tất cả các URL S3 hoặc link ảnh
        const urlRegex = /(https?:\/\/[^\s"'`<>]+tunglamhoaphuc2\/[^\s"'`<>]+|\/images\/[^\s"'`<>]+)/gi;
        const matches = content.match(urlRegex) || [];

        for (const url of matches) {
          const fileName = url.split('/').pop()?.split('?')[0]?.toLowerCase() || '';
          if (fileName && fileMap.has(fileName)) {
            const liveUrl = fileMap.get(fileName)!;
            if (url !== liveUrl) {
              content = content.replaceAll(url, liveUrl);
              modified = true;
              totalRepaired++;
              repairedDetails.push(`Đã khớp lại: ${fileName} ➔ ${liveUrl}`);
            }
          }
        }

        if (modified) {
          fs.writeFileSync(jsonPath, content, 'utf-8');
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã quét và tự động cập nhật ${totalRepaired} đường dẫn ảnh thành công!`,
      totalRepaired,
      totalS3Files: fileMap.size,
      details: repairedDetails.slice(0, 50),
    });
  } catch (error: any) {
    console.error('Error repairing links:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
