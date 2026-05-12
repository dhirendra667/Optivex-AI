// ─── app/audit/[id]/page.tsx ───────────────────────────────────────────────
// Shareable audit result page (SSG-ready, reads from Supabase in prod)

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditDashboard } from "@/components/audit/AuditDashboard";
import { Navbar } from "@/components/landing/Navbar";
import { MOCK_AUDIT_RESULT } from "@/lib/charts/chart-data";
import { getAudit } from "@/lib/db/supabase";
import { AuditResult } from "@/types/audit"; 

interface PageProps {
  params: { id: string };
}

async function getAuditResult(id: string) {
  if (id === "demo") return MOCK_AUDIT_RESULT;
  const row = await getAudit(id);        
  if (!row) return null;
  return row.result as AuditResult;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getAuditResult(params.id);
  if (!result) return { title: "Audit Not Found" };

  return {
    title: `${result.input.companyName || "AI Stack"} Audit — Optivex AI`,
    description: `Stack Health Score: ${result.stackHealthScore}/100. Potential savings: $${result.annualPotentialSavings}/yr`,
  };
}

export default async function AuditResultPage({ params }: PageProps) {
  const result = await getAuditResult(params.id);

  if (!result) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-ox-surface text-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Shared report banner */}
          <div className="mb-8 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1z" stroke="#60A5FA" strokeWidth="1.2"/>
              <path d="M8 7v4M8 5h.01" stroke="#60A5FA" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <p className="text-sm text-blue-300/80">
              This is a shared audit report.{" "}
              <a href="/" className="underline hover:text-blue-200 transition-colors">
                Run your own free audit →
              </a>
            </p>
          </div>

          <AuditDashboard result={result} />
        </div>
      </div>
    </div>
  );
}