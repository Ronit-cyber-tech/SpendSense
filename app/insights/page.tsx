"use client";
import React, { useMemo } from "react";
import { useFinance } from "../../context/FinanceProvider";
import { Card } from "../../components/Card";

export default function InsightsPage() {
  const { state } = useFinance();

  const totalInc = state.incomes.reduce((s, i) => s + i.amount, 0);
  const totalExp = state.expenses.reduce((s, e) => s + e.amount, 0);

  const largestCategory = useMemo(() => {
    const map = new Map<string, number>();
    state.expenses.forEach((e) => map.set(e.category, (map.get(e.category) || 0) + e.amount));
    const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return arr[0] ? `${arr[0][0]} (${arr[0][1]})` : "—";
  }, [state.expenses]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Money Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="This month vs last month">
          <div className="text-sm">You spent ₹{Math.abs(totalExp)} this period. (demo)</div>
        </Card>

        <Card title="Top insights">
          <ul className="list-disc pl-4">
            <li>Largest expense: {largestCategory}</li>
            <li>Savings increased by {Math.round((state.goals.reduce((s, g) => s + g.saved, 0) / Math.max(1, totalInc)) * 100)}% of income (demo metric)</li>
            <li>At current pace, your largest goal could be reached in ~months (demo estimate)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}