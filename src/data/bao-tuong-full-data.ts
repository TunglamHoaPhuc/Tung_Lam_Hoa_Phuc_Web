export interface SubStatue {
  name: string;
  imgUrl: string;
}

export interface ArtisticStatue {
  name: string;
  imgUrl: string;
  description: string;
}

export interface StatueFullItem {
  id: string;
  name: string;
  group: string;
  type: string;
  cluster: string;
  imgUrl: string;
  location: string;
  quote: string;
  description: string;
  authorQuote: string;
  videoUrl?: string;
  subStatues?: SubStatue[];
  artisticStatues?: ArtisticStatue[];
}

export const STATUE_GROUPS = [
  "CHƯ PHẬT HẢI HỘI",
  "THANH TỊNH ĐẠI HẢI CHÚNG",
  "THANH VĂN THÁNH CHÚNG",
  "CHƯ LỊCH ĐẠI TỔ SƯ",
  "HỘ PHÁP THẦN VƯƠNG",
  "CHƯ THÁNH HỘ QUỐC",
  "ĐẠI THÍ CHỦ",
  "LINH VẬT PHẬT GIÁO"
];

export const STATUE_FULL_DATA: StatueFullItem[] = [
  {
    "id": "bt-1",
    "name": "KHÔNG LỘ QUỐC SƯ",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/KHÔNG LỘ QUỐC SƯ.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/KHÔNG LỘ QUỐC SƯ.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/KHÔNG LỘ QUỐC SƯ.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/KHÔNG LỘ QUỐC SƯ.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/KHÔNG LỘ QUỐC SƯ.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-2",
    "name": "PHẬT HOÀNG TRẦN NHÂN TÔNG",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/PHẬT HOÀNG TRẦN NHÂN TÔNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/PHẬT HOÀNG TRẦN NHÂN TÔNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/PHẬT HOÀNG TRẦN NHÂN TÔNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/PHẬT HOÀNG TRẦN NHÂN TÔNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/PHẬT HOÀNG TRẦN NHÂN TÔNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-3",
    "name": "QUỐC SƯ KHUÔNG VIỆT",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/QUỐC SƯ KHUÔNG VIỆT.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/QUỐC SƯ KHUÔNG VIỆT.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/QUỐC SƯ KHUÔNG VIỆT.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/QUỐC SƯ KHUÔNG VIỆT.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/QUỐC SƯ KHUÔNG VIỆT.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-4",
    "name": "SƯ TỔ NGỘ CHÂN TỬ",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/SƯ TỔ NGỘ CHÂN TỬ.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/SƯ TỔ NGỘ CHÂN TỬ.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/SƯ TỔ NGỘ CHÂN TỬ.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/SƯ TỔ NGỘ CHÂN TỬ.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/SƯ TỔ NGỘ CHÂN TỬ.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-5",
    "name": "THIỀN SƯ TỪ ĐẠO HẠNH",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỪ ĐẠO HẠNH.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỪ ĐẠO HẠNH.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỪ ĐẠO HẠNH.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỪ ĐẠO HẠNH.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỪ ĐẠO HẠNH.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-6",
    "name": "THIỀN SƯ TỲ NI DA LƯU CHI",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỲ-NI-DA-LƯU-CHI.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỲ-NI-DA-LƯU-CHI.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỲ-NI-DA-LƯU-CHI.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỲ-NI-DA-LƯU-CHI.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ TỲ-NI-DA-LƯU-CHI.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-7",
    "name": "THIỀN SƯ VẠN HẠNH",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ VẠN HẠNH.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ VẠN HẠNH.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ VẠN HẠNH.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ VẠN HẠNH.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/THIỀN SƯ VẠN HẠNH.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-8",
    "name": "TUỆ TĨNH THIỀN SƯ",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TĨNH THIỀN SƯ.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TĨNH THIỀN SƯ.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TĨNH THIỀN SƯ.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TĨNH THIỀN SƯ.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TĨNH THIỀN SƯ.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-9",
    "name": "TUỆ TRUNG THƯỢNG SĨ",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TRUNG THƯỢNG SĨ.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TRUNG THƯỢNG SĨ.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TRUNG THƯỢNG SĨ.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TRUNG THƯỢNG SĨ.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TUỆ TRUNG THƯỢNG SĨ.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-10",
    "name": "TỔ SƯ KHƯƠNG TĂNG HỘI",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ KHƯƠNG TĂNG HỘI.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ KHƯƠNG TĂNG HỘI.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ KHƯƠNG TĂNG HỘI.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ KHƯƠNG TĂNG HỘI.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ KHƯƠNG TĂNG HỘI.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-11",
    "name": "TỔ SƯ LONG THỌ",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ LONG THỌ.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ LONG THỌ.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ LONG THỌ.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ LONG THỌ.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ LONG THỌ.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-12",
    "name": "TỔ SƯ ĐẠT MA",
    "group": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ LỊCH ĐẠI TỔ SƯ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ ĐẠT MA.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ ĐẠT MA.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ ĐẠT MA.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ ĐẠT MA.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ LỊCH ĐẠI TỔ SƯ/TỔ SƯ ĐẠT MA.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-13",
    "name": "DUC PHAT DI DA TUONG CHINH",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "TƯỢNG CHÍNH",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/duc_phat_di_da_tuong_chinh.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-14",
    "name": "DUC PHAT DI DA CHAT LIEU DA",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_da.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_da.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_da.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_da.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_da.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-15",
    "name": "DUC PHAT DI DA CHAT LIEU DA V2",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-16",
    "name": "DUC PHAT DI DA CHAT LIEU DA V3",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-17",
    "name": "DUC PHAT DI DA CHAT LIEU GOM TRUYEN THONG",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_chat_lieu_gom_truyen_thong.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-18",
    "name": "DUC PHAT DI DA NHAT BAN CAN DAI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_can_dai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_can_dai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_can_dai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_can_dai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_can_dai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-19",
    "name": "DUC PHAT DI DA NHAT BAN CO",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_co.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_co.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_co.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_co.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_nhat_ban_co.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-20",
    "name": "DUC PHAT DI DA PHONG CO DOI TONG TRUNG HOA",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_phong_co_doi_tong_trung_hoa.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-21",
    "name": "DUC PHAT DI DA THAY TAM LINH",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thay_tam_linh.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thay_tam_linh.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thay_tam_linh.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thay_tam_linh.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thay_tam_linh.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-22",
    "name": "DUC PHAT DI DA THUAN VIET",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thuan_viet.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thuan_viet.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thuan_viet.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thuan_viet.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_thuan_viet.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-23",
    "name": "DUC PHAT DI DA TIEU BAN",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DI_DA",
    "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_tieu_ban.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_tieu_ban.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_tieu_ban.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_tieu_ban.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DI_DA/NGHE_THUAT_PHAT_GIAO/duc_phat_di_da_tieu_ban.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-24",
    "name": "PHẬT DƯỢC SƯ LƯU LY QUANG VƯƠNG NHƯ LAI TUONG CHINH",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "TƯỢNG CHÍNH",
    "cluster": "DUC_PHAT_DUOC_SU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/Phật Dược Sư Lưu Ly Quang Vương Như Lai_tuong_chinh.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/Phật Dược Sư Lưu Ly Quang Vương Như Lai_tuong_chinh.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/Phật Dược Sư Lưu Ly Quang Vương Như Lai_tuong_chinh.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/Phật Dược Sư Lưu Ly Quang Vương Như Lai_tuong_chinh.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/Phật Dược Sư Lưu Ly Quang Vương Như Lai_tuong_chinh.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-25",
    "name": "BẢO NGUYỆT TRÍ NGHIÊM QUANG ÂM TỰ TẠI VƯƠNG NHƯ LAI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DUOC_SU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Bảo Nguyệt Trí Nghiêm Quang Âm Tự Tại Vương Như Lai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Bảo Nguyệt Trí Nghiêm Quang Âm Tự Tại Vương Như Lai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Bảo Nguyệt Trí Nghiêm Quang Âm Tự Tại Vương Như Lai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Bảo Nguyệt Trí Nghiêm Quang Âm Tự Tại Vương Như Lai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Bảo Nguyệt Trí Nghiêm Quang Âm Tự Tại Vương Như Lai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-26",
    "name": "DUC PHAT DUOC SU THAY THUOC",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DUOC_SU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/duc_phat_duoc_su_thay_thuoc.JPG",
    "location": "Khu Vực Bảo Tàng",
    "quote": "3 vị Thầy có trong 1 vị Thầy; 1 vị Thầy gồm đủ 3 vị Thầy.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/duc_phat_duoc_su_thay_thuoc.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/duc_phat_duoc_su_thay_thuoc.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/duc_phat_duoc_su_thay_thuoc.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/duc_phat_duoc_su_thay_thuoc.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-27",
    "name": "KIM SẮC BẢO QUANG DIỆU HẠNH THÀNH TỰU NHƯ LAI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DUOC_SU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Kim Sắc Bảo Quang Diệu Hạnh Thành Tựu Như Lai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Kim Sắc Bảo Quang Diệu Hạnh Thành Tựu Như Lai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Kim Sắc Bảo Quang Diệu Hạnh Thành Tựu Như Lai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Kim Sắc Bảo Quang Diệu Hạnh Thành Tựu Như Lai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Kim Sắc Bảo Quang Diệu Hạnh Thành Tựu Như Lai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-28",
    "name": "PHÁP HẢI LÔI ÂM NHƯ LAI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DUOC_SU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Lôi Âm Như Lai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Lôi Âm Như Lai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Lôi Âm Như Lai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Lôi Âm Như Lai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Lôi Âm Như Lai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-29",
    "name": "PHÁP HẢI THẮNG HUỆ DU HÝ THẦN THÔNG NHƯ LAI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DUOC_SU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Thắng Huệ Du Hý Thần Thông Như Lai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Thắng Huệ Du Hý Thần Thông Như Lai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Thắng Huệ Du Hý Thần Thông Như Lai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Thắng Huệ Du Hý Thần Thông Như Lai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Pháp Hải Thắng Huệ Du Hý Thần Thông Như Lai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-30",
    "name": "THIỆN DANH XƯNG CÁT TƯỜNG VƯƠNG NHƯ LAI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DUOC_SU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Thiện Danh Xưng Cát Tường Vương Như Lai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Thiện Danh Xưng Cát Tường Vương Như Lai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Thiện Danh Xưng Cát Tường Vương Như Lai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Thiện Danh Xưng Cát Tường Vương Như Lai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Thiện Danh Xưng Cát Tường Vương Như Lai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-31",
    "name": "VÔ ƯU TỐI THẮNG CÁT TƯỜNG VƯƠNG NHƯ LAI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_DUOC_SU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Vô Ưu Tối Thắng Cát Tường Vương Như Lai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Vô Ưu Tối Thắng Cát Tường Vương Như Lai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Vô Ưu Tối Thắng Cát Tường Vương Như Lai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Vô Ưu Tối Thắng Cát Tường Vương Như Lai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_DUOC_SU/NGHE_THUAT_PHAT_GIAO/Vô Ưu Tối Thắng Cát Tường Vương Như Lai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-32",
    "name": "DUC BAN SU DAN SINH LAM TY NI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_dan_sinh_lam_ty_ni.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_dan_sinh_lam_ty_ni.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_dan_sinh_lam_ty_ni.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_dan_sinh_lam_ty_ni.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_dan_sinh_lam_ty_ni.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-33",
    "name": "DUC BAN SU SO SINH HIEN DAI",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_so_sinh_hien_dai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_so_sinh_hien_dai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_so_sinh_hien_dai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_so_sinh_hien_dai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/duc_ban_su_so_sinh_hien_dai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-34",
    "name": "THICH CA DAN SINH 01",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_01.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_01.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_01.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_01.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_01.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-35",
    "name": "THICH CA DAN SINH 02",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_02.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_02.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_02.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_02.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_02.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-36",
    "name": "THICH CA DAN SINH 03",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_03.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_03.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_03.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_03.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/1_DUC_BAN_SU_SO_SINH/thich_ca_dan_sinh_03.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-37",
    "name": "THICH CA ROI NUI KHO HANH 01",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/2_DUC_BAN_SU_ROI_NUI_KHO_HANH/thich_ca_roi_nui_kho_hanh_01.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/2_DUC_BAN_SU_ROI_NUI_KHO_HANH/thich_ca_roi_nui_kho_hanh_01.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/2_DUC_BAN_SU_ROI_NUI_KHO_HANH/thich_ca_roi_nui_kho_hanh_01.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/2_DUC_BAN_SU_ROI_NUI_KHO_HANH/thich_ca_roi_nui_kho_hanh_01.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/2_DUC_BAN_SU_ROI_NUI_KHO_HANH/thich_ca_roi_nui_kho_hanh_01.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-38",
    "name": "THICH CA NIEM HOA VI TIEU 01",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_01.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_01.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_01.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_01.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_01.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-39",
    "name": "THICH CA NIEM HOA VI TIEU 02",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_02.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_02.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_02.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_02.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/3_DUC_BAN_SU_NIEM_HOA_VI_TIEU/thich_ca_niem_hoa_vi_tieu_02.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-40",
    "name": "THICH CA KHO HANH 01",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/4_DUC_BAN_SU_KHO_HANH/thich_ca_kho_hanh_01.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/4_DUC_BAN_SU_KHO_HANH/thich_ca_kho_hanh_01.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/4_DUC_BAN_SU_KHO_HANH/thich_ca_kho_hanh_01.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/4_DUC_BAN_SU_KHO_HANH/thich_ca_kho_hanh_01.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/4_DUC_BAN_SU_KHO_HANH/thich_ca_kho_hanh_01.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-41",
    "name": "DUC BAN SU THAYGIAO",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/5_DUC_BAN_SU_THAYGIAO/duc_ban_su_thaygiao.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/5_DUC_BAN_SU_THAYGIAO/duc_ban_su_thaygiao.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/5_DUC_BAN_SU_THAYGIAO/duc_ban_su_thaygiao.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/5_DUC_BAN_SU_THAYGIAO/duc_ban_su_thaygiao.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/5_DUC_BAN_SU_THAYGIAO/duc_ban_su_thaygiao.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-42",
    "name": "DUC BAN SU THANH DAO",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/6_DUC_BAN_SU_THANH_DAO/duc_ban_su_thanh_dao.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/6_DUC_BAN_SU_THANH_DAO/duc_ban_su_thanh_dao.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/6_DUC_BAN_SU_THANH_DAO/duc_ban_su_thanh_dao.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/6_DUC_BAN_SU_THANH_DAO/duc_ban_su_thanh_dao.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/6_DUC_BAN_SU_THANH_DAO/duc_ban_su_thanh_dao.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-43",
    "name": "DUC BAN SU CHUYEN PHAP LUAN",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan.png",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan.png"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan.png"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan.png",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan.png",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-44",
    "name": "DUC BAN SU CHUYEN PHAP LUAN V2",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan_v2.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan_v2.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan_v2.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan_v2.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/NGHE_THUAT_PHAT_GIAO/7_DUC_BAN_SU_CHUYEN_PHAP_LUAN/duc_ban_su_chuyen_phap_luan_v2.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-45",
    "name": "DUC PHAT THICH CA TUONGCHINH",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "TƯỢNG CHÍNH",
    "cluster": "DUC_PHAT_THICH_CA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_THICH_CA/TUONG_CHINH/duc_phat_thich_ca_tuongchinh.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-46",
    "name": "DUC PHAT TY LO GIA NA",
    "group": "CHƯ PHẬT HẢI HỘI",
    "type": "TƯỢNG CHÍNH",
    "cluster": "DUC_PHAT_TY_LO_GIA_NA",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ PHẬT HẢI HỘI/DUC_PHAT_TY_LO_GIA_NA/duc_phat_ty_lo_gia_na.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-47",
    "name": "HƯNG ĐẠO ĐẠI VƯƠNG",
    "group": "CHƯ THÁNH HỘ QUỐC",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ THÁNH HỘ QUỐC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/HƯNG ĐẠO ĐẠI VƯƠNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/HƯNG ĐẠO ĐẠI VƯƠNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/HƯNG ĐẠO ĐẠI VƯƠNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/HƯNG ĐẠO ĐẠI VƯƠNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/HƯNG ĐẠO ĐẠI VƯƠNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-48",
    "name": "NGUYỄN TRÃI ĐẠI TƯ ĐỒ",
    "group": "CHƯ THÁNH HỘ QUỐC",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ THÁNH HỘ QUỐC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/NGUYỄN TRÃI ĐẠI TƯ ĐỒ.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/NGUYỄN TRÃI ĐẠI TƯ ĐỒ.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/NGUYỄN TRÃI ĐẠI TƯ ĐỒ.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/NGUYỄN TRÃI ĐẠI TƯ ĐỒ.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/NGUYỄN TRÃI ĐẠI TƯ ĐỒ.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-49",
    "name": "PHÙ ĐỔNG THIÊN VƯƠNG",
    "group": "CHƯ THÁNH HỘ QUỐC",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ THÁNH HỘ QUỐC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/PHÙ ĐỔNG THIÊN VƯƠNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/PHÙ ĐỔNG THIÊN VƯƠNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/PHÙ ĐỔNG THIÊN VƯƠNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/PHÙ ĐỔNG THIÊN VƯƠNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/PHÙ ĐỔNG THIÊN VƯƠNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-50",
    "name": "TAM TÒA THÁNH MẪU",
    "group": "CHƯ THÁNH HỘ QUỐC",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ THÁNH HỘ QUỐC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/TAM TÒA THÁNH MẪU.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/TAM TÒA THÁNH MẪU.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/TAM TÒA THÁNH MẪU.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/TAM TÒA THÁNH MẪU.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/TAM TÒA THÁNH MẪU.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-51",
    "name": "VUA LÝ THÁNH TÔNG",
    "group": "CHƯ THÁNH HỘ QUỐC",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ THÁNH HỘ QUỐC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/VUA LÝ THÁNH TÔNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/VUA LÝ THÁNH TÔNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/VUA LÝ THÁNH TÔNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/VUA LÝ THÁNH TÔNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/VUA LÝ THÁNH TÔNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-52",
    "name": "ĐOAN QUỐC CÔNG NGUYỄN HOÀNG",
    "group": "CHƯ THÁNH HỘ QUỐC",
    "type": "TƯỢNG CHÍNH",
    "cluster": "CHƯ THÁNH HỘ QUỐC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/ĐOAN QUỐC CÔNG NGUYỄN HOÀNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/ĐOAN QUỐC CÔNG NGUYỄN HOÀNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/ĐOAN QUỐC CÔNG NGUYỄN HOÀNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/ĐOAN QUỐC CÔNG NGUYỄN HOÀNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/CHƯ THÁNH HỘ QUỐC/ĐOAN QUỐC CÔNG NGUYỄN HOÀNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-53",
    "name": "KHUYEN THIEN CAN DAI",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/KHUYEN_THIEN_can_dai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/KHUYEN_THIEN_can_dai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/KHUYEN_THIEN_can_dai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/KHUYEN_THIEN_can_dai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/KHUYEN_THIEN_can_dai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-54",
    "name": "MẬT TÍCH KIM CANG CO",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/MẬT TÍCH KIM CANG_co.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/MẬT TÍCH KIM CANG_co.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/MẬT TÍCH KIM CANG_co.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/MẬT TÍCH KIM CANG_co.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/MẬT TÍCH KIM CANG_co.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-55",
    "name": "NA LA DIEN KIM CANG CO",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/NA LA DIEN KIM CANG_co.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/NA LA DIEN KIM CANG_co.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/NA LA DIEN KIM CANG_co.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/NA LA DIEN KIM CANG_co.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/NA LA DIEN KIM CANG_co.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-56",
    "name": "THÍCH ĐẾ HOÀN NHÂN PHONG CO",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/THÍCH ĐẾ HOÀN NHÂN_phong_co.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/THÍCH ĐẾ HOÀN NHÂN_phong_co.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/THÍCH ĐẾ HOÀN NHÂN_phong_co.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/THÍCH ĐẾ HOÀN NHÂN_phong_co.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/THÍCH ĐẾ HOÀN NHÂN_phong_co.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-57",
    "name": "TRUNG AC CAN DAI",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/TRUNG_AC_can_dai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/TRUNG_AC_can_dai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/TRUNG_AC_can_dai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/TRUNG_AC_can_dai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/TRUNG_AC_can_dai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-58",
    "name": "VI ĐÀ HỘ PHÁP PHU DONG THIEN VUONG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/VI ĐÀ HỘ PHÁP_phu_dong_thien_vuong.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/VI ĐÀ HỘ PHÁP_phu_dong_thien_vuong.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/VI ĐÀ HỘ PHÁP_phu_dong_thien_vuong.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/VI ĐÀ HỘ PHÁP_phu_dong_thien_vuong.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/VI ĐÀ HỘ PHÁP_phu_dong_thien_vuong.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-59",
    "name": "VI DA HO PHAP TAM BAO",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/vi_da_ho_phap_tam_bao.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/vi_da_ho_phap_tam_bao.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/vi_da_ho_phap_tam_bao.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/vi_da_ho_phap_tam_bao.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/vi_da_ho_phap_tam_bao.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-60",
    "name": "BẤT ĐỘNG KIM CƯƠNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bất Động Kim Cương.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bất Động Kim Cương.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bất Động Kim Cương.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bất Động Kim Cương.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bất Động Kim Cương.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-61",
    "name": "BỘ TRÍCH KIM CƯƠNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bộ Trích Kim Cương.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bộ Trích Kim Cương.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bộ Trích Kim Cương.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bộ Trích Kim Cương.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Bộ Trích Kim Cương.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-62",
    "name": "GIÁNG TAM THẾ KIM CƯƠNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Giáng Tam Thế Kim Cương.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Giáng Tam Thế Kim Cương.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Giáng Tam Thế Kim Cương.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Giáng Tam Thế Kim Cương.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Giáng Tam Thế Kim Cương.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-63",
    "name": "MÃ ĐẦU KIM CƯƠNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Mã Đầu Kim Cương.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Mã Đầu Kim Cương.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Mã Đầu Kim Cương.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Mã Đầu Kim Cương.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Mã Đầu Kim Cương.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-64",
    "name": "VÔ NĂNG THẮNG KIM CƯƠNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Vô Năng Thắng Kim Cương.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Vô Năng Thắng Kim Cương.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Vô Năng Thắng Kim Cương.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Vô Năng Thắng Kim Cương.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Vô Năng Thắng Kim Cương.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-65",
    "name": "ĐẠI LUÂN KIM CƯƠNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Luân Kim Cương.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Luân Kim Cương.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Luân Kim Cương.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Luân Kim Cương.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Luân Kim Cương.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-66",
    "name": "ĐẠI TIẾU KIM CƯƠNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Tiếu Kim Cương.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Tiếu Kim Cương.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Tiếu Kim Cương.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Tiếu Kim Cương.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Tiếu Kim Cương.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-67",
    "name": "ĐẠI UY ĐỨC KIM CƯƠNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Uy Đức Kim Cương.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Uy Đức Kim Cương.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Uy Đức Kim Cương.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Uy Đức Kim Cương.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/NGHE_THUAT_PHAT_GIAO/BÁT BỘ KIM CANG/Đại Uy Đức Kim Cương.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-68",
    "name": "KHUYẾN THIỆN",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KHUYẾN THIỆN.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KHUYẾN THIỆN.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KHUYẾN THIỆN.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KHUYẾN THIỆN.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KHUYẾN THIỆN.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-69",
    "name": "KIÊN LAO ĐỊA THẦN",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KIÊN LAO ĐỊA THẦN.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KIÊN LAO ĐỊA THẦN.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KIÊN LAO ĐỊA THẦN.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KIÊN LAO ĐỊA THẦN.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/KIÊN LAO ĐỊA THẦN.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-70",
    "name": "MẬT TÍCH HỘ PHÁP",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/MẬT TÍCH HỘ PHÁP.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/MẬT TÍCH HỘ PHÁP.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/MẬT TÍCH HỘ PHÁP.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/MẬT TÍCH HỘ PHÁP.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/MẬT TÍCH HỘ PHÁP.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-71",
    "name": "NA LA DIÊN HỘ PHÁP",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/NA LA DIÊN HỘ PHÁP.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/NA LA DIÊN HỘ PHÁP.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/NA LA DIÊN HỘ PHÁP.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/NA LA DIÊN HỘ PHÁP.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/NA LA DIÊN HỘ PHÁP.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-72",
    "name": "THÍCH ĐẾ HOÀN NHÂN",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THÍCH ĐẾ HOÀN NHÂN.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THÍCH ĐẾ HOÀN NHÂN.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THÍCH ĐẾ HOÀN NHÂN.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THÍCH ĐẾ HOÀN NHÂN.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THÍCH ĐẾ HOÀN NHÂN.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-73",
    "name": "TRỪNG ÁC",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/TRỪNG ÁC.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/TRỪNG ÁC.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/TRỪNG ÁC.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/TRỪNG ÁC.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/TRỪNG ÁC.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-74",
    "name": "VI ĐÀ HỘ PHÁP",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/VI ĐÀ HỘ PHÁP.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/VI ĐÀ HỘ PHÁP.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/VI ĐÀ HỘ PHÁP.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/VI ĐÀ HỘ PHÁP.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/VI ĐÀ HỘ PHÁP.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-75",
    "name": "AN ĐỂ LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/AN ĐỂ LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/AN ĐỂ LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/AN ĐỂ LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/AN ĐỂ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/AN ĐỂ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-76",
    "name": "BA DI LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/BA DI LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/BA DI LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/BA DI LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/BA DI LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/BA DI LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-77",
    "name": "CHIÊU ĐỔ LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHIÊU ĐỔ LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHIÊU ĐỔ LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHIÊU ĐỔ LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHIÊU ĐỔ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHIÊU ĐỔ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-78",
    "name": "CHÂN ĐẠT LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHÂN ĐẠT LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHÂN ĐẠT LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHÂN ĐẠT LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHÂN ĐẠT LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CHÂN ĐẠT LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-79",
    "name": "CUNG TỲ LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CUNG TỲ LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CUNG TỲ LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CUNG TỲ LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CUNG TỲ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/CUNG TỲ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-80",
    "name": "MA HỔ LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MA HỔ LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MA HỔ LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MA HỔ LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MA HỔ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MA HỔ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-81",
    "name": "MÊ SÚY LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MÊ SÚY LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MÊ SÚY LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MÊ SÚY LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MÊ SÚY LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/MÊ SÚY LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-82",
    "name": "NHÂN ĐẠT LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/NHÂN ĐẠT LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/NHÂN ĐẠT LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/NHÂN ĐẠT LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/NHÂN ĐẠT LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/NHÂN ĐẠT LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-83",
    "name": "PHẠT CHIẾT LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/PHẠT CHIẾT LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/PHẠT CHIẾT LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/PHẠT CHIẾT LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/PHẠT CHIẾT LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/PHẠT CHIẾT LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-84",
    "name": "SAN ĐỂ LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/SAN ĐỂ LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/SAN ĐỂ LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/SAN ĐỂ LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/SAN ĐỂ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/SAN ĐỂ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-85",
    "name": "TỲ YẾT LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/TỲ YẾT LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/TỲ YẾT LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/TỲ YẾT LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/TỲ YẾT LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/TỲ YẾT LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-86",
    "name": "ÁT NỂ LA ĐẠI TƯỚNG",
    "group": "HỘ PHÁP THẦN VƯƠNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "HỘ PHÁP THẦN VƯƠNG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/ÁT NỂ LA ĐẠI TƯỚNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/ÁT NỂ LA ĐẠI TƯỚNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/ÁT NỂ LA ĐẠI TƯỚNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/ÁT NỂ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/HỘ PHÁP THẦN VƯƠNG/TUONG_CHINH/THẬP NHỊ DƯỢC XOA/ÁT NỂ LA ĐẠI TƯỚNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-87",
    "name": "CÁC ẤN RỒNG TRIỆU ĐẠI NHÀ NGUYỄN VIỆT NAM",
    "group": "LINH VẬT PHẬT GIÁO",
    "type": "TƯỢNG CHÍNH",
    "cluster": "LINH VẬT PHẬT GIÁO",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/CÁC ẤN RỒNG TRIỆU ĐẠI NHÀ NGUYỄN VIỆT NAM.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/CÁC ẤN RỒNG TRIỆU ĐẠI NHÀ NGUYỄN VIỆT NAM.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/CÁC ẤN RỒNG TRIỆU ĐẠI NHÀ NGUYỄN VIỆT NAM.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/CÁC ẤN RỒNG TRIỆU ĐẠI NHÀ NGUYỄN VIỆT NAM.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/CÁC ẤN RỒNG TRIỆU ĐẠI NHÀ NGUYỄN VIỆT NAM.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-88",
    "name": "THIỀM THỨ CÓC",
    "group": "LINH VẬT PHẬT GIÁO",
    "type": "TƯỢNG CHÍNH",
    "cluster": "LINH VẬT PHẬT GIÁO",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/THIỀM THỨ CÓC.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/THIỀM THỨ CÓC.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/THIỀM THỨ CÓC.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/THIỀM THỨ CÓC.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/THIỀM THỨ CÓC.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-89",
    "name": "ẤN RỒNG TRIỀU ĐẠI HAI BÀ TRƯNG",
    "group": "LINH VẬT PHẬT GIÁO",
    "type": "TƯỢNG CHÍNH",
    "cluster": "LINH VẬT PHẬT GIÁO",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/ẤN RỒNG TRIỀU ĐẠI HAI BÀ TRƯNG.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/ẤN RỒNG TRIỀU ĐẠI HAI BÀ TRƯNG.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/ẤN RỒNG TRIỀU ĐẠI HAI BÀ TRƯNG.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/ẤN RỒNG TRIỀU ĐẠI HAI BÀ TRƯNG.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/LINH VẬT PHẬT GIÁO/ẤN RỒNG TRIỀU ĐẠI HAI BÀ TRƯNG.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-90",
    "name": "CHUAN DE BO TAT TUONG CHINH",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_CHUAN_DE",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/chuan_de_bo_tat_tuong_chinh.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-91",
    "name": "CHUAN DE BO TAT CO",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_CHUAN_DE",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/NGHE_THUAT_PHAT_GIAO/chuan_de_bo_tat_co.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/NGHE_THUAT_PHAT_GIAO/chuan_de_bo_tat_co.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/NGHE_THUAT_PHAT_GIAO/chuan_de_bo_tat_co.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/NGHE_THUAT_PHAT_GIAO/chuan_de_bo_tat_co.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_CHUAN_DE/NGHE_THUAT_PHAT_GIAO/chuan_de_bo_tat_co.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-92",
    "name": "BO TAT DAI THE CHI",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_DAI_THE_CHI",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DAI_THE_CHI/bo_tat_dai_the_chi.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-93",
    "name": "DIA TANG BO TAT TUONG CHINH",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_DIA_TANG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/dia_tang_bo_tat_tuong_chinh.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-94",
    "name": "DIA TANG BO TAT MIEN NAM",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_DIA_TANG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_bo_tat_mien_nam.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_bo_tat_mien_nam.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_bo_tat_mien_nam.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_bo_tat_mien_nam.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_bo_tat_mien_nam.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-95",
    "name": "DIA TANG DOC",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_DIA_TANG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_doc.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_doc.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_doc.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_doc.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_doc.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-96",
    "name": "DIA TANG HIEN DAI",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_DIA_TANG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_hien_dai.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_hien_dai.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_hien_dai.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_hien_dai.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_hien_dai.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-97",
    "name": "DIA TANG NGANG",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_DIA_TANG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_ngang.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_ngang.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_ngang.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_ngang.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_ngang.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-98",
    "name": "DIA TANG NHAT BAN TUONG GHEP",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_DIA_TANG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_nhat_ban_tuong_ghep.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_nhat_ban_tuong_ghep.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_nhat_ban_tuong_ghep.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_nhat_ban_tuong_ghep.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_nhat_ban_tuong_ghep.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-99",
    "name": "DIA TANG PHONG CO (2)",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_DIA_TANG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_phong_co (2).JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_phong_co (2).JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_phong_co (2).JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_phong_co (2).JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DIA_TANG/NGHE_THUAT_PHAT_GIAO/dia_tang_phong_co (2).JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-100",
    "name": "DI LAC BO TAT NTPG",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_DI_LAC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_ntpg.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_ntpg.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_ntpg.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_ntpg.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_ntpg.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-101",
    "name": "DI LAC BO TAT TUONG CHINH",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_DI_LAC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_tuong_chinh.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-102",
    "name": "DI LAC BO TAT V2",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_DI_LAC",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_v2.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_v2.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_v2.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_v2.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_DI_LAC/di_lac_bo_tat_v2.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-103",
    "name": "NHAT NGUYET QUANG BO TAT",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_NHAT_NGUYET_QUANG",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_NHAT_NGUYET_QUANG/nhat_nguyet_quang_bo_tat.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-104",
    "name": "BO TAT PHO HIEN",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_PHO_HIEN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_PHO_HIEN/bo_tat_pho_hien.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-105",
    "name": "QUAN AM NGUYET TRI TUONG CHINH",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/quan_am_nguyet_tri_tuong_chinh.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-106",
    "name": "33 ỨNG HÓA 01",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-01.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-01.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-01.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-01.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-01.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-107",
    "name": "33 ỨNG HÓA 02",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-02.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-02.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-02.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-02.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-02.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-108",
    "name": "33 ỨNG HÓA 03",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-03.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-03.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-03.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-03.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-03.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-109",
    "name": "33 ỨNG HÓA 04",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-04.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-04.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-04.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-04.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-04.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-110",
    "name": "33 ỨNG HÓA 05",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-05.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-05.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-05.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-05.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-05.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-111",
    "name": "33 ỨNG HÓA 06",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-06.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-06.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-06.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-06.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-06.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-112",
    "name": "33 ỨNG HÓA 07",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-07.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-07.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-07.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-07.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-07.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-113",
    "name": "33 ỨNG HÓA 08",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-08.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-08.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-08.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-08.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-08.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-114",
    "name": "33 ỨNG HÓA 09",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-09.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-09.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-09.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-09.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-09.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-115",
    "name": "33 ỨNG HÓA 10",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-10.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-10.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-10.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-10.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-10.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-116",
    "name": "33 ỨNG HÓA 11",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-11.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-11.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-11.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-11.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-11.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-117",
    "name": "33 ỨNG HÓA 12",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-12.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-12.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-12.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-12.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-12.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-118",
    "name": "33 ỨNG HÓA 13",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-13.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-13.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-13.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-13.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-13.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-119",
    "name": "33 ỨNG HÓA 14",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-14.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-14.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-14.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-14.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-14.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-120",
    "name": "33 ỨNG HÓA 15",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-15.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-15.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-15.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-15.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-15.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-121",
    "name": "33 ỨNG HÓA 16",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-16.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-16.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-16.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-16.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-16.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-122",
    "name": "33 ỨNG HÓA 17",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-17.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-17.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-17.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-17.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-17.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-123",
    "name": "33 ỨNG HÓA 18",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-18.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-18.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-18.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-18.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-18.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-124",
    "name": "33 ỨNG HÓA 19",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-19.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-19.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-19.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-19.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-19.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-125",
    "name": "33 ỨNG HÓA 20",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-20.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-20.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-20.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-20.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-20.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-126",
    "name": "33 ỨNG HÓA 21",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-21.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-21.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-21.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-21.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-21.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-127",
    "name": "33 ỨNG HÓA 22",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-22.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-22.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-22.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-22.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-22.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-128",
    "name": "33 ỨNG HÓA 23",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-23.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-23.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-23.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-23.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-23.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-129",
    "name": "33 ỨNG HÓA 24",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-24.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-24.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-24.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-24.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-24.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-130",
    "name": "33 ỨNG HÓA 25",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-25.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-25.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-25.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-25.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-25.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-131",
    "name": "33 ỨNG HÓA 26",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-26.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-26.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-26.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-26.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-26.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-132",
    "name": "33 ỨNG HÓA 27",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-27.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-27.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-27.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-27.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-27.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-133",
    "name": "33 ỨNG HÓA 28",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-28.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-28.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-28.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-28.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-28.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-134",
    "name": "33 ỨNG HÓA 29",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-29.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-29.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-29.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-29.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-29.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-135",
    "name": "33 ỨNG HÓA 30",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-30.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-30.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-30.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-30.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-30.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-136",
    "name": "33 ỨNG HÓA 31",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-31.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-31.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-31.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-31.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-31.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-137",
    "name": "33 ỨNG HÓA 32",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-32.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-32.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-32.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-32.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-32.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-138",
    "name": "33 ỨNG HÓA 33",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-33.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-33.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-33.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-33.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/33_HOA_THAN_QUAN_AM/33 ứng hóa-33.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-139",
    "name": "NGƯ LAM QUAN ÂM",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/Ngư Lam Quan Âm.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/Ngư Lam Quan Âm.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/Ngư Lam Quan Âm.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/Ngư Lam Quan Âm.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/Ngư Lam Quan Âm.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-140",
    "name": "QUAN AM BACH Y",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_bach_y.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_bach_y.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_bach_y.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_bach_y.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_bach_y.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-141",
    "name": "QUAN AM HUONG TICH",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_huong_tich.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_huong_tich.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_huong_tich.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_huong_tich.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_huong_tich.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-142",
    "name": "QUAN AM TAM DIEN (2)",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien (2).JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien (2).JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien (2).JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien (2).JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien (2).JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-143",
    "name": "QUAN AM TAM DIEN",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tam_dien.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-144",
    "name": "QUAN AM THIEN THU",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-145",
    "name": "QUAN AM THIEN THU THIEN NHAN DANG DUNG",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu_thien_nhan_dang_dung.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu_thien_nhan_dang_dung.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu_thien_nhan_dang_dung.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu_thien_nhan_dang_dung.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_thien_thu_thien_nhan_dang_dung.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-146",
    "name": "QUAN AM TIEU DIEN",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-147",
    "name": "QUAN AM TIEU DIEN MIEN NAM",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien_mien_nam.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien_mien_nam.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien_mien_nam.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien_mien_nam.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tieu_dien_mien_nam.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-148",
    "name": "QUAN AM TONG TU",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tong_tu.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tong_tu.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tong_tu.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tong_tu.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tong_tu.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-149",
    "name": "QUAN AM TUONG GHEP NHAT BAN",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tuong_ghep_nhat_ban.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tuong_ghep_nhat_ban.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tuong_ghep_nhat_ban.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tuong_ghep_nhat_ban.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_am_tuong_ghep_nhat_ban.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-150",
    "name": "QUAN TU TAI PHONG CO",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_phong_co.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_phong_co.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_phong_co.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_phong_co.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_phong_co.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-151",
    "name": "QUAN TU TAI TRANH",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "BO_TAT_QUAN_AM",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_tranh.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_tranh.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_tranh.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_tranh.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_QUAN_AM/NGHE_THUAT_PHAT_GIAO/quan_tu_tai_tranh.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-152",
    "name": "BO TAT VAN THU",
    "group": "THANH TỊNH ĐẠI HẢI CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "BO_TAT_VAN_THU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_VAN_THU/bo_tat_van_thu.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_VAN_THU/bo_tat_van_thu.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_VAN_THU/bo_tat_van_thu.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_VAN_THU/bo_tat_van_thu.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH TỊNH ĐẠI HẢI CHÚNG/BO_TAT_VAN_THU/bo_tat_van_thu.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-153",
    "name": "BA TIÊU LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Ba Tiêu La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Ba Tiêu La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Ba Tiêu La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Ba Tiêu La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Ba Tiêu La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-154",
    "name": "BỐ ĐẠI LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Bố Đại La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Bố Đại La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Bố Đại La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Bố Đại La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Bố Đại La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-155",
    "name": "CỬ BÁT LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Cử Bát La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Cử Bát La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Cử Bát La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Cử Bát La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Cử Bát La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-156",
    "name": "HÀNG LONG LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Hàng Long La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Hàng Long La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Hàng Long La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Hàng Long La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Hàng Long La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-157",
    "name": "KHAI TÂM LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khai Tâm La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khai Tâm La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khai Tâm La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khai Tâm La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khai Tâm La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-158",
    "name": "KHOÁI NHĨ LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khoái Nhĩ La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khoái Nhĩ La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khoái Nhĩ La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khoái Nhĩ La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khoái Nhĩ La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-159",
    "name": "KHÁNH HỶ LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khánh Hỷ La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khánh Hỷ La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khánh Hỷ La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khánh Hỷ La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Khánh Hỷ La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-160",
    "name": "KỴ TƯỢNG LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Kỵ Tượng La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Kỵ Tượng La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Kỵ Tượng La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Kỵ Tượng La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Kỵ Tượng La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-161",
    "name": "PHỤC HỔ LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Phục Hổ La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Phục Hổ La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Phục Hổ La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Phục Hổ La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Phục Hổ La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-162",
    "name": "QUÁ GIANG LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Quá Giang La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Quá Giang La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Quá Giang La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Quá Giang La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Quá Giang La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-163",
    "name": "THÁC THÁP LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thác Tháp La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thác Tháp La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thác Tháp La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thác Tháp La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thác Tháp La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-164",
    "name": "THÁM THỦ LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thám Thủ La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thám Thủ La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thám Thủ La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thám Thủ La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Thám Thủ La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-165",
    "name": "TIẾU SƯ LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tiếu Sư La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tiếu Sư La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tiếu Sư La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tiếu Sư La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tiếu Sư La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-166",
    "name": "TRƯỜNG MI LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trường Mi La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trường Mi La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trường Mi La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trường Mi La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trường Mi La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-167",
    "name": "TRẦM TƯ LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trầm Tư La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trầm Tư La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trầm Tư La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trầm Tư La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Trầm Tư La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-168",
    "name": "TĨNH TỌA LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tĩnh Tọa La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tĩnh Tọa La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tĩnh Tọa La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tĩnh Tọa La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tĩnh Tọa La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-169",
    "name": "TỌA LỘC LA HÁN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tọa Lộc La Hán_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tọa Lộc La Hán_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tọa Lộc La Hán_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tọa Lộc La Hán_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/NGHE_THUAT_PHAT_GIAO/Tọa Lộc La Hán_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-170",
    "name": "BA TIÊU LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Ba Tiêu La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Ba Tiêu La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Ba Tiêu La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Ba Tiêu La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Ba Tiêu La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-171",
    "name": "BỐ ĐẠI LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Bố Đại La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Bố Đại La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Bố Đại La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Bố Đại La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Bố Đại La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-172",
    "name": "CỬ BÁT LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Cử Bát La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Cử Bát La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Cử Bát La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Cử Bát La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Cử Bát La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-173",
    "name": "HÀNG LONG LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Hàng Long La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Hàng Long La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Hàng Long La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Hàng Long La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Hàng Long La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-174",
    "name": "KHAI TÂM LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khai Tâm La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khai Tâm La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khai Tâm La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khai Tâm La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khai Tâm La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-175",
    "name": "KHOÁI NHĨ LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khoái Nhĩ La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khoái Nhĩ La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khoái Nhĩ La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khoái Nhĩ La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khoái Nhĩ La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-176",
    "name": "KHÁNH HỶ LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khánh Hỷ La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khánh Hỷ La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khánh Hỷ La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khánh Hỷ La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Khánh Hỷ La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-177",
    "name": "KỴ TƯỢNG LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Kỵ Tượng La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Kỵ Tượng La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Kỵ Tượng La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Kỵ Tượng La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Kỵ Tượng La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-178",
    "name": "PHỤC HỔ LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Phục Hổ La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Phục Hổ La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Phục Hổ La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Phục Hổ La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Phục Hổ La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-179",
    "name": "QUÁ GIANG LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Quá Giang La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Quá Giang La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Quá Giang La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Quá Giang La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Quá Giang La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-180",
    "name": "THÁC THÁP LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thác Tháp La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thác Tháp La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thác Tháp La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thác Tháp La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thác Tháp La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-181",
    "name": "THÁM THỦ LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thám Thủ La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thám Thủ La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thám Thủ La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thám Thủ La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Thám Thủ La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-182",
    "name": "TIẾU SƯ LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tiếu Sư La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tiếu Sư La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tiếu Sư La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tiếu Sư La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tiếu Sư La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-183",
    "name": "TRƯỜNG MI LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trường Mi La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trường Mi La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trường Mi La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trường Mi La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trường Mi La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-184",
    "name": "TRẦM TƯ LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trầm Tư La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trầm Tư La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trầm Tư La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trầm Tư La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Trầm Tư La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-185",
    "name": "TĨNH TỌA LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tĩnh Tọa La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tĩnh Tọa La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tĩnh Tọa La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tĩnh Tọa La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tĩnh Tọa La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-186",
    "name": "TỌA LỘC LA HÁN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_BAT_LA_HAN",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tọa Lộc La Hán.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tọa Lộc La Hán.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tọa Lộc La Hán.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tọa Lộc La Hán.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_BAT_LA_HAN/TUONG_CHINH/Tọa Lộc La Hán.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-187",
    "name": "TÔN GIẢ  PHÚ LÂU NA",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả  Phú Lâu Na.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả  Phú Lâu Na.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả  Phú Lâu Na.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả  Phú Lâu Na.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả  Phú Lâu Na.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-188",
    "name": "TÔN GIẢ A NA LUẬT",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Na Luật.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Na Luật.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Na Luật.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Na Luật.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Na Luật.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-189",
    "name": "TÔN GIẢ A NAN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Nan.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Nan.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Nan.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Nan.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả A Nan.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-190",
    "name": "TÔN GIẢ CA CHIÊN DIÊN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ca Chiên Diên.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ca Chiên Diên.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ca Chiên Diên.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ca Chiên Diên.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ca Chiên Diên.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-191",
    "name": "TÔN GIẢ LA HẦU LA",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả La Hầu La.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả La Hầu La.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả La Hầu La.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả La Hầu La.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả La Hầu La.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-192",
    "name": "TÔN GIẢ MỤC KIỀN LIÊN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Mục Kiền Liên.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Mục Kiền Liên.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Mục Kiền Liên.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Mục Kiền Liên.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Mục Kiền Liên.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-193",
    "name": "TÔN GIẢ TU BỒ ĐỀ",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Tu Bồ Đề.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Tu Bồ Đề.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Tu Bồ Đề.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Tu Bồ Đề.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Tu Bồ Đề.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-194",
    "name": "TÔN GIẢ XÁ LỢI PHẤT",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Xá Lợi Phất.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Xá Lợi Phất.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Xá Lợi Phất.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Xá Lợi Phất.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Xá Lợi Phất.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-195",
    "name": "TÔN GIẢ ĐẠI CA DIẾP",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Đại Ca Diếp.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Đại Ca Diếp.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Đại Ca Diếp.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Đại Ca Diếp.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Đại Ca Diếp.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-196",
    "name": "TÔN GIẢ ƯU BA LY",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "TƯỢNG CHÍNH",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ưu Ba Ly.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ưu Ba Ly.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ưu Ba Ly.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ưu Ba Ly.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/Tôn giả Ưu Ba Ly.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-197",
    "name": "A NAN DONG TUONG BAO HA",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_dong_tuong_bao_ha.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_dong_tuong_bao_ha.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_dong_tuong_bao_ha.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_dong_tuong_bao_ha.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_dong_tuong_bao_ha.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-198",
    "name": "A NAN DUC THANH HIEN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_duc_thanh_hien.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_duc_thanh_hien.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_duc_thanh_hien.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_duc_thanh_hien.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_duc_thanh_hien.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-199",
    "name": "A NAN GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/a_nan_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-200",
    "name": "DAI CA DIEP DONG TUONG BAO HA",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_dong_tuong_bao_ha.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_dong_tuong_bao_ha.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_dong_tuong_bao_ha.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_dong_tuong_bao_ha.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_dong_tuong_bao_ha.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-201",
    "name": "DAI CA DIEP GO",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_go.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_go.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_go.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_go.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/dai_ca_diep_go.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-202",
    "name": "A NAN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_nan.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_nan.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_nan.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_nan.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_nan.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-203",
    "name": "A NA LUAT",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_na_luat.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_na_luat.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_na_luat.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_na_luat.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/a_na_luat.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-204",
    "name": "CA CHIEN DIEN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ca_chien_dien.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ca_chien_dien.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ca_chien_dien.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ca_chien_dien.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ca_chien_dien.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-205",
    "name": "DAI CA DIEP",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_ca_diep_.png",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_ca_diep_.png"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_ca_diep_.png"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_ca_diep_.png",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_ca_diep_.png",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-206",
    "name": "DAI MUC KIEN LIEN",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_muc_kien_lien.png",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_muc_kien_lien.png"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_muc_kien_lien.png"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_muc_kien_lien.png",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/dai_muc_kien_lien.png",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-207",
    "name": "LA HAU LA",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/la_hau_la.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/la_hau_la.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/la_hau_la.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/la_hau_la.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/la_hau_la.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-208",
    "name": "PHU LAU NA",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/phu_lau_na.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/phu_lau_na.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/phu_lau_na.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/phu_lau_na.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/phu_lau_na.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-209",
    "name": "TU BO DE",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/tu_bo_de.png",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/tu_bo_de.png"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/tu_bo_de.png"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/tu_bo_de.png",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/tu_bo_de.png",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-210",
    "name": "XA LOI PHAT",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/xa_loi_phat.png",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/xa_loi_phat.png"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/xa_loi_phat.png"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/xa_loi_phat.png",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/xa_loi_phat.png",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-211",
    "name": "ƯU BA LY",
    "group": "THANH VĂN THÁNH CHÚNG",
    "type": "NGHỆ THUẬT PHẬT GIÁO",
    "cluster": "THAP_DAI_DE_TU",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ưu_ba_ly.jpg",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ưu_ba_ly.jpg"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ưu_ba_ly.jpg"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ưu_ba_ly.jpg",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/THANH VĂN THÁNH CHÚNG/THAP_DAI_DE_TU/NGHE_THUAT_PHAT_GIAO/tranh_son_dau/ưu_ba_ly.jpg",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-212",
    "name": "BÀ NGUYỆT TRANG ĐÀI",
    "group": "ĐẠI THÍ CHỦ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "ĐẠI THÍ CHỦ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/BÀ NGUYỆT TRANG ĐÀI.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/BÀ NGUYỆT TRANG ĐÀI.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/BÀ NGUYỆT TRANG ĐÀI.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/BÀ NGUYỆT TRANG ĐÀI.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/BÀ NGUYỆT TRANG ĐÀI.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-213",
    "name": "THÁNH NỮ SUJATA",
    "group": "ĐẠI THÍ CHỦ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "ĐẠI THÍ CHỦ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/THÁNH NỮ SUJATA.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/THÁNH NỮ SUJATA.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/THÁNH NỮ SUJATA.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/THÁNH NỮ SUJATA.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/THÁNH NỮ SUJATA.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  },
  {
    "id": "bt-214",
    "name": "ĐỨC ÔNG CẤP CÔ ĐỘC",
    "group": "ĐẠI THÍ CHỦ",
    "type": "TƯỢNG CHÍNH",
    "cluster": "ĐẠI THÍ CHỦ",
    "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/ĐỨC ÔNG CẤP CÔ ĐỘC.JPG",
    "location": "Khu Vực Tam Bảo",
    "quote": "Ngài sinh ở thế gian nhưng không nhiễm thế gian. Vì Ngài đã rõ giáo lý duyên khởi, đoạn trừ mầm mống luân hồi.",
    "description": "Dưới chân dãy Himalaya, nơi một vương quốc nhỏ được dựng nên và một dòng giống mang tên Śākya lưu truyền qua bao đời, có một vầng sáng âm thầm lớn lên trong cung điện.\n\nNgười đời gọi Ngài là bậc xuất thân dòng dõi Thái Dương, nhưng Ngài chọn rời hết ba tòa Cung Vui để đi thẳng vào con đường tỉnh thức.",
    "authorQuote": "VÔ TRÍ - TÂM HÒA",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "subStatues": [
      {
        "name": "Văn Thù Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/ĐỨC ÔNG CẤP CÔ ĐỘC.JPG"
      },
      {
        "name": "Phổ Hiền Bồ Tát",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/ĐỨC ÔNG CẤP CÔ ĐỘC.JPG"
      }
    ],
    "artisticStatues": [
      {
        "name": "Nghệ Thuật Sơn Son Thếp Vàng",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/ĐỨC ÔNG CẤP CÔ ĐỘC.JPG",
        "description": "Chất liệu gỗ phỏng cổ"
      },
      {
        "name": "Nghệ Thuật Chạm Đá Nguyên Khối",
        "imgUrl": "/images/BẢO TƯỢNG PHẬT GIÁO/ĐẠI THÍ CHỦ/ĐỨC ÔNG CẤP CÔ ĐỘC.JPG",
        "description": "Chất liệu đá tự nhiên"
      }
    ]
  }
];
