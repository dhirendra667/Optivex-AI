"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Sparkles className="h-5 w-5 text-violet-400" />
          </div>

          <span className="text-lg font-semibold tracking-tight text-white">
            Optivex AI
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-white/60 transition hover:text-white"
          >
            How It Works
          </a>

          <a
            href="#dashboard"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Dashboard
          </a>

          <a
            href="#faq"
            className="text-sm text-white/60 transition hover:text-white"
          >
            FAQ
          </a>
        </div>

        {/* CTA */}
        <Button className="rounded-xl bg-white text-black hover:bg-white/90">
          Run Audit
        </Button>
      </nav>
    </header>
  )
}