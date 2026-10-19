"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-primary">FinWise</h1>
      <h2 className="text-xl font-semibold mt-4">Log in</h2>
      <p className="text-sm text-gray-500 mt-1">Use your FinWise account to continue.</p>

      {error && <div className="mt-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}

      <form onSubmit={submit} className="space-y-4 mt-5">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white rounded px-4 py-2 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4 text-center">
        New to FinWise?{" "}
        <Link href="/signup" className="text-primary font-medium">Create an account</Link>
      </p>
    </div>
  );
}
