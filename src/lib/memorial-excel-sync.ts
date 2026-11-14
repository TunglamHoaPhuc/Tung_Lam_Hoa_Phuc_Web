import { unzipSync, strFromU8 } from 'fflate';
import * as cheerio from 'cheerio';
import {
  DEFAULT_MEMORIAL_DRIVE_FILE_ID,
  DEFAULT_MEMORIAL_DRIVE_URL,
  MemorialCategorySlug,
  MemorialRecord,
  buildMaskedContact,
} from './memorial-types';

export interface ParsedMemorialResult {
  records: MemorialRecord[];
  countsByCategory: Record<string, number>;
  sheetBreakdown: {
    sheetName: string;
    categorySlug: MemorialCategorySlug;
    categoryLabel: string;
    count: number;
  }[];
  warnings: string[];
}

/**
 * Trích xuất Google Drive File ID từ URL chia sẻ hoặc trả về ID gốc nếu hợp lệ.
 */
export function extractGoogleDriveFileId(input?: string | null): string {
  const raw = (input || '').trim();
  if (!raw) return DEFAULT_MEMORIAL_DRIVE_FILE_ID;

  // Dạng /d/FILE_ID/ hoặc ?id=FILE_ID
  const dMatch = raw.match(/\/d\/([a-zA-Z0-9_-]{15,})/);
  if (dMatch?.[1]) return dMatch[1];

  const idParamMatch = raw.match(/[?&]id=([a-zA-Z0-9_-]{15,})/);
  if (idParamMatch?.[1]) return idParamMatch[1];

  // Nếu người dùng truyền thẳng ID
  if (/^[a-zA-Z0-9_-]{15,}$/.test(raw)) return raw;

  return DEFAULT_MEMORIAL_DRIVE_FILE_ID;
}

export function buildGoogleDriveEditUrl(fileId: string): string {
  if (fileId === DEFAULT_MEMORIAL_DRIVE_FILE_ID) {
    return DEFAULT_MEMORIAL_DRIVE_URL;
  }
  return `https://docs.google.com/spreadsheets/d/${fileId}/edit?usp=drivesdk`;
}

/**
 * Tải file .xlsx công khai từ Google Drive (bằng streaming/arrayBuffer).
 */
export async function downloadExcelFromGoogleDrive(fileId: string): Promise<Uint8Array> {
  const urls = [
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`,
    `https://drive.google.com/uc?export=download&confirm=t&id=${encodeURIComponent(fileId)}`,
  ];

  let lastError = 'Không thể tải file từ Google Drive';

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TungLamHoaPhucSync/1.0)',
        },
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        lastError = `Google Drive trả về mã lỗi HTTP ${res.status}`;
        continue;
      }

      const buf = new Uint8Array(await res.arrayBuffer());
      // Kiểm tra chữ ký file ZIP/XLSX ("PK")
      if (buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4b) {
        return buf;
      }

      // Nếu trả về HTML (file chưa bật công khai hoặc cảnh báo xác nhận)
      const headText = new TextDecoder('utf-8', { fatal: false }).decode(buf.slice(0, 600));
      if (headText.includes('<html') || headText.includes('<!DOCTYPE')) {
        lastError =
          'Link Google Drive chưa bật quyền xem công khai ("Bất kỳ ai có đường liên kết") hoặc không phải file .xlsx.';
      } else {
        lastError = 'Dữ liệu tải về không đúng định dạng file Excel (.xlsx).';
      }
    } catch (err: any) {
      lastError = err?.name === 'AbortError'
        ? 'Quá thời gian tải file từ Google Drive (timeout 90s).'
        : err?.message || lastError;
    }
  }

  throw new Error(lastError);
}

/** Chuyển tên cột Excel (A, B, ..., AA) sang chỉ số 0-based. */
function colLettersToIndex(letters: string): number {
  let idx = 0;
  for (let i = 0; i < letters.length; i++) {
    idx = idx * 26 + (letters.charCodeAt(i) - 64);
  }
  return idx - 1;
}

