# 29 — Risk Analysis

## 29.1 Risk Register

| # | Risk | Likelihood | Impact | Category |
|---|---|---|---|---|
| 1 | Coding agents absorb the planning step natively (durable, exportable "plan mode") | Medium-High | High | Strategic / competitive |
| 2 | AI-generated schema/API/task output is subtly wrong in a way users don't catch until mid-build | Medium | High | Product quality / trust |
| 3 | Market perceives "spec quality" as a non-problem (still believes better prompting alone is enough) | Medium | Medium | Go-to-market |
| 4 | Multi-agent pipeline latency/cost makes the product feel slow or expensive at scale | Medium | Medium | Technical / unit economics |
| 5 | Cross-tenant data leakage via AI provider context or caching | Low | Critical | Security |
| 6 | Template Marketplace launches without enough quality seed content, damaging trust in the whole product | Medium (Phase 3-specific) | Medium | Product / GTM |
| 7 | Small team can't sustain quality across 15+ specialized agent prompts as the roster grows | Medium | Medium | Execution / org |

## 29.2 Risk #1 — Coding Agents Absorb Planning (Strategic)

**Detail:** If Claude Code, Cursor, or similar tools ship a durable, versioned, exportable planning artifact as a native feature (not just an in-session ephemeral plan), the core differentiation in `04_Competitor_Analysis.md §4.3` weakens directly.

**Mitigation, already embedded in the product design rather than a future response:**
- PARDI's output is explicitly **portable** (Markdown/JSON export, `16_Prompt_Workflow.md §16.3`) and **agent-agnostic** — it does not require a specific coding agent, so even if one vendor ships durable planning, PARDI remains useful across the rest of the ecosystem and as a superior, more structured alternative even to that vendor's own users.
- PARDI's differentiation is breadth (full PM→architecture pipeline, `02_Product_Strategy.md §2.5`), not just "a plan" — a coding agent's plan mode is unlikely to include competitor analysis, BRD framing, or persona-grounded stories, which are further from a coding agent's natural scope.
- Roadmap phase-gating (`27_Roadmap.md §27.5`) explicitly re-checks this risk at every phase transition rather than assuming Phase 1 GTM strategy remains valid indefinitely.

**Residual risk:** Accepted as the single most important risk to monitor; no mitigation fully eliminates it, since it depends on decisions outside PARDI's control.

## 29.3 Risk #2 — Subtly Wrong Generated Artifacts (Product Quality)

**Detail:** An LLM-generated schema or API contract that looks correct but has a subtle flaw (a missing constraint, an inconsistent auth assumption) is arguably worse than an obviously incomplete one, since it invites false confidence — directly undermining the trust `02_Product_Strategy.md` positions as the product's core asset.

**Mitigation:**
- Structural decomposition (`14_AI_Workflow.md §14.1`) rather than single-shot generation, specifically to reduce this failure mode.
- Automatic Reviewer Agent pass (FR-211) plus on-demand AI Product Critic (FR-212), both designed to surface exactly this kind of subtle inconsistency.
- Golden-set evaluation with seeded, intentionally-subtle-error fixtures (`24_Testing.md §24.5`) specifically tests whether the Reviewer Agent catches non-obvious issues, not just gross errors.
- UI design principle "nothing generative happens invisibly" (`17_UI_UX_Design_System.md §17.2`) — every artifact shows its reasoning/source, giving a human reviewer a real chance to catch what an automated check might miss.

**Residual risk:** No AI system can be guaranteed error-free; the product's honesty posture (showing reasoning, flagging assumptions per FR-103) is designed to keep users appropriately skeptical rather than falsely reassured, which is the realistic mitigation available.

## 29.4 Risk #3 — Market Doesn't Perceive the Problem (GTM)

**Detail:** Some developers believe "just prompt the coding agent better" is sufficient, and don't yet recognize spec quality as their actual bottleneck.

**Mitigation:**
- GTM messaging is anchored to a visceral, specific, easily-recognized pain (rework cycles, `02_Product_Strategy.md §2.4`) rather than an abstract claim about "specification quality," so it doesn't require the buyer to already hold PARDI's thesis to see the value.
- Free tier (`26_Pricing.md §26.2`) lets skeptical users experience the PRD-quality difference directly at zero cost before being asked to accept the broader thesis.
- Validation plan (`03_Market_Research.md §3.4`) tracks this perception gap directly via conversion and segment-mix data rather than assuming it away.

## 29.5 Risk #4 — Latency/Cost at Scale (Technical)

**Detail:** Multi-agent, multi-stage generation (`15_Agent_Workflow.md`) is inherently more expensive and slower per project than a single-prompt competitor.

**Mitigation:**
- Streaming/incremental UX (`18_Animation_Guidelines.md §18.4`, NFR-102/104) manages *perceived* latency even where actual compute time is higher.
- Usage-based quota model (`26_Pricing.md §26.3`) ties cost directly to metered value delivered, protecting unit economics as usage scales.
- Several agent "roles" are implemented as prompt personas layered into an owning agent rather than fully independent calls at v1 specifically to control this cost (`15_Agent_Workflow.md §15.2` decision), with promotion to independent agents deferred until usage data justifies the added cost.

## 29.6 Risk #5 — Cross-Tenant Data Leakage (Security)

**Detail:** The highest-impact-if-realized risk on this register, given PARDI stores unlaunched business ideas.

**Mitigation:** Covered in full in `22_Security.md` — two-layer authorization (RLS + application checks), per-request AI context scoping (NFR-132), no shared prompt caching across workspaces. Treated as a "low likelihood, critical impact" risk warranting disproportionate engineering attention relative to its likelihood ranking, consistent with standard security risk-prioritization practice.

## 29.7 Risk #6 — Marketplace Launches Without Quality Seed Content (Phase 3 GTM)

**Detail:** A marketplace populated with low-quality or generic templates would actively damage the "opinionated, not generic" positioning (`02_Product_Strategy.md §2.2`).

**Mitigation:** Roadmap explicitly gates Template Marketplace to Phase 3, requiring "a critical mass of shipped Phase 1/2 projects to seed it credibly" as a stated precondition (`27_Roadmap.md §27.3`), rather than launching it early to fill out the feature checklist.

## 29.8 Risk #7 — Agent Roster Quality Sustainability (Execution)

**Detail:** 15 specialized agent roles (`15_Agent_Workflow.md §15.2`) is a lot of surface area for a small team to keep at a high quality bar simultaneously.

**Mitigation:** Version-controlled agent prompts alongside code (NFR-171), per-stage golden-set evaluation gating any change (`24_Testing.md §24.6`), and the deliberate choice to implement several roles as prompt personas within an owning agent rather than fully separate agents until justified (`15_Agent_Workflow.md §15.2`) — this keeps the *actually independently-maintained* surface area smaller than the full conceptual roster implies at any given time.

## 29.9 Cross-References

- Strategic framing these risks test → `02_Product_Strategy.md`
- Metrics that would surface these risks early → `28_KPI.md`
- Roadmap decisions gated by these risks → `27_Roadmap.md §27.5`
