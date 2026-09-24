import TaskCard from "@/features/tasks/task-card";
import { TaskColumnProps } from "@/types/tasks";
import TaskEmptyState from "./task-empty-state";

const TaskColumn = ({ title, tasks }: TaskColumnProps) => (
  <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl bg-muted/40 p-4">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold">{title}</h2>
      <span className="text-xs text-muted-foreground">{tasks.length}</span>
    </div>
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      {tasks.length === 0 && <TaskEmptyState />}
    </div>
  </section>
);

export default TaskColumn;
