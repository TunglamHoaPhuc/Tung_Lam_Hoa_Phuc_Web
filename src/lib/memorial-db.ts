import {
  invalidateServerlessCache,
  loadServerlessJsonAsync,
  saveServerlessJson,
} from './serverless-db';
import {
  DEFAULT_MEMORIAL_DRIVE_FILE_ID,
  DEFAULT_MEMORIAL_DRIVE_URL,
  MemorialPublicRecord,
  MemorialRecord,
  MemorialSyncMeta,
  normalizeVietnamese,
  toPublicMemorialRecord,
} from './memorial-types';

const MEMORIAL_DB_CONFIG = {
  fileName: 'memorial-data.json',
  localRelativePath: 'src/data/memorial-data.json',
  s3Key: 'tunglamhoaphuc2/database/memorial-data.json',
  defaultData: [] as MemorialRecord[],
};

const MEMORIAL_META_CONFIG = {
  fileName: 'memorial-sync-meta.json',
  localRelativePath: 'src/data/memorial-sync-meta.json',
  s3Key: 'tunglamhoaphuc2/database/memorial-sync-meta.json',
  defaultData: {
    driveUrl: DEFAULT_MEMORIAL_DRIVE_URL,
    driveFileId: DEFAULT_MEMORIAL_DRIVE_FILE_ID,
    lastSyncedAt: '',
    totalRecords: 0,
    countsByCategory: {},
    sourceName: '(QUAN TRỌNG) DANH SÁCH BÀI VỊ CHƯ H.LINH.xlsx',
  } as MemorialSyncMeta,
};

export async function getAllMemorialRecords(): Promise<MemorialRecord[]> {
  return await loadServerlessJsonAsync<MemorialRecord[]>(MEMORIAL_DB_CONFIG);
}

export async function getPublicMemorialRecords(): Promise<MemorialPublicRecord[]> {
  const records = await getAllMemorialRecords();
  return records.map(toPublicMemorialRecord);
}

export async function getMemorialSyncMeta(): Promise<MemorialSyncMeta> {
  return await loadServerlessJsonAsync<MemorialSyncMeta>(MEMORIAL_META_CONFIG);
}

export async function saveMemorialSyncData(
  records: MemorialRecord[],
  meta: MemorialSyncMeta
): Promise<boolean> {
  const okRecords = await saveServerlessJson<MemorialRecord[]>(MEMORIAL_DB_CONFIG, records);
  const okMeta = await saveServerlessJson<MemorialSyncMeta>(MEMORIAL_META_CONFIG, meta);
  invalidateServerlessCache(MEMORIAL_DB_CONFIG.fileName);
  invalidateServerlessCache(MEMORIAL_META_CONFIG.fileName);
  return okRecords && okMeta;
}

/**
 * Tìm kiếm bài vị phía Server (hỗ trợ tìm cả SĐT gốc chưa che, bỏ dấu tiếng Việt).
 */
export function filterMemorialRecords(
  records: MemorialRecord[],
  query: string
): MemorialPublicRecord[] {
  const normQ = normalizeVietnamese(query);
  const digitsOnly = query.replace(/\D/g, '');
  if (!normQ) return records.map(toPublicMemorialRecord);

  const tokens = normQ.split(' ').filter(Boolean);

  return records
    .filter((rec) => {
      if (digitsOnly.length >= 4 && rec.contactPhone) {
        const cleanPhone = rec.contactPhone.replace(/\D/g, '');
        if (cleanPhone.includes(digitsOnly)) return true;
      }

      const haystack = normalizeVietnamese(
        [
          rec.code,
          rec.name,
          rec.dharmaName,
          rec.lineageType,
          rec.age,
          rec.deathDate,
          rec.birthDate,
          rec.address,
          rec.burialLocation,
          rec.contactName,
          rec.contact,
        ]
          .filter(Boolean)
          .join(' ')
      );

      return tokens.every((tok) => haystack.includes(tok));
    })
    .map(toPublicMemorialRecord);
}
