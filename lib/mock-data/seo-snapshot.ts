import { buildMockDetectedExports, buildMockPages } from "@/lib/mock-data/sample-crawl";
import { createSeoSnapshot } from "@/lib/scoring/pipeline";
import type { SeoSnapshot } from "@/types/seo";

let cachedSnapshot: SeoSnapshot | null = null;

export function getMockSnapshot() {
  if (!cachedSnapshot) {
    cachedSnapshot = createSeoSnapshot({
      pages: buildMockPages(),
      detectedExports: buildMockDetectedExports(),
      domain: "nordiccommerce.com",
      projectName: "Nordic Commerce",
    });
  }

  return cachedSnapshot;
}
