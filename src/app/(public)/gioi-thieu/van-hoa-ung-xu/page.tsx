import { GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import { GioiThieuDetailLayout } from '@/components/gioi-thieu/GioiThieuDetailLayout';

export const metadata = {
  title: 'Văn Hóa Ứng Xử Thiền Môn - Thanh Quy Tùng Lâm Hòa Phúc',
  description: 'Quy củ, oai nghi tế hạnh và nếp sống đạo đức dành cho Phật tử khi về viếng cảnh Tùng Lâm Hòa Phúc.',
};

export default function VanHoaUngXuPage() {
  const detail = GIOI_THIEU_DETAILS['van-hoa-ung-xu'];
  return <GioiThieuDetailLayout detail={detail} />;
}
