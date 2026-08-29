import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Tiểu Sử Sư Tổ Ngộ Chân Tử - Khai Sơn Tổ Đình Hoằng Pháp',
  description: 'Tôn vinh cuộc đời tu tập và đạo nghiệp của Chư vị Tổ Sư khai sơn Tổ đình Hoằng Pháp.',
};

export default function TieuSuSuToPage() {
  const detail = GIOI_THIEU_DETAILS['tieu-su-su-to'];
  return <GioiThieuDetailLayout detail={detail} />;
}
