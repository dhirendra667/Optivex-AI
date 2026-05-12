// ─── app/api/audit/route.ts ────────────────────────────────────────────────
// POST /api/audit — runs the audit engine and returns a full AuditResult

import { NextRequest, NextResponse } from "next/server";
import { runAuditEngine } from "@/lib/audit-engine";
import { generateAuditSummary } from "@/lib/ai/generate-summary";
import { AuditRequest, AuditResponse } from "@/types/api";
import { saveAudit } from "@/lib/db/supabase";

export async function POST(req: NextRequest) {
  try {
    const body: AuditRequest = await req.json();

    if (!body.input?.tools?.length) {
      return NextResponse.json(
        { success: false, error: "No tools provided" },
        { status: 400 }
      );
    }

    // Run the deterministic audit engine
    const partialResult = runAuditEngine(body.input);

    // Generate AI summaries
    let executiveSummary = "";
    let strategicNarrative = "";

    try {
      const summaries = await generateAuditSummary({
        ...partialResult,
        executiveSummary: "",
        strategicNarrative: "",
      });
      executiveSummary = summaries.executiveSummary;
      strategicNarrative = summaries.strategicNarrative;
    } catch (aiError) {
      console.error("AI summary generation failed:", aiError);
      // Fallback summary
      executiveSummary = `Your AI stack scored ${partialResult.stackHealthScore}/100 on the Optivex health index. With $${partialResult.monthlyPotentialSavings}/mo in identified savings, optimizing your stack is a quick win.`;
      strategicNarrative = `Analysis complete. We identified ${partialResult.redundancies.length} redundancy issues and ${partialResult.recommendations.length} actionable recommendations to improve your AI workflow efficiency.`;
    }

    const result = {
      ...partialResult,
      executiveSummary,
      strategicNarrative,
    };

    // After assembling result, save
    await saveAudit(result.id, body.input, result, body.input.companyName, body.input.teamSize);

    const response: AuditResponse = {
      success: true,
      auditId: result.id,
      result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}