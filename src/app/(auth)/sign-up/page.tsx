"use client";

import SignupForm from "@/features/auth/sign-up-form";
import { withAuth } from "@/features/auth/with-auth";

const SignUpPage = () => <SignupForm />;

export default withAuth(SignUpPage, {
  nonAuthenticated: true,
});
