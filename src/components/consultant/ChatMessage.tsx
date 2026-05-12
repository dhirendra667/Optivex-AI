"use client";

// ─── components/consultant/ChatMessage.tsx ─────────────────────────────────

import { ChatMessage as ChatMsgType } from "@/types/api";
import { cn } from "@/lib/utils/helpers";

export function ChatMessage({ message }: { message: ChatMsgType }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-none w-6 h-6 rounded-full bg-gradient-ox flex items-center justify-center mt-0.5">
          <span className="text-[8px] font-bold text-white">Ox</span>
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-white/8 text-white ml-auto rounded-tr-sm"
            : "bg-white/4 text-white/85 rounded-tl-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}