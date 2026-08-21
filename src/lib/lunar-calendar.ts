/**
 * Vietnamese Astronomical Lunar Calendar Library
 * Based on Ho Ngoc Duc's Astronomical Algorithms (UTC+7 / GMT+7 Vietnam Standard Time)
 * Powers standard Vietnamese calendars (24h.com.vn, Vietnamnet, VnExpress, etc.)
 */

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  canChiDay?: string;
  canChiMonth?: string;
  canChiYear?: string;
}

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jdn = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jdn < 2299161) {
    jdn = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jdn;
}

export function jdToDate(jd: number): { day: number; month: number; year: number } {
  let day: number, month: number, year: number;
  if (jd > 2299160) {
    const a = jd + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    day = e - Math.floor((153 * m + 2) / 5) + 1;
    month = m + 3 - 12 * Math.floor(m / 10);
    year = 100 * b + d - 4800 + Math.floor(m / 10);
  } else {
    const c = jd + 32082;
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    day = e - Math.floor((153 * m + 2) / 5) + 1;
    month = m + 3 - 12 * Math.floor(m / 10);
    year = d - 4800 + Math.floor(m / 10);
  }
  return { day, month, year };
}

function getNewMoonDay(k: number, timeZone = 7.0): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * M * dr);
  C1 -= 0.4068 * Math.sin(Mpr * dr) - 0.0161 * Math.sin(2 * Mpr * dr);
  C1 -= 0.0004 * Math.sin(3 * Mpr * dr);
  C1 += 0.0104 * Math.sin(2 * F * dr) - 0.0051 * Math.sin((M + Mpr) * dr);
  C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  C1 -= 0.0004 * Math.sin((2 * F - M) * dr) + 0.0006 * Math.sin((2 * F + Mpr) * dr);
  C1 += 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((M + 2 * Mpr) * dr);
  
  let deltat = 0;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000078 + 0.000094 * T + 0.0000009 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn: number, timeZone = 7.0): number {
  const T = (jdn - 2451545.0 + 0.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr);
  DL += (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) + 0.000290 * Math.sin(3 * M * dr);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return Math.floor(L / (Math.PI / 6));
}

function getLunarMonth11(yy: number, timeZone = 7.0): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone = 7.0): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let lastSunLong = getSunLongitude(a11, timeZone);
  for (let i = 1; i <= 14; i++) {
    const arc = getNewMoonDay(k + i, timeZone);
    const sunLong = getSunLongitude(arc, timeZone);
    if (sunLong === lastSunLong) {
      return i;
    }
    lastSunLong = sunLong;
  }
  return 0;
}

/**
 * Converts Solar date to exact Vietnamese Lunar Date (Astronomical calculation UTC+7)
 */
export function convertSolarToLunar(
  solarDay: number,
  solarMonth: number, // 0-indexed (0 = Jan, 11 = Dec)
  solarYear: number,
  timeZone = 7.0
): LunarDate {
  const mm = solarMonth + 1; // 1-indexed
  const dayNumber = jdFromDate(solarDay, mm, solarYear);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(solarYear, timeZone);
  let b11 = a11;
  let lunarYear = solarYear;

  if (a11 >= monthStart) {
    lunarYear = solarYear;
    a11 = getLunarMonth11(solarYear - 1, timeZone);
  } else {
    lunarYear = solarYear + 1;
    b11 = getLunarMonth11(solarYear + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  // Calculate Can Chi
  const canDay = CAN[(dayNumber + 9) % 10];
  const chiDay = CHI[(dayNumber + 1) % 12];
  const canChiDay = `${canDay} ${chiDay}`;

  const canYear = CAN[(lunarYear + 6) % 10];
  const chiYear = CHI[(lunarYear + 8) % 12];
  const canChiYear = `${canYear} ${chiYear}`;

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeap: lunarLeap,
    canChiDay,
    canChiYear,
  };
}

/**
 * Checks whether a given lunar month has 29 or 30 days
 */
export function getLunarMonthLength(
  lunarMonth: number,
  lunarYear: number,
  isLeap = false,
  timeZone = 7.0
): number {
  // Find a solar day roughly inside this lunar month
  let approxSolarMonth = (lunarMonth + 1) % 12;
  let approxSolarYear = lunarYear;
  if (lunarMonth >= 11) approxSolarYear = lunarYear;

  for (let d = 1; d <= 31; d += 7) {
    const l = convertSolarToLunar(d, approxSolarMonth, approxSolarYear, timeZone);
    if (l.month === lunarMonth && l.year === lunarYear) {
      // Find the start of this lunar month (day 1)
      const dayOffset = l.day - 1;
      const jdn1 = jdFromDate(d, approxSolarMonth + 1, approxSolarYear) - dayOffset;
      const { day: d1, month: m1, year: y1 } = jdToDate(jdn1);
      
      // Test day 30
      const jdn30 = jdn1 + 29;
      const { day: d30, month: m30, year: y30 } = jdToDate(jdn30);
      const l30 = convertSolarToLunar(d30, m30 - 1, y30, timeZone);
      return l30.day === 30 ? 30 : 29;
    }
  }
  return 30; // fallback
}

/**
 * Returns number of days in a Solar month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets Monday-first weekday offset for start of month (0 = Monday, 6 = Sunday)
 */
export function getStartDayOffset(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
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
 * In Buddhist tradition, PL 2570 corresponds to solar year 2026 (or 2026-2027)
 */
export function getBuddhistEraYear(solarYear: number): number {
  return solarYear + 544;
}
