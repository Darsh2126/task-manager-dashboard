import { render, screen } from "@testing-library/react";

import { TaskPriority, TaskStatus } from "@/lib/enums/tasks";
import TaskCard from "@/features/tasks/task-card";
import type { Task } from "@/types/tasks";

jest.mock("@/features/tasks/update-task-dialog", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/features/tasks/delete-task-dialog", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: undefined,
  }),
}));

const task: Task = {
  id: "task-1",
  userId: "user-1",
  title: "Fix login bug",
  description: "Resolve the authentication issue",
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  dueDate: new Date("2099-10-01"),
  position: 0,
  createdAt: "2026-09-25T00:00:00.000Z",
  updatedAt: "2026-09-25T00:00:00.000Z",
};

describe("TaskCard", () => {
  it("renders task information", () => {
    render(<TaskCard task={task} />);

    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(
      screen.getByText("Resolve the authentication issue"),
    ).toBeInTheDocument();
    expect(screen.getByText(TaskStatus.TODO)).toBeInTheDocument();
    expect(screen.getByText(TaskPriority.HIGH)).toBeInTheDocument();
    expect(screen.getByText("1 Oct 2099")).toBeInTheDocument();
  });

  it("shows overdue badge for a past unfinished task", () => {
    const overdueTask = {
      ...task,
      dueDate: new Date("2026-09-01"),
    };

    render(<TaskCard task={overdueTask} />);

    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("does not show overdue badge for a completed task", () => {
    const completedTask = {
      ...task,
      status: TaskStatus.DONE,
      dueDate: new Date("2026-09-01"),
    };

    render(<TaskCard task={completedTask} />);

    expect(screen.queryByText("Overdue")).not.toBeInTheDocument();
  });

  it("renders the drag handle", () => {
    render(<TaskCard task={task} />);

    expect(
      screen.getByRole("button", { name: "Drag task" }),
    ).toBeInTheDocument();
  });
});