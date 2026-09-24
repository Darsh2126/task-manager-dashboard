import { TaskPriority, TaskStatus } from "@/lib/enums/tasks";
import { TaskFormData } from "@/schemas/task-schema";

export interface TaskColumnProps {
  title: string;
  tasks: Task[];
}

export interface CreateTaskDialogProps {
  formId: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  tasks: Task[];
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  loadTasks: (userId: string) => Promise<void>;
  isCreating: boolean;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export interface TaskCardProps {
  task: Task;
}

export interface TaskFormProps {
  formId: string;
  defaultValues?: TaskFormData;
  onSubmit: (data: TaskFormData) => void | Promise<void>;
}

export interface UpdateTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface DeleteTaskDialogProps {
  taskId: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}