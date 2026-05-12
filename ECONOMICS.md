# ECONOMICS.md — Unit Economics for Optivex AI

## What a Converted Lead is Worth to Credex

Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise — sourced from companies that overforecast. The discount is described as "real and substantial." Assuming:

- Average deal: a 10-person startup buys $500/mo in AI credits through Credex
- Credex margin: ~20% on credits (conservative for a reseller/arbitrage model)
- Average customer lifetime: 12 months (sticky if the discount is real)

**LTV per customer = $500 × 20% × 12 = $1,200**

High-savings audits (>$500/mo identified) are the warmest leads — those users already know they have a problem and have a number attached to it. For these, conversion to consultation is high. For lower-savings audits, the lead is still valuable for the "notify me" list (future buyers as their stack grows).

---

## CAC by Channel

| Channel | Cost | Estimated Sign-ups | CAC |
|---|---|---|---|
| HN Show HN post | $0 (time: 2hr) | 40 leads | ~$0 |
| Reddit posts (r/SaaS, r/webdev) | $0 (time: 1hr each) | 15 leads | ~$0 |
| Twitter thread | $0 (time: 3hr) | 25 leads | ~$0 |
| Cold email to founders | $0 (time: 4hr/50 emails) | 8 leads | ~$0 |
| Credex customer newsletter mention | $0 (existing asset) | 60 leads | ~$0 |
| Paid Twitter/X ads (if needed later) | $500/mo | 50 leads | $10/lead |

**Blended CAC (organic-first, month 1): ~$0 hard cost, ~$50 in founder time per lead at scale**

---

## Conversion Funnel

```
Landing page visit          → Audit started:       40% conversion
Audit started               → Audit completed:     65% conversion  
Audit completed             → Email captured:      30% conversion
Email captured              → Consultation booked: 15% (high-savings only, ~30% of leads)
Consultation booked         → Credit purchase:     40% close rate
```

**Overall: 1,000 visitors → 400 start audit → 260 complete → 78 emails → ~12 high-savings leads → ~5 consultations → 2 purchases**

**Revenue per 1,000 visitors: 2 × $1,200 LTV = $2,400**
**With $0 CAC (organic): strong unit economics from day 1**

---

## Sensitivity: What Makes This Profitable

The model is already profitable at $0 CAC. The key variables are:

1. **Email capture rate** — currently targeting 30%. Every 5% improvement adds ~$400 revenue per 1,000 visitors.
2. **High-savings audit rate** — how many audits surface >$500/mo in savings. Depends on the target user having a real stack. Engineering leads at 10–30 person companies are the right audience.
3. **Consultation close rate** — the Credex sales motion matters here, not the tool itself.

---

## $1M ARR in 18 Months — What Has to Be True

**Target: $1M ARR = ~833 paying customers at $1,200 LTV (or ~69 new customers/month)**

Required funnel math (working backwards):
- 69 purchases/month
- At 40% close rate → 173 consultations/month
- At 15% consultation rate (of high-savings leads) → 1,150 high-savings leads/month
- At 30% email capture → 3,833 completed audits/month
- At 65% completion rate → 5,897 audit starts/month
- At 40% start rate → **~14,750 unique visitors/month by month 6**

14,750 visitors/month is achievable with:
- One viral HN/Reddit post per month (each drives 2,000–5,000 visits)
- Compounding SEO from shareable audit URLs (each shared audit is an indexed page)
- Credex newsletter driving 3,000–5,000 visits/month from existing customers

**The math works if:** visitor volume hits 15k/month by month 6, email capture holds at 25%+, and Credex's sales team converts consultations at 35%+. These are realistic numbers — not optimistic.

**What would break it:** Low audit completion rate (tool is too complex to fill out), low email capture (value isn't clear enough before the gate), or poor consultation close rate (Credex sales motion not aligned with inbound leads).
