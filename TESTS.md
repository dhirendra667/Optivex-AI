# TESTS.md — Optivex AI Test Suite

## How to Run

```bash
npm run test          # run all tests once
npm run test -- --watch   # watch mode
npm run test -- --coverage  # with coverage report
```

Tests use **Vitest** (already in `devDependencies`). No additional setup needed.

---

## Test Files

### `tests/audit-engine.test.ts` — Full pipeline (runAuditEngine)

| Test | What it covers |
|---|---|
| correctly calculates currentMonthlySpend as sum of all tool spends | Financial accuracy — spend aggregation |
| calculates annualPotentialSavings as 12x monthlyPotentialSavings | Financial accuracy — annual projection |
| returns savingsPercentage of 0 when no tools provided | Edge case — empty tool list |
| optimizedMonthlySpend is never negative | Edge case — savings can't exceed spend |
| returns a result with an id and createdAt timestamp | Output structure — required fields present |
| spendBreakdown has one entry per tool | Output structure — chart data completeness |
| spendBreakdown percentages sum to 100 (±1 for rounding) | Output structure — chart data accuracy |
| toolAnalyses has one entry per tool with a valid verdict | Output structure — analysis completeness |
| flags a recommendation when spend exceeds budget by more than 20% | Budget overage detection |
| does NOT flag budget overage when spend is within 20% of budget | Budget overage — no false positives |

---

### `tests/overlap.test.ts` — Capability map, overlap matrix, redundancy detection

| Test | What it covers |
|---|---|
| returns a map with one entry per tool | buildCapabilityMap — basic correctness |
| assigns capabilities to known tools from the registry | buildCapabilityMap — registry lookup |
| falls back to heuristic inference for unknown tools | buildCapabilityMap — heuristic fallback |
| assigns at least 'chat' capability to completely unknown tools | buildCapabilityMap — fallback minimum |
| returns n*(n-1)/2 pairs for n tools | buildOverlapMatrix — pair count |
| returns empty array for a single tool | buildOverlapMatrix — edge case |
| overlapScore is between 0 and 100 for all pairs | buildOverlapMatrix — score bounds |
| matrix is sorted descending by overlapScore | buildOverlapMatrix — sort order |
| two identical coding tools have high overlap score | buildOverlapMatrix — known tool overlap |
| sharedCapabilities only contains capabilities both tools have | buildOverlapMatrix — shared caps accuracy |
| flags full-overlap redundancy for two near-identical coding tools | detectRedundancies — full overlap detection |
| recommends keeping the cheaper tool in a full-overlap redundancy | detectRedundancies — cheapest tool logic |
| flags underutilization for a tool used rarely (high severity) | detectRedundancies — rarely used |
| flags underutilization for a tool used occasionally (medium severity) | detectRedundancies — occasionally used |
| does NOT flag underutilization for a daily-use tool | detectRedundancies — no false positives |
| returns no overlap redundancies for a single-tool stack | detectRedundancies — single tool edge case |
| all redundancy estimatedMonthlySavings are non-negative | detectRedundancies — savings never negative |
| each redundancy has a non-empty description and suggestedAction | detectRedundancies — output completeness |

---

### `tests/savings.test.ts` — Scoring and recommendations

| Test | What it covers |
|---|---|
| returns score between 0 and 100 | computeStackHealthScore — score bounds |
| clean stack scores higher than redundant one | computeStackHealthScore — scoring direction |
| critical redundancy applies larger penalty than medium | computeStackHealthScore — severity weighting |
| coverage score lower for stacks with many tools | computeStackHealthScore — sprawl penalty |
| daily usage maps to 90 utilization | scoreToolAnalysis — utilization mapping |
| weekly usage maps to 65 utilization | scoreToolAnalysis — utilization mapping |
| occasional usage maps to 35 utilization | scoreToolAnalysis — utilization mapping |
| rarely usage maps to 10 utilization | scoreToolAnalysis — utilization mapping |
| daily high-use tool with no flags gets 'keep' verdict | scoreToolAnalysis — verdict: keep |
| rarely used tool with multiple flags gets 'eliminate' verdict | scoreToolAnalysis — verdict: eliminate |
| roiScore and keepScore are between 0 and 100 | scoreToolAnalysis — score bounds |
| generates eliminate recommendation for full-overlap redundancy | generateRecommendations — full overlap rec |
| generates downgrade recommendation for underutilization | generateRecommendations — underuse rec |
| recommendations sorted critical → high → medium | generateRecommendations — sort order |
| every recommendation has non-empty title, description, impact | generateRecommendations — output completeness |
| returns no actionable recs when stack is clean | generateRecommendations — no false positives |

---

## Total: 36 tests across 3 files

All tests cover the audit engine exclusively — no UI tests, no API route tests. The engine is pure functions with no side effects, making it straightforward to test deterministically without mocking.
