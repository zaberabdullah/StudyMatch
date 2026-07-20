const countries = [
  { name: "Canada", unis: "38 universities", note: "Strong co-op & PR pathways" },
  { name: "Germany", unis: "52 universities", note: "Low or no public tuition" },
  { name: "Australia", unis: "29 universities", note: "Flexible curriculum" },
  { name: "United Kingdom", unis: "61 universities", note: "One-year master's" },
  { name: "Singapore", unis: "9 universities", note: "Tech & finance hub" },
  { name: "United States", unis: "84 universities", note: "Widest program range" },
];

export default function Countries() {
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">07 — Destinations</p>
        <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold text-navy">
          Browse by destination
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between rounded-card border border-navy/10 p-5 transition hover:border-brass"
            >
              <div>
                <p className="font-display text-base font-semibold text-navy">{c.name}</p>
                <p className="mt-0.5 text-xs text-ink/55">{c.note}</p>
              </div>
              <span className="font-mono text-xs text-teal">{c.unis}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
