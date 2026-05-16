import type { ClusterCategory, NormalizedPage, SEOIssue } from "@/types/seo";

function buildIssue(args: {
  id: string;
  type: string;
  title: string;
  category: ClusterCategory;
  severity: SEOIssue["severity"];
  pages: NormalizedPage[];
  estimatedImpact: number;
  confidence: number;
  summary: string;
  trend: SEOIssue["trend"];
}) {
  return {
    id: args.id,
    type: args.type,
    title: args.title,
    category: args.category,
    severity: args.severity,
    affectedPages: args.pages.map((page) => page.url),
    affectedPageCount: args.pages.length,
    estimatedImpact: args.estimatedImpact,
    confidence: args.confidence,
    summary: args.summary,
    trend: args.trend,
    examples: args.pages.slice(0, 3).map((page) => page.path),
  } satisfies SEOIssue;
}

function groupDuplicates(pages: NormalizedPage[], key: (page: NormalizedPage) => string) {
  const groups = new Map<string, NormalizedPage[]>();

  pages.forEach((page) => {
    const value = key(page).trim().toLowerCase();
    if (!value) return;
    const existing = groups.get(value) ?? [];
    existing.push(page);
    groups.set(value, existing);
  });

  return Array.from(groups.values()).filter((group) => group.length > 1);
}

