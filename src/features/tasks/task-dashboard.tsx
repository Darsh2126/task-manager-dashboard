import TaskBoard from "@/features/tasks/task-board";
import CreateTaskDialog from "./create-task-dialog";
import TaskForm from "./task-form";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth/auth-store";
import { useTaskStore } from "@/store/task/task-store";

const TasksDashboard = () => {

  const user = useAuthStore((state) => state.user);
  const loadTasks = useTaskStore((state) => state.loadTasks);

  useEffect(() => {
    if (user) {
      loadTasks(user.id);
    }
  }, [user, loadTasks]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your tasks across different stages.</p>
        </div>
        <CreateTaskDialog formId="create-task-form" form={<TaskForm />} />
      </div>
      <div className="min-h-10" />
      <TaskBoard />
    </div>
  )
};

export default TasksDashboard;
