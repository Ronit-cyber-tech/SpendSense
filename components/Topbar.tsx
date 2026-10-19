"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthProvider";

export const Topbar: React.FC<{ title?: string }> = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="md:hidden text-xl font-bold text-primary">FinWise</div>
        <h1 className="text-lg font-semibold">{title ?? "Dashboard"}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-500">{user?.email}</span>
        <Link href="/profile" className="text-sm px-3 py-1 rounded border hover:bg-gray-50">
          Profile
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
