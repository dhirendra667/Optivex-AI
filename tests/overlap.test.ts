// ─── tests/overlap.test.ts ──────────────────────────────────────────────────
// Tests for buildCapabilityMap, buildOverlapMatrix, detectRedundancies

import { describe, it, expect } from "vitest";
import {
  buildCapabilityMap,
  buildOverlapMatrix,
  detectRedundancies,
} from "@/lib/audit-engine/overlap";
import { ToolInput } from "@/types/audit";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const makeTool = (
  name: string,
  monthlySpend: number,
  usageLevel: "daily" | "weekly" | "occasional" | "rarely" = "daily",
  seats = 1,
  tier = "Pro"
): ToolInput => ({
  name,
  tier,
  seats,
  monthlySpend,
  usageLevel,
  primaryUse: "general",
  teamsThatUseIt: ["Engineering"],
});

// ── buildCapabilityMap ────────────────────────────────────────────────────────

describe("buildCapabilityMap", () => {
  it("returns a map with one entry per tool", () => {
    const tools = [makeTool("Cursor", 40), makeTool("ChatGPT", 20)];
    const map = buildCapabilityMap(tools);

    expect(map.size).toBe(2);
    expect(map.has("Cursor")).toBe(true);
    expect(map.has("ChatGPT")).toBe(true);
  });

  it("assigns capabilities to known tools from the registry", () => {
    // Cursor is a known coding tool — must have code-generation
    const tools = [makeTool("Cursor", 40)];
    const map = buildCapabilityMap(tools);
    const caps = map.get("Cursor");

    expect(caps).toBeDefined();
    expect(caps!.has("code-generation")).toBe(true);
  });

  it("falls back to heuristic inference for unknown tools", () => {
    // An unknown tool with 'coding' in primaryUse should get code capabilities
    const unknownTool: ToolInput = {
      name: "SomeFakeIDEHelper",
      tier: "Pro",
      seats: 1,
      monthlySpend: 15,
      usageLevel: "daily",
      primaryUse: "coding and code completion",
      teamsThatUseIt: ["Engineering"],
    };
    const map = buildCapabilityMap([unknownTool]);
    const caps = map.get("SomeFakeIDEHelper");

    expect(caps).toBeDefined();
    expect(caps!.size).toBeGreaterThan(0);
    expect(caps!.has("code-generation")).toBe(true);
  });

  it("assigns at least 'chat' capability to completely unknown tools", () => {
    const unknownTool: ToolInput = {
      name: "XYZRandomTool",
      tier: "Free",
      seats: 1,
      monthlySpend: 0,
      usageLevel: "rarely",
      primaryUse: "misc",
      teamsThatUseIt: [],
    };
    const map = buildCapabilityMap([unknownTool]);
    const caps = map.get("XYZRandomTool");

    expect(caps).toBeDefined();
    expect(caps!.size).toBeGreaterThan(0); // at least the 'chat' fallback
  });
});

// ── buildOverlapMatrix ────────────────────────────────────────────────────────

describe("buildOverlapMatrix", () => {
  it("returns n*(n-1)/2 pairs for n tools", () => {
    const tools = [
      makeTool("Cursor", 40),
      makeTool("GitHub Copilot", 10),
      makeTool("ChatGPT", 20),
    ];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);

    // 3 tools → 3 pairs
    expect(matrix).toHaveLength(3);
  });

  it("returns empty array for a single tool", () => {
    const tools = [makeTool("Cursor", 40)];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);

    expect(matrix).toHaveLength(0);
  });

  it("overlapScore is between 0 and 100 for all pairs", () => {
    const tools = [
      makeTool("Cursor", 40),
      makeTool("GitHub Copilot", 10),
      makeTool("ChatGPT", 20),
      makeTool("Claude", 20),
    ];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);

    for (const item of matrix) {
      expect(item.overlapScore).toBeGreaterThanOrEqual(0);
      expect(item.overlapScore).toBeLessThanOrEqual(100);
    }
  });

  it("matrix is sorted descending by overlapScore", () => {
    const tools = [
      makeTool("Cursor", 40),
      makeTool("GitHub Copilot", 10),
      makeTool("ChatGPT", 20),
      makeTool("Claude", 20),
    ];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);

    for (let i = 0; i < matrix.length - 1; i++) {
      expect(matrix[i].overlapScore).toBeGreaterThanOrEqual(
        matrix[i + 1].overlapScore
      );
    }
  });

  it("two identical coding tools have high overlap score", () => {
    // Cursor and GitHub Copilot are both coding tools — should heavily overlap
    const tools = [makeTool("Cursor", 40), makeTool("GitHub Copilot", 10)];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);

    expect(matrix[0].overlapScore).toBeGreaterThan(40);
    expect(matrix[0].sharedCapabilities.length).toBeGreaterThan(0);
  });

  it("sharedCapabilities only contains capabilities both tools have", () => {
    const tools = [makeTool("Cursor", 40), makeTool("ChatGPT", 20)];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);

    const capsA = capMap.get("Cursor")!;
    const capsB = capMap.get("ChatGPT")!;

    for (const shared of matrix[0].sharedCapabilities) {
      expect(capsA.has(shared)).toBe(true);
      expect(capsB.has(shared)).toBe(true);
    }
  });
});

