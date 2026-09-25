"use client";

import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Pagination from "@/features/filters/pagination";
import TaskCard from "@/features/tasks/task-card";
import { paginateItems } from "@/lib/shared/pagination";
import type { TaskColumnProps } from "@/types/tasks";
import TaskEmptyState from "./task-empty-state";

const TaskColumn = ({ title, tasks, pageSize }: TaskColumnProps) => {
  const [page, setPage] = useState(1);

  const { setNodeRef, isOver } = useDroppable({
    id: title,
  });

  const paginatedTasks = paginateItems(tasks, page, pageSize);

  useEffect(() => {
    if (page > paginatedTasks.totalPages) {
      setPage(Math.max(1, paginatedTasks.totalPages));
    }
  }, [page, paginatedTasks.totalPages]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-xl bg-muted/40 p-4 md:min-h-0 md:flex-1">
      <div className="flex shrink-0 items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      <SortableContext
        items={paginatedTasks.items.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`rounded-lg border border-dashed transition-all duration-200 md:min-h-0 md:flex-1 md:overflow-y-auto ${isOver
              ? "min-h-[260px] border-primary bg-primary/5 p-3"
              : "min-h-[160px] border-transparent"
            }`}
        >
          <div className="flex flex-col gap-3">
            {paginatedTasks.items.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && <TaskEmptyState />}
          </div>
        </div>
      </SortableContext>
      {tasks.length > 0 && (
        <div className="shrink-0">
          <Pagination
            currentPage={page}
            totalPages={paginatedTasks.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </section>
  );
};

export default TaskColumn;
