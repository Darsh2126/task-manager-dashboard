import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignupForm from "@/features/auth/sign-up-form";

describe("SignupForm", () => {
  it("renders signup fields and submit button", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
});