"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { HistoricalDatum } from "@/types/seo";

const chartMap = {
  health: { label: "Crawl health trend", color: "var(--chart-primary)" },
  issues: { label: "Technical issues trend", color: "var(--chart-secondary)" },
  opportunity: { label: "Opportunity trend", color: "var(--chart-tertiary)" },
  indexablePages: { label: "Indexed pages trend", color: "var(--chart-quaternary)" },
} as const;

interface TrendChartProps {
  data: HistoricalDatum[];
  metric: keyof typeof chartMap;
}

export function TrendChart({ data, metric }: TrendChartProps) {
  const config = chartMap[metric];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{config.label}</CardTitle>
        <CardDescription>Historical mock series to frame momentum instead of a single crawl-state reading.</CardDescription>
      </CardHeader>
      <CardContent className="h-[260px] pl-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 0, right: 12, top: 20, bottom: 0 }}>
            <XAxis axisLine={false} dataKey="period" tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Line dataKey={metric} dot={false} stroke={config.color} strokeLinecap="round" strokeWidth={2.5} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
