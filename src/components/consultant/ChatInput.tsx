"use client";

// ─── components/consultant/ChatInput.tsx ───────────────────────────────────

import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your AI stack..."
        disabled={isLoading}
        rows={1}
        className="flex-1 bg-ox-surface-3 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors resize-none disabled:opacity-50"
        style={{ maxHeight: "120px" }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || isLoading}
        className="flex-none w-9 h-9 rounded-xl bg-white/8 hover:bg-white/14 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14 8L2 2l3 6-3 6 12-6z" fill="currentColor" className="text-white/70" />
        </svg>
      </button>
    </div>
  );
}
