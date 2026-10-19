"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  createAccount,
  getCurrentAuthUser,
  signIn,
  signOut,
} from "../lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<AuthUser>;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentAuthUser());
    setLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    const newUser = await createAccount(name, email, password);
    setUser(newUser);
    return newUser;
  };

  const login = async (email: string, password: string) => {
    const loggedInUser = await signIn(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
