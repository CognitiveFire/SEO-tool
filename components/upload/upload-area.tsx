"use client";

import { startTransition, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, UploadCloud } from "lucide-react";

import { processUploadedExports } from "@/app/upload/actions";
import { UploadProgress } from "@/components/upload/upload-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLanguageStore } from "@/hooks/use-language-store";
import { useSeoStore } from "@/hooks/use-seo-store";
import { getCopy } from "@/lib/i18n/copy";
import { detectExportType, getExportLabel } from "@/lib/parsers/export-types";
import type { UploadedFilePayload } from "@/types/seo";

interface UploadItem {
  file: File;
  progress: number;
  label: string;
  uploadedAt: string;
}

const requiredExports = [
  "internal_html.csv",
  "response_codes.csv",
  "page_titles.csv",
  "h1.csv",
  "canonicals.csv",
  "inlinks.csv",
  "crawl_overview.csv",
];

export function UploadArea() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const language = useLanguageStore((state) => state.language);
  const copy = getCopy(language);
  const setSnapshot = useSeoStore((state) => state.setSnapshot);
  const setProcessing = useSeoStore((state) => state.setProcessing);
  const isProcessing = useSeoStore((state) => state.isProcessing);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const detectedCount = useMemo(() => items.filter((item) => detectExportType(item.file.name)).length, [items]);

  async function ingestFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    const nextItems = Array.from(fileList).map((file) => {
      const exportType = detectExportType(file.name);
      return {
        file,
        progress: 12,
        label: exportType ? getExportLabel(exportType) : (language === "en" ? "Unsupported export" : "Ikke støttet eksport"),
        uploadedAt: new Date().toISOString(),
      };
    });

    const unsupported = nextItems.filter((item) => !detectExportType(item.file.name));
    if (unsupported.length > 0) {
      setError(copy.upload.errorUnsupported);
      setItems(nextItems);
      return;
    }

    setError(null);
    setIsComplete(false);
    setItems(nextItems);
    setProcessing(true);

    const payload: UploadedFilePayload[] = [];

    for (const item of nextItems) {
      const content = await item.file.text();
      payload.push({
        fileName: item.file.name,
        content,
        size: item.file.size,
        lastModified: item.file.lastModified,
      });

      setItems((current) => current.map((entry) => (entry.file.name === item.file.name ? { ...entry, progress: 68 } : entry)));
    }

    startTransition(async () => {
      try {
        const snapshot = await processUploadedExports(payload);
        setItems((current) => current.map((entry) => ({ ...entry, progress: 100 })));
        setSnapshot(snapshot);
        setIsComplete(true);
        router.push("/dashboard");
      } catch (actionError) {
        setError(actionError instanceof Error ? actionError.message : copy.upload.errorFailed);
        setProcessing(false);
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--border-strong)] to-transparent" />
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">{copy.upload.eyebrow}</p>
          <CardTitle className="text-3xl">{copy.upload.title}</CardTitle>
          <CardDescription className="max-w-2xl text-base leading-8">{copy.upload.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            animate={{ scale: isDragging ? 1.01 : 1 }}
            className="flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--background)]/65 px-6 py-10 text-center"
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              void ingestFiles(event.dataTransfer.files);
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex size-16 items-center justify-center rounded-[28px] bg-[color:var(--surface)] text-[color:var(--foreground)] shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
              {isProcessing ? <LoaderCircle className="size-7 animate-spin" /> : <UploadCloud className="size-7" />}
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
              {isProcessing ? copy.upload.processingTitle : copy.upload.dropTitle}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)]">{copy.upload.support}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button onClick={() => inputRef.current?.click()} type="button" variant="primary">
                <span>{copy.upload.select}</span>
              </Button>
              <StatusBadge>{detectedCount} {copy.upload.detected}</StatusBadge>
            </div>
            <input
              ref={inputRef}
              accept=".csv,text/csv"
              className="hidden"
              multiple
              onChange={(event) => void ingestFiles(event.target.files)}
              type="file"
            />
          </motion.div>
          {error ? <p className="mt-4 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
          {isComplete ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-4" /> {copy.upload.success}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {items.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{copy.upload.progress}</CardTitle>
                <CardDescription>{copy.upload.progressDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <UploadProgress
                  items={items.map((item) => ({
                    name: item.file.name,
                    label: item.label,
                    progress: item.progress,
                    uploadedAt: item.uploadedAt,
                  }))}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{copy.upload.expected}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {requiredExports.map((name) => (
                  <StatusBadge key={name} tone={items.some((item) => item.file.name === name) ? "low" : "neutral"}>
                    {name}
                  </StatusBadge>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <EmptyState
            action={<StatusBadge>{copy.upload.awaiting}</StatusBadge>}
            description={copy.upload.emptyDescription}
            eyebrow={copy.upload.eyebrow}
            icon={<UploadCloud className="size-6" />}
            title={copy.upload.emptyTitle}
          />
        )}
      </div>
    </div>
  );
}
