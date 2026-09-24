"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm from "./task-form";
import { CreateTaskDialogProps } from "@/types/tasks";
import { TaskFormData } from "@/schemas/task-schema";
import { useAuthStore } from "@/store/auth/auth-store";
import { useTaskStore } from "@/store/task/task-store";

const CreateTaskDialog = ({ formId }: CreateTaskDialogProps) => {
  const user = useAuthStore((state) => state.user);
  const createTask = useTaskStore((state) => state.createTask);
  const isCreating = useTaskStore((state) => state.isCreating);

  const [open, setOpen] = useState(false);

  const handleCreate = async (data: TaskFormData) => {
    if (!user) {
      toast.error("Please login to create a task");
      return;
    }

    await createTask({
      ...data,
      userId: user.id,
    });

    toast.success("Task created successfully");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Create Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to your task board.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          formId={formId}
          onSubmit={handleCreate}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={isCreating}>
            {isCreating && <Loader2 className="animate-spin" />}
            {isCreating ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
