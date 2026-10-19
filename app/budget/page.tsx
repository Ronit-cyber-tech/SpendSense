"use client";

import React, { useState } from "react";
import { useFinance } from "../../context/FinanceProvider";
import { Card } from "../../components/Card";
import { currency } from "../../utils/calculations";

export default function BudgetPage() {
  const { state, addBudget, deleteBudget } = useFinance();
  const [name, setName] = useState("Food");
  const [limit, setLimit] = useState<number>(0);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || limit <= 0) return;
    addBudget({ name, limit });
    setLimit(0);
  };

  const removeBudget = (id: string) => {
    if (confirm("Delete this budget?")) {
      deleteBudget(id);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Budget</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <Card title="Create Budget">
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Category</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                >
                  <option>Food</option>
                  <option>Travel</option>
                  <option>Shopping</option>
                  <option>Education</option>
                  <option>Entertainment</option>
                  <option>Bills</option>
                  <option>Subscriptions</option>
                  <option>Family</option>
                  <option>Health</option>
                  <option>Rent</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Budget limit</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  type="number"
                  min="1"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                />
              </div>

              <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
                Add Budget
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {state.budgets.length === 0 && (
              <div className="text-sm text-gray-500">No budgets created yet.</div>
            )}

            {state.budgets.map((budget) => {
              const pct = Math.round((budget.spent / Math.max(1, budget.limit)) * 100);

              return (
                <Card key={budget.id} title={budget.name} subtitle={`${pct}% used`}>
                  <div className="flex justify-between items-center gap-3">
                    <div className="text-sm text-gray-600">
                      {currency(budget.spent)} / {currency(budget.limit)}
                    </div>

                    <div className="w-1/2 bg-gray-100 h-2 rounded">
                      <div
                        className="h-2 bg-primary rounded"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  {pct >= 90 && (
                    <div className="text-sm text-red-500 mt-2">Approaching budget limit</div>
                  )}

                  <button
                    onClick={() => removeBudget(budget.id)}
                    className="mt-3 text-xs border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete budget
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
