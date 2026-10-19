"use client";
import React, { useMemo, useState } from "react";
import { useFinance } from "../context/FinanceProvider";
import { DashboardCards } from "../components/DashboardCards";
import PieByCategory from "../components/Charts/PieByCategory";
import Sparkline from "../components/Charts/Sparkline";
import { Card } from "../components/Card";
import { currency, totalExpenses, totalIncome } from "../utils/calculations";
import { AllocationModal } from "../components/AllocationModal";
import GoalCard from "../components/GoalCard";

export default function DashboardPage() {
  const { state } = useFinance();
  const [showAlloc, setShowAlloc] = useState(false);

  const spendByCategory = useMemo(() => {
    const map = new Map<string, number>();
    state.expenses.forEach((e) => map.set(e.category, (map.get(e.category) || 0) + e.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [state.expenses]);

  const sparkData = [
    { x: "1", y: 1000 },
    { x: "2", y: 1500 },
    { x: "3", y: 900 },
    { x: "4", y: 1200 },
    { x: "5", y: totalIncome(state) - totalExpenses(state) }
  ];

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Hello, {state.user?.name || "there"}</h2>
            <div className="text-sm text-gray-500">Your financial snapshot</div>
          </div>
          <div>
            <button onClick={() => setShowAlloc(true)} className="bg-accent text-white px-3 py-2 rounded">I Got Money</button>
          </div>
        </div>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          <Card title="Monthly Cash-flow">
            <Sparkline data={sparkData} />
          </Card>

          <Card title="Recent Transactions">
            <ul className="space-y-2">
              {state.expenses.slice(0, 6).map((t) => (
                <li key={t.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{t.category}</div>
                    <div className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-red-500 font-semibold">₹{t.amount}</div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Savings Goals">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.goals.map((g) => <GoalCard key={g.id} goal={g} />)}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Spending by category">
            <PieByCategory data={spendByCategory} />
          </Card>

          <Card title="Monthly Summary">
            <div className="text-sm text-gray-600">Income: {currency(totalIncome(state))}</div>
            <div className="text-sm text-gray-600">Expenses: {currency(totalExpenses(state))}</div>
            <div className="mt-2">
              <div className="text-sm font-medium">Financial Health</div>
              <div className="text-2xl font-semibold text-green-600">— Good</div>
            </div>
          </Card>
        </div>
      </div>

      {showAlloc && <AllocationModal onClose={() => setShowAlloc(false)} />}
    </>
  );
}