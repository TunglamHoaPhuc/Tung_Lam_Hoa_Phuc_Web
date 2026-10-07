import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Đôi Nét Về Đại Sư Thanh Lương - Đạo Trưởng Tông Phong Tổ Đình Hoằng Pháp | Tùng Lâm Hòa Phúc',
  description: 'Đôi nét về Đại Sư Thanh Lương (Hòa thượng Thích Chân Tính), Đạo trưởng Tông phong Tổ đình Hoằng Pháp, người chấn hưng Tịnh Độ và truyền thông Phật giáo.',
};

export default function SuOngHoangPhapPage() {
  const detail = GIOI_THIEU_DETAILS['su-ong-hoang-phap'];
  return <GioiThieuDetailLayout detail={detail} />;
}
