"use client";
import React, { useState } from "react";
import { Card } from "../../components/Card";
import { useFinance } from "../../context/FinanceProvider";

export default function GoalsPage() {
  const { state, addGoal } = useFinance();
  const [name, setName] = useState("");
  const [target, setTarget] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || target <= 0) return;
    addGoal({ name, target, targetDate: undefined, priority: 1 });
    setName("");
    setTarget(0);
    alert("Goal created");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Savings Goals</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <Card title="Create Goal">
            <form onSubmit={submit} className="space-y-2">
              <div>
                <label className="text-sm">Name</label>
                <input className="w-full border rounded px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Target Amount</label>
                <input className="w-full border rounded px-2 py-1" type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} />
              </div>
              <div className="flex justify-end">
                <button className="bg-primary text-white px-3 py-1 rounded">Create</button>
              </div>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="My Goals">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.goals.map((g) => (
                <div key={g.id} className="bg-white p-3 rounded shadow">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{g.name}</div>
                      <div className="text-sm text-gray-500">{g.targetDate ? new Date(g.targetDate).toLocaleDateString() : "No target"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{g.saved}</div>
                      <div className="text-sm text-gray-400">of ₹{g.target}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}