import { getGioiThieuDetail } from '@/lib/gioi-thieu-server';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Sư Ông Hoằng Pháp - Ân Sư Giáo Dưỡng Tịnh Độ',
  description: 'Ân đức giáo dưỡng và dấu ấn hoằng truyền Tịnh độ của Sư ông Hoằng Pháp.',
};

export default async function SuOngHoangPhapPage() {
  const detail = await getGioiThieuDetail('su-ong-hoang-phap');
  if (!detail) return null;
  return <GioiThieuDetailLayout detail={detail} />;
}
