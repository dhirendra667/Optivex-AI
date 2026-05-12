// ─── app/api/extract/route.ts ──────────────────────────────────────────────
// POST /api/extract — conversational AI that extracts stack info

import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/ai/gemini";
import { SYSTEM_CONSULTANT } from "@/lib/ai/prompts";
import { ExtractRequest, ExtractResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body: ExtractRequest = await req.json();

    const history = body.conversationHistory ?? [];
    const messages = [
      ...history,
      { role: "user" as const, content: body.message },
    ];

    const reply = await callGemini({
      system: SYSTEM_CONSULTANT,
      messages,
      maxTokens: 600,
    });

    const isComplete = reply.includes("[READY_FOR_AUDIT]");
    const cleanReply = reply.replace("[READY_FOR_AUDIT]", "").trim();

    return NextResponse.json<ExtractResponse>({
      success: true,
      reply: cleanReply,
      isComplete,
    });
  } catch (error) {
    console.error("Extract API error:", error);
    return NextResponse.json<ExtractResponse>(
      {
        success: false,
        reply: "I encountered an issue. Please try again.",
        isComplete: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
