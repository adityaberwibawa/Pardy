# 03 — Market Research

> **Note on data:** figures below are sized using publicly known order-of-magnitude anchors (developer population, AI coding tool adoption trends) combined with explicit assumptions. They are directional planning inputs, not verified market-research figures. Each estimate is labeled with its assumption so it can be replaced with primary research (surveys, interviews, waitlist conversion data) as PARDI collects its own data. Treat this file as a *living* document — update it once real usage data exists, per the versioning note in `Appendix.md`.

## 3.1 Market Sizing Approach (TAM / SAM / SOM)

We size top-down from the global developer population, then narrow by AI-coding-tool adoption and by the specific segment PARDI targets (solo/small-team builders who structurally lack a PM/architect).

| Layer | Definition | Sizing logic | Status |
|---|---|---|---|
| **TAM** | All professional + hobbyist software developers globally | Anchored to widely cited industry developer-population estimates (tens of millions globally) | Directional |
| **SAM** | Developers who actively use an AI coding agent (Claude Code, Cursor, Copilot, v0, Bolt, etc.) | AI coding tool adoption has grown sharply since 2023; a large and growing minority of the TAM now uses at least one such tool regularly | Directional, trending up |
| **SOM** | Indie hackers, solo founders, and small (<10 person) technical teams building without a dedicated PM/architect, who hit rework from vague specs | Smaller slice of SAM, but the segment with the sharpest pain and shortest sales cycle (self-serve, credit card, no procurement) | Primary near-term target |

> **Decision:** We deliberately size and go to market against SOM, not TAM. A tool built to satisfy "all developers" ends up generic. A tool built for solo builders and small teams who *feel* the rework pain acutely will have a sharper product and a much shorter path to paying customers than one aimed at enterprise PM orgs from day one.

## 3.2 Key Market Trends Relevant to PARDI

1. **AI coding agents have shifted the bottleneck upstream.** As agents got better at writing code, the visible failure mode moved from "the AI can't code this" to "the AI built the wrong thing" or "the AI built it inconsistently across sessions." This is the core trend PARDI is built on, and it is directly observable in developer discussion (Twitter/X, Indie Hackers, Hacker News, r/ClaudeAI, r/cursor) rather than a speculative forecast.
2. **Solo and small-team software creation is growing.** AI coding tools lower the capital and headcount needed to ship a product, which increases the number of people building without a dedicated PM/architect — precisely PARDI's target buyer.
3. **"Spec-first" and "plan mode" features are emerging inside coding agents themselves** (e.g., planning/spec modes in various coding tools). This validates the underlying need but also represents a competitive/substitution risk, addressed in `29_Risk_Analysis.md`.
4. **Documentation and PM tooling has already proven willingness-to-pay** at the individual/small-team level (Notion, Linear) — evidence that solo builders and small teams will pay monthly for structured-thinking tools, not just for code-execution tools.

## 3.3 Buyer Behavior

| Behavior | Implication for PARDI |
|---|---|
| Discovers tools via founder/dev communities (X, Indie Hackers, Product Hunt, YouTube build-in-public content), not enterprise sales | GTM is content- and community-led, not sales-led, at least through Phase 1 (`27_Roadmap.md`) |
| Expects to try before paying; low tolerance for onboarding friction | Free tier or generous trial covering at least Idea → PRD, gated further pipeline stages behind paid tiers (`26_Pricing.md`) |
| Already has a coding agent subscription; resistant to another expensive tool unless ROI is immediate | Pricing anchored below "another full dev tool" price point for the individual tier; ROI framed in hours saved, not features |
| Distrusts generic AI output; wants to see reasoning, not just conclusions | Every generated artifact surfaces its reasoning inline (decision records), reinforcing the "Architect, not generator" positioning from `02_Product_Strategy.md` |

## 3.4 Validation Plan (Pre/Early Launch)

Rather than treating market sizing as settled, PARDI's own **AI Interview** and **Idea Validation** features (see `06_Product_Requirements.md`) are the mechanism by which real usage data replaces these estimates:

- Track conversion from Idea → completed PRD as a proxy for genuine intent.
- Track how often users report (via in-app feedback) that a coding agent produced correct output from PARDI's task breakdown, to validate the core wedge metric from `01_Executive_Summary.md`.
- Track segment mix (solo vs. small team vs. agency) from actual signups against the SOM assumption above, and revise segmentation if it diverges.

## 3.5 Open Questions for Primary Research

These are explicitly unresolved and should not be treated as answered by this document:

- Actual willingness-to-pay ceiling for the individual tier (assumption used in `26_Pricing.md` should be tested, not treated as fact).
- Whether agencies/freelancers (secondary persona) convert at meaningfully different rates than indie hackers (primary persona) — affects whether Phase 1 GTM should split messaging.
- Whether "correction cycles with coding agent" is something users can self-report reliably, or whether PARDI needs an in-product proxy metric instead (see `28_KPI.md`).
