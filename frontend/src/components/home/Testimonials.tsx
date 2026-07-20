const quotes = [
  {
    name: "Farhana R.",
    context: "Accepted — TU Munich, MSc Robotics",
    quote:
      "I'd been staring at spreadsheets for weeks. StudyMatch narrowed 480 universities to six I actually qualified for, in one sitting.",
  },
  {
    name: "Ibrahim K.",
    context: "Accepted — University of Melbourne",
    quote:
      "The assistant caught that my IELTS was half a point short for one program and pointed me to two others with the same ranking.",
  },
  {
    name: "Priya S.",
    context: "Accepted — NUS, Data Science",
    quote:
      "What sold me was the reasoning behind each match — not just a score, but why it fit my budget and background.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">04 — Outcomes</p>
        <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold text-navy">
          Students who found their fit
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="rounded-card border border-navy/10 bg-paper p-6">
              <blockquote className="text-sm leading-relaxed text-ink/75">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 border-t border-dashed border-navy/15 pt-4">
                <p className="font-display text-sm font-semibold text-navy">{q.name}</p>
                <p className="font-mono text-xs text-teal">{q.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
