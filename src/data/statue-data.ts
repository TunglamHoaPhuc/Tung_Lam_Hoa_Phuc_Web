// Dữ liệu Bảo Tượng Phật Giáo được đồng bộ tự động từ Google Sheet
// Nguồn: https://docs.google.com/spreadsheets/d/1Hy4aEvoYaDU-BPJ0GZso7wyWIW5s4Egz/

export interface StatueRecord {
  code: string;
  assembly: string;
  group: string;
  title: string;
  categoryType: 'TƯỢNG CHÍNH' | 'NTPG' | string;
  characterGroup: string;
  areaId: string;
  description?: string;
  quote?: string;
  notes?: string;

  id: string;
  slug: string;
  name: string;
  titleName: string;
  subtitle?: string;
  assemblyId: string;
  assemblyName: string;
  clusterName: string;
  type: string;
  hasSinglePage?: boolean;
  clusterMembers: Array<{ name: string; imgUrl: string; slug: string }>;
  areaSlug: string;
  areaName: string;
  location?: string;
  areaImgUrl?: string;
  imgUrl: string;
  avatarUrl: string;
  imgPosition?: string;
  imgRotation?: number;
  articleContent?: string;
  quoteAuthor: string;
  summary: string;
  fullHistoryHtml: string;
  caption?: string;
  category?: string;
  video?: {
    title: string;
    thumbnailUrl: string;
    summary: string;
    videoUrl: string;
  };
  article?: {
    title: string;
    author: string;
    bannerUrl: string;
    url: string;
  };
  artVariations?: Array<{
    id: string;
    title: string;
    location: string;
    meaning: string;
    imgUrl: string;
  }>;
}

export interface StatueItem extends StatueRecord {}

export function normalizeAreaId(rawSlugOrId?: string): string {
  if (!rawSlugOrId) return '';
  const key = rawSlugOrId.toUpperCase().replace(/-/g, '_').trim();
  
  if (['TAM_BAO', 'TAMBAO', 'TAM_BAO_PHAT_GIAO', 'CHANH_DIEN', 'ĐẠI_HÙNG_BẢO_ĐIỆN'].includes(key)) return 'TAM_BAO';
  if (['GIANG_DUONG', 'GIANGDUONG', 'GIẢNG_ĐƯỜNG'].includes(key)) return 'GIANG_DUONG';
  if (['BAO_TANG', 'BAOTANG', 'BAO_TANG_PHAT_GIAO', 'BẢO_TÀNG_PHẬT_GIÁO', 'BẢO_TÀNG'].includes(key)) return 'BAO_TANG';
  if (['SAN_DI_DA', 'SANDIDA', 'SÂN_DI_ĐÀ', 'SÙNG_DI_ĐÀ'].includes(key)) return 'SAN_DI_DA';
  if (['SAN_DI_LAC', 'SANDILAC', 'SÂN_DI_LẶC', 'CONG_TAM_QUAN', 'CỔNG_TAM_QUAN', 'CONG_TAM_QUAN_SAN_DI_LAC', 'CỔNG_TAM_QUAN___SÂN_DI_LẶC', 'CỔNG_TAM_QUAN_SÂN_DI_LẶC', 'CONGTAMQUAN'].includes(key)) return 'CONG_TAM_QUAN_SAN_DI_LAC';
  if (['NHA_MAU', 'NHAMAU', 'NHÀ_MẪU', 'DAI_NAM_QUOC_MAU', 'ĐẠI_NAM_QUỐC_MẪU'].includes(key)) return 'NHA_MAU';
  if (['TO_DUONG', 'TODUONG', 'TỔ_ĐƯỜNG'].includes(key)) return 'TO_DUONG';
  if (['VANG_SINH_DUONG', 'VANGSINHDUONG', 'VẠN_SINH_ĐƯỜNG', 'TU_AN', 'TỨ_ÂN', 'VẮNG_SINH_ĐƯỜNG', 'TỨ_ÂN_VÃNG_SINH_ĐƯỜNG', 'TU_AN_DUONG'].includes(key)) return 'VANG_SINH_DUONG';
  if (['BAO_THAP', 'BAOTHAP', 'BẢO_THÁP', 'BAO_THAP_VAN_PHAT_XA_LOI'].includes(key)) return 'BAO_THAP';
  if (['LAM_TI_NI', 'LAMTINI', 'LÂM_TỲ_NI'].includes(key)) return 'LAM_TI_NI';
  if (['CONG_THAP', 'CONGTHAP', 'CỔNG_THÁP'].includes(key)) return 'CONG_THAP';
  return key;
}

