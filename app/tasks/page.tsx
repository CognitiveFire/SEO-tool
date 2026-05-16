import { TaskTable } from "@/components/tasks/task-table";
import { loadLatestSeoSnapshot } from "@/lib/db/seo-snapshot-store";
import { getMockSnapshot } from "@/lib/mock-data/seo-snapshot";

export default async function TasksPage() {
  const fallbackSnapshot = (await loadLatestSeoSnapshot()) ?? getMockSnapshot();

  return <TaskTable fallbackSnapshot={fallbackSnapshot} />;
}
