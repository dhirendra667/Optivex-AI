"use client";

// ─── components/audit/AuditDashboard.tsx ───────────────────────────────────

import { useState } from "react";
import { AuditResult } from "@/types/audit";
import { StackHealthScore } from "./StackHealthScore";
import { AISummary } from "./AISummary";
import { RecommendationCard } from "./RecommendationCard";
import { ToolCard } from "./ToolCard";
import { SpendBreakdownChart } from "./SpendBreakdownChart";
import { SavingsComparisonChart } from "./SavingsComparisonChart";
import { ToolOverlapChart } from "./ToolOverlapChart";
import { formatCurrency, cn } from "@/lib/utils/helpers";

interface AuditDashboardProps {
  result: AuditResult;
  onCaptureLead?: () => void;
}

const TABS = ["Overview", "Tools", "Recommendations", "Charts"] as const;
type Tab = typeof TABS[number];

export function AuditDashboard({ result, onCaptureLead }: AuditDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/audit/${result.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs text-white/40 uppercase tracking-wide font-medium">
              Audit Complete
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {result.input.companyName
              ? `${result.input.companyName} — AI Stack Audit`
              : "Your AI Stack Audit"}
          </h2>
          <p className="text-sm text-white/40 mt-0.5">
            {result.input.tools.length} tools analyzed ·{" "}
            {new Date(result.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/8 text-white/60 text-sm hover:border-white/16 hover:text-white/80 transition-all"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 1H3a1 1 0 00-1 1v9M5 4h6a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                Share Report
              </>
            )}
          </button>

          {onCaptureLead && (
            <button
              onClick={onCaptureLead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Health Score",
            value: `${result.stackHealthScore}/100`,
            sub: "Stack quality",
            color: result.stackHealthScore >= 70 ? "#22C55E" : result.stackHealthScore >= 50 ? "#F59E0B" : "#EF4444",
          },
          {
            label: "Monthly Savings",
            value: formatCurrency(result.monthlyPotentialSavings),
            sub: `${result.savingsPercentage}% of spend`,
            color: "#14B8A6",
          },
          {
            label: "Annual Savings",
            value: formatCurrency(result.annualPotentialSavings),
            sub: "If optimized now",
            color: "#14B8A6",
          },
          {
            label: "Redundancies",
            value: result.redundancies.length.toString(),
            sub: `${result.redundancies.filter((r) => r.severity === "critical").length} critical`,
            color: result.redundancies.length > 3 ? "#EF4444" : result.redundancies.length > 1 ? "#F59E0B" : "#22C55E",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card rounded-2xl p-4">
            <p className="text-xs text-white/30 mb-2">{kpi.label}</p>
            <p
              className="text-2xl font-bold mb-0.5"
              style={{ color: kpi.color }}
            >
              {kpi.value}
            </p>
            <p className="text-xs text-white/30">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/3 border border-white/5 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <StackHealthScore
              score={result.stackHealthScore}
              efficiencyScore={result.efficiencyScore}
              coverageScore={result.coverageScore}
              redundancyScore={result.redundancyScore}
            />
          </div>
          <div className="lg:col-span-2">
            <AISummary
              executiveSummary={result.executiveSummary}
              strategicNarrative={result.strategicNarrative}
              companyName={result.input.companyName}
            />
          </div>

          {/* Top 3 recommendations preview */}
          <div className="lg:col-span-3">
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
              Top Recommendations
            </p>
            <div className="space-y-3">
              {result.recommendations.slice(0, 3).map((rec, i) => (
                <RecommendationCard key={rec.id} recommendation={rec} index={i} />
              ))}
              {result.recommendations.length > 3 && (
                <button
                  onClick={() => setActiveTab("Recommendations")}
                  className="w-full py-3 rounded-xl border border-dashed border-white/8 text-sm text-white/40 hover:text-white/60 hover:border-white/14 transition-all"
                >
                  +{result.recommendations.length - 3} more recommendations →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Tools" && (
        <div className="space-y-4">
          <p className="text-sm text-white/40">
            Analysis of {result.toolAnalyses.length} tools in your stack.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.toolAnalyses.map((analysis) => (
              <ToolCard key={analysis.toolName} analysis={analysis} />
            ))}
          </div>

          {/* Redundancy list */}
          {result.redundancies.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
                Detected Redundancies
              </p>
              <div className="space-y-3">
                {result.redundancies.map((r) => {
                  const severityColor = {
                    critical: "#EF4444",
                    high: "#F97316",
                    medium: "#F59E0B",
                    low: "#6B7280",
                  }[r.severity];

                  return (
                    <div
                      key={r.id}
                      className="glass-card rounded-xl p-4 border-l-2"
                      style={{ borderLeftColor: severityColor }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs font-semibold px-1.5 py-0.5 rounded capitalize"
                              style={{
                                color: severityColor,
                                background: `${severityColor}15`,
                              }}
                            >
                              {r.severity}
                            </span>
                            <span className="text-xs text-white/30 capitalize">
                              {r.type.replace(/-/g, " ")}
                            </span>
                          </div>
                          <p className="text-sm text-white/70">{r.description}</p>
                          <p className="text-xs text-white/40 mt-1">
                            → {r.suggestedAction}
                          </p>
                        </div>
                        {r.estimatedMonthlySavings > 0 && (
                          <div className="flex-none text-right">
                            <p className="text-xs text-white/30">Save</p>
                            <p className="text-sm font-bold text-teal-400">
                              {formatCurrency(r.estimatedMonthlySavings)}/mo
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "Recommendations" && (
        <div className="space-y-3">
          <p className="text-sm text-white/40">
            {result.recommendations.length} actionable recommendations, ordered
            by impact.
          </p>
          {result.recommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} recommendation={rec} index={i} />
          ))}
        </div>
      )}

      {activeTab === "Charts" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendBreakdownChart
            data={result.spendBreakdown}
            totalMonthlySpend={result.currentMonthlySpend}
          />
          <SavingsComparisonChart
            currentMonthlySpend={result.currentMonthlySpend}
            optimizedMonthlySpend={result.optimizedMonthlySpend}
            monthlyPotentialSavings={result.monthlyPotentialSavings}
            annualPotentialSavings={result.annualPotentialSavings}
            savingsPercentage={result.savingsPercentage}
          />
          <div className="lg:col-span-2">
            <ToolOverlapChart matrix={result.overlapMatrix} />
          </div>
        </div>
      )}
    </div>
  );
}
