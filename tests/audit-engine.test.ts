// ─── tests/audit-engine.test.ts ────────────────────────────────────────────
// Tests for the full audit engine pipeline (runAuditEngine orchestrator)

import { describe, it, expect } from "vitest";
import { runAuditEngine } from "@/lib/audit-engine";
import { AuditFormInput } from "@/types/audit";

// ── Shared test fixtures ────────────────────────────────────────────────────

const BASE_INPUT: AuditFormInput = {
  companyName: "TestCo",
  teamSize: 5,
  industry: "SaaS / Software",
  primaryUseCase: "coding",
  mainPainPoints: [],
  budget: 300,
  growthStage: "early-growth",
  tools: [],
};

const makeTool = (
  name: string,
  monthlySpend: number,
  usageLevel: "daily" | "weekly" | "occasional" | "rarely" = "daily",
  seats = 1,
  tier = "Pro"
) => ({
  name,
  tier,
  seats,
  monthlySpend,
  usageLevel,
  primaryUse: "general",
  teamsThatUseIt: ["Engineering"],
});

// ── Tests ───────────────────────────────────────────────────────────────────

describe("runAuditEngine — financials", () => {
  it("correctly calculates currentMonthlySpend as sum of all tool spends", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [
        makeTool("Cursor", 40),
        makeTool("ChatGPT", 20),
        makeTool("Notion AI", 10),
      ],
    };

    const result = runAuditEngine(input);

    expect(result.currentMonthlySpend).toBe(70);
  });

  it("calculates annualPotentialSavings as 12x monthlyPotentialSavings", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [
        makeTool("ChatGPT", 20, "rarely"),
        makeTool("Claude", 20, "rarely"),
      ],
    };

    const result = runAuditEngine(input);

    expect(result.annualPotentialSavings).toBe(result.monthlyPotentialSavings * 12);
  });

  it("returns savingsPercentage of 0 when no tools provided", () => {
    const input: AuditFormInput = { ...BASE_INPUT, tools: [] };

    const result = runAuditEngine(input);

    expect(result.savingsPercentage).toBe(0);
    expect(result.currentMonthlySpend).toBe(0);
  });

  it("optimizedMonthlySpend is never negative", () => {
    // Give a tool huge estimated savings relative to its actual spend
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [makeTool("ChatGPT", 20, "rarely")],
    };

    const result = runAuditEngine(input);

    expect(result.optimizedMonthlySpend).toBeGreaterThanOrEqual(0);
  });
});

describe("runAuditEngine — output structure", () => {
  it("returns a result with an id and createdAt timestamp", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [makeTool("ChatGPT", 20)],
    };

    const result = runAuditEngine(input);

    expect(result.id).toBeTruthy();
    expect(typeof result.id).toBe("string");
    expect(result.createdAt).toBeTruthy();
    expect(new Date(result.createdAt).getTime()).not.toBeNaN();
  });

  it("spendBreakdown has one entry per tool", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [makeTool("ChatGPT", 20), makeTool("Cursor", 40)],
    };

    const result = runAuditEngine(input);

    expect(result.spendBreakdown).toHaveLength(2);
    expect(result.spendBreakdown.map((s) => s.name)).toContain("ChatGPT");
    expect(result.spendBreakdown.map((s) => s.name)).toContain("Cursor");
  });

  it("spendBreakdown percentages sum to 100 (±1 for rounding)", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [
        makeTool("ChatGPT", 20),
        makeTool("Cursor", 40),
        makeTool("Notion AI", 10),
      ],
    };

    const result = runAuditEngine(input);
    const total = result.spendBreakdown.reduce((s, i) => s + i.percentage, 0);

    expect(total).toBeGreaterThanOrEqual(99);
    expect(total).toBeLessThanOrEqual(101);
  });

  it("toolAnalyses has one entry per tool with a valid verdict", () => {
    const validVerdicts = ["keep", "optimize", "replace", "eliminate"];
    const input: AuditFormInput = {
      ...BASE_INPUT,
      tools: [makeTool("ChatGPT", 20), makeTool("Claude", 20)],
    };

    const result = runAuditEngine(input);

    expect(result.toolAnalyses).toHaveLength(2);
    for (const analysis of result.toolAnalyses) {
      expect(validVerdicts).toContain(analysis.verdict);
      expect(analysis.utilization).toBeGreaterThanOrEqual(0);
      expect(analysis.utilization).toBeLessThanOrEqual(100);
    }
  });
});

describe("runAuditEngine — budget overage recommendation", () => {
  it("flags a recommendation when spend exceeds budget by more than 20%", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      budget: 50, // declared budget
      tools: [
        makeTool("ChatGPT", 40),
        makeTool("Cursor", 40), // total = 80, which is 60% over budget
      ],
    };

    const result = runAuditEngine(input);
    const budgetRec = result.recommendations.find((r) =>
      r.title.toLowerCase().includes("budget")
    );

    expect(budgetRec).toBeDefined();
    expect(budgetRec?.priority).toBe("high");
  });

  it("does NOT flag budget overage when spend is within 20% of budget", () => {
    const input: AuditFormInput = {
      ...BASE_INPUT,
      budget: 100,
      tools: [makeTool("ChatGPT", 20), makeTool("Cursor", 40)], // total = 60, well under
    };

    const result = runAuditEngine(input);
    const budgetRec = result.recommendations.find((r) =>
      r.title.toLowerCase().includes("budget")
    );

    expect(budgetRec).toBeUndefined();
  });
});