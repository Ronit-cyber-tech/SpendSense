import { FinanceState } from "../types";

export const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const totalIncome = (state: FinanceState) =>
  (state.incomes ?? []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

export const totalExpenses = (state: FinanceState) =>
  (state.expenses ?? []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

export const totalSavings = (state: FinanceState) => {
  const profileSavings = Number(state.user?.savings || 0);
  const vaultSavings = (state.vaults ?? []).reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  const goalSavings = (state.goals ?? []).reduce(
    (sum, item) => sum + Number(item.saved || 0),
    0
  );
  return profileSavings + vaultSavings + goalSavings;
};

export const availableBalance = (state: FinanceState) =>
  totalIncome(state) - totalExpenses(state);

export const savingsRate = (state: FinanceState) => {
  const income = totalIncome(state);
  if (income <= 0) return 0;
  return Math.round((totalSavings(state) / income) * 100);
};
