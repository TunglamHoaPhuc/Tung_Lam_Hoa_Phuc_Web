import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('src/data/posts-database.json');
const dbPosts = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const dongChayPath = path.resolve('src/data/dong-chay-hoang-phap-data.ts');

const newArticles = dbPosts.map((p, idx) => ({
  id: p.id || `gdoc-${idx}`,
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle || 'Chánh Pháp Tùng Lâm Hòa Phúc',
  category: p.subCategory === 'cong-tu' ? 'cong-tu' : p.subCategory === 'khoa-le-truyen-thong' ? 'khoa-le-truyen-thong' : p.subCategory === 'tinh-do-nhan-gian' ? 'tinh-do-nhan-gian' : 'dai-le-su-kien',
  subCategory: p.subtitle ? p.subtitle.toUpperCase() : 'HOẰNG PHÁP ĐỘ SINH',
  subCategoryIcon: '🪔',
  templeLogo: 'tung-lam-hoa-phuc',
  templeName: 'Tùng Lâm Hòa Phúc',
  thumbnailUrl: p.thumbnailUrl,
  bannerUrl: p.bannerUrl,
  date: p.publishedDate,
  views: p.viewsCount || 25000,
  author: p.author || 'Thích Tâm Hòa',
  location: 'Tùng Lâm Hòa Phúc',
  summary: p.summary,
  contentHtml: p.contentHtml,
}));

const tsContent = `export interface HoangPhapArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  subCategory: string;
  subCategoryIcon?: string;
  templeLogo: "tung-lam-hoa-phuc" | "quynh-nhai-cam-lo-tu";
  templeName: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  date: string;
  views: number;
  author?: string;
  location?: string;
  summary: string;
  contentHtml?: string;
  imageCaptions?: string[];
  videoBlock?: {
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    summary: string;
  };
}

export const HOANG_PHAP_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "cong-tu", label: "Cộng tu" },
  { id: "khoa-le-truyen-thong", label: "Khóa lễ truyền thống" },
  { id: "dai-le-su-kien", label: "Đại lễ sự kiện" },
  { id: "tinh-do-nhan-gian", label: "Tịnh độ nhân gian" },
];

export const HOANG_PHAP_ARTICLES: HoangPhapArticle[] = ${JSON.stringify(newArticles, null, 2)};
`;

fs.writeFileSync(dongChayPath, tsContent, 'utf8');
console.log(`✅ Successfully merged ${newArticles.length} articles into src/data/dong-chay-hoang-phap-data.ts!`);
