// "use client"

// // ─── components/landing/Hero.tsx ───────────────────────────────────────────

// import { useState } from "react";
// import Link from "next/link";
// // import { cn } from "@/lib/utils/helpers";
// import { ArrowRight, Sparkles } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { motion } from "framer-motion"

// export default function Hero() {
//   const text = "Optimize Your AI Stack"
//   return (
//     <section className="relative overflow-hidden bg-black text-white">
//       {/* Background Glow */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
//         <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-3xl" />
//       </div>

//       {/* Hero Content */}
//       <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
//         {/* Badge */}
//         <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
//           <Sparkles className="h-4 w-4 text-violet-400" />
//           AI Stack Optimization Platform
//         </div>

//         {/* Heading */}  
//         <h1 className="max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
//         {text.split("").map((char, index) => (
//             <motion.span
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{
//                 delay: index * 0.12,
//                 duration: 0.5,
//             }}
//             className={
//                 char === "A" || index >= 14
//                 ? "bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
//                 : ""
//             }
//             >
//             {char}
//             </motion.span>
//         ))}
//         </h1>
//         {/* Subheading */}
//         <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60 md:text-xl">
//           Detect overlapping AI tools, reduce unnecessary subscriptions,
//           and streamline your team’s workflow with intelligent spend analysis.
//         </p>

//         {/* CTA Buttons */}
//         {/* <div className="mt-10 flex flex-col gap-4 sm:flex-row">
//           <Button
//             size="lg"
//             className="group rounded-2xl bg-white px-8 text-black hover:bg-white/90"
//           >
//             Run Free Audit
//             <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//           </Button>

//           <Button
//             size="lg"
//             variant="outline"
//             className="rounded-2xl border-white/20 bg-white/5 px-8 text-white hover:bg-white hover:text-black"
//           >
//             View Demo
//           </Button>
//         </div> */}

//         {/* CTA group */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
//           <Link
//             href="#audit"
//             className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_24px_rgba(255,255,255,0.12)]"
//           >
//             Run Free Audit
//             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//               <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </Link>
//           <a
//             href="#how-it-works"
//             className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/8 text-white/70 text-sm font-medium hover:border-white/16 hover:text-white/90 transition-all"
//           >
//             See how it works
//           </a>
//         </div>

//         {/* Stats */}
//         <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
//           <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
//             <h3 className="text-3xl font-bold">$12k+</h3>
//             <p className="mt-2 text-sm text-white/60">
//               AI spending analyzed
//             </p>
//           </div>

//           <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
//             <h3 className="text-3xl font-bold">38%</h3>
//             <p className="mt-2 text-sm text-white/60">
//               Average stack overlap detected
//             </p>
//           </div>

//           <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
//             <h3 className="text-3xl font-bold">72/100</h3>
//             <p className="mt-2 text-sm text-white/60">
//               Typical AI stack health score
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }


"use client";

// ─── components/landing/Hero.tsx ───────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TOOL_PILLS = [
  { name: "ChatGPT Plus", cost: "$20/mo", status: "redundant", color: "#10A37F" },
  { name: "Cursor Pro", cost: "$20/mo", status: "essential", color: "#7C3AED" },
  { name: "Claude Pro", cost: "$20/mo", status: "redundant", color: "#D4A574" },
  { name: "Perplexity Pro", cost: "$20/mo", status: "optimize", color: "#20B2AA" },
  { name: "GitHub Copilot", cost: "$19/mo", status: "redundant", color: "#58A6FF" },
  { name: "Midjourney", cost: "$30/mo", status: "essential", color: "#FF6B6B" },
];

const STATUS_CONFIG = {
  essential: { label: "Essential", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  redundant: { label: "Redundant", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  optimize: { label: "Optimize", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
};

export default function Hero() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-ox-surface" />
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-teal-500/8 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/3 mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400" />
          </span>
          <span className="text-xs text-white/60 font-medium tracking-wide">
            AI Stack Intelligence Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
          <span className="text-white">Your team is paying for</span>
          <br />
          <span className="gradient-text">AI tools it doesn't need.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Optivex analyzes your AI subscriptions, detects redundancy across tools, 
          and generates a strategic optimization report — in under 3 minutes.
        </p>

        {/* CTA group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            href="#audit"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_24px_rgba(255,255,255,0.12)]"
          >
            Run Free Audit
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/8 text-white/70 text-sm font-medium hover:border-white/16 hover:text-white/90 transition-all"
          >
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <p className="text-xs text-white/30 mb-12">
          No account required · Free audit report · Results in &lt;3 min
        </p>

        {/* Live tool card preview */}
        <div className="relative max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400/80" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/80" />
                <div className="w-2 h-2 rounded-full bg-green-400/80" />
              </div>
              <span className="text-xs text-white/30 font-mono">optivex_audit.tsx</span>
            </div>

            {/* Tool pills */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {TOOL_PILLS.map((tool, i) => {
                const status = STATUS_CONFIG[tool.status as keyof typeof STATUS_CONFIG];
                return (
                  <div
                    key={tool.name}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-default",
                      hovered === i
                        ? "border-white/12 bg-white/5"
                        : "border-white/5 bg-white/2"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: tool.color }}
                      />
                      <span className="text-xs text-white/80 font-medium">{tool.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40">{tool.cost}</span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{ color: status.color, background: status.bg }}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary bar */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-ox-soft border border-white/5">
              <div className="text-left">
                <p className="text-xs text-white/40 mb-0.5">Monthly Waste Detected</p>
                <p className="text-lg font-bold text-white">$59/mo</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/40 mb-0.5">Annual Savings</p>
                <p className="text-lg font-bold gradient-text">$708/yr</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 mb-0.5">Stack Score</p>
                <p className="text-lg font-bold text-amber-400">62/100</p>
              </div>
            </div>
          </div>

          {/* Decorative glow under card */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-blue-500/10 blur-2xl rounded-full" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-white/20">Scroll to explore</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M4 9l4 4 4-4" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}