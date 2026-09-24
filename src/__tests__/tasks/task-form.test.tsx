import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TaskForm from "@/features/tasks/task-form";

describe("TaskForm", () => {
  it("renders task form fields", () => {
    render(
      <TaskForm
        formId="task-form"
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    expect(screen.getByLabelText("Due date")).toBeInTheDocument();
  });

  it("shows validation error when title is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <TaskForm
        formId="task-form"
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});