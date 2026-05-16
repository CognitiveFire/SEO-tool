import { Clock3, FileSpreadsheet } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";

interface UploadProgressItem {
  name: string;
  label: string;
  progress: number;
  uploadedAt: string;
}

export function UploadProgress({ items }: { items: UploadProgressItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4" key={item.name}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--foreground)]">
                <FileSpreadsheet className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[color:var(--foreground)]">{item.label}</p>
                <p className="text-sm text-[color:var(--muted-foreground)]">{item.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
              <Clock3 className="size-3.5" />
              {new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.uploadedAt))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Progress className="flex-1" value={item.progress} />
            <StatusBadge tone={item.progress === 100 ? "low" : "medium"}>{item.progress}%</StatusBadge>
          </div>
        </div>
      ))}
    </div>
  );
}
