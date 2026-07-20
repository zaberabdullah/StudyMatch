"use client";

import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email.includes("@") || !form.message) return;
    setSent(true);
  }

  return (
    <div className="container-page grid max-w-4xl gap-10 py-16 md:grid-cols-2">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Contact</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-navy">Talk to the team</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          Questions about a specific university, a bug report, or partnership
          ideas — we read every message.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-teal">Email</dt>
            <dd className="text-ink/70">hello@studymatch.ai</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-teal">Phone</dt>
            <dd className="text-ink/70">+880 1XXX-XXXXXX</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-teal">Office</dt>
            <dd className="text-ink/70">Khulna, Bangladesh</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-card border border-navy/10 bg-white p-6">
        {sent ? (
          <p className="text-sm text-teal">Thanks — we&apos;ll get back to you within 2 business days.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-navy/70">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-navy/70">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-navy/70">Message</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-paper hover:bg-navy-light"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
