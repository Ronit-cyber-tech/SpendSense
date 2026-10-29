"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthProvider";
import { useFinance } from "../context/FinanceProvider";

export const Topbar: React.FC<{ title?: string }> = ({ title }) => {
  const { user } = useAuth();
  const { persistenceStatus, retryPersistence } = useFinance();
  const statusLabel = {
    idle: "",
    loading: "Loading data",
    saving: "Saving",
    saved: "Saved",
    "save-failed": "Save failed",
    "load-failed": "Load failed",
  }[persistenceStatus];
  const canRetry = persistenceStatus === "save-failed" || persistenceStatus === "load-failed";

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="md:hidden text-xl font-bold text-primary">SpendSense</div>
        <h1 className="text-lg font-semibold">{title ?? "Dashboard"}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500" aria-live="polite">
          <span>{statusLabel}</span>
          {canRetry && (
            <button
              type="button"
              onClick={retryPersistence}
              className="text-primary hover:underline"
            >
              Retry
            </button>
          )}
        </div>
        <span className="hidden sm:block text-sm text-gray-500">{user?.email}</span>
        <Link href="/profile" className="text-sm px-3 py-1 rounded border hover:bg-gray-50">
          Profile
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
