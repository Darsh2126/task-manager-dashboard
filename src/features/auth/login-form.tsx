"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/schemas/login-schema";
import { useAuthStore } from "@/store/auth/auth-store";

const LoginForm = () => {
  const login = useAuthStore((state) => state.login);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      toast.success("Logged in successfully");
      form.reset();
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Welcome back</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Log in to manage your tasks
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>

                <Input
                  {...field}
                  id="login-email"
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
                <FieldLabel htmlFor="login-password">Password</FieldLabel>

                <Input
                  {...field}
                  id="login-password"
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
            {form.formState.isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/sign-up" className="font-medium text-foreground">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
