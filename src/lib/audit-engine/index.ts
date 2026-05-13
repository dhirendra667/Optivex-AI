// ─── lib/audit-engine/index.ts ─────────────────────────────────────────────
// Main orchestrator: runs the full audit pipeline

import { AuditFormInput, AuditResult, SpendBreakdownItem, ToolAnalysis } from "@/types/audit";
import { buildCapabilityMap, buildOverlapMatrix, detectRedundancies } from "./overlap";
import { computeStackHealthScore, scoreToolAnalysis } from "./scoring";
import { generateRecommendations } from "./recommendations";
import { TOOL_COLORS } from "@/constants/tools";
import { nanoid } from "@/lib/utils/helpers";

// const VERDICT_COLORS: Record<ToolAnalysis["verdict"], string> = {
//   keep: "#22C55E",
//   optimize: "#F59E0B",
//   replace: "#F97316",
//   eliminate: "#EF4444",
// };

export function runAuditEngine(input: AuditFormInput): Omit<AuditResult, "executiveSummary" | "strategicNarrative"> {
  const { tools } = input;

  // ── Step 1: Build capability map ─────────────────────────────────────────
  const capMap = buildCapabilityMap(tools);

  // ── Step 2: Build overlap matrix ─────────────────────────────────────────
  const overlapMatrix = buildOverlapMatrix(tools, capMap);

  // ── Step 3: Detect redundancies ───────────────────────────────────────────
  const redundancies = detectRedundancies(tools, overlapMatrix);

  // ── Step 4: Score each tool ───────────────────────────────────────────────
  const redundancyFlagMap = new Map<string, string[]>();
  for (const r of redundancies) {
    for (const toolName of r.tools) {
      const existing = redundancyFlagMap.get(toolName) ?? [];
      redundancyFlagMap.set(toolName, [...existing, r.description.slice(0, 60)]);
    }
  }

  const toolAnalyses: ToolAnalysis[] = tools.map((tool) => {
    const flags = redundancyFlagMap.get(tool.name) ?? [];
    const scores = scoreToolAnalysis(
      { name: tool.name, monthlySpend: tool.monthlySpend, usageLevel: tool.usageLevel, seats: tool.seats },
      flags
    );
    return {
      toolName: tool.name,
      monthlySpend: tool.monthlySpend,
      redundancyFlags: flags,
      ...scores,
    };
  });

  // ── Step 5: Health scores ─────────────────────────────────────────────────
  const { stackHealthScore, efficiencyScore, coverageScore, redundancyScore } =
    computeStackHealthScore({ redundancies, toolAnalyses, input });

  // ── Step 6: Financials ────────────────────────────────────────────────────
  const currentMonthlySpend = tools.reduce((s, t) => s + t.monthlySpend, 0);
  const monthlyPotentialSavings = redundancies.reduce(
    (s, r) => s + r.estimatedMonthlySavings,
    0
  );
  const optimizedMonthlySpend = Math.max(0, currentMonthlySpend - monthlyPotentialSavings);
  const annualPotentialSavings = monthlyPotentialSavings * 12;
  const savingsPercentage =
    currentMonthlySpend > 0
      ? Math.round((monthlyPotentialSavings / currentMonthlySpend) * 100)
      : 0;

  // ── Step 7: Recommendations ───────────────────────────────────────────────
  const recommendations = generateRecommendations({
    redundancies,
    toolAnalyses,
    input,
  });

  // ── Step 8: Chart data ────────────────────────────────────────────────────
  const spendBreakdown: SpendBreakdownItem[] = tools.map((tool) => {
    const analysis = toolAnalyses.find((a) => a.toolName === tool.name)!;
    return {
      name: tool.name,
      value: tool.monthlySpend,
      percentage: currentMonthlySpend > 0
        ? Math.round((tool.monthlySpend / currentMonthlySpend) * 100)
        : 0,
      color: TOOL_COLORS[tool.name.toLowerCase().replace(/\s+/g, "-")] ?? "#6B7280",
      verdict: analysis.verdict,
    };
  });

  return {
    id: nanoid(),
    createdAt: new Date().toISOString(),
    input,
    stackHealthScore,
    efficiencyScore,
    coverageScore,
    redundancyScore,
    currentMonthlySpend,
    optimizedMonthlySpend,
    monthlyPotentialSavings,
    annualPotentialSavings,
    savingsPercentage,
    redundancies,
    recommendations,
    toolAnalyses,
    capabilityGaps: [], // populated by AI in summary step
    // executiveSummary: "",
    // strategicNarrative: "",
    spendBreakdown,
    overlapMatrix,
  };
}
