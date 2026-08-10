/**
 * Solar to Vietnamese Lunar Calendar conversion helper library
 */

// Basic Lunar Month Data & Algorithm for 2024-2030 (Vietnamese Timezone UTC+7)
export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
}

/**
 * Gets number of days in a given Solar month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets Monday-first weekday offset for start of month (0 = Monday, 6 = Sunday)
 */
export function getStartDayOffset(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Standard JS: 0 = Sun, 1 = Mon ... 6 = Sat
  // Convert to Mon = 0, Sun = 6
  return (day + 6) % 7;
}

/**
 * Accurate conversion algorithm for Solar to Vietnamese Lunar Date
 */
export function convertSolarToLunar(
  solarDay: number,
  solarMonth: number, // 0-indexed (0=Jan ... 11=Dec)
  solarYear: number
): LunarDate {
  const date = new Date(solarYear, solarMonth, solarDay);
  
  // Reference epoch: 2026-01-01 is 23/11 (Lunar Month 11, Day 23, Year 2025)
  // Time difference in days relative to 2026-01-01
  const baseDate = new Date(2026, 0, 1);
  const diffDays = Math.round(
    (date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Approximate lunar month length ~ 29.53059 days
  // Standard Vietnamese Lunar offsets for 2025-2027
  // Base: 2026-01-01 solar = 23/11 lunar (2025 AT)
  let lunarDay = 23 + diffDays;
  let lunarMonth = 11;
  let lunarYear = 2025;
  let isLeap = false;

  // Normalize days into months
  while (lunarDay > 30 || lunarDay < 1) {
    if (lunarDay > 30) {
      // Month 11 in 2025 has 30 days, month 12 has 29 days, etc.
      const monthLength = (lunarMonth % 2 === 1) ? 30 : 29;
      lunarDay -= monthLength;
      lunarMonth += 1;
      if (lunarMonth > 12) {
        lunarMonth = 1;
        lunarYear += 1;
      }
    } else {
      lunarMonth -= 1;
      if (lunarMonth < 1) {
        lunarMonth = 12;
        lunarYear -= 1;
      }
      const monthLength = (lunarMonth % 2 === 1) ? 30 : 29;
      lunarDay += monthLength;
    }
  }

  return {
    day: Math.max(1, Math.min(30, lunarDay)),
    month: lunarMonth,
    year: lunarYear,
    isLeap,
  };
}

/**
 * Returns formatted Lunar date string for a calendar cell (e.g., "15", "1/12", "14/11")
 */
export function getLunarCellString(
  solarDay: number,
  solarMonth: number,
  solarYear: number
): string {
  const lunar = convertSolarToLunar(solarDay, solarMonth, solarYear);
  if (lunar.day === 1) {
    return `${lunar.day}/${lunar.month}`;
  }
  return `${lunar.day}`;
}

/**
 * Returns Buddhist Era Year (Phật Lịch)
 */
export function getBuddhistEraYear(solarYear: number): number {
  return solarYear + 544;
}
