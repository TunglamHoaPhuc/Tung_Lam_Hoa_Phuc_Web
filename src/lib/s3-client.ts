import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 🪷 Thư mục gốc độc quyền của dự án trên S3 Bucket (Gom tất cả file vào đây)
export const S3_ROOT_PREFIX = 'tunglamhoaphuc2';

function getEnvConfig() {
  let secretKey = process.env.S3_SECRET_ACCESS_KEY || '';
  let accessKey = process.env.S3_ACCESS_KEY_ID || '005bc25330e1c1f0000000029';
  let endpoint = process.env.S3_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com';
  let region = process.env.S3_REGION || 'us-east-005';
  let bucketName = process.env.S3_BUCKET_NAME || 's2-cnv03';
  let publicUrl = process.env.S3_PUBLIC_URL || `https://${bucketName}.s3.${region}.backblazeb2.com`;

  // Fallback: If secretKey is empty, read directly from .env.local on disk
  if (!secretKey) {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf-8');
        raw.split('\n').forEach((line) => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            let val = match[2] || '';
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            val = val.trim();
            if (match[1] === 'S3_SECRET_ACCESS_KEY' && val) secretKey = val;
            if (match[1] === 'S3_ACCESS_KEY_ID' && val) accessKey = val;
            if (match[1] === 'S3_ENDPOINT' && val) endpoint = val;
            if (match[1] === 'S3_REGION' && val) region = val;
            if (match[1] === 'S3_BUCKET_NAME' && val) bucketName = val;
            if (match[1] === 'S3_PUBLIC_URL' && val) publicUrl = val;
          }
        });
      }
    } catch (err) {
      console.error('Error reading .env.local in s3-client:', err);
    }
  }

  return {
    secretKey,
    accessKey,
    endpoint,
    region,
    bucketName,
    publicUrl: publicUrl.replace(/\/$/, ''),
  };
}

let cachedS3Client: S3Client | null = null;

function getS3ClientInstance(config: ReturnType<typeof getEnvConfig>): S3Client | null {
  if (!config.secretKey || !config.accessKey) return null;
  if (!cachedS3Client) {
    cachedS3Client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      forcePathStyle: true,
    });
  }
  return cachedS3Client;
}

// 🪷 Tự động tối ưu và nén ảnh sang định dạng WebP siêu nhẹ & sắc nét
export async function optimizeAndCompressToWebp(
  buffer: Buffer
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  try {
    const compressed = await sharp(buffer)
      .resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    return {
      buffer: compressed,
      contentType: 'image/webp',
      ext: '.webp',
    };
  } catch (err) {
    console.warn('Sharp WebP compression failed, using original buffer:', err);
    return {
      buffer,
      contentType: 'image/jpeg',
      ext: '.jpg',
    };
  }
}

// 🪷 Upload file ảnh vào thư mục chuẩn trong tunglamhoaphuc2/
export async function uploadImageFile(
  rawBuffer: Buffer,
  fileName: string,
  _originalContentType: string = 'image/jpeg',
  folderPrefix: string = 'tong-chi-tu-hoc'
): Promise<{ success: boolean; url: string; isS3: boolean; fileName: string; size?: number; error?: string }> {
  const config = getEnvConfig();

  // Nén ảnh sang WebP
  const optimized = await optimizeAndCompressToWebp(rawBuffer);
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  const finalFileName = `${baseName}${optimized.ext}`;

  // Chuẩn hóa folder prefix nằm trong tunglamhoaphuc2/
  let cleanFolder = folderPrefix.replace(/^\/+|\/+$/g, '');
  if (!cleanFolder) cleanFolder = 'uploads';
  if (cleanFolder.startsWith(`${S3_ROOT_PREFIX}/`)) {
    cleanFolder = cleanFolder.replace(`${S3_ROOT_PREFIX}/`, '');
  } else if (cleanFolder === S3_ROOT_PREFIX) {
    cleanFolder = 'uploads';
  }

  const s3Key = `${S3_ROOT_PREFIX}/${cleanFolder}/${finalFileName}`;

  // 1. Upload lên S3
  const client = getS3ClientInstance(config);
  if (client) {
    try {
      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: s3Key,
        Body: optimized.buffer,
        ContentType: optimized.contentType,
      });

      await client.send(command);

      const fullUrl = `${config.publicUrl}/${s3Key}`;
      console.log('✅ Uploaded to S3 successfully:', fullUrl, `(${Math.round(optimized.buffer.length / 1024)} KB)`);
      return {
        success: true,
        url: fullUrl,
        isS3: true,
        fileName: finalFileName,
        size: optimized.buffer.length,
      };
    } catch (err: any) {
      console.error('❌ S3 Upload failed, falling back to local storage:', err);
    }
  }

  // 2. Fallback: Lưu vào local public/images/[folder]
  try {
    const localDir = path.resolve(process.cwd(), 'public/images', cleanFolder);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const localFilePath = path.join(localDir, finalFileName);
    fs.writeFileSync(localFilePath, optimized.buffer);

    const localUrl = `/images/${cleanFolder}/${finalFileName}`;
    return {
      success: true,
      url: localUrl,
      isS3: false,
      fileName: finalFileName,
      size: optimized.buffer.length,
    };
  } catch (err: any) {
    return { success: false, url: '', isS3: false, fileName: finalFileName, error: err.message };
  }
}

