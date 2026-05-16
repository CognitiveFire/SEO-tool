import type { ClusterCategory, IssueCluster, TaskPriority } from "@/types/seo";

const recommendationMap: Record<ClusterCategory, string> = {
  "Internal Linking": "Rework navigational modules and contextual links so commercial templates receive stronger, earlier internal reinforcement.",
  Metadata: "Refactor title and heading generation rules so each template emits distinct, intent-led metadata at scale.",
  Crawlability: "Remove dead-end URLs from source templates and refresh internal references before the next crawl cycle.",
  "Site Architecture": "Reduce click depth for high-value sections by surfacing them in upper-tier navigation and cross-link modules.",
  "Duplicate Content": "Tighten canonical governance and constrain parameterised URL expansion to reduce duplicate page variants.",
  "Structured Data": "Expand schema implementation by template, starting with pages closest to revenue or conversion intent.",
  Indexation: "Align indexability and canonical signals so preferred pages are consistently crawlable, indexable, and self-referential.",
  Redirects: "Replace redirected internal destinations with final URLs directly within templates, navigation, and content modules.",
};

export function getRecommendation(category: ClusterCategory) {
  return recommendationMap[category];
}

export function getPriorityLabel(score: number): TaskPriority {
  if (score >= 6.5) return "High";
  if (score >= 3.75) return "Medium";
  return "Low";
}

export function createClusterNarrative(cluster: IssueCluster) {
  return {
    summary: `${cluster.title}. ${cluster.description}`,
    commercialImplication: cluster.businessRisk,
    recommendation: getRecommendation(cluster.category),
  };
}
