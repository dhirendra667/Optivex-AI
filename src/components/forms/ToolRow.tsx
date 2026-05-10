"use client";

// ─── components/forms/ToolRow.tsx ──────────────────────────────────────────

import { ToolInput, UsageLevel } from "@/types/audit";
import { KNOWN_TOOLS } from "@/constants/tools";
import { cn } from "@/lib/utils";

interface ToolRowProps {
  index: number;
  tool: ToolInput;
  onChange: (updates: Partial<ToolInput>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const USAGE_OPTIONS: { value: UsageLevel; label: string; color: string }[] = [
  { value: "daily", label: "Daily", color: "#22C55E" },
  { value: "weekly", label: "Weekly", color: "#84CC16" },
  { value: "occasional", label: "Occasional", color: "#F59E0B" },
  { value: "rarely", label: "Rarely", color: "#EF4444" },
];

export function ToolRow({ index, tool, onChange, onRemove, canRemove }: ToolRowProps) {
  const knownTool = KNOWN_TOOLS.find(
    (t) => t.name.toLowerCase() === tool.name.toLowerCase()
  );

  return (
    <div className="group grid grid-cols-1 md:grid-cols-[2fr_1fr_0.8fr_0.8fr_1.5fr_auto] gap-2 md:gap-3 p-3 rounded-xl border border-white/5 bg-white/2 hover:border-white/10 transition-all">
      {/* Tool name with autocomplete hint */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tool name (e.g. ChatGPT)"
          value={tool.name}
          onChange={(e) => onChange({ name: e.target.value })}
          list={`tools-${index}`}
          className="w-full bg-ox-surface-3 border border-white/6 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
        />
        <datalist id={`tools-${index}`}>
          {KNOWN_TOOLS.map((t) => (
            <option key={t.id} value={t.name} />
          ))}
        </datalist>
        {knownTool && (
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: knownTool.color }}
            title="Known tool"
          />
        )}
      </div>

      {/* Tier */}
      <input
        type="text"
        placeholder="Plan/Tier"
        value={tool.tier}
        onChange={(e) => onChange({ tier: e.target.value })}
        className="bg-ox-surface-3 border border-white/6 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
      />

      {/* Seats */}
      <input
        type="number"
        min="1"
        value={tool.seats}
        onChange={(e) => onChange({ seats: parseInt(e.target.value) || 1 })}
        className="bg-ox-surface-3 border border-white/6 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/40 transition-colors"
      />

      {/* Monthly spend */}
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs">$</span>
        <input
          type="number"
          min="0"
          value={tool.monthlySpend}
          onChange={(e) => onChange({ monthlySpend: parseInt(e.target.value) || 0 })}
          className="w-full bg-ox-surface-3 border border-white/6 rounded-lg pl-6 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/40 transition-colors"
        />
      </div>

      {/* Usage level */}
      <div className="flex gap-1">
        {USAGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ usageLevel: opt.value })}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
              tool.usageLevel === opt.value
                ? "text-white"
                : "text-white/25 hover:text-white/50"
            )}
            style={
              tool.usageLevel === opt.value
                ? { background: `${opt.color}20`, color: opt.color, border: `1px solid ${opt.color}40` }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }
            }
            title={opt.label}
          >
            {opt.label.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        disabled={!canRemove}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all self-center",
          canRemove
            ? "text-white/20 hover:text-red-400 hover:bg-red-500/10"
            : "opacity-0 pointer-events-none"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M3 3.5l.667 7.5a1 1 0 001 .9h4.666a1 1 0 001-.9L11 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
