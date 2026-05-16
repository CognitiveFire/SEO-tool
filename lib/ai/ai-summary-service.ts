import { createClusterNarrative, getPriorityLabel } from "@/lib/ai/recommendation-generator";
import type { AIInsight, IssueCluster, SeoSnapshot } from "@/types/seo";

function clusterToInsight(cluster: IssueCluster, index: number): AIInsight {
  const narrative = createClusterNarrative(cluster);
  const signalScore = cluster.affectedPageCount / 20 + (cluster.severity === "critical" ? 3 : cluster.severity === "high" ? 2 : 1);

  return {
    id: `${cluster.id}-${index}`,
    title: cluster.title,
    summary: narrative.summary,
    commercialImplication: narrative.commercialImplication,
    recommendation: narrative.recommendation,
    priority: getPriorityLabel(signalScore),
  };
}

export function generateExecutiveSummary(snapshot: SeoSnapshot) {
  const dominantCluster = snapshot.clusters[0];
  const metricPairs: Array<[string, number]> = [
    ["Internal linking", snapshot.metrics.internalLinkingScore] as [string, number],
    ["Opportunity score", snapshot.metrics.opportunityScore] as [string, number],
    ["Structured data coverage", snapshot.metrics.structuredDataCoverage] as [string, number],
  ];
  const weakestMetric = metricPairs.sort((left, right) => left[1] - right[1])[0];

  return `${dominantCluster?.title ?? "Technical visibility requires attention"}. The clearest operational drag is currently ${weakestMetric?.[0].toLowerCase()}, which is suppressing the site’s ability to consolidate authority on commercially relevant templates.`;
}

export function generateAiInsights(clusters: IssueCluster[]): AIInsight[] {
  return clusters.slice(0, 6).map(clusterToInsight);
}
