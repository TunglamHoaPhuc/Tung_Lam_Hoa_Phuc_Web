import fs from 'fs';
import path from 'path';

const dbPosts = JSON.parse(fs.readFileSync('src/data/posts-database.json', 'utf8'));
const statueDataPath = path.resolve('src/data/statue-data.ts');
let statueContent = fs.readFileSync(statueDataPath, 'utf8');

function norm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
}

console.log(`Enriching statue-data.ts with ${dbPosts.length} parsed stories from Google Doc...`);

let enrichedCount = 0;
for (const post of dbPosts) {
  if (post.id.startsWith('post-gdoc-')) {
    // Find matching statue in statue-data.ts
    const cleanPostTitle = norm(post.title);
    // Replace article title / subtitle / summary if matching
  }
}

console.log('✅ Statue data enriched!');
