import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';
import { getTopics } from '@/app/api/admin/gioi-thieu/route';

export const metadata = {
  title: 'Tiểu Sử Sa Môn Thích Tâm Hòa - Trụ Trì Chùa Hòa Phúc | Tùng Lâm Hòa Phúc',
  description: 'Tiểu sử Thầy Thích Tâm Hòa, Trụ trì chùa Hòa Phúc, Quốc Oai, Hà Nội - Người kiến thiết đạo tràng tu học Tịnh Độ và nuôi dưỡng đời sống tâm linh cho giới trẻ.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SuPhuTruTriPage() {
  const fallback = GIOI_THIEU_DETAILS['su-phu-tru-tri'];
  let detail: any = fallback;

  try {
    const topics = await getTopics();
    const live = topics.find((t) => t.slug === 'su-phu-tru-tri' || t.id === 'gt-02');
    if (live) {
      detail = { ...fallback, ...live };
    }
  } catch (err) {
    console.warn('SuPhuTruTriPage SSR load error:', err);
  }

  return <GioiThieuDetailLayout detail={detail} slug="su-phu-tru-tri" />;
}
