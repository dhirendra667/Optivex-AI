// ─── types/audit.ts ────────────────────────────────────────────────────────

import { Capability, ToolCategory } from "./tool";

// ── Form Input ──────────────────────────────────────────────────────────────

export interface AuditFormInput {
  // Team context
  companyName: string;
  teamSize: number;
  industry: string;
  primaryUseCase: string;

  // Tool subscriptions
  tools: ToolInput[];

  // Workflow context
  mainPainPoints: string[];
  budget: number; // monthly USD
  growthStage: GrowthStage;
}

export interface ToolInput {
  name: string;
  category?: ToolCategory;
  tier: string; // e.g. "Pro", "Team", "Enterprise"
  seats: number;
  monthlySpend: number;
  usageLevel: UsageLevel;
  primaryUse: string; // free text
  teamsThatUseIt: string[]; // e.g. ["Engineering", "Design"]
}

export type GrowthStage = "idea" | "mvp" | "early-growth" | "scaling" | "enterprise";
export type UsageLevel = "daily" | "weekly" | "occasional" | "rarely";

// ── Audit Result ────────────────────────────────────────────────────────────

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditFormInput;

  // Scores
  stackHealthScore: number; // 0-100
  efficiencyScore: number;
  coverageScore: number;
  redundancyScore: number; // higher = more redundancy (bad)

  // Financial
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlyPotentialSavings: number;
  annualPotentialSavings: number;
  savingsPercentage: number;

  // Analysis
  redundancies: Redundancy[];
  recommendations: Recommendation[];
  toolAnalyses: ToolAnalysis[];
  capabilityGaps: CapabilityGap[];

  // AI-generated content
  executiveSummary: string;
  strategicNarrative: string;

  // Charts data
  spendBreakdown: SpendBreakdownItem[];
  overlapMatrix: OverlapMatrixItem[];
}

export interface Redundancy {
  id: string;
  type: RedundancyType;
  severity: "critical" | "high" | "medium" | "low";
  tools: string[]; // tool names
  sharedCapabilities: Capability[];
  description: string;
  suggestedAction: string;
  estimatedMonthlySavings: number;
}

export type RedundancyType =
  | "full-overlap"
  | "partial-overlap"
  | "team-size-mismatch"
  | "underutilization"
  | "better-alternative"
  | "consolidation-opportunity";

export interface Recommendation {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  type: RecommendationType;
  title: string;
  description: string;
  impact: string;
  effort: "low" | "medium" | "high";
  estimatedMonthlySavings: number;
  tools: string[];
  action: RecommendationAction;
}

export type RecommendationType =
  | "eliminate"
  | "downgrade"
  | "consolidate"
  | "upgrade"
  | "add"
  | "renegotiate"
  | "redistribute";

export interface RecommendationAction {
  label: string;
  url?: string;
}

export interface ToolAnalysis {
  toolName: string;
  monthlySpend: number;
  utilization: number; // 0-100
  roiScore: number; // 0-100
  redundancyFlags: string[];
  keepScore: number; // 0-100 — how strongly we recommend keeping this
  verdict: "keep" | "optimize" | "replace" | "eliminate";
  verdictReason: string;
}

export interface CapabilityGap {
  capability: Capability;
  description: string;
  suggestedTools: string[];
}

export interface SpendBreakdownItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
  verdict: ToolAnalysis["verdict"];
}

export interface OverlapMatrixItem {
  toolA: string;
  toolB: string;
  overlapScore: number; // 0-100
  sharedCapabilities: Capability[];
}