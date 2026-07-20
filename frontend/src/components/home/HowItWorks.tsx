const steps = [
  {
    n: "01",
    title: "Log your profile",
    body: "IELTS, GPA, budget, and the countries you're actually considering — takes under two minutes.",
  },
  {
    n: "02",
    title: "AI reasons over real listings",
    body: "The matching engine checks each university's requirements and tuition against your profile and explains its reasoning.",
  },
  {
    n: "03",
    title: "Refine with the assistant",
    body: "Ask follow-ups in plain language — \"cheaper options in Canada?\" — and get an updated shortlist.",
  },
  {
    n: "04",
    title: "Apply with confidence",
    body: "Save your shortlist, track deadlines, and move forward on programs you already know you qualify for.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">02 — Process</p>
        <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold text-navy">
          Four steps from unsure to shortlisted
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <p className="font-mono text-4xl font-semibold text-navy/10">{s.n}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.body}</p>
              {i < steps.length - 1 && (
                <div className="mt-6 hidden h-px w-full bg-navy/10 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
