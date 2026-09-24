import TaskColumn from "@/features/tasks/task-column";
import { TaskStatus } from "@/lib/enums/tasks";
import { useTaskStore } from "@/store/task/task-store";

const TaskBoard = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const todoTasks = tasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const doneTasks = tasks.filter((task) => task.status === TaskStatus.DONE);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TaskColumn title={TaskStatus.TODO} tasks={todoTasks} />
      <TaskColumn title={TaskStatus.IN_PROGRESS} tasks={inProgressTasks} />
      <TaskColumn title={TaskStatus.DONE} tasks={doneTasks} />
    </div>
  )
};

export default TaskBoard;