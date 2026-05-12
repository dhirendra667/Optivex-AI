"use client";

// ─── components/audit/ToolCard.tsx ─────────────────────────────────────────

import { ToolAnalysis } from "@/types/audit";
import { verdictConfig, formatCurrency, cn } from "@/lib/utils/helpers";
import { TOOL_COLORS } from "@/constants/tools";

interface ToolCardProps {
  analysis: ToolAnalysis;
}

function UtilizationBar({ value }: { value: number }) {
  const color =
    value >= 70 ? "#22C55E" : value >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs text-white/40 w-8 text-right">{value}%</span>
    </div>
  );
}

export function ToolCard({ analysis }: ToolCardProps) {
  const verdict = verdictConfig(analysis.verdict);
  const toolColor =
    TOOL_COLORS[analysis.toolName.toLowerCase().replace(/\s+/g, "-")] ??
    "#6B7280";

  return (
    <div className="group glass-card rounded-2xl p-5 hover:border-white/10 transition-all duration-200 hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Color dot */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
            style={{ background: `${toolColor}25`, border: `1px solid ${toolColor}40` }}
          >
            {analysis.toolName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{analysis.toolName}</p>
            <p className="text-xs text-white/40">
              {formatCurrency(analysis.monthlySpend)}/mo
            </p>
          </div>
        </div>

        {/* Verdict badge */}
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={{
            color: verdict.color,
            background: verdict.bg,
            border: `1px solid ${verdict.color}30`,
          }}
        >
          {verdict.label}
        </span>
      </div>

      {/* Scores */}
      <div className="space-y-2.5 mb-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-white/30">Utilization</span>
          </div>
          <UtilizationBar value={analysis.utilization} />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-white/30">ROI Score</span>
          </div>
          <UtilizationBar value={analysis.roiScore} />
        </div>
      </div>

      {/* Verdict reason */}
      <p className="text-xs text-white/40 leading-relaxed border-t border-white/5 pt-3">
        {analysis.verdictReason}
      </p>

      {/* Redundancy flags */}
      {analysis.redundancyFlags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {analysis.redundancyFlags.slice(0, 2).map((flag, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/15"
            >
              ⚠ Overlap detected
            </span>
          ))}
        </div>
      )}
    </div>
  );
}