"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PUBLIC_ROUTES = ["/login", "/signup"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/login");
    }

    if (!loading && user && isPublic) {
      router.replace("/");
    }
  }, [loading, user, isPublic, router]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading SpendSense...</div>;
  }

  if (isPublic) {
    return <main className="min-h-screen bg-gray-50 p-4">{children}</main>;
  }

  if (!user) {
    return <div className="min-h-screen grid place-items-center">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-4 container">{children}</main>
      </div>
    </div>
  );
}
