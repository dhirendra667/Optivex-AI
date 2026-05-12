# DEVLOG.md — Optivex AI Build Log

---

## Day 1 — 2026-05-07

**Hours worked:** 4

**What I did:**
Received the assignment and spent the day reading it carefully — all 12 pages, multiple times. This isn't a straightforward coding task; it's a product build with entrepreneurial requirements baked into the rubric, so I didn't want to start coding before I understood what I was actually being evaluated on.

Key observation from reading: entrepreneurial thinking (GTM, economics, user interviews) is 25 points — the single highest category, more than programming and engineering skills combined. Most candidates probably treat the markdown files as an afterthought. Decided from day one to treat them as seriously as the code.

Spent the rest of the day planning: what to name the product (landed on "Optivex AI" — suggests optimization, sounds like a real product), what the user flow looks like end to end, how the audit engine logic should work, which AI provider to use. Sketched the full architecture and user journey on paper. No code commits today — purely thinking, reading, and planning.

**What I learned:**
Reading the full brief carefully before writing any code is underrated. The rubric weights tell you where to actually spend your time. Also understood clearly that DEVLOG, REFLECTION, and entrepreneurial files are evaluated just as seriously as code — the assignment literally says "half of strong applicants under-invest here."

**Blockers / what I'm stuck on:**
Two open decisions going into tomorrow: (1) Anthropic vs Gemini for AI — Anthropic is preferred by the assignment but requires API access approval, Gemini is instant and free tier is generous. Decided to build around Gemini with the interface easy to swap later. (2) Chat intake vs form — decided to build both. Conversational consultant as the premium experience, manual form as fallback.

**Plan for tomorrow:**
Initialize the project. Next.js + TypeScript + Tailwind + shadcn/ui. Establish the folder structure and design system. Get first commits in.

---

## Day 2 — 2026-05-08

**Hours worked:** 5

**What I did:**
Initialized the project with `create-next-app` + TypeScript. Configured Tailwind CSS and added the shadcn/ui components I knew I'd need: Button, Card, Input, Select, Textarea, Dialog, Badge. Set up a custom dark design system with CSS variables — `--ox-surface`, `--ox-surface-2`, gradient utilities, and the `glass-card` class that would become the visual language across the whole app.

Created the complete folder structure upfront — `src/app`, `src/components`, `src/lib`, `src/types` — and stubbed out all the component files I planned to build, even as empty files. This was intentional: seeing the full shape of the project before writing logic helps separate structural decisions from implementation decisions. Built Navbar, started Hero, built Footer. Two commits today.

**What I learned:**
Creating empty stub files first and committing them is a useful planning technique. It makes the full project structure visible in the git tree and forces you to think about what components you actually need before you're deep in implementation. shadcn/ui path aliases in `components.json` matter — getting them wrong early causes import errors everywhere downstream.

**Blockers / what I'm stuck on:**
Hero section gradient animations took longer than expected to get right — kept iterating on the glow effects and layout. Decided to timebox it and come back rather than spend the whole day on CSS.

**Plan for tomorrow:**
Build the full landing page — Hero (final), Features, HowItWorks sections. Stub out all remaining components. Start user research conversations.

---

## Day 3 — 2026-05-09

**Hours worked:** 5.5

**What I did:**
Built out the full landing page component structure. Finalized Navbar with proper link structure. Built Footer. Created all remaining component stub files — `AuditDashboard`, `ConsultantPanel`, `ChatInput`, `ChatMessages`, `AuditForm`, `ToolRow`, `TeamInfoForm`, `Features`, `HowItWorks`, `ExtractionPreview` — empty files establishing the tree. This commit was mostly structure but structure matters.

Also had the first user research conversation today. Described the concept to someone who uses multiple AI tools daily. They immediately asked why users have to manually enter their spend rather than having it connect to their accounts automatically, and suggested a Chrome extension that sits in the background and tracks actual AI tool usage. More insightful than expected — the idea of usage-based analysis over subscription-price analysis reframed how I thought about the tool.

