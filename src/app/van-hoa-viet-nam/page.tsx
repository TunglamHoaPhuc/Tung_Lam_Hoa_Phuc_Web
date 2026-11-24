import type { Metadata } from 'next';
import VanHoaScrollytelling from '@/components/van-hoa-viet-nam/VanHoaScrollytelling';

const OG_IMAGE_URL =
  'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/11-van-hoa-viet-nam/van-hoa-soi-duong-minh-hoa.webp';

export const metadata: Metadata = {
  title: 'Văn Hóa Soi Đường, Đạo Sáng Non Sông | Triển Lãm Số Tùng Lâm Hòa Phúc',
  description:
    'Hành trình tương tác 2.000 năm Phật giáo đồng hành cùng Văn hóa và Dân tộc Việt Nam — kết nối hiện vật Bảo tàng Tùng Lâm Hòa Phúc và tư tưởng Sa Môn Vô Trí nhân Ngày Văn hóa Việt Nam 24/11.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Tùng Lâm Hòa Phúc',
    title: 'Văn Hóa Soi Đường, Đạo Sáng Non Sông — Triển Lãm Số 24/11',
    description:
      'Lăn chuột khám phá 50 khung hình di sản 2.000 năm Phật giáo đồng hành cùng Văn hóa và Dân tộc Việt Nam tại Bảo tàng Tùng Lâm Hòa Phúc.',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1920,
        height: 1280,
        alt: 'Triển lãm số Văn Hóa Soi Đường, Đạo Sáng Non Sông — Tùng Lâm Hòa Phúc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Văn Hóa Soi Đường, Đạo Sáng Non Sông — Tùng Lâm Hòa Phúc',
    description:
      'Hành trình tương tác 2.000 năm Phật giáo đồng hành cùng Văn hóa và Dân tộc Việt Nam.',
    images: [OG_IMAGE_URL],
  },
};

export default function VanHoaVietNamPage() {
  return <VanHoaScrollytelling />;
}
