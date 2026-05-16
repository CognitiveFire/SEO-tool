"use client";

import { startTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, Plus, UploadCloud, X } from "lucide-react";

import { processUploadedExports } from "@/app/upload/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLanguageStore } from "@/hooks/use-language-store";
import { useSeoStore } from "@/hooks/use-seo-store";
import { getCopy } from "@/lib/i18n/copy";
import { detectExportType, getExportLabel } from "@/lib/parsers/export-types";
import type { SupportedExportType, UploadedFilePayload } from "@/types/seo";

interface ExportSlot {
  type: SupportedExportType;
  label: string;
  filename: string;
  description: string;
  file: File | null;
}

const SLOT_DEFINITIONS: Array<{ type: SupportedExportType; filename: string; description: string }> = [
  { type: "internal_html", filename: "internal_html.csv", description: "All crawled internal HTML pages with status codes, indexability, and page metrics." },
  { type: "response_codes", filename: "response_codes.csv", description: "HTTP response codes for every URL including redirects, client and server errors." },
  { type: "page_titles", filename: "page_titles.csv", description: "Title tags, lengths, and duplicate detection across the crawled URL set." },
  { type: "h1", filename: "h1.csv", description: "H1 headings, lengths, and missing or duplicate heading issues per page." },
  { type: "canonicals", filename: "canonicals.csv", description: "Canonical tags and self-referencing vs. non-canonical URL relationships." },
  { type: "inlinks", filename: "inlinks.csv", description: "Internal link graph showing source, destination, anchor text, and link type." },
  { type: "crawl_overview", filename: "crawl_overview.csv", description: "Top-level crawl summary including total URLs, depths, and response breakdowns." },
];

export function UploadArea() {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const copy = getCopy(language);
  const setSnapshot = useSeoStore((state) => state.setSnapshot);
  const setProcessing = useSeoStore((state) => state.setProcessing);
  const isProcessing = useSeoStore((state) => state.isProcessing);

  const [slots, setSlots] = useState<ExportSlot[]>(
    SLOT_DEFINITIONS.map((def) => ({ ...def, label: getExportLabel(def.type), file: null })),
  );
  const [draggingOver, setDraggingOver] = useState<SupportedExportType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const inputRefs = useRef<Partial<Record<SupportedExportType, HTMLInputElement | null>>>({});

  const uploadedCount = slots.filter((s) => s.file !== null).length;
  const allUploaded = uploadedCount === slots.length;

  function assignFile(type: SupportedExportType, file: File) {
    const detected = detectExportType(file.name);
    if (detected && detected !== type) {
      // Accept anyway — user may have renamed; match by slot
    }
    setSlots((prev) => prev.map((s) => (s.type === type ? { ...s, file } : s)));
    setError(null);
  }

  function removeFile(type: SupportedExportType) {
    setSlots((prev) => prev.map((s) => (s.type === type ? { ...s, file: null } : s)));
  }

  async function handleProcess() {
    const ready = slots.filter((s) => s.file !== null);
    if (ready.length === 0) return;
    setProcessing(true);
    setError(null);
    setIsComplete(false);

    const payload: UploadedFilePayload[] = [];
    for (const slot of ready) {
      const content = await slot.file!.text();
      payload.push({ fileName: slot.file!.name, content, size: slot.file!.size, lastModified: slot.file!.lastModified });
    }

    startTransition(async () => {
      try {
        const snapshot = await processUploadedExports(payload);
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
    <div className="space-y-8">
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--border-strong)] to-transparent" />
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">{copy.upload.eyebrow}</p>
          <CardTitle className="text-3xl">{copy.upload.title}</CardTitle>
          <CardDescription className="max-w-2xl text-base leading-8">{copy.upload.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {slots.map((slot) => {
              const isDraggingThis = draggingOver === slot.type;
              return (
                <motion.div
                  animate={{ scale: isDraggingThis ? 1.02 : 1 }}
                  className={[
                    "relative flex flex-col rounded-2xl border p-4 transition-colors duration-150",
                    slot.file
                      ? "border-[color:var(--accent)]/40 bg-orange-50/40 dark:bg-orange-950/10"
                      : isDraggingThis
                        ? "border-[color:var(--accent)] bg-[color:var(--surface-strong)]"
                        : "border-dashed border-[color:var(--border-strong)] bg-[color:var(--background)]/60",
                  ].join(" ")}
                  key={slot.type}
                  onDragEnter={() => setDraggingOver(slot.type)}
                  onDragLeave={() => setDraggingOver(null)}
                  onDragOver={(e) => { e.preventDefault(); setDraggingOver(slot.type); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDraggingOver(null);
                    const file = e.dataTransfer.files[0];
                    if (file) assignFile(slot.type, file);
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">{slot.label}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-[color:var(--muted-foreground)]">{slot.filename}</p>
                    </div>
                    {slot.file ? (
                      <button
                        className="shrink-0 rounded-full p-0.5 text-[color:var(--muted-foreground)] transition hover:text-[color:var(--foreground)]"
                        onClick={() => removeFile(slot.type)}
                        type="button"
                      >
                        <X className="size-3.5" />
                      </button>
                    ) : null}
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-[11px] leading-5 text-[color:var(--muted-foreground)]">{slot.description}</p>

                  {/* Status / action */}
                  <div className="mt-4 flex items-center gap-2">
                    {slot.file ? (
                      <>
                        <CheckCircle2 className="size-4 shrink-0 text-[color:var(--accent)]" />
                        <span className="truncate text-xs text-[color:var(--foreground)]">{slot.file.name}</span>
                      </>
                    ) : (
                      <button
                        className="flex items-center gap-1.5 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-3 py-1.5 text-xs text-[color:var(--muted-foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]"
                        onClick={() => inputRefs.current[slot.type]?.click()}
                        type="button"
                      >
                        <Plus className="size-3" />
                        {language === "en" ? "Select file" : "Velg fil"}
                      </button>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={(el) => { inputRefs.current[slot.type] = el; }}
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) assignFile(slot.type, file);
                    }}
                    type="file"
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Process bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[color:var(--border)] pt-5">
            <StatusBadge tone={allUploaded ? "low" : "neutral"}>
              {uploadedCount} / {slots.length} {language === "en" ? "files ready" : "filer klare"}
            </StatusBadge>
            <Button
              disabled={uploadedCount === 0 || isProcessing}
              onClick={() => void handleProcess()}
              type="button"
              variant={uploadedCount > 0 ? "accent" : "secondary"}
            >
              {isProcessing ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  {copy.upload.processingTitle}
                </>
              ) : (
                <>
                  <UploadCloud className="size-4" />
                  {language === "en" ? "Process exports" : "Prosesser eksporter"}
                </>
              )}
            </Button>
            {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
            {isComplete ? (
              <span className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-4" /> {copy.upload.success}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


