export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">About</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-navy">
        We built StudyMatch because shortlisting shouldn&apos;t take weeks
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-ink/70">
        Every year, hundreds of thousands of students spend weeks manually
        comparing university requirements against their own scores and
        budgets, often relying on outdated forum posts and agent
        recommendations that don&apos;t account for their actual profile.
        StudyMatch replaces that process with an AI matching engine that
        reasons over real program data — tuition, minimum IELTS and GPA,
        scholarship availability, and deadlines — and explains its logic for
        every suggestion.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-ink/70">
        We&apos;re a small team of former international students who went
        through the confusing, expensive parts of this process ourselves.
        StudyMatch is the tool we wished existed.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          ["480+", "Universities tracked"],
          ["22", "Countries covered"],
          ["2", "AI systems working together"],
        ].map(([val, label]) => (
          <div key={label} className="rounded-card border border-navy/10 p-5">
            <p className="font-mono text-2xl font-semibold text-brass">{val}</p>
            <p className="mt-1 text-xs text-ink/60">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
