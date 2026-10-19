export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type StoredAccount = AuthUser & {
  passwordHash: string;
};

const ACCOUNTS_KEY = "finwise_accounts_v1";
const SESSION_KEY = "finwise_session_v1";

const readAccounts = (): StoredAccount[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAccounts = (accounts: StoredAccount[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

const hashPassword = async (password: string) => {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const getCurrentAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const userId = window.localStorage.getItem(SESSION_KEY);
  if (!userId) return null;

  const account = readAccounts().find((item) => item.id === userId);
  if (!account) return null;

  const { passwordHash: _passwordHash, ...user } = account;
  return user;
};

export const createAccount = async (
  name: string,
  email: string,
  password: string
): Promise<AuthUser> => {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) throw new Error("Please enter your name.");
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const accounts = readAccounts();
  if (accounts.some((item) => item.email === cleanEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const account: StoredAccount = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `user-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  writeAccounts([account, ...accounts]);
  window.localStorage.setItem(SESSION_KEY, account.id);

  const { passwordHash: _passwordHash, ...user } = account;
  return user;
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const cleanEmail = email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email === cleanEmail);

  if (!account) throw new Error("No account found with this email.");

  const passwordHash = await hashPassword(password);
  if (passwordHash !== account.passwordHash) {
    throw new Error("Incorrect password.");
  }

  window.localStorage.setItem(SESSION_KEY, account.id);
  const { passwordHash: _passwordHash, ...user } = account;
  return user;
};

export const signOut = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
};
