// ─── lib/db/supabase.ts ────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env vars missing — database features disabled");
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder"
);

// ── Types for Supabase tables ──────────────────────────────────────────────

export interface AuditRow {
  id: string;
  created_at: string;
  input: object;
  result: object;
  company_name?: string;
  team_size?: number;
}

export interface LeadRow {
  id: string;
  created_at: string;
  email: string;
  name: string;
  company?: string;
  audit_id?: string;
}

// ── DB helpers ─────────────────────────────────────────────────────────────

export async function saveAudit(
  id: string,
  input: object,
  result: object,
  companyName?: string,
  teamSize?: number
) {
  const { error } = await supabase.from("audits").insert({
    id,
    input,
    result,
    company_name: companyName,
    team_size: teamSize,
  });

  if (error) console.error("Error saving audit:", error);
}

export async function getAudit(id: string) {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AuditRow;
}

export async function saveLead(
  email: string,
  name: string,
  company?: string,
  auditId?: string
) {
  const { error } = await supabase.from("leads").insert({
    email,
    name,
    company,
    audit_id: auditId,
  });

  if (error) console.error("Error saving lead:", error);
}
