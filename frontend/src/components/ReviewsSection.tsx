"use client";

import { useState, FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api, apiErrorMessage } from "@/lib/api";
import { Review } from "@/types";

function Stars({ value }: { value: number }) {
  return (
    <span className="font-mono text-brass">
      {"★".repeat(Math.round(value))}
      <span className="text-navy/15">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export default function ReviewsSection({
  universityId,
  avgRating,
  reviewCount,
}: {
  universityId: string;
  avgRating: number;
  reviewCount: number;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", universityId],
    queryFn: async () => {
      const res = await api.get(`/universities/${universityId}/reviews`);
      return res.data.reviews as Review[];
    },
  });

  const myReview = data?.find((r) => user && r.user === user.id);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (comment.trim().length < 5) {
      setError("Write at least 5 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/universities/${universityId}/reviews`, { rating, comment });
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["reviews", universityId] });
      queryClient.invalidateQueries({ queryKey: ["university", universityId] });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reviewId: string) {
    setError("");
    try {
      await api.delete(`/universities/${universityId}/reviews/${reviewId}`);
      queryClient.invalidateQueries({ queryKey: ["reviews", universityId] });
      queryClient.invalidateQueries({ queryKey: ["university", universityId] });
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-navy">Reviews &amp; ratings</h2>
      <div className="mt-2 flex items-center gap-3">
        <span className="font-mono text-3xl font-semibold text-brass">{avgRating.toFixed(1)}</span>
        <span className="text-sm text-ink/60">based on {reviewCount} student review{reviewCount === 1 ? "" : "s"}</span>
      </div>

      {isLoading && <p className="mt-3 text-sm text-ink/50">Loading reviews…</p>}

      {!isLoading && data?.length === 0 && (
        <p className="mt-3 text-sm text-ink/50">No reviews yet — be the first to share your experience.</p>
      )}

      <div className="mt-4 space-y-4">
        {data?.map((r) => (
          <div key={r._id} className="rounded-lg border border-navy/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-navy">{r.userName}</span>
                <Stars value={r.rating} />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-ink/40">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
                {user && r.user === user.id && (
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{r.comment}</p>
          </div>
        ))}
      </div>

      {user && !myReview && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-card border border-navy/10 bg-white p-5">
          <p className="text-xs font-medium text-navy/70">Leave a review</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                aria-label={`${n} star`}
                className={`font-mono text-xl ${n <= rating ? "text-brass" : "text-navy/15"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience with this university…"
            className="mt-3 w-full rounded-lg border border-navy/15 px-3 py-2 text-sm"
          />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-full bg-navy px-5 py-2 text-sm font-medium text-paper hover:bg-navy-light disabled:opacity-50"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
        </form>
      )}

      {!user && (
        <p className="mt-4 text-sm text-ink/50">
          <a href="/login" className="text-teal underline">Log in</a> to leave a review.
        </p>
      )}
    </section>
  );
}
