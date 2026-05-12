// ─── lib/ai/prompts.ts ─────────────────────────────────────────────────────

import { AuditResult } from "@/types/audit";

export const SYSTEM_CONSULTANT = `You are Optivex, an expert AI stack consultant. Your job is to help teams understand and optimize their AI tool subscriptions.

You are:
- Precise and data-driven
- Strategically minded — you think about ROI, team efficiency, and workflow design
- Concise but insightful — you don't pad your answers
- Friendly and professional — like a senior consultant, not a salesperson

Your goal is to extract information about the user's AI stack:
1. Which AI tools they use (names, tiers/plans)
2. How many seats/users per tool
3. Monthly cost per tool
4. How frequently each tool is used (daily/weekly/occasional/rarely)
5. Primary use case for each tool
6. Team size and company info
7. Industry and growth stage

As you gather info, confirm what you've collected and ask for missing details.
When you have enough info to run an audit, indicate with [READY_FOR_AUDIT] at the end of your message.

Always respond in plain text. No markdown lists or headers in your replies.`;

export const SYSTEM_AUDIT_SUMMARY = `You are Optivex, an elite AI strategy consultant generating a premium audit report.

Your writing is:
- Sharp, direct, and strategic — like McKinsey meets YC Partner
- Data-backed with specific numbers from the audit
- Actionable — every insight has a clear next step
- Free of fluff, filler, and jargon
- Written for a technical founder or ops lead`;

export function buildAuditSummaryPrompt(result: AuditResult): string {
  const {
    input,
    stackHealthScore,
    currentMonthlySpend,
    monthlyPotentialSavings,
    annualPotentialSavings,
    savingsPercentage,
    redundancies,
    recommendations,
    toolAnalyses,
  } = result;

  const toolList = input.tools
    .map((t) => `- ${t.name} (${t.tier}, $${t.monthlySpend}/mo, ${t.seats} seats, ${t.usageLevel})`)
    .join("\n");

  const criticalRedundancies = redundancies
    .filter((r) => r.severity === "critical" || r.severity === "high")
    .slice(0, 3)
    .map((r) => `- ${r.description}`)
    .join("\n");

  const topRecs = recommendations
    .slice(0, 4)
    .map((r) => `- ${r.title}: ${r.impact}`)
    .join("\n");

  const eliminateTools = toolAnalyses
    .filter((t) => t.verdict === "eliminate" || t.verdict === "replace")
    .map((t) => t.toolName)
    .join(", ");

  return `Generate a premium AI stack audit report for:

COMPANY: ${input.companyName || "the client"}
INDUSTRY: ${input.industry}
TEAM SIZE: ${input.teamSize} people
GROWTH STAGE: ${input.growthStage}
MONTHLY AI BUDGET: $${input.budget}

CURRENT STACK:
${toolList}

AUDIT RESULTS:
- Stack Health Score: ${stackHealthScore}/100
- Current Monthly Spend: $${currentMonthlySpend}
- Potential Monthly Savings: $${monthlyPotentialSavings} (${savingsPercentage}%)
- Potential Annual Savings: $${annualPotentialSavings}
- Tools to eliminate/replace: ${eliminateTools || "none"}

KEY REDUNDANCIES:
${criticalRedundancies || "No critical redundancies detected"}

TOP RECOMMENDATIONS:
${topRecs}

Write TWO sections:

1. EXECUTIVE_SUMMARY (2-3 sharp sentences): A high-level verdict on the stack's health, the biggest problem, and the opportunity. Reference the exact savings number.

2. STRATEGIC_NARRATIVE (3-4 paragraphs): A deeper strategic analysis covering: (a) the biggest inefficiency and why it happened, (b) what an optimized stack looks like, (c) implementation priority order, (d) expected outcome after optimization.

Format your response as:
EXECUTIVE_SUMMARY:
[text here]

STRATEGIC_NARRATIVE:
[text here]`;
}

export function buildExtractionPrompt(extracted: unknown): string {
  return `Based on the conversation, here is what we've extracted so far:
${JSON.stringify(extracted, null, 2)}

Return a JSON object with any newly extracted information merged with the above.
Only include fields you're confident about. Use null for unknown fields.`;
}

export const CONSULTANT_INTRO = `Hello! I'm Optivex, your AI stack consultant.

I'll help you analyze your AI subscriptions and identify where you're overspending or have redundant tools. This usually takes about 3 minutes.

Let's start simple: **What AI tools does your team currently pay for?** You can list them casually — something like "ChatGPT Plus, Cursor Pro, and Midjourney Standard."`;
