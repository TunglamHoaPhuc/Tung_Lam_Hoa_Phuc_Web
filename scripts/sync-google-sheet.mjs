import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Hy4aEvoYaDU-BPJ0GZso7wyWIW5s4Egz/export?format=csv&gid=764887609';

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') i++;
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_');
}

function formatAreaName(areaId) {
  if (!areaId) return 'Tùng Lâm Hòa Phúc';
  const key = areaId.toUpperCase().replace(/[-\s]/g, '_');
  if (key.includes('TAM_BAO') || key.includes('TAMBAO')) return 'Tam Bảo (Chánh Điện)';
  if (key.includes('GIANG_DUONG')) return 'Đại Giảng Đường Ngộ Chân Tử';
  if (key.includes('SAN_DI_DA')) return 'Sân Di Đà';
  if (key.includes('SAN_DI_LAC') || key.includes('SAN_LAM_TY_NI')) return 'Sân Di Lặc & Vườn Lâm Tỳ Ni';
  if (key.includes('BAO_TANG')) return 'Bảo Tàng Văn Hóa Phật Giáo';
  if (key.includes('NHA_MAU')) return 'Nhà Mẫu Đại Nam';
  if (key.includes('TO_DUONG')) return 'Tổ Đường';
  if (key.includes('VANG_SINH') || key.includes('TU_AN')) return 'Tứ Ân Vãng Sinh Đường';
  if (key.includes('BAO_THAP')) return 'Bảo Tháp Vạn Phật Xá Lợi';
  if (key.includes('LAU_KINH')) return 'Lầu Kinh Luân';
  if (key.includes('CONG_THAP')) return 'Cổng Tháp';
  return areaId;
}

function formatAssembly(rawAsm) {
  const norm = slugify(rawAsm);
  if (norm.includes('chu_phat')) return { id: 'chu_phat_hai_hoi', name: 'Chư Phật Hải Hội' };
  if (norm.includes('thanh_tinh')) return { id: 'thanh_tinh_dai_hai_chung', name: 'Thanh Tịnh Đại Hải Chúng' };
  if (norm.includes('thanh_van') || norm.includes('la_han')) return { id: 'thanh_van_la_han', name: 'Thanh Văn Thánh Chúng' };
  if (norm.includes('to_su') || norm.includes('lich_dai')) return { id: 'chu_lich_dai_to_su', name: 'Chư Lịch Đại Tổ Sư' };
  if (norm.includes('ho_phap') || norm.includes('than_vuong')) return { id: 'ho_phap_than_vuong', name: 'Hộ Pháp Thần Vương' };
  if (norm.includes('thanh_ho_quoc') || norm.includes('ho_quoc')) return { id: 'chu_thanh_ho_quoc', name: 'Chư Thánh Hộ Quốc' };
  if (norm.includes('thi_chu') || norm.includes('dai_thi')) return { id: 'dai_thi_chu', name: 'Đại Thí Chủ' };
  if (norm.includes('linh_vat') || norm.includes('linh_thu')) return { id: 'linh_vat_phat_giao', name: 'Linh Vật Phật Giáo' };
  return { id: norm || 'chua_phan_loai', name: rawAsm || 'Bảo Tượng Phật Giáo' };
}

// Index all image files in public
function scanPublicImages() {
  const publicDir = path.resolve(__dirname, '../public');
  const files = [];

  function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) scan(full);
      else {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          files.push({
            fullPath: full,
            relPath: '/' + path.relative(publicDir, full).replace(/\\/g, '/'),
            filenameWithoutExt: path.basename(entry.name, path.extname(entry.name)).toLowerCase(),
            filenameClean: slugify(path.basename(entry.name, path.extname(entry.name))),
          });
        }
      }
    }
  }

  scan(path.join(publicDir, 'images/bao_tuong_phat_giao'));
  scan(path.join(publicDir, 'images/33 ỨNG HÓA THÂN ĐỨC QUAN ÂM'));
  scan(path.join(publicDir, 'images/anh-tho-cac-vi-cao-tang'));
  scan(path.join(publicDir, 'images/trang-chu'));

  return files;
}

const allImages = scanPublicImages();

