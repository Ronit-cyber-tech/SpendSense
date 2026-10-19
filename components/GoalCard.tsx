  "use client";
  import React, { useState } from "react";
  import { SavingsGoal } from "../types";
  import { currency } from "../utils/calculations";
  import { useFinance } from "../context/FinanceProvider";

  export const GoalCard: React.FC<{ goal: SavingsGoal }> = ({ goal }) => {
    const { addToGoal } = useFinance();
    const [add, setAdd] = useState(0);
    const pct = Math.round((goal.saved / Math.max(1, goal.target)) * 100);
    return (
      <div className="bg-white rounded p-3 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{goal.name}</div>
            <div className="text-sm text-gray-500">{goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : "No target date"}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{currency(goal.saved)}</div>
            <div className="text-sm text-gray-500">of {currency(goal.target)}</div>
          </div>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded mt-3">
          <div style={{ width: `${Math.min(100, pct)}%` }} className="h-2 bg-primary rounded" />
        </div>
        <div className="flex gap-2 mt-3">
          <input type="number" className="flex-1 border rounded px-2 py-1" value={add} onChange={(e) => setAdd(Number(e.target.value))} />
          <button onClick={() => { if (add>0) { addToGoal(goal.id, add); setAdd(0); } }} className="bg-primary text-white px-3 py-1 rounded">Add</button>
        </div>
      </div>
    );
  };
  export default GoalCard;