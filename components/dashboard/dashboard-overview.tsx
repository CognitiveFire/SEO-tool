"use client";

import { AlertTriangle, Blocks, Bot, ChartSpline, Link2, SearchCheck, ShieldAlert, Sparkles } from "lucide-react";

import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { IssueClusters } from "@/components/dashboard/issue-clusters";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RiskMatrix } from "@/components/dashboard/risk-matrix";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useSeoStore } from "@/hooks/use-seo-store";
import { generateExecutiveSummary } from "@/lib/ai/ai-summary-service";
import { formatDate, formatNumber, formatPercent } from "@/lib/utils/format";
import type { SeoSnapshot } from "@/types/seo";

export function DashboardOverview({ fallbackSnapshot }: { fallbackSnapshot: SeoSnapshot }) {
  const snapshot = useSeoStore((state) => state.snapshot) ?? fallbackSnapshot;

  const metrics = [
    { label: "SEO Health Score", value: formatPercent(snapshot.metrics.healthScore), hint: "Composite health across crawl integrity, internal linking, and metadata hygiene.", icon: ShieldAlert },
    { label: "Indexable Pages", value: formatNumber(snapshot.metrics.indexablePages), hint: "Pages currently available for search visibility under indexable, 200-status conditions.", icon: SearchCheck },
    { label: "Broken Links", value: formatNumber(snapshot.metrics.brokenLinks), hint: "Internal paths still resolving to error states within the current uploaded crawl.", icon: AlertTriangle },
    { label: "Duplicate Metadata", value: formatNumber(snapshot.metrics.duplicateMetadata), hint: "Template collisions where distinct URLs share the same title output.", icon: Blocks },
    { label: "Orphan Pages", value: formatNumber(snapshot.metrics.orphanPages), hint: "Pages with no discovered inlinks and weak internal discoverability.", icon: Sparkles },
    { label: "Internal Linking Score", value: formatPercent(snapshot.metrics.internalLinkingScore), hint: "Internal support weighted by discovered inlinks and architectural access.", icon: Link2 },
    { label: "Structured Data Coverage", value: formatPercent(snapshot.metrics.structuredDataCoverage), hint: "Share of pages currently represented with structured data markup.", icon: ChartSpline },
    { label: "Opportunity Score", value: formatPercent(snapshot.metrics.opportunityScore), hint: "Estimated upside after sequencing effort by impact, confidence, and scale.", icon: Bot },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">Executive summary</p>
            <CardTitle className="max-w-3xl text-3xl leading-tight lg:text-[2.35rem]">{generateExecutiveSummary(snapshot)}</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-8">
              The current crawl was processed on {formatDate(snapshot.processedAt)} using {snapshot.detectedExports.length} Screaming Frog exports. Focus should remain on system-level causes before page-level fixes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {snapshot.detectedExports.slice(0, 3).map((item) => (
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--background)]/65 p-4" key={item.fileName}>
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Detected export</p>
                <p className="mt-2 text-base font-medium text-[color:var(--foreground)]">{item.label}</p>
                <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">{item.fileName}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">Upload health</p>
            <CardTitle>Current crawl status</CardTitle>
            <CardDescription>Signals from the latest processing run, aligned to the consultancy-style operating layer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-[color:var(--background)]/65 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[color:var(--foreground)]">{snapshot.project.domain}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">Crawl date {formatDate(snapshot.project.crawlDate)}</p>
                </div>
                <StatusBadge tone="low">{snapshot.project.uploadStatus}</StatusBadge>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-[color:var(--surface-strong)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Issues detected</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">{snapshot.issues.length}</p>
              </div>
              <div className="rounded-3xl bg-[color:var(--surface-strong)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Priority tasks</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">{snapshot.tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {metrics.map((metric) => (
          <KpiCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>AI highlights</CardTitle>
            <CardDescription>Editorial-style, executive-ready summaries generated from deterministic issue clustering and mock recommendation logic.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {snapshot.insights.map((insight, index) => (
              <AIInsightCard insight={insight} index={index} key={insight.id} />
            ))}
          </CardContent>
        </Card>

        <RiskMatrix data={snapshot.riskMatrix} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <TrendChart data={snapshot.historical} metric="health" />
        <TrendChart data={snapshot.historical} metric="issues" />
        <TrendChart data={snapshot.historical} metric="opportunity" />
        <TrendChart data={snapshot.historical} metric="indexablePages" />
      </section>

      <IssueClusters clusters={snapshot.clusters} />
    </div>
  );
}