export function detectSeoIssues(pages: NormalizedPage[]): SEOIssue[] {
  const issues: SEOIssue[] = [];

  const missingTitles = pages.filter((page) => !page.title && page.statusCode === 200);
  if (missingTitles.length > 0) {
    issues.push(
      buildIssue({
        id: "missing-titles",
        type: "missing_titles",
        title: "Missing titles on indexable pages",
        category: "Metadata",
        severity: "high",
        pages: missingTitles,
        estimatedImpact: 8.8,
        confidence: 0.96,
        summary: "Important pages are entering the index without a primary relevance signal in the title field.",
        trend: "up",
      }),
    );
  }

  const duplicateTitlePages = groupDuplicates(
    pages.filter((page) => page.statusCode === 200),
    (page) => page.title,
  ).flat();
  if (duplicateTitlePages.length > 0) {
    issues.push(
      buildIssue({
        id: "duplicate-titles",
        type: "duplicate_titles",
        title: "Duplicate titles indicate metadata template collisions",
        category: "Metadata",
        severity: "high",
        pages: duplicateTitlePages,
        estimatedImpact: 8.4,
        confidence: 0.91,
        summary: "Repeated titles suggest template logic is collapsing distinct commercial intent into the same metadata output.",
        trend: "down",
      }),
    );
  }

  const longTitles = pages.filter((page) => page.titleLength > 60);
  if (longTitles.length > 0) {
    issues.push(
      buildIssue({
        id: "long-titles",
        type: "long_titles",
        title: "Long titles risk truncation on key landing pages",
        category: "Metadata",
        severity: "medium",
        pages: longTitles,
        estimatedImpact: 6.2,
        confidence: 0.89,
        summary: "Overextended titles are likely diluting message clarity in search results and reducing click-through efficiency.",
        trend: "flat",
      }),
    );
  }

  const missingH1s = pages.filter((page) => !page.h1 && page.statusCode === 200);
  if (missingH1s.length > 0) {
    issues.push(
      buildIssue({
        id: "missing-h1s",
        type: "missing_h1s",
        title: "Missing H1s on primary templates",
        category: "Metadata",
        severity: "medium",
        pages: missingH1s,
        estimatedImpact: 5.8,
        confidence: 0.9,
        summary: "Pages are missing a visible headline structure, weakening topical consistency between the SERP snippet and page body.",
        trend: "up",
      }),
    );
  }

  const duplicateH1Pages = groupDuplicates(
    pages.filter((page) => page.statusCode === 200),
    (page) => page.h1,
  ).flat();
  if (duplicateH1Pages.length > 0) {
    issues.push(
      buildIssue({
        id: "duplicate-h1s",
        type: "duplicate_h1s",
        title: "Duplicate H1s suggest repeated content framing",
        category: "Duplicate Content",
        severity: "medium",
        pages: duplicateH1Pages,
        estimatedImpact: 6.5,
        confidence: 0.86,
        summary: "Multiple pages are sharing the same on-page heading language, which often correlates with thin differentiation and cannibalisation.",
        trend: "down",
      }),
    );
  }

  const brokenLinks = pages.filter((page) => page.statusCode >= 400);
  if (brokenLinks.length > 0) {
    issues.push(
      buildIssue({
        id: "broken-internal-links",
        type: "broken_internal_links",
        title: "Broken internal URLs are still present in the crawl path",
        category: "Crawlability",
        severity: "critical",
        pages: brokenLinks,
        estimatedImpact: 9.5,
        confidence: 0.98,
        summary: "Internal journeys are ending on error states, which creates crawl waste and undermines commercial page discovery.",
        trend: "up",
      }),
    );
  }

  const redirectChains = pages.filter(
    (page) => page.statusCode >= 300 && page.statusCode < 400 && Boolean(page.redirectUrl),
  );
  if (redirectChains.length > 0) {
    issues.push(
      buildIssue({
        id: "redirect-chains",
        type: "redirect_chains",
        title: "Redirected URLs remain embedded in internal architecture",
        category: "Redirects",
        severity: "high",
        pages: redirectChains,
        estimatedImpact: 7.5,
        confidence: 0.82,
        summary: "Legacy redirects still sit in the internal graph, adding friction before users and bots reach target pages.",
        trend: "flat",
      }),
    );
  }

  const canonicalConflicts = pages.filter(
    (page) => page.canonical && page.canonical !== page.url && page.indexability,
  );
  if (canonicalConflicts.length > 0) {
    issues.push(
      buildIssue({
        id: "canonical-conflicts",
        type: "canonical_conflicts",
        title: "Indexable pages point canonicals away from themselves",
        category: "Indexation",
        severity: "high",
        pages: canonicalConflicts,
        estimatedImpact: 8.1,
        confidence: 0.9,
        summary: "Canonical signals are conflicting with indexable page states, increasing the risk of mixed consolidation signals.",
        trend: "up",
      }),
    );
  }

  const orphanPages = pages.filter((page) => page.inlinks === 0 && page.statusCode === 200);
  if (orphanPages.length > 0) {
    issues.push(
      buildIssue({
        id: "orphan-pages",
        type: "orphan_pages",
        title: "Commercial pages exist without internal discoverability",
        category: "Internal Linking",
        severity: "critical",
        pages: orphanPages,
        estimatedImpact: 9.1,
        confidence: 0.94,
        summary: "Pages with no discovered inlinks are likely being isolated from authority flow and user journeys.",
        trend: "up",
      }),
    );
  }

  const deepPages = pages.filter((page) => page.crawlDepth >= 4 && page.statusCode === 200);
  if (deepPages.length > 0) {
    issues.push(
      buildIssue({
        id: "deep-crawl-pages",
        type: "deep_crawl_pages",
        title: "Important pages sit too deep in the crawl path",
        category: "Site Architecture",
        severity: "high",
        pages: deepPages,
        estimatedImpact: 8.7,
        confidence: 0.88,
        summary: "Distance from the homepage is likely reducing internal prominence for pages with conversion intent.",
        trend: "down",
      }),
    );
  }

  const thinInternalLinking = pages.filter(
    (page) => page.inlinks > 0 && page.inlinks < 3 && page.statusCode === 200,
  );
  if (thinInternalLinking.length > 0) {
    issues.push(
      buildIssue({
        id: "thin-internal-linking",
        type: "thin_internal_linking",
        title: "Thin internal linking on template groups",
        category: "Internal Linking",
        severity: "medium",
        pages: thinInternalLinking,
        estimatedImpact: 6.9,
        confidence: 0.87,
        summary: "Key pages are receiving too little contextual reinforcement to compete effectively against adjacent sections.",
        trend: "flat",
      }),
    );
  }

  const nonIndexable = pages.filter((page) => !page.indexability && page.statusCode === 200);
  if (nonIndexable.length > 0) {
    issues.push(
      buildIssue({
        id: "non-indexable-pages",
        type: "non_indexable_pages",
        title: "Pages intended for discovery are not indexable",
        category: "Indexation",
        severity: "high",
        pages: nonIndexable,
        estimatedImpact: 8.9,
        confidence: 0.95,
        summary: "Indexation controls are preventing discovery on pages that appear commercially relevant or crawl-accessible.",
        trend: "up",
      }),
    );
  }

  const missingCanonicals = pages.filter(
    (page) => page.statusCode === 200 && (!page.canonical || page.canonical.length === 0),
  );
  if (missingCanonicals.length > 0) {
    issues.push(
      buildIssue({
        id: "missing-canonicals",
        type: "missing_canonicals",
        title: "Missing canonicals on indexable URLs",
        category: "Duplicate Content",
        severity: "medium",
        pages: missingCanonicals,
        estimatedImpact: 6.4,
        confidence: 0.83,
        summary: "Canonical governance is absent on pages where duplication or parameter expansion could emerge.",
        trend: "flat",
      }),
    );
  }

  const duplicateContentIndicators = pages.filter(
    (page) => page.path.includes("?") || (page.wordCount < 250 && page.statusCode === 200),
  );
  if (duplicateContentIndicators.length > 0) {
    issues.push(
      buildIssue({
        id: "duplicate-content-indicators",
        type: "duplicate_content_indicators",
        title: "Template patterns indicate duplicate content exposure",
        category: "Duplicate Content",
        severity: "medium",
        pages: duplicateContentIndicators,
        estimatedImpact: 7.1,
        confidence: 0.79,
        summary: "Parameterised and low-content URLs suggest duplicate or near-duplicate variants are leaking into the crawl set.",
        trend: "up",
      }),
    );
  }

  return issues;
}
