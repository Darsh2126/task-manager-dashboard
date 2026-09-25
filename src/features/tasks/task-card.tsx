"use client";

import { useState } from "react";
import { CalendarDays, GripVertical, MoreVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateTaskDialog from "@/features/tasks/update-task-dialog";
import { TaskCardProps } from "@/types/tasks";
import DeleteTaskDialog from "./delete-task-dialog";

const TaskCard = ({ task }: TaskCardProps) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  const isOverdue = dueDate < today && task.status !== "Done";

  return (
    <>
      <article
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className="min-w-0 max-w-full overflow-hidden rounded-lg border bg-background p-4 shadow-sm"
      >
        <div className="min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-2">
              <button
                type="button"
                {...attributes}
                {...listeners}
                className="mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                aria-label="Drag task"
              >
                <GripVertical className="size-4" />
              </button>
              <h3 className="min-w-0 font-medium">{task.title}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="cursor-pointer" type="button" variant="ghost" size="icon">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setIsUpdateOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Tooltip>
            <TooltipTrigger className="block w-full min-w-0 text-left">
              <p className="w-full truncate text-sm text-muted-foreground cursor-pointer">
                {task.description}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{task.description}</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{task.status}</Badge>
            <Badge variant="outline">{task.priority}</Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex min-w-0 items-center gap-1">
              <CalendarDays className="size-3.5 shrink-0" />
              <span>
                {dueDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
          </div>
        </div>
      </article>
      <UpdateTaskDialog
        task={task}
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
      />
      <DeleteTaskDialog
        onOpenChange={setIsDeleteOpen}
        open={isDeleteOpen}
        taskId={task.id}
        title={task.title}
      />
    </>
  );
};

export default TaskCard;
