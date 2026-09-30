import { loadServerlessJsonAsync } from '../src/lib/serverless-db';

const POSTS_DB_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as any[],
};

async function main() {
  const posts = await loadServerlessJsonAsync(POSTS_DB_CONFIG);
  console.log('Posts count in S3 DB:', posts.length);
  const p01 = posts.find(p => p.id === 'post-01');
  const p02 = posts.find(p => p.id === 'post-02');
  const p03 = posts.find(p => p.id === 'post-03');
  const pFake = posts.filter(p => p.id?.startsWith('post-0') || p.id === 'post-26827');
  console.log('Found fake posts:', pFake.map(p => ({ id: p.id, title: p.title, viewsCount: p.viewsCount })));
}

main().catch(console.error);
