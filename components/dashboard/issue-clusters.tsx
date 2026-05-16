import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { IssueCluster } from "@/types/seo";

function getTrendIcon(trend: IssueCluster["trend"]) {
  if (trend === "up") return ArrowUpRight;
  if (trend === "down") return ArrowDownRight;
  return ArrowRight;
}

function getTone(severity: IssueCluster["severity"]) {
  if (severity === "critical") return "critical" as const;
  if (severity === "high") return "high" as const;
  if (severity === "medium") return "medium" as const;
  return "low" as const;
}

export function IssueClusters({ clusters }: { clusters: IssueCluster[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue clusters</CardTitle>
        <CardDescription>Grouped operational findings framed as root-cause patterns rather than disconnected issue counts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {clusters.map((cluster) => {
          const TrendIcon = getTrendIcon(cluster.trend);
          return (
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--background)]/65 p-5" key={cluster.id}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={getTone(cluster.severity)}>{cluster.severity}</StatusBadge>
                    <StatusBadge>{cluster.category}</StatusBadge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">{cluster.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">{cluster.description}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[color:var(--surface)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                  <TrendIcon className="size-4" />
                  {cluster.trend} trend
                </div>
              </div>
              <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr]">
                <div className="rounded-2xl bg-[color:var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Business risk</p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">{cluster.businessRisk}</p>
                </div>
                <div className="rounded-2xl bg-[color:var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Affected pages</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">{cluster.affectedPageCount}</p>
                </div>
                <div className="rounded-2xl bg-[color:var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Templates</p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">{cluster.representativePages.join(" • ")}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
