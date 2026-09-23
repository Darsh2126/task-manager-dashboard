import { create } from "zustand";

import {
  clearSession,
  createUser,
  getSession,
  getUserByEmail,
  saveSession,
} from "@/services/auth/auth-db-service";

import type { User, AuthState } from "@/types/auth";
import { toast } from "sonner";


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  signup: async (email, password) => {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    await createUser(user);

    await saveSession({
      userId: user.id,
    });

    set({
      user,
      isAuthenticated: true,
    });
  },

  login: async (email, password) => {
    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      console.log(">>>in")
      throw new Error("Invalid email or password");
    }

    await saveSession({
      userId: user.id,
    });

    set({
      user,
      isAuthenticated: true,
    });
  },

  restoreSession: async () => {
    const session = await getSession();

    if (!session) {
      return;
    }

    const user = await getUserByEmail(
      session.userId,
    );

    if (!user) {
      await clearSession();
      return;
    }

    set({
      user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await clearSession();

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));