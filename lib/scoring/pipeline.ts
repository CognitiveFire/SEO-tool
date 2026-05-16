import { generateAiInsights } from "@/lib/ai/ai-summary-service";
import { clusterIssues } from "@/lib/scoring/clustering";
import { buildTasksFromClusters } from "@/lib/scoring/priority";
import { detectSeoIssues } from "@/lib/scoring/rules-engine";
import type { DashboardMetrics, DetectedExport, NormalizedPage, RiskMatrixPoint, SeoSnapshot } from "@/types/seo";

function buildMetrics(pages: NormalizedPage[]) {
  const indexablePages = pages.filter((page) => page.indexability && page.statusCode === 200).length;
  const brokenLinks = pages.filter((page) => page.statusCode >= 400).length;
  const duplicateMetadata = new Set(
    pages.filter((page) => page.title).map((page) => page.title.toLowerCase()),
  ).size;
  const duplicateCount = Math.max(0, pages.filter((page) => page.title).length - duplicateMetadata);
  const orphanPages = pages.filter((page) => page.inlinks === 0 && page.statusCode === 200).length;
  const structuredDataCoverage = Math.round(
    (pages.filter((page) => page.hasStructuredData && page.statusCode === 200).length / Math.max(1, pages.length)) * 100,
  );
  const internalLinkingScore = Math.round(
    (pages.reduce((total, page) => total + Math.min(page.inlinks, 10), 0) / Math.max(1, pages.length * 10)) * 100,
  );
  const healthScore = Math.max(
    34,
    Math.round(100 - brokenLinks * 2 - orphanPages * 1.2 - duplicateCount * 0.65 - (100 - structuredDataCoverage) * 0.12),
  );
  const opportunityScore = Math.min(98, Math.round((internalLinkingScore * 0.45 + structuredDataCoverage * 0.25 + healthScore * 0.3)));

  return {
    healthScore,
    indexablePages,
    brokenLinks,
    duplicateMetadata: duplicateCount,
    orphanPages,
    internalLinkingScore,
    structuredDataCoverage,
    opportunityScore,
  } satisfies DashboardMetrics;
}

function buildProjectMeta(domain = "nordiccommerce.com", projectName = "Nordic Commerce") {
  return {
    name: projectName,
    domain,
    crawlDate: new Date("2026-05-12T09:15:00.000Z").toISOString(),
    uploadStatus: "Latest crawl processed",
    compareLabel: "Compare to 30 Apr 2026",
  };
}

function buildHistoricalSeries(metrics: DashboardMetrics, issueCount: number) {
  return [
    { period: "Dec", health: metrics.healthScore - 9, issues: issueCount + 11, opportunity: metrics.opportunityScore - 12, indexablePages: metrics.indexablePages - 34 },
    { period: "Jan", health: metrics.healthScore - 6, issues: issueCount + 8, opportunity: metrics.opportunityScore - 9, indexablePages: metrics.indexablePages - 27 },
    { period: "Feb", health: metrics.healthScore - 4, issues: issueCount + 7, opportunity: metrics.opportunityScore - 7, indexablePages: metrics.indexablePages - 13 },
    { period: "Mar", health: metrics.healthScore - 2, issues: issueCount + 4, opportunity: metrics.opportunityScore - 4, indexablePages: metrics.indexablePages - 8 },
    { period: "Apr", health: metrics.healthScore - 1, issues: issueCount + 2, opportunity: metrics.opportunityScore - 2, indexablePages: metrics.indexablePages - 4 },
    { period: "May", health: metrics.healthScore, issues: issueCount, opportunity: metrics.opportunityScore, indexablePages: metrics.indexablePages },
  ];
}

function buildRiskMatrix(tasks: SeoSnapshot["tasks"]): RiskMatrixPoint[] {
  return tasks.slice(0, 8).map((task) => ({
    id: task.id,
    label: task.title,
    category: task.category,
    complexity: task.complexity,
    impact: task.seoImpact,
    businessEffect: Math.round(task.priorityScore * 8),
  }));
}

export function createSeoSnapshot(args: {
  pages: NormalizedPage[];
  detectedExports: DetectedExport[];
  domain?: string;
  projectName?: string;
}): SeoSnapshot {
  const metrics = buildMetrics(args.pages);
  const issues = detectSeoIssues(args.pages);
  const clusters = clusterIssues(issues);
  const tasks = buildTasksFromClusters(clusters);
  const insights = generateAiInsights(clusters);

  return {
    project: buildProjectMeta(args.domain, args.projectName),
    metrics,
    insights,
    historical: buildHistoricalSeries(metrics, tasks.length),
    riskMatrix: buildRiskMatrix(tasks),
    clusters,
    issues,
    tasks,
    detectedExports: args.detectedExports,
    processedAt: new Date().toISOString(),
    pages: args.pages,
  };
}
