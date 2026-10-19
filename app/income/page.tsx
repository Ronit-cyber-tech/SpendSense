"use client";

import React from "react";
import IncomeForm from "../../components/IncomeForm";
import { useFinance } from "../../context/FinanceProvider";
import { Card } from "../../components/Card";
import { currency } from "../../utils/calculations";

export default function IncomePage() {
  const { state, deleteIncome } = useFinance();

  const removeIncome = (id: string) => {
    if (confirm("Delete this income entry?")) {
      deleteIncome(id);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Income</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <Card title="Add Income">
            <IncomeForm />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Income History">
            {state.incomes.length === 0 ? (
              <div className="text-sm text-gray-500 py-4">No income recorded yet.</div>
            ) : (
              <ul className="divide-y">
                {state.incomes.map((income) => (
                  <li key={income.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{income.source}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(income.date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{currency(income.amount)}</div>
                        <div className="text-xs text-gray-400">
                          {income.recurring ? "Recurring" : "One-time"}
                        </div>
                      </div>

                      <button
                        onClick={() => removeIncome(income.id)}
                        className="text-xs border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
