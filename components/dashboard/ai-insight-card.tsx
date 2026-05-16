"use client";

import { motion } from "framer-motion";

import { StatusBadge } from "@/components/ui/status-badge";
import type { AIInsight } from "@/types/seo";

const toneMap = {
  High: "critical",
  Medium: "high",
  Low: "low",
} as const;

export function AIInsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  return (
    <motion.article
      className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">AI highlight</p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">{insight.title}</h3>
        </div>
        <StatusBadge tone={toneMap[insight.priority]}>{insight.priority} priority</StatusBadge>
      </div>
      <p className="mt-4 text-sm leading-7 text-[color:var(--foreground)]">{insight.summary}</p>
      <div className="mt-5 space-y-3 text-sm leading-6 text-[color:var(--muted-foreground)]">
        <p>
          <span className="font-medium text-[color:var(--foreground)]">Commercial implication:</span> {insight.commercialImplication}
        </p>
        <p>
          <span className="font-medium text-[color:var(--foreground)]">Recommendation:</span> {insight.recommendation}
        </p>
      </div>
    </motion.article>
  );
}
