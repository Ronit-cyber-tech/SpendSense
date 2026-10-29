"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  FinanceState,
  Income,
  Expense,
  BudgetCategory,
  SavingsGoal,
  SavingsVault,
  User,
} from "../types";
import { demoData } from "../lib/demoData";
import { loadState, saveState } from "../lib/storage";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";

type FinanceContextValue = {
  state: FinanceState;
  persistenceStatus: "idle" | "loading" | "saving" | "saved" | "save-failed" | "load-failed";
  retryPersistence: () => void;
  setUser: (u: Partial<User>) => void;
  addIncome: (i: Omit<Income, "id">) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  addGoal: (g: Omit<SavingsGoal, "id" | "saved">) => void;
  addToGoal: (goalId: string, amount: number) => void;
  addBudget: (b: { name: string; limit: number }) => void;
  allocateNewMoney: (amount: number, allocation: Record<string, number>) => void;
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  deleteGoal: (id: string) => void;
  deleteVault: (id: string) => void;
  deleteBudget: (id: string) => void;
  clearAllExpenses: () => void;
  clearAllData: () => void;
  loadDemoData: () => void;
  importData: (data: Partial<FinanceState>) => void;
};

const createId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createEmptyUser = (authUser?: { id: string; name: string; email: string } | null): User => ({
  ...(demoData.user as User),
  id: authUser?.id ?? "",
  name: authUser?.name ?? "",
  email: authUser?.email ?? "",
  ageRange: "",
  role: "Student",
  monthlyIncome: 0,
  sideIncome: 0,
  avgExpenses: 0,
  savings: 0,
  riskPreference: "Medium",
  mainPriority: "Save money",
  createdAt: new Date().toISOString(),
});

const createEmptyState = (
  authUser?: { id: string; name: string; email: string } | null
): FinanceState => ({
  ...demoData,
  user: createEmptyUser(authUser),
  incomes: [],
  expenses: [],
  goals: [],
  vaults: [],
  budgets: [],
  createdAt: new Date().toISOString(),
});

