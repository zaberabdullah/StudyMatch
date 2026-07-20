"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiErrorMessage } from "@/lib/api";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 1) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/explore");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    setLoading(true);
    setError("");
    try {
      await demoLogin();
      router.push("/explore");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-card border border-navy/10 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-navy">Log in</h1>
        <p className="mt-1 text-sm text-ink/60">Welcome back to StudyMatch.</p>

        <button
          onClick={handleDemo}
          disabled={loading}
          className="mt-6 w-full rounded-full border border-brass px-4 py-2.5 text-sm font-semibold text-brass-dark transition hover:bg-brass/10 disabled:opacity-50"
        >
          Use demo account
        </button>

        <div className="mt-3">
          <GoogleSignInButton
            onError={setError}
            onStart={() => setLoading(true)}
            onDone={() => setLoading(false)}
            onSuccess={() => router.push("/explore")}
          />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-ink/40">
          <div className="h-px flex-1 bg-navy/10" />
          or
          <div className="h-px flex-1 bg-navy/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-navy/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy/70">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-navy py-2.5 text-sm font-semibold text-paper transition hover:bg-navy-light disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          No account yet?{" "}
          <Link href="/register" className="font-medium text-teal hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
