import TaskEmptyState from "@/features/tasks/task-empty-state";
import { TaskColumnProps } from "@/types/tasks";

const TaskColumn = ({ title }: TaskColumnProps) => (
  <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl bg-muted/40 p-4">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold">{title}</h2>
      <span className="text-xs text-muted-foreground">0</span>
    </div>
    <TaskEmptyState />
  </section>
);

export default TaskColumn;