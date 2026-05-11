// ─── lib/charts/chart-data.ts ──────────────────────────────────────────────
// Realistic mock audit result for demos, tests, and the shareable /audit/demo page

import { AuditResult } from "@/types/audit";

export const MOCK_AUDIT_RESULT: AuditResult = {
  id: "demo",
  createdAt: new Date().toISOString(),
  input: {
    companyName: "Acme Labs",
    teamSize: 8,
    industry: "SaaS / Software",
    primaryUseCase: "Code generation, content drafting, and internal knowledge search",
    growthStage: "early-growth",
    budget: 300,
    mainPainPoints: ["Duplicate workflows", "Budget overrun", "Too many tools"],
    tools: [
      { name: "ChatGPT", tier: "Team", seats: 8, monthlySpend: 240, usageLevel: "daily", primaryUse: "General Q&A, writing", teamsThatUseIt: ["Engineering", "Marketing"] },
      { name: "Claude", tier: "Pro", seats: 3, monthlySpend: 60, usageLevel: "weekly", primaryUse: "Document analysis, long-form writing", teamsThatUseIt: ["Product"] },
      { name: "Cursor", tier: "Business", seats: 5, monthlySpend: 200, usageLevel: "daily", primaryUse: "AI-assisted coding", teamsThatUseIt: ["Engineering"] },
      { name: "GitHub Copilot", tier: "Business", seats: 5, monthlySpend: 95, usageLevel: "weekly", primaryUse: "Inline code completion", teamsThatUseIt: ["Engineering"] },
      { name: "Perplexity AI", tier: "Pro", seats: 3, monthlySpend: 60, usageLevel: "occasional", primaryUse: "Research and competitive analysis", teamsThatUseIt: ["Marketing", "Product"] },
      { name: "Midjourney", tier: "Standard", seats: 1, monthlySpend: 30, usageLevel: "rarely", primaryUse: "Marketing image assets", teamsThatUseIt: ["Marketing"] },
    ],
  },

  stackHealthScore: 52,
  efficiencyScore: 61,
  coverageScore: 70,
  redundancyScore: 64,

  currentMonthlySpend: 685,
  optimizedMonthlySpend: 440,
  monthlyPotentialSavings: 245,
  annualPotentialSavings: 2940,
  savingsPercentage: 36,

  redundancies: [
    {
      id: "r1",
      type: "full-overlap",
      severity: "critical",
      tools: ["Cursor", "GitHub Copilot"],
      sharedCapabilities: ["code-generation", "code-completion", "chat"],
      description: "Cursor and GitHub Copilot share 85% of capabilities — both provide AI code completion and chat, making one fully redundant.",
      suggestedAction: "Consolidate to Cursor Business. It includes all Copilot features plus full IDE rewrite capabilities.",
      estimatedMonthlySavings: 95,
    },
    {
      id: "r2",
      type: "partial-overlap",
      severity: "high",
      tools: ["ChatGPT", "Claude"],
      sharedCapabilities: ["chat", "writing", "summarization", "code-generation"],
      description: "ChatGPT Team and Claude Pro overlap on 60% of capabilities. Both cover writing, summarization, and code generation.",
      suggestedAction: "Standardize on ChatGPT Team for the full team. Use Claude API access selectively for specialized tasks.",
      estimatedMonthlySavings: 60,
    },
    {
      id: "r3",
      type: "underutilization",
      severity: "high",
      tools: ["Midjourney"],
      sharedCapabilities: [],
      description: "Midjourney is used rarely despite a $30/mo subscription. This suggests the team generates images infrequently.",
      suggestedAction: "Cancel Midjourney and use DALL-E via ChatGPT Plus on demand, or switch to a pay-per-image model.",
      estimatedMonthlySavings: 27,
    },
    {
      id: "r4",
      type: "underutilization",
      severity: "medium",
      tools: ["Perplexity AI"],
      sharedCapabilities: [],
      description: "Perplexity Pro is only occasionally used. ChatGPT with web search covers most research use-cases.",
      suggestedAction: "Downgrade to Perplexity free tier or use ChatGPT's web search plugin as an alternative.",
      estimatedMonthlySavings: 48,
    },
  ],

  recommendations: [
    {
      id: "rec1",
      priority: "critical",
      type: "eliminate",
      title: "Eliminate GitHub Copilot — fully covered by Cursor",
      description: "Cursor Business already includes AI code completion, inline chat, and codebase awareness. GitHub Copilot adds no unique value for your team.",
      impact: "Save $95/mo immediately with zero workflow disruption.",
      effort: "low",
      estimatedMonthlySavings: 95,
      tools: ["GitHub Copilot", "Cursor"],
      action: { label: "Cancel Copilot" },
    },
    {
      id: "rec2",
      priority: "high",
      type: "eliminate",
      title: "Cancel Midjourney — switch to DALL-E via ChatGPT",
      description: "Midjourney is used rarely by one team member. DALL-E 3 (included in ChatGPT Team) covers the same use-case at no additional cost.",
      impact: "Save $30/mo. Image generation still available via ChatGPT.",
      effort: "low",
      estimatedMonthlySavings: 30,
      tools: ["Midjourney"],
      action: { label: "Cancel Midjourney" },
    },
    {
      id: "rec3",
      priority: "high",
      type: "downgrade",
      title: "Downgrade Perplexity to free tier",
      description: "Occasional usage doesn't justify Pro pricing. The free tier covers research use-cases for teams this size.",
      impact: "Save $60/mo across 3 seats.",
      effort: "low",
      estimatedMonthlySavings: 60,
      tools: ["Perplexity AI"],
      action: { label: "Manage plan" },
    },
    {
      id: "rec4",
      priority: "medium",
      type: "consolidate",
      title: "Standardize LLM usage on ChatGPT Team",
      description: "Claude Pro is used by only 3 people weekly. Consolidating to ChatGPT Team reduces fragmentation and training overhead.",
      impact: "Save $60/mo and simplify your AI tool onboarding.",
      effort: "medium",
      estimatedMonthlySavings: 60,
      tools: ["Claude", "ChatGPT"],
      action: { label: "Review usage" },
    },
    {
      id: "rec5",
      priority: "medium",
      type: "renegotiate",
      title: "Audit ChatGPT Team seat utilization",
      description: "You're paying for 8 ChatGPT Team seats. Verify all 8 are active users — unused seats are pure waste.",
      impact: "Recover up to $30/mo per inactive seat.",
      effort: "low",
      estimatedMonthlySavings: 30,
      tools: ["ChatGPT"],
      action: { label: "Audit seats" },
    },
  ],

  toolAnalyses: [
    { toolName: "ChatGPT", monthlySpend: 240, utilization: 88, roiScore: 75, keepScore: 80, redundancyFlags: ["Overlaps with Claude on writing and summarization"], verdict: "keep", verdictReason: "High utilization across the full team. Core collaboration and productivity tool." },
    { toolName: "Claude", monthlySpend: 60, utilization: 55, roiScore: 42, keepScore: 38, redundancyFlags: ["60% overlap with ChatGPT", "Used by only 3 of 8 team members"], verdict: "replace", verdictReason: "Significant overlap with ChatGPT. Low team penetration suggests consolidation opportunity." },
    { toolName: "Cursor", monthlySpend: 200, utilization: 90, roiScore: 85, keepScore: 88, redundancyFlags: [], verdict: "keep", verdictReason: "Essential for your engineering team. High daily usage and strong ROI for code-heavy workflows." },
    { toolName: "GitHub Copilot", monthlySpend: 95, utilization: 60, roiScore: 25, keepScore: 18, redundancyFlags: ["85% overlap with Cursor", "Fully redundant with Cursor Business"], verdict: "eliminate", verdictReason: "Fully covered by Cursor. Removing this is the single highest-impact action in your audit." },
    { toolName: "Perplexity AI", monthlySpend: 60, utilization: 35, roiScore: 28, keepScore: 28, redundancyFlags: ["Research capability duplicated by ChatGPT web search"], verdict: "optimize", verdictReason: "Low utilization for Pro tier. Downgrade to free or consolidate research via ChatGPT." },
    { toolName: "Midjourney", monthlySpend: 30, utilization: 10, roiScore: 8, keepScore: 10, redundancyFlags: ["Image gen available via ChatGPT DALL-E"], verdict: "eliminate", verdictReason: "Near-zero utilization. Cancel and use DALL-E via your existing ChatGPT Team subscription." },
  ],

  capabilityGaps: [],

  executiveSummary: "Acme Labs is spending $685/mo on AI tools but capturing only 52% of the potential value — primarily due to two critical redundancies: Cursor and GitHub Copilot are functionally identical for your workflow, and three tools (Claude, Perplexity, Midjourney) show dangerously low utilization. Eliminating these redundancies unlocks $2,940/yr in immediate savings.",

  strategicNarrative: `Your engineering stack is where the clearest waste lives. Cursor Business already provides everything GitHub Copilot offers — AI completion, inline refactoring, codebase chat — and then some. Paying for both is like subscribing to two cell carriers with the same coverage area. This is the first and most impactful fix.

The second issue is LLM sprawl. ChatGPT Team covers 95% of Claude's use-cases for your team size and growth stage. The 3 Claude Pro seats represent an experiment that never got standardized — a common pattern in early-growth startups where individual contributors adopt tools independently. Consolidating your LLM usage to a single platform reduces cognitive overhead and simplifies future seat management.

Your optimized stack looks like this: ChatGPT Team (full team, $240/mo), Cursor Business (engineering, $200/mo), and Perplexity Free (research). That's $440/mo — a 36% reduction — with no meaningful capability loss. The freed budget ($245/mo) compounds to $2,940 annually.

Implement in this order: (1) Cancel GitHub Copilot immediately — zero disruption, (2) Cancel Midjourney and redirect to DALL-E — takes 10 minutes, (3) Evaluate Claude Pro after 30 days of ChatGPT-only usage before canceling. Migrate Perplexity to free tier as a final step once the team confirms ChatGPT web search covers their research needs.`,

  spendBreakdown: [
    { name: "ChatGPT", value: 240, percentage: 35, color: "#10A37F", verdict: "keep" },
    { name: "Cursor", value: 200, percentage: 29, color: "#7C3AED", verdict: "keep" },
    { name: "GitHub Copilot", value: 95, percentage: 14, color: "#58A6FF", verdict: "eliminate" },
    { name: "Claude", value: 60, percentage: 9, color: "#D4A574", verdict: "replace" },
    { name: "Perplexity AI", value: 60, percentage: 9, color: "#20B2AA", verdict: "optimize" },
    { name: "Midjourney", value: 30, percentage: 4, color: "#FF6B6B", verdict: "eliminate" },
  ],

  overlapMatrix: [
    { toolA: "Cursor", toolB: "GitHub Copilot", overlapScore: 85, sharedCapabilities: ["code-generation", "code-completion", "code-review", "chat"] },
    { toolA: "ChatGPT", toolB: "Claude", overlapScore: 60, sharedCapabilities: ["chat", "writing", "summarization", "code-generation", "document-qa"] },
    { toolA: "ChatGPT", toolB: "Perplexity AI", overlapScore: 40, sharedCapabilities: ["chat", "research", "web-search", "summarization"] },
    { toolA: "Claude", toolB: "Perplexity AI", overlapScore: 25, sharedCapabilities: ["research", "summarization"] },
    { toolA: "ChatGPT", toolB: "Midjourney", overlapScore: 15, sharedCapabilities: ["image-generation"] },
  ],
};
