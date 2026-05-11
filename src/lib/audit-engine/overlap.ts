// ─── lib/audit-engine/overlap.ts ───────────────────────────────────────────
// Detects capability overlaps between tools in a stack

import { ToolInput } from "@/types/audit";
import { Capability } from "@/types/tool";
import { findTool } from "@/constants/tools";
import { OverlapMatrixItem, Redundancy } from "@/types/audit";
import { nanoid } from "@/lib/utils/helpers";

/**
 * Build a capability map for each tool in the stack.
 * Falls back to heuristic detection if the tool isn't in our registry.
 */
export function buildCapabilityMap(
  tools: ToolInput[]
): Map<string, Set<Capability>> {
  const map = new Map<string, Set<Capability>>();

  for (const tool of tools) {
    const known = findTool(tool.name);
    if (known) {
      map.set(tool.name, new Set(known.capabilities));
    } else {
      // Heuristic fallback based on category / primary use
      map.set(tool.name, inferCapabilities(tool));
    }
  }

  return map;
}

function inferCapabilities(tool: ToolInput): Set<Capability> {
  const caps = new Set<Capability>();
  const text = `${tool.name} ${tool.primaryUse} ${tool.category ?? ""}`.toLowerCase();

  if (/cod(e|ing)|develop|program|debug|cursor|copilot/.test(text)) {
    caps.add("code-generation");
    caps.add("code-completion");
  }
  if (/write|writ(e|ing)|content|copy|blog|email|jasper|grammarly/.test(text)) {
    caps.add("writing");
  }
  if (/summar|tldr|brief/.test(text)) caps.add("summarization");
  if (/research|search|perplexity/.test(text)) {
    caps.add("research");
    caps.add("web-search");
  }
  if (/image|art|midjourney|dall/.test(text)) caps.add("image-generation");
  if (/chat|assist|gpt|claude|gemini/.test(text)) caps.add("chat");
  if (/data|analys|sql|spread/.test(text)) caps.add("data-analysis");
  if (/doc|pdf|notion/.test(text)) caps.add("document-qa");

  // Default: every LLM-like tool can chat
  if (caps.size === 0) caps.add("chat");

  return caps;
}

/**
 * Build the overlap matrix between all tool pairs.
 */
export function buildOverlapMatrix(
  tools: ToolInput[],
  capMap: Map<string, Set<Capability>>
): OverlapMatrixItem[] {
  const matrix: OverlapMatrixItem[] = [];

  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const a = tools[i].name;
      const b = tools[j].name;
      const capsA = capMap.get(a) ?? new Set();
      const capsB = capMap.get(b) ?? new Set();

      const shared: Capability[] = [];
      for (const cap of capsA) {
        if (capsB.has(cap)) shared.push(cap);
      }

      const union = new Set([...capsA, ...capsB]);
      const overlapScore =
        union.size > 0 ? Math.round((shared.length / union.size) * 100) : 0;

      matrix.push({
        toolA: a,
        toolB: b,
        overlapScore,
        sharedCapabilities: shared,
      });
    }
  }

  return matrix.sort((a, b) => b.overlapScore - a.overlapScore);
}

/**
 * Detect redundancies from the overlap matrix.
 */
export function detectRedundancies(
  tools: ToolInput[],
  matrix: OverlapMatrixItem[]
): Redundancy[] {
  const redundancies: Redundancy[] = [];
  const toolMap = new Map(tools.map((t) => [t.name, t]));

  for (const item of matrix) {
    const { toolA, toolB, overlapScore, sharedCapabilities } = item;
    const tA = toolMap.get(toolA)!;
    const tB = toolMap.get(toolB)!;

    // Full overlap: >75% shared capabilities
    if (overlapScore >= 75) {
      const cheaper = tA.monthlySpend < tB.monthlySpend ? tA : tB;
      const expensive = cheaper === tA ? tB : tA;
      const savings = expensive.monthlySpend;

      redundancies.push({
        id: nanoid(),
        type: "full-overlap",
        severity: "critical",
        tools: [toolA, toolB],
        sharedCapabilities,
        description: `${toolA} and ${toolB} share ${overlapScore}% of capabilities, creating near-complete redundancy.`,
        suggestedAction: `Consider consolidating to ${cheaper.name}, which covers all shared capabilities at a lower cost.`,
        estimatedMonthlySavings: savings,
      });
    }
    // Partial overlap: 40-74%
    else if (overlapScore >= 40) {
      redundancies.push({
        id: nanoid(),
        type: "partial-overlap",
        severity: "high",
        tools: [toolA, toolB],
        sharedCapabilities,
        description: `${toolA} and ${toolB} overlap on ${sharedCapabilities.length} capabilities (${overlapScore}% overlap score).`,
        suggestedAction: `Review which team members need both tools. Consolidate shared use-cases to one tool.`,
        estimatedMonthlySavings: Math.round(
          Math.min(tA.monthlySpend, tB.monthlySpend) * 0.4
        ),
      });
    }
  }

  // Team-size mismatch
  for (const tool of tools) {
    const known = findTool(tool.name);
    if (!known) continue;

    // Check if per-seat pricing makes sense for seat count
    const tier = known.tiers.find((t) =>
      t.name.toLowerCase() === tool.tier.toLowerCase()
    );

    if (tier?.pricePerSeat && tool.seats > 0) {
      const effectiveCost = tier.pricePerSeat * tool.seats;
      if (tool.monthlySpend > effectiveCost * 1.3) {
        redundancies.push({
          id: nanoid(),
          type: "team-size-mismatch",
          severity: "medium",
          tools: [tool.name],
          sharedCapabilities: [],
          description: `You're paying more than the per-seat rate for ${tool.name} suggests. Verify seat count and tier.`,
          suggestedAction: `Audit active seats for ${tool.name}. Remove inactive users or negotiate a better rate.`,
          estimatedMonthlySavings: Math.round(tool.monthlySpend * 0.15),
        });
      }
    }

    // Underutilization
    if (tool.usageLevel === "rarely" || tool.usageLevel === "occasional") {
      redundancies.push({
        id: nanoid(),
        type: "underutilization",
        severity: tool.usageLevel === "rarely" ? "high" : "medium",
        tools: [tool.name],
        sharedCapabilities: [],
        description: `${tool.name} is only used ${tool.usageLevel} despite a $${tool.monthlySpend}/mo subscription.`,
        suggestedAction: `Downgrade to a free tier or cancel ${tool.name}. Switch to a pay-as-you-go option.`,
        estimatedMonthlySavings:
          tool.usageLevel === "rarely"
            ? tool.monthlySpend * 0.9
            : tool.monthlySpend * 0.5,
      });
    }
  }

  return redundancies;
}
