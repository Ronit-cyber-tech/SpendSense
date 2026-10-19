
import { FinanceState } from "../types";

const now = new Date().toISOString();

export const initialState: FinanceState = {
  createdAt: now,

  user: {
    id: "",
    name: "",
    ageRange: "",
    role: "Student",
    monthlyIncome: 0,
    sideIncome: 0,
    avgExpenses: 0,
    savings: 0,
    riskPreference: "Medium",
    mainPriority: "Save money",
    createdAt: now,
  },

  incomes: [],
  expenses: [],
  budgets: [],
  goals: [],
  vaults: [],
};

// Temporary compatibility export for existing imports.
// This now contains empty data, not sample financial records.
export const demoData = initialState;
