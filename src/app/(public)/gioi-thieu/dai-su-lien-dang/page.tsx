import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';
import { getTopics } from '@/app/api/admin/gioi-thieu/route';

export const metadata = {
  title: 'Đôi Nét Về Đại Sư Liên Đăng - Viện Chủ Viện Tịnh Luật Chùa Đại Từ Ân | Tùng Lâm Hòa Phúc',
  description: 'Đại Sư Liên Đăng là bậc cao tăng Giới sư, Giám đốc Trung tâm Tư liệu Phật giáo Việt Nam, Viện chủ Viện Tịnh Luật chùa Đại Từ Ân.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DaiSuLienDangPage() {
  const fallback = GIOI_THIEU_DETAILS['dai-su-lien-dang'];
  let detail: any = fallback;

  try {
    const topics = await getTopics();
    const live = topics.find((t) => t.slug === 'dai-su-lien-dang' || t.id === 'gt-06');
    if (live) {
      detail = { ...fallback, ...live };
    }
  } catch (err) {
    console.warn('DaiSuLienDangPage SSR load error:', err);
  }

  return <GioiThieuDetailLayout detail={detail} slug="dai-su-lien-dang" />;
}
