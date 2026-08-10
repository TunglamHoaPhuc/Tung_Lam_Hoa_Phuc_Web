export interface BaoTuongChinhItem {
  id: string;
  slug: string;
  name: string;
  titleName: string;
  subtitle?: string;
  assemblyId: string;
  assemblyName: string;
  clusterName: string;
  type: "TƯỢNG CHÍNH";
  hasSinglePage: boolean;
  areaSlug: string;
  areaName: string;
  location?: string;
  imgUrl: string;
  avatarUrl: string;
  quote?: string;
  quoteAuthor: string;
  summary: string;
  fullHistoryHtml: string;
  clusterMembers: Array<{ name: string; slug: string; imgUrl: string }>;
  code?: string;
  assembly?: string;
  group?: string;
  title?: string;
  categoryType?: "TƯỢNG CHÍNH" | "NTPG";
  characterGroup?: string;
  areaId?: string;
  description?: string;
  notes?: string;
}

export interface BaoTuongNTPGItem {
  id: string;
  slug: string;
  title: string;
  caption?: string;
  category?: string;
  type: "NTPG";
  hasSinglePage: boolean;
  isModalPopup?: boolean;
  areaSlug: string;
  areaName: string;
  location?: string;
  imgUrl: string;
  avatarUrl?: string;
  code?: string;
  assembly?: string;
  group?: string;
  categoryType?: "TƯỢNG CHÍNH" | "NTPG";
  characterGroup?: string;
  areaId?: string;
  description?: string;
  quote?: string;
  quoteAuthor?: string;
  summary?: string;
  fullHistoryHtml?: string;
  notes?: string;
  assemblyId?: string;
  assemblyName?: string;
  clusterName?: string;
  clusterMembers?: Array<{ name: string; slug: string; imgUrl: string }>;
  name?: string;
  titleName?: string;
  subtitle?: string;
}

