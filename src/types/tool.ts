// ─── types/tool.ts ─────────────────────────────────────────────────────────

export interface AITool {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  vendor: string;
  logoUrl?: string;
  color: string;
  capabilities: Capability[];
  tiers: PricingTier[];
  description: string;
}

export type ToolCategory =
  | "coding"
  | "writing"
  | "research"
  | "image"
  | "video"
  | "audio"
  | "data"
  | "productivity"
  | "customer-support"
  | "general-llm";

export type Capability =
  | "code-generation"
  | "code-completion"
  | "code-review"
  | "chat"
  | "writing"
  | "summarization"
  | "research"
  | "web-search"
  | "image-generation"
  | "image-editing"
  | "voice"
  | "data-analysis"
  | "document-qa"
  | "api-access"
  | "agents"
  | "fine-tuning"
  | "multimodal";

export interface PricingTier {
  name: string;
  pricePerMonth: number;
  seats?: number; // null = unlimited or per-seat
  pricePerSeat?: number;
}