/** Làm sạch chuỗi: gộp dòng/khoảng trắng thừa, loại bỏ "N/A". */
function cleanText(val: string | undefined | null): string {
  if (!val) return '';
  const cleaned = val
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, ' • ')
    .trim();
  if (!cleaned || /^n\/?a$/i.test(cleaned) || cleaned === '-') return '';
  return cleaned;
}

/** Chuẩn hóa mã số hoặc tuổi (bỏ phần .0 dư từ số thực Excel). */
function cleanNumericCode(val: string | undefined | null): string {
  const s = cleanText(val);
  if (!s) return '';
  if (/^\d+\.0+$/.test(s)) {
    return s.replace(/\.0+$/, '');
  }
  return s;
}

/**
 * Chuyển đổi giá trị ngày trong ô Excel:
 * - Nếu là số nguyên 1850..2100 (người nhập năm sinh dạng số vào cột Date) -> trả về năm (vd "1968").
 * - Nếu là số serial Excel 10000..70000 -> đổi thành DD/MM/YYYY.
 * - Ngược lại trả về text đã làm sạch.
 */
function formatExcelDateCell(raw: string, cellType: string): string {
  const s = cleanText(raw);
  if (!s) return '';

  if (cellType !== 's' && cellType !== 'str' && cellType !== 'inlineStr' && /^\d+(\.\d+)?$/.test(s)) {
    const num = Number(s);
    if (Number.isFinite(num)) {
      const rounded = Math.round(num);
      if (rounded >= 1850 && rounded <= 2100 && Math.abs(num - rounded) < 1e-6) {
        return String(rounded);
      }
      if (num >= 10000 && num <= 75000) {
        // Excel epoch 1899-12-30 UTC (bù bug năm nhuận 1900 của Excel)
        const utcMs = Date.UTC(1899, 11, 30) + Math.floor(num) * 86400000;
        const d = new Date(utcMs);
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const yyyy = d.getUTCFullYear();
        return `${dd}/${mm}/${yyyy}`;
      }
    }
  }
  return s;
}

function isTruthyExcelCell(raw: string, cellType: string): boolean {
  const s = raw.trim().toLowerCase();
  if (cellType === 'b') return s === '1' || s === 'true';
  return s === 'true' || s === '1' || s === 'v' || s === 'x' || s === 'có';
}

/** Tách tên và SĐT từ một chuỗi gộp (ví dụ "LÊ MINH HẢI \n 09722.77673"). */
function splitNameAndPhone(raw: string): { name: string; phone: string } {
  const s = (raw || '').trim();
  if (!s || /^n\/?a$/i.test(s)) return { name: '', phone: '' };

  const phoneRegex = /(?:\+?84|0)(?:[\s.\-]*\d){7,10}/g;
  const phones = s.match(phoneRegex) || [];
  const phone = phones.map((p) => p.replace(/\s+/g, '')).join(' / ');
  const namePart = cleanText(s.replace(phoneRegex, ' '))
    .replace(/^[•\s,\-/]+|[•\s,\-/]+$/g, '')
    .trim();
  return { name: namePart, phone };
}

interface SheetCell {
  raw: string;
  type: string;
}

/** Giải mã XML worksheet thành mảng các dòng (thứ tự 1-based row -> map colIndex -> SheetCell). */
function parseSheetRows(sheetXml: string, sharedStrings: string[]): SheetCell[][] {
  const $ = cheerio.load(sheetXml, { xmlMode: true });
  const rows: SheetCell[][] = [];

  $('sheetData > row').each((_, rowEl) => {
    const rowArr: SheetCell[] = [];
    $(rowEl)
      .children('c')
      .each((__, cellEl) => {
        const ref = $(cellEl).attr('r') || '';
        const colMatch = ref.match(/^([A-Z]+)/);
        const colIdx = colMatch ? colLettersToIndex(colMatch[1]) : rowArr.length;
        const t = $(cellEl).attr('t') || '';

        let raw = '';
        if (t === 's') {
          const idx = Number($(cellEl).children('v').text());
          raw = Number.isFinite(idx) && sharedStrings[idx] !== undefined ? sharedStrings[idx] : '';
        } else if (t === 'inlineStr') {
          raw = $(cellEl)
            .find('is t')
            .map((___, tEl) => $(tEl).text())
            .get()
            .join('');
        } else {
          raw = $(cellEl).children('v').text();
        }

        rowArr[colIdx] = { raw, type: t };
      });

    rows.push(rowArr);
  });

  return rows;
}

