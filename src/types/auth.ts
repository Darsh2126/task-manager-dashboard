export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Session {
  userId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}