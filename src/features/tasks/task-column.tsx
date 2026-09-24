"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "@/features/tasks/task-card";
import type { TaskColumnProps } from "@/types/tasks";
import TaskEmptyState from "./task-empty-state";

const TaskColumn = ({ title, tasks }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: title,
  });

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex flex-1 flex-col gap-3 rounded-lg border border-dashed transition-all duration-200 ${isOver
              ? "min-h-[260px] border-primary bg-primary/5 p-3"
              : "min-h-[160px] border-transparent"
            }`}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && <TaskEmptyState />}
        </div>
      </SortableContext>
    </section>
  );
};

export default TaskColumn;
