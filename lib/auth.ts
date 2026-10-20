import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type SignupResult = {
  user: AuthUser;
  needsEmailConfirmation: boolean;
};

export const toAuthUser = (user: User): AuthUser => {
  const metadataName = user.user_metadata?.name;

  return {
    id: user.id,
    name:
      typeof metadataName === "string" && metadataName.trim()
        ? metadataName.trim()
        : user.email?.split("@")[0] ?? "User",
    email: user.email ?? "",
    createdAt: user.created_at || new Date().toISOString(),
  };
};

export const createAccount = async (
  name: string,
  email: string,
  password: string
): Promise<SignupResult> => {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) {
    throw new Error("Please enter your name.");
  }

  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        name: cleanName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Could not create the account. Please try again.");
  }

  return {
    user: toAuthUser(data.user),
    needsEmailConfirmation: !data.session,
  };
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    throw new Error("Please enter your email and password.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Could not log in. Please try again.");
  }

  return toAuthUser(data.user);
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentAuthUser = async (): Promise<AuthUser | null> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session?.user
    ? toAuthUser(data.session.user)
    : null;
};