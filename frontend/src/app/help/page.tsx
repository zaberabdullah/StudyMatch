import Link from "next/link";

const topics = [
  {
    title: "Getting matched",
    body: "Go to Get Matched, enter your IELTS, GPA, and budget, and the AI will return a ranked shortlist with reasoning for each pick.",
  },
  {
    title: "Adding a listing",
    body: "Log in, then visit Add University from the nav. Required fields are marked and validated before submission.",
  },
  {
    title: "Managing your listings",
    body: "Manage Listings shows every university you've added, with quick View and Delete actions.",
  },
  {
    title: "Using the chat assistant",
    body: "Click the AI button in the bottom-right corner on any page. It remembers your conversation and suggests follow-up questions.",
  },
];

export default function HelpPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Help &amp; support</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy">How can we help?</h1>

      <div className="mt-10 space-y-6">
        {topics.map((t) => (
          <div key={t.title} className="rounded-card border border-navy/10 bg-white p-5">
            <h2 className="font-display text-base font-semibold text-navy">{t.title}</h2>
            <p className="mt-2 text-sm text-ink/65">{t.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink/60">
        Still stuck? <Link href="/contact" className="text-teal underline">Contact the team</Link>.
      </p>
    </div>
  );
}
