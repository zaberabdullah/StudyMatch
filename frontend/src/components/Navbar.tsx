"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const loggedOutLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const loggedInLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/recommendations", label: "Get Matched" },
    { href: "/items/add", label: "Add University" },
    { href: "/items/manage", label: "Manage Listings" },
    { href: "/about", label: "About" },
  ];

  const links = user ? loggedInLinks : loggedOutLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy/10 bg-paper/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-navy">
          Study<span className="text-brass">Match</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-navy ${
                pathname === l.href ? "text-navy" : "text-navy/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="font-mono text-xs text-navy/60">{user.name}</span>
              <button
                onClick={logout}
                className="rounded-full border border-navy/20 px-4 py-1.5 text-sm font-medium text-navy transition hover:border-navy hover:bg-navy hover:text-paper"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-navy/70 hover:text-navy"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-paper transition hover:bg-navy-light"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/20 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="text-navy">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-navy/10 bg-paper md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-navy/80 hover:bg-navy/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-navy/10 pt-3">
              {user ? (
                <button
                  onClick={logout}
                  className="w-full rounded-full border border-navy/20 px-4 py-2 text-sm font-medium text-navy"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="w-1/2 rounded-full border border-navy/20 px-4 py-2 text-center text-sm font-medium text-navy"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="w-1/2 rounded-full bg-navy px-4 py-2 text-center text-sm font-medium text-paper"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
