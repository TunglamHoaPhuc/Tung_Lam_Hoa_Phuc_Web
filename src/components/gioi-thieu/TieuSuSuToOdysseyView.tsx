'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SmartSearchAIBar } from '@/components/public/SmartSearchAIBar';
import { SuToKaraokeReader } from './SuToKaraokeReader';
import { GioiThieuTopicDetail, GIOI_THIEU_DETAILS } from '@/data/gioi-thieu-data';
import {
  EventQrPanel,
  LedCornerQrBadge,
  LedFloatingHud,
  LedSpeedMode,
} from './SuToEventToolkit';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flame,
  Maximize2,
  MonitorPlay,
  Play,
  QrCode,
  ScrollText,
  Sparkles,
  X,
} from 'lucide-react';
import './tieu-su-odyssey.css';

interface Props {
  detail: GioiThieuTopicDetail;
  slug?: string;
}

interface ChapterStageImage {
  url: string;
  caption: string;
  objectPosition?: string;
}

interface ChronicleChapter {
  id: string;
  code: string;
  shortLabel: string;
  year: string;
  headline: string;
  location: string;
  keyVirtue: string;
  legacyMark: string;
  medallionImage: string;
  backdropImage: string;
  stageGallery?: ChapterStageImage[];
  biographyDetails: string[];
  vowTitle: string;
  vowDetails: string[];
}

interface GalleryItem {
  url: string;
  caption: string;
  subtitle?: string;
}

const S3_SU_TO_BASE =
  'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/07-anh-tho-cac-vi-cao-tang/su-to-ngo-chan-tu';

const FALLBACK_CHUA_IMG =
  'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/04-vu-tru-phat-giao/toan-canh-chua.webp';
const IMG_ARTWORK_BAO_TUONG =
  'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_lich_dai_to_su/su_to_ngo_chan_tu.webp';
const IMG_ARCHIVE_PORTRAIT =
  'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/07-anh-tho-cac-vi-cao-tang/anh-hoa-thuong-tong-hop/nam/nam/Hoa-Thuong-Ngo-Chan-Tu.webp';
const IMG_THUO_MOI_TU = `${S3_SU_TO_BASE}/su-to-ngo-chan-tu-thuo-moi-tu-hanh.webp`;
const IMG_PINNED_HERO_SU_TO = `${S3_SU_TO_BASE}/hinh-su-to-final-19d1002.webp`;
const IMG_SPOTLIGHT_HOA_PHUC = `${S3_SU_TO_BASE}/su-to-ky-niem-ngay-sinh-hoa-phuc.webp`;

// Ảnh bổ sung theo Google Sheet (Chương 01 - 07)
const IMG_QUE_HUONG_1901 = `${S3_SU_TO_BASE}/que-huong-su-to-thai-binh-1901.webp`;
const IMG_QUY_GIOI_1919 = `${S3_SU_TO_BASE}/trao-truyen-quy-gioi-1919.webp`;
const IMG_SU_TO_QUANG_HUY = `${S3_SU_TO_BASE}/minh-hoa-su-to-quang-huy.webp`;
const IMG_TON_SU_HU_KHONG_TU = `${S3_SU_TO_BASE}/ton-su-hu-khong-tu.webp`;
const IMG_CU_TO_BA_DA = `${S3_SU_TO_BASE}/dac-phap-cu-to-chua-ba-da.webp`;
const IMG_KIEN_AN_XUA = `${S3_SU_TO_BASE}/chua-hoang-phap-kien-an-xua.webp`;
const IMG_DUC_ANH_1943 = `${S3_SU_TO_BASE}/vien-duc-anh-xua-1943.webp`;
const IMG_CUU_TE_1952 = `${S3_SU_TO_BASE}/cuu-te-dong-bao-1952.webp`;
const IMG_BAO_TRO_1972 = `${S3_SU_TO_BASE}/tu-thien-bao-tro-anh-nhi-1972.webp`;
const IMG_HP_XUA = `${S3_SU_TO_BASE}/to-dinh-hoang-phap-xua.webp`;
const IMG_HP_NAY = `${S3_SU_TO_BASE}/to-dinh-hoang-phap-nay.webp`;
const IMG_THUYET_PHAP = `${S3_SU_TO_BASE}/su-to-thuyet-phap-chanh-dien.webp`;
const IMG_GIO_TO_35 = `${S3_SU_TO_BASE}/gio-to-chua-hoang-phap-lan-35.webp`;
const IMG_THAP_TO_1 = `${S3_SU_TO_BASE}/bao-thap-nhi-nghiem-su-to.webp`;
const IMG_THAP_TO_2 = `${S3_SU_TO_BASE}/cong-thap-nhi-nghiem.webp`;
const IMG_GIO_TO_HOA_PHUC_T10 =
  'https://media-tunglamhoaphuc.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/01-trang-chu/calendar_webp/thang-11-an-duc-to-thay.webp';

// Ảnh bìa đầu sách Sư Tổ biên soạn
const BOOK_NGHI_LUAT = `${S3_SU_TO_BASE}/sach-nghi-luat-tu-tri-thiet-yeu.webp`;
const BOOK_KHOA_NIEM = `${S3_SU_TO_BASE}/sach-khoa-niem-tuy-than.webp`;
const BOOK_THANH_QUY = `${S3_SU_TO_BASE}/sach-ton-chi-dao-trang-thanh-quy.webp`;
const BOOK_QUY_GIOI = `${S3_SU_TO_BASE}/sach-quy-gioi-hanh-tri.webp`;
const BOOK_TUYEN_DUONG_DIEU_PHAP = `${S3_SU_TO_BASE}/sach-tuyen-duong-dieu-phap.webp`;
const BOOK_DAO_GIAI_THOAT = `${S3_SU_TO_BASE}/sach-dao-giai-thoat.webp`;
const BOOK_NHAN_QUA = `${S3_SU_TO_BASE}/sach-su-tich-nhan-qua-bao-ung.webp`;

// Ảnh triển lãm bổ sung & Phim tài liệu chính thức (YouTube MKt_sLwxmNU)
const GAL_KHAT_SI_THAM = `${S3_SU_TO_BASE}/ht-giac-tuong-he-phai-khat-si-tham-su-to.webp`;
const GAL_CUNG_DUONG_1986 = `${S3_SU_TO_BASE}/cung-duong-truong-cao-cap-phat-hoc-1986.webp`;
const GAL_VINH_NGHIEM = `${S3_SU_TO_BASE}/cung-duong-truong-ha-vinh-nghiem.webp`;
const GAL_CHU_TON_DUC_HP = `${S3_SU_TO_BASE}/ky-niem-chu-ton-duc-thanh-kiem-tri-hai-su-to.webp`;

// Khung hình trích xuất từ bộ phim tài liệu về Sư Tổ (10:25 – 11:33)
const YT_YEN_TU_1025 = `${S3_SU_TO_BASE}/phim-tu-lieu-van-du-yen-tu-1025.webp`;
const YT_TINH_TOA_HANG_DA = `${S3_SU_TO_BASE}/phim-tu-lieu-tinh-toa-hang-da-1109.webp`;
const YT_HU_KHONG_TU_DAM_DAO = `${S3_SU_TO_BASE}/phim-tu-lieu-ton-su-hu-khong-tu-1117.webp`;
const YT_TRUNG_TU_GIA_LAM = `${S3_SU_TO_BASE}/phim-tu-lieu-trung-tu-gia-lam-1133.webp`;

// Những hình ảnh cuối đời của Sư Tổ (đặt đầu tiên ở Chương 07)
const IMG_CUOI_DOI_TANG_LE = `${S3_SU_TO_BASE}/hinh-anh-cuoi-doi-tang-le-su-to.webp`;

// Cụm ảnh Kỷ Vật Của Sư Tổ (10 hiện vật quý)
const KY_VAT_SO_TANG = `${S3_SU_TO_BASE}/ky-vat-so-tang-luu-niem-hoang-phap.webp`;
const KY_VAT_SO_VANG = `${S3_SU_TO_BASE}/ky-vat-so-vang-luu-niem.webp`;
const KY_VAT_PHUONG_DANH = `${S3_SU_TO_BASE}/ky-vat-phuong-danh-an-nhan-1953.webp`;
const KY_VAT_THU_BUT_1 = `${S3_SU_TO_BASE}/ky-vat-thu-but-su-to-1.webp`;
const KY_VAT_THU_BUT_2 = `${S3_SU_TO_BASE}/ky-vat-thu-but-su-to-2.webp`;
const KY_VAT_AO_TRANG = `${S3_SU_TO_BASE}/ky-vat-ao-trang-su-to.webp`;
const KY_VAT_Y_HAU = `${S3_SU_TO_BASE}/ky-vat-y-hau-ca-sa-su-to.webp`;
const KY_VAT_MU_LEN = `${S3_SU_TO_BASE}/ky-vat-mu-len-dai-hoi-pgvn-1987.webp`;
const KY_VAT_AM_CHEN = `${S3_SU_TO_BASE}/ky-vat-bo-am-chen-tra-su-to.webp`;
const KY_VAT_DOI_DEP = `${S3_SU_TO_BASE}/ky-vat-doi-dep-su-to.webp`;

// Cụm ảnh Văn Bia Tưởng Niệm tại Bảo Tháp Nhị Nghiêm
const VAN_BIA_DAI_SU = `${S3_SU_TO_BASE}/van-bia-hoang-phap-dai-su-ngo-chan-tu.webp`;
const VAN_BIA_TIEU_SU = `${S3_SU_TO_BASE}/van-bia-tieu-su-thap-nhi-nghiem.webp`;
const VAN_BIA_KHAI_SON = `${S3_SU_TO_BASE}/van-bia-khai-son-tu-vien-1935-1974.webp`;

const KY_VAT_ITEMS: GalleryItem[] = [
  {
    url: KY_VAT_Y_HAU,
    caption: 'Y hậu Ca-sa trang nghiêm Sư Tổ sử dụng trong các đại lễ Tổ đình',
  },
  {
    url: KY_VAT_AO_TRANG,
    caption: 'Chiếc áo tràng nâu giản dị gắn liền đời sống tu hành của Sư Tổ',
  },
  {
    url: KY_VAT_MU_LEN,
    caption: 'Mũ len kỷ vật Sư Tổ dùng khi tham dự Đại hội Phật giáo (1987)',
  },
  {
    url: KY_VAT_AM_CHEN,
    caption: 'Bộ ấm chén trà tiếp khách Tăng Ni, Phật tử tại Tổ đình Hoằng Pháp',
  },
  {
    url: KY_VAT_DOI_DEP,
    caption: 'Đôi dép mộc mạc theo bước chân hoằng hóa độ sinh suốt hai miền',
  },
  {
    url: KY_VAT_SO_TANG,
    caption: 'Sổ tang tưởng niệm Sư Tổ tại Tổ đình Hoằng Pháp (năm Mậu Thìn 1988)',
  },
  {
    url: KY_VAT_SO_VANG,
    caption: 'Sổ vàng lưu niệm bút tích chư Tôn đức & Phật tử thăm Tổ đình',
  },
  {
    url: KY_VAT_PHUONG_DANH,
    caption: 'Sổ phương danh ân nhân công đức (1953) được lưu giữ nguyên vẹn',
  },
  {
    url: KY_VAT_THU_BUT_1,
    caption: 'Thủ bút thư từ & tư liệu hành đạo quý giá của Sư Tổ (tờ 1)',
  },
  {
    url: KY_VAT_THU_BUT_2,
    caption: 'Thủ bút thư từ & tư liệu hành đạo quý giá của Sư Tổ (tờ 2)',
  },
];

const VAN_BIA_ITEMS: GalleryItem[] = [
  {
    url: VAN_BIA_DAI_SU,
    caption: 'Văn bia tưởng niệm Khai sơn Hoằng Pháp Đại sư Thích Ngộ Chân Tử',
  },
  {
    url: VAN_BIA_TIEU_SU,
    caption: 'Văn bia Tiểu sử Sư Tổ khắc đá tại Tháp Nhị Nghiêm (08/02 Kỷ Mùi – 16/10 Mậu Thìn)',
  },
  {
    url: VAN_BIA_KHAI_SON,
    caption: 'Văn bia ghi dấu công đức khai sơn tự viện & từ thiện cứu tế (1935 – 1974)',
  },
  {
    url: IMG_THAP_TO_1,
    caption: 'Bảo Tháp Nhị Nghiêm (二嚴塔) tôn trí nhục thân Sư Tổ tại Tổ đình Hoằng Pháp',
  },
  {
    url: IMG_THAP_TO_2,
    caption: 'Cổng Bảo Tháp Nhị Nghiêm trang nghiêm trong khuôn viên Tổ đình',
  },
];