export interface ThatPhatDuocSuItem {
  id: string;
  code: string;
  name: string;
  titleName: string;
  subtitle: string;
  worldName: string;
  characterGroup: string;
  parentId: string;
  categoryType: 'NTPG';
  areaId: string;
  areaSlug: string;
  areaName: string;
  quote: string;
  quoteAuthor?: string;
  imgUrl: string;
  avatarUrl: string;
  description: string;
  fullHistoryHtml?: string;
}

export const THAT_PHAT_DUOC_SU_DATA: ThatPhatDuocSuItem[] = [
  {
    id: "TP_DS_01",
    code: "TP_DS_01",
    name: "ĐỨC PHẬT THIỆN DANH XƯNG CÁT TƯỜNG VƯƠNG NHƯ LAI",
    titleName: "ĐỨC PHẬT THIỆN DANH XƯNG CÁT TƯỜNG VƯƠNG NHƯ LAI",
    subtitle: "Quang Thắng Thế Giới • Ánh Sáng Tiêu Trừ Khổ Nạn",
    worldName: "Quang Thắng Thế Giới",
    characterGroup: "THAT_PHAT_DUOC_SU",
    parentId: "TP0018",
    categoryType: "NTPG",
    areaId: "DONG_PHUONG_TINH_DO",
    areaSlug: "dong-phuong-tinh-do",
    areaName: "Đông Phương Tịnh Độ",
    quote: "Vị Phật được ca ngợi, thường xuyên ca ngợi những điều thiện lành. Vị đó là vua của những điều lành.",
    quoteAuthor: "VÔ TRÍ - TÂM HÒA",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/duc_phat_thien_danh_xung_cat_tuong_vuong_nhu_lai.webp",
    avatarUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/duc_phat_thien_danh_xung_cat_tuong_vuong_nhu_lai.webp",
    description: "Đức Phật Thiện Danh Xưng Cát Tường Vương Như Lai ngự tại cõi Quang Thắng Thế Giới.",
    fullHistoryHtml: "<p>Đức Phật Thiện Danh Xưng Cát Tường Vương Như Lai ngự tại cõi Quang Thắng Thế Giới. Ngài phát 8 đại nguyện cứu độ chúng sinh khỏi khổ nạn, bệnh tật và nghèo khó.</p>",
  },
  {
    id: "TP_DS_02",
    code: "TP_DS_02",
    name: "ĐỨC PHẬT BẢO NGUYỆT TRÍ NGHIÊM QUANG ÂM TỰ TẠI VƯƠNG NHƯ LAI",
    titleName: "ĐỨC PHẬT BẢO NGUYỆT TRÍ NGHIÊM QUANG ÂM TỰ TẠI VƯƠNG NHƯ LAI",
    subtitle: "Diệu Bảo Thế Giới • Khai Mở Trí Tuệ",
    worldName: "Diệu Bảo Thế Giới",
    characterGroup: "THAT_PHAT_DUOC_SU",
    parentId: "TP0018",
    categoryType: "NTPG",
    areaId: "DONG_PHUONG_TINH_DO",
    areaSlug: "dong-phuong-tinh-do",
    areaName: "Đông Phương Tịnh Độ",
    quote: "Mặt trời trí tuệ của tự tính khi đã hiển lộ, không bị giới hạn.",
    quoteAuthor: "VÔ TRÍ - TÂM HÒA",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/duc_phat_bao_nguyet_tri_nghiem_quang_am_tu_tai_vuong_nhu_lai.webp",
    avatarUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/duc_phat_bao_nguyet_tri_nghiem_quang_am_tu_tai_vuong_nhu_lai.webp",
    description: "Đức Phật Bảo Nguyệt Trí Nghiêm Quang Âm Tự Tại Vương Như Lai ngự tại cõi Diệu Bảo Thế Giới.",
    fullHistoryHtml: "<p>Đức Phật Bảo Nguyệt Trí Nghiêm Quang Âm Tự Tại Vương Như Lai ngự tại cõi Diệu Bảo Thế Giới. Ngài phát 8 đại nguyện giúp chúng sinh tăng trưởng thiện căn, trí huệ sáng suốt.</p>",
  },
  {
    id: "TP_DS_03",
    code: "TP_DS_03",
    name: "ĐỨC PHẬT KIM SẮC BẢO QUANG DIỆU HẠNH THÀNH TỰU NHƯ LAI",
    titleName: "ĐỨC PHẬT KIM SẮC BẢO QUANG DIỆU HẠNH THÀNH TỰU NHƯ LAI",
    subtitle: "Viên Mãn Hương Tích • Chuyển Hóa Nghiệp Sát, Trộm, Sân",
    worldName: "Viên Mãn Hương Tích Thế Giới",
    characterGroup: "THAT_PHAT_DUOC_SU",
    parentId: "TP0018",
    categoryType: "NTPG",
    areaId: "DONG_PHUONG_TINH_DO",
    areaSlug: "dong-phuong-tinh-do",
    areaName: "Đông Phương Tịnh Độ",
    quote: "Tu tập là quá trình gạn đục khơi trong, vén mây gột rửa bớt trần cấu phiền não để mặt trời trí tuệ hiển bày.",
    quoteAuthor: "VÔ TRÍ - TÂM HÒA",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/duc_phat_kim_sac_bao_quang_dieu_hanh_thanh_tuu_nhu_lai.webp",
    avatarUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/duc_phat_kim_sac_bao_quang_dieu_hanh_thanh_tuu_nhu_lai.webp",
    description: "Đức Phật Kim Sắc Bảo Quang Diệu Hạnh Thành Tựu Như Lai ngự tại cõi Viên Mãn Hương Tích Thế Giới.",
    fullHistoryHtml: "<p>Đức Phật Kim Sắc Bảo Quang Diệu Hạnh Thành Tựu Như Lai ngự tại cõi Viên Mãn Hương Tích Thế Giới. Ngài phát 4 đại nguyện giúp chúng sinh dứt trừ nghiệp xấu ác, hướng thiện.</p>",
  },
  {
    id: "TP_DS_04",
    code: "TP_DS_04",
    name: "ĐỨC PHẬT VÔ ƯU TỐI THẮNG CÁT TƯỜNG VƯƠNG NHƯ LAI",
    titleName: "ĐỨC PHẬT VÔ ƯU TỐI THẮNG CÁT TƯỜNG VƯƠNG NHƯ LAI",
    subtitle: "Vô Ưu Thế Giới • Dứt Trừ Ưu Bi Khổ Não",
    worldName: "Vô Ưu Thế Giới",
    characterGroup: "THAT_PHAT_DUOC_SU",
    parentId: "TP0018",
    categoryType: "NTPG",
    areaId: "DONG_PHUONG_TINH_DO",
    areaSlug: "dong-phuong-tinh-do",
    areaName: "Đông Phương Tịnh Độ",
    quote: "Hạnh phúc là chạm đến, chứ không phải đi tìm. Con đường của hạnh phúc ta đã có, hãy nỗ lực bước đi.",
    quoteAuthor: "VÔ TRÍ - TÂM HÒA",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/duc_phat_vo_uu_toi_thang_cat_tuong_vuong_nhu_lai.webp",
    avatarUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/duc_phat_vo_uu_toi_thang_cat_tuong_vuong_nhu_lai.webp",
    description: "Đức Phật Vô Ưu Tối Thắng Cát Tường Vương Như Lai ngự tại cõi Vô Ưu Thế Giới.",
    fullHistoryHtml: "<p>Đức Phật Vô Ưu Tối Thắng Cát Tường Vương Như Lai ngự tại cõi Vô Ưu Thế Giới. Ngài phát 4 đại nguyện dứt trừ mọi sầu muộn, ưu bi của chúng sinh.</p>",
  },
  {
    id: "TP_DS_05",
    code: "TP_DS_05",
    name: "ĐỨC PHẬT PHÁP HẢI LÔI ÂM NHƯ LAI",
    titleName: "ĐỨC PHẬT PHÁP HẢI LÔI ÂM NHƯ LAI",
    subtitle: "Pháp Tràng Thế Giới • Chánh Kiến Chánh Tín Tam Bảo",
    worldName: "Pháp Tràng Thế Giới",
    characterGroup: "THAT_PHAT_DUOC_SU",
    parentId: "TP0018",
    categoryType: "NTPG",
    areaId: "DONG_PHUONG_TINH_DO",
    areaSlug: "dong-phuong-tinh-do",
    areaName: "Đông Phương Tịnh Độ",
    quote: "Giáo pháp không phải để cầu xin, mà phải khéo léo ứng dụng; không phải để nói suông, mà cần đi đến để thấy, biết.",
    quoteAuthor: "VÔ TRÍ - TÂM HÒA",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/phap_hai_loi_am_nhu_lai.webp",
    avatarUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/phap_hai_loi_am_nhu_lai.webp",
    description: "Đức Phật Pháp Hải Lôi Âm Như Lai ngự tại cõi Pháp Tràng Thế Giới.",
    fullHistoryHtml: "<p>Đức Phật Pháp Hải Lôi Âm Như Lai ngự tại cõi Pháp Tràng Thế Giới. Ngài phát 4 đại nguyện phá tan tà kiến mê lầm.</p>",
  },
  {
    id: "TP_DS_06",
    code: "TP_DS_06",
    name: "ĐỨC PHẬT PHÁP HẢI THẮNG HUỆ DU HÍ THẦN THÔNG NHƯ LAI",
    titleName: "ĐỨC PHẬT PHÁP HẢI THẮNG HUỆ DU HÍ THẦN THÔNG NHƯ LAI",
    subtitle: "Thiện Trụ Bảo Hải • Thần Thông Trí Huệ",
    worldName: "Thiện Trụ Bảo Hải Thế Giới",
    characterGroup: "THAT_PHAT_DUOC_SU",
    parentId: "TP0018",
    categoryType: "NTPG",
    areaId: "DONG_PHUONG_TINH_DO",
    areaSlug: "dong-phuong-tinh-do",
    areaName: "Đông Phương Tịnh Độ",
    quote: "Đừng bao giờ đi lùi trở lại mà phải đi tới, phải vượt qua những chướng nạn để đi đến con đường giải thoát.",
    quoteAuthor: "VÔ TRÍ - TÂM HÒA",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/phap_hai_thang_hue_du_hy_than_thong_nhu_lai.webp",
    avatarUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/phap_hai_thang_hue_du_hy_than_thong_nhu_lai.webp",
    description: "Đức Phật Pháp Hải Thắng Huệ Du Hí Thần Thông Như Lai ngự tại cõi Thiện Trụ Bảo Hải.",
    fullHistoryHtml: "<p>Đức Phật Pháp Hải Thắng Huệ Du Hí Thần Thông Như Lai ngự tại cõi Thiện Trụ Bảo Hải Thế Giới.</p>",
  },
  {
    id: "TP_DS_07",
    code: "TP_DS_07",
    name: "ĐỨC PHẬT DƯỢC SƯ LƯU LY QUANG VƯƠNG NHƯ LAI",
    titleName: "ĐỨC PHẬT DƯỢC SƯ LƯU LY QUANG VƯƠNG NHƯ LAI",
    subtitle: "Tịnh Lưu Ly Thế Giới • Đấng Y Vương Cứu Khổ",
    worldName: "Tịnh Lưu Ly Thế Giới",
    characterGroup: "THAT_PHAT_DUOC_SU",
    parentId: "TP0018",
    categoryType: "NTPG",
    areaId: "DONG_PHUONG_TINH_DO",
    areaSlug: "dong-phuong-tinh-do",
    areaName: "Tam Bảo (Đông Phương Tịnh Độ)",
    quote: "Khi làm chủ tâm sân, bệnh tật và đau khổ dần được chuyển hóa.",
    quoteAuthor: "VÔ TRÍ - TÂM HÒA",
    imgUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.webp",
    avatarUrl: "https://s2-cnv03.s3.us-east-005.backblazeb2.com/tunglamhoaphuc2/05-bao-tuong-phat-giao/chu_phat_hai_hoi/duc_phat_duoc_su/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.webp",
    description: "Giáo chủ cõi Tịnh Lưu Ly phương Đông, bậc Y Vương chữa lành muôn bệnh khổ thân tâm.",
    fullHistoryHtml: "<p>Đức Phật Dược Sư Lưu Ly Quang Vương Như Lai là Giáo chủ cõi Tịnh Lưu Ly phương Đông.</p>",
  }
];

