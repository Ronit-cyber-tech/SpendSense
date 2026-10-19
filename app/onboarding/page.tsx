// "use client";
// import React, { useState } from "react";
// import { useFinance } from "../../context/FinanceProvider";

// export default function Onboarding() {
//   const { state, setUser } = useFinance();
//   const [form, setForm] = useState({
//     name: state.user?.name ?? "",
//     ageRange: state.user?.ageRange ?? "",
//     role: state.user?.role ?? "Student",
//     monthlyIncome: state.user?.monthlyIncome ?? 0,
//     sideIncome: state.user?.sideIncome ?? 0,
//     avgExpenses: state.user?.avgExpenses ?? 0,
//     savings: state.user?.savings ?? 0,
//     riskPreference: state.user?.riskPreference ?? "Medium",
//     mainPriority: state.user?.mainPriority ?? ""
//   });

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setUser({
//       name: form.name,
//       ageRange: form.ageRange,
//       role: form.role,
//       monthlyIncome: Number(form.monthlyIncome),
//       sideIncome: Number(form.sideIncome),
//       avgExpenses: Number(form.avgExpenses),
//       savings: Number(form.savings),
//       riskPreference: form.riskPreference as any,
//       mainPriority: form.mainPriority
//     });
//     alert("Profile updated");
//   };

//   return (
//     <div className="max-w-2xl">
//       <h2 className="text-xl font-semibold mb-3">Welcome to FinWise — quick setup</h2>
//       <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded shadow-sm">
//         <div>
//           <label className="text-sm">Name</label>
//           <input className="w-full border rounded px-2 py-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <label className="text-sm">Age range</label>
//             <select className="w-full border rounded px-2 py-1" value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })}>
//               <option value="">Prefer not to say</option>
//               <option>18-24</option>
//               <option>25-30</option>
//               <option>31-40</option>
//             </select>
//           </div>
//           <div>
//             <label className="text-sm">Role</label>
//             <select className="w-full border rounded px-2 py-1" value={form.role} onChange={(e) =>
//   setForm({ ...form, role: e.target.value as typeof form.role })
// }>
//               <option>Student</option>
//               <option>Employee</option>
//               <option>Freelancer</option>
//               <option>Other</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-2">
//           <div>
//             <label className="text-sm">Monthly income</label>
//             <input className="w-full border rounded px-2 py-1" type="number" value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: Number(e.target.value) })} />
//           </div>
//           <div>
//             <label className="text-sm">Side income</label>
//             <input className="w-full border rounded px-2 py-1" type="number" value={form.sideIncome} onChange={(e) => setForm({ ...form, sideIncome: Number(e.target.value) })} />
//           </div>
//           <div>
//             <label className="text-sm">Avg monthly expenses</label>
//             <input className="w-full border rounded px-2 py-1" type="number" value={form.avgExpenses} onChange={(e) => setForm({ ...form, avgExpenses: Number(e.target.value) })} />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <label className="text-sm">Current savings</label>
//             <input className="w-full border rounded px-2 py-1" type="number" value={form.savings} onChange={(e) => setForm({ ...form, savings: Number(e.target.value) })} />
//           </div>
//           <div>
//             <label className="text-sm">Risk preference</label>
//             <select className="w-full border rounded px-2 py-1" value={form.riskPreference} onChange={(e) =>
//   setForm({
//     ...form,
//     riskPreference: e.target.value as typeof form.riskPreference,
//   })
// }>
//               <option>Low</option>
//               <option>Medium</option>
//               <option>High</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="text-sm">Main priority</label>
//           <select className="w-full border rounded px-2 py-1" value={form.mainPriority} onChange={(e) => setForm({ ...form, mainPriority: e.target.value })}>
//             <option>Save money</option>
//             <option>Control spending</option>
//             <option>Build emergency fund</option>
//             <option>Learn investing</option>
//             <option>Increase income</option>
//             <option>Save for a specific goal</option>
//           </select>
//         </div>

//         <div className="flex justify-end">
//           <button className="bg-primary text-white px-4 py-2 rounded">Save</button>
//         </div>
//       </form>
//     </div>
//   );
// }




"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFinance } from "../../context/FinanceProvider";
import { Card } from "../../components/Card";

const PRIORITIES = [
  "Save money",
  "Control spending",
  "Build emergency fund",
  "Learn investing",
  "Increase income",
  "Save for a specific goal",
];

export default function Onboarding() {
  const { state, setUser } = useFinance();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    ageRange: "",
    role: "Student",
    monthlyIncome: "",
    sideIncome: "",
    avgExpenses: "",
    savings: "",
    riskPreference: "Medium",
    mainPriority: "Save money",
  });

  // Fill the form when saved data finishes loading (it loads after the first render)
  useEffect(() => {
    const u: any = state.user ?? {};
    setForm({
      name: u.name ?? "",
      ageRange: u.ageRange ?? "",
      role: u.role ?? "Student",
      monthlyIncome: u.monthlyIncome ? String(u.monthlyIncome) : "",
      sideIncome: u.sideIncome ? String(u.sideIncome) : "",
      avgExpenses: u.avgExpenses ? String(u.avgExpenses) : "",
      savings: u.savings ? String(u.savings) : "",
      riskPreference: u.riskPreference ?? "Medium",
      mainPriority: u.mainPriority || "Save money",
    });
  }, [state.user]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const monthlyLeft = Number(form.monthlyIncome || 0) + Number(form.sideIncome || 0) - Number(form.avgExpenses || 0);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: form.name.trim(),
      ageRange: form.ageRange,
      role: form.role,
      monthlyIncome: Number(form.monthlyIncome || 0),
      sideIncome: Number(form.sideIncome || 0),
      avgExpenses: Number(form.avgExpenses || 0),
      savings: Number(form.savings || 0),
      riskPreference: form.riskPreference as any,
      mainPriority: form.mainPriority,
    } as any);
    setSaved(true);
    setTimeout(() => router.push("/"), 1200);
  };

  const input = "w-full border rounded px-2 py-1";

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-1">Welcome to FinWise</h2>
      <p className="text-sm text-gray-500 mb-3">Tell us a little about yourself. You can change this any time.</p>

      {saved && (
        <div className="mb-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Profile saved. Taking you to your dashboard...
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded shadow-sm">
        <div>
          <label className="text-sm">Name</label>
          <input className={input} value={form.name} onChange={set("name")} placeholder="Your name" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-sm">Age range</label>
            <select className={input} value={form.ageRange} onChange={set("ageRange")}>
              <option value="">Prefer not to say</option>
              <option>18-24</option>
              <option>25-30</option>
              <option>31-40</option>
              <option>41+</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Role</label>
            <select className={input} value={form.role} onChange={set("role")}>
              <option>Student</option>
              <option>Employee</option>
              <option>Freelancer</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label className="text-sm">Monthly income (₹)</label>
            <input className={input} type="number" min="0" value={form.monthlyIncome} onChange={set("monthlyIncome")} placeholder="0" />
          </div>
          <div>
            <label className="text-sm">Side income (₹)</label>
            <input className={input} type="number" min="0" value={form.sideIncome} onChange={set("sideIncome")} placeholder="0" />
          </div>
          <div>
            <label className="text-sm">Avg monthly expenses (₹)</label>
            <input className={input} type="number" min="0" value={form.avgExpenses} onChange={set("avgExpenses")} placeholder="0" />
          </div>
        </div>

        <div className="rounded bg-gray-50 px-3 py-2 text-sm text-gray-600">
          Estimated left over each month:{" "}
          <span className={monthlyLeft < 0 ? "font-semibold text-red-600" : "font-semibold text-green-600"}>
            ₹{monthlyLeft.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-sm">Current savings (₹)</label>
            <input className={input} type="number" min="0" value={form.savings} onChange={set("savings")} placeholder="0" />
          </div>
          <div>
            <label className="text-sm">Risk preference</label>
            <select className={input} value={form.riskPreference} onChange={set("riskPreference")}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm">Main priority</label>
          <select className={input} value={form.mainPriority} onChange={set("mainPriority")}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div className="flex justify-end">
          <button className="bg-primary text-white px-4 py-2 rounded">Save profile</button>
        </div>
      </form>
    </div>
  );
}
