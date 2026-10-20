"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createAccount,
  getCurrentAuthUser,
  signIn,
  signOut,
  toAuthUser,
} from "../lib/auth";

import type { AuthUser, SignupResult } from "../lib/auth";
import { supabase } from "../lib/supabase";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<SignupResult>;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setUser(
        session?.user ? toAuthUser(session.user) : null
      );
      setLoading(false);
    });

    getCurrentAuthUser()
      .then((currentUser) => {
        if (!active) return;

        setUser(currentUser);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;

        setUser(null);
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (
    name: string,
    email: string,
    password: string
  ) => {
    const result = await createAccount(name, email, password);

    if (!result.needsEmailConfirmation) {
      setUser(result.user);
    }

    return result;
  };

  const login = async (email: string, password: string) => {
    const loggedInUser = await signIn(email, password);

    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}