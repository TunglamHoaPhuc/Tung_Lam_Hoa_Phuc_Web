import { getGioiThieuDetail } from '@/lib/gioi-thieu-server';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Văn Hóa Ứng Xử Thiền Môn - Thanh Quy Tùng Lâm Hòa Phúc',
  description: 'Quy củ, oai nghi tế hạnh và nếp sống đạo đức dành cho Phật tử khi về viếng cảnh Tùng Lâm Hòa Phúc.',
};

export default async function VanHoaUngXuPage() {
  const detail = await getGioiThieuDetail('van-hoa-ung-xu');
  if (!detail) return null;
  return <GioiThieuDetailLayout detail={detail} />;
}
