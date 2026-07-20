"use client";

import { useState, FormEvent } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-teal py-16 text-paper">
      <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">06 — Stay updated</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Get new scholarship deadlines in your inbox
          </h2>
          <p className="mt-1 text-sm text-paper/75">
            One email a month. No spam, unsubscribe anytime.
          </p>
        </div>

        {submitted ? (
          <p className="rounded-full bg-paper/15 px-5 py-3 text-sm font-medium">
            You&apos;re subscribed — thanks for joining.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-paper/30 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/50 focus:border-paper"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brass px-5 py-3 text-sm font-semibold text-navy hover:bg-brass-light"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
