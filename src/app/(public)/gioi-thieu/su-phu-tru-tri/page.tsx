import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Sư Phụ Trụ Trì Thích Tâm Hòa - Người Kiến Thiết Tùng Lâm Hòa Phúc',
  description: 'Thầy Thích Tâm Hòa - Người kiến thiết và lãnh đạo đạo tràng Tùng Lâm Hòa Phúc.',
};

export default function SuPhuTruTriPage() {
  const detail = GIOI_THIEU_DETAILS['su-phu-tru-tri'];
  return <GioiThieuDetailLayout detail={detail} />;
}
