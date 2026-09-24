import { z } from "zod";

import { TaskPriority, TaskStatus } from "@/lib/enums/tasks";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  dueDate: z.date({
    error: "Due date is required",
  }),
  position: z.number().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;