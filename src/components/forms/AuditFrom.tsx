"use client";

// ─── components/forms/AuditForm.tsx ────────────────────────────────────────

import { useState } from "react";
import { AuditFormInput, GrowthStage, ToolInput } from "@/types/audit";
import { ToolRow } from "./ToolRow";
import { cn } from "@/lib/utils/helpers";
import { KNOWN_TOOLS } from "@/constants/tools";

interface AuditFormProps {
  onSubmit: (data: AuditFormInput) => void;
  isLoading?: boolean;
}

const INDUSTRIES = [
  "SaaS / Software",
  "E-commerce",
  "Agency / Consulting",
  "Healthcare",
  "Finance / Fintech",
  "Education",
  "Media / Content",
  "Other",
];

const GROWTH_STAGES: { value: GrowthStage; label: string; desc: string }[] = [
  { value: "idea", label: "Idea Stage", desc: "Pre-revenue, exploring" },
  { value: "mvp", label: "MVP", desc: "Early product, first users" },
  { value: "early-growth", label: "Early Growth", desc: "$0–1M ARR" },
  { value: "scaling", label: "Scaling", desc: "$1M–10M ARR" },
  { value: "enterprise", label: "Enterprise", desc: "$10M+ ARR" },
];

const PAIN_POINTS = [
  "Too many tools",
  "Unclear ROI",
  "Team not using tools",
  "Budget overrun",
  "Duplicate workflows",
  "Missing capabilities",
];

