// ─── lib/audit-engine/recommendations.ts ───────────────────────────────────

import { AuditFormInput, Recommendation, Redundancy, ToolAnalysis } from "@/types/audit";
import { nanoid } from "@/lib/utils/helpers";

export function generateRecommendations(params: {
  redundancies: Redundancy[];
  toolAnalyses: ToolAnalysis[];
  input: AuditFormInput;
}): Recommendation[] {
  const { redundancies, toolAnalyses, input } = params;
  const recs: Recommendation[] = [];

  // 1. Consolidation recommendations from redundancies
  for (const r of redundancies) {
    if (r.type === "full-overlap" && r.estimatedMonthlySavings > 0) {
      recs.push({
        id: nanoid(),
        priority: "critical",
        type: "eliminate",
        title: `Eliminate redundant tool: ${r.tools[1]}`,
        description: r.description,
        impact: `Save ~$${r.estimatedMonthlySavings}/mo by removing the duplicate.`,
        effort: "low",
        estimatedMonthlySavings: r.estimatedMonthlySavings,
        tools: r.tools,
        action: { label: "View comparison" },
      });
    } else if (r.type === "partial-overlap" && r.estimatedMonthlySavings > 0) {
      recs.push({
        id: nanoid(),
        priority: "high",
        type: "consolidate",
        title: `Consolidate ${r.tools[0]} & ${r.tools[1]}`,
        description: r.description,
        impact: `Reduce overlap and save up to $${r.estimatedMonthlySavings}/mo.`,
        effort: "medium",
        estimatedMonthlySavings: r.estimatedMonthlySavings,
        tools: r.tools,
        action: { label: "Review overlap" },
      });
    } else if (r.type === "underutilization") {
      const tool = input.tools.find((t) => t.name === r.tools[0]);
      recs.push({
        id: nanoid(),
        priority: "high",
        type: "downgrade",
        title: `Downgrade or cancel ${r.tools[0]}`,
        description: r.description,
        impact: `Recover up to $${Math.round(r.estimatedMonthlySavings)}/mo.`,
        effort: "low",
        estimatedMonthlySavings: Math.round(r.estimatedMonthlySavings),
        tools: r.tools,
        action: { label: "Manage subscription" },
      });
    } else if (r.type === "team-size-mismatch") {
      recs.push({
        id: nanoid(),
        priority: "medium",
        type: "renegotiate",
        title: `Audit seats for ${r.tools[0]}`,
        description: r.description,
        impact: `Reclaim unused seats worth ~$${r.estimatedMonthlySavings}/mo.`,
        effort: "low",
        estimatedMonthlySavings: r.estimatedMonthlySavings,
        tools: r.tools,
        action: { label: "Audit seats" },
      });
    }
  }

  // 2. Upgrade recommendations for high-value tools
  for (const ta of toolAnalyses) {
    if (ta.verdict === "optimize" && ta.utilization >= 80) {
      recs.push({
        id: nanoid(),
        priority: "medium",
        type: "upgrade",
        title: `Maximize value from ${ta.toolName}`,
        description: `${ta.toolName} has ${ta.utilization}% utilization. Ensure your team has the right tier to unlock advanced features.`,
        impact: "Unlock advanced features to increase team productivity.",
        effort: "low",
        estimatedMonthlySavings: 0,
        tools: [ta.toolName],
        action: { label: "Review plan" },
      });
    }
  }

  // 3. Team-size based recommendation
  if (input.teamSize > 10 && input.tools.length > 8) {
    recs.push({
      id: nanoid(),
      priority: "medium",
      type: "consolidate",
      title: "Establish an AI governance policy",
      description: `With ${input.teamSize} team members and ${input.tools.length} tools, ungoverned AI spend tends to compound. Standardize on 3–5 core tools.`,
      impact: "Prevent AI sprawl and reduce future redundancy.",
      effort: "medium",
      estimatedMonthlySavings: 0,
      tools: [],
      action: { label: "View framework" },
    });
  }

  // 4. Budget optimization
  const totalSpend = input.tools.reduce((s, t) => s + t.monthlySpend, 0);
  if (totalSpend > input.budget * 1.2) {
    recs.push({
      id: nanoid(),
      priority: "high",
      type: "eliminate",
      title: "AI spend exceeds declared budget",
      description: `Your declared AI budget is $${input.budget}/mo but actual spending is $${totalSpend}/mo — ${Math.round((totalSpend / input.budget - 1) * 100)}% over.`,
      impact: `Reduce spend by $${Math.round(totalSpend - input.budget)}/mo to hit budget.`,
      effort: "medium",
      estimatedMonthlySavings: Math.round(totalSpend - input.budget),
      tools: [],
      action: { label: "Optimize stack" },
    });
  }

  // Sort by priority then savings
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return recs.sort(
    (a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      b.estimatedMonthlySavings - a.estimatedMonthlySavings
  );
}
