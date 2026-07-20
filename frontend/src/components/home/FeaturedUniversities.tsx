"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { University } from "@/types";
import UniversityCard, { UniversityCardSkeleton } from "@/components/UniversityCard";

export default function FeaturedUniversities() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["universities", "featured"],
    queryFn: async () => {
      const res = await api.get("/universities", {
        params: { sortBy: "ranking", order: "asc", limit: 4 },
      });
      return res.data.items as University[];
    },
  });

  return (
    <section className="container-page py-20">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">01 — Top matches</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-navy">
            Highest-ranked universities on the network
          </h2>
        </div>
        <Link href="/explore" className="hidden text-sm font-medium text-teal hover:underline md:block">
          View all →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <UniversityCardSkeleton key={i} />)}
        {isError && (
          <p className="col-span-4 text-sm text-ink/60">
            Couldn&apos;t load universities right now. Make sure the backend API is running.
          </p>
        )}
        {data?.map((uni) => (
          <UniversityCard key={uni._id} uni={uni} />
        ))}
      </div>
    </section>
  );
}
