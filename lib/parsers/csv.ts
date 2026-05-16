import Papa from "papaparse";

export type CsvRow = Record<string, string>;

export function parseCsv(content: string): CsvRow[] {
  const parsed = Papa.parse<CsvRow>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0]?.message ?? "Unable to parse CSV file.");
  }

  return parsed.data;
}

export function getValue(row: CsvRow, candidates: string[]) {
  for (const candidate of candidates) {
    const exact = row[candidate];
    if (typeof exact === "string" && exact.trim()) {
      return exact.trim();
    }

    const caseInsensitiveKey = Object.keys(row).find(
      (key) => key.toLowerCase() === candidate.toLowerCase(),
    );

    if (caseInsensitiveKey && row[caseInsensitiveKey]?.trim()) {
      return row[caseInsensitiveKey].trim();
    }
  }

  return "";
}

export function getNumber(row: CsvRow, candidates: string[], fallback = 0) {
  const value = getValue(row, candidates);
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

export function getBoolean(row: CsvRow, candidates: string[], fallback = true) {
  const value = getValue(row, candidates).toLowerCase();
  if (!value) return fallback;
  return ["true", "yes", "indexable", "1"].includes(value);
}
