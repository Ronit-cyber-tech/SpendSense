"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/income", label: "Income" },
  { href: "/budget", label: "Budget" },
  { href: "/goals", label: "Goals" },
  { href: "/insights", label: "Insights" },
  { href: "/learn", label: "Learn" },
  { href: "/calculators/compound", label: "Calculator" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/settings", label: "Settings" }
];

export const Sidebar: React.FC = () => {
  const path = usePathname();
  return (
    <aside className="hidden md:block md:w-64 bg-white border-r h-screen p-4">
      <div className="text-2xl font-bold text-primary mb-6">SpendSense</div>
      <nav className="space-y-2">
        {nav.map((n) => {
          const active = path === n.href;
          return (
            <Link key={n.href} href={n.href} className={`block px-3 py-2 rounded ${active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 text-xs text-gray-500">
        Built for students & young earners. Data stored locally.
      </div>
    </aside>
  );
};

export default Sidebar;