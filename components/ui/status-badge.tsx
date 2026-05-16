import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-[0.02em]",
  {
    variants: {
      tone: {
        neutral: "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--muted-foreground)]",
        critical: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-200",
        high: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-950 dark:bg-amber-950/40 dark:text-amber-200",
        medium: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-950 dark:bg-sky-950/40 dark:text-sky-200",
        low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ children, tone, className }: StatusBadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}
