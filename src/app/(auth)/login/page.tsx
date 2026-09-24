"use client";

import LoginForm from "@/features/auth/login-form";
import { withAuth } from "@/features/auth/with-auth";

const LoginPage = () => <LoginForm />;

export default withAuth(LoginPage, {
  nonAuthenticated: true,
});
