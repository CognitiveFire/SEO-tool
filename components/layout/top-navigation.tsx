"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Clock3, GitCompareArrows, Globe2, Languages, UploadCloud } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { useLanguageStore } from "@/hooks/use-language-store";
import { useSeoStore } from "@/hooks/use-seo-store";
import { brandName, getCopy } from "@/lib/i18n/copy";
import { formatDate } from "@/lib/utils/format";

export function TopNavigation() {
  const pathname = usePathname();
  const snapshot = useSeoStore((state) => state.snapshot);
  const updateProjectDomain = useSeoStore((state) => state.updateProjectDomain);
  const language = useLanguageStore((state) => state.language);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
  const copy = getCopy(language);
  const [projectDomain, setProjectDomain] = useState(snapshot.project.domain);

  useEffect(() => {
    setProjectDomain(snapshot.project.domain);
  }, [snapshot.project.domain]);

  function saveProjectDomain() {
    updateProjectDomain(projectDomain);
  }

  const pageHeading: { title: string; description: string } =
    pathname === "/upload"
      ? { title: copy.upload.title, description: copy.upload.description }
      : pathname === "/dashboard"
        ? { title: copy.dashboard.summaryTitle, description: copy.dashboard.summaryDescription }
        : pathname === "/tasks"
          ? { title: copy.tasks.title, description: copy.tasks.description }
          : { title: copy.home.title, description: copy.home.description };

  return (
    <header className="border-b border-[color:var(--border)] bg-[color:var(--background)]/90 px-5 py-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">{brandName}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">{pageHeading.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">{pageHeading.description}</p>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 sm:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                <Globe2 className="size-3.5" /> {language === "en" ? "Project" : "Prosjekt"}
              </div>
              <input
                className="mt-2 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--background)]/60 px-2.5 py-1.5 text-sm font-medium text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
                onBlur={saveProjectDomain}
                onChange={(event) => setProjectDomain(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                placeholder={language === "en" ? "example.com" : "eksempel.no"}
                value={projectDomain}
              />
            </div>

            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                <Clock3 className="size-3.5" /> {language === "en" ? "Crawl date" : "Crawl-dato"}
              </div>
              <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">{formatDate(snapshot.project.crawlDate)}</p>
            </div>

            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                <UploadCloud className="size-3.5" /> {copy.upload.eyebrow}
              </div>
              <div className="mt-2">
                <StatusBadge tone="low">{snapshot.project.uploadStatus}</StatusBadge>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                <GitCompareArrows className="size-3.5" /> {language === "en" ? "Compare" : "Sammenlign"}
              </div>
              <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">{snapshot.project.compareLabel}</p>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[color:var(--foreground)] transition hover:border-[color:var(--border-strong)]"
            onClick={toggleLanguage}
            type="button"
          >
            <Languages className="size-3.5" />
            {language === "en" ? copy.nav.norwegian : copy.nav.english}
          </button>
        </div>
      </div>
    </header>
  );
}
