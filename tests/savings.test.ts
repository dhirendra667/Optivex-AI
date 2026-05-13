// ─── tests/savings.test.ts ──────────────────────────────────────────────────
// Tests for computeStackHealthScore, scoreToolAnalysis, generateRecommendations

import { describe, it, expect } from "vitest";
import { computeStackHealthScore, scoreToolAnalysis } from "@/lib/audit-engine/scoring";
import { generateRecommendations } from "@/lib/audit-engine/recommendations";
import { AuditFormInput, Redundancy, ToolAnalysis } from "@/types/audit";

// ── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_INPUT: AuditFormInput = {
  companyName: "TestCo",
  teamSize: 5,
  industry: "SaaS",
  primaryUseCase: "coding",
  mainPainPoints: [],
  budget: 300,
  growthStage: "early-growth",
  tools: [],
};

const makeRedundancy = (
  type: Redundancy["type"],
  severity: Redundancy["severity"],
  savings: number,
  tools: string[] = ["ToolA", "ToolB"]
): Redundancy => ({
  id: "test-id",
  type,
  severity,
  tools,
  sharedCapabilities: ["chat"],
  description: "Test redundancy",
  suggestedAction: "Test action",
  estimatedMonthlySavings: savings,
});

const makeAnalysis = (
  toolName: string,
  monthlySpend: number,
  utilization: number,
  verdict: ToolAnalysis["verdict"] = "keep"
): ToolAnalysis => ({
  toolName,
  monthlySpend,
  utilization,
  roiScore: utilization,
  redundancyFlags: [],
  keepScore: utilization,
  verdict,
  verdictReason: "Test reason",
});

// ── computeStackHealthScore ───────────────────────────────────────────────────

describe("computeStackHealthScore", () => {
  it("returns score between 0 and 100", () => {
    const result = computeStackHealthScore({
      redundancies: [],
      toolAnalyses: [makeAnalysis("ChatGPT", 20, 90)],
      input: { ...BASE_INPUT, tools: [{ name: "ChatGPT", tier: "Plus", seats: 1, monthlySpend: 20, usageLevel: "daily", primaryUse: "general", teamsThatUseIt: [] }] },
    });

    expect(result.stackHealthScore).toBeGreaterThanOrEqual(0);
    expect(result.stackHealthScore).toBeLessThanOrEqual(100);
  });

  it("a clean stack with no redundancies and daily usage scores higher than a redundant one", () => {
    const cleanResult = computeStackHealthScore({
      redundancies: [],
      toolAnalyses: [makeAnalysis("ChatGPT", 20, 90)],
      input: {
        ...BASE_INPUT,
        tools: [{ name: "ChatGPT", tier: "Plus", seats: 1, monthlySpend: 20, usageLevel: "daily", primaryUse: "general", teamsThatUseIt: [] }],
      },
    });

    const redundantResult = computeStackHealthScore({
      redundancies: [
        makeRedundancy("full-overlap", "critical", 40),
        makeRedundancy("full-overlap", "critical", 20),
        makeRedundancy("underutilization", "high", 10, ["ToolC"]),
      ],
      toolAnalyses: [makeAnalysis("ToolA", 40, 30, "eliminate")],
      input: {
        ...BASE_INPUT,
        tools: [{ name: "ToolA", tier: "Pro", seats: 1, monthlySpend: 40, usageLevel: "rarely", primaryUse: "general", teamsThatUseIt: [] }],
      },
    });

    expect(cleanResult.stackHealthScore).toBeGreaterThan(
      redundantResult.stackHealthScore
    );
  });

  it("critical redundancy applies a larger penalty than medium", () => {
    const withCritical = computeStackHealthScore({
      redundancies: [makeRedundancy("full-overlap", "critical", 40)],
      toolAnalyses: [makeAnalysis("ToolA", 40, 70)],
      input: { ...BASE_INPUT, tools: [{ name: "ToolA", tier: "Pro", seats: 1, monthlySpend: 40, usageLevel: "daily", primaryUse: "general", teamsThatUseIt: [] }] },
    });

    const withMedium = computeStackHealthScore({
      redundancies: [makeRedundancy("team-size-mismatch", "medium", 10)],
      toolAnalyses: [makeAnalysis("ToolA", 40, 70)],
      input: { ...BASE_INPUT, tools: [{ name: "ToolA", tier: "Pro", seats: 1, monthlySpend: 40, usageLevel: "daily", primaryUse: "general", teamsThatUseIt: [] }] },
    });

    expect(withCritical.stackHealthScore).toBeLessThan(withMedium.stackHealthScore);
  });

  it("coverage score is lower for stacks with many tools (sprawl penalty)", () => {
    const manyTools = Array.from({ length: 12 }, (_, i) => ({
      name: `Tool${i}`,
      tier: "Pro",
      seats: 1,
      monthlySpend: 10,
      usageLevel: "daily" as const,
      primaryUse: "general",
      teamsThatUseIt: [],
    }));

    const manyAnalyses = manyTools.map((t) =>
      makeAnalysis(t.name, t.monthlySpend, 80)
    );

    const fewTools = manyTools.slice(0, 3);
    const fewAnalyses = manyAnalyses.slice(0, 3);

    const manyResult = computeStackHealthScore({
      redundancies: [],
      toolAnalyses: manyAnalyses,
      input: { ...BASE_INPUT, tools: manyTools },
    });

    const fewResult = computeStackHealthScore({
      redundancies: [],
      toolAnalyses: fewAnalyses,
      input: { ...BASE_INPUT, tools: fewTools },
    });

    expect(fewResult.coverageScore).toBeGreaterThan(manyResult.coverageScore);
  });
});

