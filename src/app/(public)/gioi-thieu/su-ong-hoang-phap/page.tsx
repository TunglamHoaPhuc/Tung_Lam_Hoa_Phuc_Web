import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Sư Ông Hoằng Pháp - Ân Sư Giáo Dưỡng Tịnh Độ',
  description: 'Ân đức giáo dưỡng và dấu ấn hoằng truyền Tịnh độ của Sư ông Hoằng Pháp.',
};

export default function SuOngHoangPhapPage() {
  const detail = GIOI_THIEU_DETAILS['su-ong-hoang-phap'];
  return <GioiThieuDetailLayout detail={detail} />;
}
