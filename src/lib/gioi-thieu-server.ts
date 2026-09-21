import { readPublicCollection } from './s3-collections';
import { GIOI_THIEU_DETAILS, GioiThieuTopicDetail } from '@/data/gioi-thieu-data';

/**
 * 🪷 Lấy chi tiết chủ đề Giới Thiệu:
 * Ưu tiên bản mới nhất trên Backblaze B2 (gioi-thieu-database.json),
 * fallback về dataset build-time nếu S3/API không phản hồi.
 */
export async function getGioiThieuDetail(slug: string): Promise<GioiThieuTopicDetail | undefined> {
  const staticDetail = GIOI_THIEU_DETAILS[slug];
  try {
    const topics = await readPublicCollection<any[]>('gioi-thieu');
    const rec = Array.isArray(topics) ? topics.find((t) => t?.slug === slug) : null;
    if (rec) {
      return {
        ...staticDetail,
        ...rec,
        // Bản ghi admin có thể lưu nội dung ở trường `content` — ánh xạ sang mainContentHtml
        mainContentHtml: rec.mainContentHtml || rec.content || staticDetail?.mainContentHtml || '',
      } as GioiThieuTopicDetail;
    }
  } catch {
    // Giữ dữ liệu tĩnh khi lỗi
  }
  return staticDetail;
}