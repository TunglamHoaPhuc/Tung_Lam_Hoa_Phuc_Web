import { loadServerlessJsonAsync } from '@/lib/serverless-db';
import DongChayHoangPhapClient from './DongChayHoangPhapClient';
import { HOANG_PHAP_ARTICLES, HoangPhapArticle } from '@/data/dong-chay-hoang-phap-data';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const DB_CONFIG = {
  fileName: 'posts-database.json',
  localRelativePath: 'src/data/posts-database.json',
  s3Key: 'tunglamhoaphuc2/database/posts-database.json',
  defaultData: [] as any[],
};

export default async function DongChayHoangPhapPage() {
  const allPosts = await loadServerlessJsonAsync<any[]>(DB_CONFIG);

  const initialArticles: HoangPhapArticle[] = (allPosts || [])
    .filter((p) => p.mainCategory === 'dong-chay-hoang-phap')
    .map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle || '',
      date: p.publishedDate || p.date || '',
      author: p.author || 'Ban Văn Hóa Tùng Lâm',
      category: p.subCategory || 'cong-tu',
      subCategory: p.subtitle || p.categoryName || 'Dòng Chảy Hoằng Pháp',
      subCategoryIcon: '',
      templeLogo: (p.templeLogo || 'tung-lam-hoa-phuc') as 'tung-lam-hoa-phuc' | 'quynh-nhai-cam-lo-tu',
      templeName: p.templeName || 'Tùng Lâm Hòa Phúc',
      views: typeof p.viewsCount === 'number' ? p.viewsCount : (parseInt(p.viewsCount, 10) || 0),
      thumbnailUrl: p.thumbnailUrl || '/images/toan-canh-chua.jpg',
      thumbnailPosition: p.thumbnailPosition || 'center center',
      bannerUrl: p.bannerUrl || '/images/toan-canh-chua.jpg',
      summary:
        p.summary && !p.summary.includes('Tóm tắt')
          ? p.summary
          : p.content
            ? p.content.replace(/!\[.*?\]\(.*?\)/g, '').replace(/<[^>]+>/g, '').replace(/[#*`_>]/g, '').trim().slice(0, 180) + '...'
            : p.contentHtml
              ? p.contentHtml.replace(/<[^>]+>/g, '').trim().slice(0, 180) + '...'
              : '',
      contentHtml: p.contentHtml || '',
    }));

  return (
    <DongChayHoangPhapClient
      initialArticles={initialArticles.length > 0 ? initialArticles : HOANG_PHAP_ARTICLES}
    />
  );
}
