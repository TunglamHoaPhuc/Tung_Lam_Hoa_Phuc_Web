import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { TieuSuSuToOdysseyView } from '@/components/gioi-thieu/TieuSuSuToOdysseyView';
import { getTopics } from '@/app/api/admin/gioi-thieu/route';

export const metadata = {
  title: 'Tiểu Sử Hòa Thượng Ngộ Chân Tử - Sư Tổ Khai Sơn Tông Phong Hoằng Pháp | Tùng Lâm Hòa Phúc',
  description: 'Tóm tắt tiểu sử Cố Lão Hòa Thượng Ngộ Chân Tử, Sư tổ khai sơn Tông phong Hoằng Pháp, cuộc đời tu tập và đạo nghiệp cứu khổ nhân sinh.',
};

export const revalidate = 300;

export default async function TieuSuSuToPage() {
  const fallback = GIOI_THIEU_DETAILS['tieu-su-su-to'];
  let detail: any = fallback;

  try {
    const topics = await getTopics();
    const live = topics.find((t) => t.slug === 'tieu-su-su-to' || t.id === 'gt-05') as
      | (typeof topics[number] & { updatedAt?: string })
      | undefined;
    if (live) {
      const isLiveUpToDate =
        Boolean(live.updatedAt && live.updatedAt >= '2026-11-17T00:00:00') ||
        Boolean(live.content?.includes('Trần Quán'));
      detail = isLiveUpToDate
        ? { ...fallback, ...live }
        : {
            ...live,
            ...fallback,
            wpPostId: live.wpPostId ?? fallback.wpPostId,
          };
    }
  } catch (err) {
    console.warn('TieuSuSuToPage ISR load error:', err);
  }

  return <TieuSuSuToOdysseyView detail={detail} slug="tieu-su-su-to" />;
}
