# 28 — KPI

## 28.1 North Star Metric

**Correction-cycle reduction rate:** the measured (or user-reported) reduction in back-and-forth correction cycles between a user and their AI coding agent, when the coding agent is working from PARDI-generated prompts versus an unstructured idea. This is the direct operationalization of the success criteria stated in `01_Executive_Summary.md`.

> **Decision:** Because "correction cycles with an external coding agent" is not something PARDI can directly instrument (the coding agent runs outside PARDI's systems), the North Star is measured via a combination of (a) periodic in-product user surveys immediately after prompt export/use, and (b) a proxy metric PARDI *can* instrument directly: **re-generation rate** — how often a user has to regenerate or manually edit a Task Breakdown or Prompt after initially exporting it, on the theory that a prompt requiring rework before use is a leading indicator of one that would also cause coding-agent correction cycles. Both are tracked; the proxy metric is treated as directional, not a perfect substitute, consistent with the honesty-about-estimates posture set in `03_Market_Research.md`.

## 28.2 Leading Indicators (Product Usage)

| Metric | What it signals | Instrumented via |
|---|---|---|
| Idea → completed PRD conversion rate | Genuine intent past the free-tier entry point (`03_Market_Research.md §3.4`) | NFR-180 generation logging |
| Full-pipeline completion rate (Interview → Prompt export) | Whether the product's core promise is actually being realized per project, not abandoned mid-pipeline | Stage-transition events per project |
| Staleness banner engagement rate (re-sync vs. acknowledge-and-ignore, `09_User_Flow.md §9.3`) | Whether the dependency-graph/traceability feature is delivering perceived value or being dismissed as noise | UI event tracking on the staleness banner actions |
| Re-generation rate on Tasks/Prompts (the North Star proxy, §28.1) | Quality of the generated hand-off artifact | Generation-call logging, keyed by artifact lineage |
| AI Reviewer / Product Critic flag acceptance rate (flag acted on vs. dismissed) | Whether automatic/on-demand review is trusted and useful, or noise (`15_Agent_Workflow.md §15.4`) | Comment/flag-resolution events |

## 28.3 Lagging Indicators (Business)

| Metric | What it signals |
|---|---|
| Free → Builder conversion rate | Whether the free-tier PRD experience is compelling enough to justify paying for the deeper pipeline (`26_Pricing.md §26.1` bet) |
| Builder → Team expansion rate | Whether collaboration features (Phase 2, `27_Roadmap.md §27.2`) are genuinely load-bearing, gating the Phase 3 investment decision |
| Net revenue retention | Overall health of the pricing model's usage-based-ceiling design (`26_Pricing.md §26.3`) |
| Segment mix of paying users (solo vs. small team vs. agency) | Validates or corrects the SOM assumption in `03_Market_Research.md §3.1` |

## 28.4 Quality/Trust Indicators (Product-Specific, Not Generic SaaS Metrics)

These exist because PARDI's differentiation is specifically about trustworthy, consistent output (`02_Product_Strategy.md`), so generic engagement metrics alone would miss regressions in the thing that actually matters:

| Metric | Threshold discipline |
|---|---|
| Golden-set evaluation scores per pipeline stage (`24_Testing.md §24.5`) | Tracked over time, not just at release — a slow decline across small prompt changes is itself an alert condition, distinct from any single eval failing a CI gate |
| Reviewer Agent flag precision (flags later confirmed as real issues vs. false positives, from user override/justification data in `12_Database_Design.md`'s override audit trail) | Declining precision here erodes trust in the automatic review pass faster than almost any other regression, and is watched accordingly |
| Cross-artifact consistency failure rate (NFR-181) | Rising failure rate is a direct AI-quality regression signal, tracked as a first-class operational metric, not buried in generic error logs |

## 28.5 What PARDI Deliberately Does Not Optimize For

- **Raw session count / time-in-app.** A user who completes their pipeline quickly and leaves to work with their coding agent is a *success*, not churn risk — optimizing for time-in-app would directly contradict the product's own "reduce correction cycles, get out of the way" thesis.
- **Feature adoption breadth** as a standalone metric (e.g., "% of users who tried Market Validation"). Per `06_Product_Requirements.md §6.2`'s decision to bound v1 scope around one deep, trustworthy pipeline run rather than broad shallow feature sampling, breadth-of-use metrics are secondary to depth-of-trust metrics above.

## 28.6 Reporting Cadence

- Leading indicators (§28.2) reviewed weekly against the Phase gate triggers defined in `27_Roadmap.md`.
- Quality/trust indicators (§28.4) reviewed on every merge touching `packages/agents` (tied directly into the CI eval gate, `24_Testing.md §24.6`), not just on a calendar cadence, since agent-prompt changes are the most likely source of a quality regression.
- Lagging business indicators (§28.3) reviewed monthly, feeding directly into the phase-transition decisions in `27_Roadmap.md`.

## 28.7 Cross-References

- Phase-gating decisions these metrics inform → `27_Roadmap.md §27.5`
- Underlying instrumentation requirement → `08_Non_Functional_Requirements.md §8.9` (NFR-180/181)
- Risks that would show up first in these metrics → `29_Risk_Analysis.md`
