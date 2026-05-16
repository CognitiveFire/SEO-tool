import { SupportedExportType } from "@/types/seo";

const EXPORT_LABELS: Record<SupportedExportType, string> = {
  internal_html: "Internal HTML",
  response_codes: "Response Codes",
  page_titles: "Page Titles",
  h1: "H1",
  canonicals: "Canonicals",
  inlinks: "Inlinks",
  crawl_overview: "Crawl Overview",
};

const EXPORT_MATCHERS: Array<[SupportedExportType, RegExp]> = [
  ["internal_html", /internal[_\s-]?html/i],
  ["response_codes", /response[_\s-]?codes/i],
  ["page_titles", /page[_\s-]?titles/i],
  ["h1", /^h1/i],
  ["canonicals", /canonical/i],
  ["inlinks", /inlinks/i],
  ["crawl_overview", /crawl[_\s-]?overview/i],
];

export function detectExportType(fileName: string): SupportedExportType | null {
  const match = EXPORT_MATCHERS.find(([, pattern]) => pattern.test(fileName));
  return match?.[0] ?? null;
}

export function getExportLabel(exportType: SupportedExportType) {
  return EXPORT_LABELS[exportType];
}
