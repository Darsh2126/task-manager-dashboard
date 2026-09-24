"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth/auth-store";
import { LOGIN_PATH, TASKS_PATH } from "@/lib/constants/route-path-constants";

interface WithAuthOptions {
  nonAuthenticated?: boolean;
}

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {},
) => {
  return function AuthComponent(props: P) {
    const router = useRouter();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const isInitialized = useAuthStore((state) => state.isInitialized);

    const { nonAuthenticated = false } = options;

    useEffect(() => {
      if (!isInitialized) {
        return;
      }

      if (nonAuthenticated && isAuthenticated) {
        router.replace(TASKS_PATH);
        return;
      }

      if (!nonAuthenticated && !isAuthenticated) {
        router.replace(LOGIN_PATH);
      }
    }, [isAuthenticated, isInitialized, nonAuthenticated, router]);

    if (!isInitialized) {
      return null;
    }

    if (nonAuthenticated && isAuthenticated) {
      return null;
    }

    if (!nonAuthenticated && !isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};
