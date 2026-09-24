import TaskColumn from "@/features/tasks/task-column";
import { TaskStatus } from "@/lib/enums/tasks";

const TaskBoard = () => (
  <div className="grid gap-4 md:grid-cols-3">
    <TaskColumn title={TaskStatus.TODO} />
    <TaskColumn title={TaskStatus.IN_PROGRESS} />
    <TaskColumn title={TaskStatus.DONE} />
  </div>
);

export default TaskBoard;