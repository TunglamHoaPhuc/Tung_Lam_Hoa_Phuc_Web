import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Đôi Nét Về Đại Sư Liên Đăng - Bậc Tiền Bối Truyền Thừa',
  description: 'Hành trạng và công hạnh của Đại sư Liên Đăng truyền thừa chánh pháp tại Tùng Lâm Hòa Phúc.',
};

export default function DaiSuLienDangPage() {
  const detail = GIOI_THIEU_DETAILS['dai-su-lien-dang'];
  return <GioiThieuDetailLayout detail={detail} />;
}