// ── scoreToolAnalysis ─────────────────────────────────────────────────────────

describe("scoreToolAnalysis", () => {
  it("daily usage maps to 90 utilization", () => {
    const result = scoreToolAnalysis(
      { name: "ChatGPT", monthlySpend: 20, usageLevel: "daily", seats: 1 },
      []
    );
    expect(result.utilization).toBe(90);
  });

  it("weekly usage maps to 65 utilization", () => {
    const result = scoreToolAnalysis(
      { name: "ChatGPT", monthlySpend: 20, usageLevel: "weekly", seats: 1 },
      []
    );
    expect(result.utilization).toBe(65);
  });

  it("occasional usage maps to 35 utilization", () => {
    const result = scoreToolAnalysis(
      { name: "ChatGPT", monthlySpend: 20, usageLevel: "occasional", seats: 1 },
      []
    );
    expect(result.utilization).toBe(35);
  });

  it("rarely usage maps to 10 utilization", () => {
    const result = scoreToolAnalysis(
      { name: "ChatGPT", monthlySpend: 20, usageLevel: "rarely", seats: 1 },
      []
    );
    expect(result.utilization).toBe(10);
  });

  it("verdicts: daily high-use tool with no flags gets 'keep'", () => {
    const result = scoreToolAnalysis(
      { name: "Cursor", monthlySpend: 20, usageLevel: "daily", seats: 1 },
      [] // no redundancy flags
    );
    expect(result.verdict).toBe("keep");
  });

it("verdicts: rarely used tool with multiple flags gets 'replace'", () => {
const result = scoreToolAnalysis(
    { name: "SomeTool", monthlySpend: 50, usageLevel: "rarely", seats: 1 },
    ["Overlaps with ToolA", "Overlaps with ToolB"]
);
expect(result.verdict).toBe("replace");  
});

  it("roiScore and keepScore are between 0 and 100", () => {
    const cases: Array<"daily" | "weekly" | "occasional" | "rarely"> = [
      "daily", "weekly", "occasional", "rarely",
    ];
    for (const usageLevel of cases) {
      const result = scoreToolAnalysis(
        { name: "TestTool", monthlySpend: 30, usageLevel, seats: 2 },
        []
      );
      expect(result.roiScore).toBeGreaterThanOrEqual(0);
      expect(result.roiScore).toBeLessThanOrEqual(100);
      expect(result.keepScore).toBeLessThanOrEqual(100);
    }
  });
});

// ── generateRecommendations ───────────────────────────────────────────────────

