import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Tiểu Sử Hòa Thượng Ngộ Chân Tử - Sư Tổ Khai Sơn Tông Phong Hoằng Pháp | Tùng Lâm Hòa Phúc',
  description: 'Tóm tắt tiểu sử Cố Lão Hòa Thượng Ngộ Chân Tử, Sư tổ khai sơn Tông phong Hoằng Pháp, cuộc đời tu tập và đạo nghiệp cứu khổ nhân sinh.',
};

export default function TieuSuSuToPage() {
  const detail = GIOI_THIEU_DETAILS['tieu-su-su-to'];
  return <GioiThieuDetailLayout detail={detail} />;
}
