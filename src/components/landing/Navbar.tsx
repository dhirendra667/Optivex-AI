"use client";

// ─── components/landing/Navbar.tsx ─────────────────────────────────────────

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react"
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-ox-surface/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16  flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Sparkles className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">
                Optivex <span className="text-white/40 font-normal">AI</span>
              </span>
            </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {["Features", "How it Works", "Pricing", "FAQ"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="#audit"
            className="hidden md:inline-flex items-center text-sm text-white/60 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="#audit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Start Free Audit
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}