const BASE_CHRONICLES: ChronicleChapter[] = [
  {
    id: 'chuong-1',
    code: '01',
    shortLabel: '1901',
    year: 'Năm 1901',
    headline: 'THÂN THẾ & NỀN NẾP NHO GIA',
    location: 'Cao Mại, Kiến Xương, Thái Bình',
    keyVirtue: 'Thâm hiểu Nho học, sớm ngộ lẽ vô thường',
    legacyMark: 'Thế danh Trần Rinh (Song thân Trần Quán – Trần Thị Phược)',
    medallionImage: IMG_THUO_MOI_TU,
    backdropImage: IMG_QUE_HUONG_1901,
    stageGallery: [
      {
        url: IMG_QUE_HUONG_1901,
        caption: 'Minh họa quê hương Thái Bình & nền nếp Nho gia thuở thiếu thời của Ngài (1901)',
        objectPosition: '16% 45%',
      },
      {
        url: IMG_THUO_MOI_TU,
        caption: 'Chân dung Sư Tổ Ngộ Chân Tử thuở mới tu hành những năm đầu thế kỷ 20',
        objectPosition: 'center 20%',
      },
    ],
    biographyDetails: [
      'Cố Lão Hòa Thượng Ngộ Chân Tử thế danh Trần Rinh, đản sinh ngày mùng 3 tháng 3 năm Tân Sửu (1901) tại thôn Cao Mại, xã Quang Hưng, huyện Kiến Xương, tỉnh Thái Bình. Thân phụ là cụ Trần Quán (gia phong Nho học, tu theo đạo Tam Giáo), thân mẫu là cụ Trần Thị Phược (Phật tử thuần thành quy y chùa La Cao).',
      'Ngài là anh cả trong gia đình có năm anh em (3 trai, 2 gái) đều một lòng hướng Phật: em trai thứ hai là cụ Trần Đinh (xuất gia tu học tại Hải Phòng), em trai thứ ba là cụ Trần Văn (giữ hương hỏa gia đình và trường trai trọn đời), hai em gái út là bà Trần Thị Nhàn và bà Trần Thị Thanh (tu hành thanh tịnh tại gia). Năm 13 tuổi, Ngài sang chùa La Cao học đạo cùng Sư tổ Quang Huy (dân gian kính gọi là Cụ Giáo Chức).',
    ],
    vowTitle: 'CĂN LÀNH TÚC DUYÊN',
    vowDetails: [
      'Gia phong Nho học cẩn nghiêm kết hợp truyền thống thuần thành Tam Bảo của song thân và năm anh em đã hun đúc nên một bậc pháp khí thiền gia vừa uyên bác đạo lý, vừa gần gũi thiết thực với đời sống nhân sinh.',
    ],
  },
  {
    id: 'chuong-2',
    code: '02',
    shortLabel: '1919',
    year: 'Năm 1919 (08/02 Kỷ Mùi)',
    headline: 'XUẤT GIA, THỌ QUY GIỚI & ĐẮC PHÁP',
    location: 'Chùa La Cao • Yên Tử • Chùa Bà Đá (Hà Nội)',
    keyVirtue: 'Thụ học Sư Tổ Quang Huy, gặp Tôn Sư Hư Không Tử thọ Quy giới',
    legacyMark: 'Tôn sư Hư Không Tử ban hiệu Ngộ Chân Tử',
    medallionImage: IMG_QUY_GIOI_1919,
    backdropImage: IMG_QUY_GIOI_1919,
    stageGallery: [
      {
        url: IMG_QUY_GIOI_1919,
        caption: 'Minh họa lễ Thế Phát xuất gia & Trao truyền Quy giới cho Sư Tổ (08/02 Kỷ Mùi)',
        objectPosition: 'center 25%',
      },
      {
        url: IMG_SU_TO_QUANG_HUY,
        caption: 'Minh họa Sư Tổ Quang Huy (Cụ Giáo Chức) — vị Tôn sư đầu tiên dìu dắt Ngài tại chùa La Cao và giới thiệu ra Yên Tử',
        objectPosition: 'center 22%',
      },
      {
        url: YT_HU_KHONG_TU_DAM_DAO,
        caption: 'Tư liệu phim: Tôn sư Hư Không Tử — bậc chân tu du hóa tha phương hành hạnh Độc giác, cảm hóa Sư Tổ Ngộ Chân Tử',
        objectPosition: 'center center',
      },
      {
        url: IMG_CU_TO_BA_DA,
        caption: 'Minh họa Cụ Tổ Chùa Bà Đá (Hà Nội) — nơi Sư Tổ đắc pháp truyền thừa',
        objectPosition: 'center 25%',
      },
    ],
    biographyDetails: [
      'Năm 13 tuổi, Ngài được diện kiến Sư tổ Quang Huy (nhân dân Thái Bình kính gọi là Cụ Giáo Chức) — bậc uy đức tu theo môn phái Đại Đạo dung hợp Tam Giáo tại chùa La Cao. Sư tổ Quang Huy đã hướng đạo cho Ngài chuyển sang nghiên cứu Phật học và giới thiệu Ngài ra chùa Yên Tử tu tập.',
      'Sau thời gian tầm sư học đạo, Ngài gặp được Tôn sư Hư Không Tử — bậc chân tu thoát tục thường du hóa tha phương theo hạnh Độc giác, chuyên giảng kinh hóa độ quần mê. Cảm mến lời giảng thanh thoát cùng dung mạo uy nghiêm của Tôn sư, vào ngày 08/02 năm Kỷ Mùi (1919), Ngài được trao truyền quy giới với pháp danh Ngộ Chân Tử, rồi đắc pháp với Cụ Tổ chùa Bà Đá (Hà Nội) và chiêm bái Yên Tử, Côn Sơn, Hương Tích.',
    ],
    vowTitle: 'SƠ TÂM KIÊN CỐ',
    vowDetails: [
      'Giới pháp thanh tịnh tiếp nhận từ chư Tổ sư miền Bắc chính là cội nguồn vững chãi làm nên oai nghi và đạo lực của Sư Tổ Ngộ Chân Tử suốt 65 hạ lạp hành đạo.',
    ],
  },
  {
    id: 'chuong-3',
    code: '03',
    shortLabel: '1927',
    year: 'Năm 1927 – 1932',
    headline: 'VÂN DU CẦU ĐẠO & TRÙNG TU GIÀ LAM MIỀN BẮC',
    location: 'Thái Bình • Hải Phòng • Hải Dương • Yên Tử',
    keyVirtue: 'Trùng hưng tự viện, khôi phục nề nếp thiền môn',
    legacyMark: 'Chùa Tây Khánh (1927), Cao Mại, Côn Sơn, Quan Âm, Úc Gián...',
    medallionImage: YT_YEN_TU_1025,
    backdropImage: YT_YEN_TU_1025,
    stageGallery: [
      {
        url: YT_YEN_TU_1025,
        caption: 'Tư liệu phim: Hành trình vân du cầu đạo nơi non thiêng Yên Tử – miền Bắc (10:25)',
        objectPosition: 'center center',
      },
      {
        url: YT_TRUNG_TU_GIA_LAM,
        caption: 'Tư liệu phim: Dấu ấn vân du trùng tu các ngôi cổ tự miền Bắc (11:33)',
        objectPosition: 'center center',
      },
      {
        url: YT_HU_KHONG_TU_DAM_DAO,
        caption: 'Tư liệu phim: Hầu cận Tôn sư Hư Không Tử đàm đạo tham thiền (11:17)',
        objectPosition: 'center center',
      },
      {
        url: YT_TINH_TOA_HANG_DA,
        caption: 'Tư liệu phim: Tĩnh tọa tu tập nơi hang đá cổ tự trong chuyến vân du (11:09)',
        objectPosition: 'center center',
      },
      {
        url: IMG_KIEN_AN_XUA,
        caption: 'Tư liệu kiến trúc chùa cổ miền Bắc gắn liền thời kỳ Kiến An – Hải Phòng',
        objectPosition: 'center center',
      },
    ],
    biographyDetails: [
      'Năm 1927, cùng song thân hiến đất dựng lại chùa Tây Khánh tại Cao Mại (Kiến Xương, Thái Bình), đặt nền móng cho mô hình Viện Dục Anh đầu tiên. Từ 1929–1932, Ngài vân du trùng tu nhiều cổ tự miền Bắc: Quan Âm (Kiến An), Úc Gián (Kiến Thụy), Quang Đẩu (An Lão).',
      'Tiếp đó là chùa Kiền Bái, chùa Côn Sơn, chùa Đỗ Xá (Chí Linh, Hải Dương), chùa Phù Cốc và chùa Khánh Vân (phủ Kiến Xương, tỉnh Thái Bình), khôi phục nề nếp tu học nơi thiền môn.',
    ],
    vowTitle: 'KHÔI PHỤC THIỀN MÔN',
    vowDetails: [
      'Những năm tháng vân du cầu đạo và trùng hưng tự viện khắp vùng đồng bằng Bắc Bộ đã tôi luyện chí nguyện độ sinh, đặt tiền đề cho sự ra đời của ngôi chùa Hoằng Pháp đầu tiên.',
    ],
  },
  {
    id: 'chuong-4',
    code: '04',
    shortLabel: '1935',
    year: 'Năm 1935 – 1953',
    headline: 'SÁNG LẬP HOẰNG PHÁP KIẾN AN, VIỆN DỤC ANH & PHỔ CHIẾU',
    location: 'Kiến An & Phổ Chiếu, Hải Phòng',
    keyVirtue: 'Khơi nguồn Tông phong, nuôi dưỡng trẻ mồ côi',
    legacyMark: 'Chùa Hoằng Pháp (1935), Viện Dục Anh (1938) & Phổ Chiếu (1953)',
    medallionImage: IMG_KIEN_AN_XUA,
    backdropImage: IMG_DUC_ANH_1943,
    stageGallery: [
      {
        url: IMG_DUC_ANH_1943,
        caption: 'Viện Dục Anh kỷ niệm Đệ Lục Chu Niên (1943) — Đạo sư Ngộ Chân Tử trình bày tiểu công nghệ',
        objectPosition: 'center center',
      },
      {
        url: IMG_KIEN_AN_XUA,
        caption: 'Ảnh tư liệu Chùa Hoằng Pháp – Kiến An (tư liệu tái lập Viện Dục Anh 1950)',
        objectPosition: 'center center',
      },
    ],
    biographyDetails: [
      'Năm 1935, Sư Tổ sáng lập ngôi chùa mang tên Hoằng Pháp tại Kiến An (Hải Phòng), chính thức đặt nền móng cho Tông phong Hoằng Pháp mang sứ mệnh truyền bá Chánh pháp rộng khắp.',
      'Đến năm 1938, thấu cảm cảnh đời cơ hàn của đồng bào dưới thời biến loạn, Ngài mở Viện Dục Anh nuôi dạy trẻ mồ côi, dạy nghề tiểu thủ công nghiệp; đến năm 1953 tiếp tục khai sơn chùa Phổ Chiếu tại Hải Phòng.',
    ],
    vowTitle: 'ĐẠO HÒA VÀO ĐỜI',
    vowDetails: [
      'Với Sư Tổ Ngộ Chân Tử, tu hành không tách rời quần chúng nhân dân: mái chùa không chỉ là nơi tụng kinh lễ bái mà còn là mái ấm chở che bao kiếp người lầm than.',
    ],
  },
  {
    id: 'chuong-5',
    code: '05',
    shortLabel: '1945',
    year: 'Năm Ất Dậu 1945',
    headline: 'BỒ TÁT HẠNH GIỮA NẠN ĐÓI LỊCH SỬ',
    location: 'Miền Bắc Việt Nam',
    keyVirtue: 'Lập Viện Dưỡng Lão, cứu tế & an táng đồng bào',
    legacyMark: 'Lấy thân làm cột chống đỡ mái nhà Phật pháp',
    medallionImage: IMG_CUU_TE_1952,
    backdropImage: IMG_BAO_TRO_1972,
    stageGallery: [
      {
        url: IMG_BAO_TRO_1972,
        caption: 'Sư Tổ cùng các ân nhân bảo trợ cô nhi và hoạt động từ thiện giáo dục',
        objectPosition: 'center 25%',
      },
      {
        url: IMG_CUU_TE_1952,
        caption: 'Ảnh tư liệu đoàn cứu tế & sinh hoạt Phật sự miền Bắc (1952)',
        objectPosition: 'center center',
      },
    ],
    biographyDetails: [
      'Giữa thảm họa nạn đói khủng khiếp năm Ất Dậu 1945, Ngài không quản hiểm nguy gian khổ, mở rộng Viện Dục Anh và lập thêm Viện Dưỡng Lão để trực tiếp phát chẩn, cứu đói đồng bào.',
      'Không dừng lại ở việc cứu người sống, Ngài còn lặng lẽ đi tìm kiếm thi thể đồng bào xấu số ven đường để đưa về an táng mộ phần tử tế, trọn vẹn nghĩa tình như đối với người thân ruột thịt.',
    ],
    vowTitle: 'BI NGUYỆN KHÔNG BIÊN GIỚI',
    vowDetails: [
      'Dấn thân giữa tận cùng khổ đau của thế sự mà tâm vẫn thanh khiết tựa hoa sen nơi bùn lầy — đó chính là minh chứng sống động nhất cho đại bi tâm của Ngài.',
    ],
  },
  {
    id: 'chuong-6',
    code: '06',
    shortLabel: '1957',
    year: 'Năm 1957 – 1974',
    headline: 'KHAI SƠN TỔ ĐÌNH HOẰNG PHÁP HÓC MÔN',
    location: 'Gia Định (Hóc Môn & Bình Chánh, TP.HCM)',
    keyVirtue: 'Chấn hưng Tịnh Độ, cứu trợ 361 nạn nhân Đồng Xoài',
    legacyMark: 'Tổ đình Hoằng Pháp (1957) & GH Đạo Tràng Thiền Học (1968)',
    medallionImage: IMG_HP_XUA,
    backdropImage: IMG_HP_XUA,
    stageGallery: [
      {
        url: IMG_HP_XUA,
        caption: 'Trụ sở Trung ương Giáo hội Đạo Tràng Thiền Học — Chùa Hoằng Pháp Hóc Môn xưa',
        objectPosition: 'center center',
      },
      {
        url: IMG_THUYET_PHAP,
        caption: 'Sư Tổ Ngộ Chân Tử thuyết giảng Chánh pháp trước Chánh điện Tam Bảo',
        objectPosition: '12% 38%',
      },
      {
        url: IMG_HP_NAY,
        caption: 'Toàn cảnh Tổ đình Hoằng Pháp khang trang ngày nay — tiếp nối mạch nguồn Tông phong',
        objectPosition: 'center center',
      },
    ],
    biographyDetails: [
      'Năm 1957, Ngài vào Nam, mua đất tại Gia Định (nay là huyện Hóc Môn, TP.HCM) để khai sơn Tổ đình Hoằng Pháp — trung tâm xiển dương Tịnh Độ và Thiền học sâu rộng bậc nhất miền Nam.',
      'Năm 1965, Ngài tiếp nhận nuôi dưỡng 361 nạn nhân chiến tranh Đồng Xoài, kiến lập khu định cư giúp dân nghèo; năm 1968 lập Giáo hội Đạo Tràng Thiền Học; năm 1974 khởi công Làng Cô nhi và Đền thờ Hùng Vương tại Bình Chánh.',
    ],
    vowTitle: 'NHỊ ĐẾ DUNG THÔNG',
    vowDetails: [
      'Ngài dạy đệ tử: tùy duyên với muôn nghìn phương tiện thiện xảo cứu đời, nhưng tuyệt đối không để tục đế nhấn chìm, luôn xứng đáng với chí hướng người con dòng họ Thích.',
    ],
  },
  {
    id: 'chuong-7',
    code: '07',
    shortLabel: '1988',
    year: 'Năm 1988 (16/10 ÂL)',
    headline: 'AN NHIÊN THỊ TỊCH & NGỌN ĐÈN TỊNH ĐỘ',
    location: 'Tổ đình Hoằng Pháp & Tùng Lâm Hòa Phúc',
    keyVirtue: 'Giới Luật làm giáp • Lục Tự Di Đà làm cứu cánh',
    legacyMark: 'Trụ thế 88 năm • 65 hạ lạp (Tháp Nhị Nghiêm)',
    medallionImage: IMG_CUOI_DOI_TANG_LE,
    backdropImage: IMG_CUOI_DOI_TANG_LE,
    stageGallery: [
      {
        url: IMG_CUOI_DOI_TANG_LE,
        caption: 'Những hình ảnh cuối đời của Sư Tổ Ngộ Chân Tử & lễ tang trang nghiêm năm Mậu Thìn (1988)',
        objectPosition: 'center 25%',
      },
      {
        url: IMG_THAP_TO_1,
        caption: 'Bảo Tháp Nhị Nghiêm (二嚴塔) tôn trí nhục thân Sư Tổ tại Tổ đình Hoằng Pháp',
        objectPosition: 'center center',
      },
      {
        url: IMG_THAP_TO_2,
        caption: 'Cổng Tháp Nhị Nghiêm trang nghiêm trong nắng sớm Tổ đình',
        objectPosition: 'center center',
      },
      {
        url: IMG_GIO_TO_35,
        caption: 'Lễ Giỗ Tổ tại Tổ đình Hoằng Pháp lần thứ 35 (16/10 Âm lịch)',
        objectPosition: 'center center',
      },
      {
        url: IMG_GIO_TO_HOA_PHUC_T10,
        caption: 'Ân đức Tổ Thầy — Chủ đề tu học tưởng niệm Sư Tổ tháng 10 ÂL tại Tùng Lâm Hòa Phúc (Lễ 12/10 ÂL)',
        objectPosition: 'center center',
      },
    ],
    biographyDetails: [
      'Lúc 13h30 ngày 24/11/1988 (16/10 Mậu Thìn), Hòa Thượng an nhiên thị tịch tại chùa Hoằng Pháp, trụ thế 88 năm, 65 hạ lạp. Nhục thân Ngài được tôn trí tại Bảo Tháp Nhị Nghiêm.',
      'Hằng năm, Tông phong thiết lễ Giỗ Tổ ngày 16/10 ÂL tại Hoằng Pháp; riêng chư Tăng Tùng lâm Hòa Phúc trang nghiêm cử hành Lễ Tưởng Niệm Sư Tổ vào ngày 12/10 ÂL làm ngày hiệp kỵ chung của Tăng chúng.',
    ],
    vowTitle: 'DI HUẤN MUÔN ĐỜI',
    vowDetails: [
      'Lấy Giới luật làm chánh niệm cho mọi thân-khẩu-ý; lấy Lục Tự Di Đà (Nam mô A Di Đà Phật) làm cứu cánh thoát ly sinh tử; lấy Lục Độ Vạn Hạnh làm phương tiện cứu khổ chúng sinh.',
    ],
  },
];