// 🪷 Duyệt Explorer Cây Thư Mục S3 (Chỉ quét độc quyền bên trong tunglamhoaphuc2/)
export async function listS3Explorer(relativePrefix: string = ''): Promise<{
  success: boolean;
  currentPath: string;
  folders: string[];
  files: Array<{ url: string; key: string; name: string; size?: number; lastModified?: Date }>;
}> {
  const config = getEnvConfig();

  // Bỏ prefix tunglamhoaphuc2 nếu có để lấy đường dẫn tương đối sạch sẽ
  let cleanRel = relativePrefix.replace(/^\/+/, '').replace(/\/+$/, '');
  if (cleanRel.startsWith(S3_ROOT_PREFIX)) {
    cleanRel = cleanRel.replace(new RegExp(`^${S3_ROOT_PREFIX}\\/?`), '');
  }

  // S3 Key thực tế để query: tunglamhoaphuc2/subfolder/
  const actualS3Prefix = cleanRel ? `${S3_ROOT_PREFIX}/${cleanRel}/` : `${S3_ROOT_PREFIX}/`;

  const folderSet = new Set<string>();
  const fileList: Array<{ url: string; key: string; name: string; size?: number; lastModified?: Date }> = [];

  const client = getS3ClientInstance(config);
  if (client) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: config.bucketName,
        Prefix: actualS3Prefix,
        Delimiter: '/',
        MaxKeys: 1000,
      });

      const response = await client.send(command);

      // 1. Thư mục con từ CommonPrefixes
      if (response.CommonPrefixes) {
        for (const p of response.CommonPrefixes) {
          if (p.Prefix) {
            const folderName = p.Prefix.replace(actualS3Prefix, '').replace(/\/$/, '');
            if (folderName) folderSet.add(folderName);
          }
        }
      }

      // 2. File trong thư mục hiện tại từ Contents
      if (response.Contents) {
        for (const item of response.Contents) {
          if (item.Key && !item.Key.endsWith('/')) {
            const fileName = item.Key.replace(actualS3Prefix, '');
            if (fileName && !fileName.includes('/')) {
              fileList.push({
                url: `${config.publicUrl}/${item.Key}`,
                key: item.Key,
                name: fileName,
                size: item.Size,
                lastModified: item.LastModified,
              });
            }
          }
        }
      }

      // 3. Nếu ở trong chuyên mục mà chưa có file trực tiếp (ảnh nằm ở thư mục con sâu), quét thêm toàn bộ ảnh thuộc chuyên mục đó
      if (fileList.length === 0 && cleanRel) {
        const recursiveCmd = new ListObjectsV2Command({
          Bucket: config.bucketName,
          Prefix: actualS3Prefix,
          MaxKeys: 1000,
        });
        const recRes = await client.send(recursiveCmd);
        if (recRes.Contents) {
          for (const item of recRes.Contents) {
            if (item.Key && !item.Key.endsWith('/')) {
              const fileName = item.Key.split('/').pop() || '';
              if (fileName && !fileList.some((f) => f.key === item.Key)) {
                fileList.push({
                  url: `${config.publicUrl}/${item.Key}`,
                  key: item.Key,
                  name: fileName,
                  size: item.Size,
                  lastModified: item.LastModified,
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Error listing S3 explorer:', err);
    }
  }

  return {
    success: true,
    currentPath: cleanRel,
    folders: Array.from(folderSet).sort(),
    files: fileList.sort((a, b) => ((b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0))),
  };
}

// 🪷 Tạo thư mục mới trên S3 trong tunglamhoaphuc2/
export async function createS3Folder(folderPath: string): Promise<{ success: boolean; error?: string }> {
  const config = getEnvConfig();
  let cleanPath = folderPath.replace(/^\/+|\/+$/g, '');
  if (!cleanPath.startsWith(S3_ROOT_PREFIX)) {
    cleanPath = `${S3_ROOT_PREFIX}/${cleanPath}`;
  }
  cleanPath += '/';

  const client = getS3ClientInstance(config);
  if (client) {
    try {
      const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: cleanPath,
        Body: Buffer.from(''),
      });

      await client.send(command);
    } catch (err: any) {
      console.error('Error creating S3 folder:', err);
    }
  }

  return { success: true };
}

// 🪷 Xóa file hoặc thư mục trên S3
export async function deleteS3Object(key: string): Promise<{ success: boolean; error?: string }> {
  const config = getEnvConfig();
  const client = getS3ClientInstance(config);

  if (client) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: config.bucketName,
        Key: key,
      });

      await client.send(command);

      // Xóa file local nếu có
      try {
        const localRel = key.replace(/^tunglamhoaphuc2\//, '');
        const localPath = path.resolve(process.cwd(), 'public/images', localRel);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      } catch (e) {
        console.warn('Local unlink notice:', e);
      }
    } catch (err: any) {
      console.error('Error deleting S3 object:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

// 🪷 Đổi tên file trên S3 (Sao chép key mới & Xóa key cũ)
export async function renameS3Object(
  oldKey: string,
  newFileName: string
): Promise<{ success: boolean; newUrl?: string; newKey?: string; error?: string }> {
  const config = getEnvConfig();
  const client = getS3ClientInstance(config);

  if (!client) {
    return { success: false, error: 'S3 client chưa được khởi tạo' };
  }

  try {
    const keyParts = oldKey.split('/');
    const oldName = keyParts.pop() || '';
    const oldExt = path.extname(oldName) || '.webp';

    let cleanNewName = newFileName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^\w\s.-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    if (!cleanNewName.includes('.')) {
      cleanNewName += oldExt;
    }

    const newKey = [...keyParts, cleanNewName].join('/');

    // 1. Copy object to new key
    const copyCmd = new CopyObjectCommand({
      Bucket: config.bucketName,
      CopySource: `${config.bucketName}/${encodeURIComponent(oldKey)}`,
      Key: newKey,
    });
    await client.send(copyCmd);

    // 2. Delete old object
    const delCmd = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: oldKey,
    });
    await client.send(delCmd);

    // 3. Rename local file if exists
    try {
      const localRelOld = oldKey.replace(/^tunglamhoaphuc2\//, '');
      const localRelNew = newKey.replace(/^tunglamhoaphuc2\//, '');
      const localOldPath = path.resolve(process.cwd(), 'public/images', localRelOld);
      const localNewPath = path.resolve(process.cwd(), 'public/images', localRelNew);
      if (fs.existsSync(localOldPath)) {
        fs.renameSync(localOldPath, localNewPath);
      }
    } catch (e) {
      console.warn('Local rename notice:', e);
    }

    // 4. Tự động cập nhật đường link mới vào các bài viết & cơ sở dữ liệu
    try {
      const oldUrl = `${config.publicUrl}/${oldKey}`;
      const newUrl = `${config.publicUrl}/${newKey}`;
      const jsonFiles = [
        path.resolve(process.cwd(), 'src/data/tong-chi-data.json'),
        path.resolve(process.cwd(), 'src/data/posts-database.json'),
      ];
      for (const jPath of jsonFiles) {
        if (fs.existsSync(jPath)) {
          let content = fs.readFileSync(jPath, 'utf-8');
          if (content.includes(oldUrl) || content.includes(oldKey)) {
            content = content.replaceAll(oldUrl, newUrl).replaceAll(oldKey, newKey);
            fs.writeFileSync(jPath, content, 'utf-8');
          }
        }
      }
    } catch (dbErr) {
      console.warn('Database URL auto-update notice:', dbErr);
    }

    return {
      success: true,
      newUrl: `${config.publicUrl}/${newKey}`,
      newKey,
    };
  } catch (err: any) {
    console.error('Error renaming S3 object:', err);
    return { success: false, error: err.message };
  }
}

