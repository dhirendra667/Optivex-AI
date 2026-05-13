"use client";

// ─── components/lead-capture/LeadCaptureModal.tsx ──────────────────────────

import { useState } from "react";
// import { cn } from "@/lib/utils/helpers";

interface LeadCaptureModalProps {
  auditId?: string;
  annualSavings?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function LeadCaptureModal({
  auditId,
  annualSavings,
  onClose,
  onSuccess,
}: LeadCaptureModalProps) {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.email || !form.name) {
      setError("Name and email are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, auditId }),
      });
      const data = await res.json();

      if (data.success) {
        onSuccess();
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative glass-card rounded-2xl p-8 w-full max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.6)] border border-white/8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-ox flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 1l2.5 7.5H21L15 13l2.5 7.5L11 17l-6.5 3.5L7 13 1 8.5h7.5L11 1z" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Get your full report
          </h3>
          {annualSavings && annualSavings > 0 ? (
            <p className="text-sm text-white/50">
              We&apos;ve identified{" "}
              <span className="text-teal-400 font-semibold">
                ${annualSavings.toLocaleString()}/yr
              </span>{" "}
              in potential savings. Enter your email to receive the complete
              audit report.
            </p>
          ) : (
            <p className="text-sm text-white/50">
              Enter your email to receive the complete audit report and
              optimization roadmap.
            </p>
          )}
        </div>

        {/* Form */}
        <div className="space-y-3 mb-5">
          {[
            { key: "name", placeholder: "Your name", type: "text" },
            { key: "email", placeholder: "Work email", type: "email" },
            { key: "company", placeholder: "Company (optional)", type: "text" },
          ].map(({ key, placeholder, type }) => (
            <input
              key={key}
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full bg-ox-surface-3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
              Sending report...
            </>
          ) : (
            "Get Full Report →"
          )}
        </button>

        <p className="text-center text-xs text-white/25 mt-4">
          No spam. Just your audit results.
        </p>
      </div>
    </div>
  );
}