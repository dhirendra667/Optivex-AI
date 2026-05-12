"use client";

// ─── components/consultant/ConsultantPanel.tsx ─────────────────────────────

import { useState, useRef, useEffect } from "react";
import { ChatMessage as ChatMsg } from "@/types/api";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { CONSULTANT_INTRO } from "@/lib/ai/prompts";
import { AuditFormInput } from "@/types/audit";
import { Sparkles } from "lucide-react"

interface ConsultantPanelProps {
  onReadyForAudit: (data: Partial<AuditFormInput>) => void;
}

const INITIAL_MESSAGES: ChatMsg[] = [
  { role: "assistant", content: CONSULTANT_INTRO },
];

export function ConsultantPanel({ onReadyForAudit }: ConsultantPanelProps) {
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMsg = { role: "user", content };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);

        if (data.isComplete && data.extracted) {
          onReadyForAudit(data.extracted);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full bg-gradient-ox animate-glow-pulse" />
          <div className="absolute inset-0.5 rounded-full bg-ox-surface-2 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-violet-400" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Optivex Consultant</p>
          <p className="text-xs text-white/40">AI-powered stack analyst</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400" />
          </span>
          <span className="text-xs text-white/30">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-ox flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-violet-400" />
            </div>
            <div className="flex gap-1 px-3 py-2 rounded-xl bg-white/4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-4">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
