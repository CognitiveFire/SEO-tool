import type { ClusterCategory, IssueCluster, SEOIssue } from "@/types/seo";

const clusterNarratives: Record<ClusterCategory, { title: string; risk: string; description: string }> = {
  "Internal Linking": {
    title: "Internal authority is unevenly distributed",
    risk: "Revenue-driving templates may be under-supported in the internal graph.",
    description:
      "Internal linking patterns suggest pages with commercial intent are not receiving enough navigational or contextual support.",
  },
  Metadata: {
    title: "Metadata governance is not scaling with template output",
    risk: "Search result messaging is becoming indistinct across valuable landing pages.",
    description:
      "Title and heading patterns indicate template logic is producing repeated or incomplete metadata at scale.",
  },
  Crawlability: {
    title: "Crawl paths include avoidable technical friction",
    risk: "Bots and users are encountering unnecessary dead ends in the internal experience.",
    description:
      "Broken or inaccessible URLs remain connected to the site architecture, reducing crawl efficiency.",
  },
  "Site Architecture": {
    title: "Important pages appear structurally distant",
    risk: "Commercial sections may struggle to accumulate prominence within the site hierarchy.",
    description:
      "Depth patterns suggest that key templates sit deeper than expected within the navigational model.",
  },
  "Duplicate Content": {
    title: "Template duplication is diluting differentiation",
    risk: "Near-identical page signals can weaken relevance and consolidation behaviour.",
    description:
      "Repeated metadata and weak canonical governance point to duplicate content risks tied to template or parameter behaviour.",
  },
  "Structured Data": {
    title: "Structured data coverage is inconsistent",
    risk: "Rich result eligibility may be under-realised on important page groups.",
    description:
      "Schema coverage is not keeping pace with the content model, limiting search feature visibility.",
  },
  Indexation: {
    title: "Indexation directives are sending mixed signals",
    risk: "Google may consolidate or suppress pages that appear intended for discovery.",
    description:
      "Canonical and indexability patterns indicate the platform is not consistently defining preferred search-visible URLs.",
  },
  Redirects: {
    title: "Legacy redirects still influence crawl journeys",
    risk: "Redirect reliance is adding latency and wasting internal link equity.",
    description:
      "Historic URL changes remain embedded in linking patterns rather than being fully cleaned at the source.",
  },
};

function sortSeverity(severity: SEOIssue["severity"]) {
  switch (severity) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    default:
      return 1;
  }
}

export function clusterIssues(issues: SEOIssue[]): IssueCluster[] {
  const byCategory = new Map<ClusterCategory, SEOIssue[]>();

  issues.forEach((issue) => {
    const existing = byCategory.get(issue.category) ?? [];
    existing.push(issue);
    byCategory.set(issue.category, existing);
  });

  return Array.from(byCategory.entries())
    .map(([category, categoryIssues]) => {
      const topIssue = [...categoryIssues].sort(
        (left, right) => sortSeverity(right.severity) - sortSeverity(left.severity),
      )[0];
      const narrative = clusterNarratives[category];
      const representativePages = categoryIssues.flatMap((issue) => issue.examples).slice(0, 4);

      return {
        id: category.toLowerCase().replace(/\s+/g, "-"),
        category,
        title: narrative.title,
        description: `${narrative.description} ${topIssue?.summary ?? ""}`.trim(),
        severity: topIssue?.severity ?? "low",
        issueIds: categoryIssues.map((issue) => issue.id),
        affectedPageCount: categoryIssues.reduce((total, issue) => total + issue.affectedPageCount, 0),
        trend: topIssue?.trend ?? "flat",
        businessRisk: narrative.risk,
        representativePages,
        aiSummary:
          topIssue?.title && topIssue.affectedPageCount > 0
            ? `${topIssue.title} is the clearest symptom within this cluster, affecting ${topIssue.affectedPageCount} URLs.`
            : narrative.description,
      } satisfies IssueCluster;
    })
    .sort((left, right) => right.affectedPageCount - left.affectedPageCount);
}
