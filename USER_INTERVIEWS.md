# USER_INTERVIEWS.md — User Research for Optivex AI

Three interviews conducted via Google Meet and in-person between May 8–12, 2026. The goal of these conversations was to validate whether AI spend optimization is a real problem, understand how people currently manage AI tooling decisions, and identify what would make the product genuinely useful instead of just a pricing calculator.

One major insight across all conversations was that users cared less about raw subscription totals and much more about workflow visibility, overlap detection, and understanding whether they were actually using the right tool for the right task. Before these conversations, I initially thought the product would mainly function as a subscription audit calculator. The interviews changed that assumption significantly and pushed the product toward workflow intelligence, recommendation systems, and usage-aware analysis.

---

# Interview 1 — S.K., Independent Developer / Freelancer

**Date:** 2026-05-08  
**Duration:** ~12 minutes  
**Format:** Google Meet

## Background
Freelance developer working on multiple client projects simultaneously. Uses AI tools daily for code generation, debugging, documentation, and writing. Early adopter who has experimented with most major AI tools over the last year.

## Key quotes

> "Why do I have to manually tell it what I pay? Can't it just connect to my accounts and figure it out automatically?"

> "What if you could make this a Chrome extension that sits in the background and tracks how much I'm actually using each tool — then the audit would be based on real data, not what I think I use."

> "The form approach works but it feels like filling out a tax return. The chat thing is better."

> "Honestly, I probably wouldn't use this every month — maybe once every quarter when reviewing subscriptions."

## Most surprising insight
The most interesting part of this conversation was that he immediately focused on *usage visibility* rather than pricing itself. His instinct was that understanding how frequently a tool is actually used is more valuable than simply knowing how much it costs. He described a scenario where people continue paying for tools because the subscription becomes invisible after the initial setup.

Another important insight was his reaction to the form-heavy flow. I initially assumed a structured form would feel professional and efficient, but he reacted much more positively to the conversational consultant interface. That made me rethink how users should interact with the audit process.

## What changed in the product
Originally, the usage-level field (`daily`, `weekly`, `occasional`, `rarely`) was treated as a minor scoring signal. After this interview, I made it one of the primary inputs in the audit engine. A tool costing $50/month but used occasionally should often score worse than a more expensive tool used heavily every day.

This conversation also heavily influenced the consultant-chat feature and reinforced the idea that the product should feel interactive and advisory instead of behaving like a static calculator.

The Chrome-extension and vscode-extension idea was out of scope for this build, but it became one of the strongest potential v2 directions because it would allow audits based on real usage behavior instead of self-reported estimates.

---

# Interview 2 — R.M., Software Engineer at a Mid-Size Company / Side Project Builder

**Date:** 2026-05-10  
**Duration:** ~15 minutes  
**Format:** Google Meet

## Background
Full-time software engineer at a mid-size company actively using multiple AI models internally. Also building SaaS side projects independently. Has direct exposure to how engineering teams evaluate AI tooling costs and usage.

## Key quotes

> "At our company we moved from Opus to Sonnet for most tasks and saved a lot — but we only figured that out by tracking token usage manually. Most teams have no idea what model they're even hitting."

> "The interesting thing isn't just cost — it's cost per useful output. If I can get the same result from a cheaper model, the expensive one is waste."

> "You should add recommendations based on team size and what the team actually does — a 3-person team using Enterprise tier is almost always wrong."

> "Token-based analysis would be way more defensible than just looking at subscription prices."

## Most surprising insight
The most important moment from this conversation was hearing about a real internal workflow where his company manually exported API logs, analyzed token usage, and built spreadsheets to justify downgrading from Opus to Sonnet for certain tasks.

The interesting part was that even a technically sophisticated engineering team was handling this process manually. That made the underlying problem feel much more real to me because it showed that even advanced users still lack good tooling for understanding AI spend efficiency.

Another important insight was the distinction between:
- subscription cost
- actual value generated

He repeatedly emphasized that *cost per useful output* mattered more than subscription totals alone.

## What changed in the product
This conversation directly influenced several features inside the audit engine:
- team-size-aware recommendations
- enterprise-plan overprovision detection
- recommendation explanations tied to workflow patterns
- stronger emphasis on usage efficiency instead of raw spend

It also reinforced my decision to keep the audit engine deterministic instead of AI-generated. I realized the recommendations needed to feel explainable and defensible, especially if the tool was making cost-cutting suggestions for teams.

The token-usage discussion also became one of the strongest Week 2 priorities because it would significantly improve the accuracy and credibility of the audit logic.

---

# Interview 3 — A.P., Early-Stage Founder / Side Project Builder

**Date:** 2026-05-12  
**Duration:** ~10 minutes  
**Format:** In-person conversation

## Background
Non-technical founder building a content-focused startup and several side projects. Uses ChatGPT Plus heavily and recently subscribed to Claude Pro after hearing positive recommendations online. Primarily uses AI tools for writing, brainstorming, and content generation.

## Key quotes

> "I honestly don't know if I need both. I use ChatGPT out of habit because I started with it, but Claude is better for the writing stuff I actually do."

> "If this tool told me 'you can cancel one of these and here's why,' I'd do it immediately. I just don't know which one."

> "I didn't know Claude had a free tier. I've been paying for Pro since day one."

> "Most people don't compare tools properly. They just keep adding subscriptions."

## Most surprising insight
This was the clearest example of accidental overlap I encountered during the interviews. She had been paying for both ChatGPT Plus and Claude Pro for months without intentionally evaluating whether she actually needed both subscriptions.

The more important realization was that she was not particularly price-sensitive — she was *information-sensitive*. If she had clearer information earlier about feature overlap, free-tier capabilities, or which tool fit her workflow better, she likely would have made different decisions from the start.

This conversation also highlighted how much AI-tool purchasing is driven by recommendations, hype cycles, and habit rather than deliberate evaluation.

## What changed in the product
After this conversation, I made overlap explanations significantly more prominent in the audit results. Instead of simply saying:

```text
Cancel Tool X