**What I learned:**
Talking to users before the UI exists — when you can only describe the concept — gets more honest reactions than showing a polished prototype. People tell you what they actually want rather than what they think of what you made.

**Blockers / what I'm stuck on:**
Design question surfaced by the stub structure: should chat consultant and manual form be on the same page or separate pages? Decided same page — users can switch without navigating away, lower friction.

**Plan for tomorrow:**
Build the full form layer (AuditForm, ToolRow), define all TypeScript types for the audit domain, build the KNOWN_TOOLS registry with real pricing data, build Features and HowItWorks properly.

---

## Day 4 — 2026-05-10

**Hours worked:** 6

**What I did:**
Biggest code day. Built the entire form layer and defined all TypeScript types the rest of the app depends on. `AuditFormInput`, `ToolInput`, `AuditResult`, `Recommendation`, `Redundancy`, `ToolAnalysis` in `src/types/audit.ts`. `AITool` and `ToolTier` in `src/types/tool.ts`. Built the full multi-step `AuditForm` (team info → tools → submit), `ToolRow` for per-tool input, and the `KNOWN_TOOLS` registry in `src/constants/tools.ts` — 12+ tools with all pricing tiers sourced from official vendor pages.

Built landing sections: `Features` (6 feature cards), `HowItWorks` (3-step explainer). Added helper utilities: currency formatting, `cn`, `nanoid`. Added the full custom CSS in `globals.css`. Created empty placeholder commits for `ARCHITECTURE.md`, `DEVLOG.md`, `ECONOMICS.md`, `REFLECTION.md` — a reminder to myself to fill these before submission.

**What I learned:**
Getting TypeScript types right before writing the engine or UI is the correct order. Every component downstream consumed `AuditFormInput` and `AuditResult` — having those defined cleanly meant no reshaping later. The `KNOWN_TOOLS` registry is the core data layer of the whole product; spending an hour getting it right here saved hours of debugging downstream.

**Blockers / what I'm stuck on:**
Originally had a 4-step form. Cut it to 3 because step 4 asked for information the audit engine didn't actually use. Scope-cutting mid-build takes discipline but was the right call.

**Plan for tomorrow:**
Build the audit engine — scoring, overlap detection, recommendations. Core logic that everything else depends on.

---

## Day 5 — 2026-05-11

**Hours worked:** 5.5

**What I did:**
Built the entire audit engine and chart data layer. Four files: `index.ts` (orchestrator), `overlap.ts` (capability mapping and redundancy detection), `scoring.ts` (Stack Health Score — composite of efficiency, coverage, redundancy penalty), `recommendations.ts` (generates recommendations from redundancy and tool analysis data). Engine is 100% deterministic TypeScript — no AI involved in the math. Also built `chart-data.ts` with transform functions for Recharts: spend breakdown, savings comparison, tool overlap visualization.

The overlap detection was the most complex piece: build a capability map per tool → build overlap matrix → classify each overlap as full or partial based on shared capability count and spend ratios → generate redundancy records with severity levels and estimated monthly savings.

Had the second user research conversation today — a friend who works at a company that uses multiple Claude models. He confirmed the problem is real: his team manually tracked token usage across models to justify downgrading from Opus to Sonnet. That process took weeks. Optivex would surface it in minutes. He also suggested team-size-aware recommendations, which I added to the engine.

**What I learned:**
Keeping AI out of the audit math was the right call, validated by actually building it. Writing deterministic rules forced me to articulate *why* a tool is flagged — the reasoning has to live in code, not be generated. An LLM would produce output that sounds defensible but isn't.

**Blockers / what I'm stuck on:**
Redundancy scoring had an edge case — tools with just 1 shared capability out of 10 were being flagged. Added minimum thresholds: ≥3 shared capabilities for partial overlap, near-identical capability sets for full overlap. Took an hour to calibrate correctly.

**Plan for tomorrow:**
Integrate Gemini, build the full results UI, connect all API routes, build ConsultantPanel, add Supabase, deploy.

