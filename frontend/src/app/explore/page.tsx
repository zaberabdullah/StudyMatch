"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { University, Pagination } from "@/types";
import UniversityCard, { UniversityCardSkeleton } from "@/components/UniversityCard";

const COUNTRIES = ["Canada", "Germany", "Australia", "United Kingdom", "Singapore", "France", "United States"];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [maxTuition, setMaxTuition] = useState("");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [sortBy, setSortBy] = useState("ranking");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["universities", { search, country, maxTuition, scholarshipOnly, sortBy, order, page }],
    queryFn: async () => {
      const res = await api.get("/universities", {
        params: {
          search: search || undefined,
          country: country || undefined,
          maxTuition: maxTuition || undefined,
          scholarshipAvailable: scholarshipOnly || undefined,
          sortBy,
          order,
          page,
          limit: 8,
        },
      });
      return res.data as { items: University[]; pagination: Pagination };
    },
  });

  function resetToFirstPage() {
    setPage(1);
  }

  return (
    <div className="container-page py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Explore</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy">
        Search {data?.pagination.total ?? "480+"} universities
      </h1>

      {/* Filters */}
      <div className="mt-8 grid gap-3 rounded-card border border-navy/10 bg-white p-5 md:grid-cols-5">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetToFirstPage();
          }}
          placeholder="Search by name, city, tag..."
          className="rounded-lg border border-navy/15 px-3 py-2 text-sm md:col-span-2"
        />
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            resetToFirstPage();
          }}
          className="rounded-lg border border-navy/15 px-3 py-2 text-sm"
        >
          <option value="">Any country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          value={maxTuition}
          onChange={(e) => {
            setMaxTuition(e.target.value);
            resetToFirstPage();
          }}
          placeholder="Max tuition (USD)"
          className="rounded-lg border border-navy/15 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 rounded-lg border border-navy/15 px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={scholarshipOnly}
            onChange={(e) => {
              setScholarshipOnly(e.target.checked);
              resetToFirstPage();
            }}
          />
          Scholarship only
        </label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-navy/15 px-3 py-2 text-sm"
        >
          <option value="ranking">Sort: Ranking</option>
          <option value="tuitionUSD">Sort: Tuition</option>
          <option value="rating">Sort: Rating</option>
          <option value="applicationDeadline">Sort: Deadline</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="rounded-lg border border-navy/15 px-3 py-2 text-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Results */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <UniversityCardSkeleton key={i} />)}
        {isError && (
          <p className="col-span-4 text-sm text-ink/60">
            Couldn&apos;t load results. Make sure the backend API is running and try again.
          </p>
        )}
        {data?.items.length === 0 && (
          <p className="col-span-4 text-sm text-ink/60">
            No universities match those filters yet. Try widening your search.
          </p>
        )}
        {data?.items.map((uni) => (
          <UniversityCard key={uni._id} uni={uni} />
        ))}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-navy/20 px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono text-sm text-navy/70">
            Page {data.pagination.page} / {data.pagination.totalPages}
          </span>
          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-navy/20 px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