export const STATUE_ASSEMBLIES = [
  { id: "all", name: "Tất cả chúng hội" },
  { id: "chu_phat_hai_hoi", name: "Chư Phật Hải Hội" },
  { id: "thanh_tinh_dai_hai_chung", name: "Thanh Tịnh Đại Hải Chúng" },
  { id: "thanh_van_la_han", name: "Thanh Văn Thánh Chúng" },
  { id: "chu_lich_dai_to_su", name: "Chư Lịch Đại Tổ Sư" },
  { id: "ho_phap_than_vuong", name: "Hộ Pháp Thần Vương" },
  { id: "chu_thanh_ho_quoc", name: "Chư Thánh Hộ Quốc" },
  { id: "dai_thi_chu", name: "Đại Thí Chủ" },
  { id: "linh_vat_phat_giao", name: "Linh Vật Phật Giáo" },
];

import statuesDatabase from './statues-database.json';

export const OFFICIAL_STATUE_DATASET: StatueRecord[] = statuesDatabase as unknown as StatueRecord[];

export const OFFICIAL_TUONG_CHINH_LIST: StatueItem[] = OFFICIAL_STATUE_DATASET.filter((s) => s.categoryType === 'TƯỢNG CHÍNH');
export const OFFICIAL_NTPG_LIST: StatueItem[] = OFFICIAL_STATUE_DATASET.filter((s) => s.categoryType !== 'TƯỢNG CHÍNH');

export const STATUE_LIST: StatueItem[] = OFFICIAL_TUONG_CHINH_LIST.length > 0 ? OFFICIAL_TUONG_CHINH_LIST : OFFICIAL_STATUE_DATASET;
