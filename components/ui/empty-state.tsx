import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ eyebrow, title, description, icon, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="mb-2 inline-flex size-12 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--foreground)]">
          {icon}
        </div>
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">{eyebrow}</p>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="max-w-xl">{description}</CardDescription>
      </CardHeader>
      {action ? <CardContent>{action}</CardContent> : null}
    </Card>
  );
}