function getCellRaw(row: SheetCell[], idx: number): string {
  return row[idx]?.raw ?? '';
}
function getCellType(row: SheetCell[], idx: number): string {
  return row[idx]?.type ?? '';
}

function classifySheet(rawSheetName: string): {
  slug: MemorialCategorySlug;
  label: string;
} | null {
  const normalized = rawSheetName.trim().toUpperCase();
  if (normalized.includes('VSĐ') && normalized.includes('NỮ')) {
    return { slug: 'vang-sinh-duong-nu', label: 'Vãng Sinh Đường (Nữ)' };
  }
  if (normalized.includes('VSĐ') && normalized.includes('NAM')) {
    return { slug: 'vang-sinh-duong-nam', label: 'Vãng Sinh Đường (Nam)' };
  }
  if (normalized.includes('CÁ NHÂN')) {
    return { slug: 'nha-tu-an-ca-nhan', label: 'Nhà Tưởng Ân - Cá Nhân' };
  }
  if (normalized.includes('TỔ TIÊN')) {
    return { slug: 'nha-tu-an-to-tien', label: 'Nhà Tưởng Ân - Tổ Tiên' };
  }
  if (normalized.includes('PHỤ MẪU')) {
    return { slug: 'phu-mau-xuat-gia', label: 'Phụ Mẫu Xuất Gia' };
  }
  return null;
}

/**
 * Parse file .xlsx (Buffer/Uint8Array) bằng fflate — BỎ QUA hoàn toàn `xl/media/` để đọc file 99MB trong ~100ms.
 */
