"use client";

import { ResponsiveContainer, Line, Area, AreaChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MiniSignalChartProps {
  title: string;
  description: string;
  data: Array<{ label: string; value: number }>;
  valueLabel: string;
}

export function MiniSignalChart({ title, description, data, valueLabel }: MiniSignalChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[160px]">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
          <span>{valueLabel}</span>
          <span>{data[data.length - 1]?.value ?? 0}</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="signal-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Line dataKey="value" dot={false} stroke="var(--chart-primary)" strokeWidth={2} type="monotone" />
            <Area dataKey="value" fill="url(#signal-gradient)" stroke="var(--chart-primary)" strokeWidth={0} type="monotone" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
