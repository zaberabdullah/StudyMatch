"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageUploadField from "@/components/ImageUploadField";
import { api, apiErrorMessage } from "@/lib/api";

function AddItemForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    shortDescription: "",
    fullDescription: "",
    imageUrl: "",
    tuitionUSD: "",
    applicationDeadline: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) return setError("Enter a university name.");
    if (form.country.trim().length < 2) return setError("Enter a country.");
    if (form.city.trim().length < 2) return setError("Enter a city.");
    if (form.shortDescription.trim().length < 10)
      return setError("Short description needs at least 10 characters.");
    if (form.fullDescription.trim().length < 20)
      return setError("Full description needs at least 20 characters.");
    if (!form.tuitionUSD || Number(form.tuitionUSD) <= 0)
      return setError("Enter a valid tuition amount.");
    if (!form.applicationDeadline) return setError("Pick an application deadline.");

    setSubmitting(true);
    try {
      await api.post("/universities", {
        ...form,
        tuitionUSD: Number(form.tuitionUSD),
        courses: [],
        intakeSeasons: ["Fall"],
        tags: [],
      });
      router.push("/items/manage");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page max-w-2xl py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Protected</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy">Add a university</h1>
      <p className="mt-2 text-sm text-ink/60">
        This listing will appear immediately in Explore and on your Manage Listings page.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-card border border-navy/10 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="University name">
            <input value={form.name} onChange={(e) => update("name", e.target.value)} className="input" />
          </Field>
          <Field label="Country">
            <input value={form.country} onChange={(e) => update("country", e.target.value)} className="input" />
          </Field>
          <Field label="City">
            <input value={form.city} onChange={(e) => update("city", e.target.value)} className="input" />
          </Field>
          <Field label="Tuition (USD/year)">
            <input
              type="number"
              value={form.tuitionUSD}
              onChange={(e) => update("tuitionUSD", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <Field label="Short description (max 200 chars)">
          <input
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            maxLength={200}
            className="input"
          />
        </Field>

        <Field label="Full description">
          <textarea
            value={form.fullDescription}
            onChange={(e) => update("fullDescription", e.target.value)}
            rows={5}
            className="input"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="University image (URL or upload)">
            <ImageUploadField value={form.imageUrl} onChange={(url) => update("imageUrl", url)} />
          </Field>
          <Field label="Application deadline">
            <input
              type="date"
              value={form.applicationDeadline}
              onChange={(e) => update("applicationDeadline", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-paper hover:bg-navy-light disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit listing"}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgba(27, 42, 74, 0.15);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-navy/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function AddItemPage() {
  return (
    <ProtectedRoute>
      <AddItemForm />
    </ProtectedRoute>
  );
}
