"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Hero() {
  const text = "Optimize Your AI Stack"
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur">
          <Sparkles className="h-4 w-4 text-violet-400" />
          AI Stack Optimization Platform
        </div>

        {/* Heading */}  
        <h1 className="max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
        {text.split("").map((char, index) => (
            <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.12,
                duration: 0.5,
            }}
            className={
                char === "A" || index >= 14
                ? "bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
                : ""
            }
            >
            {char}
            </motion.span>
        ))}
        </h1>
        {/* Subheading */}
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60 md:text-xl">
          Detect overlapping AI tools, reduce unnecessary subscriptions,
          and streamline your team’s workflow with intelligent spend analysis.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="group rounded-2xl bg-white px-8 text-black hover:bg-white/90"
          >
            Run Free Audit
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-2xl border-white/20 bg-white/5 px-8 text-white hover:bg-white hover:text-black"
          >
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-3xl font-bold">$12k+</h3>
            <p className="mt-2 text-sm text-white/60">
              AI spending analyzed
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-3xl font-bold">38%</h3>
            <p className="mt-2 text-sm text-white/60">
              Average stack overlap detected
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-3xl font-bold">72/100</h3>
            <p className="mt-2 text-sm text-white/60">
              Typical AI stack health score
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}