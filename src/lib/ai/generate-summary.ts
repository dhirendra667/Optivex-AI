// ─── lib/ai/generate-summary.ts ────────────────────────────────────────────

import { AuditResult } from "@/types/audit";
import { callGemini } from "./gemini";
import { SYSTEM_AUDIT_SUMMARY, buildAuditSummaryPrompt } from "./prompts";

export async function generateAuditSummary(result: AuditResult): Promise<{
  executiveSummary: string;
  strategicNarrative: string;
}> {
  const prompt = buildAuditSummaryPrompt(result);

  const response = await callGemini({
    system: SYSTEM_AUDIT_SUMMARY,
    messages: [{ role: "user", content: prompt }],
    maxTokens: 1500,
  });

  // Parse structured response
  const execMatch = response.match(/EXECUTIVE_SUMMARY:\s*([\s\S]*?)(?=STRATEGIC_NARRATIVE:|$)/);
  const stratMatch = response.match(/STRATEGIC_NARRATIVE:\s*([\s\S]*?)$/);

  const executiveSummary = execMatch?.[1]?.trim() ?? response.slice(0, 300);
  const strategicNarrative = stratMatch?.[1]?.trim() ?? response;

  return { executiveSummary, strategicNarrative };
}
