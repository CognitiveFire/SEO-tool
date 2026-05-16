"use client";

import { AlertTriangle, Blocks, Bot, ChartSpline, Link2, SearchCheck, ShieldAlert, Sparkles } from "lucide-react";

import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { IssueClusters } from "@/components/dashboard/issue-clusters";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MiniSignalChart } from "@/components/dashboard/mini-signal-chart";
import { RiskMatrix } from "@/components/dashboard/risk-matrix";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { SnapshotBootstrap } from "@/components/state/snapshot-bootstrap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLanguageStore } from "@/hooks/use-language-store";
import { useSeoStore } from "@/hooks/use-seo-store";
import { getCopy } from "@/lib/i18n/copy";
import { formatDate, formatNumber, formatPercent } from "@/lib/utils/format";
import type { SeoSnapshot } from "@/types/seo";

export function DashboardOverview({ fallbackSnapshot }: { fallbackSnapshot: SeoSnapshot }) {
  const snapshot = useSeoStore((state) => state.snapshot) ?? fallbackSnapshot;
  const language = useLanguageStore((state) => state.language);
  const copy = getCopy(language);

  const metrics = [
    { label: language === "en" ? "SEO Health Score" : "SEO-helsescore", value: formatPercent(snapshot.metrics.healthScore), hint: language === "en" ? "Composite health across crawl integrity, internal linking, and metadata hygiene." : "Samlet helsetilstand for crawl-integritet, internlenking og metadata-kvalitet.", icon: ShieldAlert },
    { label: language === "en" ? "Indexable Pages" : "Indekserbare sider", value: formatNumber(snapshot.metrics.indexablePages), hint: language === "en" ? "Pages currently available for search visibility under indexable, 200-status conditions." : "Sider som kan vises i søk og er tilgjengelige med indeksérbar 200-status.", icon: SearchCheck },
    { label: language === "en" ? "Broken Links" : "Ødelagte lenker", value: formatNumber(snapshot.metrics.brokenLinks), hint: language === "en" ? "Internal paths still resolving to error states within the current uploaded crawl." : "Interne stier som fremdeles ender i feilstater i den opplastede crawl-en.", icon: AlertTriangle },
    { label: language === "en" ? "Duplicate Metadata" : "Dupliserte metadata", value: formatNumber(snapshot.metrics.duplicateMetadata), hint: language === "en" ? "Template collisions where distinct URLs share the same title output." : "Mal-kollisjoner der ulike URL-er deler samme title-output.", icon: Blocks },
    { label: language === "en" ? "Orphan Pages" : "Foreldreløse sider", value: formatNumber(snapshot.metrics.orphanPages), hint: language === "en" ? "Pages with no discovered inlinks and weak internal discoverability." : "Sider uten oppdagede innlenker og svak intern oppdagbarhet.", icon: Sparkles },
    { label: language === "en" ? "Internal Linking Score" : "Internlenke-score", value: formatPercent(snapshot.metrics.internalLinkingScore), hint: language === "en" ? "Internal support weighted by discovered inlinks and architectural access." : "Intern støtte vektet etter oppdagede innlenker og arkitektonisk tilgang.", icon: Link2 },
    { label: language === "en" ? "Structured Data Coverage" : "Strukturerte data", value: formatPercent(snapshot.metrics.structuredDataCoverage), hint: language === "en" ? "Share of pages currently represented with structured data markup." : "Andel sider som har markering for strukturerte data.", icon: ChartSpline },
    { label: language === "en" ? "Opportunity Score" : "Mulighetsscore", value: formatPercent(snapshot.metrics.opportunityScore), hint: language === "en" ? "Estimated upside after sequencing effort by impact, confidence, and scale." : "Estimert potensial etter prioritering av effekt, tillit og omfang.", icon: Bot },
  ];
  const chartData = snapshot.historical.map((point) => ({ label: point.period, value: point.health }));

  return (
    <div className="space-y-6 lg:space-y-8">
      <SnapshotBootstrap snapshot={fallbackSnapshot} />
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">{copy.dashboard.summaryTitle}</p>
            <CardDescription className="max-w-2xl text-base leading-8">{copy.dashboard.summaryDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <MiniSignalChart
              data={chartData}
              description={copy.dashboard.chartDescription}
              title={copy.dashboard.chartTitle}
              valueLabel={language === "en" ? "Health score" : "Helsescore"}
            />
            <div className="grid gap-3 md:grid-cols-3">
              {snapshot.detectedExports.slice(0, 3).map((item) => (
                <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--background)]/65 p-4" key={item.fileName}>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{item.label}</p>
                  <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{item.fileName}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">{copy.dashboard.currentStatus}</p>
            <CardTitle>{snapshot.project.domain}</CardTitle>
            <CardDescription>
              {language === "en"
                ? `Processed on ${formatDate(snapshot.processedAt)} from ${snapshot.detectedExports.length} uploaded exports.`
                : `Behandlet ${formatDate(snapshot.processedAt)} fra ${snapshot.detectedExports.length} opplastede eksporter.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-[color:var(--background)]/65 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[color:var(--foreground)]">{snapshot.project.domain}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                    {language === "en" ? "Crawl date" : "Crawl-dato"} {formatDate(snapshot.project.crawlDate)}
                  </p>
                </div>
                <StatusBadge tone="low">{snapshot.project.uploadStatus}</StatusBadge>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-[color:var(--surface-strong)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.dashboard.issuesDetected}</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">{snapshot.issues.length}</p>
              </div>
              <div className="rounded-3xl bg-[color:var(--surface-strong)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.dashboard.priorityTasks}</p>
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
            <CardTitle>{copy.dashboard.aiHighlights}</CardTitle>
            <CardDescription>{copy.dashboard.aiDescription}</CardDescription>
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
