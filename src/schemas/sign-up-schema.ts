import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must be at least 8 characters and contain 1 uppercase letter, 1 lowercase letter, and 1 number",
    ),
});

export type SignupFormData = z.infer<typeof signupSchema>;
