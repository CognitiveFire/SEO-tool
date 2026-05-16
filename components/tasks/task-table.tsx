"use client";

import { useDeferredValue, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";

import { TaskDrawer } from "@/components/tasks/task-drawer";
import { SnapshotBootstrap } from "@/components/state/snapshot-bootstrap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLanguageStore } from "@/hooks/use-language-store";
import { useSeoStore } from "@/hooks/use-seo-store";
import { getCopy } from "@/lib/i18n/copy";
import { formatNumber } from "@/lib/utils/format";
import type { SeoSnapshot, TaskItem } from "@/types/seo";

const sortOptions = [
  { value: "priorityScore", label: "Priority" },
  { value: "seoImpact", label: "SEO impact" },
  { value: "complexity", label: "Complexity" },
  { value: "affectedPages", label: "Affected pages" },
] as const;

function getPriorityTone(priority: TaskItem["priority"]) {
  if (priority === "High") return "critical" as const;
  if (priority === "Medium") return "high" as const;
  return "low" as const;
}

export function TaskTable({ fallbackSnapshot }: { fallbackSnapshot: SeoSnapshot }) {
  const snapshot = useSeoStore((state) => state.snapshot) ?? fallbackSnapshot;
  const language = useLanguageStore((state) => state.language);
  const copy = getCopy(language);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<(typeof sortOptions)[number]["value"]>("priorityScore");

  const deferredSearch = useDeferredValue(search);
  const tasks = snapshot.tasks
    .filter((task) => {
      const matchesSearch = [task.title, task.category, task.estimatedBusinessEffect]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearch.toLowerCase());
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];
      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return rightValue - leftValue;
      }
      return String(rightValue).localeCompare(String(leftValue));
    });

  return (
    <>
      <SnapshotBootstrap snapshot={fallbackSnapshot} />
      <Card>
        <CardHeader>
          <CardTitle>{copy.tasks.title}</CardTitle>
          <CardDescription>{copy.tasks.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.35fr_0.35fr_0.35fr]">
            <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
              <Search className="size-4 text-[color:var(--muted-foreground)]" />
              <input
                className="w-full bg-transparent text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted-foreground)]"
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.tasks.search}
                value={search}
              />
            </label>
            <select
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none"
              onChange={(event) => setPriorityFilter(event.target.value)}
              value={priorityFilter}
            >
              <option value="all">{copy.tasks.allPriorities}</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value="all">{copy.tasks.allStatuses}</option>
              <option value="open">Open</option>
              <option value="in-progress">In progress</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
            <select
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none"
              onChange={(event) => setSortKey(event.target.value as (typeof sortOptions)[number]["value"])}
              value={sortKey}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {copy.tasks.sortBy} {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden overflow-hidden rounded-[28px] border border-[color:var(--border)] xl:block">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[color:var(--surface-strong)] text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                <tr>
                  {[
                    copy.tasks.task,
                    copy.tasks.category,
                    copy.tasks.seoImpact,
                    copy.tasks.complexity,
                    copy.tasks.confidence,
                    copy.tasks.affectedPages,
                    copy.tasks.businessEffect,
                    copy.tasks.status,
                  ].map((heading) => (
                    <th className="px-5 py-4 font-medium" key={heading}>
                      <div className="flex items-center gap-2">
                        {heading}
                        <ArrowUpDown className="size-3.5" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr className="border-t border-[color:var(--border)] bg-[color:var(--surface)]/70" key={task.id}>
                    <td className="px-5 py-5 align-top">
                      <button className="text-left" onClick={() => setSelectedTask(task)} type="button">
                        <p className="font-medium text-[color:var(--foreground)]">{task.title}</p>
                        <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                          {copy.tasks.priority} {task.priorityScore}
                        </p>
                      </button>
                    </td>
                    <td className="px-5 py-5 align-top text-sm text-[color:var(--foreground)]">{task.category}</td>
                    <td className="px-5 py-5 align-top text-sm text-[color:var(--foreground)]">{task.seoImpact.toFixed(1)}</td>
                    <td className="px-5 py-5 align-top text-sm text-[color:var(--foreground)]">{task.complexity}</td>
                    <td className="px-5 py-5 align-top text-sm text-[color:var(--foreground)]">{Math.round(task.confidence * 100)}%</td>
                    <td className="px-5 py-5 align-top text-sm text-[color:var(--foreground)]">{formatNumber(task.affectedPages)}</td>
                    <td className="px-5 py-5 align-top text-sm text-[color:var(--foreground)]">{task.estimatedBusinessEffect}</td>
                    <td className="px-5 py-5 align-top">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge tone={getPriorityTone(task.priority)}>{task.priority}</StatusBadge>
                        <StatusBadge>{task.status}</StatusBadge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 xl:hidden">
            {tasks.map((task) => (
              <Card className="p-5" key={task.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">{task.title}</p>
                    <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{task.estimatedBusinessEffect}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge tone={getPriorityTone(task.priority)}>{task.priority}</StatusBadge>
                    <StatusBadge>{task.status}</StatusBadge>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.seoImpact}</p>
                    <p className="mt-2 text-sm text-[color:var(--foreground)]">{task.seoImpact.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.complexity}</p>
                    <p className="mt-2 text-sm text-[color:var(--foreground)]">{task.complexity}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">{copy.tasks.affectedPages}</p>
                    <p className="mt-2 text-sm text-[color:var(--foreground)]">{formatNumber(task.affectedPages)}</p>
                  </div>
                </div>
                <Button className="mt-5" onClick={() => setSelectedTask(task)} variant="secondary">
                  {copy.tasks.viewDetails}
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <TaskDrawer onOpenChange={(open) => !open && setSelectedTask(null)} open={Boolean(selectedTask)} task={selectedTask} />
    </>
  );
}
