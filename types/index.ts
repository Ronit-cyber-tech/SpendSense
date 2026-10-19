export type Role = "Student" | "Employee" | "Freelancer" | "Other";

export interface User {
  id: string;
  name: string;
  email?: string;
  ageRange?: string;
  role?: Role;
  monthlyIncome?: number;
  sideIncome?: number;
  avgExpenses?: number;
  savings?: number;
  riskPreference?: "Low" | "Medium" | "High";
  mainPriority?: string;
  createdAt: string;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string; // ISO
  recurring: boolean;
  note?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod?: string;
  note?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  targetDate?: string;
  priority?: number;
}

export interface SavingsVault {
  id: string;
  name: string;
  amount: number;
}

export interface FinanceState {
  user: User | null;
  incomes: Income[];
  expenses: Expense[];
  budgets: BudgetCategory[];
  goals: SavingsGoal[];
  vaults: SavingsVault[];
  createdAt: string;
}