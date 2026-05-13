"use client";

// ─── components/audit/AISummary.tsx ────────────────────────────────────────

import { Sparkles } from "lucide-react"

interface AISummaryProps {
  executiveSummary: string;
  strategicNarrative: string;
  companyName: string;
}

export function AISummary({
  executiveSummary,
  strategicNarrative,
  companyName,
}: AISummaryProps) {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-ox flex items-center justify-center flex-none">
          {/* <span className="text-xs font-bold text-white">Ox</span> */}
          <Sparkles className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Optivex Analysis</p>
          <p className="text-xs text-white/40">AI-generated strategic report for {companyName}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/4 border border-white/6">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L7.5 4.5H11L8 6.5L9.5 10L6 8L2.5 10L4 6.5L1 4.5H4.5L6 1Z" fill="#F59E0B" opacity="0.8"/>
          </svg>
          <span className="text-xs text-white/50">Gemini AI</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="relative mb-6">
        <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-gradient-ox rounded-full" />
        <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2 pl-4">
          Executive Summary
        </p>
        <p className="text-white/85 leading-relaxed text-base pl-4">
          {executiveSummary}
        </p>
      </div>

      {/* Strategic Narrative */}
      {strategicNarrative && (
        <div>
          <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
            Strategic Analysis
          </p>
          <div className="space-y-3">
            {strategicNarrative.split("\n\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-white/60 leading-relaxed text-sm">
                {para}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}