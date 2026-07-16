# 27 — Roadmap

Expands the phased GTM sequencing introduced in `02_Product_Strategy.md §2.4` into a concrete, priority-ordered delivery plan, cross-referenced against the feature priority table in `06_Product_Requirements.md §6.4`.

## 27.1 Phase 1 — Wedge (v1 Launch)

**Goal:** prove the core wedge metric (`01_Executive_Summary.md` — fewer correction cycles with a coding agent) for a solo builder running one project end-to-end.

| Deliverable | Source requirements |
|---|---|
| Full P0 pipeline: Interview → Validation → PRD → BRD → Stories/Criteria → Architecture → Database → API → Tasks → Prompts → Export | `06_Product_Requirements.md §6.4` P0 rows |
| Version History + staleness propagation | FR-901–903, `11_System_Architecture.md §11.6` |
| Billing (Free + Builder tiers only; Team tier deferred) | `26_Pricing.md §26.2` |
| Core design system + dark-mode-first UI | `17_UI_UX_Design_System.md`, `19_Design_Tokens.md` |
| Marketing landing page with R3F/GSAP hero | `18_Animation_Guidelines.md §18.6` |

**Explicitly deferred out of Phase 1:** Market Validation and Competitor Analysis ship as P1 same-quarter-if-feasible but are not launch-blocking; Sprint Planner, AI Product Coach, Knowledge Base, Template Marketplace are all deferred to later phases per their P1/P2 marking.

**GTM:** content- and community-led (`03_Market_Research.md §3.3`) — building in public, Indie Hackers, Product Hunt launch, X/Twitter build threads. No outbound sales motion at this phase.

## 27.2 Phase 2 — Expand (Team Collaboration)

**Trigger to begin:** Phase 1 wedge metric shows consistent improvement in correction-cycle reduction for solo users, and a meaningful share of signups already represent 2+ person teams (per the segment-mix tracking in `03_Market_Research.md §3.4`).

| Deliverable | Source requirements |
|---|---|
| Workspace + full Collaboration (roles, comments anchored to artifact versions) | `10_Information_Architecture.md §10.4`, `06_Product_Requirements.md §6.4` P1 rows |
| AI Reviewer + AI Product Critic surfaced as user-facing features (already present internally as the automatic Reviewer pass, `14_AI_Workflow.md §14.3`, but Critic becomes a polished on-demand UI feature here) | FR-211/212 |
| Team pricing tier | `26_Pricing.md §26.2` |
| Sprint Planner (P2 feature promoted based on Phase 2 team-usage demand) | Originally deferred in `06_Product_Requirements.md §6.4` |
| Analytics (internal usage dashboards feeding `28_KPI.md`, plus lightweight user-facing project health analytics) | `06_Product_Requirements.md §6.4` |

**GTM shift:** still primarily self-serve, but begins light-touch outbound to small funded startups (Aji persona, `05_User_Personas.md §5.3`) via founder communities and warm intros, since this segment has a real budget and shorter sales cycle than enterprise.

## 27.3 Phase 3 — Platform (Scale & Ecosystem)

**Trigger to begin:** Team tier retention and expansion (seat growth within existing workspaces) validate that collaboration features are genuinely load-bearing, not just nice-to-have.

| Deliverable | Source requirements |
|---|---|
| Template Marketplace (needs a critical mass of shipped Phase 1/2 projects to seed credibly, per `06_Product_Requirements.md §6.4` reasoning) | Vector DB search infra already present per `20_Tech_Stack.md §20.3` |
| Knowledge Base (self-serve support content) | `06_Product_Requirements.md §6.4` |
| AI Product Coach (explanatory mode — serves Sinta/student and Farhan/freelance secondary personas at scale) | `05_User_Personas.md §5.6` |
| Third-party MCP integrations beyond the guidance-only pattern in `16_Prompt_Workflow.md §16.4` — potential programmatic hand-off (the "future, Phase 2/3" pattern flagged in `16_Prompt_Workflow.md §16.5`) | `16_Prompt_Workflow.md §16.5` point 3 |
| Compliance track (SOC 2) if agency/enterprise GTM is pursued | `22_Security.md §22.8` |

**GTM shift:** agency partnerships, possible enterprise pilot programs — the first phase where a dedicated sales motion is justified.

## 27.4 Explicit Non-Goals Across All Phases

Carried forward from `06_Product_Requirements.md §6.5` and restated here because roadmap discipline requires periodically re-affirming what's out of scope, not just what's in:

- PARDI does not become a coding agent or a long-term PM/ticket-tracking tool at any phase (`02_Product_Strategy.md §2.7`).
- Real-time simultaneous multi-editor document editing is not committed to any specific phase above — it remains a candidate only if Phase 2 collaboration usage data specifically shows async comment/share is a genuine friction point, not built speculatively.

## 27.5 Risk Checkpoints

Each phase transition above is gated on a specific signal (stated in "Trigger to begin"), not a calendar date — this is deliberate given the risks identified in `29_Risk_Analysis.md`, particularly the risk that coding agents' own planning features could erode the wedge (Risk #1) before Phase 2 collaboration investment would pay off. Roadmap sequencing is revisited against that risk specifically at every phase gate, not assumed fixed at the time of writing.

## 27.6 Cross-References

- Feature priority source of truth → `06_Product_Requirements.md §6.4`
- KPIs that generate the "trigger to begin" signals → `28_KPI.md`
- Risks that could reorder this sequencing → `29_Risk_Analysis.md`
