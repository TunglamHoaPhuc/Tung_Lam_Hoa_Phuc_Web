import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Đôi Nét Về Đại Sư Liên Đăng - Viện Chủ Viện Tịnh Luật Chùa Đại Từ Ân | Tùng Lâm Hòa Phúc',
  description: 'Đại Sư Liên Đăng là bậc cao tăng Giới sư, Giám đốc Trung tâm Tư liệu Phật giáo Việt Nam, Viện chủ Viện Tịnh Luật chùa Đại Từ Ân.',
};

export default function DaiSuLienDangPage() {
  const detail = GIOI_THIEU_DETAILS['dai-su-lien-dang'];
  return <GioiThieuDetailLayout detail={detail} />;
}
