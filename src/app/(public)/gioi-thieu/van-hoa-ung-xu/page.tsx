import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';
import { getTopics } from '@/app/api/admin/gioi-thieu/route';

export const metadata = {
  title: 'Văn Hóa Ứng Xử Thiền Môn - Thanh Quy Tùng Lâm Hòa Phúc',
  description: 'Quy củ, oai nghi tế hạnh và nếp sống đạo đức dành cho Phật tử khi về viếng cảnh Tùng Lâm Hòa Phúc.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VanHoaUngXuPage() {
  const fallback = GIOI_THIEU_DETAILS['van-hoa-ung-xu'];
  let detail: any = fallback;

  try {
    const topics = await getTopics();
    const live = topics.find((t) => t.slug === 'van-hoa-ung-xu' || t.id === 'gt-05');
    if (live) {
      detail = { ...fallback, ...live };
    }
  } catch (err) {
    console.warn('VanHoaUngXuPage SSR load error:', err);
  }

  return <GioiThieuDetailLayout detail={detail} slug="van-hoa-ung-xu" />;
}
