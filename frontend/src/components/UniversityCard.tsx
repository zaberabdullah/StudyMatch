import Link from "next/link";
import Image from "next/image";
import { University } from "@/types";

export default function UniversityCard({ uni }: { uni: University }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-navy/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-44 w-full shrink-0">
        <Image
          src={uni.imageUrl}
          alt={uni.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {uni.scholarshipAvailable && (
          <span className="absolute left-3 top-3 rounded-full bg-brass px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-navy">
            Scholarship
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-teal">
          {uni.city}, {uni.country}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-navy">
          {uni.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink/70">{uni.shortDescription}</p>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-navy/10 pt-3 font-mono text-xs text-ink/60">
          <span>${uni.tuitionUSD.toLocaleString()}/yr</span>
          <span>★ {uni.rating.toFixed(1)}</span>
          <span>#{uni.ranking}</span>
        </div>

        <Link
          href={`/explore/${uni._id}`}
          className="mt-4 block rounded-full bg-navy py-2 text-center text-sm font-medium text-paper transition hover:bg-navy-light"
        >
          View details
        </Link>
      </div>
    </div>
  );
}

export function UniversityCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-navy/10 bg-white shadow-sm">
      <div className="skeleton h-44 w-full" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-5 w-40 rounded" />
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton mt-auto h-9 w-full rounded-full" />
      </div>
    </div>
  );
}
