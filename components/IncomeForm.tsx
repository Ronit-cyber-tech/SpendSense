"use client";
import React, { useState } from "react";
import { useFinance } from "../context/FinanceProvider";

export const IncomeForm: React.FC = () => {
  const { addIncome } = useFinance();
  const [amount, setAmount] = useState<number>(0);
  const [source, setSource] = useState("Salary");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [recurring, setRecurring] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    addIncome({ amount, source, date: new Date(date).toISOString(), recurring, note: "" });
    setAmount(0);
    alert("Income added");
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label className="block text-sm text-gray-600">Amount</label>
        <input className="w-full border rounded px-2 py-1" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Source</label>
        <select className="w-full border rounded px-2 py-1" value={source} onChange={(e) => setSource(e.target.value)}>
          <option>Salary</option>
          <option>Freelancing</option>
          <option>Internship</option>
          <option>Side gig</option>
          <option>Allowance</option>
          <option>Scholarship</option>
          <option>Investment</option>
          <option>Other</option>
        </select>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm text-gray-600">Date</label>
          <input className="w-full border rounded px-2 py-1" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
            <span className="text-sm text-gray-600">Recurring</span>
          </label>
        </div>
      </div>
      <div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add Income</button>
      </div>
    </form>
  );
};
export default IncomeForm;