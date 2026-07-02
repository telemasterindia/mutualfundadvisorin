export const AMFI_NAV_URL = "https://www.amfiindia.com/spages/NAVAll.txt";

export type AmfiFund = {
  schemeCode: string;
  isinGrowth: string | null;
  isinDivReinvestment: string | null;
  schemeName: string;
  nav: number;
  navText: string;
  date: string;
  navDate: string;
  fundHouse: string | null;
  schemeType: string;
  category: string | null;
};

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

function parseAmfiDate(value: string) {
  const [dayRaw, monthRaw, yearRaw] = value.trim().split("-");
  const day = Number(dayRaw);
  const year = Number(yearRaw);
  const numericMonth = Number(monthRaw);
  const month = Number.isFinite(numericMonth)
    ? numericMonth - 1
    : MONTHS[monthRaw?.toLowerCase() ?? ""];

  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    return null;
  }

  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

function isRecentAmfiDate(value: string, maxAgeDays: number, now = new Date()) {
  const navDate = parseAmfiDate(value);

  if (!navDate) {
    return false;
  }

  const diffDays = (now.getTime() - navDate.getTime()) / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= maxAgeDays;
}

function getSchemeSection(line: string) {
  const trimmedLine = line.trim();

  if (!trimmedLine.endsWith(")")) {
    return null;
  }

  const match = trimmedLine.match(/^(.+?)\s*\((.+)\)$/);

  if (!match) {
    return null;
  }

  return {
    type: match[1].trim(),
    category: match[2].trim(),
  };
}

export function parseAmfiNavText(text: string, maxAgeDays = 7) {
  const funds: AmfiFund[] = [];
  let currentFundHouse: string | null = null;
  let currentSchemeType = "";
  let currentCategory: string | null = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const section = getSchemeSection(line);

    if (section) {
      currentSchemeType = section.type;
      currentCategory = section.category;
      continue;
    }

    if (!line.includes(";")) {
      currentFundHouse = line;
      continue;
    }

    if (!currentSchemeType.toLowerCase().startsWith("open ended schemes")) {
      continue;
    }

    const parts = line.split(";").map((part) => part.trim());

    if (parts.length < 6 || parts[0].toLowerCase() === "scheme code") {
      continue;
    }

    const [schemeCode, isinDivPayoutOrGrowth, isinDivReinvestment, schemeName, navText, date] =
      parts;
    const nav = Number(navText);

    if (!schemeCode || !schemeName || !date || !Number.isFinite(nav) || nav <= 0) {
      continue;
    }

    if (!isRecentAmfiDate(date, maxAgeDays)) {
      continue;
    }

    funds.push({
      schemeCode,
      isinGrowth: isinDivPayoutOrGrowth || null,
      isinDivReinvestment: isinDivReinvestment || null,
      schemeName,
      nav,
      navText,
      date,
      navDate: parseAmfiDate(date)?.toISOString() ?? date,
      fundHouse: currentFundHouse,
      schemeType: currentSchemeType,
      category: currentCategory,
    });
  }

  return funds;
}

export async function fetchFreshAmfiFunds(maxAgeDays = 7) {
  const response = await fetch(AMFI_NAV_URL, {
    cache: "no-store",
    headers: {
      Accept: "text/plain",
    },
  });

  if (!response.ok) {
    throw new Error(`AMFI NAV download failed with status ${response.status}`);
  }

  return parseAmfiNavText(await response.text(), maxAgeDays);
}
