"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is StudyMatch free to use?",
    a: "Yes. Browsing universities, creating an account, and getting AI-matched recommendations are free. Some universities may charge their own application fees.",
  },
  {
    q: "How does the AI decide what fits me?",
    a: "It checks your IELTS/GPA against each program's stated minimums, compares tuition to your budget, and weighs your preferred countries and field of interest — then explains its reasoning for every suggestion.",
  },
  {
    q: "Can I add or manage my own listings?",
    a: "Yes. Once logged in, you can add a university listing from /items/add and manage everything you've added from /items/manage.",
  },
  {
    q: "Does the chat assistant remember earlier questions?",
    a: "Within a session, yes — it keeps conversation history so you can ask follow-ups like \"what about scholarships there?\" without repeating context.",
  },
  {
    q: "Which countries are covered?",
    a: "The network currently spans 22 countries including Canada, Germany, Australia, Singapore, the UK, France, and the US, with more added regularly.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="container-page py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">05 — FAQ</p>
      <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold text-navy">
        Common questions
      </h2>

      <div className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-display text-base font-medium text-navy">{f.q}</span>
                <span className="font-mono text-lg text-brass">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <p className="pb-5 pr-8 text-sm leading-relaxed text-ink/65">{f.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
