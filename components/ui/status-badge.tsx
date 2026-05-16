import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-[0.02em]",
  {
    variants: {
      tone: {
        neutral: "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--muted-foreground)]",
        critical: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
        high: "border-orange-200 bg-orange-50/60 text-orange-600 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-400",
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
