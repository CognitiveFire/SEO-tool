"use client";

import { usePathname } from "next/navigation";
import { ChevronDown, Clock3, GitCompareArrows, Globe2, UploadCloud } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { useSeoStore } from "@/hooks/use-seo-store";
import { formatDate } from "@/lib/utils/format";

const pageCopy: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Operational SEO intelligence",
    description: "A premium workspace for turning crawl exports into prioritised decisions.",
  },
  "/upload": {
    title: "Upload crawl exports",
    description: "Ingest Screaming Frog exports, validate the file set, and process a new operational snapshot.",
  },
  "/dashboard": {
    title: "Executive dashboard",
    description: "High-level visibility into technical health, risk, and opportunity across the crawl.",
  },
  "/tasks": {
    title: "Prioritised tasks",
    description: "Sortable implementation planning with business effect and AI-assisted context.",
  },
};

export function TopNavigation() {
  const pathname = usePathname();
  const snapshot = useSeoStore((state) => state.snapshot);
  const copy = pageCopy[pathname] ?? pageCopy["/"];

  return (
    <header className="border-b border-[color:var(--border)] bg-[color:var(--background)]/90 px-5 py-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">{snapshot.project.name}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">{copy.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">{copy.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              <Globe2 className="size-3.5" /> Domain
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)]">
              {snapshot.project.domain}
              <ChevronDown className="size-4 text-[color:var(--muted-foreground)]" />
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              <Clock3 className="size-3.5" /> Crawl date
            </div>
            <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">{formatDate(snapshot.project.crawlDate)}</p>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              <UploadCloud className="size-3.5" /> Upload status
            </div>
            <div className="mt-2">
              <StatusBadge tone="low">{snapshot.project.uploadStatus}</StatusBadge>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              <GitCompareArrows className="size-3.5" /> Compare
            </div>
            <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">{snapshot.project.compareLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
