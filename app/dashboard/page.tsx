import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getMockSnapshot } from "@/lib/mock-data/seo-snapshot";

export default function DashboardPage() {
  return <DashboardOverview fallbackSnapshot={getMockSnapshot()} />;
}