const cloneState = (source: FinanceState): FinanceState => ({
  ...source,
  user: source.user ? { ...source.user } : null,
  incomes: (source.incomes ?? []).map((item) => ({ ...item })),
  expenses: (source.expenses ?? []).map((item) => ({ ...item })),
  goals: (source.goals ?? []).map((item) => ({ ...item })),
  vaults: (source.vaults ?? []).map((item) => ({ ...item })),
  budgets: (source.budgets ?? []).map((item) => ({ ...item })),
});

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used inside FinanceProvider");
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [state, setState] = useState<FinanceState>(() => createEmptyState(null));
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [persistenceStatus, setPersistenceStatus] = useState<FinanceContextValue["persistenceStatus"]>("loading");
  const [loadRetryCount, setLoadRetryCount] = useState(0);
  const [saveRetryCount, setSaveRetryCount] = useState(0);
  const identityGenerationRef = useRef({ userId: null as string | null, generation: 0 });
  const latestIdentityRef = useRef({ userId: null as string | null, loadedUserId: null as string | null, generation: 0 });
  const stateOwnerRef = useRef<string | null>(null);
  const saveVersionRef = useRef(0);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const lastPersistedRef = useRef<{ userId: string; serialized: string } | null>(null);
  const currentUserId = authUser?.id ?? null;

  if (identityGenerationRef.current.userId !== currentUserId) {
    identityGenerationRef.current = {
      userId: currentUserId,
      generation: identityGenerationRef.current.generation + 1,
    };
  }
  latestIdentityRef.current = {
    userId: currentUserId,
    loadedUserId,
    generation: identityGenerationRef.current.generation,
  };

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    if (!authUser) {
      setState(createEmptyState(null));
      setLoadedUserId(null);
      stateOwnerRef.current = null;
      lastPersistedRef.current = null;
      setPersistenceStatus("idle");
      return () => {
        cancelled = true;
      };
    }

    setLoadedUserId(null);
    if (stateOwnerRef.current !== authUser.id) {
      setState(createEmptyState(authUser));
      stateOwnerRef.current = authUser.id;
    }
    setPersistenceStatus("loading");

    const loadUserState = async () => {
      let stored: Partial<FinanceState> | null = null;
      let hasRemoteRow = false;
      let remoteSerialized: string | null = null;

      try {
        const { data, error } = await supabase
          .from("user_finance_data")
          .select("data")
          .eq("user_id", authUser.id)
          .maybeSingle();

        if (error) throw error;

        if (data === null) {
          // Local data is a migration seed only after a successful no-row read.
          stored = loadState(authUser.id);
        } else {
          const remoteData: unknown = data.data;
          if (
            typeof remoteData !== "object" ||
            remoteData === null ||
            Array.isArray(remoteData)
          ) {
            throw new Error("SpendSense cloud data is not a valid object.");
          }
          hasRemoteRow = true;
          stored = remoteData as Partial<FinanceState>;
          remoteSerialized = JSON.stringify(remoteData);
        }
      } catch (error) {
        console.error("Could not load SpendSense data from Supabase:", error);
        if (!cancelled) setPersistenceStatus("load-failed");
        return;
      }

      if (cancelled) return;

      const base = createEmptyState(authUser);
      const merged = { ...base, ...(stored ?? {}) } as FinanceState;
      const nextState: FinanceState = {
        ...merged,
        user: {
          ...createEmptyUser(authUser),
          ...(merged.user ?? {}),
          id: authUser.id,
          email: authUser.email,
          name: merged.user?.name || authUser.name,
        },
        incomes: Array.isArray(merged.incomes) ? merged.incomes : [],
        expenses: Array.isArray(merged.expenses) ? merged.expenses : [],
        goals: Array.isArray(merged.goals) ? merged.goals : [],
        vaults: Array.isArray(merged.vaults) ? merged.vaults : [],
        budgets: Array.isArray(merged.budgets) ? merged.budgets : [],
      };
      setState(nextState);
      stateOwnerRef.current = authUser.id;
      lastPersistedRef.current = hasRemoteRow
        ? { userId: authUser.id, serialized: remoteSerialized as string }
        : null;
      setLoadedUserId(authUser.id);
      setPersistenceStatus(hasRemoteRow ? "saved" : "saving");
    };

    void loadUserState();

    return () => {
      cancelled = true;
    };
  }, [authUser?.id, authUser?.email, authUser?.name, authLoading, loadRetryCount]);

  useEffect(() => {
    if (authLoading || !authUser || loadedUserId !== authUser.id) return;

    const snapshot = cloneState(state);
    const serialized = JSON.stringify(snapshot);
    if (
      lastPersistedRef.current?.userId === authUser.id &&
      lastPersistedRef.current.serialized === serialized
    ) {
      setPersistenceStatus("saved");
      return;
    }

    const generation = latestIdentityRef.current.generation;
    const saveVersion = ++saveVersionRef.current;
    const isCurrentSave = () =>
      latestIdentityRef.current.userId === authUser.id &&
      latestIdentityRef.current.loadedUserId === authUser.id &&
      latestIdentityRef.current.generation === generation &&
      saveVersionRef.current === saveVersion;

    setPersistenceStatus("saving");
    const timeout = window.setTimeout(async () => {
      const save = async () => {
        if (!isCurrentSave()) return;

        saveState(authUser.id, snapshot);
        try {
          const { error } = await supabase.from("user_finance_data").upsert(
            {
              user_id: authUser.id,
              data: snapshot,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

          if (error) throw error;
          if (isCurrentSave()) {
            lastPersistedRef.current = { userId: authUser.id, serialized };
            setPersistenceStatus("saved");
          }
        } catch (error) {
          console.error(
            "Could not save SpendSense data to Supabase. A local backup was kept:",
            error
          );
          if (isCurrentSave()) setPersistenceStatus("save-failed");
        }
      };

      saveQueueRef.current = saveQueueRef.current.then(save, save);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [state, loadedUserId, authUser?.id, authLoading, saveRetryCount]);

  const retryPersistence = () => {
    if (persistenceStatus === "load-failed") {
      setLoadRetryCount((count) => count + 1);
    } else if (persistenceStatus === "save-failed") {
      setSaveRetryCount((count) => count + 1);
    }
  };

  const setUser = (user: Partial<User>) => {
    setState((current) => ({
      ...current,
      user: {
        ...(current.user ?? createEmptyUser(authUser)),
        ...user,
        id: authUser?.id ?? current.user?.id ?? "",
        email: authUser?.email ?? current.user?.email ?? "",
      } as User,
    }));
  };

  const addIncome = (income: Omit<Income, "id">) => {
    if (!Number.isFinite(income.amount) || income.amount <= 0) return;
    setState((current) => ({
      ...current,
      incomes: [{ ...income, id: createId("inc") }, ...(current.incomes ?? [])],
    }));
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    if (!Number.isFinite(expense.amount) || expense.amount <= 0) return;

    setState((current) => {
      const budgets = (current.budgets ?? []).map((budget) =>
        budget.name.trim().toLowerCase() === expense.category.trim().toLowerCase()
          ? { ...budget, spent: budget.spent + expense.amount }
          : budget
      );

      return {
        ...current,
        expenses: [{ ...expense, id: createId("exp") }, ...(current.expenses ?? [])],
        budgets,
      };
    });
  };

  const addGoal = (goal: Omit<SavingsGoal, "id" | "saved">) => {
    if (!Number.isFinite(goal.target) || goal.target <= 0) return;
    setState((current) => ({
      ...current,
      goals: [{ ...goal, id: createId("goal"), saved: 0 }, ...(current.goals ?? [])],
    }));
  };

  const addToGoal = (goalId: string, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setState((current) => ({
      ...current,
      goals: (current.goals ?? []).map((goal) =>
        goal.id === goalId
          ? { ...goal, saved: Math.min(goal.target, goal.saved + amount) }
          : goal
      ),
    }));
  };

  const addBudget = (budget: { name: string; limit: number }) => {
    if (!budget.name.trim() || !Number.isFinite(budget.limit) || budget.limit <= 0) return;
    setState((current) => ({
      ...current,
      budgets: [
        {
          id: createId("budget"),
          name: budget.name.trim(),
          limit: budget.limit,
          spent: 0,
        } as BudgetCategory,
        ...(current.budgets ?? []),
      ],
    }));
  };

  const deleteIncome = (id: string) => {
    setState((current) => ({
      ...current,
      incomes: (current.incomes ?? []).filter((item) => item.id !== id),
    }));
  };

  const deleteExpense = (id: string) => {
    setState((current) => {
      const expense = (current.expenses ?? []).find((item) => item.id === id);
      const expenses = (current.expenses ?? []).filter((item) => item.id !== id);

      const budgets = expense
        ? (current.budgets ?? []).map((budget) =>
            budget.name.trim().toLowerCase() === expense.category.trim().toLowerCase()
              ? { ...budget, spent: Math.max(0, budget.spent - expense.amount) }
              : budget
          )
        : current.budgets;

      return { ...current, expenses, budgets };
    });
  };

  const deleteGoal = (id: string) => {
    setState((current) => ({
      ...current,
      goals: (current.goals ?? []).filter((item) => item.id !== id),
    }));
  };

  const deleteVault = (id: string) => {
    setState((current) => ({
      ...current,
      vaults: (current.vaults ?? []).filter((item) => item.id !== id),
    }));
  };

  const deleteBudget = (id: string) => {
    setState((current) => ({
      ...current,
      budgets: (current.budgets ?? []).filter((item) => item.id !== id),
    }));
  };

  const clearAllExpenses = () => {
    setState((current) => ({
      ...current,
      expenses: [],
      budgets: (current.budgets ?? []).map((budget) => ({ ...budget, spent: 0 })),
    }));
  };

  const clearAllData = () => {
    setState(createEmptyState(authUser));
  };

  const loadDemoData = () => {
    const demo = cloneState(demoData as FinanceState);
    setState({
      ...demo,
      user: {
        ...createEmptyUser(authUser),
        ...(demo.user ?? {}),
        id: authUser?.id ?? "",
        email: authUser?.email ?? "",
        name: demo.user?.name || authUser?.name || "",
      },
    });
  };

  const importData = (data: Partial<FinanceState>) => {
    if (!data || typeof data !== "object") return;
    const base = createEmptyState(authUser);

    setState({
      ...base,
      ...data,
      user: {
        ...createEmptyUser(authUser),
        ...(data.user ?? {}),
        id: authUser?.id ?? data.user?.id ?? "",
        email: authUser?.email ?? data.user?.email ?? "",
      } as User,
      incomes: Array.isArray(data.incomes) ? data.incomes : [],
      expenses: Array.isArray(data.expenses) ? data.expenses : [],
      goals: Array.isArray(data.goals) ? data.goals : [],
      vaults: Array.isArray(data.vaults) ? data.vaults : [],
      budgets: Array.isArray(data.budgets) ? data.budgets : [],
    });
  };

  const allocateNewMoney = (amount: number, allocation: Record<string, number>) => {
    if (!Number.isFinite(amount) || amount <= 0) return;

    const percentages = Object.values(allocation);
    if (
      percentages.some(
        (percentage) =>
          !Number.isFinite(percentage) || percentage < 0 || percentage > 100
      ) ||
      Math.abs(percentages.reduce((sum, percentage) => sum + percentage, 0) - 100) >
        0.001
    ) {
      return;
    }

    const now = new Date().toISOString();
    const income: Income = {
      id: createId("inc"),
      amount,
      source: "New Money",
      date: now,
      recurring: false,
    };

    const expenseAdds: Expense[] = [];
    const vaultAdds: SavingsVault[] = [];

    for (const [name, percentage] of Object.entries(allocation)) {
      const allocatedAmount = Math.round((percentage / 100) * amount);
      const key = name.toLowerCase();

      if (key.includes("save") || key.includes("emergency") || key.includes("goal")) {
        vaultAdds.push({ id: createId("vault"), name, amount: allocatedAmount });
      } else if (
        key.includes("need") ||
        key.includes("personal") ||
        key.includes("spend") ||
        key.includes("want")
      ) {
        expenseAdds.push({
          id: createId("exp"),
          amount: allocatedAmount,
          category: name,
          date: now,
        } as Expense);
      } else {
        vaultAdds.push({ id: createId("vault"), name, amount: allocatedAmount });
      }
    }

    setState((current) => ({
      ...current,
      incomes: [income, ...(current.incomes ?? [])],
      expenses: [...expenseAdds, ...(current.expenses ?? [])],
      vaults: [...vaultAdds, ...(current.vaults ?? [])],
    }));
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        persistenceStatus,
        retryPersistence,
        setUser,
        addIncome,
        addExpense,
        addGoal,
        addToGoal,
        addBudget,
        allocateNewMoney,
        deleteIncome,
        deleteExpense,
        deleteGoal,
        deleteVault,
        deleteBudget,
        clearAllExpenses,
        clearAllData,
        loadDemoData,
        importData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export default FinanceProvider;
