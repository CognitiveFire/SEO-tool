import { parseCsv, getBoolean, getNumber, getValue, type CsvRow } from "@/lib/parsers/csv";
import { detectExportType, getExportLabel } from "@/lib/parsers/export-types";
import { buildMockPages } from "@/lib/mock-data/sample-crawl";
import type { DetectedExport, NormalizedPage, UploadedFilePayload } from "@/types/seo";

function getTemplateFromUrl(url: string) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return "Homepage";
  if (pathname.startsWith("/blog")) return "Editorial";
  if (pathname.startsWith("/services")) return "Service";
  if (pathname.startsWith("/category")) return "Category";
  if (pathname.startsWith("/resources")) return "Resource";
  return "Landing";
}

function normaliseRow(url: string, partial: Partial<NormalizedPage>): NormalizedPage {
  const parsedUrl = new URL(url);
  return {
    url,
    path: parsedUrl.pathname,
    template: partial.template ?? getTemplateFromUrl(url),
    statusCode: partial.statusCode ?? 200,
    title: partial.title ?? "",
    titleLength: partial.titleLength ?? (partial.title?.length ?? 0),
    h1: partial.h1 ?? "",
    canonical: partial.canonical ?? url,
    crawlDepth: partial.crawlDepth ?? 1,
    inlinks: partial.inlinks ?? 0,
    indexability: partial.indexability ?? true,
    wordCount: partial.wordCount ?? 600,
    contentHash: partial.contentHash,
    redirectUrl: partial.redirectUrl,
    hasStructuredData: partial.hasStructuredData ?? true,
  };
}

function mergePage(target: Map<string, NormalizedPage>, url: string, patch: Partial<NormalizedPage>) {
  const existing = target.get(url) ?? normaliseRow(url, {});
  target.set(url, normaliseRow(url, { ...existing, ...patch }));
}

function seedFromInternalHtml(rows: CsvRow[], pages: Map<string, NormalizedPage>) {
  rows.forEach((row) => {
    const url = getValue(row, ["Address", "URL"]);
    if (!url) return;

    mergePage(pages, url, {
      statusCode: getNumber(row, ["Status Code", "StatusCode"], 200),
      title: getValue(row, ["Title 1", "Title"]),
      titleLength: getNumber(row, ["Title 1 Length", "Title Length"], 0),
      h1: getValue(row, ["H1-1", "H1 1", "H1"]),
      crawlDepth: getNumber(row, ["Crawl Depth", "Depth"], 1),
      inlinks: getNumber(row, ["Inlinks", "Unique Inlinks"], 0),
      canonical: getValue(row, ["Canonical Link Element 1", "Canonical"]),
      indexability: getBoolean(row, ["Indexability", "Indexable"], true),
      wordCount: getNumber(row, ["Word Count", "Words"], 600),
      hasStructuredData: getBoolean(row, ["Structured Data", "Has Structured Data"], true),
    });
  });
}

function applyMetadata(rows: CsvRow[], pages: Map<string, NormalizedPage>, type: "title" | "h1") {
  rows.forEach((row) => {
    const url = getValue(row, ["Address", "URL"]);
    if (!url) return;

    if (type === "title") {
      mergePage(pages, url, {
        title: getValue(row, ["Title 1", "Title"]),
        titleLength: getNumber(row, ["Title 1 Length", "Title Length"], 0),
      });
    } else {
      mergePage(pages, url, {
        h1: getValue(row, ["H1-1", "H1 1", "H1"]),
      });
    }
  });
}

function applyCanonicals(rows: CsvRow[], pages: Map<string, NormalizedPage>) {
  rows.forEach((row) => {
    const url = getValue(row, ["Address", "URL"]);
    if (!url) return;

    mergePage(pages, url, {
      canonical: getValue(row, ["Canonical Link Element 1", "Canonical"]),
      indexability: getBoolean(row, ["Indexability", "Indexable"], true),
    });
  });
}

function applyResponseCodes(rows: CsvRow[], pages: Map<string, NormalizedPage>) {
  rows.forEach((row) => {
    const url = getValue(row, ["Address", "URL"]);
    if (!url) return;

    mergePage(pages, url, {
      statusCode: getNumber(row, ["Status Code", "StatusCode"], 200),
      redirectUrl: getValue(row, ["Redirect URL", "Redirect Url", "Final Address"]),
      indexability: getBoolean(row, ["Indexability", "Indexable"], true),
    });
  });
}

function applyInlinks(rows: CsvRow[], pages: Map<string, NormalizedPage>) {
  rows.forEach((row) => {
    const url = getValue(row, ["Destination", "Address", "URL"]);
    if (!url) return;

    const current = pages.get(url)?.inlinks ?? 0;
    const increment = getNumber(row, ["Links", "Inlinks", "Occurrences"], 1);
    mergePage(pages, url, {
      inlinks: Math.max(current, increment),
    });
  });
}

export function parseScreamingFrogUploads(files: UploadedFilePayload[]) {
  const detectedExports: DetectedExport[] = [];
  const pages = new Map<string, NormalizedPage>();

  files.forEach((file) => {
    const exportType = detectExportType(file.fileName);
    if (!exportType) {
      return;
    }

    detectedExports.push({
      exportType,
      label: getExportLabel(exportType),
      fileName: file.fileName,
      uploadedAt: new Date(file.lastModified || Date.now()).toISOString(),
    });

    const rows = parseCsv(file.content);

    switch (exportType) {
      case "internal_html":
        seedFromInternalHtml(rows, pages);
        break;
      case "response_codes":
        applyResponseCodes(rows, pages);
        break;
      case "page_titles":
        applyMetadata(rows, pages, "title");
        break;
      case "h1":
        applyMetadata(rows, pages, "h1");
        break;
      case "canonicals":
        applyCanonicals(rows, pages);
        break;
      case "inlinks":
        applyInlinks(rows, pages);
        break;
      case "crawl_overview":
        break;
    }
  });

  const normalizedPages = Array.from(pages.values());

  if (normalizedPages.length === 0) {
    return {
      detectedExports,
      pages: buildMockPages(),
    };
  }

  return {
    detectedExports,
    pages: normalizedPages,
  };
}