export function parseMemorialExcelBuffer(xlsxBuffer: Uint8Array | Buffer): ParsedMemorialResult {
  const bytes = xlsxBuffer instanceof Uint8Array ? xlsxBuffer : new Uint8Array(xlsxBuffer);
  const files = unzipSync(bytes, {
    filter: (file) => file.name.endsWith('.xml') || file.name.endsWith('.rels'),
  });

  if (!files['xl/workbook.xml'] || !files['xl/_rels/workbook.xml.rels']) {
    throw new Error('File Excel không hợp lệ (thiếu xl/workbook.xml).');
  }

  // 1. Đọc sharedStrings
  const sharedStrings: string[] = [];
  if (files['xl/sharedStrings.xml']) {
    const ssXml = strFromU8(files['xl/sharedStrings.xml']);
    const $ss = cheerio.load(ssXml, { xmlMode: true });
    $ss('si').each((_, siEl) => {
      const txt = $ss(siEl)
        .find('t')
        .map((__, tEl) => $ss(tEl).text())
        .get()
        .join('');
      sharedStrings.push(txt);
    });
  }

  // 2. Map rId -> target path
  const relsXml = strFromU8(files['xl/_rels/workbook.xml.rels']);
  const $rels = cheerio.load(relsXml, { xmlMode: true });
  const relTargetMap: Record<string, string> = {};
  $rels('Relationship').each((_, el) => {
    const id = $rels(el).attr('Id');
    const target = $rels(el).attr('Target');
    if (id && target) {
      const cleanTarget = target.replace(/^\/+/, '');
      relTargetMap[id] = cleanTarget.startsWith('xl/') ? cleanTarget : `xl/${cleanTarget}`;
    }
  });

  // 3. Duyệt từng sheet theo thứ tự trong workbook.xml
  const wbXml = strFromU8(files['xl/workbook.xml']);
  const $wb = cheerio.load(wbXml, { xmlMode: true });

  const allRecords: MemorialRecord[] = [];
  const countsByCategory: Record<string, number> = {};
  const sheetBreakdown: ParsedMemorialResult['sheetBreakdown'] = [];
  const warnings: string[] = [];

  $wb('sheets > sheet').each((_, sheetEl) => {
    const sheetName = $wb(sheetEl).attr('name') || '';
    const rId = $wb(sheetEl).attr('r:id') || '';
    const targetPath = relTargetMap[rId];

    const classification = classifySheet(sheetName);
    if (!classification) {
      if (sheetName) warnings.push(`Bỏ qua sheet không nằm trong cấu hình: "${sheetName}"`);
      return;
    }

    if (!targetPath || !files[targetPath]) {
      warnings.push(`Không tìm thấy XML cho sheet "${sheetName}"`);
      return;
    }

    const sheetXml = strFromU8(files[targetPath]);
    const rows = parseSheetRows(sheetXml, sharedStrings);

    // Tìm dòng tiêu đề đầu tiên chứa "MÃ SỐ"
    let headerIdx = -1;
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const rowText = rows[i].map((c) => c?.raw || '').join(' ').toUpperCase();
      if (rowText.includes('MÃ SỐ')) {
        headerIdx = i;
        break;
      }
    }
    if (headerIdx === -1) headerIdx = 1;

    let sheetCount = 0;

    for (let r = headerIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const { slug, label } = classification;
      let record: MemorialRecord | null = null;

      if (slug === 'vang-sinh-duong-nu' || slug === 'vang-sinh-duong-nam') {
        const code = cleanNumericCode(getCellRaw(row, 1));
        const name = cleanText(getCellRaw(row, 3));
        // Bỏ qua dòng subheader ("HOÀN THIỆN HỒ SƠ") hoặc dòng trống
        if (!name || /HOÀN THIỆN HỒ SƠ|AN VỊ TRO CỐT/i.test(name)) continue;

        const dharmaName = cleanText(getCellRaw(row, 4));
        const birthDate = formatExcelDateCell(getCellRaw(row, 5), getCellType(row, 5));
        const deathDate = formatExcelDateCell(getCellRaw(row, 6), getCellType(row, 6));
        const age = cleanNumericCode(getCellRaw(row, 7));
        const address = cleanText(getCellRaw(row, 8));
        const rawContact = cleanText(getCellRaw(row, 9));
        const { name: cName, phone: cPhone } = splitNameAndPhone(rawContact);

        record = {
          id: `${slug}-${code || 'row'}-${r + 1}`,
          sheetName: sheetName.trim(),
          category: label,
          categorySlug: slug,
          code,
          name,
          gender: slug === 'vang-sinh-duong-nu' ? 'Nữ' : 'Nam',
          dharmaName: dharmaName || undefined,
          birthDate: birthDate || undefined,
          deathDate: deathDate || undefined,
          age: age || undefined,
          address: address || undefined,
          contactName: cName || undefined,
          contactPhone: cPhone || undefined,
          contact: buildMaskedContact(cName, cPhone, rawContact) || undefined,
          burialLocation: 'Vãng Sinh Đường Chùa Tùng Lâm Hòa Phúc',
        };
      } else if (slug === 'nha-tu-an-ca-nhan') {
        const code = cleanNumericCode(getCellRaw(row, 1));
        const name = cleanText(getCellRaw(row, 3));
        if (!name || /^HỌ VÀ TÊN$/i.test(name)) continue;

        const genderRaw = cleanText(getCellRaw(row, 4));
        const dharmaName = cleanText(getCellRaw(row, 5));
        const deathDate = formatExcelDateCell(getCellRaw(row, 6), getCellType(row, 6));
        const age = cleanNumericCode(getCellRaw(row, 7));
        const burialOrAddress = cleanText(getCellRaw(row, 8));
        const contactName = cleanText(getCellRaw(row, 9));
        const contactPhone = cleanText(getCellRaw(row, 10));

        record = {
          id: `${slug}-${code || 'row'}-${r + 1}`,
          sheetName: sheetName.trim(),
          category: label,
          categorySlug: slug,
          code,
          name,
          gender: genderRaw || undefined,
          dharmaName: dharmaName || undefined,
          deathDate: deathDate || undefined,
          age: age || undefined,
          address: burialOrAddress || undefined,
          burialLocation: burialOrAddress || undefined,
          contactName: contactName || undefined,
          contactPhone: contactPhone || undefined,
          contact: buildMaskedContact(contactName, contactPhone) || undefined,
        };
      } else if (slug === 'nha-tu-an-to-tien') {
        const code = cleanNumericCode(getCellRaw(row, 1));
        const name = cleanText(getCellRaw(row, 2));
        if (!name || /CỬU HUYỀN THẤT TỔ TỘC/i.test(name)) continue;

        const isNoiToc = isTruthyExcelCell(getCellRaw(row, 3), getCellType(row, 3));
        const isNgoaiToc = isTruthyExcelCell(getCellRaw(row, 4), getCellType(row, 4));
        const lineageParts: string[] = [];
        if (isNoiToc) lineageParts.push('Nội tộc');
        if (isNgoaiToc) lineageParts.push('Ngoại tộc');
        const lineageType = lineageParts.join(' & ');

        const address = cleanText(getCellRaw(row, 5));
        const colG = cleanText(getCellRaw(row, 6));
        const colH = cleanText(getCellRaw(row, 7));
        const combinedContact = [colG, colH].filter(Boolean).join(' ');
        const { name: cName, phone: cPhone } = splitNameAndPhone(combinedContact);

        record = {
          id: `${slug}-${code || 'row'}-${r + 1}`,
          sheetName: sheetName.trim(),
          category: label,
          categorySlug: slug,
          code,
          name,
          lineageType: lineageType || undefined,
          address: address || undefined,
          burialLocation: address || undefined,
          contactName: cName || undefined,
          contactPhone: cPhone || undefined,
          contact: buildMaskedContact(cName, cPhone, combinedContact) || undefined,
        };
      } else if (slug === 'phu-mau-xuat-gia') {
        const code = cleanNumericCode(getCellRaw(row, 1));
        const name = cleanText(getCellRaw(row, 3));
        if (!name || /^HỌ VÀ TÊN$/i.test(name)) continue;

        const dharmaName = cleanText(getCellRaw(row, 4));
        const hoanTucDate = formatExcelDateCell(getCellRaw(row, 5), getCellType(row, 5));
        const xuatGiaDate = formatExcelDateCell(getCellRaw(row, 6), getCellType(row, 6));

        const noteParts: string[] = [];
        if (xuatGiaDate) noteParts.push(`Xuất gia: ${xuatGiaDate}`);
        if (hoanTucDate) noteParts.push(`Hoàn tục / Kỷ niệm: ${hoanTucDate}`);

        record = {
          id: `${slug}-${code || 'row'}-${r + 1}`,
          sheetName: sheetName.trim(),
          category: label,
          categorySlug: slug,
          code,
          name,
          dharmaName: dharmaName || undefined,
          birthDate: xuatGiaDate || undefined,
          deathDate: hoanTucDate || undefined,
          burialLocation: noteParts.join(' • ') || 'Nhà Tưởng Ân - Phụ Mẫu Xuất Gia',
        };
      }

      if (record) {
        allRecords.push(record);
        sheetCount++;
      }
    }

    countsByCategory[classification.slug] =
      (countsByCategory[classification.slug] || 0) + sheetCount;
    sheetBreakdown.push({
      sheetName: sheetName.trim(),
      categorySlug: classification.slug,
      categoryLabel: classification.label,
      count: sheetCount,
    });
  });

  return {
    records: allRecords,
    countsByCategory,
    sheetBreakdown,
    warnings,
  };
}
