import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';
import { getTopics } from '@/app/api/admin/gioi-thieu/route';

export const metadata = {
  title: 'Đôi Nét Về Đại Sư Thanh Lương - Đạo Trưởng Tông Phong Tổ Đình Hoằng Pháp | Tùng Lâm Hòa Phúc',
  description: 'Đôi nét về Đại Sư Thanh Lương (Hòa thượng Thích Chân Tính), Đạo trưởng Tông phong Tổ đình Hoằng Pháp, người chấn hưng Tịnh Độ và truyền thông Phật giáo.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SuOngHoangPhapPage() {
  const fallback = GIOI_THIEU_DETAILS['su-ong-hoang-phap'];
  let detail: any = fallback;

  try {
    const topics = await getTopics();
    const live = topics.find((t) => t.slug === 'su-ong-hoang-phap' || t.id === 'gt-03');
    if (live) {
      detail = { ...fallback, ...live };
    }
  } catch (err) {
    console.warn('SuOngHoangPhapPage SSR load error:', err);
  }

  return <GioiThieuDetailLayout detail={detail} slug="su-ong-hoang-phap" />;
}