interface ScriptureWork {
  code: string;
  title: string;
  note: string;
  coverImage?: string;
}

const COMPILED_SCRIPTURES: ScriptureWork[] = [
  {
    code: '01 · KINH TỤNG',
    title: 'Kinh Nhật Tụng',
    note: 'Sư Tổ soạn riêng cho bổn tự tụng đọc hằng ngày — nền tảng khóa lễ tịnh hóa thân tâm.',
  },
  {
    code: '02 · GIỚI LUẬT',
    title: 'Nghi Luật Tu Trì Thiết Yếu',
    note: 'Tái bản Phật lịch 1975 tại Chùa Hoằng Pháp — sách gối đầu giường về nghi thức tu trì.',
    coverImage: BOOK_NGHI_LUAT,
  },
  {
    code: '03 · GIỚI LUẬT',
    title: 'Quy Giới Hành Trì',
    note: 'Cương lĩnh giữ gìn oai nghi tế hạnh — chiếc áo giáp bảo hộ người tu giữa dòng đời.',
    coverImage: BOOK_QUY_GIOI,
  },
  {
    code: '04 · NHÂN QUẢ',
    title: 'Sự Tích Nhân Quả Báo Ứng',
    note: 'Sưu tập các câu chuyện nhân quả sâu sắc giúp đại chúng sợ nhân ác, hướng tâm thiện lành.',
    coverImage: BOOK_NHAN_QUA,
  },
  {
    code: '05 · HOẰNG HÓA',
    title: 'Tuyên Dương Diệu Pháp (Quyển I)',
    note: 'Ấn tống năm Phật lịch 2512 — làm sáng tỏ diệu lý Tịnh Độ và chánh tín Phật pháp.',
    coverImage: BOOK_TUYEN_DUONG_DIEU_PHAP,
  },
  {
    code: '06 · GIẢI THOÁT',
    title: 'Đạo Giải Thoát',
    note: 'Chỉ bày con đường tu tập liễu sinh thoát tử thiết thực cho hàng Phật tử hữu duyên.',
    coverImage: BOOK_DAO_GIAI_THOAT,
  },
  {
    code: '07 · HOẰNG HÓA',
    title: 'Tuyên Dương Chánh Pháp',
    note: 'Làm sáng tỏ giáo lý Tịnh Độ và Thiền tông nhập thế, phá trừ mê tín dị đoan.',
  },
  {
    code: '08 · HÀNH ĐẠO',
    title: 'Trên Đường Hành Đạo',
    note: 'Ghi lại những lời sách tấn, tâm tư và kinh nghiệm hoằng hóa độ sinh suốt cuộc đời Ngài.',
  },
  {
    code: '09 · TÙY THÂN',
    title: 'Khóa Niệm Tùy Thân',
    note: 'Tập khóa tụng nhỏ gọn do nhóm Phật tử chùa ấn tống để hành giả dễ mang theo công phu.',
    coverImage: BOOK_KHOA_NIEM,
  },
  {
    code: '10 · SỬ LIỆU',
    title: 'Lược Sử Phật Tổ',
    note: 'Ghi chép truyền thừa chư Phật, chư Tổ để hậu học nương theo dấu chân bậc tiền nhân.',
  },
];

const THREE_PILLARS = [
  {
    label: 'CHÁNH NIỆM',
    title: 'Nghi Luật Tu Trì Thiết Yếu',
    desc: 'Lấy Giới luật làm áo giáp và thước đo cho mọi hành động, tư duy và phát ngôn.',
    coverImage: BOOK_NGHI_LUAT,
  },
  {
    label: 'CỨU CÁNH',
    title: 'Khóa Niệm Tùy Thân',
    desc: 'Chuyên cần câu niệm "Nam mô A Di Đà Phật" làm con đường tối thắng thoát ly sinh tử.',
    coverImage: BOOK_KHOA_NIEM,
  },
  {
    label: 'PHƯƠNG TIỆN',
    title: 'Lục Độ Vạn Hạnh',
    desc: 'Thực hành bố thí, trì giới, nhẫn nhục, tinh tấn, thiền định, trí tuệ — gắn liền Thanh Quy Đầu Tiên (Tôn Chỉ Đạo Tràng).',
    coverImage: BOOK_THANH_QUY,
  },
];

// Native <dialog> modal wrapper enforcing backdrop click-outside pointer guard + top-layer semantics
// Supports nonModalOverlay in LED presentation mode to prevent focus-restoration scroll jumps and keep HUD above overlay
function OdysseyNativeDialog({
  isOpen,
  onClose,
  labelledBy,
  nonModalOverlay = false,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  labelledBy: string;
  nonModalOverlay?: boolean;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (nonModalOverlay) {
      if (dialog.open) dialog.close();
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen, nonModalOverlay]);

  if (nonModalOverlay) {
    if (!isOpen) return null;
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-[#0A0604]/92 backdrop-blur-md p-4 sm:p-8"
      >
        {children}
      </div>
    );
  }

  const isOutside = (e: React.PointerEvent<HTMLDialogElement>, dialog: HTMLDialogElement) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };

  return (
    <dialog
      ref={dialogRef}
      className="odyssey-dialog"
      aria-labelledby={labelledBy}
      onClose={onClose}
      onPointerDown={(e) => {
        if (dialogRef.current) {
          pressedOutsideRef.current = isOutside(e, dialogRef.current);
        }
      }}
      onPointerUp={(e) => {
        if (dialogRef.current && pressedOutsideRef.current && isOutside(e, dialogRef.current)) {
          dialogRef.current.close();
        }
        pressedOutsideRef.current = false;
      }}
    >
      {isOpen ? children : null}
    </dialog>
  );
}

