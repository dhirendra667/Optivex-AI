// ─── lib/utils/helpers.ts ──────────────────────────────────────────────────

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Simple nano-ID (no crypto dependency) */
export function nanoid(size = 10): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < size; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/** Format USD */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format large numbers */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Score to label */
export function scoreToLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 80) return { label: "Excellent", color: "#22C55E" };
  if (score >= 65) return { label: "Good", color: "#84CC16" };
  if (score >= 50) return { label: "Fair", color: "#F59E0B" };
  if (score >= 35) return { label: "Poor", color: "#F97316" };
  return { label: "Critical", color: "#EF4444" };
}

/** Verdict badge config */
export function verdictConfig(verdict: string): {
  label: string;
  color: string;
  bg: string;
} {
  switch (verdict) {
    case "keep":
      return { label: "Keep", color: "#22C55E", bg: "rgba(34,197,94,0.12)" };
    case "optimize":
      return { label: "Optimize", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" };
    case "replace":
      return { label: "Replace", color: "#F97316", bg: "rgba(249,115,22,0.12)" };
    case "eliminate":
      return { label: "Eliminate", color: "#EF4444", bg: "rgba(239,68,68,0.12)" };
    default:
      return { label: verdict, color: "#6B7280", bg: "rgba(107,114,128,0.12)" };
  }
}

/** Priority badge config */
export function priorityConfig(priority: string): {
  label: string;
  color: string;
} {
  switch (priority) {
    case "critical":
      return { label: "Critical", color: "#EF4444" };
    case "high":
      return { label: "High", color: "#F97316" };
    case "medium":
      return { label: "Medium", color: "#F59E0B" };
    default:
      return { label: "Low", color: "#6B7280" };
  }
}

/** Truncate string */
export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + "…" : str;
}

/** Debounce */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}