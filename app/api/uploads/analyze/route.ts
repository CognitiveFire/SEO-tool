import { NextResponse } from "next/server";

import { saveSeoSnapshot } from "@/lib/db/seo-snapshot-store";
import { parseScreamingFrogUploads } from "@/lib/parsers/screaming-frog";
import { createSeoSnapshot } from "@/lib/scoring/pipeline";
import type { UploadedFilePayload } from "@/types/seo";

export async function POST(request: Request) {
  const body = (await request.json()) as { files?: UploadedFilePayload[]; domain?: string; projectName?: string };

  if (!body.files?.length) {
    return NextResponse.json({ error: "No files supplied." }, { status: 400 });
  }

  const { detectedExports, pages } = parseScreamingFrogUploads(body.files);
  const snapshot = createSeoSnapshot({
    pages,
    detectedExports,
    domain: body.domain,
    projectName: body.projectName,
  });

  await saveSeoSnapshot(snapshot);

  return NextResponse.json(snapshot);
}
