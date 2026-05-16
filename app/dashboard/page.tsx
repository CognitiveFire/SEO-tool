import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { loadLatestSeoSnapshot } from "@/lib/db/seo-snapshot-store";
import { getMockSnapshot } from "@/lib/mock-data/seo-snapshot";

export default async function DashboardPage() {
  const fallbackSnapshot = (await loadLatestSeoSnapshot()) ?? getMockSnapshot();

  return <DashboardOverview fallbackSnapshot={fallbackSnapshot} />;
}