describe("generateRecommendations", () => {
  it("generates an eliminate recommendation for full-overlap redundancy", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [
        { name: "Cursor", tier: "Pro", seats: 1, monthlySpend: 40, usageLevel: "daily", primaryUse: "coding", teamsThatUseIt: [] },
        { name: "GitHub Copilot", tier: "Individual", seats: 1, monthlySpend: 10, usageLevel: "daily", primaryUse: "coding", teamsThatUseIt: [] },
      ],
    };

    const recs = generateRecommendations({
      redundancies: [makeRedundancy("full-overlap", "critical", 40, ["Cursor", "GitHub Copilot"])],
      toolAnalyses: [
        makeAnalysis("Cursor", 40, 90),
        makeAnalysis("GitHub Copilot", 10, 90),
      ],
      input,
    });

    const eliminateRec = recs.find((r) => r.type === "eliminate");
    expect(eliminateRec).toBeDefined();
    expect(eliminateRec?.priority).toBe("critical");
    expect(eliminateRec?.estimatedMonthlySavings).toBe(40);
  });

  it("generates a downgrade recommendation for underutilization", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [
        { name: "Jasper", tier: "Creator", seats: 1, monthlySpend: 49, usageLevel: "rarely", primaryUse: "writing", teamsThatUseIt: [] },
      ],
    };

    const recs = generateRecommendations({
      redundancies: [makeRedundancy("underutilization", "high", 44, ["Jasper"])],
      toolAnalyses: [makeAnalysis("Jasper", 49, 10, "eliminate")],
      input,
    });

    const downgradeRec = recs.find((r) => r.type === "downgrade");
    expect(downgradeRec).toBeDefined();
    expect(downgradeRec?.tools).toContain("Jasper");
  });

  it("recommendations are sorted: critical before high before medium", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [
        { name: "ToolA", tier: "Pro", seats: 1, monthlySpend: 40, usageLevel: "rarely", primaryUse: "general", teamsThatUseIt: [] },
        { name: "ToolB", tier: "Pro", seats: 1, monthlySpend: 20, usageLevel: "daily", primaryUse: "general", teamsThatUseIt: [] },
      ],
    };

    const recs = generateRecommendations({
      redundancies: [
        makeRedundancy("full-overlap", "critical", 40, ["ToolA", "ToolB"]),
        makeRedundancy("underutilization", "high", 36, ["ToolA"]),
        makeRedundancy("team-size-mismatch", "medium", 6, ["ToolB"]),
      ],
      toolAnalyses: [
        makeAnalysis("ToolA", 40, 10, "eliminate"),
        makeAnalysis("ToolB", 20, 90, "keep"),
      ],
      input,
    });

    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    for (let i = 0; i < recs.length - 1; i++) {
      expect(priorityOrder[recs[i].priority]).toBeLessThanOrEqual(
        priorityOrder[recs[i + 1].priority]
      );
    }
  });

  it("every recommendation has a non-empty title, description, and impact", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [
        { name: "ToolA", tier: "Pro", seats: 1, monthlySpend: 40, usageLevel: "rarely", primaryUse: "general", teamsThatUseIt: [] },
        { name: "ToolB", tier: "Pro", seats: 1, monthlySpend: 20, usageLevel: "daily", primaryUse: "general", teamsThatUseIt: [] },
      ],
    };

    const recs = generateRecommendations({
      redundancies: [makeRedundancy("full-overlap", "critical", 40)],
      toolAnalyses: [
        makeAnalysis("ToolA", 40, 10, "eliminate"),
        makeAnalysis("ToolB", 20, 90, "keep"),
      ],
      input,
    });

    for (const rec of recs) {
      expect(rec.title.length).toBeGreaterThan(0);
      expect(rec.description.length).toBeGreaterThan(0);
      expect(rec.impact.length).toBeGreaterThan(0);
      expect(rec.estimatedMonthlySavings).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns empty array when no redundancies and no budget overage", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      budget: 500,
      tools: [
        { name: "ChatGPT", tier: "Plus", seats: 1, monthlySpend: 20, usageLevel: "daily", primaryUse: "general", teamsThatUseIt: [] },
      ],
    };

    const recs = generateRecommendations({
      redundancies: [],
      toolAnalyses: [makeAnalysis("ChatGPT", 20, 90, "keep")],
      input,
    });

    // No overlap, no underuse, no budget breach → no recommendations from rules
    const actionableRecs = recs.filter(
      (r) => r.type === "eliminate" || r.type === "downgrade" || r.type === "consolidate"
    );
    expect(actionableRecs).toHaveLength(0);
  });
});