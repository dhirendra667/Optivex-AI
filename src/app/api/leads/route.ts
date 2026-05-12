// ─── app/api/leads/route.ts ────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { LeadRequest, LeadResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body: LeadRequest = await req.json();

    if (!body.email) {
      return NextResponse.json<LeadResponse>(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // In production: save to Supabase + trigger Resend welcome email
    // For now, log and return success
    console.log("New lead:", { email: body.email, name: body.name, company: body.company, auditId: body.auditId });

    // TODO: supabase.from("leads").insert({ email, name, company, audit_id, created_at })
    // TODO: resend.emails.send({ to: email, subject: "Your Optivex Report", ... })

    return NextResponse.json<LeadResponse>({ success: true });
  } catch (error) {
    console.error("Leads API error:", error);
    return NextResponse.json<LeadResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}