// ── detectRedundancies ────────────────────────────────────────────────────────

describe("detectRedundancies — full overlap", () => {
  it("flags full-overlap redundancy for two near-identical coding tools", () => {
    // Cursor and GitHub Copilot: both are primarily code-generation + code-completion
    const tools = [makeTool("Cursor", 40), makeTool("GitHub Copilot", 10)];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);
    const redundancies = detectRedundancies(tools, matrix);

    const fullOverlap = redundancies.find((r) => r.type === "full-overlap");
    expect(fullOverlap).toBeDefined();
    expect(fullOverlap?.severity).toBe("critical");
    expect(fullOverlap?.estimatedMonthlySavings).toBeGreaterThan(0);
  });

  it("recommends keeping the cheaper tool in a full-overlap redundancy", () => {
    const tools = [
      makeTool("Cursor", 40),       // more expensive
      makeTool("GitHub Copilot", 10), // cheaper
    ];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);
    const redundancies = detectRedundancies(tools, matrix);

    const fullOverlap = redundancies.find((r) => r.type === "full-overlap");
    // Savings should equal the more expensive tool's spend
    expect(fullOverlap?.estimatedMonthlySavings).toBe(40);
    expect(fullOverlap?.suggestedAction).toContain("GitHub Copilot");
  });
});

describe("detectRedundancies — underutilization", () => {
  it("flags underutilization for a tool used rarely", () => {
    const tools = [makeTool("Notion AI", 10, "rarely")];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);
    const redundancies = detectRedundancies(tools, matrix);

    const underused = redundancies.find((r) => r.type === "underutilization");
    expect(underused).toBeDefined();
    expect(underused?.severity).toBe("high");
    expect(underused?.estimatedMonthlySavings).toBeCloseTo(9, 0); // 90% of $10
  });

  it("flags underutilization for a tool used occasionally (medium severity)", () => {
    const tools = [makeTool("Jasper", 49, "occasional")];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);
    const redundancies = detectRedundancies(tools, matrix);

    const underused = redundancies.find((r) => r.type === "underutilization");
    expect(underused).toBeDefined();
    expect(underused?.severity).toBe("medium");
    expect(underused?.estimatedMonthlySavings).toBeCloseTo(24.5, 0); // 50% of $49
  });

  it("does NOT flag underutilization for a daily-use tool", () => {
    const tools = [makeTool("ChatGPT", 20, "daily")];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);
    const redundancies = detectRedundancies(tools, matrix);

    const underused = redundancies.find((r) => r.type === "underutilization");
    expect(underused).toBeUndefined();
  });
});

describe("detectRedundancies — general", () => {
  it("returns empty array when only one tool in the stack", () => {
    const tools = [makeTool("Cursor", 40, "daily")];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);
    const redundancies = detectRedundancies(tools, matrix);

    // Only underutilization could fire, but daily usage prevents it
    const overlapReds = redundancies.filter(
      (r) => r.type === "full-overlap" || r.type === "partial-overlap"
    );
    expect(overlapReds).toHaveLength(0);
  });

  it("all redundancy estimatedMonthlySavings are non-negative", () => {
    const tools = [
      makeTool("Cursor", 40, "rarely"),
      makeTool("GitHub Copilot", 10, "occasional"),
      makeTool("ChatGPT", 20, "daily"),
      makeTool("Claude", 20, "weekly"),
    ];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);
    const redundancies = detectRedundancies(tools, matrix);

    for (const r of redundancies) {
      expect(r.estimatedMonthlySavings).toBeGreaterThanOrEqual(0);
    }
  });

  it("each redundancy has a non-empty description and suggestedAction", () => {
    const tools = [
      makeTool("Cursor", 40, "rarely"),
      makeTool("GitHub Copilot", 10, "daily"),
    ];
    const capMap = buildCapabilityMap(tools);
    const matrix = buildOverlapMatrix(tools, capMap);
    const redundancies = detectRedundancies(tools, matrix);

    for (const r of redundancies) {
      expect(r.description.length).toBeGreaterThan(0);
      expect(r.suggestedAction.length).toBeGreaterThan(0);
    }
  });
});