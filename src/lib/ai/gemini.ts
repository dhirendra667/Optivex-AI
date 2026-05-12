// ─── lib/ai/gemini.ts ──────────────────────────────────────────────────────
// Free tier: 15 RPM, 1M tokens/day on gemini-1.5-flash
// Get your free API key at: https://aistudio.google.com/app/apikey

import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "Missing GEMINI_API_KEY — get a free key at https://aistudio.google.com/app/apikey"
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// gemini-1.5-flash: free tier, fast, 1M token context window
export const GEMINI_MODEL = "gemini-1.5-flash";

/**
 * Unified call function — same interface as the old callClaude()
 * so all callers work without changes.
 */
export async function callGemini(params: {
  system: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
}): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: params.system,
    generationConfig: {
      maxOutputTokens: params.maxTokens ?? 1500,
      temperature: 0.7,
    },
  });

  // Convert message history to Gemini's format
  // Gemini uses "model" instead of "assistant"
  const history = params.messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = params.messages[params.messages.length - 1];

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;

  return response.text();
}

// Keep a named export alias so any file that imported callClaude still works
export { callGemini as callClaude };