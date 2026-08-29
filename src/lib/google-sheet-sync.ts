import { promises as fs } from 'fs';
import path from 'path';

export interface SheetStatueItem {
  code: string;
  hoiChung: string;
  cumTuong: string;
  tenTuongPhap: string;
  subTenTuong: string;
  loaiTuong: string; // "TƯỢNG CHÍNH" | "NTPG" | "BẢO VẬT"
  tenAnhTuongUng: string;
  idKhuVuc: string;
  moTaNguon: string;
  quoteSuPhu: string;
  quoteNocAnTim: string;
  ghiChu: string;
}

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Hy4aEvoYaDU-BPJ0GZso7wyWIW5s4Egz/export?format=csv&gid=764887609';

/**
 * Basic RFC-4180 compliant CSV parser
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
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

export async function fetchAndParseStatuesFromSheet(): Promise<SheetStatueItem[]> {
  try {
    const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 300 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch sheet: ${res.statusText}`);
    }
    const csvText = await res.text();
    const rows = parseCSV(csvText);

    // Find the header row starting with "MÃ" or "NỘI DUNG DỮ LIỆU"
    let dataStartIndex = -1;
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (row[0] === 'MÃ' || row[0]?.includes('MÃ') || row[4] === 'TÊN TƯỢNG PHÁP') {
        dataStartIndex = r + 1;
        break;
      }
    }

    if (dataStartIndex === -1) {
      // Fallback search for first TP0001
      dataStartIndex = rows.findIndex((r) => r.some((c) => c.startsWith('TP00')));
    }

    const items: SheetStatueItem[] = [];

    for (let r = dataStartIndex; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length < 5) continue;

      // Skip non-data rows
      const col0 = row[0] || '';
      const col4 = row[4] || '';
      if (col0.startsWith('TỔ HỢP') || col0.startsWith('ID KHU') || (!col0.startsWith('TP') && !col4)) {
        // Check if there is still a statue name in col 4
        if (!col4) continue;
      }

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

    return items;
  } catch (error) {
    console.error('Error syncing Google Sheet:', error);
    return [];
  }
}