function findImageForStatue(item) {
  // Strategy 1: Exact match with tenAnhTuongUng
  if (item.tenAnhTuongUng && item.tenAnhTuongUng.trim()) {
    const targetClean = slugify(item.tenAnhTuongUng.trim());
    const exact = allImages.find((img) => img.filenameClean === targetClean);
    if (exact) return exact.relPath;

    const starts = allImages.find((img) => img.filenameClean.startsWith(targetClean));
    if (starts) return starts.relPath;

    const includes = allImages.find((img) => img.filenameClean.includes(targetClean));
    if (includes) return includes.relPath;
  }

  // Strategy 2: Match by item.code (e.g. TP0001)
  if (item.code) {
    const codeClean = item.code.toLowerCase().trim();
    const matchCode = allImages.find((img) => img.filenameWithoutExt === codeClean || img.filenameWithoutExt.startsWith(codeClean));
    if (matchCode) return matchCode.relPath;
  }

  // Strategy 3: Match by subTenTuong or tenTuongPhap
  const nameClean = slugify(item.subTenTuong || item.tenTuongPhap);
  if (nameClean && nameClean.length > 3) {
    const matchName = allImages.find((img) => img.filenameClean === nameClean || img.filenameClean.includes(nameClean));
    if (matchName) return matchName.relPath;
  }

  return '/images/toan-canh-chua.jpg';
}

