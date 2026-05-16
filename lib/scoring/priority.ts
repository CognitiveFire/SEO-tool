import { getPriorityLabel } from "@/lib/ai/recommendation-generator";
import { getRecommendation } from "@/lib/ai/recommendation-generator";
import type { IssueCluster, PriorityFactors, TaskItem } from "@/types/seo";

export function calculatePriorityScore({ impact, confidence, scale, complexity }: PriorityFactors) {
  return Number(((impact * confidence * scale) / complexity).toFixed(2));
}

function deriveComplexity(cluster: IssueCluster) {
  switch (cluster.category) {
    case "Metadata":
      return 4;
    case "Redirects":
      return 5;
    case "Internal Linking":
      return 6;
    case "Site Architecture":
      return 7;
    case "Duplicate Content":
      return 6;
    case "Indexation":
      return 5;
    case "Crawlability":
      return 4;
    case "Structured Data":
      return 3;
  }
}

function estimateBusinessEffect(cluster: IssueCluster) {
  if (cluster.severity === "critical") return "High commercial risk reduction";
  if (cluster.severity === "high") return "Meaningful visibility uplift";
  return "Incremental compounding gains";
}

export function buildTasksFromClusters(clusters: IssueCluster[]): TaskItem[] {
  return clusters.map((cluster) => {
    const impact = Math.min(10, Math.max(4, cluster.affectedPageCount / 6));
    const confidence = cluster.severity === "critical" ? 0.95 : cluster.severity === "high" ? 0.88 : 0.8;
    const scale = Math.min(10, Math.max(1.25, cluster.affectedPageCount / 20));
    const complexity = deriveComplexity(cluster);
    const priorityScore = calculatePriorityScore({ impact, confidence, scale, complexity });

    return {
      id: cluster.id,
      title: cluster.title,
      category: cluster.category,
      seoImpact: Number(impact.toFixed(1)),
      complexity,
      confidence,
      affectedPages: cluster.affectedPageCount,
      estimatedBusinessEffect: estimateBusinessEffect(cluster),
      status: cluster.severity === "critical" ? "open" : cluster.severity === "high" ? "in-progress" : "open",
      priorityScore,
      priority: getPriorityLabel(priorityScore),
      aiExplanation: cluster.aiSummary,
      whyItMatters: cluster.businessRisk,
      likelyRootCause: cluster.description,
      implementationRecommendation: getRecommendation(cluster.category),
      estimatedSeoEffect:
        cluster.severity === "critical"
          ? "Potential recovery in crawl efficiency, discoverability, and conversion entry points."
          : "Likely uplift in relevance clarity and internal authority distribution.",
      affectedTemplates: Array.from(new Set(cluster.representativePages.map((page) => page.split("/")[1] || "homepage"))),
    } satisfies TaskItem;
  }).sort((left, right) => right.priorityScore - left.priorityScore);
}
