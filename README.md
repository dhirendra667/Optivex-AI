# Optivex AI — Free AI Spend Auditor for Startups

Optivex AI helps startup founders and engineering managers find out if they're overspending on AI tools. Input your stack, get an instant audit showing redundancies, savings opportunities, and a personalized AI-generated recommendation — shareable via a unique public URL.

**Built for:** Any team paying for 2+ AI tools who suspects they're not getting full value.

🔗 **Live:** [https://optivex-ai.vercel.app](https://optivex-ai.vercel.app)

---

## Screenshots

> _I have to Add 3 screenshots or a Loom/YouTube link here before submitting_
>
> Suggested: (1) Landing page hero, (2) Chat consultant in action, (3) Audit results dashboard

---

## Quick Start

### Prerequisites
- Node.js 18+
- A Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))
- A Supabase project (free at [supabase.com](https://supabase.com))

### Install & Run Locally

```bash
git clone https://github.com/dhirendra667/optivex-ai.git
cd optivex-ai
npm install
```

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Set up Supabase tables (run in Supabase SQL editor):

```sql
create table audits (
  id text primary key,
  created_at timestamptz default now(),
  input jsonb,
  result jsonb,
  company_name text,
  team_size int
);

create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  email text not null,
  name text,
  company text,
  audit_id text
);
```

```bash
npm run dev
# Open http://localhost:3000
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
# Set the same env vars in Vercel dashboard → Settings → Environment Variables
```

---

## Decisions

Five real trade-offs made during the build:

**1. Gemini over Anthropic API for AI summaries**
The assignment preferred the Anthropic API, but Gemini's free tier (gemini-2.0-flash, 15 RPM, 1M tokens/day) meant I could ship without asking evaluators to set up billing. Trade-off: less brand alignment with Credex's product, but the tool actually works out-of-the-box for anyone cloning it.

**2. Hardcoded audit rules over AI-generated audit logic**
The audit engine (scoring, overlap detection, recommendations) is 100% deterministic TypeScript — no LLM involved. This was deliberate. LLMs hallucinate numbers; a finance person reading the output needs to trust the math. AI is only used for the narrative summary, where some stylistic variance is fine.

**3. Conversational chat intake over a plain form**
A static multi-step form felt like a spreadsheet. A chat-based intake (the Optivex Consultant) is more engaging, surfaces edge cases naturally, and mirrors how a real consultant would onboard a client. Trade-off: harder to validate structured data from free-form text; mitigated by also keeping the manual form as a fallback.

**4. Supabase over a simpler KV store**
Could have used Upstash or plain Vercel KV for storing audits. Chose Supabase because it gives a proper relational DB, a dashboard for inspecting leads, and easy row-level security — things that matter if Credex actually wants to use the lead data.

**5. No authentication required**
Deliberate product decision: requiring signup before showing value kills conversion. Email is captured after the audit is complete and the user has already seen their savings number. This mirrors how the best B2B lead-gen tools work (Hotjar, Clearbit's free tools, etc.).
