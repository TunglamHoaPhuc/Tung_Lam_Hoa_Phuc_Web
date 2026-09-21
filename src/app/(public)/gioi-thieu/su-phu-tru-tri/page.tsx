import { getGioiThieuDetail } from '@/lib/gioi-thieu-server';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Sư Phụ Trụ Trì Thích Tâm Hòa - Người Kiến Thiết Tùng Lâm Hòa Phúc',
  description: 'Thầy Thích Tâm Hòa - Người kiến thiết và lãnh đạo đạo tràng Tùng Lâm Hòa Phúc.',
};

export default async function SuPhuTruTriPage() {
  const detail = await getGioiThieuDetail('su-phu-tru-tri');
  if (!detail) return null;
  return <GioiThieuDetailLayout detail={detail} />;
}
