"use client";

// ─── components/audit/ToolOverlapChart.tsx ─────────────────────────────────

import { OverlapMatrixItem } from "@/types/audit";
import { cn } from "@/lib/utils/helpers";

interface ToolOverlapChartProps {
  matrix: OverlapMatrixItem[];
}

function getOverlapColor(score: number): { bg: string; text: string } {
  if (score >= 75) return { bg: "rgba(239,68,68,0.25)", text: "#FCA5A5" };
  if (score >= 50) return { bg: "rgba(249,115,22,0.2)", text: "#FDBA74" };
  if (score >= 25) return { bg: "rgba(245,158,11,0.15)", text: "#FCD34D" };
  return { bg: "rgba(255,255,255,0.04)", text: "rgba(255,255,255,0.3)" };
}

export function ToolOverlapChart({ matrix }: ToolOverlapChartProps) {
  // Only show the top 6 overlapping pairs
  const topPairs = matrix.slice(0, 6);

  if (topPairs.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 flex items-center justify-center h-48">
        <p className="text-white/30 text-sm">No overlap data available.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">
        Tool Overlap Analysis
      </p>
      <p className="text-xs text-white/30 mb-6">
        Higher scores indicate more capability duplication between tools.
      </p>

      <div className="space-y-3">
        {topPairs.map((item) => {
          const { bg, text } = getOverlapColor(item.overlapScore);
          return (
            <div key={`${item.toolA}-${item.toolB}`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/80">
                    {item.toolA}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-white/20"
                  >
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white/80">
                    {item.toolB}
                  </span>
                </div>
                <div
                  className="text-xs font-bold px-2 py-0.5 rounded-lg"
                  style={{ background: bg, color: text }}
                >
                  {item.overlapScore}% overlap
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${item.overlapScore}%`,
                    background: `linear-gradient(90deg, ${text}60, ${text})`,
                  }}
                />
              </div>

              {/* Shared capabilities */}
              {item.sharedCapabilities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.sharedCapabilities.slice(0, 4).map((cap) => (
                    <span
                      key={cap}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/4 text-white/30 border border-white/5"
                    >
                      {cap.replace(/-/g, " ")}
                    </span>
                  ))}
                  {item.sharedCapabilities.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/4 text-white/30">
                      +{item.sharedCapabilities.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
        {[
          { label: "Low (<25%)", color: "rgba(255,255,255,0.3)" },
          { label: "Medium (25–50%)", color: "#FCD34D" },
          { label: "High (50–75%)", color: "#FDBA74" },
          { label: "Critical (75%+)", color: "#FCA5A5" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: color }}
            />
            <span className="text-[10px] text-white/30">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}