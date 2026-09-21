import { getGioiThieuDetail } from '@/lib/gioi-thieu-server';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Lịch Sử Tùng Lâm Hòa Phúc - Cổ Tự Trùng Tu & Hoằng Dương Chánh Pháp',
  description: 'Tìm hiểu nguồn gốc hình thành, các giai đoạn trùng tu và phát triển của Tùng Lâm Hòa Phúc (Hà Nội).',
};

export default async function LichSuTungLamHoaPhucPage() {
  const detail = await getGioiThieuDetail('lich-su-tung-lam-hoa-phuc');
  if (!detail) return null;
  return <GioiThieuDetailLayout detail={detail} />;
}
