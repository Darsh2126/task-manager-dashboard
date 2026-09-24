import CreateTaskButton from "@/features/tasks/create-task-button";
import TaskBoard from "@/features/tasks/task-board";

const TasksDashboard = () => (
  <div className="flex flex-1 flex-col gap-6 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tasks Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your tasks across different stages.</p>
      </div>
      <CreateTaskButton />
    </div>
    <div className="min-h-10" />
    <TaskBoard />
  </div>
);

export default TasksDashboard;