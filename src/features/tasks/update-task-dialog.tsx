"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "@/features/tasks/task-form";
import { TaskFormData } from "@/schemas/task-schema";
import { useTaskStore } from "@/store/task/task-store";
import type { UpdateTaskDialogProps } from "@/types/tasks";

const UpdateTaskDialog = ({
  task,
  open,
  onOpenChange,
}: UpdateTaskDialogProps) => {
  const updateTask = useTaskStore((state) => state.updateTask);
  const [isUpdating, setIsUpdating] = useState(false);

  const formId = `update-task-${task.id}`;

  const handleSubmit = async (data: TaskFormData) => {
    setIsUpdating(true);

    try {
      await updateTask({
        ...task,
        ...data,
      });
    } finally {
      setIsUpdating(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>
            Update the details of your task.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          formId={formId}
          defaultValues={{
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
          }}
          onSubmit={handleSubmit}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={isUpdating}>
            {isUpdating && <Loader2 className="animate-spin" />}
            {isUpdating ? "Updating..." : "Update Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTaskDialog;