export function TieuSuSuToOdysseyView({ detail: initialDetail, slug }: Props) {
  const [topic, setTopic] = useState<GioiThieuTopicDetail>(initialDetail);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [activeDossierTab, setActiveDossierTab] = useState<'bio' | 'vow'>('bio');
  const [spotlightMode, setSpotlightMode] = useState<'artwork' | 'photo' | 'video'>('artwork');
  const [videoStartSec, setVideoStartSec] = useState<number>(599);
  const [archiveTab, setArchiveTab] = useState<'history' | 'relics' | 'steles'>('history');
  const [activeStageImgIdx, setActiveStageImgIdx] = useState<number>(0);
  const [lightboxState, setLightboxState] = useState<{
    items: GalleryItem[];
    idx: number;
    label: string;
  } | null>(null);
  const [standalonePreview, setStandalonePreview] = useState<{
    url: string;
    caption: string;
    subtitle?: string;
    note?: string;
  } | null>(null);
  const [ledHighlightTarget, setLedHighlightTarget] = useState<string | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [inlineExpanded, setInlineExpanded] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('ton-tuong-hero');
  const [heroProgress, setHeroProgress] = useState<number>(0);

  // Chế độ Trình Chiếu Màn Hình LED Sự Kiện & Tự Động Tương Tác
  const [isLedMode, setIsLedMode] = useState<boolean>(false);
  const [isLedPlaying, setIsLedPlaying] = useState<boolean>(true);
  const [ledStepIdx, setLedStepIdx] = useState<number>(0);
  const [ledSpeed, setLedSpeed] = useState<LedSpeedMode>('normal');
  const [showLedCornerQr, setShowLedCornerQr] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [qrPublicUrl, setQrPublicUrl] = useState<string>('https://tunglamhoaphuc.com/gioi-thieu/tieu-su-su-to');

  const prefersReducedMotion = useReducedMotion();
  const topicSlug = slug || initialDetail?.slug || initialDetail?.id || 'tieu-su-su-to';
  const heroRef = useRef<HTMLDivElement>(null);
  const chronicleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('led') === '1' || params.get('mode') === 'led') {
      setIsLedMode(true);
      setIsLedPlaying(true);
    }
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      setQrPublicUrl(`${origin}/gioi-thieu/tieu-su-su-to`);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('odyssey-led-fullscreen', isLedMode);
    return () => {
      document.body.classList.remove('odyssey-led-fullscreen');
    };
  }, [isLedMode]);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Browser blocked fullscreen request
    }
  }, []);

  const handleEnterLedMode = useCallback(() => {
    setIsLedMode(true);
    setIsLedPlaying(true);
    setLedStepIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleExitLedMode = useCallback(() => {
    setIsLedMode(false);
    setIsLedPlaying(false);
    setStandalonePreview(null);
    setLightboxState(null);
    setIsReaderOpen(false);
    setLedHighlightTarget(null);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Pinned viewport scroll progress (0.0 -> 1.0) matching Bảo Tượng Phật Giáo detail layout
  useEffect(() => {
    if (prefersReducedMotion) {
      setHeroProgress(0);
      return;
    }
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const totalDist = heroRef.current.offsetHeight - window.innerHeight;
      if (totalDist > 0) {
        const scrolled = -rect.top;
        const p = Math.min(Math.max(scrolled / totalDist, 0), 1);
        setHeroProgress(p);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (initialDetail) {
      setTopic(initialDetail);
    }
  }, [initialDetail]);

  // Chỉ tải làm mới khi có ?preview=1 để tránh 1.000+ người dự lễ gọi API WordPress đồng thời
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview') !== '1') return;

    let isMounted = true;
    async function loadDynamicTopic() {
      if (!topicSlug) return;
      try {
        const res = await fetch(`/api/admin/gioi-thieu/${topicSlug}?sync=true`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && json.topic) {
            setTopic(json.topic);
          }
        }
      } catch {
        // Fallback smoothly to ISR initialDetail
      }
    }
    loadDynamicTopic();
    return () => {
      isMounted = false;
    };
  }, [topicSlug]);

  // Track active scroll section for the floating telemetry rail
  useEffect(() => {
    const sectionIds = ['ton-tuong-hero', 'khoi-nguon', 'chan-dung', 'hanh-trinh', 'kinh-sach', 'thanh-tich'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: [0.25, 0.5], rootMargin: '-15% 0px -35% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Merge live admin milestones gracefully into our 6 structured Odyssey chapters
  const chapters = useMemo<ChronicleChapter[]>(() => {
    const liveMilestones = topic?.milestones || [];
    return BASE_CHRONICLES.map((base, idx) => {
      const m = liveMilestones[idx];
      if (!m) return base;
      return {
        ...base,
        year: m.year || base.year,
        headline: m.title ? m.title.toUpperCase() : base.headline,
        biographyDetails: m.description
          ? [m.description, ...base.biographyDetails.slice(1)]
          : base.biographyDetails,
      };
    });
  }, [topic?.milestones]);

  // Merge live galleryImages + authentic Sư Tổ archives without duplicates
  const galleryItems = useMemo<GalleryItem[]>(() => {
    const defaults: GalleryItem[] = [
      {
        url: IMG_THUO_MOI_TU,
        caption: 'Sư Tổ Ngộ Chân Tử lúc mới tu hành những năm đầu của thế kỷ 20',
        subtitle: 'Tư liệu Hiếm Thời Trẻ',
      },
      {
        url: IMG_SPOTLIGHT_HOA_PHUC,
        caption: 'Di ảnh thờ Sư Tổ trong Lễ Kỷ Niệm Ngày Sinh tại Tùng Lâm Hòa Phúc',
        subtitle: 'Kỷ niệm Ngày Sinh Sư Tổ',
      },
      {
        url: IMG_ARCHIVE_PORTRAIT,
        caption: 'Chân dung lịch sử Hòa thượng Thích Ngộ Chân Tử (1901 – 1988)',
        subtitle: 'Kho ảnh Cao Tăng Việt Nam',
      },
      {
        url: IMG_DUC_ANH_1943,
        caption: 'Viện Dục Anh kỷ niệm Đệ Lục Chu Niên (1943) — Đạo sư Ngộ Chân Tử trình bày tiểu công nghệ',
        subtitle: 'Viện Dục Anh Kiến An 1943',
      },
      {
        url: GAL_KHAT_SI_THAM,
        caption: 'Hòa thượng Giác Tường và chư Tăng Hệ phái Khất Sĩ về thăm Sư Tổ',
        subtitle: 'Triển lãm 12/10/2021',
      },
      {
        url: GAL_CUNG_DUONG_1986,
        caption: 'Sư Tổ cúng dường Trường Cao cấp Phật học năm 1986',
        subtitle: 'Phật sự Giáo dục Tăng tài',
      },
      {
        url: GAL_VINH_NGHIEM,
        caption: 'Sư Tổ cúng dường Trường hạ Chùa Vĩnh Nghiêm, TP.HCM',
        subtitle: 'Hộ trì Chư Tăng An Cư',
      },
      {
        url: GAL_CHU_TON_DUC_HP,
        caption: 'Kỷ niệm chư Tôn đức HT. Thích Thanh Kiểm, HT. Thích Trí Hải, Sư Tổ và HT. Thích Trí Chơn',
        subtitle: 'Chư Tôn Đức Chứng Minh',
      },
      {
        url: IMG_THAP_TO_1,
        caption: 'Bảo Tháp Nhị Nghiêm (二嚴塔) tôn trí nhục thân Sư Tổ tại Tổ đình Hoằng Pháp',
        subtitle: 'Tháp Nhị Nghiêm',
      },
      {
        url: IMG_GIO_TO_35,
        caption: 'Lễ Giỗ Tổ tại Tổ đình Hoằng Pháp lần thứ 35 (16/10 Âm lịch)',
        subtitle: 'Tưởng Niệm Ân Đức Tổ Thầy',
      },
    ];

    const merged: GalleryItem[] = [];
    const seen = new Set<string>();

    [...(topic?.galleryImages || []), ...defaults].forEach((item) => {
      if (item?.url && !seen.has(item.url)) {
        seen.add(item.url);
        merged.push({
          url: item.url,
          caption: item.caption || 'Tư liệu Sư Tổ Ngộ Chân Tử',
          subtitle:
            'subtitle' in item && typeof item.subtitle === 'string'
              ? item.subtitle
              : 'Lưu trữ Tùng Lâm Hòa Phúc',
        });
      }
    });

    return merged.slice(0, 10);
  }, [topic?.galleryImages]);

  const activeChapter = chapters[activeChapterIdx] || chapters[0];
  const activeStagePhoto: ChapterStageImage =
    activeChapter.stageGallery?.[activeStageImgIdx] || {
      url: activeChapter.backdropImage,
      caption: activeChapter.headline,
    };
  const activeArchiveItems =
    archiveTab === 'history' ? galleryItems : archiveTab === 'relics' ? KY_VAT_ITEMS : VAN_BIA_ITEMS;
  const activeArchiveLabel =
    archiveTab === 'history'
      ? 'HÌNH ẢNH LỊCH SỬ SƯ TỔ'
      : archiveTab === 'relics'
      ? 'KỶ VẬT CỦA SƯ TỔ'
      : 'VĂN BIA TƯỞNG NIỆM & BẢO THÁP';
  const otherTopics = useMemo(
    () => Object.values(GIOI_THIEU_DETAILS).filter((t) => t.id !== topic.id && t.slug !== topic.slug),
    [topic.id, topic.slug]
  );

  const handleSelectChapter = useCallback((idx: number) => {
    setActiveChapterIdx(idx);
    setActiveDossierTab('bio');
    setActiveStageImgIdx(0);
  }, []);

  const handleStepChapter = useCallback(
    (delta: number) => {
      setActiveChapterIdx((prev) => (prev + delta + chapters.length) % chapters.length);
      setActiveDossierTab('bio');
      setActiveStageImgIdx(0);
    },
    [chapters.length]
  );

  const scrollToSection = useCallback(
    (id: string, block: ScrollLogicalPosition = 'start') => {
      if (id === 'ton-tuong-hero-top') {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block });
      }
    },
    [prefersReducedMotion]
  );

  // Kịch bản Trình Chiếu Màn Hình LED Tự Động Toàn Phần (Lên/xuống nhịp nhàng, tự đọc Karaoke, kết thúc bằng phim tư liệu)
  const ledSteps = useMemo(() => {
    const steps: Array<{
      label: string;
      sectionId: string;
      scrollBlock?: ScrollLogicalPosition;
      durationMs: number;
      waitForComplete?: boolean;
      action?: () => void;
    }> = [
      {
        label: 'Tôn Dung Sư Tổ Ngộ Chân Tử (1901 – 1988)',
        sectionId: 'ton-tuong-hero-top',
        scrollBlock: 'start',
        durationMs: 5000,
        action: () => {
          setStandalonePreview(null);
          setLightboxState(null);
          setIsReaderOpen(false);
          setLedHighlightTarget(null);
          setSpotlightMode('artwork');
        },
      },
      {
        label: 'Khởi Nguồn Ánh Sáng Hoằng Pháp',
        sectionId: 'khoi-nguon',
        scrollBlock: 'center',
        durationMs: 6000,
      },
      {
        label: 'Di Ảnh Sư Tổ Tại Tùng Lâm Hòa Phúc',
        sectionId: 'chan-dung-stage',
        scrollBlock: 'center',
        durationMs: 5000,
        action: () => setSpotlightMode('artwork'),
      },
      {
        label: 'Chân Dung Lịch Sử Tổ Đình Hoằng Pháp',
        sectionId: 'chan-dung-stage',
        scrollBlock: 'center',
        durationMs: 5000,
        action: () => setSpotlightMode('photo'),
      },
      {
        label: 'Di Huấn Quan Trọng Nhất Của Sư Tổ',
        sectionId: 'di-huan-tablet',
        scrollBlock: 'center',
        durationMs: 7500,
      },
    ];

    // Hành Trình Đạo Nghiệp (01 -> 07): Lên chọn nút năm -> Nhảy xuống xem hết ảnh -> Lại lên chọn năm tiếp
    chapters.forEach((chapter, cIdx) => {
      steps.push({
        label: `Chọn Mốc ${chapter.shortLabel} — Chương ${chapter.code}: ${chapter.headline}`,
        sectionId: 'hanh-trinh-selector',
        scrollBlock: 'center',
        durationMs: 2300,
        action: () => {
          setActiveChapterIdx(cIdx);
          setActiveStageImgIdx(0);
          setActiveDossierTab('bio');
          setLedHighlightTarget(`chapter-${cIdx}`);
        },
      });

      const slides =
        chapter.stageGallery && chapter.stageGallery.length > 0 ? chapter.stageGallery : [null];
      slides.forEach((_, sIdx) => {
        steps.push({
          label: `Chương ${chapter.code} (${chapter.shortLabel}) · Ảnh ${sIdx + 1}/${slides.length}`,
          sectionId: 'hanh-trinh-stage',
          scrollBlock: 'center',
          durationMs: sIdx === 0 ? 5000 : 4000,
          action: () => {
            setActiveChapterIdx(cIdx);
            setActiveStageImgIdx(sIdx);
            setActiveDossierTab(sIdx === slides.length - 1 && slides.length > 1 ? 'vow' : 'bio');
            setLedHighlightTarget(`stage-thumb-${sIdx}`);
          },
        });
      });
    });

    // Di Sản Kinh Sách (7 đầu sách có ảnh bìa): Rê tới nút kính lúp -> Phóng to đọc tên & chú giải -> Bấm X đóng
    const featuredBooks = [
      {
        coverImage: BOOK_NGHI_LUAT,
        title: 'Nghi Luật Tu Trì Thiết Yếu',
        code: '02 · GIỚI LUẬT',
        note: 'Tái bản Phật lịch 1975 tại Chùa Hoằng Pháp — sách gối đầu giường về nghi thức tu trì.',
      },
      {
        coverImage: BOOK_KHOA_NIEM,
        title: 'Khóa Niệm Tùy Thân',
        code: '09 · TÙY THÂN',
        note: 'Tập khóa tụng nhỏ gọn do nhóm Phật tử chùa ấn tống để hành giả dễ mang theo công phu.',
      },
      {
        coverImage: BOOK_THANH_QUY,
        title: 'Thanh Quy Đầu Tiên (Tôn Chỉ Đạo Tràng)',
        code: 'PHƯƠNG TIỆN · LỤC ĐỘ VẠN HẠNH',
        note: 'Thực hành bố thí, trì giới, nhẫn nhục, tinh tấn, thiền định, trí tuệ — gắn liền Thanh Quy Đầu Tiên.',
      },
      {
        coverImage: BOOK_QUY_GIOI,
        title: 'Quy Giới Hành Trì',
        code: '03 · GIỚI LUẬT',
        note: 'Cương lĩnh giữ gìn oai nghi tế hạnh — chiếc áo giáp bảo hộ người tu giữa dòng đời.',
      },
      {
        coverImage: BOOK_NHAN_QUA,
        title: 'Sự Tích Nhân Quả Báo Ứng',
        code: '04 · NHÂN QUẢ',
        note: 'Sưu tập các câu chuyện nhân quả sâu sắc giúp đại chúng sợ nhân ác, hướng tâm thiện lành.',
      },
      {
        coverImage: BOOK_TUYEN_DUONG_DIEU_PHAP,
        title: 'Tuyên Dương Diệu Pháp (Quyển I)',
        code: '05 · HOẰNG HÓA',
        note: 'Ấn tống năm Phật lịch 2512 — làm sáng tỏ diệu lý Tịnh Độ và chánh tín Phật pháp.',
      },
      {
        coverImage: BOOK_DAO_GIAI_THOAT,
        title: 'Đạo Giải Thoát',
        code: '06 · GIẢI THOÁT',
        note: 'Chỉ bày con đường tu tập liễu sinh thoát tử thiết thực cho hàng Phật tử hữu duyên.',
      },
    ];

    steps.push({
      label: 'Di Sản Kinh Sách & Thập Đại Tác Phẩm',
      sectionId: 'kinh-sach',
      scrollBlock: 'center',
      durationMs: 2800,
      action: () => {
        setStandalonePreview(null);
        setLightboxState(null);
        setLedHighlightTarget(null);
      },
    });

    featuredBooks.forEach((book) => {
      steps.push({
        label: `Phóng To Kinh Sách: ${book.title}`,
        sectionId: 'kinh-sach',
        scrollBlock: 'center',
        durationMs: 1200,
        action: () => {
          setStandalonePreview(null);
          setLedHighlightTarget(`book-${book.coverImage}`);
        },
      });
      steps.push({
        label: `Đang Đọc Tác Phẩm: ${book.title}`,
        sectionId: 'kinh-sach',
        scrollBlock: 'center',
        durationMs: 4500,
        action: () => {
          setLedHighlightTarget(`book-${book.coverImage}`);
          setStandalonePreview({
            url: book.coverImage,
            caption: book.title,
            subtitle: book.code,
            note: book.note,
          });
        },
      });
    });

    steps.push({
      label: 'Hoàn Tất Phần Kinh Sách — Chuyển Sang Thánh Tích',
      sectionId: 'kinh-sach',
      scrollBlock: 'center',
      durationMs: 1100,
      action: () => {
        setStandalonePreview(null);
        setLedHighlightTarget(null);
      },
    });

    // Thánh Tích · Kỷ Vật · Văn Bia Tưởng Niệm (3 cụm): Chọn Tab -> Sáng từng khung tròn -> Phóng to ảnh -> Đóng X
    const archiveClusters: Array<{
      key: 'history' | 'relics' | 'steles';
      label: string;
      items: GalleryItem[];
      openMs: number;
    }> = [
      {
        key: 'history',
        label: 'HÌNH ẢNH LỊCH SỬ SƯ TỔ',
        items: galleryItems,
        openMs: 3500,
      },
      {
        key: 'relics',
        label: 'KỶ VẬT CỦA SƯ TỔ',
        items: KY_VAT_ITEMS,
        openMs: 3800,
      },
      {
        key: 'steles',
        label: 'VĂN BIA TƯỞNG NIỆM & BẢO THÁP',
        items: VAN_BIA_ITEMS,
        openMs: 5000,
      },
    ];

    archiveClusters.forEach((cluster) => {
      steps.push({
        label: `Chuyển Mục: ${cluster.label}`,
        sectionId: 'thanh-tich',
        scrollBlock: 'center',
        durationMs: 2400,
        action: () => {
          setLightboxState(null);
          setArchiveTab(cluster.key);
          setLedHighlightTarget(`tab-${cluster.key}`);
        },
      });

      cluster.items.forEach((item, idx) => {
        steps.push({
          label: `${cluster.label} · Chọn Ảnh ${idx + 1}/${cluster.items.length}`,
          sectionId: 'thanh-tich',
          scrollBlock: 'center',
          durationMs: 1000,
          action: () => {
            setLightboxState(null);
            setArchiveTab(cluster.key);
            setLedHighlightTarget(`archive-${cluster.key}-${idx}`);
          },
        });
        steps.push({
          label: `${cluster.label} (${idx + 1}/${cluster.items.length}): ${item.caption}`,
          sectionId: 'thanh-tich',
          scrollBlock: 'center',
          durationMs: cluster.openMs,
          action: () => {
            setArchiveTab(cluster.key);
            setLedHighlightTarget(`archive-${cluster.key}-${idx}`);
            setLightboxState({
              items: cluster.items,
              idx,
              label: cluster.label,
            });
          },
        });
      });

      steps.push({
        label: `Đóng Chi Tiết ${cluster.label}`,
        sectionId: 'thanh-tich',
        scrollBlock: 'center',
        durationMs: 1000,
        action: () => {
          setLightboxState(null);
          setLedHighlightTarget(null);
        },
      });
    });

    // Đọc Toàn Văn Cuộc Đời Sư Tổ (Giọng đọc tiếng Việt + Chạy chữ Karaoke)
    steps.push(
      {
        label: 'Mở Toàn Văn Tiểu Sử Cuộc Đời Sư Tổ',
        sectionId: 'kinh-sach',
        scrollBlock: 'center',
        durationMs: 1500,
        action: () => {
          setLightboxState(null);
          setStandalonePreview(null);
          setIsReaderOpen(false);
          setLedHighlightTarget('open-full-reader');
        },
      },
      {
        label: 'Đọc Toàn Văn Cuộc Đời Sư Tổ (Karaoke)',
        sectionId: 'kinh-sach',
        scrollBlock: 'center',
        durationMs: 600000,
        waitForComplete: true,
        action: () => {
          setLedHighlightTarget('open-full-reader');
          setIsReaderOpen(true);
        },
      },
      {
        label: 'Hoàn Tất Toàn Văn Tiểu Sử — Chuẩn Bị Chiếu Phim Tư Liệu',
        sectionId: 'kinh-sach',
        scrollBlock: 'center',
        durationMs: 1000,
        action: () => {
          setIsReaderOpen(false);
          setLedHighlightTarget(null);
        },
      },
      // Phân đoạn cuối cùng: Bấm Xem Clip Phim Tư Liệu Cuộc Đời Sư Tổ
      {
        label: 'Chọn Nút Xem Clip Phim Tư Liệu Về Sư Tổ',
        sectionId: 'chan-dung-stage',
        scrollBlock: 'center',
        durationMs: 1600,
        action: () => {
          setIsReaderOpen(false);
          setSpotlightMode('artwork');
          setLedHighlightTarget('play-doc-video');
        },
      },
      {
        label: 'Phát Clip Phim Tư Liệu Cuộc Đời & Đạo Nghiệp Sư Tổ',
        sectionId: 'chan-dung-stage',
        scrollBlock: 'center',
        durationMs: 180000,
        action: () => {
          setLedHighlightTarget(null);
          setVideoStartSec(599);
          setSpotlightMode('video');
        },
      }
    );

    return steps;
  }, [chapters, galleryItems]);

  useEffect(() => {
    if (!isLedMode) return;
    const current = ledSteps[ledStepIdx % ledSteps.length];
    if (!current) return;

    current.action?.();
    const rafId = requestAnimationFrame(() => {
      scrollToSection(current.sectionId, current.scrollBlock || 'center');
    });

    if (!isLedPlaying || current.waitForComplete) {
      return () => cancelAnimationFrame(rafId);
    }

    const mult = ledSpeed === 'slow' ? 1.45 : ledSpeed === 'fast' ? 0.65 : 1;
    const timer = setTimeout(() => {
      setLedStepIdx((prev) => (prev + 1) % ledSteps.length);
    }, Math.round(current.durationMs * mult));

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [isLedMode, isLedPlaying, ledStepIdx, ledSpeed, ledSteps, scrollToSection]);

  const pinnedHeroImage =
    (topic as unknown as { pinnedHeroImage?: string })?.pinnedHeroImage || IMG_PINNED_HERO_SU_TO;
  const [heroImgSrc, setHeroImgSrc] = useState<string>(pinnedHeroImage);
  useEffect(() => {
    setHeroImgSrc(pinnedHeroImage);
  }, [pinnedHeroImage]);

  const heroOpacity = prefersReducedMotion ? 1 : Math.max(0, 1 - heroProgress / 0.7);
  const heroTranslateY = prefersReducedMotion ? 0 : heroProgress * 120;
  const bgOpacity = prefersReducedMotion ? 0.65 : Math.max(0.2, 0.72 - heroProgress * 0.45);
  const bgScale = prefersReducedMotion ? 1 : 1 + heroProgress * 0.08;

  const spotlightImage =
    spotlightMode === 'artwork'
      ? IMG_SPOTLIGHT_HOA_PHUC
      : topic.portraitImage || IMG_ARCHIVE_PORTRAIT;

  const quoteLines =
    topic.quoteContent && topic.quoteContent.length > 0
      ? topic.quoteContent
      : [
          'Hãy tinh tấn tu hành, chuyên cần niệm Phật đừng để vọng niệm theo trần cảnh.',
          'Vẫn biết nhị đế phải dung thông, nhưng trong cái tùy duyên với muôn nghìn phương tiện thiện xảo ấy,',
          'các con đừng để bị nhận chìm trong tục đế mà phải như đóa sen thanh khiết nơi vùng bùn lầy nước đục.',
          'Tuy bất cứ hoàn cảnh hay trạng huống nào vẫn xứng đáng với con dòng họ Thích, đừng phản bội lại lý tưởng của chính mình.',
        ];

  return (
    <div
      style={{ fontFamily: "'UTM Avo', sans-serif" }}
      className={`min-h-[100dvh] bg-[#140C07] text-[#e3d2c1] selection:bg-[#F2C14E] selection:text-black flex flex-col justify-between relative ${
        isLedMode ? 'odyssey-led-mode' : ''
      }`}
    >
      {/* ── FLOATING EVENT ACTION BAR (TRÌNH CHIẾU LED & MÃ QR SỰ KIỆN) ── */}
      {!isLedMode && (
        <div className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={handleEnterLedMode}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#F2C14E]/60 bg-[#1A1009]/92 text-[#FFDE59] text-[11px] font-bold uppercase tracking-wider shadow-[0_8px_28px_rgba(0,0,0,0.75)] backdrop-blur-md hover:bg-[#F2C14E] hover:text-black transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE59]"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Trình Chiếu LED</span>
          </button>
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#F2C14E]/45 bg-[#1A1009]/92 text-[#FFE5A3] text-[11px] font-bold uppercase tracking-wider shadow-[0_8px_28px_rgba(0,0,0,0.75)] backdrop-blur-md hover:border-[#FFDE59] hover:text-[#FFDE59] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE59]"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Mã QR Sự Kiện</span>
          </button>
        </div>
      )}

      {/* ── FLOATING ODYSSEY TELEMETRY CHAPTER RAIL (DESKTOP) ── */}
      <nav
        aria-label="Mục lục trang Tiểu Sử Sư Tổ"
        className={`hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 ${
          isLedMode ? 'opacity-65' : ''
        }`}
      >
        {[
          { id: 'ton-tuong-hero', label: '00 · Tôn Dung' },
          { id: 'khoi-nguon', label: '01 · Khởi Nguồn' },
          { id: 'chan-dung', label: '02 · Pháp Ngữ' },
          { id: 'hanh-trinh', label: '03 · Đạo Nghiệp' },
          { id: 'kinh-sach', label: '04 · Kinh Sách' },
          { id: 'thanh-tich', label: '05 · Thánh Tích' },
        ].map((navItem) => {
          const isActive = activeSection === navItem.id;
          return (
            <button
              key={navItem.id}
              type="button"
              onClick={() => scrollToSection(navItem.id)}
              className={`group flex items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors cursor-pointer py-1 px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE59] ${
                isActive ? 'text-[#FFDE59] font-bold' : 'text-[#e3d2c1]/45 hover:text-[#F2C14E]'
              }`}
            >
              <span className="opacity-85 group-hover:opacity-100 transition-opacity">{navItem.label}</span>
              <span
                className={`block h-2.5 w-2.5 rotate-45 border transition-all ${
                  isActive
                    ? 'bg-[#FFDE59] border-[#FFDE59] scale-110 shadow-[0_0_10px_rgba(255,222,89,0.85)]'
                    : 'border-[#F2C14E]/45 bg-transparent group-hover:border-[#FFDE59]'
                }`}
              />
            </button>
          );
        })}
      </nav>

      <div className="flex-1 overflow-x-clip">
        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 0: PINNED 100DVH HERO VIEWPORT (BẢO TƯỢNG PHẬT GIÁO STYLE)
           ══════════════════════════════════════════════════════════════════════ */}
        <section id="ton-tuong-hero" ref={heroRef} className="relative w-full h-[118dvh] sm:h-[125dvh]">
          <div className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[#1D120B] flex flex-col justify-end items-center text-center px-4 pb-6 pt-20 sm:p-12 select-none">
            {/* Warm Sepia Ambient Radial Glow for Widescreen LED Blending */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(96,60,32,0.45)_0%,rgba(29,18,11,0.92)_58%,#140C07_100%)] pointer-events-none" />

            {/* Centered Vertical Portrait Container with Next.js Image Optimization & Seamless Feathering */}
            <div
              className={`absolute inset-0 flex justify-center pointer-events-none transition-transform duration-75 ${
                isLedMode ? 'pt-2' : 'pt-8 md:pt-14'
              }`}
              style={{
                opacity: bgOpacity,
                transform: `scale(${bgScale}) translateY(${prefersReducedMotion ? 0 : heroProgress * 30}px)`,
              }}
            >
              <div className="odyssey-hero-feather-x relative w-full h-full md:w-auto md:max-w-full md:aspect-[15000/21941]">
                <Image
                  src={heroImgSrc}
                  alt={topic.title || 'Sư Tổ Ngộ Chân Tử'}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 760px"
                  className="odyssey-hero-feather-y object-cover object-[center_16%] md:object-top"
                  onError={() => {
                    if (heroImgSrc !== FALLBACK_CHUA_IMG) setHeroImgSrc(FALLBACK_CHUA_IMG);
                  }}
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#140C07]/55 via-transparent to-[#140C07] pointer-events-none" />

            {/* Decorative Corner Anchors */}
            <div className="absolute top-24 left-6 sm:left-10 w-6 h-6 border-t-2 border-l-2 border-[#F2C14E]/60 pointer-events-none hidden sm:block" />
            <div className="absolute top-24 right-6 sm:right-10 w-6 h-6 border-t-2 border-r-2 border-[#F2C14E]/60 pointer-events-none hidden sm:block" />
            <div className="absolute bottom-14 left-6 sm:left-10 w-6 h-6 border-b-2 border-l-2 border-[#F2C14E]/60 pointer-events-none hidden sm:block" />
            <div className="absolute bottom-14 right-6 sm:right-10 w-6 h-6 border-b-2 border-r-2 border-[#F2C14E]/60 pointer-events-none hidden sm:block" />

            {/* Top Action Buttons: Back Link (avoiding mobile hanging logo) & Quick QR Button */}
            {!isLedMode && (
              <>
                <Link
                  href="/gioi-thieu"
                  className="absolute top-[106px] left-4 sm:top-20 sm:left-12 z-20 inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 min-h-[38px] rounded-full border border-[#F2C14E]/45 bg-[#1C110A]/85 text-[#F2C14E] text-[11px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#F2C14E] hover:text-black transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE59]"
                  style={{ opacity: Math.max(0.2, heroOpacity) }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Tất Cả Mục Giới Thiệu</span>
                  <span className="xs:hidden">Giới Thiệu</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="md:hidden absolute top-[106px] right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-full border border-[#F2C14E]/45 bg-[#1C110A]/85 text-[#FFE5A3] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F2C14E] hover:text-black transition-all shadow-lg cursor-pointer"
                  style={{ opacity: Math.max(0.2, heroOpacity) }}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Mã QR</span>
                </button>
              </>
            )}

            {/* Monumental Title, Golden Diamond Divider & Subtitle (Fades on scroll down) */}
            <div
              className="relative z-10 max-w-5xl mx-auto space-y-2.5 sm:space-y-3 px-2 sm:px-4 mb-6 sm:mb-10 will-change-transform transition-all duration-75"
              style={{
                opacity: heroOpacity,
                transform: `translateY(${heroTranslateY}px)`,
                pointerEvents: heroOpacity < 0.1 ? 'none' : 'auto',
              }}
            >
              <h1
                style={{
                  fontFamily: "'UTM Niagara', sans-serif",
                  fontSize: 'clamp(2.85rem, 1.5rem + 5vw, 7rem)',
                }}
                className="font-normal text-[#FFE5A3] uppercase tracking-[0.06em] drop-shadow-[0_4px_30px_rgba(242,193,78,0.95)] leading-none py-1"
              >
                SƯ TỔ NGỘ CHÂN TỬ
              </h1>

              {/* Dấu gạch ngang vàng phân định có chóp kim cương ◇ ở giữa */}
              <div className="w-full max-w-2xl mx-auto flex items-center justify-center my-2.5 sm:my-4">
                <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#F2C14E]/80 to-[#F2C14E]" />
                <div className="w-3 h-3 border-r-2 border-b-2 border-[#F2C14E] rotate-45 -mt-1 mx-3 shrink-0 shadow-[0_0_12px_#F2C14E]" />
                <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#F2C14E]/80 to-[#F2C14E]" />
              </div>

              <p
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-xs sm:text-lg md:text-xl tracking-[0.18em] sm:tracking-[0.22em] text-[#FFE5A3] uppercase font-normal max-w-3xl mx-auto px-2 sm:px-4 leading-relaxed text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              >
                LÃO TỔ SƯ KHAI SƠN TÔNG PHONG HOẰNG PHÁP
              </p>
            </div>

            {/* Scroll Indicator */}
            <button
              type="button"
              onClick={() => scrollToSection('khoi-nguon')}
              className="relative z-10 pb-2 sm:pb-4 flex flex-col items-center gap-1.5 text-[#FFE5A3] opacity-85 hover:opacity-100 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE59] rounded-lg px-3 py-1"
              style={{ opacity: prefersReducedMotion ? 0.9 : Math.max(0, 1 - heroProgress / 0.3) }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "'UTM Avo', sans-serif" }}>
                CUỘN XUỐNG KHÁM PHÁ
              </span>
              <div className={`flex flex-col items-center -space-y-1.5 ${prefersReducedMotion ? '' : 'animate-bounce'}`}>
                <ChevronDown className="w-4 h-4 text-[#F2C14E]" />
                <ChevronDown className="w-4 h-4 text-[#F2C14E]/60" />
              </div>
            </button>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 1: ODYSSEY PROLOGUE & SACRED EMBLEM ("KHỞI NGUỒN ÁNH SÁNG")
           ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="khoi-nguon"
          className="relative py-24 md:py-28 w-full flex flex-col justify-center overflow-hidden bg-[#140C07] border-t border-[#F2C14E]/20"
        >
          {/* Full-Bleed Atmospheric Backdrop */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={IMG_ARTWORK_BAO_TUONG}
              alt="Họa phẩm Tổ sư Ngộ Chân Tử"
              loading="lazy"
              className="w-full h-full object-cover object-[center_25%] opacity-25 scale-[1.02]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_CHUA_IMG;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#140C07] via-[#140C07]/65 to-[#140C07]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(242,193,78,0.14),transparent_60%)]" />
            <div className="absolute inset-0 odyssey-matrix-bg opacity-35" />
          </div>

          {/* Rotating Orbital Sacred Mandala Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[520px] h-[520px] md:w-[760px] md:h-[760px] rounded-full border border-[#F2C14E]/15 odyssey-orbit-cw" />
            <div className="absolute w-[380px] h-[380px] md:w-[560px] md:h-[560px] rounded-full border border-dashed border-[#F2C14E]/20 odyssey-orbit-ccw" />
          </div>

          {/* Prologue Foreground */}
          <div className="relative z-10 max-w-[1160px] mx-auto px-4 md:px-8 w-full flex flex-col items-center text-center">
            {/* Odyssey-Style Central Emblem Badge */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="relative mb-5 flex items-center justify-center"
            >
              <div className="w-20 h-24 md:w-24 md:h-28 flex items-center justify-center relative">
                <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_24px_rgba(242,193,78,0.55)]">
                  <polygon
                    points="50,4 92,26 92,94 50,116 8,94 8,26"
                    fill="#1D120B"
                    stroke="#F2C14E"
                    strokeWidth="2.5"
                  />
                  <polygon
                    points="50,14 82,31 82,89 50,106 18,89 18,31"
                    fill="none"
                    stroke="#FFE5A3"
                    strokeOpacity="0.45"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M50 22 C52 48, 56 54, 78 60 C56 66, 52 72, 50 98 C48 72, 44 66, 22 60 C44 54, 48 48, 50 22 Z"
                    fill="#FFDE59"
                  />
                  <circle cx="50" cy="60" r="6" fill="#1D120B" stroke="#FFDE59" strokeWidth="2" />
                </svg>
              </div>
            </motion.div>

            {/* Overline Tag */}
            <div className="text-[#F2C14E] text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase mb-2">
              KHỞI NGUỒN ÁNH SÁNG HOẰNG PHÁP · 1901 – 1988
            </div>

            {/* Section Display Headline */}
            <h2
              style={{ fontFamily: "'UTM Niagara', sans-serif" }}
              className="text-4xl sm:text-6xl md:text-7xl font-normal text-[#ffde59] uppercase tracking-[0.06em] drop-shadow-[0_0_24px_rgba(242,193,78,0.45)] leading-[1.02]"
            >
              NGỌN ĐÈN TỊNH ĐỘ &amp; HẠNH NGUYỆN BỒ TÁT
            </h2>

            {/* Centered Odyssey Lore Intro */}
            <div className="mt-7 max-w-3xl mx-auto space-y-4">
              <div className="h-[1px] w-44 mx-auto bg-gradient-to-r from-transparent via-[#F2C14E] to-transparent" />
              <p
                style={{ fontFamily: "'UTM Avo', sans-serif" }}
                className="text-sm sm:text-base md:text-[17px] text-[#e3d2c1]/95 leading-relaxed text-balance"
              >
                {topic.overviewSummary}
              </p>
            </div>

            {/* Action Controls */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('hanh-trinh')}
                className="odyssey-bevel-sm inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#F2C14E] text-[#140C07] text-xs sm:text-sm font-extrabold uppercase tracking-[0.14em] hover:bg-[#FFDE59] transition-colors cursor-pointer shadow-[0_0_25px_rgba(242,193,78,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Compass className="w-4 h-4" />
                <span>Khám Phá Hành Trình Đạo Nghiệp</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReaderOpen(true)}
                className="odyssey-bevel-sm inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#24160D] border border-[#F2C14E]/60 text-[#FFDE59] text-xs sm:text-sm font-bold uppercase tracking-[0.14em] hover:bg-[#F2C14E]/15 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE59]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Đọc Toàn Văn Tiểu Sử</span>
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 2: SPOTLIGHT PORTRAIT BEVEL FRAME & GOLDEN PHÁP NGỮ
           ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="chan-dung"
          className={`relative overflow-hidden bg-gradient-to-b from-[#140C07] via-[#1B1009] to-[#140C07] border-t border-[#F2C14E]/15 ${
            isLedMode ? 'py-4' : 'py-20 md:py-28'
          }`}
        >
          {/* Background Radial Halo + Concentric Orbit Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[640px] h-[640px] rounded-full border border-[#F2C14E]/12" />
            <div className="absolute w-[480px] h-[480px] rounded-full border border-[#F2C14E]/18" />
            <div className="w-[700px] h-[360px] bg-[#F2C14E]/8 blur-[120px] rounded-full" />
          </div>

          <div
            className={`relative z-10 max-w-[1140px] mx-auto px-4 md:px-8 ${
              isLedMode ? 'space-y-8' : 'space-y-14'
            }`}
          >
            <div
              id="chan-dung-stage"
              className={isLedMode ? 'min-h-[100dvh] flex flex-col justify-center py-4 space-y-6' : 'space-y-10'}
            >
              {/* Header matching Odyssey's Featured Spotlight */}
              <div className="text-center space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#F2C14E]">
                  PHIM TÀI LIỆU &amp; TƯ LIỆU TRỌNG TÂM
                </p>
                <h2
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#FFDE59] uppercase tracking-wider"
                >
                  CUỘC ĐỜI VÀ ĐẠO NGHIỆP TỔ SƯ NGỘ CHÂN TỬ
                </h2>
              </div>

              {/* Chamfered Odyssey Portrait Frame + Switcher */}
              <div className={`relative mx-auto w-full ${isLedMode ? 'max-w-[min(1040px,118dvh)]' : 'max-w-4xl'}`}>
                {/* Decorative angled outer corner brackets */}
                <div className="hidden sm:block absolute -top-2.5 -left-2.5 w-7 h-7 border-t-2 border-l-2 border-[#FFDE59]/85 pointer-events-none" />
                <div className="hidden sm:block absolute -top-2.5 -right-2.5 w-7 h-7 border-t-2 border-r-2 border-[#FFDE59]/85 pointer-events-none" />
                <div className="hidden sm:block absolute -bottom-2.5 -left-2.5 w-7 h-7 border-b-2 border-l-2 border-[#FFDE59]/85 pointer-events-none" />
                <div className="hidden sm:block absolute -bottom-2.5 -right-2.5 w-7 h-7 border-b-2 border-r-2 border-[#FFDE59]/85 pointer-events-none" />

                <div className="odyssey-bevel-card relative bg-[#21140C] border border-[#F2C14E]/45 p-1.5 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
                  <div
                    className={`odyssey-bevel-card relative aspect-[16/9] w-full mx-auto overflow-hidden bg-[#120B06] group ${
                      isLedMode ? 'max-h-[68dvh]' : ''
                    }`}
                  >
                  {spotlightMode === 'video' ? (
                    <iframe
                      key={`yt-suto-${videoStartSec}-${isLedMode ? 'led' : 'web'}`}
                      src={`https://www.youtube.com/embed/MKt_sLwxmNU?start=${videoStartSec}&autoplay=${
                        isLedMode ? 1 : 0
                      }&rel=0`}
                      title="Phim tài liệu cuộc đời và đạo nghiệp Sư Tổ Ngộ Chân Tử"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <>
                      {/* Soft ambient blurred fill so vertical portraits fit 16:9 gracefully without cropping faces */}
                      <img
                        src={spotlightImage}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-[center_22%] blur-2xl scale-110 opacity-45 pointer-events-none"
                      />
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={spotlightMode}
                          src={spotlightImage}
                          alt={
                            spotlightMode === 'artwork'
                              ? 'Di ảnh thờ Sư Tổ Ngộ Chân Tử tại Tùng Lâm Hòa Phúc'
                              : 'Chân dung lịch sử Hòa thượng Ngộ Chân Tử'
                          }
                          initial={prefersReducedMotion ? false : { opacity: 0.4, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0.3 }}
                          transition={{ duration: 0.35 }}
                          className="relative z-0 w-full h-full object-contain object-center"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_CHUA_IMG;
                          }}
                        />
                      </AnimatePresence>

                      <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-[#140C07] via-[#140C07]/20 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 odyssey-scanlines opacity-35 pointer-events-none" />
                    </>
                  )}
                </div>

                {/* Below image on mobile (<sm) so portrait stays 100% unobstructed; floating HUD overlay on sm+ */}
                {spotlightMode !== 'video' && (
                  <div className="relative sm:absolute sm:bottom-6 sm:left-6 sm:right-6 bg-[#180F09] sm:bg-transparent p-3.5 sm:p-0 border-t border-[#F2C14E]/25 sm:border-0 flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-4 z-10">
                    <div className="space-y-1 text-left">
                      <span className="inline-block px-2.5 py-0.5 bg-[#F2C14E]/20 border border-[#F2C14E]/50 text-[#FFDE59] text-[10px] font-bold uppercase tracking-widest">
                        {spotlightMode === 'artwork' ? 'Ảnh Thờ Tại Tùng Lâm Hòa Phúc' : 'Di Ảnh Lịch Sử Tổ Đình'}
                      </span>
                      <p className="text-xs sm:text-sm text-[#FFE5A3] max-w-xl leading-relaxed">
                        {spotlightMode === 'artwork'
                          ? 'Di ảnh tôn kính Sư Tổ Ngộ Chân Tử trong Lễ Kỷ Niệm Ngày Sinh tại Tùng Lâm Hòa Phúc.'
                          : 'Di ảnh truyền thống Cố Lão Hòa Thượng Thích Ngộ Chân Tử (1901 – 1988), Khai sơn Tổ đình Hoằng Pháp.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setSpotlightMode((m) => (m === 'artwork' ? 'photo' : 'artwork'))
                        }
                        className="px-3.5 py-2 min-h-[38px] bg-[#1B110A]/90 border border-[#F2C14E]/50 text-[#F2C14E] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
                      >
                        {spotlightMode === 'artwork' ? 'Xem Di Ảnh Cổ' : 'Xem Ảnh Hòa Phúc'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoStartSec(599);
                          setSpotlightMode('video');
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] bg-[#2B1B10]/95 border border-[#FFDE59]/70 text-[#FFDE59] text-[11px] font-bold uppercase tracking-wider hover:bg-[#FFDE59] hover:text-black transition-colors cursor-pointer ${
                          isLedMode && ledHighlightTarget === 'play-doc-video'
                            ? 'odyssey-led-active-ring'
                            : ''
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Xem Phim Tư Liệu</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxState({
                            items: galleryItems,
                            idx: spotlightMode === 'artwork' ? 1 : 2,
                            label: 'HÌNH ẢNH LỊCH SỬ SƯ TỔ',
                          })
                        }
                        aria-label="Phóng to hình ảnh"
                        className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center bg-[#F2C14E] text-black hover:bg-[#FFDE59] transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {spotlightMode === 'video' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#180F09] border-t border-[#F2C14E]/25">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFDE59] mr-1">
                        Phim Tài Liệu Về Sư Tổ:
                      </span>
                      <button
                        type="button"
                        onClick={() => setVideoStartSec(599)}
                        className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                          videoStartSec === 599
                            ? 'bg-[#F2C14E] text-black border-[#FFDE59]'
                            : 'bg-[#21140C] text-[#FFE5A3] border-[#F2C14E]/35 hover:border-[#FFDE59]'
                        }`}
                      >
                        Đoạn Vân Du &amp; Trùng Tu (10:00)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoStartSec(0)}
                        className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                          videoStartSec === 0
                            ? 'bg-[#F2C14E] text-black border-[#FFDE59]'
                            : 'bg-[#21140C] text-[#FFE5A3] border-[#F2C14E]/35 hover:border-[#FFDE59]'
                        }`}
                      >
                        Xem Từ Đầu (00:00)
                      </button>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSpotlightMode('artwork')}
                        className="px-3 py-1.5 bg-[#21140C] border border-[#F2C14E]/50 text-[#F2C14E] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
                      >
                        Quay Lại Di Ảnh
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Sacred Golden Quote Tablet (Trang riêng toàn màn hình trong chế độ LED) */}
            <div
              id="di-huan-tablet"
              className={
                isLedMode
                  ? 'min-h-[100dvh] flex flex-col justify-center max-w-5xl mx-auto py-8 w-full'
                  : 'relative max-w-4xl mx-auto'
              }
            >
              <div className="odyssey-bevel-card bg-gradient-to-b from-[#2A190F] to-[#1A100A] border border-[#F2C14E]/45 p-7 sm:p-10 md:p-12 text-center shadow-2xl relative">
                <div className="w-11 h-11 mx-auto mb-4 rotate-45 bg-[#321F14] border border-[#F2C14E]/80 flex items-center justify-center shadow-[0_0_20px_rgba(242,193,78,0.25)]">
                  <Flame className="w-5 h-5 -rotate-45 text-[#FFDE59]" />
                </div>

                <h3
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className="text-3xl sm:text-4xl md:text-5xl text-[#FFDE59] uppercase tracking-[0.14em] mb-6 font-normal"
                >
                  {topic.quoteTitle || 'DI HUẤN QUAN TRỌNG NHẤT'}
                </h3>

                <div
                  style={{ fontFamily: "'UTM Avo', sans-serif" }}
                  className={`max-w-3xl mx-auto italic text-[#FFE5A3] ${
                    isLedMode
                      ? 'text-lg sm:text-xl md:text-2xl leading-relaxed'
                      : 'text-sm sm:text-base leading-relaxed md:leading-loose'
                  }`}
                >
                  <p className="text-justify [text-align-last:left] indent-6 sm:indent-8">
                    “{quoteLines.join(' ')}”
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#F2C14E]/20 text-xs sm:text-sm font-bold text-[#F2C14E] uppercase tracking-[0.22em]">
                  — {topic.quoteAuthor || 'Sư Tổ Ngộ Chân Tử (1901 – 1988)'} —
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 3: SIGNATURE ODYSSEY INTERACTIVE ROSTER / LIFE CHRONICLES
           ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="hanh-trinh"
          ref={chronicleRef}
          className={`relative py-20 md:py-24 bg-[#120A05] border-t border-b border-[#F2C14E]/20 overflow-hidden ${
            !isLedMode ? 'odyssey-below-fold-section' : ''
          }`}
        >
          <div className="absolute inset-0 odyssey-matrix-bg opacity-25 pointer-events-none" />

          {/* Section Title + Odyssey Horizontal Medallion Roster */}
          <div id="hanh-trinh-selector" className="relative z-20 max-w-[1200px] mx-auto px-4 md:px-8 pt-2">
            <div className="text-center mb-8 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F2C14E]">
                NIÊN BIỂU TƯƠNG TÁC · CHỌN GIAI ĐOẠN LỊCH SỬ
              </p>
              <h2
                style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#FFDE59] uppercase tracking-wider"
              >
                HÀNH TRÌNH ĐẠO NGHIỆP (1901 – 1988)
              </h2>
            </div>

            {/* 7 Circular Portrait/Era Medallions */}
            <div
              role="tablist"
              aria-label="Các chặng đường đạo nghiệp của Sư Tổ Ngộ Chân Tử"
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-7 pb-6"
            >
              {chapters.map((chapter, idx) => {
                const isSelected = idx === activeChapterIdx;
                const isLedHighlighted = isLedMode && ledHighlightTarget === `chapter-${idx}`;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectChapter(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        handleStepChapter(1);
                      } else if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        handleStepChapter(-1);
                      }
                    }}
                    className={`relative group flex flex-col items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE59] rounded-xl p-1 ${
                      isLedHighlighted ? 'odyssey-led-active-ring' : ''
                    }`}
                  >
                    {isLedHighlighted && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-[#FFDE59] text-[#140C07] text-[9px] font-extrabold uppercase tracking-wider shadow-lg">
                        Đang Chọn
                      </span>
                    )}
                    <div
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-[74px] md:h-[74px] rounded-full p-[3px] transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#FFDE59] to-[#B67E1E] scale-110 shadow-[0_0_24px_rgba(242,193,78,0.65)]'
                          : 'bg-[#F2C14E]/25 group-hover:bg-[#F2C14E]/65 group-hover:scale-105'
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#1D120B] relative">
                        <img
                          src={chapter.medallionImage}
                          alt={chapter.year}
                          loading="lazy"
                          className={`w-full h-full object-cover object-top transition-all duration-300 ${
                            isSelected ? 'grayscale-0 brightness-110' : 'grayscale-[55%] opacity-75 group-hover:grayscale-0 group-hover:opacity-100'
                          }`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_CHUA_IMG;
                          }}
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        isSelected ? 'text-[#FFDE59]' : 'text-[#e3d2c1]/60 group-hover:text-[#F2C14E]'
                      }`}
                    >
                      {chapter.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Odyssey Signature Angled Telemetry Bracket Under Selector */}
            <div className="hidden md:flex items-center justify-center max-w-3xl mx-auto mb-10 pointer-events-none">
              <svg viewBox="0 0 600 28" className="w-full h-7 text-[#F2C14E]/50">
                <polyline
                  points="10,2 42,24 558,24 590,2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect x="6" y="0" width="5" height="5" fill="#FFDE59" />
                <rect x="589" y="0" width="5" height="5" fill="#FFDE59" />
                <line x1="250" y1="24" x2="350" y2="24" stroke="#FFDE59" strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* ── IMMERSIVE SPLIT STAGE FOR SELECTED CHAPTER ── */}
          <div
            id="hanh-trinh-stage"
            className={`relative max-w-[1320px] mx-auto px-4 md:px-10 ${
              isLedMode ? 'min-h-[96dvh] flex flex-col justify-center py-3' : ''
            }`}
          >
            {/* Left & Right Telemetry Ruler Bars */}
            <div className="hidden lg:block absolute left-2 top-8 bottom-8 w-2 odyssey-ruler-y opacity-45 pointer-events-none" />
            <div className="hidden lg:flex absolute right-2 top-8 bottom-8 flex-col items-center justify-between text-[9px] tracking-[0.28em] text-[#F2C14E]/50 font-mono pointer-events-none select-none">
              <span>TLHP</span>
              <span className="[writing-mode:vertical-rl]">NGỘ · CHÂN · TỬ · 1901-1988</span>
              <span>{activeChapter.code}/{String(chapters.length).padStart(2, '0')}</span>
            </div>

            <div className="relative rounded-2xl border border-[#F2C14E]/25 bg-[#180E08]/95 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.85)]">
              {/* Animated Full-Stage Background Image (Fades into Right Dark Dossier like LoL Odyssey) */}
              <div
                className={`relative grid grid-cols-1 lg:grid-cols-12 items-stretch ${
                  isLedMode ? 'min-h-[500px] lg:min-h-[520px]' : 'min-h-[560px] lg:min-h-[600px]'
                }`}
              >
                {/* LEFT VISUAL ARTWORK STAGE */}
                <div className="lg:col-span-6 relative flex flex-col lg:min-h-full overflow-hidden bg-[#0E0704]">
                  <div className="relative min-h-[290px] xs:min-h-[340px] sm:min-h-[440px] lg:min-h-full flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeChapter.id}-${activeStageImgIdx}`}
                        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={activeStagePhoto.url}
                          alt={activeStagePhoto.caption || activeChapter.headline}
                          loading="lazy"
                          decoding="async"
                          style={{ objectPosition: activeStagePhoto.objectPosition || 'center 25%' }}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = FALLBACK_CHUA_IMG;
                          }}
                        />
                        <div className="absolute inset-0 odyssey-scanlines opacity-20 pointer-events-none" />
                        <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-[#180E08] via-transparent to-[#180E08]/30 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#180E08]/95" />
                      </motion.div>
                    </AnimatePresence>

                    {/* Top-Left Chapter Number HUD Tag */}
                    <div className="relative z-10 p-4 sm:p-7 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#140C07]/85 border border-[#F2C14E]/50 backdrop-blur-sm">
                        <span className="w-2 h-2 rotate-45 bg-[#FFDE59]" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFDE59]">
                          CHƯƠNG {activeChapter.code} / {String(chapters.length).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden xs:inline-block px-3 py-1 bg-[#140C07]/80 border border-[#F2C14E]/30 text-[11px] font-semibold text-[#FFE5A3]">
                          {activeChapter.year}
                        </span>
                        <button
                          type="button"
                          onClick={() => setStandalonePreview(activeStagePhoto)}
                          aria-label={`Phóng to: ${activeStagePhoto.caption}`}
                          className="p-2 bg-[#140C07]/85 border border-[#F2C14E]/45 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls: Below image on <sm phones so photo stays unobstructed; overlay on sm+ */}
                  <div className="relative sm:absolute sm:bottom-4 sm:left-5 sm:right-5 bg-[#120A05] sm:bg-transparent p-3.5 sm:p-0 border-t border-[#F2C14E]/20 sm:border-0 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStepChapter(-1)}
                        aria-label="Chương trước"
                        className="w-10 h-10 flex items-center justify-center bg-[#140C07]/85 border border-[#F2C14E]/50 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepChapter(1)}
                        aria-label="Chương tiếp theo"
                        className="w-10 h-10 flex items-center justify-center bg-[#140C07]/85 border border-[#F2C14E]/50 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {activeChapter.stageGallery && activeChapter.stageGallery.length > 0 && (
                      <div className="flex flex-col items-start sm:items-end gap-1.5 max-w-full">
                        <span className="px-2.5 py-1 bg-[#140C07]/85 border border-[#F2C14E]/30 text-[11px] text-[#FFE5A3] line-clamp-2 sm:line-clamp-1 backdrop-blur-xs">
                          {activeStagePhoto.caption}
                        </span>
                        {activeChapter.stageGallery.length > 1 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {activeChapter.stageGallery.map((thumb, tIdx) => {
                              const isThumbLed = isLedMode && ledHighlightTarget === `stage-thumb-${tIdx}`;
                              return (
                                <button
                                  key={thumb.url}
                                  type="button"
                                  onClick={() => setActiveStageImgIdx(tIdx)}
                                  aria-label={`Xem ảnh ${tIdx + 1}: ${thumb.caption}`}
                                  className={`w-11 h-11 overflow-hidden border transition-all cursor-pointer ${
                                    tIdx === activeStageImgIdx
                                      ? 'border-[#FFDE59] ring-1 ring-[#FFDE59] scale-105 opacity-100'
                                      : 'border-[#F2C14E]/35 opacity-65 hover:opacity-100'
                                  } ${isThumbLed ? 'odyssey-led-active-ring' : ''}`}
                                >
                                  <img
                                    src={thumb.url}
                                    alt={thumb.caption}
                                    loading="lazy"
                                    decoding="async"
                                    style={{ objectPosition: thumb.objectPosition || 'center 25%' }}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT DOSSIER PANEL (Giant Yellow Header + 2x2 Stats + Corner-Bracket Tabs) */}
                <div className="lg:col-span-6 p-6 sm:p-9 lg:p-11 flex flex-col justify-center space-y-7 bg-[#180E08]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeChapter.id}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Giant Gold Uppercase Role/Chapter Title */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
                          {activeChapter.year}
                        </div>
                        <h3
                          style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                          className="text-4xl sm:text-5xl md:text-[54px] font-normal text-[#FFDE59] uppercase tracking-wider leading-[1.02] drop-shadow-[0_0_20px_rgba(242,193,78,0.28)]"
                        >
                          {activeChapter.headline}
                        </h3>
                      </div>

                      {/* 2x2 Odyssey Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F2C14E]/15">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
                            NIÊN ĐẠI
                          </div>
                          <div className="text-sm font-bold text-white mt-0.5">{activeChapter.year}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
                            ĐỊA DANH
                          </div>
                          <div className="text-sm font-bold text-white mt-0.5">{activeChapter.location}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
                            CÔNG HẠNH TRỌNG TÂM
                          </div>
                          <div className="text-sm font-semibold text-[#FFE5A3] mt-0.5 leading-snug">
                            {activeChapter.keyVirtue}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2C14E]">
                            DẤU ẤN ĐỂ ĐỜI
                          </div>
                          <div className="text-sm font-semibold text-[#FFE5A3] mt-0.5 leading-snug">
                            {activeChapter.legacyMark}
                          </div>
                        </div>
                      </div>

                      {/* Corner-Bracket Tabbed Content Frame (Directly inspired by Odyssey Biography/Lore Box) */}
                      <div className="relative border border-[#F2C14E]/30 bg-[#120A05]/90 p-5 sm:p-6">
                        {/* Top white/gold chamfer corner accents */}
                        <span className="absolute -top-[1px] -left-[1px] w-3.5 h-3.5 border-t-2 border-l-2 border-[#FFDE59]" />
                        <span className="absolute -top-[1px] -right-[1px] w-3.5 h-3.5 border-t-2 border-r-2 border-[#FFDE59]" />
                        <span className="absolute -bottom-[1px] -left-[1px] w-3.5 h-3.5 border-b-2 border-l-2 border-[#FFDE59]" />
                        <span className="absolute -bottom-[1px] -right-[1px] w-3.5 h-3.5 border-b-2 border-r-2 border-[#FFDE59]" />

                        {/* Interactive Sub-tabs */}
                        <div className="flex border-b border-[#F2C14E]/20 mb-4 -mx-5 sm:-mx-6 px-5 sm:px-6">
                          <button
                            type="button"
                            onClick={() => setActiveDossierTab('bio')}
                            className={`pb-3 pr-6 text-xs font-extrabold uppercase tracking-[0.16em] border-b-2 transition-colors cursor-pointer ${
                              activeDossierTab === 'bio'
                                ? 'border-[#FFDE59] text-[#FFDE59]'
                                : 'border-transparent text-[#e3d2c1]/55 hover:text-[#FFE5A3]'
                            }`}
                          >
                            TIỂU SỬ CHI TIẾT
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveDossierTab('vow')}
                            className={`pb-3 px-6 text-xs font-extrabold uppercase tracking-[0.16em] border-b-2 transition-colors cursor-pointer ${
                              activeDossierTab === 'vow'
                                ? 'border-[#FFDE59] text-[#FFDE59]'
                                : 'border-transparent text-[#e3d2c1]/55 hover:text-[#FFE5A3]'
                            }`}
                          >
                            {activeChapter.vowTitle}
                          </button>
                        </div>

                        <div
                          style={{ fontFamily: "'UTM Avo', sans-serif" }}
                          className="space-y-3 text-sm sm:text-[15px] text-[#e3d2c1]/95 leading-relaxed min-h-[145px]"
                        >
                          {(activeDossierTab === 'bio'
                            ? activeChapter.biographyDetails
                            : activeChapter.vowDetails
                          ).map((para, pIdx) => (
                            <p key={pIdx}>{para}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 4: LITERARY & DHARMA DOSSIER ("THE LURE" STYLE FEATURE CARD)
           ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="kinh-sach"
          className={`relative py-20 md:py-24 bg-[#140C07] overflow-hidden ${
            !isLedMode ? 'odyssey-below-fold-section' : ''
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F2C14E]/20 pb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#F2C14E] mb-1">
                  TRƯỚC TÁC ẤN TỐNG &amp; TÔNG CHỈ TU HÀNH
                </p>
                <h2
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className="text-4xl sm:text-5xl font-normal text-[#FFDE59] uppercase tracking-wider"
                >
                  DI SẢN KINH SÁCH &amp; CỐT LÕI TU TẬP
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsReaderOpen(true)}
                className="odyssey-bevel-sm self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A1B11] border border-[#F2C14E]/60 text-[#FFDE59] text-xs font-bold uppercase tracking-widest hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
              >
                <ScrollText className="w-4 h-4" />
                <span>Mở Toàn Văn Tiểu Sử</span>
              </button>
            </div>

            {/* 3 Spiritual Pillars Grid with Scanned Vintage Covers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {THREE_PILLARS.map((pillar, i) => {
                const isBookLed =
                  Boolean(isLedMode && pillar.coverImage && ledHighlightTarget === `book-${pillar.coverImage}`);
                return (
                  <div
                    key={i}
                    className={`odyssey-bevel-card bg-[#1F130B] border transition-colors p-6 sm:p-7 flex gap-4 items-start shadow-xl ${
                      isBookLed ? 'border-[#FFDE59] odyssey-led-active-ring' : 'border-[#F2C14E]/30 hover:border-[#F2C14E]'
                    }`}
                  >
                    {pillar.coverImage && (
                      <button
                        type="button"
                        onClick={() =>
                          setStandalonePreview({
                            url: pillar.coverImage,
                            caption: pillar.title,
                            subtitle: pillar.label,
                            note: pillar.desc,
                          })
                        }
                        aria-label={`Phóng to bìa sách ${pillar.title}`}
                        className="relative shrink-0 w-16 h-24 sm:w-20 sm:h-28 bg-[#120A05] border border-[#F2C14E]/45 hover:border-[#FFDE59] overflow-hidden cursor-zoom-in group"
                      >
                        <img
                          src={pillar.coverImage}
                          alt={pillar.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span
                          className={`absolute bottom-1 right-1 p-1 rounded bg-[#140C07]/85 border border-[#F2C14E]/60 text-[#FFDE59] transition-opacity ${
                            isBookLed ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'
                          }`}
                        >
                          <Maximize2 className="w-3 h-3" />
                        </span>
                      </button>
                    )}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
                          {pillar.label}
                        </span>
                        <Sparkles className="w-4 h-4 text-[#FFDE59]/70 shrink-0" />
                      </div>
                      <h3
                        style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                        className="text-2xl sm:text-3xl text-[#FFDE59] uppercase tracking-wide leading-tight"
                      >
                        {pillar.title}
                      </h3>
                      <p
                        style={{ fontFamily: "'UTM Avo', sans-serif" }}
                        className="text-xs sm:text-sm text-[#e3d2c1]/85 leading-relaxed"
                      >
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Featured Chronicle Card: 10 Compiled Works + Reader */}
            <div className="relative odyssey-bevel-card bg-gradient-to-br from-[#28180E] via-[#1C110A] to-[#130B06] border border-[#F2C14E]/45 p-6 sm:p-10 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#F2C14E]">
                      KINH SÁCH SƯ TỔ BIÊN SOẠN &amp; ẤN TỐNG
                    </span>
                    <h3
                      style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                      className="text-3xl sm:text-4xl text-[#FFDE59] uppercase tracking-wider mt-1"
                    >
                      THẬP ĐẠI TÁC PHẨM LƯU TRUYỀN HẬU THẾ
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {COMPILED_SCRIPTURES.map((book, bIdx) => {
                      const isBookLed =
                        Boolean(isLedMode && book.coverImage && ledHighlightTarget === `book-${book.coverImage}`);
                      return (
                        <div
                          key={bIdx}
                          className={`p-3.5 bg-[#140C07]/85 border transition-colors flex items-start gap-3.5 ${
                            isBookLed ? 'border-[#FFDE59] odyssey-led-active-ring' : 'border-[#F2C14E]/25 hover:border-[#F2C14E]/70'
                          }`}
                        >
                          {book.coverImage ? (
                            <button
                              type="button"
                              onClick={() =>
                                setStandalonePreview({
                                  url: book.coverImage!,
                                  caption: book.title,
                                  subtitle: book.code,
                                  note: book.note,
                                })
                              }
                              aria-label={`Phóng to bìa ${book.title}`}
                              className="relative shrink-0 w-14 h-20 bg-[#0D0704] border border-[#F2C14E]/40 hover:border-[#FFDE59] overflow-hidden cursor-zoom-in group"
                            >
                              <img
                                src={book.coverImage}
                                alt={`Bìa ${book.title}`}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <span
                                className={`absolute bottom-1 right-1 p-1 rounded bg-[#140C07]/85 border border-[#F2C14E]/60 text-[#FFDE59] transition-opacity ${
                                  isBookLed ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'
                                }`}
                              >
                                <Maximize2 className="w-2.5 h-2.5" />
                              </span>
                            </button>
                          ) : (
                            <div className="shrink-0 w-14 h-20 bg-[#1B1009] border border-[#F2C14E]/20 flex flex-col items-center justify-center text-[#F2C14E]/55">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F2C14E]">
                              {book.code}
                            </div>
                            <div className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug">
                              {book.title}
                            </div>
                            <p className="text-xs text-[#e3d2c1]/75 mt-1 leading-relaxed">
                              {book.note}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right CTA Panel */}
                <div className="lg:col-span-4 flex flex-col justify-between p-6 bg-[#140C07]/80 border border-[#F2C14E]/30 space-y-5 lg:sticky lg:top-24">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
                      TƯ LIỆU LỊCH SỬ CHÍNH THỨC
                    </span>
                    <h4
                      style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                      className="text-3xl text-[#FFDE59] uppercase tracking-wide"
                    >
                      ĐỌC TOÀN VĂN TIỂU SỬ
                    </h4>
                    <p className="text-sm text-[#e3d2c1]/85 leading-relaxed">
                      Xem đầy đủ từng chương tiểu sử Sư Tổ Ngộ Chân Tử, từ thuở xuất gia cầu đạo miền Bắc đến công đức khai sơn Tổ đình Hoằng Pháp và giờ phút viên tịch năm 1988.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setIsReaderOpen(true)}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#F2C14E] text-black text-xs font-extrabold uppercase tracking-wider hover:bg-[#FFDE59] transition-colors cursor-pointer ${
                        isLedMode && ledHighlightTarget === 'open-full-reader'
                          ? 'odyssey-led-active-ring'
                          : ''
                      }`}
                    >
                      <span>Mở Bản Đọc Đầy Đủ</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInlineExpanded((v) => !v)}
                      className="px-4 py-3 border border-[#F2C14E]/50 text-[#FFE5A3] text-xs font-bold uppercase tracking-wider hover:bg-[#F2C14E]/15 transition-colors cursor-pointer"
                    >
                      {inlineExpanded ? 'Thu Gọn' : 'Mở Tại Trang'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Inline Expanded Full Article (Karaoke + Infographic) */}
              {inlineExpanded && (
                <div className="mt-8 pt-8 border-t border-[#F2C14E]/25 bg-[#190F09]/90 rounded-xl p-6 sm:p-8">
                  <SuToKaraokeReader
                    rawContent={topic.content || topic.mainContentHtml || ''}
                    title={topic.title}
                    subtitle={topic.subtitle}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 5: CIRCULAR GOLD-RIMMED ARCHIVES (HISTORY, RELICS & STELES)
           ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="thanh-tich"
          className={`relative py-20 md:py-24 bg-[#100804] border-t border-[#F2C14E]/20 overflow-hidden ${
            !isLedMode ? 'odyssey-below-fold-section' : ''
          }`}
        >
          <div className="absolute inset-0 odyssey-matrix-bg opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#F2C14E]">
                  THÁNH TÍCH · KỶ VẬT · VĂN BIA TƯỞNG NIỆM
                </p>
                <h2
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#FFDE59] uppercase tracking-wider mt-1"
                >
                  {activeArchiveLabel}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#e3d2c1]/75 max-w-md">
                Nhấp vào từng khung tròn viền hoàng kim để phóng to tư liệu lịch sử, kỷ vật quý và văn bia tưởng niệm của Sư Tổ Ngộ Chân Tử.
              </p>
            </div>

            {/* 3 Interactive Archive Cluster Tabs */}
            <div
              role="tablist"
              aria-label="Phân loại tư liệu Sư Tổ"
              className="flex flex-wrap items-center gap-2.5 sm:gap-3"
            >
              {[
                { key: 'history' as const, label: 'Hình Ảnh Lịch Sử', count: galleryItems.length },
                { key: 'relics' as const, label: 'Kỷ Vật Của Sư Tổ', count: KY_VAT_ITEMS.length },
                { key: 'steles' as const, label: 'Văn Bia Tưởng Niệm', count: VAN_BIA_ITEMS.length },
              ].map((tab) => {
                const isActive = archiveTab === tab.key;
                const isTabLed = isLedMode && ledHighlightTarget === `tab-${tab.key}`;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setArchiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE59] ${
                      isActive
                        ? 'bg-[#F2C14E] text-[#140C07] border-[#FFDE59] shadow-[0_0_20px_rgba(242,193,78,0.3)]'
                        : 'bg-[#1D120B] text-[#FFE5A3]/80 border-[#F2C14E]/35 hover:border-[#FFDE59] hover:text-[#FFDE59]'
                    } ${isTabLed ? 'odyssey-led-active-ring' : ''}`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                        isActive ? 'bg-[#140C07]/20 text-[#140C07]' : 'bg-[#F2C14E]/15 text-[#F2C14E]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Circular Gold-Rimmed Medallions Grid (Only Caption Text, Zero Redundant Label) */}
            <div className="relative border border-[#F2C14E]/25 bg-[#180E08]/70 px-4 py-12 sm:px-10 sm:py-14">
              <span className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-2 border-l-2 border-[#FFDE59]" />
              <span className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t-2 border-r-2 border-[#FFDE59]" />
              <span className="absolute -bottom-[1px] -left-[1px] w-5 h-5 border-b-2 border-l-2 border-[#FFDE59]" />
              <span className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b-2 border-r-2 border-[#FFDE59]" />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-7 items-start justify-items-center">
                {activeArchiveItems.map((item, idx) => {
                  const isItemLed =
                    isLedMode && ledHighlightTarget === `archive-${archiveTab}-${idx}`;
                  return (
                    <div
                      key={item.url}
                      className="group flex flex-col items-center gap-4 w-full max-w-[190px] rounded-xl focus-within:ring-2 focus-within:ring-[#FFDE59] focus-within:ring-offset-4 focus-within:ring-offset-[#180E08]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxState({
                            items: activeArchiveItems,
                            idx,
                            label: activeArchiveLabel,
                          })
                        }
                        aria-label={`Xem ảnh: ${item.caption}`}
                        className={`relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center rounded-full cursor-pointer focus:outline-none ${
                          isItemLed ? 'odyssey-led-active-ring' : ''
                        }`}
                      >
                        {/* Outer Golden Circular Frame */}
                        <span className="rounded-full absolute inset-0 bg-gradient-to-tr from-[#B67E1E] via-[#F2C14E] to-[#FFE5A3] shadow-[0_0_24px_rgba(242,193,78,0.28)] group-hover:scale-105 group-hover:shadow-[0_0_32px_rgba(255,222,89,0.5)] transition-all duration-300" />
                        <span className="rounded-full absolute inset-[3px] bg-[#140C07] overflow-hidden ring-1 ring-[#FFE5A3]/40">
                          <img
                            src={item.url}
                            alt={item.caption}
                            loading="lazy"
                            className="w-full h-full object-cover object-[center_25%] group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = FALLBACK_CHUA_IMG;
                            }}
                          />
                          <span className="rounded-full absolute inset-0 bg-[#140C07]/15 group-hover:bg-transparent transition-colors" />
                        </span>
                      </button>

                      <p className="text-center px-1 text-xs text-[#e3d2c1]/90 line-clamp-3 leading-relaxed group-hover:text-[#FFDE59] transition-colors">
                        {item.caption}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 6: LINEAGE CONNECTION & SMART SEARCH AI BAR
           ══════════════════════════════════════════════════════════════════════ */}
        <section
          className={`py-16 bg-[#140C07] border-t border-[#F2C14E]/15 ${
            !isLedMode ? 'odyssey-below-fold-section' : ''
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-center w-full gap-3 sm:gap-4">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#F2C14E]/40 to-[#F2C14E]" />
                <h2
                  style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                  className="text-2xl sm:text-4xl text-[#ffde59] uppercase tracking-wider font-normal sm:whitespace-nowrap text-center"
                >
                  TIẾP NỐI MẠCH NGUỒN TÔNG PHONG
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#F2C14E]/40 to-[#F2C14E]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Link
                  href="/vu-tru-phat-giao/giang-duong"
                  className="odyssey-bevel-sm p-5 border border-[#F2C14E]/45 bg-[#26170D] hover:border-[#FFDE59] hover:-translate-y-1 transition-all flex items-center justify-between group shadow-lg"
                >
                  <div className="space-y-1 pr-3">
                    <span className="text-[10px] font-bold uppercase text-[#F2C14E] tracking-widest">
                      VŨ TRỤ PHẬT GIÁO · THÁNH TÍCH
                    </span>
                    <h3
                      style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                      className="text-2xl text-[#FFDE59] group-hover:text-white transition-colors"
                    >
                      GIẢNG ĐƯỜNG NGỘ CHÂN TỬ
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#F2C14E] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
                {otherTopics.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/gioi-thieu/${item.slug}`}
                    className="odyssey-bevel-sm p-5 border border-[#F2C14E]/30 bg-[#1F130B] hover:border-[#F2C14E] hover:-translate-y-1 transition-all flex items-center justify-between group shadow-lg"
                  >
                    <div className="space-y-1 pr-3">
                      <span className="text-[10px] font-bold uppercase text-[#F2C14E] tracking-widest">
                        {item.tag}
                      </span>
                      <h3
                        style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                        className="text-2xl text-[#FFDE59] group-hover:text-white transition-colors"
                      >
                        {item.title}
                      </h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#F2C14E] group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {!isLedMode && (
              <div className="pt-4">
                <SmartSearchAIBar contextTitle={`Tra cứu về ${topic.title}`} />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── ACCESSIBLE NATIVE <DIALOG>: EVENT QR & SHARE KIT ── */}
      <OdysseyNativeDialog
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        labelledBy="odyssey-qr-modal-title"
      >
        <EventQrPanel
          onClose={() => setIsQrModalOpen(false)}
          onStartLed={handleEnterLedMode}
        />
      </OdysseyNativeDialog>

      {/* ── LED AUTO-PRESENTATION FLOATING HUD & CORNER QR ── */}
      {isLedMode && (
        <>
          {showLedCornerQr && <LedCornerQrBadge targetUrl={qrPublicUrl} />}
          <LedFloatingHud
            isPlaying={isLedPlaying}
            onTogglePlay={() => setIsLedPlaying((p) => !p)}
            onPrevStep={() => setLedStepIdx((prev) => (prev - 1 + ledSteps.length) % ledSteps.length)}
            onNextStep={() => setLedStepIdx((prev) => (prev + 1) % ledSteps.length)}
            speed={ledSpeed}
            onChangeSpeed={setLedSpeed}
            showCornerQr={showLedCornerQr}
            onToggleCornerQr={() => setShowLedCornerQr((q) => !q)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onExitLed={handleExitLedMode}
            stepLabel={ledSteps[ledStepIdx % ledSteps.length]?.label || ''}
            stepIndex={ledStepIdx % ledSteps.length}
            totalSteps={ledSteps.length}
          />
        </>
      )}

      {/* ── ACCESSIBLE NATIVE <DIALOG>: ARTWORK LIGHTBOX ── */}
      <OdysseyNativeDialog
        isOpen={lightboxState !== null}
        onClose={() => setLightboxState(null)}
        labelledBy="odyssey-lightbox-title"
        nonModalOverlay={isLedMode}
      >
        {lightboxState && lightboxState.items[lightboxState.idx] && (
          <div className="relative w-[min(92vw,960px)] bg-[#190F09] border border-[#F2C14E]/60 shadow-[0_30px_100px_rgba(0,0,0,0.95)] p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F2C14E]/20">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
                  {lightboxState.label} · {lightboxState.idx + 1} / {lightboxState.items.length}
                </div>
                <h3 id="odyssey-lightbox-title" className="text-sm sm:text-base font-bold text-[#FFE5A3] mt-1">
                  {lightboxState.items[lightboxState.idx].caption}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxState(null)}
                aria-label="Đóng cửa sổ xem ảnh"
                autoFocus={!isLedMode}
                className="p-2 bg-[#2B1B11] border border-[#F2C14E]/40 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mt-4 aspect-[16/10] max-h-[65vh] w-full bg-[#0E0704] overflow-hidden flex items-center justify-center">
              <img
                src={lightboxState.items[lightboxState.idx].url}
                alt={lightboxState.items[lightboxState.idx].caption}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_CHUA_IMG;
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setLightboxState((prev) =>
                    prev
                      ? { ...prev, idx: (prev.idx - 1 + prev.items.length) % prev.items.length }
                      : null
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#24160D] border border-[#F2C14E]/40 text-xs font-bold uppercase tracking-wider text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Ảnh Trước</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setLightboxState((prev) =>
                    prev ? { ...prev, idx: (prev.idx + 1) % prev.items.length } : null
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#24160D] border border-[#F2C14E]/40 text-xs font-bold uppercase tracking-wider text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
              >
                <span>Ảnh Tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </OdysseyNativeDialog>

      {/* ── ACCESSIBLE NATIVE <DIALOG>: STANDALONE STAGE / BOOK COVER ZOOM ── */}
      <OdysseyNativeDialog
        isOpen={standalonePreview !== null}
        onClose={() => setStandalonePreview(null)}
        labelledBy="odyssey-standalone-title"
        nonModalOverlay={isLedMode}
      >
        {standalonePreview && (
          <div className="relative w-[min(92vw,920px)] bg-[#190F09] border border-[#F2C14E]/60 shadow-[0_30px_100px_rgba(0,0,0,0.95)] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F2C14E]/20">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
                  {standalonePreview.subtitle || 'TƯ LIỆU HÌNH ẢNH SƯ TỔ'}
                </div>
                <h3
                  id="odyssey-standalone-title"
                  style={standalonePreview.note ? { fontFamily: "'UTM Niagara', sans-serif" } : undefined}
                  className={
                    standalonePreview.note
                      ? 'text-2xl sm:text-4xl text-[#FFDE59] uppercase tracking-wider mt-1'
                      : 'text-sm sm:text-base font-bold text-[#FFE5A3] mt-1'
                  }
                >
                  {standalonePreview.caption}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStandalonePreview(null)}
                aria-label="Đóng cửa sổ xem ảnh"
                autoFocus={!isLedMode}
                className="p-2 bg-[#2B1B11] border border-[#F2C14E]/40 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {standalonePreview.note ? (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6 relative aspect-[4/5] max-h-[60vh] w-full bg-[#0E0704] border border-[#F2C14E]/30 overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={standalonePreview.url}
                    alt={standalonePreview.caption}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_CHUA_IMG;
                    }}
                  />
                </div>
                <div className="md:col-span-6 space-y-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2C14E]/15 border border-[#F2C14E]/40 text-[11px] font-bold uppercase tracking-widest text-[#FFDE59]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>KINH SÁCH SƯ TỔ BIÊN SOẠN &amp; ẤN TỐNG</span>
                  </div>
                  <p className="text-base sm:text-lg text-[#FFE5A3] leading-relaxed">
                    {standalonePreview.note}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative mt-4 aspect-[16/11] max-h-[70vh] w-full bg-[#0E0704] overflow-hidden flex items-center justify-center">
                <img
                  src={standalonePreview.url}
                  alt={standalonePreview.caption}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_CHUA_IMG;
                  }}
                />
              </div>
            )}
          </div>
        )}
      </OdysseyNativeDialog>

      {/* ── ACCESSIBLE NATIVE <DIALOG>: FULL BIOGRAPHY READER (KARAOKE VOICE + INFOGRAPHIC) ── */}
      <OdysseyNativeDialog
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        labelledBy="odyssey-reader-title"
        nonModalOverlay={isLedMode}
      >
        <div className="relative w-[min(94vw,980px)] max-h-[86dvh] flex flex-col bg-[#1A1009] border border-[#F2C14E]/60 shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
          <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-[#F2C14E]/25 bg-[#23150C] shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F2C14E]">
                TOÀN VĂN CUỘC ĐỜI SƯ TỔ · NGHE ĐỌC &amp; CHẠY CHỮ KARAOKE
              </div>
              <h3
                id="odyssey-reader-title"
                style={{ fontFamily: "'UTM Niagara', sans-serif" }}
                className="text-2xl sm:text-3xl text-[#FFDE59] uppercase tracking-wider"
              >
                {topic.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsReaderOpen(false)}
              aria-label="Đóng bản đọc tiểu sử"
              autoFocus={!isLedMode}
              className="p-2 bg-[#2F1D11] border border-[#F2C14E]/40 text-[#FFDE59] hover:bg-[#F2C14E] hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6">
            <SuToKaraokeReader
              rawContent={topic.content || topic.mainContentHtml || ''}
              title={topic.title}
              subtitle={topic.subtitle}
              autoPlay={isLedMode && isReaderOpen}
              speedMultiplier={ledSpeed === 'slow' ? 0.85 : ledSpeed === 'fast' ? 1.25 : 1}
              onComplete={() => {
                if (isLedMode && isLedPlaying) {
                  setLedStepIdx((prev) => (prev + 1) % ledSteps.length);
                }
              }}
            />
          </div>
        </div>
      </OdysseyNativeDialog>
    </div>
  );
}
