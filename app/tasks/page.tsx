import { TaskTable } from "@/components/tasks/task-table";
import { getMockSnapshot } from "@/lib/mock-data/seo-snapshot";

export default function TasksPage() {
  return <TaskTable fallbackSnapshot={getMockSnapshot()} />;
}
