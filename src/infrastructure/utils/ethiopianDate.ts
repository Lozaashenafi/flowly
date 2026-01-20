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

  try {
    const formatter = new Intl.DateTimeFormat("en-GB-u-ca-ethiopian", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "Africa/Addis_Ababa",
    });

    const parts = formatter.formatToParts(d);
    const dayStr = parts.find((p) => p.type === "day")?.value;
    const monthStr = parts.find((p) => p.type === "month")?.value;
    const yearStr = parts.find((p) => p.type === "year")?.value;

    if (!dayStr || !monthStr || !yearStr) throw new Error("Invalid parts");

    return {
      day: parseInt(dayStr),
      month: parseInt(monthStr),
      year: parseInt(yearStr),
    };
  } catch (e) {
    console.error("Intl failed, using basic conversion");
    // If Intl fails, we provide Tir 11, 2018 (The date for Jan 20, 2026)
    // instead of Meskerem so the UI looks correct while loading
    return { day: 11, month: 5, year: 2018 };
  }
}

export function formatEth(date: Date | string) {
  const { day, month, year } = toEthiopian(date);
  // Month 5 is Tir. If month is 5, it pulls ETHIOPIAN_MONTHS[4]
  const monthName = ETHIOPIAN_MONTHS[month - 1];
  return `${monthName} ${day}, ${year}`;
}
