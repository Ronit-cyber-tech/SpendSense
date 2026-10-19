"use client";
import React, { useState } from "react";
import { Card } from "../../../components/Card";

function futureValue(P: number, rAnnualPct: number, nYears: number, monthly: number) {
  const r = rAnnualPct / 100;
  const months = nYears * 12;
  let fv = P * Math.pow(1 + r / 12, months);
  for (let i = 1; i <= months; i++) {
    fv += monthly * Math.pow(1 + r / 12, months - i + 1);
  }
  return Math.round(fv);
}

export default function CompoundPage() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(1000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(3);

  const fv = futureValue(initial, rate, years, monthly);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Compound Growth Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Inputs">
          <div className="space-y-2">
            <div>
              <label className="text-sm">Initial amount</label>
              <input type="number" value={initial} onChange={(e) => setInitial(Number(e.target.value))} className="w-full border rounded p-1" />
            </div>
            <div>
              <label className="text-sm">Monthly contribution</label>
              <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full border rounded p-1" />
            </div>
            <div>
              <label className="text-sm">Expected annual return (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full border rounded p-1" />
            </div>
            <div>
              <label className="text-sm">Years</label>
              <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full border rounded p-1" />
            </div>
          </div>
        </Card>

        <Card title="Result">
          <div className="text-sm text-gray-600">Estimated future value</div>
          <div className="text-2xl font-semibold mt-2">₹{fv.toLocaleString("en-IN")}</div>
          <div className="text-sm text-gray-500 mt-1">Total contributions: ₹{(initial + monthly * years * 12).toLocaleString("en-IN")}</div>
        </Card>
      </div>
    </div>
  );
}