"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "../../components/Card";
import { useFinance } from "../../context/FinanceProvider";
import { useAuth } from "../../context/AuthProvider";

export default function ProfilePage() {
  const { state } = useFinance();
  const { user, logout } = useAuth();
  const router = useRouter();
  const u = state.user;

  const handleLogout = () => {
    if (!confirm("Do you want to log out of FinWise?")) return;
    logout();
    router.push("/login");
  };

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );

  if (!user) {
    return (
      <div className="max-w-xl">
        <h2 className="text-xl font-semibold mb-3">Profile</h2>
        <Card title="You are not logged in" subtitle="Log in or create a new FinWise account">
          <div className="flex gap-2 mt-2">
            <Link href="/login" className="bg-primary text-white px-4 py-2 rounded text-sm">
              Log in
            </Link>
            <Link href="/signup" className="border px-4 py-2 rounded text-sm">
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-3">Profile</h2>

      <Card title={u?.name || user.name} subtitle={u?.role || "FinWise user"}>
        <div className="divide-y">
          {row("Email", user.email)}
          {row("Age range", u?.ageRange || "Not set")}
          {row("Monthly income", `₹${Number(u?.monthlyIncome || 0).toLocaleString("en-IN")}`)}
          {row("Side income", `₹${Number(u?.sideIncome || 0).toLocaleString("en-IN")}`)}
          {row("Avg monthly expenses", `₹${Number(u?.avgExpenses || 0).toLocaleString("en-IN")}`)}
          {row("Current savings", `₹${Number(u?.savings || 0).toLocaleString("en-IN")}`)}
          {row("Risk preference", u?.riskPreference || "Not set")}
          {row("Main priority", u?.mainPriority || "Not set")}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/onboarding" className="bg-primary text-white px-3 py-2 rounded text-sm">
            Edit profile
          </Link>
          <Link href="/settings" className="border px-3 py-2 rounded text-sm">
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="border border-red-200 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </Card>
    </div>
  );
}