export const BAO_TUONG_CHINH_LIST: BaoTuongChinhItem[] = [
  {
    "code": "TP0001",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "ĐỨC PHẬT THÍCH CA MÂU NI",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "duc_phat_thich_ca_mau_ni",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0001",
    "slug": "duc_phat_thich_ca_mau_ni",
    "name": "ĐỨC PHẬT THÍCH CA MÂU NI",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "Tam Bảo",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng ĐỨC PHẬT THÍCH CA MÂU NI tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0012",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "ĐỨC PHẬT A DI ĐÀ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "duc_phat_a_di_da",
    "areaId": "GIANG_DUONG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0012",
    "slug": "duc_phat_a_di_da",
    "name": "ĐỨC PHẬT A DI ĐÀ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG"
      }
    ],
    "areaSlug": "giang-duong",
    "areaName": "GIẢNG ĐƯỜNG",
    "location": "Giảng Đường",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng ĐỨC PHẬT A DI ĐÀ tôn thờ tại GIẢNG ĐƯỜNG mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0018",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "ĐỨC PHẬT DƯỢC SƯ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "duc_phat_duoc_su",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0018",
    "slug": "duc_phat_duoc_su",
    "name": "ĐỨC PHẬT DƯỢC SƯ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "Tam Bảo",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng ĐỨC PHẬT DƯỢC SƯ tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0021",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "PHẬT TỲ LÔ GIÁ NA",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "phat_ty_lo_gia_na",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "Phỏng cổ nghệ thuật tạc tượng đời Đường, Trung Hoa",
    "id": "TP0021",
    "slug": "phat_ty_lo_gia_na",
    "name": "PHẬT TỲ LÔ GIÁ NA",
    "titleName": "Phỏng cổ nghệ thuật tạc tượng đời Đường, Trung Hoa",
    "subtitle": "Phỏng cổ nghệ thuật tạc tượng đời Đường, Trung Hoa",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG"
      }
    ],
    "areaSlug": "bao-tang-phat-giao",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "Bảo Tàng Phật Giáo",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng PHẬT TỲ LÔ GIÁ NA tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0022",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "BỒ TÁT VĂN THÙ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "bo_tat_van_thu",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0022",
    "slug": "bo_tat_van_thu",
    "name": "BỒ TÁT VĂN THÙ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_VAN_THU/bo_tat_van_thu.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_VAN_THU/bo_tat_van_thu.JPG"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_VAN_THU/bo_tat_van_thu.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_VAN_THU/bo_tat_van_thu.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng BỒ TÁT VĂN THÙ tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0023",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "BỒ TÁT PHỔ HIỀN",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "bo_tat_pho_hien",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0023",
    "slug": "bo_tat_pho_hien",
    "name": "BỒ TÁT PHỔ HIỀN",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng BỒ TÁT PHỔ HIỀN tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0026",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "QUAN ÂM NGUYỆT TRÍ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "quan_am_nguyet_tri",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0026",
    "slug": "quan_am_nguyet_tri",
    "name": "QUAN ÂM NGUYỆT TRÍ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng QUAN ÂM NGUYỆT TRÍ tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0033",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "ĐẠI THẾ CHÍ PHỎNG CỔ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "dai_the_chi_phong_co",
    "areaId": "GIANG_DUONG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0033",
    "slug": "dai_the_chi_phong_co",
    "name": "ĐẠI THẾ CHÍ PHỎNG CỔ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG"
      }
    ],
    "areaSlug": "giang-duong",
    "areaName": "GIẢNG ĐƯỜNG",
    "location": "GIẢNG ĐƯỜNG",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng ĐẠI THẾ CHÍ PHỎNG CỔ tôn thờ tại NHÀ MẪU mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0034",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "ĐỊA TẠNG BỒ TÁT",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "dia_tang_bo_tat",
    "areaId": "VANG_SINH_DUONG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0034",
    "slug": "dia_tang_bo_tat",
    "name": "ĐỊA TẠNG BỒ TÁT",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG"
      }
    ],
    "areaSlug": "vang-sinh-duong",
    "areaName": "VÃNG SINH ĐƯỜNG",
    "location": "VÃNG SINH ĐƯỜNG",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng ĐỊA TẠNG BỒ TÁT tôn thờ tại VÃNG SINH ĐƯỜNG mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0039",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "NHẬT QUANG BỒ TÁT",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "nhat_quang_bo_tat",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0039",
    "slug": "nhat_quang_bo_tat",
    "name": "NHẬT QUANG BỒ TÁT",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng NHẬT QUANG BỒ TÁT tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0040",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "NGUYỆT QUANG BỒ TÁT",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "nguyet_quang_bo_tat",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0040",
    "slug": "nguyet_quang_bo_tat",
    "name": "NGUYỆT QUANG BỒ TÁT",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng NGUYỆT QUANG BỒ TÁT tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0041",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "PHẬT MẪU CHUẨN ĐỀ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "phat_mau_chuan_de",
    "areaId": "GIANG_DUONG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0041",
    "slug": "phat_mau_chuan_de",
    "name": "PHẬT MẪU CHUẨN ĐỀ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG"
      }
    ],
    "areaSlug": "giang-duong",
    "areaName": "GIẢNG ĐƯỜNG",
    "location": "GIẢNG ĐƯỜNG",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng PHẬT MẪU CHUẨN ĐỀ tôn thờ tại GIẢNG ĐƯỜNG mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0044",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "DI LẶC BỒ TÁT",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "di_lac_bo_tat",
    "areaId": "SAN_DI_DA",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0044",
    "slug": "di_lac_bo_tat",
    "name": "DI LẶC BỒ TÁT",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg"
      }
    ],
    "areaSlug": "san-di-da",
    "areaName": "SÂN DI ĐÀ",
    "location": "SÂN DI ĐÀ",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_tinh_dai_hai_chung/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng DI LẶC BỒ TÁT tôn thờ tại SÂN DI ĐÀ mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0045",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THẬP ĐẠI ĐỆ TỬ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thap_dai_de_tu",
    "areaId": "HO_PHONG_SINH",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0045",
    "slug": "thap_dai_de_tu",
    "name": "THẬP ĐẠI ĐỆ TỬ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_van_thanh_chung/THAP_DAI_DE_TU/ton_gia_a_nan.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_van_thanh_chung/THAP_DAI_DE_TU/ton_gia_a_nan.jpg"
      }
    ],
    "areaSlug": "ho-phong-sinh",
    "areaName": "LẦU KINH LUÂN",
    "location": "Lầu Kinh Luân",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_van_thanh_chung/THAP_DAI_DE_TU/ton_gia_a_nan.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_van_thanh_chung/THAP_DAI_DE_TU/ton_gia_a_nan.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THẬP ĐẠI ĐỆ TỬ tôn thờ tại LẦU KINH LUÂN mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0051",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THẬP BÁT LA HÁN ĐÁ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thap_bat_la_han_da",
    "areaId": "SAN_LA_HAN",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0051",
    "slug": "thap_bat_la_han_da",
    "name": "THẬP BÁT LA HÁN ĐÁ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_van_thanh_chung/THAP_BAT_LA_HAN/TUONG_CHINH/bo_dai_la_han.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/thanh_van_thanh_chung/THAP_BAT_LA_HAN/TUONG_CHINH/bo_dai_la_han.jpg"
      }
    ],
    "areaSlug": "san-la-han",
    "areaName": "SÂN LA HÁN",
    "location": "Sân La Hán",
    "imgUrl": "/images/bao_tuong_phat_giao/thanh_van_thanh_chung/THAP_BAT_LA_HAN/TUONG_CHINH/bo_dai_la_han.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/thanh_van_thanh_chung/THAP_BAT_LA_HAN/TUONG_CHINH/bo_dai_la_han.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THẬP BÁT LA HÁN ĐÁ tôn thờ tại SÂN LA HÁN mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0053",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "TỔ SƯ ĐẠT MA",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "to_su_dat_ma",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0053",
    "slug": "to_su_dat_ma",
    "name": "TỔ SƯ ĐẠT MA",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_dat_ma.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_dat_ma.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_dat_ma.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_dat_ma.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng TỔ SƯ ĐẠT MA tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0054",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "TỔ SƯ LONG THỌ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "to_su_long_tho",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0054",
    "slug": "to_su_long_tho",
    "name": "TỔ SƯ LONG THỌ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_long_tho.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_long_tho.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_long_tho.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_long_tho.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng TỔ SƯ LONG THỌ tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0055",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "PHẬT HOÀNG TRẦN NHÂN TÔNG",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "phat_hoang_tran_nhan_tong",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0055",
    "slug": "phat_hoang_tran_nhan_tong",
    "name": "PHẬT HOÀNG TRẦN NHÂN TÔNG",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/phat_hoang_tran_nhan_tong.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/phat_hoang_tran_nhan_tong.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/phat_hoang_tran_nhan_tong.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/phat_hoang_tran_nhan_tong.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng PHẬT HOÀNG TRẦN NHÂN TÔNG tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0056",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "TỔ SƯ KHƯƠNG TĂNG HỘI",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "to_su_khuong_tang_hoi",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0056",
    "slug": "to_su_khuong_tang_hoi",
    "name": "TỔ SƯ KHƯƠNG TĂNG HỘI",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_khuong_tang_hoi.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_khuong_tang_hoi.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_khuong_tang_hoi.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/to_su_khuong_tang_hoi.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng TỔ SƯ KHƯƠNG TĂNG HỘI tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0057",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THIỀN SƯ TỪ ĐẠO HẠNH",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thien_su_tu_dao_hanh",
    "areaId": "TO_DUONG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0057",
    "slug": "thien_su_tu_dao_hanh",
    "name": "THIỀN SƯ TỪ ĐẠO HẠNH",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_tu_dao_hanh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_tu_dao_hanh.jpg"
      }
    ],
    "areaSlug": "to-duong",
    "areaName": "TỔ ĐƯỜNG",
    "location": "TỔ ĐƯỜNG",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_tu_dao_hanh.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_tu_dao_hanh.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THIỀN SƯ TỪ ĐẠO HẠNH tôn thờ tại TỔ ĐƯỜNG mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0058",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THIỀN SƯ TỲ-NI-DA-LƯU-CHI",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thien_su_ty_ni_da_luu_chi",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0058",
    "slug": "thien_su_ty_ni_da_luu_chi",
    "name": "THIỀN SƯ TỲ-NI-DA-LƯU-CHI",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_ty_ni_da_luu_chi.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_ty_ni_da_luu_chi.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_ty_ni_da_luu_chi.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_ty_ni_da_luu_chi.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THIỀN SƯ TỲ-NI-DA-LƯU-CHI tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0059",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THIỀN SƯ VẠN HẠNH",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thien_su_van_hanh",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0059",
    "slug": "thien_su_van_hanh",
    "name": "THIỀN SƯ VẠN HẠNH",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_van_hanh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_van_hanh.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_van_hanh.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/thien_su_van_hanh.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THIỀN SƯ VẠN HẠNH tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0060",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "QUỐC SƯ KHUÔNG VIỆT",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "quoc_su_khuong_viet",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0060",
    "slug": "quoc_su_khuong_viet",
    "name": "QUỐC SƯ KHUÔNG VIỆT",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/quoc_su_khuong_viet.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/quoc_su_khuong_viet.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/quoc_su_khuong_viet.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/quoc_su_khuong_viet.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng QUỐC SƯ KHUÔNG VIỆT tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0061",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "SƯ TỔ NGỘ CHÂN TỬ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "su_to_ngo_chan_tu",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0061",
    "slug": "su_to_ngo_chan_tu",
    "name": "SƯ TỔ NGỘ CHÂN TỬ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/su_to_ngo_chan_tu.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/su_to_ngo_chan_tu.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/su_to_ngo_chan_tu.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/su_to_ngo_chan_tu.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng SƯ TỔ NGỘ CHÂN TỬ tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0062",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "TUỆ TĨNH THIỀN SƯ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "tue_tinh_thien_su",
    "areaId": "TO_DUONG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0062",
    "slug": "tue_tinh_thien_su",
    "name": "TUỆ TĨNH THIỀN SƯ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/tue_tinh_thien_su.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/tue_tinh_thien_su.jpg"
      }
    ],
    "areaSlug": "to-duong",
    "areaName": "TỔ ĐƯỜNG",
    "location": "TỔ ĐƯỜNG",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/tue_tinh_thien_su.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/tue_tinh_thien_su.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng TUỆ TĨNH THIỀN SƯ tôn thờ tại TỔ ĐƯỜNG mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0062_ALT",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "KHÔNG LỘ QUỐC SƯ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "khong_lo_quoc_su",
    "areaId": "TO_DUONG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0062_ALT",
    "slug": "khong_lo_quoc_su",
    "name": "KHÔNG LỘ QUỐC SƯ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/khong_lo_quoc_su.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/khong_lo_quoc_su.jpg"
      }
    ],
    "areaSlug": "to-duong",
    "areaName": "TỔ ĐƯỜNG",
    "location": "TỔ ĐƯỜNG",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/khong_lo_quoc_su.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/khong_lo_quoc_su.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng KHÔNG LỘ QUỐC SƯ tôn thờ tại TỔ ĐƯỜNG mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0063",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "TUỆ TRUNG THƯỢNG SĨ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "tue_trung_thuong_si",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0063",
    "slug": "tue_trung_thuong_si",
    "name": "TUỆ TRUNG THƯỢNG SĨ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/tue_trung_thuong_si.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/tue_trung_thuong_si.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/tue_trung_thuong_si.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_lich_dai_to_su/tue_trung_thuong_si.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng TUỆ TRUNG THƯỢNG SĨ tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0064",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THÍCH ĐỀ HOÀN NHÂN",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thich_de_hoan_nhan",
    "areaId": "NHA_MAU",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0064",
    "slug": "thich_de_hoan_nhan",
    "name": "THÍCH ĐỀ HOÀN NHÂN",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thich_de_hoan_nhan.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thich_de_hoan_nhan.jpg"
      }
    ],
    "areaSlug": "nha-mau",
    "areaName": "ĐẠI NAM QUỐC MẪU",
    "location": "ĐẠI NAM QUỐC MẪU",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thich_de_hoan_nhan.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thich_de_hoan_nhan.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THÍCH ĐỀ HOÀN NHÂN tôn thờ tại NHÀ MẪU mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0066",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "KIÊN LAO ĐỊA THẦN",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "kien_lao_dia_than",
    "areaId": "SAN_LA_HAN",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0066",
    "slug": "kien_lao_dia_than",
    "name": "KIÊN LAO ĐỊA THẦN",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/kien_lao_dia_than.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/kien_lao_dia_than.jpg"
      }
    ],
    "areaSlug": "san-la-han",
    "areaName": "SÂN LA HÁN",
    "location": "Sân La Hán",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/kien_lao_dia_than.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/kien_lao_dia_than.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng KIÊN LAO ĐỊA THẦN tôn thờ tại SÂN LA HÁN mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0069",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "VI ĐÀ HỘ PHÁP",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "vi_da_ho_phap",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0069",
    "slug": "vi_da_ho_phap",
    "name": "VI ĐÀ HỘ PHÁP",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/vi_da_ho_phap.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/vi_da_ho_phap.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/vi_da_ho_phap.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/vi_da_ho_phap.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng VI ĐÀ HỘ PHÁP tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0070",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "NGÀI TRỪNG ÁC",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "ngai_trung_ac",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "Công lý, chính nghĩa và sức mạnh bảo vệ Tam bảo",
    "id": "TP0070",
    "slug": "ngai_trung_ac",
    "name": "NGÀI TRỪNG ÁC",
    "titleName": "Công lý, chính nghĩa và sức mạnh bảo vệ Tam bảo",
    "subtitle": "Công lý, chính nghĩa và sức mạnh bảo vệ Tam bảo",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/trung_ac.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/trung_ac.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/trung_ac.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/trung_ac.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng NGÀI TRỪNG ÁC tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0071",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "NGÀI KHUYẾN THIỆN",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "ngai_khuyen_thien",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "Lòng từ bi, trí tuệ và sự khuyến khích điều thiện",
    "id": "TP0071",
    "slug": "ngai_khuyen_thien",
    "name": "NGÀI KHUYẾN THIỆN",
    "titleName": "Lòng từ bi, trí tuệ và sự khuyến khích điều thiện",
    "subtitle": "Lòng từ bi, trí tuệ và sự khuyến khích điều thiện",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/khuyen_thien.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/khuyen_thien.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/khuyen_thien.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/khuyen_thien.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng NGÀI KHUYẾN THIỆN tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0076",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "MẬT TÍCH KIM CANG TƯỢNG CỔ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "mat_tich_kim_cang_tuong_co",
    "areaId": "CONG_THAP",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0076",
    "slug": "mat_tich_kim_cang_tuong_co",
    "name": "MẬT TÍCH KIM CANG TƯỢNG CỔ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/mat_tich_ho_phap.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/mat_tich_ho_phap.jpg"
      }
    ],
    "areaSlug": "cong-thap",
    "areaName": "CỔNG THÁP",
    "location": "CỔNG THÁP",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/mat_tich_ho_phap.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/mat_tich_ho_phap.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng MẬT TÍCH KIM CANG TƯỢNG CỔ tôn thờ tại CỔNG THÁP mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0077",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "NA LA DIỆN KIM CANG TƯỢNG CỔ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "na_la_dien_kim_cang_tuong_co",
    "areaId": "CONG_THAP",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0077",
    "slug": "na_la_dien_kim_cang_tuong_co",
    "name": "NA LA DIỆN KIM CANG TƯỢNG CỔ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/na_la_dien_ho_phap.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/na_la_dien_ho_phap.jpg"
      }
    ],
    "areaSlug": "cong-thap",
    "areaName": "CỔNG THÁP",
    "location": "CỔNG THÁP",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/na_la_dien_ho_phap.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/na_la_dien_ho_phap.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng NA LA DIỆN KIM CANG TƯỢNG CỔ tôn thờ tại CỔNG THÁP mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0078",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THẬP NHỊ DƯỢC XOA ĐẠI TƯỚNG",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thap_nhi_duoc_xoa_dai_tuong",
    "areaId": "TAM_BAO",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0078",
    "slug": "thap_nhi_duoc_xoa_dai_tuong",
    "name": "THẬP NHỊ DƯỢC XOA ĐẠI TƯỚNG",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thap_nhi_duoc_xoa/an_de_la_dai_tuong.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thap_nhi_duoc_xoa/an_de_la_dai_tuong.jpg"
      }
    ],
    "areaSlug": "tam-bao",
    "areaName": "TAM BẢO",
    "location": "TAM BẢO",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thap_nhi_duoc_xoa/an_de_la_dai_tuong.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/TUONG_CHINH/thap_nhi_duoc_xoa/an_de_la_dai_tuong.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THẬP NHỊ DƯỢC XOA ĐẠI TƯỚNG tôn thờ tại TAM BẢO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0080",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "TIÊU DIỆN ĐẠI SỸ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "tieu_dien_dai_sy",
    "areaId": "TO_DUONG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0080",
    "slug": "tieu_dien_dai_sy",
    "name": "TIÊU DIỆN ĐẠI SỸ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/dai_tieu_kim_cuong.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/dai_tieu_kim_cuong.jpg"
      }
    ],
    "areaSlug": "to-duong",
    "areaName": "TỔ ĐƯỜNG",
    "location": "TỔ ĐƯỜNG",
    "imgUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/dai_tieu_kim_cuong.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/ho_phap_than_vuong/NGHE_THUAT_PHAT_GIAO/bat_bo_kim_cang/dai_tieu_kim_cuong.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng TIÊU DIỆN ĐẠI SỸ tôn thờ tại TỔ ĐƯỜNG mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0081",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "ĐOAN QUỐC CÔNG NGUYỄN HOÀNG",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "doan_quoc_cong_nguyen_hoang",
    "areaId": "NHA_MAU",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0081",
    "slug": "doan_quoc_cong_nguyen_hoang",
    "name": "ĐOAN QUỐC CÔNG NGUYỄN HOÀNG",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/doan_quoc_cong_nguyen_hoang.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/doan_quoc_cong_nguyen_hoang.jpg"
      }
    ],
    "areaSlug": "nha-mau",
    "areaName": "ĐẠI NAM QUỐC MẪU",
    "location": "ĐẠI NAM QUỐC MẪU",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/doan_quoc_cong_nguyen_hoang.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/doan_quoc_cong_nguyen_hoang.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng ĐOAN QUỐC CÔNG NGUYỄN HOÀNG tôn thờ tại NHÀ MẪU mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0082",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "TAM TÒA THÁNH MẪU",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "tam_toa_thanh_mau",
    "areaId": "NHA_MAU",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0082",
    "slug": "tam_toa_thanh_mau",
    "name": "TAM TÒA THÁNH MẪU",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/tam_toa_thanh_mau.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/tam_toa_thanh_mau.jpg"
      }
    ],
    "areaSlug": "nha-mau",
    "areaName": "ĐẠI NAM QUỐC MẪU",
    "location": "ĐẠI NAM QUỐC MẪU",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/tam_toa_thanh_mau.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/tam_toa_thanh_mau.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng TAM TÒA THÁNH MẪU tôn thờ tại NHÀ MẪU mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0085",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "LÝ THÁNH TÔNG",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "ly_thanh_tong",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0085",
    "slug": "ly_thanh_tong",
    "name": "LÝ THÁNH TÔNG",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/vua_ly_thanh_tong.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/vua_ly_thanh_tong.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/vua_ly_thanh_tong.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/vua_ly_thanh_tong.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng LÝ THÁNH TÔNG tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0086",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "NGUYỄN TRÃI ĐẠI TƯ ĐỒ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "nguyen_trai_dai_tu_do",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0086",
    "slug": "nguyen_trai_dai_tu_do",
    "name": "NGUYỄN TRÃI ĐẠI TƯ ĐỒ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/nguyen_trai_dai_tu_do.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/nguyen_trai_dai_tu_do.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/nguyen_trai_dai_tu_do.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/chu_thanh_ho_quoc/nguyen_trai_dai_tu_do.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng NGUYỄN TRÃI ĐẠI TƯ ĐỒ tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0088",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "BÀ NGUYỆT TRANG ĐÀI (ĐỨC BÀ VISHAKHA)",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "ba_nguyet_trang_dai_duc_ba_vishakha",
    "areaId": "NHA_MAU",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0088",
    "slug": "ba_nguyet_trang_dai_duc_ba_vishakha",
    "name": "BÀ NGUYỆT TRANG ĐÀI (ĐỨC BÀ VISHAKHA)",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/ba_nguyet_trang_dai.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/ba_nguyet_trang_dai.jpg"
      }
    ],
    "areaSlug": "nha-mau",
    "areaName": "ĐẠI NAM QUỐC MẪU",
    "location": "ĐẠI NAM QUỐC MẪU",
    "imgUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/ba_nguyet_trang_dai.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/ba_nguyet_trang_dai.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng BÀ NGUYỆT TRANG ĐÀI (ĐỨC BÀ VISHAKHA) tôn thờ tại NHÀ MẪU mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0089",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THÁNH NỮ SUJATA",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thanh_nu_sujata",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0089",
    "slug": "thanh_nu_sujata",
    "name": "THÁNH NỮ SUJATA",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/thanh_nu_sujata.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/thanh_nu_sujata.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/thanh_nu_sujata.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/dai_thi_chu/thanh_nu_sujata.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THÁNH NỮ SUJATA tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0090",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "THIỀM THỪ CÓC",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "thiem_thu_coc",
    "areaId": "BAO_TANG",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0090",
    "slug": "thiem_thu_coc",
    "name": "THIỀM THỪ CÓC",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/linh_vat_phat_giao/thiem_thu_coc.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/linh_vat_phat_giao/thiem_thu_coc.jpg"
      }
    ],
    "areaSlug": "bao-tang",
    "areaName": "BẢO TÀNG PHẬT GIÁO",
    "location": "BẢO TÀNG PHẬT GIÁO",
    "imgUrl": "/images/bao_tuong_phat_giao/linh_vat_phat_giao/thiem_thu_coc.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/linh_vat_phat_giao/thiem_thu_coc.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng THIỀM THỪ CÓC tôn thờ tại BẢO TÀNG PHẬT GIÁO mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  },
  {
    "code": "TP0091",
    "assembly": "CHƯ PHẬT HẢI HỘI",
    "group": "CỤM TƯỢNG TÔN THỜ",
    "title": "LINH QUY TRƯỜNG THỌ",
    "categoryType": "TƯỢNG CHÍNH",
    "characterGroup": "linh_quy_truong_tho",
    "areaId": "NHA_MAU",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "notes": "",
    "id": "TP0091",
    "slug": "linh_quy_truong_tho",
    "name": "LINH QUY TRƯỜNG THỌ",
    "titleName": "VÔ THƯỢNG NĂNG NHÂN",
    "subtitle": "",
    "assemblyId": "chu_phat_hai_hoi",
    "assemblyName": "CHƯ PHẬT HẢI HỘI",
    "clusterName": "CỤM TƯỢNG TÔN THỜ",
    "type": "TƯỢNG CHÍNH",
    "hasSinglePage": true,
    "clusterMembers": [
      {
        "name": "Văn Thù Bồ Tát",
        "slug": "van_thu_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/linh_vat_phat_giao/an_rong_trieu_dai_hai_ba_trung.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "slug": "pho_hien_bo_tat",
        "imgUrl": "/images/bao_tuong_phat_giao/linh_vat_phat_giao/an_rong_trieu_dai_hai_ba_trung.jpg"
      }
    ],
    "areaSlug": "nha-mau",
    "areaName": "ĐẠI NAM QUỐC MẪU",
    "location": "ĐẠI NAM QUỐC MẪU",
    "imgUrl": "/images/bao_tuong_phat_giao/linh_vat_phat_giao/an_rong_trieu_dai_hai_ba_trung.jpg",
    "avatarUrl": "/images/bao_tuong_phat_giao/linh_vat_phat_giao/an_rong_trieu_dai_hai_ba_trung.jpg",
    "quoteAuthor": "VÔ TRÍ - TÂM HÒA",
    "summary": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.",
    "fullHistoryHtml": "<p>Tôn tượng LINH QUY TRƯỜNG THỌ tôn thờ tại NHÀ MẪU mang năng lượng từ bi và trí tuệ bình an vô biên.</p>"
  }
];
import { OFFICIAL_NTPG_LIST } from './statue-data';

export const BAO_TUONG_NTPG_LIST: BaoTuongNTPGItem[] = OFFICIAL_NTPG_LIST as any;
