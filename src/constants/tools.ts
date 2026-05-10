// ─── constants/tools.ts ────────────────────────────────────────────────────
// Known AI tools registry with capabilities and pricing

import { AITool } from "@/types/tool";

export const KNOWN_TOOLS: AITool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    slug: "chatgpt",
    vendor: "OpenAI",
    category: "general-llm",
    color: "#10A37F",
    description: "General-purpose AI assistant by OpenAI",
    capabilities: [
      "chat", "writing", "summarization", "code-generation",
      "data-analysis", "document-qa", "image-generation", "web-search",
    ],
    tiers: [
      { name: "Free", pricePerMonth: 0 },
      { name: "Plus", pricePerMonth: 20 },
      { name: "Team", pricePerMonth: 0, pricePerSeat: 30 },
      { name: "Enterprise", pricePerMonth: 0, pricePerSeat: 60 },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    slug: "claude",
    vendor: "Anthropic",
    category: "general-llm",
    color: "#D4A574",
    description: "Advanced AI assistant by Anthropic",
    capabilities: [
      "chat", "writing", "summarization", "code-generation",
      "document-qa", "research", "agents", "api-access",
    ],
    tiers: [
      { name: "Free", pricePerMonth: 0 },
      { name: "Pro", pricePerMonth: 20 },
      { name: "Team", pricePerMonth: 0, pricePerSeat: 30 },
      { name: "Enterprise", pricePerMonth: 0, pricePerSeat: 60 },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    slug: "cursor",
    vendor: "Anysphere",
    category: "coding",
    color: "#7C3AED",
    description: "AI-first code editor",
    capabilities: [
      "code-generation", "code-completion", "code-review", "chat",
    ],
    tiers: [
      { name: "Free", pricePerMonth: 0 },
      { name: "Pro", pricePerMonth: 20 },
      { name: "Business", pricePerMonth: 0, pricePerSeat: 40 },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    slug: "github-copilot",
    vendor: "GitHub/Microsoft",
    category: "coding",
    color: "#2D333B",
    description: "AI pair programmer integrated into IDEs",
    capabilities: [
      "code-generation", "code-completion", "code-review", "chat",
    ],
    tiers: [
      { name: "Individual", pricePerMonth: 10 },
      { name: "Business", pricePerMonth: 0, pricePerSeat: 19 },
      { name: "Enterprise", pricePerMonth: 0, pricePerSeat: 39 },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    slug: "perplexity",
    vendor: "Perplexity AI",
    category: "research",
    color: "#20B2AA",
    description: "AI-powered search and research tool",
    capabilities: [
      "research", "web-search", "summarization", "chat",
    ],
    tiers: [
      { name: "Free", pricePerMonth: 0 },
      { name: "Pro", pricePerMonth: 20 },
      { name: "Enterprise", pricePerMonth: 0, pricePerSeat: 40 },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    slug: "gemini",
    vendor: "Google",
    category: "general-llm",
    color: "#4285F4",
    description: "Google's multimodal AI assistant",
    capabilities: [
      "chat", "writing", "summarization", "code-generation",
      "multimodal", "research", "web-search",
    ],
    tiers: [
      { name: "Free", pricePerMonth: 0 },
      { name: "Advanced", pricePerMonth: 22 },
      { name: "Business", pricePerMonth: 0, pricePerSeat: 30 },
    ],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    slug: "midjourney",
    vendor: "Midjourney",
    category: "image",
    color: "#FF6B6B",
    description: "AI image generation tool",
    capabilities: ["image-generation"],
    tiers: [
      { name: "Basic", pricePerMonth: 10 },
      { name: "Standard", pricePerMonth: 30 },
      { name: "Pro", pricePerMonth: 60 },
      { name: "Mega", pricePerMonth: 120 },
    ],
  },
  {
    id: "dalle",
    name: "DALL-E",
    slug: "dalle",
    vendor: "OpenAI",
    category: "image",
    color: "#10A37F",
    description: "OpenAI's image generation (via ChatGPT)",
    capabilities: ["image-generation", "image-editing"],
    tiers: [{ name: "Included in ChatGPT Plus", pricePerMonth: 0 }],
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    slug: "notion-ai",
    vendor: "Notion",
    category: "productivity",
    color: "#000000",
    description: "AI writing and summarization within Notion",
    capabilities: ["writing", "summarization", "chat", "document-qa"],
    tiers: [
      { name: "Add-on", pricePerMonth: 0, pricePerSeat: 10 },
    ],
  },
  {
    id: "grammarly",
    name: "Grammarly",
    slug: "grammarly",
    vendor: "Grammarly",
    category: "writing",
    color: "#15C39A",
    description: "AI-powered writing assistant",
    capabilities: ["writing"],
    tiers: [
      { name: "Free", pricePerMonth: 0 },
      { name: "Premium", pricePerMonth: 30 },
      { name: "Business", pricePerMonth: 0, pricePerSeat: 25 },
    ],
  },
  {
    id: "jasper",
    name: "Jasper",
    slug: "jasper",
    vendor: "Jasper AI",
    category: "writing",
    color: "#FC5200",
    description: "AI content creation platform for marketing",
    capabilities: ["writing", "summarization", "chat"],
    tiers: [
      { name: "Creator", pricePerMonth: 49 },
      { name: "Teams", pricePerMonth: 125 },
      { name: "Business", pricePerMonth: 0 },
    ],
  },
  {
    id: "v0",
    name: "v0",
    slug: "v0",
    vendor: "Vercel",
    category: "coding",
    color: "#000000",
    description: "AI UI generation tool by Vercel",
    capabilities: ["code-generation", "chat"],
    tiers: [
      { name: "Free", pricePerMonth: 0 },
      { name: "Premium", pricePerMonth: 20 },
    ],
  },
  {
    id: "runway",
    name: "Runway",
    slug: "runway",
    vendor: "Runway",
    category: "video",
    color: "#6B44F6",
    description: "AI video generation and editing",
    capabilities: ["image-generation"],
    tiers: [
      { name: "Basic", pricePerMonth: 15 },
      { name: "Standard", pricePerMonth: 35 },
      { name: "Pro", pricePerMonth: 95 },
    ],
  },
];

export const TOOL_CAPABILITY_LABELS: Record<string, string> = {
  "code-generation": "Code Generation",
  "code-completion": "Code Completion",
  "code-review": "Code Review",
  "chat": "Chat / Q&A",
  "writing": "Writing",
  "summarization": "Summarization",
  "research": "Research",
  "web-search": "Web Search",
  "image-generation": "Image Generation",
  "image-editing": "Image Editing",
  "voice": "Voice",
  "data-analysis": "Data Analysis",
  "document-qa": "Document Q&A",
  "api-access": "API Access",
  "agents": "AI Agents",
  "fine-tuning": "Fine-tuning",
  "multimodal": "Multimodal",
};

export const TOOL_COLORS: Record<string, string> = {
  chatgpt: "#10A37F",
  claude: "#D4A574",
  cursor: "#7C3AED",
  "github-copilot": "#58A6FF",
  perplexity: "#20B2AA",
  gemini: "#4285F4",
  midjourney: "#FF6B6B",
  "notion-ai": "#808080",
  grammarly: "#15C39A",
  jasper: "#FC5200",
  v0: "#888888",
  runway: "#6B44F6",
};

export function findTool(name: string): AITool | undefined {
  const normalized = name.toLowerCase().replace(/\s+/g, "-");
  return KNOWN_TOOLS.find(
    (t) =>
      t.slug === normalized ||
      t.name.toLowerCase() === name.toLowerCase() ||
      t.slug.includes(normalized) ||
      normalized.includes(t.slug)
  );
}
