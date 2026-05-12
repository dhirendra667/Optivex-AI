// ─── types/api.ts ──────────────────────────────────────────────────────────

import { AuditFormInput, AuditResult } from "./audit";

export interface AuditRequest {
  input: AuditFormInput;
}

export interface AuditResponse {
  success: boolean;
  auditId: string;
  result: AuditResult;
  error?: string;
}

export interface ExtractRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ExtractResponse {
  success: boolean;
  extracted?: Partial<AuditFormInput>;
  reply: string;
  isComplete: boolean;
  error?: string;
}

export interface SummaryRequest {
  auditResult: AuditResult;
}

export interface SummaryResponse {
  success: boolean;
  executiveSummary: string;
  strategicNarrative: string;
  error?: string;
}

export interface LeadRequest {
  email: string;
  name: string;
  company?: string;
  auditId?: string;
}

export interface LeadResponse {
  success: boolean;
  error?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}