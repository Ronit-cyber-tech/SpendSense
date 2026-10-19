"use client";
import React, { useState } from "react";
import { useFinance } from "../context/FinanceProvider";

export const ExpenseForm: React.FC = () => {
  const { addExpense } = useFinance();
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    addExpense({ amount, category, date: new Date(date).toISOString(), paymentMethod: "Card" });
    setAmount(0);
    alert("Expense recorded");
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label className="block text-sm text-gray-600">Amount</label>
        <input className="w-full border rounded px-2 py-1" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Category</label>
        <select className="w-full border rounded px-2 py-1" value={category} onChange={(e) => setCategory(e.target.value)}>
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
        <label className="block text-sm text-gray-600">Date</label>
        <input className="w-full border rounded px-2 py-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add Expense</button>
      </div>
    </form>
  );
};
export default ExpenseForm;