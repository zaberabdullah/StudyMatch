"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { University } from "@/types";
import UniversityCard from "@/components/UniversityCard";
import ReviewsSection from "@/components/ReviewsSection";

export default function UniversityDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["university", id],
    queryFn: async () => {
      const res = await api.get(`/universities/${id}`);
      return res.data as { university: University; related: University[] };
    },
  });

  if (isLoading) {
    return <div className="container-page py-16 text-sm text-ink/60">Loading listing…</div>;
  }
  if (isError || !data) {
    return (
      <div className="container-page py-16 text-sm text-ink/60">
        Couldn&apos;t find that listing. <Link href="/explore" className="text-teal underline">Back to explore</Link>
      </div>
    );
  }

  const { university: uni, related } = data;
  const images = uni.gallery.length ? uni.gallery : [uni.imageUrl];

  return (
    <div className="container-page py-12">
      <Link href="/explore" className="text-xs font-mono text-teal hover:underline">
        ← Back to explore
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-5">
        {/* Media */}
        <div className="lg:col-span-3">
          <div className="relative h-80 w-full overflow-hidden rounded-card sm:h-96">
            <Image src={images[activeImage]} alt={uni.name} fill className="object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-24 overflow-hidden rounded-lg border-2 ${
                    activeImage === i ? "border-brass" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-navy">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{uni.fullDescription}</p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-navy">Key information</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["Min. IELTS", uni.minIELTS.toFixed(1)],
                ["Min. GPA", uni.minGPA.toFixed(1)],
                ["Tuition/yr", `$${uni.tuitionUSD.toLocaleString()}`],
                ["Living cost/yr", `$${uni.livingCostUSD.toLocaleString()}`],
                ["Ranking", `#${uni.ranking}`],
                ["Deadline", new Date(uni.applicationDeadline).toLocaleDateString()],
              ].map(([label, val]) => (
                <div key={label} className="rounded-lg border border-navy/10 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-teal">{label}</p>
                  <p className="mt-1 font-display text-base font-semibold text-navy">{val}</p>
                </div>
              ))}
            </dl>
          </section>

          <ReviewsSection universityId={uni._id} avgRating={uni.rating} reviewCount={uni.reviewCount} />
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-2">
          <div className="rounded-card border border-navy/10 bg-white p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-teal">{uni.city}, {uni.country}</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-navy">{uni.name}</h1>
            <p className="mt-3 text-sm text-ink/70">{uni.shortDescription}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {uni.courses.map((c) => (
                <span key={c} className="rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
                  {c}
                </span>
              ))}
            </div>

            {uni.scholarshipAvailable && (
              <p className="mt-4 rounded-lg bg-brass/15 px-3 py-2 text-xs font-medium text-brass-dark">
                Scholarships available for eligible international students
              </p>
            )}

            <a
              href={`mailto:admissions@studymatch.ai?subject=Interest in ${encodeURIComponent(uni.name)}`}
              className="mt-6 block rounded-full bg-navy py-3 text-center text-sm font-semibold text-paper hover:bg-navy-light"
            >
              Start application inquiry
            </a>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-navy">Related universities in {uni.country}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <UniversityCard key={r._id} uni={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
