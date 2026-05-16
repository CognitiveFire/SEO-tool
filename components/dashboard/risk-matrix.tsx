"use client";

import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiskMatrixPoint } from "@/types/seo";

export function RiskMatrix({ data }: { data: RiskMatrixPoint[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Risk vs impact matrix</CardTitle>
        <CardDescription>Complexity on the horizontal axis, expected business impact on the vertical, bubble size by estimated effect.</CardDescription>
      </CardHeader>
      <CardContent className="h-[340px] pl-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <XAxis
              axisLine={false}
              dataKey="complexity"
              domain={[0, 10]}
              name="Complexity"
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              type="number"
            />
            <YAxis
              axisLine={false}
              dataKey="impact"
              domain={[0, 10]}
              name="Impact"
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              type="number"
            />
            <ZAxis dataKey="businessEffect" range={[120, 580]} />
            <Tooltip
              cursor={{ strokeDasharray: "4 6", stroke: "var(--border-strong)" }}
              formatter={(value, name) => [value, name]}
              contentStyle={{
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Scatter data={data} fill="var(--chart-primary)" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
