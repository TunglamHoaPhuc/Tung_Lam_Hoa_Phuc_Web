import { getGioiThieuDetail } from '@/lib/gioi-thieu-server';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Tiểu Sử Sư Tổ Ngộ Chân Tử - Khai Sơn Tổ Đình Hoằng Pháp',
  description: 'Tôn vinh cuộc đời tu tập và đạo nghiệp của Chư vị Tổ Sư khai sơn Tổ đình Hoằng Pháp.',
};

export default async function TieuSuSuToPage() {
  const detail = await getGioiThieuDetail('tieu-su-su-to');
  if (!detail) return null;
  return <GioiThieuDetailLayout detail={detail} />;
}
