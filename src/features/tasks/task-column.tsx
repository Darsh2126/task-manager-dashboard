"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import TaskCard from "@/features/tasks/task-card";
import type { Task } from "@/types/tasks";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
}

const TaskColumn = ({ title, tasks }: TaskColumnProps) => {
  const sortedTasks = [...tasks].sort(
    (first, second) => first.position - second.position,
  );

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <SortableContext
        items={sortedTasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-20 flex-col gap-3">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </section>
  );
};

export default TaskColumn;