import { getGioiThieuDetail } from '@/lib/gioi-thieu-server';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Đôi Nét Về Đại Sư Liên Đăng - Bậc Tiền Bối Truyền Thừa',
  description: 'Hành trạng và công hạnh của Đại sư Liên Đăng truyền thừa chánh pháp tại Tùng Lâm Hòa Phúc.',
};

export default async function DaiSuLienDangPage() {
  const detail = await getGioiThieuDetail('dai-su-lien-dang');
  if (!detail) return null;
  return <GioiThieuDetailLayout detail={detail} />;
}
