"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}

export function KpiCard({ label, value, hint, icon: Icon }: KpiCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="h-full">
        <CardContent className="flex h-full flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">{value}</p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--foreground)]">
              <Icon className="size-5" />
            </div>
          </div>
          <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">{hint}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
