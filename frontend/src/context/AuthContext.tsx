"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studymatch_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("studymatch_token"))
      .finally(() => setLoading(false));
  }, []);

  function persist(token: string, u: User) {
    localStorage.setItem("studymatch_token", token);
    setUser(u);
  }

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    persist(res.data.token, res.data.user);
  }

  async function register(name: string, email: string, password: string) {
    const res = await api.post("/auth/register", { name, email, password });
    persist(res.data.token, res.data.user);
  }

  async function demoLogin() {
    const res = await api.post("/auth/demo-login");
    persist(res.data.token, res.data.user);
  }

  async function googleLogin(credential: string) {
    const res = await api.post("/auth/google", { credential });
    persist(res.data.token, res.data.user);
  }

  function logout() {
    localStorage.removeItem("studymatch_token");
    setUser(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, demoLogin, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
