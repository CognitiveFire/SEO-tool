import type { IssueCluster, SeoSnapshot } from "@/types/seo";

export function executivePrompt(snapshot: SeoSnapshot) {
  return `Summarise the operational SEO posture for ${snapshot.project.domain}. Prioritise executive clarity, commercial consequences, and implementation sequencing.`;
}

export function clusterPrompt(cluster: IssueCluster) {
  return `Explain the ${cluster.category} issue cluster titled "${cluster.title}" with business implications, likely root cause, and implementation advice.`;
}
