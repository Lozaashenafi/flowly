export const ETHIOPIAN_MONTHS = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yakatit",
  "Magabit",
  "Miyazya",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehasse",
  "Pagume",
];

export function toEthiopian(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;

  // 1. Convert to Julian Day Number (JDN)
  // Unix Epoch (1970-01-01) is JDN 2440588.
  // We add 3 hours for East Africa Time (GMT+3)
  const msPerDay = 86400000;
  const jdn = Math.floor((d.getTime() + 10800000) / msPerDay) + 2440588;

  // 2. Ethiopian Era Offset
  // Meskerem 1, 1 E.C. is JDN 1724221
  const n = jdn - 1724221;

  // 3. Precise Year Calculation
  // 1461 is the number of days in a 4-year cycle (365 * 4 + 1)
  const year = Math.floor((4 * n + 3) / 1461) + 1;

  // 4. Find the first day of this Ethiopian Year
  const jdnBeginningOfYear = Math.floor((1461 * (year - 1)) / 4) + 1724221;

  // 5. Day of the Year (0-365)
  const dayOfYear = jdn - jdnBeginningOfYear;

  // 6. Strict Ethiopian Month Rule (12 months * 30 days)
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;

  // If the calculation gives month 14 (rare edge case), it wraps to month 1
  return {
    day: day,
    month: month,
    year: year,
  };
}

export function formatEth(date: Date | string) {
  const { day, month, year } = toEthiopian(date);
  // Boundary check for safety
  const monthIndex = Math.min(Math.max(month - 1, 0), 12);
  const monthName = ETHIOPIAN_MONTHS[monthIndex];
  return `${monthName} ${day}, ${year}`;
}
// Add this to your existing ethiopianDate.ts
export function fromEthiopian(year: number, month: number, day: number): Date {
  // JDN for the start of Ethiopian Era
  const jdn =
    day + 30 * (month - 1) + Math.floor((1461 * (year - 1)) / 4) + 1724221;

  // Convert JDN to Unix Timestamp
  const timestamp = (jdn - 2440588) * 86400000;
  // Subtract the 3 hours we added for Addis timezone offset to keep it clean
  return new Date(timestamp - 3 * 60 * 60 * 1000);
}