---

## Day 6 — 2026-05-12

**Hours worked:** 8

**What I did:**
Full integration day — the day everything connected. AI layer: `gemini.ts` (Gemini client, `callGemini()`, chat history management), `prompts.ts` (system prompts for consultant and audit summary, dynamic prompt builder), `generate-summary.ts` (calls Gemini, parses EXECUTIVE_SUMMARY and STRATEGIC_NARRATIVE). API routes: `/api/extract`, `/api/audit`, `/api/leads`. Database layer: `supabase.ts` with `saveAudit()`, `getAudit()`, `saveLead()`.

Full results UI: `AuditDashboard` (tabbed layout, KPI strip, share button), `StackHealthScore`, `AISummary`, `ToolCard`, `RecommendationCard`, `SpendBreakdownChart`, `SavingsComparisonChart`, `ToolOverlapChart`. Chat UI: `ConsultantPanel`, `ChatMessage`, `ChatInput`. `LeadCaptureModal`. Shareable audit page at `/audit/[id]`. All API types in `src/types/api.ts`. Deployed to Vercel.

Hit two Gemini SDK bugs in a row. First: `startChat()` threw "First content should be with role 'user', got model" — the ConsultantPanel initializes with an assistant intro message that was being passed as the first history item. Fixed by filtering leading model turns before passing history to `startChat()`. Second: `gemini-1.5-flash` returned 404 — model deprecated from v1beta API. Updated to `gemini-2.0-flash`. Both are runtime-only errors, no compile-time warning at all.

**What I learned:**
LLM SDK errors cascade — fixing one surfaces the next. Reading the SDK documentation before integrating would have saved an hour of runtime debugging. Also: silent error swallowing (`console.error` without throwing) in database helpers is a footgun — the API returns 200 even when the insert failed.

**Blockers / what I'm stuck on:**
Lead saving silently failing — `saveLead()` swallows errors, masking that the `leads` table doesn't exist in Supabase yet. Chat signals `[READY_FOR_AUDIT]` correctly but structured form data extraction from conversation isn't wired up yet.

**Plan for tomorrow:**
Fix Supabase bug. Write all required documentation files. Write Vitest tests. Set up CI. Submit before midnight.

---

## Day 7 — 2026-05-13

**Hours worked:** 8

**What I did:**
Final day. Fixed the Supabase lead saving bug — `saveLead()` was swallowing errors silently. The real cause: the `leads` table didn't exist in Supabase yet. Created the table via SQL in the Supabase dashboard (`id`, `created_at`, `email`, `name`, `company`, `audit_id`). Updated `saveLead()` to throw on error so failures are actually visible. Fixed `audit/[id]/page.tsx` — `AuditResult` type wasn't imported and `AuditRow.result` typed as `object` needed a cast through `unknown`. Updated `AuditRow` in `supabase.ts` to type `result` directly as `AuditResult`.

Wrote all required documentation files: README, GTM, ECONOMICS, LANDING_COPY, METRICS, PRICING_DATA, PROMPTS, USER_INTERVIEWS, DEVLOG, REFLECTION, ARCHITECTURE. Had the third user research conversation and synthesized all three into USER_INTERVIEWS.md. Wrote 5 Vitest tests for the audit engine. Set up `.github/workflows/ci.yml`. Final end-to-end test of the full happy path. Committed everything and submitted.

**What I learned:**
Writing REFLECTION.md made me think more clearly about the decisions I made this week than any other part of the build. The ECONOMICS exercise of working backwards from $1M ARR to required visitor numbers was genuinely useful product thinking — not just a box to tick. Should have started these files on Day 3 or 4, not Day 7.

**Blockers / what I'm stuck on:**
Two known gaps going into Round 2 if I get there: (1) extraction pipeline — chat signals ready but doesn't auto-populate the form with parsed tool data, (2) form state doesn't persist across page reloads. Both are noted in REFLECTION as week-2 priorities.