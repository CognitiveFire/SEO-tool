export type SupportedExportType =
  | "internal_html"
  | "response_codes"
  | "page_titles"
  | "h1"
  | "canonicals"
  | "inlinks"
  | "crawl_overview";

export type IssueSeverity = "critical" | "high" | "medium" | "low";
export type TrendDirection = "up" | "down" | "flat";
export type ClusterCategory =
  | "Internal Linking"
  | "Metadata"
  | "Crawlability"
  | "Site Architecture"
  | "Duplicate Content"
  | "Structured Data"
  | "Indexation"
  | "Redirects";

export type TaskStatus = "open" | "in-progress" | "blocked" | "done";
export type TaskPriority = "High" | "Medium" | "Low";

export interface UploadedFilePayload {
  fileName: string;
  content: string;
  size: number;
  lastModified: number;
}

export interface DetectedExport {
  exportType: SupportedExportType;
  label: string;
  fileName: string;
  uploadedAt: string;
}

export interface NormalizedPage {
  url: string;
  path: string;
  template: string;
  statusCode: number;
  title: string;
  titleLength: number;
  h1: string;
  canonical: string;
  crawlDepth: number;
  inlinks: number;
  indexability: boolean;
  wordCount: number;
  contentHash?: string;
  redirectUrl?: string;
  hasStructuredData: boolean;
}

export interface SEOIssue {
  id: string;
  type: string;
  title: string;
  category: ClusterCategory;
  severity: IssueSeverity;
  affectedPages: string[];
  affectedPageCount: number;
  estimatedImpact: number;
  confidence: number;
  summary: string;
  trend: TrendDirection;
  examples: string[];
}

export interface IssueCluster {
  id: string;
  category: ClusterCategory;
  title: string;
  description: string;
  severity: IssueSeverity;
  issueIds: string[];
  affectedPageCount: number;
  trend: TrendDirection;
  businessRisk: string;
  representativePages: string[];
  aiSummary: string;
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  commercialImplication: string;
  recommendation: string;
  priority: TaskPriority;
}

export interface HistoricalDatum {
  period: string;
  health: number;
  issues: number;
  opportunity: number;
  indexablePages: number;
}

export interface RiskMatrixPoint {
  id: string;
  label: string;
  category: ClusterCategory;
  complexity: number;
  impact: number;
  businessEffect: number;
}

export interface DashboardMetrics {
  healthScore: number;
  indexablePages: number;
  brokenLinks: number;
  duplicateMetadata: number;
  orphanPages: number;
  internalLinkingScore: number;
  structuredDataCoverage: number;
  opportunityScore: number;
}

export interface PriorityFactors {
  impact: number;
  confidence: number;
  scale: number;
  complexity: number;
}

export interface TaskItem {
  id: string;
  title: string;
  category: ClusterCategory;
  seoImpact: number;
  complexity: number;
  confidence: number;
  affectedPages: number;
  estimatedBusinessEffect: string;
  status: TaskStatus;
  priorityScore: number;
  priority: TaskPriority;
  aiExplanation: string;
  whyItMatters: string;
  likelyRootCause: string;
  implementationRecommendation: string;
  estimatedSeoEffect: string;
  affectedTemplates: string[];
}

export interface CrawlProjectMeta {
  name: string;
  domain: string;
  crawlDate: string;
  uploadStatus: string;
  compareLabel: string;
}

export interface SeoSnapshot {
  project: CrawlProjectMeta;
  metrics: DashboardMetrics;
  insights: AIInsight[];
  historical: HistoricalDatum[];
  riskMatrix: RiskMatrixPoint[];
  clusters: IssueCluster[];
  issues: SEOIssue[];
  tasks: TaskItem[];
  detectedExports: DetectedExport[];
  processedAt: string;
  pages: NormalizedPage[];
}
