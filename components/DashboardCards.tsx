"use client";
import React from "react";
import { useFinance } from "../context/FinanceProvider";
import { Card } from "./Card";
import { currency, totalIncome, totalExpenses, totalSavings, availableBalance, savingsRate } from "../utils/calculations";

export const DashboardCards: React.FC = () => {
  const { state } = useFinance();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Income">
        <div className="text-2xl font-semibold">{currency(totalIncome(state))}</div>
        <div className="text-sm text-gray-500 mt-1">Monthly + One-time</div>
      </Card>

      <Card title="Total Expenses">
        <div className="text-2xl font-semibold text-red-500">{currency(totalExpenses(state))}</div>
        <div className="text-sm text-gray-500 mt-1">This period</div>
      </Card>

      <Card title="Total Savings">
        <div className="text-2xl font-semibold text-green-600">{currency(totalSavings(state))}</div>
        <div className="text-sm text-gray-500 mt-1">In vaults & goals</div>
      </Card>

      <Card title="Available Balance">
        <div className="text-2xl font-semibold">{currency(availableBalance(state))}</div>
        <div className="text-sm text-gray-500 mt-1">Income - Expenses</div>
      </Card>
    </div>
  );
};