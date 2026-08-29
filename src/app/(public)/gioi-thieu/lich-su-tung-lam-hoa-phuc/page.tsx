import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Lịch Sử Tùng Lâm Hòa Phúc - Cổ Tự Trùng Tu & Hoằng Dương Chánh Pháp',
  description: 'Tìm hiểu nguồn gốc hình thành, các giai đoạn trùng tu và phát triển của Tùng Lâm Hòa Phúc (Hà Nội).',
};

export default function LichSuTungLamHoaPhucPage() {
  const detail = GIOI_THIEU_DETAILS['lich-su-tung-lam-hoa-phuc'];
  return <GioiThieuDetailLayout detail={detail} />;
}
