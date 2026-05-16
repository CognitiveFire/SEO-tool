import Link from "next/link";
import { ArrowRight, Layers3, Sparkles, UploadCloud } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const principles = [
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
];

export default function HomePage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">AI-powered SEO operations platform</p>
            <CardTitle className="max-w-4xl text-4xl leading-tight tracking-[-0.05em] lg:text-[4.25rem]">
              A calmer operating layer for technical SEO teams working from crawl exports.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-8">
              Signal Room turns Screaming Frog exports into clustered issues, executive summaries, and prioritised implementation tasks with a consultancy-grade interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link className={cn(buttonVariants({ variant: "primary", size: "lg" }))} href="/upload">
              Upload exports
              <ArrowRight className="size-4" />
            </Link>
            <Link className={cn(buttonVariants({ variant: "secondary", size: "lg" }))} href="/dashboard">
              View dashboard
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">Designed for</p>
            <CardTitle>Consultancy-style SEO operations</CardTitle>
            <CardDescription>Whitespace-first, editorial, minimal, and tuned for strategic implementation planning rather than audit clutter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-[color:var(--surface-strong)] p-5">
              <p className="font-medium text-[color:var(--foreground)]">Core workflow</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                Upload CSV exports, normalise crawl data, detect technical issues, cluster them into findings, then rank tasks by impact against complexity.
              </p>
            </div>
            <div className="rounded-3xl bg-[color:var(--surface-strong)] p-5">
              <p className="font-medium text-[color:var(--foreground)]">Architecture</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                Next.js App Router, TypeScript, Tailwind, Framer Motion, Recharts, Zustand, server actions, and a PostgreSQL-ready service boundary.
              </p>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}
