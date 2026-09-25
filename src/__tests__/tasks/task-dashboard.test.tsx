import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TaskPriority, TaskStatus } from "@/lib/enums/tasks";
import { SORT_OPTION } from "@/lib/enums/filters";
import TasksDashboard from "@/features/tasks/task-dashboard";

jest.mock("@/features/tasks/create-task-dialog", () => ({
  __esModule: true,
  default: () => <button>Create Task</button>,
}));

jest.mock("@/features/tasks/task-board", () => ({
  __esModule: true,
  default: ({
    tasks,
  }: {
    tasks: Array<{ id: string; title: string }>;
  }) => (
    <div data-testid="task-board">
      {tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  ),
}));

jest.mock("@/features/filters/search-input", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      aria-label="Search tasks"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

jest.mock("@/features/filters/filter-bar", () => ({
  __esModule: true,
  default: () => <div>Filters</div>,
}));

jest.mock("@/features/filters/sort-select", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string | null) => void;
  }) => (
    <select
      aria-label="Sort tasks"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value={SORT_OPTION.NONE}>Default</option>
      <option value={SORT_OPTION.DUE_DATE_ASC}>
        Due date ascending
      </option>
      <option value={SORT_OPTION.DUE_DATE_DESC}>
        Due date descending
      </option>
      <option value={SORT_OPTION.PRIORITY_ASC}>
        Priority ascending
      </option>
      <option value={SORT_OPTION.PRIORITY_DESC}>
        Priority descending
      </option>
    </select>
  ),
}));

jest.mock("@/features/filters/page-size-select", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/features/filters/pagination", () => ({
  __esModule: true,
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  ),
}));

jest.mock("@/hooks/use-filters", () => ({
  __esModule: true,
  default: () => ({
    status: "",
    priority: "",
    from: "",
    to: "",
  }),
}));

jest.mock("@/store/auth/auth-store", () => ({
  useAuthStore: (selector: (state: { user: { id: string } }) => unknown) =>
    selector({
      user: {
        id: "user-1",
      },
    }),
}));

const tasks = [
  {
    id: "task-1",
    userId: "user-1",
    title: "Fix login bug",
    description: "Authentication issue",
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    dueDate: new Date("2026-10-10"),
    position: 0,
    createdAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z",
  },
  {
    id: "task-2",
    userId: "user-1",
    title: "Update dashboard",
    description: "Improve task filters",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date("2026-10-05"),
    position: 0,
    createdAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z",
  },
  {
    id: "task-3",
    userId: "user-1",
    title: "Write documentation",
    description: "Update README",
    status: TaskStatus.DONE,
    priority: TaskPriority.LOW,
    dueDate: new Date("2026-10-15"),
    position: 0,
    createdAt: "2026-09-25T00:00:00.000Z",
    updatedAt: "2026-09-25T00:00:00.000Z",
  },
];

jest.mock("@/store/task/task-store", () => ({
  useTaskStore: (
    selector: (state: {
      tasks: typeof tasks;
      loadTasks: jest.Mock;
    }) => unknown,
  ) =>
    selector({
      tasks,
      loadTasks: jest.fn(),
    }),
}));

describe("TasksDashboard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the dashboard and tasks", () => {
    render(<TasksDashboard />);

    expect(screen.getByText("Tasks Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("Update dashboard")).toBeInTheDocument();
    expect(screen.getByText("Write documentation")).toBeInTheDocument();
  });

  it("filters tasks using debounced search", async () => {
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(<TasksDashboard />);

    const searchInput = screen.getByRole("textbox", {
      name: "Search tasks",
    });

    await user.type(searchInput, "login");

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("Fix login bug")).toBeInTheDocument();
      expect(
        screen.queryByText("Update dashboard"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Write documentation"),
      ).not.toBeInTheDocument();
    });
  });

  it("sorts tasks by due date", async () => {
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(<TasksDashboard />);

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Sort tasks",
      }),
      SORT_OPTION.DUE_DATE_ASC,
    );

    const board = screen.getByTestId("task-board");
    const taskTitles = Array.from(board.children).map(
      (task) => task.textContent,
    );

    expect(taskTitles).toEqual([
      "Update dashboard",
      "Fix login bug",
      "Write documentation",
    ]);
  });

  it("paginates tasks", async () => {
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
    });

    render(<TasksDashboard />);

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("Update dashboard")).toBeInTheDocument();
    expect(screen.getByText("Write documentation")).toBeInTheDocument();
  });
});