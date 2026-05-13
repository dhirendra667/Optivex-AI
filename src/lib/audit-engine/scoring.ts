// ─── lib/audit-engine/scoring.ts ───────────────────────────────────────────

import { AuditFormInput, Redundancy, ToolAnalysis } from "@/types/audit";

/**
 * Stack Health Score (0–100)
 * Composite of: efficiency, coverage, lack of redundancy, ROI
 */
export function computeStackHealthScore(params: {
  redundancies: Redundancy[];
  toolAnalyses: ToolAnalysis[];
  input: AuditFormInput;
}): {
  stackHealthScore: number;
  efficiencyScore: number;
  coverageScore: number;
  redundancyScore: number;
} {
  const { redundancies, toolAnalyses, input } = params;

  // Redundancy penalty: critical = -15, high = -8, medium = -4, low = -1
  const redundancyPenalty = redundancies.reduce((acc, r) => {
    const penalties = { critical: 15, high: 8, medium: 4, low: 1 };
    return acc + penalties[r.severity];
  }, 0);

  // Raw redundancy score (lower = more redundant)
  const redundancyScore = Math.max(0, Math.min(100, 100 - redundancyPenalty));

  // Efficiency: average utilization across tools, weighted by spend
  const totalSpend = toolAnalyses.reduce((s, t) => s + t.monthlySpend, 0);
  const weightedUtilization =
    totalSpend > 0
      ? toolAnalyses.reduce(
          (acc, t) => acc + t.utilization * (t.monthlySpend / totalSpend),
          0
        )
      : 70;
  const efficiencyScore = Math.round(weightedUtilization);

  // Coverage: are the main use-cases covered without duplication?
  // Simplified: fewer tools = higher coverage score (consolidation is good)
  const toolCount = input.tools.length;
  // const teamSize = input.teamSize;
  // const toolsPerPerson = toolCount / Math.max(teamSize, 1);
  // Ideal is 2–5 tools for a team; >8 tools suggests sprawl
  const coverageScore =
    toolCount <= 3
      ? 90
      : toolCount <= 5
      ? 80
      : toolCount <= 7
      ? 70
      : toolCount <= 10
      ? 55
      : 40;

  // Stack health = weighted composite
  const stackHealthScore = Math.round(
    efficiencyScore * 0.35 +
      redundancyScore * 0.4 +
      coverageScore * 0.25
  );

  return {
    stackHealthScore: Math.max(0, Math.min(100, stackHealthScore)),
    efficiencyScore: Math.max(0, Math.min(100, efficiencyScore)),
    coverageScore: Math.max(0, Math.min(100, coverageScore)),
    redundancyScore: Math.max(0, Math.min(100, 100 - redundancyScore)), // invert for display
  };
}

/**
 * Per-tool ROI and utilization scoring
 */
export function scoreToolAnalysis(
  tool: { name: string; monthlySpend: number; usageLevel: string; seats: number },
  redundancyFlags: string[]
): Omit<ToolAnalysis, "toolName" | "monthlySpend" | "redundancyFlags"> {
  const utilizationMap: Record<string, number> = {
    daily: 90,
    weekly: 65,
    occasional: 35,
    rarely: 10,
  };

  const utilization = utilizationMap[tool.usageLevel] ?? 50;

  // ROI: high utilization + low spend = high ROI
  const spendPenalty = tool.monthlySpend > 100 ? 10 : tool.monthlySpend > 50 ? 5 : 0;
  const roiScore = Math.max(
    0,
    Math.min(100, utilization - redundancyFlags.length * 10 - spendPenalty)
  );

  // Keep score: how strongly we recommend keeping this tool
  const keepScore = Math.round((utilization * 0.6 + roiScore * 0.4) - redundancyFlags.length * 15);

  let verdict: ToolAnalysis["verdict"];
  let verdictReason: string;

  if (keepScore >= 70 && redundancyFlags.length === 0) {
    verdict = "keep";
    verdictReason = "High utilization and ROI. Core part of your stack.";
  } else if (keepScore >= 50) {
    verdict = "optimize";
    verdictReason = "Good value but usage or cost could be optimized.";
  } else if (redundancyFlags.length >= 2) {
    verdict = "replace";
    verdictReason = "Multiple overlaps detected. A consolidated tool covers this use-case.";
  } else {
    verdict = "eliminate";
    verdictReason = "Low utilization and/or high redundancy. Removing this reduces waste.";
  }

  return { utilization, roiScore, keepScore, verdict, verdictReason };
}