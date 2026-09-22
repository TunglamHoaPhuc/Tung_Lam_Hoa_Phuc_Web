import fs from 'fs';

const db = JSON.parse(fs.readFileSync('src/data/posts-database.json', 'utf-8'));
const posts = Array.isArray(db) ? db : db.posts;

let countWithImgInContent = 0;
let countWithEmptyGallery = 0;

for (const p of posts) {
  const content = p.content || '';
  const mdImgs = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/g) || [];
  const htmlImgs = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/g) || [];
  const totalImgs = mdImgs.length + htmlImgs.length;
  const galCount = p.photoGallery?.length || 0;

  if (totalImgs > 0 && galCount === 0) {
    countWithEmptyGallery++;
  }
  if (totalImgs > 0) {
    countWithImgInContent++;
  }
}

console.log('Total posts in DB:', posts.length);
console.log('Posts with images in content:', countWithImgInContent);
console.log('Posts with images in content BUT empty photoGallery:', countWithEmptyGallery);
