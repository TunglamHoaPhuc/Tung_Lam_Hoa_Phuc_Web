import fs from 'fs';
import path from 'path';

// Đọc posts-database.json
const dbPath = path.resolve('src/data/posts-database.json');
const rawData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const posts = Array.isArray(rawData) ? rawData : rawData.posts;

console.log(`Bắt đầu bóc tách cho ${posts.length} bài viết...`);

let updatedCount = 0;
let totalExtractedImages = 0;

for (const post of posts) {
  let content = post.content || '';
  const currentGallery = Array.isArray(post.photoGallery) ? [...post.photoGallery] : [];

  // Tìm toàn bộ ảnh markdown ![](...) hoặc HTML <img>
  const mdImgRegex = /!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g;
  const htmlImgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi;

  const extractedList = [];

  // 1. Quét Markdown images
  let m;
  while ((m = mdImgRegex.exec(content)) !== null) {
    const alt = (m[1] || '').trim();
    const url = m[2].trim();
    if (url && !extractedList.some(item => item.imageUrl === url)) {
      extractedList.push({
        imageUrl: url,
        title: alt || post.title || 'Ảnh tư liệu',
        caption: alt || '',
        noiDung: alt || '',
      });
    }
  }

  // 2. Quét HTML img
  while ((m = htmlImgRegex.exec(content)) !== null) {
    const url = m[1].trim();
    if (url && !extractedList.some(item => item.imageUrl === url)) {
      extractedList.push({
        imageUrl: url,
        title: post.title || 'Ảnh tư liệu',
        caption: '',
        noiDung: '',
      });
    }
  }

  // Nếu bài viết có ảnh trong content và gallery chưa đủ
  if (extractedList.length > 0 && (currentGallery.length === 0 || currentGallery.length < extractedList.length)) {
    // Gộp ảnh mới vào photoGallery (tránh trùng url)
    for (const img of extractedList) {
      if (!currentGallery.some(g => (g.imageUrl === img.imageUrl || g.url === img.imageUrl))) {
        currentGallery.push(img);
      }
    }
    post.photoGallery = currentGallery;

    // Làm sạch content:
    // - Xóa CSS junk của WordPress gallery cũ: #gallery-xxxx { ... }
    content = content.replace(/#gallery-[0-9a-zA-Z_-]+\s*\{[^}]*\}/gi, '');
    content = content.replace(/@media[^{]+\{[^{]*\{[^}]*\}[^}]*\}/gi, '');
    content = content.replace(/\/\*\s*(Tablet|Mobile)\s*\*\//gi, '');

    // - Xóa các thẻ markdown ảnh ở phần đuôi
    content = content.replace(/!\[.*?\]\(https?:\/\/[^\s\)]+\)/g, '');
    content = content.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
    content = content.replace(/<img[^>]+>/gi, '');

    // - Dọn dẹp khoảng trắng, xuống dòng dư thừa
    content = content.replace(/\n{3,}/g, '\n\n').trim();
    post.content = content;

    // Cập nhật ảnh đại diện nếu đang thiếu
    if (!post.thumbnailUrl || post.thumbnailUrl.includes('placeholder')) {
      post.thumbnailUrl = currentGallery[0]?.imageUrl || currentGallery[0]?.url || post.thumbnailUrl;
    }

    updatedCount++;
    totalExtractedImages += extractedList.length;
  }
}

console.log(`✅ Đã bóc tách thành công ${updatedCount} bài viết!`);
console.log(`📸 Tổng số ảnh đã đưa vào photoGallery: ${totalExtractedImages}`);

// Ghi lại vào file json
fs.writeFileSync(dbPath, JSON.stringify(rawData, null, 2), 'utf-8');
console.log(`💾 Đã lưu dữ liệu vào ${dbPath}`);
