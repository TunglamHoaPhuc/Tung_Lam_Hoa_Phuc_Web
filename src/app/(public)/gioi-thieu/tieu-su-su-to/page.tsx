import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';
import { getTopics } from '@/app/api/admin/gioi-thieu/route';

export const metadata = {
  title: 'Tiểu Sử Hòa Thượng Ngộ Chân Tử - Sư Tổ Khai Sơn Tông Phong Hoằng Pháp | Tùng Lâm Hòa Phúc',
  description: 'Tóm tắt tiểu sử Cố Lão Hòa Thượng Ngộ Chân Tử, Sư tổ khai sơn Tông phong Hoằng Pháp, cuộc đời tu tập và đạo nghiệp cứu khổ nhân sinh.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TieuSuSuToPage() {
  const fallback = GIOI_THIEU_DETAILS['tieu-su-su-to'];
  let detail: any = fallback;

  try {
    const topics = await getTopics();
    const live = topics.find((t) => t.slug === 'tieu-su-su-to' || t.id === 'gt-04');
    if (live) {
      detail = { ...fallback, ...live };
    }
  } catch (err) {
    console.warn('TieuSuSuToPage SSR load error:', err);
  }

  return <GioiThieuDetailLayout detail={detail} slug="tieu-su-su-to" />;
}
