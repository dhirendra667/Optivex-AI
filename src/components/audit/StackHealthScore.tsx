"use client";

// ─── components/audit/StackHealthScore.tsx ─────────────────────────────────

import { scoreToLabel } from "@/lib/utils/helpers";

interface StackHealthScoreProps {
  score: number;
  efficiencyScore: number;
  coverageScore: number;
  redundancyScore: number;
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const { color } = scoreToLabel(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="6"
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />
      </svg>
      {/* Score text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-white/40">/100</span>
      </div>
    </div>
  );
}

function SubScore({ label, score }: { label: string; score: number }) {
  const { color } = scoreToLabel(score);
  // const isInverse = label === "Redundancy"; // higher redundancy = worse

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-white/50">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-28 h-1.5 rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${score}%`, background: color }}
          />
        </div>
        <span className="text-sm font-semibold w-8 text-right" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

export function StackHealthScore({
  score,
  efficiencyScore,
  coverageScore,
  redundancyScore,
}: StackHealthScoreProps) {
  const { label, color } = scoreToLabel(score);

  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-6">
        Stack Health Score
      </p>

      <div className="flex items-center gap-8 mb-6">
        <ScoreRing score={score} size={120} />
        <div>
          <div
            className="inline-block text-sm font-semibold px-2.5 py-1 rounded-lg mb-2"
            style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
          >
            {label}
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-[200px]">
            {score >= 75
              ? "Your AI stack is well-optimized with minimal redundancy."
              : score >= 50
              ? "Several optimization opportunities identified."
              : "Significant inefficiencies detected in your AI stack."}
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4 space-y-0.5">
        <SubScore label="Efficiency" score={efficiencyScore} />
        <SubScore label="Coverage" score={coverageScore} />
        <SubScore label="Redundancy" score={redundancyScore} />
      </div>
    </div>
  );
}