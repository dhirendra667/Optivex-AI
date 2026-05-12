// ─── app/api/leads/route.ts ────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { LeadRequest, LeadResponse } from "@/types/api";
import { saveLead } from "@/lib/db/supabase";

export async function POST(req: NextRequest) {
  try {
    const body: LeadRequest = await req.json();

    if (!body.email) {
      return NextResponse.json<LeadResponse>(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<LeadResponse>(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Save lead to Supabase
    await saveLead(body.email, body.name, body.company, body.auditId);

    // console.log("Lead saved:", { email: body.email, name: body.name, company: body.company, auditId: body.auditId });

    return NextResponse.json<LeadResponse>({ success: true });
  } catch (error) {
    console.error("Leads API error:", error);
    return NextResponse.json<LeadResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}