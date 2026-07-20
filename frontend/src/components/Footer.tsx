import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-paper/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-paper">
            Study<span className="text-brass">Match</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
            AI-matched universities abroad — built for students who want a
            shortlist based on their actual scores and budget, not guesswork.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-brass">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/explore" className="hover:text-paper">Browse universities</Link></li>
            <li><Link href="/about" className="hover:text-paper">About StudyMatch</Link></li>
            <li><Link href="/contact" className="hover:text-paper">Contact us</Link></li>
            <li><Link href="/help" className="hover:text-paper">Help &amp; support</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-brass">Account</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/login" className="hover:text-paper">Log in</Link></li>
            <li><Link href="/register" className="hover:text-paper">Create account</Link></li>
            <li><Link href="/items/manage" className="hover:text-paper">Manage listings</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-brass">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-paper/70">
            <li>hello@studymatch.ai</li>
            <li>+880 1XXX-XXXXXX</li>
            <li>Khulna, Bangladesh</li>
          </ul>
          <div className="mt-4 flex gap-3 text-sm">
            <a href="https://facebook.com" className="hover:text-brass" aria-label="Facebook">FB</a>
            <a href="https://linkedin.com" className="hover:text-brass" aria-label="LinkedIn">IN</a>
            <a href="https://instagram.com" className="hover:text-brass" aria-label="Instagram">IG</a>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10 py-5">
        <p className="container-page text-center font-mono text-xs text-paper/40">
          © {new Date().getFullYear()} StudyMatch. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
