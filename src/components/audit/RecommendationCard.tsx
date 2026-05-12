"use client";

// ─── components/audit/RecommendationCard.tsx ───────────────────────────────

import { Recommendation } from "@/types/audit";
import { priorityConfig, formatCurrency, cn } from "@/lib/utils/helpers";

const TYPE_ICONS: Record<string, string> = {
  eliminate: "🗑️",
  downgrade: "⬇️",
  consolidate: "🔗",
  upgrade: "⬆️",
  add: "➕",
  renegotiate: "🤝",
  redistribute: "↔️",
};

const EFFORT_CONFIG = {
  low: { label: "Quick win", color: "#22C55E" },
  medium: { label: "Some effort", color: "#F59E0B" },
  high: { label: "Major project", color: "#EF4444" },
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export function RecommendationCard({ recommendation: r, index }: RecommendationCardProps) {
  const priority = priorityConfig(r.priority);
  const effort = EFFORT_CONFIG[r.effort];

  return (
    <div className="group glass-card rounded-2xl p-5 hover:border-white/10 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start gap-4">
        {/* Index + Icon */}
        <div className="flex-none flex flex-col items-center gap-1">
          <span className="text-xs text-white/20 font-mono">#{index + 1}</span>
          <span className="text-xl">{TYPE_ICONS[r.type] ?? "💡"}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-sm font-semibold text-white leading-snug">{r.title}</h4>
            <div className="flex-none flex items-center gap-2">
              {r.estimatedMonthlySavings > 0 && (
                <span className="text-sm font-bold text-teal-400">
                  -{formatCurrency(r.estimatedMonthlySavings)}/mo
                </span>
              )}
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-md flex-none"
                style={{
                  color: priority.color,
                  background: `${priority.color}15`,
                  border: `1px solid ${priority.color}25`,
                }}
              >
                {priority.label}
              </span>
            </div>
          </div>

          <p className="text-xs text-white/50 leading-relaxed mb-3">{r.description}</p>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Impact */}
            <span className="text-xs text-white/40 bg-white/3 border border-white/6 px-2 py-1 rounded-lg">
              💡 {r.impact}
            </span>

            {/* Effort */}
            <span
              className="text-xs px-2 py-1 rounded-lg"
              style={{ color: effort.color, background: `${effort.color}10` }}
            >
              {effort.label}
            </span>

            {/* Action button */}
            <button className="text-xs text-white/40 hover:text-white/70 transition-colors ml-auto underline underline-offset-2">
              {r.action.label} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}