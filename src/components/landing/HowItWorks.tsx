// ─── components/landing/HowItWorks.tsx ─────────────────────────────────────

const STEPS = [
  {
    number: "01",
    title: "Input your AI stack",
    description:
      "List your AI tools, plans, and monthly costs — either via our structured form or a natural conversation with our AI consultant.",
    detail: "Takes ~2 minutes",
  },
  {
    number: "02",
    title: "Optivex analyzes overlap",
    description:
      "Our engine maps capabilities across all your tools, scores utilization, detects redundancy patterns, and identifies cost inefficiencies.",
    detail: "Under 10 seconds",
  },
  {
    number: "03",
    title: "Optivex writes your strategy",
    description:
      "An AI-generated strategic report tailored to your team size, industry, and goals — not a generic list of tips.",
    detail: "Personalized analysis",
  },
  {
    number: "04",
    title: "Share and implement",
    description:
      "Download your audit, share it via link, or export it to your team. Every recommendation has a clear action step.",
    detail: "Shareable URL",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-4">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            From stack to strategy in minutes.
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent hidden md:block" />

          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="group flex gap-6 md:gap-10 items-start"
              >
                {/* Step number */}
                <div className="flex-none relative">
                  <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center border border-white/6 group-hover:border-white/12 transition-all duration-300">
                    <span className="text-sm font-mono font-bold gradient-text">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-3.5 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <span className="text-xs text-white/30 bg-white/4 border border-white/6 px-2 py-0.5 rounded-full">
                      {step.detail}
                    </span>
                  </div>
                  <p className="text-white/50 leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
