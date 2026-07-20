"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { api, apiErrorMessage } from "@/lib/api";
import { Recommendation } from "@/types";

const COUNTRIES = ["Canada", "Germany", "Australia", "United Kingdom", "Singapore", "France", "United States"];

function RecommendationsView() {
  const { user } = useAuth();
  const [ieltsScore, setIelts] = useState(user?.profile.ieltsScore?.toString() || "");
  const [gpa, setGpa] = useState(user?.profile.gpa?.toString() || "");
  const [budgetUSD, setBudget] = useState(user?.profile.budgetUSD?.toString() || "");
  const [countries, setCountries] = useState<string[]>(user?.profile.preferredCountries || []);
  const [fieldOfInterest, setField] = useState(user?.profile.fieldOfInterest || "");
  const [refinement, setRefinement] = useState("");

  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleCountry(c: string) {
    setCountries((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  }

  async function runMatch(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/recommendations", {
        ieltsScore: ieltsScore ? Number(ieltsScore) : undefined,
        gpa: gpa ? Number(gpa) : undefined,
        budgetUSD: budgetUSD ? Number(budgetUSD) : undefined,
        preferredCountries: countries.length ? countries : undefined,
        fieldOfInterest: fieldOfInterest || undefined,
        refinement: refinement || undefined,
      });
      setResults(res.data.recommendations);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">AI · Recommendation engine</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy">Get your AI-matched shortlist</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/60">
        The engine reasons over your profile and every listing&apos;s real requirements — refine with a
        follow-up note anytime.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Profile form */}
        <form onSubmit={runMatch} className="lg:col-span-2 space-y-4 rounded-card border border-navy/10 bg-white p-6">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-medium text-navy/70">IELTS score</span>
              <input
                type="number"
                step="0.5"
                value={ieltsScore}
                onChange={(e) => setIelts(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-navy/70">GPA (4.0 scale)</span>
              <input
                type="number"
                step="0.1"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-navy/70">Annual budget (USD)</span>
            <input
              type="number"
              value={budgetUSD}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-navy/70">Field of interest</span>
            <input
              value={fieldOfInterest}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g. Computer Science"
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
            />
          </label>

          <div>
            <span className="text-xs font-medium text-navy/70">Preferred countries</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleCountry(c)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    countries.includes(c) ? "bg-navy text-paper" : "bg-navy/5 text-navy/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-medium text-navy/70">Refine (optional)</span>
            <input
              value={refinement}
              onChange={(e) => setRefinement(e.target.value)}
              placeholder="e.g. prefer smaller cities, no IELTS requirement"
              className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
            />
          </label>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brass py-2.5 text-sm font-semibold text-navy hover:bg-brass-light disabled:opacity-50"
          >
            {loading ? "Matching…" : results ? "Refine matches" : "Find my matches"}
          </button>
        </form>

        {/* Results — boarding pass styled match cards (signature element) */}
        <div className="lg:col-span-3">
          {!results && !loading && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-card border border-dashed border-navy/20 text-sm text-ink/50">
              Fill in your profile and click &quot;Find my matches&quot;
            </div>
          )}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-28 rounded-card" />
              ))}
            </div>
          )}
          <div className="space-y-4">
            {results?.map((r) => (
              <div
                key={r.university._id}
                className="perforated-edge flex gap-4 rounded-card border border-navy/10 bg-white p-5 pl-7 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-teal">
                      {r.university.city}, {r.university.country}
                    </p>
                    <p className="font-mono text-2xl font-semibold text-brass">{r.matchScore}%</p>
                  </div>
                  <Link
                    href={`/explore/${r.university._id}`}
                    className="mt-1 block font-display text-lg font-semibold text-navy hover:underline"
                  >
                    {r.university.name}
                  </Link>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{r.reason}</p>
                  <div className="mt-3 flex gap-4 font-mono text-xs text-ink/50">
                    <span>${r.university.tuitionUSD.toLocaleString()}/yr</span>
                    <span>IELTS ≥ {r.university.minIELTS}</span>
                    <span>#{r.university.ranking} ranked</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <ProtectedRoute>
      <RecommendationsView />
    </ProtectedRoute>
  );
}
