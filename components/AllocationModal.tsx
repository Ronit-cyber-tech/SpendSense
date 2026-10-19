"use client";
import React, { useState } from "react";
import { useFinance } from "../context/FinanceProvider";

type Props = { onClose?: () => void };

export const AllocationModal: React.FC<Props> = ({ onClose }) => {
  const { allocateNewMoney } = useFinance();
  const [amount, setAmount] = useState<number>(1000);
  // simple default balanced
  const [alloc, setAlloc] = useState<Record<string, number>>({ Needs: 50, Wants: 20, Savings: 20, Family: 10 });

  function setPct(key: string, val: number) {
    setAlloc((a) => ({ ...a, [key]: val }));
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = Object.values(alloc).reduce((s, v) => s + v, 0);
    if (sum !== 100) {
      alert("Allocations should add up to 100%");
      return;
    }
    allocateNewMoney(amount, alloc);
    alert("Allocation applied");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-xl">
        <h2 className="text-lg font-semibold">I Got Money — Allocation</h2>
        <form onSubmit={submit} className="space-y-3 mt-3">
          <div>
            <label className="text-sm text-gray-600">Amount</label>
            <input type="number" className="w-full border rounded px-2 py-1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>

          {Object.keys(alloc).map((k) => (
            <div key={k}>
              <div className="flex justify-between">
                <div className="text-sm font-medium">{k}</div>
                <div className="text-sm text-gray-500">{alloc[k]}%</div>
              </div>
              <input type="range" min={0} max={100} value={alloc[k]} onChange={(e) => setPct(k, Number(e.target.value))} className="w-full" />
            </div>
          ))}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};