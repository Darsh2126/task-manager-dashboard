import { TaskPriority, TaskStatus } from "@/lib/enums/tasks";
import {
  createTaskService,
  deleteTaskService,
  updateTaskService,
} from "@/services/task/task-db-service";
import { useTaskStore } from "@/store/task/task-store";
import type { Task } from "@/types/tasks";

jest.mock("@/services/task/task-db-service", () => ({
  createTaskService: jest.fn(),
  deleteTaskService: jest.fn(),
  getTasksByUserId: jest.fn(),
  updateTaskService: jest.fn(),
  updateTasksService: jest.fn(),
}));

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  userId: "user-1",
  title: "Test task",
  description: "Test description",
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: new Date("2026-10-01"),
  position: 0,
  createdAt: "2026-09-25T00:00:00.000Z",
  updatedAt: "2026-09-25T00:00:00.000Z",
  ...overrides,
});

describe("TaskStore", () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      isCreating: false,
    });

    jest.clearAllMocks();
  });

  it("creates a task", async () => {
    const taskData = {
      userId: "user-1",
      title: "New task",
      description: "New description",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date("2026-10-01"),
    };

    await useTaskStore.getState().createTask(taskData);

    const tasks = useTaskStore.getState().tasks;

    expect(createTaskService).toHaveBeenCalledTimes(1);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject(taskData);
    expect(tasks[0].position).toBe(0);
  });

  it("updates a task", async () => {
    const task = createTask();

    useTaskStore.setState({
      tasks: [task],
      isCreating: false,
    });

    const updatedTask = {
      ...task,
      title: "Updated task",
    };

    await useTaskStore.getState().updateTask(updatedTask);

    expect(updateTaskService).toHaveBeenCalledTimes(1);
    expect(useTaskStore.getState().tasks[0].title).toBe("Updated task");
  });

  it("deletes a task", async () => {
    const task = createTask();

    useTaskStore.setState({
      tasks: [task],
      isCreating: false,
    });

    await useTaskStore.getState().deleteTask(task.id);

    expect(deleteTaskService).toHaveBeenCalledWith(task.id);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });
});