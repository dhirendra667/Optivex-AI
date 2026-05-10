"use client";

// ─── components/audit/AuditSection.tsx ─────────────────────────────────────

import { useState } from "react";
import { AuditForm } from "@/components/forms/AuditFrom";
import { AuditFormInput, AuditResult } from "@/types/audit";
import { cn } from "@/lib/utils/helpers";

type Mode = "form" | "consultant";

export function AuditSection() {
  const [mode, setMode] = useState<Mode>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [error, setError] = useState("");

  // ── Audit submission ──────────────────────────────────────────────────────
  async function runAudit(input: AuditFormInput) {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();

      if (data.success) {
        setAuditResult(data.result);
        setTimeout(
          () => document.getElementById("audit-result")?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      } else {
        setError(data.error ?? "Audit failed — please try again.");
      }
    } catch {
      setError("Network error — please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  function reset() {
    setAuditResult(null);
    setLeadCaptured(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Input section ─────────────────────────────────────────────────── */}
      {!auditResult && (
        <section id="audit" className="relative py-24">
          {/* Subtle background */}
          <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <SectionHeader />
            <ModeToggle mode={mode} onChange={setMode} />

            {mode === "form" ? (
              <AuditForm onSubmit={runAudit} isLoading={isLoading} />
            ) : (
              "consult"
            )}

            {error && <ErrorBanner message={error} />}
          </div>
        </section>
      )}

      {/* ── Results section ───────────────────────────────────────────────── */}
      {auditResult && (
        <section id="audit-result" className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={reset}
                className="text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                ← Run another audit
              </button>
            </div>

          </div>
        </section>
      )}

    </>
  );
}

// ── Small sub-components (keep file self-contained) ──────────────────────────

function SectionHeader() {
  return (
    <div className="text-center mb-12">
      <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-4">
        Free AI Stack Audit
      </p>
      <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
        Analyze your AI stack now.
      </h2>
      <p className="text-white/50 max-w-xl mx-auto">
        Choose how you'd like to share your stack — structured form or a quick
        conversation with our AI consultant.
      </p>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex gap-1 p-1.5 rounded-2xl bg-white/3 border border-white/6">
        {(["form", "consultant"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
              mode === m
                ? "bg-white/10 text-white border border-white/8"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {m === "form" ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Structured Form
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 10.5C2 11.3 2.7 12 3.5 12h7c.8 0 1.5-.7 1.5-1.5v-7C12 2.7 11.3 2 10.5 2h-7C2.7 2 2 2.7 2 3.5v7z" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="10.5" cy="10.5" r="2.5" fill="#14B8A6" />
                </svg>
                AI Consultant
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
      {message}
    </div>
  );
}