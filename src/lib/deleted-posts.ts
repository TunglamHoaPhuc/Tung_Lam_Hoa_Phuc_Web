import { loadServerlessJson, saveServerlessJson } from './serverless-db';

export interface DeletedPostRecord {
  id: string;
  wpPostId?: string | number;
  slug?: string;
  deletedAt: string;
}

const DELETED_CONFIG = {
  fileName: 'deleted-posts.json',
  localRelativePath: 'src/data/deleted-posts.json',
  s3Key: 'tunglamhoaphuc2/database/deleted-posts.json',
  defaultData: [] as DeletedPostRecord[],
};

export function getDeletedPosts(): DeletedPostRecord[] {
  return loadServerlessJson<DeletedPostRecord[]>(DELETED_CONFIG);
}

export async function recordDeletedPost(id: string, wpPostId?: string | number, slug?: string): Promise<void> {
  try {
    const list = getDeletedPosts();
    const exists = list.some(
      (item) =>
        (id && item.id === id) ||
        (wpPostId && String(item.wpPostId) === String(wpPostId)) ||
        (slug && item.slug === slug)
    );
    if (!exists) {
      list.push({ id, wpPostId, slug, deletedAt: new Date().toISOString() });
      await saveServerlessJson<DeletedPostRecord[]>(DELETED_CONFIG, list);
    }
  } catch (err) {
    console.warn('[deleted-posts] Không thể ghi nhận bài viết đã xóa:', err);
  }
}

export function isPostDeleted(id?: string, wpPostId?: string | number, slug?: string): boolean {
  try {
    const list = getDeletedPosts();
    return list.some(
      (item) =>
        (Boolean(id) && item.id === id) ||
        (Boolean(wpPostId) && String(item.wpPostId) === String(wpPostId)) ||
        (Boolean(slug) && item.slug === slug)
    );
  } catch {
    return false;
  }
}
