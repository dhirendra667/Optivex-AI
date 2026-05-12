# METRICS.md — Optivex AI Metrics Framework

## North Star Metric

**Qualified leads delivered to Credex per week**

Defined as: email captures from audits that identified ≥$200/month in potential savings.

**Why this and not something else:**
- "Audits completed" ignores quality — a user with 1 tool and $20/mo spend is not a Credex lead
- "Page visits" is too top-of-funnel to be actionable
- "Emails captured" is close but includes low-savings audits that won't convert to credit purchases
- DAU/WAU is wrong for a tool people use once per quarter when evaluating their stack
- The North Star must align with Credex's business outcome — qualified leads — not just product engagement

A week where 50 audits complete but zero show >$200/mo savings is a bad week, even if engagement metrics look fine.

---

## 3 Input Metrics That Drive the North Star

**1. Audit completion rate**
*(audits completed / audit starts)*
Target: ≥65%. If this drops, the form is too long, the chat consultant is confusing, or users aren't seeing enough value mid-funnel to finish. This is the single biggest lever on lead volume.

**2. High-savings audit rate**
*(audits showing >$200/mo savings / audits completed)*
Target: ≥35%. Driven by targeting the right users (teams with real stacks, not solo devs on free tiers). If this is low, either the engine is too conservative or we're getting the wrong traffic.

**3. Email capture rate on high-savings audits**
*(emails captured from high-savings audits / high-savings audits completed)*
Target: ≥40%. If users see a big savings number and still don't give their email, the value proposition at the capture moment is broken. This is a copy/UX problem, not a product problem.

---

## What to Instrument First

In priority order:

1. **Audit funnel drop-off** — where in the form/chat do users abandon? (Step 1 → 2 → 3, or chat message count before exit)
2. **Savings distribution** — histogram of identified savings across all completed audits (tells us if engine is calibrated correctly)
3. **Email capture conversion by savings tier** — does capture rate increase with savings size? (validates the gate placement)
4. **Shareable URL click-through** — how many shared audit links get opened by a second person? (measures viral coefficient)
5. **Credex CTA click rate on high-savings audits** — bottom of the funnel, tells us if the handoff to Credex is working

Tool: Start with Vercel Analytics (free, already integrated) + a simple `events` table in Supabase for custom funnel events.

---

## Pivot Trigger

**If after 500 completed audits, the high-savings audit rate is below 20%**, the tool is reaching the wrong users or the engine is systematically underestimating savings. At that point, either:
- Re-evaluate targeting (shift from indie hackers to funded startups with real tool budgets), or
- Recalibrate the audit engine logic (check if redundancy detection is too conservative)

A 20% high-savings rate at 500 audits means only 100 qualified leads — at a 15% consultation rate that's 15 consultations, at 40% close rate that's 6 purchases, at $1,200 LTV that's $7,200 total. Below that, the economics don't support continued investment without changes.

