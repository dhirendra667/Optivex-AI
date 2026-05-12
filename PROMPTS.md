# PROMPTS.md — LLM Prompts Used in Optivex AI

## Overview

Two prompts power Optivex AI's AI features:
1. **Consultant System Prompt** — drives the conversational intake chat
2. **Audit Summary Prompt** — generates the personalized executive summary and strategic narrative

The audit engine logic (scoring, redundancy detection, recommendations) is entirely deterministic TypeScript — no AI involved. This was intentional: financial recommendations need to be auditable and consistent.

---

## Prompt 1: Consultant System Prompt

**Used in:** `/src/lib/ai/prompts.ts` → `SYSTEM_CONSULTANT`
**Called from:** `/src/app/api/extract/route.ts` via `callGemini()`
**Model:** gemini-2.0-flash

```
You are Optivex, an expert AI stack consultant. Your job is to help teams understand and optimize their AI tool subscriptions.

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

Always respond in plain text. No markdown lists or headers in your replies.
```

**Why written this way:**
- "Like a senior consultant, not a salesperson" — prevents the model from being sycophantic or pushing recommendations before it has data
- Explicit numbered extraction goals — keeps the model focused on data collection, not advice
- `[READY_FOR_AUDIT]` token — a simple deterministic signal the API route can check without parsing natural language
- "Plain text, no markdown" — the chat UI renders plain text; markdown symbols would show as literal characters

**What didn't work:**
- First version asked the model to also generate structured JSON of extracted data inline. The model mixed JSON into conversational replies in inconsistent positions, making parsing brittle. Separated concerns: chat for conversation, a separate extraction call for structured data.
- Tried "You are a friendly assistant" framing — model became too chatty and padded answers. "Senior consultant" framing tightened the tone significantly.

---

## Prompt 2: Audit Summary Prompt

**Used in:** `/src/lib/ai/prompts.ts` → `SYSTEM_AUDIT_SUMMARY` + `buildAuditSummaryPrompt()`
**Called from:** `/src/lib/ai/generate-summary.ts` → `generateAuditSummary()`
**Model:** gemini-2.0-flash

### System Prompt
```
You are Optivex, an elite AI strategy consultant generating a premium audit report.

Your writing is:
- Sharp, direct, and strategic — like McKinsey meets YC Partner
- Data-backed with specific numbers from the audit
- Actionable — every insight has a clear next step
- Free of fluff, filler, and jargon
- Written for a technical founder or ops lead
```

### User Prompt (dynamically built from audit result)
```
Generate a premium AI stack audit report for:

COMPANY: {companyName}
INDUSTRY: {industry}
TEAM SIZE: {teamSize} people
GROWTH STAGE: {growthStage}
MONTHLY AI BUDGET: ${budget}

CURRENT STACK:
- {toolName} ({tier}, ${monthlySpend}/mo, {seats} seats, {usageLevel})
...

AUDIT RESULTS:
- Stack Health Score: {stackHealthScore}/100
- Current Monthly Spend: ${currentMonthlySpend}
- Potential Monthly Savings: ${monthlyPotentialSavings} ({savingsPercentage}%)
- Potential Annual Savings: ${annualPotentialSavings}
- Tools to eliminate/replace: {eliminateTools}

KEY REDUNDANCIES:
- {redundancy descriptions}

TOP RECOMMENDATIONS:
- {recommendation title}: {recommendation impact}

Write TWO sections:

1. EXECUTIVE_SUMMARY (2-3 sharp sentences): A high-level verdict on the stack's health, the biggest problem, and the opportunity. Reference the exact savings number.

2. STRATEGIC_NARRATIVE (3-4 paragraphs): A deeper strategic analysis covering: (a) the biggest inefficiency and why it happened, (b) what an optimized stack looks like, (c) implementation priority order, (d) expected outcome after optimization.

Format your response as:
EXECUTIVE_SUMMARY:
[text here]

STRATEGIC_NARRATIVE:
[text here]
```

**Why written this way:**
- All audit numbers passed as structured context — model can't hallucinate the savings figure because it's given the exact number
- Two clearly labelled output sections — makes parsing with regex reliable (`EXECUTIVE_SUMMARY:` and `STRATEGIC_NARRATIVE:` as anchors)
- "McKinsey meets YC Partner" — generated output is notably sharper and less generic than "write a professional summary"
- Limiting EXECUTIVE_SUMMARY to 2–3 sentences and STRATEGIC_NARRATIVE to 3–4 paragraphs — prevents the model from padding

**What didn't work:**
- Asked for a single block of text first — parsing where the executive summary ended was unreliable. Explicit section labels fixed this.
- Tried asking the model to also suggest specific tools to switch to — it hallucinated pricing and features for tools it didn't have current data on. Kept tool recommendations in the deterministic engine; AI only writes narrative.

**Failure handling:**
If the Gemini API call fails (rate limit, network error, invalid key), `generateAuditSummary()` throws, and `audit/route.ts` catches it and falls back to a templated summary using the audit numbers directly — no user-facing error.
