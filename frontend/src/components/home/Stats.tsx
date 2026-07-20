const stats = [
  { value: "480+", label: "Universities tracked across 22 countries" },
  { value: "92%", label: "Avg. AI match confidence on saved shortlists" },
  { value: "3.2×", label: "Faster shortlisting vs. manual research" },
  { value: "$0", label: "Cost to get matched and browse listings" },
];

export default function Stats() {
  return (
    <section className="bg-navy py-16 text-paper">
      <div className="container-page grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-l border-paper/15 pl-4">
            <p className="font-mono text-3xl font-semibold text-brass">{s.value}</p>
            <p className="mt-1 text-xs leading-snug text-paper/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
