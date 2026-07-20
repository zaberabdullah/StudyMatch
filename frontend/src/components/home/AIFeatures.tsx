"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AIFeatures() {
  const { user } = useAuth();

  function openChatWidget() {
    window.dispatchEvent(new CustomEvent("studymatch:open-chat"));
  }

  return (
    <section className="container-page py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">03 — Built-in AI</p>
      <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold text-navy">
        Two AI systems working from the same student profile
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-card border border-navy/10 bg-white p-8">
          <span className="font-mono text-xs uppercase tracking-wider text-brass">Recommendation engine</span>
          <h3 className="mt-3 font-display text-xl font-semibold text-navy">
            Context-aware matching, not keyword search
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            The engine cross-references your IELTS score, GPA, budget, and
            preferred countries against every listing&apos;s real requirements,
            then explains its reasoning in plain language. It also learns from
            what you view and save.
          </p>
          <Link
            href={user ? "/recommendations" : "/register"}
            className="mt-5 inline-block text-sm font-medium text-teal hover:underline"
          >
            Get your matches →
          </Link>
        </div>

        <div className="rounded-card border border-navy/10 bg-white p-8">
          <span className="font-mono text-xs uppercase tracking-wider text-brass">Chat assistant</span>
          <h3 className="mt-3 font-display text-xl font-semibold text-navy">
            Ask follow-ups, get app-aware answers
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            A conversational assistant embedded across StudyMatch that
            remembers your conversation, reasons about scholarships and
            requirements, and suggests what to ask next.
          </p>
          {user ? (
            <button
              onClick={openChatWidget}
              className="mt-5 inline-block text-sm font-medium text-teal hover:underline"
            >
              Try the assistant →
            </button>
          ) : (
            <Link href="/register" className="mt-5 inline-block text-sm font-medium text-teal hover:underline">
              Try the assistant →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}