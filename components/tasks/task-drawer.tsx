"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLanguageStore } from "@/hooks/use-language-store";
import { getCopy } from "@/lib/i18n/copy";
import { formatRelativeComplexity } from "@/lib/utils/format";
import type { TaskItem } from "@/types/seo";

function getPriorityTone(priority: TaskItem["priority"]) {
  if (priority === "High") return "critical" as const;
  if (priority === "Medium") return "high" as const;
  return "low" as const;
}
export function TaskDrawer({ task, open, onOpenChange }: { task: TaskItem | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const language = useLanguageStore((state) => state.language);
  const copy = getCopy(language);

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl border-l border-[color:var(--border)] bg-[color:var(--background)] px-6 py-5 shadow-2xl shadow-slate-950/20 focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">{copy.tasks.task}</p>
              <Dialog.Title className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">
                {task?.title ?? (language === "en" ? "No task selected" : "Ingen oppgave valgt")}
              </Dialog.Title>
            </div>
            <Dialog.Close className="inline-flex size-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)]">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          {task ? (
            <ScrollArea className="mt-6 h-[calc(100vh-7rem)] pr-4">
              <div className="space-y-4 pb-10">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={getPriorityTone(task.priority)}>{task.priority} {copy.tasks.priority.toLowerCase()}</StatusBadge>
                  <StatusBadge>{task.category}</StatusBadge>
                  <StatusBadge>{task.status}</StatusBadge>
                </div>

                <Card className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.drawerAiExplanation}</p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">{task.aiExplanation}</p>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.drawerWhyItMatters}</p>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">{task.whyItMatters}</p>
                  </Card>
                  <Card className="p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.drawerRootCause}</p>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">{task.likelyRootCause}</p>
                  </Card>
                </div>

                <Card className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.drawerImplementation}</p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">{task.implementationRecommendation}</p>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.drawerSeoEffect}</p>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">{task.estimatedSeoEffect}</p>
                  </Card>
                  <Card className="p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.drawerDeliveryProfile}</p>
                    <div className="mt-3 space-y-2 text-sm leading-7 text-[color:var(--foreground)]">
                      <p>{copy.tasks.drawerPriorityScore}: {task.priorityScore}</p>
                      <p>{copy.tasks.drawerConfidence}: {Math.round(task.confidence * 100)}%</p>
                      <p>{formatRelativeComplexity(task.complexity)}</p>
                    </div>
                  </Card>
                </div>

                <Card className="p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.drawerAffectedTemplates}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.affectedTemplates.map((template) => (
                      <StatusBadge key={template}>{template}</StatusBadge>
                    ))}
                  </div>
                </Card>
              </div>
            </ScrollArea>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
