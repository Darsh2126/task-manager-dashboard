import { create } from "zustand";

import {
  clearSession,
  createUser,
  getSession,
  getUserByEmail,
  getUserById,
  saveSession,
} from "@/services/auth/auth-db-service";

import type { User, AuthState } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

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
    try {
      const session = await getSession();

      if (!session) {
        return;
      }

      const user = await getUserById(session.userId);

      if (!user) {
        await clearSession();
        return;
      }

      set({
        user,
        isAuthenticated: true,
      });
    } finally {
      set({
        isInitialized: true,
      });
    }
  },

  logout: async () => {
    await clearSession();

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
