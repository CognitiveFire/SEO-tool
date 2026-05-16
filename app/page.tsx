"use client";

import Link from "next/link";
import { ArrowRight, Layers3, Sparkles, UploadCloud } from "lucide-react";

import { MiniSignalChart } from "@/components/dashboard/mini-signal-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useLanguageStore } from "@/hooks/use-language-store";
import { getCopy } from "@/lib/i18n/copy";
import { cn } from "@/lib/utils/cn";

const principleCopy = {
  en: [
    {
      title: "Upload, do not crawl",
      description: "The platform starts from exported Screaming Frog files and transforms them into an operational layer for consultants and in-house teams.",
      icon: UploadCloud,
    },
    {
      title: "Cluster before you fix",
      description: "Rule-based detection is grouped into structural findings so teams tackle root causes rather than large spreadsheets of repeated symptoms.",
      icon: Layers3,
    },
    {
      title: "AI for explanation, not detection",
      description: "The MVP uses a mock AI layer for narrative, prioritisation, and commercial context on top of deterministic SEO logic.",
      icon: Sparkles,
    },
  ],
  nb: [
    {
      title: "Last opp, ikke crawl",
      description: "Plattformen starter med eksporterte Screaming Frog-filer og gjør dem om til et operasjonelt lag for konsulenter og interne team.",
      icon: UploadCloud,
    },
    {
      title: "Grupper før du fikser",
      description: "Regelbasert deteksjon samles i strukturelle funn slik at team jobber med rotårsaker, ikke store regneark med gjentatte symptomer.",
      icon: Layers3,
    },
    {
      title: "AI for forklaring, ikke deteksjon",
      description: "MVP-en bruker et mock AI-lag for narrativ, prioritering og kommersiell kontekst oppå deterministisk SEO-logikk.",
      icon: Sparkles,
    },
  ],
} as const;

export default function HomePage() {
  const language = useLanguageStore((state) => state.language);
  const copy = getCopy(language);
  const chartData = [
    { label: "Jan", value: 54 },
    { label: "Feb", value: 58 },
    { label: "Mar", value: 61 },
    { label: "Apr", value: 66 },
    { label: "May", value: 72 },
  ];
  const principles = principleCopy[language];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">April Signal Room</p>
            <CardTitle className="max-w-2xl text-3xl leading-tight tracking-[-0.04em] lg:text-4xl">{copy.home.title}</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-8">{copy.home.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link className={cn(buttonVariants({ variant: "primary", size: "lg" }))} href="/upload">
                {copy.home.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link className={cn(buttonVariants({ variant: "secondary", size: "lg" }))} href="/dashboard">
                {copy.home.secondaryCta}
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--background)]/65 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.home.workflowTitle}</p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">{copy.home.workflowBody}</p>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--background)]/65 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.home.architectureTitle}</p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">{copy.home.architectureBody}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <MiniSignalChart
          data={chartData}
          description={copy.home.metricDescription}
          title={copy.home.metricLabel}
          valueLabel={copy.home.miniMetric}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon;
          return (
            <Card key={principle.title}>
              <CardContent className="p-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--foreground)]">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">{principle.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">{principle.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "English" : "Norsk"}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "The interface follows the selected language across controls and headings."
                : "Grensesnittet følger valgt språk i kontroller og overskrifter."}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{language === "en" ? "Norsk" : "English"}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "Switch to Norwegian from the top navigation when you want the localized workflow copy."
                : "Bytt til engelsk fra toppnavigasjonen når du vil se den engelske teksten."}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