const DEFAULT_TOOL: ToolInput = {
  name: "",
  tier: "Pro",
  seats: 1,
  monthlySpend: 20,
  usageLevel: "daily",
  primaryUse: "",
  teamsThatUseIt: [],
};

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AuditFormInput>({
    companyName: "",
    teamSize: 5,
    industry: "",
    primaryUseCase: "",
    tools: [{ ...DEFAULT_TOOL }],
    mainPainPoints: [],
    budget: 200,
    growthStage: "early-growth",
  });

  const updateForm = (updates: Partial<AuditFormInput>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const addTool = () => {
    updateForm({ tools: [...form.tools, { ...DEFAULT_TOOL }] });
  };

  const updateTool = (index: number, updates: Partial<ToolInput>) => {
    const tools = [...form.tools];
    tools[index] = { ...tools[index], ...updates };
    updateForm({ tools });
  };

  const removeTool = (index: number) => {
    updateForm({ tools: form.tools.filter((_, i) => i !== index) });
  };

  const togglePainPoint = (point: string) => {
    const current = form.mainPainPoints;
    updateForm({
      mainPainPoints: current.includes(point)
        ? current.filter((p) => p !== point)
        : [...current, point],
    });
  };

  const steps = ["Team Info", "AI Tools", "Context"];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onSubmit(form);
    } else {
      setStep((s) => s + 1);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.companyName.length > 0 && form.industry;
    if (step === 1) return form.tools.length > 0 && form.tools[0].name.length > 0;
    return true;
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Step indicator */}
      <div className="flex border-b border-white/5">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => i < step && setStep(i)}
            className={cn(
              "flex-1 py-3.5 text-sm font-medium transition-all relative",
              i === step
                ? "text-white"
                : i < step
                ? "text-white/40 hover:text-white/60 cursor-pointer"
                : "text-white/20 cursor-default"
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span
                className={cn(
                  "w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold",
                  i === step
                    ? "bg-white text-black"
                    : i < step
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "bg-white/5 text-white/20"
                )}
              >
                {i < step ? "✓" : i + 1}
              </span>
              {s}
            </span>
            {i === step && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-ox" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {/* Step 0: Team Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Tell us about your team</h3>
              <p className="text-sm text-white/40">This helps us calibrate recommendations for your context.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Company Name</label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={form.companyName}
                  onChange={(e) => updateForm({ companyName: e.target.value })}
                  className="w-full bg-ox-surface-3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Team Size</label>
                <input
                  type="number"
                  min="1"
                  value={form.teamSize}
                  onChange={(e) => updateForm({ teamSize: parseInt(e.target.value) || 1 })}
                  className="w-full bg-ox-surface-3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                  Industry
                </label>

                <select
                  value={form.industry}
                  onChange={(e) => updateForm({ industry: e.target.value })}
                  className="w-full bg-ox-surface-3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                >
                  <option value="" className="bg-[#0B1120] text-white">
                    Select industry
                  </option>

                  {INDUSTRIES.map((ind) => (
                    <option
                      key={ind}
                      value={ind}
                      className="bg-[#0B1120] text-white"
                    >
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Monthly AI Budget</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    value={form.budget}
                    onChange={(e) => updateForm({ budget: parseInt(e.target.value) || 0 })}
                    className="w-full bg-ox-surface-3 border border-white/8 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Growth stage */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Growth Stage</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {GROWTH_STAGES.map((stage) => (
                  <button
                    key={stage.value}
                    onClick={() => updateForm({ growthStage: stage.value })}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all",
                      form.growthStage === stage.value
                        ? "border-blue-500/50 bg-blue-500/10 text-white"
                        : "border-white/6 bg-white/2 text-white/50 hover:border-white/12"
                    )}
                  >
                    <div className="text-xs font-semibold mb-0.5">{stage.label}</div>
                    <div className="text-[10px] opacity-60">{stage.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

       {/* Step 1: Tools */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Your AI tools</h3>
              <p className="text-sm text-white/40">Add every AI tool your team pays for, including free tiers with paid features.</p>
            </div>

            {/* Column headers */}
            {/* <div className="hidden md:grid grid-cols-[minmax(220px,2.4fr)_minmax(140px,1.1fr)_80px_100px_minmax(180px,1.5fr)_40px] gap-3 text-xs font-medium text-white/30 uppercase tracking-wide px-1">
              <span>Tool Name</span>
              <span>Tier/Plan</span>
              <span>Seats</span>
              <span>$/Month</span>
              <span>Usage</span>
              <span />
            </div> */}
            {/* Column headers */}
            <div className="hidden md:grid grid-cols-[minmax(180px,2fr)_minmax(120px,1fr)_70px_110px_170px_36px] gap-3 text-xs font-medium text-white/30 uppercase tracking-wide px-1">
              <span className="pl-1">
                Tool Name
              </span>
              <span className="pl-2">
                Tier/Plan
              </span>

              <span className="text-center">
                Seats
              </span>

              <span className="text-center pl-1">
                $/Month
              </span>

              <span className="pl-3">
                Usage
              </span>

              <span />
            </div>

            <div className="space-y-2">
              {form.tools.map((tool, i) => (
                <ToolRow
                  key={i}
                  index={i}
                  tool={tool}
                  onChange={(updates) => updateTool(i, updates)}
                  onRemove={() => removeTool(i)}
                  canRemove={form.tools.length > 1}
                />
              ))}
            </div>

            <button
              onClick={addTool}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/12 text-white/40 hover:text-white/70 hover:border-white/20 transition-all text-sm w-full justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add another tool
            </button>

            {/* Quick add from known tools */}
            <div>
              <p className="text-xs text-white/30 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {KNOWN_TOOLS.slice(0, 6).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => addTool()}
                    className="text-xs px-2.5 py-1 rounded-lg border border-white/6 bg-white/2 text-white/40 hover:text-white/70 hover:border-white/12 transition-all"
                  >
                    + {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Step 2: Context */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Workflow context</h3>
              <p className="text-sm text-white/40">Help us understand how AI fits into your workflow.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Primary AI use case</label>
              <textarea
                placeholder="e.g. We use AI primarily for coding, content drafting, and customer support..."
                value={form.primaryUseCase}
                onChange={(e) => updateForm({ primaryUseCase: e.target.value })}
                rows={3}
                className="w-full bg-ox-surface-3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Main pain points</label>
              <div className="flex flex-wrap gap-2">
                {PAIN_POINTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePainPoint(p)}
                    className={cn(
                      "text-sm px-3 py-1.5 rounded-lg border transition-all",
                      form.mainPainPoints.includes(p)
                        ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                        : "border-white/8 bg-white/2 text-white/50 hover:border-white/16"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-xl bg-ox-surface-3 border border-white/6">
              <p className="text-xs text-white/30 uppercase tracking-wide mb-3">Audit Summary</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Team Size", value: form.teamSize },
                  { label: "AI Tools", value: form.tools.length },
                  { label: "Monthly Spend", value: `$${form.tools.reduce((s, t) => s + t.monthlySpend, 0)}` },
                  { label: "Budget", value: `$${form.budget}/mo` },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-white/30">{item.label}</p>
                    <p className="text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2.5 text-sm text-white/40 hover:text-white/70 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
              canProceed() && !isLoading
                ? "bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                Analyzing...
              </>
            ) : isLastStep ? (
              <>
                Run Audit
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            ) : (
              "Continue →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
