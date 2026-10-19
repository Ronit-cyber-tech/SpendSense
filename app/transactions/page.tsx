"use client";

import React from "react";
import ExpenseForm from "../../components/ExpenseForm";
import { useFinance } from "../../context/FinanceProvider";
import { Card } from "../../components/Card";
import { currency } from "../../utils/calculations";

export default function TransactionsPage() {
  const { state, deleteExpense, clearAllExpenses } = useFinance();

  const removeExpense = (id: string) => {
    if (confirm("Delete this expense?")) {
      deleteExpense(id);
    }
  };

  const clearExpenses = () => {
    if (state.expenses.length === 0) return;
    if (confirm("Delete ALL expenses? This cannot be undone.")) {
      clearAllExpenses();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <button
          onClick={clearExpenses}
          disabled={state.expenses.length === 0}
          className="border border-red-200 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-50 disabled:opacity-40"
        >
          Clear all expenses
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <Card title="Record Expense">
            <ExpenseForm />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="All Expenses">
            {state.expenses.length === 0 ? (
              <div className="text-sm text-gray-500 py-4">No expenses recorded yet.</div>
            ) : (
              <ul>
                {state.expenses.map((expense) => (
                  <li key={expense.id} className="flex items-center justify-between gap-4 py-3 border-b">
                    <div>
                      <div className="font-medium">{expense.category}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-red-500 font-semibold">{currency(expense.amount)}</div>
                        <div className="text-xs text-gray-400">{expense.paymentMethod ?? "—"}</div>
                      </div>

                      <button
                        onClick={() => removeExpense(expense.id)}
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
