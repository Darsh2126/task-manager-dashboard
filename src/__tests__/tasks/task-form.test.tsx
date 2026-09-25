import { fireEvent, render, screen } from "@testing-library/react";

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
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Due date")).toBeInTheDocument();
  });

  it("shows validation error when title is empty", async () => {
    const onSubmit = jest.fn();

    render(
      <TaskForm
        formId="task-form"
        onSubmit={onSubmit}
      />,
    );

    const form = document.getElementById("task-form");

    expect(form).toBeInTheDocument();

    fireEvent.submit(form!);

    expect(
      await screen.findByText("Title is required"),
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });
});