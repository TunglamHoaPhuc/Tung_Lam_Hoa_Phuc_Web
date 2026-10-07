import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Tiểu Sử Sa Môn Thích Tâm Hòa - Trụ Trì Chùa Hòa Phúc | Tùng Lâm Hòa Phúc',
  description: 'Tiểu sử Thầy Thích Tâm Hòa, Trụ trì chùa Hòa Phúc, Quốc Oai, Hà Nội - Người kiến thiết đạo tràng tu học Tịnh Độ và nuôi dưỡng đời sống tâm linh cho giới trẻ.',
};

export default function SuPhuTruTriPage() {
  const detail = GIOI_THIEU_DETAILS['su-phu-tru-tri'];
  return <GioiThieuDetailLayout detail={detail} />;
}
