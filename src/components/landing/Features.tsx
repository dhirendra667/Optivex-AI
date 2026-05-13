// ─── components/landing/Features.tsx ───────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 2v12M3 6l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Overlap Detection",
    description:
      "Our capability mapping engine identifies where tools duplicate functionality across your stack — so you stop paying twice for the same thing.",
    accent: "#3B82F6",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Usage Intelligence",
    description:
      "Understand actual utilization across your team. Tools used occasionally shouldn't carry premium pricing. We surface underused subscriptions instantly.",
    accent: "#14B8A6",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Savings Calculator",
    description:
      "Real numbers, not estimates. We map your actual subscriptions to actionable savings — monthly and annually — with specific steps to get there.",
    accent: "#F59E0B",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6 4h8M6 8h8M6 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3 2h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "AI Strategy Report",
    description:
      "Claude generates a bespoke strategic narrative for your stack — not a generic checklist. Real insights tailored to your team size, industry, and stage.",
    accent: "#8B5CF6",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Shareable Audit",
    description:
      "Every audit generates a shareable link. Send your optimization report to your team lead, CFO, or investors with a single URL.",
    accent: "#EC4899",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18 3l-6 6M18 3h-5M18 3v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 5H4a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Conversational Mode",
    description:
      "Prefer to describe your stack in plain English? Our AI consultant extracts tools, costs, and usage from a simple conversation — no forms required.",
    accent: "#06B6D4",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-4">
            Platform capabilities
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Intelligence, not a calculator.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            Optivex doesn&apos;t just add up your subscriptions. It understands what
            each tool does, how your team uses it, and what you actually need.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative glass-card rounded-2xl p-6 hover:border-white/12 transition-all duration-300 hover:shadow-card-hover"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Accent line */}
              <div
                className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.accent}60, transparent)` }}
              />

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                style={{
                  background: `${feature.accent}15`,
                  color: feature.accent,
                  border: `1px solid ${feature.accent}25`,
                }}
              >
                {feature.icon}
              </div>

              <h3 className="text-base font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
