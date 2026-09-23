"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  signupSchema,
  type SignupFormData,
} from "@/schemas/sign-up-schema";
import { useAuthStore } from "@/store/auth/auth-store";

const SignupForm = () => {
  const signup = useAuthStore((state) => state.signup);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.email, data.password);

      toast.success("Account created successfully");
      form.reset();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "User already exists"
      ) {
        toast.error("User already exists");
        return;
      }

      toast.error("Something went wrong");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to manage your tasks
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-email">
                  Email
                </FieldLabel>

                <Input
                  {...field}
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-password">
                  Password
                </FieldLabel>

                <Input
                  {...field}
                  id="signup-password"
                  type="password"
                  placeholder="Enter your password"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {form.formState.isSubmitting
              ? "Creating account..."
              : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-foreground"
          >
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}

export default SignupForm