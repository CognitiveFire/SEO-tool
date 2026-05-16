"use server";

import { parseScreamingFrogUploads } from "@/lib/parsers/screaming-frog";
import { createSeoSnapshot } from "@/lib/scoring/pipeline";
import type { UploadedFilePayload } from "@/types/seo";

export async function processUploadedExports(files: UploadedFilePayload[]) {
  if (!files.length) {
    throw new Error("At least one supported Screaming Frog export is required.");
  }

  const { detectedExports, pages } = parseScreamingFrogUploads(files);

  return createSeoSnapshot({
    pages,
    detectedExports,
    domain: "uploaded-project.local",
    projectName: "Uploaded crawl",
  });
}
