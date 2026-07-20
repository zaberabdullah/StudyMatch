"use client";

import Link from "next/link";
import { useState } from "react";

const scenarios = [
  { label: "Budget-conscious", detail: "Under $10k tuition · Germany, France" },
  { label: "Top-ranked", detail: "Global top 50 · UK, Singapore, Canada" },
  { label: "Scholarship-first", detail: "Full or partial funding available" },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-navy text-paper">
      <div className="absolute inset-0 bg-stamp-lines opacity-30" />
      <div className="container-page relative grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-0">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
            AI-matched · Not a directory
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Your shortlist of universities abroad, matched to your actual scores.
          </h1>
          <p className="mt-5 max-w-md text-paper/70">
            Tell StudyMatch your IELTS, GPA, and budget once. The AI reasons
            over real program data to explain exactly why a university fits —
            or doesn&apos;t.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-brass px-6 py-3 text-sm font-semibold text-navy transition hover:bg-brass-light"
            >
              Get matched free
            </Link>
            <Link
              href="/explore"
              className="rounded-full border border-paper/30 px-6 py-3 text-sm font-medium text-paper transition hover:border-paper"
            >
              Browse universities
            </Link>
          </div>
        </div>

        {/* Interactive boarding-pass style element */}
        <div className="relative">
          <div className="perforated-edge rounded-card border border-paper/15 bg-navy-light/60 p-6 pl-8 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-brass">
              <span>Match preview</span>
              <span>Boarding: Fall intake</span>
            </div>
            <div className="mt-4 flex gap-2">
              {scenarios.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setActive(i)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active === i
                      ? "bg-brass text-navy"
                      : "bg-paper/10 text-paper/70 hover:bg-paper/20"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="mt-6 border-t border-dashed border-paper/20 pt-6">
              <p className="font-display text-2xl font-semibold">{scenarios[active].label} match</p>
              <p className="mt-1 font-mono text-sm text-paper/60">{scenarios[active].detail}</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="font-mono text-4xl font-semibold text-brass">92%</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-paper/50">
                    Avg. match confidence
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-paper/70">SEAT</p>
                  <p className="font-mono text-lg">6 picks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