async function sync() {
  console.log('🔄 Đang kết nối và tải dữ liệu mới nhất từ Google Sheet...');
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    let dataStartIndex = rows.findIndex((r) => r[0] === 'TP0001' || r[4] === 'ĐỨC PHẬT THÍCH CA MÂU NI');
    if (dataStartIndex === -1) dataStartIndex = 60;

    const items = [];
    for (let r = dataStartIndex; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 5) continue;
      const col0 = row[0] || '';
      const col4 = row[4] || '';
      if (!col0 && !col4) continue;

      items.push({
        code: row[0] || '',
        hoiChung: row[2] || '',
        cumTuong: row[3] || '',
        tenTuongPhap: row[4] || '',
        subTenTuong: row[5] || '',
        loaiTuong: row[6] || 'TƯỢNG CHÍNH',
        tenAnhTuongUng: row[7] || '',
        idKhuVuc: row[8] || '',
        moTaNguon: row[9] || '',
        quoteSuPhu: row[10] || '',
        quoteNocAnTim: row[11] || '',
        ghiChu: row[12] || '',
      });
    }

    const outputPath = path.resolve(__dirname, '../src/data/statues-from-sheet.json');
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8');
    console.log(`✅ Đã đồng bộ ${items.length} bảo tượng vào: ${outputPath}`);

    // Group NTPG
    const ntpgByMain = {};
    for (const item of items) {
      const isMain = item.loaiTuong.includes('TƯỢNG CHÍNH');
      if (!isMain && item.tenTuongPhap) {
        const key = item.tenTuongPhap.trim().toUpperCase();
        if (!ntpgByMain[key]) ntpgByMain[key] = [];
        ntpgByMain[key].push({
          id: item.code || slugify(item.subTenTuong || item.tenTuongPhap),
          title: item.subTenTuong || item.tenTuongPhap,
          location: formatAreaName(item.idKhuVuc),
          meaning: item.quoteSuPhu || item.quoteNocAnTim || item.moTaNguon || 'Nghệ thuật Phật giáo tôn nghiêm.',
          imgUrl: findImageForStatue(item),
        });
      }
    }

    const processedStatues = [];
    for (const item of items) {
      const isMain = item.loaiTuong.includes('TƯỢNG CHÍNH');
      const asm = formatAssembly(item.hoiChung);
      const areaName = formatAreaName(item.idKhuVuc);
      const imgUrl = findImageForStatue(item);
      const mainKey = (item.tenTuongPhap || '').trim().toUpperCase();

      const slug = item.code 
        ? slugify(`${item.tenTuongPhap}-${item.subTenTuong || ''}-${item.code}`)
        : slugify(`${item.tenTuongPhap}-${item.subTenTuong || ''}`);

      const artVars = isMain ? (ntpgByMain[mainKey] || []) : [];

      processedStatues.push({
        code: item.code || '',
        assembly: asm.name,
        group: item.cumTuong || 'Bảo Tượng Phật Giáo',
        title: item.tenTuongPhap,
        categoryType: isMain ? 'TƯỢNG CHÍNH' : 'NTPG',
        characterGroup: item.tenAnhTuongUng || slugify(item.tenTuongPhap),
        areaId: item.idKhuVuc || 'tam-bao',
        description: item.moTaNguon || item.subTenTuong || '',
        quote: item.quoteSuPhu || item.quoteNocAnTim || '',
        notes: item.ghiChu || '',

        id: item.code || slug,
        slug: slug,
        name: item.tenTuongPhap,
        titleName: item.tenTuongPhap,
        subtitle: item.subTenTuong || 'Bảo Tượng Tùng Lâm Hòa Phúc',
        assemblyId: asm.id,
        assemblyName: asm.name,
        clusterName: item.cumTuong || 'Bảo Tượng Phật Giáo',
        type: item.loaiTuong || (isMain ? 'TƯỢNG CHÍNH' : 'NTPG'),
        hasSinglePage: true,
        clusterMembers: [],
        areaSlug: slugify(item.idKhuVuc || 'tam-bao'),
        areaName: areaName,
        location: areaName,
        imgUrl: imgUrl,
        avatarUrl: imgUrl,
        quoteAuthor: 'VÔ TRÍ - TÂM HÒA',
        summary: item.quoteSuPhu || item.moTaNguon || item.subTenTuong || 'Bảo tượng trang nghiêm tại Tùng Lâm Hòa Phúc.',
        fullHistoryHtml: `<p>${item.moTaNguon || item.quoteSuPhu || item.quoteNocAnTim || 'Bảo tượng trang nghiêm tại Tùng Lâm Hòa Phúc.'}</p>`,
        artVariations: artVars,
      });
    }

    const fileContent = `// Dữ liệu Bảo Tượng Phật Giáo được đồng bộ tự động từ Google Sheet
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
    imgUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/duc_phat_thien_danh_xung_cat_tuong_vuong_nhu_lai.jpg",
    avatarUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/duc_phat_thien_danh_xung_cat_tuong_vuong_nhu_lai.jpg",
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
    imgUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/duc_phat_bao_nguyet_tri_nghiem_quang_am_tu_tai_vuong_nhu_lai.jpg",
    avatarUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/duc_phat_bao_nguyet_tri_nghiem_quang_am_tu_tai_vuong_nhu_lai.jpg",
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
    imgUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/duc_phat_kim_sac_bao_quang_dieu_hanh_thanh_tuu_nhu_lai.jpg",
    avatarUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/duc_phat_kim_sac_bao_quang_dieu_hanh_thanh_tuu_nhu_lai.jpg",
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
    imgUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/duc_phat_vo_uu_toi_thang_cat_tuong_vuong_nhu_lai.jpg",
    avatarUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/duc_phat_vo_uu_toi_thang_cat_tuong_vuong_nhu_lai.jpg",
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
    imgUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phap_hai_loi_am_nhu_lai.jpg",
    avatarUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phap_hai_loi_am_nhu_lai.jpg",
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
    imgUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phap_hai_thang_hue_du_hy_than_thong_nhu_lai.jpg",
    avatarUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phap_hai_thang_hue_du_hy_than_thong_nhu_lai.jpg",
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
    imgUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.jpg",
    avatarUrl: "/images/bao_tuong_phat_giao/chu_phat_hai_hoi/DUC_PHAT_DUOC_SU/phat_duoc_su_luu_ly_quang_vuong_nhu_lai_tuong_chinh.jpg",
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

export const OFFICIAL_STATUE_DATASET: StatueRecord[] = ${JSON.stringify(processedStatues, null, 2)};

export const OFFICIAL_TUONG_CHINH_LIST: StatueItem[] = OFFICIAL_STATUE_DATASET.filter((s) => s.categoryType === 'TƯỢNG CHÍNH');
export const OFFICIAL_NTPG_LIST: StatueItem[] = OFFICIAL_STATUE_DATASET.filter((s) => s.categoryType !== 'TƯỢNG CHÍNH');

export const STATUE_LIST: StatueItem[] = OFFICIAL_TUONG_CHINH_LIST.length > 0 ? OFFICIAL_TUONG_CHINH_LIST : OFFICIAL_STATUE_DATASET;
`;

    const statueDataPath = path.resolve(__dirname, '../src/data/statue-data.ts');
    fs.writeFileSync(statueDataPath, fileContent, 'utf-8');
    console.log(`✅ Đã cập nhật thành công ${processedStatues.length} bảo tượng vào: ${statueDataPath}`);
  } catch (err) {
    console.error('❌ Lỗi khi đồng bộ Google Sheet:', err);
  }
}

sync();
