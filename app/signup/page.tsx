"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(name, email, password);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-2xl font-bold text-primary">FinWise</h1>
      <h2 className="text-xl font-semibold mt-4">Create account</h2>
      <p className="text-sm text-gray-500 mt-1">Create your account, then complete your finance profile.</p>

      {error && <div className="mt-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}

      <form onSubmit={submit} className="space-y-4 mt-5">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Your name"
          />
        </div>

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Repeat password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white rounded px-4 py-2 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium">Log in</Link>
      </p>
    </div>
  );
}
