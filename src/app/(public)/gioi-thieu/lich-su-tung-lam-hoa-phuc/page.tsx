import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';
import { getTopics } from '@/app/api/admin/gioi-thieu/route';

export const metadata = {
  title: 'Lịch Sử Tùng Lâm Hòa Phúc - Cổ Tự Trùng Tu & Hoằng Dương Chánh Pháp',
  description: 'Tìm hiểu nguồn gốc hình thành, các giai đoạn trùng tu và phát triển của Tùng Lâm Hòa Phúc (Hà Nội).',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LichSuTungLamHoaPhucPage() {
  const fallback = GIOI_THIEU_DETAILS['lich-su-tung-lam-hoa-phuc'];
  let detail: any = fallback;

  try {
    const topics = await getTopics();
    const live = topics.find((t) => t.slug === 'lich-su-tung-lam-hoa-phuc' || t.id === 'gt-01');
    if (live) {
      detail = { ...fallback, ...live };
    }
  } catch (err) {
    console.warn('LichSuTungLamHoaPhucPage SSR load error:', err);
  }

  return <GioiThieuDetailLayout detail={detail} slug="lich-su-tung-lam-hoa-phuc" />;
}
